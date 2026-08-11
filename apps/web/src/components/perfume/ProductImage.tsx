"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlaceholder } from "./ImagePlaceholder";

type Mode = "card" | "hero";

type Props = {
  slug: string;
  alt: string;
  imageUrl?: string | null;
  mode?: Mode;
  className?: string;
};

type RGB = { r: number; g: number; b: number };

const MAX_ANALYSIS_EDGE = 900;

function distSq(a: RGB, b: RGB) {
  return (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2;
}

function averagePatch(data: Uint8ClampedArray, width: number, height: number, x0: number, y0: number, size: number): RGB {
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  const x1 = Math.min(width, x0 + size);
  const y1 = Math.min(height, y0 + size);
  for (let y = Math.max(0, y0); y < y1; y += 1) {
    for (let x = Math.max(0, x0); x < x1; x += 1) {
      const i = (y * width + x) * 4;
      if (data[i + 3] < 16) continue;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count += 1;
    }
  }
  return count ? { r: r / count, g: g / count, b: b / count } : { r: 255, g: 255, b: 255 };
}

function estimateEdgeBackground(data: Uint8ClampedArray, width: number, height: number): RGB | null {
  const patch = Math.max(3, Math.round(Math.min(width, height) * 0.035));
  const samples = [
    averagePatch(data, width, height, 0, 0, patch),
    averagePatch(data, width, height, width - patch, 0, patch),
    averagePatch(data, width, height, 0, height - patch, patch),
    averagePatch(data, width, height, width - patch, height - patch, patch),
  ];
  let spread = 0;
  for (let i = 0; i < samples.length; i += 1) {
    for (let j = i + 1; j < samples.length; j += 1) spread = Math.max(spread, distSq(samples[i], samples[j]));
  }
  if (spread > 58 ** 2) return null;
  return {
    r: samples.reduce((sum, c) => sum + c.r, 0) / samples.length,
    g: samples.reduce((sum, c) => sum + c.g, 0) / samples.length,
    b: samples.reduce((sum, c) => sum + c.b, 0) / samples.length,
  };
}

function removeConnectedBackground(imageData: ImageData) {
  const { data, width, height } = imageData;
  const bg = estimateEdgeBackground(data, width, height);
  if (!bg) return { changed: false, box: { x0: 0, y0: 0, x1: width - 1, y1: height - 1 } };

  const tolerance = 46 ** 2;
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;
  const enqueue = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const index = y * width + x;
    if (visited[index]) return;
    const i = index * 4;
    const color = { r: data[i], g: data[i + 1], b: data[i + 2] };
    if (data[i + 3] < 16 || distSq(color, bg) <= tolerance) {
      visited[index] = 1;
      queue[tail++] = index;
    }
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 1; y < height - 1; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  let removed = 0;
  while (head < tail) {
    const index = queue[head++];
    const x = index % width;
    const y = Math.floor(index / width);
    const i = index * 4;
    if (data[i + 3] !== 0) {
      data[i + 3] = 0;
      removed += 1;
    }
    enqueue(x + 1, y);
    enqueue(x - 1, y);
    enqueue(x, y + 1);
    enqueue(x, y - 1);
  }

  if (removed < width * height * 0.015) return { changed: false, box: { x0: 0, y0: 0, x1: width - 1, y1: height - 1 } };

  let x0 = width;
  let y0 = height;
  let x1 = 0;
  let y1 = 0;
  let found = false;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 20) {
        found = true;
        x0 = Math.min(x0, x);
        y0 = Math.min(y0, y);
        x1 = Math.max(x1, x);
        y1 = Math.max(y1, y);
      }
    }
  }
  if (!found) return { changed: false, box: { x0: 0, y0: 0, x1: width - 1, y1: height - 1 } };
  return { changed: true, box: { x0, y0, x1, y1 } };
}

function renderNormalized(img: HTMLImageElement, canvas: HTMLCanvasElement, mode: Mode) {
  const scale = Math.min(1, MAX_ANALYSIS_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));
  const source = document.createElement("canvas");
  source.width = width;
  source.height = height;
  const ctx = source.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(img, 0, 0, width, height);
  const data = ctx.getImageData(0, 0, width, height);
  const { changed, box } = removeConnectedBackground(data);
  if (changed) ctx.putImageData(data, 0, 0);

  const sw = Math.max(1, box.x1 - box.x0 + 1);
  const sh = Math.max(1, box.y1 - box.y0 + 1);
  const padRatio = mode === "hero" ? 0.11 : 0.13;
  const padX = Math.round(sw * padRatio);
  const padY = Math.round(sh * padRatio);
  canvas.width = sw + padX * 2;
  canvas.height = sh + padY * 2;
  const out = canvas.getContext("2d");
  if (!out) throw new Error("Canvas unavailable");
  out.clearRect(0, 0, canvas.width, canvas.height);
  out.drawImage(source, box.x0, box.y0, sw, sh, padX, padY, sw, sh);
}

export function ProductImage({ slug, alt, imageUrl, mode = "card", className = "" }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback" | "error">("loading");
  const [directFailed, setDirectFailed] = useState(false);
  const src = `/api/catalog-image/${encodeURIComponent(slug)}`;

  useEffect(() => {
    setStatus("loading");
    setDirectFailed(false);
  }, [src, imageUrl]);

  const onLoad = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    try {
      renderNormalized(img, canvas, mode);
      setStatus("ready");
    } catch {
      setStatus("fallback");
    }
  };

  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-[#fbfaf7] dark:bg-[#f7f4ee] ${className}`}>
      {/* Same-origin proxy makes canvas cleanup reliable even for retailer/CDN assets without CORS headers. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt=""
        aria-hidden="true"
        loading={mode === "card" ? "lazy" : "eager"}
        decoding="async"
        onLoad={onLoad}
        onError={() => setStatus("error")}
        className="pointer-events-none absolute h-px w-px opacity-0"
      />

      <canvas
        ref={canvasRef}
        role="img"
        aria-label={alt}
        className={`max-h-[84%] max-w-[84%] object-contain transition-[opacity,transform] duration-700 ease-out ${mode === "card" ? "group-hover:scale-[1.025]" : "hover:scale-[1.012]"} ${status === "ready" ? "opacity-100" : "opacity-0"}`}
      />

      {status === "fallback" || (status === "error" && imageUrl && !directFailed) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={status === "fallback" ? src : imageUrl ?? undefined}
          alt={alt}
          loading={mode === "card" ? "lazy" : "eager"}
          decoding="async"
          onError={() => setDirectFailed(true)}
          className="max-h-[78%] max-w-[78%] object-contain object-center"
        />
      ) : null}
      {status === "loading" ? <div className="absolute inset-[18%] animate-pulse bg-[#f0ece4]" aria-hidden="true" /> : null}
      {status === "error" && (!imageUrl || directFailed) ? <ImagePlaceholder alt={`${alt} — imagen temporalmente no disponible`} /> : null}
    </div>
  );
}
