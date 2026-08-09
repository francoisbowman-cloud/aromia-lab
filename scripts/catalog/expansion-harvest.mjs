import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { parse as parseCsv } from "csv-parse/sync";
import { stringify as stringifyCsv } from "csv-stringify/sync";
import { REPO_ROOT, isMainModule, normalizeConcentration } from "./lib.mjs";
import { discoverOfficialUrls, fetchOfficialPage, tokenizeIdentity } from "./source-discovery.mjs";
import { extractPageEvidence } from "./structured-extractor.mjs";
import { publicationMetadata } from "./commerce-enrichment.mjs";

const DEFAULT_CONCURRENCY = 6;

function readCsv(path) { return parseCsv(readFileSync(path, "utf-8"), { columns: true, skip_empty_lines: true, relax_column_count: true }); }
function writeCsv(path, rows) { mkdirSync(dirname(path), { recursive: true }); if (!rows.length) { writeFileSync(path, "", "utf-8"); return; } writeFileSync(path, stringifyCsv(rows, { header: true }), "utf-8"); }
function canonicalConcentration(value) { return normalizeConcentration(String(value ?? "")).value.toLowerCase(); }
function fold(value) { return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }

export function identityEvidence(candidate, evidence, pageUrl) {
  const identityText = fold(`${pageUrl} ${evidence.title} ${evidence.structured_product_name}`);
  const nameTokens = tokenizeIdentity(candidate);
  const hits = nameTokens.filter((t) => identityText.includes(t));
  const coverage = nameTokens.length ? hits.length / nameTokens.length : 0;
  return { confirmed: nameTokens.length > 0 && coverage >= 0.6, coverage, hits, tokens: nameTokens };
}

export async function harvestCandidate(candidate, options = {}) {
  const discovered = await discoverOfficialUrls(candidate, options);
  const base = {
    candidate_id: candidate.candidate_id, brand: candidate.brand, name: candidate.name,
    concentration: "", gender: "", family: "", launch_year: "", perfumer: "", country: "", description: "",
    official_domain: candidate.official_domain, catalog_relation: candidate.relation || "NEW",
    identity_confirmed: "false", official_source: "false", source_does_not_publish_notes: "false",
    source_url: "", top_notes: "", middle_notes: "", base_notes: "", accords: "", notes_structure: "UNKNOWN",
    image_url: "", image_source: "", amazon_url: "", affiliate_status: "pending", visual_quality: "not-audited",
    seo_title: "", seo_description: "",
  };
  if (discovered.status !== "FOUND") return { ...base, harvest_status: discovered.status, discovery_scanned_urls: discovered.scannedUrlCount ?? 0, error: "" };

  const errors = [];
  for (const hit of discovered.urls) {
    try {
      const page = await fetchOfficialPage(hit.url, candidate.official_domain, options);
      const evidence = extractPageEvidence(page.text, page.finalUrl);
      const identity = identityEvidence(candidate, evidence, page.finalUrl);
      if (!identity.confirmed) { errors.push(`identity_mismatch:${identity.coverage.toFixed(2)}:${hit.url}`); continue; }

      const expectedConcentration = canonicalConcentration(candidate.concentration);
      const extractedConcentration = canonicalConcentration(evidence.concentration);
      if (!extractedConcentration) { errors.push(`concentration_unverified:${hit.url}`); continue; }
      if (expectedConcentration && extractedConcentration !== expectedConcentration) { errors.push(`concentration_conflict:${candidate.concentration}->${evidence.concentration}:${hit.url}`); continue; }

      const publication = publicationMetadata({ ...candidate, ...evidence, brand: candidate.brand, name: candidate.name, concentration: evidence.concentration });
      return {
        ...base,
        concentration: evidence.concentration,
        gender: evidence.gender,
        family: evidence.family,
        launch_year: evidence.launch_year,
        perfumer: evidence.perfumer,
        description: publication.description,
        harvest_status: "HARVESTED", source_url: evidence.source_url,
        identity_confirmed: "true", official_source: "true",
        top_notes: evidence.top_notes, middle_notes: evidence.middle_notes, base_notes: evidence.base_notes, accords: evidence.accords,
        notes_structure: evidence.notes_structure, page_title: evidence.title, page_description: evidence.description,
        image_url: publication.image_url, image_source: publication.image_source,
        amazon_url: publication.amazon_url, affiliate_status: publication.affiliate_status, visual_quality: publication.visual_quality,
        seo_title: publication.seo_title, seo_description: publication.seo_description,
        structured_product_name: evidence.structured_product_name, structured_brand: evidence.structured_brand,
        evidence_method: evidence.evidence_method, identity_token_coverage: identity.coverage.toFixed(2), discovery_score: hit.score,
        discovery_scanned_urls: discovered.scannedUrlCount ?? 0, error: "",
      };
    } catch (error) { errors.push(`${hit.url}:${error.message}`); }
  }
  return { ...base, harvest_status: "FETCH_FAILED", discovery_scanned_urls: discovered.scannedUrlCount ?? 0, error: errors.join(" | ").slice(0, 1400) };
}

