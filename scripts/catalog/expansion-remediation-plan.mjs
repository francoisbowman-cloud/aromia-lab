import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parse as parseCsv } from "csv-parse/sync";
import { stringify as stringifyCsv } from "csv-stringify/sync";
import { isMainModule } from "./lib.mjs";
import { DEFAULT_EXPANSION_BATCH, expansionDir, resolveBatchId } from "./expansion-context.mjs";

function bucket(evidence, review) {
  const error = String(evidence?.error ?? "");
  const reason = String(review?.quality_reason ?? "");
  if (reason.includes("gender")) return "SECONDARY_GENDER_EVIDENCE";
  if (error.includes("concentration_conflict")) return "CONCENTRATION_CONFLICT";
  if (error.includes("concentration_unverified")) return "CONCENTRATION_VERIFICATION";
  if (error.includes("HTTP 403")) return "OFFICIAL_ACCESS_BLOCKED";
  if (error.includes("identity_mismatch")) return "IDENTITY_REVIEW";
  if (evidence?.harvest_status === "NOT_FOUND") return "SOURCE_DISCOVERY_GAP";
  if (reason === "missing_provenance") return "SOURCE_DISCOVERY_GAP";
  return "OTHER_RESEARCH_GAP";
}

export function buildRemediationPlan(evidenceRows, reviewRows) {
  const evidenceById = new Map(evidenceRows.map((row) => [row.candidate_id, row]));
  const queue = reviewRows.map((review) => {
    const evidence = evidenceById.get(review.candidate_id) ?? {};
    const remediationBucket = bucket(evidence, review);
    return {
      candidate_id: review.candidate_id, brand: review.brand, name: review.name,
      expected_concentration: review.concentration || "pending", bucket: remediationBucket,
      quality_reason: review.quality_reason, harvest_status: evidence.harvest_status || "unknown",
      official_domain: evidence.official_domain || "", source_url: review.source_url || evidence.source_url || "",
      concentration_review: evidence.concentration_review || "", error: String(evidence.error ?? "").slice(0, 700),
      next_action: remediationBucket === "SECONDARY_GENDER_EVIDENCE"
        ? "Research trusted secondary source for explicit audience/gender; preserve provenance."
        : remediationBucket === "CONCENTRATION_CONFLICT"
          ? "Resolve candidate identity/concentration conflict; do not deduplicate destructively."
          : remediationBucket === "CONCENTRATION_VERIFICATION"
            ? "Confirm concentration from official or trusted secondary evidence."
            : "Discover a verifiable official or trusted secondary product source; then rerun enrichment.",
    };
  });
  const counts = {}; for (const row of queue) counts[row.bucket] = (counts[row.bucket] ?? 0) + 1;
  return { queue, report: { total_review_required: queue.length, buckets: counts, production_write: false, recommended_mode: "batch remediation by bucket, not row-by-row manual catalog construction" } };
}

export function runRemediationPlan({ batchId = DEFAULT_EXPANSION_BATCH } = {}) {
  const dir = expansionDir(batchId);
  const evidencePath = join(dir, "evidence.auto.csv"); const reviewPath = join(dir, "review-required.csv");
  if (!existsSync(evidencePath) || !existsSync(reviewPath)) return { skipped: true, reason: "evidence/review artifacts missing", batch_id: batchId };
  const evidence = parseCsv(readFileSync(evidencePath, "utf-8"), { columns: true, skip_empty_lines: true, relax_column_count: true });
  const review = parseCsv(readFileSync(reviewPath, "utf-8"), { columns: true, skip_empty_lines: true, relax_column_count: true });
  const { queue, report } = buildRemediationPlan(evidence, review);
  writeFileSync(join(dir, "remediation-queue.csv"), stringifyCsv(queue, { header: true }), "utf-8");
  const output = { batch_id: batchId, ...report };
  writeFileSync(join(dir, "remediation-report.json"), JSON.stringify(output, null, 2) + "\n", "utf-8");
  return output;
}

if (isMainModule(import.meta.url)) console.log(JSON.stringify(runRemediationPlan({ batchId: resolveBatchId() }), null, 2));
