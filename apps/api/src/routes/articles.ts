import { Router } from "express";
import { pool } from "../db/pool";
import { asyncHandler } from "../lib/asyncHandler";

import { publicArticleHtml, publicStoryMarkdown } from "../lib/articleContent";

export const articlesRouter = Router();

articlesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      `SELECT id, slug, titulo, categoria, imagen_portada_url, meta_description,
              perfumes_relacionados, publicado_en, nivel
       FROM articles WHERE estado = 'publicado' ORDER BY publicado_en DESC`,
    );
    res.json(rows);
  }),
);

articlesRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT id, slug, titulo, categoria, estado, contenido_html, contenido_markdown,
              imagen_portada_url, imagen_og_url, autor, meta_title, meta_description,
              url_canonica, perfumes_relacionados, publicado_en, nivel
       FROM articles WHERE slug = $1 AND estado = 'publicado'`,
      [req.params.slug],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Artículo no encontrado" });
    }

    res.json({ ...rows[0], contenido_html: publicArticleHtml(rows[0].contenido_html),
      contenido_markdown: publicStoryMarkdown(rows[0].contenido_markdown) });
  }),
);
