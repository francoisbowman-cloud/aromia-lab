import Link from "next/link";
import type { Article, Perfume } from "@/lib/types";
import type { CATEGORIAS_PRINCIPALES } from "@/lib/olfactiveCategories";
import { formattedReferencePrice, publicText } from "@/lib/catalogDisplay";
import { ProductImage } from "@/components/perfume/ProductImage";
import { NewsletterForm } from "@/components/NewsletterForm";
import { HomeHero } from "./HomeHero";

type Categoria = (typeof CATEGORIAS_PRINCIPALES)[number];

const familyCopy: Record<string, string> = {
  Acuáticos: "Luz salina, transparencia y aire.",
  Floral: "Pétalos, textura y una estela que se acerca.",
  Amaderados: "Materia seca, profundidad y calma.",
  Árabes: "Resinas, especias y presencia cálida.",
  Cítricos: "Brillo inmediato, limpio y preciso.",
  Afrutados: "Pulpa, color y energía expresiva.",
  Frescos: "Claridad cotidiana, ligera y directa.",
  "Fougère": "Verde, aromático y estructurado.",
};

function distinctWithImage(perfumes: Perfume[], count: number) {
  const seen = new Set<string>();
  return perfumes.filter((perfume) => {
    if (!perfume.slug || !perfume.imagen_url || seen.has(perfume.slug)) return false;
    seen.add(perfume.slug);
    return true;
  }).slice(0, count);
}

function notes(perfume: Perfume) {
  return [...(perfume.notas_salida ?? []), ...(perfume.notas_corazon ?? []), ...(perfume.notas_fondo ?? [])]
    .filter((note, index, all) => Boolean(note) && all.indexOf(note) === index)
    .slice(0, 4);
}

