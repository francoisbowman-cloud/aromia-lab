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

test("candidate pools are discovered rather than hardcoded", () => {
  const files = candidatePoolPaths().map(basename);
  assert.ok(files.includes("candidate-pool-v1a.csv"));
  assert.ok(files.includes("candidate-pool-v1b.csv"));
  assert.ok(files.includes("candidate-pool-v1c.csv"));
  assert.deepEqual(files, [...files].sort((a, b) => a.localeCompare(b)));
});

test("known-universe imports include batch-003 and remain future-compatible", () => {
  const files = importedBatchPaths().map(basename);
  assert.ok(files.includes("batch-001.csv"));
  assert.ok(files.includes("batch-002.csv"));
  assert.ok(files.includes("batch-003.csv"));
  assert.deepEqual(files, [...files].sort((a, b) => a.localeCompare(b)));
});
