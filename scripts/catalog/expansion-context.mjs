import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT } from "./lib.mjs";

export const DEFAULT_EXPANSION_BATCH = "batch-003";
const BATCH_PATTERN = /^batch-\d{3}$/;
const POOL_PATTERN = /^candidate-pool-.*\.csv$/;
const IMPORT_PATTERN = /^batch-\d{3}\.csv$/;

export function normalizeBatchId(value = DEFAULT_EXPANSION_BATCH) {
  const batchId = String(value || DEFAULT_EXPANSION_BATCH).trim();
  if (!BATCH_PATTERN.test(batchId)) throw new Error(`Invalid expansion batch id: ${batchId}`);
  return batchId;
}

export function expansionDir(batchId = DEFAULT_EXPANSION_BATCH) {
  return join(REPO_ROOT, "catalog", "expansion", normalizeBatchId(batchId));
}

export function preparedBatchFilename(batchId = DEFAULT_EXPANSION_BATCH) {
  return `${normalizeBatchId(batchId)}-prepared.csv`;
}

function sortedMatchingFiles(dir, pattern) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && pattern.test(entry.name))
    .map((entry) => join(dir, entry.name))
    .sort((a, b) => a.localeCompare(b));
}

export function candidatePoolPaths() {
  return sortedMatchingFiles(join(REPO_ROOT, "catalog", "expansion"), POOL_PATTERN);
}

export function importedBatchPaths() {
  return sortedMatchingFiles(join(REPO_ROOT, "catalog", "imports"), IMPORT_PATTERN);
}

export function resolveBatchId(argv = process.argv, env = process.env) {
  return normalizeBatchId(env.AROMIA_EXPANSION_BATCH || argv[3] || DEFAULT_EXPANSION_BATCH);
}
