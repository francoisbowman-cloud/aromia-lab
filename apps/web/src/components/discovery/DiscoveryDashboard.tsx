"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/perfume/ProductImage";
import type { Perfume } from "@/lib/types";
import { PERFUMERS } from "@/lib/perfumers";
import { clearDiscoveryProfile, DISCOVERY_PROFILE_EVENT, loadDiscoveryProfile, topSignals } from "@/lib/discoveryProfile";
import { familiesForValue } from "@/lib/olfactiveFamilies";
import { rankPersonalizedPerfumes } from "@/lib/personalization";
import { trackEvent } from "@/lib/analytics";

function label(value: string) { return value.replace(/-/g, " "); }
function strength(score: number, max: number) { return max > 0 ? Math.max(.28, score / max) : .28; }
const ACCENT = "text-[var(--aromia-editorial-accent)]";

export function DiscoveryDashboard({ perfumes }: { perfumes: Perfume[] }) {
  const [profile, setProfile] = useState(() => loadDiscoveryProfile());
  const [atlasFamily, setAtlasFamily] = useState("");

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
  const families = topSignals(profile.families, 5);
  const notes = topSignals(profile.notes, 8);
  const perfumers = topSignals(profile.perfumers, 4).map(([slug]) => ({ item: PERFUMERS.find((entry) => entry.slug === slug), slug }));
  const hasSignals = families.length + notes.length + perfumers.length > 0;
  const familyMax = families[0]?.[1] ?? 1;
  const noteMax = notes[0]?.[1] ?? 1;

  const atlasFamilies = useMemo(() => Array.from(new Set(perfumes.map((p) => p.familia_olfativa).filter((value): value is string => Boolean(value)))).slice(0, 7), [perfumes]);
  const atlasPreview = useMemo(() => {
    const source = atlasFamily ? perfumes.filter((p) => p.familia_olfativa === atlasFamily) : perfumes;
    return source.filter((p) => Boolean(p.imagen_url)).slice(0, 4);
  }, [perfumes, atlasFamily]);

  return (
    <div>
      <section aria-labelledby="atlas-title" className="border-y border-line py-10 sm:py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
          <div>
            <p className={`font-plex text-xs uppercase tracking-[.16em] ${ACCENT}`}>Atlas olfativo</p>
            <h2 id="atlas-title" className="mt-5 max-w-[8ch] font-display text-[46px] leading-[.9] tracking-[-.045em] text-ink sm:text-[58px] lg:text-[68px]">¿Qué quieres sentir?</h2>
            <p className="mt-6 max-w-[35ch] font-sans text-base leading-7 text-muted">Empieza por una familia real. La selección cambia el campo de objetos; no inventa afinidades ni porcentajes.</p>
          </div>

          <div>
            <div className="flex flex-wrap gap-x-5 gap-y-3 border-t border-line pt-4">
              <button type="button" onClick={() => setAtlasFamily("")} className={`inline-flex min-h-11 items-center font-display text-[24px] leading-none transition sm:text-[30px] ${atlasFamily === "" ? ACCENT : "text-muted hover:text-ink"}`}>Todo</button>
              {atlasFamilies.map((family) => <button key={family} type="button" onClick={() => { setAtlasFamily(family); trackEvent("intention_discovery", { signal_type: "family", value: family, source: "atlas" }); }} className={`inline-flex min-h-11 items-center font-display text-[24px] capitalize leading-none transition sm:text-[30px] ${atlasFamily === family ? ACCENT : "text-muted hover:text-ink"}`}>{family}</button>)}
            </div>

            <div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4 lg:gap-x-7">
              {atlasPreview.map((perfume, index) => <Link key={perfume.slug} href={`/catalogo/${perfume.slug}`} className={`group block outline-none ${index % 2 === 1 ? "sm:translate-y-6" : ""}`}><div className="relative aspect-[4/5] overflow-hidden"><ProductImage slug={perfume.slug} imageUrl={perfume.imagen_url} alt={`${perfume.nombre} de ${perfume.marca}`} mode="card" /></div><div className="mt-3 border-t border-line pt-3"><p className="font-plex text-xs uppercase tracking-[.12em] text-muted">{perfume.marca}</p><h3 className="mt-2 font-display text-[21px] leading-[.98] tracking-[-.025em] text-ink transition-opacity group-hover:opacity-70">{perfume.nombre}</h3></div></Link>)}
            </div>

            <div className="mt-9 flex items-center justify-between gap-5 border-t border-line pt-4"><span className="font-plex text-xs uppercase tracking-[.12em] text-muted">{atlasFamily || "Colección completa"}</span>{(() => { const guide = atlasFamily ? familiesForValue(atlasFamily)[0] : null; return <Link href={guide ? `/descubrir/familias/${guide.slug}` : atlasFamily ? `/buscar?q=${encodeURIComponent(atlasFamily)}` : "/descubrir/familias"} className="inline-flex min-h-11 items-center border-b border-ink font-plex text-xs uppercase tracking-[.12em] text-ink">{guide ? "Ver la familia →" : atlasFamily ? "Abrir búsqueda →" : "Ver las diez familias →"}</Link>; })()}</div>
          </div>
        </div>
      </section>

      <section aria-labelledby="signature-title" className="border-b border-line py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
          <div>
            <p className={`font-plex text-xs uppercase tracking-[.16em] ${ACCENT}`}>Tu firma en formación</p>
            <h2 id="signature-title" className="mt-5 max-w-[9ch] font-display text-[42px] leading-[.92] tracking-[-.04em] sm:text-[52px] lg:text-[60px]">Lo que vuelves a mirar deja una pista.</h2>
            <p className="mt-7 max-w-[37ch] font-sans text-base leading-7 text-muted">Aromia reúne señales reales de tu recorrido para mostrar familias, notas y autorías que vale la pena seguir explorando.</p>
            <p className="mt-10 max-w-[30ch] font-display text-2xl leading-snug text-ink">{hasSignals ? "Tu mapa ya tiene una dirección propia." : "Todavía está casi en blanco."}</p>
            {!hasSignals ? <Link href="/quiz" className="mt-6 inline-flex min-h-11 items-center border-b border-ink font-plex text-xs uppercase tracking-[.12em] text-ink">Darle una primera dirección →</Link> : null}
          </div>

          <div className="grid gap-12 sm:grid-cols-2">
            <div>
              <p className="font-plex text-xs uppercase tracking-[.14em] text-muted">Familias que regresan</p>
              <div className="mt-7 border-t border-line">{families.length ? families.map(([name, score], index) => { const guide = familiesForValue(name)[0]; const href = guide ? `/descubrir/familias/${guide.slug}` : `/buscar?q=${encodeURIComponent(name)}`; return <Link key={name} href={href} onClick={() => trackEvent("intention_discovery", { signal_type: "family", value: name, position: index + 1 })} className="group flex min-h-16 items-center justify-between gap-5 border-b border-line py-3 outline-none"><span className="font-plex text-xs text-muted">0{index + 1}</span><span className="origin-right text-right font-display capitalize leading-none tracking-[-.025em] text-ink transition-transform group-hover:-translate-x-1" style={{ fontSize: `${24 + 12 * strength(score, familyMax)}px` }}>{label(name)}</span></Link>; }) : <div className="py-6"><p className="font-sans text-sm leading-6 text-muted">Explora fragancias o completa el Quiz para empezar.</p><Link href="/quiz" className={`mt-3 inline-flex min-h-11 items-center font-plex text-xs uppercase tracking-[.12em] ${ACCENT}`}>Empezar con el Quiz →</Link></div>}</div>
            </div>

            <div>
              <p className="font-plex text-xs uppercase tracking-[.14em] text-muted">Notas</p>
              <div className="mt-7 flex min-h-[150px] flex-wrap content-start gap-x-4 gap-y-4 border-t border-line pt-5">{notes.length ? notes.map(([name, score]) => <Link key={name} href={`/buscar?q=${encodeURIComponent(name)}`} onClick={() => trackEvent("olfactory_note_open", { note: name, source: "discovery_map" })} className="inline-flex min-h-11 items-center font-display capitalize leading-none text-ink transition-opacity hover:opacity-70" style={{ fontSize: `${17 + 10 * strength(score, noteMax)}px`, opacity: .62 + .38 * strength(score, noteMax) }}>{label(name)}</Link>) : <p className="font-sans text-sm leading-6 text-muted">Las notas aparecen cuando exploras pirámides verificadas.</p>}</div>
              <div className="mt-9 border-t border-line pt-5"><p className="font-plex text-xs uppercase tracking-[.14em] text-muted">Personas</p><div className="mt-3">{perfumers.length ? perfumers.map(({ item, slug }) => <Link key={slug} href={`/perfumistas/${slug}`} onClick={() => trackEvent("perfumer_open", { perfumer_slug: slug, source: "discovery_map" })} className="flex min-h-11 items-center font-display text-xl text-ink transition-opacity hover:opacity-70">{item?.name ?? label(slug)}</Link>) : <p className="mt-4 font-sans text-sm leading-6 text-muted">Las autorías se incorporan al visitar perfiles verificados.</p>}</div></div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="routes-title" className="py-16 lg:py-24">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_.7fr] lg:items-end"><div><p className={`font-plex text-xs uppercase tracking-[.14em] ${ACCENT}`}>Rutas posibles</p><h2 id="routes-title" className="mt-4 max-w-[10ch] font-display text-[42px] leading-[.92] tracking-[-.04em] sm:text-[52px] lg:text-[60px]">Perfumes que continúan la conversación.</h2></div><p className="max-w-[42ch] font-sans text-base leading-7 text-muted lg:justify-self-end">Cada ruta parte de señales concretas de tu recorrido; no inventa atributos nuevos.</p></div>
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">{ranked.map(({ perfume, reasons }, index) => <Link key={perfume.slug} href={`/catalogo/${perfume.slug}`} onClick={() => trackEvent("similar_perfume_click", { source: "discovery_map", target_slug: perfume.slug, position: index + 1, reason_count: reasons.length })} className={`group block outline-none ${index % 3 === 1 ? "lg:translate-y-12" : ""}`}><div className="relative aspect-[4/5] overflow-hidden bg-transparent"><ProductImage slug={perfume.slug} imageUrl={perfume.imagen_url} alt={`${perfume.nombre} de ${perfume.marca}`} mode="card" /></div><div className="mt-5 border-t border-line pt-4"><div className="flex items-center justify-between font-plex text-xs uppercase tracking-[.12em] text-muted"><span>Ruta {String(index + 1).padStart(2, "0")}</span><span>{perfume.marca}</span></div><h3 className="mt-3 max-w-[11ch] font-display text-[31px] leading-[.94] tracking-[-.03em] text-ink transition-opacity group-hover:opacity-70">{perfume.nombre}</h3><p className="mt-4 max-w-[38ch] font-sans text-sm leading-6 text-muted">{reasons.length ? reasons.join(" · ") : perfume.familia_olfativa ?? "Una dirección distinta dentro de tu mapa."}</p><span className={`mt-5 inline-flex min-h-11 items-center font-plex text-xs uppercase tracking-[.12em] ${ACCENT}`}>Seguir esta pista →</span></div></Link>)}</div>
      </section>

      <div className="flex flex-col gap-4 border-t border-line py-8 sm:flex-row sm:items-end sm:justify-between"><p className="max-w-[56ch] font-sans text-xs leading-5 text-muted">Este mapa se guarda únicamente en tu navegador. Puedes borrarlo cuando quieras.</p><button type="button" onClick={() => { clearDiscoveryProfile(); setProfile(loadDiscoveryProfile()); trackEvent("discovery_profile_reset"); }} className={`min-h-11 self-start font-plex text-xs uppercase tracking-[.12em] transition-opacity hover:opacity-70 sm:self-auto ${ACCENT}`}>Reiniciar / Ninguno</button></div>
    </div>
  );
}
