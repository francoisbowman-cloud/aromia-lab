import type { Metadata } from "next";
import Link from "next/link";
import { getPerfumes } from "@/lib/api";
import { PERFUMERS } from "@/lib/perfumers";

export const metadata: Metadata = { title: "Perfumistas — Aromia", description: "Descubre los perfumistas detrás de las fragancias y explora sus obras publicadas en Aromia." };

export default async function PerfumistasPage() {
  const perfumes = await getPerfumes();
  const published = new Set(perfumes.map((p) => p.slug));
  const profiles = PERFUMERS.map((profile) => ({ ...profile, visibleCount: profile.perfumeSlugs.filter((slug) => published.has(slug)).length })).filter((profile) => profile.visibleCount > 0);
  return <main className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]">
    <section className="mx-auto max-w-[1240px] px-6 py-12 lg:px-10 lg:py-20">
      <div className="grid gap-8 border-b border-line pb-12 lg:grid-cols-[1.1fr_.75fr] lg:items-end"><div><p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Autores del aroma</p><h1 className="mt-5 max-w-[10ch] font-display text-[58px] leading-[.9] tracking-[-.04em] lg:text-[86px]">Perfumistas.</h1></div><p className="max-w-[46ch] font-sans text-sm leading-6 text-muted lg:justify-self-end">Aromia atribuye autoría únicamente cuando existe una relación revisada. Una ficha sin perfumista visible significa “no atribuido todavía”, no una inferencia automática.</p></div>
      <div className="grid grid-cols-1 border-b border-line md:grid-cols-2 lg:grid-cols-3">{profiles.map((profile, index) => <Link key={profile.slug} href={`/perfumistas/${profile.slug}`} className="group min-h-72 border-b border-r border-line p-7"><div className="flex justify-between font-plex text-[8px] uppercase tracking-[.16em] text-muted"><span>{String(index + 1).padStart(2,"0")}</span><span>{profile.visibleCount} obras</span></div><p className="mt-12 font-plex text-[8px] uppercase tracking-[.16em] text-gold-contrast">{profile.era}</p><h2 className="mt-3 font-display text-[36px] leading-[.95]">{profile.name}</h2><p className="mt-5 font-sans text-xs leading-5 text-muted">{profile.signature}</p><span className="mt-8 inline-block border-b border-transparent pb-1 font-plex text-[9px] uppercase tracking-[.14em] group-hover:border-gold group-hover:text-gold-contrast">Explorar obra →</span></Link>)}</div>
    </section>
  </main>;
}
