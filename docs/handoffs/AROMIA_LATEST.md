# AROMIA_LATEST — checkpoint de integración

```text
DATE_UTC: 2026-11-18
ACTOR: Claude Code / Sonnet 5.5 (claude-sonnet-5-5), esfuerzo Medium por instrucción del Publisher (el handoff sugería Opus/High; no se cambió de modelo)
BRANCH: claude/aromia-integration
BASE_SHA: b30cd3da7814441f1a0ea0d404da37fb10c44311
HEAD_SHA: a20da1def2357aeae4c6a2e461790b30afa8bb1c (+ este checkpoint en el commit siguiente)
CURRENT_BLOCK: P0 — Tiptap + migración Next.js 14 -> 16 (apps/web)
COMPLETED_CHANGES:
  - Familia Tiptap fijada exacta en 3.34.0 (core, pm, react, starter-kit, extension-image); corrige GHSA-cp6q-959q-f8rh y GHSA-j95f-988m-3j2f.
  - 5 pruebas de ida y vuelta del editor (HTML legado, idempotencia, figura con caption, <img> suelto, __proto__) con jsdom (devDependency).
  - Next.js 14.2.35 -> 16.4.6; eslint 9 + flat config; params/searchParams/cookies async; useParams() en página cliente admin;
    turbopack.root fijado; plugin tailwind sin ruta explícita (la ruta explícita rompe Turbopack: "reading 'blocklist'").
  - Assert de notFound actualizado a NEXT_HTTP_ERROR_FALLBACK;404.
FILES_CHANGED: apps/web/package.json, package-lock.json, next.config.mjs, postcss.config.mjs, tailwind.config.ts, tsconfig.json (Next lo reescribe),
  eslint.config.mjs (nuevo), .eslintrc.json (borrado), ~20 páginas/rutas bajo src/app, 4 tests.
TESTS_COMMANDS_AND_RESULTS (apps/web, Node 20.20.2, Windows):
  - npx tsc --noEmit: limpio
  - npm run lint (eslint .): 0 errores, 15 warnings (react-hooks/set-state-in-effect degradada a warn, preexistente)
  - npm test (vitest): 128 passed, 2 failed — visualEvidence.test.ts, EPERM al crear symlink en Windows (fallo de entorno, preexistente en el commit base; NO es "passed")
  - npm run build (Turbopack): OK, 42 páginas estáticas
  - Smoke con next start local: / /magazine /buscar /robots.txt /sitemap.xml 200; /admin 307 -> /admin/login; /api/admin/dashboard 401;
    /catalogo 308 -> /magazine; /magazine/<slug> e /imprimir 200; CSS Tailwind emitido (102 KB). Slug inexistente da 200 por loading.tsx (streaming), no verificado contra baseline.
CI_RUNS_WITH_URLS_AND_CONCLUSIONS: ninguna todavía (rama sin pushear a origin)
SECURITY_AUDIT_COUNTS (npm audit --omit=dev):
  - web: 0 (antes 1 crítica, 2 altas, 26 moderadas)
  - api: 0 críticas, 0 altas, 2 moderadas (uuid <11.1.1 vía node-cron) — sin tocar
EDITORIAL_VISUAL_RIGHTS_STATUS: sin cambios; nada publicado, sustituido ni aprobado.
OPEN_BLOCKERS:
  - React 18 deprecado en Next 16 (se retira en 17): planificar React 19.
  - middleware.ts deprecado a favor de proxy.ts (funciona; migrar con prueba de auth).
  - Validar el editor Tiptap en navegador real (solo hay pruebas jsdom) y staging.
  - 2 tests de symlink requieren Windows con privilegios o CI Linux.
NEXT_SAFE_ACTION: push de claude/aromia-integration (autorizado como rama; requiere OK del hook) para correr CI; luego P1 (node-cron/uuid, scheduler Intelligence).
REQUIRES_PUBLISHER_APPROVAL: merge a main, deploy, migraciones de producción.
RELEASE_STATUS: HOLD
```
