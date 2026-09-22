// Uso puntual: aplica UN archivo de migrations/ por su nombre, sin volver a
// correr todo el historial (migrate.ts no lleva tabla de control, así que
// `npm run migrate` completo contra una base ya poblada puede chocar con
// backfills viejos no idempotentes — ver 003_create_retailers.sql).
//
//   node scripts/apply-migration.js 021_add_articles_nivel_editorial.sql
//
// Requiere DATABASE_URL apuntando a la base real (usar DATABASE_PUBLIC_URL
// de Railway si se corre fuera de la red privada).
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { Pool } = require("pg");

const file = process.argv[2];
if (!file) {
  console.error("Uso: node scripts/apply-migration.js <archivo.sql>");
  process.exit(1);
}

const sql = readFileSync(join(__dirname, "..", "migrations", file), "utf-8");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool
  .query(sql)
  .then(() => {
    console.log(`Migración aplicada: ${file}`);
    return pool.end();
  })
  .catch((err) => {
    console.error("Error al aplicar la migración:", err);
    process.exit(1);
  });
