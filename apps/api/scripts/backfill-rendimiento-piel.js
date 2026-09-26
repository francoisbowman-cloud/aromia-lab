// Backfill puntual de longevidad/estela/proyeccion (WS-1 ítem 1.4 / D-2:
// "manual + heurística editorial", decisión de Brey 2026-09-24).
//
// No hay fuente de terceros lícita para este dato: Fragrantica/Parfumo son
// bases de comunidad cuyos ToS prohíben scraping explícitamente, y la
// Product Advertising API de Amazon no expone texto de reviews. En su
// lugar:
//   - MANUAL_TOP trae valores investigados a mano para los perfumes con
//     data_confidence='high' (los 19 de mayor perfil del catálogo, ya
//     sourceados con ficha oficial de marca) — criterio editorial de
//     Aromia a partir de la reputación pública y consistente de cada
//     fragancia, no un promedio extraído de ningún sitio.
//   - El resto se completa con una heurística determinística: concentración
//     (EDC < EDT < EDP < Parfum < Extrait) + ajuste por familia olfativa /
//     accords (familias amaderadas, ambaradas, especiadas, almizcladas o
//     gourmand duran y proyectan más; cítricas, acuáticas o verdes, menos).
//     Sin concentración, se intenta derivarla del sufijo del slug
//     (`-edp`, `-edt`, etc.) antes de caer en un valor neutro.
//
// Escala 0-10, un decimal (coincide con el NUMERIC(3,1) de la columna y con
// el `valor * 10` de PerformanceBars.tsx). No pisa valores ya cargados a
// mano desde /admin.
//
// Uso:
//   node scripts/backfill-rendimiento-piel.js           # aplica
//   node scripts/backfill-rendimiento-piel.js --dry-run  # solo imprime
//
// Requiere DATABASE_URL apuntando a la base real (DATABASE_PUBLIC_URL de
// Railway si se corre fuera de la red privada).
const { Pool } = require("pg");

const DRY_RUN = process.argv.includes("--dry-run");

// Investigado a mano (2026-09-24) para los perfumes data_confidence='high'.
const MANUAL_TOP = {
  "bat-extrait": [8.5, 7.0, 7.0],
  "elysium-pour-homme-parfum-cologne": [8.0, 7.5, 7.5],
  "green-irish-tweed-edp": [4.5, 4.0, 3.5],
  "burberry-her-edp": [6.5, 6.0, 6.0],
  "interlude-woman-edp": [8.5, 7.5, 7.5],
  "jubilation-25-woman-edp": [8.0, 7.0, 7.0],
  "jubilation-xxv-man-edp": [8.5, 7.5, 7.5],
  "millesime-imperial-edp": [4.0, 3.5, 3.5],
  "chanel-no5-edp": [7.5, 6.0, 5.5],
  "not-a-perfume-edp": [5.5, 3.0, 2.5],
  "paradoxe-edp": [6.5, 6.0, 5.5],
  "philosykos-edt": [4.5, 4.0, 3.5],
  "poison-edt": [8.0, 8.5, 8.5],
  "portrait-of-a-lady-edp": [9.0, 8.5, 8.5],
  "replica-jazz-club-edt": [3.5, 3.0, 2.5],
  "rien-edp": [7.0, 6.0, 5.5],
  "tobacco-vanille-edp": [9.0, 8.0, 8.0],
  "born-in-roma-uomo-edt": [5.5, 5.0, 5.0],
  "vanilla-28-edp": [7.5, 7.0, 6.5],
};

const BASE_BY_CONCENTRACION = {
  edc: [2.5, 2.5, 2.5],
  edt: [4.5, 4.5, 4.8],
  edp: [6.3, 5.8, 5.8],
  parfum: [7.3, 6.3, 6.3],
  extrait: [8.3, 6.8, 6.3],
};
const UNKNOWN_BASE = [5.0, 5.0, 5.0];

function concentracionTier(concentracion) {
  if (!concentracion) return null;
  const v = concentracion.toLowerCase();
  if (v.includes("extrait") || v.includes("pure perfume")) return "extrait";
  if (v.includes("parfum") && !v.includes("eau de")) return "parfum"; // "Parfum", "Parfum Cologne"
  if (v === "edp") return "edp";
  if (v === "edt") return "edt";
  if (v === "edc") return "edc";
  return null;
}

function tierFromSlug(slug) {
  const m = slug.match(/-(edp|edt|extrait|parfum|edc)$/);
  return m ? m[1] : null;
}

const POSITIVE_WORDS = [
  "oriental", "ambarado", "ambery", "amber", "especiado", "spicy", "gourmand",
  "cuero", "leather", "almizclado", "almizcle", "musk", "musky", "amaderado",
  "woody", "vainilla", "resinas", "pachuli", "sandalo", "mirra", "benjui",
  "incienso", "oud", "chipre", "chypre",
];
const NEGATIVE_WORDS = [
  "citrico", "citrus", "acuatico", "aquatic", "marino", "fresco", "fresh",
  "verde", "green", "lino", "muguet", "menta", "bergamota", "limon",
  "pomelo", "mandarina", "azahar",
];

function keywordDelta(familiaOlfativa, accords) {
  const haystack = `${familiaOlfativa ?? ""} ${(accords ?? []).join(" ")}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  const tokens = haystack.split(/[\s,]+/).filter(Boolean);
  let delta = 0;
  for (const token of tokens) {
    if (POSITIVE_WORDS.includes(token)) delta += 0.35;
    if (NEGATIVE_WORDS.includes(token)) delta -= 0.35;
  }
  return Math.max(-1.5, Math.min(1.5, delta));
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

function heuristic({ slug, concentracion, familia_olfativa, accords }) {
  const tier = concentracionTier(concentracion) ?? tierFromSlug(slug);
  const base = tier ? BASE_BY_CONCENTRACION[tier] : UNKNOWN_BASE;
  const delta = keywordDelta(familia_olfativa, accords);
  return base.map((v) => round1(Math.max(1.0, Math.min(9.5, v + delta))));
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const { rows } = await pool.query(
    `SELECT id, slug, concentracion, familia_olfativa, accords
     FROM perfumes
     WHERE activo = true`,
  );

  let manualCount = 0;
  let heuristicCount = 0;
  let skippedCount = 0;

  for (const row of rows) {
    const [longevidad, estela, proyeccion] =
      MANUAL_TOP[row.slug] ?? heuristic(row);
    const fuente = MANUAL_TOP[row.slug] ? "manual" : "heurística";

    if (DRY_RUN) {
      console.log(
        `[${fuente}] ${row.slug}: longevidad=${longevidad} estela=${estela} proyeccion=${proyeccion}`,
      );
    } else {
      const { rowCount } = await pool.query(
        `UPDATE perfumes
         SET longevidad = $2, estela = $3, proyeccion = $4
         WHERE id = $1 AND longevidad IS NULL AND estela IS NULL AND proyeccion IS NULL`,
        [row.id, longevidad, estela, proyeccion],
      );
      if (rowCount > 0) {
        console.log(`Actualizado (${fuente}): ${row.slug}`);
      } else {
        skippedCount += 1;
      }
    }

    if (MANUAL_TOP[row.slug]) manualCount += 1;
    else heuristicCount += 1;
  }

  await pool.end();
  console.log(
    `\nListo${DRY_RUN ? " (dry-run, sin escribir)" : ""}: ${rows.length} perfumes procesados ` +
      `(${manualCount} manual, ${heuristicCount} heurística, ${skippedCount} ya tenían datos y se dejaron intactos).`,
  );
}

main().catch((err) => {
  console.error("Error en el backfill:", err);
  process.exit(1);
});
