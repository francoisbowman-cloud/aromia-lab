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

        <div className="relative flex items-center overflow-hidden px-6 py-12 lg:px-14 lg:py-16">
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-y-[7%] left-[9%] w-px bg-[#b79a6b]/25 dark:bg-[#806842]/30" />
            <div className="absolute inset-x-[9%] top-[11%] flex items-center justify-between font-plex text-[9px] uppercase tracking-[.18em] text-[#8e744f]/70 dark:text-[#c7a76f]/55">
              <span>Club Aromia</span>
              <span>Traza / 01–03</span>
            </div>
            <div className="absolute inset-x-[9%] top-[24%] space-y-8 sm:space-y-10 lg:top-[22%] lg:space-y-12">
              {pillars.map(([number, title], index) => (
                <div key={number} className="relative grid grid-cols-[38px_1fr] items-center gap-4 sm:grid-cols-[48px_1fr]">
                  <span className="relative z-10 grid h-8 w-8 place-items-center bg-[#fbf8f3] font-display text-sm text-gold-contrast dark:bg-[#0f0c09] sm:h-9 sm:w-9">
                    {number}
                  </span>
                  <div className="relative">
                    <div className="absolute left-[-14px] right-0 top-1/2 h-px bg-[#b79a6b]/20 dark:bg-[#806842]/25" />
                    <span className={`relative inline-block bg-[#fbf8f3]/80 pr-4 font-display text-[clamp(2.2rem,4.8vw,4.8rem)] leading-none tracking-[-.045em] text-[#3a3026]/[.09] dark:bg-[#0f0c09]/80 dark:text-[#f2ebdd]/[.07] ${index === 1 ? "translate-x-[5%]" : index === 2 ? "translate-x-[10%]" : ""}`}>
                      {title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-[8%] right-[8%] h-24 w-24 rounded-full border border-[#b79a6b]/20 dark:border-[#806842]/25" />
            <div className="absolute bottom-[11%] right-[11%] h-10 w-10 rounded-full border border-[#b79a6b]/20 dark:border-[#806842]/25" />
          </div>

          <div className="relative ml-auto w-full max-w-xl bg-[#fffdf8]/92 px-1 py-8 shadow-[0_24px_70px_rgba(52,42,31,.08)] backdrop-blur-sm dark:bg-[#120f0c]/92 dark:shadow-[0_24px_70px_rgba(0,0,0,.22)] sm:px-8 sm:py-10">
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
