import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { parse as parseCsv } from "csv-parse/sync";
import { stringify as stringifyCsv } from "csv-stringify/sync";
import { REPO_ROOT, slugify, isMainModule } from "./lib.mjs";
import { BATCH003_COLUMNS } from "./expansion-batch-builder.mjs";

function pending(value) { return value === undefined || value === null || String(value).trim() === "" ? "pending" : String(value).trim(); }
function confidenceLabel(score) { const n = Number(score ?? 0); return n >= 0.9 ? "high" : n >= 0.75 ? "medium" : "low"; }

export function toCatalogBatchRowV2(row, date = new Date().toISOString().slice(0, 10)) {
  if (row.quality_status !== "AUTO_READY") throw new Error(`Only AUTO_READY rows can enter prepared batch: ${row.candidate_id || row.name || "unknown"}`);
  const id = pending(row.candidate_id); const brand = pending(row.brand); const name = pending(row.name); const concentration = pending(row.concentration);
  const slug = pending(row.slug) === "pending" ? slugify(`${brand} ${name} ${concentration}`) : row.slug;
  return {
    id, slug, brand, name, concentration, gender: pending(row.gender), family: pending(row.family), subfamily: pending(row.subfamily),
    launch_year: pending(row.launch_year), perfumer: pending(row.perfumer), country: pending(row.country), description: pending(row.description),
    top_notes: pending(row.top_notes), middle_notes: pending(row.middle_notes), base_notes: pending(row.base_notes), accords: pending(row.accords), notes_status: pending(row.notes_status),
    season: pending(row.season), occasion: pending(row.occasion), longevity: pending(row.longevity), sillage: pending(row.sillage), price_segment: pending(row.price_segment), price_status: pending(row.price_status),
    amazon_url: pending(row.amazon_url), source_url: pending(row.source_url), image_url: pending(row.image_url), image_source: pending(row.image_source), affiliate_status: pending(row.affiliate_status),
    source_verified: "true", data_confidence: confidenceLabel(row.overall_confidence), visual_quality: pending(row.visual_quality), review_status: "pending",
    seo_title: pending(row.seo_title), seo_description: pending(row.seo_description), status: "draft",
    notes: `Expansion Automation v2; quality_reason=${pending(row.quality_reason)}; confidence=${pending(row.overall_confidence)}; publication_complete=${pending(row.publication_complete)}; optional publication enrichment may remain pending; provenance preserved; no production write.`,
    created_at: date, updated_at: date, catalog_relation: pending(row.catalog_relation), quality_status: "AUTO_READY",
  };
}

function readCsv(path) { return parseCsv(readFileSync(path, "utf-8"), { columns: true, skip_empty_lines: true }); }
export function runBatchBuilderV2() {
  const dir = join(REPO_ROOT, "catalog", "expansion", "batch-003"); const input = join(dir, "auto-ready.csv");
  if (!existsSync(input)) return { skipped: true, reason: "auto-ready.csv not present" };
  const ids = new Set(); const rows = readCsv(input).map((row) => { const out = toCatalogBatchRowV2(row); if (ids.has(out.id)) throw new Error(`Duplicate trace id: ${out.id}`); ids.add(out.id); return out; });
  const output = join(dir, "batch-003-prepared.csv"); mkdirSync(dirname(output), { recursive: true }); writeFileSync(output, stringifyCsv(rows, { header: true, columns: BATCH003_COLUMNS }), "utf-8");
  return { rows: rows.length, output, production_write: false, master_import: false, publication_enrichment_optional: true };
}
if (isMainModule(import.meta.url)) console.log(JSON.stringify(runBatchBuilderV2(), null, 2));
