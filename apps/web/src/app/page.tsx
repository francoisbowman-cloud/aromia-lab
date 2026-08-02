import Link from "next/link";
import { getArticulos, getPerfumes } from "@/lib/api";
import { FeaturedCarousel } from "@/components/perfume/FeaturedCarousel";
import { HeroEditorPick } from "@/components/perfume/HeroEditorPick";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Button } from "@/components/ui/button";
import { CATEGORIA_LABEL } from "@/lib/magazineCategories";
import { CATEGORIAS_PRINCIPALES } from "@/lib/olfactiveCategories";

export const dynamic = "force-dynamic";

const EYEBROW = "font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast font-semibold";

const ECOSISTEMA = [
  {
    title: "Magazine",
    desc: "Historias, tendencias y entrevistas del mundo de la perfumería.",
    href: "/magazine",
    icon: (
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5A2.5 2.5 0 0 1 17.5 21H6.5A2.5 2.5 0 0 1 4 18.5v-13Z M4 18.5A2.5 2.5 0 0 1 6.5 16H20 M8 7.5h8M8 11h8" />
    ),
  },
  {
    title: "Catálogo",
    desc: "Los mejores perfumes seleccionados y comparados para ti.",
    href: "/catalogo",
    icon: <path d="M6 8V6a4 4 0 0 1 8 0v2 M3 8h14v13H3zM3 8h14v13H3z" />,
  },
  {
    title: "Quiz",
    desc: "Responde 6 preguntas y encuentra el perfil que te representa.",
    href: "/quiz",
    icon: <path d="M12 3.5 14.6 9l6 .9-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.3-4.2 6-.9Z" />,
  },
  {
    title: "Academia",
    desc: "Aprendé a leer y elegir una fragancia con nuestras guías.",
    href: "/academia",
    icon: (
      <path d="M2 8 12 3l10 5-10 5L2 8Z M6 10.5V15c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" />
    ),
  },
  {
    title: "Club",
    desc: "Comunidad, sorteos y beneficios para los amantes de Aromia.",
    href: "/club",
    icon: (
      <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6 M18 11.3a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Z M16 20c.2-2.6 2-4.6 4.5-4.9" />
    ),
  },
];

