import test from "node:test";
import assert from "node:assert/strict";
import { evidenceToDraft, routeEvidence } from "../expansion-enrich.mjs";

const publication = {
  description: "Official fragrance description.",
  image_url: "https://cdn.brand.example/product.webp",
  image_source: "https://brand.example/product",
  seo_title: "Brand Alpha Eau de Parfum",
  seo_description: "Official fragrance description.",
};

test("official sourced pyramid with publication fields becomes AUTO_READY", () => {
  const row = evidenceToDraft({
    candidate_id: "x1", brand: "Brand", name: "Alpha", concentration: "EDP", gender: "unisex",
    source_url: "https://brand.example/alpha", identity_confirmed: "true", official_source: "true",
    top_notes: "bergamot", middle_notes: "iris", base_notes: "cedar", launch_year: "2020",
    perfumer: "A", country: "France", family: "woody", catalog_relation: "NEW", ...publication,
  });
  assert.equal(row.notes_structure, "PYRAMID");
  assert.equal(row.quality_status, "AUTO_READY");
  assert.equal(row.publication_complete, "true");
  assert.match(row.amazon_url, /amazon\.com\/s\?/);
});

test("confirmed source without published notes can still pass when publication-complete", () => {
  const row = evidenceToDraft({
    candidate_id: "x2", brand: "Brand", name: "Beta", concentration: "EDP", gender: "unisex",
    source_url: "https://brand.example/beta", identity_confirmed: "true", official_source: "true",
    source_does_not_publish_notes: "true", launch_year: "2021", perfumer: "B", country: "France", family: "woody", ...publication,
  });
  assert.equal(row.notes_structure, "UNKNOWN");
  assert.equal(row.quality_status, "AUTO_READY");
});

test("missing provenance routes to REVIEW_REQUIRED", () => {
  const row = evidenceToDraft({ candidate_id: "x3", brand: "Brand", name: "Gamma", concentration: "EDT", gender: "unisex", identity_confirmed: "true", official_source: "true", top_notes: "lemon", middle_notes: "sage", base_notes: "musk", ...publication });
  assert.equal(row.quality_status, "REVIEW_REQUIRED");
  assert.equal(row.quality_reason, "missing_provenance");
});

test("critical metadata missing cannot be AUTO_READY", () => {
  const row = evidenceToDraft({ candidate_id: "x5", brand: "Brand", name: "Epsilon", concentration: "EDP", source_url: "https://brand.example/epsilon", identity_confirmed: "true", official_source: "true", top_notes: "a", middle_notes: "b", base_notes: "c", launch_year: "2024", perfumer: "P", country: "France", family: "woody", ...publication });
  assert.equal(row.quality_status, "REVIEW_REQUIRED");
  assert.equal(row.quality_reason, "critical_metadata_missing:gender");
});

test("missing official image prevents AUTO_READY", () => {
  const row = evidenceToDraft({
    candidate_id: "x6", brand: "Brand", name: "Zeta", concentration: "EDP", gender: "unisex",
    source_url: "https://brand.example/zeta", identity_confirmed: "true", official_source: "true",
    top_notes: "a", middle_notes: "b", base_notes: "c", launch_year: "2024", perfumer: "P", country: "France", family: "woody",
    description: "Description", seo_title: "Zeta", seo_description: "Description",
  });
  assert.equal(row.quality_status, "REVIEW_REQUIRED");
  assert.match(row.quality_reason, /^publication_metadata_missing:/);
  assert.match(row.publication_gaps, /image_url/);
});

test("associate tag activates generated Amazon affiliate link", () => {
  const row = evidenceToDraft({
    candidate_id: "x7", brand: "Brand", name: "Eta", concentration: "EDP", gender: "unisex",
    source_url: "https://brand.example/eta", identity_confirmed: "true", official_source: "true",
    top_notes: "a", middle_notes: "b", base_notes: "c", launch_year: "2024", perfumer: "P", country: "France", family: "woody", ...publication,
  }, { associateTag: "aromia-20" });
  assert.equal(row.affiliate_status, "active");
  assert.match(row.amazon_url, /tag=aromia-20/);
});

test("blocking conflict routes to BLOCKED", () => {
  const { blocked } = routeEvidence([{ candidate_id: "x4", brand: "Brand", name: "Delta", concentration: "EDP", gender: "unisex", source_url: "https://x.example", identity_confirmed: "true", official_source: "true", top_notes: "a", middle_notes: "b", base_notes: "c", blocking_conflict: "true", ...publication }]);
  assert.equal(blocked.length, 1);
  assert.equal(blocked[0].quality_reason, "blocking_conflict");
});
