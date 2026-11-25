// Reproducible rendered audit of editorial pages (read-only: only GET navigation, no writes).
// Usage: node scripts/qa/editorial-render-audit.cjs <baseUrl> <outDir> [/route,/route2]
// Needs PLAYWRIGHT_PACKAGE_PATH (folder with playwright or playwright-core installed
// outside the repo; same pattern as admin-browser-smoke.cjs) and optionally CHROME_PATH.
// Performance numbers from a local machine are INDICATIVE; layout shift, byte weight,
// oversized images, internal-marker leaks and reduced-motion behaviour are deterministic.
const { createRequire } = require('node:module');
const { mkdirSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const pkgRoot = process.env.PLAYWRIGHT_PACKAGE_PATH;
if (!pkgRoot) throw new Error('Set PLAYWRIGHT_PACKAGE_PATH to a folder containing playwright or playwright-core');
const req = createRequire(join(pkgRoot, 'package.json'));
let chromium;
try { ({ chromium } = req('playwright')); } catch { ({ chromium } = req('playwright-core')); }

const [BASE, OUT, extra] = process.argv.slice(2);
if (!BASE || !OUT) throw new Error('Usage: editorial-render-audit.cjs <baseUrl> <outDir> [/route,...]');
mkdirSync(OUT, { recursive: true });

// ROUTES_ONLY=1 audits only the routes given as third argument.
const BASE_ROUTES = ['/', '/magazine', '/descubrir', '/buscar', '/quiz', '/club', '/privacidad'];
const EXTRA_ROUTES = extra ? extra.split(',').filter(Boolean) : [];
const ROUTES = process.env.ROUTES_ONLY ? EXTRA_ROUTES : [...BASE_ROUTES, ...EXTRA_ROUTES];
const VIEWPORTS = [{ n: 'mobile', w: 375, h: 812 }, { n: 'desktop', w: 1280, h: 800 }];
const LEAK = /\[AROMIA_VISUAL_OPPORTUNITY\]|AUTHOR_INPUT_OPPORTUNITY|Nota para Code|COWORK_STAGE|EDITORIAL:\s*READY|ART_DIRECTION:\s*PENDING|batch_100_item|lorem ipsum|\[object Object\]|\bundefined\b|\bNaN\b|\{\{|\}\}/i;
// 'TODO' is matched upper-case only: 'todo' is a Spanish word.
const LEAK_CASE = /\bTODO\b|\bFIXME\b/;

const inPage = ({ leakSrc, caseSrc }) => {
  const leak = new RegExp(leakSrc, 'i');
  const leakCase = new RegExp(caseSrc);
  const out = {};
  const text = document.body.innerText;
  // textContent (not innerText) for the case-sensitive pattern: CSS text-transform changes innerText.
  const m = leak.exec(text) || leakCase.exec(document.body.textContent);
  out.leak = m ? m[0] : null;
  out.placeholders = (text.match(/Imagen no disponible/gi) || []).length;
  out.brokenImages = [...document.images].filter(i => i.complete && i.naturalWidth === 0 && (i.currentSrc || i.src)).length;
  out.emptyLinks = [...document.querySelectorAll('a[href]')].filter(a => ['#', '', 'javascript:void(0)'].includes(a.getAttribute('href').trim())).length;
  const isAmazon = h => { try { const u = new URL(h, location.href); return /(^|\.)amazon\.[a-z.]+$/.test(u.hostname) || ['amzn.to', 'amzn.eu', 'a.co'].includes(u.hostname); } catch { return false; } };
  // Only commercial links (affiliate tag, product or search paths), not e.g. Amazon's privacy policy.
  const commercial = a => { try { const u = new URL(a.href); return u.searchParams.has('tag') || /^\/(dp|gp\/product|s)(\/|$)/.test(u.pathname); } catch { return false; } };
  out.amazonLinks = [...document.querySelectorAll('a[href]')].filter(a => isAmazon(a.href) && commercial(a));
  out.amazonNoSponsored = out.amazonLinks.filter(a => !/sponsored/.test(a.rel)).length;
  out.amazonLinks = out.amazonLinks.length;
  const over = [...document.images].filter(i => i.clientWidth > 40 && i.naturalWidth > i.clientWidth * 2.5 * (devicePixelRatio || 1));
  out.oversizedImages = over.length;
  out.oversizedDetail = over.slice(0, 4).map(i => ({ src: (i.currentSrc || i.src).replace(location.origin, '').slice(-70), natural: i.naturalWidth + 'x' + i.naturalHeight, shown: i.clientWidth + 'x' + i.clientHeight, lazy: i.loading, hasSrcset: !!i.srcset }));
  // Legibility of the main reading text: size, line height and measure in characters.
  const p = [...document.querySelectorAll('article p, main p')].find(e => e.textContent.trim().length > 120 && e.getBoundingClientRect().width > 0);
  if (p) {
    const cs = getComputedStyle(p);
    const ctx = document.createElement('canvas').getContext('2d'); ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const zero = ctx.measureText('0').width || parseFloat(cs.fontSize) * 0.55;
    const fs = parseFloat(cs.fontSize);
    out.reading = { fontPx: fs, lineHeight: +(cs.lineHeight === 'normal' ? 1.2 : parseFloat(cs.lineHeight) / fs).toFixed(2), measureCh: Math.round(p.getBoundingClientRect().width / zero) };
  }
  // Accessibility basics measured on the rendered DOM (not a substitute for a screen-reader review).
  out.imgNoAlt = [...document.images].filter(i => !i.hasAttribute('alt')).length;
  const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => +h.tagName[1]);
  out.headingSkips = hs.filter((l, i) => i && l - hs[i - 1] > 1).length;
  const nameOf = e => e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') || e.textContent.trim() || e.querySelector('img[alt]:not([alt=""])') || e.title || '';
  out.unnamedLinks = [...document.querySelectorAll('a[href]')].filter(a => !nameOf(a)).length;
  out.unnamedButtons = [...document.querySelectorAll('button')].filter(b => !nameOf(b)).length;
  out.unlabeledInputs = [...document.querySelectorAll('input:not([type=hidden]),select,textarea')].filter(i => !(i.labels && i.labels.length) && !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby')).length;
  const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
  const parse = s => { const mm = s.match(/rgba?\(([^)]+)\)/); if (!mm) return null; const pp = mm[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { c: pp.slice(0, 3), a: pp.length > 3 ? pp[3] : 1 }; };
  const bgOf = el => { let e = el; while (e) { const cs = getComputedStyle(e); if (cs.backgroundImage !== 'none') return null; const q = parse(cs.backgroundColor); if (q && q.a > .95) return q.c; e = e.parentElement; } return [255, 255, 255]; };
  const bad = []; let measured = 0, skipped = 0; const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const n = walker.currentNode; if (!n.textContent.trim()) continue; const el = n.parentElement;
    if (!el || seen.has(el)) continue; seen.add(el);
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    const fg = parse(cs.color), bg = bgOf(el); if (!fg || !bg) { skipped++; continue; }
    const mix = fg.c.map((v, i) => v * fg.a + bg[i] * (1 - fg.a));
    const L1 = lum(mix), L2 = lum(bg); const ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
    const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700; const large = size >= 24 || (size >= 18.66 && bold);
    measured++;
    if (ratio < (large ? 3 : 4.5)) bad.push({ t: n.textContent.trim().slice(0, 28), r: +ratio.toFixed(2), px: size });
  }
  // Text over images/gradients cannot be measured this way and is counted as skipped, not passed.
  out.contrast = { measured, skippedBgImage: skipped, failing: bad.length, worst: bad.sort((x, y) => x.r - y.r).slice(0, 3) };
  out.h1 = document.querySelectorAll('h1').length;
  out.theme = document.documentElement.getAttribute('data-theme');
  out.hOverflow = Math.max(0, document.documentElement.scrollWidth - innerWidth);
  return out;
};

