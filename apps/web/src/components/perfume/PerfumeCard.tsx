"use client";

import { useState } from "react";
import Link from "next/link";
import type { Perfume } from "@/lib/types";
import { ImagePlaceholder } from "./ImagePlaceholder";

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
  const showImage = Boolean(perfume.imagen_url) && !imgError;

  return (
    <Link
      href={`/catalogo/${perfume.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface transition hover:shadow-lux"
    >
      <div className="relative h-56 overflow-hidden bg-soft">
        {showImage ? (
          <div className="absolute inset-0 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={perfume.imagen_url}
              alt={`${perfume.nombre} de ${perfume.marca}`}
              className="h-full w-full object-contain transition group-hover:scale-105"
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
