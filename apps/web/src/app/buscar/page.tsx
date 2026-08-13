import type { Metadata } from "next";
import { getArticulos, getPerfumes } from "@/lib/api";
import { DiscoverySearch } from "@/components/discovery/DiscoverySearch";

export const metadata: Metadata = { title: "Buscar — Aromia", description: "Busca fragancias, marcas, familias, notas y lecturas editoriales en Aromia." };

export default async function BuscarPage({ searchParams }: { searchParams: { q?: string } }) {
  const [perfumes, articles] = await Promise.all([getPerfumes(), getArticulos()]);
  const initialQuery = typeof searchParams.q === "string" ? searchParams.q.slice(0, 80) : "";
  return <main className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]"><section className="mx-auto max-w-[1180px] px-6 py-12 lg:px-10 lg:py-20"><div className="mb-10 grid gap-6 lg:grid-cols-[1fr_.7fr] lg:items-end"><div><p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Discovery index</p><h1 className="mt-4 max-w-[10ch] font-display text-[58px] leading-[.9] tracking-[-.04em] text-ink lg:text-[84px]">Encuentra la siguiente señal.</h1></div><p className="max-w-[46ch] font-sans text-sm leading-6 text-muted lg:justify-self-end">Un punto de entrada común para catálogo y contenido: busca por nombre, marca, familia o nota y continúa desde la ruta que tenga más sentido.</p></div><DiscoverySearch perfumes={perfumes} articles={articles} initialQuery={initialQuery}/></section></main>;
}
