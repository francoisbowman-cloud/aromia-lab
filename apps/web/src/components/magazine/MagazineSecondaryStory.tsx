"use client";

import { useState } from "react";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { CATEGORIA_LABEL } from "@/lib/magazineCategories";

function isAuditedCover(url?: string | null) {
  if (!url) return false;
  return !url.includes("/editorial/");
}

export function MagazineSecondaryStory({ article, isFirst }: { article: Article; isFirst: boolean }) {
  const [imgError, setImgError] = useState(false);
  const showImage = isAuditedCover(article.imagen_portada_url) && !imgError;

  return (
    <Link href={`/magazine/${article.slug}`} className={`group block border-t border-line pt-4 outline-none ${isFirst ? "lg:pt-4" : ""}`}>
      <div className="relative aspect-[16/10] overflow-hidden bg-[#e6e8e4] dark:bg-[#151c18]">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.imagen_portada_url!} alt="" onError={() => setImgError(true)} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015] motion-reduce:transition-none" />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 bg-[#d9c8b1]/45 dark:bg-[#151c18]">
            <div className="absolute left-[12%] top-[14%] h-[54%] w-[54%] rounded-[50%] bg-white/55 blur-[70px] dark:bg-[#4a1f24]/18" />
            <span className="absolute bottom-5 right-5 font-display text-[56px] leading-none text-[#20231f]/10 dark:text-[#f7f5f0]/10">A</span>
          </div>
        )}
      </div>
      <div className="py-5">
        <p className="font-plex text-xs uppercase tracking-[.13em] text-[#5a6b54] dark:text-[#b8c5b3]">{CATEGORIA_LABEL[article.categoria]}</p>
        <h3 className="mt-3 max-w-[16ch] font-display text-[27px] leading-[1.02] tracking-[-.025em] text-ink transition-colors group-hover:text-[#5a6b54]">{article.titulo}</h3>
        <span className="mt-4 inline-flex min-h-11 items-center font-plex text-xs uppercase tracking-[.12em] text-muted transition group-hover:text-ink">Abrir →</span>
      </div>
    </Link>
  );
}

export function MagazineSecondaryStorySkeleton({ isFirst }: { isFirst: boolean }) {
  return (
    <div className={`border-t border-line pt-4 ${isFirst ? "lg:pt-4" : ""}`} aria-busy="true">
      <div className="aspect-[16/10] animate-pulse bg-soft" />
      <div className="space-y-3 py-5"><div className="h-3 w-20 animate-pulse bg-soft"/><div className="h-7 w-4/5 animate-pulse bg-soft"/></div>
    </div>
  );
}
