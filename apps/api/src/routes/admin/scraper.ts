import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { runPriceSync } from "../../scraper/runner";

export const adminScraperRouter = Router();

// Disparo manual para probar el sync sin esperar al cron diario — útil
// para validar credenciales/feed nuevos antes de dejarlos correr solos.
adminScraperRouter.post(
  "/run",
  asyncHandler(async (_req, res) => {
    const results = await runPriceSync();
    res.json({ ok: true, results });
  }),
);
