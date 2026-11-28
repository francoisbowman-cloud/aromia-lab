// Recorte por saturación + relleno de huecos. Para fondos neutros con iluminación no uniforme.
const sharp = require("sharp");
async function key2(src, dst, { c0 = 16, c1 = 34, grow = 3, maxW = 1000, hole = true, bright = 0 } = {}) {
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const n = w * h;
  const bin = Buffer.alloc(n);
  let bgL = 0; { const ls = []; for (let x = 0; x < w; x += 9) for (const y of [6, h - 7]) { const i = (y * w + x) * 3; ls.push((data[i] + data[i+1] + data[i+2]) / 3); } ls.sort((a, b) => a - b); bgL = ls[ls.length >> 1]; }
  for (let p = 0; p < n; p++) {
    const r = data[p * 3], g = data[p * 3 + 1], b = data[p * 3 + 2];
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    const L = (r + g + b) / 3; bin[p] = (chroma > c0 || (bright && L > bgL + bright)) ? 255 : 0;
  }
  const blurT = async (buf, sigma, thr) => {
    const o = await sharp(buf, { raw: { width: w, height: h, channels: 1 } }).blur(sigma).extractChannel(0).raw().toBuffer();
    const r = Buffer.alloc(n); for (let i = 0; i < n; i++) r[i] = o[i] > thr ? 255 : 0; return r;
  };
  let m = await blurT(bin, grow, 20);        // dilatar (cierra micro-huecos)
  if (hole) {                                 // relleno: lo no alcanzable desde el borde es objeto
    const bgReach = new Uint8Array(n);
    const stack = [];
    const push = (x, y) => { const i = y * w + x; if (!bgReach[i] && m[i] === 0) { bgReach[i] = 1; stack.push(i); } };
    for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
    for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
    while (stack.length) {
      const i = stack.pop(); const x = i % w, y = (i / w) | 0;
      if (x > 0) push(x - 1, y); if (x < w - 1) push(x + 1, y); if (y > 0) push(x, y - 1); if (y < h - 1) push(x, y + 1);
    }
    for (let i = 0; i < n; i++) m[i] = bgReach[i] ? 0 : 255;
  }
  m = await blurT(m, grow, 235);              // erosionar de vuelta
  // mayor componente conexa únicamente (descarta motas)
  const lab = new Int32Array(n); let best = 0, bestId = 0, id = 0; const st = [];
  for (let s = 0; s < n; s++) {
    if (m[s] === 0 || lab[s]) continue; id++; let cnt = 0; st.push(s); lab[s] = id;
    while (st.length) { const i = st.pop(); cnt++; const x = i % w, y = (i / w) | 0;
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue; const j = ny * w + nx; if (m[j] && !lab[j]) { lab[j] = id; st.push(j); } } }
    if (cnt > best) { best = cnt; bestId = id; }
  }
  const only = Buffer.alloc(n); for (let i = 0; i < n; i++) only[i] = lab[i] === bestId ? 255 : 0;
  const soft = await sharp(only, { raw: { width: w, height: h, channels: 1 } }).blur(1.2).extractChannel(0).raw().toBuffer();
  const out = Buffer.alloc(n * 4);
  for (let p = 0; p < n; p++) { out[p*4] = data[p*3]; out[p*4+1] = data[p*3+1]; out[p*4+2] = data[p*3+2]; out[p*4+3] = soft[p]; }
  await sharp(out, { raw: { width: w, height: h, channels: 4 } }).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 8 }).resize({ width: maxW, withoutEnlargement: true }).webp({ quality: 88, alphaQuality: 92 }).toFile(dst);
  const md = await sharp(dst).metadata(); console.log(dst, md.width + "x" + md.height);
}
module.exports = { key2 };
if (require.main === module) key2(process.argv[2], process.argv[3], { maxW: +process.argv[4] || 1000, c0: +process.argv[5] || 16, bright: +process.argv[6] || 0, hole: process.env.HOLE !== "0" });
