// One-off: rasterize the Gate 3 interpretive SVG sources to 1600x900 JPGs.
// Source of truth: art-direction/interpretive-source/*.svg (ChatGPT deliverable).
// Do not redesign — this only rasterizes.
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const SRC = `${ROOT}/art-direction/interpretive-source`;
const OUT = `${ROOT}/apps/web/public/editorial-v1`;
const W = 1600;
const H = 900;

const names = [
  "ambroxan-resin-abstract-01",
  "ropion-bordeaux-texture-01",
  "amouage-mineral-density-01",
];

for (const name of names) {
  const svg = readFileSync(`${SRC}/${name}.svg`);
  const jpg = await sharp(svg, { density: 144 })
    .resize(W, H, { fit: "fill" })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();

  const meta = await sharp(jpg).metadata();
  const magic = jpg.subarray(0, 3).toString("hex");
  const sha = createHash("sha256").update(jpg).digest("hex");

  writeFileSync(`${OUT}/${name}.jpg`, jpg);
  console.log(
    `${name}.jpg  ${meta.width}x${meta.height}  ${(jpg.length / 1024).toFixed(1)}KB  magic=${magic}  sha256=${sha}`,
  );
}
