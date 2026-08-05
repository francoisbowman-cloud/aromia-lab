#!/usr/bin/env node
// Valida que cada derivado bajo apps/web/public/images/perfumes/ respete
// {slug}--{rol}--v{NN}--{ancho}x{alto}.{formato}. Solo lectura.
import { basename } from "node:path";
import {
  PERFUMES_IMAGES_DIR,
  listImageFiles,
  parseDerivativeName,
  log,
  fail,
  warn,
} from "./lib.mjs";

const files = listImageFiles(PERFUMES_IMAGES_DIR);

if (files.length === 0) {
  warn(`No hay archivos bajo ${PERFUMES_IMAGES_DIR} todavía — nada que validar.`);
  process.exit(0);
}

let invalid = 0;
for (const file of files) {
  const name = basename(file);
  const parsed = parseDerivativeName(name);
  if (!parsed) {
    invalid++;
    fail(`Nombre inválido: ${file}`);
    log(`   esperado: {slug}--{catalog|editorial}--v{NN}--{ancho}x{alto}.{webp|avif|png}`);
    continue;
  }
  if (!file.includes(`/${parsed.slug}/`) && !file.includes(`\\${parsed.slug}\\`)) {
    invalid++;
    fail(`${file}: el slug del nombre de archivo (${parsed.slug}) no coincide con la carpeta contenedora.`);
  }
}

if (invalid > 0) {
  fail(`${invalid} archivo(s) con nombre inválido de ${files.length} revisados.`);
  process.exit(1);
}
log(`Todos los nombres (${files.length}) son válidos.`);