export default async function Home() {
  const [perfumes, articulos] = await Promise.all([getPerfumes(), getArticulos()]);

  // Reseñas destacadas: prioriza perfumes con rating real (así se ve la
  // estrella, no un placeholder) — si ninguno tiene todavía, cae a los
  // primeros del catálogo igual que antes. El carrusel puede mostrar más
  // que las 3 originales porque ahora hay scroll, no un grid fijo.
  const conRating = perfumes.filter((p) => p.rating_promedio);
  const destacados = (conRating.length >= 3 ? conRating : perfumes).slice(0, 9);
  // El hero rota entre los primeros — misma fuente que el carrusel de abajo,
  // para no introducir un segundo criterio de "destacado".
  const heroPicks = destacados.slice(0, 5);

  const familiasPresentes = new Set(perfumes.map((p) => p.familia_olfativa));
  const categoriasConResultados = CATEGORIAS_PRINCIPALES.filter((c) =>
    c.familias.some((f) => familiasPresentes.has(f)),
  );

  const ultimoArticulo = articulos
    .filter((a) => a.categoria !== "academia")
    .sort((a, b) => (a.publicado_en < b.publicado_en ? 1 : -1))[0];

  return (
    <main className="flex flex-col">
      {/* Hero — dos columnas: texto + escena editorial (ver GUIA-VISUAL-aromia.md) */}
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 p-6 py-14 lg:grid-cols-2 lg:gap-16 lg:p-10 lg:py-24">
        <div className="flex flex-col items-start gap-5">
          <p className={EYEBROW}>La autoridad editorial que además vende</p>
          <h1 className="max-w-xl font-display text-[40px] font-semibold leading-[1.05] text-ink lg:text-[56px]">
            No fabricamos perfumes.
            <br />
            <em className="font-display italic text-gold-contrast">Revelamos identidades.</em>
          </h1>
          <p className="max-w-xl font-sans text-lg text-muted">
            Reseñas honestas, comparadas y sin ruido — para encontrar la fragancia que realmente
            te representa.
          </p>
          <div className="mt-2 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/catalogo">Explorar catálogo</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/quiz">Hacer el quiz</Link>
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-9">
            <div>
              <b className="block font-display text-[28px] font-normal leading-none text-ink">
                {perfumes.length}
              </b>
              <span className="mt-1.5 block font-sans text-[10.5px] uppercase tracking-[.16em] text-muted">
                Fragancias comparadas
              </span>
            </div>
            <div>
              <b className="block font-display text-[28px] font-normal leading-none text-ink">
                {categoriasConResultados.length}
              </b>
              <span className="mt-1.5 block font-sans text-[10.5px] uppercase tracking-[.16em] text-muted">
                Familias olfativas
              </span>
            </div>
            <div>
              <b className="block font-display text-[28px] font-normal leading-none text-ink">6</b>
              <span className="mt-1.5 block font-sans text-[10.5px] uppercase tracking-[.16em] text-muted">
                Filtros de búsqueda
              </span>
            </div>
          </div>
        </div>

        {heroPicks.length > 0 ? <HeroEditorPick perfumes={heroPicks} /> : null}
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-24 p-6 pb-24 lg:p-10 lg:pb-32">
        {destacados.length > 0 ? (
          <section>
            <div className="flex items-baseline justify-between">
              <div>
                <p className={EYEBROW}>Reseñas destacadas</p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-ink lg:text-3xl">
                  Lo que está mirando la comunidad
                </h2>
              </div>
              <Link href="/catalogo" className="nav-link font-sans text-sm text-muted transition hover:text-ink">
                Ver todo el catálogo →
              </Link>
            </div>
            <div className="mt-8">
              <FeaturedCarousel perfumes={destacados} />
            </div>
          </section>
        ) : null}

        {/* Ecosistema — 5 accesos directos a las secciones reales del sitio */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <p className={EYEBROW}>El Ecosistema</p>
            <span className="h-px flex-1 bg-line" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {ECOSISTEMA.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group block rounded-card border border-line bg-surface p-4 transition duration-300 hover:-translate-y-1 hover:border-gold"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.4}
                  className="mb-3 h-[26px] w-[26px] text-gold-contrast"
                >
                  {item.icon}
                </svg>
                <h4 className="font-display text-lg font-semibold text-ink">{item.title}</h4>
                <p className="mt-1.5 font-sans text-xs leading-relaxed text-muted">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {categoriasConResultados.length > 0 ? (
          <section>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={EYEBROW}>Explora por notas</p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-ink lg:text-3xl">
                  Encuentra tu esencia
                </h2>
              </div>
              <Link
                href="/catalogo"
                className="nav-link font-sans text-sm text-ink transition hover:text-gold-contrast"
              >
                Ver todo el catálogo →
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:grid-cols-8">
              {categoriasConResultados.map((cat) => {
                // Foto real de un perfume de la familia (no solo el degradé de
                // marca) para que el tile sea "fiel" a la esencia que
                // representa, no una mancha de color abstracta.
                const representante = perfumes.find(
                  (p) => cat.familias.includes(p.familia_olfativa) && p.imagen_url,
                );
                return (
                  <Link
                    key={cat.label}
                    href={`/catalogo?familia=${encodeURIComponent(cat.familias[0])}`}
                    className="group relative flex aspect-square items-end overflow-hidden rounded-card transition duration-300 hover:-translate-y-1"
                    style={{ background: cat.gradient }}
                  >
                    {representante ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={representante.imagen_url}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-luminosity transition duration-300 group-hover:scale-105"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                    <span className="relative z-[1] p-3 font-sans text-[11px] uppercase tracking-[.12em] text-white [text-shadow:0_2px_8px_rgba(0,0,0,.35)]">
                      {cat.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        {ultimoArticulo ? (
          <section className="grid grid-cols-1 gap-8 rounded-card border border-line bg-surface p-8 shadow-lux lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:gap-12 lg:p-12">
            <div>
              <p className={EYEBROW}>Magazine</p>
              <h2 className="mt-3 font-display text-2xl text-ink lg:text-3xl">
                {ultimoArticulo.titulo}
              </h2>
              {ultimoArticulo.meta_description ? (
                <p className="mt-3 max-w-lg font-sans text-sm text-muted">
                  {ultimoArticulo.meta_description}
                </p>
              ) : null}
              <p className="mt-2 font-sans text-[11px] uppercase tracking-[.1em] text-muted">
                {CATEGORIA_LABEL[ultimoArticulo.categoria]}
              </p>
            </div>
            <Button asChild variant="outline" size="lg" className="justify-self-start">
              <Link href={`/magazine/${ultimoArticulo.slug}`}>Leer Magazine</Link>
            </Button>
          </section>
        ) : null}

        <section className="rounded-card border border-line bg-surface p-10 text-center shadow-lux lg:p-16">
          <p className={EYEBROW}>Quiz de matching</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink lg:text-4xl">
            ¿No sabes por dónde empezar?
          </h2>
          <p className="mx-auto mt-3 max-w-md font-sans text-muted">
            Responde 6 preguntas y te mostramos los perfumes que mejor se adaptan a tu estilo y
            presupuesto.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/quiz">Empezar el quiz</Link>
          </Button>
        </section>

        <section className="flex flex-col items-center justify-between gap-6 rounded-card bg-ink px-8 py-12 text-center text-paper shadow-lux lg:flex-row lg:px-14 lg:text-left">
          <div>
            <h2 className="font-display text-2xl font-semibold lg:text-3xl">
              Sumate al Club Aromia
            </h2>
            <p className="mt-2 font-sans text-sm text-paper/70">
              Acceso anticipado a guías, drops y comparativas exclusivas.
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <Link href="/club">Unirme</Link>
          </Button>
        </section>

        <section className="mx-auto flex max-w-lg flex-col items-center gap-3 text-center">
          <p className={EYEBROW}>La Carta de Aromia</p>
          <h2 className="font-display text-xl font-semibold text-ink">
            Alertas de bajada de precio
          </h2>
          <p className="font-sans text-sm text-muted">
            Deja tu email y te avisamos cuando tu perfume favorito baje de precio.
          </p>
          <div className="w-full">
            <NewsletterForm fuente="home" />
          </div>
        </section>
      </div>
    </main>
  );
}
