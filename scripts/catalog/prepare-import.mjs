#!/usr/bin/env node
// Bloque C — orquesta validate -> normalize -> deduplicate -> diff sobre un
// batch crudo y produce la propuesta de importación + reportes de revisión
// por excepciones. NO escribe a Postgres ni al catálogo maestro — eso es
// import.mjs (Bloque D), bloqueado por defecto.
//
// Salida:
//   catalog/staging/{batch}.import-proposal.csv  — filas NEW + UPDATED (aprobables)
//   catalog/rejected/{batch}-rejected.csv         — filas REJECTED, con motivo
//   catalog/reports/{batch}-summary.md            — resumen para revisión humana
import { join } from "node:path";
import { diffBatch } from "./diff.mjs";
import {
  writeCsv,
  STAGING_DIR,
  REJECTED_DIR,
  REPORTS_DIR,
  batchNameFromPath,
  nowIso,
  log,
  warn,
  fail,
  isMainModule,
} from "./lib.mjs";
import { writeFileSync } from "node:fs";

function groupCount(rows, field) {
  const counts = {};
  for (const r of rows) {
    const value = r[field] && r[field].trim() !== "" ? r[field] : "(vacío)";
    counts[value] = (counts[value] ?? 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function mdTable(title, entries) {
  if (entries.length === 0) return `**${title}**: sin datos\n`;
  const lines = [`**${title}**`, "", "| Valor | Cantidad |", "|---|---|"];
  for (const [value, count] of entries) lines.push(`| ${value} | ${count} |`);
  return lines.join("\n") + "\n";
}

export function prepareImport(rawFilePath) {
  const batchName = batchNameFromPath(rawFilePath);
  const result = diffBatch(rawFilePath);

  if (result.fatal) {
    return { fatal: true, batchName, reason: result.report.fatalReason };
  }

  const { report: diffReport, normalizedRows, validation, dedupeSummary } = result;
  const statusByRow = new Map(diffReport.rows.map((r) => [r.row, r]));

  const approvable = [];
  const rejected = [];

  normalizedRows.forEach((row, idx) => {
    const rowNumber = idx + 2;
    const status = statusByRow.get(rowNumber);
    if (status.status === "NEW" || status.status === "UPDATED") {
      approvable.push({ ...row, diff_status: status.status, diff_reason: status.reason ?? "" });
    } else if (status.status === "REJECTED") {
      rejected.push({ ...row, reject_reason: status.reason ?? "" });
    }
    // UNCHANGED y CONFLICT no se proponen para import: UNCHANGED no tiene nada
    // que hacer, CONFLICT requiere una decisión humana antes de proponerse.
  });

  let proposalPath = null;
  if (approvable.length > 0) {
    const header = [...Object.keys(normalizedRows[0]), "diff_status", "diff_reason"];
    proposalPath = join(STAGING_DIR, `${batchName}.import-proposal.csv`);
    writeCsv(proposalPath, header, approvable);
  }

  let rejectedPath = null;
  if (rejected.length > 0) {
    const header = [...Object.keys(normalizedRows[0]), "reject_reason"];
    rejectedPath = join(REJECTED_DIR, `${batchName}-rejected.csv`);
    writeCsv(rejectedPath, header, rejected);
  }

  const incompleteFieldIssues = validation.report.rows
    .flatMap((r) => r.issues)
    .filter((i) => i.code === "schema_violation" && /fewer than 1 characters|must have required property/.test(i.message));
  const invalidUrlIssues = validation.report.rows
    .flatMap((r) => r.issues)
    .filter((i) => i.code === "invalid_image_url" || (i.code === "schema_violation" && /format "uri"/.test(i.message)));

  const needsHumanReview = diffReport.rows.filter((r) => r.status === "CONFLICT");

  const summaryLines = [
    `# Resumen de batch — ${batchName}`,
    "",
    `Generado: ${nowIso()}`,
    "",
    "## Totales",
    "",
    `- Total de filas: ${diffReport.totalRows}`,
    `- Válidas (pasan validate.mjs, con o sin warnings): ${validation.report.okRows + validation.report.warningRows}`,
    `- Rechazadas: ${diffReport.counts.REJECTED}`,
    `- Nuevas (NEW): ${diffReport.counts.NEW}`,
    `- Actualizaciones propuestas (UPDATED): ${diffReport.counts.UPDATED}`,
    `- Sin cambios (UNCHANGED): ${diffReport.counts.UNCHANGED}`,
    `- Conflictos (requieren revisión humana): ${diffReport.counts.CONFLICT}`,
    `- Duplicados exactos dentro del batch: ${dedupeSummary.rejectedExactDuplicates}`,
    `- Conflictos de duplicado dentro del batch (misma brand+name+concentration, datos distintos): ${dedupeSummary.needsReviewConflicts}`,
    `- Warnings de validación: ${validation.report.warningRows}`,
    `- Campos obligatorios incompletos detectados: ${incompleteFieldIssues.length}`,
    `- Variantes de producto detectadas (misma marca+nombre, distinta concentración — no son conflicto, son productos legítimos): ${dedupeSummary.variantFamiliesDetected}`,
    `- URLs inválidas detectadas: ${invalidUrlIssues.length}`,
    "",
    "## Distribuciones",
    "",
    mdTable("Por marca", groupCount(normalizedRows, "brand")),
    mdTable("Por concentración", groupCount(normalizedRows, "concentration")),
    mdTable("Por género", groupCount(normalizedRows, "gender")),
    mdTable("Por nivel de confianza (data_confidence)", groupCount(normalizedRows, "data_confidence")),
    "## Revisión por excepciones",
    "",
    needsHumanReview.length === 0
      ? "Ningún registro requiere revisión humana en este batch."
      : `${needsHumanReview.length} registro(s) requieren revisión humana:\n\n` +
        needsHumanReview.map((r) => `- Fila ${r.row} (slug: ${r.slug ?? "—"}, id: ${r.id ?? "—"}): ${r.reason}`).join("\n"),
    "",
    "## Archivos generados",
    "",
    `- Propuesta de importación: ${proposalPath ?? "(ninguna fila aprobable en este batch)"}`,
    `- Rechazados: ${rejectedPath ?? "(ninguna fila rechazada en este batch)"}`,
    `- Diff completo: catalog/reports/${batchName}-diff.json`,
    `- Validación del batch crudo (informativa, antes de normalizar): catalog/reports/${batchName}-validation.json`,
    `- Validación autoritativa (post-normalización — decide REJECTED): catalog/reports/${batchName}.normalized-validation.json`,
    `- Trace de normalización: catalog/reports/${batchName}-normalize-trace.json`,
    `- Duplicados dentro del batch: catalog/reports/${batchName}.normalized-duplicates.json`,
    "",
  ];

  const summaryPath = join(REPORTS_DIR, `${batchName}-summary.md`);
  writeFileSync(summaryPath, summaryLines.join("\n"), "utf-8");

  return {
    fatal: false,
    batchName,
    proposalPath,
    rejectedPath,
    summaryPath,
    diffReport,
    approvableCount: approvable.length,
    rejectedCount: rejected.length,
    needsReviewCount: needsHumanReview.length,
  };
}

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    fail("Uso: node prepare-import.mjs <path-a-csv-crudo-del-batch>");
    process.exit(1);
  }
  const result = prepareImport(filePath);
  if (result.fatal) {
    fail(`prepare-import abortado: ${result.reason}`);
    process.exit(1);
  }
  log(`Batch: ${result.batchName}`);
  log(`Aprobables (NEW+UPDATED): ${result.approvableCount}`);
  log(`Rechazados: ${result.rejectedCount}`);
  log(`Requieren revisión humana (CONFLICT): ${result.needsReviewCount}`);
  if (result.needsReviewCount > 0) {
    warn(`${result.needsReviewCount} registro(s) necesitan una decisión humana antes de aprobar el batch — ver ${result.summaryPath}`);
  }
  log(`Resumen: ${result.summaryPath}`);
}

if (isMainModule(import.meta.url)) {
  main();
}
