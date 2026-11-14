import multer from "multer";
import type { RequestHandler } from "express";
import { randomUUID } from "node:crypto";
import { pool } from "../db/pool";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
const receive = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_IMAGE_BYTES, files: 1 } }).single("image");

export function matchesImageSignature(buffer: Buffer, mime: string): boolean {
  if (mime === "image/png") return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if (mime === "image/jpeg") return buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255;
  if (mime === "image/webp") return buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  return false;
}

export const receiveImage: RequestHandler = (req, res, next) => {
  receive(req, res, (error) => {
    if (error) {
      return res.status(error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({ error: "No se pudo recibir la imagen (máximo 5MB)" });
    }
    if (!req.file) return res.status(400).json({ error: "No se recibió ninguna imagen" });
    if (!EXTENSIONS[req.file.mimetype] || !matchesImageSignature(req.file.buffer, req.file.mimetype)) {
      return res.status(415).json({ error: "La imagen debe ser PNG, JPG o WEBP" });
    }
    next();
  });
};

export async function storeEntityImage(kind: "articles" | "perfumes", id: string, file: Express.Multer.File, og = false) {
  const field = kind === "perfumes" ? "imagen_url" : og ? "imagen_og_url" : "imagen_portada_url";
  const filename = `${randomUUID()}.${EXTENSIONS[file.mimetype]}`;
  const url = `/uploads/${kind}/${filename}`;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(`UPDATE ${kind} SET ${field} = $1, actualizado_en = now() WHERE id = $2 RETURNING ${field}`, [url, id]);
    if (!rows.length) { await client.query("ROLLBACK"); return null; }
    await client.query("INSERT INTO media_uploads (filename, kind, content_type, bytes) VALUES ($1, $2, $3, $4)", [filename, kind, file.mimetype, file.buffer]);
    await client.query("COMMIT");
    return rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
}
