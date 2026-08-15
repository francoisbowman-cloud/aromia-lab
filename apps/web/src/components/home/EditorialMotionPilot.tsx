import Link from "next/link";
import type { Perfume } from "@/lib/types";
import { formattedReferencePrice, publicText } from "@/lib/catalogDisplay";
import { ProductImage } from "@/components/perfume/ProductImage";
import { Reveal } from "@/components/home/Reveal";

/**
 * Piloto de la skill "aromia-editorial-motion" (.claude/skills/aromia-editorial-motion).
 * Ruta aislada (`/taste/editorial`) — no toca Home ni TasteLanding en producción.
 * Perfil: GRID_BREAK_INTENSITY 7, HEADER_DIFFUSION 5, DEPTH_LEVEL 6, MOTION_INTENSITY 4.
 */

function perfumeNotes(perfume: Perfume) {
  return [...(perfume.notas_salida ?? []), ...(perfume.notas_corazon ?? []), ...(perfume.notas_fondo ?? [])]
    .filter((note, index, all) => Boolean(note) && all.indexOf(note) === index)
    .slice(0, 4);
}

export function EditorialMotionPilot({ perfumes }: { perfumes: Perfume[] }) {
  const withImage = perfumes.filter((perfume) => Boolean(perfume.slug && perfume.imagen_url));
  const hero = withImage[0];
  const companions = withImage.slice(1, 3);

  if (!hero) return null;

  return (
    <main className="overflow-x-hidden bg-[#fbf8f3] text-ink dark:bg-[#0d0b09]">
      <p className="mx-auto max-w-[1440px] px-6 pt-6 font-plex text-[9px] uppercase tracking-[.18em] text-muted lg:px-10 xl:px-14">
        Piloto — Editorial Motion &amp; Composition Skill
      </p>

      {/* Hero: object bleed + column invasion + header diffusion */}
      <section className="relative mx-auto mt-6 min-h-[640px] w-full max-w-[1440px] overflow-visible px-6 lg:mt-10 lg:min-h-[780px] lg:px-10 xl:px-14">
        <div className="grid min-h-[640px] grid-cols-1 items-center gap-10 lg:min-h-[780px] lg:grid-cols-[1.05fr_.95fr] lg:gap-6">
          <div className="relative z-10 order-2 lg:order-1">
            <p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">{hero.marca}</p>
            <h1 className="mt-4 max-w-[9ch] font-display text-[clamp(3.2rem,7vw,6.4rem)] font-medium leading-[.86] tracking-[-.04em] text-ink">
              {hero.nombre}
            </h1>
            <p className="mt-7 max-w-[46ch] font-sans text-sm leading-7 text-muted">
              {hero.descripcion_corta ?? "Una pieza que ocupa el espacio como objeto editorial, no como thumbnail de catálogo."}
            </p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-5">
              {publicText(hero.familia_olfativa) ? (
                <span className="font-plex text-[8px] uppercase tracking-[.16em] text-gold-contrast">{publicText(hero.familia_olfativa)}</span>
              ) : null}
              {perfumeNotes(hero).map((note) => (
                <span key={note} className="font-sans text-xs text-muted">{note}</span>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-6">
              <Link
                href={`/catalogo/${hero.slug}`}
                className="inline-flex min-h-12 items-center justify-center border border-ink bg-ink px-5 font-plex text-[9px] uppercase tracking-[.17em] text-[#fbf8f3] transition duration-300 hover:bg-gold-contrast dark:border-[#f2ebdd] dark:bg-[#f2ebdd] dark:text-[#0d0b09]"
              >
                Entrar en la fragancia
              </Link>
              <span className="font-display text-xl text-gold-contrast">{formattedReferencePrice(hero) ?? ""}</span>
            </div>
          </div>

          {/* Oversized object: bleed 18% into the text column on desktop, contained on mobile */}
          <div className="editorial-bleed order-1 lg:order-2">
            <div className="relative mx-auto h-[420px] w-full max-w-[420px] lg:h-[680px] lg:max-w-none lg:-ml-[10%] lg:w-[110%]">
              <div className="editorial-diffusion absolute inset-0 hidden bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,rgba(200,168,107,.16),transparent_70%)] lg:block" aria-hidden />
              <ProductImage slug={hero.slug} imageUrl={hero.imagen_url} alt={`${hero.nombre} de ${hero.marca}`} mode="hero" />
            </div>
          </div>
        </div>
      </section>

      {/* Companions: editorial offset + depth, restrained motion */}
      {companions.length > 0 ? (
        <section className="mx-auto mt-24 w-full max-w-[1440px] border-t border-line px-6 py-16 lg:mt-32 lg:px-10 lg:py-24 xl:px-14">
          <Reveal>
            <h2 className="max-w-[14ch] font-display text-[42px] leading-[.92] tracking-[-.03em] sm:text-[54px]">
              El mismo objeto, dos distancias.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-14 sm:grid-cols-2">
            {companions.map((perfume, index) => (
              <Reveal key={perfume.slug} className={index === 1 ? "sm:mt-16" : undefined}>
                <article className="editorial-depth group">
                  <Link href={`/catalogo/${perfume.slug}`} className="block">
                    <div className="editorial-parallax relative min-h-[320px] overflow-hidden bg-[#f7f4ee]">
                      <ProductImage slug={perfume.slug} imageUrl={perfume.imagen_url} alt={`${perfume.nombre} de ${perfume.marca}`} mode="card" />
                    </div>
                    <div className="pt-5">
                      <p className="font-plex text-[8px] uppercase tracking-[.15em] text-muted">{publicText(perfume.familia_olfativa) ?? "Selección"}</p>
                      <h3 className="mt-3 font-display text-[26px] leading-[.95] tracking-[-.02em] text-ink">{perfume.nombre}</h3>
                      <p className="mt-1 font-display text-base text-muted">{perfume.marca}</p>
                    </div>
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
