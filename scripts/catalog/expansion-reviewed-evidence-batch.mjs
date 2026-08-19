import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parse as parseCsv } from "csv-parse/sync";
import { stringify as stringifyCsv } from "csv-stringify/sync";
import { REPO_ROOT, isMainModule } from "./lib.mjs";
import { applyReviewedEvidence } from "./expansion-reviewed-evidence.mjs";
import { DEFAULT_EXPANSION_BATCH, expansionDir, resolveBatchId } from "./expansion-context.mjs";

function readCsv(path) { return parseCsv(readFileSync(path, "utf-8"), { columns: true, skip_empty_lines: true, relax_column_count: false, trim: true }); }

function reviewedPatchPath(batchId, dir) {
  const local = join(dir, "reviewed-evidence.csv");
  if (existsSync(local)) return local;
  if (batchId === DEFAULT_EXPANSION_BATCH) {
    const legacy = join(REPO_ROOT, "catalog", "expansion", "reviewed-evidence.csv");
    if (existsSync(legacy)) return legacy;
  }
  return null;
}

export function runReviewedEvidenceBatch({ batchId = DEFAULT_EXPANSION_BATCH } = {}) {
  const dir = expansionDir(batchId);
  const evidencePath = join(dir, "evidence.auto.csv");
  const manifestPath = join(dir, "candidate-manifest.csv");
  const patchPath = reviewedPatchPath(batchId, dir);
  const secondaryMapPath = join(REPO_ROOT, "catalog", "expansion", "secondary-source-map.csv");
  if (!existsSync(evidencePath) || !existsSync(manifestPath) || !patchPath) return { skipped: true, reason: "evidence.auto.csv, manifest, or batch reviewed-evidence.csv missing", batch_id: batchId };

  const result = applyReviewedEvidence(
    readCsv(evidencePath), readCsv(manifestPath), readCsv(patchPath), existsSync(secondaryMapPath) ? readCsv(secondaryMapPath) : [],
  );
  const output = join(dir, "evidence.csv");
  writeFileSync(output, stringifyCsv(result.rows, { header: true }), "utf-8");
  const coverages = result.audit.flatMap((row) => [row.identity_coverage, row.supplemental_identity_coverage]).filter((value) => value !== null);
  const report = {
    contract: "reviewed-evidence-v1", batch_id: batchId, patches: result.audit.length,
    candidates: result.audit.map((row) => row.candidate_id),
    official_sources: result.audit.filter((row) => row.source_kind === "official").length,
    trusted_secondary_sources: result.audit.filter((row) => row.source_kind === "trusted_secondary").length,
    supplemental_trusted_secondary_sources: result.audit.filter((row) => row.supplemental_secondary).length,
    source_replacements: result.audit.filter((row) => row.source_mode === "replace").length,
    cleared_fields: result.audit.flatMap((row) => row.touched).filter((field) => field.startsWith("clear:")).length,
    min_source_identity_coverage: coverages.length ? Math.min(...coverages) : null,
    production_write: false, mutates_raw_inputs: false,
    output: `catalog/expansion/${batchId}/evidence.csv`,
  };
  writeFileSync(join(dir, "reviewed-evidence-report.json"), JSON.stringify(report, null, 2) + "\n", "utf-8"); return report;
}

if (isMainModule(import.meta.url)) {
  try { console.log(JSON.stringify(runReviewedEvidenceBatch({ batchId: resolveBatchId() }), null, 2)); }
  catch (error) { console.error(error); process.exitCode = 1; }
}
