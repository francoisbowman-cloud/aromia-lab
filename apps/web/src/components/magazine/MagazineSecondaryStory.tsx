"use client";

import { useState } from "react";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { CATEGORIA_LABEL } from "@/lib/magazineCategories";
import { pickEditorialImage } from "@/lib/editorialImages";

export function MagazineSecondaryStory({
  article,
  isFirst,
}: {
  article: Article;
  isFirst: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(article.imagen_portada_url) && !imgError;
  const fallback = pickEditorialImage(article.slug);

  return (
    <Link
      href={`/magazine/${article.slug}`}
      className={`flex items-start gap-3 ${isFirst ? "" : "border-t border-line pt-4"}`}
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[2px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={showImage ? article.imagen_portada_url! : fallback.src}
          alt={showImage ? "" : fallback.alt}
          onError={() => setImgError(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div>
        <p className="font-sans text-[10px] uppercase tracking-[.14em] text-gold-contrast">
          {CATEGORIA_LABEL[article.categoria]}
        </p>
        <h3 className="mt-1 font-display text-[15px] leading-[1.2] text-ink">
          {article.titulo}
        </h3>
      </div>
    </Link>
  );
}

export function MagazineSecondaryStorySkeleton({ isFirst }: { isFirst: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 ${isFirst ? "" : "border-t border-line pt-4"}`}
      aria-busy="true"
    >
      <div className="h-14 w-14 shrink-0 animate-pulse rounded-[2px] bg-soft" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-3 w-16 animate-pulse rounded bg-soft" />
        <div className="h-4 w-full animate-pulse rounded bg-soft" />
      </div>
    </div>
  );
}
