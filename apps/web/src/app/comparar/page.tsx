import type { Metadata } from "next";
import Link from "next/link";
import { getPerfumes } from "@/lib/api";
import type { Perfume } from "@/lib/types";

export const metadata: Metadata = { title: "Comparar fragancias — Aromia", description: "Compara lado a lado el perfil olfativo, rendimiento y contexto de fragancias publicadas en Aromia." };

function notes(perfume: Perfume) { return [...(perfume.notas_salida ?? []), ...(perfume.notas_corazon ?? []), ...(perfume.notas_fondo ?? [])].slice(0, 8).join(" · ") || "—"; }
function metric(value?: number) { return value == null ? "—" : `${value}/10`; }

export default async function CompararPage({ searchParams }: { searchParams: { perfumes?: string } }) {
  const slugs = (searchParams.perfumes ?? "").split(",").map((value) => value.trim()).filter(Boolean).slice(0, 3);
  const catalog = await getPerfumes();
  const selected = slugs.map((slug) => catalog.find((perfume) => perfume.slug === slug)).filter((perfume): perfume is Perfume => Boolean(perfume));
  const rows: { label: string; value: (perfume: Perfume) => string }[] = [
    { label: "Familia", value: (p) => p.familia_olfativa ?? "—" },
    { label: "Concentración", value: (p) => p.concentracion ?? "—" },
    { label: "Notas", value: notes },
    { label: "Ocasión", value: (p) => p.ocasion?.join(" · ") || "—" },
    { label: "Temporada", value: (p) => p.temporada_recomendada?.join(" · ") || "—" },
    { label: "Longevidad", value: (p) => metric(p.longevidad) },
    { label: "Estela", value: (p) => metric(p.estela) },
    { label: "Proyección", value: (p) => metric(p.proyeccion) },
    { label: "Tipo", value: (p) => p.nicho_o_comercial ?? "—" },
  ];

  return <main className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]"><section className="mx-auto max-w-[1180px] px-6 py-12 lg:px-10 lg:py-20"><p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Comparative reading</p><h1 className="mt-4 font-display text-[54px] leading-[.92] tracking-[-.04em] lg:text-[78px]">Leer las diferencias.</h1><p className="mt-5 max-w-[52ch] font-sans text-sm leading-6 text-muted">Comparación descriptiva basada en los mismos datos publicados en cada ficha; no modifica puntuaciones ni crea datos nuevos.</p>
    {selected.length >= 2 ? <div className="mt-12 overflow-x-auto border-y border-line"><table className="w-full min-w-[720px] border-collapse"><thead><tr><th className="w-40 border-r border-line p-5 text-left font-plex text-[8px] uppercase tracking-[.15em] text-muted">Dimensión</th>{selected.map((perfume) => <th key={perfume.slug} className="border-r border-line p-5 text-left"><p className="font-plex text-[8px] uppercase tracking-[.15em] text-gold-contrast">{perfume.marca}</p><Link href={`/catalogo/${perfume.slug}`} className="mt-2 block font-display text-2xl text-ink hover:text-gold-contrast">{perfume.nombre}</Link></th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.label} className="border-t border-line"><th className="border-r border-line p-5 text-left align-top font-plex text-[8px] uppercase tracking-[.15em] text-muted">{row.label}</th>{selected.map((perfume) => <td key={`${row.label}-${perfume.slug}`} className="border-r border-line p-5 align-top font-sans text-sm leading-6 text-ink">{row.value(perfume)}</td>)}</tr>)}</tbody></table></div> : <div className="mt-12 border-y border-line py-14"><p className="font-display text-3xl">Elige dos fragancias para compararlas.</p><Link href="/catalogo" className="mt-6 inline-block border-b border-ink pb-1 font-plex text-[9px] uppercase tracking-[.14em]">Ir al catálogo →</Link></div>}
  </section></main>;
}
