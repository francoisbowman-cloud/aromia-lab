#!/usr/bin/env node
// Bloque C — compara un batch crudo contra:
//   1) catalog/aromia-catalog-master.csv (catálogo maestro acumulado, schema Cowork)
//   2) PERFUMES_INITIAL_50.csv (proxy local del catálogo YA publicado en Aromia — no hay
//      conexión a Postgres desde este pipeline, ver lib.mjs#CURRENT_AROMIA_CSV)
// Orquesta internamente validate -> normalize -> deduplicate sobre el batch
// crudo recibido, así el comando puede invocarse con un solo path
// (catalog/imports/batch-XXX.csv) como pide el brief. Nunca escribe a
// Postgres ni modifica el master — eso es prepare-import.mjs / import.mjs.
//
// F3.6 — dos dimensiones separadas, calculadas por reglas generales (no
// por slug/marca hardcodeados):
//   catalog_relation: NEW | EXISTING | RELATED_VARIANT | POSSIBLE_DUPLICATE
//   quality_status:   CATALOG_READY | CATALOG_READY_WITH_PENDING | REVIEW_REQUIRED | REJECTED
// `status` (NEW/UNCHANGED/UPDATED/CONFLICT/REJECTED) se conserva derivado
// de ambas para no romper prepare-import.mjs/import.mjs, que siguen
// decidiendo aprobación por ese campo.
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
  extractConcentrationFromName,
  parseRawRow,
  derivePriceStatus,
  isPendingSentinel,
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
  CATALOG_RELATION as REL,
  QUALITY_STATUS as QUAL,
} from "./lib.mjs";

const COMPARABLE_FIELDS_EXCLUDED = new Set(["id", "created_at", "updated_at"]);
const PENDING_SIGNAL_EXCLUDED_FIELDS = new Set(["id", "created_at", "updated_at", "slug"]);

function loadMasterIndex(path) {
  if (!existsSync(path)) {
    return { byKey: new Map(), bySlug: new Map(), header: null };
  }
  const { header, rows } = readCsv(path);
  const byKey = new Map();
  const bySlug = new Map();
  for (const rawRow of rows) {
    // price_status (F3.7B) es un campo derivado — una fila del maestro
    // escrita antes de que existiera no lo tiene, y compararlo tal cual
    // contra un batchRow que SÍ lo trae (recién derivado por
    // normalize.mjs) generaría un UPDATED falso en cada fila. Se deriva
    // acá también, igual que en normalize.mjs, para comparar parejo.
    const priceSegmentValue = isPendingSentinel(rawRow.price_segment) ? null : rawRow.price_segment || null;
    const row = rawRow.price_status ? rawRow : { ...rawRow, price_status: derivePriceStatus(priceSegmentValue) };
    byKey.set(duplicateKey(row), row);
    if (row.slug) bySlug.set(row.slug, row);
  }
  return { byKey, bySlug, header };
}

/**
 * Indexa el catálogo actual por marca + nombre-base (concentración
 * stripeada si se pudo detectar, ver lib.mjs#extractConcentrationFromName).
 * Cada entrada guarda también la concentración detectada (o null si el
 * nombre no la menciona, ej. 'Eros') — eso es lo que permite distinguir
 * variante-de-concentración-distinta de posible-duplicado sin listar
 * marcas/slugs a mano.
 */
