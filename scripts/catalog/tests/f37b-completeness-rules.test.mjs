// F3.7B — reglas generales de completitud de datos. Ninguna aserción
// depende de un slug/marca puntual. Santal 33 / Side Effect (Batch 001)
// se cubren como regresión en un bloque aparte al final, contra el CSV
// real — no como lógica operacional.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateBatch } from "../validate.mjs";
import { normalizeBatch } from "../normalize.mjs";
import { diffBatch } from "../diff.mjs";
import { classifyNoteStructure, derivePriceStatus, computeYields, readCsv, IMPORTS_DIR } from "../lib.mjs";

function tmpFile(name, content) {
  const dir = mkdtempSync(join(tmpdir(), "aromia-catalog-test-"));
  const file = join(dir, name);
  writeFileSync(file, content, "utf-8");
  return file;
}

const HEADER =
  "id,slug,brand,name,concentration,gender,family,subfamily,launch_year,perfumer,country,description,top_notes,middle_notes,base_notes,accords,season,occasion,longevity,sillage,price_segment,amazon_url,source_url,image_url,image_source,affiliate_status,source_verified,data_confidence,visual_quality,review_status,seo_title,seo_description,status,notes,created_at,updated_at";

function row(overrides = {}) {
  const base = {
    id: "1", slug: "", brand: "Marca", name: "Producto", concentration: "EDT", gender: "masculino",
    family: "amaderado", subfamily: "", launchYear: "", perfumer: "", country: "", description: "",
    topNotes: "bergamota", middleNotes: "iris", baseNotes: "sandalo", accords: "", season: "pending",
    occasion: "pending", longevity: "pending", sillage: "pending", priceSegment: "pending", amazonUrl: "pending",
    sourceUrl: "https://x.example/a", imageUrl: "pending", imageSource: "pending", affiliate: "no-applicable",
    verified: "true", confidence: "high", quality: "not-audited", review: "pending", seoTitle: "", seoDesc: "",
    status: "draft", notes: "", createdAt: "", updatedAt: "",
  };
  const f = { ...base, ...overrides };
  return [
    f.id, f.slug, f.brand, f.name, f.concentration, f.gender, f.family, f.subfamily, f.launchYear,
    f.perfumer, f.country, f.description, f.topNotes, f.middleNotes, f.baseNotes, f.accords, f.season,
    f.occasion, f.longevity, f.sillage, f.priceSegment, f.amazonUrl, f.sourceUrl, f.imageUrl, f.imageSource,
    f.affiliate, f.verified, f.confidence, f.quality, f.review, f.seoTitle, f.seoDesc, f.status, f.notes,
    f.createdAt, f.updatedAt,
  ].join(",");
}

function emptyMaster() {
  return tmpFile("master.csv", `${HEADER}\n`);
}
function emptyCurrent() {
  return tmpFile("current.csv", "slug,nombre,marca\n");
}

// --- Regla 2: estructura de notas ---

test("classifyNoteStructure: los 3 niveles con contenido -> PYRAMID", () => {
  assert.equal(classifyNoteStructure({ top_notes: ["a"], middle_notes: ["b"], base_notes: ["c"], accords: [] }), "PYRAMID");
});

test("classifyNoteStructure: sin niveles pero accords con contenido -> FLAT", () => {
  assert.equal(classifyNoteStructure({ top_notes: [], middle_notes: [], base_notes: [], accords: ["a", "b"] }), "FLAT");
});

test("classifyNoteStructure: 1 o 2 de 3 niveles -> PARTIAL", () => {
  assert.equal(classifyNoteStructure({ top_notes: [], middle_notes: [], base_notes: ["c"], accords: [] }), "PARTIAL");
  assert.equal(classifyNoteStructure({ top_notes: ["a"], middle_notes: ["b"], base_notes: [], accords: [] }), "PARTIAL");
});

test("classifyNoteStructure: nada en absoluto -> UNKNOWN", () => {
  assert.equal(classifyNoteStructure({ top_notes: [], middle_notes: [], base_notes: [], accords: [] }), "UNKNOWN");
});

