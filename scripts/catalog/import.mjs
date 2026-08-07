#!/usr/bin/env node
// Bloque D — importador real. Bloqueado por defecto: requiere --approved
// explícito. Incluso aprobado, este script NUNCA escribe a Postgres — no
// hay ningún cliente de base de datos importado acá, a propósito, como
// garantía estructural (no solo un `if`) durante la Fase 3. Lo único que
// --approved permite es fusionar la propuesta ya revisada dentro de
// catalog/aromia-catalog-master.csv (archivo versionado en git, no
// producción). Soporta --dry-run para ver el plan sin escribir nada.
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  readCsv,
  writeCsv,
  MASTER_CSV,
  STAGING_DIR,
  duplicateKey,
  log,
  warn,
  fail,
  isMainModule,
} from "./lib.mjs";

const PROPOSAL_ONLY_COLUMNS = new Set(["diff_status", "diff_reason"]);

function findLatestProposal() {
  if (!existsSync(STAGING_DIR)) return null;
  const candidates = readdirSync(STAGING_DIR)
    .filter((f) => f.endsWith(".import-proposal.csv"))
    .map((f) => ({ file: f, mtime: statSync(join(STAGING_DIR, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  return candidates.length > 0 ? join(STAGING_DIR, candidates[0].file) : null;
}

function stripProposalColumns(row) {
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    if (!PROPOSAL_ONLY_COLUMNS.has(k)) out[k] = v;
  }
  return out;
}

export function planImport(proposalPath) {
  const { rows } = readCsv(proposalPath);
  const inserts = rows.filter((r) => r.diff_status === "NEW");
  const updates = rows.filter((r) => r.diff_status === "UPDATED");
  const other = rows.filter((r) => r.diff_status !== "NEW" && r.diff_status !== "UPDATED");
  return { rows, inserts, updates, other };
}

export function applyImport(proposalPath, masterCsvPath = MASTER_CSV) {
  const { rows, inserts, updates, other } = planImport(proposalPath);
  if (other.length > 0) {
    throw new Error(
      `La propuesta contiene ${other.length} fila(s) con diff_status inesperado (solo NEW/UPDATED deberían llegar acá) — abortando por seguridad.`
    );
  }

  const masterHeader = existsSync(masterCsvPath) ? readCsv(masterCsvPath).header : null;
  const masterRows = existsSync(masterCsvPath) ? readCsv(masterCsvPath).rows : [];
  const header = masterHeader && masterHeader.length > 0
    ? masterHeader
    : Object.keys(stripProposalColumns(rows[0] ?? {}));

  const byKey = new Map(masterRows.map((r) => [duplicateKey(r), r]));
  for (const row of [...inserts, ...updates]) {
    const clean = stripProposalColumns(row);
    byKey.set(duplicateKey(clean), clean);
  }

  const merged = [...byKey.values()];
  writeCsv(masterCsvPath, header, merged);
  return { masterCsvPath, totalMasterRows: merged.length, inserted: inserts.length, updated: updates.length };
}

function parseArgs(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith("--")));
  const positional = argv.filter((a) => !a.startsWith("--"));
  return {
    approved: flags.has("--approved"),
    dryRun: flags.has("--dry-run"),
    proposalPath: positional[0] ?? null,
  };
}

function main() {
  const { approved, dryRun, proposalPath } = parseArgs(process.argv.slice(2));

  log("catalog:import — Bloque D (Fase 3, Catalog Data Pipeline & Expansion 500)");
  log("Garantía estructural: este script no importa ningún cliente de Postgres. No puede escribir a producción aunque se lo pidan las flags.");

  if (!approved) {
    log("");
    log("BLOQUEADO por defecto. No se aprobó ninguna importación.");
    log("Para revisar el plan sin escribir nada: agregar --dry-run --approved");
    log("Para aplicar la fusión al catálogo maestro LOCAL (catalog/aromia-catalog-master.csv, no Postgres): agregar --approved");
    return;
  }

  const resolvedPath = proposalPath ?? findLatestProposal();
  if (!resolvedPath || !existsSync(resolvedPath)) {
    fail(`No se encontró una propuesta de importación${proposalPath ? ` en ${proposalPath}` : " en catalog/staging/"}. Correr antes: npm run prepare-import -- <batch.csv>`);
    process.exit(1);
  }

  const { inserts, updates, other } = planImport(resolvedPath);
  log("");
  log(`Propuesta: ${resolvedPath}`);
  log(`  Nuevos (NEW):      ${inserts.length}`);
  log(`  Actualizados:      ${updates.length}`);
  if (other.length > 0) {
    fail(`  Filas con diff_status inválido: ${other.length} — abortando, no se aprueba nada`);
    process.exit(1);
  }

  if (dryRun) {
    log("");
    log("DRY-RUN: no se escribió catalog/aromia-catalog-master.csv. Postgres no fue tocado (y no puede serlo desde este script).");
    for (const row of inserts) log(`  + NEW      ${row.slug} (${row.brand} ${row.name} ${row.concentration})`);
    for (const row of updates) log(`  ~ UPDATED  ${row.slug} (${row.brand} ${row.name} ${row.concentration})`);
    return;
  }

  const result = applyImport(resolvedPath);
  log("");
  log(`Fusionado en ${result.masterCsvPath}`);
  log(`  Filas totales en el maestro: ${result.totalMasterRows}`);
  log(`  Insertadas: ${result.inserted} | Actualizadas: ${result.updated}`);
  warn("Recordatorio: esto actualizó SOLO el CSV maestro local versionado en git. La importación real a Postgres de producción sigue sin implementarse — requiere una fase/aprobación aparte.");
}

if (isMainModule(import.meta.url)) {
  main();
}
