import test from "node:test";
import assert from "node:assert/strict";
import {
  EXPANSION_STATES,
  buildKnownUniverse,
  classifyCandidate,
  selectCandidates,
  computeConfidence,
  qualityGate,
  metrics,
  identityParts,
} from "../expansion-engine.mjs";

test("identity normalization folds accents and concentration aliases", () => {
  assert.deepEqual(identityParts({ brand: "Hermès", name: "Terre d'Hermès", concentration: "eau de toilette" }), {
    brand: "hermes", name: "terre d hermes", concentration: "edt",
  });
});

test("exact known identity is blocked, same family different concentration is related variant", () => {
  const universe = buildKnownUniverse({ batchRows: [{ brand: "Brand", name: "Alpha", concentration: "EDT" }] });
  assert.deepEqual(classifyCandidate({ brand: "Brand", name: "Alpha", concentration: "EDT" }, universe), { relation: "EXISTING", state: EXPANSION_STATES.BLOCKED });
  assert.deepEqual(classifyCandidate({ brand: "Brand", name: "Alpha", concentration: "EDP" }, universe), { relation: "RELATED_VARIANT", state: EXPANSION_STATES.AUTO_READY });
});

test("known family without concentration fails closed as ambiguous variant", () => {
  const universe = buildKnownUniverse({ batchRows: [{ brand: "Brand", name: "Alpha", concentration: "EDT" }] });
  assert.deepEqual(classifyCandidate({ brand: "Brand", name: "Alpha", concentration: "" }, universe), { relation: "AMBIGUOUS_VARIANT", state: EXPANSION_STATES.BLOCKED });
});

test("candidate selector never emits duplicate identities and respects limit", () => {
  const universe = buildKnownUniverse();
  const pool = [
    { candidate_id: "1", brand: "A", name: "One", concentration: "EDP", stratum: "mainstream", priority: 100, official_domain: "a.test" },
    { candidate_id: "2", brand: "A", name: "One", concentration: "EDP", stratum: "mainstream", priority: 99, official_domain: "a.test" },
    { candidate_id: "3", brand: "B", name: "Two", concentration: "EDT", stratum: "niche", priority: 98, official_domain: "b.test" },
    { candidate_id: "4", brand: "C", name: "Three", concentration: "Parfum", stratum: "hard_case", priority: 97, official_domain: "c.test" },
  ];
  const { selected } = selectCandidates(pool, universe, { limit: 3, quotas: { mainstream: 1, niche: 1, hard_case: 1 } });
  assert.equal(selected.length, 3);
  assert.equal(new Set(selected.map((r) => `${r.brand}/${r.name}/${r.concentration}`)).size, 3);
});

test("confidence is explainable and official evidence passes AUTO_READY threshold", () => {
  const confidence = computeConfidence({ identityConfirmed: true, officialSource: true, notesPublished: true, metadataFields: 5, relationUnambiguous: true });
  assert.equal(confidence.overall_confidence, 1);
  assert.ok(confidence.confidence_reasons.includes("official_source"));
  assert.deepEqual(qualityGate({ confidence, provenanceCount: 1 }), { state: EXPANSION_STATES.AUTO_READY, reason: "confidence_gate_pass" });
});

test("SOURCE_DOES_NOT_PUBLISH equivalent is not automatically rejected", () => {
  const confidence = computeConfidence({ identityConfirmed: true, officialSource: true, notesUnavailableConfirmed: true, metadataFields: 4, relationUnambiguous: true });
  assert.ok(confidence.notes_confidence >= 0.8);
  assert.equal(qualityGate({ confidence, provenanceCount: 1 }).state, EXPANSION_STATES.AUTO_READY);
});

test("ambiguous relation routes to human review instead of destructive dedup", () => {
  const confidence = computeConfidence({ identityConfirmed: true, officialSource: true, notesPublished: true, metadataFields: 5, relationUnambiguous: false });
  assert.deepEqual(qualityGate({ confidence, provenanceCount: 1 }), { state: EXPANSION_STATES.REVIEW_REQUIRED, reason: "ambiguous_relation" });
});

test("missing provenance cannot be AUTO_READY", () => {
  const confidence = computeConfidence({ identityConfirmed: true, officialSource: true, notesPublished: true, metadataFields: 5 });
  assert.deepEqual(qualityGate({ confidence, provenanceCount: 0 }), { state: EXPANSION_STATES.REVIEW_REQUIRED, reason: "missing_provenance" });
});

test("human review burden is measured separately", () => {
  const report = metrics([{ state: "AUTO_READY" }, { state: "AUTO_READY" }, { state: "REVIEW_REQUIRED" }, { state: "BLOCKED" }]);
  assert.equal(report.autoPreparationYield, 0.5);
  assert.equal(report.humanReviewBurden, 0.25);
  assert.equal(report.blockedRate, 0.25);
});
