#!/usr/bin/env node
// Corre todos los checks de solo-lectura en secuencia y da un resumen único.
// No aborta al primer error — junta todo el reporte antes de salir con el
// código de error correspondiente (para no "tragar" fallas silenciosamente).
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { SCRIPTS_DIR, log } from "./lib.mjs";

const CHECKS = [
  "validate-metadata.mjs",
  "validate-names.mjs",
  "validate-aspect-ratio.mjs",
  "check-missing.mjs",
  "find-duplicates.mjs",
  "validate-weight.mjs",
  "find-external-urls.mjs",
];

let anyFailed = false;
for (const script of CHECKS) {
  log(`\n=== ${script} ===`);
  const result = spawnSync(process.execPath, [join(SCRIPTS_DIR, script)], {
    stdio: "inherit",
  });
  if (result.status !== 0) anyFailed = true;
}

log(`\n=== Resumen ===`);
log(anyFailed ? "Al menos un check reportó problemas — revisar arriba." : "Todos los checks pasaron.");
process.exit(anyFailed ? 1 : 0);
