import Link from "next/link";
import { CATEGORIA_LABEL } from "@/lib/magazineCategories";
import type { Article } from "@/lib/types";

const EYEBROW =
  "font-sans text-[11px] uppercase tracking-[.24em] font-semibold text-gold-contrast dark:text-gold-dark";

/**
 * Magazine como autoridad editorial, resuelto como spread y no como card.
 * Si el artículo ya tiene imagen de portada, Home la usa como asset real;
 * el gradiente editorial permanece detrás como fallback visual seguro.
 */
export function MagazineSpotlight({ articulo }: { articulo: Article }) {
  const coverStyle = articulo.imagen_portada_url
    ? {
        backgroundImage: `linear-gradient(180deg, transparent 44%, rgba(33,29,23,.16) 100%), url("${articulo.imagen_portada_url}")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }
    : undefined;

  return (
    <section className="relative overflow-hidden bg-[#fffdf8] dark:bg-[#100d0a]">
      <div className="mx-auto grid min-h-[68vh] w-full max-w-[1440px] grid-cols-1 lg:grid-cols-[.82fr_1.18fr]">
        <div className="relative z-[1] flex flex-col justify-between px-6 py-14 lg:px-10 lg:py-20">
          <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
            <p className={EYEBROW}>Magazine · {CATEGORIA_LABEL[articulo.categoria]}</p>
            <span className="font-plex text-[9px] uppercase tracking-[.16em] text-muted">
              Edición digital
            </span>
          </div>

          <div className="my-12 max-w-[560px] lg:my-16">
            <p className="font-plex text-[10px] uppercase tracking-[.18em] text-muted">
              Historia destacada
            </p>
            <h2 className="mt-4 font-display text-[38px] font-medium leading-[1.02] tracking-[-.02em] text-ink lg:text-[58px]">
              {articulo.titulo}
            </h2>
            {articulo.meta_description ? (
              <p className="mt-5 max-w-[46ch] font-sans text-sm leading-6 text-muted">
                {articulo.meta_description}
              </p>
            ) : null}
          </div>

          <Link
            href={`/magazine/${articulo.slug}`}
            className="nav-link self-start font-sans text-sm text-ink transition hover:text-gold-contrast"
          >
            Leer la historia →
          </Link>
        </div>

        <Link
          href={`/magazine/${articulo.slug}`}
          aria-label={`Leer ${articulo.titulo}`}
          className="group relative min-h-[420px] overflow-hidden bg-[#efe6d2] dark:bg-[#17120d] lg:min-h-full"
        >
          <div
            aria-hidden="true"
            className="aromia-scene-editorial absolute inset-0 transition-transform duration-700 group-hover:scale-[1.025]"
            style={coverStyle}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(33,29,23,.06)_100%)] dark:bg-[linear-gradient(180deg,transparent_44%,rgba(14,12,10,.24)_100%)]" />
          <div className="absolute bottom-5 left-5 font-plex text-[9px] uppercase tracking-[.16em] text-[rgba(33,29,23,.62)] [text-shadow:0_1px_8px_rgba(251,248,243,.72)] dark:text-[rgba(242,235,221,.72)] dark:[text-shadow:0_1px_8px_rgba(14,12,10,.7)]">
            Aromia Magazine / Cover Story
          </div>
        </Link>
      </div>
    </section>
  );
}
