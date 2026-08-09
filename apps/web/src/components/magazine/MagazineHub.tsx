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
      <header className="mx-auto max-w-[1440px] px-6 pb-10 pt-10 lg:px-10 lg:pb-14 lg:pt-14">
        <div className="flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.2em] text-muted"><span>Aromia Magazine</span><span className="h-px flex-1 bg-line"/><span>Journal de parfum</span></div>
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <p className="font-plex text-[9px] uppercase tracking-[.22em] text-gold-contrast">Edición 01 / Materia, memoria, deseo</p>
            <h1 className="mt-5 max-w-[10ch] font-display text-[58px] font-medium leading-[.88] tracking-[-.045em] text-ink lg:text-[96px]">Historias que cambian cómo hueles.</h1>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-[40ch] font-sans text-[15px] leading-7 text-muted">Reseñas, cultura, materias y guías tratadas como capítulos editoriales: leer primero, reconocer después, elegir mejor.</p>
            <div className="mt-8 flex items-center gap-4 border-t border-line pt-4 font-plex text-[9px] uppercase tracking-[.16em] text-muted"><span>{articulos.length} historias</span><span className="h-px flex-1 bg-line"/><span>Aromia / 2026</span></div>
          </div>
        </div>
      </header>

      <div className="sticky top-[64px] z-20 border-y border-line bg-[#fffdf8]/95 backdrop-blur-md dark:bg-[#12100d]/95"><MagazineCategoryNav activeKey={activeKey} onSelect={setActiveKey} /></div>

      <section className="mx-auto max-w-[1440px] px-6 pb-24 pt-10 lg:px-10 lg:pt-14">
        {!cover ? (
          <div className="flex min-h-[360px] items-center justify-center border-y border-line"><p className="font-sans text-[15px] text-muted">No hay artículos disponibles en esta categoría.</p></div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-10 border-b border-line pb-14 lg:grid-cols-[.62fr_1.38fr] lg:gap-14 lg:pb-20">
              <div className="flex flex-col justify-between gap-12 lg:py-4">
                <div>
                  <p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Cover story / edición actual</p>
                  <h2 className="mt-5 max-w-[9ch] font-display text-[44px] font-medium leading-[.92] tracking-[-.03em] text-ink lg:text-[66px]">El perfume también es cultura material.</h2>
                  <p className="mt-7 max-w-[38ch] font-sans text-[14px] leading-7 text-muted">Una botella, una materia prima, una firma olfativa: la portada abre la conversación y el catálogo la convierte en una decisión informada.</p>
                </div>
                <div className="grid grid-cols-2 border-y border-line font-plex text-[8px] uppercase tracking-[.15em] text-muted">
                  <div className="border-r border-line py-4 pr-4"><span className="block text-gold-contrast">Issue</span><span className="mt-2 block">01</span></div>
                  <div className="py-4 pl-4"><span className="block text-gold-contrast">Selección</span><span className="mt-2 block">{filtered.length} historias</span></div>
                </div>
              </div>
              <MagazineCoverStory article={cover} linkRef={coverRef} />
            </div>

            {secondary.length > 0 ? (
              <aside className="pt-14 lg:pt-20">
                <div className="mb-10 flex items-end justify-between gap-6 border-b border-line pb-5">
                  <div><p className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">Siguiente lectura</p><h3 className="mt-3 font-display text-[34px] font-medium leading-none text-ink lg:text-[44px]">Tres caminos para continuar.</h3></div>
                  <span className="hidden font-plex text-[8px] uppercase tracking-[.16em] text-muted sm:block">Archivo / {String(secondary.length).padStart(2, "0")}</span>
                </div>
                <div className="grid grid-cols-1 gap-0 border-b border-line lg:grid-cols-3">
                  {secondary.map((article, i) => <div key={article.slug} className={i < secondary.length - 1 ? "border-b border-line pb-6 lg:border-b-0 lg:border-r lg:px-6 lg:pb-0 first:pl-0" : "pt-6 lg:px-6 lg:pt-0 last:pr-0"}><MagazineSecondaryStory article={article} isFirst={i === 0} /></div>)}
                </div>
              </aside>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
