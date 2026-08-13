"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { SimilarityResult } from "@/lib/discovery";
import { DISCOVERY_PROFILE_EVENT, loadDiscoveryProfile } from "@/lib/discoveryProfile";
import { personalizedPerfumeScore } from "@/lib/personalization";
import { trackEvent } from "@/lib/analytics";

export function SimilarPerfumes({ sourceSlug, results }: { sourceSlug: string; results: SimilarityResult[] }) {
  const [profile, setProfile] = useState(() => loadDiscoveryProfile());
  useEffect(() => {
    const refresh = () => setProfile(loadDiscoveryProfile());
    refresh();
    window.addEventListener(DISCOVERY_PROFILE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(DISCOVERY_PROFILE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  const ranked = useMemo(() => results.map((result) => {
    const personal = personalizedPerfumeScore(result.perfume, profile);
    return { ...result, combined: result.score + Math.round(personal.score * 0.35), extraReasons: personal.reasons };
  }).sort((a, b) => b.combined - a.combined || a.perfume.nombre.localeCompare(b.perfume.nombre)), [results, profile]);
  if (ranked.length === 0) return null;
  return <section className="border-t border-line bg-[#fffdf8] dark:bg-[#100d0a]"><div className="mx-auto max-w-[1160px] px-6 py-16 lg:px-10 lg:py-24"><div className="mb-9 flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>Continuar explorando</span><span className="h-px flex-1 bg-line"/><span>06 / Afinidad + tu mapa</span></div><div className="grid grid-cols-1 border-b border-line md:grid-cols-2 lg:grid-cols-3">{ranked.slice(0,6).map(({ perfume, score, reasons, extraReasons }, index) => <article key={perfume.slug} className="border-b border-line py-7 md:px-6 lg:[&:not(:nth-child(3n))]:border-r lg:[&:nth-child(n+4)]:border-b-0"><div className="flex items-start justify-between gap-6"><p className="font-plex text-[8px] uppercase tracking-[.16em] text-gold-contrast">Afinidad {Math.min(99, score)}%</p><span className="font-plex text-[8px] uppercase tracking-[.12em] text-muted">{String(index + 1).padStart(2, "0")}</span></div><p className="mt-8 font-plex text-[9px] uppercase tracking-[.14em] text-muted">{perfume.marca}</p><h3 className="mt-2 font-display text-[30px] leading-[.98] text-ink">{perfume.nombre}</h3><p className="mt-4 min-h-10 font-sans text-xs leading-5 text-muted">{[...extraReasons, ...reasons].slice(0,3).join(" · ") || perfume.familia_olfativa || "Perfil complementario"}</p><div className="mt-7 flex items-center gap-5 font-plex text-[9px] uppercase tracking-[.13em]"><Link href={`/catalogo/${perfume.slug}`} onClick={() => trackEvent("similar_clicked", { source_slug: sourceSlug, target_slug: perfume.slug, position: index + 1, score })} className="border-b border-ink pb-1 text-ink hover:border-gold hover:text-gold-contrast">Ver ficha →</Link><Link href={`/comparar?perfumes=${encodeURIComponent(sourceSlug)},${encodeURIComponent(perfume.slug)}`} onClick={() => trackEvent("compare_started", { source_slug: sourceSlug, target_slug: perfume.slug })} className="border-b border-transparent pb-1 text-muted hover:border-gold hover:text-gold-contrast">Comparar</Link></div></article>)}</div></div></section>;
}
