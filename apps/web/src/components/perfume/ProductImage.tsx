"use client";

import type { CSSProperties } from "react";
import { productPresentation } from "@/lib/productPresentation";

type Mode = "card" | "hero";

type Props = {
  slug: string;
  alt: string;
  imageUrl?: string | null;
  mode?: Mode;
  className?: string;
};

/**
 * Canonical product stage.
 *
 * Fidelity rules:
 * - source pixels are never redrawn, cropped, recolored or replaced;
 * - catalog/PDP backgrounds remain pure white;
 * - optical scale is geometry-aware instead of one global magic number;
 * - atypical silhouettes can receive explicit, reviewable overrides;
 * - motion is deliberately tiny and disabled by reduced-motion globally.
 */
export function ProductImage({ slug, alt, mode = "card", className = "" }: Props) {
  const src = `/api/catalog-image/${encodeURIComponent(slug)}`;
  const presentation = productPresentation(slug);
  const frame = presentation[mode];
  const style = {
    "--product-max-h": `${frame.maxHeight}%`,
    "--product-max-w": `${frame.maxWidth}%`,
    "--product-x": `${frame.x}%`,
    "--product-y": `${frame.y}%`,
    "--product-scale": String(frame.scale),
    "--product-card-hover-scale": String(frame.scale * 1.012),
    "--product-hero-hover-scale": String(frame.scale * 1.006),
  } as CSSProperties;

  return (
    <div
      data-product-stage="true"
      data-product-geometry={presentation.geometry}
      className={`product-stage relative flex h-full w-full items-center justify-center overflow-hidden bg-white ${className}`}
      style={style}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={mode === "card" ? "lazy" : "eager"}
        decoding="async"
        data-product-image="true"
        className={`product-stage__image object-contain object-center ${mode === "card" ? "product-stage__image--card" : "product-stage__image--hero"}`}
      />
    </div>
  );
}
