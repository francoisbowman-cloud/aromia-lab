import test from "node:test";
import assert from "node:assert/strict";
import { basename } from "node:path";
import {
  DEFAULT_EXPANSION_BATCH,
  normalizeBatchId,
  expansionDir,
  preparedBatchFilename,
  candidatePoolPaths,
  importedBatchPaths,
} from "../expansion-context.mjs";

test("multi-batch context preserves batch-003 default", () => {
  assert.equal(normalizeBatchId(), DEFAULT_EXPANSION_BATCH);
  assert.match(expansionDir(), /catalog[\\/]expansion[\\/]batch-003$/);
  assert.equal(preparedBatchFilename(), "batch-003-prepared.csv");
});

test("explicit batch ids produce isolated output names", () => {
  assert.equal(normalizeBatchId("batch-004"), "batch-004");
  assert.match(expansionDir("batch-042"), /catalog[\\/]expansion[\\/]batch-042$/);
  assert.equal(preparedBatchFilename("batch-500"), "batch-500-prepared.csv");
});

test("batch id validation rejects traversal and malformed identifiers", () => {
  for (const value of ["../batch-004", "batch-4", "batch-0004", "batch-004/evil", "Batch-004", "batch-abc", ""]) {
    if (value === "") assert.equal(normalizeBatchId(value), DEFAULT_EXPANSION_BATCH);
    else assert.throws(() => normalizeBatchId(value), /Invalid expansion batch id/);
  }
});

test("batch-003 replay is frozen to its legacy candidate pools", () => {
  const files = candidatePoolPaths("batch-003").map(basename);
  assert.deepEqual(files, ["candidate-pool-v1a.csv", "candidate-pool-v1b.csv", "candidate-pool-v1c.csv"]);
});

test("future batches discover all governed candidate pools", () => {
  const files = candidatePoolPaths("batch-004").map(basename);
  assert.ok(files.includes("candidate-pool-v1a.csv"));
  assert.ok(files.includes("candidate-pool-v1b.csv"));
  assert.ok(files.includes("candidate-pool-v1c.csv"));
  assert.ok(files.includes("candidate-pool-v2.csv"));
  assert.deepEqual(files, [...files].sort((a, b) => a.localeCompare(b)));
});

test("known universe includes only imports older than the batch being prepared", () => {
  const batch003 = importedBatchPaths("batch-003").map(basename);
  const batch004 = importedBatchPaths("batch-004").map(basename);
  assert.deepEqual(batch003, ["batch-001.csv", "batch-002.csv"]);
  assert.ok(batch004.includes("batch-001.csv"));
  assert.ok(batch004.includes("batch-002.csv"));
  assert.ok(batch004.includes("batch-003.csv"));
  assert.ok(!batch004.includes("batch-004.csv"));
});
