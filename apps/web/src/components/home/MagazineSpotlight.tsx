import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CATEGORIA_LABEL } from "@/lib/magazineCategories";
import type { Article } from "@/lib/types";

const EYEBROW =
  "font-sans text-[11px] uppercase tracking-[.24em] font-semibold text-gold-contrast dark:text-gold-dark";

/**
 * Magazine integrado a Home como momento de autoridad editorial —
 * full-bleed, no la card secundaria de antes. Mismo `ultimoArticulo` que
 * ya se calculaba en page.tsx. El overlay se resuelve sobre --bg (Ivorio
 * en claro, Grafito en oscuro), no sobre negro fijo — evita el "panel
 * negro" que rompía el recorrido luminoso en Light (ver baseline doc).
 */
export function MagazineSpotlight({ articulo }: { articulo: Article }) {
  return (
    <section className="aromia-scene-editorial relative flex min-h-[68vh] items-center overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(251,248,243,.86)_0%,rgba(251,248,243,.34)_60%,transparent_100%)] dark:bg-[linear-gradient(100deg,rgba(14,12,10,.8)_0%,rgba(14,12,10,.28)_60%,transparent_100%)]" />
      <div className="relative z-[1] max-w-[560px] px-6 lg:px-10">
        <p className={EYEBROW}>Magazine · {CATEGORIA_LABEL[articulo.categoria]}</p>
        <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink lg:text-[46px]">
          {articulo.titulo}
        </h2>
        {articulo.meta_description ? (
          <p className="mt-4 max-w-[46ch] font-sans text-sm text-muted">
            {articulo.meta_description}
          </p>
        ) : null}
        <Button asChild variant="outline" size="lg" className="mt-7">
          <Link href={`/magazine/${articulo.slug}`}>Leer Magazine →</Link>
        </Button>
      </div>
    </section>
  );
}
