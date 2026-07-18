import Link from "next/link";
import { getPerfumes } from "@/lib/api";
import { PerfumeCard } from "@/components/perfume/PerfumeCard";
import { NewsletterForm } from "@/components/NewsletterForm";

export const dynamic = "force-dynamic";

export default async function Home() {
  const perfumes = await getPerfumes();
  const destacados = perfumes.slice(0, 6);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-16 p-6 lg:p-10">
      <section className="flex flex-col items-start gap-5 py-12 lg:py-20">
        <p className="font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast">
          Comparador de perfumes
        </p>
        <h1 className="max-w-2xl font-display text-[40px] font-semibold leading-[0.98] text-ink lg:text-[56px]">
          Encuentra el perfume que te representa.
        </h1>
        <p className="max-w-xl font-sans text-lg text-muted">
          Comparamos precios, notas y desempeño de los perfumes más buscados para que
          elijas con criterio, no al azar.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/perfumes"
            className="rounded-full bg-gold-contrast px-6 py-3 font-sans text-[12px] font-semibold uppercase tracking-[.08em] text-white transition hover:brightness-105"
          >
            Ver catálogo
          </Link>
          <Link
            href="/quiz"
            className="rounded-full border border-line px-6 py-3 font-sans text-[12px] font-semibold uppercase tracking-[.08em] text-ink transition hover:border-gold"
          >
            Hacer el quiz
          </Link>
        </div>
      </section>

      {destacados.length > 0 ? (
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold text-ink">Destacados</h2>
            <Link href="/perfumes" className="font-sans text-sm text-muted hover:text-ink">
              Ver todo el catálogo →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((perfume) => (
              <PerfumeCard key={perfume.slug} perfume={perfume} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-card border border-line bg-surface p-10 text-center shadow-lux lg:p-16">
        <p className="font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast">
          Quiz de matching
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-ink lg:text-4xl">
          ¿No sabes por dónde empezar?
        </h2>
        <p className="mx-auto mt-3 max-w-md font-sans text-muted">
          Responde 6 preguntas y te mostramos los perfumes que mejor se adaptan a tu
          estilo y presupuesto.
        </p>
        <Link
          href="/quiz"
          className="mt-6 inline-block rounded-full bg-gold-contrast px-8 py-3 font-sans text-[12px] font-semibold uppercase tracking-[.08em] text-white transition hover:brightness-105"
        >
          Empezar el quiz
        </Link>
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
    </main>
  );
}
