# TICKET — Arquitectura editorial de Aromia: de "rich text plano" a "gramática editorial"
### Preparado por: Chat (Principal Software Architect / Editorial Systems Engineer / Design Engineering Lead, rol asumido para este encargo)
### Para: Code (implementación, migraciones, PR — autoridad exclusiva de git en este proyecto)
### Septiembre 2026

---

## 0. Antes de leer esto: qué rol jugué acá y qué no

Por el protocolo de actores vigente en este proyecto (`PROTOCOLO-comunicacion-actores.md`, y la decisión ya registrada de que **Code tiene autoridad exclusiva de `git commit`/`push`**, sin excepción, por el incidente del 18/07), yo no voy a: crear una rama, hacer commits, abrir un PR, ni tocar la base de datos de producción. Tampoco tengo credenciales de escritura sobre el repo — solo lo cloné en modo lectura desde GitHub público para hacer la auditoría real que pediste.

Lo que sí hice, y que cumple el espíritu de "audita antes de asumir": **cloné el repo público (`francoisbowman-cloud/aromia-lab`) y leí el código real** — no memoria de sesiones anteriores, no lo que decía el `ESTADO`. Cada afirmación de la sección 1 tiene el archivo/línea que la respalda.

Este documento es un **ticket de arquitectura completo**, con decisión tomada, schema, código de ejemplo funcional (no pseudocódigo) para las piezas más riesgosas, y un plan de ejecución — listo para que Code lo revise, lo ajuste si encuentra algo que yo no vi, y lo implemente en rama siguiendo el flujo normal del repo.

> 💡 **Concepto — por qué esto importa para el protocolo:** este es exactamente el tipo de tarea donde el protocolo de actores gana su valor. Yo puedo razonar sobre arquitectura y hasta escribir el código, pero **no puedo verificar que funciona en un entorno real** (build, tests, deploy) ni soy la autoridad de versionado del repo. Separar "quién decide/diseña" (yo, con tu aprobación) de "quién ejecuta y es responsable del estado real del código" (Code) es la misma lógica de separación de responsabilidades que vamos a aplicar *dentro* de la arquitectura editorial (Content / Editorial Semantics / Art Direction). Es un patrón que se repite a varios niveles.

---

## 1. Auditoría real (verificada, no asumida)

### 1.1 Tiptap: mucho menos de lo que la arquitectura propuesta en tu prompt asume

`apps/web/src/components/admin/RichTextEditor.tsx` usa **únicamente `@tiptap/starter-kit`** (`@tiptap/react` v3.28). El toolbar expone: negrita, cursiva, H3, lista, cita. **No hay extensión de imagen, no hay embeds, no hay captions, no hay nodos custom.** Esto es más simple de lo que la memoria del proyecto sugería ("editor de magazine vía Tiptap") — en la práctica es un editor de texto plano con cinco botones.

### 1.2 Persistencia: una columna TEXT, sin JSON

`apps/api/migrations/006_create_articles.sql` — tabla `articles`:

```sql
CREATE TABLE articles (
  id, slug, titulo, categoria, estado,
  contenido_html      TEXT,   -- HTML plano de Tiptap (getHTML())
  imagen_portada_url  TEXT,   -- imagen de hero — NO vive dentro del contenido
  imagen_og_url       TEXT,
  meta_title, meta_description, url_canonica,
  perfumes_relacionados INTEGER[],
  keyword_objetivo, publicado_en, ...
);
```

No existe `contenido_json`. La fuente de verdad hoy es HTML plano vía `editor.getHTML()`.

### 1.3 Las imágenes editoriales ya son un sistema separado y curado — esto es bueno

`apps/web/src/lib/editorialImages.ts`: las imágenes "atmosféricas" y las imágenes OVL (pareadas 1:1 con 38 perfumes) **no se insertan dentro del artículo** — son un mapeo estático (`Record<slug, {src, alt}>`) que la UI consulta por fuera del contenido. Esto ya es, sin que nadie lo haya llamado así, una separación correcta entre *contenido* e *implementación visual*. La arquitectura nueva debe **preservar este patrón**, no reemplazarlo por upload libre de imágenes dentro de Tiptap.

### 1.4 Dos renderizadores paralelos, ambos frágiles ante contenido nuevo

En `apps/web/src/app/magazine/[slug]/page.tsx` conviven:

