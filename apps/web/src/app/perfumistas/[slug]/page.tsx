import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPerfumes } from "@/lib/api";
import { getPerfumerProfile } from "@/lib/perfumers";
import type { Perfume } from "@/lib/types";
import { PerfumeCard } from "@/components/perfume/PerfumeCard";
import { DiscoverySignal } from "@/components/discovery/DiscoverySignal";
import { PersonalizedDiscoveryRail } from "@/components/discovery/PersonalizedDiscoveryRail";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const profile = getPerfumerProfile(params.slug);
  return profile ? { title: `${profile.name} — Perfumistas — Aromia`, description: profile.bio } : {};
}

export default async function PerfumerDetailPage({ params }: { params: { slug: string } }) {
  const profile = getPerfumerProfile(params.slug);
  if (!profile) notFound();
  const catalog = await getPerfumes();
  const works = profile.perfumeSlugs.map((slug) => catalog.find((p) => p.slug === slug)).filter((p): p is Perfume => Boolean(p));

  return <main className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]">
    <DiscoverySignal perfumerSlug={profile.slug} />
    <section className="mx-auto max-w-[1240px] px-6 py-12 lg:px-10 lg:py-20">
      <p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Perfumista / {profile.era}</p>
      <div className="mt-6 grid gap-9 pb-12 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
        <h1 className="max-w-[12ch] font-display text-[48px] leading-[.94] tracking-[-.04em] sm:text-[58px] lg:text-[70px]">{profile.name}</h1>
        <div><p className="font-display text-2xl italic leading-snug text-ink">{profile.signature}</p><p className="mt-5 max-w-[46ch] font-sans text-base leading-7 text-muted">{profile.bio}</p></div>
      </div>
    </section>

    <section className="mx-auto max-w-[1240px] px-6 pb-20 lg:px-10">
      <div className="mb-8 flex items-end justify-between gap-5"><div><p className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">Obras en Aromia</p><p className="mt-2 font-sans text-sm text-muted">Fragancias con autoría revisada en el catálogo.</p></div><span className="font-display text-2xl text-ink">{works.length}</span></div>
      {works.length ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">{works.map((perfume, index) => <PerfumeCard key={perfume.slug} perfume={perfume} index={index} trackingContext="catalog" />)}</div> : <p className="py-16 font-sans text-base text-muted">No hay obras publicadas asociadas actualmente.</p>}
    </section>
    <PersonalizedDiscoveryRail perfumes={catalog} title={`Después de ${profile.name}`} />
  </main>;
}
