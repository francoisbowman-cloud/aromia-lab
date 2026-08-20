import Link from "next/link";
import type { Article, Perfume } from "@/lib/types";
import { formattedReferencePrice, publicText } from "@/lib/catalogDisplay";
import { ProductImage } from "@/components/perfume/ProductImage";
import { NewsletterForm } from "@/components/NewsletterForm";
import type { CATEGORIAS_PRINCIPALES } from "@/lib/olfactiveCategories";

type Categoria = (typeof CATEGORIAS_PRINCIPALES)[number];

type VisualFamily = "citrus" | "fresh" | "aquatic" | "woody" | "floral" | "amber" | "aromatic" | "leather" | "gourmand" | "neutral";

const familyCopy: Record<string, string> = {
  Acuáticos: "Transparencia, sal y distancia.",
  Floral: "Capas suaves, aire y proximidad.",
  Amaderados: "Materia seca, sombra y estructura.",
  Árabes: "Resina, especias y temperatura.",
  Cítricos: "Luz cortante, pulpa y claridad.",
  Afrutados: "Color, textura y energía inmediata.",
  Frescos: "Aire limpio, tensión y movimiento.",
  Fougère: "Verde, precisión y arquitectura aromática.",
};

function pickDistinct(perfumes: Perfume[], count: number) {
  const seen = new Set<string>();
  return perfumes.filter((perfume) => {
    if (!perfume?.slug || seen.has(perfume.slug)) return false;
    seen.add(perfume.slug);
    return Boolean(perfume.imagen_url);
  }).slice(0, count);
}

function perfumeNotes(perfume: Perfume, count = 4) {
  return [...(perfume.notas_salida ?? []), ...(perfume.notas_corazon ?? []), ...(perfume.notas_fondo ?? [])]
    .filter((note, index, all) => Boolean(note) && all.indexOf(note) === index)
    .slice(0, count);
}

function visualFamily(value?: string | null): VisualFamily {
  const family = String(value ?? "").toLowerCase();
  if (/cítric|citrus/.test(family)) return "citrus";
  if (/acuát|marine|ozon/.test(family)) return "aquatic";
  if (/fresc/.test(family)) return "fresh";
  if (/mader|wood/.test(family)) return "woody";
  if (/flor|rosa|iris/.test(family)) return "floral";
  if (/ámbar|ambar|orient|árabe|arabe|resin/.test(family)) return "amber";
  if (/arom|foug/.test(family)) return "aromatic";
  if (/cuero|leather/.test(family)) return "leather";
  if (/gourmand|dulce|vainilla/.test(family)) return "gourmand";
  return "neutral";
}

