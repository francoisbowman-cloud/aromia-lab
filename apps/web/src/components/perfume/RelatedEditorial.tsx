"use client";

import Link from "next/link";
import type { Article } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

export function RelatedEditorial({ articles, perfumeSlug }: { articles: Article[]; perfumeSlug: string }) {
  if (articles.length === 0) return null;
  return (
    <section className="border-t border-line bg-[#f3eadc] dark:bg-[#15110d]">
      <div className="mx-auto max-w-[1160px] px-6 py-16 lg:px-10 lg:py-24">
        <div className="mb-9 flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>Del objeto a la lectura</span><span className="h-px flex-1 bg-line"/><span>07 / Magazine</span></div>
        <div className="grid grid-cols-1 border-b border-line md:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((article, index) => <Link key={article.id} href={`/magazine/${article.slug}`} onClick={() => trackEvent("product_to_content", { perfume_slug: perfumeSlug, article_slug: article.slug, position: index + 1 })} className="group min-h-52 border-b border-line py-7 md:px-6 md:[&:not(:last-child)]:border-r md:border-b-0"><p className="font-plex text-[8px] uppercase tracking-[.16em] text-gold-contrast">{article.categoria}</p><h3 className="mt-8 max-w-[15ch] font-display text-[30px] leading-[.98] text-ink">{article.titulo}</h3><p className="mt-6 font-plex text-[9px] uppercase tracking-[.13em] text-muted transition group-hover:text-gold-contrast">Leer en Magazine →</p></Link>)}
        </div>
      </div>
    </section>
  );
}
