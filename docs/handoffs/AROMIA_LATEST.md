## 2026-11-18 — HITO 03: cotejo de fuentes y trazabilidad del piloto (Claude Code, Sonnet 5.5)

```text
DATE_UTC: 2026-11-18
ACTOR: Claude Code / Sonnet 5.5 (claude-sonnet-5-5)
BRANCH: claude/aromia-integration
BASE_SHA: a574a91
CURRENT_BLOCK: Gate 03 — trabajo seguro sobre el piloto, sin aprobar nada
COMPLETED_CHANGES:
  - docs/intelligence/EDITORIAL-PILOT-01-SOURCE-CHECK.md: lectura del texto abierto de Foods 2022 (navegador, sin eludir controles). Confirma cifras C03 (TDI 33,05/29,05/26,57; p<0,001) y C05 (p=0,12). Confirma que el diseño usó perfume estándar sobre delantal y que los autores declaran esa limitación; adaptación y enmascaramiento son dos explicaciones plausibles.
  - Trazabilidad línea a línea del borrador: 8 afirmaciones nuevas sin cobertura (C05b, C09–C15), p. ej. el mecanismo solo se apoya en Wikipedia, «veinte minutos» sin fuente, «la ciencia dice que la nariz es el instrumento menos confiable» sin ninguna fuente.
  - Borrador original (SHA bdf4abfe…) y evidence/backlog-pilot.json NO modificados (registro histórico).
LIMITES: Dalton 2000 (PubMed con control de cookies/bot, OUP) y Perfumer & Flavorist NO se pudieron leer; no se intentó eludir ningún control ni se amplió ninguna lista de dominios. C01, C02, C06 y el mecanismo siguen sin verificar.
TESTS_COMMANDS_AND_RESULTS: node --test scripts/intelligence-pilot-readiness.test.mjs 3/3 pass; verificador re-ejecutado: mismos bloqueos.
REQUIRES_PUBLISHER_APPROVAL: revisión humana independiente de hechos/fuentes (leer Dalton y P&F), decisión sobre cada afirmación nueva, derechos de las ilustraciones A/B, QA final, Historias→Saber.
RELEASE_STATUS: HOLD
PROGRESO_OFICIAL: 1/10; Gate 03 blocked (NO certificado).
```

---

## 2026-11-18 — Plan maestro: pasada por los hitos 03–10 (Claude Code, Sonnet 5.5)

```text
DATE_UTC: 2026-11-18
ACTOR: Claude Code / Sonnet 5.5 (claude-sonnet-5-5)
BRANCH: claude/aromia-integration
BASE_SHA: 9667c0c
CURRENT_BLOCK: recorrido en orden de los hitos 03–10, solo trabajo seguro y local (instrucción del Publisher)
COMPLETED_CHANGES:
  - 07: publicArticleHtml marca enlaces Amazon como "sponsored nofollow noopener noreferrer" (antes sobrescribía rel); 2 tests nuevos.
  - 09: adaptador OMNI desacoplado (omniAdapter.ts, contrato aromia-omni/1, desactivado por defecto) + 6 pruebas contra doble loopback.
  - 05/08: auditoría renderizada local (54+24+18 renders): 0 hallazgos reales; hueco PWA registrado (sin manifest/iconos/SW).
  - 03: verificador del piloto re-ejecutado: mismos bloqueos humanos; sin cambios.
  - projectProgress.ts: solo texto de evidencia/next (estados intactos); informe docs/intelligence/MASTER-PLAN-STATUS-2026-11-18.md.
FILES_CHANGED: apps/api/src/lib/articleContent{.ts,.test.ts}, apps/api/src/intelligence/omniAdapter{.ts,.test.ts}, apps/api/package.json, apps/web/src/lib/projectProgress.ts, docs/intelligence/MASTER-PLAN-STATUS-2026-11-18.md
TESTS_COMMANDS_AND_RESULTS (local, Node 20.20.2, postgres:16-alpine desechable):
  - test:intelligence 62/62, 0 skipped; test:content 5/5; tsc API limpio; projectProgress.test 3/3.
  - Mutaciones: redirect:'follow' y quitar el tope de coste hacen fallar el adaptador.
CI_RUNS_WITH_URLS_AND_CONCLUSIONS: PR #214 sobre 9667c0c: 16 pass / 0 fail / 0 pending / 7 skipping. HEAD de este bloque: pendiente de leer.
OPEN_BLOCKERS: ver tabla del informe; todos los hitos restantes dependen de decisiones/aprobaciones del Publisher (staging, revisión editorial y de derechos, iconos de marca, contrato OMNI real, merge/deploy).
NEXT_SAFE_ACTION: leer CI del nuevo HEAD. Sin más trabajo local seguro que no requiera esas decisiones.
REQUIRES_PUBLISHER_APPROVAL: sí, para cada hito restante (ver informe).
RELEASE_STATUS: HOLD
PROGRESO_OFICIAL: 1/10 (sin cambios).
```

