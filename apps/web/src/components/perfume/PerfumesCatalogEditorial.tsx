"use client";

import { useEffect, useMemo, useState } from "react";
import type { Perfume } from "@/lib/types";
import { discoveryTextScore, type DiscoverySort } from "@/lib/discovery";
import { CATEGORIAS_PRINCIPALES, categoriaDe } from "@/lib/olfactiveCategories";
import { trackEvent } from "@/lib/analytics";
import { PerfumeCard } from "./PerfumeCard";

const GENEROS = ["masculino", "femenino", "unisex"] as const;
const CATEGORIAS_PRECIO = ["económico", "medio", "premium", "lujo"] as const;
const CHAPTER_SIZE = 18;

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="block font-plex text-[9px] uppercase tracking-[.18em] text-muted">{children}</span>;
}

function editorialPlacement(index: number) {
  const pattern = index % 9;
  if (pattern === 0) return { span: "lg:col-span-5", shift: "", layout: "monument" as const };
  if (pattern === 1) return { span: "lg:col-span-3", shift: "lg:translate-y-24", layout: "quiet" as const };
  if (pattern === 2) return { span: "lg:col-span-4", shift: "lg:-translate-y-4", layout: "standard" as const };
  if (pattern === 3) return { span: "lg:col-span-4", shift: "lg:translate-y-10", layout: "compact" as const };
  if (pattern === 4) return { span: "lg:col-span-5", shift: "lg:-translate-y-8", layout: "monument" as const };
  if (pattern === 5) return { span: "lg:col-span-3", shift: "lg:translate-y-16", layout: "quiet" as const };
  if (pattern === 6) return { span: "lg:col-span-3", shift: "", layout: "compact" as const };
  if (pattern === 7) return { span: "lg:col-span-4", shift: "lg:translate-y-14", layout: "standard" as const };
  return { span: "lg:col-span-5", shift: "lg:-translate-y-6", layout: "monument" as const };
}

