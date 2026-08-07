// Casos revelados por el batch-001 REAL de Cowork (F3.5, 2026-08-07) que el
// fixture sintético de Bloque A-D no cubría. Ver
// catalog/schemas/SCHEMA_COMPARISON.md y catalog/reports/batch-001-real-summary.md
// para el detalle completo de cada hallazgo.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateBatch } from "../validate.mjs";
import { normalizeBatch } from "../normalize.mjs";
import { isPendingSentinel, parseRawRow, PENDING_IS_VALID_VALUE_FIELDS } from "../lib.mjs";

function tmpCsv(content) {
  const dir = mkdtempSync(join(tmpdir(), "aromia-catalog-test-"));
  const file = join(dir, "batch.csv");
  writeFileSync(file, content, "utf-8");
  return file;
}

const HEADER =
  "id,slug,brand,name,concentration,gender,family,subfamily,launch_year,perfumer,country,description,top_notes,heart_notes,base_notes,accords,season,occasion,longevity,sillage,price_segment,amazon_url,source_url,image_url,image_source,affiliate_status,source_verified,data_confidence,visual_quality,review_status,seo_title,seo_description,status,notes,created_at,updated_at";

function row(overrides = {}) {
  const base = {
    id: "1", slug: "chanel-no5-edp", brand: "Chanel", name: "No.5", concentration: "EDP",
    gender: "femenino", family: "floral aldehido", subfamily: "pending", launchYear: "1986",
    perfumer: "Jacques Polge", country: "Francia", description: "Icono.",
    topNotes: "aldehidos;ylang-ylang", heartNotes: "iris;jazmin", baseNotes: "sandalo;musgo",
    accords: "pending", season: "pending", occasion: "pending", longevity: "pending",
    sillage: "pending", priceSegment: "lujo", amazonUrl: "pending",
    sourceUrl: "https://www.fragrantica.com/perfume/x", imageUrl: "pending",
    imageSource: "pending", affiliate: "no-applicable", verified: "true", confidence: "high",
    quality: "not-audited", review: "pending", seoTitle: "x", seoDesc: "x", status: "draft",
    notes: "", createdAt: "2026-08-07", updatedAt: "2026-08-07",
  };
  const f = { ...base, ...overrides };
  return [
    f.id, f.slug, f.brand, f.name, f.concentration, f.gender, f.family, f.subfamily, f.launchYear,
    f.perfumer, f.country, f.description, f.topNotes, f.heartNotes, f.baseNotes, f.accords, f.season,
    f.occasion, f.longevity, f.sillage, f.priceSegment, f.amazonUrl, f.sourceUrl, f.imageUrl,
    f.imageSource, f.affiliate, f.verified, f.confidence, f.quality, f.review, f.seoTitle, f.seoDesc,
    f.status, f.notes, f.createdAt, f.updatedAt,
  ].join(",");
}

test("una fila real de Chanel No.5 con los sentinels 'pending' de Cowork pasa validate.mjs sin errores bloqueantes", () => {
  const file = tmpCsv(`${HEADER}\n${row()}\n`);
  const { fatal, report } = validateBatch(file);
  assert.equal(fatal, false);
  assert.equal(report.rows[0].level === "error", false);
});

test("isPendingSentinel reconoce 'pending' case-insensitive con espacios, no substrings parciales", () => {
  assert.equal(isPendingSentinel("pending"), true);
  assert.equal(isPendingSentinel(" Pending "), true);
  assert.equal(isPendingSentinel("PENDING"), true);
  assert.equal(isPendingSentinel("pending review"), false);
  assert.equal(isPendingSentinel(""), false);
  assert.equal(isPendingSentinel(null), false);
});

test("parseRawRow convierte 'pending' a null en campos opcionales, a '' en campos requeridos", () => {
  const typed = parseRawRow({ subfamily: "pending", brand: "pending", top_notes: "pending" });
  assert.equal(typed.subfamily, null); // opcional
  assert.equal(typed.brand, ""); // requerido -> '' (mismo mensaje de error que celda vacía)
  assert.deepEqual(typed.top_notes, []); // campo lista requerido -> [] (falla minItems, no invade con literal 'pending')
});

