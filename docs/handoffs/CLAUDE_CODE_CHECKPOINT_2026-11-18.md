# AROMIA — HANDOFF OPERATIVO PARA CLAUDE CODE · 18 NOV 2026

**Autoridad:** Este checkpoint complementa, pero NO reemplaza, `AROMIA_MASTER_HANDOFF.md`, `docs/handoffs/CLAUDE_RESUME_2026-11-18.md` ni `docs/intelligence/GATE-02-CERTIFICATION.md`. Leerlos antes de ejecutar.

**Repo:** `francoisbowman-cloud/aromia-lab` · **rama única:** `claude/aromia-integration` · **PR:** #214 (DRAFT, RELEASE HOLD). **Base verificada antes de esta entrega:** `01715b6437787f83555fc553d68fc441542addac`; releer HEAD porque este documento entra en un commit posterior. **Gates oficiales:** 1/10 verificado; gate 02 Intelligence in_progress, NO certificado.

## Trabajo reciente confirmado

- `batch.ts`: ejecución finita 1–25 jobs; `runObservedBatch` registra intentos, completados, idle, duración monotónica y errores parciales; `classifyBatchFailure` expone únicamente códigos permitidos. Los errores originales se propagan, sin falsear éxito. `cli.ts` devuelve códigos seguros, sin revelar mensajes de DB.
- `tools/cycle-metrics/`: utilitario de comparación de velocidad; no atribuir aceleración sin tiempos y funcionalidades observados de ambos métodos.
- **Este bloque:** `apps/api/src/intelligence/health.ts` y `health.test.ts`. Evaluador PURO y de solo lectura para `scheduler_never_succeeded`, `scheduler_overdue`, `repeated_failures`, `queue_backlog`, `queue_stale`; estados `ok/warning/critical`; `publication=blocked`, `providers=disabled`. Umbrales de diagnóstico provisionales: 2 intervalos scheduler, 3 fallos consecutivos, 25 trabajos en cola, 3 intervalos de espera. NO se conecta todavía a métricas reales, scheduler, endpoints ni proveedores de alertas. No implica que haya un scheduler activo.
- **Prueba local de este bloque:** TypeScript `health.ts` compilado con `tsc --target ES2022 --module commonjs`; 12 aserciones funcionales ejecutadas sobre JS compilado, todas aprobadas. Los 6 tests `node:test` incluidos NO se han ejecutado en este ciclo con el runner del proyecto; tampoco build completo ni PostgreSQL. CI del commit nuevo PENDIENTE.

## CI verificado antes de la entrega

Para HEAD anterior `01715b6437787f83555fc553d68fc441542addac`: 9 workflows SUCCESS (Intelligence persistence, integrated Intelligence QA, Strict Audit, v2.0 CI, Catalog Import, Image quality, dependency release audit, dependency patch audit, Visual evidence), 6 SKIPPED, 2 IN_PROGRESS (Catalog Expansion Engine CI, real-browser QA). No extrapolar esos checks al nuevo commit.

## Instrucciones para Claude Code — siguiente acción

1. `git fetch`; comprobar HEAD real, `git status`, cambios de otros actores y CI exacto de PR #214. No sobrescribir trabajo concurrente ni force-push.
2. Ejecutar `npm --prefix apps/api run test:intelligence`, tests nuevos de `health.test.ts`, compilación API, auditorías y CI. Asegurar que `health.test.ts` entra en el script de test adecuado; corregir errores reales sin deshabilitar tests.
3. Integrar observabilidad **solo en modo aislado**: snapshots procedentes de fuentes confiables, clasificación estable, métricas no sensibles y tests de recuperación tras reinicio. No fabricar scheduler, datos de cola ni alertas.
4. Para Gate 02, faltan runtime persistente aprobado, scheduler externo, alertas operativas, seguridad/permisos, rollback y aprobación Publisher. Railway observado solo con environment `production`; no ejecutar ahí el piloto.
5. Continuar por bloques de implementación+pruebas consolidados, no microcommits. Actualizar `docs/handoffs/AROMIA_LATEST.md` con evidencia real. No incrementar 1/10 sin certificación formal.

**Restricciones:** NO merge a main, NO deploy, NO migraciones/secretos/recursos de pago en producción, NO publicación ni aprobación de fuentes o imágenes por inferencia. Producto e identidad visual reales deben ser exactos; derechos aparte. El usuario desea desarrollo autónomo y mínima microgestión.

**RELEASE_STATUS: HOLD | NEXT_ACTOR: Claude Code | NEXT_GATE: 02 | NEXT_ACTION: CI del HEAD, tests health, integración observabilidad aislada.**
