#!/usr/bin/env node
// Capa de normalización determinista (Bloque B). Lee un batch crudo,
// aplica transforms deterministas y documentadas, y escribe:
//   catalog/staging/{batch}.normalized.csv   — CSV normalizado
//   catalog/reports/{batch}-normalize-trace.json — qué cambió y por qué
// Nunca modifica el archivo de entrada. Nunca inventa datos inciertos
// sin dejarlo trazado (ver README de este directorio).
import { join } from "node:path";
import {
  readCsv,
  writeCsv,
  writeJson,
  splitList,
  joinList,
  slugify,
  duplicateKey,
  normalizeConcentration,
  titleCaseIfShouting,
  collapseWhitespace,
  LIST_FIELDS,
  GENDER_ENUM,
  SEASON_ENUM,
  PRICE_SEGMENT_ALIASES,
  isPendingSentinel,
  PENDING_IS_VALID_VALUE_FIELDS,
  STAGING_DIR,
  REPORTS_DIR,
  PIPELINE_VERSION,
  SCHEMA_VERSION,
  batchNameFromPath,
  nowIso,
  log,
  warn,
  fail,
  isMainModule,
} from "./lib.mjs";

const TITLE_CASE_FIELDS = ["brand", "name", "country", "perfumer"];
const TRIM_ONLY_FIELDS = [
  "id",
  // family/subfamily siguen la convención lowercase-hyphenated de Aromia
  // (ver schema/perfume.schema.json: 'amaderada-aromática'), no Title Case.
  "family",
  "subfamily",
  "description",
  "amazon_url",
  // source_url ya NO va acá — es un LIST_FIELD desde F3.6 (colección de fuentes).
  "image_url",
  "image_source",
  "seo_title",
  "seo_description",
];

