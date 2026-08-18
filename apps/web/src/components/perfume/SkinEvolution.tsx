"use client";

import { useState } from "react";
import Link from "next/link";
import { publicNotes } from "@/lib/catalogDisplay";
import { trackEvent } from "@/lib/analytics";

interface Stage {
  key: "salida" | "corazon" | "fondo";
  label: string;
  tiempo: string;
  descripcion: string;
  ancho: string;
  notas?: string[];
}

function buildStages(notasSalida?: string[], notasCorazon?: string[], notasFondo?: string[]): Stage[] {
  return [
    { key: "salida", label: "Salida", tiempo: "0 – 15 min", descripcion: "La primera impresión: volátil y luminosa. Dura poco, pero abre la evolución del perfume.", ancho: "45%", notas: publicNotes(notasSalida) },
    { key: "corazon", label: "Corazón", tiempo: "15 min – 3 h", descripcion: "El centro de la fragancia. Aparece cuando la salida se disipa y define gran parte de su carácter.", ancho: "72%", notas: publicNotes(notasCorazon) },
    { key: "fondo", label: "Fondo", tiempo: "3 – 10 h+", descripcion: "La huella final. Sus materiales más persistentes sostienen el perfume sobre la piel durante horas.", ancho: "100%", notas: publicNotes(notasFondo) },
  ];
}

export function SkinEvolutionSkeleton() {
  return <section className="grid grid-cols-1 gap-6 rounded-card border border-line bg-surface p-7 md:grid-cols-2" aria-busy="true"><div className="flex flex-col items-center gap-2">{[0,1,2].map((i)=><div key={i} className="h-12 w-full animate-pulse rounded bg-soft"/>)}</div><div className="h-32 animate-pulse rounded bg-soft"/></section>;
}

export function SkinEvolution({ notasSalida, notasCorazon, notasFondo }: { notasSalida?: string[]; notasCorazon?: string[]; notasFondo?: string[] }) {
  const stages = buildStages(notasSalida, notasCorazon, notasFondo);
  const [activeKey, setActiveKey] = useState<Stage["key"]>("corazon");
  const active = stages.find((s) => s.key === activeKey)!;
  return <section className="rounded-card border border-line bg-surface p-7 lg:p-8">
    <div className="mb-6 flex items-baseline justify-between gap-5"><div><p className="font-sans text-xs uppercase tracking-[.14em] text-gold-contrast">Pirámide olfativa</p><h3 className="mt-2 font-display text-xl font-semibold text-ink">Cómo evoluciona en tu piel</h3></div><span className="hidden font-sans text-xs text-muted sm:inline">Selecciona un nivel ↓</span></div>
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2"><div className="flex flex-col items-center gap-2.5">{[...stages].reverse().map((stage)=><button key={stage.key} type="button" onClick={()=>{setActiveKey(stage.key);trackEvent("olfactory_connection_click",{stage:stage.key});}} style={{width:stage.ancho}} className={`min-h-11 rounded-[2px] border px-4 py-3.5 text-center font-sans transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${activeKey===stage.key?"border-gold bg-gold-contrast text-primary-foreground":"border-line bg-surface text-ink hover:border-gold"}`}><div className="text-sm uppercase tracking-[.06em]">{stage.label}</div><div className="mt-1 text-xs opacity-75">{stage.tiempo}</div></button>)}</div>
      <div><div className="font-display text-2xl leading-tight text-ink">{active.label}</div><p className="mt-1 font-sans text-xs uppercase tracking-[.12em] text-gold-contrast">{active.tiempo}</p><p className="mt-3 font-sans text-sm leading-relaxed text-muted">{active.descripcion}</p><div className="mt-4 flex flex-wrap gap-2">{active.notas&&active.notas.length>0?active.notas.map((nota)=><Link key={nota} href={`/buscar?q=${encodeURIComponent(nota)}`} onClick={()=>trackEvent("olfactory_note_open",{note:nota,stage:active.key})} className="inline-flex min-h-11 items-center rounded-full border border-line bg-soft px-3.5 font-sans text-sm text-ink transition hover:border-gold hover:text-gold-contrast">{nota} ↗</Link>):<span className="font-sans text-sm text-muted">Sin desglose verificado por fase.</span>}</div></div>
    </div>
  </section>;
}
