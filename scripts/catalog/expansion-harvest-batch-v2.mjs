import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { parse as parseCsv } from "csv-parse/sync";
import { stringify as stringifyCsv } from "csv-stringify/sync";
import { isMainModule } from "./lib.mjs";
import { harvestCandidateV2, mapConcurrent, summarizeHarvest } from "./expansion-harvest-v2.mjs";
import { DEFAULT_EXPANSION_BATCH, expansionDir, resolveBatchId } from "./expansion-context.mjs";

const DEFAULT_CONCURRENCY = 6;
function readCsv(path) { return parseCsv(readFileSync(path, "utf-8"), { columns: true, skip_empty_lines: true, relax_column_count: true }); }
function writeCsv(path, rows) { mkdirSync(dirname(path), { recursive: true }); if (!rows.length) { writeFileSync(path, "", "utf-8"); return; } writeFileSync(path, stringifyCsv(rows, { header: true }), "utf-8"); }

export async function runHarvestBatchV2({ concurrency = DEFAULT_CONCURRENCY, limit = 100, options = {}, batchId = DEFAULT_EXPANSION_BATCH } = {}) {
  const dir = expansionDir(batchId); const manifestPath = join(dir, "candidate-manifest.csv");
  if (!existsSync(manifestPath)) return { skipped: true, reason: "candidate-manifest.csv not present; run expand:v2 first", batch_id: batchId };
  const candidates = readCsv(manifestPath).slice(0, limit);
  const rows = await mapConcurrent(candidates, concurrency, (candidate) => harvestCandidateV2(candidate, options), (completed, total, row, candidate) => {
    if (completed === 1 || completed % 10 === 0 || completed === total) console.log(`[harvest-v2:${batchId}] ${completed}/${total} latest=${candidate.candidate_id}:${row.harvest_status}`);
  });
  writeCsv(join(dir, "harvest-results.csv"), rows); writeCsv(join(dir, "evidence.auto.csv"), rows);
  const report = { batch_id: batchId, ...summarizeHarvest(rows) };
  writeFileSync(join(dir, "harvest-report.json"), JSON.stringify(report, null, 2) + "\n", "utf-8"); return report;
}

if (isMainModule(import.meta.url)) runHarvestBatchV2({
  batchId: resolveBatchId(), limit: Number(process.argv[2] || 100), concurrency: Number(process.env.AROMIA_HARVEST_CONCURRENCY || DEFAULT_CONCURRENCY),
}).then((r) => console.log(JSON.stringify(r, null, 2))).catch((e) => { console.error(e); process.exitCode = 1; });
