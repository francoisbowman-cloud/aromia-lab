"use client";

import { useState } from "react";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { CATEGORIA_LABEL } from "@/lib/magazineCategories";
import { pickEditorialImage } from "@/lib/editorialImages";

export function MagazineCoverStory({
  article,
  linkRef,
}: {
  article: Article;
  linkRef?: React.RefObject<HTMLAnchorElement>;
}) {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(article.imagen_portada_url) && !imgError;
  const fallback = pickEditorialImage(article.slug);

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-line lg:aspect-auto lg:h-full lg:min-h-[480px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={showImage ? article.imagen_portada_url! : fallback.src}
        alt={showImage ? "" : fallback.alt}
        onError={() => setImgError(true)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Tarjeta de reseña superpuesta (variante 1B) — la foto queda de fondo,
          el teaser del artículo va en una tarjeta sólida abajo, no como
          texto flotando sobre un degradé. */}
      <Link
        ref={linkRef}
        href={`/magazine/${article.slug}`}
        className="group absolute inset-x-4 bottom-4 block rounded-card bg-surface p-5 shadow-lux transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:inset-x-6 md:bottom-6 md:p-7"
      >
        <p className="font-sans text-[10px] uppercase tracking-[.18em] text-gold-contrast">
          {CATEGORIA_LABEL[article.categoria]}
        </p>
        <h2 className="mt-2 font-display text-xl leading-tight text-ink md:text-2xl">
          {article.titulo}
        </h2>
        <span className="mt-3 inline-block font-sans text-[11px] uppercase tracking-[.1em] text-muted transition-colors group-hover:text-ink">
          Leer artículo →
        </span>
      </Link>
    </div>
  );
}

export function MagazineCoverStorySkeleton() {
  return (
    <div
      className="aspect-[4/5] animate-pulse rounded-card bg-soft lg:aspect-auto lg:h-full lg:min-h-[480px]"
      aria-busy="true"
    />
  );
}