- **`ArticleReadingView` → `PageFlipReader`**: usa `paginateArticle.ts`, que parsea `contenido_html` con `DOMParser` (cliente) y agrupa bloques por presupuesto de caracteres (550/página). Comentario explícito en el código: *"There are no page markers in the CMS (Tiptap only produces flat HTML)"*.
- **Vista de lectura estándar**: `contenido_html` inyectado directo con `dangerouslySetInnerHTML` dentro de un `<article className="prose prose-neutral ...">` (Tailwind Typography, ya instalado y registrado en `tailwind.config.ts`).
- **`splitHtmlBlocks.ts`** (usado por `PrintableArticle.tsx`, server component) parsea el HTML con **regex**, no DOMParser, y el comentario del propio código admite el riesgo: *"safe here because the admin editor's toolbar only ever produces p / h1-h6 / ul / ol / blockquote as top-level siblings"*.

**Hallazgo crítico:** los tres consumidores de `contenido_html` asumen implícitamente "HTML plano, solo bloques simples, sin anidamiento". Cualquier nodo editorial nuevo que produzca HTML distinto (ej. una imagen full-bleed con figure/figcaption) **rompe silenciosamente** el regex de `splitHtmlBlocks.ts` y el parser de caracteres de `paginateArticle.ts`. Esto no es una limitación de Tiptap — es una limitación de los tres lugares que *leen* su salida. Confirma exactamente el problema que tu encargo describe.

### 1.5 Sin sanitización — hallazgo de seguridad, independiente de la decisión de arquitectura

No hay `DOMPurify` ni `sanitize-html` en ninguna parte del repo (`apps/web/package.json`, `apps/api/package.json`, ni en el código). `contenido_html` viaja de: formulario admin → Postgres → API pública (`GET /articles/:slug`, sin autenticación) → `dangerouslySetInnerHTML` en la página pública, sin pasar por ningún filtro. Hoy el único autor es Brey/actores de confianza vía panel admin, así que el riesgo práctico es bajo — pero **cualquier evolución de este sistema debe cerrar esto**, no heredarlo. Lo incluyo en la Definition of Done (sección 14) independientemente de qué arquitectura se elija.

### 1.6 Lo que ya existe y es aprovechable

- Tokens CSS ya centralizados (`aromia-redesign.css`, variables `--bg`, `--gold`, etc.), con soporte light/dark ya resuelto (`darkMode: ["selector", '[data-theme="dark"]']` en `tailwind.config.ts`).
- shadcn/ui como base de componentes.
- Un editor admin ya funcional para el flujo básico (borrador/publicado, categorías, metadata SEO) — no hay que rehacer esa capa, solo extenderla.

---

## 2. Decisión arquitectónica

| Criterio | A — Seguir con HTML plano | B — Migrar todo a JSON ya | C — Híbrido aditivo (recomendado) |
|---|---|---|---|
| Backward compatibility | Total, pero perpetúa el problema | Requiere migrar contenido existente | Total — nada existente se toca |
| Libertad creativa (el objetivo del encargo) | Ninguna sin parsear HTML con más regex frágil | Alta | Alta, sin tocar lo viejo |
| Riesgo de migración | Ninguno | Alto (destructivo si algo falla) | Ninguno — es aditivo |
| Complejidad de implementación inicial | Baja pero no resuelve nada | Alta de entrada | Media, crece con evidencia real |
| SEO / cache / RSS (consumidores actuales de HTML) | OK | Requiere generar HTML derivado igual | OK — se sigue derivando HTML |
| Coincide con el principio "no construir el sistema entero de antemano" (punto 16 del encargo) | Sí, pero por estancamiento, no por criterio | No — es una migración total de entrada | Sí — crece con Reference Issue 01 |

**Decisión: C — modelo híbrido aditivo.**

- `contenido_html` **se queda intacto**, tal cual, para todo artículo existente. Nunca se migra retroactivamente de forma automática ni destructiva.
- Se agrega `contenido_json JSONB` (nullable) + `schema_version SMALLINT NOT NULL DEFAULT 1` a la tabla `articles`.
- **Regla de fuente de verdad, simple y sin ambigüedad:** si `contenido_json IS NOT NULL`, es la fuente canónica y `contenido_html` se recalcula automáticamente a partir de él (ver 2.1) cada vez que se guarda, solo para que los consumidores legacy (`PageFlipReader`, `PrintableArticle`, SEO/RSS) sigan funcionando sin tocarlos. Si `contenido_json IS NULL`, el artículo sigue siendo 100% legacy y usa el camino de hoy sin ningún cambio.
- Artículos nuevos con necesidades editoriales avanzadas usan `contenido_json` desde el día uno. Artículos viejos no se tocan nunca a menos que alguien decida deliberadamente "editorializar" uno viejo — en ese caso el editor ofrece "convertir a formato estructurado", que es una acción explícita y reversible (se conserva el `contenido_html` original en una columna `contenido_html_legacy_backup` antes de sobrescribir).

> 💡 **Concepto — `JSONB` en Postgres:** es un tipo de columna que guarda JSON ya parseado en binario (no texto plano), lo que permite indexar y consultar campos internos del JSON con SQL si hace falta más adelante (ej. "todos los artículos con un `PhotoSequence`"), y es más rápido de leer que si guardáramos el JSON como `TEXT` y lo parseáramos en la aplicación cada vez.

