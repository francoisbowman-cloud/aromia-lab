import { Router } from "express";
import { pool } from "../db/pool";
import { asyncHandler } from "../lib/asyncHandler";

export const subscribersRouter = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

subscribersRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { email, fuente } = req.body as { email?: string; fuente?: string };

    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }

    await pool.query(
      `INSERT INTO subscribers (email, fuente) VALUES ($1, $2)
       ON CONFLICT (email) DO NOTHING`,
      [email.toLowerCase().trim(), fuente === "quiz" ? "quiz" : "home"],
    );

    res.status(201).json({ ok: true });
  }),
);
