"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Perfume } from "@/lib/types";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { RatingStars } from "@/components/RatingStars";
import { useProductImageCrop } from "@/lib/useProductImageCrop";

export function PerfumeCardSkeleton() {
  return (
    <div className="overflow-hidden border-b border-r border-line bg-[#fffdf8] dark:bg-[#14100c]" aria-busy="true">
      <div className="aspect-[4/5] animate-pulse bg-soft" />
      <div className="flex flex-col gap-2 p-5"><div className="h-3 w-20 animate-pulse rounded bg-soft" /><div className="h-5 w-3/4 animate-pulse rounded bg-soft" /><div className="h-4 w-1/2 animate-pulse rounded bg-soft" /></div>
    </div>
  );
}

function formatPrice(perfume: Perfume) {
  if (perfume.precio_referencia == null || !perfume.moneda) return "Precio por verificar";
  return Number(perfume.precio_referencia).toLocaleString("es-AR", { style: "currency", currency: perfume.moneda });
}

export function PerfumeCard({ perfume, variant = "catalog", index }: { perfume: Perfume; variant?: "catalog" | "featured"; index?: number }) {
  const { imgRef, frameRef, frameBackground, backgroundSize, backgroundPosition, imgError, imgLoaded, handleLoad, handleError } = useProductImageCrop(perfume.imagen_url ?? "");
  const [requestImage, setRequestImage] = useState(false);
  const hasImage = Boolean(perfume.imagen_url) && !imgError;

  useEffect(() => {
    if (!perfume.imagen_url || requestImage) return;
    const frame = frameRef.current;
    if (!frame) return;

    if (typeof IntersectionObserver === "undefined") {
      setRequestImage(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRequestImage(true);
          observer.disconnect();
        }
      },
      { rootMargin: "700px 0px" },
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, [frameRef, perfume.imagen_url, requestImage]);

  return (
    <Link href={`/catalogo/${perfume.slug}`} className="group relative flex flex-col overflow-hidden border-b border-r border-line bg-[#fffdf8] transition-colors duration-500 hover:bg-[#f8f2e9] dark:bg-[#14100c] dark:hover:bg-[#18130f]">
      <div className="flex items-center justify-between border-b border-line px-4 py-3 font-plex text-[8px] uppercase tracking-[.16em] text-muted lg:px-5">
        <span>{index == null ? "Selección" : String(index + 1).padStart(2, "0")}</span>
        <span>{perfume.nicho_o_comercial ?? "Aromia edit"}</span>
      </div>

      <div ref={frameRef} className="relative aspect-[4/5] overflow-hidden bg-[#f3ede3] dark:bg-[#1a1510]" style={frameBackground ? { background: frameBackground } : undefined}>
        {hasImage && requestImage ? (
          <>
            {/* Probe used for crop analysis. It is mounted only near the viewport, so offscreen cards have no image request at all. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgRef} src={perfume.imagen_url ?? ""} alt="" aria-hidden="true" crossOrigin="anonymous" decoding="async" className="absolute h-px w-px opacity-0" onLoad={handleLoad} onError={handleError} />
            {imgLoaded ? (
              <div role="img" aria-label={`${perfume.nombre} de ${perfume.marca}`} className="absolute inset-0 bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-[1.028]" style={{ backgroundImage: `url(${perfume.imagen_url})`, backgroundSize, backgroundPosition }} />
            ) : <ImagePlaceholder alt={`${perfume.nombre} — imagen cargando`} />}
          </>
        ) : <ImagePlaceholder alt={`${perfume.nombre} — imagen no disponible`} />}
        <span aria-hidden="true" className="absolute bottom-4 right-4 grid h-9 w-9 place-items-center border border-[rgba(33,29,23,.2)] bg-[rgba(251,248,243,.72)] font-display text-lg text-ink backdrop-blur-sm transition-transform group-hover:translate-x-1 dark:border-white/15 dark:bg-[rgba(20,16,12,.72)]">→</span>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-5 pt-5 lg:px-5 lg:pb-6">
        <p className="font-plex text-[9px] uppercase tracking-[.16em] text-gold-contrast">{perfume.familia_olfativa ?? "Familia por verificar"}</p>
        <h3 className="mt-3 max-w-[12ch] font-display text-[25px] font-medium leading-[.98] tracking-[-.02em] text-ink">{perfume.nombre}</h3>
        <p className="mt-2 font-sans text-xs text-muted">{perfume.marca}</p>

        {variant === "featured" && perfume.rating_promedio ? <RatingStars rating={perfume.rating_promedio} className="mt-5" /> : (
          <div className="mt-7 flex items-end justify-between gap-4 border-t border-line pt-4">
            <div><p className="font-plex text-[8px] uppercase tracking-[.14em] text-muted">Referencia</p><p className="mt-1 font-display text-lg text-ink">{formatPrice(perfume)}</p></div>
            <span className="font-plex text-[8px] uppercase tracking-[.14em] text-muted transition-colors group-hover:text-gold-contrast">Abrir objeto</span>
          </div>
        )}
      </div>
    </Link>
  );
}