### 2.1 De dónde sale el `contenido_html` derivado

No se escribe a mano — se genera con un **serializador determinístico** (JSON → HTML), separado del renderer React (JSON → React, sección 7). Mismo JSON, dos salidas: una para navegador moderno (React, con toda la libertad visual), otra para todo lo que hoy solo sabe leer HTML plano (page-flip reader, RSS futuro, snippets SEO). El serializador HTML es deliberadamente conservador: un `FullBleedImage` se serializa como `<figure><img/><figcaption/></figure>` simple, sin las clases de tratamiento — es un *fallback*, no pretende verse tan bien como el renderer React.

### 2.2 Clasificación explícita, con la nomenclatura pedida en el segundo brief

Brey pidió clasificar la conclusión como A/B/C/D, pero con letras que **no coinciden con las de la tabla de arriba** — aviso esto para que no se lea como una contradicción:

| Letra (nomenclatura del segundo brief) | Significa | ¿Es la elegida? |
|---|---|---|
| A — Mantener arquitectura actual | Seguir con `contenido_html` plano, sin cambios | No |
| **B — Evolución híbrida HTML + structured content** | **Exactamente lo que este ticket ya especifica: `contenido_json` nuevo, `contenido_html` intacto y derivado, sin migración destructiva** | **Sí — esta es la decisión** |
| C — Tiptap JSON como modelo canónico único | Todo el contenido, incluido el legado, pasa a depender de JSON estructurado como única fuente | No |
| D — Otra arquitectura superior | — | No hizo falta; el híbrido cubre el objetivo sin los riesgos de C |

**Por qué no C (JSON como único modelo canónico):** forzaría a decidir, para el 100% de los artículos existentes, qué hacer con contenido que hoy es HTML plano sin estructura editorial — o se migra (riesgo destructivo que el encargo prohíbe explícitamente) o se sostienen dos caminos de renderizado igual, con el agravante de que *todo* el contenido nuevo tendría que forzarse a JSON incluso cuando un artículo simple no lo necesita. El híbrido logra el mismo resultado (JSON disponible como lenguaje editorial rico) sin ese costo: JSON se usa cuando aporta, HTML plano sigue siendo válido cuando el artículo no necesita ningún primitive.

---

## 3. Las tres capas, aplicadas a Aromia real

| Capa | Vive en | Ejemplo real de Aromia |
|---|---|---|
| **Content** | `contenido_json`, nodos Tiptap estándar + custom | El texto del ensayo sobre Baccarat Rouge, la cita del perfumista, los párrafos de una reseña |
| **Editorial Semantics** | El **tipo de nodo** Tiptap (`type: "fullBleedImage"`, `type: "pullQuote"`...) | Ese bloque es una `FullBleedImage`, no "una imagen" a secas — la semántica es fija, no depende del artículo |
| **Art Direction** | **Atributos del nodo** (`attrs.treatment`, `attrs.scale`) — no una tabla separada, ver 3.1 | Esa misma `FullBleedImage` puede tener `treatment: "quiet"` en un artículo y `treatment: "monumental"` en otro |

### 3.1 Por qué Art Direction vive en los atributos del nodo, no en un JSON aparte

El encargo dejaba la puerta abierta ("si consideras que debe vivir en los atributos del nodo, puedes hacerlo"). Decisión: **vive en los atributos**, no en un `art_direction_json` separado, por una razón concreta de mantenibilidad: si vivieran en dos lugares (`contenido_json` para el contenido, otro JSON para la dirección de arte), cada edición de contenido correría el riesgo de desincronizar los índices/IDs entre ambos documentos — un problema clásico de "dos fuentes de verdad que deben mantenerse alineadas a mano". Guardar `treatment` como atributo del nodo mismo significa que el nodo y su dirección de arte **son la misma unidad de edición y de versionado**, y ProseMirror (el motor debajo de Tiptap) ya sabe validar atributos de nodo de forma nativa.

---

## 4. Vocabulario mínimo para Reference Issue 01

Aplicando "mínimo vocabulario, máxima expresividad" (punto 4 del encargo) contra la arquitectura de la Reference Issue ya acordada (ticket anterior, `PLAN-Aromia-Reference-Issue-01.md`):

