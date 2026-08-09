import Link from "next/link";
import { getPerfumes } from "@/lib/api";
import { PerfumeCard } from "@/components/perfume/PerfumeCard";
import { HeroEditorPick } from "@/components/perfume/HeroEditorPick";
import { NewsletterForm } from "@/components/NewsletterForm";
import { CATEGORIAS_PRINCIPALES } from "@/lib/olfactiveCategories";

export default async function HomePage() {
  const perfumes = await getPerfumes();
  const editorPicks = perfumes.filter((p) => p.imagen_url).slice(0, 4);
  const featured = perfumes.slice(0, 4);
  const categoriasConResultados = CATEGORIAS_PRINCIPALES.filter((cat) =>
    perfumes.some((p) => p.familia_olfativa && cat.familias.includes(p.familia_olfativa)),
  );

  return (
    <main>
      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1fr_.72fr] lg:px-10 lg:py-16">
        <div className="flex flex-col justify-center">
          <p className="font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast">
            Aromia · Perfumería editorial
          </p>
          <h1 className="mt-4 max-w-[760px] font-display text-[46px] font-semibold leading-[.96] text-ink sm:text-[60px] lg:text-[72px]">
            Descubre el perfume que cuenta tu historia.
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-muted sm:text-lg">
            Reseñas, notas, comparativas y una mirada editorial para explorar fragancias con criterio.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="rounded-button bg-gold-contrast px-6 py-3 font-sans text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Explorar catálogo
            </Link>
            <Link
              href="/quiz"
              className="rounded-button border border-line px-6 py-3 font-sans text-sm font-semibold text-ink transition hover:border-gold"
            >
              Encuentra tu fragancia
            </Link>
          </div>
        </div>
        {editorPicks.length > 0 ? <HeroEditorPick perfumes={editorPicks} /> : null}
      </section>

      <section className="border-y border-line bg-soft">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:px-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[.2em] text-gold-contrast">
                Reseñas destacadas
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Selección Aromia</h2>
            </div>
            <Link
              href="/catalogo"
              className="nav-link font-sans text-sm text-ink transition hover:text-gold-contrast"
            >
              Ver catálogo →
            </Link>
          </div>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((perfume) => (
              <PerfumeCard key={perfume.slug} perfume={perfume} variant="featured" />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-10 lg:py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[.2em] text-gold-contrast">
              Explora por familia
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Mapa olfativo</h2>
          </div>
          <Link
            href="/catalogo"
            className="nav-link font-sans text-sm text-ink transition hover:text-gold-contrast"
          >
            Ver todo el catálogo →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:grid-cols-8">
          {categoriasConResultados.map((cat) => {
            const representante = perfumes.find(
              (p) => Boolean(p.familia_olfativa) && cat.familias.includes(p.familia_olfativa!) && Boolean(p.imagen_url),
            );
            return (
              <Link
                key={cat.label}
                href={`/catalogo?familia=${encodeURIComponent(cat.familias[0])}`}
                className="group relative flex aspect-square items-end overflow-hidden rounded-card transition duration-300 hover:-translate-y-1"
                style={{ background: cat.gradient }}
              >
                {representante?.imagen_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={representante.imagen_url}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-luminosity transition duration-300 group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <span className="relative z-[1] p-3 font-sans text-[11px] uppercase tracking-[.12em] text-white [text-shadow:0_2px_8px_rgba(0,0,0,.35)]">
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-line bg-soft">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-12 lg:grid-cols-[1fr_.8fr] lg:px-10">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[.2em] text-gold-contrast">Aromia Journal</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Una guía más allá de la botella</h2>
            <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-muted">
              Recibe nuevas reseñas, guías y selecciones editoriales de fragancias.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </main>
  );
}
