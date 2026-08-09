import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { parse as parseCsv } from "csv-parse/sync";
import { stringify as stringifyCsv } from "csv-stringify/sync";
import { REPO_ROOT, classifyNoteStructure, derivePriceStatus, isMainModule } from "./lib.mjs";
import { clean, computeConfidence, qualityGate, EXPANSION_STATES } from "./expansion-engine.mjs";

function splitList(value) { return clean(value) ? clean(value).split(";").map((x) => x.trim()).filter(Boolean) : []; }

export function evidenceToDraft(row) {
  const top = splitList(row.top_notes);
  const middle = splitList(row.middle_notes ?? row.heart_notes);
  const base = splitList(row.base_notes);
  const accords = splitList(row.accords);
  const sourceUrls = splitList(row.source_url);
  const typedNotes = { top_notes: top, middle_notes: middle, base_notes: base, accords };
  const notesStructure = classifyNoteStructure(typedNotes);
  const sourceDoesNotPublish = String(row.source_does_not_publish_notes ?? "").toLowerCase() === "true";
  const notesStatus = notesStructure !== "UNKNOWN" ? "published" : sourceDoesNotPublish ? "source_does_not_publish" : "unresolved";
  const metadataFields = [row.launch_year, row.perfumer, row.country, row.family, row.gender, row.concentration].filter((v) => clean(v)).length;
  const confidence = computeConfidence({
    identityConfirmed: String(row.identity_confirmed ?? "").toLowerCase() === "true",
    officialSource: String(row.official_source ?? "").toLowerCase() === "true",
    secondarySource: sourceUrls.length > 0,
    notesPublished: notesStructure !== "UNKNOWN",
    notesUnavailableConfirmed: sourceDoesNotPublish,
    metadataFields,
    relationUnambiguous: String(row.relation_ambiguous ?? "").toLowerCase() !== "true",
  });
  let gate = qualityGate({ confidence, provenanceCount: sourceUrls.length, blockingConflict: String(row.blocking_conflict ?? "").toLowerCase() === "true" });
  const critical = { brand: clean(row.brand), name: clean(row.name), concentration: clean(row.concentration), gender: clean(row.gender) };
  const missingCritical = Object.entries(critical).filter(([, value]) => !value).map(([field]) => field);
  if (gate.state === EXPANSION_STATES.AUTO_READY && missingCritical.length) gate = { state: EXPANSION_STATES.REVIEW_REQUIRED, reason: `critical_metadata_missing:${missingCritical.join("|")}` };
  return {
    candidate_id: clean(row.candidate_id), slug: clean(row.slug), ...critical,
    family: clean(row.family), launch_year: clean(row.launch_year), perfumer: clean(row.perfumer), country: clean(row.country),
    top_notes: top.join(";"), middle_notes: middle.join(";"), base_notes: base.join(";"), accords: accords.join(";"),
    notes_status: notesStatus,
    price_segment: clean(row.price_segment), price_status: derivePriceStatus(clean(row.price_segment)), source_url: sourceUrls.join(";"),
    notes_structure: notesStructure, catalog_relation: clean(row.catalog_relation) || "NEW", quality_status: gate.state, quality_reason: gate.reason,
    overall_confidence: confidence.overall_confidence, identity_confidence: confidence.identity_confidence, source_confidence: confidence.source_confidence,
    notes_confidence: confidence.notes_confidence, metadata_confidence: confidence.metadata_confidence, relation_confidence: confidence.relation_confidence,
    confidence_reasons: confidence.confidence_reasons.join(";"), confidence_penalties: confidence.confidence_penalties.join(";"),
  };
}

export function routeEvidence(rows) {
  const drafted = rows.map(evidenceToDraft);
  return { drafted, autoReady: drafted.filter((r) => r.quality_status === EXPANSION_STATES.AUTO_READY), reviewRequired: drafted.filter((r) => r.quality_status === EXPANSION_STATES.REVIEW_REQUIRED), blocked: drafted.filter((r) => r.quality_status === EXPANSION_STATES.BLOCKED) };
}

function readCsv(path) { return parseCsv(readFileSync(path, "utf-8"), { columns: true, skip_empty_lines: true, relax_column_count: true }); }
function writeCsv(path, rows) { mkdirSync(dirname(path), { recursive: true }); if (!rows.length) { writeFileSync(path, "", "utf-8"); return; } writeFileSync(path, stringifyCsv(rows, { header: true }), "utf-8"); }

export function runEnrichment() {
  const dir = join(REPO_ROOT, "catalog", "expansion", "batch-003");
  const evidencePath = join(dir, "evidence.csv");
  if (!existsSync(evidencePath)) return { skipped: true, reason: "evidence.csv not present" };
  const routed = routeEvidence(readCsv(evidencePath));
  writeCsv(join(dir, "auto-ready.csv"), routed.autoReady); writeCsv(join(dir, "review-required.csv"), routed.reviewRequired); writeCsv(join(dir, "blocked.csv"), routed.blocked);
  const total = routed.drafted.length;
  const report = { total, auto_ready: routed.autoReady.length, review_required: routed.reviewRequired.length, blocked: routed.blocked.length, auto_preparation_yield: total ? routed.autoReady.length / total : null, human_review_burden: total ? routed.reviewRequired.length / total : null };
  writeFileSync(join(dir, "enrichment-report.json"), JSON.stringify(report, null, 2) + "\n", "utf-8"); return report;
}

if (isMainModule(import.meta.url)) console.log(JSON.stringify(runEnrichment(), null, 2));
