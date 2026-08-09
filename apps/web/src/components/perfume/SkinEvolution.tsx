"use client";

import { useState } from "react";

interface Stage {
  key: "salida" | "corazon" | "fondo";
  label: string;
  tiempo: string;
  descripcion: string;
  notas?: string[];
}

function buildStages(notasSalida?: string[], notasCorazon?: string[], notasFondo?: string[]): Stage[] {
  return [
    { key: "salida", label: "Salida", tiempo: "0 – 15 min", descripcion: "La primera impresión: volátil y luminosa. Dura poco, pero define el encuentro y abre la puerta a todo lo demás.", notas: notasSalida },
    { key: "corazon", label: "Corazón", tiempo: "15 min – 3 h", descripcion: "El alma de la fragancia. Emerge cuando la salida se disipa y marca el carácter que vas a recordar.", notas: notasCorazon },
    { key: "fondo", label: "Fondo", tiempo: "3 – 10 h+", descripcion: "La huella. Moléculas pesadas que fijan el perfume a la piel y construyen su estela durante horas.", notas: notasFondo },
  ];
}

export function SkinEvolutionSkeleton() {
  return <section className="min-h-[280px] animate-pulse border-y border-line bg-soft" aria-busy="true" />;
}

export function SkinEvolution({ notasSalida, notasCorazon, notasFondo }: { notasSalida?: string[]; notasCorazon?: string[]; notasFondo?: string[] }) {
  const stages = buildStages(notasSalida, notasCorazon, notasFondo);
  const [activeKey, setActiveKey] = useState<Stage["key"]>("corazon");
  const active = stages.find((s) => s.key === activeKey)!;

  return (
    <section>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[.68fr_1.32fr] lg:gap-16">
        <div>
          <p className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">Evolución sobre piel</p>
          <h3 className="mt-4 max-w-[10ch] font-display text-[42px] font-medium leading-[.94] tracking-[-.03em] text-ink lg:text-[58px]">El perfume cambia mientras lo llevas.</h3>
          <p className="mt-6 max-w-[34ch] font-sans text-sm leading-6 text-muted">Selecciona un momento para leer cómo funciona esa fase de la pirámide y qué notas reales aparecen en esta ficha.</p>
        </div>

        <div className="border-t border-line">
          {stages.map((stage, index) => {
            const activeStage = activeKey === stage.key;
            return (
              <button key={stage.key} type="button" onClick={() => setActiveKey(stage.key)} className="grid w-full grid-cols-[38px_1fr_auto] items-center gap-4 border-b border-line py-5 text-left outline-none transition hover:text-gold-contrast focus-visible:ring-2 focus-visible:ring-gold">
                <span className="font-plex text-[9px] tracking-[.14em] text-gold-contrast">0{index + 1}</span>
                <span>
                  <span className={`block font-display text-[28px] italic leading-none transition-colors ${activeStage ? "text-gold-contrast" : "text-ink"}`}>{stage.label}</span>
                  <span className="mt-2 block font-plex text-[8px] uppercase tracking-[.14em] text-muted">{stage.tiempo}</span>
                </span>
                <span className="font-display text-2xl text-muted" aria-hidden="true">{activeStage ? "—" : "+"}</span>
              </button>
            );
          })}

          <div className="grid grid-cols-1 gap-8 py-8 sm:grid-cols-[.8fr_1.2fr]">
            <p className="font-sans text-sm leading-7 text-muted">{active.descripcion}</p>
            <div>
              <p className="font-plex text-[8px] uppercase tracking-[.15em] text-muted">Notas en esta fase</p>
              <div className="mt-4 flex flex-col border-t border-line">
                {active.notas?.length ? active.notas.map((nota, index) => (
                  <div key={`${nota}-${index}`} className="flex items-baseline gap-3 border-b border-line py-3">
                    <span className="font-plex text-[8px] text-gold-contrast">{String(index + 1).padStart(2, "0")}</span>
                    <span className="font-display text-[22px] italic text-ink">{nota}</span>
                  </div>
                )) : <p className="py-4 font-sans text-sm text-muted">Notas no especificadas.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
