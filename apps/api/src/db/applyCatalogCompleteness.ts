import "dotenv/config";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pool } from "./pool";
import { completePublishedAmazonCatalog } from "./completeAmazonCatalog";

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
  "016_restore_and_assert_published_catalog_count.sql",
  "017_omni_ccl_product_media_gate.sql",
  "018_restore_remaining_product_packshots.sql",
  "019_ccl_restore_three_verified_packshots.sql",
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

    // Amazon resolution is a slow, rate-limited enrichment job. Running it before
    // Express listens made every deploy return 502s for several minutes. Keep it
    // explicitly opt-in for maintenance runs; startup only applies deterministic DB gates.
    if (process.env.RUN_AMAZON_COMPLETION_ON_STARTUP === "true") {
      try {
        await completePublishedAmazonCatalog(pool);
      } catch (error) {
        console.error("AMAZON_CATALOG_COMPLETION_DEGRADED", error);
        console.error("[catalog-completeness] Amazon enrichment failed; API startup will continue with the last verified catalog state");
      }
    } else {
      console.log("[catalog-completeness] skipped Amazon enrichment during startup");
    }
  } finally {
    await pool.end();
  }
}

applyCatalogCompleteness().catch((error) => {
  console.error("CATALOG_COMPLETENESS_MIGRATION_FAILED", error);
  process.exit(1);
});
