# AROMIA — REANUDACIÓN PARA CLAUDE CODE · 18 NOV 2026

**Tipo:** checkpoint operativo de continuación; **no sustituye** el contrato maestro `AROMIA_MASTER_HANDOFF.md`.  
**Repositorio:** `francoisbowman-cloud/aromia-lab`.  
**Rama persistente:** `claude/aromia-integration`.  
**PR de revisión:** [#214 — DRAFT / RELEASE HOLD](https://github.com/francoisbowman-cloud/aromia-lab/pull/214), destino `main`.  
**SHA de código y documentación observado antes de escribir este relay:** `bf51c5825b893e0ac4eabab3dfa8888b5f967d30`. Releer HEAD tras este commit y **no asumir este SHA como actual**.  
**Estado de certificación:** `1/10 VERIFIED` (10%); HITO 02 `intelligence-runtime: in_progress`, no certificado.

## 0. Orden de lectura y autoridad

1. `AROMIA_MASTER_HANDOFF.md` (contrato vigente y todas las restricciones).
2. Este `docs/handoffs/CLAUDE_RESUME_2026-11-18.md` (estado más reciente para reiniciar).
3. `docs/handoffs/AROMIA_LATEST.md` (historial de checkpoints, últimos primero).
4. `docs/intelligence/GATE-02-CERTIFICATION.md` (criterios explícitos de aceptación del hito activo).
5. `apps/web/src/lib/projectProgress.ts` y `docs/intelligence/PROJECT-PROGRESS.md` (fuentes de verdad de la barra).
6. `AROMIA_EDITORIAL_WORKFLOW.md`, `AROMIA_VOICE_BIBLE.md`, `docs/intelligence/visual/PRODUCT-IDENTITY-FIDELITY.md` (contratos editoriales, derechos e identidad visual).

**Prioridad de actor:** Claude Code trabaja autónomamente por **hitos certificados, no microbloques**. El usuario eligió **Sonnet con esfuerzo Medium** para ahorrar créditos; aumentar esfuerzo o cambiar a Opus solo cuando lo justifiquen problemas arquitectónicos y tras aprobación. El mandato original que sugiere Opus/High queda como recomendación histórica, no instrucción para anular esa preferencia reciente.

## 1. Estado real del PR y CI — corte verificado

El 18-11-2026 se consultó PR #214 en GitHub: **OPEN / DRAFT**, HEAD `bf51c5825b893e0ac4eabab3dfa8888b5f967d30`. GitHub Actions asociados al SHA:

- **9 SUCCESS:** Intelligence persistence; Aromia integrated Intelligence QA; Aromia Strict Audit; v2.0 CI; Catalog Import Contract CI; Visual evidence web verification; dependency release audit; dependency patch verification (read-only); Image quality signals.
- **6 SKIPPED:** Catalog White Replacement Validation, Taste Preview Gate, OMNI Product Image Fidelity, OMNI Final Aromia Release Gate, Catalog White Background Audit, OMNI Integrated Render Gate. No contarlos como aprobados.
- **2 IN_PROGRESS:** isolated real-browser QA (instalación Playwright) y Catalog Expansion Engine CI (remediación de Batch 003). Ninguno fallido al corte. **Revisar ambos antes de certificar CI completo.**
- El commit anterior `2ad835d30f8b34f98c97fc83ff208d958645ef49` pasó **11 SUCCESS / 6 SKIPPED / 0 FAILURE**. NO extrapolar sus resultados al HEAD posterior.

No se autorizó merge a main, despliegue, publicación, migraciones ni cambios de producción por el éxito de ningún CI.

## 2. Trabajo técnico implementado en la rama de integración

### Seguridad y compatibilidad
- Web: Next.js `16.4.6`, familia Tiptap `3.34.0` fijada de manera consistente, ESLint 9; editor, SSR y browser QA en CI.
- API: node-cron `4.6.0`; auditoría runtime `npm audit --omit=dev` de web y API previamente con cero avisos, volver a comprobar en HEAD actual, no confundir con certificación integral.
- Deuda: React 18 en Next 16, `middleware.ts`→`proxy.ts`, script `lint` API roto, warnings React Hooks y editor Tiptap de uso real/staging aún por validar.

### Intelligence: motor y recuperación
- `apps/api/src/intelligence/store.ts`: cola PostgreSQL, deduplicación, prioridades, tokens fencing, leases, reintentos, cancelación, eventos auditables, versiones de artefactos y aprobación separada.
- `worker.ts`: distingue error de preparación de error de base de datos; si `store.finish(...)` devuelve falso por token/lease obsoleto, **lanza `job_lease_lost`**, nunca informa éxito falso.
- `batch.ts`: ejecución finita de 1–25 jobs, se detiene ante cola vacía o error, `publication='blocked'`, proveedores inactivos.
- `cli.ts`: `work-batch N` como tarea bajo demanda para scheduler **externo**; requiere tanto `INTELLIGENCE_ENABLED=true` como `INTELLIGENCE_WORKER_ENABLED=true`. Con `NODE_ENV=production` requiere además `AROMIA_INTELLIGENCE_PRODUCTION_RUNTIME_APPROVED=true` **Y permiso humano explícito independiente de esa variable**. Comando legado `work` también respeta restricciones en producción.
- `batch.test.ts`, `worker.test.ts`, `integration.test.ts`: tests de límites, idle, errores de persistencia, pérdida de leases, rechazo de ejecuciones productivas no autorizadas; PostgreSQL desechable `*_test` con interrupción y reconexión; CLI en procesos Node separados. Tests agregados a `npm --prefix apps/api run test:intelligence`. CI Intelligence en HEAD observado: SUCCESS.

### Hito 03 preparado, NO aprobado
- `scripts/intelligence-pilot-readiness.mjs` y test, integrado al CI, evalúan el único piloto histórico `drafts/cuando-ya-no-hueles-tu-perfume.md`; expediente de 5 URL, 3 capturas, 1 extracto coincidente y 2 fallos de recuperación, sin inferir aprobación.
- `docs/intelligence/EDITORIAL-PILOT-01.md`: dos cápsulas artísticas sin generar imágenes.
- `docs/intelligence/EDITORIAL-PILOT-01-CLAIMS.md`: precheck de ocho afirmaciones; estudio `Foods` 2022 fue sobre fragancia estandarizada en **delantales**, no perfume personal habitual aplicado a piel; posible adaptación **o enmascaramiento**. Revisión científica/editorial humana pendiente.
- `docs/intelligence/EDITORIAL-PILOT-01-EDIT-PROPOSAL.md`: texto revisado como propuesta separada, sin sobrescribir original ni publicar.

## 3. Comp uerta de certificación del HITO 02 — objetivo único

**No marcar `verified` por el CI.** El gate oficial `intelligence-runtime` requiere funcionamiento persistente e independiente de Claude en runtime real **autorizado**, scheduler, observabilidad, permisos, recuperación, rollback, seguridad y aprobación humana documentada.

**Railway inspeccionado en solo lectura**: proyecto `aromia-lab-v2` (ID `aa3d7ebd-da16-4ad1-b7e4-ff7a85ec2b88`), único environment listado `production`. Servicios `web`, `api`, Redis, PostgreSQL y dos web QA. Deploys actuales web/api desde `main` SHA `1619c776560f5d6f9c5948f8092ff5241540048f`, del 17-11-2026, **no** incluyen PR #214. No se creó staging ni se modificó Railway. **No ejecutar scripts contra estos servicios.**

**Plan de cierre sin violar autorizaciones**:
1. Hacer `git fetch` y revisar árbol sucio, HEAD, PR #214 y checks exactos. No volver a fusionar ramas #206/#208/#209/#212 ya heredadas.
2. Resolver los 2 workflows pendientes, leer logs reales en caso de fallo, corregir y revalidar HEAD.
3. Revisar que pruebas CLI batch/legacy de seguridad y `job_lease_lost` pasan. Si procede, añadir prueba aislada para auth 401/403, scheduler externo simulado, métricas/alertas como **código de preparación**, sin activar runtime permanente.
4. Cerrar un dossier con evidencia reproducible de la **aceptación técnica aislada**; dejar un listado conciso y preciso de compuertas del runtime.
5. Para la **certificación real** de HITO 02, solicitar autorización concreta del Publisher para **staging aislado** y presupuesto/recursos, habilitación supervisada de scheduler y migrations de prueba, y medición de observabilidad/recuperación. No crear recursos de pago sin OK.
6. Solo después de ejecutar y verificar *todos* los criterios del gate con evidencia duradera en una revisión, actualizar `PROJECT_GATES` de `in_progress` a `verified` y la barra a `2/10` (20%). Hasta entonces **1/10**.

**Instrucción del usuario:** «Trabaja de hito certificado en hito certificado», con bloques largos sin pausas e indicador de progreso. No desplazarse a otros hitos mientras haya trabajo seguro del 02 sin agotar; si la compuerta restante exige autorización, reportar el bloqueo exacto y no inventar avance.

## 4. Autorizaciones y prohibiciones (repetición deliberada)

**Puede:** desarrollar y corregir en `claude/aromia-integration`, ejecutar pruebas aisladas, validar el CI, actualizar docs, commits, PRs draft y fusionar ramas **de desarrollo entre sí** tras QA. Hacer trabajo seguro y autónomo sin microgestión.

**NO puede sin autorización nueva:** merge a `main`, deploy/crear staging o servicio facturable, modificar Railway/producción, migraciones o writes productivos, activar scheduler en producción, aprobar contenido ni licencias, sustituir imágenes, comprar APIs o GPU, cambiar OMNI, seleccionar fuentes de YouTube. No `--force`, `reset --hard`, desactivar tests ni declarar workflows `skipped` como exitosos.

## 5. Forma de entrega de Claude

Al concluir cada hito candidato:
- Código real y pruebas CI para SHA exacto, incluyendo regresiones.
- Informe de aceptación con criterio→evidencia→resultado (PASS/FAIL/BLOCKED) y trazabilidad.
- Checkpoint único actualizado en `docs/handoffs/AROMIA_LATEST.md`, última entrada al principio.
- Estado del gate y porcentaje **solo si formalmente certificado**.
- PR #214 actualizada, **sin merge ni deploy**.
- Indicar qué falta para autorización de runtime sin pedir al Publisher tareas rutinarias.

**RELEASE_STATUS: HOLD | NEXT_ACTOR: Claude Code | NEXT_GATE: 02 / Intelligence runtime | NEXT_ACTION: revisar CI de #214, corregir, certificar requisitos técnicos aislados y preparar compuerta runtime autorizada.**
