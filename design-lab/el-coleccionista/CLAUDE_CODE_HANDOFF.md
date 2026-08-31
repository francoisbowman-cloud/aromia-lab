# Claude Code Handoff — El Coleccionista

**Estado de esta entrega:** `DESIGN_PROTOTYPE: READY_FOR_EARLY_OMNI`

Este handoff acompaña el espécimen fundador de Claude Design para **El Coleccionista**. No es una instrucción para publicar ni para convertir esta composición en un template universal.

## 1. Propósito

Claude Code debe usar este material para extraer infraestructura durable de Aromia sin congelar la composición específica del artículo.

La lectura correcta es:

- `AROMIA_FOUNDATION` → puede consolidarse como sistema estable cuando la evidencia lo justifique;
- `REUSABLE_PRIMITIVE` → puede implementarse como vocabulario reutilizable y editable;
- `STORY_SPECIFIC` → permanece local a *El Coleccionista*;
- `EXPERIMENT` → no se promueve sin prueba posterior.

El prototipo debe entenderse como espécimen de alta resolución visual, no como una maqueta para copiar mecánicamente.

## 2. Arquitectura visual descubierta

La identidad del prototipo no depende de un hero ni de una plantilla fija. Surge de una relación editorial de tres zonas:

`CARRIL → CAMPO DE LECTURA → ZONA MARGINAL`

La composición cambia según cuánto ocupa cada zona, no según sustituir un layout completo.

### 2.1 Tokens nuevos / confirmados

La paleta usada por el espécimen está documentada en `VISUAL_GRAMMAR_SHEET.md`.

Reglas particularmente importantes:

- el fondo base es casi blanco cálido;
- la vitela es una superficie episódica, no el fondo global de Aromia;
- `#6B6155` es el tono muted/tertiary más claro permitido en este espécimen;
- no introducir un tercer gris más pálido para captions, numerales, disclosures o labels;
- `#4E463A` se reserva para texto pequeño cuando la superficie rayada necesita contraste adicional.

### 2.1b Contraste — regla explícita para implementación

La auditoría del prototipo detectó que `#9A9083` quedaba en aproximadamente `2.62:1` sobre la superficie de vitela. Ese valor fue eliminado.

**Claude Code no debe reintroducirlo ni crear un tercer nivel de gris equivalente.**

La jerarquía terciaria debe sostenerse mediante:

- tamaño;
- tracking;
- mayúsculas;
- posición;
- ritmo;

no mediante pérdida de contraste.

Usar `#6B6155` para muted/tertiary sobre las superficies del espécimen y `#4E463A` en el caption del espécimen rayado.

Esta regla es coherente con el fix previo de `--muted` documentado en `globals.css`: no tratar la baja legibilidad como una estética editorial.

### 2.2 Tipografía

En el Visual Grammar Sheet §2, con valores `clamp()` listos para copiar. Cambio a registrar: **el cuerpo del ensayo es `font-display` (Newsreader), no `font-sans`.** Verificar contra `apps/web/src/app/magazine/[slug]/page.tsx`, que ya lo hace así — esto lo confirma como fundación, no como novedad.

### 2.3 Grid / relación espacial

La fila editorial de tres zonas es el hallazgo central del espécimen.

No implementarla como una plantilla rígida de artículo. Debe existir como una relación compositiva adaptable.

En desktop, las zonas pueden coexistir. En anchos reducidos, el colapso debe conservar la función editorial: las notas marginales se convierten en interludios dentro del flujo.

No depender de media queries específicas del prototipo cuando CSS intrínseco, `minmax()`, `clamp()` y el flujo natural resuelvan mejor la adaptación.

## 3. Primitives candidatos

La lista completa vive en `PRIMITIVE_INVENTORY.md`.

Los candidatos más importantes para extracción son:

- editorial row / three-zone field;
- reading field;
- marginal note / marginal interlude;
- density transition;
- serial field / repetition band;
- archive surface;
- whitespace reset;
- verified object/product reference;
- caption / credit treatment;
- contextual reference / commerce close.

