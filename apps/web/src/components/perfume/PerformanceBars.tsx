"use client";

import { useEffect, useState } from "react";

export function PerformanceBarsSkeleton() {
  return <section className="min-h-[260px] animate-pulse border-y border-line bg-soft" aria-busy="true" />;
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

export function PerformanceBars({ longevidad, estela, proyeccion }: { longevidad?: number; estela?: number; proyeccion?: number }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const metrics = ([
    ["longevidad", longevidad],
    ["estela", estela],
    ["proyeccion", proyeccion],
  ] as const).filter(([, valor]) => valor != null) as Array<[keyof typeof METRIC_LABELS, number]>;

  if (metrics.length === 0) {
    return (
      <section className="border-y border-line py-10">
        <p className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">Rendimiento en piel</p>
        <p className="mt-4 font-display text-3xl italic text-muted">Datos de desempeño en preparación.</p>
      </section>
    );
  }

  return (
    <section role="img" aria-label={metrics.map(([key, valor]) => `${METRIC_LABELS[key]}: ${valor} de 10`).join(", ")}>
      <div className="flex flex-col border-t border-line">
        {metrics.map(([key, valor], index) => (
          <div key={key} className="grid grid-cols-[40px_1fr] gap-4 border-b border-line py-6 sm:grid-cols-[44px_150px_1fr_auto] sm:items-center lg:py-7">
            <span className="font-plex text-[9px] tracking-[.14em] text-gold-contrast">0{index + 1}</span>
            <div>
              <p className="font-display text-[25px] italic text-ink">{METRIC_LABELS[key]}</p>
              <p className="mt-1 font-plex text-[8px] uppercase tracking-[.14em] text-muted">{nivelDescripcion(valor)}</p>
            </div>
            <div className="col-start-2 mt-2 h-px bg-line sm:col-start-auto sm:mt-0">
              <div className="h-px bg-gold-contrast transition-[width] duration-[1200ms] ease-out" style={{ width: ready ? `${Math.min(valor, 10) * 10}%` : "0%" }} />
            </div>
            <span className="col-start-2 font-display text-[30px] leading-none text-ink sm:col-start-auto">{valor.toFixed(1)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
