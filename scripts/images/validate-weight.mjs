#!/usr/bin/env node
// Compara el peso real de cada derivado contra los presupuestos de
// docs/images/IMAGE-ARCHITECTURE.md sección 6. NO rechaza nada — solo
// reporta violaciones, la decisión de aceptar con justificación es humana.
import { basename } from "node:path";
import {
  PERFUMES_IMAGES_DIR,
  listImageFiles,
  parseDerivativeName,
  fileSizeKb,
  log,
  warn,
} from "./lib.mjs";

const BUDGETS_KB = {
  catalog: [25, 70],
  editorial: [120, 400], // rango amplio: cubre móvil (120-250) y desktop (180-400)
};

const files = listImageFiles(PERFUMES_IMAGES_DIR);
if (files.length === 0) {
  warn("No hay derivados todavía — nada que medir.");
  process.exit(0);
}

let overBudget = 0;
for (const file of files) {
  const parsed = parseDerivativeName(basename(file));
  if (!parsed) continue; // validate-names.mjs ya reporta esto
  const [min, max] = BUDGETS_KB[parsed.role] ?? [0, Infinity];
  const kb = fileSizeKb(file);
  if (kb > max) {
    overBudget++;
    warn(`${file}: ${kb.toFixed(1)}KB supera el presupuesto (${min}-${max}KB para ${parsed.role})`);
  } else if (kb < min) {
    warn(`${file}: ${kb.toFixed(1)}KB por debajo del piso esperado (${min}-${max}KB) — revisar si la calidad es suficiente`);
  } else {
    log(`OK  ${file}: ${kb.toFixed(1)}KB`);
  }
}

log(
  overBudget > 0
    ? `${overBudget} archivo(s) sobre presupuesto — requieren justificación documentada en metadata.json, no rechazo automático.`
    : "Todos los archivos dentro de presupuesto."
);
