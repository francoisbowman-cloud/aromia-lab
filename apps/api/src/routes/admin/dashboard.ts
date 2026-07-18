import { Router } from "express";
import { pool } from "../../db/pool";

export const adminDashboardRouter = Router();

adminDashboardRouter.get("/", async (_req, res) => {
  const { rows: perfumesCount } = await pool.query(
    "SELECT COUNT(*)::int AS total FROM perfumes WHERE activo = true",
  );

  let articulosPublicados = 0;
  try {
    const { rows } = await pool.query(
      "SELECT COUNT(*)::int AS total FROM articles WHERE estado = 'publicado'",
    );
    articulosPublicados = rows[0].total;
  } catch {
    // La tabla articles todavía no existe (Fase 7) — se trata como 0, no como error.
    articulosPublicados = 0;
  }

  const { rows: actividad } = await pool.query(
    "SELECT descripcion, actor, creado_en FROM activity_log ORDER BY creado_en DESC LIMIT 10",
  );

  res.json({
    totalPerfumes: perfumesCount[0].total,
    articulosPublicados,
    visitasCloudflare: null,
    clicksAfiliados: null,
    actividadReciente: actividad,
  });
});
