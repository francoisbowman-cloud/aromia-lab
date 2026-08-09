// Regresión F3.5: cleanup-artifacts.mjs usaba startsWith("batch"), que
// también matchea archivos reales ('batch-001-diff.json') y los borró en
// esta misma sesión. Prueba la función exportada real, no una copia.
import test from "node:test";
import assert from "node:assert/strict";
import { isTestPollutionFile } from "./cleanup-artifacts.mjs";

test("borra artefactos de pollution de tests (nombre de batch exacto 'batch' o 'batch.normalized')", () => {
  assert.equal(isTestPollutionFile("batch-diff.json"), true);
  assert.equal(isTestPollutionFile("batch-validation.json"), true);
  assert.equal(isTestPollutionFile("batch.normalized.csv"), true);
  assert.equal(isTestPollutionFile("batch.normalized-duplicates.json"), true);
  assert.equal(isTestPollutionFile("batch.import-proposal.csv"), true);
});

test("NUNCA borra batches reales con sufijo numérico (batch-001, batch-002, ...)", () => {
  assert.equal(isTestPollutionFile("batch-001-diff.json"), false);
  assert.equal(isTestPollutionFile("batch-001-real-summary.md"), false);
  assert.equal(isTestPollutionFile("batch-001.normalized-validation.json"), false);
  assert.equal(isTestPollutionFile("batch-002-summary.md"), false);
});

test("no toca .gitkeep ni archivos sin relación (_fixture-pilot, etc.)", () => {
  assert.equal(isTestPollutionFile(".gitkeep"), false);
  assert.equal(isTestPollutionFile("_fixture-pilot-diff.json"), false);
});