No son cards ni secciones completas.

Cada primitive debe poder variar en:

- densidad;
- ocupación;
- escala;
- alineación;
- orden;
- comportamiento responsive;

sin producir cinco artículos visualmente idénticos.

## 4. Decisiones que deben permanecer STORY_SPECIFIC

No promover automáticamente:

- la progresión exacta `110 → 56 → 36 → 22px`;
- las cuatro bandas exactas de flankers;
- el overflow hacia la derecha como gesto obligatorio;
- la secuencia concreta de numerales del artículo;
- la vitela en el mismo punto narrativo;
- los `300px` exactos del reset de “Sí, pero”;
- la inversión específica en la que el título de “Sí, pero” queda más pequeño que el cuerpo;
- las frases y conteos concretos del manuscrito;
- la regleta temporal de Aventus;
- cualquier gesto diseñado específicamente para representar compulsión/colección.

Esos elementos pueden inspirar futuros usos, pero no constituyen por sí mismos Aromia Foundation.

## 5. Controles de inspección del prototipo

El prototipo incorpora:

- `showClassification`
- `showGrid`
- `accumulationRows`

`showClassification` superpone las etiquetas:

- `FOUNDATION`
- `PRIMITIVE`
- `STORY_SPECIFIC`
- `EXPERIMENT`

También muestra las cinco advertencias `VERIFICAR` sobre hechos que requieren comprobación antes de publicar.

Estos controles son herramientas de diseño/QA. No deben llegar a producción pública.

## 6. Hechos pendientes de verificación

Antes de publicar deben resolverse los cinco hechos listados en `STORY_SPECIFIC_LEDGER.md`:

1. año de lanzamiento de Aventus usado en la regleta;
2. proporción `30–40%` de flankers;
3. cifra de `4 de cada 10 hogares`;
4. paráfrasis/atribución del perfumista de Dsm-Firmenich;
5. vigencia de los nombres citados de la línea Le Male.

El prototipo los muestra como `VERIFICAR` cuando `showClassification` está activo.

No convertir ninguna de esas afirmaciones en UI documental “autoritaria” hasta que editorial las confirme.

## 7. Activos visuales

El estado real es:

- **2 ranuras editoriales `PENDIENTE`**: apertura + tríptico documental;
- **1 asset de identidad `PENDIENTE`**: firma `A.`; no cuenta como ranura visual de la historia;
- **2 decisiones `NOT_REQUIRED`**: flankers resueltos tipográficamente + ausencia deliberada de imagen en `Sí, pero`.

No inferir una tercera ranura `NOT_REQUIRED`.

La ausencia de imagen en Acto IV es una decisión narrativa, no un hueco de producción.

## 8. Estado operativo

```text
EDITORIAL: READY
ART_DIRECTION: READY
DESIGN_PROTOTYPE: READY_FOR_EARLY_OMNI
DESIGN_SYSTEM_EXTRACTION: READY   (Code, 2026-08-30 — ver §11)
EARLY_OMNI: PASS
VISUAL_ASSETS: READY_WITH_CONSTRAINTS (2 ranuras como ficha de encargo · firma A. tipográfica · 2 NOT_REQUIRED)
IMPLEMENTATION: READY_FOR_FINAL_OMNI   (Code, 2026-08-30 — rama local, sin publicar)
QA: PENDING   (OMNI final — gate de experiencia renderizada)
PUBLISH: PENDING
TARGET_DATE: UNSCHEDULED
```

## 11. Extracción e implementación ejecutadas — Code, 2026-08-30

Rama local `feat/el-coleccionista-design-lab` (sin push, sin deploy — modo
`Continúa Aromia desde el repo, sin publicar`).

**Sistema extraído** (solo lo clasificado `AROMIA_FOUNDATION` / `REUSABLE_PRIMITIVE`
en el Visual Grammar Sheet, el Primitive Inventory y la promotion decision de
Early OMNI):

