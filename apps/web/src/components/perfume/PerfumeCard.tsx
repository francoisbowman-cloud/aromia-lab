"use client";

import Link from "next/link";
import type { Perfume } from "@/lib/types";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { RatingStars } from "@/components/RatingStars";
import { useProductImageCrop } from "@/lib/useProductImageCrop";

export function PerfumeCardSkeleton() {
  return (
    <div className="overflow-hidden border border-line bg-[#fffdf8] dark:bg-[#14100c]" aria-busy="true">
      <div className="aspect-[4/5] animate-pulse bg-soft" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-20 animate-pulse rounded bg-soft" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-soft" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-soft" />
      </div>
    </div>
  );
}

function formatPrice(perfume: Perfume) {
  if (perfume.precio_referencia == null || !perfume.moneda) return "Precio por verificar";
  return Number(perfume.precio_referencia).toLocaleString("es-AR", {
    style: "currency",
    currency: perfume.moneda,
  });
}

export function PerfumeCard({ perfume, variant = "catalog" }: { perfume: Perfume; variant?: "catalog" | "featured" }) {
  const {
    imgRef,
    frameRef,
    frameBackground,
    backgroundSize,
    backgroundPosition,
    imgError,
    handleLoad,
    handleError,
  } = useProductImageCrop(perfume.imagen_url ?? "");
  const showImage = Boolean(perfume.imagen_url) && !imgError;

  return (
    <Link href={`/catalogo/${perfume.slug}`} className="group flex flex-col overflow-hidden border border-line bg-[#fffdf8] transition duration-500 ease-out hover:-translate-y-1 hover:border-[#c9ac77] hover:shadow-[0_22px_50px_rgba(72,52,28,.09)] dark:bg-[#14100c] dark:hover:border-[#755d3d]">
      <div ref={frameRef} className="relative aspect-[4/5] overflow-hidden bg-[#f3ede3] dark:bg-[#1a1510]" style={frameBackground ? { background: frameBackground } : undefined}>
        {showImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgRef} src={perfume.imagen_url ?? ""} alt="" aria-hidden="true" crossOrigin="anonymous" className="absolute h-0 w-0 opacity-0" onLoad={handleLoad} onError={handleError} />
            <div role="img" aria-label={`${perfume.nombre} de ${perfume.marca}`} className="absolute inset-0 bg-no-repeat transition-transform duration-700 group-hover:scale-[1.035]" style={{ backgroundImage: `url(${perfume.imagen_url})`, backgroundSize, backgroundPosition }} />
          </>
        ) : (
          <ImagePlaceholder alt={`${perfume.nombre} — imagen no disponible`} />
        )}

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <span className="bg-[rgba(251,248,243,.88)] px-2 py-1 font-plex text-[8px] uppercase tracking-[.15em] text-ink backdrop-blur-sm dark:bg-[rgba(20,16,12,.82)]">{perfume.nicho_o_comercial ?? "Selección Aromia"}</span>
          <span aria-hidden="true" className="grid h-8 w-8 place-items-center border border-[rgba(255,255,255,.6)] bg-[rgba(251,248,243,.68)] text-sm text-ink backdrop-blur-sm dark:border-white/15 dark:bg-[rgba(20,16,12,.68)]">♡</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 lg:p-5">
        <p className="font-plex text-[9px] uppercase tracking-[.15em] text-gold-contrast">{perfume.familia_olfativa ?? "Familia por verificar"}</p>
        <h3 className="mt-2 font-display text-[22px] font-medium leading-[1.02] text-ink">{perfume.nombre}</h3>
        <p className="mt-1 font-sans text-xs text-muted">{perfume.marca}</p>
        {variant === "featured" && perfume.rating_promedio ? (
          <RatingStars rating={perfume.rating_promedio} className="mt-4" />
        ) : (
          <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
            <p className="font-display text-lg text-ink">{formatPrice(perfume)}</p>
            <span className="font-plex text-[9px] uppercase tracking-[.12em] text-muted transition-colors group-hover:text-gold-contrast">Ver detalle →</span>
          </div>
        )}
      </div>
    </Link>
  );
}
