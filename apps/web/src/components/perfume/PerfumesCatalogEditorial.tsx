"use client";

import { useEffect, useMemo, useState } from "react";
import type { Perfume } from "@/lib/types";
import { discoveryTextScore, type DiscoverySort } from "@/lib/discovery";
import { CATEGORIAS_PRINCIPALES, categoriaDe } from "@/lib/olfactiveCategories";
import { trackEvent } from "@/lib/analytics";
import { PerfumeCard } from "./PerfumeCard";

const GENEROS = ["masculino", "femenino", "unisex"] as const;
const CATEGORIAS_PRECIO = ["económico", "medio", "premium", "lujo"] as const;
const CHAPTER_SIZE = 24;

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="block font-plex text-[11px] uppercase tracking-[.15em] text-muted">{children}</span>;
}

export function PerfumesCatalogEditorial({ perfumes, initialFamilia }: { perfumes: Perfume[]; initialFamilia?: string }) {
  const [q, setQ] = useState("");
  const [genero, setGenero] = useState("");
  const [familia, setFamilia] = useState(initialFamilia ?? "");
  const [categoria, setCategoria] = useState("");
  const [categoriaPrecio, setCategoriaPrecio] = useState("");
  const [sort, setSort] = useState<DiscoverySort>("relevancia");
  const [visibleCount, setVisibleCount] = useState(CHAPTER_SIZE);

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

  const visible = filtrados.slice(0, visibleCount);
  const activeCount = [q, genero, familia, categoria, categoriaPrecio].filter(Boolean).length;
  const hasMore = visible.length < filtrados.length;

  const clear = () => {
    setQ("");
    setGenero("");
    setFamilia("");
    setCategoria("");
    setCategoriaPrecio("");
    setSort("relevancia");
  };

  const selectClass = "mt-2 h-10 w-full border-0 border-b border-line bg-transparent px-0 font-sans text-sm text-ink outline-none focus:border-[#5a6b54] focus:ring-0";

  return (
    <div>
      <div className="sticky top-[68px] z-20 -mx-5 border-y border-line bg-[rgba(247,245,240,.94)] px-5 py-4 backdrop-blur-md sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 dark:bg-[rgba(14,19,17,.94)]">
        <div className="grid gap-5 lg:grid-cols-[1.5fr_repeat(3,minmax(120px,.72fr))_.7fr_auto] lg:items-end">
          <label>
            <FieldLabel>Buscar</FieldLabel>
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              onBlur={() => q.trim() && trackEvent("internal_search", { context: "catalog", query_length: q.trim().length, results: filtrados.length })}
              aria-label="Buscar perfumes"
              placeholder="Perfume, marca, familia o nota…"
              className="mt-2 h-10 w-full border-0 border-b border-line bg-transparent px-0 font-display text-[20px] text-ink outline-none placeholder:font-sans placeholder:text-sm placeholder:text-muted focus:border-[#5a6b54] focus:ring-0"
            />
          </label>

          <label>
            <FieldLabel>Familia</FieldLabel>
            <select value={familia} onChange={(event) => setFamilia(event.target.value)} className={selectClass}>
              <option value="">Todos</option>
              {familias.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>

          <label>
            <FieldLabel>Género</FieldLabel>
            <select value={genero} onChange={(event) => setGenero(event.target.value)} className={selectClass}>
              <option value="">Todos</option>
              {GENEROS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>

          <label>
            <FieldLabel>Precio</FieldLabel>
            <select value={categoriaPrecio} onChange={(event) => setCategoriaPrecio(event.target.value)} className={selectClass}>
              <option value="">Todos</option>
              {CATEGORIAS_PRECIO.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>

          <label>
            <FieldLabel>Orden</FieldLabel>
            <select value={sort} onChange={(event) => setSort(event.target.value as DiscoverySort)} className={selectClass}>
              <option value="relevancia">Relevancia</option>
              <option value="rating">Rating</option>
              <option value="precio-asc">Precio ↑</option>
              <option value="precio-desc">Precio ↓</option>
              <option value="nombre">A–Z</option>
            </select>
          </label>

          <button
            type="button"
            onClick={clear}
            disabled={activeCount === 0 && sort === "relevancia"}
            className="inline-flex min-h-10 items-center justify-start font-plex text-xs uppercase tracking-[.13em] text-[#5a6b54] transition hover:text-ink disabled:cursor-default disabled:opacity-30 lg:justify-end"
          >
            Ninguno / reset
          </button>
        </div>
      </div>

      <section className="border-b border-line py-7" aria-label="Índice olfativo">
        <div className="flex items-center gap-x-7 overflow-x-auto pb-1 no-scrollbar">
          <button type="button" onClick={() => setCategoria("")} className={`min-h-11 shrink-0 font-plex text-xs uppercase tracking-[.13em] ${categoria === "" ? "text-[#5a6b54] dark:text-[#b8c5b3]" : "text-muted"}`}>Todos</button>
          {categorias.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setCategoria(item.label)}
              className={`min-h-11 shrink-0 font-plex text-xs uppercase tracking-[.13em] transition ${categoria === item.label ? "text-[#5a6b54] dark:text-[#b8c5b3]" : "text-muted hover:text-ink"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between gap-5 py-7 font-plex text-xs uppercase tracking-[.13em] text-muted">
        <span>{activeCount === 0 ? "Colección completa" : `${activeCount} criterios activos`}</span>
        <span><strong className="font-normal text-ink">{filtrados.length}</strong> / {perfumes.length}</span>
      </div>

      {filtrados.length === 0 ? (
        <div className="grid min-h-[360px] place-items-center border-y border-line py-16 text-center">
          <div>
            <p className="font-display text-[42px] leading-none tracking-[-.03em] text-ink">Amplía el mapa olfativo.</p>
            <p className="mx-auto mt-4 max-w-[38ch] font-sans text-sm leading-6 text-muted">Retira una condición o vuelve al archivo completo.</p>
            <button type="button" onClick={clear} className="mt-7 min-h-11 font-plex text-xs uppercase tracking-[.13em] text-[#5a6b54]">Ver colección completa</button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-x-7 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-9 xl:gap-y-14">
            {visible.map((perfume, index) => (
              <div key={perfume.slug} className={index % 7 === 1 || index % 7 === 5 ? "xl:translate-y-12" : ""}>
                <PerfumeCard perfume={perfume} index={index} trackingContext="catalog" />
              </div>
            ))}
          </div>

          <div className="mt-20 flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-plex text-xs uppercase tracking-[.13em] text-muted">Archivo en capítulos</p>
              <p className="mt-3 font-display text-[32px] leading-none tracking-[-.025em] text-ink">{visible.length} de {filtrados.length} a la vista.</p>
            </div>
            {hasMore ? (
              <button
                type="button"
                onClick={() => setVisibleCount((count) => Math.min(count + CHAPTER_SIZE, filtrados.length))}
                className="inline-flex min-h-12 items-center gap-4 border-b border-ink font-plex text-xs uppercase tracking-[.13em] text-ink transition hover:border-[#5a6b54] hover:text-[#5a6b54]"
              >
                Continuar el índice <span aria-hidden="true">↓</span>
              </button>
            ) : (
              <p className="font-plex text-xs uppercase tracking-[.13em] text-muted">Fin del archivo</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
