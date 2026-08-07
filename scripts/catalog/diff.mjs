#!/usr/bin/env node
// Bloque C — compara un batch crudo contra:
//   1) catalog/aromia-catalog-master.csv (catálogo maestro acumulado, schema Cowork)
//   2) PERFUMES_INITIAL_50.csv (proxy local del catálogo YA publicado en Aromia — no hay
//      conexión a Postgres desde este pipeline, ver lib.mjs#CURRENT_AROMIA_CSV)
// Orquesta internamente validate -> normalize -> deduplicate sobre el batch
// crudo recibido, así el comando puede invocarse con un solo path
// (catalog/imports/batch-XXX.csv) como pide el brief. Nunca escribe a
// Postgres ni modifica el master — eso es prepare-import.mjs / import.mjs.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { validateBatch } from "./validate.mjs";
import { normalizeBatch } from "./normalize.mjs";
import { deduplicateBatch } from "./deduplicate.mjs";
import {
  readCsv,
  writeJson,
  duplicateKey,
  normalizeForKey,
  CONCENTRATION_ENUM,
  CONCENTRATION_ALIASES,
  MASTER_CSV,
  CURRENT_AROMIA_CSV,
  REPORTS_DIR,
  PIPELINE_VERSION,
  SCHEMA_VERSION,
  batchNameFromPath,
  nowIso,
  log,
  warn,
  isMainModule,
} from "./lib.mjs";

const COMPARABLE_FIELDS_EXCLUDED = new Set(["id", "created_at", "updated_at"]);

function loadMasterIndex(path) {
  if (!existsSync(path)) {
    return { byKey: new Map(), bySlug: new Map(), header: null };
  }
  const { header, rows } = readCsv(path);
  const byKey = new Map();
  const bySlug = new Map();
  for (const row of rows) {
    byKey.set(duplicateKey(row), row);
    if (row.slug) bySlug.set(row.slug, row);
  }
  return { byKey, bySlug, header };
}

/**
 * PERFUMES_INITIAL_50.csv embebe la concentración en `nombre` (ej. 'Sauvage
 * EDP'), a diferencia del schema de Cowork que separa `name`/`concentration`.
 * Sin esto, "Dior Sauvage" (batch) nunca matchea contra "Sauvage EDP"
 * (catálogo actual) por comparación exacta de string y el diff los marcaría
 * como NEW cuando en realidad ya existen — se indexa también la versión sin
 * el sufijo de concentración conocido.
 */
function stripKnownConcentrationSuffix(nombre) {
  const suffixes = [...CONCENTRATION_ENUM, ...Object.keys(CONCENTRATION_ALIASES)];
  const trimmed = String(nombre ?? "").trim();
  for (const suffix of suffixes) {
    const re = new RegExp(`\\s+${suffix}$`, "i");
    if (re.test(trimmed)) return trimmed.replace(re, "").trim();
  }
  return trimmed;
}

function loadCurrentAromiaIndex(path) {
  if (!existsSync(path)) return { byBrandName: new Map(), bySlug: new Map() };
  const { rows } = readCsv(path);
  const byBrandName = new Map();
  const bySlug = new Map();
  for (const row of rows) {
    const marca = normalizeForKey(row.marca);
    const keys = new Set([
      `${marca}|${normalizeForKey(row.nombre)}`,
      `${marca}|${normalizeForKey(stripKnownConcentrationSuffix(row.nombre))}`,
    ]);
    for (const key of keys) {
      if (!byBrandName.has(key)) byBrandName.set(key, []);
      byBrandName.get(key).push(row);
    }
    if (row.slug) bySlug.set(row.slug, row);
  }
  return { byBrandName, bySlug };
}

function fieldDiffs(batchRow, masterRow) {
  const diffs = [];
  for (const key of Object.keys(batchRow)) {
    if (COMPARABLE_FIELDS_EXCLUDED.has(key)) continue;
    const a = batchRow[key] ?? "";
    const b = masterRow[key] ?? "";
    if (a !== b) diffs.push({ field: key, master: b, batch: a });
  }
  return diffs;
}

