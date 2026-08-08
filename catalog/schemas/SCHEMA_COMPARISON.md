# Comparación de schemas — batch de Cowork vs modelo actual de Aromia

Fase 3, Bloque A. Compara el schema propuesto por Brey/Cowork en el brief de
Fase 3 (`catalog/schemas/catalog.schema.json`) contra el modelo real ya en
producción (`schema/perfume.schema.json` + tabla `perfumes`,
migraciones `apps/api/migrations/001_create_perfumes.sql` y
`002_add_nicho_o_comercial.sql`). Ningún campo de Cowork se renombra ni se
elimina — este documento es el mapeo, no un reemplazo.

## 1. Mapeo campo a campo

| Campo Cowork (`catalog.schema.json`) | Campo Aromia (`perfume.schema.json`) | Estado |
|---|---|---|
| `id` | — (no existe) | Nuevo. ID del batch, no la PK de Postgres (`SERIAL`). Se conserva como `source_batch_id` en el reporte de importación para trazabilidad, nunca se escribe en `perfumes.id`. |
| `slug` | `slug` | Compatible 1:1, mismo patrón `^[a-z0-9]+(-[a-z0-9]+)*$`. |
| `brand` | `marca` | Compatible, requiere mapeo de nombre de columna. |
| `name` | `nombre` | Compatible, requiere mapeo de nombre de columna. |
| `concentration` | `concentracion` | Ver #A — enum ampliado. |
| `gender` | `genero` | Ver #B — valores en inglés vs español. |
| `family` | `familia_olfativa` | Compatible, ambos freeform. |
| `subfamily` | — (no existe) | Nuevo. Sin destino en Postgres todavía — ver #C. |
| `launch_year` | — (no existe) | Nuevo — ver #C. |
| `perfumer` | — (no existe) | Nuevo — ver #C. |
| `country` | — (no existe) | Nuevo — ver #C. |
| `description` | — (no existe, hay `descripcion_corta`) | Ver #D. |
| `top_notes` | `notas_salida` | Compatible, misma convención `;`. |
| `heart_notes` | `notas_corazon` | Compatible. |
| `base_notes` | `notas_fondo` | Compatible. |
| `accords` | — (no existe) | Nuevo — ver #C. |
| `season` | `temporada_recomendada` | Ver #B — valores en inglés vs español. |
| `occasion` | `ocasion` | Compatible, ambos freeform separados por `;`. |
| `longevity` | — (no existe) | Nuevo, sin escala definida por el brief — ver #E. |
| `sillage` | — (no existe) | Nuevo, sin escala definida por el brief — ver #E. |
| `price_segment` | `categoria_precio` | Ver #F — Cowork no manda precio numérico. |
| `amazon_url` | `link_afiliado` | Compatible semánticamente, no es 1:1 (Aromia no asume Amazon específicamente). |
| `source_url` | — (no existe) | Nuevo — metadato de sourcing, no se persiste en `perfumes`, queda en el reporte de trazabilidad. |
| `image_url` | `imagen_url` | Compatible, con matiz — ver #G. |
| `image_source` | — (no existe) | Nuevo — metadato de sourcing, igual que `source_url`. |
| `affiliate_status` | — (no existe) | Nuevo — hoy no hay estado de link, solo la URL. |
| `source_verified` | — (no existe) | Nuevo — metadato de auditoría del dato. |
| `data_confidence` | — (no existe) | Nuevo — metadato de auditoría del dato. |
| `visual_quality` | — (no existe) | Nuevo — se solapa conceptualmente con el sistema de imágenes de Fase 1 (`scripts/images/metadata.schema.json`), no es el mismo campo. |
| `review_status` | — (no existe) | Nuevo — estado editorial interno del pipeline, no de producción. |
| `seo_title` / `seo_description` | — (no existen) | Nuevos — hoy el SEO de ficha de producto no tiene campos propios en `perfumes`. |
| `status` | `estado` (migración 004) + `activo` (boolean) | Ver #H — no son el mismo concepto. |
| `created_at` / `updated_at` | `creado_en` / `actualizado_en` | Compatible, gestionados por Postgres en producción; en el pipeline los genera `normalize.mjs` si faltan. |
| — (no existe en Cowork) | `nicho_o_comercial` | Falta en el schema de Cowork. Ver #I. |
| — (no existe en Cowork) | `moneda` | Falta — consecuencia directa de #F (no hay precio numérico). |
| — (no existe en Cowork) | `rating_promedio` | Falta — no pedido por el brief, opcional en Aromia. |
| — (no existe en Cowork) | `tienda` | Falta — parcialmente cubierto por `image_source`/`affiliate_status`, no es 1:1. |
| — (no existe en Cowork) | `articulo_relacionado_slug` | Falta — cruce con `articles`, fuera del alcance del batch de catálogo. |

