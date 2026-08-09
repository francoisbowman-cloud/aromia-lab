import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { diffBatch } from "../diff.mjs";

function tmpFile(name, content) {
  const dir = mkdtempSync(join(tmpdir(), "aromia-catalog-test-"));
  const file = join(dir, name);
  writeFileSync(file, content, "utf-8");
  return file;
}

const BATCH_HEADER =
  "id,slug,brand,name,concentration,gender,family,subfamily,launch_year,perfumer,country,description,top_notes,heart_notes,base_notes,accords,season,occasion,longevity,sillage,price_segment,amazon_url,source_url,image_url,image_source,affiliate_status,source_verified,data_confidence,visual_quality,review_status,seo_title,seo_description,status,created_at,updated_at";

function batchRow(overrides = {}) {
  const base = {
    id: "cw-001", slug: "dior-sauvage-edt", brand: "Dior", name: "Sauvage", concentration: "EDT",
    gender: "masculino", family: "amaderada-aromatica", subfamily: "", launch_year: "2015", perfumer: "",
    country: "", description: "", topNotes: "bergamota", heartNotes: "geranio", baseNotes: "ambroxan",
    accords: "", season: "", occasion: "", longevity: "", sillage: "", price: "premium", amazon: "",
    source: "https://source.example/x", image: "https://img.example/x.jpg", imgSrc: "", affiliate: "",
    verified: "", confidence: "", quality: "", review: "", seoTitle: "", seoDesc: "", status: "draft",
    createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z",
  };
  const f = { ...base, ...overrides };
  return [
    f.id, f.slug, f.brand, f.name, f.concentration, f.gender, f.family, f.subfamily, f.launch_year,
    f.perfumer, f.country, f.description, f.topNotes, f.heartNotes, f.baseNotes, f.accords, f.season,
    f.occasion, f.longevity, f.sillage, f.price, f.amazon, f.source, f.image, f.imgSrc, f.affiliate,
    f.verified, f.confidence, f.quality, f.review, f.seoTitle, f.seoDesc, f.status, f.createdAt, f.updatedAt,
  ].join(",");
}

function emptyMaster() {
  return tmpFile("master.csv", `${BATCH_HEADER}\n`);
}

function emptyCurrent() {
  return tmpFile("current.csv", "slug,nombre,marca\n");
}

test("sin master ni catálogo actual con datos -> NEW", () => {
  const batch = tmpFile("batch.csv", `${BATCH_HEADER}\n${batchRow()}\n`);
  const { report } = diffBatch(batch, { masterCsvPath: emptyMaster(), currentCsvPath: emptyCurrent() });
  assert.equal(report.counts.NEW, 1);
  assert.equal(report.rows[0].status, "NEW");
});

test("fila idéntica a una del master -> UNCHANGED", () => {
  const batch = tmpFile("batch.csv", `${BATCH_HEADER}\n${batchRow()}\n`);
  const master = tmpFile("master.csv", `${BATCH_HEADER}\n${batchRow()}\n`);
  const { report } = diffBatch(batch, { masterCsvPath: master, currentCsvPath: emptyCurrent() });
  assert.equal(report.rows[0].status, "UNCHANGED");
});

test("mismo producto con un campo distinto (no image_url) -> UPDATED con fieldDiffs", () => {
  const batch = tmpFile("batch.csv", `${BATCH_HEADER}\n${batchRow({ description: "Nueva descripción" })}\n`);
  const master = tmpFile("master.csv", `${BATCH_HEADER}\n${batchRow({ description: "Descripción vieja" })}\n`);
  const { report } = diffBatch(batch, { masterCsvPath: master, currentCsvPath: emptyCurrent() });
  assert.equal(report.rows[0].status, "UPDATED");
  assert.ok(report.rows[0].fieldDiffs.some((d) => d.field === "description"));
});

test("mismo producto con image_url distinto -> CONFLICT, no se autoaprueba el cambio", () => {
  const batch = tmpFile("batch.csv", `${BATCH_HEADER}\n${batchRow({ image: "https://img.example/NEW.jpg" })}\n`);
  const master = tmpFile("master.csv", `${BATCH_HEADER}\n${batchRow({ image: "https://img.example/OLD.jpg" })}\n`);
  const { report } = diffBatch(batch, { masterCsvPath: master, currentCsvPath: emptyCurrent() });
  assert.equal(report.rows[0].status, "CONFLICT");
  assert.match(report.rows[0].reason, /image_url/);
});

