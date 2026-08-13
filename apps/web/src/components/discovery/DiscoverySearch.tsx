"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import type { Article, Perfume } from "@/lib/types";
import { discoveryTextScore } from "@/lib/discovery";
import { loadDiscoveryProfile } from "@/lib/discoveryProfile";
import { personalizedPerfumeScore } from "@/lib/personalization";
import { trackEvent } from "@/lib/analytics";

export function DiscoverySearch({ perfumes, articles, initialQuery = "" }: { perfumes: Perfume[]; articles: Article[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const profile = useMemo(() => loadDiscoveryProfile(), []);
  const q = query.trim();
  const perfumeResults = useMemo(() => q ? perfumes.map((perfume) => ({ perfume, score: discoveryTextScore(perfume, q) + Math.round(personalizedPerfumeScore(perfume, profile).score * 0.2) })).filter((item) => discoveryTextScore(item.perfume, q) > 0).sort((a,b)=>b.score-a.score || a.perfume.nombre.localeCompare(b.perfume.nombre)).slice(0,12) : [], [perfumes, profile, q]);
  const articleResults = useMemo(() => {
    if (!q) return [];
    const needle = q.toLowerCase();
    return articles.filter((article) => `${article.titulo} ${article.categoria} ${article.meta_description ?? ""}`.toLowerCase().includes(needle)).slice(0,6);
  }, [articles, q]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!q) return;
    trackEvent("internal_search", { query_length: q.length, perfume_results: perfumeResults.length, article_results: articleResults.length });
  }

  return <div>
    <form onSubmit={submit} className="border-y border-line py-5"><label htmlFor="discovery-search" className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">Buscar por perfume, marca, familia o nota</label><div className="mt-4 flex gap-3"><input id="discovery-search" value={query} onChange={(event)=>setQuery(event.target.value)} autoFocus placeholder="Ej. vetiver, Dior, amaderado…" className="min-h-14 flex-1 border border-line bg-transparent px-4 font-sans text-base text-ink outline-none focus:border-gold"/><button className="min-h-14 border border-ink px-6 font-plex text-[9px] uppercase tracking-[.14em] text-ink hover:border-gold hover:text-gold-contrast">Buscar</button></div></form>
    {!q?<div className="py-16"><p className="max-w-[24ch] font-display text-4xl leading-[1.02] text-ink">Empieza por una sensación, una nota o un nombre.</p><p className="mt-4 max-w-[48ch] font-sans text-sm leading-6 text-muted">La búsqueda cruza el catálogo y Magazine; tu mapa olfativo sólo desempata y reordena resultados relevantes.</p></div>:<>
      <section className="py-12"><div className="mb-6 flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>Fragancias</span><span className="h-px flex-1 bg-line"/><span>{perfumeResults.length}</span></div><div className="grid grid-cols-1 border-b border-line md:grid-cols-2 lg:grid-cols-3">{perfumeResults.map(({perfume},index)=><Link key={perfume.slug} href={`/catalogo/${perfume.slug}`} onClick={()=>trackEvent("discovery_product_clicked",{context:"search",perfume_slug:perfume.slug,position:index+1})} className="border-b border-r border-line p-6"><p className="font-plex text-[8px] uppercase tracking-[.14em] text-gold-contrast">{perfume.marca}</p><h2 className="mt-3 font-display text-3xl text-ink">{perfume.nombre}</h2><p className="mt-3 font-sans text-xs text-muted">{perfume.familia_olfativa ?? "Perfil olfativo"}</p></Link>)}</div>{perfumeResults.length===0?<p className="font-sans text-sm text-muted">No encontramos fragancias con esa señal.</p>:null}</section>
      <section className="pb-16"><div className="mb-6 flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>Magazine</span><span className="h-px flex-1 bg-line"/><span>{articleResults.length}</span></div><div className="grid grid-cols-1 md:grid-cols-2">{articleResults.map((article,index)=><Link key={article.slug} href={`/magazine/${article.slug}`} onClick={()=>trackEvent("search_content_clicked",{article_slug:article.slug,position:index+1})} className="border-b border-r border-line p-6"><p className="font-plex text-[8px] uppercase tracking-[.14em] text-gold-contrast">{article.categoria}</p><h2 className="mt-3 font-display text-3xl text-ink">{article.titulo}</h2></Link>)}</div></section>
    </>}
  </div>;
}