export function diffBatch(rawFilePath, opts = {}) {
  const masterCsvPath = opts.masterCsvPath ?? MASTER_CSV;
  const currentCsvPath = opts.currentCsvPath ?? CURRENT_AROMIA_CSV;
  const batchName = batchNameFromPath(rawFilePath);

  // Validación informativa sobre el crudo (deja constancia de lo que Cowork
  // mandó tal cual, incluyendo cosas que normalize.mjs va a resolver como
  // alias de concentración). Si el CSV ni siquiera parsea, se aborta acá —
  // no tiene sentido intentar normalizar algo mal formado.
  const rawValidation = validateBatch(rawFilePath);
  if (rawValidation.fatal) {
    const report = {
      batch: batchName,
      generatedAt: nowIso(),
      fatal: true,
      fatalReason: rawValidation.report.fatalReason,
      rows: [],
    };
    writeJson(join(REPORTS_DIR, `${batchName}-diff.json`), report);
    return { fatal: true, report };
  }

  const { outCsvPath: normalizedPath, normalizedRows } = normalizeBatch(rawFilePath);

  // La validación que decide qué se rechaza corre sobre los datos YA
  // normalizados — si no corriera acá, un alias de concentración válido
  // ('eau de parfum') se rechazaría por error de validación antes de que
  // normalize.mjs tuviera la oportunidad de resolverlo a 'EDP'. Ver
  // catalog/schemas/SCHEMA_COMPARISON.md para el orden completo del pipeline.
  const validation = validateBatch(normalizedPath);
  const { summary: dedupeSummary } = deduplicateBatch(normalizedPath);
  const dedupeByRow = new Map(dedupeSummary.decisions.map((d) => [d.row, d]));
  const validationByRow = new Map(validation.report.rows.map((r) => [r.row, r]));

  const master = loadMasterIndex(masterCsvPath);
  const current = loadCurrentAromiaIndex(currentCsvPath);

  const classified = normalizedRows.map((batchRow, idx) => {
    const rowNumber = idx + 2;
    const dedupe = dedupeByRow.get(rowNumber);
    const val = validationByRow.get(rowNumber);

    const base = { row: rowNumber, id: batchRow.id || null, slug: batchRow.slug || null };

    if (val?.level === "error") {
      return { ...base, status: "REJECTED", reason: "Fila con errores de validación bloqueantes (ver reporte de validate.mjs)", source: "validation" };
    }
    if (dedupe?.decision === "reject_exact_duplicate") {
      return { ...base, status: "REJECTED", reason: dedupe.reason, source: "deduplicate" };
    }
    if (dedupe?.decision === "needs_review_conflict") {
      return { ...base, status: "CONFLICT", reason: dedupe.reason, source: "deduplicate" };
    }

    // ¿colisiona el slug con un producto DISTINTO ya en master o en el catálogo actual?
    const key = duplicateKey(batchRow);
    const slugOwnerMaster = master.bySlug.get(batchRow.slug);
    if (slugOwnerMaster && duplicateKey(slugOwnerMaster) !== key) {
      return { ...base, status: "CONFLICT", reason: `slug '${batchRow.slug}' ya pertenece a otro producto en el catálogo maestro (${slugOwnerMaster.brand} ${slugOwnerMaster.name} ${slugOwnerMaster.concentration})`, source: "slug_collision" };
    }
    const slugOwnerCurrent = current.bySlug.get(batchRow.slug);
    if (slugOwnerCurrent) {
      return { ...base, status: "CONFLICT", reason: `slug '${batchRow.slug}' ya existe en el catálogo actual de Aromia (${slugOwnerCurrent.marca} ${slugOwnerCurrent.nombre}) — revisar manualmente`, source: "slug_collision" };
    }

    const masterMatch = master.byKey.get(key);
    if (masterMatch) {
      if ((batchRow.image_url || "") !== (masterMatch.image_url || "") && masterMatch.image_url) {
        return {
          ...base,
          status: "CONFLICT",
          reason: "El batch propone un image_url distinto al ya presente en el catálogo maestro — no se modifica sin aprobación explícita (regla de seguridad Fase 3)",
          source: "image_url_change_blocked",
        };
      }
      const diffs = fieldDiffs(batchRow, masterMatch);
      if (diffs.length === 0) {
        return { ...base, status: "UNCHANGED", reason: null, source: "master" };
      }
      return { ...base, status: "UPDATED", reason: `${diffs.length} campo(s) distinto(s) respecto al catálogo maestro`, source: "master", fieldDiffs: diffs };
    }

    const currentKey = `${normalizeForKey(batchRow.brand)}|${normalizeForKey(batchRow.name)}`;
    const currentMatches = current.byBrandName.get(currentKey);
    if (currentMatches && currentMatches.length > 0) {
      return {
        ...base,
        status: "CONFLICT",
        reason: `Posible coincidencia por marca+nombre con ${currentMatches.length} perfume(s) ya publicado(s) en Aromia (PERFUMES_INITIAL_50.csv no distingue concentración de forma confiable) — requiere revisión manual antes de importar`,
        source: "current_catalog_possible_match",
        candidates: currentMatches.map((m) => ({ slug: m.slug, nombre: m.nombre, marca: m.marca })),
      };
    }

    return { ...base, status: "NEW", reason: null, source: null };
  });

  const counts = classified.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  const report = {
    batch: batchName,
    generatedAt: nowIso(),
    pipelineVersion: PIPELINE_VERSION,
    schemaVersion: SCHEMA_VERSION,
    fatal: false,
    masterExists: existsSync(masterCsvPath),
    totalRows: classified.length,
    counts: {
      NEW: counts.NEW ?? 0,
      UNCHANGED: counts.UNCHANGED ?? 0,
      UPDATED: counts.UPDATED ?? 0,
      CONFLICT: counts.CONFLICT ?? 0,
      REJECTED: counts.REJECTED ?? 0,
    },
    rows: classified,
  };

  writeJson(join(REPORTS_DIR, `${batchName}-diff.json`), report);
  return { fatal: false, report, normalizedPath, normalizedRows, validation, rawValidation, dedupeSummary };
}

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    process.stderr.write("Uso: node diff.mjs <path-a-csv-crudo-del-batch>\n");
    process.exit(1);
  }
  const { fatal, report } = diffBatch(filePath);
  if (fatal) {
    process.stderr.write(`Diff abortado: ${report.fatalReason}\n`);
    process.exit(1);
  }
  log(`Batch: ${report.batch}`);
  log(`Filas: ${report.totalRows}`);
  log(`  NEW:       ${report.counts.NEW}`);
  log(`  UNCHANGED: ${report.counts.UNCHANGED}`);
  log(`  UPDATED:   ${report.counts.UPDATED}`);
  log(`  CONFLICT:  ${report.counts.CONFLICT}`);
  log(`  REJECTED:  ${report.counts.REJECTED}`);
  if (!report.masterExists) {
    warn("catalog/aromia-catalog-master.csv todavía no existe — todo lo no-conflictivo cae como NEW (esperable antes del primer batch importado)");
  }
  log(`Reporte: catalog/reports/${report.batch}-diff.json`);
}

if (isMainModule(import.meta.url)) {
  main();
}
