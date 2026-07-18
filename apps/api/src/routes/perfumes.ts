import { Router } from "express";
import { pool } from "../db/pool";
import { asyncHandler } from "../lib/asyncHandler";

export const perfumesRouter = Router();

perfumesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      "SELECT * FROM perfumes WHERE activo = true AND estado = 'publicado' ORDER BY nombre ASC",
    );
    res.json(rows);
  }),
);

perfumesRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      "SELECT * FROM perfumes WHERE slug = $1 AND activo = true AND estado = 'publicado'",
      [req.params.slug],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Perfume no encontrado" });
    }

    const { rows: retailers } = await pool.query(
      "SELECT * FROM retailers WHERE perfume_id = $1 AND activo = true ORDER BY orden ASC",
      [rows[0].id],
    );

    res.json({ ...rows[0], retailers });
  }),
);
