# Draft de redirects v1 → v2 (para revisión de Brey, sin activar todavía)

Este documento es un **borrador técnico**, no un `next.config.mjs` activo. Antes
de implementar los redirects reales hay que confirmar los casos marcados como
⚠️ — hoy no tienen un equivalente 1:1 claro en v2.0. Los ✅ son coincidencia de
slug/tema directa, listos para activar tal cual.

## Páginas raíz

| v1 (`main`) | v2 (`feature/v2.0`) | Estado |
|---|---|---|
| `/index.html` (o `/`) | `/` | ✅ directo |
| `/catalogo.html` | `/perfumes` | ✅ directo |
| `/catalogo.html?p=ID` (deep-link a un perfume) | `/perfumes/[slug]` | ⚠️ no tengo la tabla de `ID` numérico de v1 → `slug` de v2 — si importa preservar el link equity de esos deep-links específicos, hace falta ese mapeo (no existe en el repo) |
| `/magazine.html` | `/articulos` | ✅ directo |
| `/lab.html` (armador de quiz de v1) | `/quiz` | ⚠️ mismo propósito general (quiz), pero la UX de `lab.html` puede ser distinta — confirmar que el reemplazo es aceptable |
| `/academia.html` | `/articulos` (categoría `academia` existe en el schema, pero **0 artículos** la usan hoy) | ⚠️ sin contenido real todavía del lado v2 |
| `/club.html` | — sin equivalente | ⚠️ no hay página de club/membresía en v2 — definir si se recrea o se retira |
| `/privacidad.html` | — **no existe ninguna página de privacidad en v2** | ⚠️ gap real: falta crear `/privacidad` en v2 antes del corte, si v1 la tiene por requisito legal/de plataforma (Amazon Associates suele exigirla) |
| `/admin/imagenes.html` | — | Sin redirect: es herramienta interna de v1 (`noindex`), no público |

## Artículos (`articles/*.html` en v1 → `/articulos/[slug]` en v2)

| v1 | v2 | Estado |
|---|---|---|
| `resena-baccarat-rouge-540.html` | `/articulos/resena-baccarat-rouge-540` | ✅ mismo slug |
| `resena-santal-33.html` | `/articulos/resena-santal-33` | ✅ mismo slug |
| `guia-perfumes-verano-2026.html` | `/articulos/guia-perfumes-verano` | ⚠️ mismo tema, slug distinto — confirmar que el contenido de v2 reemplaza al de v1 (puede tener ángulo/keyword distinto, el nombre trae "2026") |
| `resena-sauvage-dior.html` | sin reseña individual en v2 (solo existe `comparativa-sauvage-vs-bleu-de-chanel`) | ⚠️ elegir: redirigir a `/perfumes/sauvage-edp` (ficha de producto) o a la comparativa |
| `resena-bleu-de-chanel.html` | ídem | ⚠️ redirigir a `/perfumes/bleu-de-chanel-edp` o a la comparativa |
| `resena-black-opium.html` | sin reseña individual (solo `comparativa-black-opium-vs-good-girl`) | ⚠️ redirigir a `/perfumes/black-opium-edp` o a la comparativa |
| `resena-good-girl.html` | ídem | ⚠️ redirigir a `/perfumes/good-girl` o a la comparativa |
| `resena-aventus-creed.html` | sin reseña individual (solo `comparativa-aventus-vs-layton`) | ⚠️ redirigir a `/perfumes/aventus` o a la comparativa |
| `resena-acqua-di-gio.html` | sin equivalente de artículo | ⚠️ redirigir a `/perfumes/acqua-di-gio-edt` (fallback a ficha de producto) |
| `resena-le-male.html` | sin equivalente | ⚠️ redirigir a `/perfumes/le-male` |
| `resena-light-blue.html` | sin equivalente | ⚠️ redirigir a `/perfumes/light-blue` |
| `resena-oud-wood.html` | sin equivalente | ⚠️ redirigir a `/perfumes/oud-wood` |
| `resena-terre-hermes.html` | sin equivalente | ⚠️ redirigir a `/perfumes/terre-d-hermes-edt` (confirmar slug exacto) |
| `comparativa-sauvage-vs-y-ysl.html` | sin equivalente (v2 no tiene esta comparativa) | ⚠️ sin destino claro — ¿redirigir a `/articulos` (hub) o escribir el artículo en v2 antes del corte? |
| `como-elegir-perfume-oficina.html` | sin equivalente | ⚠️ sin destino claro |
| `estela-proyeccion-longevidad-diferencias.html` | sin equivalente (aunque el concepto ya vive en la ficha de producto, bloque "radar olfativo") | ⚠️ sin destino claro — ¿redirigir a `/perfumes` con nota, o a un perfume ejemplo? |
| `nicho-vs-disenador-diferencias.html` | sin equivalente | ⚠️ sin destino claro |
| `perfumes-noche-eventos-especiales.html` | sin equivalente | ⚠️ sin destino claro |
| `perfumes-otono-invierno-calidos.html` | parecido a `guia-perfumes-invierno` de v2, pero no idéntico | ⚠️ confirmar si equivale |
| `perfumes-unisex-recomendados.html` | sin equivalente | ⚠️ sin destino claro |
| `piramide-olfativa-explicada.html` | sin equivalente (concepto educativo, categoría `academia` sin usar) | ⚠️ sin destino claro |

## Resumen

- **2 de 20** artículos con coincidencia de slug exacta.
- **1 de 20** con tema equivalente pero slug distinto (verificar contenido).
- **17 de 20** sin ningún artículo equivalente en v2 todavía — 8 de esos al menos
  tienen una ficha de producto real a la que redirigir como fallback razonable
  (mejor que un 404, aunque no es "artículo por artículo"); los otros 9 no
  tienen ningún destino obvio.
- **Páginas raíz**: 3 de 8 son redirect directo, el resto necesita una decisión
  (deep-links de catálogo, quiz, academia, club, y la página de privacidad que
  falta por completo en v2).

**Recomendación:** para los 9 artículos sin ningún destino razonable y para
`club.html`, la opción más simple para no perder el tráfico indexado es
redirigir al hub más cercano (`/articulos` o `/perfumes`) en vez de dejarlos
en 404 — pero es una decisión de contenido/SEO, no técnica, así que la dejo
sin asumir. Confirmame los ⚠️ y activo el redirect real en
`apps/web/next.config.mjs`.
