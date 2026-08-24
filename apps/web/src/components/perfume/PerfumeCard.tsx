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
      <div className="aspect-[4/5] animate-pulse bg-[#ebe8e1]/65 dark:bg-[#18201c]" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-20 animate-pulse bg-[#dedbd4] dark:bg-[#223029]" />
        <div className="h-6 w-3/4 animate-pulse bg-[#dedbd4] dark:bg-[#223029]" />
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
  const wash = layout === "monument"
    ? "left-[4%] top-[8%] h-[74%] w-[86%] bg-[#d9c8b1]/28"
    : layout === "quiet"
      ? "left-[18%] top-[12%] h-[62%] w-[68%] bg-[#dfe5db]/35"
      : "left-[12%] top-[10%] h-[68%] w-[76%] bg-[#d9c8b1]/20";

  return (
    <article className="group relative flex min-w-0 flex-col py-2 sm:py-4 lg:py-6">
      <Link
        href={`/catalogo/${perfume.slug}`}
        onClick={trackOpen}
        aria-label={`Abrir ficha de ${perfume.nombre} de ${perfume.marca}`}
        className={`relative block overflow-hidden bg-transparent outline-none ${mediaClass}`}
      >
        <div aria-hidden="true" className={`absolute rounded-[50%] blur-[70px] transition-transform duration-700 group-hover:scale-110 ${wash}`} />
        {layout === "monument" && index != null ? (
          <span aria-hidden="true" className="absolute -right-2 top-1/2 -translate-y-1/2 font-display text-[clamp(96px,16vw,220px)] leading-none tracking-[-.08em] text-ink/[.035]">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
        <div className={layout === "monument" ? "absolute inset-[-2%]" : "absolute inset-[1%]"}>
          <ProductImage
            slug={perfume.slug}
            imageUrl={perfume.imagen_url}
            alt={`${perfume.nombre} de ${perfume.marca}`}
            mode="card"
            surface="editorial"
          />
        </div>
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 hidden h-10 w-10 translate-y-2 place-items-center rounded-full bg-[rgba(247,245,240,.88)] font-display text-lg text-[#20231f] opacity-0 shadow-[0_8px_30px_rgba(14,19,17,.08)] backdrop-blur-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 sm:grid dark:bg-[rgba(14,19,17,.90)] dark:text-[#f7f5f0]"
        >
          ↗
        </span>
      </Link>

      <Link href={`/catalogo/${perfume.slug}`} onClick={trackOpen} className="flex flex-1 flex-col pt-3 outline-none sm:pt-5">
        <div className="flex items-baseline justify-between gap-3 border-t border-line pt-3 font-plex text-[9px] uppercase tracking-[.13em] text-muted sm:text-[10px]">
          <span className="truncate">{perfume.marca}</span>
          <span>{index == null ? "Aromia" : String(index + 1).padStart(2, "0")}</span>
        </div>

        <h3 className={`mt-2 max-w-[13ch] font-display font-medium leading-[.94] tracking-[-.03em] text-ink transition-colors group-hover:text-[#5a6b54] sm:mt-3 ${titleClass}`}>
          {perfume.nombre}
        </h3>

        <p className="mt-3 font-plex text-[9px] uppercase tracking-[.12em] text-[#5a6b54] sm:mt-4 sm:text-[10px] dark:text-[#b8c5b3]">
          {family ?? perfume.concentracion ?? "Objeto olfativo"}
        </p>

        {variant === "featured" && perfume.rating_promedio ? (
          <RatingStars rating={perfume.rating_promedio} className="mt-4" />
        ) : null}
      </Link>
    </article>
  );
}
