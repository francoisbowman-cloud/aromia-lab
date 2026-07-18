import { Router } from "express";
import { pool } from "../db/pool";
import { asyncHandler } from "../lib/asyncHandler";
import { sendWelcomeEmail } from "../lib/email";

export const subscribersRouter = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

subscribersRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { email, fuente } = req.body as { email?: string; fuente?: string };

    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const result = await pool.query(
      `INSERT INTO subscribers (email, fuente) VALUES ($1, $2)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [normalizedEmail, fuente === "quiz" ? "quiz" : "home"],
    );

    if (result.rowCount) {
      try {
        await sendWelcomeEmail(normalizedEmail);
      } catch (err) {
        console.error("Error enviando email de bienvenida:", err);
      }
    }

    res.status(201).json({ ok: true });
  }),
);
