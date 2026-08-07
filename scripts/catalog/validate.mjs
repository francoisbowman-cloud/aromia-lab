#!/usr/bin/env node
// Valida un CSV de batch contra catalog/schemas/catalog.schema.json.
// Solo lectura sobre el batch — no modifica el archivo de entrada.
// Escribe catalog/reports/{batch}-validation.json con el detalle por fila.
// Exit code 0 si el batch se pudo procesar (aunque tenga filas con error);
// exit code 1 solo ante fallas estructurales que impiden seguir (CSV mal
// formado, columnas requeridas faltantes por completo).
import Ajv from "ajv";
import addFormats from "ajv-formats";
import {
  readCsv,
  writeJson,
  loadCatalogSchema,
  parseRawRow,
  duplicateKey,
  exactRowSignature,
  isValidImageRef,
  CONCENTRATION_ENUM,
  REQUIRED_FIELDS,
  REPORTS_DIR,
  PIPELINE_VERSION,
  SCHEMA_VERSION,
  batchNameFromPath,
  nowIso,
  log,
  warn,
  fail,
  SEVERITY,
  isMainModule,
} from "./lib.mjs";
import { join } from "node:path";

const schema = loadCatalogSchema();
// strict:false porque catalog.schema.json incluye una clave "notes" a nivel
// raíz con documentación para humanos (no es un keyword de JSON Schema).
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validateRow = ajv.compile(schema);

const EXPECTED_COLUMNS = new Set(Object.keys(schema.properties));

