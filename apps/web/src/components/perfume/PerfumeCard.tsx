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
      <div className="aspect-[4/5] animate-pulse bg-[#f8f8f6]" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-20 animate-pulse bg-[#efefeb]" />
        <div className="h-6 w-3/4 animate-pulse bg-[#efefeb]" />
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
    ? "text-[30px] sm:text-[38px] lg:text-[46px]"
    : layout === "quiet"
      ? "text-[20px] sm:text-[25px] lg:text-[28px]"
      : "text-[22px] sm:text-[29px] lg:text-[33px]";
  const objectInset = layout === "monument"
    ? "inset-[-7%] sm:inset-[-5%]"
    : layout === "quiet"
      ? "inset-[7%] sm:inset-[10%]"
      : layout === "compact"
        ? "inset-[5%]"
        : "inset-[0%]";

  return (
    <article className="group relative flex min-w-0 flex-col py-2 sm:py-4 lg:py-6">
      <Link
        href={`/catalogo/${perfume.slug}`}
        onClick={trackOpen}
        aria-label={`Abrir ficha de ${perfume.nombre} de ${perfume.marca}`}
        className={`relative block overflow-visible bg-white outline-none ${mediaClass}`}
      >
        {layout === "monument" && index != null ? (
          <span aria-hidden="true" className="absolute -right-[8%] top-1/2 z-0 -translate-y-1/2 font-display text-[clamp(105px,17vw,235px)] leading-none tracking-[-.08em] text-ink/[.022]">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
        <div className={`absolute z-10 ${objectInset}`}>
          <ProductImage
            slug={perfume.slug}
            imageUrl={perfume.imagen_url}
            alt={`${perfume.nombre} de ${perfume.marca}`}
            mode="card"
            surface="comparison"
          />
        </div>
        <span aria-hidden="true" className="absolute bottom-[6%] left-1/2 z-0 h-[4%] w-[52%] -translate-x-1/2 rounded-[50%] bg-black/[.035] blur-xl" />
        <span
          aria-hidden="true"
          className="absolute bottom-2 right-2 z-20 hidden h-10 w-10 translate-y-2 place-items-center rounded-full border border-[#20231f]/10 bg-white/90 font-display text-lg text-[#20231f] opacity-0 shadow-[0_8px_28px_rgba(14,19,17,.06)] backdrop-blur-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 sm:grid"
        >↗</span>
      </Link>

      <Link href={`/catalogo/${perfume.slug}`} onClick={trackOpen} className="relative z-20 flex flex-1 flex-col bg-white pt-3 outline-none sm:pt-5">
        <div className="flex items-baseline justify-between gap-3 border-t border-[#20231f]/10 pt-3 font-plex text-[8px] uppercase tracking-[.17em] text-muted sm:text-[9px]">
          <span className="truncate">{perfume.marca}</span>
          <span>{index == null ? "Aromia" : String(index + 1).padStart(3, "0")}</span>
        </div>
        <h3 className={`mt-2 max-w-[12ch] font-display font-medium leading-[.92] tracking-[-.035em] text-ink transition-colors group-hover:text-[#5a6b54] sm:mt-3 ${titleClass}`}>
          {perfume.nombre}
        </h3>
        <p className="mt-3 font-plex text-[8px] uppercase tracking-[.15em] text-[#5a6b54] sm:mt-4 sm:text-[9px]">
          {family ?? perfume.concentracion ?? "Objeto olfativo"}
        </p>
        {variant === "featured" && perfume.rating_promedio ? <RatingStars rating={perfume.rating_promedio} className="mt-4" /> : null}
      </Link>
    </article>
  );
}