---

## 2026-11-18 — HITO 02: ensayo local de scheduler, retención y rollback (Claude Code, Sonnet 5.5)

```text
DATE_UTC: 2026-11-18
ACTOR: Claude Code / Sonnet 5.5 (claude-sonnet-5-5)
BRANCH: claude/aromia-integration
BASE_SHA: 726328f
CURRENT_BLOCK: Gate 02 — trabajo local (instrucción del Publisher: "trabaja en local")
COMPLETED_CHANGES:
  - `intelligence prune-runs DIAS` + pruneRunLedger: retención del ledger que conserva último OK y racha de fallos.
  - gate02Rehearsal.test.ts: scheduler externo simulado (procesos separados), worker caído/lease, retraso con exit 2, flags, retención, rollback en cadena con respaldo y restauración.
FILES_CHANGED: apps/api/src/intelligence/{healthSource.ts,cli.ts,gate02Rehearsal.test.ts}, apps/api/package.json, docs/intelligence/GATE-02-CERTIFICATION.md
TESTS_COMMANDS_AND_RESULTS (local, Node 20.20.2, postgres:16-alpine desechable 127.0.0.1:55432):
  - test:intelligence 56/56 (0 skipped); tsc --noEmit y build exit 0; npm audit --omit=dev API 0.
  - Mutación: borrar filas posteriores al último OK hace fallar el test de retención.
CI_RUNS_WITH_URLS_AND_CONCLUSIONS: del SHA anterior 0dc9944: 15 pass / 0 fail / 1 pending / 7 skipping. El SHA de este bloque: pendiente de leer.
OPEN_BLOCKERS: staging aislado, scheduler/monitor reales y entrega de alertas, rollback sobre datos reales, aprobación Publisher. 500 de artículos en producción (migración 022) sin tocar.
NEXT_SAFE_ACTION: leer CI del nuevo HEAD. No queda trabajo local de Gate 02 que no dependa de autorización.
REQUIRES_PUBLISHER_APPROVAL: igual que el checkpoint anterior.
RELEASE_STATUS: HOLD
PROGRESO_OFICIAL: 1/10; Gate 02 in_progress (NO certificado).
```

---

## 2026-11-18 — HITO 02: observabilidad real aislada (Claude Code, Sonnet 5.5)

