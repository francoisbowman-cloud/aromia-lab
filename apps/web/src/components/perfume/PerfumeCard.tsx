"use client";

import Link from "next/link";
import type { Perfume } from "@/lib/types";
import { formattedReferencePrice, publicText } from "@/lib/catalogDisplay";
import { RatingStars } from "@/components/RatingStars";
import { ProductImage } from "./ProductImage";

export function PerfumeCardSkeleton() {
  return <div className="overflow-hidden border-b border-r border-line bg-[#fffdf8] dark:bg-[#14100c]" aria-busy="true"><div className="aspect-[4/5] animate-pulse bg-soft"/><div className="flex flex-col gap-2 p-5"><div className="h-3 w-20 animate-pulse rounded bg-soft"/><div className="h-5 w-3/4 animate-pulse rounded bg-soft"/><div className="h-4 w-1/2 animate-pulse rounded bg-soft"/></div></div>;
}

export function PerfumeCard({ perfume, variant = "catalog", index }: { perfume: Perfume; variant?: "catalog" | "featured"; index?: number }) {
  const family = publicText(perfume.familia_olfativa);
  const price = formattedReferencePrice(perfume);
  const buyHref = `/api/catalog-buy/${encodeURIComponent(perfume.slug)}`;
  return (
    <article className="group relative flex flex-col overflow-hidden border-b border-r border-line bg-[#fffdf8] transition-colors duration-500 hover:bg-[#f8f2e9] dark:bg-[#14100c] dark:hover:bg-[#18130f]">
      <div className="flex items-center justify-between border-b border-line px-4 py-3 font-plex text-[8px] uppercase tracking-[.16em] text-muted lg:px-5"><span>{index == null ? "Selección" : String(index + 1).padStart(2,"0")}</span><span>{perfume.nicho_o_comercial ?? "Aromia edit"}</span></div>
      <a href={buyHref} target="_blank" rel="sponsored noopener noreferrer" aria-label={`Ver ${perfume.nombre} de ${perfume.marca} en Amazon`} className="relative block aspect-[4/5] overflow-hidden bg-[#fbfaf7] dark:bg-[#f7f4ee]">
        <ProductImage slug={perfume.slug} alt={`${perfume.nombre} de ${perfume.marca}`} mode="card" />
        <span className="absolute left-4 top-4 border border-[rgba(33,29,23,.14)] bg-[rgba(251,248,243,.9)] px-2.5 py-1.5 font-plex text-[7px] uppercase tracking-[.16em] text-ink backdrop-blur-sm">Amazon image</span>
        <span aria-hidden="true" className="absolute bottom-4 right-4 grid h-9 w-9 place-items-center border border-[rgba(33,29,23,.2)] bg-[rgba(251,248,243,.88)] font-display text-lg text-ink backdrop-blur-sm transition-transform group-hover:translate-x-1">↗</span>
      </a>
      <Link href={`/catalogo/${perfume.slug}`} className="flex flex-1 flex-col px-4 pb-5 pt-5 outline-none lg:px-5 lg:pb-6">
        <p className="min-h-3 font-plex text-[9px] uppercase tracking-[.16em] text-gold-contrast">{family ?? "Objeto olfativo"}</p>
        <h3 className="mt-3 max-w-[12ch] font-display text-[25px] font-medium leading-[.98] tracking-[-.02em] text-ink">{perfume.nombre}</h3><p className="mt-2 font-sans text-xs text-muted">{perfume.marca}</p>
        {variant === "featured" && perfume.rating_promedio ? <RatingStars rating={perfume.rating_promedio} className="mt-5"/> : <div className="mt-7 flex items-end justify-between gap-4 border-t border-line pt-4"><div><p className="font-plex text-[8px] uppercase tracking-[.14em] text-muted">Referencia</p><p className="mt-1 font-display text-lg text-ink">{price ?? "Ver disponibilidad"}</p></div><span className="font-plex text-[8px] uppercase tracking-[.14em] text-muted transition-colors group-hover:text-gold-contrast">Abrir objeto</span></div>}
      </Link>
    </article>
  );
}
