# Aromia — handoff para Claude Code / Opus (ejecución autónoma supervisada por políticas)

**Corte:** 2026-11-18, hora de República Dominicana. **Actor:** Claude Code / Opus.  
**Base de trabajo:** `handoff/aromia-claude-autonomous-20261118`, derivada de `handoff/aromia-codex-continuation-20261117` (PR #209), derivada de #208, derivada de #206. **No confundir esta cadena de PR draft con `main`.**  
**Propósito:** permitir una sesión larga de desarrollo y reparación con mínima microgestión, sin depender de los créditos de Codex ni de esta conversación.

## 1. Autoridad y contexto — leer antes de programar

1. `AGENTS.md`, `CODEX_HANDOFF.md`, `AROMIA_CURRENT_STATE.md` (la cabecera vigente).
2. `docs/intelligence/MANDATO-V2.md`, `AROMIA_EDITORIAL_WORKFLOW.md`, `AROMIA_VOICE_BIBLE.md`, `docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md`.
3. `docs/intelligence/VISION-Y-PENDIENTES.md`, `docs/intelligence/PROJECT-PROGRESS.md`, `apps/web/src/lib/projectProgress.ts`.
4. `docs/intelligence/visual/PRODUCT-IDENTITY-FIDELITY.md`, `docs/intelligence/visual/REPLACEMENT-DRY-RUN.md`, `docs/intelligence/visual/SUPERVISED-DECISIONS.md`.
5. Documentos específicos de la parte del código que se vaya a tocar; comprobar siempre refs y CI actuales en GitHub.

La misión no es una tienda de perfumes ni una lista de agentes sin producto: **Aromia es una revista cultural de perfumería que investiga, escribe, verifica, compone, distribuye, mide y aprende de forma cada vez más autónoma**, con autoridad editorial humana. Conservar la independencia editorial y la afiliación discreta; conservar Historias, Saber (incluidas guías), Personas, Discovery, archivo, fragancias y CMS. Mantener una experiencia visual editorial sensorial, dinámica, accesible y coherente en móvil y escritorio; no sustituirla por una plantilla ecommerce.

**Mandato de identidad del Publisher:** etiquetas, textos, logotipos, geometría, color, dimensiones y elementos distintivos deben corresponder al producto real. Ningún resultado visual espectacular compensa una representación incorrecta. La variante exacta importa: concentración, flanker, volumen y generación del envase. **Los derechos y procedencia se verifican aparte.** Una imagen genérica, render IA, coincidencia visual declarada o enlace Amazon no certifica la identidad ni licencia.

## 2. Estado heredado (foto, comprobar en vivo)

- [PR #206](https://github.com/francoisbowman-cloud/aromia-lab/pull/206) `integration/aromia-intelligence-release-candidate-20261117`, HEAD al corte `ee66f063c5f1332507b45731929729a2959b961a`, OPEN/DRAFT, base `main`. QA integrado, navegador aislado y auditoría estricta pasaron en ese SHA.
- [PR #208](https://github.com/francoisbowman-cloud/aromia-lab/pull/208) `security/aromia-runtime-safe-patches-20261117`, HEAD al corte `fb85bc09d2df47ecd5b0ffc1d85bab2aaa1ac846`, OPEN/DRAFT, base #206. Node 22, API/web build/test, PostgreSQL e integración pasaron; auditoría runtime web FALLÓ por vulnerabilidades pendientes.
- [PR #209](https://github.com/francoisbowman-cloud/aromia-lab/pull/209) `handoff/aromia-codex-continuation-20261117`, HEAD al corte `6933ba4c99aec8a7e92dc17908e7aa01e6f6cec5`, OPEN/DRAFT, base #208; contiene el handoff para Codex y el relay.
- `main` tiene PR #186 fusionada, pero **no** se ha demostrado merge/deploy de #206/#208/#209. Reconfirmar.
- Auditoría npm runtime en #208: API 0 critical / 0 high / 2 moderate; web 1 critical / 2 high / 26 moderate. Riesgos clave: `next` 14.2.35, `@tiptap/core` 3.28.0 y `postcss` transitivo. Las cifras pueden cambiar: ejecutar auditoría nueva.
- 10 gates del proyecto: solo 1/10 verificado en snapshot (10% **de hitos certificados**, NO porcentaje real de desarrollo). No modificar indicador sin cierre documental comprobable.
- Progreso técnico: infraestructura de Intelligence, versiones, revisión y registros, QA visual, SHA y dry-run, checklist de identidad, administración privada y CI integrado implementados en PRs no fusionadas. **No hay piloto editorial end-to-end ni runtime autónomo de producción certificados**.

## 3. Prioridad de ejecución: seguridad sin perder la visión editorial

### Fase A — Recuperación del contexto y diagnóstico (corta, no burocrática)
- [ ] `git fetch origin`, `git status`, comprobar SHA y divergencias de las ramas; no hacer reset/rebase destructivo.
- [ ] Verificar PR #206, #208, #209 y **PRs nuevos creados por Codex después del corte**. No duplicar su trabajo: usar el estado real más reciente y asignar tareas no solapadas.
- [ ] Identificar qué CI es verde, rojo, omitido, obsoleto o no ejecutado; guardar evidencia por SHA.
- [ ] Verificar que los secretos, DB de producción y Railway no se utilizan en pruebas.
- [ ] Preparar ramas pequeñas y PRs draft; el trabajo de Claude debe estar aislado del de Codex.

### Fase B — Seguridad del frontend (P0)
- [ ] Actualizar la familia Tiptap como conjunto coherente de dependencias y peers (core, pm, starter-kit, extensiones), sin `--force` ni `--legacy-peer-deps`; proteger contenido, HTML y flujos CMS.
- [ ] Migrar Next.js a una versión mantenida/corregida, en **rama y PR separados** o secuencia apilada claramente documentada; revisar React, Node, App Router, params/cookies/headers, rutas administrativas, middleware/proxy, build y lint.
- [ ] Ejecutar `npm ci`, tests, lint, typecheck, build, QA integrado, QA Chromium aislado y `npm audit --omit=dev`; verificar auth, editor, búsqueda, Discovery, revista, SEO, contraste y responsive.
- [ ] Corregir fallos hasta verde; no eliminar tests, relajar políticas ni declarar éxito por checks omitidos.
- [ ] Si el salto de Next o Tiptap es incompatible, registrar la incompatibilidad concreta, la versión viable, pruebas y PR draft; continuar otra tarea segura sin publicar.

### Fase C — Estabilidad de Aromia Intelligence (P1)
- [ ] Revisar recuperación de trabajos, concurrencia, idempotencia, permisos, tokens, cron, límites de costes, trazabilidad, panel y comportamiento con fallos.
- [ ] Investigar avisos moderados API (`node-cron`, `uuid`) sin romper scheduler; cambios separados con pruebas.
- [ ] Probar contra PostgreSQL/Redis **aislados**, nunca producción; migraciones opt-in únicamente en entorno autorizado de test.
- [ ] No simular que el sistema ya funciona permanentemente en Railway. Preparar documentación de runtime y pruebas de recuperación para futura validación autorizada.

### Fase D — Revista editorial y QA visual (P1, en paralelo cuando no solape)
- [ ] Identificar un artículo piloto real y su trazabilidad: investigación, fuentes, borrador, fact-check, edición, arte, QA y aprobación. Preparar hasta `PUBLISHABLE` si existe evidencia y autoridad, nunca `LIVE`.
- [ ] Auditar la fidelidad de imágenes existentes contra la **referencia exacta** del fabricante y licencia, marcando `unverified` o `material_mismatch_blocked` cuando corresponda; **no aprobar ni sustituir** por inferencia.
- [ ] Preservar la bergamota rechazada como pendiente; no generar recursos ni consumir proveedores por iniciativa propia.
- [ ] Diseñar un piloto acotado de Living Edition con **assets ya autorizados**, portada/ritmo editorial, bloques, responsive, accesibilidad, rendimiento y QA visual. No iniciar un rediseño global.
- [ ] Discovery: evaluar búsqueda acotada, familias/subfamilias, privacidad y recorrido; Saber debe contener guías didácticas, Historias relatos y ensayos.
- [ ] OMNI: solo preparar adaptador desacoplado; no modificar repo ni presumir endpoint remoto.
- [ ] YouTube: **solo** canales elegidos expresamente por el Publisher. No ampliar allowlist ni recolectar canales de oficio.

### Fase E — Consolidación de release (bloqueada hasta aprobación)
- [ ] Comparar ramas y PRs apiladas; preparar candidata de integración **en rama de pruebas** con migraciones, pruebas, licencias, auditoría, reversibilidad y trazabilidad.
- [ ] Documentar checklist de seguridad, derechos, publicación, costes, accesibilidad y rendimiento; no mover gates por entusiasmo.
- [ ] Detenerse ante cualquier acción que requiera merge a `main`, producción, publicación, migración real, gasto o autorización de identidad/imagen; continuar otro bloque seguro si existe.

## 4. Contrato de trabajo autónomo — sin quemar horas en informes

**Claude Code debe implementar y reparar, no limitarse a narrar.** Para cada bloque:
1. Seleccionar el menor cambio coherente que avance un objetivo real.
2. Inspeccionar las APIs/importaciones y tests actuales antes de editar; preservar el código válido.
3. Implementar en rama propia, con tests de regresión.
4. Ejecutar verificación relevante local; corregir errores de forma iterativa. Si falla un comando, leer el error real antes de cambiar paquetes.
5. Push + PR draft con base/HEAD, descripción, comandos, CI y limitaciones. No merge.
6. Guardar checkpoint **en su rama** en `docs/handoffs/CLAUDE_CODE_LATEST.md` (crear al primer bloque) con:
   - `ACTOR`, `DATE`, `BASE_REF`, `HEAD_SHA`, `PR`, `CHANGED_FILES`, `TESTS`, `CI`, `BLOCKERS`, `NEXT_ACTION`, `NOT_DONE`, `NO_PRODUCTION_CHANGES`.
   - Si cambia la cabecera de `AROMIA_CURRENT_STATE.md`, verificar y reconciliar cualquier cambio paralelo de Codex, nunca sobreescribir ciegamente.
7. Continuar al siguiente bloque elegible durante la sesión, sin preguntar por tareas rutinarias; **no afirmar trabajo en segundo plano fuera de la sesión activa**.

**Disciplina de costes y contexto:** usar búsquedas dirigidas (`rg`, `git diff`, archivos relevantes), tests específicos primero y suite completa antes de cerrar PR; evitar repetir builds completos sin cambio, reinstalar dependencias sin necesidad o reabrir toda la historia del repo en cada bloque. Trabajar en lotes coherentes; informes concisos al cierre de cada bloque. No sacrificar QA por velocidad.

**Colaboración con Codex:** la rama `handoff/aromia-claude-autonomous-20261118` es el punto de partida de Claude; **no modificar directamente** `handoff/aromia-codex-continuation-20261117`, `security/aromia-runtime-safe-patches-20261117`, `integration/aromia-intelligence-release-candidate-20261117` ni `main`. Si Codex continúa, no asumir que su branch es libre; comparar PRs y reasignar trabajo para evitar duplicaciones. Las ramas de Claude deben llevar prefijo `claude/` y PR draft; la base de cada PR debe ser explícita. No crear ramas por cada cambio trivial.

## 5. Límites que no se negocian

**Sin autorización explícita nueva del Publisher:**
- NO merge a `main`, NO deploy, NO publicar, NO tocar Railway/prod ni ejecutar migraciones reales.
- NO gastos API, GPUs, SaaS, campañas o compras.
- NO alterar catálogo, frascos, imágenes reales ni identidad de producto en producción.
- NO aprobar derechos/licencias, identidad, imágenes o contenido; solo preparar evidencia y revisión.
- NO modificar repositorios OMNI u otros proyectos.
- NO registrar secretos, tokens, datos personales ni exponer credenciales en logs/PR.
- NO `git reset --hard`, `git push --force`, borrar ramas ajenas o relajar CI para ocultar fallos.

La capacidad de Claude de seguir trabajando sin interrupción **no equivale a autorización para desplegar**. Si no hay bloque seguro, dejar estado persistente y parar limpiamente.

## 6. Estado de salida obligatorio

Al terminar cada bloque o antes de perder contexto, guardar:

```text
ACTOR: Claude Code / Opus
ACTIVE_BRANCH:
BASE_SHA:
HEAD_SHA:
PR:
LAST_ACTION:
FILES_CHANGED:
TESTS_EXECUTED_AND_RESULTS:
CI_RUN_URL_AND_STATUS:
SECURITY_AUDIT:
EDITORIAL_AND_VISUAL_GATE:
BLOCKERS:
NEXT_SAFE_BLOCK:
REQUIRES_PUBLISHER_APPROVAL:
NO_MERGE_NO_DEPLOY_NO_PRODUCTION_WRITES: CONFIRMED
```

Al reanudar, Claude debe **leer su propio último checkpoint antes de empezar otro bloque**. Si encuentra discrepancia entre la rama y el documento, manda la evidencia de Git/CI y debe corregir el relay.

## 7. Prompt breve para Claude Code

> Trabaja en Aromia de forma autónoma, sin publicar. Empieza desde `handoff/aromia-claude-autonomous-20261118`, lee `AGENTS.md`, `CODEX_HANDOFF.md` y `CLAUDE_CODE_HANDOFF.md`. Comprueba el estado vivo de PRs y CI, evita solaparte con Codex y ejecuta los bloques P0/P1 elegibles: implementación, tests, correcciones, PRs draft y checkpoints persistentes. Continúa mientras la sesión esté activa sin pedirme instrucciones rutinarias. No hagas merge, deploy, migraciones de producción, gastos, cambios OMNI ni aprobaciones de imágenes o derechos. Respeta la revista editorial, la Voice Bible y la identidad exacta de los perfumes. Deja un checkpoint para que mañana podamos retomar sin reconstruir contexto.
