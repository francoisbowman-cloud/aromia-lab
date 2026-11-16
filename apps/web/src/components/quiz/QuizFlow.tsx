"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QUIZ_QUESTIONS, QUIZ_PROFILES, getDominantTag, type QuizTag } from "@/lib/quizData";
import { recordQuizProfile } from "@/lib/discoveryProfile";
import { trackEvent } from "@/lib/analytics";

export function QuizFlow() {
  const router = useRouter();
  const questionRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Array<Partial<Record<QuizTag, number>>>>([]);
  const [submitting, setSubmitting] = useState(false);
  const pregunta = QUIZ_QUESTIONS[step];
  const esUltima = step === QUIZ_QUESTIONS.length - 1;

  function elegir(puntos: Partial<Record<QuizTag, number>>, optionLetter: string) {
    if (step === 0) trackEvent("quiz_started", { total_questions: QUIZ_QUESTIONS.length });
    trackEvent("quiz_answered", { question_number: step + 1, option: optionLetter });

    if (submitting) return;
    const nuevosScores: Partial<Record<QuizTag, number>> = {};
    for (const answer of answers.slice(0, step)) {
      for (const [tag, value] of Object.entries(answer) as [QuizTag, number][]) nuevosScores[tag] = (nuevosScores[tag] ?? 0) + value;
    }
    for (const [tag, valor] of Object.entries(puntos) as [QuizTag, number][]) nuevosScores[tag] = (nuevosScores[tag] ?? 0) + valor;

    if (esUltima) {
      setSubmitting(true);
      const dominante = getDominantTag(nuevosScores);
      const perfil = QUIZ_PROFILES.find((p) => p.tag === dominante)!;
      recordQuizProfile(perfil.slug, perfil.familias);
      trackEvent("quiz_completed", { perfil: perfil.slug, total_questions: QUIZ_QUESTIONS.length });
      router.push(`/quiz/resultado/${perfil.slug}`);
      return;
    }
    setAnswers([...answers.slice(0, step), puntos]);
    trackEvent("quiz_progress_reveal", { completed_questions: step + 1, next_question: step + 2, total_questions: QUIZ_QUESTIONS.length });
    setStep((s) => s + 1);
  }

  useEffect(() => { if (step > 0 || answers.length > 0) questionRef.current?.focus(); }, [step, answers.length]);

  return (
    <section aria-labelledby="quiz-question" className="ed-quiz-question">
      <div className="flex items-center gap-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>{String(step + 1).padStart(2, "0")}</span><span className="h-px w-12 bg-line"/><span>{String(QUIZ_QUESTIONS.length).padStart(2, "0")}</span></div>
      <div className="py-8 lg:py-10"><p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Elige por intuición</p><h2 ref={questionRef} tabIndex={-1} id="quiz-question" className="mt-4 max-w-[18ch] font-display text-[32px] font-medium leading-[1.04] tracking-[-.025em] text-ink sm:text-[36px] lg:text-[44px]">{pregunta.pregunta}</h2></div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {pregunta.opciones.map((opcion) => (
          <button key={opcion.letra} type="button" disabled={submitting} onClick={() => elegir(opcion.puntos, opcion.letra)} className="group min-h-28 border-l-2 border-transparent px-0 py-5 text-left transition-[background-color,border-color] hover:border-gold hover:bg-[#f4ecdf]/70 focus-visible:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring dark:hover:bg-[#1a1510]/70">
            <span className="flex items-start gap-4 px-4 sm:px-5"><span className="mt-1 font-plex text-[9px] uppercase tracking-[.16em] text-gold-contrast">{opcion.letra}</span><span className="max-w-[28ch] font-sans text-[15px] leading-6 text-ink">{opcion.texto}</span><span aria-hidden="true" className="ml-auto font-display text-xl text-muted transition-transform group-hover:translate-x-1 group-hover:text-gold-contrast">→</span></span>
          </button>
        ))}
      </div>
      {step > 0 && <button className="ed-quiz-back" type="button" disabled={submitting} onClick={() => setStep(current => current - 1)}>← Pregunta anterior</button>}
      <p role="status" className="sr-only">{submitting ? "Preparando tu resultado…" : `Pregunta ${step + 1} de ${QUIZ_QUESTIONS.length}`}</p>
      <div className="mt-8 flex max-w-48 gap-1" role="progressbar" aria-label="Progreso del cuestionario" aria-valuemin={1} aria-valuemax={QUIZ_QUESTIONS.length} aria-valuenow={step + 1} aria-valuetext={`Pregunta ${step + 1} de ${QUIZ_QUESTIONS.length}`}>{QUIZ_QUESTIONS.map((_, i) => <span key={i} className={`h-px flex-1 ${i <= step ? "bg-gold-contrast" : "bg-line"}`} />)}</div>
    </section>
  );
}
