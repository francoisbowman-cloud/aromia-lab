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

  // Reseñas destacadas: prioriza perfumes con rating real; si todavía no
  // hay suficientes, conserva el catálogo real como fallback editorial.
  const conRating = perfumes.filter((p) => p.rating_promedio);
  const destacados = (conRating.length >= 3 ? conRating : perfumes).slice(0, 4);

  const familiasPresentes = new Set(perfumes.map((p) => p.familia_olfativa));
  const categoriasConResultados = CATEGORIAS_PRINCIPALES.filter((c) =>
    c.familias.some((f) => familiasPresentes.has(f)),
  );

  const ultimoArticulo = articulos
    .filter((a) => a.categoria !== "academia")
    .sort((a, b) => (a.publicado_en < b.publicado_en ? 1 : -1))[0];

  return (
    <main className="flex flex-col overflow-hidden">
      {/* 1 · Hero — Editorial Cinematic + lenguaje macro sensorial */}
      <HomeHero />

      {/* 2 · Prueba de valor — deliberadamente subordinada al hero */}
      <div className="border-b border-line bg-paper/60 dark:bg-surface/35">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-7 gap-y-2 px-6 py-4 font-plex text-[10.5px] uppercase tracking-[.08em] text-muted lg:px-10">
          <span>
            <b className="font-sans font-bold text-gold-contrast">{perfumes.length}</b>{" "}
            fragancias comparadas
          </span>
          <span aria-hidden="true" className="hidden h-px w-6 bg-line sm:block" />
          <span>
            <b className="font-sans font-bold text-gold-contrast">{categoriasConResultados.length}</b>{" "}
            familias olfativas
          </span>
          <span aria-hidden="true" className="hidden h-px w-6 bg-line sm:block" />
          <span>
            <b className="font-sans font-bold text-gold-contrast">6</b> filtros de búsqueda
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-20 py-20 lg:gap-32 lg:py-32">
        {/* 3 · Destacados — selección editorial, no listado de catálogo */}
        {destacados.length > 0 ? (
          <Reveal>
            <EditorialSelection perfumes={destacados} />
          </Reveal>
        ) : null}

        {/* 4 · Ecosistema — gesto tipográfico grande */}
        <Reveal>
          <EcosystemGesture />
        </Reveal>

        {/* 5 · Índice Olfativo */}
        {categoriasConResultados.length > 0 ? (
          <Reveal>
            <OlfactiveIndex categorias={categoriasConResultados} />
          </Reveal>
        ) : null}

        {/* 6 · Product Reveal — materia → identidad → objeto */}
        <Reveal>
          <SensoryInterlude />
        </Reveal>

        {/* 7 · Magazine — autoridad editorial */}
        {ultimoArticulo ? (
          <Reveal>
            <MagazineSpotlight articulo={ultimoArticulo} />
          </Reveal>
        ) : null}

        {/* 8 · Quiz — discovery como consulta olfativa */}
        <Reveal>
          <QuizSpotlight />
        </Reveal>

        {/* 9 · Conversión final — un capítulo editorial, no dos cards */}
        <Reveal className="mx-auto w-full max-w-6xl px-6 lg:px-10">
          <section className="border-y border-line py-10 lg:py-14">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_.85fr] lg:gap-20">
              <div className="flex flex-col justify-between gap-10">
                <div>
                  <p className={EYEBROW}>Club Aromia · acceso 01</p>
                  <h2 className="mt-4 max-w-[10ch] font-display text-[clamp(38px,5.2vw,68px)] font-medium leading-[.96] tracking-[-.025em] text-ink">
                    Sigue oliendo más allá de la ficha.
                  </h2>
                  <p className="mt-6 max-w-[43ch] font-sans text-[15px] leading-7 text-muted">
                    Guías, comparativas y selecciones que continúan la conversación después de
                    encontrar una fragancia.
                  </p>
                </div>

                <Link
                  href="/club"
                  className="group inline-flex w-fit items-center gap-3 border-b border-ink/30 pb-1.5 font-plex text-[11px] uppercase tracking-[.14em] text-ink transition-colors hover:border-gold hover:text-gold-contrast"
                >
                  Entrar al Club
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>

              <div className="border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-1">
                <p className={EYEBROW}>La Carta de Aromia · correo 02</p>
                <h3 className="mt-4 font-display text-[28px] font-medium leading-tight text-ink lg:text-[34px]">
                  Una señal cuando valga la pena volver.
                </h3>
                <p className="mt-4 max-w-[38ch] font-sans text-sm leading-6 text-muted">
                  Bajadas de precio, nuevas comparativas y piezas editoriales. Sin convertir tu
                  bandeja de entrada en otro catálogo.
                </p>
                <div className="mt-7">
                  <NewsletterForm fuente="home" />
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}
