# AROMIA — Auditoría profunda de integración de Diseño

DATE: 2026-09-06
ACTOR: Code
HANDOFF: `handoffs/AROMIA_CODE_DEEP_DESIGN_INTEGRATION_2026-09-06.md`
BASE_REF: `main` @ `b99a2bf`
BRANCH: `feat/deep-design-integration`
STATUS: AUDITORÍA CERRADA — IMPLEMENTACIÓN PENDIENTE DE APROBACIÓN

---

## 1. Cómo se obtuvo la evidencia

Toda la evidencia de composición y tipografía se tomó contra **producción**
(`https://aromialab.com`), no contra local. La razón es concreta: en el entorno
local `next/font` no consigue descargar Newsreader y cae a un fallback sans, de
modo que un screenshot local no representa la tipografía real del sitio.
Producción sirve las fuentes correctas.

Herramienta: Chromium headless vía `playwright-core`, instalado **fuera del
repositorio** (directorio scratchpad de la sesión), reutilizando los binarios de
Playwright ya presentes en la máquina. **No se agregó ninguna dependencia al
repo.**

Cobertura efectiva:

- **17 superficies** públicas.
- **7 viewports**: 390×844, 430×932, 768×1024, 1024×768, 1280×900, 1440×1000, 1728×1117.
- **Modo claro y oscuro** (oscuro medido en 390 y 1440).
- **119 + 48 = 167 registros** de medición y **99 screenshots**.

Cada hallazgo de abajo está respaldado por medición reproducible, no por
impresión visual.

### Límites declarados de esta evidencia

Para que nadie los tome por más de lo que son:

- La métrica de caracteres por línea es **aproximada** (asume ancho medio de
  glifo = 0,5 em). Sirve para detectar valores atípicos, no como medida exacta.
- El detector de «titular grande sin enlazar» **sobre-reporta**: en páginas de
  artículo los encabezados de sección (`Salida`, `Corazón`, `Qué huele`)
  correctamente no son enlaces. El hallazgo real se acotó a mano (§4.6).
- La verificación de contraste recorre el ancestro con fondo no transparente;
  puede equivocarse cuando el texto va sobre imagen. Los casos reportados se
  confirmaron además visualmente.

---

## 2. Hallazgos por severidad

| # | Severidad | Hallazgo | Gate del handoff |
|---|---|---|---|
| 1 | **P0** | 9 rutas de SubBatch 01 devuelven HTTP 500 en producción | Rutas funcionando |
| 2 | **P0** | ~26 MB de fotografía de terceros hotlinkeada sin optimizar | Image failure |
| 3 | **P1** | Modo oscuro: metadata a 1,08:1 de contraste | Accesibilidad / dark |
| 4 | **P1** | `/magazine` desborda horizontalmente en móvil | Mobile failure |
| 5 | **P1** | 30 tamaños display distintos: no hay escala tipográfica | System failure |
| 6 | **P1** | Recortes que destruyen el motivo de la imagen | Crop failure |
| 7 | **P1** | Sin caption ni procedencia en la mayoría de las imágenes | Contrato de imagen §3 |
| 8 | **P2** | Jerarquía: hasta 6 titulares compitiendo en el primer viewport | Hierarchy failure |
| 9 | **P2** | Ritmo: índices uniformes de hasta 14 elementos idénticos | Rhythm failure |
| 10 | **P2** | Titulares de historia no enlazados en Home, sí en `/magazine` | System failure |
| 11 | **P2** | Medida de lectura estrecha en toda la publicación | Tipografía |
| 12 | **P3** | Etiquetas y enlaces con tratamiento visual idéntico | Link appearance |

---

## 3. P0 — Bloqueantes

### 3.1 Las nueve historias de SubBatch 01 están caídas en producción

Verificado por HTTP directo, en los siete viewports y también por `curl`:

```
500  /historias/antes-del-perfume-ya-oliamos
500  /historias/comprar-para-oler-o-comprar-para-tener
500  /historias/cuando-ya-no-hueles-tu-perfume
500  /historias/fougere-no-significa-viejo
500  /historias/huele-sintetico-que-estamos-diciendo
500  /historias/lavanda-limpia-medicinal-barata-elegante
500  /historias/nos-perfumamos-para-nosotros-o-para-los-demas
500  /historias/podemos-describir-un-olor-sin-compararlo
500  /historias/por-que-una-lista-de-notas-no-te-dice-como-huele
```

