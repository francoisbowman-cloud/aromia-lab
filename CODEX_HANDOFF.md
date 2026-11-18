# AROMIA — HANDOFF OPERATIVO PARA CODEX

**Corte de evidencia:** 17 de noviembre de 2026 (República Dominicana; las ejecuciones Actions figuran el 18-11 UTC).  
**Proyecto:** revista editorial de perfumería Aromia.  
**Repositorio:** `francoisbowman-cloud/aromia-lab`.  
**Actor siguiente:** **Codex / Code**.  
**Instrucción:** ejecutar autónomamente los bloques elegibles, corregir fallos, mantener checklists y entregar código probado y PRs, **sin publicar**. No es una solicitud para volver a conceptualizar el producto.

## 0. DÓNDE EMPEZAR — VERIFICAR EN VIVO

Esta es una fotografía documentada, **no telemetría en tiempo real**. Verificar siempre que la información sigue vigente antes de tocar código.

- **Base integral:** [PR #206](https://github.com/francoisbowman-cloud/aromia-lab/pull/206), rama `integration/aromia-intelligence-release-candidate-20261117`, HEAD inspeccionado `ee66f063c5f1332507b45731929729a2959b961a`, **OPEN / DRAFT / UNMERGED**, destino `main`. Incluye la cadena funcional histórica de borradores #187–#204.
- **Parches de seguridad:** [PR #208](https://github.com/francoisbowman-cloud/aromia-lab/pull/208), rama `security/aromia-runtime-safe-patches-20261117`, HEAD inspeccionado `fb85bc09d2df47ecd5b0ffc1d85bab2aaa1ac846`, **OPEN / DRAFT / UNMERGED**, destino #206. Convergencia sobre base nueva **no** validada todavía: re-comparar antes de integrar.
- **Este traspaso:** rama `handoff/aromia-codex-continuation-20261117`, creada desde HEAD de #208; contiene `AGENTS.md`, este handoff y actualización del relay. Es una **base de continuación**; desde ella crear ramas por tarea, sin confundirla con `main`.
- **Seguridad:** [issue #207](https://github.com/francoisbowman-cloud/aromia-lab/issues/207), bloqueador de release abierto. La actualización de Node/Next/Tiptap **no está completada**.
- **`main`:** PR #186 se confirmó fusionada; NO presumir que #206/#208 se fusionaron. GitHub comparó la rama de #208 con `main`: 147 commits ahead, 0 behind, 125 archivos cambiados **antes de este handoff**. Revalidar si cambió el repositorio.
- `AROMIA_CURRENT_STATE.md` mantiene secciones extensas históricas, incluyendo una cabecera que todavía decía `feat/intelligence-foundation`; la nueva cabecera Codex es la prioridad de continuación. No reinterpretar bloques antiguos como estados de hoy.

### Comandos iniciales sugeridos (sin tocar producción)

```bash
git fetch origin
git status --short --branch
git switch -c codex/aromia-security-next origin/handoff/aromia-codex-continuation-20261117
git log -1 --format='%h %s'
git diff --stat origin/main...HEAD
```

Si la rama ya existe o el directorio está sucio, **detener la operación destructiva** y reconciliar sin perder archivos. Si la integración cambia, recuperar el estado real de #206 y #208 antes de rebase/cherry-pick. No hacer `git reset --hard` sobre trabajo ajeno.

## 1. EVIDENCIA VERIFICADA EN GITHUB

| Evidencia | Resultado al corte | Qué demuestra / qué NO |
|---|---|---|
| PR #206, workflow `Aromia integrated Intelligence QA`, [run 44230842902](https://github.com/francoisbowman-cloud/aromia-lab/actions/runs/44230842902) | **SUCCESS** | API + PostgreSQL aislado, web, contratos de imágenes en HEAD de #206; no producción |
| PR #206, `Aromia isolated real-browser QA`, [run 44230842785](https://github.com/francoisbowman-cloud/aromia-lab/actions/runs/44230842785) | **SUCCESS** | Chromium con login/cookie Secure, observaciones, rechazo por identidad errónea, hashes locales, simulación sin aplicar; **API fixture**, no catálogo real |
| PR #206, `v2.0 CI` y `Aromia Strict Audit` | **SUCCESS** | CI del HEAD #206; no permisos de publicar |
| PR #208, `Aromia integrated Intelligence QA`, [run 44233483453](https://github.com/francoisbowman-cloud/aromia-lab/actions/runs/44233483453) | **SUCCESS** | API + PostgreSQL, web, tests e imagen en HEAD #208 |
| PR #208, `Aromia dependency patch verification (read only)`, [run 44233483594](https://github.com/francoisbowman-cloud/aromia-lab/actions/runs/44233483594) | **SUCCESS** | API y web tests/lint/types/build con **Node.js 22**, sin escribir dependencias |
| PR #208, `Intelligence persistence` | **SUCCESS** | Pruebas de persistencia de esta rama |
| PR #208, `Aromia dependency release audit`, [run 44233483417](https://github.com/francoisbowman-cloud/aromia-lab/actions/runs/44233483417) | **FAILURE intencionado** | Falta corregir vulnerabilidades de la web. **NO** declarar release-ready |

### Vulnerabilidades runtime: medición concreta de npm (`--omit=dev`)

| Workspace | Críticas | Altas | Moderadas | Resultado |
|---|---:|---:|---:|---|
| `apps/api` | **0** | **0** | **2** | Gate de altas/críticas verde; moderadas node-cron 3.x + uuid transitiva, todavía por evaluar |
| `apps/web` | **1** | **2** | **26** | **Bloqueo de lanzamiento vigente** |

- Web crítica: **`next`** actualmente **14.2.35**; el informe npm de ese corte sugería `next@16.4.6` como corrección, **no** implica que sea compatible ni obligatoriamente la versión indicada hoy: consultar el registro/advisories frescos.
- Web altas: **`@tiptap/core`** 3.28.0 y **`postcss`** anidado dentro de `next` 14.x. Hay más dependencias Tiptap con avisos moderados.
- Sharp actualizado a **0.35.5**.
- API corregida, comprobada en lockfile: `express 4.22.3`, `proxy-addr 2.0.8`, `body-parser 1.20.9`, `js-yaml 3.15.2`, `qs 6.16.2`, `multer 2.5.0`. No sustituir Express 4 por 5 sin un plan.
- Los primeros intentos de actualizar Tiptap en bloque produjeron `ERESOLVE` por peers `@tiptap/core`, `@tiptap/pm`, `starter-kit` y extensiones internas; NO resolver con `--force`/`--legacy-peer-deps`. Verificar grafo y diseñar actualización cohesiva.
- El workflow previo que modificaba lockfiles automáticamente fue **reemplazado** en #208 por `.github/workflows/aromia-safe-patch-proposal.yml` **solo lectura**, `contents: read`, Node.js 22.
- El informe de npm es evidencia de **advisories**, no una explotación demostrada. Mantener release bloqueado hasta triage/resolución de riesgos y revisión.

## 2. LO QUE EXISTE (IMPLEMENTADO, NO NECESARIAMENTE INTEGRADO)

1. Aromia Intelligence: jobs durables, estados/versiones, preparación de fuentes, review, API/admin/CLI, migraciones opt-in 024–028; operaciones persistentes probadas en PostgreSQL **aislado**. No hay runtime real plenamente demostrado.
2. Artículos/editorial: workflow/Voice Bible, backlog y piezas previas, piloto en preparación. No afirmar que el backlog publicado ni que el ciclo autónomo end-to-end está cerrado.
3. QA de imágenes: monitor, historial/observaciones, SHA-256 de bytes locales, dossier no persistido, decisiones negativas anexadas, lectura en administrador, simulación local de reemplazo reversible. **NO** sustituye archivos, crea backups reales ni aprueba derechos.
4. Product Identity Fidelity Gate (norma Publisher): **las etiquetas, textos, logotipos, geometría, color, dimensiones y elementos distintivos deben corresponder al producto comercial real; una imagen espectacular e incorrecta se rechaza.** Incluye marca, flanker, concentración, volumen y packaging. Formulario de ocho criterios, incluso 8/8 coincidencias *declaradas* no permiten aprobación ni publicación.
5. Dashboard privado: estado y checklist de 10 gates; PR feed read-only limitado, según documentación, a #186–#195; NO es telemetría live universal ni significa que el feed cubra #208.
6. Experiencia de revista, Discovery, Saber y editor Tiptap preservados; identidad editorial, lectura y afiliación discreta tienen prioridad sobre arquitectura de tienda.
7. CI integrado y smoke Chromium real con datos locales aislados y API simulada, no sustituye staging/producción.
8. Migrador legado cambiado para **omitir por defecto** esquemas Intelligence 024–028. Activar en entorno aislado requiere `AROMIA_INTELLIGENCE_MIGRATIONS_ENABLED=true`; en producción exige **además** `AROMIA_INTELLIGENCE_PRODUCTION_MIGRATIONS_APPROVED=true` y aprobación humana separada. Nunca probar contra producción.

## 3. PLAN DE CONTINUACIÓN DE CODEX — EJECUTAR, NO SOLO PLANEAR

### Bloque A — Seguridad web: Tiptap como unidad coherente (P0)

- [ ] Leer `apps/web/package.json`, lockfile y cada importación real del editor/CMS; comprobar peers actuales de `@tiptap/extension-image`, `react`, `starter-kit`, `pm`, `core` y extensiones transitivas.
- [ ] Crear **rama aislada** desde este handoff. Investigar versiones estables compatibles disponibles; proponer actualización atómica de la familia Tiptap, no paquetes sueltos conflictivos.
- [ ] Regenerar lockfile con `npm install` normal; **prohibido** `--force` y `--legacy-peer-deps`.
- [ ] Tests de CMS: crear/editar/guardar/rehidratar, imágenes, estructura HTML/Tiptap, campos preservados y lectores `/magazine`, `/historias` según fixtures. Ejecutar responsive/teclado si el alcance del cambio lo requiere.
- [ ] `npm ci`, test/lint/typecheck/build y `npm audit --omit=dev --json` (guardar informe sin credenciales); abrir draft PR, nunca merge/deploy. Si no es viable, dejar evidencia del conflicto y pasar al siguiente bloque seguro.

### Bloque B — Seguridad web: Next.js en rama separada (P0)

- [ ] Tomar snapshot reproducible y revisión de advisories actuales de Next.js; evaluar salto necesario **sin asumir compatibilidad de 14→16**.
- [ ] Investigar reglas de migración aplicables: Node/React, App Router, rutas/params, cookies/headers async, middleware/proxy, ESLint `next lint`, compilación, Tiptap y Sharp; aplicar cambios incrementalmente.
- [ ] Mantener regresiones de seguridad, SSR, admin auth, login, catálogo, Discovery, historias, CMS, SEO y enlaces.
- [ ] Ejecutar **todo** el gate integrado (`Aromia integrated Intelligence QA`) y el smoke real Chromium aislado; además auditoría `--omit=dev`, accesibilidad/responsive y regresiones de escritura/autorización.
- [ ] Ningún waiver de vulnerabilidad sin documentación objetiva y autorización separada. No aplicar upgrade masivo como atajo.

### Bloque C — Seguridad API moderada y gobernanza (P1)

- [ ] Estudiar `node-cron` 3→4 y compatibilidad del scheduler; si se justifica, hacer tests de horarios, fallos/reintentos, recuperación, tz y persistencia; no romper jobs existentes.
- [ ] Verificar que `npm ci` y las pruebas siguen verdes en Node 22. No registrar secretos ni añadir proveedores pagados.
- [ ] Hacer auditoría de permisos del administrador, CSRF, headers, sesiones, límites de endpoints, sin confundir fixtures con validación de producción.

### Bloque D — Consolidación y QA de integración (P1)

- [ ] Recalcular diferencias de `main`, #206, #208 y nuevas ramas; revisar prioridades y ejecutar integración **solo en otra rama de pruebas**. No fusionar a `main` sin permiso explícito.
- [ ] Confirmar esquema/safe migrator, rollback de journal, fuentes/licencias, identidad de recursos reales y validación en entorno autorizado sin usar datos de producción editables.
- [ ] Mantener una PR candidata única legible, trazable, con checks asociados a SHA actuales y documentación de release hold.
- [ ] Si seguridad sigue bloqueada, avanzar en paralelo trabajo seguro: evidencia y QA editorial, Discovery/analítica o Living Edition piloto con assets existentes **autorizados**; no distraerse con un rediseño global o generación sin referencias.
- [ ] Preparar aceptación completa y solicitud final de autorizaciones de merge, migraciones, despliegue y publicación **por separado**.

## 4. CHECKLIST MAESTRO — 10 GATES (NO INFLAR)

Estado de `apps/web/src/lib/projectProgress.ts` al corte:

- [x] **01 — Base editorial integrada:** PR #186 fusionada; **verified** (solo hito del repositorio, no producción).
- [ ] **02 — Intelligence operativo y persistente:** en desarrollo; runtime supervisado pendiente.
- [ ] **03 — Piloto editorial end-to-end:** bloqueado; fuentes/fact-check/arte/derechos/QA/aprobación pendientes.
- [ ] **04 — Integridad visual:** en desarrollo; identidad/rights de frascos reales y aplicación reversible pendiente.
- [ ] **05 — Living Edition:** planificado; composición dinámica real + accesibilidad pendiente.
- [ ] **06 — Creative Studio audiovisual:** planificado; video/presupuesto/derechos sin validar.
- [ ] **07 — Marketing/Revenue:** planificado; afiliación contextual existente, medición real pendiente.
- [ ] **08 — Discovery/PWA:** planificado; flujos existentes, experiencia/medición/PWA no cerradas.
- [ ] **09 — OMNI adaptador desacoplado:** bloqueado; endpoint y handshake no verificados. No tocar repo OMNI.
- [ ] **10 — QA/lanzamiento:** bloqueado; seguridad, derechos, staging, aprobaciones faltantes.

**Indicador oficial = 10% (1/10)**. **No equivale a desarrollo técnico 10%**: mantener por separado `desarrollado | probado | integrado | certificado | publicado`. El 50% es meta, nunca porcentaje a asignar por decisión arbitraria.

## 5. POLÍTICAS DE NO-ACCIÓN

- NO merge, deploy, publicar artículos ni aplicar migraciones en producción sin permiso explícito; un PR draft verde no es autorización.
- NO generar/reemplazar automáticamente frascos reales; la fotografía comercial debe corresponder a etiquetas, textos, logos, geometría, color, dimensiones, packaging y variante real **con derechos comprobados**.
- NO confundir un dossier/no-backup dry-run con una autorización de uso, publicación o sustitución.
- NO seleccionar ni incorporar canales YouTube por cuenta propia: solo el Publisher elige canales.
- NO gastar en Cloud/GPU/proveedores/anuncios; NO tocar OMNI fuera de adaptador Aromia.
- NO modificar/filtrar secretos ni activar funcionalidades opt-in de producción.
- NO borrar/rebasar trabajo ajeno, falsear CI o marcar tests `skipped` como ejecutados.

## 6. LECTURA CANÓNICA

1. `AGENTS.md` y este `CODEX_HANDOFF.md`.
2. `docs/intelligence/MANDATO-V2.md`, `docs/intelligence/INTEGRATION-RELEASE-CANDIDATE.md`, `docs/intelligence/STACK-INTEGRATION-GATE.md`.
3. `AROMIA_CURRENT_STATE.md`, `AROMIA_EDITORIAL_WORKFLOW.md`, `AROMIA_VOICE_BIBLE.md`.
4. `docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md` y `docs/operations/AROMIA_LOCAL_DESIGN_WORKFLOW.md`.
5. `docs/intelligence/visual/PRODUCT-IDENTITY-FIDELITY.md`, `docs/intelligence/visual/REPLACEMENT-DRY-RUN.md`, `docs/intelligence/visual/SUPERVISED-DECISIONS.md`.
6. `docs/intelligence/PROJECT-PROGRESS.md`, `apps/web/src/lib/projectProgress.ts`, `docs/intelligence/VISION-Y-PENDIENTES.md`; contrastar con los PR actuales, pues algunos documentos anteriores describen ramas ya superadas.
7. `docs/mission-185/`, `docs/design/` y manifiestos del backlog únicamente en función del bloque actual.

## 7. RELAY OBLIGATORIO AL FINAL DE CADA BLOQUE

Al terminar un bloque, actualizar este handoff (secciones de evidencia y próximo paso) y la cabecera del `AROMIA_CURRENT_STATE.md` sin borrar contexto histórico. Formato:

```text
LAST_ACTOR: Codex
ACTIVE_OBJECTIVE:
ACTIVE_BRANCH:
BASE_REF / HEAD_SHA:
LAST_ACTION / FILES:
VERIFIED: <comandos locales + GitHub run/CI y SHA>
NOT_VERIFIED:
NEXT_ACTOR: Codex
NEXT_ACTION: <siguiente bloque ejecutable concreto>
BLOCKERS: <exactos o NONE>
AUTHORITY: NO_MERGE / NO_DEPLOY / NO_PUBLISH / NO_PRODUCTION_WRITES
```

**No esperes instrucciones nuevas para una tarea rutinaria.** Sigue al siguiente bloque técnicamente seguro dentro de la sesión. Si una acción necesita autorización humana, deja esa operación bloqueada y continúa en otra tarea segura. Nunca prometas ejecución posterior fuera de una sesión activa.

---

### Prompt mínimo para Codex

> **Continúa Aromia desde el repo, sin publicar. Lee AGENTS.md y CODEX_HANDOFF.md, verifica los SHA/PR/CI actuales, retoma el primer bloque P0 elegible, trabaja autónomamente con código, pruebas, correcciones y PR draft, documenta evidencia y continúa con el siguiente bloque seguro. No esperes que escriba «Siguiente» para cada avance. No hagas merge ni deploy, no gastes dinero y no inventes aprobaciones de imágenes, licencias ni identidad.**
