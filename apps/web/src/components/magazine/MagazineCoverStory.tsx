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
    <Link
      ref={linkRef}
      href={`/magazine/${article.slug}`}
      className="group relative block min-h-[560px] overflow-hidden lg:min-h-[680px] xl:min-h-[720px]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={showImage ? article.imagen_portada_url! : fallback.src}
        alt={showImage ? "" : fallback.alt}
        onError={() => setImgError(true)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent p-7 text-white md:p-10 lg:p-14">
        <p className="font-sans text-[11px] uppercase tracking-[.18em] text-[#e0c591]">
          {CATEGORIA_LABEL[article.categoria]}
        </p>
        <h2 className="mt-5 max-w-[940px] font-display text-[clamp(42px,6vw,88px)] leading-[.93] tracking-[-.035em]">
          {article.titulo}
        </h2>
        {article.meta_description ? (
          <p className="mt-6 max-w-[650px] text-[15px] leading-7 text-white/80 md:text-[17px]">
            {article.meta_description}
          </p>
        ) : null}
        <span className="mt-8 inline-block border-b border-[#c8a86b] pb-2 font-sans text-[12px] uppercase tracking-[.14em] transition-all group-hover:pr-4">
          Leer artículo →
        </span>
      </div>
    </Link>
  );
}

export function MagazineCoverStorySkeleton() {
  return (
    <div className="min-h-[560px] animate-pulse bg-soft lg:min-h-[680px] xl:min-h-[720px]" aria-busy="true">
      <div className="flex h-full flex-col justify-end gap-3 p-10 lg:p-14">
        <div className="h-10 w-2/3 rounded bg-line/60" />
        <div className="h-10 w-1/2 rounded bg-line/60" />
        <div className="h-10 w-1/3 rounded bg-line/60" />
      </div>
    </div>
  );
}
