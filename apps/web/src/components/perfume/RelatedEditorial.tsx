"use client";

import Link from "next/link";
import type { Article } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

export function RelatedEditorial({ articles, perfumeSlug }: { articles: Article[]; perfumeSlug: string }) {
  if (articles.length === 0) return null;
  return (
    <section className="bg-[#f3eadc] dark:bg-[#15110d]">
      <div className="mx-auto max-w-[1160px] px-6 py-16 lg:px-10 lg:py-24">
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-3 font-plex text-xs uppercase tracking-[.12em] text-muted"><span>Del objeto a la lectura</span><span>07 / Magazine</span></div>
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((article, index) => <Link key={article.id} href={`/magazine/${article.slug}`} onClick={() => trackEvent("product_to_content", { perfume_slug: perfumeSlug, article_slug: article.slug, position: index + 1 })} className="group flex min-h-52 flex-col py-3"><p className="font-plex text-xs uppercase tracking-[.12em] text-gold-contrast">{article.categoria}</p><h3 className="mt-7 max-w-[15ch] font-display text-[30px] leading-[.98] text-ink">{article.titulo}</h3><p className="mt-auto inline-flex min-h-11 items-center pt-6 font-plex text-xs uppercase tracking-[.11em] text-muted transition group-hover:text-gold-contrast">Leer en Magazine →</p></Link>)}
        </div>
      </div>
    </section>
  );
}
