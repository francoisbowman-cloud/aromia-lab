# Decisión de producto — Aromia deja de tener catálogo público

**Origen:** Brey, en conversación con Chat, 24-25/08/2026. Reemplaza el enfoque del
`ticket-lienzo-blanco-flotante.md` anterior en lo que respecta al grid de catálogo —
ese ticket queda vigente solo para Home, Ficha de producto y Magazine (ver sección 3).

**Para asentar en `ESTADO-aromia.md` como decisión nueva** (numeración la asigna quien
haga el commit, según la regla del protocolo — no me la asigno yo acá).

---

## 1. La decisión, en una frase

Aromia deja de comportarse como un comparador/tienda navegable y pasa a ser una
**revista de perfumería con links de afiliado embebidos en los artículos**. El grid
público de catálogo (`/catalogo`) desaparece. La ficha individual de producto
sobrevive, pero como destino privado, solo alcanzable completando el Quiz — no desde
navegación ni desde búsqueda.

## 2. Confirmado con Brey (24-25/08)

| Pregunta | Respuesta |
|---|---|
| ¿Qué reemplaza `/catalogo`? | El perfume vive dentro del artículo del Magazine |
| ¿Cómo se monetiza sin comparador? | Links de Amazon dentro de cada artículo |
| ¿Qué hace el Quiz al terminar? | Lleva a la ficha propia (`/catalogo/slug`), pero **solo accesible desde ahí**, no desde navegación general |

## 3. Mapa técnico — qué se queda, qué se va

### Se queda, sin cambios de lógica interna
- Tabla `perfumes` (Postgres) — artículos y Quiz siguen leyendo de ahí.
- Ruta `apps/web/src/app/catalogo/[slug]/` (ficha individual) y sus componentes
  (`ProductImage.tsx`, anatomía de ficha: radar de longevidad/proyección/estela,
  pirámide de notas, bloque de reseñas).
- `/api/catalog-data`, `/api/catalog-image` — la ficha los sigue necesitando.
- Motor de matching del Quiz (`apps/web/src/app/quiz/`).

### Se va o se reduce
- `/catalogo` como landing pública navegable: el grid con filtros
  (`PerfumesCatalog.tsx`, `PerfumesCatalogEditorial.tsx`, `ResilientPerfumesCatalog.tsx`,
  buscador, dropdowns de temporada/ocasión/longevidad/estela).
- El comparador cara a cara (`cmp-bar`, `cmp-modal` del sitio legacy — verificar si algo
  equivalente sobrevive en v2; si sí, se retira: es lenguaje de e-commerce).
- Link "Fragancias" del nav principal (`NavBar.tsx`).
- `HomeCatalogPreview.tsx` — rehacer como preview de artículos del Magazine, no de
  productos.
- `/api/catalog-buy` — **Code debe confirmar uso real** antes de tocarlo; puede que la
  ficha lo siga necesitando para el botón de compra.

### Resuelto (25/08)
- **SEO de la ficha huérfana** — **decidido: queda indexable, como contenido long-tail.**
  No lleva `noindex`. Alguien que busca el nombre exacto de un perfume en Google es
  tráfico de intención alta; quitarlo de la navegación no significa quitarlo de
  buscadores.
- **Scraper de precios (Awin, Douglas/Primor)** — al auditar `catalogo/[slug]/page.tsx`
  se confirmó que la ficha usa `PriceTable` con datos de `retailers`, alimentados por
  ese scraper (sección "04 / Compra informada") — no era huérfano. **Decisión final de
  Brey (25/08): desactivar por el momento.** Ejecutado: se vaciaron
  `AWIN_API_TOKEN`/`AWIN_MERCHANT_ID_DOUGLAS`/`AWIN_MERCHANT_ID_PRIMOR` en el servicio
  `api` de Railway (queda no-op sin credenciales, comportamiento ya documentado en
  `CLAUDE.md` — no se tocó código). La ficha sigue mostrando lo que ya tenga cacheado en
  Postgres; solo deja de actualizarse el precio en tiempo real. Reversible: basta con
  volver a cargar las tres credenciales cuando se quiera reactivar.

### Pendiente — trabajo de diseño futuro, sin fecha (anotado 25/08)
**Rediseñar la ficha de producto pensando en el visitante que llega en frío desde
buscadores**, no desde el Quiz. Hallazgos concretos para cuando se retome:
- `generateMetadata` y el JSON-LD tipo `Product` (título, descripción, canonical, OG,
  precio) ya están bien resueltos — no partir de cero en SEO técnico.
- El breadcrumb actual dice literalmente `Inicio / Catálogo / [nombre]` — "Catálogo" ya
  no es un destino real del sitio, hay que decidir qué dice ahí (¿"Revista"? ¿se quita?).
- Falta contexto para quien no pasó por el Quiz: por qué está viendo esta ficha, cómo
  vuelve al resto del sitio (Magazine/Home) sin sentir que cayó en una página de tienda
  aislada.
- El fondo de esta página está hardcodeado (`bg-[#f7f5f0] dark:bg-[#0e1311]`) en vez de
  usar el token `--bg` — mismo hallazgo del ticket de lienzo blanco, aplica acá también.

### Pendiente — Code decide, no asumido acá
- **Redirects**: si `/catalogo` (la landing) deja de existir, cualquier enlace externo o
  indexado hacia ahí necesita un redirect (a Magazine, probablemente) para no perder
  tráfico ya posicionado — mismo criterio que se usó en el corte v1→v2
  (`REDIRECTS_DRAFT_v1_a_v2.md`).

## 4. Qué pasa con el ticket de "lienzo blanco flotante"

Sigue vigente, pero con alcance recortado: ya no aplica al grid de catálogo (que
desaparece), solo a:
- Home (ahora mostrando Magazine, no productos)
- Ficha de producto individual (destino del Quiz)
- Magazine (donde ahora vive la imagen del perfume dentro del artículo)

El punto de decisión de ese ticket (máscara CSS no-destructiva vs. recorte real con
Omni) sigue sin resolver y sigue siendo necesario resolverlo — este pivote no lo
afecta.

## 5. Siguiente paso recomendado

1. **Brey** confirma o ajusta la sección 3 (zona gris) — en particular el scraper y el
   SEO de la ficha.
2. **Code** hace el mapeo real de dependencias antes de borrar nada (ej. confirmar
   quién más usa `/api/catalog-buy`, si el comparador cara a cara sigue vivo en v2).
3. **Code** actualiza `SEO_STRATEGY.md` y prepara los redirects de `/catalogo` →
   Magazine.
4. Recién ahí, aplicar el ticket de lienzo blanco sobre el alcance recortado (sección 4).