export function normalizeBatch(filePath) {
  const batchName = batchNameFromPath(filePath);
  const { header, rows } = readCsv(filePath);

  const usedSlugs = new Set();
  const changes = [];

  const normalizedRows = rows.map((rawRow, idx) => {
    const rowNumber = idx + 2;
    const fieldChanges = [];
    const out = {};

    for (const key of header) {
      const raw = rawRow[key] ?? "";

      if (LIST_FIELDS.includes(key)) {
        if (isPendingSentinel(raw)) {
          // sentinel de 'no verificado' de Cowork en una celda de lista — []
          // vacío, no una lista con el string literal 'pending' adentro.
          out[key] = "";
          continue;
        }
        const items = splitList(raw);
        let list = items.map((i) => collapseWhitespace(i).value);
        const before = list.length;
        list = [...new Set(list)]; // dedupe items dentro de la misma lista
        if (list.length !== before) {
          fieldChanges.push({ field: key, from: raw, to: joinList(list), reason: "items duplicados dentro de la lista removidos" });
        }
        if (key === "season") {
          const invalid = list.filter((s) => !SEASON_ENUM.includes(s));
          if (invalid.length > 0) {
            fieldChanges.push({ field: key, from: joinList(list), to: joinList(list), reason: `valores fuera de SEASON_ENUM conservados tal cual: ${invalid.join(", ")}` });
          }
        }
        out[key] = joinList(list);
        continue;
      }

      if (isPendingSentinel(raw) && !PENDING_IS_VALID_VALUE_FIELDS.includes(key)) {
        // El sentinel 'pending' de Cowork no es texto real — no debe pasar
        // por trim/capitalización como si lo fuera (bug real encontrado en
        // el batch-001: 'pending' se recapitalizaba a 'Pending' en campos
        // como perfumer/country, ensuciando el CSV normalizado sin razón).
        out[key] = String(raw).trim().toLowerCase();
        continue;
      }

      if (key === "concentration") {
        const { value, changed, unknown } = normalizeConcentration(raw);
        if (changed) fieldChanges.push({ field: key, from: raw, to: value, reason: "alias de concentración conocido normalizado a forma canónica" });
        if (unknown) fieldChanges.push({ field: key, from: raw, to: value, reason: "concentración fuera del set canónico conocido — conservada tal cual (no es un enum cerrado, ver SCHEMA_COMPARISON.md #A), quedará como warning en la próxima validación" });
        out[key] = value;
        continue;
      }

      if (key === "gender") {
        const trimmed = String(raw ?? "").trim().toLowerCase();
        const value = GENDER_ENUM.includes(trimmed) ? trimmed : String(raw ?? "").trim();
        if (value !== raw) fieldChanges.push({ field: key, from: raw, to: value, reason: "trim + lowercase" });
        out[key] = value;
        continue;
      }

      if (key === "price_segment") {
        const trimmed = String(raw ?? "").trim().toLowerCase();
        const aliased = PRICE_SEGMENT_ALIASES[trimmed];
        const value = aliased ?? String(raw ?? "").trim();
        if (value !== raw) {
          fieldChanges.push({
            field: key,
            from: raw,
            to: value,
            reason: aliased ? "alias sin tilde normalizado a la forma canónica de Aromia" : "trim",
          });
        }
        out[key] = value;
        continue;
      }

      if (TITLE_CASE_FIELDS.includes(key)) {
        const collapsed = collapseWhitespace(raw);
        const titled = titleCaseIfShouting(collapsed.value);
        if (titled.value !== raw) {
          fieldChanges.push({
            field: key,
            from: raw,
            to: titled.value,
            reason: titled.changed ? "texto en mayúsculas/minúsculas todo-uniforme re-capitalizado (heurística conservadora)" : "trim + espacios colapsados",
          });
        }
        out[key] = titled.value;
        continue;
      }

      if (TRIM_ONLY_FIELDS.includes(key)) {
        const collapsed = collapseWhitespace(raw);
        if (collapsed.value !== raw) fieldChanges.push({ field: key, from: raw, to: collapsed.value, reason: "trim + espacios colapsados" });
        out[key] = collapsed.value;
        continue;
      }

      // resto de campos (enums cerrados, numéricos, booleanos, timestamps): solo trim.
      const trimmedValue = String(raw ?? "").trim();
      if (trimmedValue !== raw) fieldChanges.push({ field: key, from: raw, to: trimmedValue, reason: "trim" });
      out[key] = trimmedValue;
    }

    // slug: generar solo si vino vacío. Nunca se sobrescribe uno ya informado.
    if (!out.slug || out.slug.trim() === "") {
      let candidate = slugify(`${out.brand} ${out.name} ${out.concentration}`);
      let suffix = 2;
      const original = candidate;
      while (usedSlugs.has(candidate)) {
        candidate = `${original}-${suffix}`;
        suffix += 1;
      }
      fieldChanges.push({ field: "slug", from: out.slug ?? "", to: candidate, reason: "slug ausente — generado desde brand+name+concentration" });
      out.slug = candidate;
    }
    usedSlugs.add(out.slug);

    // created_at/updated_at: completar con el timestamp de procesamiento si faltan.
    const processedAt = nowIso();
    if (!out.created_at || out.created_at.trim() === "") {
      fieldChanges.push({ field: "created_at", from: out.created_at ?? "", to: processedAt, reason: "created_at ausente — completado con timestamp de procesamiento del batch" });
      out.created_at = processedAt;
    }
    if (!out.updated_at || out.updated_at.trim() === "") {
      out.updated_at = out.created_at;
    }

    if (fieldChanges.length > 0) {
      changes.push({ row: rowNumber, id: out.id || null, slug: out.slug, fields: fieldChanges });
    }

    return out;
  });

  const outCsvPath = join(STAGING_DIR, `${batchName}.normalized.csv`);
  writeCsv(outCsvPath, header, normalizedRows);

  const trace = {
    batch: batchName,
    sourceFile: filePath,
    outputFile: outCsvPath,
    pipelineVersion: PIPELINE_VERSION,
    schemaVersion: SCHEMA_VERSION,
    generatedAt: nowIso(),
    totalRows: normalizedRows.length,
    rowsChanged: changes.length,
    changes,
  };
  const tracePath = join(REPORTS_DIR, `${batchName}-normalize-trace.json`);
  writeJson(tracePath, trace);

  return { outCsvPath, tracePath, trace, normalizedRows, header };
}

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    fail("Uso: node normalize.mjs <path-a-csv>");
    process.exit(1);
  }
  const { outCsvPath, tracePath, trace } = normalizeBatch(filePath);
  log(`Batch: ${trace.batch}`);
  log(`Filas: ${trace.totalRows} (modificadas: ${trace.rowsChanged})`);
  log(`CSV normalizado: ${outCsvPath}`);
  log(`Trace: ${tracePath}`);
  const unknownConcentration = trace.changes.filter((c) => c.fields.some((f) => f.reason.includes("no reconocida")));
  if (unknownConcentration.length > 0) {
    warn(`${unknownConcentration.length} fila(s) con concentración no reconocida (ver trace) — quedarán como error en validate.mjs`);
  }
}

if (isMainModule(import.meta.url)) {
  main();
}
