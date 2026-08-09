import test from "node:test";
import assert from "node:assert/strict";
import { evidenceToDraft, routeEvidence } from "../expansion-enrich.mjs";

test("official sourced pyramid becomes AUTO_READY", () => {
  const row = evidenceToDraft({
    candidate_id: "x1", brand: "Brand", name: "Alpha", concentration: "EDP", gender: "unisex",
    source_url: "https://brand.example/alpha", identity_confirmed: "true", official_source: "true",
    top_notes: "bergamot", middle_notes: "iris", base_notes: "cedar", launch_year: "2020",
    perfumer: "A", country: "France", family: "woody", catalog_relation: "NEW",
  });
  assert.equal(row.notes_structure, "PYRAMID");
  assert.equal(row.quality_status, "AUTO_READY");
});

test("confirmed source without published notes can still pass", () => {
  const row = evidenceToDraft({
    candidate_id: "x2", brand: "Brand", name: "Beta", concentration: "EDP", gender: "unisex",
    source_url: "https://brand.example/beta", identity_confirmed: "true", official_source: "true",
    source_does_not_publish_notes: "true", launch_year: "2021", perfumer: "B", country: "France", family: "woody",
  });
  assert.equal(row.notes_structure, "UNKNOWN");
  assert.equal(row.quality_status, "AUTO_READY");
});

test("missing provenance routes to REVIEW_REQUIRED", () => {
  const row = evidenceToDraft({ candidate_id: "x3", brand: "Brand", name: "Gamma", concentration: "EDT", identity_confirmed: "true", official_source: "true", top_notes: "lemon", middle_notes: "sage", base_notes: "musk" });
  assert.equal(row.quality_status, "REVIEW_REQUIRED");
  assert.equal(row.quality_reason, "missing_provenance");
});

test("blocking conflict routes to BLOCKED", () => {
  const { blocked } = routeEvidence([{ candidate_id: "x4", brand: "Brand", name: "Delta", concentration: "EDP", source_url: "https://x.example", identity_confirmed: "true", official_source: "true", top_notes: "a", middle_notes: "b", base_notes: "c", blocking_conflict: "true" }]);
  assert.equal(blocked.length, 1);
  assert.equal(blocked[0].quality_reason, "blocking_conflict");
});