Las otras cuatro historias (`el-coleccionista`, `el-perfume-que-encargo-un-sultan`,
`el-ambar-que-nunca-toco-una-ballena`, `el-perfumista-que-no-teme-exagerar`)
responden 200.

**Esto contradice el registro de estado.** `AROMIA_CURRENT_STATE.md` v45 afirma:

> `RAILWAY_RUNTIME: production build succeeded after draft-context fix; all nine SubBatch 01 routes prerendered successfully`

El build sí las prerenderiza — el build local las lista como estáticas (`○`).
Lo que falla es el runtime.

**Causa raíz.** `apps/web/src/app/(editorial)/historias/subBatch01Story.tsx` lee
el Markdown del artículo **desde el sistema de archivos en tiempo de render**:

```ts
function draftDirectory() {
  const candidates = [
    path.join(process.cwd(), "drafts"),
    path.join(process.cwd(), "..", "..", "drafts"),
  ];
  return candidates.find((candidate) => existsSync(candidate));
}

function readDraft(slug: SubBatch01Slug) {
  const directory = draftDirectory();
  if (!directory) throw new Error("Aromia drafts directory was not found during build.");
  return readFileSync(path.join(directory, `${slug}.md`), "utf8");
}
```

`drafts/` vive en la raíz del monorepo y está presente en el contexto de build
(eso resolvió el commit `e408cf2`), pero **no en la imagen de runtime**, que sólo
lleva la salida de `apps/web`. Cuando el render ocurre en runtime en lugar de
servirse el HTML prerenderizado, `draftDirectory()` devuelve `undefined`, se
lanza la excepción y Next responde 500.

**Atenuante importante:** estas nueve rutas **no están en `sitemap.xml` ni
enlazadas** desde Home ni desde `/magazine`. Están huérfanas. No hay lectores
cayendo en un 500 ni daño de SEO — pero **la totalidad de la producción
editorial de SubBatch 01 es inaccesible**.

No lo arreglé en esta pasada: el handoff prohíbe expresamente pisar los
pipelines de SubBatch (`Do not overwrite unrelated editorial work or SubBatch
pipelines`), y la corrección correcta —dejar de leer del disco en runtime—
toca el pipeline editorial, no la capa de diseño.

### 3.2 ~26 MB de fotografía de terceros servida sin optimizar

`apps/web/src/app/(editorial)/editorialVisuals.tsx` y otros cinco puntos pasan
`unoptimized` a `next/image` para cualquier origen externo. Introducido en
`1e190cf` por una razón legítima —evitar 429 intermitentes de Wikimedia— pero
el efecto es que **toda** la fotografía externa esquiva el optimizador: sin
redimensionado, sin WebP, sin `srcset`.

Peso real de cada original, medido:

| Archivo | Peso | Se muestra a | Superficie |
|---|---|---|---|
| `Christine_Nagel.jpg` | **7.954 KB** | 340×426 | `/perfumistas` |
| `Santalum_album.jpg` | **7.650 KB** | 163×204 | `/academia` |
| `Blood-red_rose_up_close.jpg` | **4.598 KB** | 292×521 | Home, `/magazine` |
| `Alberto_Morillas.jpg` | **4.278 KB** | 340×426 | `/perfumistas`, ficha |
| `Red_rose_close-up.jpg` | 771 KB | — | `/historias/[slug]` |
| `Bergamotfruit.jpg` | 239 KB | 163×204 | `/academia` |
| `Patchouli.jpg` | 187 KB | 163×204 | `/academia`, historias |
| `Pretty_Pink_Rose_Closeup.jpg` | 119 KB | 163×204 | `/academia` |

Un retrato de 7,8 MB para un hueco de 340×426 es un factor de desperdicio de
~180×. `/academia` sola arrastra ~8,2 MB de originales de Wikimedia.

**Consecuencia observada, no teórica:** en el barrido a 390 px el retrato de
Christine Nagel devolvió `naturalWidth = 0` — es decir, **no llegó a cargar**.
La página muestra un hueco vacío donde debería ir la persona.

