import type { Metadata } from "next";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Club Aromia",
  description: "Únete a la lista de espera de Club Aromia: perfiles, reseñas de comunidad y descubrimiento social alrededor del perfume.",
  alternates: { canonical: "/club" },
};

const pillars = [
  ["01", "Perfil", "Construye una identidad olfativa que evoluciona contigo."],
  ["02", "Comunidad", "Comparte reseñas y descubre cómo otras personas viven una fragancia."],
  ["03", "Discovery", "Guarda perfumes, historias y rutas que quieras volver a explorar."],
];

export default function ClubPage() {
  return (
    <main className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]">
      <section className="mx-auto grid min-h-[calc(100vh-72px)] max-w-[1440px] grid-cols-1 lg:grid-cols-[1.08fr_.92fr]">
        <div className="flex flex-col justify-between px-6 py-10 lg:px-10 lg:py-14">
          <div>
            <div className="flex items-center justify-between font-plex text-xs uppercase tracking-[.14em] text-muted">
              <span>Club Aromia</span>
              <span>Preview / 01</span>
            </div>
            <p className="mt-12 font-plex text-xs uppercase tracking-[.15em] text-gold-contrast">Próximamente / acceso anticipado</p>
            <h1 className="mt-5 max-w-[11ch] font-display text-[46px] font-medium leading-[.96] tracking-[-.035em] text-ink sm:text-[54px] lg:text-[64px]">
              El perfume también se comparte.
            </h1>
            <p className="mt-7 max-w-[46ch] font-sans text-base leading-7 text-muted">
              Un espacio para crear tu perfil olfativo, compartir reseñas y continuar descubriendo después de cada perfume.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
            {pillars.map(([number, title, copy]) => (
              <div key={number} className="py-2">
                <span className="font-plex text-xs uppercase tracking-[.12em] text-gold-contrast">{number}</span>
                <h2 className="mt-4 font-display text-2xl text-ink">{title}</h2>
                <p className="mt-2 font-sans text-sm leading-6 text-muted">{copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative px-6 py-12 lg:grid lg:grid-cols-[.34fr_.66fr] lg:items-center lg:gap-8 lg:px-10 lg:py-16 xl:gap-10 xl:px-14">
          <div aria-hidden="true" className="mb-8 grid grid-cols-3 border-y border-[#b79a6b]/25 py-4 lg:mb-0 lg:block lg:border-y-0 lg:py-0">
            {pillars.map(([number, title]) => (
              <div key={number} className="min-w-0 text-center lg:relative lg:border-l lg:border-[#b79a6b]/30 lg:pb-10 lg:pl-5 lg:pt-3 lg:text-left dark:lg:border-[#806842]/35">
                <span className="font-display text-sm text-gold-contrast">{number}</span>
                <span className="ml-2 font-plex text-[9px] uppercase tracking-[.13em] text-muted lg:ml-0 lg:mt-3 lg:block">{title}</span>
                <span className="hidden lg:absolute lg:-left-[3px] lg:top-[13px] lg:block lg:h-[5px] lg:w-[5px] lg:rounded-full lg:bg-gold-contrast" />
              </div>
            ))}
            <p className="hidden lg:block lg:border-l lg:border-[#b79a6b]/30 lg:pl-5 lg:pt-2 font-plex text-[8px] uppercase leading-5 tracking-[.14em] text-muted dark:lg:border-[#806842]/35">
              Identidad<br />rastro<br />afinidad
            </p>
          </div>

          <div className="relative w-full bg-[#fffdf8] py-8 dark:bg-[#120f0c] sm:px-8 sm:py-10 lg:px-7 xl:px-9">
            <div aria-hidden="true" className="absolute left-0 top-0 h-px w-20 bg-gold-contrast/45" />
            <p className="font-plex text-xs uppercase tracking-[.14em] text-gold-contrast">Lista de espera</p>
            <h2 className="mt-4 max-w-[12ch] font-display text-[36px] font-medium leading-[1.02] tracking-[-.02em] text-ink sm:text-[42px] lg:text-[46px]">
              Entra antes de que abramos las puertas.
            </h2>
            <p className="mt-5 max-w-[42ch] font-sans text-base leading-7 text-muted">
              Te avisaremos cuando el Club esté disponible y cuando haya novedades importantes.
            </p>
            <div className="mt-8">
              <NewsletterForm fuente="club" mensajeExito="Listo — te avisamos en cuanto abra el Club." />
            </div>
            <p className="mt-4 font-sans text-xs leading-5 text-muted">Una sola lista. Puedes salir cuando quieras.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
