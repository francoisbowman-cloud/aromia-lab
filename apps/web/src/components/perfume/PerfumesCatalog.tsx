"use client";

import { useMemo, useState } from "react";
import type { Perfume } from "@/lib/types";
import { discoveryTextScore, type DiscoverySort } from "@/lib/discovery";
import { PerfumeCard } from "./PerfumeCard";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CATEGORIAS_PRINCIPALES, categoriaDe } from "@/lib/olfactiveCategories";
import { trackEvent } from "@/lib/analytics";

const GENEROS = ["masculino", "femenino", "unisex"] as const;
const CATEGORIAS_PRECIO = ["económico", "medio", "premium", "lujo"] as const;
const NICHO_O_COMERCIAL = ["nicho", "comercial"] as const;

export function PerfumesCatalog({ perfumes, initialFamilia }: { perfumes: Perfume[]; initialFamilia?: string }) {
  const [q, setQ] = useState("");
  const [genero, setGenero] = useState("");
  const [familia, setFamilia] = useState(initialFamilia ?? "");
  const [categoria, setCategoria] = useState("");
  const [categoriaPrecio, setCategoriaPrecio] = useState("");
  const [nichoOComercial, setNichoOComercial] = useState("");
  const [ocasion, setOcasion] = useState("");
  const [sort, setSort] = useState<DiscoverySort>("relevancia");

  const familias = useMemo(() => Array.from(new Set(perfumes.map((p) => p.familia_olfativa).filter((f): f is string => Boolean(f)))).sort(), [perfumes]);
  const ocasiones = useMemo(() => Array.from(new Set(perfumes.flatMap((p) => p.ocasion ?? []))).sort(), [perfumes]);
  const categoriasConResultados = useMemo(() => { const presentes = new Set(perfumes.map((p) => (p.familia_olfativa ? categoriaDe(p.familia_olfativa) : null)).filter((c): c is string => Boolean(c))); return CATEGORIAS_PRINCIPALES.filter((c) => presentes.has(c.label)); }, [perfumes]);

  const filtrados = useMemo(() => {
    const texto = q.trim();
    const selected = perfumes.filter((p) => {
      if (texto && discoveryTextScore(p, texto) <= 0) return false;
      if (genero && p.genero !== genero) return false;
      if (familia && p.familia_olfativa !== familia) return false;
      if (categoria && (!p.familia_olfativa || categoriaDe(p.familia_olfativa) !== categoria)) return false;
      if (categoriaPrecio && p.categoria_precio !== categoriaPrecio) return false;
      if (nichoOComercial && p.nicho_o_comercial !== nichoOComercial) return false;
      if (ocasion && !(p.ocasion ?? []).includes(ocasion)) return false;
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
  }, [perfumes, q, genero, familia, categoria, categoriaPrecio, nichoOComercial, ocasion, sort]);

  const activeCount = [q, genero, familia, categoria, categoriaPrecio, nichoOComercial, ocasion].filter(Boolean).length;
  const clearFilters = () => { setQ(""); setGenero(""); setFamilia(""); setCategoria(""); setCategoriaPrecio(""); setNichoOComercial(""); setOcasion(""); setSort("relevancia"); };
  const chipClass = "inline-flex items-center gap-2 border-b border-[#b68a44] py-1 font-plex text-[9px] uppercase tracking-[.12em] text-ink transition hover:text-gold-contrast";

  return <div>
    <div className="sticky top-16 z-20 border-y border-line bg-[rgba(251,248,243,.96)] backdrop-blur-md dark:bg-[rgba(15,12,9,.96)]">
      <div className="flex items-center gap-4 border-b border-line px-0 py-3 font-plex text-[8px] uppercase tracking-[.18em] text-muted"><span>Refinar selección</span><span className="h-px flex-1 bg-line"/><span>{activeCount === 0 ? "Archivo completo" : `${activeCount} filtros activos`}</span></div>
      <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[1.5fr_repeat(5,1fr)_auto]">
        <div className="bg-[#fbf8f3] py-2 pr-0 dark:bg-[#0f0c09] lg:pr-3"><Input value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => q.trim() && trackEvent("internal_search", { context: "catalog", query_length: q.trim().length, results: filtrados.length })} placeholder="Perfume, marca, familia o nota…" className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0" /></div>
        <div className="bg-[#fbf8f3] p-2 dark:bg-[#0f0c09]"><Select value={familia} onChange={(e) => setFamilia(e.target.value)} aria-label="Filtrar por familia olfativa" className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0"><option value="">— Familia</option>{familias.map((f) => <option key={f} value={f}>{f}</option>)}</Select></div>
        <div className="bg-[#fbf8f3] p-2 dark:bg-[#0f0c09]"><Select value={genero} onChange={(e) => setGenero(e.target.value)} aria-label="Filtrar por género" className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0"><option value="">— Género</option>{GENEROS.map((g) => <option key={g} value={g}>{g}</option>)}</Select></div>
        <div className="bg-[#fbf8f3] p-2 dark:bg-[#0f0c09]"><Select value={ocasion} onChange={(e) => setOcasion(e.target.value)} aria-label="Filtrar por ocasión" className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0"><option value="">— Ocasión</option>{ocasiones.map((item) => <option key={item} value={item}>{item}</option>)}</Select></div>
        <div className="bg-[#fbf8f3] p-2 dark:bg-[#0f0c09]"><Select value={categoriaPrecio} onChange={(e) => setCategoriaPrecio(e.target.value)} aria-label="Filtrar por precio" className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0"><option value="">— Precio</option>{CATEGORIAS_PRECIO.map((c) => <option key={c} value={c}>{c}</option>)}</Select></div>
        <div className="bg-[#fbf8f3] p-2 dark:bg-[#0f0c09]"><Select value={nichoOComercial} onChange={(e) => setNichoOComercial(e.target.value)} aria-label="Filtrar por tipo" className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0"><option value="">— Tipo</option>{NICHO_O_COMERCIAL.map((n) => <option key={n} value={n}>{n}</option>)}</Select></div>
        <button type="button" onClick={clearFilters} disabled={activeCount === 0 && sort === "relevancia"} className="min-h-14 whitespace-nowrap bg-[#fbf8f3] px-5 font-plex text-[9px] uppercase tracking-[.14em] text-ink transition hover:text-gold-contrast disabled:opacity-30 dark:bg-[#0f0c09]">Borrar</button>
      </div>
    </div>

    <section id="indice-olfativo" className="scroll-mt-24 border-b border-line py-7"><div className="mb-5 flex items-center gap-4"><p className="font-plex text-[9px] uppercase tracking-[.18em] text-muted">Índice olfativo</p><span className="h-px flex-1 bg-line" />{categoria ? <button type="button" onClick={() => setCategoria("")} className="font-plex text-[9px] uppercase tracking-[.14em] text-gold-contrast">Quitar categoría ×</button> : null}</div><div className="flex gap-x-6 gap-y-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"><button type="button" onClick={() => setCategoria("")} className={`shrink-0 border-b py-1 font-plex text-[9px] uppercase tracking-[.13em] ${categoria === "" ? "border-gold text-gold-contrast" : "border-transparent text-muted"}`}>Todas</button>{categoriasConResultados.map((c) => <button key={c.label} type="button" onClick={() => setCategoria(c.label)} className={`shrink-0 border-b py-1 font-plex text-[9px] uppercase tracking-[.13em] ${categoria === c.label ? "border-gold text-gold-contrast" : "border-transparent text-muted"}`}>{c.label}</button>)}</div></section>

    <div className="flex flex-col gap-5 border-b border-line py-5 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap gap-x-5 gap-y-2">{q ? <button onClick={() => setQ("")} className={chipClass}>Búsqueda: {q} ×</button> : null}{familia ? <button onClick={() => setFamilia("")} className={chipClass}>Familia: {familia} ×</button> : null}{genero ? <button onClick={() => setGenero("")} className={chipClass}>Género: {genero} ×</button> : null}{ocasion ? <button onClick={() => setOcasion("")} className={chipClass}>Ocasión: {ocasion} ×</button> : null}{categoriaPrecio ? <button onClick={() => setCategoriaPrecio("")} className={chipClass}>Precio: {categoriaPrecio} ×</button> : null}{nichoOComercial ? <button onClick={() => setNichoOComercial("")} className={chipClass}>{nichoOComercial} ×</button> : null}{activeCount === 0 ? <span className="font-plex text-[9px] uppercase tracking-[.14em] text-muted">Sin filtros · colección completa</span> : null}</div><div className="flex items-center gap-4"><span className="font-plex text-[9px] uppercase tracking-[.14em] text-muted"><span className="text-ink">{filtrados.length}</span> / {perfumes.length}</span><Select value={sort} onChange={(e) => setSort(e.target.value as DiscoverySort)} aria-label="Ordenar catálogo" className="h-9 w-40 bg-transparent font-plex text-[9px] uppercase"><option value="relevancia">Relevancia</option><option value="rating">Rating</option><option value="precio-asc">Precio ↑</option><option value="precio-desc">Precio ↓</option><option value="nombre">A–Z</option></Select></div></div>

    {filtrados.length === 0 ? <div className="grid min-h-[360px] place-items-center border-b border-line py-16 text-center"><div><p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Sin coincidencias</p><p className="mt-4 font-display text-4xl text-ink">Amplía el mapa olfativo.</p><p className="mx-auto mt-4 max-w-[38ch] font-sans text-sm leading-6 text-muted">Retira una condición o vuelve al archivo completo.</p><button type="button" onClick={clearFilters} className="mt-7 border-b border-ink pb-1 font-plex text-[10px] uppercase tracking-[.14em] text-ink">Ver colección completa</button></div></div> : <div className="grid grid-cols-1 border-b border-line sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtrados.map((perfume, index) => <PerfumeCard key={perfume.slug} perfume={perfume} index={index} trackingContext="catalog" />)}</div>}
  </div>;
}
