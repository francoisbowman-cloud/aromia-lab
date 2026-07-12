import "dotenv/config";
import cors from "cors";
import express from "express";
import { redis } from "./redis/client";
import { perfumesRouter } from "./routes/perfumes";

const app = express();
const port = process.env.PORT ?? 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json());

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

app.listen(port, () => {
  console.log(`API de Aromia escuchando en http://localhost:${port}`);
});
