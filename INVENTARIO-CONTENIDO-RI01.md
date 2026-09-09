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

---

## 3. Encargos a Cowork (borradores Markdown en `drafts/`)

Reglas para los cuatro: Markdown simple; **no** en `apps/api/data/articles/`; no
inventar datos de perfumería (notas, año, perfumista, casa) — verificar antes;
cada cita textual lleva su fuente entre paréntesis o en nota; link de afiliado
de Amazon embebido en cada perfume puntual mencionado.

| ID | Pieza(s) del PLAN | Encargo | Restricción específica | Estado |
|---|---|---|---|---|
| **A** | 4-10 (Acto II) | **Ensayo largo, ~2.000 palabras**, sobre Baccarat Rouge 540: hype vs. mérito real. Ángulo observacional, no reseña de compra. Debe tener suficiente longitud y cambios de tempo para que Design pruebe `editorialOpening` (`overlap`), `fullBleedImage` (`immersive`), pausa y matriz sensorial. | BR540 ya en catálogo (`baccarat-rouge-540-edp`), con OVL. Datos de composición: verificar contra ficha oficial de Maison Francis Kurkdjian, no contra foros. | 🔴 Pendiente |
| **B** | 11 (retrato) + 12 (cita) | **Perfil de Jean-Claude Ellena**, ~700-1.000 palabras + una cita destacada real para la pieza 12. | Construido **solo** sobre *Journal d'un parfumeur* / *The Diary of a Nose* y entrevistas on-record. Cada frase atribuida a Ellena: cita textual + fuente. Sin paráfrasis presentada como cita. | 🔴 Pendiente |
| **C** | — (metadata) | Poblar `autor = "Redacción Aromia"` en los 15 artículos publicados. | Acción de datos vía `/admin/magazine`, no reescritura de contenido. La ejecuta Brey (o Code si Brey lo pide) — no es tarea de redacción. | 🔴 Pendiente |
| **D** | 9 (matriz sensorial) + 13 (familia olfativa) | **Pieza de datos**: matriz/tabla derivada del catálogo (familia olfativa × género × notas dominantes) para un subconjunto curado de perfumes de la Issue. | Es dato, no imagen — PLAN §C pieza 9: "forzarlo a un primitive visual violaría el criterio". Cowork arma la selección y el texto de encuadre; los valores salen de la DB (Code puede exportar el subconjunto si hace falta). | 🔴 Pendiente |

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
| 10 | Materiales / macro | Foto de producto/material del catálogo + texto de A | 🟡 Depende de A |
| 11 | Perfumista — retrato | Encargo **B** | 🔴 Depende de B |
| 12 | Perfumista — cita | Encargo **B** (cita real de Ellena) | 🔴 Depende de B |
| 13 | Discovery / familia olfativa | `academia-familias-olfativas` + `academia-piramide-olfativa` + Encargo **D** | 🟡 Parcial (base lista, matriz depende de D) |
| 14 | Comparativa / díptico | `guia-perfumes-invierno` + `guia-perfumes-verano` (frío/cálido), o cualquier `comparativa-*` | ✅ Listo |
| 15 | Historia visual breve | `photoSequence` — 3-5 OVL/packshots en secuencia | ✅ Listo (selección de Design) |
| 16 | Cierre editorial | **Nuevo, breve** — párrafo de cierre + créditos | 🟡 Menor, se escribe al final |

**Resumen de bloqueo:** 6 de 16 piezas dependen de los encargos A/B/D. Las
otras 10 tienen contenido real disponible hoy. Design **puede** empezar la
Fase 1 (revista pura, mockups estáticos) por las piezas no bloqueadas y por la
estructura global (Actos, secuencia, ritmo), en paralelo a que Cowork produce
A/B/D — pero la Reference Issue no llega a Definition of Done (PLAN §K) hasta
que A, B y D existan con contenido real.

---

## 5. Próximo paso

1. Cowork arranca los encargos **A**, **B**, **D** (borradores en `drafts/`).
2. Brey ejecuta el encargo **C** (poblar `autor`).
3. Design arranca Fase 1 sobre las 10 piezas no bloqueadas + arquitectura global.
4. Cuando A/B/D estén, Design completa las 6 piezas restantes.
5. Auditoría intermedia (PLAN §H, capa de número completo) antes de tocar código.
6. Recién ahí se evalúa arrancar `ticket-arquitectura-editorial-tiptap.md`
   (Fase 2 — traducción digital), que sigue su propio gate de aprobación.
