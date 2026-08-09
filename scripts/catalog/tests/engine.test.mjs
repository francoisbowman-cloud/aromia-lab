import test from "node:test";
import assert from "node:assert/strict";
import { buildCoverage, assessProvenance, scoreCandidate, selectCandidates } from "../engine.mjs";

const current = [
  { slug: "a", nombre: "Alpha EDP", marca: "Brand A", genero: "masculino", familia_olfativa: "amaderado", categoria_precio: "lujo", nicho_o_comercial: "nicho" },
  { slug: "b", nombre: "Beta EDT", marca: "Brand A", genero: "masculino", familia_olfativa: "amaderado", categoria_precio: "lujo", nicho_o_comercial: "nicho" },
  { slug: "c", nombre: "Gamma EDP", marca: "Brand B", genero: "femenino", familia_olfativa: "floral", categoria_precio: "premium", nicho_o_comercial: "comercial" },
];

function candidate(overrides = {}) {
  return {
    id: "x-1",
    brand: "Brand C",
    name: "Delta",
    concentration: "EDP",
    gender: "unisex",
    family: "cítrico",
    price_segment: "económico",
    source_url: "https://brand.example/delta",
    source_verified: "true",
    data_confidence: "high",
    launch_year: "2026",
    ...overrides,
  };
}

test("buildCoverage reads legacy Aromia columns", () => {
  const coverage = buildCoverage(current);
  assert.equal(coverage.total, 3);
  assert.equal(coverage.brand["brand a"], 2);
  assert.equal(coverage.family.amaderado, 2);
  assert.equal(coverage.gender.masculino, 2);
  assert.equal(coverage.price_segment.lujo, 2);
});

test("assessProvenance rewards valid verified multi-source evidence", () => {
  const result = assessProvenance(candidate({ source_url: "https://one.example/a;https://two.example/b" }));
  assert.equal(result.gate, "SOURCE_PRESENT");
  assert.equal(result.urls.length, 2);
  assert.ok(result.score >= 18);
});

test("source is a hard gate; confidence alone is never enough", () => {
  const coverage = buildCoverage(current);
  const scored = scoreCandidate(candidate({ source_url: "", data_confidence: "high" }), coverage);
  assert.equal(scored.eligible, false);
  assert.ok(scored.blocks.includes("SOURCE_REQUIRED"));
});

test("exact existing product is blocked while a distinct concentration remains eligible", () => {
  const coverage = buildCoverage(current);
  const existingKeys = new Set(["brand a|alpha|edp"]);
  const families = new Set(["brand a|alpha"]);
  const same = scoreCandidate(candidate({ brand: "Brand A", name: "Alpha", concentration: "EDP" }), coverage, existingKeys, families);
  const variant = scoreCandidate(candidate({ brand: "Brand A", name: "Alpha", concentration: "Parfum" }), coverage, existingKeys, families);
  assert.equal(same.eligible, false);
  assert.ok(same.blocks.includes("EXACT_PRODUCT_ALREADY_COVERED"));
  assert.equal(variant.eligible, true);
  assert.ok(variant.reasons.includes("RELATED_VARIANT"));
});

test("legacy names with embedded concentration dedupe against modern split fields", () => {
  const result = selectCandidates(
    [candidate({ brand: "Brand A", name: "Alpha", concentration: "EDP" })],
    current,
    1,
  );
  assert.equal(result.selected.length, 0);
  assert.equal(result.notSelected.length, 1);
  assert.ok(result.notSelected[0].blocks.includes("EXACT_PRODUCT_ALREADY_COVERED"));
});

test("gap candidate outranks another addition to an overrepresented segment", () => {
  const coverage = buildCoverage(current);
  const gap = scoreCandidate(candidate(), coverage);
  const crowded = scoreCandidate(candidate({ brand: "Brand A", family: "amaderado", gender: "masculino", price_segment: "lujo" }), coverage);
  assert.ok(gap.score > crowded.score, `${gap.score} should exceed ${crowded.score}`);
});

test("selection is greedy and updates coverage to avoid filling one gap repeatedly", () => {
  const pool = [
    candidate({ id: "1", name: "Citrus One" }),
    candidate({ id: "2", name: "Citrus Two" }),
    candidate({ id: "3", brand: "Brand D", name: "Green One", family: "verde", gender: "unisex", price_segment: "medio" }),
  ];
  const result = selectCandidates(pool, current, 2);
  assert.equal(result.selected.length, 2);
  assert.equal(new Set(result.selected.map((x) => x.candidate_key)).size, 2);
  assert.ok(result.selected.every((x) => x.eligible));
});

test("selection never silently accepts the same candidate twice", () => {
  const duplicate = candidate({ id: "1" });
  const result = selectCandidates([duplicate, { ...duplicate, id: "2" }], current, 10);
  assert.equal(result.selected.length, 1);
  assert.ok(result.notSelected.some((x) => x.blocks.includes("EXACT_PRODUCT_ALREADY_COVERED")));
});
