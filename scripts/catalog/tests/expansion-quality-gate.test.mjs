import test from "node:test";
import assert from "node:assert/strict";
import { computeConfidence, qualityGate } from "../expansion-engine.mjs";

test("official source cannot compensate for unresolved notes", () => {
  const confidence = computeConfidence({ identityConfirmed: true, officialSource: true, metadataFields: 5, relationUnambiguous: true });
  assert.ok(confidence.overall_confidence >= 0.82, "fixture must prove weighted score alone would pass");
  assert.deepEqual(qualityGate({ confidence, provenanceCount: 1 }), { state: "REVIEW_REQUIRED", reason: "notes_unresolved" });
});