## 2. Incompatibilidades y decisiones tomadas en Bloque A

**#A — `concentration`/`concentracion`: dejó de ser un enum cerrado
(actualizado en F3.6, corregido tras el batch-001 real).** Aromia tenía
`EDT | EDP | Parfum | EDC`. El brief original de Fase 3 pedía distinguir
explícitamente `Extrait` y `Elixir` como variantes propias (Sauvage EDT /
EDP / Parfum / Elixir son productos distintos) — eso se resolvió primero
ampliando el enum a `EDC | EDT | EDP | Parfum | Extrait | Elixir`. Pero el
batch-001 real trajo `'Parfum Cologne'` (nomenclatura propia de Roja
Parfums, casas de nicho/ultra-lujo) — ningún enum cerrado razonable la
contempla sin perder información real. **Decisión final:** `concentration`
es `string` libre en `catalog.schema.json` (sin `enum`); `validate.mjs`
sigue marcando como `warning` (nunca `error`) cualquier valor fuera del
set canónico conocido (`lib.mjs#CONCENTRATION_ENUM`), para que quede
visible sin bloquear filas legítimas. **Pendiente para una fase futura:**
proponer la ampliación equivalente en `schema/perfume.schema.json` + una
migración `011_extend_concentracion_enum.sql` antes de importar cualquier
fila con `Extrait`/`Elixir`/nomenclatura propia a producción — no se toca
esa migración en esta fase (regla de seguridad: no tocar Postgres sin
aprobación).

**#B — Valores en inglés (`gender`, `season`) vs español (`genero`,
`temporada_recomendada`).** Cowork entrega `male/female/unisex` y
`spring/summer/fall/winter`; Aromia usa `masculino/femenino/unisex` y
`primavera/verano/otoño/invierno`. Se resuelve con una tabla de mapeo fija en
`scripts/catalog/lib.mjs` (`GENDER_MAP`, `SEASON_MAP`), aplicada solo en el
momento de generar la propuesta de importación (`prepare-import.mjs`) — el
CSV maestro y el batch conservan los valores en inglés tal como los entrega
Cowork, no se traducen "en el origen".

**#C — Campos nuevos sin destino en Postgres hoy** (`subfamily`,
`launch_year`, `perfumer`, `country`, `accords`, `source_url`,
`image_source`, `affiliate_status`, `source_verified`, `data_confidence`,
`visual_quality`, `review_status`, `seo_title`, `seo_description`). No se
descartan. Se conservan íntegros en `aromia-catalog-master.csv` (fuente de
verdad del catálogo ampliado) y en los reportes de importación. La
importación real a Postgres (Bloque D/E, cuando se autorice) decide, campo
por campo, cuáles pasan a columnas nuevas (vía migración futura, fuera de
esta fase) y cuáles quedan solo como metadato de trazabilidad del pipeline.
Ninguno bloquea la validación por no tener destino todavía.

**#D — `description` (Cowork) vs `descripcion_corta` (Aromia).** No son el
mismo campo: `descripcion_corta` está pensada para tarjetas de listado
(1-2 líneas), `description` de Cowork no tiene ese límite implícito en el
brief. Se tratan como campos distintos, no se fusionan — si en la
importación real se decide truncar `description` a `descripcion_corta`, esa
es una decisión de producto a confirmar con Brey, no una normalización
automática del pipeline.

