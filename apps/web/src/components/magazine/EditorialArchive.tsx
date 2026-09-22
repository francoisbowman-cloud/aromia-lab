"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { EditorialIndexItem } from "@/lib/editorialIndex";

const FILTERS = ["Todas", "Historias", "Materia", "Personas", "Reflexión", "Análisis"] as const;
type Filter = (typeof FILTERS)[number];

function CoverVisual({ item, className }: { item: EditorialIndexItem; className: string }) {
  if (!item.imageUrl) return null;
  return (
    <figure className={`relative overflow-hidden bg-soft ${className}`}>
      <Image
        src={item.imageUrl}
        alt={item.imageAlt ?? item.title}
        fill
        sizes="(max-width: 900px) 100vw, 62vw"
        style={{ objectFit: "cover" }}
      />
    </figure>
  );
}

export function EditorialArchive({ items }: { items: EditorialIndexItem[] }) {
  const [active, setActive] = useState<Filter>("Todas");
  // Guías es territorio de Saber (/academia), no de este archivo — se excluye acá
  // en vez de en buildEditorialIndex() para no tocar /buscar, que reutiliza esa
  // misma función y sí debe seguir encontrando artículos de guía.
  const historiasItems = useMemo(() => items.filter((item) => item.territory !== "Guías"), [items]);
  const filtered = useMemo(() => active === "Todas" ? historiasItems : historiasItems.filter((item) => item.territory === active), [active, historiasItems]);

  // N1 no es "el primero de la lista": es la única pieza que puede ganarse la
  // portada, y solo la gana si tiene foto propia de la escena. Si ninguna
  // pieza del filtro activo la tiene, el archivo abre directo en N2 — nunca
  // se promueve algo solo para llenar el hueco (criterio de Design, encargo B).
  const hero = useMemo(() => filtered.find((item) => item.nivel === "n1" && item.imageUrl), [filtered]);
  const featured = useMemo(() => filtered.filter((item) => item.nivel === "n2" && item.href !== hero?.href).slice(0, 3), [filtered, hero]);
  const featuredHrefs = useMemo(() => new Set(featured.map((item) => item.href)), [featured]);
  // Todo lo que no es portada ni destacada corre en la corriente N3/N4, en el
  // mismo orden en que llega — sin `nivel` asignado, una pieza cae acá por
  // defecto (fila corriente, sin miniatura hasta que /admin/magazine la suba
  // de nivel).
  const stream = useMemo(
    () => filtered.filter((item) => item.href !== hero?.href && !featuredHrefs.has(item.href)),
    [filtered, hero, featuredHrefs],
  );

  const isEmpty = !hero && featured.length === 0 && stream.length === 0;

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
        {isEmpty ? <div className="flex min-h-[320px] items-center justify-center border-y border-line"><p className="font-sans text-sm text-muted">Todavía no hay historias en este territorio.</p></div> : <>
          {hero ? (
            <Link href={hero.href} className="group grid gap-0 border-b border-line pb-14 lg:grid-cols-[1.45fr_.85fr] lg:items-stretch lg:pb-20">
              {/* w-full es necesario: aspect-[4/3] junto a min-h-[360px] le da a la
                  figura un ancho intrínseco de 480px y, como ítem de grid, no baja
                  de ahí — desbordaba el documento 110px a 390 y 70px a 430. */}
              <CoverVisual item={hero} className="w-full aspect-[4/3] min-h-[360px] lg:aspect-auto lg:min-h-[620px]" />
              <div className="flex flex-col justify-end border-line pt-8 lg:border-l lg:pl-10 lg:pt-0">
                <div className="font-plex text-xs uppercase tracking-[.14em] text-gold-contrast">{hero.territory} · Portada</div>
                <h2 className="mt-5 max-w-[12ch] font-display text-[48px] leading-[.92] tracking-[-.045em] text-ink transition group-hover:opacity-70 sm:text-[60px] lg:text-[72px]">{hero.title}</h2>
                <p className="mt-8 max-w-[42ch] font-sans text-base leading-7 text-muted">{hero.summary}</p>
                <span className="mt-6 inline-flex min-h-11 w-fit items-center border-b border-ink font-plex text-xs uppercase tracking-[.12em] text-ink">Leer historia →</span>
              </div>
            </Link>
          ) : null}

          {featured.length > 0 ? (
            <div className={`grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 ${hero ? "border-b border-line pb-14 pt-14 lg:pb-20 lg:pt-20" : "pb-14 pt-4 lg:pb-20"}`}>
              {featured.map((item, index) => {
                // Alterna vertical/horizontal entre vecinas — nunca dos
                // verticales seguidas (criterio de Design, encargo B).
                const vertical = index % 2 === 0;
                return (
                  <Link key={`${item.source}-${item.slug}`} href={item.href} className="group flex flex-col">
                    <CoverVisual item={item} className={vertical ? "aspect-[3/4] min-h-[300px]" : "aspect-[4/3] min-h-[220px]"} />
                    <div className="font-plex text-xs uppercase tracking-[.14em] text-gold-contrast">{item.territory}</div>
                    <h3 className="mt-4 max-w-[24ch] font-display text-[25px] leading-[1.14] tracking-[-.01em] text-ink transition group-hover:opacity-70">{item.title}</h3>
                    <p className="mt-3 max-w-[38ch] font-sans text-sm leading-6 text-muted">{item.summary}</p>
                  </Link>
                );
              })}
            </div>
          ) : null}

          {stream.length > 0 ? (
            <div className={`flex flex-col ${hero || featured.length > 0 ? "border-t border-line" : ""}`}>
              {stream.map((item) => {
                if (item.nivel === "n4") {
                  // Nota breve: sin foto a propósito, respiro tipográfico
                  // entre bloques — no cuenta como fila corriente.
                  return (
                    <div key={`${item.source}-${item.slug}`} className="border-b border-line py-14 text-center">
                      <Link href={item.href} className="group mx-auto flex max-w-[34ch] flex-col items-center">
                        <span className="font-plex text-xs uppercase tracking-[.14em] text-muted">Nota breve</span>
                        <h3 className="mt-3 font-display text-[26px] italic leading-[1.3] tracking-[-.01em] text-ink transition group-hover:opacity-70">{item.title}</h3>
                      </Link>
                    </div>
                  );
                }
                return (
                  <Link key={`${item.source}-${item.slug}`} href={item.href} className="group grid grid-cols-[1fr_auto] items-center gap-4 border-b border-line py-6 sm:grid-cols-[96px_1fr_auto] sm:gap-6">
                    {item.imageUrl ? (
                      <figure className="relative hidden aspect-square overflow-hidden rounded-sm bg-soft sm:block">
                        <Image src={item.imageUrl} alt={item.imageAlt ?? item.title} fill sizes="96px" style={{ objectFit: "cover" }} />
                      </figure>
                    ) : (
                      <span className="hidden sm:block" />
                    )}
                    <div className="min-w-0">
                      <p className="font-plex text-[10.5px] uppercase tracking-[.12em] text-muted">{item.territory}</p>
                      <h3 className="mt-1.5 max-w-[38ch] font-display text-[21px] leading-[1.2] tracking-[-.01em] text-ink transition group-hover:opacity-70">{item.title}</h3>
                    </div>
                    <span className="justify-self-end font-plex text-xs uppercase tracking-[.12em] text-gold-contrast">Leer →</span>
                  </Link>
                );
              })}
            </div>
          ) : null}
        </>}
      </section>
    </div>
  );
}
