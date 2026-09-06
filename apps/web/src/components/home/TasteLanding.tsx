import Link from "next/link";
import type { Article, Perfume } from "@/lib/types";
import { formattedReferencePrice, publicText } from "@/lib/catalogDisplay";
import { ProductImage } from "@/components/perfume/ProductImage";
import { NewsletterForm } from "@/components/NewsletterForm";
import type { CATEGORIAS_PRINCIPALES } from "@/lib/olfactiveCategories";

type Categoria = (typeof CATEGORIAS_PRINCIPALES)[number];

const familyCopy: Record<string, string> = {
  Acuáticos: "Luz salina, transparencia y aire.",
  Floral: "Pétalos, textura y una estela que se acerca.",
  Amaderados: "Materia seca, profundidad y calma.",
  Árabes: "Resinas, especias y presencia cálida.",
  Cítricos: "Brillo inmediato, limpio y preciso.",
  Afrutados: "Pulpa, color y energía expresiva.",
  Frescos: "Claridad cotidiana, ligera y directa.",
  Fougère: "Verde, aromático y estructurado.",
};

function pickDistinct(perfumes: Perfume[], count: number) {
  const seen = new Set<string>();
  return perfumes.filter((perfume) => {
    if (!perfume?.slug || seen.has(perfume.slug)) return false;
    seen.add(perfume.slug);
    return Boolean(perfume.imagen_url);
  }).slice(0, count);
}

function perfumeNotes(perfume: Perfume) {
  return [...(perfume.notas_salida ?? []), ...(perfume.notas_corazon ?? []), ...(perfume.notas_fondo ?? [])]
    .filter((note, index, all) => Boolean(note) && all.indexOf(note) === index)
    .slice(0, 3);
}

