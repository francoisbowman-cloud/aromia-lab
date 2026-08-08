#!/usr/bin/env node
// F3.5/F3.6 — Auditoría de calibración contra un batch real de Cowork. No es
// parte del flujo estándar de Bloque A-D — es una capa de reporte adicional
// que produce CSVs de revisión humana además de los JSON habituales.
// No escribe a Postgres, no importa nada, no modifica el batch de entrada.
//
// F3.6: la categorización A-H se deriva de REGLAS GENERALES sobre
// catalog_relation/quality_status/issues de validación — no hay ninguna
// tabla de hallazgos por slug (ver KNOWN_FINDINGS eliminado en F3.6, la
// versión anterior de este archivo no escala a Batch 002+). Los casos de
// batch-001 (Ani, Vanilla, Eros, Terre d'Hermès) siguen cubiertos, pero
// como consecuencia de las reglas generales, no como excepciones
// hardcodeadas — ver tests/f36-calibration-rules.test.mjs.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { diffBatch } from "./diff.mjs";
import { readCsv, readJson, REPORTS_DIR, batchNameFromPath, log, isMainModule } from "./lib.mjs";

const CATEGORY = Object.freeze({
  DATA_ERROR: "A",
  CONTRACT_MISMATCH: "B",
  NORMALIZATION_GAP: "C",
  IDENTITY_AMBIGUITY: "D",
  SOURCE_CONFLICT: "E",
  EXPECTED_PENDING: "F",
  PIPELINE_BUG: "G",
  CATALOG_BASELINE_ISSUE: "H",
});

/**
 * Categoriza UN issue de validación de nivel error, mirando el valor CRUDO
 * original (antes de normalizar) del campo que falló. Regla general: si
 * Cowork dejó el sentinel 'pending' a propósito, es F (disciplina
 * correcta); si dejó la celda vacía sin marcarla, es A (posible descuido,
 * no documentado como intencional).
 */
function categorizeValidationIssue(issue, rawRow) {
  const field = issue.field;
  const rawValue = field ? String(rawRow?.[field] ?? "").trim() : "";
  if (rawValue.toLowerCase() === "pending") {
    return { category: CATEGORY.EXPECTED_PENDING, note: `${field}: dejado 'pending' a propósito (Cowork no inventó el dato) — ${issue.message}` };
  }
  if (rawValue === "") {
    return { category: CATEGORY.DATA_ERROR, note: `${field}: celda vacía sin marcar como pending — ${issue.message}` };
  }
  return { category: CATEGORY.DATA_ERROR, note: `${field}: valor presente pero inválido — ${issue.message}` };
}

function categorizeRow(diffRow, rawRow, validationRowByRow, dedupeDecisionByRow) {
  const findings = [];

  if (diffRow.quality_status === "REJECTED") {
    const valRow = validationRowByRow.get(diffRow.row);
    const errorIssues = (valRow?.issues ?? []).filter((i) => i.severity === "error");
    if (errorIssues.length === 0) {
      // rechazado por duplicado exacto dentro del batch, no por validación de campo
      findings.push({ category: CATEGORY.IDENTITY_AMBIGUITY, note: diffRow.reason });
    }
    for (const issue of errorIssues) {
      findings.push(categorizeValidationIssue(issue, rawRow));
    }
  } else if (diffRow.quality_status === "REVIEW_REQUIRED") {
    if (diffRow.catalog_relation === "POSSIBLE_DUPLICATE") {
      findings.push({ category: CATEGORY.IDENTITY_AMBIGUITY, note: diffRow.reason });
    } else if (diffRow.source === "image_url_change_blocked") {
      findings.push({ category: CATEGORY.CONTRACT_MISMATCH, note: diffRow.reason });
    } else {
      findings.push({ category: CATEGORY.IDENTITY_AMBIGUITY, note: diffRow.reason ?? "Requiere revisión — motivo no clasificado automáticamente." });
    }
  }

  // warnings — no cambian quality_status, pero son hallazgos igual (B: enum abierto no contemplado)
  const valRow = validationRowByRow.get(diffRow.row);
  for (const issue of valRow?.issues ?? []) {
    if (issue.severity === "warning" && issue.code === "non_standard_concentration") {
      findings.push({ category: CATEGORY.CONTRACT_MISMATCH, note: issue.message });
    }
  }

  // dedupe: conflicto dentro del propio batch (ya cubierto por quality_status arriba si aplica, pero puede coexistir con otros hallazgos)
  const dedupe = dedupeDecisionByRow.get(diffRow.row);
  if (dedupe?.decision === "needs_review_conflict" && diffRow.quality_status !== "REVIEW_REQUIRED") {
    findings.push({ category: CATEGORY.IDENTITY_AMBIGUITY, note: dedupe.reason });
  }

  return findings;
}

function buildValidationCsv(validationReport) {
  return validationReport.rows.map((r) => ({
    row: r.row,
    id: r.id ?? "",
    slug: r.slug ?? "",
    level: r.level,
    error_codes: r.issues.filter((i) => i.severity === "error").map((i) => i.code).join(";"),
    warning_codes: r.issues.filter((i) => i.severity === "warning").map((i) => i.code).join(";"),
    issue_summary: r.issues.map((i) => `[${i.severity}] ${i.message}`).join(" | "),
  }));
}

