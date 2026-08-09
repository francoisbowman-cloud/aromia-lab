// F3.7 — heart_notes (nombre de batch-001.csv y del schema original de
// Code) es ahora un alias legacy de middle_notes (nombre de contrato
// vigente, usado por batch-002.csv y el master consolidado de Cowork).
// Regla general en lib.mjs#applyLegacyColumnAliases, aplicada dentro de
// readCsv — no hay ninguna rama de código específica de un batch/slug.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readCsv, applyLegacyColumnAliases, LEGACY_COLUMN_ALIASES } from "../lib.mjs";
import { validateBatch } from "../validate.mjs";

function tmpFile(name, content) {
  const dir = mkdtempSync(join(tmpdir(), "aromia-catalog-test-"));
  const file = join(dir, name);
  writeFileSync(file, content, "utf-8");
  return file;
}

test("LEGACY_COLUMN_ALIASES mapea heart_notes -> middle_notes", () => {
  assert.deepEqual(LEGACY_COLUMN_ALIASES, { heart_notes: "middle_notes" });
});

test("applyLegacyColumnAliases renombra la columna y preserva los valores de cada fila", () => {
  const header = ["slug", "heart_notes", "brand"];
  const rows = [{ slug: "a", heart_notes: "iris;jazmin", brand: "X" }];
  const result = applyLegacyColumnAliases(header, rows);
  assert.deepEqual(result.header, ["slug", "middle_notes", "brand"]);
  assert.equal(result.rows[0].middle_notes, "iris;jazmin");
  assert.equal("heart_notes" in result.rows[0], false);
});

test("si el CSV ya trae middle_notes, no toca nada aunque también traiga heart_notes (evita pisar datos)", () => {
  const header = ["slug", "heart_notes", "middle_notes"];
  const rows = [{ slug: "a", heart_notes: "legacy", middle_notes: "vigente" }];
  const result = applyLegacyColumnAliases(header, rows);
  assert.deepEqual(result.header, header);
  assert.equal(result.rows[0].middle_notes, "vigente");
  assert.equal(result.rows[0].heart_notes, "legacy");
});

test("readCsv aplica el alias automáticamente: un CSV con columna heart_notes se lee con middle_notes", () => {
  const header =
    "id,slug,brand,name,concentration,gender,family,subfamily,launch_year,perfumer,country,description,top_notes,heart_notes,base_notes,accords,season,occasion,longevity,sillage,price_segment,amazon_url,source_url,image_url,image_source,affiliate_status,source_verified,data_confidence,visual_quality,review_status,seo_title,seo_description,status,created_at,updated_at";
  const row =
    "1,x-edt,Marca,Nombre,EDT,masculino,amaderado,,,,,,top;a,mid;b,base;c,,,,,,,,https://x.example/a,,,,,,,,,,draft,,";
  const file = tmpFile("batch.csv", `${header}\n${row}\n`);
  const { header: parsedHeader, rows } = readCsv(file);
  assert.ok(parsedHeader.includes("middle_notes"));
  assert.ok(!parsedHeader.includes("heart_notes"));
  assert.equal(rows[0].middle_notes, "mid;b");
});

test("un batch con heart_notes (legacy) valida igual que uno con middle_notes (vigente) — mismo resultado, sin excepción de columna", () => {
  const legacyHeader =
    "id,slug,brand,name,concentration,gender,family,subfamily,launch_year,perfumer,country,description,top_notes,heart_notes,base_notes,accords,season,occasion,longevity,sillage,price_segment,amazon_url,source_url,image_url,image_source,affiliate_status,source_verified,data_confidence,visual_quality,review_status,seo_title,seo_description,status,created_at,updated_at";
  const vigenteHeader = legacyHeader.replace("heart_notes", "middle_notes");
  const row =
    "1,x-edt,Marca,Nombre,EDT,masculino,amaderado,,,,,,top;a,mid;b,base;c,,,,,,,,https://x.example/a,,,,,,,,,,draft,,";

  const legacyFile = tmpFile("batch.csv", `${legacyHeader}\n${row}\n`);
  const vigenteFile = tmpFile("batch.csv", `${vigenteHeader}\n${row}\n`);

  const legacyResult = validateBatch(legacyFile);
  const vigenteResult = validateBatch(vigenteFile);

  assert.equal(legacyResult.report.rows[0].level, vigenteResult.report.rows[0].level);
  assert.equal(legacyResult.report.rows[0].level, "info");
});
