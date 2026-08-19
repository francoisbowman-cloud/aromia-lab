import test from "node:test";
import assert from "node:assert/strict";
import { evidenceToDraft } from "../expansion-enrich.mjs";

function evidence(overrides = {}) {
  return {
    candidate_id: "c-test",
    slug: "brand-product-edp",
    brand: "Brand",
    name: "Product",
    concentration: "EDP",
    gender: "unisex",
    launch_year: "2024",
    identity_confirmed: "true",
    official_source: "true",
    source_url: "https://brand.example/product",
    relation_ambiguous: "false",
    top_notes: "Bergamot",
    middle_notes: "Iris",
    base_notes: "Cedar",
    accords: "",
    ...overrides,
  };
}

test("PARTIAL note evidence can never become AUTO_READY for an importable expansion batch", () => {
  const row = evidenceToDraft(evidence({ base_notes: "" }));
  assert.equal(row.notes_structure, "PARTIAL");
  assert.equal(row.quality_status, "REVIEW_REQUIRED");
  assert.equal(row.quality_reason, "import_notes_incomplete:partial");
});

test("FLAT note evidence can never become AUTO_READY for an importable expansion batch", () => {
  const row = evidenceToDraft(evidence({ top_notes: "", middle_notes: "", base_notes: "", accords: "Bergamot;Iris;Cedar" }));
  assert.equal(row.notes_structure, "FLAT");
  assert.equal(row.quality_status, "REVIEW_REQUIRED");
  assert.equal(row.quality_reason, "import_notes_incomplete:flat");
});