| Primitive (Level B) | Cubre del plan de Reference Issue 01 | Construir en esta iteración |
|---|---|---|
| `EditorialOpening` | Portal/portada, apertura de ensayo | **Sí** — implementado abajo (§6) |
| `FullBleedImage` | Pausa/full-bleed, interludios | **Sí** — implementado abajo (§6) |
| `PhotoSequence` | Historia visual, secuencia fotográfica | Sí — spec en §5, sin código completo |
| `ImagePair` | Díptico/comparativa | Sí — spec en §5 |
| `PullQuote` | Cita expresiva | Sí — spec en §5 (el más simple de los cinco) |
| `PortraitFeature` | Retrato de perfumista | Sí — spec en §5 |
| `SectionBreak` | Transición entre tramos | **No como nodo nuevo** — se resuelve con `Heading` + una clase de espaciado en CSS (Level A). Inventar un nodo para esto violaría el principio de vocabulario mínimo. |
| `MarginalNote` | — no aparece en la arquitectura de RI01 (sección B/C del ticket anterior) | **No se construye todavía** — punto 16 del encargo: no construir por adelantado. Si RI01 revela que hace falta, se agrega después. |

Con estos 5 primitives Level B + Level A (párrafos, headings, listas, blockquotes, figuras simples, que ya cubren el 70-80% que pide el encargo) + Level C reservado y sin usar todavía, la Reference Issue 01 completa (18-22 piezas del ticket anterior) es implementable.

---

## 5. Especificación de atributos por primitive (contrato Design ↔ Code)

Cada primitive tiene un vocabulario **cerrado y validado** de `treatment` — Design elige de esta lista, nunca escribe CSS:

```ts
// apps/web/src/lib/editorial/treatments.ts
export const EDITORIAL_OPENING_TREATMENTS = ["quiet", "monumental", "overlap", "image-led"] as const;
export const FULL_BLEED_TREATMENTS = ["standard", "immersive"] as const;
export const PHOTO_SEQUENCE_TREATMENTS = ["horizontal", "stacked", "fragmented"] as const;
export const IMAGE_PAIR_TREATMENTS = ["equal", "asymmetric"] as const;
export const PULL_QUOTE_TREATMENTS = ["quiet", "monumental"] as const;
export const PORTRAIT_FEATURE_TREATMENTS = ["quiet", "immersive"] as const;

export type EditorialOpeningTreatment = (typeof EDITORIAL_OPENING_TREATMENTS)[number];
// ...un type por primitive, todos derivados de arrays const — así el editor
// (sección 15) puede poblar un <select> directamente desde la misma fuente
// que valida el schema (sección 6), sin duplicar la lista en dos lugares.
```

Esto es literalmente la respuesta al punto 10 del encargo ("Design no debe conocer CSS"): Design elige `treatment: "monumental"`. El CSS que produce eso vive exclusivamente en `editorial.css` (sección 9), nunca en la base de datos ni en un formulario libre.

---

## 6. Implementación de referencia (2 primitives completos, de punta a punta)

Elijo `EditorialOpening` y `FullBleedImage` como prueba de concepto porque son los dos casos límite: uno es "texto domina, imagen es evidencia secundaria opcional", el otro es "una sola imagen es la página entera". Si estos dos funcionan de punta a punta (Tiptap → JSON → React → CSS → HTML de fallback), el patrón se repite para los otros tres sin sorpresas de arquitectura.

### 6.1 Extensión Tiptap — `EditorialOpening`

```ts
// apps/web/src/lib/editorial/extensions/EditorialOpening.ts
import { Node, mergeAttributes } from "@tiptap/core";
import { EDITORIAL_OPENING_TREATMENTS, type EditorialOpeningTreatment } from "../treatments";

export interface EditorialOpeningAttrs {
  treatment: EditorialOpeningTreatment;
  imageSrc: string | null;
  imageAlt: string;
}

export const EditorialOpening = Node.create({
  name: "editorialOpening",
  group: "block",
  content: "heading paragraph?", // título obligatorio + deck opcional — Content real, no Art Direction
  isolating: true,

  addAttributes() {
    return {
      treatment: {
        default: "quiet" satisfies EditorialOpeningTreatment,
        validate: (value) =>
          EDITORIAL_OPENING_TREATMENTS.includes(value) ||
          `treatment inválido para editorialOpening: ${value}`,
      },
      imageSrc: { default: null },
      imageAlt: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "section[data-editorial-opening]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    // Serialización de FALLBACK para consumidores legacy (PageFlipReader,
    // PrintableArticle) — deliberadamente simple, sin clases de treatment.
    // El renderer React real (§7) nunca pasa por acá.
    return [
      "section",
      mergeAttributes(HTMLAttributes, { "data-editorial-opening": "" }),
      node.attrs.imageSrc
        ? ["figure", {}, ["img", { src: node.attrs.imageSrc, alt: node.attrs.imageAlt }]]
        : "",
      0, // hueco donde va el contenido (heading + paragraph)
    ];
  },
});
```