test("una fragancia con estructura FLAT (solo accords, sin pirámide) NO queda REJECTED", () => {
  const file = tmpFile("batch.csv", `${HEADER}\n${row({ topNotes: "", middleNotes: "", baseNotes: "", accords: "cardamomo;iris;cedro" })}\n`);
  const { report } = diffBatch(file, { masterCsvPath: emptyMaster(), currentCsvPath: emptyCurrent() });
  assert.notEqual(report.rows[0].quality_status, "REJECTED");
});

test("una fragancia con estructura PARTIAL (solo base_notes) NO queda REJECTED", () => {
  const file = tmpFile("batch.csv", `${HEADER}\n${row({ topNotes: "", middleNotes: "", baseNotes: "cashmere", accords: "" })}\n`);
  const { report } = diffBatch(file, { masterCsvPath: emptyMaster(), currentCsvPath: emptyCurrent() });
  assert.notEqual(report.rows[0].quality_status, "REJECTED");
});

test("una fragancia con estructura UNKNOWN (nada de notas) SÍ queda REJECTED", () => {
  const file = tmpFile("batch.csv", `${HEADER}\n${row({ topNotes: "", middleNotes: "", baseNotes: "", accords: "" })}\n`);
  const { report } = diffBatch(file, { masterCsvPath: emptyMaster(), currentCsvPath: emptyCurrent() });
  assert.equal(report.rows[0].quality_status, "REJECTED");
});

test("no se infiere top/middle/base a partir de accords — normalize.mjs no inventa la pirámide", () => {
  const file = tmpFile("batch.csv", `${HEADER}\n${row({ topNotes: "", middleNotes: "", baseNotes: "", accords: "cardamomo;iris;cedro" })}\n`);
  const { normalizedRows } = normalizeBatch(file);
  assert.deepEqual(normalizedRows[0].top_notes, "");
  assert.deepEqual(normalizedRows[0].middle_notes, "");
  assert.deepEqual(normalizedRows[0].base_notes, "");
});

// --- Regla 3: family opcional ---

test("family pending, único campo factual pendiente, resto sano -> CATALOG_READY_WITH_PENDING, no REJECTED", () => {
  const file = tmpFile("batch.csv", `${HEADER}\n${row({ family: "pending" })}\n`);
  const { report } = diffBatch(file, { masterCsvPath: emptyMaster(), currentCsvPath: emptyCurrent() });
  assert.equal(report.rows[0].quality_status, "CATALOG_READY_WITH_PENDING");
  assert.notEqual(report.rows[0].status, "REJECTED");
});

test("family pending Y estructura de notas UNKNOWN -> SÍ sigue REJECTED (family no es la única causa)", () => {
  const file = tmpFile("batch.csv", `${HEADER}\n${row({ family: "pending", topNotes: "", middleNotes: "", baseNotes: "", accords: "" })}\n`);
  const { report } = diffBatch(file, { masterCsvPath: emptyMaster(), currentCsvPath: emptyCurrent() });
  assert.equal(report.rows[0].quality_status, "REJECTED");
});

test("family nunca se inventa: si viene pending, normalize.mjs preserva el sentinel tal cual (no adivina un valor) — validate.mjs lo trata como null más adelante", () => {
  const file = tmpFile("batch.csv", `${HEADER}\n${row({ family: "pending" })}\n`);
  const { normalizedRows } = normalizeBatch(file);
  assert.equal(normalizedRows[0].family, "pending");
});

// --- Regla 5: price_status ---

test("derivePriceStatus: price_segment con valor -> verified", () => {
  assert.equal(derivePriceStatus("lujo"), "verified");
});

test("derivePriceStatus: sin price_segment -> unverified", () => {
  assert.equal(derivePriceStatus(null), "unverified");
  assert.equal(derivePriceStatus(""), "unverified");
});

