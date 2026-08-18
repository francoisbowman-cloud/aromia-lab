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
  const perfumers = topSignals(profile.perfumers, 5).map(([slug]) => ({ item: PERFUMERS.find((entry) => entry.slug === slug), slug }));

  return (
    <div>
      <section className="grid gap-10 py-10 lg:grid-cols-3">
        <div>
          <p className="font-plex text-[9px] uppercase tracking-[.16em] text-gold-contrast">Familias</p>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-3">{families.length ? families.map(([name]) => <Link key={name} href={`/catalogo?familia=${encodeURIComponent(name)}`} className="font-display text-xl capitalize text-ink transition hover:text-gold-contrast">{label(name)}</Link>) : <p className="font-sans text-sm leading-6 text-muted">Explora fragancias o completa el Quiz para empezar.</p>}</div>
        </div>
        <div>
          <p className="font-plex text-[9px] uppercase tracking-[.16em] text-gold-contrast">Notas</p>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-3">{notes.length ? notes.map(([name]) => <Link key={name} href={`/buscar?q=${encodeURIComponent(name)}`} className="font-sans text-sm capitalize text-ink transition hover:text-gold-contrast">{label(name)}</Link>) : <p className="font-sans text-sm leading-6 text-muted">Las notas aparecen a medida que visitas perfumes con pirámides verificadas.</p>}</div>
        </div>
        <div>
          <p className="font-plex text-[9px] uppercase tracking-[.16em] text-gold-contrast">Perfumistas</p>
          <div className="mt-5 space-y-2">{perfumers.length ? perfumers.map(({ item, slug }) => <Link key={slug} href={`/perfumistas/${slug}`} className="block font-display text-xl text-ink transition hover:text-gold-contrast">{item?.name ?? label(slug)}</Link>) : <p className="font-sans text-sm leading-6 text-muted">Las autorías verificadas se incorporan cuando las exploras.</p>}</div>
        </div>
      </section>

      <section className="py-14">
        <div className="mb-8">
          <p className="font-plex text-[9px] uppercase tracking-[.18em] text-muted">Recomendaciones para seguir explorando</p>
          <p className="mt-3 max-w-[48ch] font-sans text-sm leading-6 text-muted">Cada selección explica la relación con lo que ya has visto, sin alterar los datos del catálogo.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ranked.map(({ perfume, reasons }) => (
            <Link key={perfume.slug} href={`/catalogo/${perfume.slug}`} className="group min-h-52 bg-[#fffdf8] p-5 transition hover:bg-[#f4ecdf] dark:bg-[#14100c] dark:hover:bg-[#1a1510]">
              <p className="font-plex text-[8px] uppercase tracking-[.15em] text-gold-contrast">{perfume.marca}</p>
              <h2 className="mt-6 font-display text-3xl leading-[.98] text-ink">{perfume.nombre}</h2>
              <p className="mt-4 font-sans text-sm leading-6 text-muted">{reasons.length ? reasons.join(" · ") : perfume.familia_olfativa ?? "Una dirección distinta"}</p>
              <span className="mt-6 inline-block font-plex text-[8px] uppercase tracking-[.14em] text-muted transition group-hover:text-gold-contrast">Ver perfume →</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="py-8">
        <button type="button" onClick={() => { clearDiscoveryProfile(); setProfile(loadDiscoveryProfile()); }} className="font-plex text-[9px] uppercase tracking-[.14em] text-muted hover:text-ink">Reiniciar mapa olfativo</button>
        <p className="mt-3 max-w-[50ch] font-sans text-xs leading-5 text-muted">Tu mapa se guarda en este navegador y puedes borrarlo cuando quieras.</p>
      </div>
    </div>
  );
}
