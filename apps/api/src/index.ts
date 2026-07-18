import "dotenv/config";
import cors from "cors";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import { join } from "node:path";
import { redis } from "./redis/client";
import { perfumesRouter } from "./routes/perfumes";
import { articlesRouter } from "./routes/articles";
import { subscribersRouter } from "./routes/subscribers";
import { adminPerfumesRouter } from "./routes/admin/perfumes";
import { adminDashboardRouter } from "./routes/admin/dashboard";
import { adminArticlesRouter } from "./routes/admin/articles";
import { adminScraperRouter } from "./routes/admin/scraper";
import { adminAuth } from "./middleware/adminAuth";
import { startPriceSyncCron } from "./scraper/runner";

// Sin esto, un error no capturado en cualquier parte del proceso (fuera de
// una ruta Express) mata el proceso en silencio, sin log — Railway solo ve
// el contenedor caerse, sin motivo.
process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("unhandledRejection:", reason);
});

const app = express();
const port = process.env.PORT ?? 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json());
app.use("/uploads", express.static(join(__dirname, "..", "uploads")));

app.get("/health", async (_req, res) => {
  let redisOk = true;
  try {
    if (redis.status !== "ready") await redis.connect();
    await redis.ping();
  } catch {
    redisOk = false;
  }
  res.json({ ok: true, redis: redisOk });
});

app.use("/api/perfumes", perfumesRouter);
app.use("/api/articulos", articlesRouter);
app.use("/api/subscribers", subscribersRouter);

app.get("/api/admin/ping", adminAuth, (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/admin/perfumes", adminAuth, adminPerfumesRouter);
app.use("/api/admin/dashboard", adminAuth, adminDashboardRouter);
app.use("/api/admin/articles", adminAuth, adminArticlesRouter);
app.use("/api/admin/scraper", adminAuth, adminScraperRouter);

// Middleware de error — último `app.use`, recibe todo lo que los handlers
// pasan a `next(err)` (incluido lo que atrapa asyncHandler). Sin esto, un
// error de query a Postgres deja el request colgado sin respuesta ni log.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error no manejado en request:", err);
  if (res.headersSent) return;
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(port, () => {
  console.log(`API de Aromia escuchando en http://localhost:${port}`);
  startPriceSyncCron();
});
