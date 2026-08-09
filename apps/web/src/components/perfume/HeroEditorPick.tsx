"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Perfume } from "@/lib/types";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { useProductImageCrop } from "@/lib/useProductImageCrop";

const ROTATE_MS = 6500;

export function HeroEditorPick({ perfumes }: { perfumes: Perfume[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = perfumes[index % Math.max(perfumes.length, 1)];

  useEffect(() => {
    if (paused || perfumes.length <= 1) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % perfumes.length), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [perfumes.length, paused]);

  const {
    imgRef,
    frameRef,
    frameBackground,
    backgroundSize,
    backgroundPosition,
    imgError,
    handleLoad,
    handleError,
  } = useProductImageCrop(current?.imagen_url ?? undefined);

  if (!current) return null;
  const showImage = Boolean(current.imagen_url) && !imgError;
  const hasReferencePrice = current.precio_referencia != null && Boolean(current.moneda);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={frameRef}
        className="relative aspect-[4/5] overflow-hidden rounded-card border border-line shadow-lux"
        style={frameBackground ? { background: frameBackground } : undefined}
      >
        {showImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={current.imagen_url ?? ""}
              alt=""
              aria-hidden="true"
              crossOrigin="anonymous"
              className="absolute h-0 w-0 opacity-0"
              onLoad={handleLoad}
              onError={handleError}
            />
            <div
              key={current.slug}
              role="img"
              aria-label={`${current.nombre} de ${current.marca}`}
              className="animate-fade-in absolute inset-0 bg-no-repeat"
              style={{
                backgroundImage: `url(${current.imagen_url})`,
                backgroundSize,
                backgroundPosition,
              }}
            />
          </>
        ) : (
          <ImagePlaceholder alt={`${current.nombre} — imagen no disponible`} />
        )}

        {perfumes.length > 1 ? (
          <div className="absolute right-4 top-4 flex gap-1.5">
            {perfumes.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                aria-label={`Mostrar ${p.nombre}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>

      <Link
        href={`/catalogo/${current.slug}`}
        className="absolute -left-4 bottom-6 max-w-[220px] rounded-card border border-line bg-surface p-4 shadow-lux transition hover:-translate-y-0.5 sm:-left-6 sm:p-5"
      >
        <div className="font-sans text-[10.5px] uppercase tracking-[.2em] text-gold-contrast">
          Elección del editor
        </div>
        <div className="mt-1.5 font-display text-lg leading-[1.05] text-ink">{current.nombre}</div>
        <div className="mt-1 font-sans text-xs text-muted">
          {current.marca} ·{" "}
          {hasReferencePrice
            ? Number(current.precio_referencia).toLocaleString("es-AR", {
                style: "currency",
                currency: current.moneda!,
              })
            : "Precio por confirmar"}
        </div>
      </Link>
    </div>
  );
}
