import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT, isMainModule } from "./lib.mjs";

export const EXPANSION_GATE = Object.freeze({
  minRows: 100,
  minAutoPreparationYield: 0.90,
  maxHumanReviewBurden: 0.10,
  minPublicationCompletionYield: 0.90,
  minImageCompletionYield: 0.90,
  maxBlockedRate: 0.03,
  maxDestructiveDuplicates: 0,
  maxModelRequirementGaps: 0,
});

export function evaluateExpansionGate(report, diagnostics = {}, thresholds = EXPANSION_GATE) {
  const checks = {
    row_count: Number(report.total ?? 0) >= thresholds.minRows,
    auto_preparation_yield: Number(report.auto_preparation_yield ?? 0) >= thresholds.minAutoPreparationYield,
    human_review_burden: Number(report.human_review_burden ?? 1) <= thresholds.maxHumanReviewBurden,
    publication_completion_yield: Number(report.publication_completion_yield ?? 0) >= thresholds.minPublicationCompletionYield,
    image_completion_yield: Number(report.image_completion_yield ?? 0) >= thresholds.minImageCompletionYield,
    blocked_rate: Number(report.blocked ?? 0) / Math.max(Number(report.total ?? 0), 1) <= thresholds.maxBlockedRate,
    destructive_duplicates: Number(diagnostics.destructive_duplicates ?? 0) <= thresholds.maxDestructiveDuplicates,
    model_requirement_gaps: Number(diagnostics.model_requirement_gaps ?? 0) <= thresholds.maxModelRequirementGaps,
    protected_inputs_unchanged: diagnostics.protected_inputs_unchanged !== false,
    postgres_writes: Number(diagnostics.postgres_writes ?? 0) === 0,
  };
  const failed = Object.entries(checks).filter(([, pass]) => !pass).map(([name]) => name);
  return { decision: failed.length ? "NO_GO" : "GO", checks, failed, thresholds };
}

export function runGate() {
  const dir = join(REPO_ROOT, "catalog", "expansion", "batch-003");
  const reportPath = join(dir, "enrichment-report.json");
  const diagnosticsPath = join(dir, "diagnostics.json");
  if (!existsSync(reportPath)) return { decision: "NOT_READY", reason: "enrichment-report.json not present" };
  const report = JSON.parse(readFileSync(reportPath, "utf-8"));
  const diagnostics = existsSync(diagnosticsPath) ? JSON.parse(readFileSync(diagnosticsPath, "utf-8")) : {};
  const result = evaluateExpansionGate(report, diagnostics);
  writeFileSync(join(dir, "go-no-go.json"), JSON.stringify(result, null, 2) + "\n", "utf-8");
  return result;
}

if (isMainModule(import.meta.url)) {
  const result = runGate();
  console.log(JSON.stringify(result, null, 2));
  if (result.decision === "NO_GO") process.exitCode = 1;
}
