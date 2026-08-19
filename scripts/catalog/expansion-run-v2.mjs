import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { stringify as stringifyCsv } from "csv-stringify/sync";
import { REPO_ROOT, isMainModule } from "./lib.mjs";
import { readCsv, buildKnownUniverse, selectCandidates, buildDiscoveryTask } from "./expansion-engine.mjs";
import { analyzeCatalogGaps, serializableGapReport } from "./expansion-gap-analyzer.mjs";
import { candidatePoolPaths, importedBatchPaths, expansionDir, DEFAULT_EXPANSION_BATCH, resolveBatchId } from "./expansion-context.mjs";

function safeRead(path) { return existsSync(path) ? readCsv(path) : []; }
function writeCsv(path, rows) { writeFileSync(path, stringifyCsv(rows, { header: true }), "utf-8"); }

export function runExpansionV2({ limit = 100, batchId = DEFAULT_EXPANSION_BATCH } = {}) {
  const currentPath = join(REPO_ROOT, "PERFUMES_INITIAL_50.csv");
  const masterPath = join(REPO_ROOT, "catalog", "aromia-catalog-master.csv");
  const poolPaths = candidatePoolPaths(batchId);
  const importPaths = importedBatchPaths(batchId);
  const currentRows = safeRead(currentPath);
  const batchRows = importPaths.flatMap(safeRead);
  const masterRows = safeRead(masterPath);
  const knownRows = [...currentRows, ...batchRows, ...masterRows];
  const poolRows = poolPaths.flatMap(readCsv);
  const universe = buildKnownUniverse({ currentRows, batchRows, masterRows });
  const gapAnalysis = analyzeCatalogGaps(knownRows);
  const { selected, evaluated } = selectCandidates(poolRows, universe, { limit, gapAnalysis });
  const discovery = selected.map(buildDiscoveryTask);
  const outputDir = expansionDir(batchId);
  mkdirSync(outputDir, { recursive: true });
  writeCsv(join(outputDir, "candidate-manifest.csv"), selected.map(({ _index, ...row }) => row));
  writeCsv(join(outputDir, "source-discovery-queue.csv"), discovery);
  writeCsv(join(outputDir, "excluded-candidates.csv"), evaluated.filter((row) => row.state === "BLOCKED").map(({ _index, ...r }) => r));
  writeFileSync(join(outputDir, "gap-report.json"), JSON.stringify(serializableGapReport(gapAnalysis), null, 2) + "\n", "utf-8");
  const report = {
    version: "expansion-automation-v2-multibatch", batch_id: batchId, generated_at: new Date().toISOString(),
    requested_limit: limit, candidate_pool_size: poolRows.length, candidate_pool_files: poolPaths.map((path) => basename(path)),
    imported_batch_files: importPaths.map((path) => basename(path)), selected: selected.length,
    selected_candidate_ids: selected.map((row) => row.candidate_id),
    known_universe: { exact_identities: universe.exact.size, family_identities: universe.family.size, rows_analyzed: knownRows.length },
    gap_aware_scoring: true,
    guardrails: { writes_postgres: false, mutates_raw_inputs: false, master_import: false },
    next_gate: "source discovery + structured extraction; AUTO_READY applies to enriched rows only",
  };
  writeFileSync(join(outputDir, "selection-report.json"), JSON.stringify(report, null, 2) + "\n", "utf-8");
  return { selected, discovery, evaluated, report, gapAnalysis };
}

if (isMainModule(import.meta.url)) {
  const batchId = resolveBatchId();
  console.log(JSON.stringify(runExpansionV2({ limit: Number(process.argv[2] || 100), batchId }).report, null, 2));
}
