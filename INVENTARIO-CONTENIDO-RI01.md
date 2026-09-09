# INVENTARIO DE CONTENIDO — Aromia · Número 01 (Reference Issue 01)

### Cierra el bloqueante de `PLAN-Aromia-Reference-Issue-01.md` §B
### Verificado contra producción (`api-production-fe2f`) el 2026-09-08 — no contra memoria ni `ESTADO`
### Decisiones tomadas con Brey el 2026-09-08

---

## 0. Para qué sirve este documento

`PLAN-Aromia-Reference-Issue-01.md` §B marca el inventario de contenido real
como **bloqueante**: Design no abre un solo archivo hasta que esté cerrado.
Este documento lo cierra. Contiene:

1. Las cuatro decisiones que eran de Brey, ya resueltas (§1).
2. La tabla de §B del PLAN cruzada contra lo que existe **hoy en producción** (§2).
3. Los encargos explícitos a Cowork — qué hay que escribir, con qué restricciones (§3).
4. El mapeo pieza por pieza de la arquitectura del PLAN §C: qué está cubierto,
   qué está en `[PLACEHOLDER]` y bloquea el Definition of Done (§4).

Regla dura heredada del PLAN §B: **ninguna sección se rellena con Lorem Ipsum
ni con copy inventado.** Lo que no tiene contenido real se marca
`[PLACEHOLDER — bloquea DoD]` y se documenta exactamente qué se necesita.

---

## 1. Decisiones de Brey (resueltas 2026-09-08)

