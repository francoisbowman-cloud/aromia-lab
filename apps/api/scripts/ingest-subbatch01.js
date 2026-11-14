// Import the nine source files as drafts. Existing published stories are left intact.
// Local browser fixtures only: --publish-local-fixtures requires loopback *_dev DB.
// Run from the complete checkout; source Markdown is deliberately not in runtime images.
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { Pool } = require("pg");
const matter = require("gray-matter");

const DRAFTS_DIR = join(__dirname, "..", "..", "..", "drafts");

const SLUGS = [
  "antes-del-perfume-ya-oliamos",
  "comprar-para-oler-o-comprar-para-tener",
  "cuando-ya-no-hueles-tu-perfume",
  "fougere-no-significa-viejo",
  "huele-sintetico-que-estamos-diciendo",
  "lavanda-limpia-medicinal-barata-elegante",
  "nos-perfumamos-para-nosotros-o-para-los-demas",
  "podemos-describir-un-olor-sin-compararlo",
  "por-que-una-lista-de-notas-no-te-dice-como-huele",
];

async function main() {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== "--publish-local-fixtures")) throw new Error("Unknown ingest option");
  const fixture = args.includes("--publish-local-fixtures");
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  if (fixture) {
    let url;
    try { url = new URL(process.env.DATABASE_URL); } catch { throw new Error("Invalid database configuration"); }
    if (process.env.NODE_ENV === "production" || !["postgres:", "postgresql:"].includes(url.protocol)
        || !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) || !/^[a-z][a-z0-9_]*_dev$/.test(url.pathname.slice(1))) {
      throw new Error("Publishing fixtures requires a loopback *_dev database outside production");
    }
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  let imported = 0;
  try {
  await client.query("BEGIN");

  for (const slug of SLUGS) {
    const raw = readFileSync(join(DRAFTS_DIR, `${slug}.md`), "utf8");
    const titulo = matter(raw).data.titulo || slug.replaceAll("-", " ");

    const result = await client.query(
      `INSERT INTO articles (slug, titulo, categoria, estado, contenido_markdown, publicado_en)
       VALUES ($1, $2, 'analisis', $4, $3, CASE WHEN $5 THEN now() ELSE NULL END)
       ON CONFLICT (slug) DO UPDATE SET
         titulo = EXCLUDED.titulo,
         contenido_markdown = EXCLUDED.contenido_markdown,
         estado = CASE WHEN $5 THEN 'publicado' ELSE articles.estado END,
         publicado_en = CASE WHEN $5 THEN COALESCE(articles.publicado_en, now()) ELSE articles.publicado_en END,
         actualizado_en = now()
       WHERE articles.estado = 'borrador' OR $5
       RETURNING id`,
      [slug, titulo, raw, fixture ? "publicado" : "borrador", fixture],
    );
    imported += result.rowCount;
  }

  await client.query("COMMIT");
  } catch (error) { await client.query("ROLLBACK"); throw error; }
  finally { client.release(); await pool.end(); }
  console.log({ imported, preserved: SLUGS.length - imported, mode: fixture ? "local published fixtures" : "drafts only" });
}

main().catch((err) => {
  console.error("Error al ingestar:", err);
  process.exit(1);
});
