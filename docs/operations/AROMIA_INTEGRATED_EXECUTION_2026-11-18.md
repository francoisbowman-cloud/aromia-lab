# AROMIA — Ejecución por objetivos integrados
**Adoptado:** 2026-11-18 · **Estado:** instrucción operativa complementaria, sin autorización de release.

## Alcance y precedencia
Este documento reduce latencia de coordinación. **No sustituye** `AROMIA_MASTER_HANDOFF.md`, `docs/handoffs/CLAUDE_RESUME_2026-11-18.md`, `AROMIA_EDITORIAL_WORKFLOW.md`, `AROMIA_VOICE_BIBLE.md` ni los gates de derechos, identidad exacta, seguridad y Publisher. Ante conflicto prevalece el contrato maestro y la evidencia de HEAD. Actor ejecutor: Claude Code en `claude/aromia-integration`; PR #214 permanece DRAFT / RELEASE HOLD. Codex no se reactiva por este documento.

## Cambio de método
**Antes:** cada disciplina emitía un traspaso y esperaba nueva instrucción. **Ahora:** una misión completa produce cambios, pruebas y checkpoint; los roles son capacidades coordinadas del mismo ejecutor, no esperas humanas entre pasos. No crear otro sistema de agentes, tablero permanente o PR por microtarea.

Tres carriles de trabajo dentro de la única rama integrada:
- **Producto y experiencia:** web/CMS, Living Edition, navegación, Discovery y pruebas visuales accesibles.
- **Editorial e Intelligence:** investigación trazable, fuentes y claims, borradores, colas y revisión humana; guías en Saber.
- **Visual y fidelidad:** imágenes intercaladas, composición, retratos y materiales; identidad exacta de perfumes y derechos de uso verificados por separado.

El ejecutor coordina carriles en una sola sesión; **no ejecuta ediciones concurrentes sobre los mismos archivos, migraciones o superficie de integración**. Paralelizar investigación, pruebas independientes y tareas sin conflicto; integrar secuencialmente con revisión de diff.

## Selección de trabajo, sin parálisis
1. Leer master, resume, HEAD/CI actual y gate activo; identificar la **siguiente acción que produzca evidencia o código**, no redactar otro plan general.
2. Prioridad oficial: terminar todos los requisitos **elegibles y seguros** del HITO 02 Intelligence; no declararlo aprobado por CI aislado. La barra permanece **1/10 (10%)** hasta certificación íntegra.
3. Si el HITO 02 depende exclusivamente de autorización de staging, costes, runtime real o Publisher, dejar el requisito exacto marcado `BLOCKED_BY_APPROVAL` y **avanzar con un entregable seguro e independiente** de piloto editorial/Living Edition. Esto NO implica saltar el gate 02, ni alterar orden de certificación.
4. Límite WIP: **un objetivo integrador activo y como máximo una tarea independiente sin conflictos**. Cerrar código + pruebas focalizadas + checks relevantes + checkpoint antes de ampliar alcance.
5. No pedir «Siguiente» para investigación, correcciones o tests permitidos. Si la sesión finaliza, reanudar desde el checkpoint, sin prometer ejecución en segundo plano.

## Definición de entrega completa
Cada objetivo debe salir de la sesión con:
- **Cambio concreto** en código, test o expediente de evidencia, identificado por ruta y commit exacto.
- **Prueba reproducible** (comando, resultado y SHA/URL del CI relevante). Un test no ejecutado queda `NOT_RUN`; `SKIPPED` no equivale a `PASS`.
- **Control editorial y legal**: claims con fuentes; licencias y producto comercial exacto no se presuponen; aprobación humana y publicación separadas.
- **Checkpoint compacto** ante interrupción en `docs/handoffs/AROMIA_LATEST.md`: objetivo, HEAD, evidencia, bloqueos reales y próximo cambio ejecutable. Evitar duplicar en múltiples handoffs la misma narración.
- **Estado de producto** separado entre `implemented`, `tested`, `integrated`, `certified`, `published`. Solo `certified` cambia la barra de 10 hitos.

## Próxima ejecución concreta
**Carril principal (HITO 02):** comprobar HEAD y CI de PR #214; corregir fallos reales; cubrir brechas de pruebas de autorización 401/403, scheduler simulado y métricas/alertas aisladas si son pertinentes; producir matriz de requisitos `PASS / FAIL / BLOCKED_BY_APPROVAL` con enlaces y pasos de rollback. No activar worker ni migraciones en producción.

**Carril independiente cuando el HITO 02 esté bloqueado por autorización:** avanzar el piloto existente `drafts/cuando-ya-no-hueles-tu-perfume.md` hacia una composición de lectura **aislada y probada** para móvil/escritorio, a partir de `docs/intelligence/EDITORIAL-PILOT-01.md` y su revisión de claims. Probar contraste, accesibilidad, enlace y ritmo. No sustituir imágenes, aprobar fuentes por inferencia ni publicar.

## Límites invariables
No merge a `main`, deploy, staging facturable, recursos de pago, migraciones o datos de producción, activación de scheduler, publicación, reemplazo visual ni modificación del repositorio OMNI sin nueva aprobación explícita. La rama única no es permiso de release. Mantener PR #214 como superficie de revisión, no generar PRs anidados sin motivo.
