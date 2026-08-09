"use client";

import { useState } from "react";
import type { Perfume } from "@/lib/types";
import { ImagePlaceholder } from "./ImagePlaceholder";

export function HeroHeaderSkeleton() {
  return (
    <section
      className="grid overflow-hidden rounded-card border border-line bg-surface shadow-lux lg:grid-cols-[1.08fr_.92fr]"
      aria-busy="true"
    >
      <div className="aspect-[4/5] animate-pulse bg-soft" />
      <div className="flex flex-col justify-center gap-4 p-8 lg:p-12">
        <div className="h-3 w-24 animate-pulse rounded bg-soft" />
        <div className="h-10 w-3/4 animate-pulse rounded bg-soft" />
        <div className="h-4 w-full animate-pulse rounded bg-soft" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-soft" />
      </div>
    </section>
  );
}

export function HeroHeader({ perfume }: { perfume: Perfume }) {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(perfume.imagen_url) && !imgError;
  const familyLabel = perfume.familia_olfativa || "Familia por confirmar";

  return (
    <section className="grid overflow-hidden rounded-card border border-line bg-surface shadow-lux lg:grid-cols-[1.08fr_.92fr]">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        {showImage ? (
          <div className="absolute inset-0 p-10 lg:p-14">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={perfume.imagen_url ?? ""}
              alt={`${perfume.nombre} de ${perfume.marca}`}
              className="h-full w-full object-contain"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <ImagePlaceholder alt={`${perfume.nombre} — imagen no disponible`} />
        )}
      </div>

      <div className="flex flex-col justify-center gap-4 p-8 lg:p-12">
        <p className="font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast">
          {familyLabel}
        </p>
        <h1 className="font-display text-[40px] font-semibold leading-[0.98] text-ink lg:text-[56px]">
          {perfume.nombre}
        </h1>
        <p className="font-sans text-lg text-muted">{perfume.marca}</p>

        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 font-sans text-sm">
          <div>
            <dt className="text-[11px] uppercase tracking-[.1em] text-muted">Género</dt>
            <dd className="mt-1 capitalize text-ink">{perfume.genero}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[.1em] text-muted">Concentración</dt>
            <dd className="mt-1 text-ink">{perfume.concentracion ?? "—"}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-[11px] uppercase tracking-[.1em] text-muted">Familia olfativa</dt>
            <dd className="mt-1 text-ink">{familyLabel}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
