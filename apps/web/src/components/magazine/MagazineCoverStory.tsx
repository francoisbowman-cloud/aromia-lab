"use client";

import { useState } from "react";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { CATEGORIA_LABEL } from "@/lib/magazineCategories";

function isAuditedCover(url?: string | null) {
  if (!url) return false;
  return !url.includes("/editorial/");
}

function publicationYear(value?: string | null) {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : String(parsed.getFullYear());
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
  const category = CATEGORIA_LABEL[article.categoria];
  const year = publicationYear(article.publicado_en);

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
        <div
          aria-hidden="true"
          className="aromia-scene-editorial absolute inset-0 overflow-hidden border border-[#d7c39e]/40 bg-[#efe6d6] dark:border-[#6f5b3e]/40 dark:bg-[#17130f]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,.86),transparent_28%),radial-gradient(circle_at_78%_76%,rgba(168,127,74,.22),transparent_34%)] dark:opacity-35" />
          <div className="absolute inset-x-[7%] top-[7%] flex items-center justify-between border-b border-[#a77f4a]/35 pb-4 font-plex text-[9px] uppercase tracking-[.18em] text-[#8f6d41] dark:text-[#d3b27c]">
            <span>{category}</span>
            {year ? <span>{year}</span> : null}
          </div>
          <div className="absolute inset-x-[5%] top-[18%] overflow-hidden">
            <p className="max-w-[9.5ch] select-none font-display text-[clamp(4rem,9vw,8.8rem)] font-medium leading-[.76] tracking-[-.065em] text-[#241c15]/[.12] dark:text-[#f2ebdd]/[.09]">
              {article.titulo}
            </p>
          </div>
          <div className="absolute bottom-[15%] right-[7%] h-[22%] w-px bg-[#a77f4a]/35" />
          <div className="absolute bottom-[15%] right-[5.5%] h-px w-[22%] bg-[#a77f4a]/35" />
        </div>
      )}
      <Link
        ref={linkRef}
        href={`/magazine/${article.slug}`}
        className="group absolute inset-x-4 bottom-4 block rounded-card bg-surface p-5 shadow-lux transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:inset-x-6 md:bottom-6 md:p-7"
      >
        <p className="font-sans text-xs uppercase tracking-[.13em] text-gold-contrast">
          {category}
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