export function PerfumesCatalogEditorial({ perfumes, initialFamilia }: { perfumes: Perfume[]; initialFamilia?: string }) {
  const [q, setQ] = useState("");
  const [genero, setGenero] = useState("");
  const [familia, setFamilia] = useState(initialFamilia ?? "");
  const [categoria, setCategoria] = useState("");
  const [categoriaPrecio, setCategoriaPrecio] = useState("");
  const [sort, setSort] = useState<DiscoverySort>("relevancia");
  const [visibleCount, setVisibleCount] = useState(CHAPTER_SIZE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const familias = useMemo(
    () => Array.from(new Set(perfumes.map((p) => p.familia_olfativa).filter((f): f is string => Boolean(f)))).sort(),
    [perfumes],
  );

  const categorias = useMemo(() => {
    const presentes = new Set(
      perfumes
        .map((p) => (p.familia_olfativa ? categoriaDe(p.familia_olfativa) : null))
        .filter((c): c is string => Boolean(c)),
    );
    return CATEGORIAS_PRINCIPALES.filter((c) => presentes.has(c.label));
  }, [perfumes]);

  const filtrados = useMemo(() => {
    const texto = q.trim();
    const selected = perfumes.filter((p) => {
      if (texto && discoveryTextScore(p, texto) <= 0) return false;
      if (genero && p.genero !== genero) return false;
      if (familia && p.familia_olfativa !== familia) return false;
      if (categoria && (!p.familia_olfativa || categoriaDe(p.familia_olfativa) !== categoria)) return false;
      if (categoriaPrecio && p.categoria_precio !== categoriaPrecio) return false;
      return true;
    });

    return selected.sort((a, b) => {
      if (sort === "rating") return (b.rating_promedio ?? 0) - (a.rating_promedio ?? 0);
      if (sort === "precio-asc") return (a.precio_referencia ?? Number.MAX_SAFE_INTEGER) - (b.precio_referencia ?? Number.MAX_SAFE_INTEGER);
      if (sort === "precio-desc") return (b.precio_referencia ?? -1) - (a.precio_referencia ?? -1);
      if (sort === "nombre") return a.nombre.localeCompare(b.nombre);
      if (texto) return discoveryTextScore(b, texto) - discoveryTextScore(a, texto);
      return a.nombre.localeCompare(b.nombre);
    });
  }, [perfumes, q, genero, familia, categoria, categoriaPrecio, sort]);

  useEffect(() => setVisibleCount(CHAPTER_SIZE), [q, genero, familia, categoria, categoriaPrecio, sort]);
  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [mobileFiltersOpen]);

  const visible = filtrados.slice(0, visibleCount);
  const activeCount = [q, genero, familia, categoria, categoriaPrecio].filter(Boolean).length;
  const hasMore = visible.length < filtrados.length;
  const opening = visible.slice(0, 3);
  const archive = visible.slice(3);

  const clear = () => {
    setQ("");
    setGenero("");
    setFamilia("");
    setCategoria("");
    setCategoriaPrecio("");
    setSort("relevancia");
  };

  const selectClass = "mt-2 h-9 w-full appearance-none rounded-none border-0 border-b border-[#20231f]/15 bg-transparent bg-none px-0 pr-6 font-sans text-[13px] text-ink outline-none focus:border-[#5a6b54] focus:ring-0";

  const filters = (
    <>
      <label className="relative"><FieldLabel>Familia</FieldLabel><select value={familia} onChange={(e) => setFamilia(e.target.value)} className={selectClass}><option value="">Todos</option>{familias.map((item) => <option key={item}>{item}</option>)}</select><span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-0 text-xs text-muted">⌄</span></label>
      <label className="relative"><FieldLabel>Género</FieldLabel><select value={genero} onChange={(e) => setGenero(e.target.value)} className={selectClass}><option value="">Todos</option>{GENEROS.map((item) => <option key={item}>{item}</option>)}</select><span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-0 text-xs text-muted">⌄</span></label>
      <label className="relative"><FieldLabel>Precio</FieldLabel><select value={categoriaPrecio} onChange={(e) => setCategoriaPrecio(e.target.value)} className={selectClass}><option value="">Todos</option>{CATEGORIAS_PRECIO.map((item) => <option key={item}>{item}</option>)}</select><span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-0 text-xs text-muted">⌄</span></label>
      <label className="relative"><FieldLabel>Orden</FieldLabel><select value={sort} onChange={(e) => setSort(e.target.value as DiscoverySort)} className={selectClass}><option value="relevancia">Relevancia</option><option value="rating">Rating</option><option value="precio-asc">Precio ↑</option><option value="precio-desc">Precio ↓</option><option value="nombre">A–Z</option></select><span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-0 text-xs text-muted">⌄</span></label>
    </>
  );

  return (
    <div className="bg-white">
      <div className="sticky top-[68px] z-30 -mx-5 border-y border-[#20231f]/10 bg-white/95 px-5 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
        <div className="flex items-end gap-4 lg:hidden">
          <label className="min-w-0 flex-1"><FieldLabel>Buscar</FieldLabel><input value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => q.trim() && trackEvent("internal_search", { context: "catalog", query_length: q.trim().length, results: filtrados.length })} aria-label="Buscar perfumes" placeholder="Perfume, marca o nota…" className="mt-1 h-10 w-full border-0 border-b border-[#20231f]/15 bg-transparent px-0 font-sans text-[14px] text-ink outline-none placeholder:text-muted focus:border-[#5a6b54] focus:ring-0" /></label>
          <button type="button" aria-expanded={mobileFiltersOpen} aria-controls="mobile-catalog-filters" onClick={() => setMobileFiltersOpen(true)} className="inline-flex min-h-11 shrink-0 items-center gap-2 border-b border-ink font-plex text-[10px] uppercase tracking-[.14em] text-ink">Filtros{activeCount ? ` ${activeCount}` : ""}<span aria-hidden="true">＋</span></button>
        </div>
        <div className="hidden gap-6 lg:grid lg:grid-cols-[1.45fr_repeat(3,minmax(120px,.66fr))_.62fr_auto] lg:items-end">
          <label><FieldLabel>Buscar</FieldLabel><input value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => q.trim() && trackEvent("internal_search", { context: "catalog", query_length: q.trim().length, results: filtrados.length })} aria-label="Buscar perfumes" placeholder="Perfume, marca, familia o nota…" className="mt-2 h-9 w-full border-0 border-b border-[#20231f]/15 bg-transparent px-0 font-display text-[17px] text-ink outline-none placeholder:font-sans placeholder:text-[12px] placeholder:text-muted focus:border-[#5a6b54] focus:ring-0" /></label>
          {filters}
          <button type="button" onClick={clear} disabled={activeCount === 0 && sort === "relevancia"} className="inline-flex min-h-10 items-center justify-end font-plex text-[9px] uppercase tracking-[.16em] text-[#5a6b54] disabled:opacity-25">Ninguno / reset</button>
        </div>
      </div>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-labelledby="mobile-filter-title">
          <button type="button" aria-label="Cerrar filtros" onClick={() => setMobileFiltersOpen(false)} className="absolute inset-0 bg-[#0e1311]/20 backdrop-blur-[2px]" />
          <section id="mobile-catalog-filters" className="absolute inset-x-0 bottom-0 max-h-[78dvh] overflow-y-auto border-t border-[#20231f]/12 bg-white px-5 pb-[calc(22px+env(safe-area-inset-bottom))] pt-5 shadow-[0_-24px_70px_rgba(14,19,17,.12)]">
            <div className="sticky top-0 z-10 -mx-5 mb-7 flex items-center justify-between border-b border-[#20231f]/10 bg-white px-5 pb-4"><div><p className="font-plex text-[9px] uppercase tracking-[.16em] text-muted">Catálogo</p><h2 id="mobile-filter-title" className="mt-1 font-display text-[30px] leading-none text-ink">Afinar selección</h2></div><button type="button" onClick={() => setMobileFiltersOpen(false)} className="grid h-11 w-11 place-items-center border border-[#20231f]/12 text-xl text-ink" aria-label="Cerrar filtros">×</button></div>
            <div className="grid gap-7">{filters}</div>
            <div className="mt-9 flex items-center justify-between gap-5 border-t border-[#20231f]/10 pt-5"><button type="button" onClick={clear} disabled={activeCount === 0 && sort === "relevancia"} className="min-h-11 font-plex text-[9px] uppercase tracking-[.15em] text-muted disabled:opacity-30">Ninguno / reset</button><button type="button" onClick={() => setMobileFiltersOpen(false)} className="inline-flex min-h-12 items-center border-b border-ink font-plex text-[9px] uppercase tracking-[.15em] text-ink">Ver {filtrados.length} perfumes →</button></div>
          </section>
        </div>
      ) : null}

      <section className="border-b border-[#20231f]/10 py-3 sm:py-5" aria-label="Índice olfativo"><div className="flex items-center gap-x-8 overflow-x-auto no-scrollbar"><button type="button" onClick={() => setCategoria("")} className={`min-h-11 shrink-0 font-plex text-[9px] uppercase tracking-[.16em] ${categoria === "" ? "text-[#5a6b54]" : "text-muted"}`}>Todos</button>{categorias.map((item) => <button key={item.label} type="button" onClick={() => setCategoria(item.label)} className={`min-h-11 shrink-0 font-plex text-[9px] uppercase tracking-[.16em] transition ${categoria === item.label ? "text-[#5a6b54]" : "text-muted hover:text-ink"}`}>{item.label}</button>)}</div></section>

      <div className="flex items-center justify-between gap-5 py-5 font-plex text-[9px] uppercase tracking-[.16em] text-muted sm:py-7"><span>{activeCount === 0 ? "Colección completa" : `${activeCount} criterios activos`}</span><span><strong className="font-normal text-ink">{filtrados.length}</strong> / {perfumes.length}</span></div>

      {filtrados.length === 0 ? (
        <div className="grid min-h-[320px] place-items-center border-y border-[#20231f]/10 py-14 text-center"><div><p className="font-display text-[38px] leading-none tracking-[-.03em] text-ink">Amplía el mapa olfativo.</p><p className="mx-auto mt-4 max-w-[38ch] font-sans text-sm leading-6 text-muted">Retira una condición o vuelve al archivo completo.</p><button type="button" onClick={clear} className="mt-7 min-h-11 font-plex text-[9px] uppercase tracking-[.15em] text-[#5a6b54]">Ver colección completa</button></div></div>
      ) : (
        <>
          {opening.length > 0 ? (
            <section className="relative mb-24 border-t border-[#20231f]/10 pt-8 lg:mb-40 lg:pt-12">
              <div className="pointer-events-none absolute right-0 top-0 hidden font-display text-[clamp(180px,22vw,340px)] leading-none tracking-[-.08em] text-ink/[.018] lg:block">001</div>
              <div className="mb-10 grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
                <div><p className="font-plex text-[9px] uppercase tracking-[.16em] text-[#5a6b54]">Apertura / tres objetos</p><h2 className="mt-4 max-w-[11ch] font-display text-[40px] leading-[.92] tracking-[-.04em] text-ink sm:text-[54px]">La colección empieza sin vitrinas.</h2></div>
                <p className="max-w-[42ch] justify-self-end font-display text-[19px] leading-[1.25] text-muted sm:text-[23px]">Mismo blanco, distintas escalas. Cada frasco conserva su identidad y el espacio editorial hace el resto.</p>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 lg:grid-cols-12 lg:gap-x-10">
                {opening.map((perfume, index) => {
                  const placements = [
                    "col-span-2 lg:col-span-5",
                    "col-span-1 lg:col-span-3 lg:translate-y-28",
                    "col-span-1 lg:col-span-4 lg:-translate-y-4",
                  ];
                  const layouts = ["monument", "quiet", "standard"] as const;
                  return <div key={perfume.slug} className={placements[index]}><PerfumeCard perfume={perfume} index={index} trackingContext="catalog" layout={layouts[index]} /></div>;
                })}
              </div>
            </section>
          ) : null}

          {archive.length > 0 ? (
            <section>
              <div className="mb-12 grid items-end gap-8 border-t border-[#20231f]/10 pt-7 lg:grid-cols-[1fr_auto] lg:mb-20">
                <div><p className="font-plex text-[9px] uppercase tracking-[.16em] text-[#5a6b54]">Archivo / secuencia abierta</p><p className="mt-3 max-w-[13ch] font-display text-[34px] leading-[.96] tracking-[-.03em] text-ink sm:text-[44px]">Objeto, pausa, objeto.</p></div>
                <p className="max-w-[38ch] font-sans text-[13px] leading-6 text-muted">La densidad cambia cada pocos perfumes para evitar que 125 identidades terminen convertidas en una pared de tarjetas iguales.</p>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-28">
                {archive.map((perfume, archiveIndex) => {
                  const index = archiveIndex + 3;
                  const placement = editorialPlacement(index);
                  return <div key={perfume.slug} className={`col-span-1 min-w-0 ${placement.span} ${placement.shift}`}><PerfumeCard perfume={perfume} index={index} trackingContext="catalog" layout={placement.layout} /></div>;
                })}
              </div>
            </section>
          ) : null}

          <div className="mt-28 flex flex-col gap-5 border-t border-[#20231f]/10 pt-8 sm:flex-row sm:items-end sm:justify-between lg:mt-44">
            <div><p className="font-plex text-[9px] uppercase tracking-[.16em] text-muted">Archivo en capítulos</p><p className="mt-3 font-display text-[30px] leading-none tracking-[-.025em] text-ink">{visible.length} de {filtrados.length} a la vista.</p></div>
            {hasMore ? <button type="button" onClick={() => setVisibleCount((count) => Math.min(count + CHAPTER_SIZE, filtrados.length))} className="inline-flex min-h-12 items-center gap-4 border-b border-ink font-plex text-[9px] uppercase tracking-[.16em] text-ink transition hover:border-[#5a6b54] hover:text-[#5a6b54]">Continuar el índice <span aria-hidden="true">↓</span></button> : <p className="font-plex text-[9px] uppercase tracking-[.16em] text-muted">Fin del archivo</p>}
          </div>
        </>
      )}
    </div>
  );
}
