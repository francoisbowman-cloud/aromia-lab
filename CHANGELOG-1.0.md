# Changelog — Aromia 1.0

Registro corto de cada entrega al repo. Una entrada por deploy: fecha + qué se subió + quién.

## 2026-07-13 — Code
- Nuevo: `lab.html` (armador de fragancia interactivo, quiz de 4 pasos, resultados con link a Catálogo y a Amazon).
- Reemplazo: `index.html` (landing minimalista), `catalogo.html` (+ soporte deep-link `?p=ID`), `magazine.html`, `academia.html`, `club.html` (nav con Catálogo + Lab agregado).
- Pendiente próxima entrega: sub-nav sticky y rediseño editorial de tarjetas en Magazine; completar rating real de Amazon en 31/33 perfumes de `catalogo.html`.

## 2026-07-15 — Chat (pendiente de subir por Cowork)
- Reemplazo: `magazine.html` — hero editorial + Carta del Editor + Editor's Picks + Tendencias + "Más historias" (18 artículos integrados al flujo en filas zigzag, scroll infinito, sin nav de categorías). Newsletter removido de esta página.
- Reemplazo: `articles/resena-baccarat-rouge-540.html` — primera plantilla real de artículo individual (antes era placeholder simple). Sirve de modelo para los 17 restantes.
- Nuevo: `CONTEXTO-aromia-diseno.md` (raíz del repo) — memoria de diseño/frontend para Chat entre sesiones.
- Nuevo: `.claude/commands/retomar-aromia-magazine.md` — comando de Code para retomar este trabajo con contexto correcto tras un `/clear`.
- Pendiente real (no confundir con "ya hecho"): los otros 17 artículos siguen siendo placeholders simples. 9 tienen contenido editorial ya redactado por Chat pero el script que los generaba falló (error de Python sin corregir) — hay que retomarlo en la próxima sesión de Chat, no es tarea de Cowork.

## 2026-07-15 — Cowork
- Subido (en nombre de Chat, sin modificar contenido): `magazine.html`, `articles/resena-baccarat-rouge-540.html`, `CONTEXTO-aromia-diseno.md`, `.claude/commands/retomar-aromia-magazine.md` — verificados antes de subir (balance de llaves/tags, nav completo Magazine·Catálogo·Lab·Academia·Club, ausencia de nav de categorías y de newsletter en `magazine.html` según lo pedido, links de recomendación a `catalogo.html?p=ID` reales en el artículo).
- Nota operativa: no se pudo hacer el commit/push directo al repo desde esta sesión — el sandbox de Cowork bloquea el tráfico saliente hacia `api.github.com` (confirmado también al intentar usar un token de acceso personal para otra tarea). Los 4 archivos quedan preparados en el output de esta sesión; el push real a `main` requiere que se suban por otra vía (terminal local de Brey, o la sesión de Code).
- Pendiente sin cambios respecto a la entrada anterior: los 17 artículos restantes y el error de script (`NameError: name 'os' is not defined`) siguen abiertos, no es tarea resuelta en esta entrega.

## 2026-07-16 — Code
- Nuevo: Cloudflare Web Analytics agregado a las 27 páginas públicas de `main` (7 en la raíz + 20 en `articles/`). `admin/imagenes.html` excluido a propósito (`noindex`, herramienta interna).
- Reemplazo: 9 de los 17 artículos restantes de Magazine pasan de placeholder simple a la plantilla real (mismo molde que Baccarat Rouge 540) — `resena-sauvage-dior.html`, `resena-bleu-de-chanel.html`, `resena-black-opium.html`, `resena-good-girl.html`, `resena-acqua-di-gio.html`, `resena-le-male.html`, `resena-terre-hermes.html`, `resena-light-blue.html`, `resena-aventus-creed.html`. Contenido redactado de cero (el contenido que Chat había preparado para estos 9 nunca llegó al repo — el script que lo generaba había fallado y no se recuperó, ver entrada del 2026-07-15). Todos los datos técnicos (precio, ASIN, notas, longevidad/estela/proyección) salen de `catalogo.html`; solo Sauvage tiene rating real de Amazon poblado ahí, así que es el único con ese bloque en el CTA.
- Pendiente: quedan 8 artículos (guías, análisis, academia) que necesitan una estructura distinta a la de reseña individual — todavía sin diseñar.
- Nuevo: imagen de portada editorial (generada con IA) en la ficha de Erba Pura (`catalogo.html?p=28`), arriba de la tabla de precio/retailer en la sección "Anatomía de una fragancia" — prueba puntual en un solo producto, condicionada a `p.id === 28`, sin tocar la foto real de Amazon del bloque de compra ni el resto del catálogo.

## 2026-07-18 — Code
- Corregido: `catalogo.html` — bloque de reseñas comunitarias de Amazon completado para 30 perfumes adicionales (antes solo Baccarat Rouge 540 y Sauvage tenían el bloque poblado, y con un dato desactualizado en el primero). Total: 31/33 perfumes con rating real, 32/33 con bloque de comunidad visible (Angel incluido con mensaje "Sin valoraciones todavía" en vez de bloque omitido — 0 reseñas confirmadas, no es dato faltante). Único sin bloque: Santal 33 (sin ASIN identificado todavía).
- Corregido: Baccarat Rouge 540 tenía un rating desactualizado (3.6★ / 1.991) — reemplazado por el dato reverificado el 18/07 (3.4★ / 1.266).
- Nuevo: sello de fecha "Datos de Amazon actualizados: julio 2026" / "Amazon data last updated: July 2026" agregado a la fuente del bloque de comunidad, en ambos idiomas — deja explícito que es un snapshot fijo, no un dato en vivo.
- Cambiado: la lógica de renderizado del bloque de comunidad (antes se omitía por completo si no había `amzRating`) ahora también muestra el bloque cuando hay blurb sin rating, con el mensaje "Sin valoraciones todavía" — necesario para el caso de Angel.
- Blurbs y datos de rating/reseñas preparados por Cowork en la sesión "Aromia workflow sprint" (ver `ESTADO-aromia.md`, decisiones #64-66) — verificados independientemente por Code contra el archivo real entregado, antes de aplicar nada: JSON válido, 33 entradas, campos correctos donde corresponde y ausentes donde no hay dato (sin inventar).
- **Nota de corrección de proceso:** el entregable de Cowork (`index_v2.html`) tenía los datos correctos pero apuntaba al archivo equivocado — asumía que los datos de perfumes vivían en `index.html`, cuando desde el redesign del 13/07 (esta misma tabla, entrada del 2026-07-13) viven en `catalogo.html`; `index.html` es hoy una landing minimalista sin datos embebidos. `index_v2.html` correspondía a una arquitectura de página única anterior a esa separación. Code detectó la discrepancia antes de subir nada, extrajo solo los campos de datos (`amzRating`, `amzReviews`, `blurbEs`, `blurbEn`) y los aplicó al archivo real (`catalogo.html`), en vez de sobrescribir `index.html` y revertir el homepage a una versión vieja.