Hay además 8 URLs de `images.unsplash.com` en `IngredientesGrid.tsx`. Esas
llevan `w=700&q=70`, así que Unsplash ya sirve una versión reducida: son mucho
menos graves, pero mantienen la dependencia de un tercero en runtime.

---

## 4. P1 / P2 — Calidad de diseño

### 4.1 Modo oscuro: texto a 1,08:1

En Home, en oscuro, varios elementos de metadata quedan prácticamente
invisibles. Medidas de contraste:

| Texto | Contraste | Tamaño |
|---|---|---|
| `Revista de perfumería` | ~1,1:1 | — |
| `Mascate · Omán · 1982` | **1,08:1** | 9 px |
| `Materia · origen · transformación` | **1,08:1** | 9 px |
| `Dominique Ropion · intensidad` | **1,08:1** | 9 px |
| `Ensayos, materias y relatos…` | **1,04:1** | 14 px |

WCAG AA pide 4,5:1. Confirmado visualmente: en el screenshot de Home en oscuro
a 1440, «Revista de perfumería» y la etiqueta «PORTADA» se leen apenas contra
el fondo. Son colores de modo claro que no se invierten con el tema.

También en **modo claro**: `Reseña` en `/magazine/[slug]` mide 1,53:1 a 11 px.

Esto responde negativamente a la pregunta que plantea el propio handoff:
*«Does dark mode preserve hierarchy rather than just invert color?»*

### 4.2 `/magazine` desborda en móvil

| Viewport | Desborde |
|---|---|
| 390×844 | **+110 px** |
| 430×932 | **+70 px** |
| 768 y superiores | 0 |

Es la única superficie de las 17 con desborde horizontal. Se reproduce en claro
y en oscuro.

### 4.3 No existe una escala tipográfica

`AROMIA_VISUAL_DIRECTION_SYSTEM.md` §4 fija **cuatro** roles repetidos (Display,
Deck, Body, Metadata) y advierte: *«Avoid adding new type styles to solve one
page.»*

Medición a 1440 px, tamaños distintos ≥28 px efectivamente usados en el sitio:

```
105,1 · 104 · 97,9 · 92 · 86 · 84 · 80 · 78 · 77,8 · 76 · 74,9 · 72 · 70 · 68
66,2 · 60 · 54 · 50 · 48 · 46 · 44 · 40 · 38 · 36 · 34 · 33 · 32 · 31 · 30 · 28,8
```

**30 valores distintos.** Y los pares `105,1/104`, `77,8/76`, `74,9/72`,
`34/33`, `31/30` son visualmente indistinguibles: no son decisiones de
jerarquía, son páginas que se inventaron su propia escala con `clamp()` local.

Sólo en Home conviven cuatro tamaños display (97,9 · 77,8 · 74,9 · 72) donde el
sistema pide uno dominante y uno de apoyo.

Es el hallazgo más sistémico de la auditoría: no se arregla página por página,
se arregla definiendo la escala como token y haciendo que las superficies la
consuman.

### 4.4 Recortes que borran el motivo

El recorte se midió como cociente entre la relación de aspecto de la fuente y
la del marco. 1,0 = sin distorsión; >1,6 = se descarta más de un tercio del
ancho.

| Imagen | Superficie | Factor |
|---|---|---|
| `oman-place-documentary` | `/historias/…sultan` @1440 | **2,42** |
| `oman-place-documentary` | Home @390 | **2,35** |
| `Blood-red_rose` | Home @390 | **2,68** |
| `Patchouli` | `/academia` (todos los viewports) | **1,87** |
| `Bergamotfruit`, `Pretty_Pink_Rose` | `/academia` (todos) | **1,67** |
| `clary-sage-documentary` | Home @768 / @1440 | **0,58** |

El caso de Omán es el más claro: es un **paisaje** de Jabal Akhdar —la montaña
es la evidencia documental— comprimido en un marco vertical que descarta ~57 %
del ancho. El gate del handoff lo nombra exactamente: *«The crop removes the
visual evidence or subject that justifies the image.»*

`/academia` repite 1,67–1,87 en todos los viewports: no es un caso puntual sino
un marco cuadrado aplicado a fuentes apaisadas.

### 4.5 Falta caption y procedencia

Imágenes sin `figcaption`, medido a 390 px:

