import test from "node:test";
import assert from "node:assert/strict";
import { evaluateExpansionGate } from "../expansion-gate.mjs";

test("GO when Batch 003 meets automation targets", () => {
  const result = evaluateExpansionGate(
    { total: 100, auto_preparation_yield: 0.95, human_review_burden: 0.05, blocked: 0 },
    { destructive_duplicates: 0, model_requirement_gaps: 0, protected_inputs_unchanged: true, postgres_writes: 0 },
  );
  assert.equal(result.decision, "GO");
  assert.deepEqual(result.failed, []);
});

test("NO_GO when human review burden exceeds 10%", () => {
  const result = evaluateExpansionGate(
    { total: 100, auto_preparation_yield: 0.88, human_review_burden: 0.12, blocked: 0 },
    { destructive_duplicates: 0, model_requirement_gaps: 0, protected_inputs_unchanged: true, postgres_writes: 0 },
  );
  assert.equal(result.decision, "NO_GO");
  assert.ok(result.failed.includes("auto_preparation_yield"));
  assert.ok(result.failed.includes("human_review_burden"));
});

test("NO_GO on any destructive duplicate or model requirement gap", () => {
  const result = evaluateExpansionGate(
    { total: 100, auto_preparation_yield: 0.97, human_review_burden: 0.02, blocked: 1 },
    { destructive_duplicates: 1, model_requirement_gaps: 1, protected_inputs_unchanged: true, postgres_writes: 0 },
  );
  assert.equal(result.decision, "NO_GO");
  assert.ok(result.failed.includes("destructive_duplicates"));
  assert.ok(result.failed.includes("model_requirement_gaps"));
});
