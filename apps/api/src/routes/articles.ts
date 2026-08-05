import { Router } from "express";
import { pool } from "../db/pool";
import { asyncHandler } from "../lib/asyncHandler";

export const articlesRouter = Router();

articlesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      `SELECT id, slug, titulo, categoria, imagen_portada_url, meta_description,
              perfumes_relacionados, publicado_en
       FROM articles WHERE estado = 'publicado' ORDER BY publicado_en DESC`,
    );
    res.json(rows);
  }),
);

articlesRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      "SELECT * FROM articles WHERE slug = $1 AND estado = 'publicado'",
      [req.params.slug],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Artículo no encontrado" });
    }

    res.json(rows[0]);
  }),
);
