// Ingesta puntual de los 9 borradores de SubBatch 01 a la tabla `articles`
// (WS-1 ítem 1.2 / D-6). El texto crudo del .md (frontmatter incluido) se
// guarda tal cual en `contenido_markdown` — apps/web/src/app/(editorial)/
// historias/subBatch01Story.tsx lo parsea igual que antes hacía con el
// archivo en disco, solo que ahora lo trae de la API en vez de leer
// drafts/ (que no existe en la imagen de runtime).
//
// Uso:
//   node scripts/ingest-subbatch01.js
//
// Requiere DATABASE_URL apuntando a la base real (DATABASE_PUBLIC_URL de
// Railway si se corre fuera de la red privada) y que la migración
// 022_add_articles_contenido_markdown.sql ya esté aplicada.
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { Pool } = require("pg");

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

function frontmatterValue(source, key) {
  const match = source.match(new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, "m"));
  return match?.[1]?.replace(/["']$/, "").trim() ?? "";
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  for (const slug of SLUGS) {
    const raw = readFileSync(join(DRAFTS_DIR, `${slug}.md`), "utf8");
    const titulo = frontmatterValue(raw, "titulo") || slug.replaceAll("-", " ");

    await pool.query(
      `INSERT INTO articles (slug, titulo, categoria, estado, contenido_markdown, publicado_en)
       VALUES ($1, $2, 'analisis', 'publicado', $3, now())
       ON CONFLICT (slug) DO UPDATE SET
         titulo = EXCLUDED.titulo,
         contenido_markdown = EXCLUDED.contenido_markdown,
         estado = 'publicado',
         publicado_en = COALESCE(articles.publicado_en, now()),
         actualizado_en = now()`,
      [slug, titulo, raw],
    );
    console.log(`Ingestado: ${slug}`);
  }

  await pool.end();
  console.log(`Listo: ${SLUGS.length} artículos ingestados.`);
}

main().catch((err) => {
  console.error("Error al ingestar:", err);
  process.exit(1);
});
