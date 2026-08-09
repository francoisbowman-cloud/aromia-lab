import test from "node:test";
import assert from "node:assert/strict";
import { toCatalogBatchRow, buildBatch } from "../expansion-batch-builder.mjs";

test("AUTO_READY row becomes import-compatible draft without production id semantics", () => {
  const row = toCatalogBatchRow({
    candidate_id: "c026", brand: "Jean Paul Gaultier", name: "Le Male Elixir", concentration: "Parfum", gender: "masculino",
    family: "woody aromatic amber", top_notes: "Lavender", middle_notes: "Tonka Bean", base_notes: "Benzoin",
    notes_status: "published", source_url: "https://example.test/le-male", overall_confidence: "0.97", price_status: "unverified",
    catalog_relation: "RELATED_VARIANT", quality_status: "AUTO_READY", quality_reason: "confidence_gate_pass",
  }, "2026-08-08");
  assert.equal(row.id, "c026");
  assert.equal(row.status, "draft");
  assert.equal(row.source_verified, "true");
  assert.equal(row.data_confidence, "high");
  assert.equal(row.notes_status, "published");
  assert.equal(row.catalog_relation, "RELATED_VARIANT");
  assert.match(row.slug, /^jean-paul-gaultier-le-male-elixir-parfum$/);
});

test("builder refuses REVIEW_REQUIRED rows", () => {
  assert.throws(() => toCatalogBatchRow({ candidate_id: "x", quality_status: "REVIEW_REQUIRED" }), /Only AUTO_READY/);
});

test("builder refuses duplicate trace ids", () => {
  const base = { candidate_id: "x", brand: "A", name: "B", concentration: "EDP", gender: "unisex", top_notes: "a", notes_status: "published", source_url: "https://a.test", overall_confidence: 1, quality_status: "AUTO_READY" };
  assert.throws(() => buildBatch([base, base], "2026-08-08"), /Duplicate Batch 003 trace id/);
});
