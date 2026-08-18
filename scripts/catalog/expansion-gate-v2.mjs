import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseCsv } from "csv-parse/sync";
import { REPO_ROOT, isMainModule } from "./lib.mjs";

export const EXPANSION_GATE_V2 = Object.freeze({
  minRows: 100,
  minPreparedRows: 10,
  automationTargetMinYield: 0.90,
  automationTargetMaxHumanReviewBurden: 0.10,
  maxBlockedRate: 0.03,
  maxDestructiveDuplicates: 0,
  maxModelRequirementGaps: 0,
});

export function evaluateExpansionGateV2(report, diagnostics = {}, thresholds = EXPANSION_GATE_V2) {
  const total = Math.max(Number(report.total ?? 0), 1);
  const autoReady = Number(report.auto_ready ?? 0);
  const reviewRequired = Number(report.review_required ?? 0);
  const blocked = Number(report.blocked ?? 0);
  const preparedRows = Number(diagnostics.prepared_rows ?? 0);

  // Hard release checks protect catalog integrity. Automation yield is deliberately
  // measured separately: low automation must create a remediation backlog, not
  // force safe AUTO_READY rows to be discarded with unresolved candidates.
  const checks = {
    row_count: Number(report.total ?? 0) >= thresholds.minRows,
    partition_integrity: autoReady + reviewRequired + blocked === Number(report.total ?? 0),
    prepared_batch_minimum: preparedRows >= thresholds.minPreparedRows,
    prepared_batch_matches_auto_ready: preparedRows === autoReady,
    prepared_batch_all_auto_ready: diagnostics.prepared_rows_all_auto_ready === true,
    prepared_batch_source_verified: diagnostics.prepared_rows_source_verified === true,
    prepared_batch_unique_ids: diagnostics.prepared_rows_unique_ids === true,
    blocked_rate: blocked / total <= thresholds.maxBlockedRate,
    destructive_duplicates: Number(diagnostics.destructive_duplicates ?? 0) <= thresholds.maxDestructiveDuplicates,
    model_requirement_gaps: Number(diagnostics.model_requirement_gaps ?? 0) <= thresholds.maxModelRequirementGaps,
    protected_inputs_unchanged: diagnostics.protected_inputs_unchanged !== false,
    postgres_writes: Number(diagnostics.postgres_writes ?? 0) === 0,
  };
  const failed = Object.entries(checks).filter(([, pass]) => !pass).map(([name]) => name);

  const automation = {
    target_auto_preparation_yield: Number(report.auto_preparation_yield ?? 0) >= thresholds.automationTargetMinYield,
    target_human_review_burden: Number(report.human_review_burden ?? 1) <= thresholds.automationTargetMaxHumanReviewBurden,
  };

  return {
    decision: failed.length ? "NO_GO" : "GO",
    checks,
    failed,
    thresholds,
    automation,
    automation_target_met: Object.values(automation).every(Boolean),
    remediation_required: reviewRequired > 0,
    observability: {
      auto_ready: autoReady,
      review_required: reviewRequired,
      blocked,
      prepared_rows: preparedRows,
      auto_preparation_yield: report.auto_preparation_yield ?? null,
      human_review_burden: report.human_review_burden ?? null,
      publication_completion_yield: report.publication_completion_yield ?? null,
      image_completion_yield: report.image_completion_yield ?? null,
      affiliate_activation_yield: report.affiliate_activation_yield ?? null,
      publication_enrichment_is_blocking: false,
    },
  };
}

function preparedBatchDiagnostics(dir) {
  const path = join(dir, "batch-003-prepared.csv");
  if (!existsSync(path)) return {
    prepared_rows: 0,
    prepared_rows_all_auto_ready: false,
    prepared_rows_source_verified: false,
    prepared_rows_unique_ids: false,
  };
  const rows = parseCsv(readFileSync(path, "utf-8"), { columns: true, skip_empty_lines: true });
  const ids = rows.map((row) => String(row.id ?? "").trim()).filter(Boolean);
  return {
    prepared_rows: rows.length,
    prepared_rows_all_auto_ready: rows.length > 0 && rows.every((row) => row.quality_status === "AUTO_READY"),
    prepared_rows_source_verified: rows.length > 0 && rows.every((row) => String(row.source_verified).toLowerCase() === "true" && String(row.source_url ?? "").trim() && String(row.source_url).trim() !== "pending"),
    prepared_rows_unique_ids: ids.length === rows.length && new Set(ids).size === rows.length,
  };
}

export function runGateV2() {
  const dir = join(REPO_ROOT, "catalog", "expansion", "batch-003");
  const reportPath = join(dir, "enrichment-report.json");
  const diagnosticsPath = join(dir, "diagnostics.json");
  if (!existsSync(reportPath)) return { decision: "NOT_READY", reason: "enrichment-report.json not present" };
  const report = JSON.parse(readFileSync(reportPath, "utf-8"));
  const diagnostics = existsSync(diagnosticsPath) ? JSON.parse(readFileSync(diagnosticsPath, "utf-8")) : {};
  Object.assign(diagnostics, preparedBatchDiagnostics(dir));
  const result = evaluateExpansionGateV2(report, diagnostics);
  writeFileSync(join(dir, "go-no-go.json"), JSON.stringify(result, null, 2) + "\n", "utf-8");
  return result;
}

if (isMainModule(import.meta.url)) {
  const result = runGateV2(); console.log(JSON.stringify(result, null, 2));
  if (result.decision === "NO_GO") process.exitCode = 1;
}
