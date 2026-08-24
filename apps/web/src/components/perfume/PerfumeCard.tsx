"use client";

import Link from "next/link";
import type { Perfume } from "@/lib/types";
import { formattedReferencePrice, publicText } from "@/lib/catalogDisplay";
import { trackEvent } from "@/lib/analytics";
import { RatingStars } from "@/components/RatingStars";
import { ProductImage } from "./ProductImage";

export function PerfumeCardSkeleton() {
  return (
    <div className="py-4" aria-busy="true">
      <div className="aspect-[4/5] animate-pulse bg-[#ebe8e1] dark:bg-[#18201c]" />
      <div className="mt-5 space-y-2">
        <div className="h-3 w-20 animate-pulse bg-[#dedbd4] dark:bg-[#223029]" />
        <div className="h-6 w-3/4 animate-pulse bg-[#dedbd4] dark:bg-[#223029]" />
        <div className="h-4 w-1/2 animate-pulse bg-[#dedbd4] dark:bg-[#223029]" />
      </div>
    </div>
  );
}

export function PerfumeCard({ perfume, variant = "catalog", index, trackingContext }: { perfume: Perfume; variant?: "catalog" | "featured"; index?: number; trackingContext?: "quiz_result" | "search" | "catalog" }) {
  const family = publicText(perfume.familia_olfativa);
  const price = formattedReferencePrice(perfume);
  const trackOpen = () => {
    if (!trackingContext) return;
    trackEvent(trackingContext === "quiz_result" ? "quiz_result_product_clicked" : "discovery_product_clicked", {
      context: trackingContext,
      perfume_slug: perfume.slug,
      position: index == null ? undefined : index + 1,
    });
  };

  return (
    <article className="group relative flex min-w-0 flex-col py-4 lg:py-6">
      <Link
        href={`/catalogo/${perfume.slug}`}
        onClick={trackOpen}
        aria-label={`Abrir ficha de ${perfume.nombre} de ${perfume.marca}`}
        className="relative block aspect-[4/5] overflow-hidden bg-transparent outline-none"
      >
        <ProductImage
          slug={perfume.slug}
          imageUrl={perfume.imagen_url}
          alt={`${perfume.nombre} de ${perfume.marca}`}
          mode="card"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-[rgba(247,245,240,.92)] font-display text-lg text-[#20231f] opacity-0 shadow-[0_8px_30px_rgba(14,19,17,.10)] backdrop-blur-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 dark:bg-[rgba(14,19,17,.92)] dark:text-[#f7f5f0]"
        >
          ↗
        </span>
      </Link>

      <Link href={`/catalogo/${perfume.slug}`} onClick={trackOpen} className="flex flex-1 flex-col pt-5 outline-none">
        <div className="flex items-baseline justify-between gap-4 font-plex text-xs uppercase tracking-[.12em] text-muted">
          <span>{perfume.marca}</span>
          <span>{index == null ? "Aromia" : String(index + 1).padStart(2, "0")}</span>
        </div>

        <h3 className="mt-3 max-w-[13ch] font-display text-[27px] font-medium leading-[.96] tracking-[-.025em] text-ink transition-colors group-hover:text-[#5a6b54] sm:text-[29px]">
          {perfume.nombre}
        </h3>

        <div className="mt-4 flex min-h-5 items-center justify-between gap-4">
          <p className="font-plex text-xs uppercase tracking-[.12em] text-[#5a6b54] dark:text-[#b8c5b3]">
            {family ?? perfume.concentracion ?? "Objeto olfativo"}
          </p>
          {variant === "catalog" ? (
            <span className="font-sans text-sm text-muted">{price ?? "Disponibilidad"}</span>
          ) : null}
        </div>

        {variant === "featured" && perfume.rating_promedio ? (
          <RatingStars rating={perfume.rating_promedio} className="mt-4" />
        ) : null}
      </Link>
    </article>
  );
}