```text
DATE_UTC: 2026-11-18
ACTOR: Claude Code / Sonnet 5.5 (claude-sonnet-5-5)
BRANCH: claude/aromia-integration
BASE_SHA: ebb3b7a11f04f8322b2d3f24683686094dea8f9f (remoto) + merge local de b613356
HEAD_SHA (código): ver `git log`; este checkpoint va en el commit del bloque
CURRENT_BLOCK: Gate 02 — salud operativa con fuentes reales, recuperación y rechazo seguro
COMPLETED_CHANGES:
  - Merge (sin reescribir historia) de 12 commits remotos de ChatGPT en la rama local.
  - Migración opt-in 029 intelligence_runs (+ down/029, política de migraciones, filtro de paths del CI Intelligence).
  - healthSource.ts: snapshot read-only con reloj de BD -> evaluateIntelligenceHealth; leases caducados cuentan como pendientes.
  - CLI: work-batch registra ejecución (best-effort); comando `health INTERVALO_MIN` (sin default, exit 2 en critical).
FILES_CHANGED: apps/api/migrations/029_intelligence_runs.sql, migrations/down/029_intelligence_runs.sql, src/intelligence/{healthSource.ts,healthSource.test.ts,cli.ts}, src/db/{migrationPolicy.ts,migrationPolicy.test.ts}, apps/api/package.json, .github/workflows/intelligence-ci.yml, docs/intelligence/GATE-02-CERTIFICATION.md
TESTS_COMMANDS_AND_RESULTS (local, Windows, Node 20.20.2, postgres:16-alpine desechable en 127.0.0.1:55432):
  - Primera corrida SIN BD: 42 pass / 5 fail (los 5 PostgreSQL exigen INTELLIGENCE_TEST_DATABASE_URL; no era un bug).
  - Con BD desechable: test:intelligence 47/47 antes del bloque; 53/53 tras el bloque (0 skipped).
  - Mutación: quitar el reinicio de racha de fallos hace fallar healthSource #3 (el test detecta la regresión).
  - tsc --noEmit y build API exit 0; test:uploads 1/1, test:content 3/3, test:catalog-import 3/3; npm audit --omit=dev API: 0.
  - NO ejecutado en este bloque: apps/web (no se tocó), suites de navegador.
CI_RUNS_WITH_URLS_AND_CONCLUSIONS: PR #214 sobre 0dc9944 (leído con `gh pr checks`): 15 pass (incl. Intelligence persistence, API + isolated PostgreSQL, web test+lint+typecheck+build, browser session QA, runtime advisories web/api, code-and-governance), 0 fail, 1 pending (catalog expansion), 7 skipping (visuales; NO cuentan como aprobados).
SECURITY_AUDIT_COUNTS: API runtime 0 (npm audit --omit=dev, local). Web no reauditado en este bloque.
EDITORIAL_VISUAL_RIGHTS_STATUS: sin cambios; sin imágenes, fuentes ni contenido tocados.
OPEN_BLOCKERS: scheduler externo autorizado, entrega de alertas, retención del ledger, staging aislado (Railway solo tiene `production`), rollback de datos real, aprobación Publisher. Hallazgo previo sin resolver: 500 en artículo de producción (probable migración 022 sin aplicar; NO se aplicó).
NEXT_SAFE_ACTION: leer CI del HEAD; si pasa, definir con el Publisher cadencia/monitor/entorno para el ensayo de certificación.
REQUIRES_PUBLISHER_APPROVAL: staging/recursos, scheduler, alertas, cualquier migración fuera de BD desechable, merge de #214.
RELEASE_STATUS: HOLD
PROGRESO_OFICIAL: 1/10; Gate 02 in_progress (NO certificado).
```

---

## 2026-11-18 — HITO 02: instrumentación segura del batch (ChatGPT)

- **Objetivo ejecutado:** hacer visible la duración y resultados agregados de `work-batch`, sin exponer briefs, payloads, contenido de fuentes ni permitir publicación.
- **Rama/PR:** `claude/aromia-integration` / #214 DRAFT, RELEASE HOLD.
- **Commits de código:** `af63ee55f0640a883095b13ff263f74e1dbaad87` (`batch.ts`), `86ea4daede5c35dbae95832506a2b929aec77531` (`cli.ts`), `d03c412524577448ffef7c7669b699fb2f4eca1c` (`batch.test.ts`).
- **Cambios:** `runObservedBatch` envuelve la ejecución acotada existente y devuelve `attempted`, `processed`, `idle`, `durationMs`, `publication=blocked`, `providers=disabled`; el CLI `work-batch` lo utiliza. No instala scheduler, infraestructura, alertas ni proveedores externos.
- **Pruebas añadidas:** duración determinista e idle, tamaños inválidos no ejecutan trabajos, errores de DB se propagan. **No se han ejecutado tests locales** desde este conector GitHub. Al consultar `d03c412...`, aún no se listaban workflow runs; **CI pendiente**, no declarar PASS.
- **Última evidencia previa:** para commit `0557c7ff634857f2921fae03a41d1534ff584e2f`, Intelligence persistence, integrated QA, auditoría, navegador y otros workflows figuraban SUCCESS; Catalog Expansion Engine CI seguía `in_progress`, seis checks visuales SKIPPED. Ninguno valida aún este nuevo cambio.
- **Siguiente acción:** verificar CI del HEAD final (incluido este checkpoint), diagnosticar/regresar si falla. Preparar evaluación de errores/alertas y autenticación aislada; no certificar HITO 02 sin staging autorizado, scheduler real, rollback y permiso Publisher.
- **Progreso oficial:** 1/10; HITO 02 `in_progress`. Sin `main`, deploy, migraciones, gastos, imágenes o publicación.

