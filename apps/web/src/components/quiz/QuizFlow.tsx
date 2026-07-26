"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  QUIZ_QUESTIONS,
  QUIZ_PROFILES,
  getDominantTag,
  type QuizTag,
} from "@/lib/quizData";

export function QuizFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Partial<Record<QuizTag, number>>>({});

  const pregunta = QUIZ_QUESTIONS[step];
  const esUltima = step === QUIZ_QUESTIONS.length - 1;

  function elegir(puntos: Partial<Record<QuizTag, number>>) {
    const nuevosScores = { ...scores };
    for (const [tag, valor] of Object.entries(puntos) as [QuizTag, number][]) {
      nuevosScores[tag] = (nuevosScores[tag] ?? 0) + valor;
    }

    if (esUltima) {
      const dominante = getDominantTag(nuevosScores);
      const perfil = QUIZ_PROFILES.find((p) => p.tag === dominante)!;
      router.push(`/quiz/resultado/${perfil.slug}`);
      return;
    }

    setScores(nuevosScores);
    setStep((s) => s + 1);
  }

  return (
    <div className="rounded-card border border-line bg-surface p-8 shadow-lux lg:p-12">
      <p className="font-sans text-[11px] uppercase tracking-[.16em] text-gold-contrast">
        Pregunta {step + 1} de {QUIZ_QUESTIONS.length}
      </p>
      <h2 className="mt-3 font-display text-2xl font-semibold text-ink lg:text-3xl">
        {pregunta.pregunta}
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {pregunta.opciones.map((opcion) => (
          <button
            key={opcion.letra}
            type="button"
            onClick={() => elegir(opcion.puntos)}
            className="rounded-table border border-line bg-surface p-5 text-left font-sans text-sm text-ink transition hover:border-gold hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {opcion.texto}
          </button>
        ))}
      </div>

      <div className="mt-8 flex gap-1.5" aria-hidden="true">
        {QUIZ_QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= step ? "bg-gold-contrast" : "bg-soft"}`}
          />
        ))}
      </div>
    </div>
  );
}
