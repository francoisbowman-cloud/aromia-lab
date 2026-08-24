"use client";

import Link from "next/link";
import type { Perfume } from "@/lib/types";
import { publicText } from "@/lib/catalogDisplay";
import { trackEvent } from "@/lib/analytics";
import { RatingStars } from "@/components/RatingStars";
import { ProductImage } from "./ProductImage";

type Layout = "standard" | "monument" | "quiet" | "compact";

export function PerfumeCardSkeleton() {
  return (
    <div className="py-2 sm:py-4" aria-busy="true">
      <div className="aspect-[4/5] animate-pulse bg-[#f4f4f1] dark:bg-[#18201c]" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-20 animate-pulse bg-[#ecece8] dark:bg-[#223029]" />
        <div className="h-6 w-3/4 animate-pulse bg-[#ecece8] dark:bg-[#223029]" />
      </div>
    </div>
  );
}

export function PerfumeCard({ perfume, variant = "catalog", index, trackingContext, layout = "standard" }: { perfume: Perfume; variant?: "catalog" | "featured"; index?: number; trackingContext?: "quiz_result" | "search" | "catalog"; layout?: Layout }) {
  const family = publicText(perfume.familia_olfativa);
  const trackOpen = () => {
    if (!trackingContext) return;
    trackEvent(trackingContext === "quiz_result" ? "quiz_result_product_clicked" : "discovery_product_clicked", {
      context: trackingContext,
      perfume_slug: perfume.slug,
      position: index == null ? undefined : index + 1,
    });
  };

  const mediaClass = layout === "monument"
    ? "aspect-[5/6] sm:aspect-[4/5]"
    : layout === "compact"
      ? "aspect-[4/5] sm:aspect-[5/6]"
      : "aspect-[4/5]";
  const titleClass = layout === "monument"
    ? "text-[30px] sm:text-[38px] lg:text-[44px]"
    : layout === "quiet"
      ? "text-[21px] sm:text-[26px] lg:text-[29px]"
      : "text-[22px] sm:text-[29px] lg:text-[32px]";

  return (
    <article className="group relative flex min-w-0 flex-col py-2 sm:py-4 lg:py-6">
      <Link
        href={`/catalogo/${perfume.slug}`}
        onClick={trackOpen}
        aria-label={`Abrir ficha de ${perfume.nombre} de ${perfume.marca}`}
        className={`relative block overflow-hidden bg-white outline-none ${mediaClass}`}
      >
        {layout === "monument" && index != null ? (
          <span aria-hidden="true" className="absolute -right-2 top-1/2 z-0 -translate-y-1/2 font-display text-[clamp(96px,16vw,220px)] leading-none tracking-[-.08em] text-ink/[.028]">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
        <div className={layout === "monument" ? "absolute inset-[-2%] z-10" : "absolute inset-[1%] z-10"}>
          <ProductImage
            slug={perfume.slug}
            imageUrl={perfume.imagen_url}
            alt={`${perfume.nombre} de ${perfume.marca}`}
            mode="card"
            surface="comparison"
          />
        </div>
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 z-20 hidden h-10 w-10 translate-y-2 place-items-center rounded-full bg-white/92 font-display text-lg text-[#20231f] opacity-0 shadow-[0_8px_30px_rgba(14,19,17,.08)] backdrop-blur-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 sm:grid"
        >
          ↗
        </span>
      </Link>

      <Link href={`/catalogo/${perfume.slug}`} onClick={trackOpen} className="flex flex-1 flex-col bg-white pt-3 outline-none sm:pt-5">
        <div className="flex items-baseline justify-between gap-3 border-t border-[#20231f]/12 pt-3 font-plex text-[9px] uppercase tracking-[.13em] text-muted sm:text-[10px]">
          <span className="truncate">{perfume.marca}</span>
          <span>{index == null ? "Aromia" : String(index + 1).padStart(2, "0")}</span>
        </div>

        <h3 className={`mt-2 max-w-[13ch] font-display font-medium leading-[.94] tracking-[-.03em] text-ink transition-colors group-hover:text-[#5a6b54] sm:mt-3 ${titleClass}`}>
          {perfume.nombre}
        </h3>

        <p className="mt-3 font-plex text-[9px] uppercase tracking-[.12em] text-[#5a6b54] sm:mt-4 sm:text-[10px]">
          {family ?? perfume.concentracion ?? "Objeto olfativo"}
        </p>

        {variant === "featured" && perfume.rating_promedio ? (
          <RatingStars rating={perfume.rating_promedio} className="mt-4" />
        ) : null}
      </Link>
    </article>
  );
}
