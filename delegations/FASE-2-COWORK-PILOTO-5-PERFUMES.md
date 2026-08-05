# Brief para Cowork — Piloto de 5 perfumes (Fase 2)

**Fase:** Fase 2 — Piloto visual de cinco perfumes
**Deriva de:** `delegations/COWORK-IMAGE-INVENTORY-BRIEF.md` (Fase 1), con el
mismo criterio y las mismas columnas, **acotado exclusivamente a las 5 filas
`catalog-primary` de estos perfumes** — no las 50 del inventario completo.
**Punto de partida:** `data/image-inventory.csv`, `docs/images/PILOT-PLAN.md`
**Entregado por:** Code

---

## Los 5 perfumes de esta tanda (no procesar ningún otro)

| # | Perfume | Marca | Slug | `source_url` (imagen actual) |
|---|---|---|---|---|
| 1 | Aventus | Creed | `aventus` | `https://m.media-amazon.com/images/I/71nY6hb7uuL._SL1500_.jpg` |
| 2 | Baccarat Rouge 540 EDP | Maison Francis Kurkdjian | `baccarat-rouge-540-edp` | `https://m.media-amazon.com/images/I/71xVLhLWrvL._SL1500_.jpg` |
| 3 | Sauvage EDP | Dior | `sauvage-edp` | `https://m.media-amazon.com/images/I/51F8MEfiKgL._SL1000_.jpg` |
| 4 | Black Opium EDP | Yves Saint Laurent | `black-opium-edp` | `https://m.media-amazon.com/images/I/71w9icubQlL._SL1500_.jpg` |
| 5 | Erba Pura | Xerjoff | `erba-pura` | `https://m.media-amazon.com/images/I/51h-KPGkCWL._SL1500_.jpg` |

**Atención con Sauvage**: existe otro perfume en el catálogo real,
`sauvage-elixir`, que es un producto distinto. No lo confundas ni lo incluyas
— esta tanda es solo `sauvage-edp`.

## Tarea exacta

Para estas **5 filas** (`image_role = catalog-primary`) de
`data/image-inventory.csv`, completar los mismos 7 campos que especifica el
brief original de Fase 1:

- `original_width`, `original_height`, `aspect_ratio` (formato `ancho:alto`
  simplificado, ej. `4:5`, no decimal) — dimensiones reales de la imagen en
  `source_url`.
- `background_type`: `white-studio` | `gray-studio` | `transparent` |
  `lifestyle-scene` | `other` (especificar en `notes` si es `other`).
- `product_crop`: `full-bottle` | `partial-crop` | `heavy-crop` |
  `unknown-not-visible`.
- `visual_quality`: `high` | `medium` | `low` (nitidez, resolución suficiente
  para 640×800 sin pixelar, sin watermark visible del retailer).
- `license_status`: `official-brand` | `affiliate-approved` | `licensed` |
  `generated` | `unknown` | `replace-required`. Por defecto esperado
  `affiliate-approved` (las 5 son fotos de Amazon dentro del programa de
  afiliados), **pero no lo asumas sin verificar** — si algo no cuadra, usá
  `unknown` y explicá por qué en `notes`.

No toques las filas `editorial-hero` de estos 5 perfumes (los mockups OVL en
`apps/web/public/ovl/`) — eso es un sistema aparte, fuera de este brief.

## Diferencia con el brief de Fase 1

Mismo formato, mismos criterios, mismas prohibiciones — la única diferencia es
el alcance: 5 filas en vez de 50. Esto es intencional: es un piloto para
validar el proceso de delegación antes de escalarlo al catálogo completo.

## Formato de entrega

`data/image-inventory.csv` completo (las 100 filas, sin tocar ninguna fuera de
las 5 indicadas), con los 7 campos llenos solo en esas 5 filas
`catalog-primary`. Agregar en `notes`: fecha de revisión (`YYYY-MM-DD`) y
cualquier hallazgo (ej. "imagen no carga", "hay watermark visible").

## Prohibiciones (idénticas a Fase 1, repetidas para esta tanda)

- No modificar `apps/api/data/PERFUMES_INITIAL_50.csv` ni la copia de la raíz.
- No modificar código de `apps/web/` ni `apps/api/`.
- No descargar ni publicar imágenes — solo observación/clasificación.
- No hacer commit ni push — devolver el CSV, Code lo integra.
- No inventar datos por inferencia o patrón — cada valor debe corresponder a
  lo que **viste realmente** al abrir esa `source_url` específica.
- No aprobar visualmente el resultado — esa evaluación es de ChatGPT
  (`delegations/FASE-2-CHATGPT-PILOTO-5-PERFUMES.md`) y de Brey, no de Cowork.
- No cambiar `imagen_url` de ningún perfume en ningún lado.

## Procedimiento de devolución

1. Entregar `data/image-inventory.csv` completo.
2. Resumen corto (2-3 líneas): cuántas de las 5 filas quedaron con algún campo
   en `unknown` y por qué.
3. Code valida antes de integrar — cualquier valor no verificable vuelve a
   Cowork con la pregunta puntual, no se corrige a mano.
