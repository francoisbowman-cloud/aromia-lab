import { Router } from "express";
import { randomUUID } from "node:crypto";
import { pool } from "../../db/pool";
import { logActivity } from "../../db/activityLog";
import { asyncHandler } from "../../lib/asyncHandler";
import { receiveImage, storeEntityImage } from "../../lib/imageUpload";

export const adminArticlesRouter = Router();


function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

adminArticlesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { q } = req.query as Record<string, string>;
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (q) {
      params.push(`%${q}%`);
      conditions.push(`titulo ILIKE $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const { rows } = await pool.query(
      `SELECT id, slug, titulo, categoria, estado, imagen_portada_url, actualizado_en, nivel
       FROM articles ${where} ORDER BY actualizado_en DESC`,
      params,
    );
    res.json({ items: rows });
  }),
);

adminArticlesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM articles WHERE id = $1", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Artículo no encontrado" });
    res.json(rows[0]);
  }),
);

adminArticlesRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const b = req.body ?? {};
    if (typeof b.titulo !== "string" || !b.titulo.trim()) {
      return res.status(400).json({ error: "El título es obligatorio" });
    }
    if (!["resena", "guia", "analisis", "academia", "tendencias"].includes(b.categoria ?? "guia")
        || !["borrador", "publicado"].includes(b.estado ?? "borrador")
        || (b.slug !== undefined && (typeof b.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(b.slug)))) {
      return res.status(400).json({ error: "Categoría, estado o slug no válido" });
    }
    const slug = b.slug || `${slugify(b.titulo) || "articulo"}-${randomUUID().slice(0, 8)}`;

    let rows;
    try {
      ({ rows } = await pool.query(
      `INSERT INTO articles (slug, titulo, categoria, estado, contenido_html)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [slug, b.titulo.trim(), b.categoria ?? "guia", b.estado ?? "borrador", b.contenido_html ?? ""],
      ));
    } catch (error) {
      if ((error as { code?: string }).code === "23505") {
        return res.status(409).json({ error: "Ya existe un artículo con ese slug" });
      }
      throw error;
    }
    await logActivity(`Se creó el artículo "${rows[0].titulo}"`);
    res.status(201).json(rows[0]);
  }),
);

adminArticlesRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const b = req.body;
    const fields = [
      "titulo", "categoria", "estado", "contenido_html", "contenido_markdown", "autor", "meta_title",
      "meta_description", "url_canonica", "keyword_objetivo", "nivel", "imagen_portada_url", "imagen_og_url",
    ];

    const updates: string[] = [];
    const params: unknown[] = [];
    for (const field of fields) {
      if (field in b) {
        params.push(b[field]);
        updates.push(`${field} = $${params.length}`);
      }
    }

    if (b.estado === "publicado") {
      updates.push(`publicado_en = COALESCE(publicado_en, now())`);
    }

    if (updates.length === 0) return res.status(400).json({ error: "Nada para actualizar" });

    params.push(req.params.id);
    const { rows } = await pool.query(
      `UPDATE articles SET ${updates.join(", ")}, actualizado_en = now() WHERE id = $${params.length} RETURNING *`,
      params,
    );

    if (rows.length === 0) return res.status(404).json({ error: "Artículo no encontrado" });

    const accion = b.estado === "publicado" ? "publicó" : "actualizó";
    await logActivity(`Se ${accion} el artículo "${rows[0].titulo}"`);
    res.json(rows[0]);
  }),
);

adminArticlesRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query("DELETE FROM articles WHERE id = $1 RETURNING id", [
      req.params.id,
    ]);
    if (rows.length === 0) return res.status(404).json({ error: "Artículo no encontrado" });
    res.json({ ok: true });
  }),
);

adminArticlesRouter.post(
  "/:id/image",
  receiveImage,
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No se recibió ninguna imagen" });
    if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ error: "Identificador no válido" });
    const updated = await storeEntityImage("articles", req.params.id, req.file, req.body.field === "og");
    if (!updated) return res.status(404).json({ error: "No encontrado" });
    res.json(updated);
  }),
);