---

## 2026-11-18 — Cambio ejecutado: coordinación integrada (ChatGPT)

- **Rama/PR:** `claude/aromia-integration` / #214 DRAFT, RELEASE HOLD.
- **Documentación nueva:** `docs/operations/AROMIA_INTEGRATED_EXECUTION_2026-11-18.md` (commit `1956ebc5d37f4f12313ed984f3b27d7245abbfb0`). `AGENTS.md` enlaza el contrato (commit `74b4d5423b38bb81234503c511c71dbbb68dd9fa`).
- **Decisión:** carriles Producto, Editorial/Intelligence y Visual coordinados por una rama; WIP limitado y cierres con código+pruebas+evidencia; no crear handoffs ni PRs por microtarea. Si Gate 02 queda bloqueado solo por permisos, continuar entregables aislados del piloto editorial sin declarar Gate 02 terminado.
- **Ejecución:** cambios solo documentales mediante GitHub; **no se corrieron suites ni se verificó CI del nuevo HEAD**. No se tocaron servicios, secretos, producción, migraciones o assets.
- **Progreso oficial:** 1/10 gates certificados, HITO 02 `in_progress`. Ninguna nueva certificación.
- **Siguiente acción ejecutable:** leer CI del HEAD nuevo; corregir errores reales y trabajar autorización 401/403 + scheduler/observabilidad aislados para Gate 02; si depende exclusivamente de staging autorizado, implementar piloto de lectura aislado sin publicación.

---

## 2026-11-18 — Bloque deuda técnica Next 16 / React 19 (Claude Code, Sonnet 5.5)

