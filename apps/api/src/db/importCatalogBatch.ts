import "dotenv/config";
import { Pool, type PoolClient } from "pg";
import { loadBatchDefinition, type SourceRow } from "./catalogBatchImportContract";

async function insertRow(client: PoolClient, row: SourceRow, batchSource: string) {
  await client.query(
    `INSERT INTO perfumes (
      slug, nombre, marca, genero, familia_olfativa, concentracion,
      notas_salida, notas_corazon, notas_fondo, accords,
      precio_referencia, moneda, categoria_precio, imagen_url, link_afiliado,
      descripcion_corta, activo, estado, source_url, data_confidence,
      notes_status, catalog_source, subfamilia_olfativa, launch_year,
      perfumer, country, seo_title, seo_description
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
      NULL,NULL,$11,$12,NULL,$13,true,'publicado',$14,$15,
      'published',$16,$17,$18,$19,$20,$21,$22
    )`,
    [
      row.slug, row.name, row.brand, row.gender, row.family, row.concentration,
      row.topNotes, row.middleNotes, row.baseNotes, row.accords,
      row.priceSegment, row.imageUrl, row.description, row.sourceUrl,
      row.dataConfidence, batchSource, row.subfamily, row.launchYear,
      row.perfumer, row.country, row.seoTitle, row.seoDescription,
    ],
  );
}

async function importBatch(client: PoolClient, batchId: string, rows: SourceRow[], slugs: string[], expectedRows: number, sha256: string) {
  const beforeTotal = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes")).rows[0].n);
  const beforePublished = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes WHERE activo=true AND estado='publicado'")).rows[0].n);
  const existingRows = await client.query<{ slug: string }>("SELECT slug FROM perfumes WHERE slug = ANY($1::text[])", [slugs]);
  if (existingRows.rows.length) throw new Error(`preflight rejected existing slugs: ${existingRows.rows.map((row) => row.slug).join(", ")}`);

  console.log(JSON.stringify({ phase: "preflight", batch: batchId, artifact_sha256: sha256, beforeTotal, beforePublished, candidateRows: rows.length, existingSlugs: 0 }, null, 2));

  await client.query("BEGIN");
  try {
    for (const row of rows) await insertRow(client, row, batchId);
    const target = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes WHERE catalog_source=$1 AND slug = ANY($2::text[])", [batchId, slugs])).rows[0].n);
    if (target !== expectedRows) throw new Error(`transaction verification expected ${expectedRows} batch rows, got ${target}`);
    const afterTotalTx = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes")).rows[0].n);
    if (afterTotalTx !== beforeTotal + expectedRows) throw new Error(`transaction total expected ${beforeTotal + expectedRows}, got ${afterTotalTx}`);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }

  const afterTotal = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes")).rows[0].n);
  const afterPublished = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes WHERE activo=true AND estado='publicado'")).rows[0].n);
  const imported = (await client.query("SELECT slug, marca, nombre, activo, estado, catalog_source FROM perfumes WHERE catalog_source=$1 ORDER BY slug", [batchId])).rows;
  if (afterTotal !== beforeTotal + expectedRows || afterPublished !== beforePublished + expectedRows || imported.length !== expectedRows) {
    throw new Error(`post-commit verification failed: totals ${beforeTotal}->${afterTotal}, published ${beforePublished}->${afterPublished}, batchRows=${imported.length}`);
  }
  console.log(JSON.stringify({ phase: "committed", batch: batchId, artifact_sha256: sha256, inserted: expectedRows, beforeTotal, afterTotal, beforePublished, afterPublished, imported }, null, 2));
}

async function rollbackBatch(client: PoolClient, batchId: string, slugs: string[], expectedRows: number, sha256: string) {
  if (process.env.ALLOW_CATALOG_BATCH_ROLLBACK !== batchId) {
    throw new Error(`rollback requires ALLOW_CATALOG_BATCH_ROLLBACK=${batchId}`);
  }
  const rows = (await client.query<{ slug: string; catalog_source: string }>("SELECT slug, catalog_source FROM perfumes WHERE slug = ANY($1::text[]) ORDER BY slug", [slugs])).rows;
  if (rows.length !== expectedRows || rows.some((row) => row.catalog_source !== batchId)) {
    throw new Error(`rollback preflight refused: expected exactly ${expectedRows} rows owned by ${batchId}, got ${rows.length}`);
  }

  await client.query("BEGIN");
  try {
    const deleted = await client.query("DELETE FROM perfumes WHERE catalog_source=$1 AND slug = ANY($2::text[])", [batchId, slugs]);
    if (deleted.rowCount !== expectedRows) throw new Error(`rollback expected ${expectedRows} deletes, got ${deleted.rowCount}`);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
  console.log(JSON.stringify({ phase: "rolled_back", batch: batchId, artifact_sha256: sha256, deleted: expectedRows }, null, 2));
}

async function main() {
  const action = process.env.CATALOG_IMPORT_ACTION ?? "validate";
  if (!new Set(["validate", "import", "rollback"]).has(action)) throw new Error(`unsupported CATALOG_IMPORT_ACTION=${action}`);
  const definition = loadBatchDefinition(process.env.CATALOG_IMPORT_BATCH);

  if (action === "validate") {
    console.log(JSON.stringify({
      phase: "validated",
      batch: definition.batchId,
      artifact_sha256: definition.sha256,
      rows: definition.rows.length,
      expected_rows: definition.manifest.expected_rows,
      production_write: false,
    }, null, 2));
    return;
  }

  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for import/rollback");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    if (action === "rollback") {
      await rollbackBatch(client, definition.batchId, definition.slugs, definition.manifest.expected_rows, definition.sha256);
    } else {
      await importBatch(client, definition.batchId, definition.rows, definition.slugs, definition.manifest.expected_rows, definition.sha256);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("CATALOG_BATCH_IMPORT_FAILED", error);
  process.exit(1);
});