| Superficie | Sin caption |
|---|---|
| `/descubrir` | **10 / 10** |
| Home | **3 / 3** |
| `/magazine` | 2 / 2 |
| `/perfumistas/francis-kurkdjian` | 2 / 2 |
| `/perfumistas/alberto-morillas` | 2 / 3 |
| `/catalogo/[slug]` | 1 / 1 |
| `/historias/el-coleccionista` | 1 / 1 |

El contrato de imagen (§3) pide caption en flujo normal y procedencia cuando la
licencia lo exige. Merece atención especial que los retratos de perfumistas
aparezcan sin caption, porque el estado declara
`PERSONAS_RIGHTS_READY: … use real reusable portraits with visible attribution`.
La atribución no está saliendo como `figcaption` en la figura del retrato;
habría que confirmar por dónde se está rindiendo antes de tocarla.

### 4.6 Titulares de historia sin enlazar en Home

En Home los tres titulares de historia (`El perfume que encargó un sultán`,
`El ámbar que nunca tocó una ballena`, `El perfumista que no teme exagerar`) no
son enlaces; sólo lo es el «Leer historia →» al pie. La imagen tampoco enlaza.

En `/magazine` **los mismos titulares sí son enlaces**.

El problema no es que falte un enlace, es que **el mismo objeto editorial se
comporta distinto según la superficie**. Eso es exactamente el *System failure*
del handoff: comportamiento visible repetido, implementado de forma
independiente y sin razón que lo justifique.

*(Aclaración: los encabezados de sección dentro de artículos —`Salida`,
`Corazón`, `Qué huele`— correctamente no son enlaces y quedan fuera de este
hallazgo.)*

### 4.7 Jerarquía: demasiados titulares en el primer viewport

Titulares ≥28 px visibles en el primer viewport:

| Superficie | @390 | @1440 |
|---|---|---|
| `/descubrir/familias` | 3 | **6** |
| `/academia` | 2 | **5** |
| `/perfumistas` | — | **4** |
| Home, `/magazine`, `/descubrir`, `/club`, `/quiz` | 2 | 2 |

La regla 5 pide una idea dominante por viewport. Con seis titulares del mismo
peso, el lector no tiene por dónde entrar.

### 4.8 Ritmo: índices uniformes

Repetición del mismo tamaño de titular dentro de una superficie:

| Superficie | Repetición |
|---|---|
| `/magazine` | **14×** a 40 px |
| `/academia` | **14×** a 24 px |
| `/perfumistas` | **11×** a 32 px |
| `/descubrir/familias` | **10×** a 38 px |

El arquetipo C (Editorial Index) pide explícitamente evitar la grilla uniforme y
apoyarse en numeración y metadata. Hoy `/magazine` es una lista de 14 elementos
idénticos.

### 4.9 Medida de lectura estrecha

Caracteres por línea aproximados (rango cómodo: 45–75):

| Superficie | Viewport | cpl | Ancho / cuerpo |
|---|---|---|---|
| Home | 1440 | **31** | 351 px / 22,3 px |
| `/descubrir/familias/floral` | 390 | **31** | 342 px / 22 px |
| Home | 1728 | **35** | 438 px / 25 px |
| `/magazine/[slug]`, historias | 390 | 36–37 | 342–350 px / 19 px |
| Resto | 390 | 43–44 | 342 px / 16 px |

El caso de Home a 1440 y 1728 es el llamativo: en pantallas anchas la columna de
texto se queda en ~350–440 px con cuerpo de 22–25 px, lo que produce líneas muy
cortas y un ritmo de lectura entrecortado.

### 4.10 Etiquetas y enlaces indistinguibles

En `/academia`, los enlaces de capítulo (`ESTRUCTURA`, `FAMILIAS`,
`CONCENTRACIÓN`, `HISTORIA`) usan exactamente el mismo tratamiento —mayúsculas,
espaciado, tamaño, color— que las etiquetas que **no** son enlaces (`SABER`,
`01 / ESTRUCTURA`). Nada distingue lo navegable de lo decorativo.

### 4.11 Objetivos táctiles

Entre 1 y 2 enlaces por página con altura <32 px en móvil
(`/descubrir/familias/floral` y `/catalogo/[slug]` con 2 cada una). Es menor,
pero acumulativo.

---

## 5. Lo que está bien y no hay que tocar

