import { Router } from "express";
import multer from "multer";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { pool } from "../../db/pool";
import { logActivity } from "../../db/activityLog";
import { asyncHandler } from "../../lib/asyncHandler";

export const adminArticlesRouter = Router();

const UPLOADS_DIR = join(__dirname, "..", "..", "..", "uploads", "articles");
if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (_req, file, cb) => {
      const ext = file.originalname.split(".").pop();
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

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
      `SELECT id, slug, titulo, categoria, estado, imagen_portada_url, actualizado_en
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
    const b = req.body;
    const slug = b.slug || slugify(b.titulo);

    const { rows } = await pool.query(
      `INSERT INTO articles (slug, titulo, categoria, estado, contenido_html)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [slug, b.titulo, b.categoria ?? "guia", b.estado ?? "borrador", b.contenido_html ?? ""],
    );
    await logActivity(`Se creó el artículo "${rows[0].titulo}"`);
    res.status(201).json(rows[0]);
  }),
);

adminArticlesRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const b = req.body;
    const fields = [
      "titulo", "categoria", "estado", "contenido_html", "meta_title",
      "meta_description", "url_canonica", "keyword_objetivo",
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
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No se recibió ninguna imagen" });

    const url = `/uploads/articles/${req.file.filename}`;
    const field = req.body.field === "og" ? "imagen_og_url" : "imagen_portada_url";

    const { rows } = await pool.query(
      `UPDATE articles SET ${field} = $1, actualizado_en = now() WHERE id = $2 RETURNING ${field}`,
      [url, req.params.id],
    );
    if (rows.length === 0) return res.status(404).json({ error: "Artículo no encontrado" });
    res.json(rows[0]);
  }),
);
