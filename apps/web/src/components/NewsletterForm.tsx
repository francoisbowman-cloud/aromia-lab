"use client";

import { useState } from "react";
import { subscribe } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";

export function NewsletterForm({ fuente, mensajeExito = "Listo — te avisamos cuando haya bajadas de precio y contenido nuevo." }: { fuente: "home" | "quiz" | "club"; mensajeExito?: string }) {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    const ok = await subscribe(email, fuente);
    setEstado(ok ? "ok" : "error");
    if (ok) { trackEvent("newsletter_signup", { fuente }); setEmail(""); }
  }

  if (estado === "ok") {
    return <p className="border-y border-line py-5 font-sans text-sm leading-6 text-ink">{mensajeExito}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 border-y border-line sm:grid-cols-[1fr_auto]">
      <label className="sr-only" htmlFor={`newsletter-${fuente}`}>Correo electrónico</label>
      <input id={`newsletter-${fuente}`} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className="min-h-14 border-0 border-b border-line bg-transparent px-1 font-sans text-sm text-ink outline-none placeholder:text-muted focus:bg-soft/40 sm:border-b-0 sm:border-r sm:px-4" />
      <button type="submit" disabled={estado === "enviando"} className="min-h-14 px-6 font-plex text-[9px] uppercase tracking-[.16em] text-ink transition hover:bg-soft hover:text-gold-contrast disabled:opacity-50">{estado === "enviando" ? "Enviando…" : "Avísame →"}</button>
      {estado === "error" ? <p className="border-t border-line px-1 py-3 font-sans text-xs text-admin-danger sm:col-span-2 sm:px-4">No se pudo suscribir. Intenta de nuevo en un momento.</p> : null}
    </form>
  );
}
