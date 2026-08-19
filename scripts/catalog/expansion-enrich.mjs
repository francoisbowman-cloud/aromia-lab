import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { parse as parseCsv } from "csv-parse/sync";
import { stringify as stringifyCsv } from "csv-stringify/sync";
import { REPO_ROOT, classifyNoteStructure, derivePriceStatus, isMainModule } from "./lib.mjs";
import { clean, computeConfidence, qualityGate, EXPANSION_STATES } from "./expansion-engine.mjs";
import { publicationMetadata, publicationGaps } from "./commerce-enrichment.mjs";

function splitList(value) { return clean(value) ? clean(value).split(";").map((x) => x.trim()).filter(Boolean) : []; }

export function evidenceToDraft(row, options = {}) {
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
  if (gate.state === EXPANSION_STATES.AUTO_READY && notesStructure !== "PYRAMID") gate = { state: EXPANSION_STATES.REVIEW_REQUIRED, reason: `import_notes_incomplete:${notesStructure.toLowerCase()}` };

  const publication = publicationMetadata({ ...row, ...critical }, options);
  const pubGaps = publicationGaps(publication);
  if (gate.state === EXPANSION_STATES.AUTO_READY && pubGaps.length) {
    gate = { state: EXPANSION_STATES.REVIEW_REQUIRED, reason: `publication_metadata_missing:${pubGaps.join("|")}` };
  }

  return {
    candidate_id: clean(row.candidate_id), slug: clean(row.slug), ...critical,
    family: clean(row.family), launch_year: clean(row.launch_year), perfumer: clean(row.perfumer), country: clean(row.country),
    description: publication.description,
    top_notes: top.join(";"), middle_notes: middle.join(";"), base_notes: base.join(";"), accords: accords.join(";"),
    notes_status: notesStatus,
    price_segment: clean(row.price_segment), price_status: derivePriceStatus(clean(row.price_segment)), source_url: sourceUrls.join(";"),
    image_url: publication.image_url, image_source: publication.image_source,
    amazon_url: publication.amazon_url, affiliate_status: publication.affiliate_status, visual_quality: publication.visual_quality,
    seo_title: publication.seo_title, seo_description: publication.seo_description,
    notes_structure: notesStructure, catalog_relation: clean(row.catalog_relation) || "NEW", quality_status: gate.state, quality_reason: gate.reason,
    publication_complete: pubGaps.length ? "false" : "true", publication_gaps: pubGaps.join(";"),
    overall_confidence: confidence.overall_confidence, identity_confidence: confidence.identity_confidence, source_confidence: confidence.source_confidence,
    notes_confidence: confidence.notes_confidence, metadata_confidence: confidence.metadata_confidence, relation_confidence: confidence.relation_confidence,
    confidence_reasons: confidence.confidence_reasons.join(";"), confidence_penalties: confidence.confidence_penalties.join(";"),
  };
}

export function routeEvidence(rows, options = {}) {
  const drafted = rows.map((row) => evidenceToDraft(row, options));
  return { drafted, autoReady: drafted.filter((r) => r.quality_status === EXPANSION_STATES.AUTO_READY), reviewRequired: drafted.filter((r) => r.quality_status === EXPANSION_STATES.REVIEW_REQUIRED), blocked: drafted.filter((r) => r.quality_status === EXPANSION_STATES.BLOCKED) };
}

function readCsv(path) { return parseCsv(readFileSync(path, "utf-8"), { columns: true, skip_empty_lines: true, relax_column_count: true }); }
function writeCsv(path, rows) { mkdirSync(dirname(path), { recursive: true }); if (!rows.length) { writeFileSync(path, "", "utf-8"); return; } writeFileSync(path, stringifyCsv(rows, { header: true }), "utf-8"); }

export function resolveEvidencePath(dir) {
  const manual = join(dir, "evidence.csv");
  const automated = join(dir, "evidence.auto.csv");
  if (existsSync(manual)) return { path: manual, source: "manual_override" };
  if (existsSync(automated)) return { path: automated, source: "automated_harvest" };
  return null;
}

export function runEnrichment(options = {}) {
  const dir = join(REPO_ROOT, "catalog", "expansion", "batch-003");
  const resolved = resolveEvidencePath(dir);
  if (!resolved) return { skipped: true, reason: "no evidence.csv or evidence.auto.csv present" };
  const routed = routeEvidence(readCsv(resolved.path), options);
  writeCsv(join(dir, "auto-ready.csv"), routed.autoReady); writeCsv(join(dir, "review-required.csv"), routed.reviewRequired); writeCsv(join(dir, "blocked.csv"), routed.blocked);
  const total = routed.drafted.length;
  const reviewReasons = {};
  for (const row of routed.reviewRequired) reviewReasons[row.quality_reason] = (reviewReasons[row.quality_reason] ?? 0) + 1;
  const penaltyCounts = {};
  for (const row of routed.reviewRequired) for (const penalty of splitList(row.confidence_penalties)) penaltyCounts[penalty] = (penaltyCounts[penalty] ?? 0) + 1;
  const publicationComplete = routed.drafted.filter((r) => r.publication_complete === "true").length;
  const imageComplete = routed.drafted.filter((r) => clean(r.image_url)).length;
  const affiliateActive = routed.drafted.filter((r) => r.affiliate_status === "active").length;
  const report = {
    evidence_source: resolved.source,
    total,
    auto_ready: routed.autoReady.length,
    review_required: routed.reviewRequired.length,
    blocked: routed.blocked.length,
    auto_preparation_yield: total ? routed.autoReady.length / total : null,
    human_review_burden: total ? routed.reviewRequired.length / total : null,
    publication_complete: publicationComplete,
    publication_completion_yield: total ? publicationComplete / total : null,
    image_complete: imageComplete,
    image_completion_yield: total ? imageComplete / total : null,
    affiliate_active: affiliateActive,
    affiliate_activation_yield: total ? affiliateActive / total : null,
    affiliate_configuration_present: Boolean(options.associateTag ?? process.env.AROMIA_AMAZON_ASSOCIATE_TAG),
    review_reasons: reviewReasons,
    review_penalties: penaltyCounts,
  };
  writeFileSync(join(dir, "enrichment-report.json"), JSON.stringify(report, null, 2) + "\n", "utf-8"); return report;
}

if (isMainModule(import.meta.url)) console.log(JSON.stringify(runEnrichment(), null, 2));
