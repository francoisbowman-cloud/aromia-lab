"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { EditorialIndexItem } from "@/lib/editorialIndex";
import { VisualField, EDITORIAL_V1_SLOTS } from "@/app/(editorial)/editorialVisuals";

const FILTERS = ["Todas", "Historias", "Materia", "Personas", "Reflexión", "Guías", "Análisis"] as const;
type Filter = (typeof FILTERS)[number];

/**
 * M3 / M4 — story-owned lead visuals and a sparse image rhythm.
 *
 * The archive never invents a visual. An item shows an image only when it maps
 * to a previously approved story slot in `EDITORIAL_V1_SLOTS`. Everything else
 * stays text-first, and two different stories never place their images against
 * each other.
 */
const ARCHIVE_STORY_VISUALS: Record<string, string> = {
  "el-coleccionista": "coleccionista-shelf-interpretive",
  "el-perfume-que-encargo-un-sultan": "amouage-material-density-interpretive",
  "el-ambar-que-nunca-toco-una-ballena": "ambroxan-material-interpretive",
  "el-perfumista-que-no-teme-exagerar": "ropion-overdose-interpretive",
};

/** Minimum number of rows between two image-bearing rows (M4). */
const IMAGE_RHYTHM_GAP = 3;

function slotFor(slug: string): string | undefined {
  const id = ARCHIVE_STORY_VISUALS[slug];
  return id && EDITORIAL_V1_SLOTS[id]?.present ? id : undefined;
}

export function EditorialArchive({ items }: { items: EditorialIndexItem[] }) {
  const [active, setActive] = useState<Filter>("Todas");
  const filtered = useMemo(() => active === "Todas" ? items : items.filter((item) => item.territory === active), [active, items]);
  const lead = filtered[0];
  const rest = filtered.slice(1);

  const leadSlot = lead ? slotFor(lead.slug) : undefined;

  // Decide which rest rows carry an image: only mapped items, spaced out, and
  // never in the first row when the lead already shows one (no image↔image
  // adjacency between unrelated stories).
  const restVisuals = useMemo(() => {
    const out: (string | undefined)[] = [];
    // Row 0 is the lead; rest rows are 1-indexed from there.
    let lastImageRow = leadSlot ? 0 : -IMAGE_RHYTHM_GAP;
    rest.forEach((item, index) => {
      const row = index + 1;
      const slot = slotFor(item.slug);
      if (slot && row - lastImageRow >= IMAGE_RHYTHM_GAP) {
        out[index] = slot;
        lastImageRow = row;
      } else {
        out[index] = undefined;
      }
    });
    return out;
  }, [rest, leadSlot]);

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
          <Link href={lead.href} className={`group grid gap-8 border-b border-line pb-14 lg:items-end lg:pb-20 ${leadSlot ? "lg:grid-cols-[1.35fr_.9fr]" : "lg:grid-cols-[1.1fr_.9fr]"}`}>
            {leadSlot ? (
              <VisualField slotId={leadSlot} className="relative m-0 block aspect-[4/5] w-full overflow-hidden border border-line sm:aspect-[16/10] lg:aspect-[5/4]" sizes="(max-width: 1024px) 100vw, 58vw" />
            ) : null}
            <div>
              <div className="font-plex text-xs uppercase tracking-[.14em] text-gold-contrast">{lead.territory} · Lectura 01</div>
              <h2 className="mt-5 max-w-[13ch] font-display text-[48px] leading-[.92] tracking-[-.045em] text-ink transition group-hover:opacity-70 sm:text-[60px] lg:text-[74px]">{lead.title}</h2>
              <p className="mt-6 max-w-[44ch] font-sans text-base leading-7 text-muted">{lead.summary}</p>
              <span className="mt-6 inline-flex min-h-11 items-center border-b border-ink font-plex text-xs uppercase tracking-[.12em] text-ink">Leer historia →</span>
            </div>
          </Link>

          <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((item, index) => {
              const slot = restVisuals[index];
              return (
                <Link key={`${item.source}-${item.slug}`} href={item.href} className={`group border-b border-line py-12 ${index % 3 === 1 ? "lg:translate-y-8" : ""}`}>
                  <div className="flex items-center justify-between gap-4 font-plex text-xs uppercase tracking-[.12em] text-muted"><span>{item.territory}</span><span>{String(index + 2).padStart(2, "0")}</span></div>
                  {slot ? (
                    <VisualField slotId={slot} className="relative mx-0 mb-0 mt-7 block aspect-[3/2] w-full overflow-hidden border border-line" sizes="(max-width: 768px) 100vw, 33vw" />
                  ) : null}
                  <h3 className="mt-7 max-w-[12ch] font-display text-[34px] leading-[.96] tracking-[-.035em] text-ink transition group-hover:opacity-70 lg:text-[40px]">{item.title}</h3>
                  <p className="mt-5 max-w-[38ch] font-sans text-sm leading-6 text-muted">{item.summary}</p>
                  <span className="mt-6 inline-flex min-h-11 items-center font-plex text-xs uppercase tracking-[.12em] text-gold-contrast">Continuar →</span>
                </Link>
              );
            })}
          </div>
        </>}
      </section>
    </div>
  );
}
