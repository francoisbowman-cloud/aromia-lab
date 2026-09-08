# Barrido post-deploy — Tanda C (PR #154) + sub-batch 05 (PR #153)

**Fecha:** 2026-09-08
**Actor:** Code
**Contra:** producción `https://aromialab.com` — commit `b15e0466214b302a433e7fa07d1f640f48f1c328`
**Harness:** playwright-core + chromium-1228, en scratchpad (no versionado); script
`tandac-sweep.mjs`.

## Alcance

10 superficies que Tanda C tocó (§4.7–4.11) × 5 viewports (390, 768, 1280, 1440,
1728) × claro/oscuro = **100 registros**, más una pasada de enlaces muertos sobre
70 hrefs internos únicos recogidos del DOM.

Superficies: Home, `/descubrir/familias`, `/descubrir/familias/amaderada`,
`/perfumistas`, `/perfumistas/dominique-ropion`, `/academia`, `/magazine`,
`/magazine/resena-santal-33`, `/catalogo/aventus`, `/quiz`.

## Deploy

Railway proyecto `aromia-lab-v2`, ambos servicios en `b15e046`:

- `web` (`3d9914b1`) — SUCCESS 20:19:14Z
- `api` (`0bdacc5f`) — SUCCESS 20:17:50Z

## Resultado — Tanda C sin regresión

| Chequeo | Resultado |
|---|---|
| HTTP 200 | 96/100 directos; los 4 restantes (Home @1440 y @1728, ambos temas) fueron **timeout de `networkidle`** del harness sobre el optimizador de imágenes en frío, no un fallo de la página. Re-sondeo dirigido con `domcontentloaded` + reintento: **200, 0 desborde, 0 imágenes fallidas/externas** en los cuatro. Es exactamente el `KNOWN_NONBLOCKING_TECH_DEBT` de v46 (variante `w=3840` de retratos en viewport ancho). |
| Desborde horizontal | 0 en los 100 registros |
| Imágenes externas | 0 |
| Imágenes fallidas | 0 |
| Enlaces internos muertos | 0 páginas rotas. Único no-2xx: `GET/HEAD /api/catalog-buy/aventus` → 405, que es la respuesta correcta de ese endpoint a un método distinto de su verbo real (se navega por redirección de servidor). Pre-existente, no de Tanda C. |
| `.breadcrumb-link` / objetivos táctiles (§4.11) | Sin enlaces rotos ni desborde en las páginas con breadcrumb; el mínimo táctil que ve el sondeo en desktop (16 px) corresponde a enlaces de texto en línea del cuerpo, no a los breadcrumbs, cuyo `min-height:44px` sólo aplica en `pointer:coarse`. |

Los cambios globales de Tanda C (`editorial.css` sólo `.ev1-deck`;
`home-story-rhythm.css` sólo `.ev1-cover-lead*`, que es Home; `globals.css`
**puramente aditivo**: `.jump-link` y `.breadcrumb-link` nuevas, sin pisar
selectores) no pueden alterar color ni layout de ninguna superficie fuera de las
listadas. Confirmado por diff.

## Hallazgo nuevo — NO es regresión de Tanda C

**`/magazine/[slug]` — héroe de artículo, título ilegible en modo claro.**

En `/magazine/resena-santal-33`, modo **claro**, en los 5 viewports:

- `h1` del artículo ("Santal 33 de Le Labo: el amaderado que definió una
  estética") renderiza en un **serif crema muy claro sobre el papel crema**
  (ratio de contraste medido ≈ **1.09:1** a 44–80 px). Prácticamente invisible.
- Antetítulo `RESEÑA` en oro pálido — ≈ 1.53:1.

En modo **oscuro** el mismo `h1` es blanco sobre casi-negro y se lee bien; el
único aviso en oscuro es un CTA pequeño "Iniciar lectura" a ≈ 2.3:1 @13 px.

**No lo introdujo PR #154:** ningún archivo del commit toca el color del título
de la ficha de artículo. Es un defecto pre-existente del tratamiento de héroe de
`/magazine/[slug]` —texto claro pensado para ir sobre una imagen de fondo que en
esta plantilla no está—, de la misma familia que el que Tandas A+B corrigieron en
`.ev1` para portada e historias, pero en una superficie que aquella tanda no
barrió. Capturas `light-1280/magazine-articulo.png` y `dark-1280/...` en el
scratchpad.

Queda anotado en el relay como **P1 de contraste sin dueño** (capa de Diseño),
separado del cierre de Tanda C.
