# Aromia — Living Edition: auditoría renderizada (18 nov 2026)

**Estado:** `QA_EVIDENCE` · medido en un navegador real (Chromium) · **no** es revisión de dirección de arte ni de lector de pantalla · Gate 05 sigue `planned` (1/10).
**Herramienta reproducible:** `scripts/qa/editorial-render-audit.cjs` (solo GET; Playwright instalado fuera del repo vía `PLAYWRIGHT_PACKAGE_PATH`, como `admin-browser-smoke.cjs`).
Mide por ruta, en móvil/escritorio y tema claro/oscuro: desbordes, alt, encabezados, nombres accesibles, contraste WCAG, legibilidad (tamaño, interlineado, medida), CLS/LCP/peso, imágenes sobredimensionadas, movimiento reducido e integridad editorial (marcas internas filtradas, placeholders, imágenes rotas, enlaces comerciales sin `sponsored`).

## Dos correcciones a mi trabajo anterior (importantes)

Mi informe previo de esta jornada decía «0 hallazgos reales» en la auditoría renderizada. **Era incorrecto en dos puntos**, descubiertos al medir con más cuidado:

1. **El modo oscuro no se estaba probando.** El sitio **ignora `prefers-color-scheme`**; el tema depende de `localStorage['aromia_theme']`. Mis corridas «claro y oscuro» midieron el tema claro dos veces. El script ahora fija la clave y marca `THEME_NOT_APPLIED` si el tema pedido no se aplicó.
2. **El «artículo» auditado era la página 404.** `GET /api/articulos/<slug>` devuelve **500 en producción** para todo artículo individual (el bloqueo ya anotado: probable migración 022 sin aplicar; **no se tocó**), y la web lo muestra como «Esta pista no está en Aromia». Hoy **ningún artículo de la revista se puede leer en producción**. Además, esa página responde **HTTP 200** (y también cualquier slug inexistente), con `<meta name="robots" content="noindex">`: mitigado para buscadores, pero no es un 404 real.

Para auditar artículos reales sin tocar producción se montó una pila **local desechable** (PostgreSQL 16 con solo las migraciones 006, 010, 021 y 022, API compilada y web), con dos artículos marcados como datos de prueba.

## Defectos encontrados y corregidos (con evidencia antes → después)

| # | Defecto | Medición | Corrección |
|---|---|---|---|
| 1 | **Desplazamiento de diseño del pie** en `/buscar`, `/perfumistas`, `/descubrir/familias` y ficha de catálogo: el estado de carga reservaba `min-h-[62vh]`, así que el pie quedaba a la vista y saltaba ~2.600 px al llegar el contenido | CLS **0,22–0,30** → desaparece en esas rutas (máx. 0,039 en todo el barrido sobre el build de producción local) | `min-h-[100svh]` en los 4 `loading.tsx` (solo altura reservada, sin cambio visual) |
| 2 | **Enlaces del cuerpo del artículo invisibles en modo oscuro** (`prose` de Tailwind Typography fijaba `rgb(23,23,23)`) | **1,05:1** → **16,62:1**; pie de foto 4,35:1 claro / 3,95:1 oscuro → **5,85:1 / 9,27:1** | `prose-a:text-ink prose-figcaption:text-muted` (tokens del sitio) en `magazine/[slug]/page.tsx` |
| 3 | **Lector paginado sin semántica de diálogo**: sin `role`/`aria-modal`/nombre, foco se quedaba en el botón de detrás, sin trampa de foco, scroll del fondo libre, el foco no volvía al botón al cerrar | Verificado en navegador (desktop y móvil) antes/después; 5 pruebas jsdom (+ 2 mutaciones que las hacen fallar) | `PageFlipReader.tsx`: `role="dialog" aria-modal`, nombre accesible, foco inicial en «Cerrar», trampa de Tab/Shift+Tab, bloqueo de scroll y devolución del foco |
| 4 | Rótulo de 10 px del lector con **4,15:1** | → **4,53:1** | `#8d7144` → `#866b41` (~5 % más oscuro; la vista de impresión sobre blanco ya cumplía y no se tocó) |

Verificado de punta a punta con la API real: un enlace de Amazon puesto en el editor con `rel="follow"` sale como `sponsored nofollow noopener noreferrer` en la API, en la página y dentro del lector (corrección del hito 07).

Sin hallazgos (medido): desbordes horizontales, imágenes sin `alt`, saltos de encabezado, `h1` por página, nombres accesibles, campos sin etiqueta, imágenes rotas, enlaces vacíos, marcas internas filtradas al lector, movimiento infinito con `prefers-reduced-motion`, errores de consola, CLS en artículos (máx. 0,004).

## Hallazgos que NO se corrigieron (decisión o diseño del Publisher)

- **Imágenes sobredimensionadas** (bytes desperdiciados): figura dentro de un artículo 2160×1440 mostrada a 740 px **sin `srcset`** (el HTML sanitizado no pasa por `next/image`); `/api/catalog-image/erba-pura` 1500×1500 mostrada a 231 px (6,5×); recortes de `/descubrir` ~3×; miniatura `clary-sage-herbarium` pedida a 1080 px para mostrarse a 160 px (atributo `sizes`). Arreglarlo exige una decisión de pipeline de imágenes.
- **El lector se muestra a 280×420 px también en una pantalla de escritorio de 1280×800.** Es una decisión de diseño; requiere la mirada del Publisher.
- **Soft-404:** páginas inexistentes devuelven 200 con `noindex`. Un 404 real exige cambiar cómo se maneja el streaming; no se tocó.
- **LCP indicativo de 3,7–5,2 s en la ficha de catálogo** (máquina local y proxy que descarga la imagen de origen sin caché); medir en producción antes de concluir.
- `/privacidad` usa 15 px en el cuerpo (informativo; la vista de impresión usa 11 pt a propósito).
- **Contraste sobre fondos con imagen o degradado no se mide** (se cuenta como omitido, no como aprobado).

## Qué falta para el hito 05

Esta auditoría cubre contraste, legibilidad, rendimiento básico, accesibilidad del DOM e integridad de marcas. El mandato también pide **«una pieza editorial completa, visualmente revisada y reproducible»**: falta la revisión visual del Publisher y una pieza real con assets aprobados (hoy ningún artículo se puede servir desde producción). Con el endpoint de artículos en 500, no hay pieza que revisar en producción.

## Reproducir

```powershell
$env:PLAYWRIGHT_PACKAGE_PATH = "<carpeta con playwright o playwright-core>"
$env:CHROME_PATH = "<ruta a chrome.exe, opcional>"
$env:ROUTES_ONLY = "1"   # audita solo las rutas indicadas
node scripts/qa/editorial-render-audit.cjs http://localhost:3100 .\salida "/,/magazine,/buscar"
```
Usar `localhost` (no `127.0.0.1`) con `next dev` en Next 16: bloquea orígenes distintos y la página no se hidrata. Para peso y CLS usar `next build` + `next start`; los tiempos locales son indicativos.
