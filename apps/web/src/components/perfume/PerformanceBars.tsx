"use client";

import { useEffect, useState } from "react";

export function PerformanceBarsSkeleton() {
  return (
    <section className="rounded-card border border-line bg-surface p-7" aria-busy="true">
      <div className="flex flex-col gap-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-3 w-24 animate-pulse rounded bg-soft" />
            <div className="h-1.5 w-full animate-pulse rounded-full bg-soft" />
          </div>
        ))}
      </div>
    </section>
  );
}

const METRIC_LABELS: Record<string, string> = {
  longevidad: "Longevidad",
  estela: "Estela",
  proyeccion: "Proyección",
};

function nivelDescripcion(valor: number): string {
  if (valor >= 8) return "Muy alta";
  if (valor >= 6) return "Alta";
  if (valor >= 4) return "Moderada";
  return "Ligera";
}

export function PerformanceBars({
  longevidad,
  estela,
  proyeccion,
}: {
  longevidad?: number;
  estela?: number;
  proyeccion?: number;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const metrics = (
    [
      ["longevidad", longevidad],
      ["estela", estela],
      ["proyeccion", proyeccion],
    ] as const
  ).filter(([, valor]) => valor != null) as Array<[keyof typeof METRIC_LABELS, number]>;

  if (metrics.length === 0) {
    return (
      <section className="rounded-card border border-line bg-surface p-7 text-center">
        <p className="font-sans text-xs uppercase tracking-[.14em] text-gold-contrast">
          Rendimiento en piel
        </p>
        <p className="mt-3 font-sans text-sm text-muted">Aún sin datos de desempeño.</p>
      </section>
    );
  }

  return (
    <section
      className="rounded-card border border-line bg-surface p-7"
      role="img"
      aria-label={metrics
        .map(([key, valor]) => `${METRIC_LABELS[key]}: ${valor} de 10`)
        .join(", ")}
    >
      <p className="font-sans text-xs uppercase tracking-[.14em] text-gold-contrast">
        Rendimiento en piel
      </p>
      <div className="mt-6 flex flex-col gap-5">
        {metrics.map(([key, valor]) => (
          <div key={key}>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="font-sans text-sm text-ink">{METRIC_LABELS[key]}</span>
              <span className="font-sans text-xs text-muted">{nivelDescripcion(valor)}</span>
            </div>
            <div className="relative h-1.5 overflow-hidden rounded-full bg-gold/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-contrast to-gold transition-[width] duration-[1200ms] ease-out"
                style={{ width: ready ? `${valor * 10}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
