import "dotenv/config";
import { Pool } from "pg";

const CATALOG_SOURCE = "batch-003";
const EXPECTED_ROWS = 10;

async function main() {
  if (process.env.ROLLBACK_BATCH_003 !== "YES") {
    throw new Error("Set ROLLBACK_BATCH_003=YES to authorize rollback of batch-003");
  }
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    const before = await client.query<{ slug: string; catalog_source: string }>(
      "SELECT slug, catalog_source FROM perfumes WHERE catalog_source = $1 ORDER BY slug",
      [CATALOG_SOURCE],
    );
    if (before.rowCount !== EXPECTED_ROWS) {
      throw new Error(`rollback refused: expected exactly ${EXPECTED_ROWS} ${CATALOG_SOURCE} rows, found ${before.rowCount}`);
    }

    await client.query("BEGIN");
    const deleted = await client.query<{ slug: string }>(
      "DELETE FROM perfumes WHERE catalog_source = $1 RETURNING slug",
      [CATALOG_SOURCE],
    );
    if (deleted.rowCount !== EXPECTED_ROWS) {
      throw new Error(`rollback verification failed: expected ${EXPECTED_ROWS} deletes, got ${deleted.rowCount}`);
    }

    const remaining = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes WHERE catalog_source = $1", [CATALOG_SOURCE])).rows[0].n);
    if (remaining !== 0) throw new Error(`rollback verification failed: ${remaining} batch-003 rows remain`);
    await client.query("COMMIT");

    console.log(JSON.stringify({
      phase: "rolled_back",
      catalogSource: CATALOG_SOURCE,
      deleted: deleted.rowCount,
      slugs: deleted.rows.map((row) => row.slug).sort(),
    }, null, 2));
  } catch (error) {
    try { await client.query("ROLLBACK"); } catch {}
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("CATALOG_BATCH_003_ROLLBACK_FAILED", error);
  process.exit(1);
});
