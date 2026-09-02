import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPerfumes } from "@/lib/api";
import { getProfileBySlug } from "@/lib/quizData";
import { rankPerfumesForProfile } from "@/lib/quizRanking";
import { PerfumeCard } from "@/components/perfume/PerfumeCard";

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
    <main className="bg-paper text-ink">
      <section className="mx-auto max-w-[1440px] px-6 pb-12 pt-10 lg:px-10 lg:pb-16 lg:pt-14">
        <div className="flex items-center gap-4 border-b border-line pb-4 font-plex text-xs uppercase tracking-[.14em] text-muted"><Link href="/descubrir" className="transition hover:text-ink">Discovery</Link><span className="h-px flex-1 bg-line"/><span>Primera lectura</span></div>
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div><p className="font-plex text-xs uppercase tracking-[.16em] text-[var(--aromia-editorial-accent)]">Tu mapa empieza aquí</p><h1 className="mt-5 max-w-[10ch] font-display text-[58px] font-medium leading-[.9] tracking-[-.04em] text-ink lg:text-[88px]">{perfil.titulo}</h1></div>
          <div className="lg:justify-self-end"><p className="max-w-[42ch] font-sans text-base leading-7 text-muted">{perfil.descripcion}</p><p className="mt-4 max-w-[42ch] font-sans text-sm leading-6 text-muted">Esta lectura no es una etiqueta permanente. Es un punto de partida que Discovery puede seguir afinando con lo que explores.</p><div className="mt-7 flex flex-wrap gap-6"><Link href="/descubrir" className="inline-flex min-h-11 items-center border-b border-ink font-plex text-xs uppercase tracking-[.12em] text-ink">Abrir mi mapa →</Link><Link href="/quiz" className="inline-flex min-h-11 items-center font-plex text-xs uppercase tracking-[.12em] text-muted">Rehacer Quiz</Link></div></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pb-16 lg:px-10 lg:pb-24">
        <div className="mb-8 flex items-center gap-4 border-b border-line pb-4 font-plex text-xs uppercase tracking-[.14em] text-muted"><span>Primeras pistas</span><span className="h-px flex-1 bg-line"/><span>{recomendados.length}</span></div>
        {recomendados.length > 0 ? <div className="grid grid-cols-1 border-b border-line sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{recomendados.map((perfume, index) => <PerfumeCard key={perfume.slug} perfume={perfume} index={index} trackingContext="quiz_result" />)}</div> : <div className="border-y border-line py-16"><p className="font-display text-3xl text-ink">La selección todavía está abierta.</p><p className="mt-3 max-w-[40ch] font-sans text-sm leading-6 text-muted">Aún no hay fragancias publicadas que cumplan este perfil con suficiente confianza.</p><Link href="/magazine" className="mt-6 inline-flex min-h-11 items-center border-b border-ink font-plex text-xs uppercase tracking-[.12em] text-ink">Ir a Historias →</Link></div>}
      </section>

      <section className="border-t border-line"><div className="mx-auto grid max-w-[1160px] gap-8 px-6 py-14 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10 lg:py-20"><div><p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">Continuar</p><h2 className="mt-4 max-w-[14ch] font-display text-[38px] font-medium leading-[.96] text-ink lg:text-[50px]">El resultado sirve más cuando deja de ser el final.</h2><p className="mt-5 max-w-[48ch] font-sans text-sm leading-6 text-muted">Abre tu mapa, mira una fragancia, vuelve a una historia. Cada recorrido puede añadir contexto sin obligarte a comprar nada.</p></div><Link href="/descubrir" className="inline-flex min-h-11 items-center border-b border-ink font-plex text-xs uppercase tracking-[.12em] text-ink">Continuar en Discovery →</Link></div></section>
    </main>
  );
}
