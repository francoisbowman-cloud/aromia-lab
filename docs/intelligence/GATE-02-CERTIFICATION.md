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
| 4. Entrada operativa sin sesión Code/Claude | `intelligence work` procesa un job y termina. `work-batch N` permite ejecución limitada por disparador externo, opt-in `INTELLIGENCE_WORKER_ENABLED=true`, máximo 25, sin loop residente | **IMPLEMENTADO PARA PRUEBAS**, falta invocador real autorizado |
| 5. Scheduler y recuperación operacional | `work-batch` acepta invocación desde scheduler externo; no instala cron ni servicio persistente | **NO VERIFICADO EN RUNTIME** |
| 6. Presupuestos y proveedores | Registro cerrado `editorial.prepare`, sin modelo, `providerCostMicros=0`; `batch.ts` informa providers disabled | **MODO GRATUITO PROBABLE / SIN RUTA DE PAGO**, no ledger de proveedores para ampliaciones |
| 7. Autenticación y permisos | AdminAuth, `INTELLIGENCE_ENABLED`, token independiente de Publisher para revisión; no endpoint de publicación | **PRUEBAS AISLADAS**, revisar credenciales/roles en entorno real |
| 8. Observabilidad y diagnóstico | eventos transaccionales, status y dashboard; logs CLI; alertas, métricas de fallo y continuidad reales | **PARCIAL**: falta observabilidad operacional y alertas probadas |
| 9. Seguridad y reversibilidad | pruebas integradas, auditoría npm, CI read-only, rollback documentado; prod migrations explícitamente bloqueadas | **CI**, no ensayos de rollback de datos real/backup en staging |
| 10. Certificación Publisher | aprobación de entorno, migraciones, integración en `main`, activación del scheduler y revisión de evidencia | **NO CONCEDIDA** |

## Prueba de aceptación propuesta — entorno aislado

**No ejecutar sobre producción sin autorización separada.** Preparar `*_test` o `*_dev` con PostgreSQL aislado y migraciones exclusivamente de prueba. Bajo entorno de test, configurar `INTELLIGENCE_WORKER_ENABLED=true` y ejecutar:

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
5. Deshabilitar `INTELLIGENCE_WORKER_ENABLED`: `work-batch` debe rechazar ejecución, incluso si hay trabajos listos.
6. Medir y registrar la duración por invocación, uso de recursos, errores, retrasos, avisos y reinicio simulado. Describir el mecanismo de alerta y el disparador autorizado.
7. Confirmar versión de Node/lockfiles; no silenciar auditorías ni ignorar skips.

**Importante:** pasar este procedimiento en un PostgreSQL local acredita únicamente una **prueba operacional aislada**. Para cierre del hito oficial, falta la prueba de ejecución persistente en el entorno escogido y autorizado, independiente de Claude/Codex, con supervisión y recuperabilidad.

## Dependencias de autorización

Las siguientes acciones **no están aprobadas por este documento**: fusionar PR #214 a `main`, configurar Railway/staging con secretos, activar trabajos automáticos, migrar datos de producción, desplegar, contratar proveedor, publicar, elevar `PROJECT_GATES[1]` a verified. Si la certificación exige alguna de ellas, **no ejecutar por inferencia**.

## Estado de cierre

- **Desarrollado:** motor PostgreSQL, worker, API privada, registros de revisión, batch finito y CI.
- **Probado:** pruebas de concurrencia/lease/retry/identidad/revisión en entornos aislados (validar SHA vigente).
- **Integrado:** rama `claude/aromia-integration`, PR #214 draft.
- **Certificado:** **NO**.
- **Publicado:** **NO**.

**NEXT ACTION:** confirmar tests del último HEAD; luego ejecutar prueba controlada de `work-batch` en sandbox autorizado y preparar evidencia de observabilidad, permisos y recuperación. Mantener gate 02 `in_progress` y barra oficial 1/10.