| # | Decisión | Resolución | Razón corta |
|---|---|---|---|
| 1 | Nombre del número | **"Aromia · Número 01"** (público). "Reference Issue 01" queda como nombre interno de build. | Un nombre temático obligaría a que las 15 piezas cohesionen alrededor de un tema, y hoy no lo hacen. El tema real llega en el Número 02, con contenido encargado a propósito. Reversible hasta publicar. |
| 2 | Perfimista (piezas 11-12) | **Jean-Claude Ellena.** Perfil y cita construidos **exclusivamente** sobre su obra publicada (*Journal d'un parfumeur* / *The Diary of a Nose*) y entrevistas on-record, cada cita con fuente. Escribe Cowork como borrador en `drafts/`. Alternativa descartada salvo pedido de Brey: Francis Kurkdjian. | Ellena escribió libros → citarlo es citar texto publicado, cero riesgo de fabricación (manual operativo §21). Terre d'Hermès (su obra) ya está en catálogo y tiene imagen OVL. Su voz es literalmente la tesis del PLAN §A. |
| 3 | Ensayo largo del Acto II | **Encargar uno nuevo**, ~2.000 palabras, Cowork. Tema: **Baccarat Rouge 540 — hype vs. mérito real**. Alimenta las piezas 4-10. | Los 15 artículos publicados son de 250-580 palabras (formato SEO) — ninguno sostiene el Acto II tal como el PLAN §C lo secuencia. Sin un ensayo largo, la Reference Issue nunca prueba el caso "editorial largo", que es para lo que se construyen los primitives de Tiptap. BR540 ya tiene reseña corta, imagen OVL y `perfume_relacionado`; el ángulo observacional es material editorial genuino y verificable. |
| 4 | Bylines (`autor`) | **"Redacción Aromia"** en las 15 piezas existentes + las nuevas. Una voz de "editor" con firma propia queda como decisión aparte, no default. | El campo `autor` está `NULL` en las 15. Inventar nombres de autor ficticios es la misma categoría que inventar datos de perfumería. "Redacción Aromia" es honesto y estándar editorial para piezas sin firma. |

---

## 2. Inventario §B del PLAN — estado verificado

| PLAN §B pide | Realidad en producción (2026-09-08) | Veredicto |
|---|---|---|
| 3-5 artículos reales completos (título, autor, cuerpo) | **15 artículos `estado='publicado'`**, todos con título + cuerpo real. `autor = NULL` en los 15 → se puebla con "Redacción Aromia" (decisión #4). Cuerpos de 1.600-3.500 caracteres (~250-580 palabras). Estructura plana: solo `<p>` + `<h2-h4>`, **cero `<blockquote>`** (no hay material de pull-quote preexistente). Sin `imagen_portada_url` (portada se elige por hash desde 8 genéricas). | ✅ para piezas 5-6, 8-9, 14-16. ❌ para el ensayo largo del Acto II → se encarga nuevo (decisión #3). |
| 1 ficha de perfumista o persona | **No existe.** Sin tabla, sin categoría de artículo para perfiles, sin contenido. Categorías actuales: `resena / guia / analisis / academia / tendencias`. | 🔴 `[PLACEHOLDER — bloquea DoD]`. Se resuelve con el encargo de Ellena (decisión #2). Categoría `perfil`: la agrega Code al CHECK cuando implemente, no es decisión de contenido. |
| 6-10 fotografías de producto ya aprobadas | **125 perfumes publicados** (el catálogo se expandió vía migraciones 011-020 — el PLAN dice "38", quedó desactualizado tras el pivote). Todos con `imagen_url` no nula. | ✅ Disponibilidad amplia. El filtro "función editorial vs. packshot que solo llena espacio" (PLAN §11) lo hace Design al ver las fotos reales. |
| 2-3 fotografías atmosféricas/observacionales | **8 escenas genéricas** en `apps/web/public/editorial/*.png` (`bright-soft-focus`, `cinematic-warm`, `golden-amber`, `luxurious-softlit`, `moody-closeup`, `romantic-scene`, `soft-romantic`, `sunlit-warm`). **38 mockups OVL** en `apps/web/public/ovl/*.jpg` pareados 1:1 a perfumes puntuales (mapa en `apps/web/src/lib/editorialImages.ts`), incluidos los 4 que cita el PLAN §B: `molecule-01`, `terre-d-hermes-edt`, `erba-pura`, `flowerbomb`. | ✅ Cubierto. Las OVL cargan la función "observacional/atmosférica" del PLAN sin fabricar nada. |
| 1 pieza de datos/comparación (familias olfativas, notas) | **No existe como pieza editorial.** Derivable de los 125 perfumes: `familia_olfativa`, `genero`, `notas_salida/corazon/fondo`. | 🟡 Hay que armar la tabla/matriz. El dato es real y está en la DB. Ver §3, encargo D. |
| Nombre real del número | — | ✅ "Aromia · Número 01" (decisión #1). |

### 2.1 Los 15 artículos publicados (inventario base)

| slug | categoría | ~palabras | uso probable en RI01 |
|---|---|---|---|
| `academia-piramide-olfativa` | academia | ~370 | pieza 13 (taxonomía) / apoyo |
| `academia-historia-de-la-perfumeria` | academia | ~585 | pieza 4-5 candidato de apoyo, no ancla |
| `academia-familias-olfativas` | academia | ~400 | pieza 13 (discovery / familia olfativa) |
| `academia-concentraciones-perfume` | academia | ~300 | apoyo / recuadro |
| `resena-tobacco-vanille` | resena | ~280 | pieza 8 (objeto con evidencia) |
| `resena-santal-33` | resena | ~300 | pieza 8 alternativa |
| `resena-delina` | resena | ~290 | pieza 8 alternativa |
| `resena-baccarat-rouge-540` | resena | ~365 | **semilla del ensayo largo del Acto II** (decisión #3) |
| `guia-primer-perfume-nicho` | guia | ~360 | pieza 6 / apoyo |
| `guia-perfumes-verano` | guia | ~360 | pieza 14 (comparativa/díptico estacional) |
| `guia-perfumes-primera-cita` | guia | ~335 | pieza 14 alternativa |
| `guia-perfumes-invierno` | guia | ~365 | pieza 14 (díptico frío/cálido con `verano`) |
| `comparativa-sauvage-vs-bleu-de-chanel` | analisis | ~370 | pieza 14 (comparativa/díptico) |
| `comparativa-black-opium-vs-good-girl` | analisis | ~330 | pieza 14 alternativa |
| `comparativa-aventus-vs-layton` | analisis | ~295 | pieza 14 alternativa |

### 2.2 Corpus editorial de `drafts/` — corrección al inventario (agregado 2026-09-08)

La primera versión de este documento (§2 / §2.1) miró **solo los 15 artículos
publicados vía la API** y trató `drafts/` como pendiente. Es un error: `drafts/`
ya tiene **46 piezas `estado: editorial_ready`**, de ~1.050 a ~1.400 palabras
cada una, con frontmatter real (`titulo`, `tipo`, `serie`, `perfumes_mencionados`,
`keyword_objetivo`) y organizadas en 14 series. Taxonomía: 15 `ensayo`,
10 `material_study`, 7 `guia_con_investigacion`, 5 `explicacion`,
4 `reflexion_editorial`, 3 `investigacion`, 2 `historia`.

Esto es material observacional del registro que pide PLAN §A, y cambia el
panorama:

| Necesidad de RI01 | Qué aporta `drafts/` | Efecto en los encargos |
|---|---|---|
| Ensayo largo del Acto II (piezas 4-10) | `puede-un-perfume-oler-barato-aunque-cueste-300` (serie "Cómo se construye una impresión", ~1.205 w, ya toca BR540), + adyacentes `la-necesito-en-mi-coleccion`, `comprar-para-oler-o-comprar-para-tener` | **Encargo A pasa de "escribir de cero" a "extender/reenfocar un borrador existente a ~2.000 w con BR540 como eje"** |
| Retrato de perfumista (piezas 11-12) | Serie **"Personas"** con 1 sola entrada hoy (`el-perfumista-que-no-teme-exagerar`). `el-perfumista-como-ilusionista-material` menciona a Ellena. | **Encargo B = segunda entrada de "Personas", sobre Ellena.** Net-new, pero con serie y registro ya definidos. |
| Materiales / macro (pieza 10) | 10 `material_study`: `cuero-sin-cuero`, `iris-flor-polvo-madera`, `sandalo-madera-crema-piel`, `vetiver-`, `lavanda-`, `vainilla-`, `rosa-sin-ramo-de-flores`, `el-agua-que-no-viene-del-agua`, `chypre-`, `fougere-` | ✅ Cubierto de sobra. Design elige. |
| Discovery / familia olfativa (pieza 13) | `chypre-estructura-que-cambio`, `fougere-no-significa-viejo`, `aldehidos-`, `el-nacimiento-del-gourmand` + las academia publicadas | ✅ Prosa cubierta. Falta solo la **matriz** (encargo D). |
| Pausa / cierre / silencio (piezas 7, 16) | Cualquier `reflexion_editorial` corta sirve de interludio | ✅ |

**Neto:** encargos **B** y **D** siguen siendo net-new. **A** se reduce a
adaptación. La Reference Issue tiene contenido real para ~13-14 de las 16 piezas
hoy (no 10). Recordatorio del protocolo: Cowork deja los `.md` listos en el
working tree, **no commitea** — eso es de Code.

---

## 3. Encargos a Cowork (borradores Markdown en `drafts/`)

Reglas para los cuatro: Markdown simple; **no** en `apps/api/data/articles/`; no
inventar datos de perfumería (notas, año, perfumista, casa) — verificar antes;
cada cita textual lleva su fuente entre paréntesis o en nota; link de afiliado
de Amazon embebido en cada perfume puntual mencionado.

| ID | Pieza(s) del PLAN | Encargo | Restricción específica | Estado |
|---|---|---|---|---|
| **A** | 4-10 (Acto II) | **Ensayo largo** sobre Baccarat Rouge 540: hype vs. mérito real. Ángulo observacional. Base: adaptación de `drafts/puede-un-perfume-oler-barato-aunque-cueste-300.md`. | BR540 ya en catálogo (`baccarat-rouge-540-edp`), con OVL. Datos contra ficha oficial de Maison Francis Kurkdjian. | ✅ **Entregado 2026-09-08** — `drafts/br540-hype-vs-merito.md` (~1.833 w). Ingestado a la rama. Ver §6. |
| **B** | 11 (retrato) + 12 (cita) | **Perfil de Jean-Claude Ellena** + cita destacada real para la pieza 12. Segunda entrada de la serie **"Personas"**. | Solo *Journal d'un parfumeur* / *The Diary of a Nose* y entrevistas on-record. Cada cita: textual + fuente. | ✅ **Entregado 2026-09-08** — `drafts/jean-claude-ellena-la-sustraccion.md` (~1.070 w). Ingestado. Ver §6. |
| **C** | — (metadata) | Poblar `autor = "Redacción Aromia"` en los 15 artículos publicados. | Acción de datos vía `PATCH /api/admin/articles/:id`, no reescritura de contenido. | ✅ **Hecho 2026-09-08** — 15/15 vía script `scratchpad/encargo-C-poblar-autor.py --apply`, verificado contra la API pública. |
| **D** | 9 (matriz sensorial) + 13 (familia olfativa) | **Pieza de datos**: matriz familia olfativa × género × notas dominantes para un subconjunto curado. | Es dato, no imagen — PLAN §C pieza 9. | ✅ **Entregado 2026-09-08** — `drafts/matriz-olfativa-numero-01.md`, 15 perfumes. Ingestado. Ver §6. |

---

## 4. Mapeo pieza por pieza — PLAN §C vs. inventario

| # | Pieza (PLAN §C) | Fuente de contenido | Estado |
|---|---|---|---|
| 1 | Portada / masthead | "Aromia · Número 01" + 1 imagen (OVL o `/editorial/*`) a elección de Design | ✅ Listo |
| 2 | Índice / sumario | Derivado de la secuencia final | ✅ Se arma con la Issue |
| 3 | Carta editorial | **Nueva, breve** (~200 palabras) — la escribe Brey o Cowork, define el tono del número | 🟡 Menor, no bloquea el arranque de Design |
| 4 | Apertura del ensayo | Encargo **A** (título + foto superpuesta) | 🔴 Depende de A |
| 5 | Aterrizaje / primeros párrafos | Encargo **A** | 🔴 Depende de A |
| 6 | Imagen ancla | Foto de producto del catálogo (125 disponibles) + texto de A | 🟡 Depende de A |
| 7 | Pausa / interrupción | `fullBleedImage` — OVL o `/editorial/*` | ✅ Listo |
| 8 | Reseña — objeto con evidencia | `resena-tobacco-vanille` (o `santal-33` / `delina`) + packshot real | ✅ Listo |
| 9 | Reseña — matriz sensorial | Encargo **D** | 🔴 Depende de D |
| 10 | Materiales / macro | Cualquier `material_study` de `drafts/` (`cuero-sin-cuero`, `iris-flor-polvo-madera`, `sandalo-madera-crema-piel`, `vetiver-…`, …) + foto de material | ✅ Listo (10 disponibles, ver §2.2) |
| 11 | Perfumista — retrato | Encargo **B** | 🔴 Depende de B |
| 12 | Perfumista — cita | Encargo **B** (cita real de Ellena) | 🔴 Depende de B |
| 13 | Discovery / familia olfativa | `academia-familias-olfativas` + `academia-piramide-olfativa` + Encargo **D** | 🟡 Parcial (base lista, matriz depende de D) |
| 14 | Comparativa / díptico | `guia-perfumes-invierno` + `guia-perfumes-verano` (frío/cálido), o cualquier `comparativa-*` | ✅ Listo |
| 15 | Historia visual breve | `photoSequence` — 3-5 OVL/packshots en secuencia | ✅ Listo (selección de Design) |
| 16 | Cierre editorial | **Nuevo, breve** — párrafo de cierre + créditos | 🟡 Menor, se escribe al final |

**Resumen de bloqueo (revisado con §2.2):** solo **4 de 16 piezas** dependen
todavía de los encargos: 4-5-6 de **A** (adaptación) y 9 de **D**. La pieza 13
queda parcial hasta la matriz de **D**. Las 11-12 dependen de **B** pero son
una sola unidad narrativa. El resto (12-13 piezas) tiene contenido real hoy
entre publicados + `drafts/`. Design **puede** empezar la Fase 1 ya, en
paralelo a Cowork — pero la Reference Issue no llega a Definition of Done
(PLAN §K) hasta que A, B y D existan.

---

## 5. Próximo paso

1. Cowork arranca los encargos **A**, **B**, **D** (borradores en `drafts/`).
   Brief completo en `brief-cowork-RI01-encargos.md` (raíz del repo).
2. ~~Brey ejecuta el encargo **C** (poblar `autor`).~~ — hecho 2026-09-08.
3. Design arranca Fase 1 sobre las ~12 piezas no bloqueadas + arquitectura global.
4. Cuando A/B/D estén, Design completa las piezas restantes.
5. Auditoría intermedia (PLAN §H, capa de número completo) antes de tocar código.
6. Recién ahí se evalúa arrancar `ticket-arquitectura-editorial-tiptap.md`
   (Fase 2 — traducción digital), que sigue su propio gate de aprobación.

---

## 6. Ingesta de encargos A/B/D (Code, 2026-09-08)

Cowork entregó los tres `.md` en su working tree (`/home/claude/aromia-lab/drafts/`,
sin trackear, per instrucción del brief). Brey los bridgeó a Code; ingestados a
`drafts/` en la rama `claude/continue-from-zip-6a0b76`.

### 6.1 Hallazgo de Cowork: los docs de alcance no estaban en `main`

Correcto. `PLAN-`, `INVENTARIO-`, `ticket-arquitectura-editorial-tiptap` y
`brief-cowork-RI01-encargos` están **solo en la rama `claude/continue-from-zip-6a0b76`,
sin pushear** a `origin`. Nada perdido. Cowork trabajó del brief (autocontenido) y
salió bien. **Acción pendiente:** push + PR de la rama para que Cowork y Design
tengan el alcance canónico — gate de Brey (main protegida).

### 6.2 Review de Code por pieza

| Pieza | Checklist §5 | Notas de Code |
|---|---|---|
| **A** `br540-hype-vs-merito.md` | ✅ pasa | Frontmatter, status block, `## Sí, pero`, afiliado `tag=aromialab-20` (ASIN directo). Fact-check contra `franciskurkdjian.com` directo. 2 marcas `[AROMIA_VISUAL_OPPORTUNITY]` con 6 campos. Estudio Caltech/Stanford 2008 (Plassmann et al.) correctamente acotado. Título/serie: se reubicó en serie "Coleccionar, comprar y desear" (no la del borrador base). |
| **B** `jean-claude-ellena-la-sustraccion.md` | ✅ pasa | ~1.070 w (brief pedía 700-1.000; Cowork justificó el exceso). Citas de *The Diary of a Nose* marcadas explícitamente como **segunda mano** (vía Grain de Musc / Beaulieu) — pendiente confirmar contra el libro si se sube a producción. Rechazo de "minimalista" en 3ª persona (solo fuente blog). Pull-quote pieza 12 = Marie Claire 2014 (on-record, trazable). |
| **D** `matriz-olfativa-numero-01.md` | ✅ pasa | **Code validó la tabla contra Postgres de producción (los 15 perfumes):** género y familia olfativa coinciden 15/15; las notas coinciden en lo sustancial (el CSV es subconjunto abreviado/reordenado de lo que hay en la DB). Única divergencia: Fahrenheit — Cowork eligió "cedro" como salida dominante, la DB la lista 3ª. Es criterio editorial, no error. |

### 6.3 Ítems abiertos (no bloquean la ingesta, sí antes de publicar a producción)

1. **Catálogo `baccarat-rouge-540-edp`** — dato a revisar contra fuente oficial MFK:
   - `notas_fondo = ["cedro","abeto"]` — ausentes de la comunicación oficial (que usa "auras": hedione/jazmín, azafrán/etil-maltol, Ambroxan/ámbar gris). Está igual en el CSV y en Postgres.
   - `precio_referencia = 325 USD` vs. 360 USD retail oficial sep-2026 (dato viejo *por diseño* — scraper apagado, decisión #103; baja prioridad).
   - `anio = NULL`, `perfumista = NULL` (debería ser Francis Kurkdjian).
   - **No se toca el catálogo desde este flujo.** Queda para una revisión de datos aparte.
2. **Citas de *The Diary of a Nose* en pieza B** — verificar contra el libro original si el estándar editorial de producción lo exige.
3. **Matriz D** — si se publica, considerar recalcular las notas contra Postgres (no el CSV); el diff de Code muestra que cambiaría poco.

### 6.4 Estado

Con A/B/D + C hechos, **el bloqueo de contenido de RI01 está esencialmente
cerrado**. Faltan solo piezas menores que se escriben al final (carta editorial
pieza 3, cierre pieza 16). Design puede trabajar la Fase 1 completa. La Fase 2
(ticket Tiptap) sigue con su gate.
