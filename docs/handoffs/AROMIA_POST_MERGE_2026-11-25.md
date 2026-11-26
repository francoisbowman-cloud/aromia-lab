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