function loadCurrentAromiaIndex(path) {
  if (!existsSync(path)) return { byBaseName: new Map(), bySlug: new Map() };
  const { rows } = readCsv(path);
  const byBaseName = new Map();
  const bySlug = new Map();
  for (const row of rows) {
    const { baseName, concentration } = extractConcentrationFromName(row.nombre);
    const key = `${normalizeForKey(row.marca)}|${normalizeForKey(baseName)}`;
    if (!byBaseName.has(key)) byBaseName.set(key, []);
    byBaseName.get(key).push({ row, detectedConcentration: concentration });
    if (row.slug) bySlug.set(row.slug, row);
  }
  return { byBaseName, bySlug };
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

/** true si CUALQUIER campo (no id/slug/timestamps) quedó null o lista vacía tras normalizar — incluye enrichment y cualquier otro opcional. */
function hasAnyPendingField(batchRow) {
  const typed = parseRawRow(batchRow);
  return Object.entries(typed).some(([key, value]) => {
    if (PENDING_SIGNAL_EXCLUDED_FIELDS.has(key)) return false;
    if (Array.isArray(value)) return value.length === 0;
    return value === null || value === "";
  });
}

/** Dimensión 1: relación de identidad contra master + catálogo actual. Reglas generales, sin casos por slug. */
function determineRelation(batchRow, master, current) {
  const key = duplicateKey(batchRow);

  const slugOwnerMaster = master.bySlug.get(batchRow.slug);
  if (slugOwnerMaster && duplicateKey(slugOwnerMaster) !== key) {
    return {
      relation: REL.POSSIBLE_DUPLICATE,
      source: "slug_collision_master",
      reason: `slug '${batchRow.slug}' ya pertenece a otro producto en el catálogo maestro (${slugOwnerMaster.brand} ${slugOwnerMaster.name} ${slugOwnerMaster.concentration})`,
    };
  }
  const slugOwnerCurrent = current.bySlug.get(batchRow.slug);
  if (slugOwnerCurrent) {
    return {
      relation: REL.POSSIBLE_DUPLICATE,
      source: "slug_collision_current",
      reason: `slug '${batchRow.slug}' ya existe en el catálogo actual de Aromia (${slugOwnerCurrent.marca} ${slugOwnerCurrent.nombre}) — revisar manualmente`,
    };
  }

  const masterMatch = master.byKey.get(key);
  if (masterMatch) {
    return { relation: REL.EXISTING, source: "master", masterMatch };
  }

  const { baseName: batchBaseName } = extractConcentrationFromName(batchRow.name);
  const currentKey = `${normalizeForKey(batchRow.brand)}|${normalizeForKey(batchBaseName)}`;
  const currentMatches = current.byBaseName.get(currentKey) ?? [];
  if (currentMatches.length > 0) {
    const sameConcentration = currentMatches.filter(
      (m) => m.detectedConcentration && normalizeForKey(m.detectedConcentration) === normalizeForKey(batchRow.concentration)
    );
    if (sameConcentration.length > 0) {
      return {
        relation: REL.POSSIBLE_DUPLICATE,
        source: "current_catalog_same_concentration",
        candidates: sameConcentration.map((m) => ({ slug: m.row.slug, nombre: m.row.nombre, marca: m.row.marca })),
        reason: `Mismo brand+name+concentration ('${batchRow.concentration}') que ${sameConcentration.length} perfume(s) ya publicado(s) en Aromia — posible duplicado real, no una variante`,
      };
    }
    return {
      relation: REL.RELATED_VARIANT,
      source: "current_catalog_distinct_concentration",
      candidates: currentMatches.map((m) => ({ slug: m.row.slug, nombre: m.row.nombre, marca: m.row.marca, detectedConcentration: m.detectedConcentration })),
      reason: `Misma marca + mismo nombre base que ${currentMatches.length} perfume(s) ya publicado(s), con concentración distinta o no confirmada en el catálogo actual (batch: '${batchRow.concentration}') — variante relacionada, no duplicado (same brand + same normalized base name + distinct/unverified concentration = RELATED_VARIANT)`,
    };
  }

  return { relation: REL.NEW, source: null, reason: null };
}

/** Dimensión 2: ¿está lista para publicarse? Independiente de catalog_relation salvo por POSSIBLE_DUPLICATE. */
function determineQuality({ validationLevel, dedupeDecision, relationResult, batchRow, masterMatch }) {
  if (validationLevel === "error") {
    return { quality: QUAL.REJECTED, reasons: ["Fila con errores de validación bloqueantes en campos críticos (ver reporte de validate.mjs)"] };
  }
  if (dedupeDecision === "reject_exact_duplicate") {
    return { quality: QUAL.REJECTED, reasons: ["Fila 100% idéntica a otra del mismo batch — redundante, no un registro nuevo"] };
  }
  if (dedupeDecision === "needs_review_conflict") {
    return { quality: QUAL.REVIEW_REQUIRED, reasons: ["Mismo brand+name+concentration que otra fila del batch, con datos distintos — conflicto dentro del propio batch"] };
  }
  if (relationResult.relation === REL.POSSIBLE_DUPLICATE) {
    return { quality: QUAL.REVIEW_REQUIRED, reasons: [relationResult.reason] };
  }
  if (masterMatch && (batchRow.image_url || "") !== (masterMatch.image_url || "") && masterMatch.image_url) {
    return {
      quality: QUAL.REVIEW_REQUIRED,
      reasons: ["El batch propone un image_url distinto al ya presente en el catálogo maestro — no se modifica sin aprobación explícita (regla de seguridad Fase 3)"],
    };
  }
  return { quality: hasAnyPendingField(batchRow) ? QUAL.CATALOG_READY_WITH_PENDING : QUAL.CATALOG_READY, reasons: [] };
}

/** Deriva el `status` legacy (NEW/UNCHANGED/UPDATED/CONFLICT/REJECTED) desde las dos dimensiones — mantiene compatibles prepare-import.mjs/import.mjs sin tocarlos. */
function deriveLegacyStatus(relation, quality, masterMatch, fieldDiffsList) {
  if (quality === QUAL.REJECTED) return "REJECTED";
  if (quality === QUAL.REVIEW_REQUIRED) return "CONFLICT";
  // CATALOG_READY o CATALOG_READY_WITH_PENDING:
  if (relation === REL.EXISTING) return fieldDiffsList && fieldDiffsList.length > 0 ? "UPDATED" : "UNCHANGED";
  return "NEW"; // NEW o RELATED_VARIANT — ambos aprobables como entidad independiente
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

    const relationResult = determineRelation(batchRow, master, current);
    const { quality, reasons } = determineQuality({
      validationLevel: val?.level,
      dedupeDecision: dedupe?.decision,
      relationResult,
      batchRow,
      masterMatch: relationResult.masterMatch,
    });

    let fieldDiffsList;
    if (relationResult.relation === REL.EXISTING && quality !== QUAL.REJECTED && quality !== QUAL.REVIEW_REQUIRED) {
      fieldDiffsList = fieldDiffs(batchRow, relationResult.masterMatch);
    }

    const status = deriveLegacyStatus(relationResult.relation, quality, relationResult.masterMatch, fieldDiffsList);
    const reason = reasons[0] ?? relationResult.reason ?? null;

    return {
      ...base,
      catalog_relation: relationResult.relation,
      quality_status: quality,
      status, // legacy, derivado — ver deriveLegacyStatus
      reason,
      source: relationResult.source,
      ...(relationResult.candidates ? { candidates: relationResult.candidates } : {}),
      ...(fieldDiffsList ? { fieldDiffs: fieldDiffsList } : {}),
    };
  });

  const counts = classified.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});
  const relationCounts = classified.reduce((acc, r) => {
    acc[r.catalog_relation] = (acc[r.catalog_relation] ?? 0) + 1;
    return acc;
  }, {});
  const qualityCounts = classified.reduce((acc, r) => {
    acc[r.quality_status] = (acc[r.quality_status] ?? 0) + 1;
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
    catalogRelationCounts: {
      NEW: relationCounts.NEW ?? 0,
      EXISTING: relationCounts.EXISTING ?? 0,
      RELATED_VARIANT: relationCounts.RELATED_VARIANT ?? 0,
      POSSIBLE_DUPLICATE: relationCounts.POSSIBLE_DUPLICATE ?? 0,
    },
    qualityStatusCounts: {
      CATALOG_READY: qualityCounts.CATALOG_READY ?? 0,
      CATALOG_READY_WITH_PENDING: qualityCounts.CATALOG_READY_WITH_PENDING ?? 0,
      REVIEW_REQUIRED: qualityCounts.REVIEW_REQUIRED ?? 0,
      REJECTED: qualityCounts.REJECTED ?? 0,
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
  log(`catalog_relation — NEW: ${report.catalogRelationCounts.NEW} | EXISTING: ${report.catalogRelationCounts.EXISTING} | RELATED_VARIANT: ${report.catalogRelationCounts.RELATED_VARIANT} | POSSIBLE_DUPLICATE: ${report.catalogRelationCounts.POSSIBLE_DUPLICATE}`);
  log(`quality_status — CATALOG_READY: ${report.qualityStatusCounts.CATALOG_READY} | CATALOG_READY_WITH_PENDING: ${report.qualityStatusCounts.CATALOG_READY_WITH_PENDING} | REVIEW_REQUIRED: ${report.qualityStatusCounts.REVIEW_REQUIRED} | REJECTED: ${report.qualityStatusCounts.REJECTED}`);
  if (!report.masterExists) {
    warn("catalog/aromia-catalog-master.csv todavía no existe — todo lo no-conflictivo cae como NEW (esperable antes del primer batch importado)");
  }
  log(`Reporte: catalog/reports/${report.batch}-diff.json`);
}

if (isMainModule(import.meta.url)) {
  main();
}
