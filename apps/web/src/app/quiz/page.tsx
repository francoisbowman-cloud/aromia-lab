import type { Metadata } from "next";
import { QuizFlow } from "@/components/quiz/QuizFlow";

export const metadata: Metadata = {
  title: "¿Qué perfume eres? — Aromia",
  description: "Respondé el quiz de matching y descubrí qué perfumes van con vos.",
  alternates: { canonical: "/quiz" },
};

export default function QuizPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6 lg:p-10">
      <div>
        <p className="font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast">
          Quiz de matching
        </p>
        <h1 className="mt-2 font-display text-[32px] font-semibold leading-tight text-ink lg:text-[40px]">
          ¿Qué perfume eres?
        </h1>
      </div>
      <QuizFlow />
    </main>
  );
}
