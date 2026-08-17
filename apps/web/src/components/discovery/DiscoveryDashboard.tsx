"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/perfume/ProductImage";
import type { Perfume } from "@/lib/types";
import { PERFUMERS } from "@/lib/perfumers";
import { clearDiscoveryProfile, DISCOVERY_PROFILE_EVENT, loadDiscoveryProfile, topSignals } from "@/lib/discoveryProfile";
import { rankPersonalizedPerfumes } from "@/lib/personalization";

function label(value: string) { return value.replace(/-/g, " "); }
function strength(score: number, max: number) { return max > 0 ? Math.max(.24, score / max) : .24; }

export function DiscoveryDashboard({ perfumes }: { perfumes: Perfume[] }) {
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

  const ranked = useMemo(() => rankPersonalizedPerfumes(perfumes, profile, { limit: 6 }), [perfumes, profile]);
  const families = topSignals(profile.families, 6);
  const notes = topSignals(profile.notes, 9);
  const perfumers = topSignals(profile.perfumers, 5).map(([slug, score]) => ({ item: PERFUMERS.find((entry) => entry.slug === slug), slug, score }));
  const hasSignals = families.length + notes.length + perfumers.length > 0;
  const familyMax = families[0]?.[1] ?? 1;
  const noteMax = notes[0]?.[1] ?? 1;

  return (
    <div className="border-t border-line">
      <section aria-labelledby="signature-title" className="relative overflow-hidden border-b border-line py-12 lg:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-gold/[.08] blur-3xl dark:bg-gold/[.05]" />
        <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
          <div className="flex flex-col justify-between">
            <div>
              <p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Tu firma en formación</p>
              <h2 id="signature-title" className="mt-5 max-w-[9ch] font-display text-[46px] leading-[.9] tracking-[-.04em] sm:text-[58px]">Lo que vuelves a mirar dice algo.</h2>
              <p className="mt-6 max-w-[38ch] font-sans text-sm leading-7 text-muted">Aromia no te asigna una etiqueta. Lee patrones discretos de tu recorrido y los devuelve como materia, familias y autorías que puedes seguir explorando.</p>
            </div>
            <div className="mt-10 border-l border-gold/50 pl-5 lg:mt-16">
              <p className="max-w-[34ch] font-display text-2xl leading-snug text-ink">{hasSignals ? "Tu mapa ya tiene tensión propia." : "Todavía está casi en blanco."}</p>
              <p className="mt-2 max-w-[38ch] font-sans text-xs leading-5 text-muted">{hasSignals ? "Cuanto más exploras, más claro se vuelve el contraste entre lo que te atrae y lo que dejas pasar." : "Explora fragancias o completa el Quiz. El mapa crecerá solo con señales reales de tu recorrido."}</p>
            </div>
          </div>

          <div className="relative min-h-[520px] border-y border-line py-8 sm:min-h-[560px] sm:py-10">
            <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-line" />
            <div aria-hidden="true" className="absolute bottom-0 left-1/2 top-0 w-px bg-line" />

            <div className="relative grid h-full min-h-[440px] grid-cols-2 gap-x-8 sm:min-h-[480px] sm:gap-x-12">
              <div className="flex flex-col justify-between pr-2 sm:pr-6">
                <p className="font-plex text-[8px] uppercase tracking-[.18em] text-muted">Familias que insisten</p>
                <div className="space-y-5 py-8">
                  {families.length ? families.map(([name, score], index) => (
                    <Link key={name} href={`/catalogo?familia=${encodeURIComponent(name)}`} className="group block outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#fbf8f3] dark:focus-visible:ring-offset-[#0f0c09]">
                      <div className="flex items-end gap-3">
                        <span className="font-display text-[11px] text-gold-contrast">0{index + 1}</span>
                        <span className="origin-left font-display capitalize leading-none tracking-[-.03em] text-ink transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" style={{ fontSize: `${28 + 17 * strength(score, familyMax)}px` }}>{label(name)}</span>
                      </div>
                      <div className="mt-2 h-px bg-line"><div className="h-px bg-gold/80" style={{ width: `${26 + 74 * strength(score, familyMax)}%` }} /></div>
                    </Link>
                  )) : <p className="max-w-[18ch] font-display text-3xl leading-tight text-muted">Sin una familia dominante todavía.</p>}
                </div>
                <p className="font-sans text-[11px] leading-5 text-muted">No es un ranking de calidad. Es frecuencia de afinidad dentro de tu recorrido.</p>
              </div>

              <div className="flex flex-col justify-between pl-2 sm:pl-6">
                <p className="text-right font-plex text-[8px] uppercase tracking-[.18em] text-muted">Materia recurrente</p>
                <div className="flex flex-wrap content-center justify-end gap-x-3 gap-y-4 py-8 text-right">
                  {notes.length ? notes.map(([name, score]) => (
                    <Link key={name} href={`/buscar?q=${encodeURIComponent(name)}`} className="font-display capitalize leading-none text-ink transition-colors hover:text-gold-contrast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70" style={{ fontSize: `${18 + 20 * strength(score, noteMax)}px`, opacity: .55 + .45 * strength(score, noteMax) }}>{label(name)}</Link>
                  )) : <p className="max-w-[18ch] font-display text-3xl leading-tight text-muted">Las notas aparecerán al entrar en pirámides verificadas.</p>}
                </div>
                <div>
                  <p className="mb-4 text-right font-plex text-[8px] uppercase tracking-[.18em] text-muted">Autorías</p>
                  <div className="space-y-2 text-right">
                    {perfumers.length ? perfumers.map(({ item, slug }) => <Link key={slug} href={`/perfumistas/${slug}`} className="block font-display text-xl text-ink transition-colors hover:text-gold-contrast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70">{item?.name ?? label(slug)}</Link>) : <p className="font-sans text-[11px] leading-5 text-muted">Las autorías aparecen solo cuando visitas una atribución verificada.</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="routes-title" className="py-14 lg:py-20">
        <div className="mb-10 grid gap-5 border-b border-line pb-6 lg:grid-cols-[1fr_.72fr] lg:items-end">
          <div><p className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">Siguientes rutas</p><h2 id="routes-title" className="mt-4 max-w-[9ch] font-display text-[44px] leading-[.92] tracking-[-.035em] sm:text-[58px]">Perfumes que continúan la conversación.</h2></div>
          <p className="max-w-[42ch] font-sans text-sm leading-6 text-muted lg:justify-self-end">No son “productos para ti” en abstracto. Cada ruta existe porque comparte señales concretas con lo que ya exploraste.</p>
        </div>

        <div className="grid border-b border-line sm:grid-cols-2 lg:grid-cols-3">
          {ranked.map(({ perfume, reasons }, index) => (
            <Link key={perfume.slug} href={`/catalogo/${perfume.slug}`} className="group relative min-h-[440px] overflow-hidden border-r border-t border-line bg-[#f7f3eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/70 dark:bg-[#15110d]">
              <div className="absolute inset-x-0 top-0 h-[62%] overflow-hidden bg-[#f7f3eb] dark:bg-[#f1ece3]">
                <ProductImage slug={perfume.slug} imageUrl={perfume.imagen_url} alt={`${perfume.nombre} de ${perfume.marca}`} mode="card" />
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f7f3eb] to-transparent dark:from-[#15110d]" />
              </div>
              <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-7">
                <div className="flex items-center justify-between font-plex text-[8px] uppercase tracking-[.16em] text-muted"><span>Ruta {String(index + 1).padStart(2, "0")}</span><span>{perfume.marca}</span></div>
                <h3 className="mt-4 max-w-[9ch] font-display text-[34px] leading-[.92] tracking-[-.03em] text-ink sm:text-[40px]">{perfume.nombre}</h3>
                <p className="mt-4 max-w-[40ch] font-sans text-xs leading-5 text-muted">{reasons.length ? reasons.join(" · ") : perfume.familia_olfativa ?? "Una dirección nueva dentro de tu mapa."}</p>
                <div className="mt-5 flex items-center justify-between border-t border-line pt-4"><span className="font-plex text-[8px] uppercase tracking-[.15em] text-gold-contrast">Seguir esta pista</span><span className="font-display text-xl text-gold-contrast transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">→</span></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-4 border-t border-line py-8 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="max-w-[56ch] font-sans text-xs leading-5 text-muted">Este mapa vive únicamente en tu navegador. No altera el catálogo ni inventa atributos: reorganiza señales que ya existen y puedes borrarlo cuando quieras.</p></div>
        <button type="button" onClick={() => { clearDiscoveryProfile(); setProfile(loadDiscoveryProfile()); }} className="min-h-11 self-start border-b border-line font-plex text-[9px] uppercase tracking-[.14em] text-muted transition-colors hover:border-gold hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 sm:self-auto">Reiniciar mi firma</button>
      </div>
    </div>
  );
}
