import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { parse as parseCsv } from "csv-parse/sync";
import { stringify as stringifyCsv } from "csv-stringify/sync";
import { REPO_ROOT } from "./lib.mjs";
import { harvestCandidate, identityEvidence, mapConcurrent, summarizeHarvest } from "./expansion-harvest.mjs";
import { extractPageEvidence } from "./structured-extractor.mjs";
import { publicationMetadata } from "./commerce-enrichment.mjs";

const BATCHES = [
  ["batch-001", join(REPO_ROOT, "catalog", "staging", "batch-001-remediated.normalized.csv")],
  ["batch-002", join(REPO_ROOT, "catalog", "staging", "batch-002.normalized.csv")],
];
const OUT_DIR = join(REPO_ROOT, "catalog", "expansion", "published-enrichment");
const NON_OFFICIAL = new Set(["fragrantica.com", "www.fragrantica.com", "amazon.com", "www.amazon.com"]);
const SECONDARY_IMAGE_HOSTS = ["fragrantica.com"];

function readCsv(path) { return parseCsv(readFileSync(path, "utf-8"), { columns: true, skip_empty_lines: true, relax_column_count: true }); }
function writeCsv(path, rows) { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, stringifyCsv(rows, { header: true }), "utf-8"); }
function hostOf(url) { try { return new URL(url).hostname.toLowerCase().replace(/^www\./, ""); } catch { return ""; } }
function urlsOf(value) { return String(value ?? "").split(";").map((s) => s.trim()).filter(Boolean); }
function officialUrlFromRow(row) {
  return urlsOf(row.source_url).find((url) => {
    const host = hostOf(url);
    return host && !NON_OFFICIAL.has(host) && !host.endsWith("fragrantica.com");
  }) || "";
}
function pending(value) { const s = String(value ?? "").trim().toLowerCase(); return !s || s === "pending" || s === "not-audited" || s === "no-applicable"; }
function mergeIfPending(current, replacement) { return pending(current) && String(replacement ?? "").trim() ? replacement : current; }
function isSecondaryImageUrl(url) { const host = hostOf(url); return SECONDARY_IMAGE_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`)); }

function brandDomainMap() {
  const map = new Map();
  for (const file of ["candidate-pool-v1a.csv", "candidate-pool-v1b.csv", "candidate-pool-v1c.csv"]) {
    const path = join(REPO_ROOT, "catalog", "expansion", file);
    if (!existsSync(path)) continue;
    for (const row of readCsv(path)) if (row.brand && row.official_domain && !map.has(row.brand.toLowerCase())) map.set(row.brand.toLowerCase(), row.official_domain);
  }
  return map;
}

function toCandidate(row, domains) {
  const officialUrl = officialUrlFromRow(row);
  const officialDomain = hostOf(officialUrl) || domains.get(String(row.brand).toLowerCase()) || "";
  return {
    candidate_id: row.slug,
    brand: row.brand,
    name: row.name,
    concentration: row.concentration,
    official_domain: officialDomain,
    source_url: officialUrl || row.source_url || "",
    relation: "PUBLISHED",
  };
}

async function fetchText(url, timeoutMs = 9000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; AromiaCatalog/1.0; +https://aromialab.com)",
        accept: "text/html,application/xhtml+xml",
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { text: await response.text(), finalUrl: response.url || url };
  } finally { clearTimeout(timeout); }
}

async function fallbackImageFromKnownSources(sourceRow, candidate, harvested) {
  if (!pending(harvested.image_url)) return null;
  const candidates = [];
  for (const url of urlsOf(sourceRow.source_url)) {
    const host = hostOf(url);
    const official = candidate.official_domain && (host === candidate.official_domain || host.endsWith(`.${candidate.official_domain}`) || candidate.official_domain.endsWith(`.${host}`));
    if (official || isSecondaryImageUrl(url)) candidates.push({ url, provenance: official ? "official-known-source" : "verified-secondary-source" });
  }
  for (const item of candidates) {
    try {
      const page = await fetchText(item.url);
      const evidence = extractPageEvidence(page.text, page.finalUrl);
      const identity = identityEvidence(candidate, evidence, page.finalUrl);
      if (!identity.confirmed || !evidence.image_url) continue;
      return {
        image_url: evidence.image_url,
        image_source: page.finalUrl,
        image_provenance: item.provenance,
        identity_coverage: identity.coverage.toFixed(2),
      };
    } catch {}
  }
  return null;
}

function mergeRow(source, harvested, imageFallback, batch) {
  const row = { ...source };
  row.catalog_source = batch;
  row.description = mergeIfPending(row.description, harvested.description);
  row.gender = mergeIfPending(row.gender, harvested.gender);
  row.family = mergeIfPending(row.family, harvested.family);
  row.launch_year = mergeIfPending(row.launch_year, harvested.launch_year);
  row.perfumer = mergeIfPending(row.perfumer, harvested.perfumer);
  row.top_notes = mergeIfPending(row.top_notes, harvested.top_notes);
  row.middle_notes = mergeIfPending(row.middle_notes, harvested.middle_notes);
  row.base_notes = mergeIfPending(row.base_notes, harvested.base_notes);
  row.accords = mergeIfPending(row.accords, harvested.accords);
  row.image_url = mergeIfPending(row.image_url, harvested.image_url || imageFallback?.image_url);
  row.image_source = mergeIfPending(row.image_source, harvested.image_source || imageFallback?.image_source);

  const commerce = publicationMetadata(row);
  row.amazon_url = mergeIfPending(row.amazon_url, commerce.amazon_url);
  row.affiliate_status = mergeIfPending(row.affiliate_status, commerce.affiliate_status);
  row.visual_quality = mergeIfPending(row.visual_quality, row.image_url && !pending(row.image_url) ? "medium" : commerce.visual_quality);
  row.seo_title = mergeIfPending(row.seo_title, harvested.seo_title || commerce.seo_title);
  row.seo_description = mergeIfPending(row.seo_description, harvested.seo_description || commerce.seo_description);
  if (harvested.source_url) row.source_url = [...new Set([...urlsOf(row.source_url), harvested.source_url])].join(";");
  row.enrichment_harvest_status = harvested.harvest_status;
  row.enrichment_identity_confirmed = harvested.identity_confirmed;
  row.enrichment_official_source = harvested.official_source;
  row.enrichment_discovery_method = harvested.discovery_method || "";
  row.enrichment_image_provenance = harvested.image_url ? "official-harvest" : imageFallback?.image_provenance || "";
  row.enrichment_error = harvested.error || "";
  return row;
}

function completeness(rows) {
  const fields = ["description","gender","family","launch_year","perfumer","top_notes","middle_notes","base_notes","accords","image_url","image_source","amazon_url","seo_title","seo_description"];
  const fieldCounts = Object.fromEntries(fields.map((f) => [f, rows.filter((r) => !pending(r[f])).length]));
  return {
    total: rows.length,
    field_counts: fieldCounts,
    image_complete: rows.filter((r) => !pending(r.image_url)).length,
    commercial_link_complete: rows.filter((r) => !pending(r.amazon_url)).length,
    editorial_complete: rows.filter((r) => !pending(r.description) && !pending(r.seo_title) && !pending(r.seo_description)).length,
    visible_core_complete: rows.filter((r) => !pending(r.description) && !pending(r.gender) && !pending(r.family) && !pending(r.image_url)).length,
  };
}

const domains = brandDomainMap();
const source = BATCHES.flatMap(([batch, path]) => readCsv(path).map((row) => ({ batch, row })));
if (source.length !== 75) throw new Error(`Expected 75 published source rows, got ${source.length}`);
const candidates = source.map(({ row }) => toCandidate(row, domains));
const noDomain = candidates.filter((c) => !c.official_domain).map((c) => c.candidate_id);
console.log(`[published-enrichment] rows=75 candidates_with_domain=${75-noDomain.length} without_domain=${noDomain.length}`);
const harvested = await mapConcurrent(candidates, Number(process.env.AROMIA_HARVEST_CONCURRENCY || 6), (candidate) => harvestCandidate(candidate), (done, total, result, candidate) => {
  if (done === 1 || done % 10 === 0 || done === total) console.log(`[published-enrichment] ${done}/${total} ${candidate.candidate_id}:${result.harvest_status}`);
});
const imageFallbacks = await mapConcurrent(source, 6, ({ row }, i) => fallbackImageFromKnownSources(row, candidates[i], harvested[i]), (done, total) => {
  if (done === 1 || done % 10 === 0 || done === total) console.log(`[published-image-fallback] ${done}/${total}`);
});
const merged = source.map(({ batch, row }, i) => mergeRow(row, harvested[i], imageFallbacks[i], batch));
mkdirSync(OUT_DIR, { recursive: true });
writeCsv(join(OUT_DIR, "published-75-enriched.csv"), merged);
writeCsv(join(OUT_DIR, "published-75-harvest.csv"), harvested);
writeCsv(join(OUT_DIR, "published-75-image-fallbacks.csv"), source.map(({ row }, i) => ({ slug: row.slug, ...(imageFallbacks[i] || {}) })));
const report = {
  generated_at: new Date().toISOString(),
  production_write: false,
  source_rows: 75,
  candidates_without_official_domain: noDomain,
  harvest: summarizeHarvest(harvested),
  image_fallbacks_recovered: imageFallbacks.filter(Boolean).length,
  completeness: completeness(merged),
};
writeFileSync(join(OUT_DIR, "published-75-enrichment-report.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
