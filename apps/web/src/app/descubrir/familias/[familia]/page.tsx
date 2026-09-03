import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPerfumes } from "@/lib/api";
import { PERFUMERS } from "@/lib/perfumers";
import { EDITORIAL_STORIES } from "@/lib/editorialIndex";
import {
  OLFACTIVE_FAMILIES,
  familyBySlug,
  familyMatchesText,
  perfumesForFamily,
} from "@/lib/olfactiveFamilies";

export function generateStaticParams() {
  return OLFACTIVE_FAMILIES.map((family) => ({ familia: family.slug }));
}

export function generateMetadata({ params }: { params: { familia: string } }): Metadata {
  const family = familyBySlug(params.familia);
  if (!family) return {};
  return {
    title: `${family.name} — Familias — Discovery — Aromia`,
    description: family.smellsLike,
    alternates: { canonical: `/descubrir/familias/${family.slug}` },
  };
}

const KICKER = "font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]";
const MUTED_KICKER = "font-plex text-xs uppercase tracking-[.14em] text-muted";

export default async function FamiliaSheet({ params }: { params: { familia: string } }) {
  const family = familyBySlug(params.familia);
  if (!family) notFound();

  const catalog = await getPerfumes().catch(() => []);
  const fragancias = perfumesForFamily(family, catalog).slice(0, 8);

  const personas = PERFUMERS.filter((perfumer) => {
    if (familyMatchesText(family, perfumer.signature)) return true;
    return perfumer.perfumeSlugs.some((slug) => {
      const work = catalog.find((perfume) => perfume.slug === slug);
      return work ? familyMatchesText(family, work.familia_olfativa) : false;
    });
  }).slice(0, 6);

  const historias = family.storySlugs
    .map((slug) => EDITORIAL_STORIES.find((story) => story.slug === slug))
    .filter((story): story is (typeof EDITORIAL_STORIES)[number] => Boolean(story));

  const siblings = OLFACTIVE_FAMILIES.filter((entry) => entry.slug !== family.slug);

  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="mx-auto max-w-[1240px] px-6 py-12 lg:px-10 lg:py-20">
        <nav aria-label="Ruta" className="mb-8 flex flex-wrap items-center gap-3 font-plex text-xs uppercase tracking-[.12em] text-muted">
          <Link href="/descubrir" className="transition hover:text-ink">Discovery</Link>
          <span>／</span>
          <Link href="/descubrir/familias" className="transition hover:text-ink">Familias</Link>
          <span>／</span>
          <span className="text-ink">{family.name}</span>
        </nav>

        <div className="grid gap-8 border-b border-line pb-14 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div>
            <p className={KICKER}>Familia olfativa</p>
            <h1 className="mt-5 font-display text-[52px] leading-[.9] tracking-[-.04em] sm:text-[66px] lg:text-[84px]">{family.name}</h1>
          </div>
          <div className="lg:justify-self-end">
            <p className={MUTED_KICKER}>A qué huele</p>
            <p className="mt-4 max-w-[46ch] font-display text-[22px] leading-[1.3] tracking-[-.01em] text-ink sm:text-[26px]">{family.smellsLike}</p>
          </div>
        </div>

        <div className="grid gap-12 py-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className={MUTED_KICKER}>Materias frecuentes</p>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-line pt-5">
              {family.materials.map((material) => (
                <li key={material} className="font-display text-xl capitalize text-ink">{material}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className={MUTED_KICKER}>Sensación / carácter</p>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-line pt-5">
              {family.character.map((trait) => (
                <li key={trait} className="font-display text-xl capitalize text-ink">{trait}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-y border-line py-14">
          <p className={MUTED_KICKER}>Subfamilias</p>
          <ul className="mt-6 grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {family.subfamilies.map((subfamily) => (
              <li key={subfamily.name}>
                <h2 className="font-display text-2xl leading-tight text-ink">{subfamily.name}</h2>
                <p className="mt-3 font-sans text-sm leading-6 text-muted">{subfamily.note}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-3 sm:gap-8">
          <div>
            <p className={MUTED_KICKER}>Clima</p>
            <p className="mt-3 font-sans text-sm leading-6 text-ink">{family.context.clima}</p>
          </div>
          <div>
            <p className={MUTED_KICKER}>Momento</p>
            <p className="mt-3 font-sans text-sm leading-6 text-ink">{family.context.momento}</p>
          </div>
          <div>
            <p className={MUTED_KICKER}>Presencia</p>
            <p className="mt-3 font-sans text-sm leading-6 text-ink">{family.context.presencia}</p>
          </div>
        </div>

        {fragancias.length ? (
          <div className="border-t border-line py-14">
            <div className="flex items-end justify-between gap-5">
              <p className={KICKER}>Fragancias relacionadas</p>
              <span className="font-display text-2xl text-ink">{fragancias.length}</span>
            </div>
            <ul className="mt-8 grid grid-cols-1 border-t border-line sm:grid-cols-2">
              {fragancias.map((perfume) => (
                <li key={perfume.slug} className="border-b border-line">
                  <Link href={`/catalogo/${perfume.slug}`} className="group flex items-baseline justify-between gap-5 py-5">
                    <span>
                      <span className="font-plex text-[10px] uppercase tracking-[.12em] text-muted">{perfume.marca}</span>
                      <span className="mt-1 block font-display text-xl leading-tight text-ink transition group-hover:opacity-70">{perfume.nombre}</span>
                    </span>
                    <span className="shrink-0 font-sans text-xs capitalize text-muted">{perfume.familia_olfativa}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={`/buscar?q=${encodeURIComponent(family.name.toLowerCase())}`} className="mt-6 inline-flex min-h-11 items-center border-b border-ink font-plex text-xs uppercase tracking-[.12em] text-ink">
              Ver más en Buscar →
            </Link>
          </div>
        ) : null}

        {personas.length ? (
          <div className="border-t border-line py-14">
            <p className={KICKER}>Personas relacionadas</p>
            <ul className="mt-8 grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
              {personas.map((perfumer) => (
                <li key={perfumer.slug} className="border-b border-line">
                  <Link href={`/perfumistas/${perfumer.slug}`} className="group block py-6">
                    <span className="font-display text-2xl leading-tight text-ink transition group-hover:opacity-70">{perfumer.name}</span>
                    <span className="mt-2 block font-sans text-sm leading-6 text-muted">{perfumer.signature}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {historias.length ? (
          <div className="border-t border-line py-14">
            <p className={KICKER}>Historias relacionadas</p>
            <ul className="mt-8 border-t border-line">
              {historias.map((story) => (
                <li key={story.slug} className="border-b border-line">
                  <Link href={story.href} className="group grid gap-3 py-6 lg:grid-cols-[1fr_.8fr] lg:items-baseline">
                    <h2 className="font-display text-[28px] leading-tight tracking-[-.02em] text-ink transition group-hover:opacity-70 lg:text-[34px]">{story.title}</h2>
                    <p className="font-sans text-sm leading-6 text-muted">{story.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="border-t border-line py-14">
          <p className={MUTED_KICKER}>Otras familias</p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
            {siblings.map((entry) => (
              <li key={entry.slug}>
                <Link href={`/descubrir/familias/${entry.slug}`} className="inline-flex min-h-11 items-center font-display text-lg text-ink transition hover:text-[var(--aromia-editorial-accent)]">
                  {entry.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[42ch] font-sans text-sm leading-6 text-muted">Cada familia es una puerta; puedes volver al índice o seguir tu mapa personal.</p>
          <div className="flex gap-6">
            <Link href="/descubrir/familias" className="nav-link text-sm text-ink">Todas las familias</Link>
            <Link href="/descubrir" className="nav-link text-sm text-ink">Abrir Discovery</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
