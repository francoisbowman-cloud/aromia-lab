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
            <div className="flex items-center justify-between font-plex text-[10px] uppercase tracking-[.18em] text-muted">
              <span>Club Aromia</span>
              <span>Preview / 01</span>
            </div>
            <p className="mt-12 font-plex text-[10px] uppercase tracking-[.2em] text-gold-contrast">Próximamente / acceso anticipado</p>
            <h1 className="mt-5 max-w-[11ch] font-display text-[52px] font-medium leading-[.94] tracking-[-.035em] text-ink sm:text-[60px] lg:text-[72px]">
              El perfume también se comparte.
            </h1>
            <p className="mt-7 max-w-[46ch] font-sans text-base leading-7 text-muted">
              Un espacio para crear tu perfil olfativo, compartir reseñas y continuar descubriendo después de cada perfume.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
            {pillars.map(([number, title, copy]) => (
              <div key={number} className="py-2">
                <span className="font-plex text-[9px] uppercase tracking-[.16em] text-gold-contrast">{number}</span>
                <h2 className="mt-4 font-display text-2xl text-ink">{title}</h2>
                <p className="mt-2 font-sans text-sm leading-6 text-muted">{copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center px-6 py-12 lg:px-14 lg:py-16">
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            <div className="absolute right-[-18%] top-[7%] h-[44vw] max-h-[620px] w-[44vw] max-w-[620px] rounded-full border border-[#d8c8ae]/55 opacity-25 dark:border-[#5d4a31]" />
            <div className="absolute bottom-[8%] left-[10%] h-36 w-36 rounded-full bg-[#d9b97c]/15 blur-2xl" />
          </div>
          <div className="relative w-full max-w-xl bg-[#fffdf8]/88 px-1 py-8 backdrop-blur-sm dark:bg-[#120f0c]/88 sm:px-8 sm:py-10">
            <p className="font-plex text-[10px] uppercase tracking-[.18em] text-gold-contrast">Lista de espera</p>
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
