#!/usr/bin/env node
// F3.7 — integra batch-001-remediation.csv (17 cambios de campo entregados
// por Cowork sobre 9 slugs REJECTED) contra el batch-001.csv ORIGINAL
// (nunca modificado) y produce un CSV derivado con los parches aplicados.
// Esto es una herramienta de integración de UN entregable puntual, no una
// regla de pipeline — por eso vive fuera de validate/normalize/diff.mjs.
// No escribe sobre catalog/imports/batch-001.csv.
//
// Reglas generales de aplicación (derivadas de las columnas estructuradas
// de remediation.csv, no de qué slug sea cada fila):
//   - remediation_status en DO_NOT_APPLY_STATUSES -> el campo NO cambia
//     (dato ya confirmado sin cambio, o el valor nuevo es un marcador
//     documental, no un dato real para insertar).
//   - cualquier otro status ("completed*", "partial") -> se aplica
//     new_value al campo, parseando compuestos genéricamente (';' separa
//     campos cuando field_remediated los lista juntos, ',' separa items
//     dentro de un tier de notas en el texto en inglés de Fragrantica).
//   - flagged-conflict-not-resolved -> política explícita del brief F3.7
//     (decisión A): la fuente oficial de marca tiene prioridad para
//     hechos estructurales. El valor oficial se transcribe una vez desde
//     el texto de `notes` de esa fila (no hay forma determinista de
//     parsear prosa libre sin NLP) — ver OFFICIAL_PRIORITY_OVERRIDES,
//     indexado por [remediation row id]+[field], no por slug.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { readCsv, writeCsv, STAGING_DIR, nowIso, log, warn, isMainModule } from "./lib.mjs";

const DO_NOT_APPLY_STATUSES = new Set([
  "flagged-not-applied",
  "confirmed-no-change",
  "confirmed-partial",
  "preserved-as-flat-list",
  "confirmed-with-flagged-conflict",
]);

/**
 * Valores que requieren transcripción manual de prosa porque
 * remediation.csv los dejó como placeholder ('CONFLICTO — ver notes...')
 * en vez de un valor aplicable directamente. Clave: `${id}|${field}`.
 * Documentado explícitamente por decisión — no es una tabla de excepción
 * de pipeline (no participa de validate/normalize/diff.mjs).
 */
const OFFICIAL_PRIORITY_OVERRIDES = {
  "13|family": {
    value: "Aromatic Woody",
    reason:
      "Decisión A (F3.7): conflicto family entre dolcegabbana.com (oficial: 'Aromatic Woody notes', 3 notas sin nivel) y Fragrantica ('Woody Spicy', pirámide completa). Fuente oficial tiene prioridad para hechos estructurales — se aplica 'Aromatic Woody'. Fragrantica se conserva documentada en notes, no se descarta.",
  },
};

/**
 * Transcripción manual para celdas de new_value cuya prosa es ambigua para
 * un parser genérico — ej. 'Gourmand Chypre (family=Chypre si se separa,
 * subfamily=Gourmand)': el regex 'campo=valor' genérico captura "Chypre si
 * se separa" porque no hay delimitador entre el valor y la cláusula
 * explicativa en español. No es una excepción de pipeline (no participa
 * de validate/normalize/diff.mjs) — es transcripción de un documento
 * entregado una vez, igual que OFFICIAL_PRIORITY_OVERRIDES. Clave:
 * `${id}|${field}`.
 */
const PARSE_OVERRIDES = {
  "12|family": "Chypre",
  "12|subfamily": "Gourmand",
};

/** 'Gourmand Chypre (family=Chypre si se separa, subfamily=Gourmand)' -> { family: 'Chypre', subfamily: 'Gourmand' } — split genérico por convención de paréntesis 'campo=valor', no por slug. */
function parseParentheticalFieldSplit(raw) {
  const out = {};
  const re = /(\w+)\s*=\s*([^,)]+)/g;
  let m;
  while ((m = re.exec(raw))) out[m[1].trim()] = m[2].trim();
  return out;
}

/** 'Ambery (family);Woody (subfamily)' -> { family: 'Ambery', subfamily: 'Woody' } */
function parseLabeledCompoundValue(raw, fieldNames) {
  const parts = raw.split(";").map((s) => s.trim());
  const out = {};
  fieldNames.forEach((f, i) => {
    const part = parts[i] ?? "";
    out[f] = part.replace(/\s*\([^)]*\)\s*/g, "").trim();
  });
  return out;
}

/** Notas de fragancia en inglés: 'A, B;C, D, E;F, G' -> tres tiers, cada uno ';'-joined (nuestra convención interna). */
function splitNoteTiers(raw, fieldNames) {
  const tiers = raw.split(";");
  const out = {};
  fieldNames.forEach((f, i) => {
    const tier = tiers[i] ?? "";
    out[f] = tier.split(",").map((s) => s.trim()).filter(Boolean).join(";");
  });
  return out;
}

