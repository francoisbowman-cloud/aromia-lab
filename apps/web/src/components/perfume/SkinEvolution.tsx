"use client";

import { useState } from "react";
import Link from "next/link";
import { publicNotes } from "@/lib/catalogDisplay";

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
    { key: "salida", label: "Salida", tiempo: "0 – 15 min", descripcion: "La primera impresión: volátil y luminosa. Dura poco, pero define el encuentro y abre la puerta a todo lo demás.", ancho: "45%", notas: publicNotes(notasSalida) },
    { key: "corazon", label: "Corazón", tiempo: "15 min – 3 h", descripcion: "El alma de la fragancia. Emerge cuando la salida se disipa y marca el carácter que vas a recordar.", ancho: "72%", notas: publicNotes(notasCorazon) },
    { key: "fondo", label: "Fondo", tiempo: "3 – 10 h+", descripcion: "La huella. Moléculas pesadas que fijan el perfume a la piel y construyen su estela durante horas.", ancho: "100%", notas: publicNotes(notasFondo) },
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
    <div className="mb-6 flex items-baseline justify-between"><div><p className="font-sans text-[11px] uppercase tracking-[.2em] text-gold-contrast">Pirámide olfativa</p><h3 className="mt-2 font-display text-xl font-semibold text-ink">Cómo evoluciona en tu piel</h3></div><span className="hidden font-sans text-[11px] text-muted sm:inline">Tocá cada nivel ↓</span></div>
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2"><div className="flex flex-col items-center gap-2.5">{[...stages].reverse().map((stage)=><button key={stage.key} type="button" onClick={()=>setActiveKey(stage.key)} style={{width:stage.ancho}} className={`rounded-[2px] border px-4 py-3.5 text-center font-sans transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${activeKey===stage.key?"border-gold bg-gold-contrast text-primary-foreground":"border-line bg-surface text-ink hover:border-gold"}`}><div className="text-[13px] uppercase tracking-[.08em]">{stage.label}</div><div className="mt-0.5 text-[11px] opacity-70">{stage.tiempo}</div></button>)}</div>
      <div><div className="font-display text-2xl leading-tight text-ink">{active.label}</div><p className="mt-1 font-sans text-[11px] uppercase tracking-[.14em] text-gold-contrast">{active.tiempo}</p><p className="mt-3 font-sans text-sm leading-relaxed text-muted">{active.descripcion}</p><div className="mt-4 flex flex-wrap gap-2">{active.notas&&active.notas.length>0?active.notas.map((nota)=><Link key={nota} href={`/buscar?q=${encodeURIComponent(nota)}`} className="rounded-full border border-line bg-soft px-3.5 py-1.5 font-sans text-[12.5px] text-ink transition hover:border-gold hover:text-gold-contrast">{nota} ↗</Link>):<span className="font-sans text-sm text-muted">Sin desglose verificado por fase.</span>}</div></div>
    </div>
  </section>;
}
