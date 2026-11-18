## ChatGPT — bloque largo · piloto editorial verificable (2026-11-18)

**ACTOR:** ChatGPT, connector GitHub; ningún entorno local o producción.  
**BRANCH/PR:** `claude/aromia-integration` / #214 DRAFT · RELEASE HOLD.  
**Baseline CI confirmado:** `2ca9c8512bb00f54b8f5b41b5ca9ae1c75b03a5d`: 10 workflows SUCCESS, 6 SKIPPED, 0 FAILURE, incluida la prueba de leases agotados en PostgreSQL y Chromium aislado.  
**Piloto:** solo `drafts/cuando-ya-no-hueles-tu-perfume.md` (ítem 61). No duplicar ni publicar.

**Nuevas entregas:**
- `scripts/intelligence-pilot-readiness.mjs`: evaluación determinista read-only, fuente 5 / capturas 3 / extractos coincidentes 1 / recuperación fallida 2, sin permitir fact-check, derechos, publicación ni cierre de hito por autodeclaraciones.
- `scripts/intelligence-pilot-readiness.test.mjs`: tres pruebas de seguridad del expediente, incluidos todos los bloqueos incluso si se declara artificialmente «todo capturado».
- `.github/workflows/aromia-integrated-qa.yml`: ejecuta pruebas y reporta evidencias en logs, además de los tests de Intelligence, web y contratos de imagen.
- `package.json`: `editorial:pilot:test` y `editorial:pilot:report`.
- `docs/intelligence/EDITORIAL-PILOT-01.md`: cápsulas A/B para ritmo de lectura, sin imágenes generadas o aprobadas.
- `docs/intelligence/EDITORIAL-PILOT-01-CLAIMS.md`: revisión preliminar de 8 afirmaciones contrastadas con Dalton 2000, Foods 2022 y fragmento visible de Perfumer & Flavorist. Hallazgo importante: estudio de 19 participantes aplicó perfume **estandarizado sobre delantales**, no la fragancia personal en la piel; adaptación o enmascaramiento son explicaciones alternativas.
- `docs/intelligence/EDITORIAL-PILOT-01-EDIT-PROPOSAL.md`: redacción alternativa con matices, sin alterar el borrador histórico.
**Pruebas verificadas de nuevo trabajo:** `Aromia integrated Intelligence QA` run `44341165119` SUCCESS en SHA `a996cf7b9f1fef8c69fd3fdca19474cdb36274b9`, incluidos `node --test scripts/intelligence-pilot-readiness.test.mjs`, reporte JSON, API/Postgres y web. Esto no certifica los commits documentales posteriores o el HEAD actual: consultar CI fresco. La nueva matriz de claims es un precheck editorial, **NO revisión humana**.

**Bloqueo de hito:** 03 requiere fuentes independientes verificadas y revisión factual, edición, arte/licencias/QA y aprobación humana; 04 exige fidelidad de producto y derechos; 02 requiere runtime production aprobado. 1/10 hitos certificados; ningún hito se añade por este bloque.

**NEXT:** revisar CI del último SHA; corregir errores si existen. Elegir y comprobar dos recursos visuales existentes permitidos para A/B o preparar assets únicamente con autorización, integrar una composición de lectura aislada, recabar revisión editorial humana. No fusionar `main`, no desplegar, no gastos, no aprobar imágenes ni publicación.

---

## 2026-11-18 — P1 Intelligence: lease exhaustion regression

**Previous certified baseline:** PR #214 at `d17837414dd9e3221859f01d50314045e530ca45`, 10 GitHub workflows SUCCESS, 6 SKIPPED, 0 FAILURE, including isolated Chromium browser QA, dependency release audit, strict audit, API/Intelligence integration and PostgreSQL persistence.

**New change:** `apps/api/src/intelligence/integration.test.ts`, commit `92a5d38ecabedf604c3497b2188c556d76c72f42`. Extends existing integration test in a **disposable local PostgreSQL schema**: simulate three successive lease expirations; verify stale fencing tokens are rejected, exhausted jobs become `failed` after `max_attempts=3`, cannot be automatically claimed again, and can be explicitly manually retried with attempts reset. No production database/migrations/writes.

**Verification status:** code committed to `claude/aromia-integration`; NEW CI is required before marking this change tested or certified. Previous green SHA does NOT cover this commit. Follow up on `Intelligence persistence`, `Aromia integrated Intelligence QA`, API TypeScript build and strict audit; correct actual failing logs if any. Continue only with safe local/editorial work. PR #214 remains DRAFT/RELEASE HOLD; no merge to main or deploy.

---

## ChatGPT — Intelligence worker fault isolation · 2026-11-18

