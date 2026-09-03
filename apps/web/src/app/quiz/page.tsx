import type { Metadata } from "next";
import Link from "next/link";
import { QuizFlow } from "@/components/quiz/QuizFlow";

export const metadata: Metadata = {
  title: "Empieza tu mapa olfativo — Aromia",
  description: "Seis decisiones intuitivas para iniciar tu mapa olfativo dentro de Discovery.",
  alternates: { canonical: "/quiz" },
  openGraph: { title: "Empieza tu mapa olfativo", description: "Un punto de partida para Discovery en Aromia.", type: "website" },
};

export default function QuizPage() {
  return (
    <main className="bg-paper text-ink">
      <section className="mx-auto grid min-h-[calc(100vh-68px)] max-w-[1440px] grid-cols-1 lg:grid-cols-[.78fr_1.22fr]">
        <div className="flex flex-col justify-between px-6 py-10 lg:px-10 lg:py-14">
          <div>
            <div className="flex items-center gap-4 font-plex text-xs uppercase tracking-[.16em] text-muted"><Link href="/descubrir" className="transition hover:text-ink">Discovery</Link><span className="h-px w-12 bg-line"/><span>Inicio del mapa</span></div>
            <p className="mt-12 font-plex text-xs uppercase tracking-[.16em] text-[var(--aromia-editorial-accent)]">Tu mapa olfativo</p>
            <h1 className="mt-5 max-w-[9ch] font-display text-[50px] font-medium leading-[.94] tracking-[-.04em] text-ink sm:text-[58px] lg:text-[70px]">¿Qué perfume eres?</h1>
            <p className="mt-7 max-w-[38ch] font-sans text-base leading-7 text-muted">Seis decisiones intuitivas para darle una primera dirección a tu mapa. Después puedes seguir afinándolo simplemente explorando Aromia.</p>
          </div>
          <div className="mt-16 flex flex-wrap gap-x-6 gap-y-2 font-plex text-xs uppercase tracking-[.12em] text-muted">
            <span>6 preguntas</span><span>≈ 2 minutos</span><span>Quiz → mapa → exploración</span>
          </div>
        </div>
        <div className="flex items-center px-6 py-12 lg:px-14 lg:py-16">
          <div className="w-full"><QuizFlow /></div>
        </div>
      </section>
    </main>
  );
}
