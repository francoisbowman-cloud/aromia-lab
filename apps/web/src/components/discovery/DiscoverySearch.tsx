"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Perfume } from "@/lib/types";
import type { EditorialIndexItem } from "@/lib/editorialIndex";
import { discoveryTextScore } from "@/lib/discovery";
import { loadDiscoveryProfile } from "@/lib/discoveryProfile";
import { personalizedPerfumeScore } from "@/lib/personalization";
import { trackEvent } from "@/lib/analytics";

export function DiscoverySearch({ perfumes, editorialItems, initialQuery = "" }: { perfumes: Perfume[]; editorialItems: EditorialIndexItem[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [profile, setProfile] = useState(() => loadDiscoveryProfile());
  useEffect(() => { setProfile(loadDiscoveryProfile()); }, []);
  const q = query.trim();
  const perfumeResults = useMemo(() => q ? perfumes.map((perfume) => ({ perfume, textScore: discoveryTextScore(perfume, q), personalScore: personalizedPerfumeScore(perfume, profile).score })).filter((item) => item.textScore > 0).map((item) => ({ perfume: item.perfume, score: item.textScore + Math.round(item.personalScore * 0.2) })).sort((a,b)=>b.score-a.score || a.perfume.nombre.localeCompare(b.perfume.nombre)).slice(0,12) : [], [perfumes, profile, q]);
  const storyResults = useMemo(() => {
    if (!q) return [];
    const needle = q.toLowerCase();
    return editorialItems.filter((item) => `${item.title} ${item.summary} ${item.territory}`.toLowerCase().includes(needle)).slice(0, 8);
  }, [editorialItems, q]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!q) return;
    trackEvent("internal_search", { query_length: q.length, perfume_results: perfumeResults.length, article_results: storyResults.length });
  }

  return <div>
    <form onSubmit={submit} className="border-y border-line py-5"><label htmlFor="discovery-search" className="font-plex text-xs uppercase tracking-[.16em] text-gold-contrast">Buscar por perfume, historia, persona, familia o nota</label><div className="mt-4 flex flex-col gap-3 sm:flex-row"><input id="discovery-search" value={query} onChange={(event)=>setQuery(event.target.value)} autoFocus placeholder="Ej. vetiver, Ropion, amaderado…" className="min-h-14 flex-1 border border-line bg-transparent px-4 font-sans text-base text-ink outline-none focus:border-gold"/><button className="min-h-14 border border-ink px-6 font-plex text-xs uppercase tracking-[.12em] text-ink hover:border-gold hover:text-gold-contrast">Buscar</button></div></form>
    {!q?<div className="py-16"><p className="max-w-[24ch] font-display text-4xl leading-[1.02] text-ink">Empieza por una sensación, una nota, una persona o un nombre.</p><p className="mt-4 max-w-[52ch] font-sans text-sm leading-6 text-muted">La búsqueda recorre fragancias y todo el archivo editorial. Tu mapa olfativo solo ayuda a ordenar resultados de perfume que ya son relevantes.</p></div>:<>
      <section className="py-12"><div className="mb-6 flex items-center gap-4 border-b border-line pb-4 font-plex text-xs uppercase tracking-[.16em] text-muted"><span>Fragancias</span><span className="h-px flex-1 bg-line"/><span>{perfumeResults.length}</span></div><div className="grid grid-cols-1 border-b border-line md:grid-cols-2 lg:grid-cols-3">{perfumeResults.map(({perfume},index)=><Link key={perfume.slug} href={`/catalogo/${perfume.slug}`} onClick={()=>trackEvent("discovery_product_clicked",{context:"search",perfume_slug:perfume.slug,position:index+1})} className="border-b border-r border-line p-6 transition hover:bg-soft/30"><p className="font-plex text-xs uppercase tracking-[.12em] text-gold-contrast">{perfume.marca}</p><h2 className="mt-3 font-display text-3xl text-ink">{perfume.nombre}</h2><p className="mt-3 font-sans text-xs text-muted">{perfume.familia_olfativa ?? "Perfil olfativo"}</p></Link>)}</div>{perfumeResults.length===0?<p className="pt-6 font-sans text-sm text-muted">No encontramos fragancias con esa señal.</p>:null}</section>
      <section className="pb-16"><div className="mb-6 flex items-center gap-4 border-b border-line pb-4 font-plex text-xs uppercase tracking-[.16em] text-muted"><span>Historias</span><span className="h-px flex-1 bg-line"/><span>{storyResults.length}</span></div><div className="grid grid-cols-1 md:grid-cols-2">{storyResults.map((item,index)=><Link key={`${item.source}-${item.slug}`} href={item.href} onClick={()=>trackEvent("search_content_clicked",{article_slug:item.slug,position:index+1})} className="border-b border-r border-line p-6 transition hover:bg-soft/30"><p className="font-plex text-xs uppercase tracking-[.12em] text-gold-contrast">{item.territory}</p><h2 className="mt-3 font-display text-3xl text-ink">{item.title}</h2><p className="mt-4 font-sans text-sm leading-6 text-muted">{item.summary}</p></Link>)}</div>{storyResults.length===0?<p className="pt-6 font-sans text-sm text-muted">No encontramos historias con esa señal.</p>:null}</section>
    </>}
  </div>;
}
