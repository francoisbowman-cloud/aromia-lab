"use client";

import Link from "next/link";
import type { Perfume } from "@/lib/types";
import { formattedReferencePrice, publicText } from "@/lib/catalogDisplay";
import { trackEvent } from "@/lib/analytics";
import { RatingStars } from "@/components/RatingStars";
import { ProductImage } from "./ProductImage";

export function PerfumeCardSkeleton() {
  return (
    <div className="overflow-hidden bg-[#fbf8f3] dark:bg-[#0d0b09]" aria-busy="true">
      <div className="aspect-[5/6] animate-pulse bg-white" />
      <div className="flex flex-col gap-2 py-5">
        <div className="h-3 w-20 animate-pulse rounded bg-soft" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-soft" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-soft" />
      </div>
    </div>
  );
}

export function PerfumeCard({ perfume, variant = "catalog", index, trackingContext }: { perfume: Perfume; variant?: "catalog" | "featured"; index?: number; trackingContext?: "quiz_result" | "search" | "catalog" }) {
  const family = publicText(perfume.familia_olfativa);
  const price = formattedReferencePrice(perfume);
  const trackOpen = () => {
    if (!trackingContext) return;
    trackEvent(trackingContext === "quiz_result" ? "quiz_result_product_clicked" : "discovery_product_clicked", { context: trackingContext, perfume_slug: perfume.slug, position: index == null ? undefined : index + 1 });
  };

  return (
    <article className="group relative flex flex-col bg-[#fbf8f3] dark:bg-[#0d0b09]">
      <div className="mb-3 flex items-center justify-between font-plex text-xs uppercase tracking-[.13em] text-muted">
        <span>{index == null ? "Selección" : String(index + 1).padStart(2, "0")}</span>
        <span>{perfume.nicho_o_comercial ?? "Aromia edit"}</span>
      </div>

      <Link
        href={`/catalogo/${perfume.slug}`}
        onClick={trackOpen}
        aria-label={`Abrir ficha de ${perfume.nombre} de ${perfume.marca}`}
        className="relative block aspect-[5/6] overflow-hidden bg-white outline-none transition-shadow duration-500 hover:shadow-[0_24px_70px_rgba(48,36,25,.08)]"
      >
        <ProductImage slug={perfume.slug} imageUrl={perfume.imagen_url} alt={`${perfume.nombre} de ${perfume.marca}`} mode="card" />
        <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center border border-[#211d17]/10 bg-white/92 font-display text-lg text-ink opacity-0 backdrop-blur-sm transition duration-300 group-hover:translate-x-1 group-hover:opacity-100 group-focus-within:opacity-100">→</span>
      </Link>

      <Link href={`/catalogo/${perfume.slug}`} onClick={trackOpen} className="flex flex-1 flex-col pb-5 pt-5 outline-none">
        <p className="font-plex text-xs uppercase tracking-[.13em] text-gold-contrast">{family ?? "Objeto olfativo"}</p>
        <h3 className="mt-3 max-w-[13ch] font-display text-[27px] font-medium leading-[.94] tracking-[-.025em] text-ink">{perfume.nombre}</h3>
        <p className="mt-2 font-sans text-sm text-muted">{perfume.marca}</p>
        {variant === "featured" && perfume.rating_promedio ? (
          <RatingStars rating={perfume.rating_promedio} className="mt-5" />
        ) : (
          <div className="mt-7 flex items-end justify-between gap-4 border-t border-line/70 pt-4">
            <div>
              <p className="font-plex text-xs uppercase tracking-[.12em] text-muted">Referencia</p>
              <p className="mt-1 font-display text-lg text-ink">{price ?? "Ver disponibilidad"}</p>
            </div>
            <span className="font-plex text-xs uppercase tracking-[.12em] text-muted transition-colors group-hover:text-gold-contrast">Ficha →</span>
          </div>
        )}
      </Link>
    </article>
  );
}
