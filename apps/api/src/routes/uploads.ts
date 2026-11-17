import { Router } from "express";
import { pool } from "../db/pool";
import { asyncHandler } from "../lib/asyncHandler";

export const uploadsRouter = Router();
uploadsRouter.get("/:kind/:filename", asyncHandler(async (req, res, next) => {
  if (!["articles", "perfumes"].includes(req.params.kind)) return res.sendStatus(404);
  const { rows } = await pool.query("SELECT content_type, bytes FROM media_uploads WHERE filename = $1 AND kind = $2", [req.params.filename, req.params.kind]);
  if (!rows.length) return next(); // Preserve any existing filesystem uploads.
  res.set({ "Content-Type": rows[0].content_type, "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" });
  res.send(rows[0].bytes);
}));
