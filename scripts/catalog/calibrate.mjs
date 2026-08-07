#!/usr/bin/env node
// F3.5 — Auditoría de calibración contra un batch REAL de Cowork. No es
// parte del flujo estándar de Bloque A-D (validate/normalize/dedupe/diff/
// prepare-import) — es una capa de reporte adicional para el primer piloto
// real, que produce CSVs de revisión humana además de los JSON habituales.
// No escribe a Postgres, no importa nada, no modifica el batch de entrada.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { diffBatch } from "./diff.mjs";
import { readCsv, readJson, REPORTS_DIR, batchNameFromPath, log, isMainModule } from "./lib.mjs";

// Clasificación curada a mano por Code tras revisar el batch-001 real fila
// por fila (25 filas, revisión manual factible y más confiable que un
// clasificador automático para un piloto de este tamaño). Para Batch 002+
// (100 filas) esto necesita un enfoque programático — ver recomendación en
// el summary.
const KNOWN_FINDINGS = {
  "santal-33-edp": { category: "F", note: "top/heart/base_notes pending — fuente no separó pirámide, se volcó a accords en su lugar (documentado por Cowork)." },
  "armani-code-parfum": { category: "F", note: "family + top/heart/base_notes pending — sin fuente confiable en el snippet de búsqueda." },
  "naxos-edp": {
    category: "F",
    note: "family pending. Además (categoría E, no bloqueante): CONFLICTO DE FECHA — Fragrantica indica 2015, ScentVerdict indica 2017; Cowork priorizó Fragrantica como fuente principal designada, señalado sin resolver del todo. launch_year sí tiene un valor, esto no afecta el REJECTED (que es por family).",
  },
  "side-effect-edp": { category: "F", note: "top/heart/base_notes pending — mismo patrón que Santal 33 (pirámide no separada por la fuente)." },
  "explorer-edp": { category: "F", note: "family pending, data_confidence=low. Nota aclara que descartó explícitamente el precio de 'Explorer Extreme' (variante distinta) — buena disciplina, no hay error." },
  "scandal-edp": { category: "F", note: "family pending." },
  "the-one-for-men-edt": { category: "F", note: "family pending, data_confidence=low." },
  "cloud-edp": { category: "F", note: "base_notes pending." },
  "replica-jazz-club-edt": { category: "F", note: "family pending." },
  "vanilla-28-edp": { category: "B", note: "source_url trae DOS URLs en una sola celda separadas por ';' — el schema exige una URI única. Es el reemplazo de 'Kayali Musk Rose 21' (inexistente) por 'Vanilla | 28' (real, verificado) documentado en notes.", requiresHumanDecision: true },
  "eros-parfum": { category: "D", note: "Coincide por marca+nombre con 'eros' (EDT) ya publicado — Cowork documentó que es un producto distinto (Parfum, 2021 vs. 2012), pero el pipeline no puede verificar concentración contra PERFUMES_INITIAL_50.csv de forma confiable y correctamente pide revisión humana.", requiresHumanDecision: true },
  "terre-d-hermes-parfum": { category: "D", note: "Coincide por marca+nombre con 'terre-d-hermes-edt' ya publicado — mismo patrón que Eros: Cowork documentó que es un producto distinto (Parfum 2009 vs. EDT 2006), pipeline pide revisión humana por la misma limitación de matching.", requiresHumanDecision: true },
  "ani-extrait": { category: "E", note: "HALLAZGO GRAVE: precio en conflicto fuerte entre Selfridges ($100) y Luckyscent ($375) para el mismo tamaño — price_segment queda pending, NO resuelto arbitrariamente. Pipeline aprueba la fila como NEW en lo estructural, pero el precio sigue sin decidir.", requiresHumanDecision: true },
  "elysium-pour-homme-parfum-cologne": { category: "B", note: "concentration='Parfum Cologne' (nomenclatura propia de Roja Parfums) — ya no bloquea (fix de esta sesión: concentration dejó de ser enum cerrado). Confirmado con warning no bloqueante, no error." },
  "shalimar-edp": { category: "E", note: "Ambigüedad de fecha (1925 concepto original vs. 1990 lanzamiento de esta concentración EDP específica) — Cowork usó el año correspondiente a la concentración, señalado en notes. No bloquea." },
  "interlude-woman-edp": { category: "H", note: "Nota informativa: par de línea con 'interlude-man' ya existente — correctamente NO detectado como conflicto (nombres distintos), confirma que el matching no genera falsos positivos en este caso." },
};

