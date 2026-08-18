import type { Metadata } from "next";
import { QuizFlow } from "@/components/quiz/QuizFlow";

export const metadata: Metadata = {
  title: "¿Qué perfume eres?",
  description: "Descubre tu perfil olfativo con el quiz de Aromia y encuentra perfumes alineados con tu estilo, ocasión y presencia.",
  alternates: { canonical: "/quiz" },
  openGraph: { title: "¿Qué perfume eres?", description: "Descubre tu perfil olfativo y una selección de perfumes alineados contigo.", type: "website" },
};

export default function QuizPage() {
  return (
    <main className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]">
      <section className="mx-auto grid min-h-[calc(100vh-72px)] max-w-[1440px] grid-cols-1 lg:grid-cols-[.78fr_1.22fr]">
        <div className="flex flex-col justify-between px-6 py-10 lg:px-10 lg:py-14">
          <div>
            <div className="flex items-center gap-4 font-plex text-[9px] uppercase tracking-[.2em] text-muted"><span>Discovery</span><span className="h-px w-12 bg-line"/><span>Quiz / 01</span></div>
            <p className="mt-12 font-plex text-[9px] uppercase tracking-[.22em] text-gold-contrast">Tu mapa olfativo</p>
            <h1 className="mt-5 max-w-[9ch] font-display text-[50px] font-medium leading-[.94] tracking-[-.04em] text-ink sm:text-[58px] lg:text-[70px]">¿Qué perfume eres?</h1>
            <p className="mt-7 max-w-[38ch] font-sans text-base leading-7 text-muted">Seis decisiones intuitivas para descubrir qué familias, texturas y niveles de presencia encajan mejor contigo.</p>
          </div>
          <div className="mt-16 flex flex-wrap gap-x-6 gap-y-2 font-plex text-[9px] uppercase tracking-[.16em] text-muted">
            <span>6 preguntas</span><span>≈ 2 minutos</span><span>Perfil → selección</span>
          </div>
        </div>
        <div className="relative flex items-center px-6 py-12 lg:px-14 lg:py-16">
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden"><div className="absolute right-[-12%] top-[8%] h-[42vw] max-h-[620px] w-[42vw] max-w-[620px] rounded-full border border-[#d8c8ae]/40 opacity-30 dark:border-[#5d4a31]" /><div className="absolute bottom-[9%] left-[6%] h-32 w-32 rounded-full bg-[#d9b97c]/15 blur-2xl" /></div>
          <div className="relative w-full"><QuizFlow /></div>
        </div>
      </section>
    </main>
  );
}