test("review_status='pending' es un valor de enum legítimo, NO se convierte a null (PENDING_IS_VALID_VALUE_FIELDS)", () => {
  assert.ok(PENDING_IS_VALID_VALUE_FIELDS.includes("review_status"));
  const typed = parseRawRow({ review_status: "pending" });
  assert.equal(typed.review_status, "pending");
});

test("top_notes vacío/pending en un campo requerido SÍ bloquea (minItems:1) — no pasa en silencio", () => {
  const file = tmpCsv(`${HEADER}\n${row({ topNotes: "pending" })}\n`);
  const { report } = validateBatch(file);
  assert.equal(report.rows[0].level, "error");
  assert.ok(report.rows[0].issues.some((i) => i.field === "top_notes" || i.message.includes("top_notes")));
});

test("gender/price_segment en español (masculino/femenino/unisex, económico/medio/premium/lujo) validan sin error", () => {
  const file = tmpCsv(
    `${HEADER}\n${row({ gender: "masculino", priceSegment: "premium" })}\n`
  );
  const { report } = validateBatch(file);
  assert.equal(report.rows[0].level === "error", false);
});

test("price_segment='economico' (sin tilde, variante real observada) se normaliza a 'económico'", () => {
  const file = tmpCsv(`${HEADER}\n${row({ priceSegment: "economico" })}\n`);
  const { normalizedRows, trace } = normalizeBatch(file);
  assert.equal(normalizedRows[0].price_segment, "económico");
  assert.ok(trace.changes[0].fields.some((f) => f.field === "price_segment" && f.reason.includes("alias")));
});

test("affiliate_status='no-applicable' y visual_quality='not-audited' (valores reales de Cowork) validan sin error", () => {
  const file = tmpCsv(`${HEADER}\n${row()}\n`); // ya usa esos valores por defecto
  const { report } = validateBatch(file);
  assert.equal(report.rows[0].level === "error", false);
});

test("created_at con fecha simple 'YYYY-MM-DD' (formato real de Cowork) valida sin error de formato", () => {
  const file = tmpCsv(`${HEADER}\n${row({ createdAt: "2026-08-07", updatedAt: "2026-08-07" })}\n`);
  const { report } = validateBatch(file);
  assert.ok(!report.rows[0].issues.some((i) => i.field === "created_at"));
});

test("'pending' en un campo escalar (perfumer/country) NO se recapitaliza a 'Pending' — el sentinel pasa intacto por normalize.mjs", () => {
  const file = tmpCsv(`${HEADER}\n${row({ perfumer: "pending", country: "pending" })}\n`);
  const { normalizedRows, trace } = normalizeBatch(file);
  assert.equal(normalizedRows[0].perfumer, "pending");
  assert.equal(normalizedRows[0].country, "pending");
  assert.ok(!trace.changes.some((c) => c.fields.some((f) => (f.field === "perfumer" || f.field === "country") && f.to === "Pending")));
});

test("titleCaseIfShouting no recapitaliza texto todo-mayúsculas (podría ser un acrónimo real, ej. '212 VIP')", () => {
  const file = tmpCsv(`${HEADER}\n${row({ name: "212 VIP" })}\n`);
  const { normalizedRows } = normalizeBatch(file);
  assert.equal(normalizedRows[0].name, "212 VIP");
});

test("season='pending' (campo lista) NO se trata como un valor de enum inválido — normalize.mjs no genera ruido de 'fuera de SEASON_ENUM'", () => {
  const file = tmpCsv(`${HEADER}\n${row({ season: "pending" })}\n`);
  const { normalizedRows, trace } = normalizeBatch(file);
  assert.equal(normalizedRows[0].season, "");
  assert.ok(!trace.changes.some((c) => c.fields.some((f) => f.field === "season" && f.reason.includes("fuera de SEASON_ENUM"))));
});

test("columna 'notes' (agregada por Cowork, no estaba en el schema original) no bloquea la fila", () => {
  // nota: row() concatena campos con join(",") sin CSV-escaping — el valor
  // de prueba debe evitar comas literales, o correspondería envolverlo en
  // comillas dobles como haría un CSV real.
  const file = tmpCsv(`${HEADER}\n${row({ notes: "Conflicto de precio sin resolver; ver fuente X vs Y" })}\n`);
  const { report } = validateBatch(file);
  assert.equal(report.unexpectedColumns.length, 0); // ahora es un campo reconocido del schema
  assert.equal(report.rows[0].level === "error", false);
});
