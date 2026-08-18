"use client";

import { useState } from "react";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { CATEGORIA_LABEL } from "@/lib/magazineCategories";

function isAuditedCover(url?: string | null) {
  if (!url) return false;
  return !url.includes("/editorial/");
}

export function MagazineCoverStory({
  article,
  linkRef,
}: {
  article: Article;
  linkRef?: React.RefObject<HTMLAnchorElement>;
}) {
  const [imgError, setImgError] = useState(false);
  const showImage = isAuditedCover(article.imagen_portada_url) && !imgError;

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-card lg:aspect-auto lg:h-full lg:min-h-[480px]">
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.imagen_portada_url!}
          alt=""
          onError={() => setImgError(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div aria-hidden="true" className="aromia-scene-editorial absolute inset-0">
          <div className="absolute inset-[12%] bg-[radial-gradient(circle_at_25%_30%,rgba(255,255,255,.78),transparent_26%),radial-gradient(circle_at_72%_68%,rgba(168,127,74,.16),transparent_30%)]" />
        </div>
      )}
      <Link
        ref={linkRef}
        href={`/magazine/${article.slug}`}
        className="group absolute inset-x-4 bottom-4 block rounded-card bg-surface p-5 shadow-lux transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:inset-x-6 md:bottom-6 md:p-7"
      >
        <p className="font-sans text-xs uppercase tracking-[.13em] text-gold-contrast">
          {CATEGORIA_LABEL[article.categoria]}
        </p>
        <h2 className="mt-2 font-display text-xl leading-tight text-ink md:text-2xl">
          {article.titulo}
        </h2>
        <span className="mt-3 inline-flex min-h-11 items-center font-sans text-xs uppercase tracking-[.1em] text-muted transition-colors group-hover:text-ink">
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
