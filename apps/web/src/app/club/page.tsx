import type { Metadata } from "next";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Club Aromia",
  description: "Únete a la lista de espera de Club Aromia: perfiles, reseñas de comunidad y descubrimiento social alrededor del perfume.",
  alternates: { canonical: "/club" },
};

const pillars = [
  ["01", "Perfil", "Construye una identidad olfativa que evoluciona contigo."],
  ["02", "Comunidad", "Comparte lecturas y descubre cómo otras personas viven una fragancia."],
  ["03", "Discovery", "Guarda referencias, conecta historias y vuelve a lo que merece una segunda lectura."],
];

export default function ClubPage() {
  return (
    <main className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]">
      <section className="mx-auto grid min-h-[calc(100vh-72px)] max-w-[1440px] grid-cols-1 lg:grid-cols-[1.12fr_.88fr]">
        <div className="flex flex-col justify-between border-b border-line px-6 py-10 lg:border-b-0 lg:border-r lg:px-10 lg:py-14">
          <div>
            <div className="flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.2em] text-muted"><span>Club Aromia</span><span className="h-px flex-1 bg-line"/><span>Preview / 01</span></div>
            <p className="mt-12 font-plex text-[9px] uppercase tracking-[.22em] text-gold-contrast">Próximamente / acceso anticipado</p>
            <h1 className="mt-5 max-w-[9ch] font-display text-[58px] font-medium leading-[.88] tracking-[-.045em] text-ink lg:text-[92px]">El perfume también se comparte.</h1>
            <p className="mt-7 max-w-[44ch] font-sans text-[15px] leading-7 text-muted">Club Aromia será la capa social del producto: perfiles olfativos, reseñas de comunidad y rutas de descubrimiento que continúan después de una ficha o un artículo.</p>
          </div>

          <div className="mt-16 grid grid-cols-1 border-y border-line sm:grid-cols-3">
            {pillars.map(([number, title, copy], index) => (
              <div key={number} className={`py-5 sm:px-5 sm:first:pl-0 sm:last:pr-0 ${index < pillars.length - 1 ? "border-b border-line sm:border-b-0 sm:border-r" : ""}`}>
                <span className="font-plex text-[8px] uppercase tracking-[.16em] text-gold-contrast">{number}</span>
                <h2 className="mt-4 font-display text-2xl text-ink">{title}</h2>
                <p className="mt-2 font-sans text-xs leading-5 text-muted">{copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center px-6 py-12 lg:px-14 lg:py-16">
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden"><div className="absolute right-[-18%] top-[7%] h-[44vw] max-h-[620px] w-[44vw] max-w-[620px] rounded-full border border-[#d8c8ae] opacity-35 dark:border-[#5d4a31]"/><div className="absolute bottom-[8%] left-[10%] h-36 w-36 rounded-full bg-[#d9b97c]/15 blur-2xl"/></div>
          <div className="relative w-full max-w-xl border-y border-line bg-[#fffdf8]/88 px-1 py-8 backdrop-blur-sm dark:bg-[#120f0c]/88 sm:px-8 sm:py-10">
            <p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Lista de espera</p>
            <h2 className="mt-4 max-w-[11ch] font-display text-[38px] font-medium leading-[.98] tracking-[-.025em] text-ink lg:text-[50px]">Entra antes de que abramos las puertas.</h2>
            <p className="mt-5 max-w-[42ch] font-sans text-sm leading-6 text-muted">Te avisaremos cuando el Club esté disponible. Sin feed artificial ni promociones diarias: solo el acceso y las novedades que realmente cambien la experiencia.</p>
            <div className="mt-8"><NewsletterForm fuente="club" mensajeExito="Listo — te avisamos en cuanto abra el Club." /></div>
            <p className="mt-4 font-sans text-[10px] leading-5 text-muted">Una sola lista. Puedes salir cuando quieras.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
