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

  return <section className="bg-[#fffdf8] dark:bg-[#100d0a]"><div className="mx-auto max-w-[1160px] px-6 py-16 lg:px-10 lg:py-24"><div className="mb-10 flex flex-wrap items-baseline justify-between gap-3 font-plex text-xs uppercase tracking-[.12em] text-muted"><span>Continuar explorando</span><span>06 / Afinidad + tu mapa</span></div><div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">{ranked.slice(0,6).map(({ perfume, score, reasons, extraReasons }, index) => <article key={perfume.slug} className="py-2"><div className="flex items-start justify-between gap-6"><p className="font-plex text-xs uppercase tracking-[.12em] text-gold-contrast">Afinidad {Math.min(99, score)}%</p><span className="font-plex text-xs uppercase tracking-[.1em] text-muted">{String(index + 1).padStart(2, "0")}</span></div><p className="mt-7 font-plex text-xs uppercase tracking-[.11em] text-muted">{perfume.marca}</p><h3 className="mt-2 font-display text-[30px] leading-[.98] text-ink">{perfume.nombre}</h3><p className="mt-4 min-h-10 font-sans text-sm leading-6 text-muted">{[...extraReasons, ...reasons].slice(0,3).join(" · ") || perfume.familia_olfativa || "Perfil complementario"}</p><div className="mt-6 flex flex-wrap items-center gap-3 font-plex text-xs uppercase tracking-[.11em]"><Link href={`/catalogo/${perfume.slug}`} onClick={() => trackEvent("similar_perfume_click", { source_slug: sourceSlug, target_slug: perfume.slug, position: index + 1, score })} className="inline-flex min-h-11 items-center border-b border-ink text-ink hover:border-gold hover:text-gold-contrast">Ver ficha →</Link></div></article>)}</div></div></section>;
}
