# Guía visual — Aromia

Referencia técnica reutilizable para implementar UI en `feature/v2.0`.
Documenta el sistema de diseño ya vigente en el código (`apps/web/src/app/globals.css`,
`apps/web/tailwind.config.ts`) más las reglas fijadas por el ticket "Adaptar
variante visual de Aromia a producción" (25/07). No duplica decisiones de
producto — esas viven en `ESTADO-aromia.md`. No duplica stack/comandos — eso
vive en `CLAUDE.md`.

## 1. Origen

Prototipo de Claude Design (`Aromia_Layton_variantes_visuales.zip`), dos
variantes del mismo sistema de diseño:

- **Grafito** = tema **oscuro** (`data-theme="dark"`)
- **Ivorio** = tema **claro** (`data-theme="light"`, default)

No son alternativas entre las que elegir — son los dos modos de un toggle de
tema real, ya implementado en el sitio (`ThemeToggle.tsx`, persistido en
`localStorage` bajo la clave `aromia_theme`, atributo `data-theme` en
`<html>`, con script anti-flash en `layout.tsx`).

## 2. Tokens de color

Definidos en `apps/web/src/app/globals.css` (`:root` = claro, `[data-theme="dark"]`
= oscuro) y expuestos a Tailwind en `tailwind.config.ts`. Nombres reales del
código — no "gold-500"/"warm-white" genéricos:

| Token CSS | Clase Tailwind | Rol |
|---|---|---|
| `--bg` | `bg-paper` | Fondo de página |
| `--surface` | `bg-surface` | Tarjetas, header, footer |
| `--soft` | `bg-soft` | Fondo secundario (badges, skeletons, secciones alternas) |
| `--text` | `text-ink` | Texto principal |
| `--muted` | `text-muted` | Texto secundario |
| `--line` | `border-line` | Bordes |
| `--gold` / `--gold-2` | `text-gold` / `border-gold` | Dorado decorativo (invierte claro↔oscuro entre temas) |
| `--gold-contrast` | `text-gold-contrast` | Dorado para texto/botones — **fijo en ambos temas** (WCAG AA 4.5:1, ver comentario en `globals.css`) |

Los tokens semánticos de shadcn (`--primary`, `--card`, `--ring`, etc.) son
alias sobre esta paleta — no traen su propio color.

**No usar hex sueltos en componentes nuevos.** El namespace `colors.admin.*`
de `tailwind.config.ts` es la única excepción conocida (hex fijos, no
reacciona al tema) — heredado del panel admin, no replicar el patrón fuera de ahí.

## 3. Tipografía

Tres familias cargadas vía `next/font/google` en `apps/web/src/app/layout.tsx`:

| Familia | Variable CSS | Clase Tailwind | Uso |
|---|---|---|---|
| Cormorant Garamond | `--font-display` | `font-display` | Headings, nombres de perfume, cifras destacadas (rating, precio) — serif editorial en ambos temas |
| Archivo | `--font-body` | `font-sans` (default del `<body>`) | Nav, labels uppercase, botones, UI general — reemplaza a Jost |
| IBM Plex Sans | `--font-plex` | `font-plex` | Cuerpo de texto largo en secciones de tono más técnico/editorial (uso selectivo, no reemplaza a Archivo como default) |

## 4. Reglas de imagen — regla dura, sin excepción

Motivo: en variantes previas del catálogo, imágenes se recortaban o no
encajaban en su contenedor.

1. **Ninguna imagen de producto se recorta ni se desborda de su contenedor.**
   `object-fit: contain`, nunca `cover`, en todo contenedor de imagen de
   producto. (`contain` = la imagen entra entera, puede dejar espacio vacío
   a los lados; `cover` = llena el marco recortando lo que sobra — lo que
   NO se quiere.)
2. Cada contenedor de imagen declara un `aspect-ratio` fijo según su rol:

   | Rol | Aspect ratio | Componente |
   |---|---|---|
   | Catálogo (grid card) | **1:1** | `PerfumeCard.tsx` (`aspect-square`) |
   | Hero de ficha de producto | **4:5** | `HeroHeader.tsx` (`aspect-[4/5]`) |
   | Banners / editorial (mockups OVL) | **16:10** | `EditorialMood.tsx` (`aspect-[16/10]`) |

   El prototipo usa 3:4 en la variante Grafito y 4:5 en Ivorio para el mismo
   rol de hero — se fijó **4:5 en ambos temas** para no reflowear el layout
   al cambiar de tema con el toggle.
3. Si la imagen real no llena el `aspect-ratio` del contenedor, el espacio
   remanente se rellena con el color de fondo del sistema de esa sección
   (`bg-surface`/`bg-soft` según contexto) — **nunca** transparencia cruda
   ni el fondo por defecto del navegador.
4. Aplica a las tres fuentes de imagen del proyecto: Amazon/Notino/Douglas
   (catálogo, fondo blanco), mockups OVL (ficha de producto, ambientación
   editorial) y cualquier imagen de banner futura.

`PerfumeCard.tsx` usa un análisis de bounding box vía `<canvas>` (ver
comentarios en el archivo) en vez de `object-fit` plano — logra el mismo
resultado (nada de la botella se recorta) recortando el margen en blanco
propio de cada retailer, no el producto.

## 5. Sistema de elementos interactivos — 3 niveles

1. **CTA primario** — `Button` de shadcn, variante `default`
   (`apps/web/src/components/ui/button.tsx`): fondo `--primary` (dorado de
   contraste), texto blanco, `rounded-full`, padding generoso.
2. **CTA secundario** — `Button` variante `outline`: borde `--line`, fondo
   transparente, hover a `border-gold`.
3. **Navegación** (nav superior, footer, breadcrumbs, links dentro de texto
   editorial) — clase utilitaria `.nav-link` (`globals.css`, `@layer components`):
   - Subrayado animado (`::after` con `scaleX` desde el centro vía `left`/`right`),
     no solo cambio de color — mantiene tono editorial sin volverse un botón.
   - `:focus-visible` con outline visible en `--gold-2` — antes no existía
     ningún estado de foco en `NavBar`/`Footer`, bloqueante de accesibilidad
     para navegación por teclado.
   - Área de toque: `padding: 8px 1px` vertical mínimo por link.

**Regla de componentes**: todo CTA/hipervínculo de acción (ej. "Ver oferta
en Amazon") es un `Button` real (con `asChild` si envuelve un `<a>`) — nunca
texto plano suelto. Los enlaces de navegación secundaria sí pueden quedar
como texto con `.nav-link`, eso es correcto.

## 6. Checklist de coherencia visual entre vistas

Antes de cerrar cualquier tarea de diseño/frontend, además del
`DESIGN-CHECKLIST.md` general, verificar que Home, Catálogo, Ficha de
Producto y Magazine:

- [ ] Comparten `font-display` para headings/nombres y `font-sans` (Archivo)
      para UI/labels — se debe poder reconocer que son del mismo sitio sin
      ver el logo.
- [ ] Todo contenedor de imagen de producto usa `object-contain` +
      `aspect-ratio` fijo según la tabla de la sección 4, nunca `object-cover`.
- [ ] Todo link de navegación usa `.nav-link` (subrayado + focus-visible),
      todo CTA de acción usa `Button`.
- [ ] El toggle de tema no rompe contraste ni layout en ninguna vista — el
      `--gold-contrast` fijo existe justamente para esto.
- [ ] `print:hidden` en cualquier elemento de navegación agregado (NavBar,
      Footer ya lo tienen).
