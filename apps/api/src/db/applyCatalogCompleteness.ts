import "dotenv/config";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pool } from "./pool";

async function applyCatalogCompleteness() {
  const migrationsDir = join(__dirname, "..", "..", "migrations");
  const files = readdirSync(migrationsDir)
    .filter((file) => /^012[a-f]_.*\.sql$/.test(file))
    .sort();

  if (files.length !== 6) {
    throw new Error(`Expected 6 catalog completeness migrations (012a-012f), found ${files.length}: ${files.join(", ")}`);
  }

  try {
    for (const file of files) {
      const sql = readFileSync(join(migrationsDir, file), "utf-8");
      await pool.query(sql);
      console.log(`[catalog-completeness] applied ${file}`);
    }
  } finally {
    await pool.end();
  }
}

applyCatalogCompleteness().catch((error) => {
  console.error("CATALOG_COMPLETENESS_MIGRATION_FAILED", error);
  process.exit(1);
});
