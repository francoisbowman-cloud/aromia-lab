"use client";

type Mode = "card" | "hero";

type Props = {
  slug: string;
  alt: string;
  imageUrl?: string | null;
  mode?: Mode;
  className?: string;
};

/**
 * Product-image source resolution belongs to the same-origin catalog-image
 * endpoint. Editorial treatment never rewrites, regenerates or destructively
 * extracts branded product pixels. Instead, the authentic source is blended
 * into Aromia's paper field and its outer photo boundary is softly feathered,
 * so the object can participate in the composition without becoming a card.
 * This mask+blend treatment applies to every mode, not just hero surfaces —
 * see ticket "Lienzo blanco absoluto" section 3, Option A.
 */
export function ProductImage({ slug, alt, mode = "card", className = "" }: Props) {
  const src = `/api/catalog-image/${encodeURIComponent(slug)}`;
  const imageClass = `${mode === "hero" ? "max-h-[98%] max-w-[98%]" : "max-h-[84%] max-w-[84%]"} object-contain object-center mix-blend-multiply transition-transform duration-500 ease-out dark:mix-blend-normal ${
    mode === "card" ? "group-hover:scale-[1.025]" : "hover:scale-[1.008]"
  }`;
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
        className={imageClass}
        style={editorialMask}
      />
    </div>
  );
}
