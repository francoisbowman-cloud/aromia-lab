import { getPerfumes } from "@/lib/api";
import { PerfumesCatalog } from "@/components/perfume/PerfumesCatalog";

export const dynamic = "force-dynamic";

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: { familia?: string };
}) {
  const perfumes = await getPerfumes();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 p-6 lg:p-10">
      <div>
        <p className="font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast">
          Aromia
        </p>
        <h1 className="mt-2 font-display text-[40px] font-semibold leading-[0.98] text-ink lg:text-[56px]">
          Catálogo
        </h1>
      </div>

      {perfumes.length === 0 ? (
        <p className="font-sans text-sm text-muted">Todavía no hay perfumes cargados.</p>
      ) : (
        <PerfumesCatalog perfumes={perfumes} initialFamilia={searchParams.familia} />
      )}
    </main>
  );
}
