#!/usr/bin/env node
// Los tests unitarios escriben a los directorios reales catalog/reports,
// catalog/staging y catalog/rejected (REPORTS_DIR/STAGING_DIR/REJECTED_DIR
// no son inyectables como los paths de master/current en diff.mjs — ver
// tests/*.test.mjs). Sus fixtures inline siempre nombran el CSV de entrada
// EXACTAMENTE 'batch.csv' (nunca 'batch-001.csv' ni similar), así que
// cualquier artefacto que generan en esos directorios reales tiene el
// nombre de batch EXACTO 'batch' o 'batch.normalized' — nunca 'batch-001'
// (con guion + dígito). Este script borra solo esos, corre automático
// como posttest.
//
// CUIDADO: un match por prefijo simple ('startsWith("batch")') borra
// también los batches reales ('batch-001-diff.json' empieza con 'batch')
// — bug real que pasó en esta sesión (F3.5) y se llevó puesto todo
// catalog/reports/batch-001-*. El predicado de abajo excluye
// explícitamente 'batch-' seguido de un dígito. Exportado (no solo
// ejecutado como script) para que cleanup-artifacts.test.mjs pruebe la
// lógica real, no una copia que puede desincronizarse.
import { readdirSync, unlinkSync, existsSync } from "node:fs";
import { join } from "node:path";
import { REPORTS_DIR, STAGING_DIR, REJECTED_DIR, log, isMainModule } from "../lib.mjs";

const TEST_POLLUTION = /^batch(\.normalized)?[-.]/;
const REAL_BATCH = /^batch-\d/;

export function isTestPollutionFile(file) {
  if (file === ".gitkeep") return false;
  return TEST_POLLUTION.test(file) && !REAL_BATCH.test(file);
}

export function run() {
  let removed = 0;
  for (const dir of [REPORTS_DIR, STAGING_DIR, REJECTED_DIR]) {
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir)) {
      if (isTestPollutionFile(file)) {
        unlinkSync(join(dir, file));
        removed += 1;
      }
    }
  }
  if (removed > 0) log(`cleanup-artifacts: removidos ${removed} archivo(s) de prueba de catalog/{reports,staging,rejected}`);
  return removed;
}

if (isMainModule(import.meta.url)) {
  run();
}
