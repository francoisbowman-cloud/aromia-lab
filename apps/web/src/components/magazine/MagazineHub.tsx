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
        {!cover ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <p className="font-sans text-[15px] text-muted">
              No hay artículos disponibles en esta categoría.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[.75fr_1fr_.55fr] lg:gap-10">
            <div className="flex flex-col gap-5 lg:pt-2">
              <p className="font-sans text-[11px] uppercase tracking-[.2em] text-gold-contrast">
                El Magazine
              </p>
              <h1 className="font-display text-[clamp(34px,4vw,48px)] leading-[1.08] text-ink">
                Reseñas, guías y academia de perfumería.
              </h1>
              <p className="max-w-sm font-sans text-[15px] leading-7 text-muted">
                Contenido editorial para entender el mundo de la perfumería antes de elegir tu
                próxima fragancia — sin ruido, sin humo.
              </p>
            </div>

            <div className="lg:h-full">
              <MagazineCoverStory article={cover} linkRef={coverRef} />
            </div>

            {secondary.length > 0 ? (
              <aside>
                <p className="mb-5 font-sans text-[11px] uppercase tracking-[.14em] text-muted">
                  Últimas historias
                </p>
                <div className="flex flex-col gap-4">
                  {secondary.map((article, i) => (
                    <MagazineSecondaryStory
                      key={article.slug}
                      article={article}
                      isFirst={i === 0}
                    />
                  ))}
                </div>
              </aside>
            ) : null}
          </div>
        )}
      </section>
    </>
  );
}
