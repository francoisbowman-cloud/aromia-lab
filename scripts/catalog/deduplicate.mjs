#!/usr/bin/env node
// Detección de duplicados dentro de un batch (Bloque B). Opera sobre el
// CSV YA normalizado (catalog/staging/{batch}.normalized.csv) — corre
// normalize.mjs antes si hace falta. No fusiona variantes: Sauvage EDT /
// EDP / Parfum / Elixir son SIEMPRE productos distintos (misma
// duplicateKey solo si brand+name+concentration coinciden los tres).
import { join } from "node:path";
import {
  readCsv,
  writeJson,
  duplicateKey,
  variantFamilyKey,
  exactRowSignature,
  REPORTS_DIR,
  PIPELINE_VERSION,
  SCHEMA_VERSION,
  batchNameFromPath,
  nowIso,
  log,
  warn,
  isMainModule,
} from "./lib.mjs";

/**
 * decision por fila:
 *  - keep: única en su duplicateKey, o primera aparición de un grupo.
 *  - reject_exact_duplicate: fila 100% idéntica (salvo id/timestamps) a
 *    una anterior del mismo batch — se descarta automáticamente, no
 *    requiere revisión humana.
 *  - needs_review_conflict: mismo brand+name+concentration que otra
 *    fila pero con datos distintos — requiere decisión humana, el
 *    pipeline NO elige cuál es la correcta.
 */
export function deduplicateBatch(filePath) {
  const batchName = batchNameFromPath(filePath);
  const { rows } = readCsv(filePath);

  const bySignature = new Map(); // signature -> primera fila (rowNumber)
  const byDuplicateKey = new Map(); // key -> [ {rowNumber, id, signature} ]
  const variantFamilies = new Map(); // brand+name -> Set(concentration)

  const decisions = rows.map((row, idx) => {
    const rowNumber = idx + 2;
    const signature = exactRowSignature(row);
    const dupKey = duplicateKey(row);
    const famKey = variantFamilyKey(row);

    if (!variantFamilies.has(famKey)) variantFamilies.set(famKey, new Set());
    variantFamilies.get(famKey).add(row.concentration);

    if (bySignature.has(signature)) {
      return {
        row: rowNumber,
        id: row.id || null,
        slug: row.slug || null,
        duplicateKey: dupKey,
        decision: "reject_exact_duplicate",
        reason: `Idéntica a la fila ${bySignature.get(signature)}`,
      };
    }
    bySignature.set(signature, rowNumber);

    const group = byDuplicateKey.get(dupKey) ?? [];
    group.push({ rowNumber, id: row.id || null, signature });
    byDuplicateKey.set(dupKey, group);

    return {
      row: rowNumber,
      id: row.id || null,
      slug: row.slug || null,
      duplicateKey: dupKey,
      decision: "pending_group_evaluation",
      reason: null,
    };
  });

  // segunda pasada: para cada grupo con >1 fila sobreviviente (no exacta),
  // el primero queda 'keep', el resto 'needs_review_conflict'.
  for (const [key, group] of byDuplicateKey.entries()) {
    group.forEach((entry, i) => {
      const decision = decisions.find((d) => d.row === entry.rowNumber);
      if (i === 0) {
        decision.decision = "keep";
      } else {
        decision.decision = "needs_review_conflict";
        decision.reason = `Mismo brand+name+concentration ('${key}') que la fila ${group[0].rowNumber}, con datos distintos — no se fusiona automáticamente`;
      }
    });
  }

  const variantConflicts = [...variantFamilies.entries()]
    .filter(([, concentrations]) => concentrations.size > 1)
    .map(([famKey, concentrations]) => ({ product: famKey, concentrations: [...concentrations].sort() }));

  const summary = {
    batch: batchName,
    file: filePath,
    pipelineVersion: PIPELINE_VERSION,
    schemaVersion: SCHEMA_VERSION,
    generatedAt: nowIso(),
    totalRows: rows.length,
    kept: decisions.filter((d) => d.decision === "keep").length,
    rejectedExactDuplicates: decisions.filter((d) => d.decision === "reject_exact_duplicate").length,
    needsReviewConflicts: decisions.filter((d) => d.decision === "needs_review_conflict").length,
    variantFamiliesDetected: variantConflicts.length,
    variantConflicts,
    decisions,
  };

  const reportPath = join(REPORTS_DIR, `${batchName}-duplicates.json`);
  writeJson(reportPath, summary);
  return { reportPath, summary };
}

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    process.stderr.write("Uso: node deduplicate.mjs <path-a-csv-normalizado>\n");
    process.exit(1);
  }
  const { reportPath, summary } = deduplicateBatch(filePath);
  log(`Batch: ${summary.batch}`);
  log(`Filas: ${summary.totalRows} (keep: ${summary.kept}, duplicados exactos rechazados: ${summary.rejectedExactDuplicates}, conflictos a revisar: ${summary.needsReviewConflicts})`);
  if (summary.variantFamiliesDetected > 0) {
    log(`Familias de producto con múltiples concentraciones (no son conflicto, son variantes legítimas): ${summary.variantFamiliesDetected}`);
  }
  if (summary.needsReviewConflicts > 0) {
    warn(`${summary.needsReviewConflicts} fila(s) requieren revisión humana — ver ${reportPath}`);
  }
  log(`Reporte: ${reportPath}`);
}

if (isMainModule(import.meta.url)) {
  main();
}
