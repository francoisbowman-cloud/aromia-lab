import { Router } from "express";
import { pool } from "../db/pool";
import { asyncHandler } from "../lib/asyncHandler";

export const perfumesRouter = Router();

const PUBLISHED = "activo = true AND estado = 'publicado'";

// DTO acotado para listados de Discovery/Search: sin retailers, precios,
// reseñas largas ni metadata de fuente — eso solo lo necesita la ficha
// completa (GET /:slug). Trae lo que PerfumeCard renderiza más los campos
// que discovery.ts/personalization.ts necesitan para rankear en el cliente
// (ver handoffs/AROMIA_CODE_DISCOVERY_SEARCH_ARCHITECTURE_2026-09-20.md).
const SEARCH_COLUMNS = `
  slug, nombre, marca, genero, familia_olfativa, concentracion,
  notas_salida, notas_corazon, notas_fondo, temporada_recomendada, ocasion,
  categoria_precio, nicho_o_comercial, imagen_url, rating_promedio
`;

// ---------- Búsqueda acotada (server-backed) ----------
// GET /api/perfumes/search?q=&familia=&page=&pageSize=
perfumesRouter.get(
  "/search",
  asyncHandler(async (req, res) => {
    const { q, familia, page = "1", pageSize = "20" } = req.query as Record<string, string>;

    const conditions = [PUBLISHED];
    const params: unknown[] = [];

    if (q) {
      params.push(`%${q}%`);
      const p = params.length;
      conditions.push(
        `(nombre ILIKE $${p} OR marca ILIKE $${p} OR familia_olfativa ILIKE $${p}
          OR array_to_string(notas_salida, ' ') ILIKE $${p}
          OR array_to_string(notas_corazon, ' ') ILIKE $${p}
          OR array_to_string(notas_fondo, ' ') ILIKE $${p})`,
      );
    }
    if (familia) {
      params.push(familia);
      conditions.push(`familia_olfativa = $${params.length}`);
    }

    const where = `WHERE ${conditions.join(" AND ")}`;
    const limit = Math.min(Math.max(Number(pageSize) || 20, 1), 40);
    const currentPage = Math.max(Number(page) || 1, 1);
    const offset = (currentPage - 1) * limit;

    const { rows: countRows } = await pool.query(`SELECT COUNT(*)::int AS total FROM perfumes ${where}`, params);

    params.push(limit, offset);
    const { rows } = await pool.query(
      `SELECT ${SEARCH_COLUMNS} FROM perfumes ${where}
       ORDER BY nombre ASC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    res.json({ items: rows, total: countRows[0].total, page: currentPage, pageSize: limit });
  }),
);

// ---------- Facetas de familia olfativa (para el atlas de /descubrir) ----------
// GET /api/perfumes/facets
perfumesRouter.get(
  "/facets",
  asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      `SELECT familia_olfativa AS name, COUNT(*)::int AS count
       FROM perfumes WHERE ${PUBLISHED} AND familia_olfativa IS NOT NULL
       GROUP BY familia_olfativa ORDER BY count DESC, name ASC LIMIT 12`,
    );
    res.json({ families: rows });
  }),
);

// ---------- Muestra acotada y diversa para personalización ----------
// GET /api/perfumes/discovery-seed?limit=
// Reemplaza "rankear todo el catálogo en el browser" por un candidato
// acotado, repartido entre familias (hasta 8 por familia) para que la
// recomendación siga teniendo variedad real sin transportar el catálogo
// completo. El perfil de gustos nunca sale del browser — este endpoint no
// recibe ni usa ninguna señal personal, solo devuelve una muestra fija.
perfumesRouter.get(
  "/discovery-seed",
  asyncHandler(async (req, res) => {
    const { limit = "48" } = req.query as Record<string, string>;
    const boundedLimit = Math.min(Math.max(Number(limit) || 48, 1), 80);

    const { rows } = await pool.query(
      `SELECT ${SEARCH_COLUMNS} FROM (
         SELECT *, ROW_NUMBER() OVER (
           PARTITION BY familia_olfativa
           ORDER BY rating_promedio DESC NULLS LAST, nombre ASC
         ) AS rn
         FROM perfumes WHERE ${PUBLISHED}
       ) seeded
       WHERE rn <= 8
       ORDER BY rn ASC, familia_olfativa ASC
       LIMIT $1`,
      [boundedLimit],
    );

    res.json(rows);
  }),
);

perfumesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      `SELECT * FROM perfumes WHERE ${PUBLISHED} ORDER BY nombre ASC`,
    );
    res.json(rows);
  }),
);

perfumesRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT * FROM perfumes WHERE slug = $1 AND ${PUBLISHED}`,
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