function cleanFieldName(raw) {
  return raw.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

export function applyRemediation(originalBatchPath, remediationPath) {
  const { header, rows } = readCsv(originalBatchPath);
  const { rows: remediationRows } = readCsv(remediationPath);

  const rowsBySlug = new Map(rows.map((r) => [r.slug, { ...r }]));
  const appliedLog = [];
  const notAppliedLog = [];

  for (const rem of remediationRows) {
    const fieldNames = cleanFieldName(rem.field_remediated).split(";").map((s) => s.trim());
    const row = rowsBySlug.get(rem.slug);
    if (!row) {
      warn(`apply-remediation: slug '${rem.slug}' de remediation.csv no existe en ${originalBatchPath} — se ignora esta fila`);
      continue;
    }

    if (DO_NOT_APPLY_STATUSES.has(rem.remediation_status)) {
      notAppliedLog.push({ id: rem.id, slug: rem.slug, fields: fieldNames, status: rem.remediation_status, reason: "status marca no-aplicar (dato ya confirmado o valor no es un dato real insertable)" });
      continue;
    }

    if (rem.remediation_status === "flagged-conflict-not-resolved") {
      for (const field of fieldNames) {
        const override = OFFICIAL_PRIORITY_OVERRIDES[`${rem.id}|${field}`];
        if (override) {
          row[field] = override.value;
          appliedLog.push({ id: rem.id, slug: rem.slug, field, value: override.value, policy: "official-source-priority", reason: override.reason });
        } else {
          notAppliedLog.push({ id: rem.id, slug: rem.slug, fields: [field], status: rem.remediation_status, reason: "conflicto sin override oficial transcripto — se conserva el valor original sin cambios" });
        }
      }
      // conserva el conflicto documentado — no se pierde la fuente secundaria
      row.notes = [row.notes, `[F3.7 remediation] ${rem.notes}`].filter(Boolean).join(" | ");
      continue;
    }

    let values;
    if (fieldNames.length > 1 && /,/.test(rem.new_value) && /;/.test(rem.new_value)) {
      // compuesto tipo notas: 'A, B;C, D;E, F' — heurística: si el field_remediated
      // son justo los 3 campos de notas, se interpreta como tiers de fragancia.
      values = fieldNames.every((f) => ["top_notes", "middle_notes", "base_notes"].includes(f))
        ? splitNoteTiers(rem.new_value, fieldNames)
        : parseLabeledCompoundValue(rem.new_value, fieldNames);
    } else if (fieldNames.length > 1 && /=/.test(rem.new_value)) {
      values = parseParentheticalFieldSplit(rem.new_value);
    } else if (fieldNames.length > 1) {
      values = parseLabeledCompoundValue(rem.new_value, fieldNames);
    } else {
      values = { [fieldNames[0]]: rem.new_value };
    }

    for (const field of fieldNames) {
      const override = PARSE_OVERRIDES[`${rem.id}|${field}`];
      const newValue = override ?? values[field];
      if (newValue === undefined || newValue === "" || newValue.toLowerCase() === "pending") {
        notAppliedLog.push({ id: rem.id, slug: rem.slug, fields: [field], status: rem.remediation_status, reason: "valor nuevo vacío/pending — sin cambio real que aplicar" });
        continue;
      }
      row[field] = newValue;
      appliedLog.push({ id: rem.id, slug: rem.slug, field, value: newValue, sourceType: rem.source_type, sourceUrl: rem.source_url });
    }
    row.notes = [row.notes, `[F3.7 remediation, ${rem.source_type}] ${rem.notes}`].filter(Boolean).join(" | ");
  }

  const outRows = rows.map((r) => rowsBySlug.get(r.slug) ?? r);
  return { header, rows: outRows, appliedLog, notAppliedLog };
}

function main() {
  const [originalPath, remediationPath, outPath] = process.argv.slice(2);
  if (!originalPath || !remediationPath) {
    process.stderr.write("Uso: node apply-remediation.mjs <batch-original.csv> <remediation.csv> [out.csv]\n");
    process.exit(1);
  }
  const { header, rows, appliedLog, notAppliedLog } = applyRemediation(originalPath, remediationPath);
  const outCsvPath = outPath ?? join(STAGING_DIR, "batch-001-remediated.csv");
  writeCsv(outCsvPath, header, rows);
  log(`Remediación aplicada: ${appliedLog.length} campo(s) cambiado(s), ${notAppliedLog.length} sin cambio (confirmado/no-aplicado).`);
  log(`CSV remediado: ${outCsvPath}`);
  writeFileSync(
    outCsvPath.replace(/\.csv$/, "-apply-log.json"),
    JSON.stringify({ generatedAt: nowIso(), appliedLog, notAppliedLog }, null, 2),
    "utf-8"
  );
}

if (isMainModule(import.meta.url)) {
  main();
}
