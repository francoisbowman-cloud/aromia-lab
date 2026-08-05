# Brief para Cowork — Inventario y procedencia de imágenes de catálogo

**Fase:** Fase 1 — Fundación del sistema de imágenes de Aromia
**Origen:** `docs/operations/AROMIA_MANUAL_OPERATIVO_CODE_COWORK_CHATGPT.md`,
sección 3.2 y sección 9 (criterios de cuándo Code delega a Cowork)
**Entregado por:** Code
**Punto de partida:** `data/image-inventory.csv` (100 filas: 50 imágenes de
catálogo + 50 de mockup editorial OVL, este último con 38/50 ya resueltos y
12/50 explícitamente `not-applicable` por no tener mockup) y
`docs/images/CURRENT-STATE-AUDIT.md`

---

## Tarea exacta

Completar, para las **50 filas de `image_role = catalog-primary`** de
`data/image-inventory.csv`, los campos que hoy están en `not-audited` o
`unknown` porque requieren inspección real de cada imagen (no se pueden
comprobar leyendo código):

- `original_width`, `original_height`, `aspect_ratio` — dimensiones reales de
  la imagen en `source_url`.
- `background_type` — clasificar como uno de: `white-studio`, `gray-studio`,
  `transparent`, `lifestyle-scene`, `other` (especificar cuál en `notes` si es
  `other`).
- `product_crop` — clasificar como uno de: `full-bottle`, `partial-crop`,
  `heavy-crop`, `unknown-not-visible` (si la URL no carga).
- `visual_quality` — clasificar como uno de: `high`, `medium`, `low`
  (criterio: nitidez, resolución suficiente para 640×800 sin pixelar,
  ausencia de watermark visible del retailer).
- `license_status` — de las opciones del manual operativo (sección 8):
  `official-brand`, `affiliate-approved`, `licensed`, `generated`, `unknown`,
  `replace-required`. **Para las 50 filas actuales, todas son fotos de
  producto de Amazon/Notino/Douglas usadas como parte de un programa de
  afiliados activo** (ver `CLAUDE.md`, variables `AWIN_*` y contexto de
  afiliados de Amazon Associates) — a menos que encuentres evidencia concreta
  de otra cosa, el valor por defecto esperado es `affiliate-approved`, pero
  **no lo asumas sin verificar**: si la imagen no corresponde claramente al
  producto anunciado, o el dominio no es uno de los tres ya conocidos
  (`m.media-amazon.com`, `cdn.notinoimg.com`, `media.douglas.de`), usa
  `unknown` y anotá por qué en `notes`.

No se te pide tocar las filas `image_role = editorial-hero` (mockups OVL) —
esas son un sistema separado, fuera de este brief.

## Archivos y datos que debés revisar

1. `data/image-inventory.csv` — el archivo a completar.
2. `docs/images/CURRENT-STATE-AUDIT.md` — contexto completo de cómo se
   consumen estas imágenes hoy (secciones 4 y 5 en particular).
3. Cada `source_url` de la columna correspondiente — son URLs públicas
   (hotlinks activos), abribles directamente en el navegador.

## Formato de entrega

Un solo archivo: `data/image-inventory.csv` con las mismas 100 filas y las
mismas 20 columnas del original (no agregues ni quites columnas, no
reordenes filas), con los 7 campos de la sección "Tarea exacta" completados
para las 50 filas `catalog-primary`. No toques ninguna otra columna
(`perfume_slug`, `perfume_name`, `brand`, `image_role`, `source_url`,
`source_domain`, `local_file`, `needs_processing`, `processing_status`,
`final_file`, `reviewed_by`, `review_date` quedan tal como están).

Además, agregá en la columna `notes` de cada fila que edites: fecha de
revisión (`YYYY-MM-DD`) y cualquier hallazgo relevante (ej. "imagen no carga",
"foto es de un tamaño distinto al anunciado", "hay watermark de Notino
visible").

## Campos obligatorios

Los 7 listados arriba, para las 50 filas de catálogo. Si alguno no se puede
determinar con la evidencia disponible (por ejemplo, la URL ya no carga),
usá `unknown` explícito — nunca dejes la celda vacía y nunca la completes
con un valor inventado o "razonable mientras nadie lo note".

## Criterios de clasificación

Ya especificados arriba para `background_type`, `product_crop`,
`visual_quality` y `license_status`. Para `aspect_ratio`, expresalo como
`ancho:alto` simplificado (ej. `4:5`, `1:1`, `3:4`) — no como decimal.

## Prohibición de inventar datos

No completes ningún campo por inferencia genérica ("probablemente es blanco
como las demás") ni por patrón ("todas las de Amazon suelen ser buenas
calidad"). Cada valor tiene que corresponder a lo que **viste realmente** al
abrir esa URL específica. Si dos perfumes de la misma marca tienen fotos
distintas, no asumas que comparten clasificación.

## Obligación de registrar fuente y fecha

Cada fila editada debe llevar la fecha de revisión en `notes`. Si necesitás
consultar algo fuera del `source_url` directo (por ejemplo, la ficha del
producto en Amazon para confirmar que es la variante correcta), anotá esa
URL de referencia también en `notes`.

## Elementos que Cowork NO debe modificar

- No modifiques `apps/api/data/PERFUMES_INITIAL_50.csv` ni
  `PERFUMES_INITIAL_50.csv` (raíz) — son datos de otro sistema (seed inicial),
  no el inventario de imágenes de la Fase 1.
- No modifiques ningún archivo de `apps/web/` ni `apps/api/` (código).
- No subas ni descargues archivos de imagen a ningún lado — esta tarea es de
  clasificación/observación, no de procesamiento.
- No hagas commit ni push al repositorio — devolvé el CSV completado, Code lo
  integra.
- No contactes ni interactúes con los sitios de Amazon/Notino/Douglas más
  allá de ver la imagen en el navegador (nada de scraping automatizado,
  creación de cuentas, ni compras).

## Procedimiento para devolver los resultados a Code

1. Entregar `data/image-inventory.csv` completo (100 filas, mismas columnas).
2. Adjuntar un resumen corto (2-3 líneas) de cuántas filas quedaron en
   `license_status = unknown` o con algún campo sin poder determinar, y por
   qué — para que Code sepa qué todavía necesita revisión humana de Brey.
3. Code valida el CSV recibido (columnas intactas, sin valores inventados
   evidentes, sin filas faltantes) antes de commitearlo al repo. Cualquier
   fila que parezca tener un valor no verificable vuelve a Cowork con la
   pregunta puntual, no se corrige a mano por Code sin confirmar.
