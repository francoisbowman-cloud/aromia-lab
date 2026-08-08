import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/** Uso: if (isMainModule(import.meta.url)) main(); — evita re-implementar el check en cada script. */
export function isMainModule(metaUrl) {
  return Boolean(process.argv[1]) && fileURLToPath(metaUrl) === process.argv[1];
}
import { parse as parseCsv } from "csv-parse/sync";
import { stringify as stringifyCsv } from "csv-stringify/sync";

export const SCRIPTS_DIR = fileURLToPath(new URL(".", import.meta.url));
export const REPO_ROOT = join(SCRIPTS_DIR, "..", "..");
export const CATALOG_DIR = join(REPO_ROOT, "catalog");
export const SCHEMAS_DIR = join(CATALOG_DIR, "schemas");
export const IMPORTS_DIR = join(CATALOG_DIR, "imports");
export const REJECTED_DIR = join(CATALOG_DIR, "rejected");
export const REPORTS_DIR = join(CATALOG_DIR, "reports");
export const STAGING_DIR = join(CATALOG_DIR, "staging");
export const MASTER_CSV = join(CATALOG_DIR, "aromia-catalog-master.csv");
export const CATALOG_SCHEMA_PATH = join(SCHEMAS_DIR, "catalog.schema.json");

/**
 * Proxy local del catálogo YA publicado en Aromia, usado para el diff
 * de Bloque C. No es una conexión a Postgres (el pipeline nunca toca
 * producción) — es el CSV de origen ya versionado en el repo. Si en el
 * futuro se agrega una exportación real de Postgres, cambiar solo esta
 * constante.
 */
export const CURRENT_AROMIA_CSV = join(REPO_ROOT, "PERFUMES_INITIAL_50.csv");

export const PIPELINE_VERSION = "0.1.0";
export const SCHEMA_VERSION = "2026-08-fase3-v1";

export const LIST_FIELDS = [
  "top_notes",
  "heart_notes",
  "base_notes",
  "accords",
  "season",
  "occasion",
  // source_url: F3.6 — una entidad puede tener más de una fuente legítima
  // (ver catalog/schemas/SCHEMA_COMPARISON.md #L). El CSV conserva el
  // nombre de columna 'source_url' por compatibilidad, pero internamente
  // es una colección igual que top_notes/season — ';' separa múltiples
  // URLs, cada una validada como URI individualmente. No es una excepción
  // de una fila puntual, es la representación general para cualquier
  // batch con más de una fuente por registro.
  "source_url",
];

/**
 * F3.6 — campos de enriquecimiento: pending/null acá NUNCA baja el
 * quality_status por debajo de CATALOG_READY_WITH_PENDING, nunca fuerza
 * REVIEW_REQUIRED ni REJECTED. No requieren una segunda pasada de
 * investigación de Cowork en Fase 3. Se mantienen en el schema (no se
 * eliminan) por si se completan más adelante.
 */
export const ENRICHMENT_FIELDS = ["season", "occasion", "longevity", "sillage"];

export const REQUIRED_FIELDS = [
  "id",
  "brand",
  "name",
  "concentration",
  "gender",
  "family",
  "top_notes",
  "heart_notes",
  "base_notes",
  "source_url",
  "status",
];

/** F3.6 — dimensión de identidad: ¿qué relación tiene esta fila con lo ya existente? */
export const CATALOG_RELATION = Object.freeze({
  NEW: "NEW",
  EXISTING: "EXISTING",
  RELATED_VARIANT: "RELATED_VARIANT",
  POSSIBLE_DUPLICATE: "POSSIBLE_DUPLICATE",
});

/** F3.6 — dimensión de calidad: ¿está lista para publicarse? Independiente de catalog_relation. */
export const QUALITY_STATUS = Object.freeze({
  CATALOG_READY: "CATALOG_READY",
  CATALOG_READY_WITH_PENDING: "CATALOG_READY_WITH_PENDING",
  REVIEW_REQUIRED: "REVIEW_REQUIRED",
  REJECTED: "REJECTED",
});

