"use client";

import { useEffect, useRef, useState } from "react";

type CropResult = {
  bgColor: string;
  box: { x0: number; y0: number; x1: number; y1: number };
};

type CropRender = {
  backgroundSize: string;
  backgroundPosition: string;
  imageStyle: { width: string; height: string; left: string; top: string };
};

function analyzeImage(img: HTMLImageElement): CropResult | null {
  try {
    const canvas = document.createElement("canvas");
    const size = 100;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);

    let er = 0;
    let eg = 0;
    let eb = 0;
    let eCount = 0;
    const edgeIdx = [
      ...Array.from({ length: size }, (_, x) => [x, 0]),
      ...Array.from({ length: size }, (_, x) => [x, size - 1]),
      ...Array.from({ length: size }, (_, y) => [0, y]),
      ...Array.from({ length: size }, (_, y) => [size - 1, y]),
    ];
    for (const [x, y] of edgeIdx) {
      const i = (y * size + x) * 4;
      er += data[i];
      eg += data[i + 1];
      eb += data[i + 2];
      eCount++;
    }
    er /= eCount;
    eg /= eCount;
    eb /= eCount;

    const threshold = 26;
    let x0 = size;
    let y0 = size;
    let x1 = 0;
    let y1 = 0;
    let found = false;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        const dist = Math.sqrt((data[i] - er) ** 2 + (data[i + 1] - eg) ** 2 + (data[i + 2] - eb) ** 2);
        if (dist > threshold) {
          found = true;
          if (x < x0) x0 = x;
          if (y < y0) y0 = y;
          if (x > x1) x1 = x;
          if (y > y1) y1 = y;
        }
      }
    }

    const bgColor = `rgb(${Math.round(er)}, ${Math.round(eg)}, ${Math.round(eb)})`;
    if (!found) return { bgColor, box: { x0: 0, y0: 0, x1: 1, y1: 1 } };

    const pad = 3;
    return {
      bgColor,
      box: {
        x0: Math.max(0, x0 - pad) / size,
        y0: Math.max(0, y0 - pad) / size,
        x1: Math.min(size, x1 + pad) / size,
        y1: Math.min(size, y1 + pad) / size,
      },
    };
  } catch {
    return null;
  }
}

function renderCrop(img: HTMLImageElement, box: CropResult["box"], container: HTMLElement): CropRender | null {
  const cw = container.clientWidth;
  const ch = container.clientHeight;
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (!cw || !ch || !nw || !nh) return null;

  const boxWidthPx = (box.x1 - box.x0) * nw;
  const boxHeightPx = (box.y1 - box.y0) * nh;
  if (boxWidthPx <= 0 || boxHeightPx <= 0) return null;

  const scale = Math.min(cw / boxWidthPx, ch / boxHeightPx);
  const scaledW = nw * scale;
  const scaledH = nh * scale;
  const boxCenterX = ((box.x0 + box.x1) / 2) * nw * scale;
  const boxCenterY = ((box.y0 + box.y1) / 2) * nh * scale;
  const left = cw / 2 - boxCenterX;
  const top = ch / 2 - boxCenterY;

  return {
    backgroundSize: `${scaledW}px ${scaledH}px`,
    backgroundPosition: `${left}px ${top}px`,
    imageStyle: { width: `${scaledW}px`, height: `${scaledH}px`, left: `${left}px`, top: `${top}px` },
  };
}

export function useProductImageCrop(src: string | undefined) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [bgColor, setBgColor] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropRender | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<CropResult["box"] | null>(null);

  const applyAnalysis = () => {
    const img = imgRef.current;
    const frame = frameRef.current;
    if (!img || !frame) return;
    const analysis = analyzeImage(img);
    if (!analysis) return;
    setBgColor(analysis.bgColor);
    boxRef.current = analysis.box;
    setCrop(renderCrop(img, analysis.box, frame));
  };

  const handleLoad = () => {
    setImgLoaded(true);
    applyAnalysis();
  };

  useEffect(() => {
    setImgError(false);
    setImgLoaded(false);
    setBgColor(null);
    setCrop(null);
    boxRef.current = null;
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setImgLoaded(true);
      applyAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new ResizeObserver(() => {
      if (imgRef.current && boxRef.current) setCrop(renderCrop(imgRef.current, boxRef.current, frame));
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const frameBackground = bgColor
    ? `radial-gradient(130% 140% at 50% 38%, color-mix(in srgb, ${bgColor} 88%, white) 0%, ${bgColor} 100%)`
    : undefined;

  return {
    imgRef,
    frameRef,
    frameBackground,
    backgroundSize: crop?.backgroundSize ?? "contain",
    backgroundPosition: crop?.backgroundPosition ?? "center",
    imageStyle: crop?.imageStyle ?? { width: "100%", height: "100%", left: "0px", top: "0px" },
    imgError,
    imgLoaded,
    handleLoad,
    handleError: () => {
      setImgLoaded(false);
      setImgError(true);
    },
  };
}
