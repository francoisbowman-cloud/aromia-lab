"use client";

import { useEffect, useState } from "react";
import { ImagePlaceholder } from "./ImagePlaceholder";

type Mode = "card" | "hero";

type Props = {
  slug: string;
  alt: string;
  imageUrl?: string | null;
  mode?: Mode;
  className?: string;
};

/**
 * Product identity is more important than background extraction.
 *
 * Previous versions tried to remove pale edge-connected backgrounds in the
 * browser. That can erase translucent glass, pale liquid, labels and highlights
 * from real perfume packshots. Aromia now keeps the source image intact and
 * lets a pure-white stage absorb white retailer/packshot backgrounds naturally.
 *
 * Source selection is intentionally independent from load state. A valid image
 * must never become visually hidden because React state races with the browser's
 * image lifecycle. Fallback is one-way: proxy -> direct source -> placeholder.
 */
export function ProductImage({ slug, alt, imageUrl, mode = "card", className = "" }: Props) {
  const proxySrc = `/api/catalog-image/${encodeURIComponent(slug)}`;
  const directImageUrl = imageUrl && !/\/perfume-social-cards\//i.test(imageUrl) ? imageUrl : null;
  const [activeSrc, setActiveSrc] = useState(proxySrc);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setActiveSrc(proxySrc);
    setFailed(false);
  }, [proxySrc, directImageUrl]);

  const imageClass = `max-h-[84%] max-w-[84%] object-contain object-center transition-transform duration-500 ease-out ${
    mode === "card" ? "group-hover:scale-[1.018]" : "hover:scale-[1.008]"
  }`;

  const handleError = () => {
    if (activeSrc === proxySrc && directImageUrl && directImageUrl !== proxySrc) {
      setActiveSrc(directImageUrl);
      return;
    }
    setFailed(true);
  };

  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-white ${className}`}>
      {!failed ? (
        // Same-origin proxy is preferred for fidelity; direct image is a persistent fallback.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={activeSrc}
          src={activeSrc}
          alt={alt}
          loading={mode === "card" ? "lazy" : "eager"}
          decoding="async"
          onError={handleError}
          className={imageClass}
        />
      ) : (
        <ImagePlaceholder alt={`${alt} — imagen temporalmente no disponible`} />
      )}
    </div>
  );
}
