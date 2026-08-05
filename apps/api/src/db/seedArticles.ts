import "dotenv/config";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { pool } from "./pool";

// El `tipo` de los .md de Sprint 1 no coincide con el enum `categoria` de la
// tabla `articles` (decisión de Brey: categorías simples del mockup, no el
// enum viejo de v1) — se mapea acá, una sola vez.
const TIPO_A_CATEGORIA: Record<string, string> = {
  resena_individual: "resena",
  comparativa: "analisis",
  guia_temporada: "guia",
  guia_ocasion: "guia",
  guia_educativa: "academia",
};

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, "");
}

async function seedArticles() {
  const dir = join(__dirname, "..", "..", "data", "articles");
  const files = readdirSync(dir).filter((f) => f.endsWith(".md"));

  let inserted = 0;
  let updated = 0;
  const sinPerfumeMatch: string[] = [];

  for (const file of files) {
    const raw = readFileSync(join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    const slug = slugFromFilename(file);
    const categoria = TIPO_A_CATEGORIA[data.tipo] ?? "analisis";
    // La página ya renderiza `titulo` en su propio <h1> — se saca el primer
    // encabezado `# ...` del cuerpo para no duplicarlo.
    const contentSinH1 = content.replace(/^\s*#\s+.+\n/, "");
    const contenidoHtml = await marked.parse(contentSinH1);

    const nombresPerfumes: string[] = Array.isArray(data.perfumes) ? data.perfumes : [];
    let perfumesRelacionados: number[] = [];
    if (nombresPerfumes.length > 0) {
      const { rows } = await pool.query(
        "SELECT id, nombre FROM perfumes WHERE nombre = ANY($1::text[])",
        [nombresPerfumes],
      );
      perfumesRelacionados = rows.map((r) => r.id);
      if (rows.length < nombresPerfumes.length) {
        sinPerfumeMatch.push(
          `${slug}: ${nombresPerfumes.filter((n) => !rows.some((r) => r.nombre === n)).join(", ")}`,
        );
      }
    }

    const result = await pool.query(
      `INSERT INTO articles (
        slug, titulo, categoria, estado, contenido_html,
        perfumes_relacionados, keyword_objetivo, meta_title, publicado_en
      ) VALUES ($1, $2, $3, 'publicado', $4, $5, $6, $7, now())
      ON CONFLICT (slug) DO UPDATE SET
        titulo = EXCLUDED.titulo,
        categoria = EXCLUDED.categoria,
        contenido_html = EXCLUDED.contenido_html,
        perfumes_relacionados = EXCLUDED.perfumes_relacionados,
        keyword_objetivo = EXCLUDED.keyword_objetivo,
        meta_title = EXCLUDED.meta_title,
        actualizado_en = now()
      RETURNING (xmax = 0) AS inserted`,
      [slug, data.titulo, categoria, contenidoHtml, perfumesRelacionados, data.keyword_objetivo ?? null, data.titulo],
    );

    if (result.rows[0]?.inserted) {
      inserted += 1;
    } else {
      updated += 1;
    }
  }

  console.log(`Seed de artículos completo: ${inserted} insertados, ${updated} actualizados (de ${files.length} archivos).`);
  if (sinPerfumeMatch.length > 0) {
    console.warn("Perfumes del front-matter sin match en la tabla perfumes:");
    sinPerfumeMatch.forEach((line) => console.warn(`  - ${line}`));
  }
  await pool.end();
}

seedArticles().catch((err) => {
  console.error("Error al sembrar artículos:", err);
  process.exit(1);
});
