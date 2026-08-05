#!/usr/bin/env node
// Detecta archivos byte-idénticos (hash SHA-256) dentro de
// apps/web/public/images/perfumes/ y, opcionalmente, contra apps/web/public/ovl/.
// Solo lectura.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  PERFUMES_IMAGES_DIR,
  LEGACY_OVL_DIR,
  listImageFiles,
  log,
  warn,
  hasFlag,
} from "./lib.mjs";

function hashFile(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

const includeLegacy = hasFlag("include-legacy-ovl");
const files = [
  ...listImageFiles(PERFUMES_IMAGES_DIR),
  ...(includeLegacy ? listImageFiles(LEGACY_OVL_DIR) : []),
];

if (files.length === 0) {
  warn("No hay archivos para revisar todavía.");
  process.exit(0);
}

const byHash = new Map();
for (const file of files) {
  const hash = hashFile(file);
  if (!byHash.has(hash)) byHash.set(hash, []);
  byHash.get(hash).push(file);
}

let dupGroups = 0;
for (const [hash, group] of byHash) {
  if (group.length > 1) {
    dupGroups++;
    log(`Duplicado (${hash.slice(0, 12)}…):`);
    for (const f of group) log(`   - ${f}`);
  }
}

if (dupGroups === 0) {
  log(`Sin duplicados byte-idénticos entre ${files.length} archivo(s).`);
} else {
  warn(`${dupGroups} grupo(s) de archivos duplicados encontrados.`);
}
