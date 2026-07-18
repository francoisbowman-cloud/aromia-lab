import { Router } from "express";
import multer from "multer";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { pool } from "../../db/pool";
import { logActivity } from "../../db/activityLog";

export const adminPerfumesRouter = Router();

const UPLOADS_DIR = join(__dirname, "..", "..", "..", "uploads", "perfumes");
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
  fileFilter: (_req, file, cb) => {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.mimetype)) {
      return cb(new Error("Formato no soportado (solo PNG, JPG o WEBP)"));
    }
    cb(null, true);
  },
});

// ---------- Listado con búsqueda/filtros/paginación ----------
adminPerfumesRouter.get("/", async (req, res) => {
  const { q, marca, familia_olfativa, categoria_precio, estado, page = "1", pageSize = "20" } =
    req.query as Record<string, string>;

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (q) {
    params.push(`%${q}%`);
    conditions.push(`(nombre ILIKE $${params.length} OR marca ILIKE $${params.length} OR slug ILIKE $${params.length})`);
  }
  if (marca) {
    params.push(marca);
    conditions.push(`marca = $${params.length}`);
  }
  if (familia_olfativa) {
    params.push(familia_olfativa);
    conditions.push(`familia_olfativa = $${params.length}`);
  }
  if (categoria_precio) {
    params.push(categoria_precio);
    conditions.push(`categoria_precio = $${params.length}`);
  }
  if (estado) {
    params.push(estado);
    conditions.push(`estado = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit = Math.min(Number(pageSize) || 20, 100);
  const offset = (Math.max(Number(page) || 1, 1) - 1) * limit;

  const { rows: countRows } = await pool.query(
    `SELECT COUNT(*)::int AS total FROM perfumes ${where}`,
    params,
  );

  params.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT id, slug, nombre, marca, familia_olfativa, categoria_precio, precio_referencia, moneda, imagen_url, estado
     FROM perfumes ${where} ORDER BY actualizado_en DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );

  res.json({ items: rows, total: countRows[0].total, page: Number(page) || 1, pageSize: limit });
});

// ---------- Detalle ----------
adminPerfumesRouter.get("/:id", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM perfumes WHERE id = $1", [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: "Perfume no encontrado" });

  const { rows: retailers } = await pool.query(
    "SELECT * FROM retailers WHERE perfume_id = $1 ORDER BY orden ASC",
    [req.params.id],
  );

  res.json({ ...rows[0], retailers });
});

// ---------- Crear ----------
adminPerfumesRouter.post("/", async (req, res) => {
  const b = req.body;
  const { rows } = await pool.query(
    `INSERT INTO perfumes (
      slug, nombre, marca, genero, familia_olfativa, notas_salida, notas_corazon, notas_fondo,
      precio_referencia, moneda, categoria_precio, imagen_url, link_afiliado, descripcion_corta, estado
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
    RETURNING *`,
    [
      b.slug, b.nombre, b.marca, b.genero, b.familia_olfativa,
      b.notas_salida ?? [], b.notas_corazon ?? [], b.notas_fondo ?? [],
      b.precio_referencia, b.moneda, b.categoria_precio,
      b.imagen_url ?? "", b.link_afiliado ?? "", b.descripcion_corta ?? null,
      b.estado ?? "borrador",
    ],
  );
  await logActivity(`Se creó el perfume "${rows[0].nombre}"`);
  res.status(201).json(rows[0]);
});

// ---------- Actualizar ----------
adminPerfumesRouter.patch("/:id", async (req, res) => {
  const b = req.body;
  const fields = [
    "nombre", "marca", "genero", "familia_olfativa", "notas_salida", "notas_corazon",
    "notas_fondo", "precio_referencia", "moneda", "categoria_precio", "descripcion_corta",
    "estado", "longevidad", "estela", "proyeccion", "resena_sintetizada",
  ];

  const updates: string[] = [];
  const params: unknown[] = [];
  for (const field of fields) {
    if (field in b) {
      params.push(b[field]);
      updates.push(`${field} = $${params.length}`);
    }
  }
  if (updates.length === 0) return res.status(400).json({ error: "Nada para actualizar" });

  params.push(req.params.id);
  const { rows } = await pool.query(
    `UPDATE perfumes SET ${updates.join(", ")}, actualizado_en = now() WHERE id = $${params.length} RETURNING *`,
    params,
  );

  if (rows.length === 0) return res.status(404).json({ error: "Perfume no encontrado" });
  await logActivity(`Se actualizó el perfume "${rows[0].nombre}"`);
  res.json(rows[0]);
});

// ---------- Eliminar (soft-delete) ----------
adminPerfumesRouter.delete("/:id", async (req, res) => {
  const { rows } = await pool.query(
    "UPDATE perfumes SET activo = false, actualizado_en = now() WHERE id = $1 RETURNING id",
    [req.params.id],
  );
  if (rows.length === 0) return res.status(404).json({ error: "Perfume no encontrado" });
  res.json({ ok: true });
});

// ---------- Subida de imagen ----------
adminPerfumesRouter.post("/:id/image", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se recibió ninguna imagen" });

  const imagenUrl = `/uploads/perfumes/${req.file.filename}`;
  const { rows } = await pool.query(
    "UPDATE perfumes SET imagen_url = $1, actualizado_en = now() WHERE id = $2 RETURNING imagen_url",
    [imagenUrl, req.params.id],
  );
  if (rows.length === 0) return res.status(404).json({ error: "Perfume no encontrado" });
  res.json(rows[0]);
});

// ---------- Retailers ----------
adminPerfumesRouter.post("/:id/retailers", async (req, res) => {
  const b = req.body;
  const { rows } = await pool.query(
    `INSERT INTO retailers (perfume_id, nombre, detalle, precio, moneda, link_afiliado, orden)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [req.params.id, b.nombre, b.detalle ?? null, b.precio, b.moneda, b.link_afiliado, b.orden ?? 0],
  );
  res.status(201).json(rows[0]);
});

adminPerfumesRouter.patch("/:id/retailers/:retailerId", async (req, res) => {
  const b = req.body;
  const fields = ["nombre", "detalle", "precio", "moneda", "link_afiliado", "orden", "activo"];
  const updates: string[] = [];
  const params: unknown[] = [];
  for (const field of fields) {
    if (field in b) {
      params.push(b[field]);
      updates.push(`${field} = $${params.length}`);
    }
  }
  if (updates.length === 0) return res.status(400).json({ error: "Nada para actualizar" });

  params.push(req.params.retailerId, req.params.id);
  const { rows } = await pool.query(
    `UPDATE retailers SET ${updates.join(", ")}, actualizado_en = now()
     WHERE id = $${params.length - 1} AND perfume_id = $${params.length} RETURNING *`,
    params,
  );
  if (rows.length === 0) return res.status(404).json({ error: "Retailer no encontrado" });
  res.json(rows[0]);
});

adminPerfumesRouter.delete("/:id/retailers/:retailerId", async (req, res) => {
  const { rows } = await pool.query(
    "DELETE FROM retailers WHERE id = $1 AND perfume_id = $2 RETURNING id",
    [req.params.retailerId, req.params.id],
  );
  if (rows.length === 0) return res.status(404).json({ error: "Retailer no encontrado" });
  res.json({ ok: true });
});
