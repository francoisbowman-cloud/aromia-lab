import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { parse as parseCsv } from "csv-parse/sync";
import { stringify as stringifyCsv } from "csv-stringify/sync";
import { extractConcentrationFromName, normalizeConcentration, isMainModule, REPO_ROOT } from "./lib.mjs";

export const EXPANSION_STATES = Object.freeze({ AUTO_READY: "AUTO_READY", REVIEW_REQUIRED: "REVIEW_REQUIRED", BLOCKED: "BLOCKED" });
export const DEFAULT_QUOTAS = Object.freeze({ mainstream: 35, variant_risk: 25, niche: 20, nonstandard_notes: 10, hard_case: 10 });
const SENTINELS = new Set(["", "pending", "null", "undefined", "n/a"]);

export function clean(value) { const v = String(value ?? "").trim(); return SENTINELS.has(v.toLowerCase()) ? "" : v; }
export function fold(value) { return clean(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " "); }

export function identityParts(row) {
  const brand = fold(row.brand ?? row.marca);
  let rawName = clean(row.name ?? row.nombre);
  let concentration = clean(row.concentration);
  if (!concentration && rawName) { const extracted = extractConcentrationFromName(rawName); rawName = extracted.baseName; concentration = extracted.concentration ?? ""; }
  const normalized = normalizeConcentration(concentration);
  return { brand, name: fold(rawName), concentration: fold(normalized.value) };
}

export function exactIdentityKey(row) { const p = identityParts(row); return `${p.brand}::${p.name}::${p.concentration}`; }
export function familyIdentityKey(row) { const p = identityParts(row); return `${p.brand}::${p.name}`; }
export function readCsv(path) { return parseCsv(readFileSync(path, "utf-8"), { columns: true, skip_empty_lines: true, relax_column_count: true }); }
function safeRead(path) { return existsSync(path) ? readCsv(path) : []; }

export function buildKnownUniverse({ currentRows = [], batchRows = [], masterRows = [] } = {}) {
  const exact = new Set(); const family = new Set();
  for (const row of [...currentRows, ...batchRows, ...masterRows]) { const p = identityParts(row); if (!p.brand || !p.name) continue; family.add(`${p.brand}::${p.name}`); if (p.concentration) exact.add(`${p.brand}::${p.name}::${p.concentration}`); }
  return { exact, family };
}

export function classifyCandidate(candidate, universe) {
  const p = identityParts(candidate);
  if (!p.brand || !p.name) return { relation: "INVALID_IDENTITY", state: EXPANSION_STATES.BLOCKED };
  if (p.concentration && universe.exact.has(exactIdentityKey(candidate))) return { relation: "EXISTING", state: EXPANSION_STATES.BLOCKED };
  if (universe.family.has(familyIdentityKey(candidate))) return { relation: "RELATED_VARIANT", state: EXPANSION_STATES.AUTO_READY };
  return { relation: "NEW", state: EXPANSION_STATES.AUTO_READY };
}

export function scoreCandidate(candidate, relation) {
  let score = Number(candidate.priority || 50);
  if (relation === "NEW") score += 10; if (relation === "RELATED_VARIANT") score += 5; if (clean(candidate.official_domain)) score += 8; if (clean(candidate.concentration)) score += 4; if (clean(candidate.launch_year)) score += 2; if (clean(candidate.difficulty).toLowerCase() === "hard") score -= 3;
  return score;
}

export function selectCandidates(poolRows, universe, { limit = 100, quotas = DEFAULT_QUOTAS } = {}) {
  const evaluated = poolRows.map((candidate, index) => { const { relation, state } = classifyCandidate(candidate, universe); return { ...candidate, relation, state, score: scoreCandidate(candidate, relation), _index: index }; });
  const seen = new Set();
  const eligible = evaluated.filter((r) => r.state !== EXPANSION_STATES.BLOCKED).filter((r) => { const key = exactIdentityKey(r); if (seen.has(key)) return false; seen.add(key); return true; }).sort((a, b) => b.score - a.score || a._index - b._index);
  const selected = []; const selectedKeys = new Set();
  for (const [stratum, quota] of Object.entries(quotas)) for (const row of eligible.filter((r) => clean(r.stratum) === stratum).slice(0, quota)) { const key = exactIdentityKey(row); if (!selectedKeys.has(key) && selected.length < limit) { selected.push(row); selectedKeys.add(key); } }
  for (const row of eligible) { if (selected.length >= limit) break; const key = exactIdentityKey(row); if (!selectedKeys.has(key)) { selected.push(row); selectedKeys.add(key); } }
  return { selected, evaluated };
}

export function buildDiscoveryTask(candidate) {
  const domain = clean(candidate.official_domain); const concentration = clean(candidate.concentration); const label = `${clean(candidate.brand)} ${clean(candidate.name)}${concentration ? ` ${concentration}` : ""}`.trim();
  return { candidate_id: clean(candidate.candidate_id), identity: label, official_domain: domain, primary_query: `${label} official fragrance notes`, fallback_query: `${label} perfume notes launch year perfumer`, preferred_source: domain ? `https://${domain}` : "", provenance_required: "true", extraction_state: "PENDING_DISCOVERY" };
}