/**
 * Set canónico conocido. NO es un enum bloqueante en catalog.schema.json
 * (ver batch-001 real: Roja Parfums usa 'Parfum Cologne') — un valor fuera
 * de este set es solo WARNING en validate.mjs, nunca error.
 */
export const CONCENTRATION_ENUM = ["EDC", "EDT", "EDP", "Parfum", "Extrait", "Elixir"];
/** Confirmado contra el batch-001 real (25/25 filas) — Cowork entrega español directo, igual que `genero` en Aromia. */
export const GENDER_ENUM = ["masculino", "femenino", "unisex"];
/** Sin confirmar todavía: 25/25 filas del batch-001 real llegaron con season='pending'. */
export const SEASON_ENUM = ["spring", "summer", "fall", "winter"];
export const STATUS_ENUM = ["draft", "pending_review", "approved", "published", "rejected"];

/**
 * Cowork ya entrega gender/season directo en el vocabulario de Aromia — no
 * hace falta traducir. Se mantienen como identidad (documentadas, no
 * eliminadas) por si algún batch futuro sí entrega inglés. Ver
 * SCHEMA_COMPARISON.md #B (corregido tras el batch-001 real).
 */
export const GENDER_MAP = { masculino: "masculino", femenino: "femenino", unisex: "unisex" };
export const SEASON_MAP = { spring: "primavera", summer: "verano", fall: "otoño", winter: "invierno" };
/** Igual que GENDER_MAP: price_segment ya llega en español. Ver SCHEMA_COMPARISON.md #F (corregido). */
export const PRICE_SEGMENT_MAP = { económico: "económico", medio: "medio", premium: "premium", lujo: "lujo" };

/** Campos donde el string literal 'pending' es un VALOR DE ENUM legítimo, no el sentinel de dato-no-verificado. Ver SCHEMA_COMPARISON.md #K. */
export const PENDING_IS_VALID_VALUE_FIELDS = ["review_status"];

/** true si el valor crudo es el sentinel de 'no verificado' de Cowork (no una celda vacía). */
export function isPendingSentinel(raw) {
  return String(raw ?? "").trim().toLowerCase() === "pending";
}

/** Alias conocidos de price_segment -> forma canónica (con tilde) de Aromia. */
export const PRICE_SEGMENT_ALIASES = {
  economico: "económico",
};

/**
 * Sinónimos conocidos de concentración -> valor canónico de CONCENTRATION_ENUM.
 * Transform determinista y documentada (normalización, no inferencia) —
 * si un valor no está en este mapa ni ya es canónico, normalize.mjs lo deja
 * tal cual y lo marca en el trace; no inventa un valor.
 */
export const CONCENTRATION_ALIASES = {
  "edt": "EDT",
  "eau de toilette": "EDT",
  "edp": "EDP",
  "eau de parfum": "EDP",
  "edc": "EDC",
  "eau de cologne": "EDC",
  "eau fraiche": "EDC",
  "parfum": "Parfum",
  "perfume": "Parfum",
  "extrait": "Extrait",
  "extrait de parfum": "Extrait",
  "pure perfume": "Extrait",
  "elixir": "Elixir",
};

/**
 * F3.6 — el catálogo legacy de Aromia (PERFUMES_INITIAL_50.csv) a veces
 * embebe la concentración en `nombre` (ej. 'Terre d'Hermes EDT') y a veces
 * no la menciona en absoluto (ej. 'Eros', concentración real desconocida
 * desde el nombre solo). Extrae ambas piezas de forma genérica — sin esto,
 * no hay manera de distinguir 'entra una variante nueva de concentración
 * distinta' de 'esto es un posible duplicado' sin listar marcas a mano.
 * Devuelve concentration:null si no se pudo determinar (no se asume nada).
 */
export function extractConcentrationFromName(nombre) {
  const suffixes = [...CONCENTRATION_ENUM, ...Object.keys(CONCENTRATION_ALIASES)];
  const trimmed = String(nombre ?? "").trim();
  for (const suffix of suffixes) {
    const re = new RegExp(`\\s+${suffix}$`, "i");
    if (re.test(trimmed)) {
      const alias = CONCENTRATION_ALIASES[suffix.toLowerCase()];
      const canonical = alias ?? (CONCENTRATION_ENUM.find((c) => c.toLowerCase() === suffix.toLowerCase()) ?? suffix);
      return { baseName: trimmed.replace(re, "").trim(), concentration: canonical };
    }
  }
  return { baseName: trimmed, concentration: null };
}

