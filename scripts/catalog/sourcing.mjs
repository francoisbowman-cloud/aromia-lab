import { resolve } from "node:path";
import { CURRENT_AROMIA_CSV, REPORTS_DIR, readCsv, writeJson, writeCsv, normalizeForKey, isMainModule, log } from "./lib.mjs";
import { buildCoverage, selectCandidates } from "./engine.mjs";

const norm = (value) => normalizeForKey(String(value ?? "").trim());
const PRICE_SEGMENTS = ["económico", "medio", "premium", "lujo"];
const GENDERS = ["masculino", "femenino", "unisex"];

export function buildSourcingTargets(currentRows) {
  const coverage = buildCoverage(currentRows);
  const targets = [];

  for (const segment of PRICE_SEGMENTS) {
    const count = coverage.price_segment[segment] ?? 0;
    if (count === 0) targets.push({ dimension: "price_segment", value: segment, priority: 100, reason: "ZERO_COVERAGE" });
    else if (count < 5) targets.push({ dimension: "price_segment", value: segment, priority: 70, reason: "LOW_COVERAGE" });
  }

  const genderCounts = GENDERS.map((value) => ({ value, count: coverage.gender[value] ?? 0 }));
  const maxGender = Math.max(...genderCounts.map((x) => x.count), 0);
  for (const item of genderCounts) {
    const gap = maxGender - item.count;
    if (gap >= 5) targets.push({ dimension: "gender", value: item.value, priority: Math.min(90, 50 + gap), reason: "DISTRIBUTION_GAP" });
  }

  return targets.sort((a, b) => b.priority - a.priority || a.dimension.localeCompare(b.dimension) || a.value.localeCompare(b.value));
}

export function assessSourcingPool(poolRows, targets) {
  return targets.map((target) => {
    const matching = poolRows.filter((row) => norm(row[target.dimension]) === norm(target.value));
    return { ...target, candidate_count: matching.length, satisfied_by_pool: matching.length > 0 };
  });
}

export function runSourcing({ pool, current = CURRENT_AROMIA_CSV, limit = 25 }) {
  const currentRows = readCsv(current).rows;
  const poolRows = readCsv(pool).rows;
  const targets = buildSourcingTargets(currentRows);
  const targetAssessment = assessSourcingPool(poolRows, targets);
  const selection = selectCandidates(poolRows, currentRows, limit);

  const report = {
    sourcing_version: "0.1.0",
    generated_at: new Date().toISOString(),
    current_catalog: current,
    candidate_pool: pool,
    targets: targetAssessment,
    selected_count: selection.selected.length,
    selected: selection.selected.map(({ raw, ...candidate }) => candidate),
  };

  const jsonPath = resolve(REPORTS_DIR, "sourcing-economico-001.json");
  const csvPath = resolve(REPORTS_DIR, "sourcing-economico-001-selection.csv");
  writeJson(jsonPath, report);
  writeCsv(csvPath, ["rank", "id", "brand", "name", "concentration", "gender", "family", "price_segment", "score", "reasons", "source_url"], selection.selected.map((candidate) => ({
    rank: candidate.rank,
    id: candidate.id ?? "",
    brand: candidate.brand,
    name: candidate.name,
    concentration: candidate.concentration,
    gender: candidate.gender ?? "",
    family: candidate.family ?? "",
    price_segment: candidate.price_segment ?? "",
    score: candidate.score,
    reasons: candidate.reasons.join(";"),
    source_url: candidate.source_url ?? "",
  })));
  return { ...report, jsonPath, csvPath };
}

function parseArgs(argv) {
  const positional = [];
  let current = CURRENT_AROMIA_CSV;
  let limit = 25;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--current") current = resolve(argv[++i]);
    else if (argv[i] === "--limit") limit = Number(argv[++i]);
    else positional.push(argv[i]);
  }
  if (!positional[0]) throw new Error("Uso: sourcing.mjs <candidate-pool.csv> [--current catalog.csv] [--limit 25]");
  return { pool: resolve(positional[0]), current, limit };
}

if (isMainModule(import.meta.url)) {
  try {
    const result = runSourcing(parseArgs(process.argv.slice(2)));
    log(`Sourcing Engine: ${result.selected_count} candidatos priorizados.`);
    for (const target of result.targets) log(`${target.priority} ${target.dimension}:${target.value} -> ${target.candidate_count} candidatos`);
    log(`Reporte: ${result.jsonPath}`);
    log(`Selección: ${result.csvPath}`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
