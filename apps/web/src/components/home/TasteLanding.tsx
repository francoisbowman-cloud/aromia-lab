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
  Árabes: "Resinas, especias y presencia sin disculpas.",
  Cítricos: "Brillo inmediato, limpio y preciso.",
  Afrutados: "Pulpa, color y energía expresiva.",
  Frescos: "Claridad cotidiana, sin ruido.",
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
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -right-[12%] top-[8%] h-[62%] w-[58%] rounded-full bg-[radial-gradient(circle,rgba(200,168,107,.18)_0%,rgba(200,168,107,.06)_36%,transparent_70%)] blur-3xl dark:opacity-55" />
          <div className="absolute bottom-0 right-0 h-px w-[56%] bg-gradient-to-l from-gold/45 to-transparent" />
        </div>

        <div className="relative mx-auto grid min-h-[760px] w-full max-w-[1440px] grid-cols-1 lg:min-h-[calc(100vh-72px)] lg:grid-cols-[.94fr_1.06fr]">
          <div className="flex flex-col justify-between px-6 py-10 sm:py-14 lg:px-10 lg:py-16 xl:px-14">
            <div className="flex items-center gap-5 font-plex text-[9px] uppercase tracking-[.19em] text-muted">
              <span>Perfume · Cultura · Descubrimiento</span><span className="h-px w-10 bg-gold/70" />
            </div>

            <div className="max-w-[760px] py-12 lg:py-8">
              <h1 className="max-w-[9.4ch] font-display text-[clamp(4.25rem,8.3vw,8.8rem)] font-medium leading-[.8] tracking-[-.055em] text-ink">
                El perfume no se elige. <span className="text-gold-contrast">Se reconoce.</span>
              </h1>
              <div className="mt-10 grid max-w-[720px] gap-7 border-t border-line pt-7 sm:grid-cols-[1fr_auto] sm:items-end">
                <p className="max-w-[47ch] font-sans text-sm leading-7 text-muted sm:text-[15px]">
                  Aromia traduce fragancias en lenguaje humano: carácter, materia, contexto y sensación. Menos ruido. Más criterio para encontrar aquello que sí se parece a ti.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/quiz" className="inline-flex min-h-12 items-center justify-center border border-ink bg-ink px-5 font-plex text-[9px] uppercase tracking-[.17em] text-[#fbf8f3] transition duration-300 hover:bg-gold-contrast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold dark:border-[#f2ebdd] dark:bg-[#f2ebdd] dark:text-[#0d0b09]">Encontrar mi firma</Link>
                  <Link href="/catalogo" className="inline-flex min-h-12 items-center justify-center border border-line bg-transparent px-5 font-plex text-[9px] uppercase tracking-[.17em] text-ink transition duration-300 hover:border-gold hover:text-gold-contrast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">Explorar</Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-4 lg:max-w-[720px]">
              {[['01','Catálogo curado'],['02','Índice olfativo'],['03','Magazine'],['04','Discovery']].map(([n,label]) => <div key={n}><p className="font-display text-lg text-gold-contrast">{n}</p><p className="mt-1 font-plex text-[8px] uppercase tracking-[.16em] text-muted">{label}</p></div>)}
            </div>
          </div>

          <div className="relative min-h-[520px] border-t border-line bg-[#f1e9dd] dark:bg-[#17130f] lg:min-h-full lg:border-l lg:border-t-0">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute inset-x-[8%] top-[8%] h-[66%] rounded-[50%] bg-[radial-gradient(ellipse,rgba(255,255,255,.78)_0%,rgba(255,255,255,.28)_42%,transparent_72%)] blur-2xl dark:opacity-20" />
              <div className="absolute left-[10%] top-0 h-full w-px bg-line/70" />
              <div className="absolute right-[10%] top-0 h-full w-px bg-line/70" />
              <div className="absolute bottom-[14%] left-[10%] right-[10%] h-px bg-line/70" />
            </div>

            {hero ? (
              <Link href={`/catalogo/${hero.slug}`} className="group relative flex min-h-[520px] h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-gold lg:min-h-[calc(100vh-72px)]" aria-label={`Descubrir ${hero.nombre} de ${hero.marca}`}>
                <div className="relative flex-1 p-7 sm:p-10 lg:p-12">
                  <ProductImage slug={hero.slug} imageUrl={hero.imagen_url} alt={`${hero.nombre} de ${hero.marca}`} mode="hero" className="bg-transparent dark:bg-transparent" />
                </div>
                <div className="relative mx-6 mb-6 grid gap-4 border-t border-line bg-[#fbf8f3]/80 px-4 py-4 backdrop-blur-sm dark:bg-[#0d0b09]/80 sm:mx-8 sm:grid-cols-[1fr_auto] sm:items-end lg:mx-10">
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
              <div className="flex min-h-[520px] items-center justify-center px-8 text-center font-sans text-sm text-muted lg:min-h-[calc(100vh-72px)]">El catálogo está preparando su próxima selección.</div>
            )}
          </div>
        </div>
      </section>

      <section id="indice-olfativo" className="border-b border-line py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10 xl:px-14">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Índice olfativo</p>
              <h2 className="mt-5 max-w-[8ch] font-display text-[52px] leading-[.9] tracking-[-.035em] sm:text-[66px]">Empieza por una sensación.</h2>
              <p className="mt-6 max-w-[35ch] font-sans text-sm leading-6 text-muted">No necesitas saber de perfumería. Solo reconocer la atmósfera a la que quieres volver.</p>
            </div>

            <div className="border-t border-line">
              {index.map((category, indexNumber) => (
                <Link key={category.label} href={`/catalogo?familia=${encodeURIComponent(category.familias[0])}`} className="group grid grid-cols-[46px_1fr_auto] items-center gap-4 border-b border-line py-6 transition duration-300 hover:pl-3 sm:grid-cols-[70px_1fr_1fr_auto] sm:gap-7">
                  <span className="font-display text-[18px] text-gold-contrast">{String(indexNumber + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[34px] leading-none tracking-[-.025em] text-ink sm:text-[44px]">{category.label}</span>
                  <span className="hidden max-w-[28ch] font-sans text-xs leading-5 text-muted sm:block">{familyCopy[category.label] ?? "Una ruta distinta dentro del catálogo."}</span>
                  <span className="font-display text-2xl text-muted transition duration-300 group-hover:translate-x-1 group-hover:text-gold-contrast">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {editorial ? (
        <section className="bg-[#15110d] text-[#f2ebdd]">
          <div className="mx-auto grid min-h-[680px] w-full max-w-[1440px] grid-cols-1 lg:grid-cols-[.82fr_1.18fr]">
            <div className="order-2 flex flex-col justify-between px-6 py-12 lg:order-1 lg:px-10 lg:py-14 xl:px-14">
              <div className="flex items-center justify-between border-b border-white/15 pb-4 font-plex text-[8px] uppercase tracking-[.17em] text-[#b7ad9a]"><span>Selección editorial</span><span>Objeto 02</span></div>
              <div className="py-12">
                <p className="font-display text-[20px] text-[#c8a86b]">{editorial.marca}</p>
                <h2 className="mt-3 max-w-[8ch] font-display text-[60px] leading-[.86] tracking-[-.045em] sm:text-[78px]">{editorial.nombre}</h2>
                <p className="mt-7 max-w-[42ch] font-sans text-sm leading-7 text-[#b7ad9a]">{editorial.descripcion_corta ?? editorial.resena_sintetizada ?? "Una pieza elegida por su capacidad de sostener identidad, contraste y presencia más allá de la primera impresión."}</p>
                <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 border-y border-white/15 py-5">
                  {publicText(editorial.familia_olfativa) ? <span className="font-plex text-[8px] uppercase tracking-[.16em] text-[#d8bd8c]">{publicText(editorial.familia_olfativa)}</span> : null}
                  {perfumeNotes(editorial).map((note) => <span key={note} className="font-sans text-xs text-[#b7ad9a]">{note}</span>)}
                </div>
                <div className="mt-8 flex items-end justify-between gap-6">
                  <Link href={`/catalogo/${editorial.slug}`} className="inline-flex min-h-11 items-center border-b border-[#c8a86b] font-plex text-[9px] uppercase tracking-[.17em] text-[#f2ebdd]">Entrar en la fragancia →</Link>
                  <span className="font-display text-2xl text-[#d8bd8c]">{formattedReferencePrice(editorial) ?? ""}</span>
                </div>
              </div>
              <p className="max-w-[38ch] font-sans text-[11px] leading-5 text-[#82796d]">La selección cambia con el catálogo. Aromia no inventa una narrativa: parte de los datos y los convierte en lectura editorial.</p>
            </div>
            <div className="order-1 relative min-h-[520px] overflow-hidden bg-[#f7f3eb] lg:order-2 lg:min-h-[680px]">
              <ProductImage slug={editorial.slug} imageUrl={editorial.imagen_url} alt={`${editorial.nombre} de ${editorial.marca}`} mode="hero" />
              <div className="pointer-events-none absolute inset-0 border-[18px] border-[#15110d]/0 lg:border-[28px]" />
            </div>
          </div>
        </section>
      ) : null}

      {selection.length > 0 ? (
        <section className="py-20 lg:py-28">
          <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10 xl:px-14">
            <div className="mb-12 grid gap-7 border-b border-line pb-7 lg:grid-cols-[1fr_.8fr] lg:items-end">
              <h2 className="max-w-[10ch] font-display text-[52px] leading-[.9] tracking-[-.035em] sm:text-[64px]">Tres formas de estar presente.</h2>
              <p className="max-w-[44ch] font-sans text-sm leading-6 text-muted lg:justify-self-end">No son “top ventas”. Son contrastes útiles: distintas maneras de ocupar el aire, el cuerpo y el recuerdo.</p>
            </div>
            <div className="grid gap-10 lg:grid-cols-3 lg:gap-0">
              {selection.map((perfume, indexNumber) => (
                <article key={perfume.slug} className={`group ${indexNumber > 0 ? "lg:border-l lg:border-line lg:pl-8" : "lg:pr-8"} ${indexNumber === 1 ? "lg:px-8" : ""}`}>
                  <Link href={`/catalogo/${perfume.slug}`} className="block">
                    <div className="relative min-h-[360px] overflow-hidden bg-[#f7f4ee] transition duration-500 group-hover:shadow-lux">
                      <ProductImage slug={perfume.slug} imageUrl={perfume.imagen_url} alt={`${perfume.nombre} de ${perfume.marca}`} mode="card" />
                    </div>
                    <div className="pt-5">
                      <div className="flex items-center justify-between gap-4 font-plex text-[8px] uppercase tracking-[.15em] text-muted"><span>0{indexNumber + 2}</span><span>{publicText(perfume.familia_olfativa) ?? "Selección"}</span></div>
                      <h3 className="mt-4 font-display text-[30px] leading-[.95] tracking-[-.025em] text-ink">{perfume.nombre}</h3>
                      <p className="mt-2 font-display text-lg text-muted">{perfume.marca}</p>
                      <div className="mt-5 flex items-center justify-between border-t border-line pt-4"><span className="font-sans text-xs text-muted">{formattedReferencePrice(perfume) ?? "Ver disponibilidad"}</span><span className="font-display text-xl text-gold-contrast transition-transform group-hover:translate-x-1">→</span></div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="relative min-h-[620px] overflow-hidden border-y border-line">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/editorial/golden-amber.png')" }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,13,9,.84)_0%,rgba(18,13,9,.62)_38%,rgba(18,13,9,.06)_70%)]" />
        <div className="relative mx-auto flex min-h-[620px] w-full max-w-[1440px] items-end px-6 py-12 lg:px-10 lg:py-16 xl:px-14">
          <div className="max-w-[650px] text-[#f5efe4]">
            <p className="font-plex text-[9px] uppercase tracking-[.2em] text-[#d8bd8c]">Materia / memoria</p>
            <p className="mt-6 max-w-[9ch] font-display text-[58px] leading-[.88] tracking-[-.035em] sm:text-[76px]">Una nota nunca huele sola.</p>
            <p className="mt-7 max-w-[45ch] font-sans text-sm leading-7 text-[#d3c7b7]">Ámbar, cuero, bergamota, iris. En Aromia las notas no son filtros decorativos: son puertas hacia historias, familias y perfumes relacionados.</p>
            <Link href="/academia" className="mt-8 inline-flex min-h-11 items-center border-b border-[#d8bd8c] font-plex text-[9px] uppercase tracking-[.17em] text-[#f5efe4]">Explorar materias →</Link>
          </div>
        </div>
      </section>

      {story ? (
        <section className="py-20 lg:py-28">
          <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-6 lg:grid-cols-[1.16fr_.84fr] lg:gap-16 lg:px-10 xl:px-14">
            <Link href={`/magazine/${story.slug}`} className="group relative min-h-[520px] overflow-hidden bg-[#e9dfcf]">
              {story.imagen_portada_url ? (
                // eslint-disable-next-line @next/next/no-img-element -- article image may be remote
                <img src={story.imagen_portada_url} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.025]" />
              ) : <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/editorial/luxurious-softlit.png')" }} />}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(16,11,8,.7)_100%)]" />
              <span className="absolute bottom-6 left-6 font-plex text-[9px] uppercase tracking-[.18em] text-white/85">Magazine / lectura 01</span>
            </Link>
            <div className="flex flex-col justify-between border-t border-line pt-7 lg:border-t-0 lg:pt-0">
              <div>
                <p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Aromia Magazine</p>
                <h2 className="mt-6 font-display text-[48px] leading-[.92] tracking-[-.035em] sm:text-[62px]">{story.titulo}</h2>
                {story.meta_description ? <p className="mt-7 max-w-[43ch] font-sans text-sm leading-7 text-muted">{story.meta_description}</p> : null}
              </div>
              <div className="mt-12 border-t border-line pt-5"><Link href={`/magazine/${story.slug}`} className="inline-flex min-h-11 items-center font-plex text-[9px] uppercase tracking-[.17em] text-ink">Leer la historia <span className="ml-5 text-gold-contrast">→</span></Link><Link href="/magazine" className="ml-8 inline-flex min-h-11 items-center font-sans text-xs text-muted">Ver Magazine</Link></div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-y border-line bg-[#efe6d8] dark:bg-[#17110d]">
        <div className="mx-auto grid w-full max-w-[1440px] gap-0 lg:grid-cols-2">
          <div className="px-6 py-16 lg:px-10 lg:py-24 xl:px-14">
            <p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Discovery</p>
            <h2 className="mt-6 max-w-[9ch] font-display text-[54px] leading-[.88] tracking-[-.04em] sm:text-[70px]">Tu gusto deja un rastro.</h2>
            <p className="mt-7 max-w-[43ch] font-sans text-sm leading-7 text-muted">Familias, notas, autores y perfumes vistos forman un mapa vivo. No sustituye tu criterio: lo hace visible.</p>
            <div className="mt-9 flex flex-wrap gap-3"><Link href="/descubrir" className="inline-flex min-h-12 items-center border border-ink bg-ink px-5 font-plex text-[9px] uppercase tracking-[.17em] text-[#fbf8f3] dark:border-[#f2ebdd] dark:bg-[#f2ebdd] dark:text-[#0d0b09]">Ver mi mapa</Link><Link href="/quiz" className="inline-flex min-h-12 items-center border border-line px-5 font-plex text-[9px] uppercase tracking-[.17em] text-ink">Hacer el quiz</Link></div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden border-t border-line lg:border-l lg:border-t-0">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/editorial/moody-closeup.png')" }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_66%_42%,rgba(216,189,140,.18),transparent_28%),linear-gradient(135deg,rgba(13,11,9,.12),rgba(13,11,9,.58))]" />
            <div className="absolute bottom-7 left-7 right-7 grid grid-cols-3 gap-3 border-t border-white/25 pt-5 text-white"><div><p className="font-display text-2xl">Notas</p><p className="font-plex text-[8px] uppercase tracking-[.14em] text-white/60">afinidad</p></div><div><p className="font-display text-2xl">Familias</p><p className="font-plex text-[8px] uppercase tracking-[.14em] text-white/60">patrón</p></div><div><p className="font-display text-2xl">Autores</p><p className="font-plex text-[8px] uppercase tracking-[.14em] text-white/60">firma</p></div></div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-6 lg:grid-cols-[.72fr_1.28fr] lg:gap-20 lg:px-10 xl:px-14">
          <div>
            <p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">La Carta Aromia</p>
            <h2 className="mt-6 max-w-[9ch] font-display text-[50px] leading-[.9] tracking-[-.035em] sm:text-[62px]">Una buena recomendación merece contexto.</h2>
          </div>
          <div className="self-end">
            <p className="mb-7 max-w-[48ch] font-sans text-sm leading-7 text-muted">Recibe nuevas lecturas, señales de catálogo y descubrimientos seleccionados con la misma lógica editorial de la página.</p>
            <NewsletterForm fuente="home" mensajeExito="Ya estás dentro de La Carta Aromia." />
            <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2 font-plex text-[8px] uppercase tracking-[.14em] text-muted"><span>Sin ruido semanal</span><span>Sin ranking pagado</span><span>Con criterio editorial</span></div>
          </div>
        </div>
      </section>
    </main>
  );
}
