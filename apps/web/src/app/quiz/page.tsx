import type { Metadata } from "next";
import { QuizFlow } from "@/components/quiz/QuizFlow";

export const metadata: Metadata = {
  title: "¿Qué perfume eres? — Aromia",
  description: "Respondé el quiz de matching y descubrí qué perfumes van con vos.",
  alternates: { canonical: "/quiz" },
};

export default function QuizPage() {
  return (
    <main className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]">
      <section className="mx-auto grid min-h-[calc(100vh-72px)] max-w-[1440px] grid-cols-1 lg:grid-cols-[.78fr_1.22fr]">
        <div className="flex flex-col justify-between border-b border-line px-6 py-10 lg:border-b-0 lg:border-r lg:px-10 lg:py-14">
          <div>
            <div className="flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.2em] text-muted"><span>Discovery</span><span className="h-px flex-1 bg-line"/><span>Quiz / 01</span></div>
            <p className="mt-12 font-plex text-[9px] uppercase tracking-[.22em] text-gold-contrast">Tu mapa olfativo</p>
            <h1 className="mt-5 max-w-[8ch] font-display text-[56px] font-medium leading-[.9] tracking-[-.045em] text-ink lg:text-[84px]">¿Qué perfume eres?</h1>
            <p className="mt-7 max-w-[38ch] font-sans text-[15px] leading-7 text-muted">No buscamos una etiqueta. Buscamos el contraste entre luz, textura, ocasión y presencia que define cómo quieres oler.</p>
          </div>

          <div className="mt-16 border-t border-line pt-5 font-plex text-[9px] uppercase tracking-[.16em] text-muted">
            <div className="flex items-center justify-between"><span>6 preguntas</span><span>≈ 2 minutos</span></div>
            <div className="mt-3 flex items-center gap-3"><span className="h-px flex-1 bg-line"/><span>Perfil → selección</span></div>
          </div>
        </div>

        <div className="relative flex items-center px-6 py-12 lg:px-14 lg:py-16">
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            <div className="absolute right-[-12%] top-[8%] h-[42vw] max-h-[620px] w-[42vw] max-w-[620px] rounded-full border border-[#d8c8ae] opacity-40 dark:border-[#5d4a31]" />
            <div className="absolute bottom-[9%] left-[6%] h-32 w-32 rounded-full bg-[#d9b97c]/15 blur-2xl" />
          </div>
          <div className="relative w-full"><QuizFlow /></div>
        </div>
      </section>
    </main>
  );
}
