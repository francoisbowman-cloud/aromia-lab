# Auditoría del estado actual de imágenes — Aromia

**Fecha:** 2026-08-05
**Autor:** Code (Claude Code), Fase 1 del sistema de imágenes
**Método:** lectura directa del código (`apps/web`, `apps/api`) + consulta real a
`GET https://api-production-fe2f.up.railway.app/api/perfumes` (50 filas, producción
real) + inspección de archivos en `apps/web/public/`. Sin inferencias no verificadas —
donde no se pudo comprobar algo, se dice explícitamente.

---

## 1. Configuración de `next/image`

**No se usa.** `apps/web/next.config.mjs` no tiene ninguna clave `images` (sin
`remotePatterns`, `domains`, `formats`, `deviceSizes`/`imageSizes`, sin
`unoptimized`). Coherente con el punto 2: no hay un solo uso de `next/image`
(`<Image>`) en todo `apps/web` — confirmado por búsqueda global, 0 resultados.

Todas las imágenes se renderizan con `<img>` plano, marcado explícitamente con
`// eslint-disable-next-line @next/next/no-img-element` en cada sitio — es una
excepción deliberada del equipo, no un descuido silencioso.

## 2. Componentes que renderizan imágenes

| Componente | Fuente | Externa / local | `alt` | Fallback |
|---|---|---|---|---|
| `apps/web/src/components/perfume/PerfumeCard.tsx:63-72` | `perfume.imagen_url` | Externa (retailer) | `alt=""` oculto; label real en `div role="img" aria-label` (línea 75) | `ImagePlaceholder` si `!imagen_url \|\| imgError` |
| `apps/web/src/components/perfume/HeroEditorPick.tsx:60-69` | `current.imagen_url` | Externa (retailer) | ídem patrón anterior | `ImagePlaceholder` |
| `apps/web/src/components/perfume/EditorialMood.tsx:28-32` | `getEditorialImage(slug)` → `/ovl/*.jpg` | Local (`public/ovl/`) | Sí, real | Texto "La atmósfera editorial de {nombre} está en preparación" si no hay mockup para el slug |
| `apps/web/src/components/admin/ImageUpload.tsx:54` | `displayUrl` (blob de preview o `currentUrl`) | Ambos posibles | `alt=""` vacío | Texto "Sin imagen" si no hay `displayUrl` |

`FeaturedCarousel.tsx` no tiene imagen propia — envuelve `PerfumeCard`, hereda su
crop/fallback. Ninguna página de `apps/web/src/app/` tiene `<img>`/`<Image>` propio
fuera de estos componentes.

`apps/web/src/components/perfume/ImagePlaceholder.tsx` existe: SVG simple de un
frasco (`stroke="currentColor"`) dentro de `div role="img" aria-label`, 22 líneas.

## 3. Dónde vive el dato de imagen

- **Schema** (`schema/perfume.schema.json:101-105`): una sola columna,
  `imagen_url` (string, `format: "uri"`) — "URL de la imagen principal del
  producto (sin fondo, catálogo)".
- **Postgres de producción** (`apps/api/migrations/001_create_perfumes.sql:18`):
  `imagen_url TEXT NOT NULL` en `perfumes`. Es el dato real y actual — confirmado
  vía `GET /api/perfumes` en vivo (ver sección 4).
- **`apps/api/data/PERFUMES_INITIAL_50.csv`** (y su copia en la raíz del repo):
  **desactualizado respecto a producción** — tiene 38 filas (el catálogo del
  21/07), no las 50 reales desde la expansión Dior del 30/07 (decisión #89 de
  `ESTADO-aromia.md`). Los 12 perfumes Dior nuevos se publicaron directo en
  Postgres vía la API admin, nunca se agregaron al CSV. **Riesgo:** cualquier
  reseed futuro desde este CSV pisaría/perdería esos 12 perfumes si no se
  actualiza antes.
