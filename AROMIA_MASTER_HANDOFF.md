# AROMIA — HANDOFF MAESTRO ÚNICO · CLAUDE CODE

> **ESTADO VIGENTE, 26 NOV 2026 — TRAS MERGE #214:** el PR #214 está **MERGED** a `main`, commit `5ba7349a11d42ad2d5590f1250a410f1e7b4a317`; Railway web/api reportó ambos despliegues SUCCESS (verificación directa del 26/11). La nueva rama segura es `chore/post-214-hydration-diagnostics` con PR #216 **DRAFT, SIN MERGE**. Leer primero `docs/handoffs/AROMIA_POST_MERGE_2026-11-25.md` para el estado, manteniendo `AROMIA_MASTER_HANDOFF.md` como autoridad normativa. Toda referencia histórica más abajo a #214 pendiente de merge/deploy es **obsoleta**. Gate 02 sigue NO certificado; barra 1/10; no fusionar #216 ni desplegar sin permiso nuevo del Publisher.

## ACTUALIZACIÓN OPERATIVA — 18 NOV 2026 · CONTINUIDAD CLAUDE

**Leer antes de continuar:** [`docs/handoffs/CLAUDE_RESUME_2026-11-18.md`](docs/handoffs/CLAUDE_RESUME_2026-11-18.md) en `claude/aromia-integration`. Este documento conserva el contrato maestro y sus autorizaciones; el archivo de reanudación actualiza **el estado técnico y las prioridades**. No tomar las versiones/PRs de la sección histórica de este master como estado reciente sin verificar.

- **Rama activa:** `claude/aromia-integration`; **PR #214** DRAFT / RELEASE HOLD. Ya existe: **no recrear ni fusionar de nuevo** los PRs heredados.
- **Prioridad establecida por el Publisher:** trabajar **de hito certificado a hito certificado**, en bloques largos con barra sustentada por evidencia.
- **Barra oficial:** `1/10 = 10%`; **hito 02, Intelligence runtime, `in_progress`**. NO se certifica por CI aunque esté verde.
- **Modelo:** el Publisher prefirió **Sonnet Medium** para ahorrar créditos; Opus/High del encabezado original son una recomendación histórica, no una orden de cambiar el modelo.
- **Runtime:** Railway `aromia-lab-v2` solo muestra `production`; no hay staging autorizado identificado. No crear, desplegar, gastar ni activar worker en producción sin nueva aprobación.
- **Estado de GitHub:** ver el SHA/CI preciso y la evidencia en el relay nuevo; no atribuir tests anteriores a commits nuevos.

**Autoridad, controles editoriales, fidelidad visual y prohibiciones del master permanecen íntegros.**

---



**Versión:** 2026-11-18 · **Estado:** contrato operativo vigente para la siguiente sesión.  
**Repositorio:** `francoisbowman-cloud/aromia-lab`.  
**Actor único:** Claude Code (familia **Opus**, preferentemente la versión más reciente **efectivamente disponible** en el selector del usuario; **no asumir ni fijar** que “Opus 5.5” está oficialmente disponible sin comprobarlo).  
**Esfuerzo recomendado:** **High** para trabajo continuado; máximo disponible para migraciones difíciles, arquitectura y depuración profunda; no gastar razonamiento máximo en tareas mecánicas.  
**Misión:** desarrollar y consolidar **Aromia como revista editorial inteligente de perfumería**, trabajando con autonomía, implementación real, QA y checkpoints. **Codex queda en pausa** en esta etapa.

> **Este es el único handoff operativo vigente.** Sustituye, para instrucciones de continuación y autorizaciones, a `CODEX_HANDOFF.md` y `CLAUDE_CODE_HANDOFF.md`, que quedan como registros históricos. `AGENTS.md` y `AROMIA_CURRENT_STATE.md` deben apuntar aquí. Los contratos editoriales, de seguridad y de identidad visual originales **siguen vigentes**; este documento no los reemplaza.

## 1. Autoridad exacta del Publisher

**Autorizado sin preguntar por cada bloque:** leer y modificar código, investigar, reparar, ejecutar tests y CI, crear ramas/commits, abrir PRs draft, **fusionar ramas y PRs de desarrollo ENTRE SÍ** tras revisar conflictos y pruebas, consolidar en **una sola rama persistente `claude/aromia-integration`**, mantener checkpoints y continuar con tareas seguras dentro de la sesión. No es obligatorio abrir una PR por microcambio.

