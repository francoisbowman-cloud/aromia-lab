"use client";

import { hasCutout, cutoutSrc } from "@/lib/perfumeCutouts";

type Mode = "card" | "hero";

type Props = {
  slug: string;
  alt: string;
  imageUrl?: string | null;
  mode?: Mode;
  className?: string;
};

/**
 * Resolución de la imagen de producto — decisión #105 (revista editorial):
 *
 * 1. Si el perfume tiene un recorte sin fondo (canal alfa) en
 *    `public/perfumes/cutouts/<slug>.webp` — registrado en `perfumeCutouts.ts` —
 *    se muestra ese PNG/WebP directo, sin máscara ni `mix-blend`, con un
 *    `drop-shadow()` sutil, para que el frasco flote sobre cualquier fondo
 *    (blanco puro o `#0A0A0A`) y pueda entrar en composiciones editoriales.
 *    El recorte se genera OFFLINE (`remove_background` de OMNI sobre la
 *    `imagen_url` real, o imagen IA de alto detalle para los casos difíciles,
 *    sin inventar rasgos del frasco). Este componente NUNCA extrae píxeles en
 *    runtime — solo consume el asset ya producido.
 * 2. Si no hay recorte (fallback — Opción A del ticket "Lienzo blanco"):
 *    se sirve la fuente auténtica vía el endpoint same-origin `catalog-image`,
 *    fundida en el lienzo con `mix-blend-multiply` + máscara radial que
 *    difumina el borde de la foto. No se reescribe ni regenera el producto.
 */
export function ProductImage({ slug, alt, mode = "card", className = "" }: Props) {
  const useCutout = hasCutout(slug);
  const src = useCutout ? cutoutSrc(slug) : `/api/catalog-image/${encodeURIComponent(slug)}`;

  const sizeClass = mode === "hero" ? "max-h-[98%] max-w-[98%]" : "max-h-[84%] max-w-[84%]";
  const hoverClass = mode === "card" ? "group-hover:scale-[1.025]" : "hover:scale-[1.008]";

  const cutoutClass = `${sizeClass} object-contain object-center transition-transform duration-500 ease-out ${hoverClass} [filter:drop-shadow(0_18px_28px_rgba(20,23,25,.14))]`;
  const fallbackClass = `${sizeClass} object-contain object-center mix-blend-multiply transition-transform duration-500 ease-out dark:mix-blend-normal ${hoverClass}`;

  const editorialMask = {
    WebkitMaskImage: "radial-gradient(ellipse 78% 84% at 50% 50%, #000 54%, rgba(0,0,0,.98) 68%, rgba(0,0,0,.55) 82%, transparent 100%)",
    maskImage: "radial-gradient(ellipse 78% 84% at 50% 50%, #000 54%, rgba(0,0,0,.98) 68%, rgba(0,0,0,.55) 82%, transparent 100%)",
  };

  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-transparent ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={mode === "card" ? "lazy" : "eager"}
        decoding="async"
        className={useCutout ? cutoutClass : fallbackClass}
        style={useCutout ? undefined : editorialMask}
      />
    </div>
  );
}
