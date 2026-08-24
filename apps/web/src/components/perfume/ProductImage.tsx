"use client";

type Mode = "card" | "hero";
type Surface = "comparison" | "editorial";

type Props = {
  slug: string;
  alt: string;
  imageUrl?: string | null;
  mode?: Mode;
  surface?: Surface;
  className?: string;
};

/**
 * Product-image source resolution belongs to the same-origin catalog-image
 * endpoint. The component only presents that resolved result.
 *
 * `comparison` preserves the canonical white stage used where image-to-image
 * comparison matters. `editorial` removes that extra wrapper so the authentic
 * source can live directly on Aromia's paper field. On the light theme the
 * source is blended gently into the paper to reduce obvious white-canvas seams;
 * the original product pixels remain untouched.
 */
export function ProductImage({ slug, alt, mode = "card", surface = "comparison", className = "" }: Props) {
  const src = `/api/catalog-image/${encodeURIComponent(slug)}`;
  const editorial = surface === "editorial";
  const imageClass = `${editorial ? "max-h-[96%] max-w-[96%] mix-blend-multiply dark:mix-blend-normal" : "max-h-[84%] max-w-[84%]"} object-contain object-center transition-transform duration-500 ease-out ${
    mode === "card" ? "group-hover:scale-[1.018]" : "hover:scale-[1.008]"
  }`;
  const stageClass = editorial ? "bg-transparent" : "bg-white";

  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden ${stageClass} ${className}`}>
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
