import "dotenv/config";
import { Pool } from "pg";

const CATALOG_SOURCE = "batch-003";
const EXPECTED_ROWS = 10;

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const rows = (await pool.query(
      `SELECT slug, nombre, marca, genero, concentracion, notas_salida, notas_corazon, notas_fondo,
              source_url, data_confidence, imagen_url, activo, estado, catalog_source
       FROM perfumes WHERE catalog_source = $1 ORDER BY slug`,
      [CATALOG_SOURCE],
    )).rows;

    const failures: string[] = [];
    if (rows.length !== EXPECTED_ROWS) failures.push(`row_count:${rows.length}`);
    for (const row of rows) {
      if (!row.slug || !row.nombre || !row.marca || !row.genero || !row.concentracion) failures.push(`${row.slug}:identity_fields`);
      if (!Array.isArray(row.notas_salida) || row.notas_salida.length === 0) failures.push(`${row.slug}:top_notes`);
      if (!Array.isArray(row.notas_corazon) || row.notas_corazon.length === 0) failures.push(`${row.slug}:middle_notes`);
      if (!Array.isArray(row.notas_fondo) || row.notas_fondo.length === 0) failures.push(`${row.slug}:base_notes`);
      if (!row.source_url) failures.push(`${row.slug}:source_url`);
      if (row.data_confidence !== "high") failures.push(`${row.slug}:data_confidence`);
      if (row.activo !== true || row.estado !== "publicado") failures.push(`${row.slug}:publication_state`);
      if (row.catalog_source !== CATALOG_SOURCE) failures.push(`${row.slug}:catalog_source`);
    }

    console.log(JSON.stringify({
      phase: "runtime_verify",
      expectedRows: EXPECTED_ROWS,
      actualRows: rows.length,
      failures,
      rows: rows.map((row) => ({
        slug: row.slug,
        name: row.nombre,
        brand: row.marca,
        gender: row.genero,
        concentration: row.concentracion,
        hasImage: Boolean(row.imagen_url),
        sourceUrl: row.source_url,
      })),
    }, null, 2));

    if (failures.length) throw new Error(`batch-003 runtime verification failed: ${failures.join(", ")}`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("CATALOG_BATCH_003_VERIFY_FAILED", error);
  process.exit(1);
});
