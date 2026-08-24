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

export function MagazineCoverStory({ article, linkRef }: { article: Article; linkRef?: React.RefObject<HTMLAnchorElement> }) {
  const [imgError, setImgError] = useState(false);
  const showImage = isAuditedCover(article.imagen_portada_url) && !imgError;
  const category = CATEGORIA_LABEL[article.categoria];
  const year = publicationYear(article.publicado_en);

  return (
    <article className="grid min-h-[560px] overflow-hidden border-t border-line lg:grid-cols-[1.12fr_.88fr] lg:min-h-[640px]">
      <div className="relative min-h-[390px] overflow-hidden bg-[#e6e8e4] dark:bg-[#151c18] lg:min-h-full">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.imagen_portada_url!} alt="" onError={() => setImgError(true)} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#d9c8b1]/55 dark:bg-[#151c18]">
            <div className="absolute left-[10%] top-[12%] h-[60%] w-[60%] rounded-[50%] bg-white/55 blur-[90px] dark:bg-[#4a1f24]/20" />
            <p className="absolute inset-x-[7%] top-[13%] max-w-[9ch] select-none font-display text-[clamp(4rem,8vw,8.4rem)] leading-[.78] tracking-[-.065em] text-[#20231f]/[.10] dark:text-[#f7f5f0]/[.08]">{article.titulo}</p>
            <div className="absolute bottom-[10%] right-[7%] h-[28%] w-px bg-[#5a6b54]/30" />
            <div className="absolute bottom-[10%] right-[7%] h-px w-[26%] bg-[#5a6b54]/30" />
          </div>
        )}
      </div>

      <Link ref={linkRef} href={`/magazine/${article.slug}`} className="group flex flex-col justify-between bg-transparent px-1 py-8 outline-none sm:px-7 lg:px-10 lg:py-12">
        <div>
          <div className="flex items-center justify-between gap-5 font-plex text-xs uppercase tracking-[.14em] text-muted"><span>{category}</span>{year ? <span>{year}</span> : null}</div>
          <h2 className="mt-10 max-w-[10ch] font-display text-[43px] leading-[.9] tracking-[-.045em] text-ink transition-colors group-hover:text-[#5a6b54] sm:text-[54px] lg:text-[62px]">{article.titulo}</h2>
          {article.meta_description ? <p className="mt-8 max-w-[42ch] font-sans text-base leading-7 text-muted">{article.meta_description}</p> : null}
        </div>
        <span className="mt-10 inline-flex min-h-12 items-center self-start border-b border-ink font-plex text-xs uppercase tracking-[.13em] text-ink transition group-hover:border-[#5a6b54] group-hover:text-[#5a6b54]">Leer artículo <span aria-hidden="true" className="ml-4">↗</span></span>
      </Link>
    </article>
  );
}

export function MagazineCoverStorySkeleton() {
  return <div className="min-h-[560px] animate-pulse border-t border-line bg-soft lg:min-h-[640px]" aria-busy="true" />;
}
