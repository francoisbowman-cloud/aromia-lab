"use client";

import { useMemo, useState } from "react";
import type { Perfume } from "@/lib/types";
import { PerfumeCard } from "./PerfumeCard";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CATEGORIAS_PRINCIPALES, categoriaDe } from "@/lib/olfactiveCategories";

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

  const familias = useMemo(
    () => Array.from(new Set(perfumes.map((p) => p.familia_olfativa).filter((f): f is string => Boolean(f)))).sort(),
    [perfumes],
  );

  const categoriasConResultados = useMemo(() => {
    const presentes = new Set(
      perfumes
        .map((p) => (p.familia_olfativa ? categoriaDe(p.familia_olfativa) : null))
        .filter((c): c is string => Boolean(c)),
    );
    return CATEGORIAS_PRINCIPALES.filter((c) => presentes.has(c.label));
  }, [perfumes]);

  const filtrados = useMemo(() => {
    const texto = q.trim().toLowerCase();
    return perfumes.filter((p) => {
      if (texto && !`${p.nombre} ${p.marca}`.toLowerCase().includes(texto)) return false;
      if (genero && p.genero !== genero) return false;
      if (familia && p.familia_olfativa !== familia) return false;
      if (categoria && (!p.familia_olfativa || categoriaDe(p.familia_olfativa) !== categoria)) return false;
      if (categoriaPrecio && p.categoria_precio !== categoriaPrecio) return false;
      if (nichoOComercial && p.nicho_o_comercial !== nichoOComercial) return false;
      return true;
    });
  }, [perfumes, q, genero, familia, categoria, categoriaPrecio, nichoOComercial]);

  const activeCount = [q, genero, familia, categoria, categoriaPrecio, nichoOComercial].filter(Boolean).length;
  const clearFilters = () => { setQ(""); setGenero(""); setFamilia(""); setCategoria(""); setCategoriaPrecio(""); setNichoOComercial(""); };
  const chipClass = "inline-flex items-center gap-2 border border-[#d8c9b4] bg-[#f6eee2] px-3 py-2 font-plex text-[9px] uppercase tracking-[.12em] text-ink dark:border-[#40372d] dark:bg-[#19140f]";

  return (
    <div>
      <div className="sticky top-16 z-20 border-y border-line bg-[rgba(251,248,243,.94)] py-4 backdrop-blur-md dark:bg-[rgba(15,12,9,.94)]">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.55fr_repeat(4,1fr)_auto]">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar fragancia o marca…" className="h-11 bg-transparent" />
          <Select value={familia} onChange={(e) => setFamilia(e.target.value)} className="h-11 bg-transparent">
            <option value="">Todas las familias / Sin filtro</option>
            {familias.map((f) => <option key={f} value={f}>{f}</option>)}
          </Select>
          <Select value={genero} onChange={(e) => setGenero(e.target.value)} className="h-11 bg-transparent">
            <option value="">Todos los géneros</option>
            {GENEROS.map((g) => <option key={g} value={g}>{g}</option>)}
          </Select>
          <Select value={categoriaPrecio} onChange={(e) => setCategoriaPrecio(e.target.value)} className="h-11 bg-transparent">
            <option value="">Todos los precios</option>
            {CATEGORIAS_PRECIO.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select value={nichoOComercial} onChange={(e) => setNichoOComercial(e.target.value)} className="h-11 bg-transparent">
            <option value="">Nicho / Comercial</option>
            {NICHO_O_COMERCIAL.map((n) => <option key={n} value={n}>{n}</option>)}
          </Select>
          <button type="button" onClick={clearFilters} disabled={activeCount === 0} className="h-11 whitespace-nowrap border border-line px-4 font-plex text-[9px] uppercase tracking-[.14em] text-ink transition hover:border-gold hover:text-gold-contrast disabled:cursor-not-allowed disabled:opacity-35">Borrar filtros</button>
        </div>
      </div>

      <div className="flex flex-col gap-5 border-b border-line py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {familia ? <button type="button" onClick={() => setFamilia("")} className={chipClass}>Familia: {familia} <span aria-hidden="true">×</span></button> : null}
          {genero ? <button type="button" onClick={() => setGenero("")} className={chipClass}>Género: {genero} <span aria-hidden="true">×</span></button> : null}
          {categoriaPrecio ? <button type="button" onClick={() => setCategoriaPrecio("")} className={chipClass}>Precio: {categoriaPrecio} <span aria-hidden="true">×</span></button> : null}
          {nichoOComercial ? <button type="button" onClick={() => setNichoOComercial("")} className={chipClass}>{nichoOComercial} <span aria-hidden="true">×</span></button> : null}
          {activeCount === 0 ? <span className="font-plex text-[9px] uppercase tracking-[.14em] text-muted">Sin filtros aplicados · colección completa</span> : null}
        </div>
        <div className="font-plex text-[9px] uppercase tracking-[.14em] text-muted">{filtrados.length} de {perfumes.length} fragancias</div>
      </div>

      <div className="py-6">
        <div className="mb-4 flex items-center gap-4"><p className="font-plex text-[9px] uppercase tracking-[.18em] text-muted">Explorar por familia</p><span className="h-px flex-1 bg-line" />{categoria ? <button type="button" onClick={() => setCategoria("")} className="font-plex text-[9px] uppercase tracking-[.14em] text-gold-contrast">Quitar categoría ×</button> : null}</div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <button type="button" onClick={() => setCategoria("")} className={`border-b py-1 font-plex text-[9px] uppercase tracking-[.12em] transition ${categoria === "" ? "border-gold text-gold-contrast" : "border-transparent text-muted hover:text-ink"}`}>Todas</button>
          {categoriasConResultados.map((c) => <button key={c.label} type="button" onClick={() => setCategoria(c.label)} className={`border-b py-1 font-plex text-[9px] uppercase tracking-[.12em] transition ${categoria === c.label ? "border-gold text-gold-contrast" : "border-transparent text-muted hover:text-ink"}`}>{c.label}</button>)}
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="border-y border-line py-20 text-center"><p className="font-display text-3xl text-ink">No encontramos una coincidencia exacta.</p><p className="mt-3 font-sans text-sm text-muted">Prueba quitando uno o varios filtros.</p><button type="button" onClick={clearFilters} className="mt-6 border-b border-ink pb-1 font-plex text-[10px] uppercase tracking-[.14em] text-ink">Ver colección completa</button></div>
      ) : (
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtrados.map((perfume) => <PerfumeCard key={perfume.slug} perfume={perfume} />)}</div>
      )}
    </div>
  );
}
