"use client";

import { useState } from "react";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { CATEGORIA_LABEL } from "@/lib/magazineCategories";

const FALLBACK_GRADIENTS = [
  "linear-gradient(145deg,#ece2d2,#ba8f57_48%,#5b3c21)",
  "linear-gradient(145deg,#16110c,#5b4a36_48%,#d7bf94)",
  "linear-gradient(145deg,#d8cfbd,#8a7861_55%,#2e2923)",
];

export function MagazineSecondaryStory({
  article,
  index,
  isFirst,
}: {
  article: Article;
  index: number;
  isFirst: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(article.imagen_portada_url) && !imgError;
  const gradient = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];

  return (
    <Link
      href={`/magazine/${article.slug}`}
      className={`grid grid-cols-[40%_1fr] gap-5 lg:grid-cols-1 lg:gap-0 ${
        isFirst ? "" : "border-t border-line pt-5 lg:pt-6"
      }`}
    >
      <div
        className="relative min-h-[150px] overflow-hidden lg:min-h-[150px] lg:max-h-[185px]"
        style={showImage ? undefined : { background: gradient }}
      >
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.imagen_portada_url!}
            alt=""
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
      </div>
      <div className="lg:mt-5">
        <p className="font-sans text-[10px] uppercase tracking-[.16em] text-gold">
          {CATEGORIA_LABEL[article.categoria]}
        </p>
        <h3 className="mt-2 font-display text-[26px] leading-[1.05] text-ink lg:text-[28px]">
          {article.titulo}
        </h3>
        {article.meta_description ? (
          <p className="mt-3 line-clamp-2 font-sans text-[13px] text-muted">
            {article.meta_description}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export function MagazineSecondaryStorySkeleton({ isFirst }: { isFirst: boolean }) {
  return (
    <div
      className={`grid grid-cols-[40%_1fr] gap-5 lg:grid-cols-1 lg:gap-0 ${
        isFirst ? "" : "border-t border-line pt-5 lg:pt-6"
      }`}
      aria-busy="true"
    >
      <div className="min-h-[150px] animate-pulse bg-soft" />
      <div className="flex flex-col gap-2 lg:mt-5">
        <div className="h-3 w-16 animate-pulse rounded bg-soft" />
        <div className="h-6 w-full animate-pulse rounded bg-soft" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-soft" />
      </div>
    </div>
  );
}
