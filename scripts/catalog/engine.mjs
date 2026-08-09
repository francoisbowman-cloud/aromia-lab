import { resolve, basename } from "node:path";
import {
  CURRENT_AROMIA_CSV,
  REPORTS_DIR,
  readCsv,
  writeCsv,
  writeJson,
  normalizeForKey,
  extractConcentrationFromName,
  splitList,
  isValidUrl,
  isMainModule,
  log,
} from "./lib.mjs";

const DEFAULT_LIMIT = 25;
const PRICE_SEGMENTS = ["económico", "medio", "premium", "lujo"];
const GENDERS = ["masculino", "femenino", "unisex"];
const UNKNOWN_SENTINELS = new Set(["", "pending", "unknown", "n/a", "na", "null"]);

const text = (value) => String(value ?? "").trim();
const norm = (value) => normalizeForKey(text(value));
const knownNorm = (value) => {
  const normalized = norm(value);
  return UNKNOWN_SENTINELS.has(normalized) ? "" : normalized;
};

export function identityFromRow(row) {
  const rawName = text(row.name ?? row.nombre);
  const explicitConcentration = text(row.concentration);

  // Modern Fase 3 rows carry concentration in its own column, so the product
  // name is authoritative and must not be parsed for suffix aliases. This is
  // critical for legitimate names such as "Not a Perfume". Legacy Aromia rows
  // do not have a concentration column, so only those use suffix extraction.
  if (explicitConcentration) {
    return {
      brand: norm(row.brand ?? row.marca),
      baseName: norm(rawName),
      concentration: norm(explicitConcentration),
    };
  }

  const embedded = extractConcentrationFromName(rawName);
  return {
    brand: norm(row.brand ?? row.marca),
    baseName: norm(embedded.baseName),
    concentration: norm(embedded.concentration),
  };
}

function candidateKey(row) {
  const identity = identityFromRow(row);
  return [identity.brand, identity.baseName, identity.concentration].join("|");
}

function productFamilyKey(row) {
  const identity = identityFromRow(row);
  return [identity.brand, identity.baseName].join("|");
}

const valueFor = (row, modern, legacy) => text(row[modern] ?? row[legacy]);
function increment(map, key) {
  if (key) map[key] = (map[key] ?? 0) + 1;
}

export function buildCoverage(rows) {
  const coverage = { total: rows.length, brand: {}, family: {}, gender: {}, price_segment: {}, market_position: {} };
  for (const row of rows) {
    increment(coverage.brand, knownNorm(valueFor(row, "brand", "marca")));
    increment(coverage.family, knownNorm(valueFor(row, "family", "familia_olfativa")));
    increment(coverage.gender, knownNorm(valueFor(row, "gender", "genero")));
    increment(coverage.price_segment, knownNorm(valueFor(row, "price_segment", "categoria_precio")));
    increment(coverage.market_position, knownNorm(valueFor(row, "market_position", "nicho_o_comercial")));
  }
  return coverage;
}

function deficitScore(count, zeroBonus, diminishingWeight, cap) {
  if (count === 0) return zeroBonus;
  return Math.max(0, Math.min(cap, diminishingWeight * (3 - Math.min(count, 3))));
}

function distributionDeficit(coverageMap, key, allowed) {
  if (!key || !allowed.includes(key)) return 0;
  const total = allowed.reduce((sum, item) => sum + (coverageMap[item] ?? 0), 0);
  if (total === 0) return 1;
  const target = 1 / allowed.length;
  return Math.max(0, target - (coverageMap[key] ?? 0) / total) / target;
}

export function assessProvenance(row) {
  const urls = splitList(row.source_url).filter(isValidUrl);
  const verifiedRaw = norm(row.source_verified);
  const verified = ["true", "1", "yes", "si", "sí"].includes(verifiedRaw);
  const confidence = knownNorm(row.data_confidence);
  let score = 0;
  if (urls.length >= 1) score += 10;
  if (urls.length >= 2) score += 3;
  if (verified) score += 4;
  if (confidence === "high") score += 3;
  else if (confidence === "medium") score += 1;
  return { urls, verified, confidence: confidence || null, score: Math.min(20, score), gate: urls.length ? "SOURCE_PRESENT" : "SOURCE_REQUIRED" };
}

