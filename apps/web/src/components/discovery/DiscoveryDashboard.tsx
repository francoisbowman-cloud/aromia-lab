"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/perfume/ProductImage";
import type { Perfume } from "@/lib/types";
import { PERFUMERS } from "@/lib/perfumers";
import { clearDiscoveryProfile, DISCOVERY_PROFILE_EVENT, loadDiscoveryProfile, topSignals } from "@/lib/discoveryProfile";
import { rankPersonalizedPerfumes } from "@/lib/personalization";
import { trackEvent } from "@/lib/analytics";

function label(value: string) { return value.replace(/-/g, " "); }
function strength(score: number, max: number) { return max > 0 ? Math.max(.28, score / max) : .28; }

export function DiscoveryDashboard({ perfumes }: { perfumes: Perfume[] }) {
  const [profile, setProfile] = useState(() => loadDiscoveryProfile());
  useEffect(() => {
    const refresh = () => setProfile(loadDiscoveryProfile());
    refresh();
    window.addEventListener(DISCOVERY_PROFILE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener(DISCOVERY_PROFILE_EVENT, refresh); window.removeEventListener("storage", refresh); };
  }, []);

  const ranked = useMemo(() => rankPersonalizedPerfumes(perfumes, profile, { limit: 6 }), [perfumes, profile]);
  const families = topSignals(profile.families, 5);
  const notes = topSignals(profile.notes, 8);
  const perfumers = topSignals(profile.perfumers, 4).map(([slug]) => ({ item: PERFUMERS.find((entry) => entry.slug === slug), slug }));
  const hasSignals = families.length + notes.length + perfumers.length > 0;
  const familyMax = families[0]?.[1] ?? 1;
  const noteMax = notes[0]?.[1] ?? 1;

  return (
    <div>
      <section aria-labelledby="signature-title" className="relative overflow-hidden py-12 lg:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-gold/[.07] blur-3xl dark:bg-gold/[.04]" />
        <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
          <div>
            <p className="font-plex text-xs uppercase tracking-[.16em] text-gold-contrast">Tu firma en formación</p>
            <h2 id="signature-title" className="mt-5 max-w-[10ch] font-display text-[40px] leading-[.96] tracking-[-.035em] sm:text-[48px] lg:text-[54px]">Lo que vuelves a mirar deja una pista.</h2>
            <p className="mt-6 max-w-[38ch] font-sans text-base leading-7 text-muted">Aromia reúne afinidades de tu recorrido para mostrar familias, notas y autorías que vale la pena seguir explorando.</p>
            <p className="mt-8 max-w-[34ch] font-display text-2xl leading-snug text-ink">{hasSignals ? "Tu mapa ya tiene una dirección propia." : "Todavía está casi en blanco."}</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <p className="font-plex text-xs uppercase tracking-[.14em] text-muted">Familias que regresan</p>
              <div className="mt-7 space-y-5">
                {families.length ? families.map(([name, score], index) => (
                  <Link key={name} href={`/catalogo?familia=${encodeURIComponent(name)}`} onClick={() => trackEvent("intention_discovery", { signal_type: "family", value: name, position: index + 1 })} className="group block min-h-11 py-1 outline-none focus-visible:ring-2 focus-visible:ring-gold/70">
                    <div className="flex items-end gap-3">
                      <span className="font-plex text-xs text-gold-contrast">0{index + 1}</span>
                      <span className="origin-left font-display capitalize leading-none tracking-[-.025em] text-ink transition-transform group-hover:translate-x-1 motion-reduce:transition-none" style={{ fontSize: `${24 + 12 * strength(score, familyMax)}px` }}>{label(name)}</span>
                    </div>
                  </Link>
                )) : <p className="font-sans text-sm leading-6 text-muted">Explora fragancias o completa el Quiz para empezar.</p>}
              </div>
            </div>

            <div>
              <p className="font-plex text-xs uppercase tracking-[.14em] text-muted">Notas</p>
              <div className="mt-7 flex flex-wrap gap-x-3 gap-y-3">
                {notes.length ? notes.map(([name, score]) => (
                  <Link key={name} href={`/buscar?q=${encodeURIComponent(name)}`} onClick={() => trackEvent("olfactory_note_open", { note: name, source: "discovery_map" })} className="inline-flex min-h-11 items-center font-display capitalize leading-none text-ink transition-colors hover:text-gold-contrast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70" style={{ fontSize: `${17 + 10 * strength(score, noteMax)}px`, opacity: .62 + .38 * strength(score, noteMax) }}>{label(name)}</Link>
                )) : <p className="font-sans text-sm leading-6 text-muted">Las notas aparecen cuando exploras pirámides verificadas.</p>}
              </div>
              <div className="mt-10">
                <p className="font-plex text-xs uppercase tracking-[.14em] text-muted">Perfumistas</p>
                <div className="mt-4 space-y-1">{perfumers.length ? perfumers.map(({ item, slug }) => <Link key={slug} href={`/perfumistas/${slug}`} onClick={() => trackEvent("perfumer_open", { perfumer_slug: slug, source: "discovery_map" })} className="flex min-h-11 items-center font-display text-xl text-ink transition-colors hover:text-gold-contrast">{item?.name ?? label(slug)}</Link>) : <p className="font-sans text-sm leading-6 text-muted">Las autorías se incorporan al visitar perfiles verificados.</p>}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="routes-title" className="py-14 lg:py-20">
        <div className="mb-10 grid gap-5 lg:grid-cols-[1fr_.72fr] lg:items-end">
          <div><p className="font-plex text-xs uppercase tracking-[.14em] text-gold-contrast">Recomendaciones vivas</p><h2 id="routes-title" className="mt-4 max-w-[10ch] font-display text-[38px] leading-[.96] tracking-[-.03em] sm:text-[46px] lg:text-[52px]">Perfumes que continúan la conversación.</h2></div>
          <p className="max-w-[42ch] font-sans text-base leading-7 text-muted lg:justify-self-end">Cada ruta parte de señales concretas de tu recorrido; no inventa atributos nuevos.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ranked.map(({ perfume, reasons }, index) => (
            <Link key={perfume.slug} href={`/catalogo/${perfume.slug}`} onClick={() => trackEvent("similar_perfume_click", { source: "discovery_map", target_slug: perfume.slug, position: index + 1, reason_count: reasons.length })} className="group relative min-h-[430px] overflow-hidden bg-[#fffdf8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/70 dark:bg-[#15110d]">
              <div className="absolute inset-x-0 top-0 h-[60%] overflow-hidden bg-white"><ProductImage slug={perfume.slug} imageUrl={perfume.imagen_url} alt={`${perfume.nombre} de ${perfume.marca}`} mode="card" /></div>
              <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#fffdf8] via-[#fffdf8] to-[#fffdf8]/10 p-6 pt-16 dark:from-[#15110d] dark:via-[#15110d] dark:to-[#15110d]/10">
                <div className="flex items-center justify-between font-plex text-xs uppercase tracking-[.12em] text-muted"><span>Ruta {String(index + 1).padStart(2, "0")}</span><span>{perfume.marca}</span></div>
                <h3 className="mt-4 max-w-[10ch] font-display text-[32px] leading-[.96] tracking-[-.03em] text-ink">{perfume.nombre}</h3>
                <p className="mt-4 max-w-[40ch] font-sans text-sm leading-6 text-muted">{reasons.length ? reasons.join(" · ") : perfume.familia_olfativa ?? "Una dirección distinta dentro de tu mapa."}</p>
                <span className="mt-5 inline-block font-plex text-xs uppercase tracking-[.12em] text-gold-contrast">Seguir esta pista →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-4 py-8 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-[56ch] font-sans text-xs leading-5 text-muted">Este mapa se guarda únicamente en tu navegador. Puedes borrarlo cuando quieras.</p>
        <button type="button" onClick={() => { clearDiscoveryProfile(); setProfile(loadDiscoveryProfile()); trackEvent("discovery_profile_reset"); }} className="min-h-11 self-start px-1 font-plex text-xs uppercase tracking-[.12em] text-muted transition-colors hover:text-ink sm:self-auto">Reiniciar mi mapa</button>
      </div>
    </div>
  );
}