> 💡 **Concepto — qué es `validate` en un atributo de nodo:** ProseMirror (el motor de edición debajo de Tiptap) permite declarar una función de validación por atributo. Si alguien intenta guardar `treatment: "dramatic-explosion"` (un valor que Design nunca aprobó), Tiptap rechaza el cambio ahí mismo, antes de que llegue a la base de datos. Es la manera de que "Design no debe conocer CSS" (punto 10 del encargo) sea una regla *aplicada por el sistema*, no solo una convención que alguien podría romper por accidente.

### 6.2 Extensión Tiptap — `FullBleedImage`

```ts
// apps/web/src/lib/editorial/extensions/FullBleedImage.ts
import { Node, mergeAttributes } from "@tiptap/core";
import { FULL_BLEED_TREATMENTS, type FullBleedTreatment } from "../treatments";

export const FullBleedImage = Node.create({
  name: "fullBleedImage",
  group: "block",
  atom: true, // no tiene contenido editable adentro — es una unidad

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "" },
      caption: { default: "" }, // Content — texto real, no decoración
      treatment: {
        default: "standard" satisfies FullBleedTreatment,
        validate: (value) =>
          FULL_BLEED_TREATMENTS.includes(value) || `treatment inválido: ${value}`,
      },
    };
  },

  parseHTML() {
    return [{ tag: "figure[data-full-bleed]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "figure",
      mergeAttributes(HTMLAttributes, { "data-full-bleed": "" }),
      ["img", { src: node.attrs.src, alt: node.attrs.alt }],
      node.attrs.caption ? ["figcaption", {}, node.attrs.caption] : "",
    ];
  },
});
```

### 6.3 El Editorial Renderer — JSON → React

```tsx
// apps/web/src/components/editorial/EditorialRenderer.tsx
import type { JSONContent } from "@tiptap/core";
import { EditorialOpeningBlock } from "./primitives/EditorialOpeningBlock";
import { FullBleedImageBlock } from "./primitives/FullBleedImageBlock";
import { StandardBlock } from "./primitives/StandardBlock"; // Level A: p, h2-h6, ul, ol, blockquote

// Registro explícito y cerrado — si un tipo de nodo no está acá, el renderer
// no debe "adivinar": debe caer a un log de advertencia + StandardBlock,
// nunca a un crash de página completa (progressive enhancement, punto 21).
const PRIMITIVE_RENDERERS: Record<string, React.ComponentType<{ node: JSONContent }>> = {
  editorialOpening: EditorialOpeningBlock,
  fullBleedImage: FullBleedImageBlock,
  // photoSequence, imagePair, pullQuote, portraitFeature — mismo patrón,
  // se agregan cuando su extensión Tiptap exista (§5).
};

export function EditorialRenderer({ doc }: { doc: JSONContent }) {
  return (
    <>
      {(doc.content ?? []).map((node, i) => {
        const Renderer = node.type ? PRIMITIVE_RENDERERS[node.type] : undefined;
        if (Renderer) return <Renderer key={i} node={node} />;
        return <StandardBlock key={i} node={node} />; // Level A cubre el resto
      })}
    </>
  );
}
```

```tsx
// apps/web/src/components/editorial/primitives/FullBleedImageBlock.tsx
import type { JSONContent } from "@tiptap/core";

export function FullBleedImageBlock({ node }: { node: JSONContent }) {
  const { src, alt, caption, treatment } = node.attrs ?? {};
  return (
    <figure className="editorial-full-bleed" data-treatment={treatment}>
      {/* eslint-disable-next-line @next/next/no-img-element -- full-bleed usa
          object-fit/aspect-ratio controlados por CSS, next/image entra en una
          iteración posterior si el análisis de performance lo justifica */}
      <img src={src} alt={alt} loading="lazy" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
```

### 6.4 CSS — el motor de composición (sección 8 del encargo)

```css
/* apps/web/src/styles/editorial.css — nuevo archivo, importado junto a
   aromia-redesign.css. Convención: cada primitive tiene su bloque, cada
   treatment es un selector de atributo, nunca una clase de utilidad suelta. */

.editorial-full-bleed {
  /* Level B por defecto: rompe el contenedor de lectura pero no el viewport
     completo — ese salto (edge-to-edge real) queda reservado para
     [data-treatment="immersive"] */
  width: 100%;
  margin-inline: 0;
}

.editorial-full-bleed img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  object-position: center;
}

.editorial-full-bleed[data-treatment="immersive"] {
  /* edge-to-edge real: se sale del contenedor de lectura usando el truco de
     100vw + centrado, técnica estándar para "full bleed dentro de un layout
     con max-width" */
  width: 100vw;
  margin-inline: calc(50% - 50vw);
}

.editorial-full-bleed[data-treatment="immersive"] img {
  aspect-ratio: 21 / 9;
}

@container (max-width: 640px) {
  /* mobile: reinterpretación de dirección de arte, no reflow (punto 11) */
  .editorial-full-bleed[data-treatment="immersive"] img {
    aspect-ratio: 4 / 5; /* una imagen panorámica no funciona en vertical —
      esto es exactamente "el mismo tratamiento, otra composición" */
  }
}

.editorial-opening[data-treatment="overlap"] {
  display: grid;
  grid-template-columns: subgrid; /* requiere el contenedor padre como grid;
    ver nota de compatibilidad abajo */
  grid-template-rows: auto;
}

.editorial-opening[data-treatment="overlap"] h1 {
  grid-column: 1 / -1;
  grid-row: 1;
  font-size: clamp(2.5rem, 8vw, 6rem);
  z-index: 2;
  margin-block-end: -3rem; /* el overlap real: el título invade el espacio
    de la imagen siguiente sin JS ni posicionamiento absoluto arbitrario */
}

.editorial-opening[data-treatment="overlap"] figure {
  grid-row: 2;
  z-index: 1;
}
```

