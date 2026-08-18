import test from "node:test";
import assert from "node:assert/strict";
import { evaluateExpansionGateV2 } from "../expansion-gate-v2.mjs";

const safeDiagnostics = {
  prepared_rows: 16,
  prepared_rows_all_auto_ready: true,
  prepared_rows_source_verified: true,
  prepared_rows_unique_ids: true,
  destructive_duplicates: 0,
  model_requirement_gaps: 0,
  protected_inputs_unchanged: true,
  postgres_writes: 0,
};

test("incremental AUTO_READY batch can GO while automation KPI remains below target", () => {
  const result = evaluateExpansionGateV2({
    total: 100,
    auto_ready: 16,
    review_required: 84,
    blocked: 0,
    auto_preparation_yield: 0.16,
    human_review_burden: 0.84,
  }, safeDiagnostics);
  assert.equal(result.decision, "GO");
  assert.equal(result.automation_target_met, false);
  assert.equal(result.remediation_required, true);
  assert.deepEqual(result.failed, []);
});

test("prepared batch cannot contain fewer or more rows than AUTO_READY partition", () => {
  const result = evaluateExpansionGateV2({
    total: 100,
    auto_ready: 16,
    review_required: 84,
    blocked: 0,
    auto_preparation_yield: 0.16,
    human_review_burden: 0.84,
  }, { ...safeDiagnostics, prepared_rows: 15 });
  assert.equal(result.decision, "NO_GO");
  assert.ok(result.failed.includes("prepared_batch_matches_auto_ready"));
});

test("unverified provenance remains a hard NO_GO", () => {
  const result = evaluateExpansionGateV2({
    total: 100,
    auto_ready: 16,
    review_required: 84,
    blocked: 0,
    auto_preparation_yield: 0.16,
    human_review_burden: 0.84,
  }, { ...safeDiagnostics, prepared_rows_source_verified: false });
  assert.equal(result.decision, "NO_GO");
  assert.ok(result.failed.includes("prepared_batch_source_verified"));
});

test("partition mismatch remains a hard NO_GO", () => {
  const result = evaluateExpansionGateV2({
    total: 100,
    auto_ready: 16,
    review_required: 80,
    blocked: 0,
    auto_preparation_yield: 0.16,
    human_review_burden: 0.80,
  }, safeDiagnostics);
  assert.equal(result.decision, "NO_GO");
  assert.ok(result.failed.includes("partition_integrity"));
});