export function normalizeConcentration(raw) {
  const trimmed = String(raw ?? "").trim();
  if (CONCENTRATION_ENUM.includes(trimmed)) return { value: trimmed, changed: false };
  const alias = CONCENTRATION_ALIASES[trimmed.toLowerCase()];
  if (alias) return { value: alias, changed: alias !== trimmed };
  return { value: trimmed, changed: false, unknown: trimmed.length > 0 };
}

/**
 * Heurística conservadora: solo re-capitaliza strings que llegaron
 * enteramente en minúsculas o enteramente en mayúsculas (probable
 * error de captura). Si ya viene en mixed-case (ej. 'Nishane', 'YSL',
 * "L'Artisan") se deja intacto — no hay forma determinista de saber
 * si esa casing es intencional.
 */
export function titleCaseIfShouting(raw) {
  const trimmed = String(raw ?? "").trim();
  if (trimmed === "") return { value: trimmed, changed: false };
  const isAllLower = trimmed === trimmed.toLowerCase() && /[a-z]/.test(trimmed);
  // No hay rama 'todo mayúsculas' a propósito — se probó contra el batch-001
  // real y rompió un nombre de producto legítimo ('212 VIP' -> '212 Vip',
  // VIP es un acrónimo real, no un error de captura). Sin una lista de
  // acrónimos conocidos no hay forma determinista de distinguir 'DIOR
  // SAUVAGE' (probable error de captura) de '212 VIP' (acrónimo real) — ante
  // la duda, no tocar. Ver catalog/schemas/SCHEMA_COMPARISON.md #G.
  if (!isAllLower) return { value: trimmed, changed: false };
  const titled = trimmed
    .toLowerCase()
    .replace(/(^|[\s'-])([a-zà-ÿ])/g, (_, sep, ch) => sep + ch.toUpperCase());
  return { value: titled, changed: titled !== trimmed };
}

/** Colapsa espacios repetidos y trimea. */
export function collapseWhitespace(raw) {
  const value = String(raw ?? "").trim().replace(/\s+/g, " ");
  return { value, changed: value !== String(raw ?? "") };
}

export function log(msg) {
  process.stdout.write(`${msg}\n`);
}

export function warn(msg) {
  process.stdout.write(`WARN  ${msg}\n`);
}

export function fail(msg) {
  process.stderr.write(`FAIL  ${msg}\n`);
}

export function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export function nowIso() {
  return new Date().toISOString();
}

/** Convierte 'a;b; c ' -> ['a', 'b', 'c']. Vacío/undefined -> []. */
export function splitList(raw) {
  if (raw === undefined || raw === null || raw === "") return [];
  return String(raw)
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function joinList(arr) {
  if (!Array.isArray(arr)) return "";
  return arr.join(";");
}

/** Slugifica sin acentos, minúsculas, guiones simples. */
export function slugify(input) {
  return String(input ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function isValidUrl(value) {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Ver SCHEMA_COMPARISON.md #G. Acepta URL http(s) real o una ruta
 * relativa con forma de asset del sistema de imágenes de Fase 1
 * (no valida que el archivo exista — eso es responsabilidad del
 * pipeline de imágenes, no del de catálogo).
 */
export function isValidImageRef(value) {
  if (!value) return false;
  if (isValidUrl(value)) return true;
  return /^[a-z0-9/_.-]+\.(webp|avif|png|jpe?g)$/i.test(String(value).trim());
}

/**
 * Lee un CSV a { header, rows }. `rows` son objetos planos con los
 * valores crudos del CSV (strings), sin normalizar ni expandir listas
 * todavía — eso es responsabilidad de normalize.mjs.
 * Lanza CsvParseError en CSV mal formado (no lo traga en silencio).
 */
export function readCsv(path) {
  const raw = readFileSync(path, "utf-8");
  let records;
  try {
    records = parseCsv(raw, {
      columns: true,
      skip_empty_lines: true,
      trim: false,
      bom: true,
      relax_column_count: false,
    });
  } catch (e) {
    const err = new Error(`CSV mal formado en ${path}: ${e.message}`);
    err.name = "CsvParseError";
    throw err;
  }
  const header = records.length > 0 ? Object.keys(records[0]) : [];
  return { header, rows: records };
}

export function writeCsv(path, header, rows) {
  ensureDir(dirname(path));
  const out = stringifyCsv(rows, { header: true, columns: header });
  writeFileSync(path, out, "utf-8");
}

export function writeJson(path, data) {
  ensureDir(dirname(path));
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

export function readJson(path) {
  return JSON.parse(readFileSync(path, "utf-8"));
}

export function loadCatalogSchema() {
  return readJson(CATALOG_SCHEMA_PATH);
}

/** Nombre de batch a partir del path del archivo, ej. 'batch-001.csv' -> 'batch-001'. */
export function batchNameFromPath(path) {
  const base = path.split(/[\\/]/).pop() ?? path;
  return base.replace(/\.csv$/i, "");
}

/** Severidades permitidas para issues de validación/diff. */
export const SEVERITY = Object.freeze({ ERROR: "error", WARNING: "warning", INFO: "info" });

/** Normaliza un string para comparación (dedup, matching) — no para guardar. */
export function normalizeForKey(s) {
  return String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Clave de deduplicación de negocio: brand + normalized_name + concentration
 * (pedida explícitamente por el brief de Fase 3). Sauvage EDT / EDP / Parfum /
 * Elixir producen claves distintas a propósito — nunca se fusionan variantes.
 */
export function duplicateKey(row) {
  return [normalizeForKey(row.brand), normalizeForKey(row.name), normalizeForKey(row.concentration)].join("|");
}

/** Clave de "producto" sin concentración — usada solo para detectar conflictos de variante, no para fusionar. */
export function variantFamilyKey(row) {
  return [normalizeForKey(row.brand), normalizeForKey(row.name)].join("|");
}

/** Firma estable de una fila completa (todos los campos salvo id/timestamps) para detectar duplicados exactos. */
export function exactRowSignature(row) {
  const clone = { ...row };
  delete clone.id;
  delete clone.created_at;
  delete clone.updated_at;
  const keys = Object.keys(clone).sort();
  return JSON.stringify(clone, keys);
}

/**
 * Convierte una fila cruda de CSV (todos los valores como string) a
 * valores tipados según catalog.schema.json: arrays para LIST_FIELDS,
 * boolean para source_verified, integer para launch_year, null para
 * campos opcionales vacíos. No trimea ni reescribe valores string
 * (eso es trabajo de normalize.mjs) — solo tipa, para poder validar
 * con ajv.
 */
export function parseRawRow(rawRow) {
  const out = {};
  for (const [key, value] of Object.entries(rawRow)) {
    const isPending = isPendingSentinel(value) && !PENDING_IS_VALID_VALUE_FIELDS.includes(key);
    const isRequired = REQUIRED_FIELDS.includes(key);

    if (LIST_FIELDS.includes(key)) {
      out[key] = isPending ? [] : splitList(value);
      continue;
    }
    if (key === "launch_year") {
      const t = (value ?? "").trim();
      out[key] = t === "" || isPending ? null : Number(t);
      continue;
    }
    if (key === "source_verified") {
      const t = (value ?? "").trim().toLowerCase();
      out[key] = t === "" || isPending ? null : ["true", "1", "yes", "si", "sí"].includes(t);
      continue;
    }
    if (isPending) {
      // 'pending' es el sentinel de Cowork para 'no verificado, no inventar'
      // — se trata igual que una celda vacía. En campos requeridos se
      // conserva como "" (no null) para que el mensaje de error de ajv sea
      // el mismo 'must NOT have fewer than 1 characters' que ya usan las
      // celdas realmente vacías, no un error de tipo distinto.
      out[key] = isRequired ? "" : null;
      continue;
    }
    const t = value ?? "";
    out[key] = t.trim() === "" && !isRequired ? null : t;
  }
  return out;
}
