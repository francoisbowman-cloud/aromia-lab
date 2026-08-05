#!/usr/bin/env node
// Valida cada metadata.json contra scripts/images/metadata.schema.json.
// Solo lectura. Termina con código de salida != 0 si hay errores — nunca
// los traga en silencio.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import {
  PERFUMES_IMAGES_DIR,
  SCRIPTS_DIR,
  walk,
  log,
  warn,
  fail,
} from "./lib.mjs";

const schema = JSON.parse(
  readFileSync(join(SCRIPTS_DIR, "metadata.schema.json"), "utf-8")
);
const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);

const metadataFiles = walk(PERFUMES_IMAGES_DIR).filter((f) =>
  f.endsWith("metadata.json")
);

if (metadataFiles.length === 0) {
  warn(
    `No se encontró ningún metadata.json bajo ${PERFUMES_IMAGES_DIR} — ` +
      "esperable en la Fase 1 (todavía no se migró ningún perfume). " +
      "El script funciona, no hay nada que validar todavía."
  );
  process.exit(0);
}

let errorCount = 0;
for (const file of metadataFiles) {
  let data;
  try {
    data = JSON.parse(readFileSync(file, "utf-8"));
  } catch (e) {
    fail(`${file}: JSON inválido — ${e.message}`);
    errorCount++;
    continue;
  }
  const valid = validate(data);
  if (!valid) {
    errorCount++;
    fail(`${file}: no cumple el schema`);
    for (const err of validate.errors ?? []) {
      log(`   - ${err.instancePath || "/"} ${err.message}`);
    }
  } else {
    log(`OK  ${file}`);
  }
}

if (errorCount > 0) {
  fail(`${errorCount} archivo(s) con errores de metadata.`);
  process.exit(1);
}
log(`Todos los metadata.json (${metadataFiles.length}) son válidos.`);
