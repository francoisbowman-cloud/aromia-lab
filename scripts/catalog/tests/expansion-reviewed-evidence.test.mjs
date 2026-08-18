import test from "node:test";
import assert from "node:assert/strict";
import { applyReviewedEvidence } from "../expansion-reviewed-evidence.mjs";

function fixture() {
  return {
    evidence: [{ candidate_id: "c001", brand: "Maison Test", name: "Alpha Homme", concentration: "EDP", gender: "", identity_confirmed: "true", official_source: "true", source_url: "https://maison.test/alpha-homme", top_notes: "Old", middle_notes: "", base_notes: "", family: "bad scraped prose", image_url: "https://maison.test/gift-set.jpg", image_source: "https://maison.test/gift-set", seo_title: "Gift Set", notes_structure: "PARTIAL" }],
    manifest: [{ candidate_id: "c001", brand: "Maison Test", name: "Alpha Homme", concentration: "EDP", official_domain: "maison.test" }],
    secondary: [{ candidate_id: "c001", source_url: "https://www.fragrantica.com/perfume/Maison-Test/Alpha-Homme-12345.html" }],
  };
}

function patch(overrides = {}) {
  return { candidate_id: "c001", brand: "Maison Test", name: "Alpha Homme", source_url: "https://maison.test/products/alpha-homme", source_kind: "official", source_mode: "append", gender: "masculino", launch_year: "2024", top_notes: "Citrus", middle_notes: "Iris", base_notes: "Cedar", accords: "", notes_mode: "replace", clear_fields: "family", review_note: "manual verification", ...overrides };
}

test("reviewed evidence can fill critical metadata and replace a verified complete pyramid", () => {
  const f = fixture();
  const { rows, audit } = applyReviewedEvidence(f.evidence, f.manifest, [patch()], f.secondary);
  assert.equal(rows[0].gender, "masculino");
  assert.equal(rows[0].launch_year, "2024");
  assert.equal(rows[0].top_notes, "Citrus");
  assert.equal(rows[0].middle_notes, "Iris");
  assert.equal(rows[0].base_notes, "Cedar");
  assert.equal(rows[0].notes_structure, "PYRAMID");
  assert.equal(rows[0].family, "");
  assert.match(rows[0].source_url, /maison\.test\/products\/alpha-homme/);
  assert.equal(rows[0].reviewed_evidence, "true");
  assert.equal(audit.length, 1);
});

test("reviewed evidence refuses identity mismatch", () => {
  const f = fixture();
  assert.throws(() => applyReviewedEvidence(f.evidence, f.manifest, [patch({ name: "Alpha Femme" })], f.secondary), /identity_mismatch/);
});

test("official reviewed evidence must stay on the candidate official domain", () => {
  const f = fixture();
  assert.throws(() => applyReviewedEvidence(f.evidence, f.manifest, [patch({ source_url: "https://example.com/alpha-homme" })], f.secondary), /official_host_mismatch/);
});

test("trusted secondary evidence must be both trusted and pre-curated for the candidate", () => {
  const f = fixture();
  const p = patch({ source_kind: "trusted_secondary", source_url: "https://www.fragrantica.com/perfume/Maison-Test/Other-999.html" });
  assert.throws(() => applyReviewedEvidence(f.evidence, f.manifest, [p], f.secondary), /secondary_not_curated/);
});

test("a note replacement fails closed unless top heart and base are all reviewed", () => {
  const f = fixture();
  assert.throws(() => applyReviewedEvidence(f.evidence, f.manifest, [patch({ base_notes: "" })], f.secondary), /complete_pyramid/);
});

test("reviewed evidence cannot silently overwrite conflicting gender", () => {
  const f = fixture();
  f.evidence[0].gender = "femenino";
  assert.throws(() => applyReviewedEvidence(f.evidence, f.manifest, [patch()], f.secondary), /gender_conflict/);
});

test("only explicitly safe publication fields can be cleared", () => {
  const f = fixture();
  assert.throws(() => applyReviewedEvidence(f.evidence, f.manifest, [patch({ clear_fields: "concentration" })], f.secondary), /clear_field_forbidden/);
});

test("replace source mode removes weaker provenance while preserving identity confirmation", () => {
  const f = fixture();
  const { rows } = applyReviewedEvidence(f.evidence, f.manifest, [patch({ source_mode: "replace", clear_fields: "image_url;image_source;seo_title" })], f.secondary);
  assert.equal(rows[0].source_url, "https://maison.test/products/alpha-homme");
  assert.equal(rows[0].image_url, "");
  assert.equal(rows[0].image_source, "");
  assert.equal(rows[0].seo_title, "");
  assert.equal(rows[0].identity_confirmed, "true");
});
