#!/usr/bin/env node
// Verifica que todo derivado de rol "catalog" tenga relación 4:5 (sección 11
// del manual operativo). Lee dimensiones reales con sharp, no confía solo en
// el nombre de archivo. Solo lectura.
import sharp from "sharp";
import { basename } from "node:path";
import {
  PERFUMES_IMAGES_DIR,
  listImageFiles,
  parseDerivativeName,
  log,
  fail,
  warn,
} from "./lib.mjs";

const TARGET_RATIO = 4 / 5;
const TOLERANCE = 0.01; // 1% de margen por redondeo de export

const files = listImageFiles(PERFUMES_IMAGES_DIR).filter((f) => {
  const parsed = parseDerivativeName(basename(f));
  return parsed?.role === "catalog";
});

if (files.length === 0) {
  warn("No hay derivados de catálogo todavía — nada que validar.");
  process.exit(0);
}

let bad = 0;
for (const file of files) {
  const meta = await sharp(file).metadata();
  if (!meta.width || !meta.height) {
    bad++;
    fail(`${file}: no se pudieron leer dimensiones reales.`);
    continue;
  }
  const ratio = meta.width / meta.height;
  const diff = Math.abs(ratio - TARGET_RATIO) / TARGET_RATIO;
  if (diff > TOLERANCE) {
    bad++;
    fail(
      `${file}: ${meta.width}x${meta.height} (ratio ${ratio.toFixed(3)}) — se esperaba 4:5 (0.800), diff ${(diff * 100).toFixed(1)}%`
    );
  } else {
    log(`OK  ${file} (${meta.width}x${meta.height})`);
  }
}

if (bad > 0) {
  fail(`${bad} imagen(es) de catálogo fuera de relación 4:5.`);
  process.exit(1);
}
log(`Todas las imágenes de catálogo (${files.length}) respetan 4:5.`);
