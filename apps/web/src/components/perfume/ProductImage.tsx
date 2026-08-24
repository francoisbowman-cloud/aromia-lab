"use client";

import { useEffect, useState } from "react";

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

function median(values: number[]) {
  if (!values.length) return 255;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 255;
}

function backgroundEstimate(data: Uint8ClampedArray, width: number, height: number) {
  const r: number[] = [];
  const g: number[] = [];
  const b: number[] = [];
  const sample = (x: number, y: number) => {
    const i = (y * width + x) * 4;
    r.push(data[i] ?? 255);
    g.push(data[i + 1] ?? 255);
    b.push(data[i + 2] ?? 255);
  };
  const stepX = Math.max(1, Math.floor(width / 48));
  const stepY = Math.max(1, Math.floor(height / 48));
  for (let x = 0; x < width; x += stepX) {
    sample(x, 0);
    sample(x, height - 1);
  }
  for (let y = 0; y < height; y += stepY) {
    sample(0, y);
    sample(width - 1, y);
  }
  return { r: median(r), g: median(g), b: median(b) };
}

function removeConnectedBackdrop(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const image = ctx.getImageData(0, 0, width, height);
  const { data } = image;
  const bg = backgroundEstimate(data, width, height);
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  const similarity = (idx: number) => {
    const i = idx * 4;
    const rr = data[i] ?? 0;
    const gg = data[i + 1] ?? 0;
    const bb = data[i + 2] ?? 0;
    const max = Math.max(rr, gg, bb);
    const min = Math.min(rr, gg, bb);
    const chroma = max - min;
    const distance = Math.sqrt((rr - bg.r) ** 2 + (gg - bg.g) ** 2 + (bb - bg.b) ** 2);
    return distance < 58 || (min > 218 && chroma < 28);
  };

  const enqueue = (idx: number) => {
    if (idx < 0 || idx >= width * height || visited[idx] || !similarity(idx)) return;
    visited[idx] = 1;
    queue[tail++] = idx;
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }

  while (head < tail) {
    const idx = queue[head++] ?? 0;
    const x = idx % width;
    const y = Math.floor(idx / width);
    if (x > 0) enqueue(idx - 1);
    if (x + 1 < width) enqueue(idx + 1);
    if (y > 0) enqueue(idx - width);
    if (y + 1 < height) enqueue(idx + width);
  }

  for (let idx = 0; idx < visited.length; idx += 1) {
    if (!visited[idx]) continue;
    const i = idx * 4;
    data[i + 3] = 0;
  }

  ctx.putImageData(image, 0, 0);
}

/**
 * Authentic product imagery is always resolved through the same-origin catalog
 * image endpoint. On editorial surfaces we remove only the light backdrop that
 * is connected to the source image edges. This keeps bottle pixels, labels and
 * glass intact while preventing the source photo rectangle from becoming an
 * accidental card inside Aromia's material canvas.
 */
export function ProductImage({ slug, alt, mode = "card", surface = "comparison", className = "" }: Props) {
  const src = `/api/catalog-image/${encodeURIComponent(slug)}`;
  const editorial = surface === "editorial";
  const [displaySrc, setDisplaySrc] = useState(src);
  const [ready, setReady] = useState(!editorial);

  useEffect(() => {
    if (!editorial) {
      setDisplaySrc(src);
      setReady(true);
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;
    const image = new Image();
    image.decoding = "async";
    image.src = src;

    image.onload = () => {
      try {
        const maxDimension = mode === "hero" ? 1100 : 620;
        const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
        const width = Math.max(1, Math.round(image.naturalWidth * scale));
        const height = Math.max(1, Math.round(image.naturalHeight * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("Canvas unavailable");
        ctx.drawImage(image, 0, 0, width, height);
        removeConnectedBackdrop(ctx, width, height);
        canvas.toBlob((blob) => {
          if (cancelled || !blob) return;
          objectUrl = URL.createObjectURL(blob);
          setDisplaySrc(objectUrl);
          setReady(true);
        }, "image/png");
      } catch {
        if (!cancelled) {
          setDisplaySrc(src);
          setReady(true);
        }
      }
    };
    image.onerror = () => {
      if (!cancelled) {
        setDisplaySrc(src);
        setReady(true);
      }
    };

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [editorial, mode, src]);

  const imageClass = `${editorial ? "max-h-[98%] max-w-[98%]" : "max-h-[84%] max-w-[84%]"} object-contain object-center transition-[transform,opacity] duration-500 ease-out ${ready ? "opacity-100" : "opacity-0"} ${
    mode === "card" ? "group-hover:scale-[1.025]" : "hover:scale-[1.008]"
  }`;
  const stageClass = editorial ? "bg-transparent" : "bg-white";

  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden ${stageClass} ${className}`}>
      {!ready && editorial ? <div aria-hidden="true" className="absolute inset-[18%] rounded-[50%] bg-[#d9c8b1]/20 blur-3xl" /> : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={displaySrc}
        alt={alt}
        loading={mode === "card" ? "lazy" : "eager"}
        decoding="async"
        className={imageClass}
      />
    </div>
  );
}
