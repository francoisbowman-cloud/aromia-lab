#!/usr/bin/env node
// Genera derivados (resize + reencode) a partir de UN original, hacia una
// carpeta de salida EXPLÍCITA. Nunca escribe sobre el original, nunca
// sobrescribe un derivado existente salvo --force, nunca publica ni
// mergea nada — solo produce archivos locales para revisión humana.
//
// Uso:
//   node optimize.mjs --slug aventus --role catalog --source ./work/aventus-original.jpg \
//        --out ./apps/web/public/images/perfumes/aventus/catalog --dry-run
//
// Flags:
//   --slug        obligatorio
//   --role        catalog | editorial (obligatorio)
//   --source      ruta al archivo original (obligatorio, solo lectura)
//   --out         carpeta de salida (obligatoria — sin default, a propósito)
//   --sizes       lista "anchoxalto,anchoxalto" (default según --role)
//   --formats     lista "webp,avif" (default: webp,avif)
//   --version     v01 por default
//   --dry-run     no escribe nada, solo imprime qué haría
//   --force       permite sobrescribir un derivado ya existente

import sharp from "sharp";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { log, warn, fail, DRY_RUN, hasFlag } from "./lib.mjs";

function argValue(name) {
  const idx = process.argv.indexOf(`--${name}`);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

const DEFAULT_SIZES = {
  catalog: ["320x400", "480x600", "640x800", "960x1200", "1280x1600"],
  editorial: ["1200x750", "1920x1200"], // 16:10, mobile/desktop simplificado
};

const slug = argValue("slug");
const role = argValue("role");
const source = argValue("source");
const out = argValue("out");
const version = argValue("version") ?? "v01";
const sizes = (argValue("sizes") ?? DEFAULT_SIZES[role]?.join(",") ?? "").split(",").filter(Boolean);
const formats = (argValue("formats") ?? "webp,avif").split(",");
const force = hasFlag("force");

const errors = [];
if (!slug) errors.push("--slug es obligatorio");
if (!role || !["catalog", "editorial"].includes(role)) errors.push("--role debe ser catalog o editorial");
if (!source) errors.push("--source es obligatorio");
if (!existsSync(source)) errors.push(`--source no existe: ${source}`);
if (!out) errors.push("--out es obligatorio (sin default, a propósito — no se escribe en ningún lado por defecto)");
if (sizes.length === 0) errors.push("no se determinaron tamaños de salida");

if (errors.length) {
  for (const e of errors) fail(e);
  process.exit(1);
}

const sourceAbs = resolve(source);
const outAbs = resolve(out);

if (outAbs === sourceAbs || outAbs.startsWith(sourceAbs)) {
  fail("La carpeta de salida no puede ser el propio archivo original.");
  process.exit(1);
}

if (!DRY_RUN) {
  mkdirSync(outAbs, { recursive: true });
}

log(`Original: ${sourceAbs} (${(statSync(sourceAbs).size / 1024).toFixed(1)}KB)`);
log(`Salida:   ${outAbs}${DRY_RUN ? "  [dry-run — no se escribe nada]" : ""}`);

let planned = 0;
let written = 0;
for (const size of sizes) {
  const [w, h] = size.split("x").map(Number);
  if (!w || !h) {
    warn(`Tamaño inválido, se omite: ${size}`);
    continue;
  }
  for (const format of formats) {
    const filename = `${slug}--${role}--${version}--${w}x${h}.${format}`;
    const dest = join(outAbs, filename);
    planned++;

    if (existsSync(dest) && !force) {
      warn(`Ya existe, se omite (usar --force para sobrescribir): ${dest}`);
      continue;
    }

    if (DRY_RUN) {
      log(`[dry-run] generaría ${dest} (${w}x${h}, ${format})`);
      continue;
    }

    let pipeline = sharp(sourceAbs).resize(w, h, { fit: "cover", position: "attention" });
    if (format === "webp") pipeline = pipeline.webp({ quality: 82 });
    else if (format === "avif") pipeline = pipeline.avif({ quality: 60 });
    else if (format === "png") pipeline = pipeline.png({ compressionLevel: 9 });
    else {
      warn(`Formato no soportado, se omite: ${format}`);
      continue;
    }

    await pipeline.toFile(dest);
    written++;
    log(`OK  ${dest}`);
  }
}

log(
  DRY_RUN
    ? `Dry-run: ${planned} derivado(s) se habrían generado.`
    : `${written}/${planned} derivado(s) generados en ${outAbs}.`
);
log(
  "Recordatorio: este script no publica, no toca apps/web/public salvo que --out apunte ahí explícitamente, y no hace commit/push/merge — eso es un paso humano aparte."
);
