import test from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { loadBatchDefinition, normalizeBatchId } from "./catalogBatchImportContract";

const REPO_ROOT = resolve(process.cwd(), "../..");

test("batch id rejects traversal and malformed ids", () => {
  for (const value of ["../batch-003", "batch-3", "batch-0003", "Batch-003", "batch-003/evil", ""]) {
    assert.throws(() => normalizeBatchId(value), /invalid catalog batch id/);
  }
});

test("accepted Batch 003 manifest validates the pinned artifact", () => {
  const definition = loadBatchDefinition("batch-003", REPO_ROOT);
  assert.equal(definition.batchId, "batch-003");
  assert.equal(definition.rows.length, 10);
  assert.equal(definition.manifest.expected_rows, 10);
  assert.equal(definition.sha256, "e97833db0a7555c67cd7a84342fdca844efc1ae876fcdeabfa4512611a2ad32b");
  assert.equal(new Set(definition.slugs).size, 10);
});

test("artifact tampering fails closed before any database access", () => {
  const root = mkdtempSync(join(tmpdir(), "aromia-import-contract-"));
  try {
    const csvTarget = join(root, "catalog/imports/batch-003.csv");
    const manifestTarget = join(root, "catalog/imports/batch-003.manifest.json");
    mkdirSync(dirname(csvTarget), { recursive: true });
    cpSync(join(REPO_ROOT, "catalog/imports/batch-003.csv"), csvTarget);
    cpSync(join(REPO_ROOT, "catalog/imports/batch-003.manifest.json"), manifestTarget);
    writeFileSync(csvTarget, readFileSync(csvTarget, "utf-8") + "\n", "utf-8");
    assert.throws(() => loadBatchDefinition("batch-003", root), /artifact hash mismatch/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
