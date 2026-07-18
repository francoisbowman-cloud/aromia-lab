"use client";

import { useState } from "react";
import { subscribe } from "@/lib/api";

export function NewsletterForm({ fuente }: { fuente: "home" | "quiz" }) {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    const ok = await subscribe(email, fuente);
    setEstado(ok ? "ok" : "error");
    if (ok) setEmail("");
  }

  if (estado === "ok") {
    return (
      <p className="font-sans text-sm text-ink">
        Listo — te avisamos cuando haya bajadas de precio y contenido nuevo.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        className="flex-1 rounded-full border border-line bg-surface px-5 py-3 font-sans text-sm text-ink outline-none focus:border-gold"
      />
      <button
        type="submit"
        disabled={estado === "enviando"}
        className="rounded-full bg-gold-contrast px-6 py-3 font-sans text-[12px] font-semibold uppercase tracking-[.08em] text-white transition hover:brightness-105 disabled:opacity-50"
      >
        {estado === "enviando" ? "Enviando…" : "Avísame"}
      </button>
      {estado === "error" ? (
        <p className="font-sans text-xs text-admin-danger sm:basis-full">
          No se pudo suscribir. Intenta de nuevo en un momento.
        </p>
      ) : null}
    </form>
  );
}
