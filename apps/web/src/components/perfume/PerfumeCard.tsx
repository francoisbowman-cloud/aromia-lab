"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Perfume } from "@/lib/types";
import { ImagePlaceholder } from "./ImagePlaceholder";

/** Promedia los píxeles del borde de la imagen para que el fondo de la tarjeta
 * adopte el mismo color que el fondo de la foto (blanco, crema, etc.), en vez
 * de un beige fijo que choca quando la foto no es exactamente ese tono. */
function sampleEdgeColor(img: HTMLImageElement): string | null {
  try {
    const canvas = document.createElement("canvas");
    const size = 24;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, size, size);

    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;
    const edgePixels = [
      ...Array.from({ length: size }, (_, x) => [x, 0]),
      ...Array.from({ length: size }, (_, x) => [x, size - 1]),
      ...Array.from({ length: size }, (_, y) => [0, y]),
      ...Array.from({ length: size }, (_, y) => [size - 1, y]),
    ];
    for (const [x, y] of edgePixels) {
      const data = ctx.getImageData(x, y, 1, 1).data;
      r += data[0];
      g += data[1];
      b += data[2];
      count++;
    }
    return `rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`;
  } catch {
    // getImageData puede fallar por CORS si el host de la imagen no envía
    // cabeceras permisivas; en ese caso mantenemos el fondo por defecto.
    return null;
  }
}

export function PerfumeCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-card border border-line bg-surface"
      aria-busy="true"
    >
      <div className="h-56 animate-pulse bg-soft" />
      <div className="flex flex-col gap-2 p-5">
        <div className="h-3 w-20 animate-pulse rounded bg-soft" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-soft" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-soft" />
      </div>
    </div>
  );
}

export function PerfumeCard({ perfume }: { perfume: Perfume }) {
  const [imgError, setImgError] = useState(false);
  const [bgColor, setBgColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const showImage = Boolean(perfume.imagen_url) && !imgError;

  useEffect(() => {
    // Las imágenes ya en caché están "complete" antes de que React ate el
    // listener de onLoad, así que ese evento nunca dispara para ellas.
    if (imgRef.current?.complete) {
      setBgColor(sampleEdgeColor(imgRef.current));
    }
  }, [perfume.imagen_url]);

  return (
    <Link
      href={`/catalogo/${perfume.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface transition hover:shadow-lux"
    >
      <div
        className="relative h-56 overflow-hidden bg-soft"
        style={bgColor ? { backgroundColor: bgColor } : undefined}
      >
        {showImage ? (
          <div className="absolute inset-0 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={perfume.imagen_url}
              alt={`${perfume.nombre} de ${perfume.marca}`}
              crossOrigin="anonymous"
              className="h-full w-full object-contain transition group-hover:scale-105"
              onLoad={() => {
                if (imgRef.current) setBgColor(sampleEdgeColor(imgRef.current));
              }}
              onError={() => setImgError(true)}
            />
          </div>
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
          {perfume.familia_olfativa}
        </p>
        <h3 className="font-display text-lg font-semibold leading-tight text-ink">
          {perfume.nombre}
        </h3>
        <p className="font-sans text-sm text-muted">{perfume.marca}</p>
        <p className="mt-auto pt-3 font-display text-base text-ink">
          {Number(perfume.precio_referencia).toLocaleString("es-AR", {
            style: "currency",
            currency: perfume.moneda,
          })}
        </p>
      </div>
    </Link>
  );
}
