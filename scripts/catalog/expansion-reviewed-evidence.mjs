import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parse as parseCsv } from "csv-parse/sync";
import { stringify as stringifyCsv } from "csv-stringify/sync";
import { GENDER_ENUM, REPO_ROOT, isMainModule, normalizeConcentration } from "./lib.mjs";
import { isTrustedSecondaryUrl } from "./secondary-discovery.mjs";

const CLEARABLE_FIELDS = new Set(["family", "image_url", "image_source", "seo_title", "seo_description", "description"]);
const NOTE_FIELDS = ["top_notes", "middle_notes", "base_notes", "accords"];
const SOURCE_KINDS = new Set(["official", "trusted_secondary"]);
const SOURCE_MODES = new Set(["append", "replace"]);
const NOTE_MODES = new Set(["keep", "replace"]);
const SOURCE_IDENTITY_STOP_WORDS = new Set(["eau", "de", "du", "des", "the", "for", "pour", "by", "and", "parfum", "perfume", "edp", "edt", "edc", "extrait", "elixir", "le", "la", "les", "au", "inc"]);

function readCsv(path) {
  return parseCsv(readFileSync(path, "utf-8"), { columns: true, skip_empty_lines: true, relax_column_count: false, trim: true });
}
function clean(value) {
  const s = String(value ?? "").trim();
  return ["", "pending", "null", "undefined", "n/a"].includes(s.toLowerCase()) ? "" : s;
}
function fold(value) {
  return clean(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function words(value) { return fold(value).split(/\s+/).filter(Boolean); }
function splitList(value) { return clean(value) ? clean(value).split(";").map((x) => x.trim()).filter(Boolean) : []; }
function canonicalUrl(value) {
  const u = new URL(clean(value));
  u.hash = "";
  if (u.pathname.length > 1) u.pathname = u.pathname.replace(/\/+$/, "");
  return u.toString();
}
function mergeUrls(existing, reviewed) {
  const urls = [...splitList(existing), reviewed].map(canonicalUrl);
  return [...new Set(urls)].join(";");
}
function officialHostMatches(sourceUrl, officialDomain) {
  const host = new URL(sourceUrl).hostname.toLowerCase();
  const domain = clean(officialDomain).toLowerCase().replace(/^www\./, "");
  return Boolean(domain) && (host === domain || host.endsWith(`.${domain}`));
}
function validateIdentity(candidate, patch) {
  if (fold(candidate.brand) !== fold(patch.brand) || fold(candidate.name) !== fold(patch.name)) {
    throw new Error(`reviewed_evidence_identity_mismatch:${patch.candidate_id}`);
  }
}
function validateSourceIdentity(candidate, source, patch, label = "source") {
  const urlWords = new Set(words(new URL(source).pathname));
  const rawNameTokens = words(candidate.name);
  const nameTokens = rawNameTokens.filter((token) => !SOURCE_IDENTITY_STOP_WORDS.has(token));
  const required = nameTokens.length ? nameTokens : rawNameTokens;
  const hits = required.filter((token) => urlWords.has(token));
  const coverage = required.length ? hits.length / required.length : 0;
  if (!required.length || coverage < 0.8 || hits.length === 0) {
    throw new Error(`reviewed_evidence_${label}_identity_mismatch:${patch.candidate_id}:${coverage.toFixed(2)}`);
  }
  return coverage;
}
function validateCuratedSecondary(candidate, sourceValue, patch, curatedSecondary, label = "secondary") {
  const source = canonicalUrl(sourceValue);
  if (!isTrustedSecondaryUrl(source)) throw new Error(`reviewed_evidence_untrusted_${label}:${patch.candidate_id}`);
  const curated = clean(curatedSecondary.get(patch.candidate_id));
  if (!curated || canonicalUrl(curated) !== source) throw new Error(`reviewed_evidence_${label}_not_curated:${patch.candidate_id}`);
  const identityCoverage = validateSourceIdentity(candidate, source, patch, label);
  return { source, identityCoverage };
}
function validateSource(candidate, patch, curatedSecondary) {
  if (!SOURCE_KINDS.has(patch.source_kind)) throw new Error(`reviewed_evidence_source_kind_invalid:${patch.candidate_id}`);
  if (!SOURCE_MODES.has(patch.source_mode)) throw new Error(`reviewed_evidence_source_mode_invalid:${patch.candidate_id}`);
  if (!clean(patch.review_note)) throw new Error(`reviewed_evidence_review_note_required:${patch.candidate_id}`);
  const source = canonicalUrl(patch.source_url);
  let identityCoverage;
  if (patch.source_kind === "official") {
    if (!officialHostMatches(source, candidate.official_domain)) throw new Error(`reviewed_evidence_official_host_mismatch:${patch.candidate_id}`);
    identityCoverage = validateSourceIdentity(candidate, source, patch);
  } else {
    ({ identityCoverage } = validateCuratedSecondary(candidate, source, patch, curatedSecondary));
  }

  const supplementalValue = clean(patch.supplemental_source_url);
  let supplementalSource = "";
  let supplementalCoverage = null;
  if (supplementalValue) {
    if (patch.source_kind !== "official") throw new Error(`reviewed_evidence_supplemental_requires_official_primary:${patch.candidate_id}`);
    const validated = validateCuratedSecondary(candidate, supplementalValue, patch, curatedSecondary, "supplemental_secondary");
    supplementalSource = validated.source;
    supplementalCoverage = validated.identityCoverage;
  }
  return { source, identityCoverage, supplementalSource, supplementalCoverage };
}
function canonicalConcentration(value) {
  return clean(normalizeConcentration(clean(value)).value).toLowerCase();
}
function validateConcentration(existing, candidate, patch) {
  const reviewed = clean(patch.concentration);
  if (!reviewed) return clean(existing);
  const reviewedCanonical = canonicalConcentration(reviewed);
  const expectedCanonical = canonicalConcentration(candidate.concentration);
  if (!reviewedCanonical || (expectedCanonical && reviewedCanonical !== expectedCanonical)) {
    throw new Error(`reviewed_evidence_concentration_candidate_conflict:${patch.candidate_id}:${candidate.concentration}->${reviewed}`);
  }
  const current = clean(existing);
  if (current && canonicalConcentration(current) !== reviewedCanonical) {
    throw new Error(`reviewed_evidence_concentration_conflict:${patch.candidate_id}:${current}->${reviewed}`);
  }
  return reviewed;
}
function validateGender(existing, patch) {
  const gender = clean(patch.gender);
  if (!gender) return clean(existing);
  if (!GENDER_ENUM.includes(gender)) throw new Error(`reviewed_evidence_gender_invalid:${patch.candidate_id}`);
  const current = clean(existing);
  if (current && current !== gender) throw new Error(`reviewed_evidence_gender_conflict:${patch.candidate_id}:${current}->${gender}`);
  return gender;
}
function validateLaunchYear(existing, candidate, patch) {
  const year = clean(patch.launch_year);
  if (!year) return clean(existing);
  if (!/^\d{4}$/.test(year) || Number(year) < 1850 || Number(year) > 2100) throw new Error(`reviewed_evidence_launch_year_invalid:${patch.candidate_id}`);
  const candidateYear = clean(candidate.launch_year);
  if (candidateYear && candidateYear !== year) throw new Error(`reviewed_evidence_launch_year_candidate_conflict:${patch.candidate_id}:${candidateYear}->${year}`);
  const current = clean(existing);
  if (current && current !== year) throw new Error(`reviewed_evidence_launch_year_conflict:${patch.candidate_id}:${current}->${year}`);
  return year;
}
function applyNotes(row, patch, touched) {
  if (!NOTE_MODES.has(patch.notes_mode)) throw new Error(`reviewed_evidence_notes_mode_invalid:${patch.candidate_id}`);
  if (patch.notes_mode === "keep") return row;
  const top = clean(patch.top_notes);
  const middle = clean(patch.middle_notes);
  const base = clean(patch.base_notes);
  if (!top || !middle || !base) throw new Error(`reviewed_evidence_replace_requires_complete_pyramid:${patch.candidate_id}`);
  for (const field of NOTE_FIELDS) row[field] = clean(patch[field]);
  row.notes_structure = "PYRAMID";
  row.source_does_not_publish_notes = "false";
  touched.push("notes_pyramid");
  return row;
}
function applyClears(row, patch, touched) {
  for (const field of splitList(patch.clear_fields)) {
    if (!CLEARABLE_FIELDS.has(field)) throw new Error(`reviewed_evidence_clear_field_forbidden:${patch.candidate_id}:${field}`);
    row[field] = "";
    touched.push(`clear:${field}`);
  }
  return row;
}

export function applyReviewedEvidence(evidenceRows, manifestRows, patchRows, secondaryMapRows = []) {
  const manifestById = new Map(manifestRows.map((row) => [row.candidate_id, row]));
  const evidenceById = new Map(evidenceRows.map((row) => [row.candidate_id, { ...row }]));
  const curatedSecondary = new Map(secondaryMapRows.map((row) => [row.candidate_id, row.source_url]));
  const seen = new Set();
  const audit = [];

  for (const patch of patchRows) {
    const id = clean(patch.candidate_id);
    if (!id || seen.has(id)) throw new Error(`reviewed_evidence_duplicate_or_missing_id:${id || "missing"}`);
    seen.add(id);
    const candidate = manifestById.get(id);
    const row = evidenceById.get(id);
    if (!candidate || !row) throw new Error(`reviewed_evidence_candidate_not_selected:${id}`);
    validateIdentity(candidate, patch);
    const { source: reviewedSource, identityCoverage, supplementalSource, supplementalCoverage } = validateSource(candidate, patch, curatedSecondary);
    const touched = [];

    const concentration = validateConcentration(row.concentration, candidate, patch);
    if (concentration && canonicalConcentration(concentration) !== canonicalConcentration(row.concentration)) { row.concentration = concentration; touched.push("concentration"); }
    const gender = validateGender(row.gender, patch);
    if (gender && gender !== clean(row.gender)) { row.gender = gender; touched.push("gender"); }
    const launchYear = validateLaunchYear(row.launch_year, candidate, patch);
    if (launchYear && launchYear !== clean(row.launch_year)) { row.launch_year = launchYear; touched.push("launch_year"); }

    if (patch.source_mode === "replace") {
      row.source_url = reviewedSource;
      touched.push("source_url:replace");
    } else {
      const merged = mergeUrls(row.source_url, reviewedSource);
      if (merged !== clean(row.source_url)) touched.push("source_url:append");
      row.source_url = merged;
    }
    if (supplementalSource) {
      row.source_url = mergeUrls(row.source_url, supplementalSource);
      row.secondary_source = "true";
      touched.push("source_url:supplemental_secondary");
    }
    if (patch.source_kind === "official") row.official_source = "true";
    if (patch.source_kind === "trusted_secondary") row.secondary_source = "true";
    if (String(row.identity_confirmed ?? "").toLowerCase() !== "true") touched.push("identity_confirmed");
    row.identity_confirmed = "true";

    applyNotes(row, patch, touched);
    applyClears(row, patch, touched);
    row.reviewed_evidence = "true";
    row.reviewed_evidence_source = reviewedSource;
    row.reviewed_evidence_supplemental_source = supplementalSource;
    row.reviewed_evidence_kind = patch.source_kind;
    row.reviewed_evidence_identity_coverage = identityCoverage.toFixed(2);
    row.reviewed_evidence_supplemental_identity_coverage = supplementalCoverage === null ? "" : supplementalCoverage.toFixed(2);
    row.reviewed_evidence_fields = [...new Set(touched)].join(";");
    row.reviewed_evidence_note = clean(patch.review_note);
    row.evidence_method = [clean(row.evidence_method), `reviewed_evidence:${patch.source_kind}`, supplementalSource ? "reviewed_evidence:trusted_secondary" : ""].filter(Boolean).join("+");
    evidenceById.set(id, row);
    audit.push({ candidate_id: id, source_kind: patch.source_kind, source_mode: patch.source_mode, identity_coverage: Number(identityCoverage.toFixed(2)), supplemental_secondary: Boolean(supplementalSource), supplemental_identity_coverage: supplementalCoverage === null ? null : Number(supplementalCoverage.toFixed(2)), touched: [...new Set(touched)] });
  }

  return { rows: evidenceRows.map((row) => evidenceById.get(row.candidate_id) ?? row), audit };
}

export function runReviewedEvidence() {
  const dir = join(REPO_ROOT, "catalog", "expansion", "batch-003");
  const evidencePath = join(dir, "evidence.auto.csv");
  const manifestPath = join(dir, "candidate-manifest.csv");
  const patchPath = join(REPO_ROOT, "catalog", "expansion", "reviewed-evidence.csv");
  const secondaryMapPath = join(REPO_ROOT, "catalog", "expansion", "secondary-source-map.csv");
  if (![evidencePath, manifestPath, patchPath].every(existsSync)) return { skipped: true, reason: "evidence.auto.csv, manifest, or reviewed-evidence.csv missing" };

  const result = applyReviewedEvidence(
    readCsv(evidencePath),
    readCsv(manifestPath),
    readCsv(patchPath),
    existsSync(secondaryMapPath) ? readCsv(secondaryMapPath) : [],
  );
  const output = join(dir, "evidence.csv");
  writeFileSync(output, stringifyCsv(result.rows, { header: true }), "utf-8");
  const coverages = result.audit.flatMap((row) => [row.identity_coverage, row.supplemental_identity_coverage]).filter((value) => value !== null);
  const report = {
    contract: "reviewed-evidence-v1",
    patches: result.audit.length,
    candidates: result.audit.map((row) => row.candidate_id),
    official_sources: result.audit.filter((row) => row.source_kind === "official").length,
    trusted_secondary_sources: result.audit.filter((row) => row.source_kind === "trusted_secondary").length,
    supplemental_trusted_secondary_sources: result.audit.filter((row) => row.supplemental_secondary).length,
    source_replacements: result.audit.filter((row) => row.source_mode === "replace").length,
    cleared_fields: result.audit.flatMap((row) => row.touched).filter((field) => field.startsWith("clear:")).length,
    min_source_identity_coverage: coverages.length ? Math.min(...coverages) : null,
    production_write: false,
    mutates_raw_inputs: false,
    output: "catalog/expansion/batch-003/evidence.csv",
  };
  writeFileSync(join(dir, "reviewed-evidence-report.json"), JSON.stringify(report, null, 2) + "\n", "utf-8");
  return report;
}

if (isMainModule(import.meta.url)) {
  try { console.log(JSON.stringify(runReviewedEvidence(), null, 2)); }
  catch (error) { console.error(error); process.exitCode = 1; }
}
