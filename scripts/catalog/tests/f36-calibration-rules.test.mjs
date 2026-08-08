// F3.6 — reglas generales de calibración. Todo acá debe seguir siendo
// cierto si se renombran/cambian los slugs de cualquier batch — ninguna
// aserción depende de un slug o marca puntual (salvo el bloque de
// regresión contra el batch-001 real, al final, que es deliberadamente
// un fixture de regresión, no lógica operacional).
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { diffBatch } from "../diff.mjs";
import { validateBatch } from "../validate.mjs";
import { readCsv, ENRICHMENT_FIELDS, extractConcentrationFromName, IMPORTS_DIR } from "../lib.mjs";

const BATCH_001_PATH = join(IMPORTS_DIR, "batch-001.csv");

function tmpFile(name, content) {
  const dir = mkdtempSync(join(tmpdir(), "aromia-catalog-test-"));
  const file = join(dir, name);
  writeFileSync(file, content, "utf-8");
  return file;
}

const HEADER =
  "id,slug,brand,name,concentration,gender,family,subfamily,launch_year,perfumer,country,description,top_notes,heart_notes,base_notes,accords,season,occasion,longevity,sillage,price_segment,amazon_url,source_url,image_url,image_source,affiliate_status,source_verified,data_confidence,visual_quality,review_status,seo_title,seo_description,status,created_at,updated_at";

function row(overrides = {}) {
  const base = {
    id: "1", slug: "", brand: "Chanel", name: "No.5", concentration: "EDP", gender: "femenino",
    family: "floral-aldehido", subfamily: "", launchYear: "1986", perfumer: "", country: "",
    description: "", topNotes: "aldehidos", heartNotes: "iris", baseNotes: "sandalo", accords: "",
    season: "pending", occasion: "pending", longevity: "pending", sillage: "pending",
    priceSegment: "lujo", amazonUrl: "pending", sourceUrl: "https://source.example/a",
    imageUrl: "pending", imageSource: "pending", affiliate: "no-applicable", verified: "true",
    confidence: "high", quality: "not-audited", review: "pending", seoTitle: "", seoDesc: "",
    status: "draft", createdAt: "", updatedAt: "",
  };
  const f = { ...base, ...overrides };
  return [
    f.id, f.slug, f.brand, f.name, f.concentration, f.gender, f.family, f.subfamily, f.launchYear,
    f.perfumer, f.country, f.description, f.topNotes, f.heartNotes, f.baseNotes, f.accords, f.season,
    f.occasion, f.longevity, f.sillage, f.priceSegment, f.amazonUrl, f.sourceUrl, f.imageUrl,
    f.imageSource, f.affiliate, f.verified, f.confidence, f.quality, f.review, f.seoTitle, f.seoDesc,
    f.status, f.createdAt, f.updatedAt,
  ].join(",");
}

function emptyMaster() {
  return tmpFile("master.csv", `${HEADER}\n`);
}
function emptyCurrent() {
  return tmpFile("current.csv", "slug,nombre,marca\n");
}

// --- Regla general: source_url es una colección, no un valor único ---

test("source_url con múltiples URLs separadas por ';' valida sin error (regla general, no una excepción de una fila)", () => {
  const file = tmpFile("batch.csv", `${HEADER}\n${row({ sourceUrl: "https://a.example/x;https://b.example/y" })}\n`);
  const { report } = validateBatch(file);
  assert.equal(report.rows[0].level === "error", false);
});

test("source_url con una URL inválida entre varias válidas SÍ bloquea (cada item se valida individualmente)", () => {
  const file = tmpFile("batch.csv", `${HEADER}\n${row({ sourceUrl: "https://a.example/x;no-es-una-url" })}\n`);
  const { report } = validateBatch(file);
  assert.equal(report.rows[0].level, "error");
});

test("source_url vacío/pending sigue bloqueando (sigue siendo un campo crítico requerido)", () => {
  const file = tmpFile("batch.csv", `${HEADER}\n${row({ sourceUrl: "pending" })}\n`);
  const { report } = validateBatch(file);
  assert.equal(report.rows[0].level, "error");
});

// --- Regla general: enrichment fields nunca bloquean ni fuerzan revisión ---

test("ENRICHMENT_FIELDS son exactamente season/occasion/longevity/sillage", () => {
  assert.deepEqual([...ENRICHMENT_FIELDS].sort(), ["longevity", "occasion", "season", "sillage"]);
});

test("los 4 enrichment fields pending simultáneamente -> CATALOG_READY_WITH_PENDING, nunca REVIEW_REQUIRED ni REJECTED", () => {
  const batch = tmpFile("batch.csv", `${HEADER}\n${row()}\n`); // ya trae los 4 en pending por defecto
  const { report } = diffBatch(batch, { masterCsvPath: emptyMaster(), currentCsvPath: emptyCurrent() });
  assert.equal(report.rows[0].quality_status, "CATALOG_READY_WITH_PENDING");
  assert.equal(report.rows[0].status, "NEW");
});

test("fila 100% completa (sin ningún campo pending) -> CATALOG_READY, no WITH_PENDING", () => {
  const batch = tmpFile(
    "batch.csv",
    `${HEADER}\n${row({
      subfamily: "warm", perfumer: "X", country: "Francia", description: "d",
      accords: "floral", season: "spring", occasion: "diario", longevity: "long", sillage: "moderate",
      amazonUrl: "https://a.example/buy", imageUrl: "https://a.example/img.jpg", imageSource: "researcher",
      review: "pending", seoTitle: "t", seoDesc: "d", slug: "chanel-no5-edp-full", createdAt: "2026-01-01", updatedAt: "2026-01-01",
    })}\n`
  );
  const { report } = diffBatch(batch, { masterCsvPath: emptyMaster(), currentCsvPath: emptyCurrent() });
  // review_status='pending' es un valor de enum legítimo (no sentinel) — no debería contar como "pending field".
  assert.equal(report.rows[0].quality_status, "CATALOG_READY");
});

