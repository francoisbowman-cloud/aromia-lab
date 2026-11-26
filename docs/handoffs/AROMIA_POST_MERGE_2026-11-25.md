# Aromia — checkpoint posterior al merge de PR #214

**Fecha del corte:** 2026-11-25. **Fuente verificada:** GitHub, no informe de deployment externo.

## Estado del repositorio

- PR [#214](https://github.com/francoisbowman-cloud/aromia-lab/pull/214) **MERGED/CLOSED**. Merge commit `5ba7349a11d42ad2d5590f1250a410f1e7b4a317`, que era HEAD de `main` al iniciar esta rama. El head del PR era `ad01cfdc02c503ec6aefd0f7c7e93f13a85ced33`.
- Este checkpoint reemplaza las afirmaciones de `AGENTS.md`, `AROMIA_MASTER_HANDOFF.md`, `docs/handoffs/AROMIA_LATEST.md`, `CLAUDE_RESUME_2026-11-18.md`, `CLAUDE_CODE_CHECKPOINT_2026-11-18.md` y `RESUMEN_PARA_RETOMAR_2026-11-23.md` **solo respecto al estado del PR, rama y despliegue**. Los contratos editoriales, de seguridad y la autorización del Publisher siguen vigentes.
- Código de `main`: `apps/web/package.json` declara Next `^16.4.6`, React/React DOM `^19.3.1`, Tiptap `3.34.0`.
- Informe del último operador Claude Code: Railway web y api SUCCESS, 15 rutas web correctas, API /health y un artículo correctos, preflight 125. **No verificado independientemente por este actor**. El despliegue fue autorizado y ejecutado por otro actor; **no volver a desplegar ni escribir producción**.
- Progreso oficial: **1/10 hitos certificados (10%)**. Merge o deploy no certifican Gate 02. Migraciones 024–029 no aplicadas en producción según el último operador; Intelligence debe seguir desactivado. No probar estas migraciones en producción.
- La rama de trabajo actual es `chore/post-214-hydration-diagnostics`, derivada de `main`, NO reutilizar `claude/aromia-integration` como rama activa por inercia. La PR de este checkpoint es para revisión, NO para merge o deploy automático.

## Trabajo seguro de esta rama

- `scripts/qa/hydration-diagnostic.cjs`: auditoría de hidratación **solo en loopback**, con Playwright, dos temas (light/dark), rutas conocidas; captura `console` y `pageerror` de React; devuelve JSON y exit 1 ante errores. No envía datos ni usa producción. `hydration-diagnostic-lib.cjs` desacopla la detección/redacción de mensajes, con tests de Node independientes.
- React **#418 es un problema de discrepancia de texto entre servidor y cliente**; la causa aún no se ha demostrado. El script de tema en `apps/web/src/app/layout.tsx` altera `data-theme` temprano, pero no explica por sí solo un text mismatch. **No agregar `suppressHydrationWarning` sin localizar el componente**.
- Pendiente: ejecutar primero `node --test scripts/qa/hydration-diagnostic-lib.test.cjs`. Luego levantar `next dev` con las dependencias instaladas y API aislada y ejecutar:
```bash
PLAYWRIGHT_PACKAGE_PATH=/ruta/al/playwright node scripts/qa/hydration-diagnostic.cjs http://127.0.0.1:3000
```
  Investigar el primer diff de texto y su fuente (tiempo, datos, locales, condición client/server); corregir la raíz con test de regresión. Una pasada del script sin errores no descarta un caso intermitente: repetir navegaciones y comparar viewport móvil después.
- Después: landing editorial separada a partir de mockups del Publisher (no copiar e-commerce: Aromia es revista), figuras dentro de artículos y procedencia/licencia de imágenes, PWA, Gate 02 runtime autorizado.
- Política de imágenes: las 125 URLs externas y el proxy de catálogo tienen riesgos de derechos **pendientes de decisión**, no sustituir ni aprobar imágenes por inferencia.
- **CI de esta nueva rama y validación interactiva aún pendientes**. Ningún test de navegador se afirma como ejecutado en este corte.

**Próxima acción para Claude Code:** revisar PR/branch HEAD y CI, ejecutar auditoría en un build de desarrollo local, corregir mismatch reproducible; no desplegar ni fusionar sin aprobación explícita.

## Seguimiento verificado · 26 noviembre 2026

- **Railway (lectura directa):** dos deploys de los servicios principales en estado `SUCCESS`, ambos desde `main` y SHA `5ba7349a11d42ad2d5590f1250a410f1e7b4a317`, creados `2026-11-25T01:57:53Z`. No confundir SUCCESS de deployment con verificación de hidratación del navegador.
- **CI del PR #216, HEAD `665c1cb3d3f2329b72d3879beab30784e476224c`:** `Aromia hydration diagnostic unit checks`, `Aromia Strict Audit` y `v2.0 CI` SUCCESS; seis gates de diseño/visual SKIPPED; cero fallos. Esta evidencia no prueba que desapareciera React #418.
- **Análisis de código:** `layout.tsx` preconfigura `data-theme` en cliente; esto puede provocar diferencias de atributos, pero React #418 cubre también discrepancias de texto/HTML, no implica por sí mismo que esta sea la causa. `Footer.tsx` usa año actual (evaluar transición de año); formatos de fecha y datos dependientes del entorno requieren revisión por ruta. No se debe aplicar un silenciamiento general como sustituto del diagnóstico.
- **Bloqueo real:** no hay entorno Next dev completo ni instalación de `apps/web/node_modules` en el contenedor disponible; no se ejecutó el navegador local. Próximo actor debe levantar dev y usar la herramienta ya incorporada. No afirmar "corregido" mientras no exista un diff reproducible y su test de regresión.
- **Niveles de razonamiento sugeridos:** etapa de verificación de GitHub/Railway/CI = Medium; reproducción/diff React = High; implementación puntual y tests = Medium, elevar a High si hay SSR asíncrono; arquitectura del layout/streaming si falla diagnóstico = Extra High; QA final y handoff = Medium.

## Verificación ampliada · 26 noviembre 2026 (CI en PR #216)

- **Incidente confirmado y localizado en desarrollo (SHA `6ed0c41`):** para `aromia_theme=dark` en `/`, `/academia` y `/quiz`, React advertía exclusivamente un atributo del `<html>`: servidor `data-theme="light"`, navegador `data-theme="dark"` porque el script anti-flash usa el valor almacenado antes de hidratación. En tema claro no hubo errores.
- **Corrección acotada:** `suppressHydrationWarning` aplicado **solo** al `<html>`, conforme al caso de atributo personalizado que no puede conocerse desde SSR. No se aplica a componentes hijos. El diagnóstico verifica también que el atributo oscuro se aplica de verdad, evitando una falsa solución que desactive el tema.
- **CI real en SHA `494abaf8`:** Chromium + Next 16.4.6 `next dev`: 6/6 navegaciones `/`, `/academia`, `/quiz` por claro/oscuro, HTTP 200 y cero errores de hidratación. Segundo job Chromium + `next build`/`next start` aislado: otros 6/6, HTTP 200 y cero errores. Ambos jobs SUCCESS. API apuntaba a puerto local cerrado, **sin conexión a Railway ni datos reales**. Esto no acredita artículos/fichas con API ni el error anterior de producción.
- **Siguiente observación:** `scripts/qa/production-hydration-observe.cjs` solo permite GET en el dominio público fijo `https://www.aromialab.com`, sin clicks ni writes, para observar la versión **pre-PR #216** de cuatro rutas en ambos temas. Se ejecuta como CI **no bloqueante**, separada de la prueba de código corregido; no confundir resultados de producción previa con la rama actual.
- Quedan otros avisos Next detectados en la auditoría local: calidades de imagen `85`/`95` no declaradas en `images.qualities`; otros ajustes de imagen/LCP. Tratar en bloque separado, sin declarar resueltos.

## Siguiente reparación aislada — calidades de imagen Next 16

- En la auditoría real de Next dev, `EditorialImage` solicita `quality=85` y `VisualField` solicita `quality=95`, pero Next 16 permite `[75]` por defecto, por lo que emitía avisos explícitos. Se configura `images.qualities = [75,85,95]` en `next.config.mjs` conservando los valores que ya estaban especificados por los componentes. No se cambian fuentes, identidad ni derechos de imágenes. Un conjunto limitado evita permitir `q` arbitrarios.
- Test de contrato `node --test scripts/qa/next-image-qualities.test.mjs`; ejecución vía CI de hidratación. **No afirmar performance o mejora visual sin medidas.** La configuración aún NO está desplegada.

## Último checkpoint de continuidad · 26 noviembre 2026

- PR #214 fusionado, `main` en `5ba7349`; Railway web/api SUCCESS verificados.
- PR #216 DRAFT: reparación acotada de `data-theme`, diagnósticos de hidratación Next dev + producción aislada; sobre SHA `f506da8`, ambos jobs SUCCESS y 12/12 rutas-tema sin errores, y observación en web pública 8/8 HTTP 200 sin hydrationErrors. **El #418 previo NO se reprodujo en observación puntual tras el deploy.** No se ha fusionado ni desplegado la corrección actual.
- Nuevo bloque de compatibilidad: `next.config.mjs` `images.qualities [75,85,95]`, prueba de contrato; pendiente CI del HEAD posterior.
- Handoff de entrada actualizado (`AGENTS.md`, `AROMIA_MASTER_HANDOFF.md`, `docs/handoffs/AROMIA_LATEST.md`, expediente Gate02). El estado 1/10, Gate02 no certificado, derechos de imágenes y autorizaciones se mantienen.
