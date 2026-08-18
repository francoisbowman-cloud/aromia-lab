import "dotenv/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";
import { Pool } from "pg";

type RawRow = Record<string, string>;

const BATCH_PATH = resolve(process.cwd(), "catalog/imports/batch-003.csv");
const CATALOG_SOURCE = "batch-003";
const EXPECTED_ROWS = 10;

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  if (process.env.CONFIRM_BATCH_003_ROLLBACK !== "DELETE_BATCH_003") {
    throw new Error("Set CONFIRM_BATCH_003_ROLLBACK=DELETE_BATCH_003 to authorize rollback");
  }

  const rows = parse(readFileSync(BATCH_PATH), { columns: true, skip_empty_lines: true, trim: true }) as RawRow[];
  if (rows.length !== EXPECTED_ROWS) throw new Error(`rollback manifest expected ${EXPECTED_ROWS} rows, got ${rows.length}`);
  const slugs = rows.map((row) => row.slug);

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    const before = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes")).rows[0].n);
    const target = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes WHERE catalog_source=$1 AND slug = ANY($2::text[])", [CATALOG_SOURCE, slugs])).rows[0].n);
    if (target !== EXPECTED_ROWS) throw new Error(`rollback refuses partial/ambiguous target: expected ${EXPECTED_ROWS}, got ${target}`);

    await client.query("BEGIN");
    const result = await client.query("DELETE FROM perfumes WHERE catalog_source=$1 AND slug = ANY($2::text[])", [CATALOG_SOURCE, slugs]);
    if (result.rowCount !== EXPECTED_ROWS) throw new Error(`rollback delete expected ${EXPECTED_ROWS}, got ${result.rowCount}`);
    await client.query("COMMIT");

    const after = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes")).rows[0].n);
    if (after !== before - EXPECTED_ROWS) throw new Error(`rollback post-count mismatch: ${before}->${after}`);
    console.log(JSON.stringify({ phase: "rollback_committed", deleted: EXPECTED_ROWS, beforeTotal: before, afterTotal: after, catalogSource: CATALOG_SOURCE }, null, 2));
  } catch (error) {
    try { await client.query("ROLLBACK"); } catch {}
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("BATCH_003_ROLLBACK_FAILED", error);
  process.exit(1);
});