export function computeConfidence(evidence = {}) {
  const reasons = []; const penalties = [];
  const identity = evidence.identityConfirmed ? 1 : 0.55;
  const source = evidence.officialSource ? 1 : evidence.secondarySource ? 0.72 : 0.35;
  const notes = evidence.notesPublished ? 1 : evidence.notesUnavailableConfirmed ? 0.82 : 0.45;
  const metadata = evidence.metadataFields >= 4 ? 1 : evidence.metadataFields >= 2 ? 0.75 : 0.5;
  const relation = evidence.relationUnambiguous === false ? 0.45 : 1;
  if (evidence.identityConfirmed) reasons.push("identity_confirmed"); else penalties.push("identity_unconfirmed");
  if (evidence.officialSource) reasons.push("official_source"); else if (evidence.secondarySource) reasons.push("secondary_source"); else penalties.push("weak_source");
  if (evidence.notesPublished) reasons.push("notes_published"); else if (evidence.notesUnavailableConfirmed) reasons.push("source_does_not_publish_notes"); else penalties.push("notes_unresolved");
  if (relation < 1) penalties.push("relation_ambiguous");
  const overall = identity * 0.3 + source * 0.25 + notes * 0.2 + metadata * 0.15 + relation * 0.1;
  return { identity_confidence: identity, source_confidence: source, notes_confidence: notes, metadata_confidence: metadata, relation_confidence: relation, overall_confidence: Number(overall.toFixed(3)), confidence_reasons: reasons, confidence_penalties: penalties };
}

export function qualityGate({ confidence, blockingConflict = false, provenanceCount = 0 } = {}) {
  if (blockingConflict) return { state: EXPANSION_STATES.BLOCKED, reason: "blocking_conflict" };
  if (!confidence || provenanceCount < 1) return { state: EXPANSION_STATES.REVIEW_REQUIRED, reason: "missing_provenance" };
  if (confidence.relation_confidence < 0.7) return { state: EXPANSION_STATES.REVIEW_REQUIRED, reason: "ambiguous_relation" };
  if (confidence.source_confidence < 0.7) return { state: EXPANSION_STATES.REVIEW_REQUIRED, reason: "source_confidence_below_threshold" };
  if (confidence.notes_confidence < 0.8) return { state: EXPANSION_STATES.REVIEW_REQUIRED, reason: "notes_unresolved" };
  if (confidence.overall_confidence >= 0.82) return { state: EXPANSION_STATES.AUTO_READY, reason: "confidence_gate_pass" };
  return { state: EXPANSION_STATES.REVIEW_REQUIRED, reason: "confidence_below_threshold" };
}

export function metrics(rows) { const total = rows.length; const counts = Object.fromEntries(Object.values(EXPANSION_STATES).map((s) => [s, 0])); for (const row of rows) counts[row.state] = (counts[row.state] ?? 0) + 1; return { total, counts, autoPreparationYield: total ? counts.AUTO_READY / total : null, humanReviewBurden: total ? counts.REVIEW_REQUIRED / total : null, blockedRate: total ? counts.BLOCKED / total : null }; }
function writeCsv(path, rows) { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, stringifyCsv(rows, { header: true }), "utf-8"); }

export function runExpansion({ limit = 100 } = {}) {
  const expansionDir = join(REPO_ROOT, "catalog", "expansion"); const poolPaths = ["candidate-pool-v1a.csv", "candidate-pool-v1b.csv", "candidate-pool-v1c.csv"].map((name) => join(expansionDir, name)); const currentPath = join(REPO_ROOT, "PERFUMES_INITIAL_50.csv"); const masterPath = join(REPO_ROOT, "catalog", "aromia-catalog-master.csv"); const b1Path = join(REPO_ROOT, "catalog", "imports", "batch-001.csv"); const b2Path = join(REPO_ROOT, "catalog", "imports", "batch-002.csv"); const outputDir = join(expansionDir, "batch-003");
  const poolRows = poolPaths.flatMap(readCsv); const universe = buildKnownUniverse({ currentRows: safeRead(currentPath), batchRows: [...safeRead(b1Path), ...safeRead(b2Path)], masterRows: safeRead(masterPath) }); const { selected, evaluated } = selectCandidates(poolRows, universe, { limit }); const discovery = selected.map(buildDiscoveryTask);
  writeCsv(join(outputDir, "candidate-manifest.csv"), selected.map(({ _index, ...r }) => r)); writeCsv(join(outputDir, "source-discovery-queue.csv"), discovery); writeCsv(join(outputDir, "excluded-candidates.csv"), evaluated.filter((r) => r.state === EXPANSION_STATES.BLOCKED).map(({ _index, ...r }) => r)); mkdirSync(outputDir, { recursive: true });
  const report = { version: "expansion-automation-v1", generated_at: new Date().toISOString(), requested_limit: limit, candidate_pool_size: poolRows.length, selected: selected.length, known_universe: { exact_identities: universe.exact.size, family_identities: universe.family.size }, selection_by_stratum: Object.fromEntries(Object.keys(DEFAULT_QUOTAS).map((s) => [s, selected.filter((r) => r.stratum === s).length])), guardrails: { writes_postgres: false, mutates_raw_inputs: false, master_import: false }, next_gate: "source discovery + structured extraction; AUTO_READY applies to enriched rows only" };
  writeFileSync(join(outputDir, "selection-report.json"), JSON.stringify(report, null, 2) + "\n", "utf-8"); return { selected, discovery, evaluated, report };
}

if (isMainModule(import.meta.url)) console.log(JSON.stringify(runExpansion({ limit: Number(process.argv[2] || 100) }).report, null, 2));