export function TasteLanding({ perfumes, articulos, categorias }: { perfumes: Perfume[]; articulos: Article[]; categorias: Categoria[] }) {
  const visuales = pickDistinct(perfumes, 8);
  const hero = visuales[0] ?? perfumes[0];
  const editorial = visuales[4] ?? visuales[1] ?? hero;
  const selection = (visuales.length >= 4 ? visuales : perfumes).slice(1, 4);
  const story = articulos.find((article) => article.categoria !== "academia") ?? articulos[0];
  const index = categorias.slice(0, 6);

  return (
    <main className="overflow-hidden bg-[#fbf8f3] text-ink dark:bg-[#0d0b09]">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -right-[10%] top-[8%] h-[62%] w-[58%] rounded-full bg-[radial-gradient(circle,rgba(200,168,107,.16)_0%,rgba(200,168,107,.05)_38%,transparent_70%)] blur-3xl dark:opacity-50" />
        </div>

        <div className="relative mx-auto grid min-h-[720px] w-full max-w-[1440px] grid-cols-1 lg:min-h-[calc(100vh-72px)] lg:grid-cols-[.94fr_1.06fr]">
          <div className="flex flex-col justify-between px-6 py-10 sm:py-14 lg:px-10 lg:py-16 xl:px-14">
            <p className="font-plex text-[9px] uppercase tracking-[.19em] text-muted">Perfume · Cultura · Descubrimiento</p>

            <div className="max-w-[700px] py-12 lg:py-8">
              <h1 className="max-w-[9.4ch] font-display text-[clamp(3.5rem,6.4vw,6.8rem)] font-medium leading-[.84] tracking-[-.05em] text-ink">
                El perfume no se elige. <span className="text-gold-contrast">Se reconoce.</span>
              </h1>
              <div className="mt-9 grid max-w-[680px] gap-7 sm:grid-cols-[1fr_auto] sm:items-end">
                <p className="max-w-[45ch] font-sans text-base leading-7 text-muted">
                  Aromia convierte notas, carácter y contexto en una forma más clara de descubrir perfumes.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/quiz" className="inline-flex min-h-12 items-center justify-center border border-ink bg-ink px-5 font-plex text-[9px] uppercase tracking-[.17em] text-[#fbf8f3] transition duration-300 hover:bg-gold-contrast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold dark:border-[#f2ebdd] dark:bg-[#f2ebdd] dark:text-[#0d0b09]">Encontrar mi firma</Link>
                  <Link href="/descubrir" className="inline-flex min-h-12 items-center justify-center px-3 font-plex text-[9px] uppercase tracking-[.17em] text-ink transition duration-300 hover:text-gold-contrast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">Explorar Discovery →</Link>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-7 gap-y-2 font-plex text-[8px] uppercase tracking-[.15em] text-muted">
              <span>Catálogo curado</span><span>Índice olfativo</span><span>Magazine</span><span>Discovery</span>
            </div>
          </div>

          <div className="relative min-h-[500px] bg-[#f1e9dd] dark:bg-[#17130f] lg:min-h-full">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute inset-x-[8%] top-[8%] h-[66%] rounded-[50%] bg-[radial-gradient(ellipse,rgba(255,255,255,.8)_0%,rgba(255,255,255,.28)_42%,transparent_72%)] blur-2xl dark:opacity-20" />
            </div>
            {hero ? (
              <Link href={`/catalogo/${hero.slug}`} className="group relative flex h-full min-h-[500px] flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-gold lg:min-h-[calc(100vh-72px)]" aria-label={`Descubrir ${hero.nombre} de ${hero.marca}`}>
                <div className="relative flex-1 p-7 sm:p-10 lg:p-12">
                  <div aria-hidden="true" className="absolute inset-[10%] translate-x-[4%] translate-y-[4%] border border-[#c9b491]/35 bg-[#e6d8c4]/45 shadow-[0_28px_70px_rgba(71,53,34,.10)] dark:border-[#79623f]/35 dark:bg-[#241c14]/55 dark:shadow-[0_30px_80px_rgba(0,0,0,.28)] lg:-left-[1%] lg:right-[7%] lg:top-[11%] lg:bottom-[7%]" />
                  <div className="relative h-full transition-transform duration-700 ease-out lg:-ml-[5%] lg:-translate-y-[1.5%] lg:scale-[1.045] lg:group-hover:-translate-y-[2.1%] lg:group-hover:scale-[1.052] motion-reduce:transition-none">
                    <ProductImage slug={hero.slug} imageUrl={hero.imagen_url} alt={`${hero.nombre} de ${hero.marca}`} mode="hero" className="bg-transparent shadow-[0_26px_58px_rgba(58,44,29,.11)] dark:bg-transparent dark:shadow-[0_28px_64px_rgba(0,0,0,.24)]" />
                  </div>
                </div>
                <div className="relative z-20 mx-6 -mt-4 mb-6 grid gap-4 bg-[#fbf8f3]/92 px-4 py-4 shadow-[0_18px_45px_rgba(55,42,29,.07)] backdrop-blur-sm dark:bg-[#0d0b09]/92 dark:shadow-[0_18px_50px_rgba(0,0,0,.18)] sm:mx-8 sm:grid-cols-[1fr_auto] sm:items-end lg:mx-10 lg:-mt-9">
                  <div>
                    <p className="font-plex text-[8px] uppercase tracking-[.17em] text-gold-contrast">Objeto del catálogo · {publicText(hero.familia_olfativa) ?? "Selección"}</p>
                    <p className="mt-2 font-display text-[28px] leading-none tracking-[-.025em] text-ink">{hero.nombre}</p>
                    <p className="mt-1 font-sans text-xs text-muted">{hero.marca}</p>
                  </div>
                  <div className="flex items-center justify-between gap-6 sm:block sm:text-right">
                    <p className="font-display text-xl text-ink">{formattedReferencePrice(hero) ?? "Ver ficha"}</p>
                    <p className="mt-1 font-plex text-[8px] uppercase tracking-[.14em] text-muted transition-transform duration-300 group-hover:translate-x-1">Abrir →</p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex min-h-[500px] items-center justify-center px-8 text-center font-sans text-sm text-muted">El catálogo está preparando su próxima selección.</div>
            )}
          </div>
        </div>
      </section>

      <section id="indice-olfativo" className="py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10 xl:px-14">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Índice olfativo</p>
              <h2 className="mt-5 max-w-[9ch] font-display text-[44px] leading-[.94] tracking-[-.035em] sm:text-[56px]">Empieza por una sensación.</h2>
              <p className="mt-6 max-w-[35ch] font-sans text-base leading-7 text-muted">No necesitas saber de perfumería. Empieza por la atmósfera a la que quieres volver.</p>
            </div>

            <div className="space-y-1">
              {index.map((category, indexNumber) => (
                <Link key={category.label} href={`/buscar?q=${encodeURIComponent(category.label)}`} className="group grid grid-cols-[42px_1fr_auto] items-center gap-4 py-5 transition duration-300 hover:translate-x-1 sm:grid-cols-[58px_1fr_1fr_auto] sm:gap-7">
                  <span className="font-display text-[17px] text-gold-contrast">{String(indexNumber + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[30px] leading-none tracking-[-.025em] text-ink sm:text-[38px]">{category.label}</span>
                  <span className="hidden max-w-[28ch] font-sans text-sm leading-6 text-muted sm:block">{familyCopy[category.label] ?? "Una ruta distinta dentro del catálogo."}</span>
                  <span className="font-display text-xl text-muted transition duration-300 group-hover:translate-x-1 group-hover:text-gold-contrast">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {editorial ? (
        <section className="bg-[#15110d] text-[#f2ebdd]">
          <div className="mx-auto grid min-h-[640px] w-full max-w-[1440px] grid-cols-1 lg:grid-cols-[.82fr_1.18fr]">
            <div className="order-2 flex flex-col justify-between px-6 py-12 lg:order-1 lg:px-10 lg:py-14 xl:px-14">
              <div className="flex items-center justify-between font-plex text-[8px] uppercase tracking-[.17em] text-[#b7ad9a]"><span>Selección editorial</span><span>Objeto 02</span></div>
              <div className="py-12">
                <p className="font-display text-[20px] text-[#c8a86b]">{editorial.marca}</p>
                <h2 className="mt-3 max-w-[9ch] font-display text-[48px] leading-[.9] tracking-[-.04em] sm:text-[62px]">{editorial.nombre}</h2>
                <p className="mt-7 max-w-[42ch] font-sans text-base leading-7 text-[#b7ad9a]">{editorial.descripcion_corta ?? editorial.resena_sintetizada ?? "Una fragancia elegida por su capacidad de sostener carácter y presencia más allá de la primera impresión."}</p>
                <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 py-4">
                  {publicText(editorial.familia_olfativa) ? <span className="font-plex text-[8px] uppercase tracking-[.16em] text-[#d8bd8c]">{publicText(editorial.familia_olfativa)}</span> : null}
                  {perfumeNotes(editorial).map((note) => <span key={note} className="font-sans text-xs text-[#b7ad9a]">{note}</span>)}
                </div>
                <div className="mt-8 flex items-end justify-between gap-6">
                  <Link href={`/catalogo/${editorial.slug}`} className="inline-flex min-h-11 items-center font-plex text-[9px] uppercase tracking-[.17em] text-[#f2ebdd]">Entrar en la fragancia →</Link>
                  <span className="font-display text-2xl text-[#d8bd8c]">{formattedReferencePrice(editorial) ?? ""}</span>
                </div>
              </div>
              <p className="max-w-[38ch] font-sans text-xs leading-5 text-[#9c9182]">Datos reales y contexto editorial para entender por qué una fragancia merece una segunda mirada.</p>
            </div>
            <div className="order-1 relative min-h-[500px] overflow-hidden bg-white lg:order-2 lg:min-h-[640px]">
              <ProductImage slug={editorial.slug} imageUrl={editorial.imagen_url} alt={`${editorial.nombre} de ${editorial.marca}`} mode="hero" />
            </div>
          </div>
        </section>
      ) : null}

      {selection.length > 0 ? (
        <section className="py-20 lg:py-28">
          <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10 xl:px-14">
            <div className="mb-12 grid gap-7 lg:grid-cols-[1fr_.8fr] lg:items-end">
              <h2 className="max-w-[11ch] font-display text-[44px] leading-[.94] tracking-[-.035em] sm:text-[56px]">Tres formas de estar presente.</h2>
              <p className="max-w-[44ch] font-sans text-base leading-7 text-muted lg:justify-self-end">Tres contrastes útiles: distintas maneras de ocupar el aire, el cuerpo y el recuerdo.</p>
            </div>
            <div className="grid gap-10 lg:grid-cols-3">
              {selection.map((perfume, indexNumber) => (
                <article key={perfume.slug} className="group">
                  <Link href={`/catalogo/${perfume.slug}`} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
                    <div className="relative min-h-[360px] overflow-hidden bg-white transition duration-500 group-hover:shadow-lux">
                      <ProductImage slug={perfume.slug} imageUrl={perfume.imagen_url} alt={`${perfume.nombre} de ${perfume.marca}`} mode="card" />
                    </div>
                    <div className="pt-5">
                      <div className="flex items-center justify-between gap-4 font-plex text-[8px] uppercase tracking-[.15em] text-muted"><span>0{indexNumber + 2}</span><span>{publicText(perfume.familia_olfativa) ?? "Selección"}</span></div>
                      <h3 className="mt-4 font-display text-[30px] leading-[.95] tracking-[-.025em] text-ink">{perfume.nombre}</h3>
                      <p className="mt-2 font-display text-lg text-muted">{perfume.marca}</p>
                      <div className="mt-5 flex items-center justify-between"><span className="font-sans text-xs text-muted">{formattedReferencePrice(perfume) ?? "Ver disponibilidad"}</span><span className="font-display text-xl text-gold-contrast transition-transform group-hover:translate-x-1">→</span></div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="relative min-h-[580px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/editorial/golden-amber.png')" }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,13,9,.84)_0%,rgba(18,13,9,.62)_38%,rgba(18,13,9,.06)_70%)]" />
        <div className="relative mx-auto flex min-h-[580px] w-full max-w-[1440px] items-end px-6 py-12 lg:px-10 lg:py-16 xl:px-14">
          <div className="max-w-[650px] text-[#f5efe4]">
            <p className="font-plex text-[9px] uppercase tracking-[.2em] text-[#d8bd8c]">Materia / memoria</p>
            <p className="mt-6 max-w-[10ch] font-display text-[48px] leading-[.92] tracking-[-.035em] sm:text-[62px]">Una nota nunca huele sola.</p>
            <p className="mt-7 max-w-[45ch] font-sans text-base leading-7 text-[#d3c7b7]">Ámbar, cuero, bergamota e iris conectan perfumes, familias e historias.</p>
            <Link href="/academia" className="mt-8 inline-flex min-h-11 items-center font-plex text-[9px] uppercase tracking-[.17em] text-[#f5efe4]">Explorar materias →</Link>
          </div>
        </div>
      </section>

      {story ? (
        <section className="py-20 lg:py-28">
          <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-6 lg:grid-cols-[1.16fr_.84fr] lg:gap-16 lg:px-10 xl:px-14">
            <Link href={`/magazine/${story.slug}`} className="group relative min-h-[500px] overflow-hidden bg-[#e9dfcf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
              {story.imagen_portada_url ? (
                // eslint-disable-next-line @next/next/no-img-element -- article image may be remote
                <img src={story.imagen_portada_url} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.025] motion-reduce:transition-none" />
              ) : <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/editorial/luxurious-softlit.png')" }} />}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(16,11,8,.7)_100%)]" />
              <span className="absolute bottom-6 left-6 font-plex text-[9px] uppercase tracking-[.18em] text-white/85">Magazine / lectura 01</span>
            </Link>
            <div className="flex flex-col justify-between pt-2">
              <div>
                <p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Aromia Magazine</p>
                <h2 className="mt-6 font-display text-[42px] leading-[.95] tracking-[-.035em] sm:text-[54px]">{story.titulo}</h2>
                {story.meta_description ? <p className="mt-7 max-w-[43ch] font-sans text-base leading-7 text-muted">{story.meta_description}</p> : null}
              </div>
              <div className="mt-12"><Link href={`/magazine/${story.slug}`} className="inline-flex min-h-11 items-center font-plex text-[9px] uppercase tracking-[.17em] text-ink">Leer la historia <span className="ml-5 text-gold-contrast">→</span></Link><Link href="/magazine" className="ml-8 inline-flex min-h-11 items-center font-sans text-xs text-muted">Ver Magazine</Link></div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-[#efe6d8] dark:bg-[#17110d]">
        <div className="mx-auto grid w-full max-w-[1440px] gap-0 lg:grid-cols-2">
          <div className="px-6 py-16 lg:px-10 lg:py-24 xl:px-14">
            <p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Discovery</p>
            <h2 className="mt-6 max-w-[10ch] font-display text-[46px] leading-[.92] tracking-[-.04em] sm:text-[58px]">Tu gusto deja un rastro.</h2>
            <p className="mt-7 max-w-[43ch] font-sans text-base leading-7 text-muted">Familias, notas, perfumistas y perfumes vistos forman un mapa que evoluciona contigo.</p>
            <div className="mt-9 flex flex-wrap gap-3"><Link href="/descubrir" className="inline-flex min-h-12 items-center border border-ink bg-ink px-5 font-plex text-[9px] uppercase tracking-[.17em] text-[#fbf8f3] dark:border-[#f2ebdd] dark:bg-[#f2ebdd] dark:text-[#0d0b09]">Ver mi mapa</Link><Link href="/quiz" className="inline-flex min-h-12 items-center px-3 font-plex text-[9px] uppercase tracking-[.17em] text-ink">Hacer el quiz →</Link></div>
          </div>
          <div className="relative min-h-[380px] overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/editorial/moody-closeup.png')" }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_66%_42%,rgba(216,189,140,.18),transparent_28%),linear-gradient(135deg,rgba(13,11,9,.12),rgba(13,11,9,.58))]" />
            <div className="absolute bottom-7 left-7 right-7 flex flex-wrap gap-x-8 gap-y-3 text-white"><div><p className="font-display text-2xl">Notas</p><p className="font-plex text-[8px] uppercase tracking-[.14em] text-white/60">afinidad</p></div><div><p className="font-display text-2xl">Familias</p><p className="font-plex text-[8px] uppercase tracking-[.14em] text-white/60">patrón</p></div><div><p className="font-display text-2xl">Perfumistas</p><p className="font-plex text-[8px] uppercase tracking-[.14em] text-white/60">firma</p></div></div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-6 lg:grid-cols-[.72fr_1.28fr] lg:gap-20 lg:px-10 xl:px-14">
          <div>
            <p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">La Carta Aromia</p>
            <h2 className="mt-6 max-w-[10ch] font-display text-[42px] leading-[.94] tracking-[-.035em] sm:text-[54px]">Una buena recomendación merece contexto.</h2>
          </div>
          <div className="self-end">
            <p className="mb-7 max-w-[48ch] font-sans text-base leading-7 text-muted">Recibe nuevas lecturas, selecciones y cambios importantes del catálogo.</p>
            <NewsletterForm fuente="home" mensajeExito="Ya estás dentro de La Carta Aromia." />
            <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2 font-plex text-[8px] uppercase tracking-[.14em] text-muted"><span>Nuevas lecturas</span><span>Selecciones de temporada</span><span>Cambios que importan</span></div>
          </div>
        </div>
      </section>
    </main>
  );
}