**Requiere aprobación explícita nueva:** merge a `main`; deploy o publicación; aplicar migraciones o cambios de datos a producción; activar jobs en producción; modificar recursos/productos/imágenes reales publicados; aprobar contenido, identidad visual o licencias; comprar/consumir servicios de pago, GPU, campañas o APIs; tocar repositorios de OMNI u otros proyectos; seleccionar canales YouTube. **No confundir merge interno autorizado con merge a `main`.**

**Prohibido:** `git push --force` o `git reset --hard` sobre trabajo ajeno, borrar historial/ramas sin verificar, silenciar auditorías, eliminar pruebas para conseguir verde, inventar métricas o fuentes, exponer secretos o PII, declarar `skipped` como `passed`, realizar reemplazos visuales por inferencia, gastar sin autorización.

## 2. Visión no negociable de Aromia

Aromia dejó de ser una tienda/catálogo como arquitectura principal: es una **revista de perfumería**. El contenido es el núcleo; perfumes y enlaces de afiliación aparecen cuando hay una razón editorial genuina, de forma contextual y discreta.

- **Historias:** relatos, historia, cultura, ensayos, personas, acontecimientos y perspectivas. Narración con investigación y edición.
- **Saber:** aprendizaje, materiales/ingredientes, técnicas y **guías**; las guías pertenecen a Saber, no a Historias.
- **Personas:** perfumistas y protagonistas con biografías, fuentes y retratos verificados.
- **Discovery:** familias y subfamilias olfativas, ejemplos y exploración significativa; privacidad y accesibilidad.
- **Fragancias:** referencias documentadas, imágenes y variantes exactas; no crear una tienda disfrazada de revista.
- **Living Edition:** composición editorial dinámica, ritmo de portada, imágenes intercaladas, narrativas visuales inmersivas, móvil y escritorio; no plantillas repetitivas ni movimiento decorativo sin propósito.
- **Aromia Intelligence:** pipeline de investigación, fuentes, borradores, fact-check, revisión, decisiones, versiones, arte, QA, distribución, métricas y aprendizaje; **supervisión y aprobación editorial humanas**.
- **Creative Studio:** experimentación audiovisual trazable, costes y derechos controlados; sin activación de proveedores pagos.
- **Distribución y sostenibilidad:** newsletter, SEO, atribución y afiliación contextual; evitar convertir el contenido en escaparate.
- **OMNI:** futuro adaptador desacoplado y contratos de integración; no cambiar el repositorio OMNI ni fingir un handshake ya probado.

**Voz:** respetar `AROMIA_VOICE_BIBLE.md` y `AROMIA_EDITORIAL_WORKFLOW.md`. La estética no reemplaza hechos ni derechos. El sistema debe ser editorialmente creíble, no simplemente generar artículos en volumen.

**Mandato visual del Publisher (criterio de bloqueo):** las etiquetas, textos, logotipos, geometría, color, dimensiones y elementos distintivos de un perfume **deben corresponder al producto comercial real**. Identificar marca, nombre, concentración, flanker, capacidad y generación de envase. Ninguna imagen “espectacular” justifica una identidad incorrecta. La procedencia, licencia y derecho de uso se verifican **por separado**. Hash SHA-256, parecido, una checklist declarativa, foto en buscador o simulación dry-run NO son autorización para publicar/sustituir. Preferir documentación fotográfica real y fuentes institucionales; IA solo donde sea editorialmente pertinente y claramente segura.

## 3. Estado técnico comprobado al corte (revalidar siempre)

**La rama de arranque contiene por ascendencia toda la cadena #206 → #208 → #209 → #212. No repetir merges ni cherry-picks de esas ramas sin comparar SHA.**