function buildDuplicatesCsv(dedupeSummary) {
  return dedupeSummary.decisions.map((d) => ({
    row: d.row,
    id: d.id ?? "",
    slug: d.slug ?? "",
    duplicate_key: d.duplicateKey,
    decision: d.decision,
    reason: d.reason ?? "",
  }));
}

function buildNormalizationCsv(trace) {
  const out = [];
  for (const change of trace.changes) {
    for (const f of change.fields) {
      out.push({ row: change.row, id: change.id ?? "", slug: change.slug ?? "", field: f.field, from: f.from, to: f.to, reason: f.reason });
    }
  }
  return out;
}

function buildExceptionsCsv(diffReport, rawRowsByRow, validationRowByRow, dedupeDecisionByRow) {
  const out = [];
  for (const diffRow of diffReport.rows) {
    const findings = categorizeRow(diffRow, rawRowsByRow.get(diffRow.row), validationRowByRow, dedupeDecisionByRow);
    if (findings.length === 0) continue; // CATALOG_READY(_WITH_PENDING) sin hallazgo -> no es una excepción
    const requiresHumanDecision = diffRow.quality_status === "REVIEW_REQUIRED";
    for (const finding of findings) {
      out.push({
        row: diffRow.row,
        id: diffRow.id ?? "",
        slug: diffRow.slug ?? "",
        catalog_relation: diffRow.catalog_relation,
        quality_status: diffRow.quality_status,
        category: finding.category,
        requires_human_decision: requiresHumanDecision ? "true" : "false",
        note: finding.note,
      });
    }
  }
  out.sort((a, b) => a.row - b.row);
  return out;
}

function toCsv(rows) {
  if (rows.length === 0) return "";
  const header = Object.keys(rows[0]);
  const esc = (v) => {
    const s = String(v ?? "");
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [header.join(","), ...rows.map((r) => header.map((h) => esc(r[h])).join(","))].join("\n") + "\n";
}

export function calibrate(rawFilePath, opts = {}) {
  const batchName = batchNameFromPath(rawFilePath);
  const result = diffBatch(rawFilePath, opts);
  if (result.fatal) throw new Error(`calibrate: diffBatch fatal — ${result.report.fatalReason}`);

  const { report: diffReport, validation, dedupeSummary } = result;
  const trace = readJson(join(REPORTS_DIR, `${batchName}-normalize-trace.json`));
  const { rows: rawRows } = readCsv(rawFilePath);
  const rawRowsByRow = new Map(rawRows.map((r, idx) => [idx + 2, r]));
  const validationRowByRow = new Map(validation.report.rows.map((r) => [r.row, r]));
  const dedupeDecisionByRow = new Map(dedupeSummary.decisions.map((d) => [d.row, d]));

  const validationCsvRows = buildValidationCsv(validation.report);
  const duplicatesCsvRows = buildDuplicatesCsv(dedupeSummary);
  const normalizationCsvRows = buildNormalizationCsv(trace);
  const exceptionsCsvRows = buildExceptionsCsv(diffReport, rawRowsByRow, validationRowByRow, dedupeDecisionByRow);

  const outPaths = {
    validation: join(REPORTS_DIR, `${batchName}-real-validation.csv`),
    duplicates: join(REPORTS_DIR, `${batchName}-real-duplicates.csv`),
    normalization: join(REPORTS_DIR, `${batchName}-real-normalization.csv`),
    exceptions: join(REPORTS_DIR, `${batchName}-real-exceptions.csv`),
  };
  writeFileSync(outPaths.validation, toCsv(validationCsvRows), "utf-8");
  writeFileSync(outPaths.duplicates, toCsv(duplicatesCsvRows), "utf-8");
  writeFileSync(outPaths.normalization, toCsv(normalizationCsvRows), "utf-8");
  writeFileSync(outPaths.exceptions, toCsv(exceptionsCsvRows), "utf-8");

  const categoryCounts = {};
  for (const row of exceptionsCsvRows) categoryCounts[row.category] = (categoryCounts[row.category] || 0) + 1;

  const unresolvedPriceSegmentPending = rawRows.filter((r) => String(r.price_segment ?? "").trim().toLowerCase() === "pending").length;

  return {
    batchName,
    diffReport,
    validation,
    dedupeSummary,
    exceptionsCsvRows,
    categoryCounts,
    unresolvedPriceSegmentPending,
    outPaths,
  };
}

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    process.stderr.write("Uso: node calibrate.mjs <path-a-csv-crudo-del-batch>\n");
    process.exit(1);
  }
  const result = calibrate(filePath);
  log(`Batch: ${result.batchName}`);
  log(`Categorías (hallazgos): ${JSON.stringify(result.categoryCounts)}`);
  log(`Filas con price_segment pending (proxy de posible conflicto de fuente sin resolver — no distingue de 'sin fuente'): ${result.unresolvedPriceSegmentPending}`);
  log(`CSVs escritos: ${Object.values(result.outPaths).join(", ")}`);
}

if (isMainModule(import.meta.url)) {
  main();
}
