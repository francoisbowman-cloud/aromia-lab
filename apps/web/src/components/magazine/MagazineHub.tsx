"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Article } from "@/lib/types";
import { MAGAZINE_TABS } from "@/lib/magazineCategories";
import { MagazineCategoryNav } from "./MagazineCategoryNav";
import { MagazineCoverStory } from "./MagazineCoverStory";
import { MagazineSecondaryStory } from "./MagazineSecondaryStory";

export function MagazineHub({ articulos }: { articulos: Article[] }) {
  const [activeKey, setActiveKey] = useState("todos");
  const coverRef = useRef<HTMLAnchorElement>(null);

  const filtered = useMemo(() => {
    const tab = MAGAZINE_TABS.find((t) => t.key === activeKey);
    if (!tab || tab.categorias === null) return articulos;
    return articulos.filter((a) => tab.categorias!.includes(a.categoria));
  }, [articulos, activeKey]);

  const cover = filtered[0];
  const secondary = filtered.slice(1, 4);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    coverRef.current?.focus();
  }, [activeKey]);

  return (
    <div className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]">
      <header className="mx-auto max-w-[1440px] px-6 pb-8 pt-10 lg:px-10 lg:pb-10 lg:pt-14">
        <div className="flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.2em] text-muted"><span>Aromia Magazine</span><span className="h-px flex-1 bg-line"/><span>Journal de parfum</span></div>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_.6fr] lg:items-end">
          <div><p className="font-plex text-[9px] uppercase tracking-[.22em] text-gold-contrast">Editorial / historias 04</p><h1 className="mt-4 max-w-[11ch] font-display text-[52px] font-medium leading-[.9] tracking-[-.04em] text-ink lg:text-[86px]">Historias para oler con más contexto.</h1></div>
          <p className="max-w-[42ch] font-sans text-[15px] leading-7 text-muted lg:justify-self-end">Reseñas, cultura, materias y guías. Un magazine que acompaña el descubrimiento sin separarlo del producto.</p>
        </div>
      </header>

      <div className="border-y border-line bg-[#fffdf8] dark:bg-[#12100d]"><MagazineCategoryNav activeKey={activeKey} onSelect={setActiveKey} /></div>

      <section className="mx-auto max-w-[1440px] px-6 pb-24 pt-10 lg:px-10 lg:pt-14">
        {!cover ? (
          <div className="flex min-h-[360px] items-center justify-center"><p className="font-sans text-[15px] text-muted">No hay artículos disponibles en esta categoría.</p></div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 border-b border-line pb-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-12 lg:pb-16">
              <div className="flex flex-col justify-between gap-10 lg:py-3">
                <div><p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Cover story / edición actual</p><h2 className="mt-5 max-w-[10ch] font-display text-[40px] font-medium leading-[.95] text-ink lg:text-[58px]">El perfume también es cultura material.</h2><p className="mt-6 max-w-[40ch] font-sans text-sm leading-6 text-muted">La portada abre una conversación. El catálogo la convierte en una decisión informada.</p></div>
                <div className="flex items-center gap-4 font-plex text-[9px] uppercase tracking-[.16em] text-muted"><span>Issue 01</span><span className="h-px flex-1 bg-line"/><span>{filtered.length} historias</span></div>
              </div>
              <MagazineCoverStory article={cover} linkRef={coverRef} />
            </div>

            {secondary.length > 0 ? (
              <aside className="pt-12 lg:pt-16">
                <div className="mb-8 flex items-center gap-4"><p className="font-plex text-[9px] uppercase tracking-[.18em] text-muted">Continuar leyendo</p><span className="h-px flex-1 bg-line"/></div>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                  {secondary.map((article, i) => <MagazineSecondaryStory key={article.slug} article={article} isFirst={i === 0} />)}
                </div>
              </aside>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
