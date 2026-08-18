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
      <div className="grid gap-8 pb-14 lg:grid-cols-[1.1fr_.75fr] lg:items-end">
        <div><p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Autores del aroma</p><h1 className="mt-5 max-w-[11ch] font-display text-[48px] leading-[.94] tracking-[-.04em] sm:text-[58px] lg:text-[70px]">Perfumistas.</h1></div>
        <p className="max-w-[44ch] font-sans text-base leading-7 text-muted lg:justify-self-end">Aquí aparecen solo autorías revisadas. Cuando una fragancia aún no tiene perfumista visible, Aromia no lo infiere.</p>
      </div>

      <div className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile, index) => <Link key={profile.slug} href={`/perfumistas/${profile.slug}`} className="group min-h-64 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
          <div className="flex justify-between font-plex text-[8px] uppercase tracking-[.16em] text-muted"><span>{String(index + 1).padStart(2,"0")}</span><span>{profile.visibleCount} obras</span></div>
          <p className="mt-10 font-plex text-[8px] uppercase tracking-[.16em] text-gold-contrast">{profile.era}</p>
          <h2 className="mt-3 font-display text-[32px] leading-[.98]">{profile.name}</h2>
          <p className="mt-5 max-w-[32ch] font-sans text-sm leading-6 text-muted">{profile.signature}</p>
          <span className="mt-7 inline-block font-plex text-[9px] uppercase tracking-[.14em] text-muted transition group-hover:translate-x-1 group-hover:text-gold-contrast">Explorar obra →</span>
        </Link>)}
      </div>
    </section>
  </main>;
}
