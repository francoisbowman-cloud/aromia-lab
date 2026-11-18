# Aromia · Hito 02 — expediente de certificación de Intelligence

**Estado:** `PENDING_OPERATIONAL_CERTIFICATION` — **NO CERTIFICADO**  
**Actualizado:** 2026-11-18  
**Alcance:** gate `intelligence-runtime` de `apps/web/src/lib/projectProgress.ts`.  
**PR de integración:** [#214](https://github.com/francoisbowman-cloud/aromia-lab/pull/214) (draft, sin merge a `main` ni deploy).

## Qué significa «certificado»

Este gate es **Intelligence operativo y persistente**. No basta que el motor compile o que una simulación en GitHub Actions pase: debe demostrarse un proceso persistente **independiente de la sesión de desarrollo** y ejecutado en un entorno de runtime expresamente autorizado, con un recorrido editorial seguro, observabilidad, recuperación tras interrupción y fronteras de permisos y costes. No se interpreta «10 tests verdes» como «hito cerrado».

| Requisito de certificación | Evidencia disponible / verificaciones | Condición actual |
|---|---|---|
| 1. Esquema persistente y migraciones reversibles | Migraciones 024–028 opt-in; PostgreSQL 16 desechable en CI; prueba de reconexión y reinicio del proceso | **PROBADO EN AISLADO**, no runtime autorizado |
| 2. Deduplicación, exclusión mutua y reintentos | `integration.test.ts`: dedupe, `SKIP LOCKED`, fencing, lease expirado, agotamiento de tres intentos, retry manual | **PROBADO EN CI** en SHA histórico; verificar HEAD actual |
| 3. Fallo seguro del worker | `worker.ts`: error de validación distinto de fallo de `finish`; `worker.test.ts`: persistencia, claim, publicación bloqueada | **PROBADO EN CI** en SHA histórico; verificar HEAD actual |
| 4. Entrada operativa sin sesión Code/Claude | `intelligence work` procesa un job y termina. `work-batch N` permite ejecución limitada por disparador externo, opt-in simultáneo `INTELLIGENCE_ENABLED=true` **y** `INTELLIGENCE_WORKER_ENABLED=true`, máximo 25, sin loop residente | **IMPLEMENTADO PARA PRUEBAS**, falta invocador real autorizado |
| 5. Scheduler y recuperación operacional | `work-batch` acepta invocación desde scheduler externo; no instala cron ni servicio persistente | **NO VERIFICADO EN RUNTIME** |
| 6. Presupuestos y proveedores | Registro cerrado `editorial.prepare`, sin modelo, `providerCostMicros=0`; `batch.ts` informa providers disabled | **MODO GRATUITO PROBABLE / SIN RUTA DE PAGO**, no ledger de proveedores para ampliaciones |
| 7. Autenticación y permisos | AdminAuth, `INTELLIGENCE_ENABLED`, token independiente de Publisher para revisión; no endpoint de publicación | **PRUEBAS AISLADAS**, revisar credenciales/roles en entorno real |
| 8. Observabilidad y diagnóstico | eventos transaccionales, status y dashboard; logs CLI; **registro de invocaciones `intelligence_runs` (migración 029 opt-in) + `intelligence health N`** alimentando `health.ts` con fuentes reales (ver sección «Observabilidad real aislada») | **PROBADO EN AISLADO** (PostgreSQL 16 desechable); **falta**: monitor/entrega de alertas y scheduler autorizados que consuman el código de salida |
| 9. Seguridad y reversibilidad | pruebas integradas, auditoría npm, CI read-only, rollback documentado; prod migrations explícitamente bloqueadas | **CI**, no ensayos de rollback de datos real/backup en staging |
| 10. Certificación Publisher | aprobación de entorno, migraciones, integración en `main`, activación del scheduler y revisión de evidencia | **NO CONCEDIDA** |

## Prueba de aceptación propuesta — entorno aislado

**No ejecutar sobre producción sin autorización separada.** En `NODE_ENV=production`, el comando requiere además `AROMIA_INTELLIGENCE_PRODUCTION_RUNTIME_APPROVED=true`. **La mera presencia de esta bandera no constituye autorización humana**: exige aprobación previa y verificable del Publisher, plan de rollback y entorno correcto. Preparar `*_test` o `*_dev` con PostgreSQL aislado y migraciones exclusivamente de prueba. Bajo entorno de test, configurar `INTELLIGENCE_ENABLED=true` y `INTELLIGENCE_WORKER_ENABLED=true` y ejecutar:

```bash
npm --prefix apps/api run build
npm --prefix apps/api run test:intelligence
# Solo apuntando a BD local desechable y migrada (NO Railway):
npm --prefix apps/api run intelligence -- work-batch 5
```

Probar mínimo:
1. Sin trabajos: `processed=0, idle=true`, sin bucle infinito.
2. Con varios briefs de prueba: procesa como máximo N; todos los `result.publication` deben permanecer `blocked`.
3. Restablecer proceso/BD: verificar que los trabajos y eventos sobreviven, que un lease caducado puede recuperarse y que un token obsoleto no puede completar.
4. Revocar acceso admin/publisher: comprobar respuestas 401/403 y que no existe endpoint de publicación.
5. Deshabilitar cualquiera de las dos banderas `INTELLIGENCE_ENABLED` o `INTELLIGENCE_WORKER_ENABLED`: `work-batch` debe rechazar ejecución, incluso si hay trabajos listos.
6. Medir y registrar la duración por invocación, uso de recursos, errores, retrasos, avisos y reinicio simulado. Describir el mecanismo de alerta y el disparador autorizado.
7. Confirmar versión de Node/lockfiles; no silenciar auditorías ni ignorar skips.

**Importante:** pasar este procedimiento en un PostgreSQL local acredita únicamente una **prueba operacional aislada**. Para cierre del hito oficial, falta la prueba de ejecución persistente en el entorno escogido y autorizado, independiente de Claude/Codex, con supervisión y recuperabilidad.

## Diagnóstico real de Railway (solo lectura, 2026-11-18)

Se inspeccionó el proyecto existente **`aromia-lab-v2`** mediante Railway, sin leer secretos, crear recursos ni ejecutar despliegues. **Único environment visible:** `production`; **no existe staging separado** en el listado del proyecto. Servicios: `web`, `api`, PostgreSQL, Redis y dos web de QA existentes en ese mismo environment. Su mera existencia no demuestra un staging aislado ni autoriza pruebas con datos reales.

Despliegues `web` y `api` observados como `SUCCESS` desde `main` commit `1619c776560f5d6f9c5948f8092ff5241540048f`, creados el **17-11-2026 02:58 UTC**. Este SHA es **anterior** al código de la PR #214; no contiene el batch de Intelligence que acabamos de preparar. **No ejecutar el piloto de certificación contra esos servicios ni dar por activado Intelligence en Railway.**

**Implicación:** Gate 02 necesita una prueba runtime en entorno explícitamente autorizado (idealmente staging aislado, con presupuesto/autorización del Publisher), además del CI. No crear entorno nuevo ni duplicar servicios de pago por iniciativa propia. Hasta contar con esa autorización, solo puede cerrarse la **aceptación técnica en PostgreSQL desechable/CI**, no el hito global.

---

## Observabilidad real aislada — 18 noviembre (Claude Code)

**Qué se añadió (código de preparación; no activa nada):**
- Migración **029 `intelligence_runs`** (opt-in, misma política 024–028; `migrationPolicy.ts` la difiere por defecto y en producción exige la doble confirmación) + rollback `down/029`. Guarda por invocación de `work-batch`: `outcome`, `failure_code` cerrado (`^[a-z_]{1,64}$`), `attempted`, `processed`, `duration_ms`, `finished_at`. **Nunca** payloads ni texto de error.
- `healthSource.ts`: `collectHealthSnapshot` (solo lectura, **reloj de la BD**) → `evaluateIntelligenceHealth`. Trabajo pendiente = `queued` disponible **o** `running` con lease caducado (un worker caído no queda invisible). Una invocación inactiva con cola vacía cuenta como latido real; los rechazos previos a ejecutar (flags, tamaño inválido) **no** cuentan como ejecución.
- CLI: `work-batch` registra su resultado (best-effort: si la tabla 029 no existe, el job y el error original no cambian y devuelve `ledger: unavailable`). Nuevo `intelligence health INTERVALO_MIN`: requiere `INTELLIGENCE_ENABLED=true`, **sin intervalo por defecto** (el operador declara la cadencia), en producción exige las mismas verificaciones que `work`; **exit code 2 si `critical`**, para que un monitor externo autorizado lo consuma.

**Evidencia local reproducible (Windows, Node 20.20.2, `postgres:16-alpine` desechable en `127.0.0.1:55432`, BD `aromia_intelligence_test`):**

| Criterio | Evidencia | Resultado |
|---|---|---|
| Suite `test:intelligence` completa | 53 tests, 53 pass, 0 fail, 0 skipped (antes del bloque: 42/47 solo por ausencia de BD; con BD 47/47) | PASS |
| Señales desde datos reales (never_succeeded, overdue, backlog, stale, lease caducado) | `healthSource.test.ts` #2 | PASS |
| Reinicio de proceso (pool nuevo) conserva estado y recupera lease | `healthSource.test.ts` #2 | PASS |
| Clasificación sin fuga (`postgres://…hunter2…` no llega al ledger), `job_lease_lost`, racha de fallos y reinicio por ejecución OK | #3 + mutación (quitar el reinicio de racha hace fallar #3) | PASS |
| Constraints del ledger y rollback reversible | #4 | PASS |
| Compatibilidad sin migración 029 | #5 | PASS |
| CLI en procesos Node separados, exit codes, gates fail-closed | #6 | PASS |
| `tsc --noEmit`, `tsc -p` build API | exit 0 | PASS |
| `npm audit --omit=dev` (API) | 0 vulnerabilidades | PASS |

**Sigue BLOQUEADO (no se simuló):** scheduler externo real, entrega de alertas, retención/purga del ledger (≈288 filas/día a 5 min; definir al aprobar cadencia), ensayo en staging aislado, backup/rollback de datos reales, aprobación del Publisher. El CI de GitHub sobre el SHA nuevo debe leerse aparte.

## Dependencias de autorización

Las siguientes acciones **no están aprobadas por este documento**: fusionar PR #214 a `main`, configurar Railway/staging con secretos, activar trabajos automáticos, migrar datos de producción, desplegar, contratar proveedor, publicar, elevar `PROJECT_GATES[1]` a verified. Si la certificación exige alguna de ellas, **no ejecutar por inferencia**.

## Estado de cierre

- **Desarrollado:** motor PostgreSQL, worker, API privada, registros de revisión, batch finito y CI.
- **Probado:** pruebas de concurrencia/lease/retry/identidad/revisión en entornos aislados (validar SHA vigente).
- **Integrado:** rama `claude/aromia-integration`, PR #214 draft.
- **Certificado:** **NO**.
- **Publicado:** **NO**.

**NEXT ACTION:** confirmar tests del último HEAD; luego ejecutar prueba controlada de `work-batch` en sandbox autorizado y preparar evidencia de observabilidad, permisos y recuperación. Mantener gate 02 `in_progress` y barra oficial 1/10.

## Robustez adicional — 18 noviembre, último lote

- El workflow completo del commit `2ad835d30f8b34f98c97fc83ff208d958645ef49` terminó con **11 SUCCESS, 6 SKIPPED, 0 FAILURE**. Esta evidencia verifica las pruebas cross-process anteriores, **no** los cambios posteriores.
- Se reforzó `runOnce`: si `store.finish` devuelve `false` por pérdida de lease/token obsoleto, el worker produce `job_lease_lost` y **no cuenta ese trabajo como procesado**. Dos regresiones cubren el caso de preparación válida y brief inválido.
- `intelligence work` (comando legado de un solo trabajo) tampoco debe ejecutarse accidentalmente con `NODE_ENV=production`: ahora requiere las mismas verificaciones que `work-batch` para el entorno productivo. El modo local queda compatible.
- El test cross-process verifica que `work-batch` sin la autorización productiva se rechaza.
- **Pruebas de este lote:** todavía pendientes de GitHub Actions sobre SHA actual; no se declara que pasaron anticipadamente.
- **Certificación oficial:** se mantiene `IN_PROGRESS`: no hay staging independiente en Railway, scheduler real aprobado, alertas ni autorización de despliegue/secretos. No usar una bandera de entorno como reemplazo de aprobación humana.

---

