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
 * endpoint. The component only presents that resolved result.
 *
 * Keeping source/fallback state out of React avoids pre-hydration load/error
 * races that can leave valid pixels hidden or expose a broken-image glyph.
 */
export function ProductImage({ slug, alt, mode = "card", className = "" }: Props) {
  const src = `/api/catalog-image/${encodeURIComponent(slug)}`;
  const imageClass = `max-h-[84%] max-w-[84%] object-contain object-center transition-transform duration-500 ease-out ${
    mode === "card" ? "group-hover:scale-[1.018]" : "hover:scale-[1.008]"
  }`;

  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-white ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={mode === "card" ? "lazy" : "eager"}
        decoding="async"
        className={imageClass}
      />
    </div>
  );
}
