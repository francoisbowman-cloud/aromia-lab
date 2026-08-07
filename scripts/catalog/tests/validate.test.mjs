import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateBatch } from "../validate.mjs";
import { REPORTS_DIR } from "../lib.mjs";

function tmpCsv(content) {
  const dir = mkdtempSync(join(tmpdir(), "aromia-catalog-test-"));
  const file = join(dir, "batch.csv");
  writeFileSync(file, content, "utf-8");
  return file;
}

const HEADER =
  "id,slug,brand,name,concentration,gender,family,subfamily,launch_year,perfumer,country,description,top_notes,heart_notes,base_notes,accords,season,occasion,longevity,sillage,price_segment,amazon_url,source_url,image_url,image_source,affiliate_status,source_verified,data_confidence,visual_quality,review_status,seo_title,seo_description,status,created_at,updated_at";

function row({
  id = "cw-001",
  slug = "sauvage-edt",
  brand = "Dior",
  name = "Sauvage",
  concentration = "EDT",
  gender = "male",
  family = "amaderada-aromatica",
  topNotes = "bergamota",
  heartNotes = "geranio",
  baseNotes = "ambroxan",
  imageUrl = "https://img.example/x.jpg",
  sourceUrl = "https://source.example/x",
  status = "draft",
} = {}) {
  return [
    id, slug, brand, name, concentration, gender, family, "", "", "", "", "",
    topNotes, heartNotes, baseNotes, "", "", "", "", "", "", "", sourceUrl,
    imageUrl, "", "", "", "", "", "", "", "", status, "", "",
  ].join(",");
}

test("CSV mal formado -> fatal:true, no lanza excepción", () => {
  const file = tmpCsv(`${HEADER}\n"unterminated quote,x,x`);
  const { fatal, report } = validateBatch(file);
  assert.equal(fatal, true);
  assert.match(report.fatalReason, /CSV mal formado/);
});

test("columnas requeridas faltantes -> fatal:true", () => {
  const file = tmpCsv("id,slug,brand\ncw-001,x,Dior\n");
  const { fatal, report } = validateBatch(file);
  assert.equal(fatal, true);
  assert.match(report.fatalReason, /Faltan columnas requeridas/);
});

test("fila válida -> level info, sin issues", () => {
  const file = tmpCsv(`${HEADER}\n${row()}\n`);
  const { fatal, report } = validateBatch(file);
  assert.equal(fatal, false);
  assert.equal(report.rows[0].level, "info");
  assert.deepEqual(report.rows[0].issues, []);
});

test("concentration/gender/status fuera de enum -> error, no aborta el batch", () => {
  const file = tmpCsv(
    `${HEADER}\n${row({ concentration: "XYZ", gender: "other", status: "not-a-status" })}\n`
  );
  const { fatal, report } = validateBatch(file);
  assert.equal(fatal, false);
  assert.equal(report.rows[0].level, "error");
  const codes = report.rows[0].issues.map((i) => i.field);
  assert.ok(codes.includes("concentration"));
  assert.ok(codes.includes("gender"));
  assert.ok(codes.includes("status"));
});

test("slug vacío no es error (normalize.mjs lo genera después); slug con espacios sí lo es", () => {
  const fileEmpty = tmpCsv(`${HEADER}\n${row({ slug: "" })}\n`);
  const { report: r1 } = validateBatch(fileEmpty);
  assert.equal(r1.rows[0].level, "info");

  const fileBad = tmpCsv(`${HEADER}\n${row({ slug: "invalid slug" })}\n`);
  const { report: r2 } = validateBatch(fileBad);
  assert.equal(r2.rows[0].level, "error");
});

test("id duplicado dentro del batch -> error en la segunda fila", () => {
  const file = tmpCsv(`${HEADER}\n${row({ id: "dup" })}\n${row({ id: "dup", slug: "otro-slug" })}\n`);
  const { report } = validateBatch(file);
  const codes2 = report.rows[1].issues.map((i) => i.code);
  assert.ok(codes2.includes("duplicate_id_in_batch"));
});

test("fila exactamente duplicada -> warning, no error (no bloquea el lote)", () => {
  const file = tmpCsv(`${HEADER}\n${row({ id: "a" })}\n${row({ id: "b" })}\n`);
  const { report } = validateBatch(file);
  assert.equal(report.rows[1].level, "warning");
  assert.ok(report.rows[1].issues.some((i) => i.code === "exact_duplicate_row"));
});

test("misma brand+name+concentration con datos distintos -> warning de posible duplicado, no fusiona nada", () => {
  const file = tmpCsv(
    `${HEADER}\n${row({ id: "a", slug: "sauvage-edt" })}\n${row({ id: "b", slug: "sauvage-edt-2", imageUrl: "https://img.example/other.jpg" })}\n`
  );
  const { report } = validateBatch(file);
  assert.ok(
    report.rows[1].issues.some((i) => i.code === "possible_duplicate_brand_name_concentration")
  );
  assert.equal(report.rows[1].level, "warning");
});

test("columna no reconocida -> warning a nivel archivo, no rompe la validación", () => {
  const file = tmpCsv(`${HEADER},unknown_column\n${row()},foo\n`);
  const { report } = validateBatch(file);
  assert.ok(report.unexpectedColumns.includes("unknown_column"));
  assert.ok(report.fileIssues.some((i) => i.code === "unexpected_columns"));
});

test("escribe el reporte en catalog/reports/{batch}-validation.json", () => {
  const file = tmpCsv(`${HEADER}\n${row()}\n`);
  const { report } = validateBatch(file);
  assert.equal(report.batch, "batch");
  const reportPath = join(REPORTS_DIR, "batch-validation.json");
  assert.doesNotThrow(() => rmSync(reportPath));
});
