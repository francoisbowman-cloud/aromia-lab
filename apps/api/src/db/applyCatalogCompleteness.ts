import "dotenv/config";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pool } from "./pool";

const REQUIRED_MIGRATIONS = [
  "012a_complete_published_catalog_01.sql",
  "012b_complete_published_catalog_02.sql",
  "012c_complete_published_catalog_03.sql",
  "012d_complete_published_catalog_04.sql",
  "012e_complete_published_catalog_05.sql",
  "012f_assert_published_catalog_complete.sql",
  "013_catalog_audit_verified_metadata.sql",
  "014_assert_catalog_display_integrity.sql",
  "015_amazon_catalog_commerce_gate.sql",
];

async function applyCatalogCompleteness() {
  const migrationsDir = join(__dirname, "..", "..", "migrations");
  const available = new Set(readdirSync(migrationsDir).filter((file) => file.endsWith(".sql")));
  const missing = REQUIRED_MIGRATIONS.filter((file) => !available.has(file));
  if (missing.length > 0) throw new Error(`Missing catalog completeness migrations: ${missing.join(", ")}`);
  try {
    for (const file of REQUIRED_MIGRATIONS) {
      const sql = readFileSync(join(migrationsDir, file), "utf-8");
      await pool.query(sql);
      console.log(`[catalog-completeness] applied ${file}`);
    }
  } finally { await pool.end(); }
}
applyCatalogCompleteness().catch((error) => { console.error("CATALOG_COMPLETENESS_MIGRATION_FAILED", error); process.exit(1); });