**#E — `longevity`/`sillage` sin escala definida por el brief.** El brief
menciona estos campos en el reporte de resumen pero nunca especifica sus
valores posibles. Code asumió una escala ordinal
(`short/moderate/long/very_long` y `light/moderate/strong/very_strong`),
documentada como asunción explícita en `catalog.schema.json` (campo
`notes.enums_asumidos`). **Se revisa contra el batch-001 real de Cowork en
cuanto llegue** (Bloque E) — si Cowork usa otra escala (ej. numérica en
horas, o 1-10), se ajusta el schema, no se fuerza el dato a la escala
asumida.

**#F — `price_segment` sin precio numérico.** El schema de Cowork no incluye
`precio_referencia` ni `moneda` (que sí existen en Aromia). Esto es
consistente con el brief (Cowork hace sourcing de datos de producto, no de
precios) — se documenta como gap conocido, no como error. La importación
real no va a poder poblar `precio_referencia`/`moneda` desde el batch de
Cowork; quedan como `null` hasta que exista otra fuente (scraper Awin,
mencionado en el CLAUDE.md raíz, hoy no conectado a este pipeline).

**#G — `image_url`: URL absoluta vs ruta relativa del sistema de
imágenes.** Aromia (Fase 1, `scripts/images/`) usa un patrón de archivo
propio (`{slug}--{rol}--v{NN}--{ancho}x{alto}.{ext}` bajo
`apps/web/public/images/perfumes/`), no necesariamente una URL http(s). El
schema de Cowork asume una URL de imagen externa (fuente del sourcing,
todavía sin pasar por el pipeline de imágenes). `validate.mjs` acepta
ambas formas (`isValidImageRef` en `lib.mjs`) pero el pipeline de catálogo
**no reemplaza** al de imágenes — importar un batch no mueve ni procesa
archivos de imagen, solo valida que el campo tenga una forma razonable.
Coherente con la restricción del brief: "No generar imágenes en esta
fase" / "No alterar `image_url` existente salvo instrucción explícita".

**#H — `status` (Cowork) vs `estado`+`activo` (Aromia).** Son conceptos
distintos que no se deben confundir: `status` de Cowork
(`draft/pending_review/approved/published/rejected`) es el estado
**editorial del dato dentro del pipeline** (¿está listo para proponerse
como importación?). `estado` (migración 004) y `activo` (boolean) en
Aromia son el estado **del perfume ya publicado en el sitio** (visible/
pausado). No hay traducción automática entre ambos — un registro con
`status: approved` en el batch todavía no implica ningún valor de
`estado`/`activo` en Postgres; esa asignación es parte de la importación
real (Bloque D/E), no de esta fase.

**#I — `nicho_o_comercial` no está en el schema de Cowork.** Es un campo
específico de producto de Aromia (usado por el quiz y filtros del
frontend, ver CLAUDE.md raíz). El brief de Fase 3 no lo menciona. Queda
como `null` en la propuesta de importación hasta que Cowork lo incorpore
al batch o se decida derivarlo de otro campo (ninguna heurística automática
implementada — evita asignarlo mal en 500 filas).

**#J — `notes` no estaba en el schema original de Code (agregado en
F3.5).** El batch-001 real de Cowork agregó una columna `notes` de texto
libre no contemplada en el diseño original, usada para trazabilidad
crítica real: conflictos de precio entre fuentes sin resolver, reemplazos
de producto inexistente por uno verificado, ambigüedades de fecha entre
fuentes. Se agregó formalmente a `catalog.schema.json` como campo opcional
(`type: ["string","null"]`) — antes bloqueaba las 25 filas del batch por
`additionalProperties: false` (ver bug de pipeline documentado en
`catalog/reports/batch-001-real-summary.md`, sección histórica F3.5).