- **`articles`** (`apps/api/migrations/006_create_articles.sql:11-12`): dos
  columnas de imagen — `imagen_portada_url`, `imagen_og_url`. No auditadas en
  profundidad en esta pasada (fuera del alcance de "sistema de imágenes de
  perfumes" de la Fase 1, pero señalado para una fase futura).
- **`retailers`** (`apps/api/migrations/003_create_retailers.sql:9`):
  `logo_url TEXT` — logo del retailer, no foto de producto.

## 4. Catálogo real (verificado en vivo, 2026-08-05)

`GET https://api-production-fe2f.up.railway.app/api/perfumes` devuelve **50
perfumes**, **50/50 con `imagen_url` no vacío** — cero gaps, cero placeholders
de datos. Distribución de dominios de origen:

| Dominio | Cantidad |
|---|---|
| `m.media-amazon.com` | 37 |
| `cdn.notinoimg.com` | 10 |
| `media.douglas.de` | 3 |

## 5. Hotlinking externo — confirmado

**Ninguna foto de producto está descargada al repo.** Las 50 imágenes de
catálogo se sirven por hotlink directo desde los tres dominios de arriba:

- `PerfumeCard.tsx:65` y `HeroEditorPick.tsx:62` hacen
  `<img src={perfume.imagen_url} crossOrigin="anonymous" ...>` directo a la URL
  externa, sin proxy ni caché propia.
- El comentario de `HeroEditorPick.tsx:14-16` lo documenta a propósito: "muestra
  su foto de producto real (Amazon/Notino/Douglas), nunca un mockup de IA".
- `useProductImageCrop.ts:8-10, 86-90` documenta el riesgo concreto: el análisis
  de color/crop por `<canvas>` puede fallar por CORS si el host externo no envía
  cabeceras permisivas — ya es una limitación real, no hipotética, de depender
  de hotlinks de terceros.

**Riesgo de procedencia/licencia:** ninguna de las 50 imágenes tiene su estado
de licencia verificado en este repo — se están usando fotos de producto de
Amazon/Notino/Douglas sin un registro explícito de bajo qué términos. Marcado
como `unknown` en el inventario (`data/image-inventory.csv`), no asumido.

**Riesgo de rendimiento:** sin `next/image`, no hay optimización automática
(resize, formato moderno, lazy loading nativo) sobre ninguna de estas 50
imágenes — el peso y formato que entrega cada retailer es el que llega al
usuario final, tal cual.

**Riesgo de disponibilidad:** si un retailer cambia o borra la URL de una
imagen (ya pasó — ver `CHANGELOG-2.0.md` 24/07, Wood Sage & Sea Salt con URL de
Douglas muerta), la imagen se rompe en producción sin aviso hasta que alguien
lo nota. No hay copia local de respaldo para ningún perfume.

## 6. Imágenes editoriales (no hotlinked — sí viven en el repo)

- **`apps/web/public/ovl/`** — 38 archivos `.jpg`, un mockup narrativo por
  perfume (sistema OVL, ver `CLAUDE.md`/`ESTADO-aromia.md` decisiones #75/#80).
  Mapeados 1:1 por slug en `apps/web/src/lib/editorialImages.ts`.
  **Cobertura real verificada contra el catálogo actual de 50: 38/50.** Los 12
  perfumes sin mockup son exactamente los 12 Dior agregados el 30/07 (decisión
  #89) — nunca se generó su mockup OVL:
  `dior-addict-edp`, `dior-homme-cologne`, `dior-homme-intense`,
  `dior-homme-parfum`, `eau-sauvage`, `eau-sauvage-parfum`, `fahrenheit`,
  `fahrenheit-parfum`, `hypnotic-poison`, `miss-dior-blooming-bouquet`,
  `pure-poison`, `sauvage-elixir`. Para estos 12, `EditorialMood.tsx` muestra el
  texto placeholder "está en preparación" (comportamiento correcto, no un bug).
- **`apps/web/public/editorial/`** — 8 archivos `.png`, escenas genéricas
  (`bright-soft-focus.png`, `cinematic-warm.png`, etc.) usadas por
  `pickEditorialImage()` para portadas del Magazine, elegidas por hash
  determinístico del slug del artículo — no son por-perfume, no aplican al
  inventario de catálogo.
- No se encontraron hashes MD5 duplicados dentro de `ovl/` ni dentro de
  `editorial/` (46 archivos totales, todos únicos por contenido). No se auditó
  duplicación "semántica" (mismo perfume, dos archivos con contenido visual
  distinto pero nombre distinto) — requeriría inspección visual, fuera de
  alcance de esta auditoría automatizada.

## 7. Recorte y color de fondo — `useProductImageCrop.ts`

Hook compartido entre `PerfumeCard` y `HeroEditorPick` (198 líneas). Sobre un
`<canvas>` oculto de 100×100: promedia el color de los píxeles de borde para
usarlo como fondo del marco, detecta el bounding box del producto comparando
cada píxel contra ese color (`threshold = 26`) para recortar el margen blanco
que dejan Amazon/Notino/Douglas, y recalcula en cada resize vía
`ResizeObserver`. Es un procesamiento **client-side, en cada carga de página**,
no un derivado pre-procesado — se repite en cada visita, para cada usuario.

## 8. Admin — cómo se cargan imágenes hoy

`apps/web/src/components/admin/ImageUpload.tsx` soporta dos caminos sobre el
mismo campo `imagen_url`, sin distinción en el schema ni en el consumo:

1. **Subir archivo** — `POST /api/admin/perfumes/{id}/image`, `multer` con
   `diskStorage` en `apps/api/uploads/perfumes/` (servido estático en
   `/uploads` por Express, `apps/api/src/index.ts:32`), nombre
   `${Date.now()}-${random}.${ext}`. Deja `imagen_url = "/uploads/perfumes/..."`
   — apuntando al propio backend, no a un CDN.
2. **Pegar URL externa** — `PATCH /api/admin/perfumes/{id}` con
   `{ imagen_url: url }` directo, sin descargar ni validar el archivo del otro
   lado.

**Riesgo:** el campo `imagen_url` no distingue de dónde vino la imagen (upload
propio vs. hotlink de retailer vs. URL pegada a mano de cualquier otro sitio) —
mismo string, tres orígenes posibles, sin metadata de procedencia.

## 9. Imágenes rotas conocidas

Ninguna detectada como rota *en este momento* (las 50 URLs de la API responden
con un valor no vacío), pero hay precedente documentado de rotura real: Wood
Sage & Sea Salt tuvo una URL de Douglas muerta, corregida el 24/07
(`CHANGELOG-2.0.md`). No se hizo en esta auditoría un chequeo HTTP real de las
50 URLs (sería parte de los scripts de validación de la Fase 1, ver
`docs/images/IMAGE-ARCHITECTURE.md` y los scripts en `scripts/images/`).

## 10. Resumen de riesgos

| Riesgo | Severidad | Nota |
|---|---|---|
| 100% hotlinking, cero copia local de respaldo | Alto | Cualquier retailer puede romper una imagen sin aviso |
| Sin optimización (`next/image` no usado) | Medio | Peso/formato tal cual lo entrega cada retailer |
| Procedencia/licencia sin verificar (50/50) | Medio-Alto | Uso de fotos de producto de terceros sin registro de términos |
| ~~CSV desincronizado con producción (38 vs. 50 filas)~~ | ~~Medio~~ | **Cerrado 2026-08-06** — `scripts/sync-perfumes-csv-from-production.mjs` regeneró ambas copias (raíz + `apps/api/data/`) desde `GET /api/perfumes` real (50/50 filas, validado contra `schema/perfume.schema.json`). No es un fix de una sola vez: cualquier alta/edición futura hecha solo vía admin (Postgres) volverá a desincronizar el CSV si no se re-corre el script antes de un reseed. |
| 12/50 perfumes sin mockup editorial OVL | Bajo | Comportamiento de fallback ya existe y es correcto (texto, no imagen rota) |
| Campo `imagen_url` sin metadata de procedencia | Bajo-Medio | No se puede distinguir upload propio vs. hotlink vs. pegado a mano sin mirar el string |