```text
DATE_UTC: 2026-11-18
ACTOR: Claude Code / Sonnet 5.5 (claude-sonnet-5-5)
BRANCH: claude/aromia-integration
BASE_SHA: bc11533f44c27320855d92813e1ddb2f4c68cf6b
HEAD_SHA (código): 5866395 (+ este checkpoint en el commit siguiente)
CURRENT_BLOCK: deuda técnica tras P0 — proxy.ts, lint API, React 19
COMPLETED_CHANGES:
  - middleware.ts -> proxy.ts (convención Next 16) + 5 pruebas de auth (sin cookie, cookie falsa, cookie válida, sin secreto, matcher).
  - apps/api: script "lint" roto (eslint no es dependencia; CI solo corre tsc) sustituido por "typecheck". Sin tocar nombres de jobs de CI.
  - React 18 -> 19 (react, react-dom, @types) en apps/web; único ajuste de tipos: RefObject<HTMLAnchorElement | null> en MagazineCoverStory.
  - Prueba jsdom que monta react-pageflip (PageFlipReader) bajo React 19 sin errores de consola.
TESTS_COMMANDS_AND_RESULTS (apps/web, Windows, Node 20):
  - tsc --noEmit: limpio · eslint: 0 errores / 15 warnings (preexistentes)
  - vitest: 134 passed, 2 failed (visualEvidence EPERM symlink en Windows; entorno, NO es "passed")
  - next build (Turbopack): OK, 42 páginas; "Proxy (Middleware)" reconocido
  - smoke next start: / /magazine /buscar /robots.txt /sitemap.xml 200; /admin y /admin/perfumes 307 -> /admin/login; /admin/login 200
  - npm audit --omit=dev (web): 0 vulnerabilidades
CI_RUNS_WITH_URLS_AND_CONCLUSIONS: PR #214 estaba en 15 pass / 1 pending (catalog) / 7 skipping antes de estos commits; CI de los commits nuevos pendiente de leer.
SECURITY_AUDIT_COUNTS: web 0 · api 0
EDITORIAL_VISUAL_RIGHTS_STATUS: sin cambios; nada publicado, sustituido ni aprobado.
OPEN_BLOCKERS:
  - HALLAZGO (producción, solo lectura): GET https://api-production-fe2f.up.railway.app/api/articulos/<slug> devuelve 500 para resena-tobacco-vanille, resena-santal-33 y resena-delina, mientras /api/articulos (listado) responde 200 con 15 artículos. Resultado: /magazine/<slug> muestra la página 404 en aromialab.com. Preexistente al cambio; causa PROBABLE, no confirmada en la BD: el código desplegado (1619c776) hace SELECT de `contenido_markdown` en el detalle (apps/api/src/routes/articles.ts:25) pero NO en el listado (:13); esa columna la crea la migración 022_add_articles_contenido_markdown.sql, que seguramente falta en la Postgres de producción (el listado sí funciona y usa `nivel`, migración 021). Remedio: aplicar SOLO la 022 con apps/api/scripts/apply-migration.js (skill aromia-migraciones; no `npm run migrate` completo) — es ADD COLUMN IF NOT EXISTS, aditiva e idempotente — y verificar con GET /api/articulos/resena-santal-33 => 200. Requiere autorización explícita del Publisher (escritura en producción); NO ejecutado.
  - Editor Tiptap (React) no validado en navegador real bajo React 19 (solo jsdom del core); requiere sesión admin.
  - 2 pruebas de symlink requieren Linux/CI o Windows con privilegios.
  - 15 warnings react-hooks/set-state-in-effect.
NEXT_SAFE_ACTION: leer CI de #214 sobre los commits nuevos y corregir; luego bloques P1 elegibles sin producción (fidelidad visual, piloto editorial en estado de preparación).
REQUIRES_PUBLISHER_APPROVAL: merge a main, deploy, migraciones/datos de producción (incl. el 500 de /api/articulos/:slug), activar jobs, gasto.
RELEASE_STATUS: HOLD
```

---

## CHECKPOINT DE ENTREGA A CLAUDE — 2026-11-18

**ESTADO GUARDADO EN GITHUB.** Contrato maestro `AROMIA_MASTER_HANDOFF.md` actualizado con puntero a **`docs/handoffs/CLAUDE_RESUME_2026-11-18.md`**, que contiene el handoff operativo completo. `AROMIA_CURRENT_STATE.md` y `AGENTS.md` apuntan a la misma prioridad de continuación.

- **Actor siguiente:** Claude Code / Sonnet Medium (preferencia reciente del Publisher).
- **Rama única:** `claude/aromia-integration`; **PR:** #214 abierta en borrador a `main`, RELEASE HOLD.
- **Último CI verificado ANTES de los commits de documentación:** SHA `bf51c5825b893e0ac4eabab3dfa8888b5f967d30`: 9 SUCCESS, 6 SKIPPED, 2 IN_PROGRESS (isolated real-browser QA / Catalog Expansion Engine), 0 FAILURE. **El SHA de HEAD es posterior**: no extrapolar checks a commits nuevos; volver a consultar GitHub.
- **Desarrollo:** Next.js 16.4.6, Tiptap 3.34.0, node-cron 4.6.0; Intelligence con workers, almacenamiento PostgreSQL, idempotencia, retry, fencing y batch finito/opt-in. Piloto editorial 01 con matriz factual y propuesta de edición sin aprobación ni publicación.
- **Hito único activo:** 02 — Intelligence runtime. **Sin certificación oficial** por falta de scheduler y runtime aislado autorizado/observabilidad. Barra **1/10 (10%)**, no incrementarla por CI.
- **Railway inspeccionado read-only:** `aromia-lab-v2` solo muestra `production`; web/API en commit viejo `1619c776560f5d6f9c5948f8092ff5241540048f`. Sin escritura/despliegue/migración/gasto.
- **Reglas:** no merge a `main`, deploy, producción, publicación, licencias o recursos pagos sin nueva autorización explícita. Sin `--force`, sin silenciar gates.
- **Próxima acción:** Claude verifica HEAD/CI y arregla fallos, consolida aceptación técnica aislada contra `docs/intelligence/GATE-02-CERTIFICATION.md`; solicita únicamente la autorización imprescindible para un staging real. Mantener RELEASE HOLD.