> 💡 **Concepto — `subgrid` y por qué lo marco con nota de compatibilidad:** `subgrid` (parte del punto 8 del encargo) permite que un elemento hijo herede las columnas exactas del grid padre, en vez de definir las suyas — es lo que hace posible que un título "se alinee" con una imagen que vive en otro nodo sin hardcodear píxeles. Tiene buen soporte en navegadores actuales (Chrome, Firefox, Safari desde 2023), pero **Code debe confirmar el navegador mínimo objetivo de Aromia** antes de depender de esto para el treatment `overlap` — si hace falta soporte más viejo, la alternativa es un grid explícito con el mismo número de columnas repetido en el hijo (más verboso, pero sin depender de `subgrid`).

---

## 7. Nodos restantes (spec, sin implementación completa — se construyen cuando RI01 los necesite en orden)

| Nodo | `content` (ProseMirror) | Attrs clave | Nota de CSS |
|---|---|---|---|
| `pullQuote` | `text*` (solo texto, sin formato anidado) | `treatment: quiet\|monumental`, `attribution` (Content, no decoración) | `monumental` = tipografía display a `clamp(2rem, 6vw, 4.5rem)`; nunca JS |
| `imagePair` | — (`atom`, dos figuras internas como attrs, no como nodos hijos, para que el editor no permita un número arbitrario de imágenes) | `treatment: equal\|asymmetric`, `leftSrc/rightSrc/leftAlt/rightAlt/leftCaption/rightCaption` | CSS Grid 2 columnas; `asymmetric` cambia `grid-template-columns` a `2fr 1fr`, no JS |
| `photoSequence` | — (`atom`, array de imágenes en attrs) | `treatment: horizontal\|stacked\|fragmented`, `images: {src,alt,caption}[]` | `horizontal` = flex + `scroll-snap-type` para mobile; ningún JS de carrusel |
| `portraitFeature` | `heading paragraph+` (nombre + bio real, Content) | `treatment: quiet\|immersive`, `imageSrc/imageAlt` | Similar a `editorialOpening` pero con proporción de retrato fija (`aspect-ratio: 3/4`) |

Ningún nodo de esta tabla requiere JavaScript de layout — todos son CSS puro (grid, container queries, `clamp()`, `aspect-ratio`), consistente con el punto 8 del encargo ("explotar CSS antes de recurrir a JavaScript").

---

## 8. Motion (mínimo, y solo si aporta)

No se introduce GSAP en esta iteración. Ninguno de los 5 primitives de Reference Issue 01 lo necesita para funcionar — el criterio del propio encargo ("si una composición deja de funcionar cuando se elimina la animación, está mal diseñada") es la prueba, y los 5 primitives pasan esa prueba en estático. Si durante RI01 Design encuentra un momento donde un *reveal* sutil en scroll aporta genuinamente (ej. el `PhotoSequence` apareciendo en secuencia), se evalúa GSAP en ese momento puntual, no como dependencia global del sistema. Mantener esto fuera de esta iteración es aplicar el punto 16 del encargo con disciplina, no una omisión.

---

## 9. Level C — dónde vive, sin contaminar el resto

No se construye ningún componente Level C en esta iteración (no hay una necesidad real identificada en Reference Issue 01 — Discovery, mencionado como ejemplo en el encargo, no está en el alcance de RI01 según el plan anterior). La arquitectura sí deja el punto de extensión listo: `PRIMITIVE_RENDERERS` (sección 6.3) es un registro abierto — un componente Level C se registra ahí exactamente igual que un Level B, con la diferencia de que su implementación interna puede ser lo que haga falta (Canvas, WebGL, Three.js) sin que el resto del sistema lo sepa ni le importe. Aislamiento por contrato de interfaz (`{node: JSONContent} → JSX`), no por convención.