test("slug ya usado por otro producto en master -> CONFLICT (slug_collision_master)", () => {
  const batch = tmpFile("batch.csv", `${BATCH_HEADER}\n${batchRow({ id: "cw-002", brand: "Chanel", name: "Bleu", topNotes: "citrico" })}\n`);
  const master = tmpFile("master.csv", `${BATCH_HEADER}\n${batchRow()}\n`); // mismo slug 'dior-sauvage-edt', producto distinto
  const { report } = diffBatch(batch, { masterCsvPath: master, currentCsvPath: emptyCurrent() });
  assert.equal(report.rows[0].status, "CONFLICT");
  assert.equal(report.rows[0].quality_status, "REVIEW_REQUIRED");
  assert.equal(report.rows[0].source, "slug_collision_master");
});

test("F3.6 — mismo brand+nombre base en el catálogo actual PERO sin concentración verificable (ej. 'Eros' sin sufijo) -> RELATED_VARIANT, aprobado como NEW, no bloquea", () => {
  const batch = tmpFile("batch.csv", `${BATCH_HEADER}\n${batchRow({ concentration: "Parfum" })}\n`);
  const current = tmpFile("current.csv", "slug,nombre,marca\nsauvage-dior-v1,Sauvage,Dior\n"); // sin sufijo de concentración
  const { report } = diffBatch(batch, { masterCsvPath: emptyMaster(), currentCsvPath: current });
  assert.equal(report.rows[0].catalog_relation, "RELATED_VARIANT");
  assert.equal(report.rows[0].status, "NEW");
  assert.ok(["CATALOG_READY", "CATALOG_READY_WITH_PENDING"].includes(report.rows[0].quality_status));
});

test("F3.6 — mismo brand+nombre base y MISMA concentración confirmada en el catálogo actual -> POSSIBLE_DUPLICATE, requiere revisión", () => {
  const batch = tmpFile("batch.csv", `${BATCH_HEADER}\n${batchRow({ concentration: "EDP" })}\n`);
  const current = tmpFile("current.csv", "slug,nombre,marca\nsauvage-edp,Sauvage EDP,Dior\n"); // concentración embebida en nombre, MISMA que el batch
  const { report } = diffBatch(batch, { masterCsvPath: emptyMaster(), currentCsvPath: current });
  assert.equal(report.rows[0].catalog_relation, "POSSIBLE_DUPLICATE");
  assert.equal(report.rows[0].quality_status, "REVIEW_REQUIRED");
  assert.equal(report.rows[0].status, "CONFLICT");
  assert.equal(report.rows[0].source, "current_catalog_same_concentration");
});

test("fila con error de validación -> REJECTED en el diff, no se propone", () => {
  // concentration ya NO es un enum cerrado (ver catalog.schema.json — batch-001
  // real trajo 'Parfum Cologne' de Roja Parfums), así que un valor libre ahí
  // ya no dispara un error bloqueante. gender sigue siendo un enum cerrado
  // (masculino/femenino/unisex) — sirve para forzar un error real.
  const batch = tmpFile("batch.csv", `${BATCH_HEADER}\n${batchRow({ gender: "NOT-A-REAL-GENDER" })}\n`);
  const { report } = diffBatch(batch, { masterCsvPath: emptyMaster(), currentCsvPath: emptyCurrent() });
  assert.equal(report.rows[0].status, "REJECTED");
  assert.equal(report.rows[0].quality_status, "REJECTED");
  assert.match(report.rows[0].reason, /errores de validación/);
});

test("concentración fuera del set canónico (ej. nomenclatura propia de una casa de nicho) -> NO bloquea, sigue siendo aprobable", () => {
  const batch = tmpFile("batch.csv", `${BATCH_HEADER}\n${batchRow({ concentration: "Parfum Cologne" })}\n`);
  const { report } = diffBatch(batch, { masterCsvPath: emptyMaster(), currentCsvPath: emptyCurrent() });
  assert.equal(report.rows[0].status, "NEW");
});

test("CSV crudo mal formado -> fatal:true, no lanza excepción", () => {
  const batch = tmpFile("batch.csv", `${BATCH_HEADER}\n"unterminated`);
  const { fatal } = diffBatch(batch, { masterCsvPath: emptyMaster(), currentCsvPath: emptyCurrent() });
  assert.equal(fatal, true);
});
