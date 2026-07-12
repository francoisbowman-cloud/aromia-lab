import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pool } from "./pool";

async function migrate() {
  const sql = readFileSync(
    join(__dirname, "..", "..", "migrations", "001_create_perfumes.sql"),
    "utf-8",
  );
  await pool.query(sql);
  console.log("Migración aplicada: 001_create_perfumes.sql");
  await pool.end();
}

migrate().catch((err) => {
  console.error("Error al migrar:", err);
  process.exit(1);
});