export function AromiaHome2026({ perfumes, articulos, categorias }: { perfumes: Perfume[]; articulos: Article[]; categorias: Categoria[] }) {
  const visuales = distinctWithImage(perfumes, 9);
  const hero = visuales[0] ?? perfumes[0];
  const feature = visuales[3] ?? visuales[1] ?? hero;
  const selection = visuales.slice(1, 4);
  const story = articulos.find((article) => article.categoria !== "academia") ?? articulos[0];
  const index = categorias.slice(0, 6);

  return (
    <main className="overflow-hidden bg-[#f7f5f0] text-ink dark:bg-[#0e1311]">
      <HomeHero perfume={hero} />

      <section className="mx-auto w-full max-w-[1520px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[.62fr_1.38fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-plex text-xs uppercase tracking-[.15em] text-[#5a6b54] dark:text-[#b8c5b3]">Índice olfativo</p>
            <h2 className="mt-5 max-w-[8ch] font-display text-[44px] leading-[.92] tracking-[-.04em] sm:text-[56px]">Empieza por una sensación.</h2>
            <p className="mt-6 max-w-[34ch] font-sans text-base leading-7 text-muted">No hace falta memorizar una pirámide para orientarte. Elige una familia y entra al archivo real.</p>
          </div>

          <div className="border-t border-line">
            {index.map((category, indexNumber) => (
              <Link key={category.label} href={`/buscar?q=${encodeURIComponent(category.familias[0])}`} className="group grid min-h-[92px] grid-cols-[48px_1fr_auto] items-center gap-4 border-b border-line py-4 outline-none sm:grid-cols-[58px_1fr_1fr_auto] sm:gap-7">
                <span className="font-plex text-xs text-muted">{String(indexNumber + 1).padStart(2, "0")}</span>
                <span className="font-display text-[30px] leading-none tracking-[-.025em] text-ink transition group-hover:translate-x-1 sm:text-[38px]">{category.label}</span>
                <span className="hidden max-w-[30ch] font-sans text-sm leading-6 text-muted sm:block">{familyCopy[category.label] ?? "Una ruta distinta dentro del catálogo."}</span>
                <span aria-hidden="true" className="font-display text-2xl text-[#5a6b54] transition group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {feature ? (
        <section className="bg-[#0e1311] text-[#f7f5f0]">
          <div className="mx-auto grid min-h-[680px] max-w-[1520px] lg:grid-cols-[.78fr_1.22fr]">
            <div className="order-2 flex flex-col justify-between px-5 py-12 sm:px-8 lg:order-1 lg:px-12 lg:py-16">
              <div className="flex items-center justify-between gap-4 font-plex text-xs uppercase tracking-[.14em] text-[#b6b7af]"><span>Objeto 02</span><span>{publicText(feature.familia_olfativa) ?? feature.concentracion ?? "Selección"}</span></div>
              <div className="py-12">
                <p className="font-plex text-xs uppercase tracking-[.14em] text-[#b8c5b3]">{feature.marca}</p>
                <h2 className="mt-4 max-w-[9ch] font-display text-[50px] leading-[.88] tracking-[-.045em] sm:text-[64px]">{feature.nombre}</h2>
                <p className="mt-8 max-w-[42ch] font-display text-[25px] leading-[1.25] tracking-[-.015em] text-[#f4f1ea]">{feature.descripcion_corta ?? feature.resena_sintetizada ?? "Una fragancia del catálogo seleccionada para leerla de cerca."}</p>
                {notes(feature).length ? <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#f7f5f0]/15 pt-5">{notes(feature).map((note) => <span key={note} className="font-sans text-sm text-[#b6b7af]">{note}</span>)}</div> : null}
                <div className="mt-10 flex flex-wrap items-center justify-between gap-6"><Link href={`/catalogo/${feature.slug}`} className="inline-flex min-h-12 items-center border-b border-[#f7f5f0] font-plex text-xs uppercase tracking-[.13em] text-[#f7f5f0]">Entrar en la fragancia <span aria-hidden="true" className="ml-4">↗</span></Link><span className="font-display text-2xl text-[#b8c5b3]">{formattedReferencePrice(feature) ?? ""}</span></div>
              </div>
              <p className="max-w-[36ch] font-sans text-xs leading-5 text-[#9da39d]">La escena desaparece cuando el objeto necesita hablar con precisión.</p>
            </div>
            <div className="order-1 relative min-h-[500px] overflow-hidden bg-[#f7f5f0] lg:order-2 lg:min-h-[680px]">
              <div aria-hidden="true" className="absolute inset-[10%] rounded-[50%] bg-[#d9c8b1]/45 blur-[100px]" />
              <div className="absolute inset-[2%] sm:inset-[5%] lg:inset-[2%]">
                <ProductImage slug={feature.slug} imageUrl={feature.imagen_url} alt={`${feature.nombre} de ${feature.marca}`} mode="hero" />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {selection.length ? (
        <section className="mx-auto w-full max-w-[1520px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end"><div><p className="font-plex text-xs uppercase tracking-[.14em] text-[#5a6b54] dark:text-[#b8c5b3]">Tres direcciones</p><h2 className="mt-4 max-w-[10ch] font-display text-[44px] leading-[.92] tracking-[-.04em] sm:text-[56px]">Distintas formas de ocupar el aire.</h2></div><p className="max-w-[42ch] font-sans text-base leading-7 text-muted lg:justify-self-end">Producto real, escala distinta, sin encerrarlo en una cuadrícula de tarjetas.</p></div>
          <div className="grid gap-x-9 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {selection.map((perfume, indexNumber) => (
              <Link key={perfume.slug} href={`/catalogo/${perfume.slug}`} className={`group block outline-none ${indexNumber === 1 ? "lg:translate-y-14" : ""}`}>
                <div className="relative aspect-[4/5] overflow-hidden bg-transparent"><ProductImage slug={perfume.slug} imageUrl={perfume.imagen_url} alt={`${perfume.nombre} de ${perfume.marca}`} mode="card" /></div>
                <div className="mt-5 border-t border-line pt-4"><div className="flex justify-between gap-5 font-plex text-xs uppercase tracking-[.12em] text-muted"><span>0{indexNumber + 1}</span><span>{perfume.marca}</span></div><h3 className="mt-3 max-w-[11ch] font-display text-[34px] leading-[.92] tracking-[-.03em] text-ink transition-colors group-hover:text-[#5a6b54]">{perfume.nombre}</h3><p className="mt-4 font-sans text-sm text-muted">{publicText(perfume.familia_olfativa) ?? perfume.concentracion ?? "Objeto olfativo"}</p></div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="border-y border-line bg-[#e6e8e4]/45 dark:bg-[#151c18]"><div className="mx-auto grid max-w-[1520px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[.72fr_1.28fr] lg:px-12 lg:py-24"><div><p className="font-plex text-xs uppercase tracking-[.14em] text-[#5a6b54] dark:text-[#b8c5b3]">Magazine</p><h2 className="mt-4 max-w-[8ch] font-display text-[42px] leading-[.92] tracking-[-.04em] sm:text-[54px]">El perfume también se lee.</h2></div>{story ? <Link href={`/magazine/${story.slug}`} className="group block border-t border-line pt-5 outline-none"><p className="font-plex text-xs uppercase tracking-[.12em] text-muted">{story.categoria}</p><h3 className="mt-5 max-w-[18ch] font-display text-[38px] leading-[.96] tracking-[-.035em] text-ink transition group-hover:text-[#5a6b54] sm:text-[48px]">{story.titulo}</h3>{story.meta_description ? <p className="mt-6 max-w-[54ch] font-sans text-base leading-7 text-muted">{story.meta_description}</p> : null}<span className="mt-8 inline-flex min-h-11 items-center font-plex text-xs uppercase tracking-[.12em] text-[#5a6b54]">Leer historia →</span></Link> : <p className="font-sans text-muted">El archivo editorial está preparando su próxima historia.</p>}</div></section>

      <section className="mx-auto grid w-full max-w-[1520px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_.85fr] lg:items-end lg:px-12 lg:py-28"><div><p className="font-plex text-xs uppercase tracking-[.14em] text-[#5a6b54] dark:text-[#b8c5b3]">Discovery</p><h2 className="mt-4 max-w-[10ch] font-display text-[44px] leading-[.92] tracking-[-.04em] sm:text-[58px]">Deja que el recorrido forme un mapa.</h2><p className="mt-6 max-w-[42ch] font-sans text-base leading-7 text-muted">Familias, notas y autorías se convierten en señales útiles a medida que exploras.</p><Link href="/descubrir" className="mt-8 inline-flex min-h-12 items-center border-b border-ink font-plex text-xs uppercase tracking-[.13em] text-ink">Abrir mi mapa <span aria-hidden="true" className="ml-4">↗</span></Link></div><div className="border-t border-line pt-6"><p className="font-display text-[30px] leading-tight tracking-[-.02em] text-ink">Menos cuestionario. Más observación.</p><p className="mt-4 max-w-[40ch] font-sans text-sm leading-6 text-muted">El sistema usa las dimensiones que ya existen en Aromia; no inventa porcentajes de compatibilidad.</p></div></section>

      <section className="border-t border-line"><div className="mx-auto grid max-w-[1520px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_.85fr] lg:items-center lg:px-12 lg:py-20"><div><p className="font-plex text-xs uppercase tracking-[.14em] text-muted">El Club</p><h2 className="mt-3 max-w-[11ch] font-display text-[38px] leading-[.96] tracking-[-.03em] text-ink">Una carta breve cuando haya algo que valga la pena oler.</h2></div><div className="lg:justify-self-end lg:w-full lg:max-w-[520px]"><NewsletterForm fuente="home" /></div></div></section>
    </main>
  );
}
