#!/usr/bin/env node
// Reporta toda URL externa de imagen referenciada en data/image-inventory.csv
// (fuente real, sincronizada desde producción) y agrupa por dominio.
// Solo lectura — ver docs/images/CURRENT-STATE-AUDIT.md sección 4-5 para el
// contexto de por qué esto importa (100% hotlinking en catalog-primary hoy).
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parse } from "csv-parse/sync";
import { REPO_ROOT, log, warn, fail } from "./lib.mjs";

const csvPath = join(REPO_ROOT, "data/image-inventory.csv");
if (!existsSync(csvPath)) {
  fail(`No existe ${csvPath}.`);
  process.exit(1);
}

const rows = parse(readFileSync(csvPath, "utf-8"), {
  columns: true,
  skip_empty_lines: true,
});

const byDomain = new Map();
for (const row of rows) {
  if (!row.source_url || !row.source_domain || row.source_domain === "not-applicable") continue;
  if (!row.source_url.startsWith("http")) continue; // rutas locales (public/ovl/...) no cuentan
  if (!byDomain.has(row.source_domain)) byDomain.set(row.source_domain, []);
  byDomain.get(row.source_domain).push(row.perfume_slug);
}

if (byDomain.size === 0) {
  log("No se encontraron URLs externas de imagen en el inventario.");
  process.exit(0);
}

log("Dominios externos usados como fuente de imagen (hotlink activo en producción):\n");
for (const [domain, slugs] of [...byDomain.entries()].sort((a, b) => b[1].length - a[1].length)) {
  log(`${domain}: ${slugs.length} imagen(es)`);
}

warn(
  `\nTotal: ${[...byDomain.values()].reduce((n, s) => n + s.length, 0)} imágenes dependen hoy de disponibilidad de terceros, sin copia local de respaldo (ver riesgo en docs/images/CURRENT-STATE-AUDIT.md).`
);
