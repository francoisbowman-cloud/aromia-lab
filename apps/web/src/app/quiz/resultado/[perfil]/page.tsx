import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPerfumes } from "@/lib/api";
import { getProfileBySlug, getRecommendationsForProfile } from "@/lib/quizData";
import { PerfumeCard } from "@/components/perfume/PerfumeCard";
import { NewsletterForm } from "@/components/NewsletterForm";

export async function generateMetadata({
  params,
}: {
  params: { perfil: string };
}): Promise<Metadata> {
  const perfil = getProfileBySlug(params.perfil);
  if (!perfil) return {};

  const titulo = `${perfil.titulo} ${perfil.emoji}`;
  return {
    title: titulo,
    description: perfil.descripcion,
    openGraph: {
      title: titulo,
      description: perfil.descripcion,
    },
  };
}

export default async function QuizResultadoPage({
  params,
}: {
  params: { perfil: string };
}) {
  const perfil = getProfileBySlug(params.perfil);
  if (!perfil) notFound();

  const perfumes = await getPerfumes();
  const { aspiracionales, accesibles } = getRecommendationsForProfile(perfil, perfumes);
  const recomendados = [...aspiracionales, ...accesibles];

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 p-6 lg:p-10">
      <section className="rounded-card border border-line bg-surface p-10 text-center shadow-lux lg:p-16">
        <p className="font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast">
          Tu resultado
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink lg:text-4xl">
          {perfil.titulo} {perfil.emoji}
        </h1>
        <p className="mx-auto mt-3 max-w-xl font-sans text-muted">{perfil.descripcion}</p>
        <Link
          href="/quiz"
          className="mt-6 inline-block rounded-full border border-line px-6 py-3 font-sans text-[12px] font-semibold uppercase tracking-[.08em] text-ink transition hover:border-gold"
        >
          Repetir el quiz
        </Link>
      </section>

      {recomendados.length > 0 ? (
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink">
            Perfumes para ti
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recomendados.map((perfume) => (
              <PerfumeCard key={perfume.slug} perfume={perfume} />
            ))}
          </div>
        </section>
      ) : (
        <p className="text-center font-sans text-sm text-muted">
          Todavía no tenemos recomendaciones para este perfil.
        </p>
      )}

      <section className="mx-auto flex max-w-lg flex-col items-center gap-3 text-center">
        <h2 className="font-display text-xl font-semibold text-ink">
          Alertas de bajada de precio
        </h2>
        <p className="font-sans text-sm text-muted">
          Deja tu email y te avisamos cuando alguno de estos perfumes baje de precio.
        </p>
        <div className="w-full">
          <NewsletterForm fuente="quiz" />
        </div>
      </section>
    </main>
  );
}
