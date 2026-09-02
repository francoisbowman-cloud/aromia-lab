import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Club — Aromia",
  description: "El espacio comunitario de Aromia está en preparación. Únete a la lista para saber cuándo abra.",
  alternates: { canonical: "/club" },
};

const pillars = [
  ["01", "Perfil", "Una identidad olfativa que pueda cambiar contigo."],
  ["02", "Comunidad", "Reseñas y experiencias de personas, sin convertirlas en una puntuación vacía."],
  ["03", "Continuidad", "Guardar historias, perfumes y rutas para poder volver a ellas."],
] as const;

export default function ClubPage() {
  return (
    <main className="bg-paper text-ink">
      <section className="mx-auto max-w-[1320px] px-6 py-14 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_.82fr] lg:items-start">
          <div>
            <div className="flex items-center gap-4 font-plex text-xs uppercase tracking-[.14em] text-muted"><span>Club</span><span className="h-px w-12 bg-line"/><span>En preparación</span></div>
            <h1 className="mt-12 max-w-[11ch] font-display text-[50px] font-medium leading-[.94] tracking-[-.04em] text-ink sm:text-[62px] lg:text-[78px]">El perfume también se comparte.</h1>
            <p className="mt-7 max-w-[47ch] font-sans text-base leading-7 text-muted">Club será el lugar para continuar después de una lectura o una fragancia: recordar, comparar experiencias y volver a una pista sin convertir Aromia en una red social genérica.</p>

            <div className="mt-14 grid border-t border-line sm:grid-cols-3">
              {pillars.map(([number,title,copy])=><article key={number} className="border-b border-line py-7 sm:min-h-52 sm:border-r sm:pr-6"><span className="font-plex text-xs text-gold-contrast">{number}</span><h2 className="mt-6 font-display text-2xl">{title}</h2><p className="mt-3 font-sans text-sm leading-6 text-muted">{copy}</p></article>)}
            </div>
          </div>

          <aside className="border-t border-line pt-8 lg:sticky lg:top-28">
            <p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">Lista de espera</p>
            <h2 className="mt-5 max-w-[12ch] font-display text-[38px] leading-[.98] tracking-[-.03em] lg:text-[46px]">Entra cuando haya algo real que abrir.</h2>
            <p className="mt-5 max-w-[42ch] font-sans text-sm leading-6 text-muted">Te avisaremos cuando Club tenga una experiencia suficientemente útil para dejar de ser una promesa en la navegación.</p>
            <div className="mt-8"><NewsletterForm fuente="club" mensajeExito="Listo — te avisaremos cuando Club abra." /></div>
            <p className="mt-4 font-sans text-xs leading-5 text-muted">Una sola lista. Puedes salir cuando quieras.</p>
            <div className="mt-10 flex flex-wrap gap-6 border-t border-line pt-6"><Link href="/magazine" className="nav-link text-sm text-ink">Mientras tanto, Historias</Link><Link href="/descubrir" className="nav-link text-sm text-ink">Abrir Discovery</Link></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
