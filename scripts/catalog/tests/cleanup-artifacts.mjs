#!/usr/bin/env node
// Los tests unitarios escriben a los directorios reales catalog/reports,
// catalog/staging y catalog/rejected (REPORTS_DIR/STAGING_DIR/REJECTED_DIR
// no son inyectables como los paths de master/current en diff.mjs — ver
// tests/*.test.mjs). Sus fixtures inline siempre nombran el CSV de entrada
// 'batch.csv'/'master.csv'/'current.csv', así que cualquier artefacto que
// generan en esos directorios reales queda con el prefijo 'batch' — nunca
// colisiona con batches reales (batch-001, etc.) ni con el fixture piloto
// (_fixture-pilot). Este script borra solo esos, corre automático como
// posttest.
import { readdirSync, unlinkSync, existsSync } from "node:fs";
import { join } from "node:path";
import { REPORTS_DIR, STAGING_DIR, REJECTED_DIR, log } from "../lib.mjs";

let removed = 0;
for (const dir of [REPORTS_DIR, STAGING_DIR, REJECTED_DIR]) {
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir)) {
    if (file.startsWith("batch") && file !== ".gitkeep") {
      unlinkSync(join(dir, file));
      removed += 1;
    }
  }
}
if (removed > 0) log(`cleanup-artifacts: removidos ${removed} archivo(s) de prueba de catalog/{reports,staging,rejected}`);