export function validateBatch(filePath) {
  const batchName = batchNameFromPath(filePath);
  const issuesByFile = [];

  let header, rows;
  try {
    ({ header, rows } = readCsv(filePath));
  } catch (e) {
    const report = {
      batch: batchName,
      file: filePath,
      pipelineVersion: PIPELINE_VERSION,
      schemaVersion: SCHEMA_VERSION,
      generatedAt: nowIso(),
      fatal: true,
      fatalReason: e.message,
      rows: [],
    };
    writeJson(join(REPORTS_DIR, `${batchName}-validation.json`), report);
    return { fatal: true, report };
  }

  const missingRequiredColumns = REQUIRED_FIELDS.filter((f) => !header.includes(f));
  const unexpectedColumns = header.filter((h) => !EXPECTED_COLUMNS.has(h));

  if (missingRequiredColumns.length > 0) {
    const report = {
      batch: batchName,
      file: filePath,
      pipelineVersion: PIPELINE_VERSION,
      schemaVersion: SCHEMA_VERSION,
      generatedAt: nowIso(),
      fatal: true,
      fatalReason: `Faltan columnas requeridas: ${missingRequiredColumns.join(", ")}`,
      header,
      unexpectedColumns,
      rows: [],
    };
    writeJson(join(REPORTS_DIR, `${batchName}-validation.json`), report);
    return { fatal: true, report };
  }

  if (unexpectedColumns.length > 0) {
    issuesByFile.push({
      severity: SEVERITY.WARNING,
      code: "unexpected_columns",
      message: `Columnas no reconocidas por el schema (se preservan pero no se validan): ${unexpectedColumns.join(", ")}`,
    });
  }

  const seenIds = new Map();
  const seenSignatures = new Map();
  const seenDuplicateKeys = new Map();

  const rowResults = rows.map((rawRow, idx) => {
    const rowNumber = idx + 2; // +1 header, +1 base-1
    const typed = parseRawRow(rawRow);
    const issues = [];

    const valid = validateRow(typed);
    if (!valid) {
      for (const err of validateRow.errors ?? []) {
        issues.push({
          severity: SEVERITY.ERROR,
          code: "schema_violation",
          field: (err.instancePath || "/" + (err.params?.missingProperty ?? "")).replace(/^\//, "") || err.params?.missingProperty,
          message: `${err.instancePath || "(raíz)"} ${err.message}`,
        });
      }
    }

    if (typed.image_url && !isValidImageRef(typed.image_url)) {
      issues.push({
        severity: SEVERITY.ERROR,
        code: "invalid_image_url",
        field: "image_url",
        message: `image_url no es una URL http(s) válida ni una ruta de asset reconocida: '${typed.image_url}'`,
      });
    }

    if (typed.concentration && !CONCENTRATION_ENUM.includes(typed.concentration)) {
      issues.push({
        severity: SEVERITY.WARNING,
        code: "non_standard_concentration",
        field: "concentration",
        message: `'${typed.concentration}' no está en el set canónico conocido (${CONCENTRATION_ENUM.join("/")}) — no es un enum cerrado (ver SCHEMA_COMPARISON.md #H), se conserva tal cual. Confirmar que no sea un error de tipeo.`,
      });
    }

    if (typed.id) {
      if (seenIds.has(typed.id)) {
        issues.push({
          severity: SEVERITY.ERROR,
          code: "duplicate_id_in_batch",
          field: "id",
          message: `id '${typed.id}' repetido en la fila ${seenIds.get(typed.id)} y ${rowNumber} del mismo batch`,
        });
      } else {
        seenIds.set(typed.id, rowNumber);
      }
    }

    const signature = exactRowSignature(typed);
    if (seenSignatures.has(signature)) {
      issues.push({
        severity: SEVERITY.WARNING,
        code: "exact_duplicate_row",
        message: `Fila idéntica (salvo id/timestamps) a la fila ${seenSignatures.get(signature)}`,
      });
    } else {
      seenSignatures.set(signature, rowNumber);
    }

    if (typed.brand && typed.name && typed.concentration) {
      const key = duplicateKey(typed);
      if (seenDuplicateKeys.has(key)) {
        issues.push({
          severity: SEVERITY.WARNING,
          code: "possible_duplicate_brand_name_concentration",
          message: `Misma combinación brand+name+concentration que la fila ${seenDuplicateKeys.get(key)} — revisar en deduplicate.mjs / diff.mjs`,
        });
      } else {
        seenDuplicateKeys.set(key, rowNumber);
      }
    }

    const level = issues.some((i) => i.severity === SEVERITY.ERROR)
      ? SEVERITY.ERROR
      : issues.some((i) => i.severity === SEVERITY.WARNING)
        ? SEVERITY.WARNING
        : SEVERITY.INFO;

    return { row: rowNumber, id: typed.id ?? null, slug: typed.slug ?? null, level, issues };
  });

  const errorRows = rowResults.filter((r) => r.level === SEVERITY.ERROR).length;
  const warningRows = rowResults.filter((r) => r.level === SEVERITY.WARNING).length;
  const okRows = rowResults.length - errorRows - warningRows;

  const report = {
    batch: batchName,
    file: filePath,
    pipelineVersion: PIPELINE_VERSION,
    schemaVersion: SCHEMA_VERSION,
    generatedAt: nowIso(),
    fatal: false,
    header,
    unexpectedColumns,
    fileIssues: issuesByFile,
    totalRows: rowResults.length,
    okRows,
    warningRows,
    errorRows,
    rows: rowResults,
  };

  writeJson(join(REPORTS_DIR, `${batchName}-validation.json`), report);
  return { fatal: false, report };
}

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    fail("Uso: node validate.mjs <path-a-csv>");
    process.exit(1);
  }

  const { fatal, report } = validateBatch(filePath);

  if (fatal) {
    fail(`Validación abortada para ${filePath}: ${report.fatalReason}`);
    log(`Reporte: catalog/reports/${report.batch}-validation.json`);
    process.exit(1);
  }

  log(`Batch: ${report.batch}`);
  log(`Filas: ${report.totalRows} (ok: ${report.okRows}, warnings: ${report.warningRows}, errores: ${report.errorRows})`);
  if (report.unexpectedColumns.length > 0) {
    warn(`Columnas inesperadas: ${report.unexpectedColumns.join(", ")}`);
  }
  for (const row of report.rows) {
    if (row.level === SEVERITY.ERROR) {
      for (const issue of row.issues.filter((i) => i.severity === SEVERITY.ERROR)) {
        fail(`fila ${row.row} [${issue.code}] ${issue.message}`);
      }
    }
  }
  log(`Reporte completo: catalog/reports/${report.batch}-validation.json`);

  // No se aborta el proceso completo por filas con error: quedan
  // marcadas para rejected/ en prepare-import.mjs. Solo se sale con
  // código != 0 si TODO el batch es inválido (0 filas OK).
  if (report.totalRows > 0 && report.okRows + report.warningRows === 0) {
    process.exit(1);
  }
}

if (isMainModule(import.meta.url)) {
  main();
}