// --- Regla general: precio en conflicto (price_segment pending) no bloquea ni fuerza excepción por sí solo ---

test("price_segment pending (campo no crítico) no baja de CATALOG_READY_WITH_PENDING ni fuerza REVIEW_REQUIRED por sí solo", () => {
  const batch = tmpFile("batch.csv", `${HEADER}\n${row({ priceSegment: "pending" })}\n`);
  const { report } = diffBatch(batch, { masterCsvPath: emptyMaster(), currentCsvPath: emptyCurrent() });
  assert.equal(report.rows[0].quality_status, "CATALOG_READY_WITH_PENDING");
  assert.notEqual(report.rows[0].quality_status, "REVIEW_REQUIRED");
  assert.notEqual(report.rows[0].status, "REJECTED");
});

// --- Regla general: REJECTED solo por campos críticos, no por enum abierto ni por múltiples fuentes ---

test("REJECTED nunca ocurre solo por: enum no contemplado, enrichment pending, o múltiples fuentes legítimas", () => {
  const batch = tmpFile(
    "batch.csv",
    `${HEADER}\n${row({ concentration: "Nomenclatura Propia De Marca", sourceUrl: "https://a.example/1;https://b.example/2" })}\n`
  );
  const { report } = diffBatch(batch, { masterCsvPath: emptyMaster(), currentCsvPath: emptyCurrent() });
  assert.notEqual(report.rows[0].status, "REJECTED");
  assert.notEqual(report.rows[0].quality_status, "REJECTED");
});

// --- Regla general: variante de concentración vs. posible duplicado (Eros / Terre d'Hermès generalizados) ---

test("extractConcentrationFromName: sin sufijo reconocible -> concentration null (no asume nada)", () => {
  assert.deepEqual(extractConcentrationFromName("Bleu"), { baseName: "Bleu", concentration: null });
});

test("misma marca + mismo nombre base + concentración distinta confirmada en catálogo actual -> RELATED_VARIANT (regla general, no depende de qué marca sea)", () => {
  const batch = tmpFile("batch.csv", `${HEADER}\n${row({ brand: "MarcaX", name: "ProductoY", concentration: "Extrait" })}\n`);
  const current = tmpFile("current.csv", "slug,nombre,marca\nproductoy-edt,ProductoY EDT,MarcaX\n");
  const { report } = diffBatch(batch, { masterCsvPath: emptyMaster(), currentCsvPath: current });
  assert.equal(report.rows[0].catalog_relation, "RELATED_VARIANT");
  assert.equal(report.rows[0].status, "NEW");
});

test("misma marca + mismo nombre base + MISMA concentración confirmada -> POSSIBLE_DUPLICATE (regla general)", () => {
  const batch = tmpFile("batch.csv", `${HEADER}\n${row({ brand: "MarcaX", name: "ProductoY", concentration: "EDT" })}\n`);
  const current = tmpFile("current.csv", "slug,nombre,marca\nproductoy-edt,ProductoY EDT,MarcaX\n");
  const { report } = diffBatch(batch, { masterCsvPath: emptyMaster(), currentCsvPath: current });
  assert.equal(report.rows[0].catalog_relation, "POSSIBLE_DUPLICATE");
  assert.equal(report.rows[0].status, "CONFLICT");
});

// --- Regresión: batch-001 real (fixture, no lógica operacional) ---

test("regresión — batch-001 real: ani-extrait-equivalente (price_segment pending) queda CATALOG_READY_WITH_PENDING, no REJECTED ni excepción forzada", () => {
  const { rows } = readCsv(BATCH_001_PATH);
  const ani = rows.find((r) => r.slug === "ani-extrait");
  assert.ok(ani, "fixture batch-001.csv debe seguir teniendo la fila ani-extrait");
  const { report } = diffBatch(BATCH_001_PATH, {
    masterCsvPath: emptyMaster(),
    currentCsvPath: emptyCurrent(),
  });
  const aniRow = report.rows.find((r) => r.slug === "ani-extrait");
  assert.equal(aniRow.quality_status, "CATALOG_READY_WITH_PENDING");
  assert.notEqual(aniRow.status, "REJECTED");
});

test("regresión — batch-001 real: vanilla-28-edp (dos source_url) ya NO es REJECTED", () => {
  const { report } = diffBatch(BATCH_001_PATH, {
    masterCsvPath: emptyMaster(),
    currentCsvPath: emptyCurrent(),
  });
  const vanillaRow = report.rows.find((r) => r.slug === "vanilla-28-edp");
  assert.ok(vanillaRow);
  assert.notEqual(vanillaRow.status, "REJECTED");
});

test("regresión — batch-001 real: eros-parfum y terre-d-hermes-parfum quedan RELATED_VARIANT (aprobados), no CONFLICT", () => {
  const { report } = diffBatch(BATCH_001_PATH, {
    masterCsvPath: emptyMaster(),
    currentCsvPath: undefined, // usa CURRENT_AROMIA_CSV real (PERFUMES_INITIAL_50.csv) por default
  });
  const eros = report.rows.find((r) => r.slug === "eros-parfum");
  const terre = report.rows.find((r) => r.slug === "terre-d-hermes-parfum");
  assert.equal(eros.catalog_relation, "RELATED_VARIANT");
  assert.equal(eros.status, "NEW");
  assert.equal(terre.catalog_relation, "RELATED_VARIANT");
  assert.equal(terre.status, "NEW");
});
