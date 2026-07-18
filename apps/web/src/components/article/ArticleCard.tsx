"use client";

import { useState } from "react";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { ImagePlaceholder } from "@/components/perfume/ImagePlaceholder";

const CATEGORIA_LABEL: Record<Article["categoria"], string> = {
  resena: "Reseña",
  guia: "Guía",
  analisis: "Análisis",
  academia: "Academia",
  tendencias: "Tendencias",
};

export function ArticleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface" aria-busy="true">
      <div className="h-48 animate-pulse bg-soft" />
      <div className="flex flex-col gap-2 p-5">
        <div className="h-3 w-20 animate-pulse rounded bg-soft" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-soft" />
      </div>
    </div>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(article.imagen_portada_url) && !imgError;

  return (
    <Link
      href={`/articulos/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface transition hover:shadow-lux"
    >
      <div className="relative h-48 overflow-hidden bg-soft">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.imagen_portada_url!}
            alt={article.titulo}
            className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <ImagePlaceholder alt={`${article.titulo} — imagen no disponible`} />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="font-sans text-[11px] uppercase tracking-[.16em] text-gold-contrast">
          {CATEGORIA_LABEL[article.categoria]}
        </p>
        <h3 className="font-display text-lg font-semibold leading-tight text-ink">
          {article.titulo}
        </h3>
      </div>
    </Link>
  );
}
