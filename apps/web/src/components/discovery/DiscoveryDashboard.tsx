"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Perfume } from "@/lib/types";
import { PERFUMERS } from "@/lib/perfumers";
import { clearDiscoveryProfile, DISCOVERY_PROFILE_EVENT, loadDiscoveryProfile, topSignals } from "@/lib/discoveryProfile";
import { rankPersonalizedPerfumes } from "@/lib/personalization";

function label(value: string) { return value.replace(/-/g, " "); }

export function DiscoveryDashboard({ perfumes }: { perfumes: Perfume[] }) {
  const [profile, setProfile] = useState(() => loadDiscoveryProfile());
  useEffect(() => {
    const refresh = () => setProfile(loadDiscoveryProfile());
    refresh();
    window.addEventListener(DISCOVERY_PROFILE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener(DISCOVERY_PROFILE_EVENT, refresh); window.removeEventListener("storage", refresh); };
  }, []);
  const ranked = useMemo(() => rankPersonalizedPerfumes(perfumes, profile, { limit: 8 }), [perfumes, profile]);
  const families = topSignals(profile.families, 6);
  const notes = topSignals(profile.notes, 8);
  const perfumers = topSignals(profile.perfumers, 5).map(([slug, score]) => ({ item: PERFUMERS.find((entry) => entry.slug === slug), slug, score }));

  return <div><section className="grid gap-8 border-y border-line py-10 lg:grid-cols-3"><div><p className="font-plex text-[9px] uppercase tracking-[.16em] text-gold-contrast">Familias</p><div className="mt-5 flex flex-wrap gap-3">{families.length ? families.map(([name]) => <Link key={name} href={`/catalogo?familia=${encodeURIComponent(name)}`} className="border-b border-gold/50 pb-1 font-display text-xl capitalize text-ink">{label(name)}</Link>) : <p className="font-sans text-sm text-muted">Explora algunas fragancias o completa el Quiz para empezar.</p>}</div></div><div><p className="font-plex text-[9px] uppercase tracking-[.16em] text-gold-contrast">Notas</p><div className="mt-5 flex flex-wrap gap-3">{notes.length ? notes.map(([name]) => <Link key={name} href={`/buscar?q=${encodeURIComponent(name)}`} className="border-b border-line pb-1 font-sans text-sm capitalize text-ink">{label(name)}</Link>) : <p className="font-sans text-sm text-muted">Las notas aparecen al visitar fichas con pirámides verificadas.</p>}</div></div><div><p className="font-plex text-[9px] uppercase tracking-[.16em] text-gold-contrast">Perfumistas</p><div className="mt-5 space-y-2">{perfumers.length ? perfumers.map(({ item, slug }) => <Link key={slug} href={`/perfumistas/${slug}`} className="block font-display text-xl text-ink">{item?.name ?? label(slug)}</Link>) : <p className="font-sans text-sm text-muted">Visita una autoría verificada para incorporarla a tu mapa.</p>}</div></div></section><section className="py-14"><div className="mb-8 flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>Recomendaciones vivas</span><span className="h-px flex-1 bg-line"/></div><div className="grid grid-cols-1 border-b border-line sm:grid-cols-2 lg:grid-cols-4">{ranked.map(({ perfume, reasons }) => <Link key={perfume.slug} href={`/catalogo/${perfume.slug}`} className="min-h-52 border-b border-r border-line p-5"><p className="font-plex text-[8px] uppercase tracking-[.15em] text-gold-contrast">{perfume.marca}</p><h2 className="mt-6 font-display text-3xl leading-[.98] text-ink">{perfume.nombre}</h2><p className="mt-4 font-sans text-xs leading-5 text-muted">{reasons.length ? reasons.join(" · ") : perfume.familia_olfativa ?? "Nueva dirección"}</p></Link>)}</div></section><div className="border-t border-line py-8"><button type="button" onClick={() => { clearDiscoveryProfile(); setProfile(loadDiscoveryProfile()); }} className="font-plex text-[9px] uppercase tracking-[.14em] text-muted hover:text-ink">Reiniciar mapa olfativo</button><p className="mt-3 max-w-[50ch] font-sans text-xs leading-5 text-muted">Este mapa vive únicamente en tu navegador y se puede borrar en cualquier momento.</p></div></div>;
}