Para que la pasada de implementación no rompa lo que ya funciona:

- **Ningún href muerto, ningún `#`, ningún `javascript:`** en las 17 superficies.
- **Ningún botón inerte** detectado.
- **Sin desborde horizontal** en 16 de 17 superficies, en los 7 viewports.
- Las páginas de historia (`el-coleccionista`, `sultan`) tienen una composición
  de lectura sólida en móvil: kicker, display serif, deck y entrada de imagen.
- El tema oscuro se aplica correctamente a nivel de superficie
  (`#0e1311`); el problema es de tokens de texto puntuales, no del sistema.
- `/academia` compone bien en móvil salvo por lo señalado en §4.10.

---

## 6. Plan de implementación propuesto

Ordenado por relación impacto/riesgo. **Nada de esto está ejecutado todavía.**

### Tanda A — corrige daño real

1. **Localizar la fotografía de terceros** (aprobado por Brey en esta sesión).
   Bajar los 8 originales de Wikimedia a `public/`, con procedencia y
   atribución versionadas junto al archivo, y **retirar `unoptimized`** para que
   vuelvan a pasar por el optimizador. Resuelve de una vez los 429, los 26 MB y
   la dependencia de terceros en runtime.
2. **Contraste de modo oscuro**: llevar los tokens de metadata a ≥4,5:1 en
   ambos temas. Incluye el `Reseña` a 1,53:1 de modo claro.
3. **Desborde de `/magazine`** en 390 y 430.

### Tanda B — coherencia de sistema

4. **Escala tipográfica como token**: definir la escala en
   `design-tokens.css` y migrar las superficies para que la consuman, colapsando
   los 30 valores a la escala de cuatro roles que el contrato ya declara.
5. **Enlazado consistente del objeto historia**: titular e imagen enlazan a la
   historia, igual en Home que en `/magazine`.
6. **Marcos de imagen y recorte**: revisar los marcos de `/academia` y del
   paisaje de Omán para que el recorte no descarte el motivo.
7. **Caption y procedencia** como parte de la figura editorial.

### Tanda C — composición

8. Jerarquía del primer viewport en `/descubrir/familias`, `/academia` y
   `/perfumistas`.
9. Ritmo de `/magazine` y `/perfumistas` hacia el arquetipo Editorial Index.
10. Medida de lectura de Home en viewports anchos.
11. Diferenciación visual entre etiqueta y enlace.

### Fuera de esta pasada

- **El 500 de SubBatch 01 (§3.1)**: es del pipeline editorial, no de la capa de
  diseño, y el handoff prohíbe tocar los pipelines de SubBatch. Requiere
  decisión explícita sobre cómo deben llegar los borradores al runtime.

---

## 7. Corrección al registro de estado

`AROMIA_CURRENT_STATE.md` v45 debe corregirse en dos puntos:

- `RAILWAY_RUNTIME` afirma que las nueve rutas de SubBatch 01 se prerenderizan
  correctamente. Se prerenderizan en build, pero **devuelven 500 en runtime**.
- `PRODUCTION_ROUTE_CHECKS` se apoya en el manifiesto de rutas generado. Estar
  en el manifiesto no implica responder 200; nueve rutas no lo hacen.

El propio estado ya advertía el riesgo en `BROWSER_QA_BOUNDARY`. Esta auditoría
lo confirma: alcanzabilidad de ruta y build verde no equivalen a superficie viva.

---

## 8. Cambio ya aplicado en esta rama

Un único commit, previo a la auditoría y necesario para poder hacerla:

`d7e71ee` — **anclar la resolución de Tailwind al directorio de `apps/web`**.

Tailwind resolvía tanto el archivo de configuración como los globs de `content`
contra el CWD del proceso. Railway construye con root `apps/web`, así que
producción nunca lo notó; pero lanzar el dev server desde la raíz del monorepo
—que es lo que hace `.claude/launch.json`— dejaba el escaneo vacío: **cero
utilidades emitidas**, todo componente basado en Tailwind renderizando sin
estilos, en silencio y sin fallar el build.

Verificación: la salida de Tailwind pasó de **1 byte** a **92.449 bytes** desde
la raíz, y es ahora byte a byte idéntica lanzada desde cualquiera de los dos
directorios. `tsc` limpio, `next lint` limpio, `next build` completo.
