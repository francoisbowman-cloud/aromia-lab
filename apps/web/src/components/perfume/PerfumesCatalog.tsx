"use client";

import { useMemo, useState } from "react";
import type { Perfume } from "@/lib/types";
import { PerfumeCard } from "./PerfumeCard";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const GENEROS = ["masculino", "femenino", "unisex"] as const;
const CATEGORIAS_PRECIO = ["económico", "medio", "premium", "lujo"] as const;
const NICHO_O_COMERCIAL = ["nicho", "comercial"] as const;

export function PerfumesCatalog({ perfumes }: { perfumes: Perfume[] }) {
  const [q, setQ] = useState("");
  const [genero, setGenero] = useState("");
  const [familia, setFamilia] = useState("");
  const [categoriaPrecio, setCategoriaPrecio] = useState("");
  const [nichoOComercial, setNichoOComercial] = useState("");

  const familias = useMemo(
    () => Array.from(new Set(perfumes.map((p) => p.familia_olfativa))).sort(),
    [perfumes],
  );

  const filtrados = useMemo(() => {
    const texto = q.trim().toLowerCase();
    return perfumes.filter((p) => {
      if (texto && !`${p.nombre} ${p.marca}`.toLowerCase().includes(texto)) return false;
      if (genero && p.genero !== genero) return false;
      if (familia && p.familia_olfativa !== familia) return false;
      if (categoriaPrecio && p.categoria_precio !== categoriaPrecio) return false;
      if (nichoOComercial && p.nicho_o_comercial !== nichoOComercial) return false;
      return true;
    });
  }, [perfumes, q, genero, familia, categoriaPrecio, nichoOComercial]);

  return (
    <div>
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

      {filtrados.length === 0 ? (
        <p className="mt-12 text-center font-sans text-sm text-muted">
          No encontramos perfumes con esos filtros.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((perfume) => (
            <PerfumeCard key={perfume.slug} perfume={perfume} />
          ))}
        </div>
      )}
    </div>
  );
}
