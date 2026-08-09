// F3.7 — apply-remediation.mjs es una herramienta de integración de UN
// entregable puntual (no participa de validate/normalize/diff.mjs), pero
// dos bugs reales aparecieron al correrla contra batch-001-remediation.csv
// real: (1) un status 'confirmed-with-flagged-conflict' no estaba en
// DO_NOT_APPLY_STATUSES y dejó pasar un placeholder de texto ('SIN CAMBIO
// — ...') como si fuera un valor real de nota; (2) el parser genérico de
// 'campo=valor' capturó de más en una cláusula explicativa en español
// ('Chypre si se separa' en vez de 'Chypre'). Cubiertos acá con datos
// sintéticos (mecanismo general) + una corrida real de regresión contra
// el CSV entregado (fixture, no lógica operacional).
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { applyRemediation } from "../apply-remediation.mjs";
import { IMPORTS_DIR } from "../lib.mjs";

function tmpFile(name, content) {
  const dir = mkdtempSync(join(tmpdir(), "aromia-catalog-test-"));
  const file = join(dir, name);
  writeFileSync(file, content, "utf-8");
  return file;
}

const BATCH_HEADER =
  "id,slug,brand,name,concentration,gender,family,subfamily,launch_year,perfumer,country,description,top_notes,middle_notes,base_notes,accords,season,occasion,longevity,sillage,price_segment,amazon_url,source_url,image_url,image_source,affiliate_status,source_verified,data_confidence,visual_quality,review_status,seo_title,seo_description,status,notes,created_at,updated_at";

function batchRow(id, slug, family) {
  return [id, slug, "Marca", "Producto", "EDT", "masculino", family, "", "", "", "", "", "top", "mid", "base", "", "", "", "", "", "", "", "https://x.example/a", "", "", "", "", "", "", "", "", "", "draft", "", "", ""].join(",");
}

const REM_HEADER = "id,slug,field_remediated,previous_value,new_value,level_structure_confirmed,source_type,source_url,remediation_status,notes";

test("un remediation_status que confirma 'sin cambio' NUNCA escribe el texto del placeholder como valor real del campo (regresión: 'confirmed-with-flagged-conflict')", () => {
  const original = tmpFile("orig.csv", `${BATCH_HEADER}\n${batchRow("1", "x-edt", "pending")}\n`);
  const rem = tmpFile(
    "rem.csv",
    `${REM_HEADER}\n1,x-edt,family,pending,"SIN CAMBIO — no se aplica, ver conflicto",no-op,official,https://x.example/a,confirmed-with-flagged-conflict,texto de nota\n`
  );
  const { rows } = applyRemediation(original, rem);
  const row = rows.find((r) => r.slug === "x-edt");
  assert.equal(row.family, "pending"); // NO debe contener el texto del placeholder
});

test("un status 'flagged-not-applied' preserva el valor original sin cambios", () => {
  const original = tmpFile("orig.csv", `${BATCH_HEADER}\n${batchRow("1", "x-edt", "valor-original")}\n`);
  const rem = tmpFile("rem.csv", `${REM_HEADER}\n1,x-edt,family,valor-original,valor-nuevo-no-aplicado,no-op,official,https://x.example/a,flagged-not-applied,discrepancia sin resolver\n`);
  const { rows } = applyRemediation(original, rem);
  assert.equal(rows.find((r) => r.slug === "x-edt").family, "valor-original");
});

test("un status genérico ('completed') SÍ aplica el nuevo valor a un campo simple", () => {
  const original = tmpFile("orig.csv", `${BATCH_HEADER}\n${batchRow("1", "x-edt", "pending")}\n`);
  const rem = tmpFile("rem.csv", `${REM_HEADER}\n1,x-edt,family,pending,Woody Aromatic,has-pyramid,official,https://x.example/a,completed,confirmado en sitio oficial\n`);
  const { rows, appliedLog } = applyRemediation(original, rem);
  assert.equal(rows.find((r) => r.slug === "x-edt").family, "Woody Aromatic");
  assert.equal(appliedLog.length, 1);
});

test("regresión — remediation.csv real de batch-001: ningún campo termina con un placeholder/prosa de status como valor (family/subfamily de las 9 filas quedan cortos y limpios)", () => {
  const originalPath = join(IMPORTS_DIR, "batch-001.csv");
  const remediationPath = join(IMPORTS_DIR, "batch-001-remediation.csv");
  const { rows } = applyRemediation(originalPath, remediationPath);
  const remediatedSlugs = ["santal-33-edp", "armani-code-parfum", "naxos-edp", "side-effect-edp", "explorer-edp", "scandal-edp", "the-one-for-men-edt", "cloud-edp", "replica-jazz-club-edt"];
  for (const slug of remediatedSlugs) {
    const row = rows.find((r) => r.slug === slug);
    assert.ok(row, `fila ${slug} debe seguir existiendo`);
    for (const field of ["family", "subfamily", "top_notes", "middle_notes", "base_notes"]) {
      assert.ok(
        !/SIN CAMBIO|CONFLICTO —|confirmado|no-pyramid-published/i.test(row[field]),
        `${slug}.${field} no debe contener texto de status/placeholder: ${JSON.stringify(row[field])}`
      );
    }
  }
  const scandal = rows.find((r) => r.slug === "scandal-edp");
  assert.equal(scandal.family, "Chypre"); // no "Chypre si se separa"
  assert.equal(scandal.subfamily, "Gourmand");
  const theOne = rows.find((r) => r.slug === "the-one-for-men-edt");
  assert.equal(theOne.family, "Aromatic Woody"); // decisión A: prioridad de fuente oficial
});
