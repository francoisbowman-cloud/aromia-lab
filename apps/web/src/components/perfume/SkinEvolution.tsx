"use client";

import { useState } from "react";

interface Stage {
  key: "salida" | "corazon" | "fondo";
  label: string;
  notas?: string[];
}

export function SkinEvolutionSkeleton() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3" aria-busy="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="min-h-[190px] animate-pulse rounded-card bg-soft p-7" />
      ))}
    </section>
  );
}

export function SkinEvolution({
  notasSalida,
  notasCorazon,
  notasFondo,
}: {
  notasSalida?: string[];
  notasCorazon?: string[];
  notasFondo?: string[];
}) {
  const [active, setActive] = useState<Stage["key"] | null>(null);

  const stages: Stage[] = [
    { key: "salida", label: "Salida", notas: notasSalida },
    { key: "corazon", label: "Corazón", notas: notasCorazon },
    { key: "fondo", label: "Fondo", notas: notasFondo },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stages.map((stage) => {
        const isDimmed = active !== null && active !== stage.key;
        return (
          <button
            key={stage.key}
            type="button"
            onMouseEnter={() => setActive(stage.key)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(stage.key)}
            onBlur={() => setActive(null)}
            className={`min-h-[190px] rounded-card border border-line bg-surface p-7 text-left transition motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              isDimmed ? "opacity-40" : "opacity-100"
            }`}
          >
            <p className="font-sans text-[11px] uppercase tracking-[.16em] text-gold-contrast">
              {stage.label}
            </p>
            <p className="mt-3 font-display text-lg text-ink">
              {stage.notas && stage.notas.length > 0
                ? stage.notas.join(", ")
                : "Notas no especificadas"}
            </p>
          </button>
        );
      })}
    </section>
  );
}