export function scoreCandidate(row, coverage, existingKeys = new Set(), existingProductFamilies = new Set()) {
  const identity = identityFromRow(row);
  const family = knownNorm(row.family);
  const gender = knownNorm(row.gender);
  const price = knownNorm(row.price_segment);
  const key = candidateKey(row);
  const familyKey = productFamilyKey(row);
  const provenance = assessProvenance(row);
  const reasons = [];
  const blocks = [];

  if (!identity.brand || !identity.baseName || !identity.concentration || !gender) blocks.push("IDENTITY_INCOMPLETE");
  if (existingKeys.has(key)) blocks.push("EXACT_PRODUCT_ALREADY_COVERED");
  if (provenance.gate !== "SOURCE_PRESENT") blocks.push("SOURCE_REQUIRED");

  let score = 0;
  const brandCount = coverage.brand[identity.brand] ?? 0;
  const brandPoints = deficitScore(brandCount, 22, 6, 12);
  score += brandPoints;
  if (brandPoints) reasons.push(brandCount === 0 ? "NEW_BRAND" : "UNDERREPRESENTED_BRAND");

  const familyCount = family ? coverage.family[family] ?? 0 : 0;
  const familyPoints = family ? deficitScore(familyCount, 20, 5, 10) : 0;
  score += familyPoints;
  if (familyPoints) reasons.push(familyCount === 0 ? "NEW_OLFACTIVE_FAMILY" : "UNDERREPRESENTED_FAMILY");

  const genderPoints = Math.round(distributionDeficit(coverage.gender, gender, GENDERS) * 14);
  const pricePoints = Math.round(distributionDeficit(coverage.price_segment, price, PRICE_SEGMENTS) * 12);
  score += genderPoints + pricePoints;
  if (genderPoints) reasons.push("GENDER_BALANCE_GAP");
  if (pricePoints) reasons.push("PRICE_SEGMENT_GAP");

  if (!existingProductFamilies.has(familyKey)) {
    score += 10;
    reasons.push("NEW_PRODUCT_LINE");
  } else if (!existingKeys.has(key)) {
    score += 4;
    reasons.push("RELATED_VARIANT");
  }

  score += provenance.score;
  if (provenance.score >= 14) reasons.push("STRONG_PROVENANCE");

  const launchYear = Number(row.launch_year);
  if (Number.isFinite(launchYear) && launchYear >= new Date().getUTCFullYear() - 2) {
    score += 5;
    reasons.push("RECENT_RELEASE");
  }

  return {
    id: row.id || null,
    brand: text(row.brand),
    name: text(row.name),
    concentration: text(row.concentration),
    family: family ? text(row.family) : null,
    gender: gender ? text(row.gender) : null,
    price_segment: price ? text(row.price_segment) : null,
    source_url: text(row.source_url) || null,
    data_confidence: knownNorm(row.data_confidence) ? text(row.data_confidence) : null,
    candidate_key: key,
    product_family_key: familyKey,
    score: Math.max(0, Math.min(100, Math.round(score))),
    eligible: blocks.length === 0,
    blocks,
    reasons,
    provenance,
    raw: row,
  };
}

function applySelectionToCoverage(coverage, candidate) {
  const next = structuredClone(coverage);
  increment(next.brand, knownNorm(candidate.brand));
  increment(next.family, knownNorm(candidate.family));
  increment(next.gender, knownNorm(candidate.gender));
  increment(next.price_segment, knownNorm(candidate.price_segment));
  next.total += 1;
  return next;
}