(async () => {
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const report = [];
  for (const vp of VIEWPORTS) for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, colorScheme: scheme });
    // The site ignores prefers-color-scheme: the theme is chosen by this localStorage key.
    await ctx.addInitScript(t => { try { localStorage.setItem('aromia_theme', t); } catch { /* storage unavailable */ } }, scheme);
    for (const route of ROUTES) {
      const page = await ctx.newPage();
      await page.addInitScript(() => {
        window.__m = { cls: 0, lcp: 0, longTaskMs: 0 };
        try {
          window.__m.shifts = [];
          const sel = n => n ? (n.tagName || '#text').toLowerCase() + (n.className && typeof n.className === 'string' ? '.' + n.className.trim().split(/\s+/)[0] : '') : '?';
          new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) { window.__m.cls += e.value; if (e.value > 0.02) window.__m.shifts.push({ v: +e.value.toFixed(3), at: Math.round(e.startTime), src: (e.sources || []).slice(0, 2).map(s => sel(s.node)) }); } }).observe({ type: 'layout-shift', buffered: true });
          new PerformanceObserver(l => { const a = l.getEntries(); window.__m.lcp = a[a.length - 1].startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
          new PerformanceObserver(l => { for (const e of l.getEntries()) window.__m.longTaskMs += e.duration; }).observe({ type: 'longtask', buffered: true });
        } catch { /* observer types differ per engine */ }
      });
      const bytes = { js: 0, img: 0, css: 0, font: 0, total: 0, requests: 0 };
      const sizes = [];
      page.on('requestfinished', r => sizes.push(r.sizes().then(s => ({ t: r.resourceType(), b: s.responseBodySize })).catch(() => null)));
      const row = { vp: vp.n, scheme, route };
      try {
        const res = await page.goto(BASE + route, { waitUntil: 'load', timeout: 90000 });
        row.status = res && res.status();
        await page.waitForTimeout(1500);
        row.clsInitial = await page.evaluate(() => window.__m.cls);
        for (let y = 0; y < 6; y++) { await page.mouse.wheel(0, 900); await page.waitForTimeout(250); }
        await page.waitForTimeout(1200);
        Object.assign(row, await page.evaluate(inPage, { leakSrc: LEAK.source, caseSrc: LEAK_CASE.source }));
        Object.assign(row, await page.evaluate(() => window.__m));
        for (const s of await Promise.all(sizes)) if (s) { bytes.requests++; bytes.total += s.b; if (s.t === 'script') bytes.js += s.b; else if (s.t === 'image') bytes.img += s.b; else if (s.t === 'stylesheet') bytes.css += s.b; else if (s.t === 'font') bytes.font += s.b; }
        row.kb = Object.fromEntries(Object.entries(bytes).map(([k, v]) => [k, k === 'requests' ? v : Math.round(v / 1024)]));
        // Reduced motion: no endless or long-running animations may remain.
        const rm = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, colorScheme: scheme, reducedMotion: 'reduce' });
        await rm.addInitScript(t => { try { localStorage.setItem('aromia_theme', t); } catch { /* storage unavailable */ } }, scheme);
        const rp = await rm.newPage();
        await rp.goto(BASE + route, { waitUntil: 'load', timeout: 90000 }); await rp.waitForTimeout(1200);
        row.motionNormal = await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running' && !(a instanceof CSSTransition)).length);
        const reduced = await rp.evaluate(() => document.getAnimations().filter(a => { if (a.playState !== 'running') return false; const t = a.effect && a.effect.getComputedTiming(); return t && (t.iterations === Infinity || t.duration > 1000); }).map(a => (a.effect.target && a.effect.target.tagName || '?') + ':' + (a.animationName || a.constructor.name)));
        row.motionReducedEndless = reduced.length; row.motionReducedExamples = reduced.slice(0, 3);
        await rm.close();
      } catch (e) { row.error = String(e.message).slice(0, 140); }
      report.push(row);
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  writeFileSync(join(OUT, 'editorial-render-audit.json'), JSON.stringify(report, null, 1));

  const flags = r => {
    const f = [];
    if (r.error) f.push('ERROR ' + r.error);
    if (r.status >= 400) f.push('HTTP ' + r.status);
    if (r.theme && r.theme !== r.scheme) f.push('THEME_NOT_APPLIED wanted=' + r.scheme + ' got=' + r.theme + ' (results for this row are not valid)');
    if (r.leak) f.push('INTERNAL_MARKER_LEAK ' + JSON.stringify(r.leak));
    if (r.brokenImages) f.push('brokenImages=' + r.brokenImages);
    if (r.emptyLinks) f.push('emptyLinks=' + r.emptyLinks);
    if (r.amazonNoSponsored) f.push('amazonNoSponsored=' + r.amazonNoSponsored + '/' + r.amazonLinks);
    if (r.hOverflow) f.push('hOverflow=' + r.hOverflow);
    if (r.h1 !== 1) f.push('h1=' + r.h1);
    if (r.imgNoAlt) f.push('imgNoAlt=' + r.imgNoAlt);
    if (r.headingSkips) f.push('headingSkips=' + r.headingSkips);
    if (r.unnamedLinks) f.push('unnamedLinks=' + r.unnamedLinks);
    if (r.unnamedButtons) f.push('unnamedButtons=' + r.unnamedButtons);
    if (r.unlabeledInputs) f.push('unlabeledInputs=' + r.unlabeledInputs);
    if (r.contrast && r.contrast.failing) f.push('contrastFail=' + r.contrast.failing + '/' + r.contrast.measured + ' ' + JSON.stringify(r.contrast.worst));
    if (r.cls > 0.1) f.push('CLS=' + r.cls.toFixed(3) + ' (beforeScroll=' + (r.clsInitial || 0).toFixed(3) + ') ' + JSON.stringify((r.shifts || []).slice(0, 2)));
    if (r.lcp > 2500) f.push('LCP(indicative)=' + Math.round(r.lcp) + 'ms');
    if (r.oversizedImages) f.push('oversizedImages=' + r.oversizedImages + ' ' + JSON.stringify((r.oversizedDetail || []).slice(0, 2)));
    if (r.reading && (r.reading.fontPx < 16 || r.reading.lineHeight < 1.4 || r.reading.measureCh > 85 || r.reading.measureCh < 25)) f.push('reading=' + JSON.stringify(r.reading));
    if (r.motionReducedEndless) f.push('reducedMotionEndless=' + r.motionReducedEndless + ' ' + JSON.stringify(r.motionReducedExamples));
    return f;
  };
  const withFlags = report.map(r => ({ r, f: flags(r) }));
  console.log(`rows=${report.length} withFindings=${withFlags.filter(x => x.f.length).length}`);
  for (const { r, f } of withFlags) if (f.length) console.log(`[${r.vp}/${r.scheme}] ${r.route} -> ${f.join(' | ')}`);
  const num = k => report.map(r => r[k]).filter(v => typeof v === 'number');
  const max = a => (a.length ? Math.max(...a) : null);
  console.log('summary', JSON.stringify({ maxCLS: max(num('cls')), maxLCPms: Math.round(max(num('lcp')) || 0), maxJsKB: max(report.map(r => r.kb && r.kb.js).filter(Number.isFinite)), maxTotalKB: max(report.map(r => r.kb && r.kb.total).filter(Number.isFinite)), maxLongTaskMs: Math.round(max(num('longTaskMs')) || 0) }));
})();
