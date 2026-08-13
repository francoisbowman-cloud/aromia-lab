"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Perfume } from "@/lib/types";
import { DISCOVERY_PROFILE_EVENT, loadDiscoveryProfile } from "@/lib/discoveryProfile";
import { rankPersonalizedPerfumes } from "@/lib/personalization";

export function PersonalizedDiscoveryRail({ perfumes, source, title = "Explora después" }: { perfumes: Perfume[]; source?: Perfume | null; title?: string }) {
  const [profile, setProfile] = useState(() => loadDiscoveryProfile());
  useEffect(() => {
    const refresh = () => setProfile(loadDiscoveryProfile());
    refresh();
    window.addEventListener(DISCOVERY_PROFILE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener(DISCOVERY_PROFILE_EVENT, refresh); window.removeEventListener("storage", refresh); };
  }, []);
  const ranked = useMemo(() => rankPersonalizedPerfumes(perfumes, profile, { source, limit: 6 }), [perfumes, profile, source]);
  if (!ranked.length) return null;
  return <section className="border-t border-line bg-[#f7f1e7] dark:bg-[#15110d]"><div className="mx-auto max-w-[1180px] px-6 py-16 lg:px-10 lg:py-24"><div className="mb-8 flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>{title}</span><span className="h-px flex-1 bg-line"/><span>Según tu mapa</span></div><div className="grid grid-cols-1 border-b border-line md:grid-cols-2 lg:grid-cols-3">{ranked.map(({ perfume, reasons }, index) => <Link key={perfume.slug} href={`/catalogo/${perfume.slug}`} className="group min-h-56 border-b border-r border-line p-6"><div className="flex items-center justify-between"><p className="font-plex text-[8px] uppercase tracking-[.15em] text-gold-contrast">{perfume.marca}</p><span className="font-plex text-[8px] uppercase tracking-[.12em] text-muted">{String(index + 1).padStart(2,"0")}</span></div><h3 className="mt-8 max-w-[13ch] font-display text-3xl leading-[.98] text-ink">{perfume.nombre}</h3><p className="mt-4 min-h-10 font-sans text-xs leading-5 text-muted">{reasons.length ? reasons.join(" · ") : perfume.familia_olfativa ?? "Nueva dirección olfativa"}</p><span className="mt-7 inline-block border-b border-transparent pb-1 font-plex text-[9px] uppercase tracking-[.14em] text-muted group-hover:border-gold group-hover:text-gold-contrast">Abrir ruta →</span></Link>)}</div></div></section>;
}