export function selectCandidates(candidateRows, currentRows, limit = DEFAULT_LIMIT) {
  let coverage = buildCoverage(currentRows);
  const existingKeys = new Set(currentRows.map(candidateKey));
  const productFamilies = new Set(currentRows.map(productFamilyKey));
  const remaining = [...candidateRows];
  const selected = [];
  const notSelected = [];
  const selectedKeys = new Set();

  while (remaining.length && selected.length < limit) {
    const allKeys = new Set([...existingKeys, ...selectedKeys]);
    const scored = remaining
      .map((row) => scoreCandidate(row, coverage, allKeys, productFamilies))
      .sort((a, b) => b.score - a.score || a.candidate_key.localeCompare(b.candidate_key));
    const best = scored.find((candidate) => candidate.eligible);
    if (!best) break;
    selected.push({ ...best, rank: selected.length + 1 });
    selectedKeys.add(best.candidate_key);
    productFamilies.add(best.product_family_key);
    coverage = applySelectionToCoverage(coverage, best);
    const index = remaining.findIndex((row) => candidateKey(row) === best.candidate_key);
    if (index >= 0) remaining.splice(index, 1);
  }

  const finalKeys = new Set([...existingKeys, ...selectedKeys]);
  for (const row of remaining) notSelected.push(scoreCandidate(row, coverage, finalKeys, productFamilies));
  return { selected, notSelected, initialCoverage: buildCoverage(currentRows), projectedCoverage: coverage };
}

export function summarizeGaps(coverage) {
  const least = (map, allowed = null) => {
    const entries = allowed ? allowed.map((key) => [key, map[key] ?? 0]) : Object.entries(map);
    return entries.sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0])).slice(0, 10);
  };
  return {
    total: coverage.total,
    leastRepresentedBrands: least(coverage.brand),
    leastRepresentedFamilies: least(coverage.family),
    genderBalance: least(coverage.gender, GENDERS),
    priceBalance: least(coverage.price_segment, PRICE_SEGMENTS),
  };
}

function parseArgs(argv) {
  const positional = [];
  let limit = DEFAULT_LIMIT;
  let current = CURRENT_AROMIA_CSV;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--limit") limit = Number(argv[++i]);
    else if (argv[i] === "--current") current = resolve(argv[++i]);
    else positional.push(argv[i]);
  }
  if (!positional[0]) throw new Error("Uso: engine.mjs <candidate-pool.csv> [--limit 25] [--current catalog.csv]");
  if (!Number.isInteger(limit) || limit < 1 || limit > 200) throw new Error("--limit debe ser un entero entre 1 y 200");
  return { pool: resolve(positional[0]), current, limit };
}

export function runEngine({ pool, current = CURRENT_AROMIA_CSV, limit = DEFAULT_LIMIT }) {
  const currentRows = readCsv(current).rows;
  const candidateRows = readCsv(pool).rows;
  const result = selectCandidates(candidateRows, currentRows, limit);
  const poolName = basename(pool).replace(/\.csv$/i, "");
  const reportBase = `engine-${poolName}`;
  const report = {
    engine_version: "0.2.0",
    generated_at: new Date().toISOString(),
    current_catalog: current,
    candidate_pool: pool,
    requested_limit: limit,
    selected_count: result.selected.length,
    candidate_count: candidateRows.length,
    gaps_before: summarizeGaps(result.initialCoverage),
    gaps_after: summarizeGaps(result.projectedCoverage),
    selected: result.selected.map(({ raw, ...candidate }) => candidate),
    not_selected: result.notSelected.map(({ raw, ...candidate }) => candidate),
  };
  const jsonPath = resolve(REPORTS_DIR, `${reportBase}.json`);
  const csvPath = resolve(REPORTS_DIR, `${reportBase}-selection.csv`);
  writeJson(jsonPath, report);
  writeCsv(csvPath, ["rank", "id", "brand", "name", "concentration", "family", "gender", "price_segment", "score", "reasons", "source_url", "data_confidence"], result.selected.map((candidate) => ({
    rank: candidate.rank,
    id: candidate.id ?? "",
    brand: candidate.brand,
    name: candidate.name,
    concentration: candidate.concentration,
    family: candidate.family ?? "",
    gender: candidate.gender ?? "",
    price_segment: candidate.price_segment ?? "",
    score: candidate.score,
    reasons: candidate.reasons.join(";"),
    source_url: candidate.source_url ?? "",
    data_confidence: candidate.data_confidence ?? "",
  })));
  return { ...report, jsonPath, csvPath };
}

if (isMainModule(import.meta.url)) {
  try {
    const result = runEngine(parseArgs(process.argv.slice(2)));
    log(`Catalog Expansion Engine: ${result.selected_count}/${result.candidate_count} candidatos seleccionados.`);
    log(`Reporte: ${result.jsonPath}`);
    log(`Selección: ${result.csvPath}`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
