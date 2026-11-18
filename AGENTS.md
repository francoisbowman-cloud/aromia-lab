# Aromia — instrucciones para Codex y agentes de desarrollo

> **Inicio obligatorio:** leer [CODEX_HANDOFF.md](CODEX_HANDOFF.md). Si el actor es **Claude Code**, leer además [CLAUDE_CODE_HANDOFF.md](CLAUDE_CODE_HANDOFF.md) y trabajar en ramas `claude/*` desde la rama específica de traspaso, sin pisar ramas de Codex. No usar la parte histórica de `AROMIA_CURRENT_STATE.md` como estado actual sin reconciliar GitHub.

**Misión:** desarrollar de forma autónoma Aromia como revista cultural/editorial de perfumería — no rediseñarla como ecommerce. Implementar, probar, corregir y registrar progreso verificable en GitHub; no limitarse a informes. Continuar secuencialmente sin pedir al Publisher que escriba "Siguiente" por cada bloque.

## Prioridad de fuentes (leer antes de tocar código)

1. `CODEX_HANDOFF.md` — estado concreto y secuencia de trabajo actual, con fechas, SHA y límites.
2. `AROMIA_CURRENT_STATE.md` — usar su **última actualización explícita**, no las secciones históricas v54/v56.
3. `docs/intelligence/MANDATO-V2.md`, `AROMIA_EDITORIAL_WORKFLOW.md`, `AROMIA_VOICE_BIBLE.md`.
4. `docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md`, `docs/intelligence/PROJECT-PROGRESS.md`.
5. `docs/intelligence/visual/PRODUCT-IDENTITY-FIDELITY.md`, `docs/intelligence/INTEGRATION-RELEASE-CANDIDATE.md`.
6. Consultar los documentos de cada módulo y los PR/CI actuales **en vivo** antes de afirmar estados.

Si hay contradicción entre documentos antiguos y nueva evidencia real, anotar la discrepancia y preferir el código/CI/PR actuales para estados técnicos, sin cambiar arbitrariamente las autoridades editoriales ni la aprobación humana.

## Autoridad y límites

**Permitido:** inspeccionar código, investigar fallos, desarrollar en ramas aisladas, escribir y ejecutar tests locales, corregir hasta pasar CI, abrir PRs borrador, actualizar documentación/relay, preparar demos aisladas y migraciones reversibles que no toquen producción.

**No autorizado sin permiso nuevo y explícito del Publisher:** merge a `main`; desplegar/publicar; aplicar migraciones a producción; modificar catálogo o imágenes de producción; aprobar recursos/identidad/derechos; ejecutar sustituciones visuales; gastar en proveedores/GPU/API/anuncios; tocar el repositorio OMNI; modificar permisos/secretos de producción; seleccionar canales de YouTube (solo el Publisher puede seleccionarlos).

**Invariante visual:** *Etiquetas, textos, logotipos, geometría, color, dimensiones y elementos distintivos deben corresponder al producto real. Ningún resultado visual espectacular compensa una representación incorrecta.* Incluye marca, flanker, EDT/EDP/Parfum, capacidad y versión del empaque. No confundir SHA, coincidencias declaradas, estética ni foto encontrada en internet con identidad y licencia verificadas.

## Bucle autónomo

1. `git status`, `git fetch`, verificar rama y SHA del handoff, `main`, PR #206/#208 y CI; **no usar un árbol sucio sin reconciliar**.
2. Seleccionar el siguiente bloque de `CODEX_HANDOFF.md`. Priorizar seguridad de dependencias y compatibilidad del editor antes de nuevas funciones.
3. Trabajar en **rama propia** derivada de la base correcta; mantener diffs revisables, evitar `--force`, sobrescrituras y merges automáticos.
4. Ejecutar pruebas y QA del ámbito afectado. Ante fallo, diagnosticar, corregir y repetir. Nunca bajar la calidad del gate para volverlo verde.
5. Push y PR **draft** con SHA, decisiones, comprobaciones, fallos y riesgos. No presentar `action_required` o `skipped` como `success`.
6. Actualizar `CODEX_HANDOFF.md` y el encabezado actual de `AROMIA_CURRENT_STATE.md` con qué cambió, tests, rama/PR exactos, siguiente bloque y bloqueos. Cada checkpoint debe permitir retomar sin la conversación.
7. Continuar automáticamente al siguiente bloque seguro mientras el entorno/sesión esté disponible; si se interrumpe, el repositorio debe contener el estado suficiente.

**Progreso:** 10% = 1/10 hitos **verificados**, no el porcentaje de código desarrollado. No inflar la barra por cantidad de commits, PRs o CI green. Distinguir **desarrollado / probado / integrado / certificado / publicado**.

**Regla de desbloqueo:** un problema de seguridad sin solución inmediata no obliga a parar toda la ingeniería: documentar el bloqueo e implementar en paralelo trabajo seguro y aislado, nunca activar release saltándose la compuerta.

**Comando natural de continuación:** `Continúa Aromia desde el repo, sin publicar. Lee CODEX_HANDOFF.md y ejecuta el siguiente bloque elegible sin nuevas confirmaciones rutinarias.`
