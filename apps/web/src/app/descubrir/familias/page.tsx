import type { Metadata } from "next";
import Link from "next/link";
import { getPerfumes } from "@/lib/api";
import { OLFACTIVE_FAMILIES, perfumesForFamily } from "@/lib/olfactiveFamilies";

export const metadata: Metadata = {
  title: "Familias olfativas — Discovery — Aromia",
  description:
    "Las diez grandes familias olfativas como puerta de entrada: a qué huele cada una, sus materias, sus subfamilias y las fragancias, personas e historias que la cruzan en Aromia.",
  alternates: { canonical: "/descubrir/familias" },
};

export default async function FamiliasPage() {
  const perfumes = await getPerfumes().catch(() => []);
  const rows = OLFACTIVE_FAMILIES.map((family) => ({
    family,
    count: perfumesForFamily(family, perfumes).length,
  }));

  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="mx-auto max-w-[1240px] px-6 py-12 lg:px-10 lg:py-20">
        <nav aria-label="Ruta" className="mb-8 flex items-center gap-3 font-plex text-xs uppercase tracking-[.12em] text-muted">
          <Link href="/descubrir" className="transition hover:text-ink">Discovery</Link>
          <span>／</span>
          <span className="text-ink">Familias</span>
        </nav>

        <div className="grid gap-8 pb-14 lg:grid-cols-[1.1fr_.75fr] lg:items-end">
          <div>
            <p className="font-plex text-xs uppercase tracking-[.16em] text-[var(--aromia-editorial-accent)]">Discovery</p>
            <h1 className="mt-5 max-w-[12ch] font-display text-[48px] leading-[.92] tracking-[-.04em] sm:text-[60px] lg:text-[76px]">Las diez familias.</h1>
          </div>
          <p className="max-w-[44ch] font-sans text-base leading-7 text-muted lg:justify-self-end">
            No es un filtro de tienda. Cada familia abre una lectura: a qué huele, con qué
            materias se construye, en qué subfamilias se ramifica y qué fragancias,
            personas e historias la cruzan dentro de Aromia.
          </p>
        </div>

        <ol className="grid grid-cols-1 border-t border-line">
          {rows.map(({ family, count }, index) => (
            <li key={family.slug} className="border-b border-line">
              <Link
                href={`/descubrir/familias/${family.slug}`}
                className="group grid gap-4 py-8 lg:grid-cols-[64px_1fr_1.1fr_auto] lg:items-baseline lg:gap-8"
              >
                <span className="font-plex text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="font-display text-[30px] leading-none tracking-[-.03em] text-ink transition group-hover:opacity-70 sm:text-[38px]">
                  {family.name}
                </h2>
                <p className="max-w-[52ch] font-sans text-sm leading-6 text-muted">{family.smellsLike}</p>
                <span className="inline-flex min-h-11 items-center gap-4 font-plex text-xs uppercase tracking-[.12em] text-[var(--aromia-editorial-accent)]">
                  {count === 0 ? "Explorar" : count === 1 ? "1 fragancia" : `${count} fragancias`} <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[42ch] font-sans text-sm leading-6 text-muted">
            ¿Prefieres partir de lo que ya exploraste? Tu mapa personal sigue en Discovery.
          </p>
          <Link href="/descubrir" className="nav-link text-sm text-ink">Volver a Discovery</Link>
        </div>
      </section>
    </main>
  );
}
