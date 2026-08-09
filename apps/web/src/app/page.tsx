import Link from "next/link";
import { getArticulos, getPerfumes } from "@/lib/api";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Button } from "@/components/ui/button";
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

const EYEBROW = "font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast font-semibold";

export default async function Home() {
  const [perfumes, articulos] = await Promise.all([getPerfumes(), getArticulos()]);

  // Reseñas destacadas: prioriza perfumes con rating real (así se ve la
  // estrella, no un placeholder) — si ninguno tiene todavía, cae a los
  // primeros del catálogo igual que antes.
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
    <main className="flex flex-col">
      {/* 1 · Hero — Editorial Cinematic + activo macro Sensory (docs/design/visual-upgrade/prototypes/home-hybrid-01) */}
      <HomeHero />

      {/* 2 · Stats — subordinados al hero, una sola línea, no un dashboard */}
      <div className="border-b border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-baseline gap-x-8 gap-y-1 px-6 py-4 font-plex text-[11.5px] text-muted lg:px-10">
          <span>
            <b className="font-sans font-bold text-gold-contrast">{perfumes.length}</b> fragancias
            comparadas
          </span>
          <span className="opacity-40">·</span>
          <span>
            <b className="font-sans font-bold text-gold-contrast">{categoriasConResultados.length}</b>{" "}
            familias olfativas
          </span>
          <span className="opacity-40">·</span>
          <span>
            <b className="font-sans font-bold text-gold-contrast">6</b> filtros de búsqueda
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-20 py-20 lg:gap-28 lg:py-28">
        {/* 3 · Destacados — selección editorial, no listado de catálogo */}
        {destacados.length > 0 ? (
          <Reveal>
            <EditorialSelection perfumes={destacados} />
          </Reveal>
        ) : null}

        {/* 4 · Ecosistema — gesto tipográfico grande, full-bleed */}
        <Reveal>
          <EcosystemGesture />
        </Reveal>

        {/* 5 · Índice Olfativo */}
        {categoriasConResultados.length > 0 ? (
          <Reveal>
            <OlfactiveIndex categorias={categoriasConResultados} />
          </Reveal>
        ) : null}

        {/* 6 · Product Reveal / interludio sensorial — full-bleed */}
        <Reveal>
          <SensoryInterlude />
        </Reveal>

        {/* 7 · Magazine — autoridad editorial, full-bleed */}
        {ultimoArticulo ? (
          <Reveal>
            <MagazineSpotlight articulo={ultimoArticulo} />
          </Reveal>
        ) : null}

        {/* 8 · Quiz — discovery estratégico, full-bleed */}
        <Reveal>
          <QuizSpotlight />
        </Reveal>

        {/* 9 · Club / Newsletter — cierre, adaptado al lenguaje nuevo */}
        <Reveal className="mx-auto w-full max-w-6xl px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_.9fr]">
            <div className="flex flex-col items-center justify-center gap-4 rounded-card bg-ink px-8 py-12 text-center text-paper shadow-lux lg:items-start lg:px-14 lg:text-left">
              <div>
                <h2 className="font-display text-2xl font-semibold lg:text-3xl">
                  Sumate al Club Aromia
                </h2>
                <p className="mt-2 font-sans text-sm text-paper/70">
                  Acceso anticipado a guías, drops y comparativas exclusivas.
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/club">Unirme</Link>
              </Button>
            </div>

            <div className="flex flex-col justify-center gap-2.5 rounded-card border border-line px-8 py-12 text-center lg:px-14 lg:text-left">
              <p className={EYEBROW}>La Carta de Aromia</p>
              <h2 className="font-display text-xl font-semibold text-ink">
                Alertas de bajada de precio
              </h2>
              <p className="font-sans text-sm text-muted">
                Deja tu email y te avisamos cuando tu perfume favorito baje de precio.
              </p>
              <NewsletterForm fuente="home" />
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
