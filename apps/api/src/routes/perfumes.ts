import { Router } from "express";
import { pool } from "../db/pool";

export const perfumesRouter = Router();

perfumesRouter.get("/", async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM perfumes WHERE activo = true ORDER BY nombre ASC",
  );
  res.json(rows);
});

perfumesRouter.get("/:slug", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM perfumes WHERE slug = $1 AND activo = true",
    [req.params.slug],
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: "Perfume no encontrado" });
  }

  res.json(rows[0]);
});
