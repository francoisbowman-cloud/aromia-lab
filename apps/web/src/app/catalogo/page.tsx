import type { Metadata } from "next";
import { getPerfumes } from "@/lib/api";
import { ResilientPerfumesCatalog } from "@/components/perfume/ResilientPerfumesCatalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de perfumes",
  description: "Compara perfumes por notas, familia olfativa, precio y disponibilidad en un índice editorial de fragancias.",
  alternates: { canonical: "/catalogo" },
};

export default async function CatalogoPage({ searchParams }: { searchParams: { familia?: string } }) {
  const perfumes = await getPerfumes();

  return (
    <main className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]">
      <section className="mx-auto w-full max-w-[1440px] px-6 pb-8 pt-10 lg:px-10 lg:pb-12 lg:pt-14">
        <div className="flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.2em] text-muted"><span>Índice de fragancias</span><span className="h-px flex-1 bg-line"/><span>Aromia / 02</span></div>
        <div className="mt-9 grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div><p className="font-plex text-[9px] uppercase tracking-[.22em] text-gold-contrast">Fragancias</p><h1 className="mt-5 max-w-[10ch] font-display text-[58px] font-medium leading-[.88] tracking-[-.045em] text-ink lg:text-[96px]">Encuentra por instinto. Afina con criterio.</h1></div>
          <div className="lg:justify-self-end"><p className="max-w-[42ch] font-sans text-[15px] leading-7 text-muted">Explora las fragancias por familia, género, precio y carácter para encontrar opciones que encajen contigo.</p><div className="mt-8 grid grid-cols-2 border-y border-line font-plex text-[8px] uppercase tracking-[.15em] text-muted"><div className="border-r border-line py-4 pr-4"><span className="block text-gold-contrast">Catálogo</span><span className="mt-2 block">{perfumes.length > 0 ? perfumes.length : "125"} fragancias</span></div><div className="py-4 pl-4"><span className="block text-gold-contrast">Explorar</span><span className="mt-2 block">Familia → perfume</span></div></div></div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-6 pb-20 lg:px-10 lg:pb-28">
        <ResilientPerfumesCatalog initialPerfumes={perfumes} initialFamilia={searchParams.familia} />
      </section>
    </main>
  );
}
