import { getArticulos } from "@/lib/api";
import { ArticleCard } from "@/components/article/ArticleCard";

export const revalidate = 60;

export const metadata = {
  title: "Magazine — Aromia",
  description: "Reseñas, guías y comparativas de perfumes.",
};

export default async function ArticulosPage() {
  const articulos = await getArticulos();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 p-6 lg:p-10">
      <div>
        <p className="font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast">
          Magazine
        </p>
        <h1 className="mt-2 font-display text-[40px] font-semibold leading-[0.98] text-ink">
          Artículos
        </h1>
      </div>

      {articulos.length === 0 ? (
        <p className="font-sans text-sm text-muted">Todavía no hay artículos publicados.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articulos.map((articulo) => (
            <ArticleCard key={articulo.slug} article={articulo} />
          ))}
        </div>
      )}
    </main>
  );
}
