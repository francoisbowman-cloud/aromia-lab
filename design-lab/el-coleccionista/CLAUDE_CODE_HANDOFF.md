# Handoff a Claude Code — `/design-lab` y sistema compartido
### Origen: `design-lab/el-coleccionista/el-coleccionista-prototype.dc.html` · 2026-08-30

No implementar producción. No publicar. Estado: pendiente de `EARLY_OMNI`.

---

## 0. Qué hay en esta carpeta

```
design-lab/el-coleccionista/
  el-coleccionista-prototype.dc.html   prototipo completo, renderizable e inspeccionable
  VISUAL_GRAMMAR_SHEET.md              relaciones de identidad descubiertas
  PRIMITIVE_INVENTORY.md               primitivas demostradas en uso
  STORY_SPECIFIC_LEDGER.md             S-01 … S-09, lo que NO se extrae
  CLAUDE_CODE_HANDOFF.md               este documento
```

El prototipo se abre directamente en un navegador. Trae tres controles de inspección:

- `showClassification` — superpone las etiquetas `AROMIA_FOUNDATION` / `REUSABLE_PRIMITIVE` / `STORY_SPECIFIC` / `EXPERIMENT` sobre las decisiones reales, más las marcas `VERIFICAR`.
- `showGrid` — dibuja las tres zonas de la fila editorial.
- `accumulationRows` (3–16) — escala la densidad del campo serial; sirve para ver la curva de densidad como variable.

Léelos antes de extraer nada: son el mapa de qué es sistema y qué es historia.

## 1. Orden de trabajo

1. Abrir el prototipo con `showGrid` y `showClassification` activados.
2. Extraer **solo** la fundación (§2) y las primitivas marcadas `REUSABLE_PRIMITIVE` en el inventario (P-01 … P-08).
3. Montar `/design-lab` (§4) con cada primitiva y sus variantes en condiciones reales de navegador.
4. Mantener `El Coleccionista` como ruta aislada que **usa** las primitivas pero conserva su composición local (§5).
5. No tocar producción.

## 2. Fundación a extraer

### 2.1 Tokens nuevos / confirmados

```
--paper           #FAF8F4
--paper-release   #FDFCFA
--vellum          #EFEAE0
--ink             #1F1B15
--muted           #6B6155
--tertiary        #6B6155   (= --muted; ver §2.1b)
--line-soft       rgba(31,27,21,.12)
--line-strong     rgba(31,27,21,.35)
--specimen-a      #DFD8C9
--specimen-b      #D5CDBB
```

### 2.1b Sin tercer nivel de gris

El rol "terciario" (rótulos, numerales de sección, divulgación de afiliación) **comparte valor con `--muted`**. Cualquier gris más claro falla AA a 12px sobre vitela (`#EFEAE0`), que es el fondo más exigente de la paleta. El prototipo llegó a usar `#9A9083` y midió 2.62:1 ahí — exactamente la banda que la auditoría OMNI ya corrigió en `--muted` (#8a8172 → #675e52, documentado en `globals.css`). No reintroducir un tercer gris: la jerarquía del rótulo se consigue con mayúsculas, tracking y tamaño.

`--ink` (#1F1B15) es ligeramente más cálido que el `--text` actual (#211d17). **Decidir explícitamente** si se unifica o si el artículo usa su propio ink. No lo resuelvas por inercia.

Ningún token de acento. El acento es episódico y vive en la historia (ver S-06).

### 2.2 Escala tipográfica

En el Visual Grammar Sheet §2, con valores `clamp()` listos para copiar. Cambio a registrar: **el cuerpo del ensayo es `font-display` (Newsreader), no `font-sans`**. El sistema existente puede seguir usando `font-sans` para UI, navegación y chrome.

### 2.3 Fila editorial de tres zonas

La identidad estructural se basa en una relación repetida:

`carril / campo de lectura / zona marginal`

No extraer coordenadas rígidas. Extraer la relación de anchos, gaps y comportamiento de colapso. La composición cambia por cuánto ocupa cada zona, no porque cambie la estructura base.

### 2.4 Colapso móvil intrínseco

No introducir media queries para recrear esta pieza. Las zonas usan flex-wrap y mínimos de contenido; al colapsar, la marginalia se convierte en interludio entre fragmentos de lectura.

Eso es parte del comportamiento fundacional, no un parche responsive.

## 3. Primitivas a extraer

Consultar `PRIMITIVE_INVENTORY.md`. Extraer únicamente las primitivas marcadas `REUSABLE_PRIMITIVE`.

Cada primitiva debe llegar a `/design-lab` con:
- nombre;
- propósito editorial;
- variantes demostradas;
- content constraints;
- responsive behavior;
- estado (`REUSABLE_PRIMITIVE` o `EXPERIMENT`);
- al menos un ejemplo renderizado.

No promover los experimentos por anticipado.

## 4. `/design-lab`

Crear una superficie interna y editable que permita inspeccionar:
- tokens/foundation;
- tipografía y reading measure;
- grid editorial;
- primitivas;
- variantes;
- captions/credits;
- estados responsive;
- ejemplos de densidad/whitespace;
- motion solo donde la primitiva lo requiera;
- experimentos todavía no canónicos.

No convertirlo en una página pública de marketing o style guide. Es una mesa de trabajo.

## 5. `El Coleccionista` como composición local

La ruta debe usar la infraestructura compartida solo donde corresponda. Mantener locales:
- curva de densidad;
- campo serial;
- tríptico de conservación;
- liberación de `Sí, pero`;
- nombres de acto;
- acento marino;
- lockup del titular;
- recorte lateral de apertura;
- ausencia deliberada de imagen en Acto IV.

Ver `STORY_SPECIFIC_LEDGER.md`.

## 6. Reglas de fidelidad

No simplificar la pieza para hacerla más reutilizable.

Verificar:
1. ¿Sigue existiendo la relación carril / lectura / marginalia?
2. ¿El cambio de densidad ocurre por composición y no por cambiar de plantilla?
3. ¿El colapso móvil se comprueba por ancho de contenedor y no solo de viewport?
4. ¿Las cinco marcas `VERIFICAR` del Ledger siguen visibles y sin resolver en el prototipo?
5. ¿Los placeholders de activo conservan su especificación editorial?
6. ¿Sigue siendo posible componer una historia que no se parezca a esta con estas mismas primitivas? Si no, se extrajo de más.

### 7.1 Conteo de activos

El conteo canónico es:
- **2 ranuras editoriales `PENDIENTE`**: apertura + tríptico documental;
- **1 asset de identidad `PENDIENTE`**: firma `A.`; no cuenta como ranura visual de la historia;
- **2 decisiones `NOT_REQUIRED`**: flankers resueltos tipográficamente + ausencia deliberada de imagen en `Sí, pero`.

No inferir una tercera ranura `NOT_REQUIRED`.

## 8. Estado

```text
DESIGN_PROTOTYPE: READY_FOR_EARLY_OMNI
DESIGN_SYSTEM_EXTRACTION: PENDING
EARLY_OMNI: PENDING
VISUAL_ASSETS: PENDING (2 ranuras editoriales + 1 asset de identidad · 2 NOT_REQUIRED)
IMPLEMENTATION: BLOCKED — requiere EARLY_OMNI: PASS
PUBLISH: BLOCKED
```