- `apps/web/src/app/editorial.css` — tokens de color/material, escala
  tipográfica verificada, ritmo de espaciado (escala, no la curva), fila
  editorial de 3 zonas (P-01), lenguaje de caption (§6), contrato de contraste
  (sin tercer gris). Superficie clara única, sin tema oscuro de artículo.
- `apps/web/src/components/editorial/` — `EditorialRow` (P-01), `CaptionCredit`
  (P-02), `SpecimenSlot` (P-03), `ProportionMarks` (P-04), `ArchiveSurface`
  (P-05), `TimeRuler` (P-06), `ContextualClose` (P-07), `ActIndicator` (P-08),
  `EditorialBar` (§8). Código editable con variantes, no captura del prototipo.
- `apps/web/src/app/design-lab/` — superficie de inspección permanente,
  `noindex`, fuera de nav y sitemap.
- P-09 (Density Curve) y P-10 (Compressing Serial Field) **no** se extrajeron:
  quedan como `EXPERIMENT` / `STORY_SPECIFIC`, viven solo en la ruta del artículo.

**El Coleccionista implementado** en ruta propia
`apps/web/src/app/magazine/el-coleccionista/` — compuesto desde Foundation +
primitivas + gestos locales (`story.css`, `SerialField.tsx`). NO es un
`ArticleTemplate`. Todos los `STORY_SPECIFIC` del Ledger (S-01…S-09) quedan
locales. `noindex`, `PUBLISH: PENDING`.

Correcciones de fact-check ya incorporadas al render: el gráfico `4/10 hogares`
no existe; el `30–40 %` va como banda de intervalo atribuida a Johanna Monange
(Glossy 2025); Dora Baghriche nombrada como fuente sin cita inventada; primera
banda del campo serial = 4 nombres verificados de Le Male con caption de
honestidad; Aventus `2010` atribuido a Creed; regla temporal con nota de que
las marcas intermedias no son reformulaciones fechadas.

Pendiente antes de publicar (no bloquea a OMNI final):
1. Activo de apertura: inspeccionar la candidata Unsplash (Tanya Barrow) a
   resolución final o decidir publicar sin imagen. Hoy es `SpecimenSlot` como
   ficha de encargo.
2. El manuscrito de `drafts/el-coleccionista.md` debe reflejar las mismas
   correcciones de fact-check antes de que exista una versión publicable.
3. Decidir si la ruta bespoke reemplaza / redirige a un eventual
   `/magazine/el-coleccionista` del pipeline de Postgres.

`tsc --noEmit` y `next lint` limpios. Verificado en navegador desktop (1280) y
mobile (375): sin scroll horizontal, colapso de carril/margen a interludios,
liberación de "Sí, pero" perceptible en ambos, indicador de acto por
IntersectionObserver, campo serial saliéndose por la derecha con recorte.

## 9. Qué debe hacer Claude Code después de Early OMNI

Si Early OMNI devuelve `PASS` o una revisión explícitamente resuelta:

1. construir/actualizar la ruta interna `/design-lab`;
2. trasladar allí Foundation y primitives aprobados;
3. mantener visibles variantes y comportamiento responsive;
4. implementar los primitives como código editable, no como captura del prototipo;
5. preservar `STORY_SPECIFIC` fuera del sistema universal;
6. implementar *El Coleccionista* desde el sistema extraído + su composición local;
7. renderizar en navegador desktop y mobile;
8. comparar contra el espécimen por intención, ritmo y jerarquía, no por pixel-copy ciego;
9. dejarlo listo para OMNI final;
10. **no publicar** salvo instrucción operativa posterior que lo autorice.

## 10. Regla anti-template

Antes de promover cualquier primitive o relación a Foundation, aplicar esta pregunta:

> ¿La misma disposición exacta podría utilizarse sin cambios para los próximos cinco artículos?

Si la respuesta es sí, se está estandarizando demasiado.

La meta es:

> **Repeat identity. Vary composition.**

La identidad debe reconocerse en relaciones, oficio y comportamiento; la originalidad debe venir de la composición de cada historia.
