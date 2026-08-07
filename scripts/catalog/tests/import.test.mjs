import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { planImport, applyImport } from "../import.mjs";

function tmpFile(name, content) {
  const dir = mkdtempSync(join(tmpdir(), "aromia-catalog-test-"));
  const file = join(dir, name);
  writeFileSync(file, content, "utf-8");
  return file;
}

const HEADER = "id,slug,brand,name,concentration,image_url,diff_status,diff_reason";

test("planImport separa NEW y UPDATED, detecta filas con diff_status inválido", () => {
  const proposal = tmpFile(
    "batch.import-proposal.csv",
    `${HEADER}\n` +
      "1,a,Dior,Sauvage,EDT,https://x/1.jpg,NEW,\n" +
      "2,b,Chanel,Bleu,EDT,https://x/2.jpg,UPDATED,cambio\n"
  );
  const { inserts, updates, other } = planImport(proposal);
  assert.equal(inserts.length, 1);
  assert.equal(updates.length, 1);
  assert.equal(other.length, 0);
});

test("applyImport crea el master si no existe y le agrega las filas NEW", () => {
  const proposal = tmpFile(
    "batch.import-proposal.csv",
    `${HEADER}\n1,dior-sauvage-edt,Dior,Sauvage,EDT,https://x/1.jpg,NEW,\n`
  );
  const masterPath = join(mkdtempSyncDir(), "master.csv");
  const result = applyImport(proposal, masterPath);
  assert.equal(result.inserted, 1);
  assert.equal(result.updated, 0);
  assert.ok(existsSync(masterPath));
  const written = readFileSync(masterPath, "utf-8");
  assert.match(written, /dior-sauvage-edt/);
  // las columnas de staging (diff_status/diff_reason) no deben filtrarse al master
  assert.doesNotMatch(written.split("\n")[0], /diff_status/);
});

test("applyImport hace upsert: una fila UPDATED reemplaza a la existente por duplicateKey", () => {
  const masterPath = tmpFile("master.csv", "id,slug,brand,name,concentration,image_url\n1,dior-sauvage-edt,Dior,Sauvage,EDT,https://x/old.jpg\n");
  const proposal = tmpFile(
    "batch.import-proposal.csv",
    `${HEADER}\n1,dior-sauvage-edt,Dior,Sauvage,EDT,https://x/old.jpg,UPDATED,descripcion cambiada\n`
  );
  const result = applyImport(proposal, masterPath);
  assert.equal(result.totalMasterRows, 1);
  assert.equal(result.updated, 1);
});

test("applyImport lanza si la propuesta trae diff_status distinto de NEW/UPDATED", () => {
  const proposal = tmpFile(
    "batch.import-proposal.csv",
    `${HEADER}\n1,a,Dior,Sauvage,EDT,https://x/1.jpg,CONFLICT,no debería estar acá\n`
  );
  assert.throws(() => applyImport(proposal, join(mkdtempSyncDir(), "master.csv")));
});

function mkdtempSyncDir() {
  return mkdtempSync(join(tmpdir(), "aromia-catalog-test-"));
}