---

## 10. Compatibilidad y migración

1. **Migración de schema** (aditiva, sin downtime): `ALTER TABLE articles ADD COLUMN contenido_json JSONB, ADD COLUMN schema_version SMALLINT NOT NULL DEFAULT 1, ADD COLUMN contenido_html_legacy_backup TEXT;` — ningún artículo existente cambia de comportamiento el día que se aplica.
2. **Artículos existentes:** siguen usando `contenido_html` exactamente como hoy. Cero riesgo.
3. **Artículos nuevos con necesidades avanzadas:** usan el nuevo editor (Tiptap + extensiones), se guardan con `contenido_json` poblado, y `contenido_html` se recalcula automáticamente en el servidor al guardar (sección 2.1) — así `PageFlipReader` y `PrintableArticle` **no requieren ningún cambio** para seguir funcionando con artículos nuevos.
4. **Conversión manual de un artículo viejo (opcional, no automática):** acción explícita en el admin ("Convertir a formato estructurado"), que copia `contenido_html` a `contenido_html_legacy_backup` antes de cualquier cambio, y no se ofrece un conversor automático HTML→JSON en esta iteración (es trabajo real de parsing con pérdida potencial de intención editorial — se hace a mano, artículo por artículo, si algún día vale la pena).
5. **Pruebas de regresión obligatorias antes del merge:** correr `PageFlipReader` y `PrintableArticle` contra al menos 3 artículos reales existentes (via el seed o la DB de staging) para confirmar que ninguno cambió de comportamiento.

---

## 11. Seguridad: sanitización (independiente de la decisión de arquitectura, corregir igual)

Agregar sanitización server-side antes de persistir **ambos** caminos (HTML legado y HTML derivado del JSON nuevo):

```ts
// apps/api/src/lib/sanitizeArticleHtml.ts
import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = ["p", "h2", "h3", "h4", "blockquote", "ul", "ol", "li",
  "strong", "em", "a", "figure", "figcaption", "img", "section"];

export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "rel", "target"],
      img: ["src", "alt", "loading"],
      section: ["data-editorial-opening", "data-treatment"],
      figure: ["data-full-bleed", "data-treatment"],
    },
    allowedSchemes: ["https"], // nada de javascript:, data: sin necesidad real
  });
}
```

Se aplica en el endpoint `PUT/POST` de `apps/api/src/routes/admin/articles.ts`, antes del `INSERT`/`UPDATE` — nunca solo en el frontend (un `curl` directo al endpoint admin lo saltearía).

---

## 12. Experiencia del editor (punto 15 del encargo)

El toolbar de `RichTextEditor.tsx` gana un menú "Insertar" con las 5 opciones de la sección 4 en lenguaje editorial ("Apertura editorial", "Imagen a sangre completa", "Cita destacada"...), y cuando el nodo insertado lo requiere, un segundo control "Tratamiento" — un `<select>` poblado directamente desde los arrays de `treatments.ts` (sección 5), nunca texto libre. Esto es una extensión del panel admin existente, no un rediseño — el flujo de borrador/publicado, categorías y SEO no cambia.

### 12.1 React Node Views — evaluación (agregado a pedido del segundo brief)

Pregunta concreta que agrega valor real: ¿el bloque editorial se edita dentro del editor como una tarjeta reconocible (imagen + campos + selector de tratamiento, en línea, mientras se escribe), o como el nodo "en crudo" con un modal aparte para tocar sus atributos?

**Evaluación:** vale la pena para los primitives `atom` (los que no tienen texto editable adentro: `fullBleedImage`, `imagePair`, `photoSequence`) — para esos, sin un Node View, el autor vería un placeholder genérico dentro del editor y tendría que abrir un modal cada vez que quiera cambiar el tratamiento, lo cual rompe el flujo de escritura. **No vale la pena** para `editorialOpening` o `pullQuote` — esos sí tienen contenido de texto editable adentro (`content: "heading paragraph?"`, `content: "text*"`), así que ya se editan naturalmente como cualquier bloque de Tiptap; agregarles un Node View sería complejidad sin beneficio.

**Decisión:** Node View con `ReactNodeViewRenderer` solo para los 3 primitives `atom` (`fullBleedImage`, `imagePair`, `photoSequence`). Ejemplo real, no ilustrativo:

