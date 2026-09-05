import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPerfumes } from "@/lib/api";
import { getPerfumerProfile } from "@/lib/perfumers";
import { EDITORIAL_STORIES } from "@/lib/editorialIndex";
import type { Perfume } from "@/lib/types";
import { PerfumeCard } from "@/components/perfume/PerfumeCard";
import { PerfumerPortrait } from "@/components/perfume/PerfumerPortrait";
import { DiscoverySignal } from "@/components/discovery/DiscoverySignal";
import { PersonalizedDiscoveryRail } from "@/components/discovery/PersonalizedDiscoveryRail";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aromialab.com").replace(/\/$/, "");

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const profile = getPerfumerProfile(params.slug);
  if (!profile) return {};
  const title = `${profile.name} — Personas — Aromia`;
  return { title, description: profile.bio, alternates: { canonical: `/perfumistas/${profile.slug}` }, openGraph: { title, description: profile.bio, type: "profile", url: `${SITE_URL}/perfumistas/${profile.slug}` } };
}

function buildPersonJsonLd(profile: NonNullable<ReturnType<typeof getPerfumerProfile>>) {
  return { "@context": "https://schema.org", "@type": "Person", name: profile.name, url: `${SITE_URL}/perfumistas/${profile.slug}`, description: profile.bio, knowsAbout: ["Perfumería", "Fragancias"] };
}

export default async function PerfumerDetailPage({ params }: { params: { slug: string } }) {
  const profile = getPerfumerProfile(params.slug);
  if (!profile) notFound();
  const catalog = await getPerfumes();
  const works = profile.perfumeSlugs.map((slug) => catalog.find((p) => p.slug === slug)).filter((p): p is Perfume => Boolean(p));
  const houses = Array.from(new Set(works.map((work) => work.marca).filter(Boolean))).sort();
  const stories = EDITORIAL_STORIES.filter((story) => story.relatedPerfumerSlug === profile.slug);

  return <main className="bg-paper text-ink">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPersonJsonLd(profile)) }} />
    <DiscoverySignal perfumerSlug={profile.slug} />
    <section className="mx-auto max-w-[1240px] px-6 py-12 lg:px-10 lg:py-20">
      <div className="mb-5 flex items-center gap-3 font-plex text-xs uppercase tracking-[.12em] text-muted"><Link href="/perfumistas" className="transition hover:text-ink">Personas</Link><span>／</span><span>{profile.era}</span></div>
      <div className="grid gap-9 pb-12 lg:grid-cols-[.5fr_1.5fr] lg:items-start">
        <PerfumerPortrait name={profile.name} portrait={profile.portrait} credit={profile.portraitCredit} era={profile.era} variant="detail" />
        <div>
          <h1 className="max-w-[12ch] font-display text-[48px] leading-[.94] tracking-[-.04em] sm:text-[58px] lg:text-[70px]">{profile.name}</h1>
          <p className="mt-6 font-display text-2xl italic leading-snug text-ink">{profile.signature}</p>
          <p className="mt-5 max-w-[46ch] font-sans text-base leading-7 text-muted">{profile.bio}</p>
          {houses.length ? (
            <div className="mt-7 border-t border-line pt-5">
              <p className="font-plex text-xs uppercase tracking-[.12em] text-muted">Casas relacionadas</p>
              <p className="mt-2 font-display text-lg leading-snug text-ink">{houses.join(" · ")}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>

    {stories.length ? <section className="border-y border-line bg-soft/25"><div className="mx-auto max-w-[1240px] px-6 py-12 lg:px-10 lg:py-16"><p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">Historias relacionadas</p>{stories.map((story)=><Link key={story.slug} href={story.href} className="group mt-5 grid gap-5 border-t border-line pt-6 lg:grid-cols-[1fr_.7fr] lg:items-end"><h2 className="max-w-[13ch] font-display text-[36px] leading-[.96] tracking-[-.03em] transition group-hover:opacity-70 lg:text-[44px]">{story.title}</h2><div className="lg:justify-self-end"><p className="max-w-[42ch] font-sans text-sm leading-6 text-muted">{story.summary}</p><span className="mt-4 inline-flex min-h-11 items-center font-plex text-xs uppercase tracking-[.12em] text-ink">Leer →</span></div></Link>)}</div></section> : null}

    <section className="mx-auto max-w-[1240px] px-6 py-16 lg:px-10 lg:py-20">
      <div className="mb-8 flex items-end justify-between gap-5"><div><p className="font-plex text-xs uppercase tracking-[.14em] text-gold-contrast">Obras en Aromia</p><p className="mt-2 font-sans text-sm text-muted">Fragancias con autoría revisada.</p></div><span className="font-display text-2xl text-ink">{works.length}</span></div>
      {works.length ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">{works.map((perfume, index) => <PerfumeCard key={perfume.slug} perfume={perfume} index={index} trackingContext="catalog" />)}</div> : <p className="py-16 font-sans text-base text-muted">No hay obras publicadas asociadas actualmente.</p>}
    </section>
    <PersonalizedDiscoveryRail perfumes={catalog} title={`Después de ${profile.name}`} />
    <section className="mx-auto max-w-[1240px] px-6 pb-20 lg:px-10 lg:pb-28"><div className="flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-[40ch] font-sans text-sm leading-6 text-muted">Las personas son una de las puertas de entrada al archivo. Puedes volver al índice o seguir la conversación desde una historia.</p><div className="flex gap-6"><Link href="/perfumistas" className="nav-link text-sm text-ink">Ver Personas</Link><Link href="/magazine" className="nav-link text-sm text-ink">Ir a Historias</Link></div></div></section>
  </main>;
}