- **PR / branch:** #214 draft, `claude/aromia-integration`; RELEASE HOLD. No main merge or deployment.
- **Last verified CI SHA:** `b1c47f90ab004fd1cf8e7876466123a287a34a9d`. **10 SUCCESS / 6 SKIPPED / 0 FAILURE** workflows; includes isolated browser QA, v2.0, Strict Audit, security audit, Intelligence persistence and integrated Intelligence QA. These results **do not certify newer commits**.
- **Implementation:** `apps/api/src/intelligence/worker.ts` now catches **only** `validateBrief/prepare` failures as `preparation_failed`. Exceptions from `store.finish` propagate without an incorrect second finish call or false diagnosis of a malformed brief.
- **Added 3 targeted regression tests:** (1) job ID forwarded to `claim`; (2) DB failure on `finish` is propagated, with exactly one finish call and no false preparation error; (3) claim errors propagate without attempting `finish`. Existing 3 tests retained.
- **Code commit SHAs:** `4559a80566d05561f6de0aebdb64521a4fbe0235` (worker), `75eb97bd863ce5ff419a6da86c0d2550a17de7a6` (tests).
- **Validation status:** changes committed directly to integration branch, **new CI pending**; no local API/container execution from ChatGPT.
- **NEXT ACTION:** read CI for final HEAD; fix any concrete regression; evaluate lease expiry/retry integration test against disposable PostgreSQL, then editorial pilot without publication.

---

## ChatGPT verification and hotfix — 2026-11-18

- **ACTOR:** ChatGPT (GitHub connector; no local repository execution)
- **BRANCH:** `claude/aromia-integration`
- **PR:** #214 (draft, `main` base, RELEASE HOLD)
- **PROBLEM CONFIRMED:** CI at `8ca4c7d7d19d948a9c203500da9280e7ccd11d74` failed API TypeScript build in workflows Catalog Import Contract, Strict Audit, and Intelligence persistence. Logs identify `src/intelligence/worker.test.ts(41,25): TS2339 Property 'job' does not exist on type Array`.
- **HOTFIX:** corrected assertion to `finished[0].job.token` with `finished.length === 1`; committed as `2cbdf4f9e8a5edb3edd3b4d32527d7da21592d5d`. Tests cover idle queue, no automatic publication/approval/spend and invalid brief rejection. **No claim these tests have passed CI yet.**
- **SECURITY:** prior audit run passed; not sufficient for production certification.
- **NEXT:** monitor CI on new commit, read failed logs if any, and advance isolated PostgreSQL integration tests for claiming, concurrency, leases/retries and publisher permissions. The isolated browser QA workflow was still running in the prior attempt during inspection, not yet verified successful.
- **RELEASE_STATUS:** HOLD. No merge to main, deployment, production access, paid resources, image substitution or content approval.

---

# AROMIA_LATEST — checkpoint de integración

```text
DATE_UTC: 2026-11-18
ACTOR: Claude Code / Sonnet 5.5 (claude-sonnet-5-5), esfuerzo Medium por instrucción del Publisher (el handoff sugería Opus/High; no se cambió de modelo)
BRANCH: claude/aromia-integration
BASE_SHA: b30cd3da7814441f1a0ea0d404da37fb10c44311
HEAD_SHA (código): a20da1def2357aeae4c6a2e461790b30afa8bb1c (+ este checkpoint en el commit siguiente)
CURRENT_BLOCK: P0 Tiptap + Next 16 (apps/web) — cerrado local; P1 node-cron 4.6.0 (apps/api) — hecho
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
CI_RUNS_WITH_URLS_AND_CONCLUSIONS: rama pusheada; draft PR https://github.com/francoisbowman-cloud/aromia-lab/pull/214 (Auto-fix activo); al corte 6 pass / 9 pending / 0 fail; un fallo previo (smoke login, selector role=alert) corregido en 35c26d0
SECURITY_AUDIT_COUNTS (npm audit --omit=dev):
  - web: 0 (antes 1 crítica, 2 altas, 26 moderadas)
  - api: 0 vulnerabilidades tras node-cron 3.0.3 -> 4.6.0 (elimina uuid transitivo; sin @types/node-cron; único uso: cron.schedule en src/scraper/runner.ts)
EDITORIAL_VISUAL_RIGHTS_STATUS: sin cambios; nada publicado, sustituido ni aprobado.
OPEN_BLOCKERS:
  - React 18 deprecado en Next 16 (se retira en 17): planificar React 19.
  - middleware.ts deprecado a favor de proxy.ts (funciona; migrar con prueba de auth).
  - Validar el editor Tiptap en navegador real (solo hay pruebas jsdom) y staging.
  - API: tsc build OK; test:uploads 1/1, test:content 3/3; test:intelligence 18/18 con Postgres 16 desechable local (docker, 127.0.0.1:5544, aromia_test, ya detenido); sin INTELLIGENCE_TEST_DATABASE_URL fallan 3 (requieren BD). Script lint de api roto: eslint no es dependencia (preexistente).
  - 2 tests de symlink requieren Windows con privilegios o CI Linux.
NEXT_SAFE_ACTION: leer resultados de CI del PR #214; luego P1 scheduler/colas Intelligence (costes, permisos), piloto editorial.
REQUIRES_PUBLISHER_APPROVAL: merge a main, deploy, migraciones de producción.
RELEASE_STATUS: HOLD
```

Resumen para continuar en ChatGPT: docs/handoffs/CHATGPT_CONTINUATION.md