function ProductScene({ perfume, className = "", label }: { perfume: Perfume; className?: string; label?: string }) {
  const notes = perfumeNotes(perfume, 3);
  return (
    <div className={`aromia-atmosphere relative min-h-[520px] ${className}`} data-family={visualFamily(perfume.familia_olfativa)}>
      <div className="aromia-material-frame" aria-hidden="true" />
      <div className="aromia-material-orbit aromia-material-orbit--a" aria-hidden="true" />
      <div className="aromia-material-orbit aromia-material-orbit--b" aria-hidden="true" />
      <div className="absolute left-5 top-5 z-20 font-plex text-xs uppercase tracking-[.16em] text-[#342a21]/70 sm:left-8 sm:top-8">
        {label ?? publicText(perfume.familia_olfativa) ?? "Objeto olfativo"}
      </div>
      <div className="absolute inset-x-[9%] bottom-[12%] top-[12%] z-10 bg-white shadow-[0_38px_100px_rgba(48,34,23,.18)] sm:inset-x-[13%] lg:inset-x-[11%]">
        <ProductImage slug={perfume.slug} imageUrl={perfume.imagen_url} alt={`${perfume.nombre} de ${perfume.marca}`} mode="hero" />
      </div>
      <div className="absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between gap-6 sm:bottom-8 sm:left-8 sm:right-8">
        <div className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-[#342a21]/70">
          {notes.map((note) => <span key={note}>{note}</span>)}
        </div>
        <span className="shrink-0 font-plex text-xs uppercase tracking-[.14em] text-[#342a21]/65">Materia / luz</span>
      </div>
    </div>
  );
}

export function TasteLanding({ perfumes, articulos, categorias }: { perfumes: Perfume[]; articulos: Article[]; categorias: Categoria[] }) {
  const visuales = pickDistinct(perfumes, 9);
  const hero = visuales[0] ?? perfumes[0];
  const editorial = visuales[4] ?? visuales[1] ?? hero;
  const selection = (visuales.length >= 4 ? visuales : perfumes).slice(1, 4);
  const story = articulos.find((article) => article.categoria !== "academia") ?? articulos[0];
  const index = categorias.slice(0, 6);

  if (!hero) {
    return <main className="grid min-h-[60vh] place-items-center bg-[#fbf8f3] px-6 text-center text-ink"><p className="font-display text-4xl">Aromia está preparando su archivo olfativo.</p></main>;
  }

  return (
    <main className="overflow-hidden bg-[#fbf8f3] text-ink dark:bg-[#0d0b09]">
      <section className="relative border-b border-line/70">
        <div className="mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-[1540px] lg:grid-cols-[.86fr_1.14fr]">
          <div className="relative z-10 flex flex-col justify-between px-6 pb-10 pt-9 sm:px-8 sm:pb-14 sm:pt-12 lg:px-12 lg:pb-16 lg:pt-14 xl:px-16">
            <div className="flex items-center justify-between gap-6 font-plex text-xs uppercase tracking-[.17em] text-muted">
              <span>Aromia / Archivo sensorial</span>
              <span className="hidden sm:inline">01 — Reconocimiento</span>
            </div>

            <div className="py-16 lg:py-10">
              <p className="mb-7 font-plex text-xs uppercase tracking-[.18em] text-gold-contrast">Perfume · materia · memoria</p>
              <h1 className="max-w-[8.8ch] font-display text-[clamp(4rem,7vw,7.8rem)] font-medium leading-[.79] tracking-[-.055em] text-ink">
                Lo que llevas también <em className="font-normal text-gold-contrast">te recuerda.</em>
              </h1>
              <p className="mt-9 max-w-[43ch] font-sans text-base leading-7 text-muted sm:text-lg sm:leading-8">
                Descubre fragancias por la sensación que construyen: luz, textura, carácter y rastro. El producto real permanece en el centro.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/quiz" className="inline-flex min-h-12 items-center justify-center bg-ink px-6 font-plex text-xs uppercase tracking-[.15em] text-[#fbf8f3] transition hover:bg-gold-contrast dark:bg-[#f2ebdd] dark:text-[#0d0b09]">Encontrar mi firma</Link>
                <Link href="/catalogo" className="inline-flex min-h-12 items-center px-2 font-plex text-xs uppercase tracking-[.15em] text-ink transition hover:text-gold-contrast">Entrar al archivo →</Link>
              </div>
            </div>

            <div>
              <div className="aromia-rule mb-5" />
              <div className="grid grid-cols-3 gap-4 font-plex text-xs uppercase tracking-[.12em] text-muted">
                <span>Producto real</span><span>Lectura olfativa</span><span className="text-right">Cultura</span>
              </div>
            </div>
          </div>

          <Link href={`/catalogo/${hero.slug}`} className="group relative block min-h-[620px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-5px] focus-visible:outline-gold lg:min-h-full" aria-label={`Descubrir ${hero.nombre} de ${hero.marca}`}>
            <ProductScene perfume={hero} className="h-full min-h-[620px] lg:min-h-[calc(100vh-72px)]" label="Objeto 01 / Presencia" />
            <div className="absolute bottom-[12%] left-[5%] z-30 max-w-[78%] bg-[#fbf8f3]/94 px-5 py-4 shadow-[0_20px_65px_rgba(49,37,25,.12)] backdrop-blur-md dark:bg-[#0d0b09]/94 sm:left-[7%] sm:max-w-[58%] sm:px-6 sm:py-5">
              <p className="font-plex text-xs uppercase tracking-[.15em] text-gold-contrast">{publicText(hero.familia_olfativa) ?? "Selección"}</p>
              <p className="mt-2 font-display text-[34px] leading-[.9] tracking-[-.035em] text-ink sm:text-[44px]">{hero.nombre}</p>
              <div className="mt-3 flex items-end justify-between gap-6">
                <p className="font-sans text-sm text-muted">{hero.marca}</p>
                <p className="font-display text-xl text-ink">{formattedReferencePrice(hero) ?? "Ver ficha"}</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section id="indice-olfativo" className="py-20 lg:py-28">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10 xl:px-14">
          <div className="grid gap-12 lg:grid-cols-[.62fr_1.38fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="font-plex text-xs uppercase tracking-[.17em] text-gold-contrast">Índice / Sensación</p>
              <h2 className="mt-5 max-w-[8ch] font-display text-[48px] leading-[.88] tracking-[-.04em] sm:text-[62px]">No empieces por una marca.</h2>
              <p className="mt-7 max-w-[34ch] font-sans text-base leading-7 text-muted">Empieza por la materia, la temperatura o el tipo de presencia que quieres dejar.</p>
            </div>
            <div className="border-t border-line">
              {index.map((category, indexNumber) => (
                <Link key={category.label} href={`/catalogo?familia=${encodeURIComponent(category.familias[0])}`} className="group grid grid-cols-[44px_1fr_auto] items-center gap-4 border-b border-line py-6 transition duration-300 hover:pl-2 sm:grid-cols-[58px_1fr_1fr_auto] sm:gap-7">
                  <span className="font-plex text-xs tracking-[.14em] text-gold-contrast">{String(indexNumber + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[32px] leading-none tracking-[-.03em] text-ink sm:text-[42px]">{category.label}</span>
                  <span className="hidden max-w-[30ch] font-sans text-sm leading-6 text-muted sm:block">{familyCopy[category.label] ?? "Una forma distinta de ocupar el aire."}</span>
                  <span className="font-display text-2xl text-muted transition group-hover:translate-x-1 group-hover:text-gold-contrast">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {editorial ? (
        <section className="bg-[#15110d] text-[#f2ebdd]">
          <div className="mx-auto grid w-full max-w-[1540px] lg:min-h-[760px] lg:grid-cols-[.88fr_1.12fr]">
            <div className="relative flex flex-col justify-between px-6 py-12 sm:px-8 lg:px-12 lg:py-16 xl:px-16">
              <div className="flex items-center justify-between font-plex text-xs uppercase tracking-[.16em] text-[#aa9f8e]"><span>02 / Escena</span><span>Intensidad: scene</span></div>
              <div className="py-14">
                <p className="font-display text-2xl italic text-[#d8bd8c]">{editorial.marca}</p>
                <h2 className="mt-4 max-w-[8.3ch] font-display text-[54px] leading-[.84] tracking-[-.045em] sm:text-[72px]">{editorial.nombre}</h2>
                <p className="mt-8 max-w-[43ch] font-sans text-base leading-7 text-[#b9ae9c]">{editorial.descripcion_corta ?? editorial.resena_sintetizada ?? "Una presencia elegida por la forma en que sostiene materia, distancia y memoria."}</p>
                <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                  {perfumeNotes(editorial).map((note) => <span key={note} className="font-sans text-sm text-[#d2c6b5]">{note}</span>)}
                </div>
                <Link href={`/catalogo/${editorial.slug}`} className="mt-10 inline-flex min-h-12 items-center font-plex text-xs uppercase tracking-[.16em] text-[#f2ebdd] transition hover:text-[#d8bd8c]">Entrar en la fragancia →</Link>
              </div>
              <p className="max-w-[38ch] font-sans text-xs leading-5 text-[#928675]">La escena acompaña al producto; nunca sustituye su identidad.</p>
            </div>
            <ProductScene perfume={editorial} className="min-h-[620px] lg:min-h-[760px]" label="Producto real / Atmósfera dirigida" />
          </div>
        </section>
      ) : null}

      {selection.length > 0 ? (
        <section className="py-20 lg:py-28">
          <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10 xl:px-14">
            <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end">
              <div>
                <p className="font-plex text-xs uppercase tracking-[.17em] text-gold-contrast">03 / Presencia</p>
                <h2 className="mt-5 max-w-[10ch] font-display text-[48px] leading-[.9] tracking-[-.04em] sm:text-[62px]">Tres maneras de permanecer.</h2>
              </div>
              <p className="max-w-[42ch] font-sans text-base leading-7 text-muted lg:justify-self-end">El catálogo se mantiene silencioso y preciso; aquí la comparación gana contexto sin perder la verdad del frasco.</p>
            </div>
            <div className="grid gap-10 md:grid-cols-3 md:gap-6">
              {selection.map((perfume, indexNumber) => (
                <article key={perfume.slug} className={`group ${indexNumber === 1 ? "md:mt-16" : ""}`}>
                  <Link href={`/catalogo/${perfume.slug}`} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
                    <div className="aspect-[4/5] bg-white">
                      <ProductImage slug={perfume.slug} imageUrl={perfume.imagen_url} alt={`${perfume.nombre} de ${perfume.marca}`} mode="card" />
                    </div>
                    <div className="pt-5">
                      <div className="flex items-center justify-between gap-4 font-plex text-xs uppercase tracking-[.13em] text-muted"><span>0{indexNumber + 1}</span><span>{publicText(perfume.familia_olfativa) ?? "Selección"}</span></div>
                      <h3 className="mt-4 max-w-[11ch] font-display text-[34px] leading-[.92] tracking-[-.03em] text-ink">{perfume.nombre}</h3>
                      <div className="mt-3 flex items-end justify-between gap-4"><p className="font-sans text-sm text-muted">{perfume.marca}</p><span className="font-display text-xl text-ink transition group-hover:translate-x-1">→</span></div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-y border-line bg-[#f2ede4] py-20 dark:bg-[#12100d] lg:py-28">
        <div className="mx-auto grid w-full max-w-[1440px] gap-14 px-6 lg:grid-cols-[1.18fr_.82fr] lg:gap-20 lg:px-10 xl:px-14">
          <div>
            <p className="font-plex text-xs uppercase tracking-[.17em] text-gold-contrast">Magazine / Cultura olfativa</p>
            <h2 className="mt-6 max-w-[11ch] font-display text-[50px] leading-[.88] tracking-[-.04em] sm:text-[66px]">El perfume también pertenece a su época.</h2>
            {story ? (
              <div className="mt-12 border-l border-gold-contrast/40 pl-6 sm:pl-8">
                <p className="font-plex text-xs uppercase tracking-[.14em] text-muted">{story.categoria} · {new Date(story.publicado_en).getFullYear()}</p>
                <h3 className="mt-4 max-w-[20ch] font-display text-[34px] leading-[.96] tracking-[-.025em] text-ink">{story.titulo}</h3>
                <p className="mt-5 max-w-[52ch] font-sans text-sm leading-7 text-muted">{story.meta_description ?? "Historias, ideas y contexto para leer la perfumería más allá de una lista de notas."}</p>
                <Link href={`/magazine/${story.slug}`} className="mt-7 inline-flex min-h-11 items-center font-plex text-xs uppercase tracking-[.15em] text-ink transition hover:text-gold-contrast">Leer historia →</Link>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col justify-between border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <div>
              <p className="font-plex text-xs uppercase tracking-[.17em] text-gold-contrast">Discovery / Introspección</p>
              <p className="mt-6 max-w-[18ch] font-display text-[38px] leading-[.92] tracking-[-.03em] text-ink">No busques una respuesta correcta. Busca una afinidad.</p>
              <p className="mt-6 max-w-[40ch] font-sans text-sm leading-7 text-muted">El quiz transforma asociaciones personales en una ruta de exploración, sin convertir el gusto en una fórmula rígida.</p>
              <Link href="/quiz" className="mt-8 inline-flex min-h-12 items-center bg-ink px-6 font-plex text-xs uppercase tracking-[.15em] text-[#fbf8f3] transition hover:bg-gold-contrast dark:bg-[#f2ebdd] dark:text-[#0d0b09]">Comenzar Discovery</Link>
            </div>
            <Link href="/descubrir" className="mt-12 inline-flex min-h-11 items-center font-plex text-xs uppercase tracking-[.15em] text-muted transition hover:text-gold-contrast">Explorar relaciones →</Link>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-6 lg:grid-cols-[.8fr_1.2fr] lg:items-end lg:px-10 xl:px-14">
          <div>
            <p className="font-plex text-xs uppercase tracking-[.17em] text-gold-contrast">Carta Aromia</p>
            <h2 className="mt-5 max-w-[9ch] font-display text-[46px] leading-[.9] tracking-[-.04em] text-ink sm:text-[58px]">Una nota cuando valga la pena.</h2>
          </div>
          <div>
            <p className="mb-6 max-w-[48ch] font-sans text-sm leading-7 text-muted">Nuevas lecturas, descubrimientos y selecciones del archivo. Sin ruido editorial por obligación.</p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
  );
}
