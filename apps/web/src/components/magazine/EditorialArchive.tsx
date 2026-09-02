"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { EditorialIndexItem } from "@/lib/editorialIndex";

const FILTERS = ["Todas", "Historias", "Materia", "Personas", "Reflexión", "Guías", "Análisis"] as const;
type Filter = (typeof FILTERS)[number];

export function EditorialArchive({ items }: { items: EditorialIndexItem[] }) {
  const [active, setActive] = useState<Filter>("Todas");
  const filtered = useMemo(() => active === "Todas" ? items : items.filter((item) => item.territory === active), [active, items]);
  const lead = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="mx-auto max-w-[1520px] px-5 pb-10 pt-12 sm:px-8 lg:px-12 lg:pb-14 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.12fr_.88fr] lg:items-end">
          <div>
            <p className="font-plex text-xs uppercase tracking-[.16em] text-gold-contrast">Archivo Aromia</p>
            <h1 className="mt-4 font-display text-[58px] font-medium leading-[.86] tracking-[-.055em] sm:text-[78px] lg:text-[104px]">Historias</h1>
            <p className="mt-6 max-w-[27ch] font-display text-[27px] leading-[1.08] tracking-[-.02em] text-muted sm:text-[32px]">Todo lo publicado, sin separar la portada del resto de la revista.</p>
          </div>
          <p className="max-w-[43ch] font-sans text-base leading-7 text-muted lg:justify-self-end">Perfumes, materias, personas, guías y reflexiones viven en el mismo archivo. La ruta cambia; la conversación continúa.</p>
        </div>
      </header>

      <div className="sticky top-[68px] z-20 border-y border-line bg-[var(--aromia-chrome-bg)] backdrop-blur-md">
        <div className="mx-auto flex max-w-[1520px] gap-6 overflow-x-auto px-5 sm:px-8 lg:px-12">
          {FILTERS.map((filter) => <button key={filter} type="button" onClick={() => setActive(filter)} aria-pressed={active === filter} className={`min-h-12 whitespace-nowrap border-b font-plex text-xs uppercase tracking-[.12em] transition ${active === filter ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"}`}>{filter}</button>)}
        </div>
      </div>

      <section className="mx-auto max-w-[1520px] px-5 pb-28 pt-10 sm:px-8 lg:px-12 lg:pt-14">
        {!lead ? <div className="flex min-h-[320px] items-center justify-center border-y border-line"><p className="font-sans text-sm text-muted">Todavía no hay historias en este territorio.</p></div> : <>
          <Link href={lead.href} className="group grid gap-8 border-b border-line pb-14 lg:grid-cols-[1.1fr_.9fr] lg:items-end lg:pb-20">
            <div>
              <div className="font-plex text-xs uppercase tracking-[.14em] text-gold-contrast">{lead.territory} · Lectura 01</div>
              <h2 className="mt-5 max-w-[13ch] font-display text-[48px] leading-[.92] tracking-[-.045em] text-ink transition group-hover:opacity-70 sm:text-[60px] lg:text-[74px]">{lead.title}</h2>
            </div>
            <div className="lg:justify-self-end"><p className="max-w-[44ch] font-sans text-base leading-7 text-muted">{lead.summary}</p><span className="mt-6 inline-flex min-h-11 items-center border-b border-ink font-plex text-xs uppercase tracking-[.12em] text-ink">Leer historia →</span></div>
          </Link>

          <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((item, index) => <Link key={`${item.source}-${item.slug}`} href={item.href} className={`group border-b border-line py-12 ${index % 3 === 1 ? "lg:translate-y-8" : ""}`}>
              <div className="flex items-center justify-between gap-4 font-plex text-xs uppercase tracking-[.12em] text-muted"><span>{item.territory}</span><span>{String(index + 2).padStart(2, "0")}</span></div>
              <h3 className="mt-7 max-w-[12ch] font-display text-[34px] leading-[.96] tracking-[-.035em] text-ink transition group-hover:opacity-70 lg:text-[40px]">{item.title}</h3>
              <p className="mt-5 max-w-[38ch] font-sans text-sm leading-6 text-muted">{item.summary}</p>
              <span className="mt-6 inline-flex min-h-11 items-center font-plex text-xs uppercase tracking-[.12em] text-gold-contrast">Continuar →</span>
            </Link>)}
          </div>
        </>}
      </section>
    </div>
  );
}
