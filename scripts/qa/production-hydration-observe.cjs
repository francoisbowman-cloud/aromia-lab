// Read-only observation of the ALREADY PUBLISHED Aromia website.
// It does NOT deploy, submit forms, log in or perform mutations.
// Unlike hydration-diagnostic.cjs, this probe is deliberately fixed to one public origin.
const { createRequire } = require('node:module');
const { join } = require('node:path');
const { isHydrationMessage, redactDiagnostic } = require('./hydration-diagnostic-lib.cjs');
const ORIGIN = 'https://www.aromialab.com';
const ROUTES = ['/', '/academia', '/catalogo/santal-33', '/magazine/guia-perfumes-invierno'];
async function main() {
  const pkg = process.env.PLAYWRIGHT_PACKAGE_PATH;
  if (!pkg) throw new Error('PLAYWRIGHT_PACKAGE_PATH missing');
  const { chromium } = createRequire(join(pkg, 'package.json'))('playwright');
  const browser = await chromium.launch({headless:true});
  const results = [];
  try {
    for (const route of ROUTES) {
      for (const theme of ['light','dark']) {
        const context = await browser.newContext({serviceWorkers:'block',viewport:{width:1280,height:800}});
        try {
          await context.addInitScript(value => {try{localStorage.setItem('aromia_theme',value)}catch{}},theme);
          const page = await context.newPage();
          const hydration = [];
          const collect = (type, message) => {
            if (isHydrationMessage(message)) hydration.push({type, diagnostic:redactDiagnostic(message)});
          };
          page.on('console', msg => {if(['warning','error'].includes(msg.type())) collect('console',msg.text());});
          page.on('pageerror',error => collect('pageerror',error.stack || error.message));
          let status = null, error = null, finalOrigin = null;
          try {
            const response = await page.goto(new URL(route,ORIGIN).toString(),{waitUntil:'domcontentloaded',timeout:30000});
            status = response?.status() ?? null;
            finalOrigin = new URL(page.url()).origin;
            if (finalOrigin !== ORIGIN) throw new Error('unexpected_redirect_outside_origin');
            await page.waitForTimeout(2000);
          } catch (e) { error = redactDiagnostic(e.message); }
          results.push({route,theme,status,finalOrigin,hydration,error});
        } finally {await context.close();}
      }
    }
  } finally {await browser.close();}
  console.log(JSON.stringify({kind:'aromia_public_readonly_hydration_observation',origin:ORIGIN,results},null,2));
  if (results.some(x=>x.hydration.length||x.error||x.status!==200)) process.exitCode = 1;
}
main().catch(e=>{console.error(redactDiagnostic(e.message));process.exitCode=2});
