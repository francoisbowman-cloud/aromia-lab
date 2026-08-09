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

export function PerfumesCatalog({
  perfumes,
  initialFamilia,
}: {
  perfumes: Perfume[];
  initialFamilia?: string;
}) {
  const [q, setQ] = useState("");
  const [genero, setGenero] = useState("");
  const [familia, setFamilia] = useState(initialFamilia ?? "");
  const [categoria, setCategoria] = useState("");
  const [categoriaPrecio, setCategoriaPrecio] = useState("");
  const [nichoOComercial, setNichoOComercial] = useState("");

  const familias = useMemo(
    () => Array.from(
      new Set(perfumes.map((p) => p.familia_olfativa).filter((f): f is string => Boolean(f))),
    ).sort(),
    [perfumes],
  );

  const categoriasConResultados = useMemo(() => {
    const presentes = new Set(
      perfumes
        .map((p) => p.familia_olfativa)
        .filter((f): f is string => Boolean(f))
        .map((f) => categoriaDe(f)),
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

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setCategoria("")}
          className={
            categoria === ""
              ? "rounded-full bg-gold-contrast px-5 py-2 font-sans text-[12px] font-semibold uppercase tracking-[.06em] text-primary-foreground"
              : "rounded-full border border-line px-5 py-2 font-sans text-[12px] uppercase tracking-[.06em] text-ink transition hover:border-gold"
          }
        >
          Todos
        </button>
        {categoriasConResultados.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => setCategoria(c.label)}
            className={
              categoria === c.label
                ? "rounded-full bg-gold-contrast px-5 py-2 font-sans text-[12px] font-semibold uppercase tracking-[.06em] text-primary-foreground"
                : "rounded-full border border-line px-5 py-2 font-sans text-[12px] uppercase tracking-[.06em] text-ink transition hover:border-gold"
            }
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o marca…"
          className="lg:col-span-2"
        />
        <Select value={genero} onChange={(e) => setGenero(e.target.value)}>
          <option value="">Género</option>
          {GENEROS.map((g) => (
            <option key={g} value={g} className="capitalize">
              {g}
            </option>
          ))}
        </Select>
        <Select value={familia} onChange={(e) => setFamilia(e.target.value)}>
          <option value="">Familia olfativa</option>
          {familias.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </Select>
        <Select value={categoriaPrecio} onChange={(e) => setCategoriaPrecio(e.target.value)}>
          <option value="">Categoría de precio</option>
          {CATEGORIAS_PRECIO.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select value={nichoOComercial} onChange={(e) => setNichoOComercial(e.target.value)}>
          <option value="">Nicho / Comercial</option>
          {NICHO_O_COMERCIAL.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>
      </div>

      <p className="mt-4 font-sans text-sm text-muted">
        {filtrados.length} {filtrados.length === 1 ? "fragancia" : "fragancias"}
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtrados.map((perfume) => (
          <PerfumeCard key={perfume.slug} perfume={perfume} />
        ))}
      </div>

      {filtrados.length === 0 ? (
        <div className="mt-10 rounded-card border border-line bg-surface p-8 text-center font-sans text-sm text-muted">
          No encontramos fragancias con esos filtros.
        </div>
      ) : null}
    </div>
  );
}
