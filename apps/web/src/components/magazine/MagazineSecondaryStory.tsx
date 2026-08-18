"use client";

import { useState } from "react";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { CATEGORIA_LABEL } from "@/lib/magazineCategories";

function isAuditedCover(url?: string | null) {
  if (!url) return false;
  return !url.includes("/editorial/");
}

export function MagazineSecondaryStory({
  article,
  isFirst,
}: {
  article: Article;
  isFirst: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const showImage = isAuditedCover(article.imagen_portada_url) && !imgError;

  return (
    <Link
      href={`/magazine/${article.slug}`}
      className={`flex min-h-20 items-start gap-4 py-2 ${isFirst ? "lg:pt-0" : "lg:pt-1"}`}
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[2px]">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.imagen_portada_url!}
            alt=""
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div aria-hidden="true" className="aromia-scene-editorial absolute inset-0" />
        )}
      </div>
      <div>
        <p className="font-sans text-xs uppercase tracking-[.12em] text-gold-contrast">
          {CATEGORIA_LABEL[article.categoria]}
        </p>
        <h3 className="mt-1 font-display text-base leading-[1.2] text-ink">
          {article.titulo}
        </h3>
      </div>
    </Link>
  );
}

export function MagazineSecondaryStorySkeleton({ isFirst }: { isFirst: boolean }) {
  return (
    <div
      className={`flex min-h-20 items-start gap-4 py-2 ${isFirst ? "lg:pt-0" : "lg:pt-1"}`}
      aria-busy="true"
    >
      <div className="h-16 w-16 shrink-0 animate-pulse rounded-[2px] bg-soft" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-3 w-16 animate-pulse rounded bg-soft" />
        <div className="h-4 w-full animate-pulse rounded bg-soft" />
      </div>
    </div>
  );
}