**#K — el sentinel `pending` de Cowork (agregado en F3.5).** Cowork no
deja celdas vacías cuando no puede verificar un dato — escribe el string
literal `'pending'`, documentando que investigó pero no encontró una
fuente confiable, en vez de inventar el valor. El pipeline lo trata como
equivalente a `null`/vacío en `validate.mjs` y `normalize.mjs`
(`lib.mjs#isPendingSentinel`) para todos los campos **salvo**
`review_status`, donde `'pending'` es un valor de enum legítimo (el
estado inicial real del flujo editorial), no un sentinel de dato faltante
— ver `lib.mjs#PENDING_IS_VALID_VALUE_FIELDS`. Si `pending` cae en un
campo `REQUIRED_FIELDS`, sigue bloqueando exactamente igual que una celda
vacía (correcto — "no inventado" no es lo mismo que "no importa que
falte").

**#L — `source_url`: colección, no un valor único (agregado en F3.6).**
El schema original asumía una URL de fuente por fila. El batch-001 real
mostró un caso legítimo con dos fuentes citadas para el mismo dato
(`vanilla-28-edp`, un reemplazo de producto que requirió verificación
extra) — el schema anterior lo rechazaba por "no matchear format uri" al
recibir dos URLs en una celda. Decisión de Brey (F3.6): "una entidad puede
tener múltiples fuentes legítimas", generalizada como regla, no como
excepción de una fila. `source_url` es ahora un `LIST_FIELD` como
`top_notes`/`season` — separado por `;` en el CSV (misma convención,
compatible), cada URL validada individualmente como URI. Sigue siendo
`REQUIRED_FIELDS` (`minItems: 1` — al menos una fuente es obligatoria).

**#M — variante de concentración vs. posible duplicado (regla general,
F3.6).** El batch-001 real trajo dos casos (`eros-parfum`,
`terre-d-hermes-parfum`) donde marca+nombre coincidían con un perfume ya
publicado, pero con concentración distinta — productos legítimamente
distintos, no duplicados. Decisión de Brey: "same brand + same normalized
base fragrance name + distinct verified concentration = RELATED_VARIANT,
not duplicate", generalizada sin listar marcas/slugs. Implementación
(`lib.mjs#extractConcentrationFromName` + `diff.mjs`): se extrae la
concentración embebida en `nombre` del catálogo actual si existe (ej.
`'Terre d'Hermes EDT'` → `EDT`); si coincide con la concentración del
batch → `POSSIBLE_DUPLICATE` (revisión); si difiere o no se puede
determinar (ej. `'Eros'`, sin sufijo) → `RELATED_VARIANT` (aprobado). Ante
la duda de si el catálogo legacy realmente tiene la misma concentración,
la regla favorece `RELATED_VARIANT` — bloquear de más es peor que dejar
pasar una variante legítima que un humano puede revisar después en el
maestro. Ver `tests/f36-calibration-rules.test.mjs`.

## 3. Qué NO se resuelve en esta fase

- No se crea la migración `011_extend_concentracion_enum.sql` (#A) — se
  documenta como pendiente, requiere aprobación explícita (regla de
  seguridad: no tocar Postgres).
- No se decide destino final en Postgres para los campos nuevos de #C — se
  preservan en el CSV maestro y los reportes, no se descartan.
- No se fusiona `description`/`descripcion_corta` (#D).
- No se resuelve el gap de precio (#F) — depende de una fuente de datos que
  no existe en este pipeline.

## 4. Revisar en cuanto llegue el batch-001 real de Cowork

Este documento se escribió **sin haber visto un batch real** (Cowork todavía
no entregó el piloto de 25 — ver `catalog/reports/` para el estado del
fixture sintético usado mientras tanto). En cuanto exista `batch-001.csv`
real: re-ejecutar `validate.mjs` contra él y confirmar que las columnas,
nombres y enums asumidos acá (sobre todo #E) coinciden. Si no coinciden,
ajustar `catalog.schema.json` — nunca forzar el dato real a encajar en una
asunción equivocada.
