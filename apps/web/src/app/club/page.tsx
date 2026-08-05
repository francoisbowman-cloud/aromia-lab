import type { Metadata } from "next";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Club — Aromia",
  description: "El Club de Aromia está en construcción. Sumate a la lista de espera para ser de los primeros en entrar.",
};

export default function ClubPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center gap-6 p-6 py-24 text-center lg:p-10 lg:py-32">
      <p className="font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast">
        Próximamente
      </p>
      <h1 className="font-display text-3xl font-semibold text-ink lg:text-4xl">
        El Club de Aromia está en camino
      </h1>
      <p className="max-w-lg font-sans text-muted">
        Estamos construyendo un espacio para reseñas de la comunidad, perfiles y
        descubrimiento social entre personas que aman los perfumes. Dejá tu email
        y te avisamos apenas abra.
      </p>
      <div className="w-full max-w-sm">
        <NewsletterForm
          fuente="club"
          mensajeExito="Listo — te avisamos en cuanto abra el Club."
        />
      </div>
    </main>
  );
}
