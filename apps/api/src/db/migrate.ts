import "dotenv/config";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pool } from "./pool";
import { selectMigrations } from "./migrationPolicy";

async function migrate() {
  const migrationsDir = join(__dirname, "..", "..", "migrations");
  const plan = selectMigrations(readdirSync(migrationsDir),{
    intelligenceEnabled:process.env.AROMIA_INTELLIGENCE_MIGRATIONS_ENABLED,
    productionApproved:process.env.AROMIA_INTELLIGENCE_PRODUCTION_MIGRATIONS_APPROVED,
    nodeEnv:process.env.NODE_ENV,
  });
  if(plan.deferred.length) {
    console.log(`Migraciones opt-in de Intelligence omitidas: ${plan.deferred.join(", ")}`);
  }

  for (const file of plan.selected) {
    const sql = readFileSync(join(migrationsDir, file), "utf-8");
    await pool.query(sql);
    console.log(`Migración aplicada: ${file}`);
  }

  await pool.end();
}

migrate().catch((err) => {
  console.error("Error al migrar:", err);
  process.exit(1);
});