```tsx
// apps/web/src/lib/editorial/extensions/FullBleedImageNodeView.tsx
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { FULL_BLEED_TREATMENTS } from "../treatments";

export function FullBleedImageNodeView({ node, updateAttributes }: NodeViewProps) {
  return (
    <NodeViewWrapper className="editorial-admin-card" data-node-type="full-bleed">
      <p className="editorial-admin-card__label">IMAGEN A SANGRE COMPLETA</p>
      {node.attrs.src ? (
        <img src={node.attrs.src} alt={node.attrs.alt} className="editorial-admin-card__preview" />
      ) : (
        <button type="button" onClick={() => {/* abre selector de assets existente del admin */}}>
          Elegir imagen
        </button>
      )}
      <label>
        Tratamiento
        <select
          value={node.attrs.treatment}
          onChange={(e) => updateAttributes({ treatment: e.target.value })}
        >
          {FULL_BLEED_TREATMENTS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>
    </NodeViewWrapper>
  );
}
```

Registrado en la extensión con `addNodeView() { return ReactNodeViewRenderer(FullBleedImageNodeView); }`. **Punto importante que confirma el principio del brief ("la interfaz del CMS y la presentación pública no tienen por qué ser iguales"):** esta tarjeta (`editorial-admin-card`) tiene su propio CSS, completamente distinto de `editorial.css` (sección 9, sección pública) — nunca comparten clases. Cambiar cómo se ve la tarjeta en el editor no afecta un pixel de la web publicada, y viceversa.

---

## 13. Editorial Capability Test Suite

Correspondencia con los 10 casos pedidos en el punto 20 del encargo, usando el sistema real (no mockups sueltos):

| # | Caso | Nivel | Cómo se prueba |
|---|---|---|---|
| 1 | Artículo editorial convencional | A | Un artículo real existente, sin tocar — regresión pura |
| 2 | Apertura tipográfica monumental | B | `editorialOpening` con `treatment: "monumental"`, sin imagen |
| 3 | Título + fotografía superpuesta | B | `editorialOpening` con `treatment: "overlap"` |
| 4 | Fotografía full bleed | B | `fullBleedImage` con `treatment: "immersive"` |
| 5 | Sección silenciosa, mucho espacio negativo | A | Un solo párrafo corto entre dos primitives, con `margin-block` generoso del sistema de espaciado (sin nodo nuevo) |
| 6 | Image pair asimétrico | B | `imagePair` con `treatment: "asymmetric"` |
| 7 | Secuencia fotográfica | B | `photoSequence` con `treatment: "horizontal"` |
| 8 | Pull quote expresiva | B | `pullQuote` con `treatment: "monumental"` |
| 9 | Composición type-led | B | `editorialOpening` con `treatment: "monumental"` + sin `imageSrc` (mismo nodo, comprobando que "sin imagen" es un estado válido, no un bug) |
| 10 | Responsive reinterpretado mobile | — | Los 9 casos anteriores, capturados en viewport ≤ 640px, confirmando que cada `@container` reinterpreta en vez de apilar sin criterio |

Formato de entrega: página de staging real (`/admin/editorial-test-suite` o similar, protegida como el resto del admin) que renderiza los 10 casos en secuencia con datos reales o realistas — no un Storybook aislado del sistema real de la app, porque el punto 20 del encargo pide explícitamente "usa el sistema real".

---

## 14. Definition of Done

- [ ] Migración de schema aplicada en staging, sin tocar ningún artículo existente.
- [ ] `contenido_html` de 3+ artículos reales, antes y después de la migración, es **byte-idéntico**.
- [ ] `EditorialOpening` y `FullBleedImage` funcionan de punta a punta: admin → JSON → Postgres → renderer React → CSS, con datos reales de Aromia (no Lorem Ipsum).
- [ ] Sanitización server-side activa en el endpoint de guardado, con al menos un test que confirma que un `<script>` inyectado no sobrevive.
- [ ] Los 10 casos de la Editorial Capability Test Suite existen y pasan revisión visual.
- [ ] `PageFlipReader` y `PrintableArticle` siguen funcionando sin modificación para artículos legacy.
- [ ] Documentación agregada a `CLAUDE.md` (memoria técnica de Code): cómo agregar un primitive nuevo, dónde viven los treatments válidos, regla de "vocabulario cerrado, nunca CSS libre desde Design".
- [ ] Nada de esto se mergea a `main` fuera de una rama con PR, siguiendo el flujo normal del repo — **esto lo ejecuta Code**, no yo.

---

## 15. Lo que deliberadamente no se construye en esta iteración

- `MarginalNote` (sin necesidad confirmada en RI01).
- Cualquier componente Level C (WebGL/Canvas) — sin caso de uso real todavía.
- GSAP / motion — sin caso de uso real todavía (sección 8).
- Conversor automático HTML→JSON para artículos legacy.
- Un editor visual de "treatments" tipo WYSIWYG — el `<select>` simple de la sección 12 es suficiente hasta que se demuestre que no alcanza.

Esto no es una lista de pendientes — es, siguiendo el punto 16 del encargo, la lista explícita de lo que **no** se construye por adelantado, para que Reference Issue 01 sea la que decida si hace falta.
