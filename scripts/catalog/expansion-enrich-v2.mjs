import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { parse as parseCsv } from "csv-parse/sync";
import { stringify as stringifyCsv } from "csv-stringify/sync";
import { REPO_ROOT, isMainModule } from "./lib.mjs";
import { clean, EXPANSION_STATES } from "./expansion-engine.mjs";
import { evidenceToDraft, resolveEvidencePath } from "./expansion-enrich.mjs";

function readCsv(path) { return parseCsv(readFileSync(path, "utf-8"), { columns: true, skip_empty_lines: true, relax_column_count: true }); }
function writeCsv(path, rows) { mkdirSync(dirname(path), { recursive: true }); if (!rows.length) { writeFileSync(path, "", "utf-8"); return; } writeFileSync(path, stringifyCsv(rows, { header: true }), "utf-8"); }

export function recalibrateCatalogReadiness(draft) {
  const publicationOnly = String(draft.quality_reason ?? "").startsWith("publication_metadata_missing:");
  if (!publicationOnly) return draft;
  return {
    ...draft,
    quality_status: EXPANSION_STATES.AUTO_READY,
    quality_reason: "catalog_confidence_gate_pass;publication_enrichment_pending",
  };
}

export function routeEvidenceV2(rows, options = {}) {
  const drafted = rows.map((row) => recalibrateCatalogReadiness(evidenceToDraft(row, options)));
  return {
    drafted,
    autoReady: drafted.filter((r) => r.quality_status === EXPANSION_STATES.AUTO_READY),
    reviewRequired: drafted.filter((r) => r.quality_status === EXPANSION_STATES.REVIEW_REQUIRED),
    blocked: drafted.filter((r) => r.quality_status === EXPANSION_STATES.BLOCKED),
  };
}

export function runEnrichmentV2(options = {}) {
  const dir = join(REPO_ROOT, "catalog", "expansion", "batch-003");
  const resolved = resolveEvidencePath(dir);
  if (!resolved) return { skipped: true, reason: "no evidence.csv or evidence.auto.csv present" };
  const routed = routeEvidenceV2(readCsv(resolved.path), options);
  writeCsv(join(dir, "auto-ready.csv"), routed.autoReady);
  writeCsv(join(dir, "review-required.csv"), routed.reviewRequired);
  writeCsv(join(dir, "blocked.csv"), routed.blocked);
  const total = routed.drafted.length;
  const reviewReasons = {};
  const penaltyCounts = {};
  for (const row of routed.reviewRequired) {
    reviewReasons[row.quality_reason] = (reviewReasons[row.quality_reason] ?? 0) + 1;
    for (const penalty of String(row.confidence_penalties ?? "").split(";").filter(Boolean)) penaltyCounts[penalty] = (penaltyCounts[penalty] ?? 0) + 1;
  }
  const publicationComplete = routed.drafted.filter((r) => r.publication_complete === "true").length;
  const imageComplete = routed.drafted.filter((r) => clean(r.image_url)).length;
  const affiliateActive = routed.drafted.filter((r) => r.affiliate_status === "active").length;
  const report = {
    evidence_source: resolved.source,
    readiness_contract: "catalog-v2",
    total,
    auto_ready: routed.autoReady.length,
    review_required: routed.reviewRequired.length,
    blocked: routed.blocked.length,
    auto_preparation_yield: total ? routed.autoReady.length / total : null,
    human_review_burden: total ? routed.reviewRequired.length / total : null,
    publication_complete: publicationComplete,
    publication_completion_yield: total ? publicationComplete / total : null,
    image_complete: imageComplete,
    image_completion_yield: total ? imageComplete / total : null,
    affiliate_active: affiliateActive,
    affiliate_activation_yield: total ? affiliateActive / total : null,
    affiliate_configuration_present: Boolean(options.associateTag ?? process.env.AROMIA_AMAZON_ASSOCIATE_TAG),
    publication_enrichment_is_blocking: false,
    review_reasons: reviewReasons,
    review_penalties: penaltyCounts,
  };
  writeFileSync(join(dir, "enrichment-report.json"), JSON.stringify(report, null, 2) + "\n", "utf-8");
  return report;
}

if (isMainModule(import.meta.url)) console.log(JSON.stringify(runEnrichmentV2(), null, 2));
