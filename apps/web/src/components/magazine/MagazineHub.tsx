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
    const tab = MAGAZINE_TABS.find((item) => item.key === activeKey);
    if (!tab || tab.categorias === null) return articulos;
    return articulos.filter((article) => tab.categorias!.includes(article.categoria));
  }, [articulos, activeKey]);

  const cover = filtered[0];
  const secondary = filtered.slice(1, 7);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    coverRef.current?.focus();
  }, [activeKey]);

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-ink dark:bg-[#0e1311]">
      <header className="mx-auto max-w-[1520px] px-5 pb-10 pt-12 sm:px-8 lg:px-12 lg:pb-14 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <h1 className="font-display text-[58px] font-medium leading-[.86] tracking-[-.055em] text-ink sm:text-[78px] lg:text-[104px]">Magazine</h1>
            <p className="mt-6 max-w-[24ch] font-display text-[27px] leading-[1.08] tracking-[-.02em] text-[#5a6b54] sm:text-[32px]">Perfume leído como objeto, cultura y memoria.</p>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-[40ch] font-sans text-base leading-7 text-muted">Reseñas, comparativas y guías construidas desde datos reales del catálogo y una mirada editorial propia.</p>
            <div className="mt-8 flex gap-7 border-t border-line pt-4 font-plex text-xs uppercase tracking-[.13em] text-muted"><span>{articulos.length} historias</span><span>Archivo vivo</span></div>
          </div>
        </div>
      </header>

      <div className="sticky top-[64px] z-20 border-y border-line bg-[rgba(247,245,240,.94)] backdrop-blur-md dark:bg-[rgba(14,19,17,.94)]">
        <MagazineCategoryNav activeKey={activeKey} onSelect={setActiveKey} />
      </div>

      <section className="mx-auto max-w-[1520px] px-5 pb-28 pt-8 sm:px-8 lg:px-12 lg:pt-12">
        {!cover ? (
          <div className="flex min-h-[360px] items-center justify-center border-y border-line"><p className="font-sans text-base text-muted">No hay artículos disponibles en esta categoría.</p></div>
        ) : (
          <>
            <div className="border-b border-line pb-16 lg:pb-24">
              <div className="mb-5 flex items-center justify-between gap-6 font-plex text-xs uppercase tracking-[.13em] text-muted"><span>Portada / Lectura 01</span><span>{String(filtered.length).padStart(2, "0")} historias</span></div>
              <MagazineCoverStory article={cover} linkRef={coverRef} />
            </div>

            {secondary.length > 0 ? (
              <aside className="pt-16 lg:pt-24">
                <div className="mb-10 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div><p className="font-plex text-xs uppercase tracking-[.13em] text-[#5a6b54] dark:text-[#b8c5b3]">Archivo</p><h2 className="mt-3 font-display text-[38px] font-medium leading-none tracking-[-.03em] text-ink lg:text-[48px]">Sigue leyendo sin perder el hilo.</h2></div>
                  <span className="font-plex text-xs uppercase tracking-[.12em] text-muted">{String(secondary.length).padStart(2, "0")} historias</span>
                </div>
                <div className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                  {secondary.map((article, index) => <div key={article.slug} className={index % 3 === 1 ? "lg:translate-y-10" : ""}><MagazineSecondaryStory article={article} isFirst={index === 0} /></div>)}
                </div>
              </aside>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
