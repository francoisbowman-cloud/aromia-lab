# Ticket — Transición de Aromia a revista editorial (Code + Cowork)

**Origen:** Brey, sesión con Chat, 24-25/08/2026. Este es el ticket maestro que
coordina a los dos actores para la nueva etapa. No reemplaza los tres documentos ya
generados esta sesión — los organiza:

1. `decision-aromia-revista-sin-catalogo.md` — la decisión de producto completa, con
   el mapa técnico de qué se queda/qué se va.
2. `ticket-lienzo-blanco-flotante.md` — el rediseño visual (fondo blanco, imágenes
   flotantes), con alcance ya recortado a Home/Ficha/Magazine.
3. `brief-apertura-cowork-editorial.md` — el brief de apertura para pegar directo en
   la sesión nueva de Cowork.

Los tres deben estar disponibles en la raíz del repo (o en la carpeta que Cowork tenga
conectada) antes de arrancar cualquiera de las dos líneas de trabajo de abajo.

---

## 0. Resumen de una línea

Aromia deja de ser comparador navegable y pasa a ser una revista de perfumería con
afiliados de Amazon embebidos en los artículos. El catálogo público desaparece; la
ficha individual sobrevive como destino del Quiz y como contenido long-tail indexable.
El scraper de precios (Awin) ya está desactivado. Todo esto ya fue decidido — este
ticket es sobre **cómo ejecutarlo**, no sobre si hacerlo.

---

## 1. Para Code

### 1.1 Antes de tocar código — housekeeping detectado en la auditoría (24/08)
- **41 ramas sueltas** además de `main` (`git ls-remote --heads`). Auditar cuáles
  tienen trabajo real sin mergear antes de borrar en bloque — no borrar a ciegas.
  Varias parecen experimentos abandonados (`omni/foundational-purpose-*`,
  `agent/aromia-material-library-collab*`).
- **Servicios de preview huérfanos en Railway**: `web-aromia-redesign-preview`,
  `web-aromia-redesign-preview-v2` (apuntaban a una rama de ChatGPT ya borrada),
  `web-visual-preview`, `web-visual-preview-02`, `web-hybrid-signature-01`,
  `web-mockup-fidelity-final`, `web-taste-preview-01`, `web-omni-home-fire-test`,
  `catalog-expansion-b003-validation`, `catalog-import-b001-b002` (este último en
  estado FAILED). Confirmar cuáles siguen sirviendo un propósito activo, eliminar el
  resto.
- **Token `--bg` duplicado**: `globals.css` tiene una definición muerta
  (`#fbf8f3`/`#0e0c0a`) sobreescrita por `aromia-redesign.css`
  (`#f7f5f0`/`#0e1311`, importado después en `layout.tsx`). Consolidar en un solo
  lugar antes de tocar el valor para el lienzo blanco.

### 1.2 Retirar el catálogo público (ver sección 3 de `decision-aromia-revista-sin-catalogo.md`)
- Quitar `/catalogo` como landing navegable: `PerfumesCatalog.tsx`,
  `PerfumesCatalogEditorial.tsx`, `ResilientPerfumesCatalog.tsx`, buscador, filtros.
- Quitar el link "Fragancias" del nav principal.
- Confirmar si el comparador cara a cara (`cmp-bar`/`cmp-modal` en el legacy) tiene
  equivalente vivo en v2; si sí, retirarlo.
- Reescribir `HomeCatalogPreview.tsx` como preview de artículos del Magazine.
- Confirmar uso real de `/api/catalog-buy` antes de tocarlo (puede que la ficha lo
  siga necesitando).
- Preparar redirect de `/catalogo` (la landing, no `/catalogo/[slug]`) hacia Magazine,
  mismo criterio que `REDIRECTS_DRAFT_v1_a_v2.md` en el corte v1→v2.
- Actualizar `SEO_STRATEGY.md`, que asumía el catálogo como puerta de entrada
  principal.

### 1.3 Aplicar el lienzo blanco (ver `ticket-lienzo-blanco-flotante.md`)
Solo después de 1.2. Alcance ya recortado a Home, Ficha de producto, Magazine — el
punto de decisión de ese ticket (máscara CSS no-destructiva vs. recorte real con Omni)
sigue sin resolver, resolverlo con Brey antes de tocar `ProductImage.tsx`.

### 1.4 Rediseño de la ficha para tráfico frío desde buscadores (sin fecha fija, pero ya especificado)
Ver sección "Pendiente — trabajo de diseño futuro" en `decision-aromia-revista-sin-catalogo.md`:
breadcrumb que hoy dice "Catálogo" sin destino real, falta de contexto para quien llega
sin pasar por el Quiz, fondo hardcodeado en la página en vez de usar el token `--bg`.

### 1.5 Al cerrar cada bloque
Actualizar `ESTADO-aromia.md` con lo que quedó funcional/pendiente y **commitear vos**
esa actualización, aunque el contenido lo haya preparado Cowork o Chat — regla sin
cambios del manual operativo.

---

## 2. Para Cowork

Usar `brief-apertura-cowork-editorial.md` como primer mensaje de la sesión nueva —
ya trae el contexto del pivote, las reglas duras de modo carpeta compartida, y las
skills a usar (`editorial-storytelling`, `magazine-layout-designer`,
`maquetacion-editorial`, `perfume-art-director`).

Puntos a reforzar que no dependen de que Code termine 1.2 primero — **el trabajo
editorial puede arrancar en paralelo**, mientras se respete esto:
- No enlazar `/catalogo` (la landing) en artículos nuevos — va a dejar de existir.
  Enlazar directo a `/catalogo/[slug]` (ficha) cuando el artículo lo amerite, o a otros
  artículos del Magazine.
- Cada artículo que mencione un perfume puntual lleva su link de afiliado de Amazon
  embebido — es la monetización real ahora.
- No inventar datos de perfumería (notas, año, perfumista) — verificar antes de
  publicar, regla del manual operativo sección 21.

---

## 3. Coordinación entre ambos (y con vos trabajando desde el móvil)

- **Una sola sesión de Cowork a la vez** sobre este repo — sigue siendo la regla más
  importante, la que falló en el incidente de julio.
- Si vas a dirigir Cowork desde el móvil: es la misma sesión, no una nueva, así que no
  rompe la regla anterior — pero la escritura real de archivos solo ocurre si tu Claude
  Desktop sigue abierto y conectado a la carpeta. Instrucciones ambiguas tipeadas rápido
  desde el celular pueden generar cambios reales en el repo — tratalas con el mismo
  cuidado que un mensaje desde la compu.
- Code sigue siendo la única autoridad de `git commit`/`push`, sin excepción — ni
  Cowork ni el trabajo iniciado desde el móvil cambian eso.
- Cualquier decisión nueva que surja durante el trabajo editorial (ej. Cowork
  proponiendo un cambio de estructura) se describe en prosa, no se numera — Code le
  asigna el número al commitear el `ESTADO`.

## 4. Orden sugerido

1. Code: housekeeping (1.1) — no bloquea a Cowork.
2. Cowork: arranca producción editorial (sección 2) — en paralelo, ya mismo.
3. Code: retiro del catálogo público (1.2).
4. Code: lienzo blanco sobre alcance recortado (1.3).
5. Code: rediseño de ficha para tráfico frío (1.4) — sin apuro, cuando haya banda.
