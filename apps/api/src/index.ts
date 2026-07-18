import "dotenv/config";
import cors from "cors";
import express from "express";
import { join } from "node:path";
import { redis } from "./redis/client";
import { perfumesRouter } from "./routes/perfumes";
import { adminPerfumesRouter } from "./routes/admin/perfumes";
import { adminDashboardRouter } from "./routes/admin/dashboard";
import { adminArticlesRouter } from "./routes/admin/articles";
import { adminAuth } from "./middleware/adminAuth";

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

app.get("/api/admin/ping", adminAuth, (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/admin/perfumes", adminAuth, adminPerfumesRouter);
app.use("/api/admin/dashboard", adminAuth, adminDashboardRouter);
app.use("/api/admin/articles", adminAuth, adminArticlesRouter);

app.listen(port, () => {
  console.log(`API de Aromia escuchando en http://localhost:${port}`);
});
