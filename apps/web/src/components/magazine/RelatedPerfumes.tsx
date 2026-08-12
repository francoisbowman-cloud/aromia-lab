"use client";

import Link from "next/link";
import type { Perfume } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

export function RelatedPerfumes({ perfumes, articleSlug }: { perfumes: Perfume[]; articleSlug: string }) {
  if (perfumes.length === 0) return null;
  return (
    <section className="border-y border-line bg-[#fffdf8] dark:bg-[#100d0a]">
      <div className="mx-auto max-w-[1180px] px-6 py-14 lg:px-10 lg:py-20">
        <div className="mb-9 flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>Del artículo al objeto</span><span className="h-px flex-1 bg-line"/><span>{String(perfumes.length).padStart(2, "0")} referencias</span></div>
        <div className="grid grid-cols-1 border-b border-line md:grid-cols-2 lg:grid-cols-3">
          {perfumes.slice(0, 3).map((perfume, index) => (
            <Link key={perfume.id} href={`/catalogo/${perfume.slug}`} onClick={() => trackEvent("content_to_product", { article_slug: articleSlug, perfume_slug: perfume.slug, position: index + 1 })} className={`group min-h-52 py-7 md:px-6 md:first:pl-0 md:last:pr-0 ${index < perfumes.length - 1 ? "border-b border-line md:border-b-0 md:border-r" : ""}`}>
              <div className="flex items-start justify-between gap-5"><span className="font-plex text-[8px] uppercase tracking-[.16em] text-gold-contrast">{String(index + 1).padStart(2, "0")}</span><span aria-hidden="true" className="font-display text-xl text-muted transition-transform group-hover:translate-x-1 group-hover:text-gold-contrast">→</span></div>
              <p className="mt-10 font-plex text-[9px] uppercase tracking-[.16em] text-muted">{perfume.marca}</p><h2 className="mt-3 max-w-[12ch] font-display text-[30px] font-medium leading-[.98] tracking-[-.02em] text-ink">{perfume.nombre}</h2><p className="mt-5 font-sans text-xs leading-5 text-muted">{perfume.familia_olfativa ?? "Perfil olfativo en la ficha"}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
