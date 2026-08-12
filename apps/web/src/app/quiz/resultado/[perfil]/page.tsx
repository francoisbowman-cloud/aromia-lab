import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPerfumes } from "@/lib/api";
import { getProfileBySlug } from "@/lib/quizData";
import { rankPerfumesForProfile } from "@/lib/quizRanking";
import { PerfumeCard } from "@/components/perfume/PerfumeCard";
import { NewsletterForm } from "@/components/NewsletterForm";

export async function generateMetadata({ params }: { params: { perfil: string } }): Promise<Metadata> {
  const perfil = getProfileBySlug(params.perfil);
  if (!perfil) return {};
  const titulo = `${perfil.titulo} ${perfil.emoji}`;
  return { title: titulo, description: perfil.descripcion, openGraph: { title: titulo, description: perfil.descripcion } };
}

export default async function QuizResultadoPage({ params }: { params: { perfil: string } }) {
  const perfil = getProfileBySlug(params.perfil);
  if (!perfil) notFound();

  const perfumes = await getPerfumes();
  const ranked = rankPerfumesForProfile(perfil, perfumes, 8);
  const recomendados = ranked.map((item) => item.perfume);

  return (
    <main className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]">
      <section className="mx-auto max-w-[1440px] px-6 pb-12 pt-10 lg:px-10 lg:pb-16 lg:pt-14">
        <div className="flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.2em] text-muted"><span>Discovery result</span><span className="h-px flex-1 bg-line"/><span>Perfil / catálogo vivo</span></div>
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div><p className="font-plex text-[9px] uppercase tracking-[.22em] text-gold-contrast">Tu mapa olfativo</p><h1 className="mt-5 max-w-[10ch] font-display text-[58px] font-medium leading-[.9] tracking-[-.04em] text-ink lg:text-[88px]">{perfil.titulo}</h1></div>
          <div className="lg:justify-self-end"><p className="max-w-[42ch] font-sans text-[15px] leading-7 text-muted">{perfil.descripcion}</p><p className="mt-4 max-w-[42ch] font-sans text-xs leading-5 text-muted">La selección se recalcula contra las fragancias publicadas y prioriza afinidad de familia, tipo y calidad de datos.</p><Link href="/quiz" className="mt-7 inline-block border-b border-ink pb-1 font-plex text-[9px] uppercase tracking-[.14em] text-ink transition hover:border-gold hover:text-gold-contrast">Rehacer lectura →</Link></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pb-16 lg:px-10 lg:pb-24">
        <div className="mb-8 flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>Selección recomendada</span><span className="h-px flex-1 bg-line"/><span>{recomendados.length} coincidencias</span></div>
        {recomendados.length > 0 ? (
          <div className="grid grid-cols-1 border-b border-line sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{recomendados.map((perfume, index) => <PerfumeCard key={perfume.slug} perfume={perfume} index={index} trackingContext="quiz_result" />)}</div>
        ) : (
          <div className="border-y border-line py-16"><p className="font-display text-3xl text-ink">La selección todavía está abierta.</p><p className="mt-3 max-w-[40ch] font-sans text-sm leading-6 text-muted">Aún no hay fragancias publicadas que cumplan este perfil con suficiente confianza.</p><Link href="/catalogo" className="mt-6 inline-block border-b border-ink pb-1 font-plex text-[9px] uppercase tracking-[.14em] text-ink">Explorar catálogo →</Link></div>
        )}
      </section>

      <section className="border-y border-line bg-[#f3eadc] dark:bg-[#15110d]">
        <div className="mx-auto grid max-w-[1160px] grid-cols-1 gap-9 px-6 py-14 lg:grid-cols-[.85fr_1.15fr] lg:items-end lg:px-10 lg:py-20">
          <div><p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Seguimiento</p><h2 className="mt-4 max-w-[11ch] font-display text-[38px] font-medium leading-[.96] text-ink lg:text-[50px]">Guarda la señal, no la urgencia.</h2><p className="mt-5 max-w-[38ch] font-sans text-sm leading-6 text-muted">Si una de estas fragancias cambia de precio, podemos avisarte. Sin cuenta y sin convertir el descubrimiento en presión de compra.</p></div>
          <div><NewsletterForm fuente="quiz" mensajeExito="Listo — guardamos tu interés. Te avisaremos cuando haya una señal de precio relevante." /><p className="mt-3 font-plex text-[8px] uppercase tracking-[.12em] text-muted">Solo alertas relacionadas · puedes ignorarlas cuando quieras</p></div>
        </div>
      </section>
    </main>
  );
}
