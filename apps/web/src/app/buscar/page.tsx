import type { Metadata } from "next";
import { getArticulos, getPerfumes } from "@/lib/api";
import { buildEditorialIndex } from "@/lib/editorialIndex";
import { DiscoverySearch } from "@/components/discovery/DiscoverySearch";

export const metadata: Metadata = { title: "Buscar — Aromia", description: "Busca fragancias, historias, personas, materias, familias y notas en Aromia." };

export default async function BuscarPage({ searchParams }: { searchParams: { q?: string } }) {
  const [perfumes, articles] = await Promise.all([getPerfumes(), getArticulos()]);
  const initialQuery = typeof searchParams.q === "string" ? searchParams.q.slice(0, 80) : "";
  const editorialItems = buildEditorialIndex(articles);

  return <main className="bg-paper text-ink">
    <section className="mx-auto max-w-[1180px] px-6 py-12 lg:px-10 lg:py-20">
      <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_.72fr] lg:items-end">
        <div><p className="font-plex text-xs uppercase tracking-[.16em] text-gold-contrast">Buscar en Aromia</p><h1 className="mt-4 max-w-[11ch] font-display text-[46px] leading-[.94] tracking-[-.04em] text-ink sm:text-[56px] lg:text-[68px]">Encuentra la siguiente pista.</h1></div>
        <p className="max-w-[42ch] font-sans text-base leading-7 text-muted lg:justify-self-end">Busca una fragancia, una persona, una materia, una nota o una historia. Los resultados te devuelven al mismo cuerpo editorial.</p>
      </div>
      <DiscoverySearch perfumes={perfumes} editorialItems={editorialItems} initialQuery={initialQuery}/>
    </section>
  </main>;
}
