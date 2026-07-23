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
    // Solo mueve el foco cuando el usuario cambia de categoría, no en el
    // montaje inicial (si no, el foco salta a la portada apenas se carga
    // la página, sin que el usuario haya interactuado con nada).
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    coverRef.current?.focus();
  }, [activeKey]);

  return (
    <>
      <MagazineCategoryNav activeKey={activeKey} onSelect={setActiveKey} />

      <section className="mx-auto max-w-[1440px] px-6 pb-20 pt-12 lg:px-10 lg:pt-14">
        <div className="mb-8 flex items-end justify-between">
          <h1 className="font-display text-[clamp(38px,5vw,72px)] leading-none text-ink">
            Magazine
          </h1>
          <span className="hidden font-sans text-[11px] uppercase tracking-[.16em] text-muted md:block">
            Aromia Magazine
          </span>
        </div>

        {!cover ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <p className="font-sans text-[15px] text-muted">
              No hay artículos disponibles en esta categoría.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.85fr)_minmax(310px,.65fr)] lg:gap-8">
            <MagazineCoverStory article={cover} linkRef={coverRef} />
            {secondary.length > 0 ? (
              <aside className="grid gap-5 lg:gap-6">
                {secondary.map((article, i) => (
                  <MagazineSecondaryStory
                    key={article.slug}
                    article={article}
                    isFirst={i === 0}
                  />
                ))}
              </aside>
            ) : null}
          </div>
        )}
      </section>
    </>
  );
}
