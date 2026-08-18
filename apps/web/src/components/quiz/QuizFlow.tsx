"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUIZ_QUESTIONS, QUIZ_PROFILES, getDominantTag, type QuizTag } from "@/lib/quizData";
import { recordQuizProfile } from "@/lib/discoveryProfile";
import { trackEvent } from "@/lib/analytics";

export function QuizFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Partial<Record<QuizTag, number>>>({});
  const pregunta = QUIZ_QUESTIONS[step];
  const esUltima = step === QUIZ_QUESTIONS.length - 1;

  function elegir(puntos: Partial<Record<QuizTag, number>>, optionLetter: string) {
    if (step === 0) trackEvent("quiz_started", { total_questions: QUIZ_QUESTIONS.length });
    trackEvent("quiz_answered", { question_number: step + 1, option: optionLetter });

    const nuevosScores = { ...scores };
    for (const [tag, valor] of Object.entries(puntos) as [QuizTag, number][]) nuevosScores[tag] = (nuevosScores[tag] ?? 0) + valor;

    if (esUltima) {
      const dominante = getDominantTag(nuevosScores);
      const perfil = QUIZ_PROFILES.find((p) => p.tag === dominante)!;
      recordQuizProfile(perfil.slug, perfil.familias);
      trackEvent("quiz_completed", { perfil: perfil.slug, total_questions: QUIZ_QUESTIONS.length });
      router.push(`/quiz/resultado/${perfil.slug}`);
      return;
    }
    setScores(nuevosScores);
    setStep((s) => s + 1);
  }

  return (
    <section aria-labelledby="quiz-question" className="bg-[#fffdf8]/88 p-6 backdrop-blur-sm dark:bg-[#120f0c]/88 sm:p-8 lg:p-12">
      <div className="flex items-center gap-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>{String(step + 1).padStart(2, "0")}</span><span className="h-px w-12 bg-line"/><span>{String(QUIZ_QUESTIONS.length).padStart(2, "0")}</span></div>
      <div className="py-8 lg:py-10"><p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Elige por intuición</p><h2 id="quiz-question" className="mt-4 max-w-[18ch] font-display text-[32px] font-medium leading-[1.04] tracking-[-.025em] text-ink sm:text-[36px] lg:text-[44px]">{pregunta.pregunta}</h2></div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {pregunta.opciones.map((opcion) => (
          <button key={opcion.letra} type="button" onClick={() => elegir(opcion.puntos, opcion.letra)} className="group min-h-28 border-l-2 border-transparent px-0 py-5 text-left transition-[background-color,border-color] hover:border-gold hover:bg-[#f4ecdf]/70 focus-visible:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring dark:hover:bg-[#1a1510]/70">
            <span className="flex items-start gap-4 px-4 sm:px-5"><span className="mt-1 font-plex text-[9px] uppercase tracking-[.16em] text-gold-contrast">{opcion.letra}</span><span className="max-w-[28ch] font-sans text-[15px] leading-6 text-ink">{opcion.texto}</span><span aria-hidden="true" className="ml-auto font-display text-xl text-muted transition-transform group-hover:translate-x-1 group-hover:text-gold-contrast">→</span></span>
          </button>
        ))}
      </div>
      <div className="mt-8 flex max-w-48 gap-1" aria-label={`Progreso: pregunta ${step + 1} de ${QUIZ_QUESTIONS.length}`}>{QUIZ_QUESTIONS.map((_, i) => <span key={i} className={`h-px flex-1 ${i <= step ? "bg-gold-contrast" : "bg-line"}`} />)}</div>
    </section>
  );
}
