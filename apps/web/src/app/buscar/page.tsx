import type { Metadata } from "next";
import { getArticulos, searchPerfumes } from "@/lib/api";
import { buildEditorialIndex } from "@/lib/editorialIndex";
import { DiscoverySearch } from "@/components/discovery/DiscoverySearch";
import type { PerfumeSearchResponse } from "@/lib/types";

export const metadata: Metadata = { title: "Buscar — Aromia", description: "Busca fragancias, historias, personas, materias, familias y notas en Aromia." };

const RESULT_PAGE_SIZE = 20;

export default async function BuscarPage({ searchParams }: { searchParams: { q?: string } }) {
  const initialQuery = typeof searchParams.q === "string" ? searchParams.q.slice(0, 80) : "";

  // Sin query, la vista inicial no trae el catálogo — ver
  // handoffs/AROMIA_CODE_DISCOVERY_SEARCH_ARCHITECTURE_2026-09-20.md. Con
  // query (ej. un link compartido con ?q=), se resuelve server-side para que
  // /buscar?q=... siga sirviendo resultados reales de entrada, no una
  // pantalla vacía que recién se llena tras hidratar en el cliente.
  const [initialResults, articles] = await Promise.all([
    initialQuery ? searchPerfumes({ q: initialQuery, pageSize: RESULT_PAGE_SIZE }) : Promise.resolve<PerfumeSearchResponse | null>(null),
    getArticulos(),
  ]);
  const editorialItems = buildEditorialIndex(articles);

  return <main className="bg-paper text-ink">
    <section className="mx-auto max-w-[1180px] px-6 py-12 lg:px-10 lg:py-20">
      <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_.72fr] lg:items-end">
        <div><p className="font-plex text-xs uppercase tracking-[.16em] text-gold-contrast">Buscar en Aromia</p><h1 className="mt-4 max-w-[11ch] font-display text-[46px] leading-[.94] tracking-[-.04em] text-ink sm:text-[56px] lg:text-[68px]">Encuentra la siguiente pista.</h1></div>
        <p className="max-w-[42ch] font-sans text-base leading-7 text-muted lg:justify-self-end">Busca una fragancia, una persona, una materia, una nota o una historia. Los resultados te devuelven al mismo cuerpo editorial.</p>
      </div>
      <DiscoverySearch initialResults={initialResults} editorialItems={editorialItems} initialQuery={initialQuery} />
    </section>
  </main>;
}