| Elemento | Evidencia observada 2026-11-18 | Significado |
|---|---|---|
| [PR #206](https://github.com/francoisbowman-cloud/aromia-lab/pull/206) | `integration/aromia-intelligence-release-candidate-20261117`, SHA `ee66f063c5f1332507b45731929729a2959b961a`, OPEN/DRAFT | Intelligence integrada en rama, NO `main` |
| [PR #208](https://github.com/francoisbowman-cloud/aromia-lab/pull/208) | `security/aromia-runtime-safe-patches-20261117`, SHA `fb85bc09d2df47ecd5b0ffc1d85bab2aaa1ac846`, OPEN/DRAFT | Parches API, NO deploy |
| [PR #209](https://github.com/francoisbowman-cloud/aromia-lab/pull/209) | `handoff/aromia-codex-continuation-20261117`, SHA `6933ba4c99aec8a7e92dc17908e7aa01e6f6cec5`, OPEN/DRAFT | Historial del relay Codex |
| [PR #212](https://github.com/francoisbowman-cloud/aromia-lab/pull/212) | `handoff/aromia-claude-autonomous-20261118`, SHA `8d2a77f20591a7a651409b3babdcfc5bd8e0c57e`, OPEN/DRAFT | Handoff Claude previo, superado por este |
| `main` | PR #186 fusionada; #206/#208/#209/#212 no fusionadas al corte | NO suponer release integrado |
| [QA #206](https://github.com/francoisbowman-cloud/aromia-lab/actions/runs/44230842902) y [Chromium #206](https://github.com/francoisbowman-cloud/aromia-lab/actions/runs/44230842785) | SUCCESS | Pruebas aisladas, no validación de producción |
| [QA #208](https://github.com/francoisbowman-cloud/aromia-lab/actions/runs/44233483453) y [Node22 #208](https://github.com/francoisbowman-cloud/aromia-lab/actions/runs/44233483594) | SUCCESS | Integración y regresión con lockfile congelado |
| [Audit #208](https://github.com/francoisbowman-cloud/aromia-lab/actions/runs/44233483417) | FAILURE intencionado | **RELEASE HOLD** por web |
| [Issue #207](https://github.com/francoisbowman-cloud/aromia-lab/issues/207) | Seguimiento de seguridad | No cerrar sin pruebas nuevas |

**npm audit runtime (`--omit=dev`) en #208:** API 0 críticas, 0 altas, 2 moderadas (`node-cron`, `uuid` transitivo); web 1 crítica (`next` 14.2.35), 2 altas (`@tiptap/core` 3.28.0, `postcss` transitivo de Next), 26 moderadas. Son avisos reportados, no pruebas de explotación. La API ya lleva `express 4.22.3`, `proxy-addr 2.0.8`, `body-parser 1.20.9`, `js-yaml 3.15.2`, `qs 6.16.2`, `multer 2.5.0`; `sharp 0.35.5`. **No hacer `npm audit fix --force` ni `--legacy-peer-deps`.** Los avisos y versiones pueden cambiar: comprobar registro y audit actuales.

**Intelligence en PRs no fusionadas:** jobs, estados/versiones, API/admin, pruebas PostgreSQL aisladas, QA de identidad, SHA de bytes locales, historial y simulación reversible. No se ha demostrado scheduler persistente de producción ni sustitución real con backup/aprobación. Migraciones Intelligence 024–028: opt-in `AROMIA_INTELLIGENCE_MIGRATIONS_ENABLED=true`; producción exige además `AROMIA_INTELLIGENCE_PRODUCTION_MIGRATIONS_APPROVED=true` y autorización humana. No activarlas en producción.

**Contenido:** backlog objetivo de 100; el inventario anterior indicaba 49 archivos draft y 43 entradas cubiertas, con 57 pendientes; NO son 43 artículos publicados ni listos. Verificar inventario actual. Piloto editorial end-to-end y derechos de arte no certificados. Bergamota y otros materiales visuales siguen sujetos a revisión, sin aprobación implícita.

## 4. Arranque y rama única

1. Verificar `git status --short --branch`, `git fetch origin`, ramas, HEAD de `main` y PRs nuevos; comprobar si Codex dejó cambios desde el corte. **No pisar un árbol sucio.**
2. Arrancar desde **`handoff/aromia-final-unified-20261118`** y crear o reconciliar **`claude/aromia-integration`**. Si esta última ya existe, comparar ancestros y cambios: no sobrescribir.
3. Esta rama hereda los PRs anteriores por ascendencia; **no fusionar de nuevo** #206/#208/#209/#212. Fusionar internamente nuevas ramas de trabajo solo tras revisar diffs, conflictos, CI y pruebas. Mantener commits pequeños por bloque y un PR draft de integración hacia `main` únicamente como superficie de revisión, **no como permiso para merge**.
4. No abrir PRs de cientos de cambios no relacionados sin pruebas: dividir por commits/bloques, pero conservar una sola línea de integración.
5. Registrar cada bloque en **`docs/handoffs/AROMIA_LATEST.md`** en `claude/aromia-integration`, y actualizar cabecera de `AROMIA_CURRENT_STATE.md` sin borrar el historial.

Comandos ilustrativos (reconciliar si las ramas ya existen):
```bash
git fetch origin
git status --short --branch
git log --oneline -8
git branch -a --contains origin/handoff/aromia-final-unified-20261118
# Si no existe la rama de integración y el árbol está limpio:
git switch -c claude/aromia-integration origin/handoff/aromia-final-unified-20261118
```

## 5. Plan ejecutable — prioridades y criterios de aceptación

### P0 — Seguridad y compatibilidad del editor (primero)

- [ ] Inventariar imports, peerDependencies y persistencia de `@tiptap/core`, `@tiptap/pm`, `starter-kit`, extensiones, React y serialización HTML. Actualizar **la familia completa de Tiptap** a versiones compatibles y corregidas sin romper editor.
- [ ] Pruebas de creación, edición, guardado, rehidratación, imágenes, enlaces, formato, HTML legado y lectura en revista; evitar pérdida de contenido y cambios no reversibles.
- [ ] Investigar migración **separada y controlada** de Next.js 14 a una versión mantenida que resuelva advisories; verificar Node/React, App Router, cookies/headers, params async, middleware/proxy, auth admin, SEO, SSR, rutas, imágenes, build y lint.
- [ ] Repetir `npm ci`, tests, lint, typecheck, build, QA API+PostgreSQL, smoke Chromium y `npm audit --omit=dev` con evidencia por SHA. No desactivar el gate para pasar.
- [ ] Si no hay upgrade seguro inmediato, documentar el conflicto exacto, dejar release hold y avanzar en paralelo un bloque P1 sin tocar producción.

### P1 — Intelligence: resiliencia y trazabilidad

- [ ] Probar scheduler y colas: idempotencia, duplicados, reintentos, timeout, concurrencia, fallos, recuperación, observabilidad, límites de costes y permisos.
- [ ] Revisar `node-cron` y `uuid` moderados con compatibilidad, sin migración forzada.
- [ ] Tests de API, Postgres y, si aplica, Redis **aislados**, con migraciones opt-in únicamente en entorno local/test.
- [ ] Diferenciar agentes propuestos de agentes realmente operativos. Documentar límites de autonomía, aprobación humana, trazabilidad de fuentes y prevención de publicaciones accidentales.

### P1 — Piloto editorial y fidelidad visual

- [ ] Elegir **un piloto** ya respaldado por borradores y fuentes existentes; investigación, fuentes primarias, fact-check, Voice Bible, edición, revisión legal, art direction, QA. Dejarlo preparado para aprobación humana, **no publicar**.
- [ ] Auditar imágenes de fragancias contra producto/variante exactos y derechos. Registrar `verified`, `unverified` o `material_mismatch_blocked` con evidencia; NO sustituir, aprobar ni generar representaciones falsas.
- [ ] Probar imágenes intercaladas en Historias, guías en Saber, miniaturas en fragancias, biografías de perfumistas y materiales naturales (bergamota, limón, incienso, salvia sclarea, pachulí), con recursos ya autorizados y sin activar generación pagada.
- [ ] Piloto Living Edition **acotado** con ritmo editorial, composición responsive, contraste dark/light, teclado, a11y, rendimiento, enlaces funcionales; sin rediseño indiscriminado.

### P2 — Discovery, audiovisual, monetización y OMNI

- [ ] Discovery con familias/subfamilias, ejemplos, recorrido editorial, privacidad y PWA; tests y datos fiables.
- [ ] Creative Studio: arquitectura y piloto reproducible local/aislado, costes y derechos antes de cualquier ejecución de pago.
- [ ] Newsletter/analytics/afiliación contextual con atribución verificable y sin sesgo comercial de contenido.
- [ ] Adaptador OMNI desacoplado en Aromia, con contrato y pruebas mock; sin tocar OMNI ni declarar conexión real.

### P0 transversal — Consolidación y release hold

- [ ] Integrar internamente código aprobado en `claude/aromia-integration`, resolver conflictos y ejecutar regresiones de toda la pila.
- [ ] Documentar backup/rollback, migraciones, compatibilidad de datos, derechos, QA editorial y controles de seguridad.
- [ ] Mantener el release bloqueado hasta cierre demostrado de seguridad, integridad visual, staging y autorización del Publisher. No merge a `main` ni deploy.

## 6. Checklist de 10 gates (certificación, no esfuerzo de ingeniería)

- [x] 01. Base editorial integrada — **VERIFIED**: PR #186 fusionada.
- [ ] 02. Intelligence persistente/operativa — **IN PROGRESS**: implementación en draft; runtime real pendiente.
- [ ] 03. Piloto editorial completo — **BLOCKED**: fuentes, arte, QA, aprobación.
- [ ] 04. Integridad visual — **IN PROGRESS**: auditoría/dry-run; faltan identidad y licencias reales, reversibilidad aprobada.
- [ ] 05. Living Edition — **PLANNED**: experiencia dinámica/QA pendiente.
- [ ] 06. Creative Studio — **PLANNED**: piloto audiovisual y derechos.
- [ ] 07. Marketing/Revenue — **PLANNED**: conversión/atribución y monetización verificables.
- [ ] 08. Discovery/PWA — **PLANNED**: personalización/privacidad/QA.
- [ ] 09. OMNI — **BLOCKED**: contrato remoto/handshake sin verificar.
- [ ] 10. QA integral y lanzamiento — **BLOCKED**: seguridad web, staging, derechos, aprobaciones.

**Indicador actual = 1/10 hitos certificados (10%). No es “10% de código terminado”.** En cada bloque separar **desarrollado / probado / integrado / certificado / publicado**; sin porcentajes inventados ni avance por número de PRs.

## 7. Protocolo autónomo y ahorro de contexto

Por cada bloque: **inspeccionar → implementar → probar → corregir → revisar diff → fusionar internamente si procede → checkpoint → siguiente bloque seguro**. No gastar horas en informes o auditorías repetidas sin cambios. Usar `rg`, tests focalizados primero, suite completa para cierre; evitar reinstalaciones/builds duplicados y consultas redundantes. Priorizar código y pruebas sobre narración. No saltar tests para ahorrar tiempo.

**Checkpoint obligatorio en `docs/handoffs/AROMIA_LATEST.md` al final de cada bloque y antes de compactación/interrupción:**
```text
DATE_UTC:
ACTOR: Claude Code / Opus (modelo exacto observado en la sesión, no supuesto)
BRANCH: claude/aromia-integration
BASE_SHA:
HEAD_SHA:
CURRENT_BLOCK:
COMPLETED_CHANGES:
FILES_CHANGED:
TESTS_COMMANDS_AND_RESULTS:
CI_RUNS_WITH_URLS_AND_CONCLUSIONS:
SECURITY_AUDIT_COUNTS:
EDITORIAL_VISUAL_RIGHTS_STATUS:
OPEN_BLOCKERS:
NEXT_SAFE_ACTION:
REQUIRES_PUBLISHER_APPROVAL:
RELEASE_STATUS: HOLD | READY_FOR_REVIEW (never AUTO_DEPLOY)
```
No afirmar ejecución continua después de que termine la sesión o se agoten cuotas. Si no quedan tareas seguras, detenerse dejando checkpoint claro. Si se necesitan autorizaciones, registrar la dependencia y avanzar en otro bloque elegible.

## 8. Fuentes canónicas que se deben respetar (no leer toda la historia cada vez)

- `AROMIA_EDITORIAL_WORKFLOW.md` y `AROMIA_VOICE_BIBLE.md`.
- `docs/intelligence/MANDATO-V2.md`, `docs/intelligence/VISION-Y-PENDIENTES.md`, `docs/intelligence/INTEGRATION-RELEASE-CANDIDATE.md`.
- `docs/intelligence/PROJECT-PROGRESS.md` y `apps/web/src/lib/projectProgress.ts`.
- `docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md`.
- `docs/intelligence/visual/PRODUCT-IDENTITY-FIDELITY.md`, `docs/intelligence/visual/REPLACEMENT-DRY-RUN.md`, `docs/intelligence/visual/SUPERVISED-DECISIONS.md`.
- `CODEX_HANDOFF.md` y `CLAUDE_CODE_HANDOFF.md`: **históricos**; útiles para trazabilidad, **no** como nuevas órdenes contradictorias.

## 9. Instrucción de inicio para Claude Code

> **Asume la ejecución exclusiva de Aromia. Abre `AROMIA_MASTER_HANDOFF.md` en la rama `handoff/aromia-final-unified-20261118`; es el único handoff operativo vigente. Comprueba refs, PRs, CI y el árbol local. Crea o reconcilia `claude/aromia-integration`, que hereda #206/#208/#209/#212. Puedes fusionar ramas de desarrollo verificadas dentro de esa rama, pero NO fusionar a `main`, desplegar, publicar, gastar ni tocar producción sin mi autorización. Prioriza Tiptap/Next.js, Intelligence y el piloto editorial/visual, respetando la Voice Bible y la fidelidad exacta de los perfumes. Implementa, prueba, corrige, guarda `docs/handoffs/AROMIA_LATEST.md` por bloque y continúa autónomamente mientras la sesión esté activa. No me pidas que escriba «Siguiente» para tareas rutinarias.**