---

## 2026-11-18 — Hito 02 · cierre de batería CI y hardening (sin certificación runtime)

**Última batería CI confirmada:** PR #214 en SHA `2ad835d30f8b34f98c97fc83ff208d958645ef49`: 11 SUCCESS / 6 SKIPPED / 0 FAILURE. Pruebas reales PostgreSQL/CLI cross-process, seguridad, navegador y Strict Audit incluidas.

**Hardening posterior (CI NUEVO PENDIENTE):**
1. `apps/api/src/intelligence/worker.ts`: si `finish()` rechaza token/lease vencido, lanzar `job_lease_lost` en vez de contar como procesado.
2. `apps/api/src/intelligence/worker.test.ts`: 2 regresiones para respuesta `finish=false`, tanto éxito como error de validación.
3. `apps/api/src/intelligence/cli.ts`: el comando legado `work` también respeta aprobación explícita en `NODE_ENV=production`, sin romper invocación local.
4. `apps/api/src/intelligence/integration.test.ts`: denegar `work-batch` cuando `NODE_ENV=production` y no hay bandera productiva aprobada.
5. `docs/intelligence/GATE-02-CERTIFICATION.md`: hoja de evidencia actualizada.

**Runtime operativo:** Railway `aromia-lab-v2` solo tiene environment production; no se tocó. No se activó scheduler ni se añadieron gastos. **Hito 02 sigue `in_progress`; barra formal 1/10 (10%).** Cuando cierren los checks nuevos, distinguir aceptación técnica aislada de certificación operacional que exige staging/deploy autorizado y observabilidad.

**NEXT (sin cambiar de hito):** leer CI del último SHA, corregir errores sin relajar controles, consolidar informe de aceptación aislada, conservar en HOLD la PR #214 hasta autorización independiente.

---

## 2026-11-18 — HITO 02 · campaña de certificación (NO CERRADO)

**ACTOR:** ChatGPT, GitHub + Railway **read-only**, sin ejecución en la máquina del Publisher.  
**PR / BRANCH:** #214 DRAFT / `claude/aromia-integration`. **RELEASE HOLD**.  
**CRITERIO NUEVO:** no cambiar de hito hasta agotar las verificaciones elegibles de su gate; no marcar VERIFIED por código o tests aislados.

**Último SHA integral certificado de la tanda anterior:** `8a66852ecf4f0f6450cc9b8e2883678e93c8ed90`: 11 SUCCESS, 6 SKIPPED, 0 FAILURE, incluyendo Chromium real aislado, API+PostgreSQL y preflight editorial. **No extrapolar resultados a HEAD posterior.**

**CAMBIOS PERSISTIDOS:**
- `apps/api/src/intelligence/batch.ts`, `batch.test.ts`: lote finito 1–25, sin daemon, parada idle, aborta ante errores, resultado con publicación bloqueada/proveedores inactivos.
- `cli.ts`: comando `work-batch N` para invocador externo **solo con** `INTELLIGENCE_ENABLED=true` y `INTELLIGENCE_WORKER_ENABLED=true`; tests de ambos flags, tamaño máximo y fault propagation.
- `apps/api/src/intelligence/integration.test.ts`: pruebas con PostgreSQL desechable: lote 2+1 jobs tras reconexión de pool y prueba **cross-process** del CLI en procesos Node distintos; no automatic publish, `providerCostMicros=0`, review pendiente.
- `apps/api/package.json`: la suite CI `test:intelligence` incorpora batch tests.
- `docs/intelligence/GATE-02-CERTIFICATION.md`: diez requisitos, criterios de aceptación, autorización y rollback; **NO CERTIFICADO**.
- `apps/web/src/lib/projectProgress.ts`: snapshot y evidencia de PR #214 actualizados, **gate 02 permanece `in_progress`**.

