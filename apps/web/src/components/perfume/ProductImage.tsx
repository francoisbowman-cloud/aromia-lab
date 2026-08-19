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
 * from real perfume packshots. Aromia now keeps the source image intact.
 *
 * A hero that explicitly requests a transparent stage is treated as an
 * immersive editorial presentation: the source pixels stay untouched while the
 * surrounding stage moves closer to the packshot's neutral field and gives the
 * object more usable scale. Other cards/heroes retain the canonical white stage.
 */
export function ProductImage({ slug, alt, imageUrl, mode = "card", className = "" }: Props) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [directFailed, setDirectFailed] = useState(false);
  const src = `/api/catalog-image/${encodeURIComponent(slug)}`;
  const directImageUrl = imageUrl && !/\/perfume-social-cards\//i.test(imageUrl) ? imageUrl : null;
  const immersiveHero = mode === "hero" && className.includes("bg-transparent");

  useEffect(() => {
    setStatus("loading");
    setDirectFailed(false);
  }, [src, directImageUrl]);

  const imageClass = `${immersiveHero ? "max-h-[94%] max-w-[94%]" : "max-h-[84%] max-w-[84%]"} object-contain object-center transition-[opacity,transform] duration-500 ease-out ${
    mode === "card" ? "group-hover:scale-[1.018]" : "hover:scale-[1.008]"
  }`;
  const stageClass = immersiveHero ? "bg-[#eeeeec] dark:bg-[#161513]" : "bg-white";

  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden ${stageClass} ${className.replaceAll("bg-transparent", "").replaceAll("dark:bg-transparent", "")}`}>
      {status !== "error" ? (
        // Same-origin proxy preserves source fidelity while avoiding retailer/CDN presentation differences.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={mode === "card" ? "lazy" : "eager"}
          decoding="async"
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("error")}
          className={`${imageClass} ${status === "ready" ? "opacity-100" : "opacity-0"}`}
        />
      ) : null}

      {status === "error" && directImageUrl && !directFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={directImageUrl}
          alt={alt}
          loading={mode === "card" ? "lazy" : "eager"}
          decoding="async"
          onLoad={() => setStatus("ready")}
          onError={() => setDirectFailed(true)}
          className={imageClass}
        />
      ) : null}

      {status === "loading" ? (
        <div className={`absolute inset-[18%] animate-pulse ${immersiveHero ? "bg-[#e7e6e3] dark:bg-[#201e1b]" : "bg-[#f3f1ed]"}`} aria-hidden="true" />
      ) : null}

      {status === "error" && (!directImageUrl || directFailed) ? (
        <ImagePlaceholder alt={`${alt} — imagen temporalmente no disponible`} />
      ) : null}
    </div>
  );
}
