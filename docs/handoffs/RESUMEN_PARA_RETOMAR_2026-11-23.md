# Aromia — resumen para retomar en un chat limpio (2026-11-23)

Léelo junto con `docs/handoffs/AROMIA_LATEST.md` (hitos 05–07) y `AROMIA_MASTER_HANDOFF.md`. Si algo de aquí contradice lo que devuelve un comando, manda el comando.

## Dónde estamos
- Repo `francoisbowman-cloud/aromia-lab`, rama de trabajo **`claude/aromia-integration`**, HEAD subido `cfcc5b3` (al día con origin). **PR #214**: DRAFT, RELEASE HOLD, base `main`, mergeable/CLEAN. 248 commits por delante de `main`, 0 por detrás, 204 archivos.
- Progreso oficial de gates: **1/10**, sin certificar nada nuevo.
- **`main` = producción**: Railway despliega cada push y `main` no tiene protección (`gh api .../branches/main/protection` da 404). Merge a `main` = deploy.
- **Producción hoy corre Next 14.2.35 + React 18.** El PR #214 sube a **Next 16.4.6 + React 19.3 + Tiptap 3.34**. CI compila y pasa, pero ese salto **nunca se ha desplegado** ni probado en un entorno tipo Railway.

## Hecho hoy (2026-11-23)
1. **Migración 022 aplicada en producción** (`articles.contenido_markdown`). Antes `GET /api/articulos/:slug` daba 500; ahora 200. Verificado en vivo.
   - **Patrón que funciona para escribir en producción:** `railway ssh --service api --environment production` y, dentro del contenedor, `node scripts/apply-migration.js <archivo>.sql`. Postgres ya no tiene `DATABASE_PUBLIC_URL`, así que el camino viejo con `railway run` no llega a la base. Está en memoria (`reference_production_write_pattern`).
2. **Lector paginado:** una página grande en escritorio (commit `742a1ef`). Medido: 280×420 → 480×720 a 1280×800; 327×491 en móvil 375. No verificadas las páginas interiores con texto largo.
3. **Imágenes sin srcset:** corregido solo `sizes` de las miniaturas de `/academia` (commit `2bf94d6`; móvil 640/828w → 384w).
4. **Decisiones de Brey:** recortes de `/descubrir` sin cambio (134 KB en total); `/api/catalog-image` en opción A (se deja: 32–51 KB, 0,4–1,8 s por petición); soft-404 (200 + `noindex` en `/magazine/[slug]` y `/catalogo/[slug]`) en opción A (se deja).
5. Handoff actualizado (hitos 06 y 07) y subido.

## Lo que NO se ha hecho / sigue abierto
- **Merge del PR #214:** pedido por Brey el 23/11, **frenado por el gate de pre-deploy** (ver abajo). No se ha mergeado nada.
- **Migraciones 024–029** (Intelligence: jobs, artifacts, editorial_review, visual_review_journal, visual_review_decisions, intelligence_runs) **no están aplicadas en producción**. Las trae el PR. No sé si la 023 (`media_uploads`, ya en `main`) está aplicada: no hay lectura directa de la base.
- `NEXT_PUBLIC_GA_ID` no tiene `ARG` en `apps/web/Dockerfile` (preexistente): llega vacía a producción.
- Dos migraciones `021_*` conviven (preexistente), orden ambiguo en `migrate.ts`.
- Figuras dentro de artículos (2160×1440 a 740 px, HTML sanitizado sin `srcset`), política de procedencia de imágenes (125/125 remotas, `/api/catalog-image` re-sirve imágenes de terceros), iconos y manifest de PWA, Gate 02 (runtime persistente, scheduler, alertas, aprobación Publisher), piloto editorial 01 (revisión humana de fuentes: Dalton 2000 y P&F sin leer).
- Revisión visual del Publisher: se hace con los artículos existentes (p. ej. `/magazine/guia-perfumes-invierno`, `/guia-perfumes-verano`, `/guia-perfumes-primera-cita`, `/guia-primer-perfume-nicho`). Los de categoría `academia` redirigen a `/academia`.
- La ingesta SubBatch 01 (`ingest-subbatch01.js`) **no corre en producción** (lee `drafts/`, que no está en la imagen, e inserta como borrador). Decisión: no usarla.

## Gate de pre-deploy del PR #214 (aromia-predeploy)
1 diff PASA · 2 local PARCIAL (tsc/eslint/tests del lector; build completo lo cubre el CI) · 3 CI PASA sobre `2bf94d6` (sin checks fallidos/pendientes; releer antes de mergear) · 4 **FRENA** (`GA_ID`, preexistente) · 5 PASA (sin rutas borradas) · 6 **FRENA** (024–029 sin aplicar + doble `021`) · 7 PASA con nota (`visualEvidence.ts` usa `fs`, solo ruta admin) · 8 PASA (125 en preflight, workflow y audit; la API pública devuelve 125) · 9 PASA (rutas nuevas solo `/admin` y `/api/admin`).

## Actualización 2026-11-24 (prueba de imagen Docker)
- Build del Dockerfile de `web` con Next 16.4.6 OK (42 páginas estáticas); arranca en ~1 s, preflight catálogo PASS 125. 17 rutas con el mismo código HTTP que producción.
- **Migraciones 024–029 NO bloquean el merge:** son opt-in (`migrationPolicy.ts`), `INTELLIGENCE_ENABLED` no existe en prod, rutas admin de Intelligence dan 503. Solo hace falta aplicarlas si se activa Intelligence.
- **GA:** `NEXT_PUBLIC_GA_ID` no existe como variable en `web` (GA apagado hoy). Se añadió el `ARG` en `apps/web/Dockerfile`; solo surte efecto si se crea la variable.
- **PENDIENTE — error de hidratación React #418** (text mismatch) en la imagen local con Next 16/React 19, visto en `/`, `/academia`, `/catalogo/santal-33` y el artículo. Producción actual (Next 14) ya tiene la misma familia (#425/#422) en el artículo, así que no es regresión. Causa no encontrada (el año del footer se descarta). Siguiente paso: build de desarrollo para ver el mensaje completo. El lector paginado no se probó de forma interactiva en la imagen.

## Para retomar: orden sugerido
1. Decidir el merge del #214 con las opciones de abajo.
2. Si se mergea: aplicar 024–029 una por una por `railway ssh` (OK por migración), `gh pr ready 214`, merge, y verificar en vivo (deploy terminado, `www.aromialab.com` 200, `/magazine/guia-perfumes-invierno`, lector, `/academia`, API 200).
3. Después: figuras de artículo, política de procedencia, PWA, Gate 02.

## Reglas operativas vigentes
- Sin guardas mecánicas (hooks eliminados el 18/11): pedir OK textual para merge, deploy, escritura en producción, gasto y push fuera de `claude/aromia-integration`.
- Producción: lecturas públicas libres; escrituras solo con OK de Brey y por `railway ssh`.
- El proyecto **Faceless_Studio** es independiente de Aromia: no se trata aquí.
