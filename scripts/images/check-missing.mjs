#!/usr/bin/env node
// Cruza data/image-inventory.csv contra lo que realmente existe en disco:
// - perfumes con needs_processing/estado que sugiere que ya debería tener
//   derivados, pero la carpeta {slug}/catalog|editorial/ no existe o está vacía.
// - archivos huérfanos: carpetas de perfume sin fila correspondiente en el CSV.
// Solo lectura, solo reporta.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parse } from "csv-parse/sync";
import { REPO_ROOT, PERFUMES_IMAGES_DIR, listImageFiles, log, warn, fail } from "./lib.mjs";

const csvPath = join(REPO_ROOT, "data/image-inventory.csv");
if (!existsSync(csvPath)) {
  fail(`No existe ${csvPath} — corré esto desde la raíz del repo, o generá el inventario primero.`);
  process.exit(1);
}

const rows = parse(readFileSync(csvPath, "utf-8"), {
  columns: true,
  skip_empty_lines: true,
});

const catalogSlugs = [...new Set(rows.filter((r) => r.image_role === "catalog-primary").map((r) => r.perfume_slug))];

let missing = 0;
for (const slug of catalogSlugs) {
  const dir = join(PERFUMES_IMAGES_DIR, slug, "catalog");
  if (!existsSync(dir) || listImageFiles(dir).length === 0) {
    missing++;
    warn(`${slug}: sin derivados de catálogo en ${dir}`);
  }
}

const existingSlugDirs = existsSync(PERFUMES_IMAGES_DIR)
  ? listImageFiles(PERFUMES_IMAGES_DIR)
      .map((f) => f.replace(PERFUMES_IMAGES_DIR, "").split(/[\\/]/).filter(Boolean)[0])
      .filter(Boolean)
  : [];
const orphans = [...new Set(existingSlugDirs)].filter((slug) => !catalogSlugs.includes(slug));
for (const slug of orphans) {
  warn(`Carpeta huérfana sin fila en el inventario: ${slug}`);
}

log(
  `Resumen: ${catalogSlugs.length} perfumes en el inventario, ${missing} sin derivados de catálogo, ${orphans.length} carpeta(s) huérfana(s).`
);
if (missing > 0) {
  log("Esto es esperable mientras la Fase 1 no haya procesado ningún perfume todavía.");
}
