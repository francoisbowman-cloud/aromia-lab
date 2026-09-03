import type { Metadata } from "next";
import Link from "next/link";
import { getPerfumes } from "@/lib/api";
import { PERFUMERS } from "@/lib/perfumers";
import { PerfumerPortrait } from "@/components/perfume/PerfumerPortrait";

export const metadata: Metadata = { title: "Personas — Aromia", description: "Las personas detrás de las fragancias y las obras revisadas en Aromia." };

export default async function PerfumistasPage() {
  const perfumes = await getPerfumes();
  const published = new Set(perfumes.map((p) => p.slug));
  const profiles = PERFUMERS.map((profile) => ({ ...profile, visibleCount: profile.perfumeSlugs.filter((slug) => published.has(slug)).length })).filter((profile) => profile.visibleCount > 0);

  return <main className="bg-paper text-ink">
    <section className="mx-auto max-w-[1240px] px-6 py-12 lg:px-10 lg:py-20">
      <div className="grid gap-8 pb-14 lg:grid-cols-[1.1fr_.75fr] lg:items-end">
        <div><p className="font-plex text-xs uppercase tracking-[.16em] text-[var(--aromia-editorial-accent)]">Personas</p><h1 className="mt-5 max-w-[11ch] font-display text-[48px] leading-[.94] tracking-[-.04em] sm:text-[58px] lg:text-[70px]">Quién está detrás del olor.</h1></div>
        <p className="max-w-[44ch] font-sans text-base leading-7 text-muted lg:justify-self-end">Aromia muestra únicamente autorías revisadas. Una persona puede abrir una historia, una obra o una pista para seguir explorando; nunca rellenamos una atribución que no está verificada.</p>
      </div>

      <div className="grid grid-cols-1 border-t border-line md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile, index) => <Link key={profile.slug} href={`/perfumistas/${profile.slug}`} className="group flex flex-col border-b border-line py-8 outline-none md:pr-8 lg:px-7">
          <div className="flex justify-between font-plex text-xs uppercase tracking-[.12em] text-muted"><span>{String(index + 1).padStart(2,"0")}</span><span>{profile.visibleCount} obras</span></div>
          <div className="mt-6 transition group-hover:opacity-90"><PerfumerPortrait name={profile.name} portrait={profile.portrait} portraitCredit={profile.portraitCredit} portraitCreditHref={profile.portraitCreditHref} era={profile.era} variant="card" /></div>
          <p className="mt-7 font-plex text-xs uppercase tracking-[.12em] text-gold-contrast">{profile.era}</p>
          <h2 className="mt-3 font-display text-[32px] leading-[.98] transition group-hover:opacity-70">{profile.name}</h2>
          <p className="mt-5 max-w-[32ch] font-sans text-sm leading-6 text-muted">{profile.signature}</p>
          <span className="mt-7 inline-flex min-h-11 items-center font-plex text-xs uppercase tracking-[.12em] text-[var(--aromia-editorial-accent)]">Explorar →</span>
        </Link>)}
      </div>

      <div className="mt-14 flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-[42ch] font-sans text-sm leading-6 text-muted">¿Prefieres empezar por una pieza y llegar después a quien la compuso?</p><Link href="/magazine" className="nav-link text-sm text-ink">Ir a Historias</Link></div>
    </section>
  </main>;
}
