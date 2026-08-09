import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { parse as parseCsv } from "csv-parse/sync";
import { stringify as stringifyCsv } from "csv-stringify/sync";
import { REPO_ROOT, isMainModule } from "./lib.mjs";
import { discoverOfficialUrls, fetchOfficialPage } from "./source-discovery.mjs";
import { extractPageEvidence } from "./structured-extractor.mjs";

const DEFAULT_CONCURRENCY = 4;

function readCsv(path) { return parseCsv(readFileSync(path, "utf-8"), { columns: true, skip_empty_lines: true, relax_column_count: true }); }
function writeCsv(path, rows) { mkdirSync(dirname(path), { recursive: true }); if (!rows.length) { writeFileSync(path, "", "utf-8"); return; } writeFileSync(path, stringifyCsv(rows, { header: true }), "utf-8"); }

export async function harvestCandidate(candidate, options = {}) {
  const discovered = await discoverOfficialUrls(candidate, options);
  if (discovered.status !== "FOUND") {
    return { candidate_id: candidate.candidate_id, brand: candidate.brand, name: candidate.name, concentration: candidate.concentration, official_domain: candidate.official_domain, harvest_status: discovered.status, source_url: "", notes_structure: "UNKNOWN", discovery_scanned_urls: discovered.scannedUrlCount ?? 0, error: "" };
  }
  const errors = [];
  for (const hit of discovered.urls) {
    try {
      const page = await fetchOfficialPage(hit.url, candidate.official_domain, options);
      const evidence = extractPageEvidence(page.text, page.finalUrl);
      const identityText = `${evidence.title} ${evidence.structured_product_name}`.toLowerCase();
      const nameTokens = String(candidate.name ?? "").toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length >= 4);
      const identityHits = nameTokens.filter((t) => identityText.includes(t)).length;
      const identityConfirmed = nameTokens.length ? identityHits / nameTokens.length >= 0.5 : false;
      if (!identityConfirmed) { errors.push(`identity_mismatch:${hit.url}`); continue; }
      return {
        candidate_id: candidate.candidate_id, brand: candidate.brand, name: candidate.name, concentration: candidate.concentration,
        official_domain: candidate.official_domain, harvest_status: "HARVESTED", source_url: evidence.source_url,
        identity_confirmed: "true", official_source: "true", source_does_not_publish_notes: "false",
        top_notes: evidence.top_notes, middle_notes: evidence.middle_notes, base_notes: evidence.base_notes, accords: evidence.accords,
        notes_structure: evidence.notes_structure, page_title: evidence.title, page_description: evidence.description,
        structured_product_name: evidence.structured_product_name, structured_brand: evidence.structured_brand,
        evidence_method: evidence.evidence_method, discovery_score: hit.score, discovery_scanned_urls: discovered.scannedUrlCount ?? 0, error: "",
      };
    } catch (error) { errors.push(`${hit.url}:${error.message}`); }
  }
  return { candidate_id: candidate.candidate_id, brand: candidate.brand, name: candidate.name, concentration: candidate.concentration, official_domain: candidate.official_domain, harvest_status: "FETCH_FAILED", source_url: "", notes_structure: "UNKNOWN", discovery_scanned_urls: discovered.scannedUrlCount ?? 0, error: errors.join(" | ").slice(0, 1000) };
}

export async function mapConcurrent(items, limit, fn) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      results[index] = await fn(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, Math.min(limit, items.length || 1)) }, worker));
  return results;
}

export function summarizeHarvest(rows) {
  const counts = {};
  for (const row of rows) counts[row.harvest_status] = (counts[row.harvest_status] ?? 0) + 1;
  const harvested = rows.filter((r) => r.harvest_status === "HARVESTED");
  const explicitNotes = harvested.filter((r) => r.notes_structure && r.notes_structure !== "UNKNOWN");
  return { total: rows.length, counts, harvested: harvested.length, harvested_rate: rows.length ? harvested.length / rows.length : null, explicit_notes: explicitNotes.length, explicit_notes_rate: rows.length ? explicitNotes.length / rows.length : null };
}

export async function runHarvest({ concurrency = DEFAULT_CONCURRENCY, limit = 100, options = {} } = {}) {
  const dir = join(REPO_ROOT, "catalog", "expansion", "batch-003");
  const manifestPath = join(dir, "candidate-manifest.csv");
  if (!existsSync(manifestPath)) return { skipped: true, reason: "candidate-manifest.csv not present; run npm run expand first" };
  const candidates = readCsv(manifestPath).slice(0, limit);
  const rows = await mapConcurrent(candidates, concurrency, (candidate) => harvestCandidate(candidate, options));
  writeCsv(join(dir, "harvest-results.csv"), rows);
  const report = summarizeHarvest(rows);
  writeFileSync(join(dir, "harvest-report.json"), JSON.stringify(report, null, 2) + "\n", "utf-8");
  return report;
}

if (isMainModule(import.meta.url)) {
  runHarvest({ limit: Number(process.argv[2] || 100), concurrency: Number(process.env.AROMIA_HARVEST_CONCURRENCY || DEFAULT_CONCURRENCY) })
    .then((report) => console.log(JSON.stringify(report, null, 2)))
    .catch((error) => { console.error(error); process.exitCode = 1; });
}
