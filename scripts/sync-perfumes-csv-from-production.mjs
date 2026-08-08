#!/usr/bin/env node
// Backlog fundacional (docs/images/CURRENT-STATE-AUDIT.md, sección 10,
// riesgo "CSV desincronizado con producción — Medio"): PERFUMES_INITIAL_50.csv
// (raíz y apps/api/data/) tenía 38 filas, no las 50 reales desde la
// expansión Dior del 30/07 (decisión #89 de ESTADO-aromia.md) — los 12
// perfumes Dior nuevos se publicaron directo en Postgres vía la API admin,
// nunca se agregaron al CSV. Riesgo: un reseed futuro desde este CSV
// pisaría/perdería esos 12 perfumes.
//
// Este script SOLO LEE la API pública de producción (GET, sin auth, mismo
// endpoint que CLAUDE.md ya documenta como seguro para desarrollo local:
// https://api-production-fe2f.up.railway.app/api/perfumes) y escribe los
// dos CSV de backup. NUNCA escribe a producción, NUNCA usa un endpoint de
// escritura, NUNCA toca image_url.
//
// Excepción documentada: el nombre de sauvage-edp se corrige de "Sauvage
// EDP" a "Sauvage EDT" en el CSV generado (ver decisión #99 de
// ESTADO-aromia.md / CHANGELOG-2.0.md 2026-08-06) — production todavía
// tiene el nombre viejo porque ese cambio vive solo en este repo hasta que
// alguien lo aplique vía /admin/perfumes o una migración; sin esta
// excepción, sincronizar desde producción revertiría silenciosamente el
// rename ya decidido.

import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { stringify as stringifyCsv } from "csv-stringify/sync";
import { parse as parseCsv } from "csv-parse/sync";

const SCRIPTS_DIR = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = join(SCRIPTS_DIR, "..");
const ROOT_CSV = join(REPO_ROOT, "PERFUMES_INITIAL_50.csv");
const API_CSV = join(REPO_ROOT, "apps", "api", "data", "PERFUMES_INITIAL_50.csv");
const API_URL = "https://api-production-fe2f.up.railway.app/api/perfumes";

const COLUMNS = [
  "slug",
  "nombre",
  "marca",
  "genero",
  "familia_olfativa",
  "notas_salida",
  "notas_corazon",
  "notas_fondo",
  "precio_referencia",
  "moneda",
  "categoria_precio",
  "imagen_url",
  "link_afiliado",
  "descripcion_corta",
  "nicho_o_comercial",
];

// Ver excepción documentada arriba.
const NAME_CORRECTIONS = {
  "sauvage-edp": "Sauvage EDT",
};

function joinNotes(arr) {
  return Array.isArray(arr) ? arr.join(";") : "";
}

async function main() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`GET ${API_URL} → ${res.status}`);
  const perfumes = await res.json();
  if (!Array.isArray(perfumes) || perfumes.length === 0) {
    throw new Error(`Respuesta inesperada de la API: ${JSON.stringify(perfumes).slice(0, 200)}`);
  }

  const before = { root: 0, api: 0 };
  try {
    before.root = parseCsv(readFileSync(ROOT_CSV, "utf-8"), { columns: true, skip_empty_lines: true }).length;
    before.api = parseCsv(readFileSync(API_CSV, "utf-8"), { columns: true, skip_empty_lines: true }).length;
  } catch {
    // sin archivo previo, no bloquea
  }

  const rows = perfumes
    .slice()
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((p) => ({
      slug: p.slug,
      nombre: NAME_CORRECTIONS[p.slug] ?? p.nombre,
      marca: p.marca,
      genero: p.genero,
      familia_olfativa: p.familia_olfativa,
      notas_salida: joinNotes(p.notas_salida),
      notas_corazon: joinNotes(p.notas_corazon),
      notas_fondo: joinNotes(p.notas_fondo),
      precio_referencia: p.precio_referencia,
      moneda: p.moneda,
      categoria_precio: p.categoria_precio,
      imagen_url: p.imagen_url,
      link_afiliado: p.link_afiliado,
      descripcion_corta: p.descripcion_corta ?? "",
      nicho_o_comercial: p.nicho_o_comercial ?? "",
    }));

  const csv = stringifyCsv(rows, { header: true, columns: COLUMNS });
  writeFileSync(ROOT_CSV, csv);
  writeFileSync(API_CSV, csv);

  const correctedSlugs = Object.keys(NAME_CORRECTIONS).filter((slug) =>
    perfumes.some((p) => p.slug === slug)
  );

  process.stdout.write(
    `Sincronizado desde producción (${API_URL}):\n` +
      `  Filas antes: raíz=${before.root}, apps/api/data=${before.api}\n` +
      `  Filas ahora: ${rows.length} (ambas copias)\n` +
      `  Correcciones de nombre aplicadas sobre el dato de producción: ${
        correctedSlugs.length ? correctedSlugs.join(", ") : "ninguna"
      }\n` +
      `  Ninguna llamada de escritura a la API. image_url sin modificar.\n`
  );
}

main();
