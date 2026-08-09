import Link from "next/link";
import { getArticulos, getPerfumes } from "@/lib/api";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Reveal } from "@/components/home/Reveal";
import { HomeHero } from "@/components/home/HomeHero";
import { EditorialSelection } from "@/components/home/EditorialSelection";
import { EcosystemGesture } from "@/components/home/EcosystemGesture";
import { OlfactiveIndex } from "@/components/home/OlfactiveIndex";
import { SensoryInterlude } from "@/components/home/SensoryInterlude";
import { MagazineSpotlight } from "@/components/home/MagazineSpotlight";
import { QuizSpotlight } from "@/components/home/QuizSpotlight";
import { CATEGORIAS_PRINCIPALES } from "@/lib/olfactiveCategories";

export const dynamic = "force-dynamic";

const EYEBROW =
  "font-sans text-[10px] font-semibold uppercase tracking-[.28em] text-gold-contrast";

export default async function Home() {
  const [perfumes, articulos] = await Promise.all([getPerfumes(), getArticulos()]);

  const conRating = perfumes.filter((p) => p.rating_promedio);
  const destacados = (conRating.length >= 3 ? conRating : perfumes).slice(0, 4);
  const heroPerfume = destacados[0] ?? perfumes[0];

  const familiasPresentes = new Set(perfumes.map((p) => p.familia_olfativa));
  const categoriasConResultados = CATEGORIAS_PRINCIPALES.filter((c) =>
    c.familias.some((f) => familiasPresentes.has(f)),
  );

  const ultimoArticulo = articulos
    .filter((a) => a.categoria !== "academia")
    .sort((a, b) => (a.publicado_en < b.publicado_en ? 1 : -1))[0];

  return (
    <main className="overflow-hidden bg-bg text-ink">
      <HomeHero perfume={heroPerfume} />

      <div className="relative z-[2] -mt-px border-y border-line bg-[#fbf7ef] dark:bg-[#15110d]">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-7 gap-y-2 px-6 py-4 font-plex text-[10px] uppercase tracking-[.1em] text-muted lg:px-10">
          <span><b className="font-sans font-bold text-gold-contrast">{perfumes.length}</b> fragancias comparadas</span>
          <span aria-hidden="true" className="hidden h-px w-8 bg-line sm:block" />
          <span><b className="font-sans font-bold text-gold-contrast">{categoriasConResultados.length}</b> familias olfativas</span>
          <span aria-hidden="true" className="hidden h-px w-8 bg-line sm:block" />
          <span><b className="font-sans font-bold text-gold-contrast">6</b> filtros de búsqueda</span>
        </div>
      </div>

      {destacados.length > 0 ? (
        <Reveal className="relative bg-[#fbf8f3] py-20 dark:bg-[#0f0c09] lg:py-28">
          <EditorialSelection perfumes={destacados} />
        </Reveal>
      ) : null}

      <Reveal><EcosystemGesture /></Reveal>

      {categoriasConResultados.length > 0 ? (
        <Reveal><OlfactiveIndex categorias={categoriasConResultados} /></Reveal>
      ) : null}

      <Reveal><SensoryInterlude /></Reveal>

      {ultimoArticulo ? (
        <Reveal><MagazineSpotlight articulo={ultimoArticulo} /></Reveal>
      ) : null}

      <Reveal><QuizSpotlight /></Reveal>

      <Reveal className="relative bg-[#fbf8f3] dark:bg-[#0f0c09]">
        <section className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="mb-12 flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted">
            <span>Private edition</span><span className="h-px flex-1 bg-line" /><span>08 / Closing note</span>
          </div>
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.1fr_.9fr] lg:gap-24">
            <div className="flex flex-col justify-between gap-12">
              <div>
                <p className={EYEBROW}>Club Aromia · círculo privado</p>
                <h2 className="mt-5 max-w-[9ch] font-display text-[clamp(42px,5.6vw,74px)] font-medium leading-[.92] tracking-[-.03em] text-ink">
                  La conversación continúa después del perfume.
                </h2>
                <p className="mt-7 max-w-[42ch] font-sans text-[15px] leading-7 text-muted">
                  Entradas editoriales, comparativas y selecciones reservadas para quienes quieren entender más de lo que compran.
                </p>
              </div>
              <Link href="/club" className="group inline-flex w-fit items-center gap-4 border-b border-ink pb-2 font-plex text-[10px] uppercase tracking-[.16em] text-ink transition-colors hover:border-gold hover:text-gold-contrast dark:border-[#f2ebdd]">
                Solicitar acceso al Club <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            <div className="relative border-t border-line pt-9 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
              <span aria-hidden="true" className="absolute -left-px top-0 hidden h-20 w-px bg-gold lg:block" />
              <p className={EYEBROW}>La Carta de Aromia · edición por correo</p>
              <h3 className="mt-5 max-w-[12ch] font-display text-[30px] font-medium leading-[1.03] text-ink lg:text-[40px]">
                Solo cuando exista algo que merezca tu atención.
              </h3>
              <p className="mt-5 max-w-[38ch] font-sans text-sm leading-6 text-muted">
                Bajadas de precio, nuevas comparativas y piezas editoriales, sin convertir tu bandeja de entrada en otro escaparate.
              </p>
              <div className="mt-8"><NewsletterForm fuente="home" /></div>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
