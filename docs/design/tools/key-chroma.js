const sharp = require("sharp");
// Croma-key magenta (#FF48FA aprox.) o verde, con corrección de halo.
async function keyMag(src, dst, { mode = "magenta", maxW = 1000 } = {}) {
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info; const n = w * h; const out = Buffer.alloc(n * 4);
  for (let p = 0; p < n; p++) {
    let r = data[p*3], g = data[p*3+1], b = data[p*3+2];
    let spill, full;
    if (mode === "magenta") { spill = Math.max(0, Math.min(r, b) - g); full = 175; }
    else { spill = Math.max(0, g - Math.max(r, b)); full = 100; }
    const k = Math.min(1, spill / full);
    let a = 1 - k; a = Math.max(0, Math.min(1, (a - 0.08) / 0.62)); a = a * a * (3 - 2 * a);
    if (mode === "magenta") { r = Math.max(0, r - spill * 0.75); b = Math.max(0, b - spill * 0.75); }
    else { g = Math.max(0, g - spill * 0.75); }
    out[p*4] = r; out[p*4+1] = g; out[p*4+2] = b; out[p*4+3] = Math.round(a * 255);
  }
  await sharp(out, { raw: { width: w, height: h, channels: 4 } }).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 10 }).resize({ width: maxW, withoutEnlargement: true }).webp({ quality: 88, alphaQuality: 92 }).toFile(dst);
  const m = await sharp(dst).metadata(); console.log(dst, m.width + "x" + m.height);
}
module.exports = { keyMag };
if (require.main === module) keyMag(process.argv[2], process.argv[3], { mode: process.argv[4] || "magenta", maxW: +process.argv[5] || 1000 });