**Infraestructura real inspeccionada SIN cambios:** Railway proyecto `aromia-lab-v2`, único entorno visible `production`, servicios web/api/Redis/Postgres. Deploys web y api desde `main` commit `1619c776560f5d6f9c5948f8092ff5241540048f`, estado SUCCESS, creados 2026-11-17 02:58 UTC. **No se observa staging aislado** ni código #214 desplegado. No se inspeccionaron secretos ni se alteró Railway.

**ESTADO DE TESTS NUEVOS:** la prueba cross-process y sus compañeros están en CI reciente **pendiente**; ninguna aprobación antes de la conclusión del SHA exacto. Verificar workflow `Intelligence persistence` y `Aromia integrated Intelligence QA`, inspeccionar logs de errores si los hubiera.

**BLOCKER DE CERTIFICACIÓN OFICIAL:** runtime operativo en entorno autorizado, scheduler externo real, recuperación/observabilidad/alertas y autorización explícita para habilitar entorno/servicios y migraciones. No utilizar producción ni desplegar para alcanzar una cifra de progreso.

**NEXT:** confirmar y reparar CI, consolidar evidencia de aceptación aislada, obtener autorización de entorno de staging antes de probar operación persistente. No dar hito 02 como terminado. **BARRA OFICIAL: 1/10 (10%).**

---

## 2026-11-18 — Cambio de criterio: de hito certificado a hito certificado

**Instrucción del Publisher:** trabajar por hitos completos, no microbloques. Un hito solo puede marcarse `verified` cuando cumple TODOS sus criterios con evidencia. Los blockers que requieren producción, presupuesto, licencias o aprobación humana **no pueden darse por resueltos por inferencia**.

**Hito objetivo:** 02 (`intelligence-runtime`). **Estado: EN PROGRESO, SIN CERTIFICAR.** Barra oficial 1/10 (10%). Último baseline totalmente verde antes de esta tanda: SHA `8a66852ecf4f0f6450cc9b8e2883678e93c8ed90`, 11 SUCCESS, 6 SKIPPED, 0 FAILED en PR #214.

**Entregas de esta tanda:** `apps/api/src/intelligence/batch.ts` y `batch.test.ts` con operación finita y límite de 25 jobs, parada al primer idle, control de fallos y publicación/proveedores bloqueados; doble opt-in `INTELLIGENCE_ENABLED=true` y `INTELLIGENCE_WORKER_ENABLED=true`; `cli.ts` añade `work-batch N` para disparador EXTERNO autorizado; suite CI `test:intelligence` incluye tests. `integration.test.ts` simula dos invocaciones con reconexión PostgreSQL desechable, procesando 2+1 jobs sin saltarse el review gate. `docs/intelligence/GATE-02-CERTIFICATION.md` contiene los criterios de cierre, evidencia y riesgos; `apps/web/src/lib/projectProgress.ts` actualiza el snapshot sin elevar el gate.

**Checks de estos últimos commits:** corriendo/encolados; **NO declarar aprobados hasta revisar HEAD exacto**. Si falla, leer logs y corregir antes de evaluar cierre. Si pasan, el CI solo certifica el **subconjunto de desarrollo/aislado**, no la operación continua de un runtime autorizado ni el hito 02 oficial.

**Bloqueadores reales de certificación:** despliegue o staging autorizado con scheduler independiente, permisos y secretos supervisados, métricas/alertas observables, simulación de reinicio/rollback del entorno, aprobación explícita. No tocar Railway, datos ni `main` por este handoff.

**NEXT:** verificar el CI de HEAD, corregir fallos, completar evidencias reproducibles de operación aislada; solicitar la autorización pertinente únicamente cuando el gate dependa de ella. Mientras tanto, siguiente hito no se marca como cerrado. **PR #214: DRAFT / RELEASE HOLD.**

---

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
