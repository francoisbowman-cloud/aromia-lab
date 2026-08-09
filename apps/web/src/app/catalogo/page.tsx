import type { Metadata } from "next";
import { getPerfumes } from "@/lib/api";
import { PerfumesCatalog } from "@/components/perfume/PerfumesCatalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo — Aromia",
  description: "Comparador de perfumes: precios, notas y dónde comprar cada fragancia.",
  alternates: { canonical: "/catalogo" },
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: { familia?: string };
}) {
  const perfumes = await getPerfumes();

  return (
    <main className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]">
      <section className="mx-auto w-full max-w-[1440px] px-6 pb-8 pt-10 lg:px-10 lg:pb-12 lg:pt-14">
        <div className="flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.2em] text-muted">
          <span>Discovery index</span><span className="h-px flex-1 bg-line"/><span>Aromia / 02</span>
        </div>
        <div className="mt-9 grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <p className="font-plex text-[9px] uppercase tracking-[.22em] text-gold-contrast">Colección / archivo olfativo</p>
            <h1 className="mt-5 max-w-[10ch] font-display text-[58px] font-medium leading-[.88] tracking-[-.045em] text-ink lg:text-[96px]">Encuentra por instinto. Afina con criterio.</h1>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-[42ch] font-sans text-[15px] leading-7 text-muted">Explora la colección como un índice editorial: familia, género, precio y carácter afinan la búsqueda sin convertir el perfume en una simple ficha de inventario.</p>
            <div className="mt-8 grid grid-cols-2 border-y border-line font-plex text-[8px] uppercase tracking-[.15em] text-muted">
              <div className="border-r border-line py-4 pr-4"><span className="block text-gold-contrast">Colección</span><span className="mt-2 block">{perfumes.length} fragancias</span></div>
              <div className="py-4 pl-4"><span className="block text-gold-contrast">Lectura</span><span className="mt-2 block">Familia → objeto</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-6 pb-20 lg:px-10 lg:pb-28">
        {perfumes.length === 0 ? (
          <div className="border-y border-line py-20"><p className="font-display text-3xl text-ink">El archivo todavía está vacío.</p><p className="mt-3 max-w-[40ch] font-sans text-sm leading-6 text-muted">Cuando haya fragancias publicadas, aparecerán aquí como parte del índice de descubrimiento.</p></div>
        ) : (
          <PerfumesCatalog perfumes={perfumes} initialFamilia={searchParams.familia} />
        )}
      </section>
    </main>
  );
}
