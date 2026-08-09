"use client";

import Link from "next/link";
import type { Perfume } from "@/lib/types";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { RatingStars } from "@/components/RatingStars";
import { useProductImageCrop } from "@/lib/useProductImageCrop";

export function PerfumeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface" aria-busy="true">
      <div className="aspect-square animate-pulse bg-soft" />
      <div className="flex flex-col gap-2 p-5">
        <div className="h-3 w-20 animate-pulse rounded bg-soft" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-soft" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-soft" />
      </div>
    </div>
  );
}

export function PerfumeCard({
  perfume,
  variant = "catalog",
}: {
  perfume: Perfume;
  variant?: "catalog" | "featured";
}) {
  const {
    imgRef,
    frameRef,
    frameBackground,
    backgroundSize,
    backgroundPosition,
    imgError,
    handleLoad,
    handleError,
  } = useProductImageCrop(perfume.imagen_url ?? undefined);
  const showImage = Boolean(perfume.imagen_url) && !imgError;
  const hasReferencePrice = perfume.precio_referencia != null && Boolean(perfume.moneda);

  return (
    <Link
      href={`/catalogo/${perfume.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lux"
    >
      <div
        ref={frameRef}
        className="relative aspect-square overflow-hidden bg-soft"
        style={frameBackground ? { background: frameBackground } : undefined}
      >
        {showImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={perfume.imagen_url ?? ""}
              alt=""
              aria-hidden="true"
              crossOrigin="anonymous"
              className="absolute h-0 w-0 opacity-0"
              onLoad={handleLoad}
              onError={handleError}
            />
            <div
              role="img"
              aria-label={`${perfume.nombre} de ${perfume.marca}`}
              className="absolute inset-0 bg-no-repeat transition group-hover:scale-105"
              style={{
                backgroundImage: `url(${perfume.imagen_url})`,
                backgroundSize,
                backgroundPosition,
              }}
            />
          </>
        ) : (
          <ImagePlaceholder alt={`${perfume.nombre} — imagen no disponible`} />
        )}
        {perfume.nicho_o_comercial ? (
          <span className="absolute right-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[.08em] text-ink">
            {perfume.nicho_o_comercial}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-5">
        <p className="font-sans text-[11px] uppercase tracking-[.16em] text-gold-contrast">
          {perfume.familia_olfativa || "Familia por confirmar"}
        </p>
        <h3 className="font-display text-lg font-semibold leading-tight text-ink">{perfume.nombre}</h3>
        <p className="font-sans text-sm text-muted">{perfume.marca}</p>
        {variant === "featured" && perfume.rating_promedio ? (
          <RatingStars rating={perfume.rating_promedio} className="mt-auto pt-3" />
        ) : (
          <p className="mt-auto pt-3 font-display text-base text-ink">
            {hasReferencePrice
              ? Number(perfume.precio_referencia).toLocaleString("es-AR", {
                  style: "currency",
                  currency: perfume.moneda!,
                })
              : "Precio por confirmar"}
          </p>
        )}
      </div>
    </Link>
  );
}
