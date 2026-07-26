import Link from "next/link";
import { getArticulos, getPerfumes } from "@/lib/api";
import { PerfumeCard } from "@/components/perfume/PerfumeCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Button } from "@/components/ui/button";
import { CATEGORIA_LABEL } from "@/lib/magazineCategories";
import { pickEditorialImage } from "@/lib/editorialImages";

export const dynamic = "force-dynamic";

const EYEBROW = "font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast font-semibold";

export default async function Home() {
  const [perfumes, articulos] = await Promise.all([getPerfumes(), getArticulos()]);

  // Reseñas destacadas: prioriza perfumes con rating real (así se ve la
  // estrella, no un placeholder) — si ninguno tiene todavía, cae a los
  // primeros del catálogo igual que antes.
  const conRating = perfumes.filter((p) => p.rating_promedio);
  const destacados = (conRating.length >= 3 ? conRating : perfumes).slice(0, 3);

  const familias = Array.from(new Set(perfumes.map((p) => p.familia_olfativa)))
    .sort()
    .slice(0, 6);

  const ultimoArticulo = articulos
    .filter((a) => a.categoria !== "academia")
    .sort((a, b) => (a.publicado_en < b.publicado_en ? 1 : -1))[0];
  const heroImage = pickEditorialImage("home-hero");

  return (
    <main className="flex flex-col">
      {/* Hero — dos columnas: texto + escena editorial (ver GUIA-VISUAL-aromia.md) */}
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 p-6 py-14 lg:grid-cols-2 lg:gap-16 lg:p-10 lg:py-24">
        <div className="flex flex-col items-start gap-5">
          <p className={EYEBROW}>Comparador y recomendador de perfumes</p>
          <h1 className="max-w-xl font-display text-[40px] font-semibold leading-[1.05] text-ink lg:text-[56px]">
            El perfume correcto no se elige al azar.
          </h1>
          <p className="max-w-xl font-sans text-lg text-muted">
            Reseñas honestas, comparadas y sin ruido — para encontrar la fragancia que
            realmente te representa.
          </p>
          <div className="mt-2 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/catalogo">Explorar catálogo</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/quiz">Hacer el quiz</Link>
            </Button>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-line bg-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage.src}
            alt={heroImage.alt}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-24 p-6 pb-24 lg:p-10 lg:pb-32">
        {destacados.length > 0 ? (
          <section>
            <div className="flex items-baseline justify-between">
              <div>
                <p className={EYEBROW}>Reseñas destacadas</p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-ink lg:text-3xl">
                  Lo que está mirando la comunidad
                </h2>
              </div>
              <Link href="/catalogo" className="nav-link font-sans text-sm text-muted transition hover:text-ink">
                Ver todo el catálogo →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {destacados.map((perfume) => (
                <PerfumeCard key={perfume.slug} perfume={perfume} variant="featured" />
              ))}
            </div>
          </section>
        ) : null}

        {familias.length > 0 ? (
          <section>
            <p className={EYEBROW}>Familias olfativas</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {familias.map((familia) => (
                <Link
                  key={familia}
                  href={`/catalogo?familia=${encodeURIComponent(familia)}`}
                  className="rounded-full border border-line px-5 py-2.5 font-sans text-[13px] text-ink transition hover:border-gold hover:text-gold-contrast"
                >
                  {familia}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {ultimoArticulo ? (
          <section className="grid grid-cols-1 gap-8 rounded-card border border-line bg-surface p-8 shadow-lux lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:gap-12 lg:p-12">
            <div>
              <p className={EYEBROW}>Magazine</p>
              <h2 className="mt-3 font-display text-2xl text-ink lg:text-3xl">
                {ultimoArticulo.titulo}
              </h2>
              {ultimoArticulo.meta_description ? (
                <p className="mt-3 max-w-lg font-sans text-sm text-muted">
                  {ultimoArticulo.meta_description}
                </p>
              ) : null}
              <p className="mt-2 font-sans text-[11px] uppercase tracking-[.1em] text-muted">
                {CATEGORIA_LABEL[ultimoArticulo.categoria]}
              </p>
            </div>
            <Button asChild variant="outline" size="lg" className="justify-self-start">
              <Link href={`/magazine/${ultimoArticulo.slug}`}>Leer Magazine</Link>
            </Button>
          </section>
        ) : null}

        <section className="flex flex-col items-center justify-between gap-6 rounded-card bg-ink px-8 py-12 text-center text-paper shadow-lux lg:flex-row lg:px-14 lg:text-left">
          <div>
            <h2 className="font-display text-2xl font-semibold lg:text-3xl">
              Sumate al Club Aromia
            </h2>
            <p className="mt-2 font-sans text-sm text-paper/70">
              Acceso anticipado a guías, drops y comparativas exclusivas.
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <Link href="/club">Unirme</Link>
          </Button>
        </section>

        <section className="rounded-card border border-line bg-surface p-10 text-center shadow-lux lg:p-16">
          <p className={EYEBROW}>Quiz de matching</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink lg:text-4xl">
            ¿No sabes por dónde empezar?
          </h2>
          <p className="mx-auto mt-3 max-w-md font-sans text-muted">
            Responde 6 preguntas y te mostramos los perfumes que mejor se adaptan a tu
            estilo y presupuesto.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/quiz">Empezar el quiz</Link>
          </Button>
        </section>

        <section className="mx-auto flex max-w-lg flex-col items-center gap-3 text-center">
          <h2 className="font-display text-xl font-semibold text-ink">
            Alertas de bajada de precio
          </h2>
          <p className="font-sans text-sm text-muted">
            Deja tu email y te avisamos cuando tu perfume favorito baje de precio.
          </p>
          <div className="w-full">
            <NewsletterForm fuente="home" />
          </div>
        </section>
      </div>
    </main>
  );
}
