import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPerfumes } from "@/lib/api";
import { getPerfumerProfile } from "@/lib/perfumers";
import { PerfumeCard } from "@/components/perfume/PerfumeCard";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const profile = getPerfumerProfile(params.slug);
  return profile ? { title: `${profile.name} — Perfumistas — Aromia`, description: profile.bio } : {};
}

export default async function PerfumerDetailPage({ params }: { params: { slug: string } }) {
  const profile = getPerfumerProfile(params.slug);
  if (!profile) notFound();
  const catalog = await getPerfumes();
  const works = profile.perfumeSlugs.map((slug) => catalog.find((p) => p.slug === slug)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  return <main className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]">
    <section className="mx-auto max-w-[1240px] px-6 py-12 lg:px-10 lg:py-20"><p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Perfumista / {profile.era}</p><div className="mt-6 grid gap-8 border-b border-line pb-12 lg:grid-cols-[1.15fr_.85fr] lg:items-end"><h1 className="max-w-[11ch] font-display text-[58px] leading-[.9] tracking-[-.04em] lg:text-[86px]">{profile.name}</h1><div><p className="font-display text-2xl italic text-ink">{profile.signature}</p><p className="mt-5 max-w-[48ch] font-sans text-sm leading-6 text-muted">{profile.bio}</p></div></div></section>
    <section className="mx-auto max-w-[1240px] px-6 pb-20 lg:px-10"><div className="mb-8 flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>Obras en Aromia</span><span className="h-px flex-1 bg-line"/><span>{works.length}</span></div>{works.length ? <div className="grid grid-cols-1 border-b border-line sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{works.map((perfume, index) => <PerfumeCard key={perfume.slug} perfume={perfume} index={index} trackingContext="catalog" />)}</div> : <p className="py-16 font-sans text-sm text-muted">No hay obras publicadas asociadas actualmente.</p>}</section>
  </main>;
}