test("normalize.mjs deriva price_status automáticamente aunque el CSV no traiga esa columna", () => {
  const file = tmpFile("batch.csv", `${HEADER}\n${row({ priceSegment: "premium" })}\n`);
  const { normalizedRows, header } = normalizeBatch(file);
  assert.ok(header.includes("price_status"));
  assert.equal(normalizedRows[0].price_status, "verified");
});

test("price_status derivado NUNCA se calcula leyendo el campo notes (no hay lectura de prosa)", () => {
  const file = tmpFile(
    "batch.csv",
    `${HEADER}\n${row({ priceSegment: "pending", notes: "PRECIO EN CONFLICTO GRAVE entre dos fuentes; ver detalle" })}\n`
  );
  const { normalizedRows } = normalizeBatch(file);
  // aunque notes describe un conflicto real, sin una columna price_status explícita el derivado es 'unverified', no 'source_conflict' — no se parseó prosa.
  assert.equal(normalizedRows[0].price_status, "unverified");
});

test("si el CSV ya trae price_status explícito (ej. 'source_conflict' de un batch futuro), no se pisa", () => {
  const headerWithStatus = `${HEADER},price_status`;
  const rowWithStatus = `${row({ priceSegment: "pending" })},source_conflict`;
  const file = tmpFile("batch.csv", `${headerWithStatus}\n${rowWithStatus}\n`);
  const { normalizedRows } = normalizeBatch(file);
  assert.equal(normalizedRows[0].price_status, "source_conflict");
});

// --- Regla 4: dos métricas de automatización, nunca combinadas ---

test("computeYields: REJECTED cuenta como 'no requiere decisión' pero NO como 'completo' — las dos métricas divergen", () => {
  const counts = { CATALOG_READY: 0, CATALOG_READY_WITH_PENDING: 5, REVIEW_REQUIRED: 0, REJECTED: 5 };
  const { decisionAutomationYield, dataCompletionYield } = computeYields(counts, 10);
  assert.equal(decisionAutomationYield, 1); // 0 REVIEW_REQUIRED -> 100%
  assert.equal(dataCompletionYield, 0.5); // 5/10 completos
});

test("computeYields: REVIEW_REQUIRED baja decisionAutomationYield pero no afecta dataCompletionYield si el resto está completo", () => {
  const counts = { CATALOG_READY: 8, CATALOG_READY_WITH_PENDING: 0, REVIEW_REQUIRED: 2, REJECTED: 0 };
  const { decisionAutomationYield, dataCompletionYield } = computeYields(counts, 10);
  assert.equal(decisionAutomationYield, 0.8);
  assert.equal(dataCompletionYield, 0.8); // REVIEW_REQUIRED tampoco cuenta como completo
});

test("computeYields: batch vacío no divide por cero", () => {
  const { decisionAutomationYield, dataCompletionYield } = computeYields({}, 0);
  assert.equal(decisionAutomationYield, null);
  assert.equal(dataCompletionYield, null);
});

// --- Regresión: Santal 33 / Side Effect (Batch 001 real) ---

test("regresión — Santal 33 (Le Labo, no publica pirámide) ya NO queda REJECTED tras las reglas de F3.7B", () => {
  const batchPath = join(IMPORTS_DIR, "batch-001.csv");
  const { report } = diffBatch(batchPath, { masterCsvPath: emptyMaster(), currentCsvPath: emptyCurrent() });
  const santal = report.rows.find((r) => r.slug === "santal-33-edp");
  assert.ok(santal);
  assert.notEqual(santal.quality_status, "REJECTED");
});

test("regresión — Side Effect (Initio, no publica pirámide) ya NO queda REJECTED tras las reglas de F3.7B", () => {
  const batchPath = join(IMPORTS_DIR, "batch-001.csv");
  const { report } = diffBatch(batchPath, { masterCsvPath: emptyMaster(), currentCsvPath: emptyCurrent() });
  const sideEffect = report.rows.find((r) => r.slug === "side-effect-edp");
  assert.ok(sideEffect);
  assert.notEqual(sideEffect.quality_status, "REJECTED");
});
