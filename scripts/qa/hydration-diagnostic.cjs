// Read-only hydration diagnostic against a LOCAL Next development server.
// Usage: PLAYWRIGHT_PACKAGE_PATH=/path/to/playwright node scripts/qa/hydration-diagnostic.cjs http://127.0.0.1:3000 /,/academia,/catalogo/santal-33,/magazine/guia-perfumes-invierno
// Use next dev (not next start) to expose full React hydration diagnostics.
// No screenshots, credentials, network writes, or production connections.
const { createRequire } = require('node:module');
const { join } = require('node:path');
const { isHydrationMessage, redactDiagnostic } = require('./hydration-diagnostic-lib.cjs');

async function run() {
  const [base, routeList = '/,/academia,/catalogo/santal-33,/magazine/guia-perfumes-invierno'] = process.argv.slice(2);
  if (!base) throw new Error('Usage: hydration-diagnostic.cjs <local-base-url> [comma-separated-routes]');
  const url = new URL(base);
  if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) || !['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Only a loopback Next development server is allowed');
  }
  const routes = routeList.split(',').filter(Boolean);
  if (!routes.length || routes.some(route => !route.startsWith('/') || route.startsWith('//') || route.includes('?') || route.includes('#'))) {
    throw new Error('Use relative URL paths without query strings');
  }
  const pkg = process.env.PLAYWRIGHT_PACKAGE_PATH;
  if (!pkg) throw new Error('Set PLAYWRIGHT_PACKAGE_PATH to your local playwright package directory');
  const requireFromPackage = createRequire(join(pkg, 'package.json'));
  const { chromium } = requireFromPackage('playwright');
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const route of routes) for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: {width: 1280, height: 800}, serviceWorkers: 'block' });
      try {
        await context.addInitScript(value => {
          try { localStorage.setItem('aromia_theme', value); } catch { /* storage disabled */ }
        }, theme);
        const page = await context.newPage();
        const messages = [];
        const collect = (kind, input) => {
          const raw = String(input);
          if (isHydrationMessage(raw)) messages.push({kind, text: redactDiagnostic(raw)});
        };
        page.on('console', entry => {
          if (entry.type() === 'error' || entry.type() === 'warning') collect('console', entry.text());
        });
        page.on('pageerror', error => collect('pageerror', error.stack || error.message));
        let httpStatus = null;
        let navigationError = null;
        try {
          const response = await page.goto(new URL(route, url).toString(), {waitUntil: 'domcontentloaded', timeout: 30000});
          httpStatus = response?.status() ?? null;
          await page.waitForTimeout(2000); // allow deferred client hydration in dev
        } catch (error) {
          navigationError = redactDiagnostic(error.message);
        }
        results.push({route, theme, httpStatus, hydrationErrors: messages, navigationError});
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
  console.log(JSON.stringify({kind:'aromia_hydration_diagnostic', mode:'local-dev', results}, null, 2));
  if (results.some(r => r.hydrationErrors.length || r.navigationError || r.httpStatus === null || r.httpStatus >= 500)) {
    process.exitCode = 1;
  }
}
run().catch(error => { console.error(redactDiagnostic(error.message)); process.exitCode = 2; });