export async function mapConcurrent(items, limit, fn, onProgress = null) {
  const results = new Array(items.length); let cursor = 0; let completed = 0;
  async function worker() {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      results[index] = await fn(items[index], index);
      completed += 1;
      onProgress?.(completed, items.length, results[index], items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, Math.min(limit, items.length || 1)) }, worker));
  return results;
}

function failureCause(row) {
  if (row.harvest_status === "NOT_FOUND") return "not_found_in_official_discovery";
  if (row.harvest_status === "NO_OFFICIAL_DOMAIN") return "no_official_domain";
  const e = String(row.error ?? "");
  if (e.includes("concentration_unverified")) return "concentration_unverified";
  if (e.includes("concentration_conflict")) return "concentration_conflict";
  if (e.includes("identity_mismatch")) return "identity_mismatch";
  if (/HTTP 404/.test(e)) return "http_404";
  if (/HTTP 403/.test(e)) return "http_403";
  if (/HTTP 429/.test(e)) return "http_429";
  if (/abort|timeout/i.test(e)) return "timeout";
  if (/Redirect left official domain|Refusing non-official host/.test(e)) return "host_guard";
  return row.harvest_status === "HARVESTED" ? "harvested" : "other_fetch_failure";
}

export function summarizeHarvest(rows) {
  const counts = {}; for (const row of rows) counts[row.harvest_status] = (counts[row.harvest_status] ?? 0) + 1;
  const causes = {}; for (const row of rows) { const cause = failureCause(row); causes[cause] = (causes[cause] ?? 0) + 1; }
  const harvested = rows.filter((r) => r.harvest_status === "HARVESTED");
  const explicitNotes = harvested.filter((r) => r.notes_structure && r.notes_structure !== "UNKNOWN");
  const criticalComplete = harvested.filter((r) => r.brand && r.name && r.concentration && r.gender);
  const withImages = harvested.filter((r) => r.image_url);
  const withDescriptions = harvested.filter((r) => r.description);
  const withCommerceLinks = harvested.filter((r) => r.amazon_url);
  return {
    total: rows.length, counts, failure_causes: causes,
    harvested: harvested.length, harvested_rate: rows.length ? harvested.length / rows.length : null,
    explicit_notes: explicitNotes.length, explicit_notes_rate: rows.length ? explicitNotes.length / rows.length : null,
    critical_complete: criticalComplete.length, critical_complete_rate: rows.length ? criticalComplete.length / rows.length : null,
    image_complete: withImages.length, image_complete_rate: rows.length ? withImages.length / rows.length : null,
    description_complete: withDescriptions.length, description_complete_rate: rows.length ? withDescriptions.length / rows.length : null,
    commerce_link_complete: withCommerceLinks.length, commerce_link_complete_rate: rows.length ? withCommerceLinks.length / rows.length : null,
  };
}

export async function runHarvest({ concurrency = DEFAULT_CONCURRENCY, limit = 100, options = {} } = {}) {
  const dir = join(REPO_ROOT, "catalog", "expansion", "batch-003");
  const manifestPath = join(dir, "candidate-manifest.csv");
  if (!existsSync(manifestPath)) return { skipped: true, reason: "candidate-manifest.csv not present; run npm run expand first" };
  const candidates = readCsv(manifestPath).slice(0, limit);
  const rows = await mapConcurrent(candidates, concurrency, (candidate) => harvestCandidate(candidate, options), (completed, total, row, candidate) => {
    if (completed === 1 || completed % 10 === 0 || completed === total) console.log(`[harvest] ${completed}/${total} latest=${candidate.candidate_id}:${row.harvest_status}`);
  });
  writeCsv(join(dir, "harvest-results.csv"), rows);
  writeCsv(join(dir, "evidence.auto.csv"), rows);
  const report = summarizeHarvest(rows);
  writeFileSync(join(dir, "harvest-report.json"), JSON.stringify(report, null, 2) + "\n", "utf-8");
  return report;
}

if (isMainModule(import.meta.url)) {
  runHarvest({ limit: Number(process.argv[2] || 100), concurrency: Number(process.env.AROMIA_HARVEST_CONCURRENCY || DEFAULT_CONCURRENCY) })
    .then((report) => console.log(JSON.stringify(report, null, 2)))
    .catch((error) => { console.error(error); process.exitCode = 1; });
}