function buildValidationCsv(batchName, validationReport) {
  const rows = validationReport.rows.map((r) => ({
    row: r.row,
    id: r.id ?? "",
    slug: r.slug ?? "",
    level: r.level,
    error_codes: r.issues.filter((i) => i.severity === "error").map((i) => i.code).join(";"),
    warning_codes: r.issues.filter((i) => i.severity === "warning").map((i) => i.code).join(";"),
    issue_summary: r.issues.map((i) => `[${i.severity}] ${i.message}`).join(" | "),
  }));
  return rows;
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
      out.push({
        row: change.row,
        id: change.id ?? "",
        slug: change.slug ?? "",
        field: f.field,
        from: f.from,
        to: f.to,
        reason: f.reason,
      });
    }
  }
  return out;
}

function buildExceptionsCsv(diffReport, rawRows) {
  const bySlug = new Map(rawRows.map((r) => [r.slug, r]));
  const out = [];
  for (const row of diffReport.rows) {
    const slug = row.slug;
    const known = KNOWN_FINDINGS[slug];
    const isPipelineFlagged = row.status === "CONFLICT" || row.status === "REJECTED";
    if (!isPipelineFlagged && !known) continue;
    out.push({
      row: row.row,
      id: row.id ?? "",
      slug: slug ?? "",
      diff_status: row.status,
      category: known?.category ?? (row.status === "REJECTED" ? "F" : row.status === "CONFLICT" ? "D" : ""),
      requires_human_decision: known?.requiresHumanDecision ? "true" : "false",
      data_confidence: bySlug.get(slug)?.data_confidence ?? "",
      pipeline_reason: row.reason ?? "",
      note: known?.note ?? "",
    });
  }
  // filas con hallazgo curado pero que el pipeline no marcó CONFLICT/REJECTED (ej. shalimar-edp, elysium, interlude-woman)
  for (const [slug, known] of Object.entries(KNOWN_FINDINGS)) {
    if (out.some((r) => r.slug === slug)) continue;
    const diffRow = diffReport.rows.find((r) => r.slug === slug);
    if (!diffRow) continue; // ej. 'naxos-edp-date', clave sintética sin fila propia
    out.push({
      row: diffRow.row,
      id: diffRow.id ?? "",
      slug,
      diff_status: diffRow.status,
      category: known.category,
      requires_human_decision: known.requiresHumanDecision ? "true" : "false",
      data_confidence: bySlug.get(slug)?.data_confidence ?? "",
      pipeline_reason: diffRow.reason ?? "",
      note: known.note,
    });
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

export function calibrate(rawFilePath) {
  const batchName = batchNameFromPath(rawFilePath);
  const result = diffBatch(rawFilePath);
  if (result.fatal) throw new Error(`calibrate: diffBatch fatal — ${result.report.fatalReason}`);

  const { report: diffReport, validation, rawValidation, dedupeSummary, normalizedRows } = result;
  const trace = readJson(join(REPORTS_DIR, `${batchName}-normalize-trace.json`));
  const { rows: rawRows } = readCsv(rawFilePath);

  const validationCsvRows = buildValidationCsv(batchName, validation.report);
  const duplicatesCsvRows = buildDuplicatesCsv(dedupeSummary);
  const normalizationCsvRows = buildNormalizationCsv(trace);
  const exceptionsCsvRows = buildExceptionsCsv(diffReport, rawRows);

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
  for (const row of exceptionsCsvRows) {
    categoryCounts[row.category] = (categoryCounts[row.category] || 0) + 1;
  }

  return {
    batchName,
    diffReport,
    validation,
    rawValidation,
    dedupeSummary,
    normalizedRows,
    rawRows,
    trace,
    exceptionsCsvRows,
    categoryCounts,
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
  log(`Categorías (filas con hallazgo): ${JSON.stringify(result.categoryCounts)}`);
  log(`CSVs escritos: ${Object.values(result.outPaths).join(", ")}`);
}

if (isMainModule(import.meta.url)) {
  main();
}
