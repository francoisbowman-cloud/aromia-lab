# AROMIA — Plan Maestro para Reference Issue 01
### Dirección de Design (a ejecutar por Claude Design) — derivado de "Aromia — Dirección Artística Editorial Brief v1.0"
Preparado por: Chat · Septiembre 2026

---

## Lectura crítica previa: qué es y qué NO es este documento

El Brief v1.0 que Brey adjuntó ya es un documento excelente: extrajo, de 67 páginas de plantillas de Canva, una gramática editorial real (retícula, escala, ritmo, arquetipos, antipatrones, QA). No hace falta repetirlo aquí, y este plan no lo va a parafrasear.

Lo que el Brief v1.0 **no** resuelve todavía —y que es la brecha real entre "tener un buen criterio" y "producir una revista"— es:

1. **Secuencia concreta.** El Brief da 7 arquetipos y una tabla de decisión, pero no dice *en qué orden viven 15-20 piezas dentro de un número*, ni cuánta densidad acumulada es demasiada.
2. **Contenido real, no genérico.** El Brief pide (sección 04 del prompt) que la Reference Issue use artículos, fotos y autores reales de Aromia. Ese inventario todavía no está en este documento — es lo primero que hay que cerrar con Brey antes de que Design toque un solo spread.
3. **Un mecanismo de gobierno de la libertad.** El Brief dice "no es una cárcel" pero no da un procedimiento para decidir, spread por spread, si una desviación es una desviación con criterio o un antipatrón disfrazado.
4. **Cuándo el sistema pasa de "revista" a "regla".** El Brief ya insinúa esto (sección 20, ficha reutilizable) pero no define el gate de extracción.

Este plan resuelve esos cuatro huecos. No repite retícula, tipografía, arquetipos ni antipatrones del Brief v1.0 — los da por vigentes y los referencia por nombre. Lo que agrega es el **proceso**: cómo Claude Design pasa de "tener un buen criterio" a "tener 20-28 páginas concretas, secuenciadas, auditadas y traducidas a Aromia web".

**Nota sobre alcance vs. el prompt original de Brey:** el prompt pide 15 secciones de contenido (numeradas 1-17 en su mensaje) más una entrega A-O. Varias de esas secciones (retícula, tipografía, fotografía, ritmo, antipatrones, QA, brief reutilizable) ya están resueltas en el Brief v1.0 con más rigor del que yo podría producir de cero sin desviarme de la fuente. Este documento las hereda explícitamente en vez de reescribirlas, y concentra el trabajo nuevo en arquitectura del número, secuenciación, gobierno de la libertad creativa y ejecución.

---

## A. Art Direction Thesis

> **Aromia Reference Issue 01 es una revista que observa la perfumería como quien observa la vida cotidiana de alguien con criterio: con precisión de editor, sin la voz de vendedor.**

Tres pruebas para saber si una página cumple la tesis:

- **Prueba del vendedor:** si se puede imaginar la misma composición con un botón "Comprar ahora" superpuesto sin que se vea raro, la página falló.
- **Prueba de la revista anónima:** si la composición podría pertenecer a cualquier revista de lujo genérica (moda, decoración, gastronomía) sin cambiar una palabra, falló — esto ya está en el QA del Brief (sección 19, fila "Aromia"), lo elevamos aquí a principio rector de toda la Issue, no solo de páginas sueltas.
- **Prueba del silencio:** si se puede quitar un elemento de la página sin perder significado, ese elemento no debería estar.

La tensión que sostiene todo el número (heredada de la sección 06 del Brief: culto/cotidiano, preciso/sensual, sereno/inesperado) se resume en una sola frase operativa que Design debe repetirse en cada spread:

**"Un editor que sabe mucho de perfumes, escribiendo para alguien a quien le importa, no vendiéndole a alguien a quien hay que convencer."**

---

## B. Inventario de contenido real (bloqueante — resolver antes de Design)

El prompt de Brey (punto 4) exige contenido real, no Lorem Ipsum. Antes de que Claude Design abra un solo archivo, necesita este inventario cerrado con Brey:

| Necesario | Fuente probable en Aromia | Estado |
|---|---|---|
| 3-5 artículos reales completos (título, autor, cuerpo) | Tabla Postgres `articles` vía `/admin/magazine` | Por confirmar cuántos hay publicados hoy |
| 1 ficha de perfumista o persona | No confirmado que exista todavía | Puede requerir contenido nuevo, no reciclado |
| 6-10 fotografías de producto ya aprobadas | Catálogo de 38 productos live | Filtrar cuáles pasan el criterio de "función editorial", no solo packshot |
| 2-3 fotografías atmosféricas/observacionales | OVL (mockups editoriales ya generados: Molecule 01, Terre d'Hermès, Erba Pura, Flowerbomb) | Disponibles, ya empaquetados para Code |
| 1 pieza de datos/comparación (familias olfativas, notas) | Puede derivarse del catálogo existente | Requiere armar la tabla, no existe como pieza editorial aún |
| Nombre real del número (no "Reference Issue 01" como copy final) | Decisión de Brey | Pendiente |

**Regla dura:** si para una sección no hay contenido real disponible, esa sección se marca `[PLACEHOLDER — bloquea Definition of Done]` y se documenta qué se necesita, exactamente como se necesitaría, para publicar. Nunca se rellena con Lorem Ipsum ni con copy inventado que suene a copy inventado.

---

## C. Arquitectura de Reference Issue 01

18-22 páginas equivalentes (no todas serán "páginas" literales en digital — ver sección I). Arquitectura en tres actos, no una lista plana de secciones.

**Actualización (post `ticket-arquitectura-editorial-tiptap.md`):** cuando este plan se escribió, la libertad técnica real de Tiptap todavía no estaba definida — el plan asumía HTML plano y hablaba de "arquetipos" en abstracto. Ahora cada pieza tiene un primitive técnico concreto (o, en varios casos, la confirmación explícita de que **no necesita ninguno** — Level A/HTML estándar alcanza). Esto no es una capa nueva de complejidad: es quitarle ambigüedad al handoff. Cuando Design proponga "pieza 4: apertura del ensayo, overlap", Code ya sabe que eso es literalmente `editorialOpening` con `treatment: "overlap"` — no una discusión nueva.

**Acto I — Entrada (silencio → orientación)**

| # | Pieza | Arquetipo (Brief) | Nivel técnico | Primitive / treatment |
|---|---|---|---|---|
| 1 | Portada / masthead | *Portal* (§12.01) | **B** | `editorialOpening`, `treatment: "monumental"` (imagen o vacío dominante, sin overlap — la portada es silenciosa) |
| 2 | Índice / sumario | *Índice/directorio* (§12.06) | **A** | HTML estándar (lista/grid numerada + CSS) — no necesita primitive nuevo, es exactamente el caso que el Brief §12.06 marca como "riesgo: no usar cards con bordes y sombras" |
| 3 | Carta editorial | — | **A** | Heading + párrafos, nada más |

**Acto II — Cuerpo (donde vive la densidad)**

| # | Pieza | Arquetipo (Brief) | Nivel técnico | Primitive / treatment |
|---|---|---|---|---|
| 4 | Apertura del ensayo | *Portal* (dentro de §15, fila "Historia/ensayo") | **B** | `editorialOpening`, `treatment: "overlap"` — este es el spread de prueba de la sección 3 del `ticket-arquitectura-editorial-tiptap.md` (título + fotografía superpuesta) |
| 5 | Aterrizaje / primeros párrafos | Lectura fácil (§13, momento 2) | **A** | Párrafos, columna de lectura estándar — ningún gesto |
| 6 | Imagen ancla | *Feature con imagen ancla* (§12.03) | **A** | `<figure>` simple con caption — el Brief es explícito en que esta imagen "aparece en un punto narrativo", no a sangre completa; no confundir con la pieza 7 |
| 7 | Pausa / interrupción | *Full-bleed* (§12.04) | **B** | `fullBleedImage`, `treatment: "immersive"` — cambio de tempo obligatorio tras la densidad de 4-6 |
| 8 | Reseña — objeto con evidencia | *Objeto con evidencia* (§15, fila "Reseña") | **A** | `<figure>` + párrafos — evidencia real (packshot/vial), sin aura publicitaria (Brief §11.04) |
| 9 | Reseña — matriz sensorial | Comparación sensorial (§15) | **A** | Tabla HTML con estilos `prose` — es dato, no imagen; forzarlo a un primitive visual violaría el criterio de la matriz de decisión del Brief (§15, heurística: "si es informativamente densa, reduce gestos expresivos") |
| 10 | Materiales / macro | *Macro/material* (§11.02) | **A o B** | `<figure>` (Level A) si la foto acompaña texto; `fullBleedImage` (Level B, `treatment: "standard"`) si la textura del material merece dominar la página — decisión de Design al ver la foto real, no una regla fija |
| 11 | Perfumista — retrato | *Retrato + bio/quote* (§15) | **B** | `portraitFeature`, `treatment: "quiet"` — **placeholder hasta cerrar sección B de este plan** (no hay confirmación de que exista esta ficha con contenido real) |
| 12 | Perfumista — cita | Continuación de la pieza 11 | **B** | `pullQuote`, `treatment: "quiet"` — usa la cita real de la persona, no una genérica |
| 13 | Discovery / familia olfativa | *Índice/directorio + taxonomía* (§15) | **A** | HTML estándar (grid del catálogo de 38 productos) — **aclaración importante:** esto NO es el "Discovery Experience" tipo Level C que aparecía como ejemplo en el encargo original de arquitectura; para Reference Issue 01 es un índice bien tipografiado, no un explorador interactivo. Si más adelante se justifica una experiencia interactiva real, eso sería un candidato a Level C, evaluado aparte |

**Acto III — Salida (contraste → resolución)**

| # | Pieza | Arquetipo (Brief) | Nivel técnico | Primitive / treatment |
|---|---|---|---|---|
| 14 | Comparativa / díptico | §12.05 | **B** | `imagePair`, `treatment: "asymmetric"` (o `"equal"` si la comparación pide simetría deliberada — frío/cálido puede pedir simetría; natural/sintético puede pedir asimetría. Decide Design según la tensión conceptual elegida) |
| 15 | Historia visual breve | *Historia visual* (§15) | **B** | `photoSequence`, `treatment: "horizontal"` o `"fragmented"` |
| 16 | Cierre editorial | §13, momento 7 | **A** | Párrafo de cierre + créditos — sin primitive, deliberadamente silencioso |

**Regla de secuencia (aplica el hallazgo #07 y #08 del Brief, sección 03):** ningún arquetipo se repite en dos posiciones consecutivas. La densidad informativa nunca se mantiene igual en tres piezas seguidas (Brief §04, sección "Densidad"). Con la tabla de arriba, esto es verificable directamente: Level B nunca aparece en 3 piezas seguidas (revisar: 4-B, 5-A, 6-A, 7-B — cumple; 11-B, 12-B son dos seguidas del mismo tipo de contenido pero es una sola pieza narrativa dividida en dos, no una repetición de arquetipo).

**Nota sobre el conteo:** la reducción de 18 a 16 piezas numeradas respecto de la versión anterior de este plan es intencional — dos piezas que antes tenían un número propio ("11-12" y "13-14" como rangos) ahora están desagregadas en piezas individuales reales (11, 12) o consolidadas donde el mapeo técnico reveló que eran la misma unidad de contenido (materiales+comparación). El total efectivo de "momentos editoriales" no bajó; bajó el conteo artificial de rangos.

---

## D. Diseñar secuencias, no páginas — metodología

Antes de maquetar cada tramo (ej. piezas 4-7), Design responde, en este orden, por **tramo**, no por página suelta:

1. **¿Qué debe sentir el lector al entrar y al salir de este tramo?** (una palabra de entrada, una de salida — deben ser distintas)
2. **¿Cuántas pantallas/páginas dura la tensión antes de necesitar un respiro?** Regla operativa: máximo 3 unidades de alta densidad seguidas antes de forzar un momento de pausa (full-bleed, cita, vacío) — esto formaliza el hallazgo #06 del Brief ("el ritmo nace de la alternancia").
3. **¿Dónde está el pico del tramo?** Un tramo sin pico se siente plano; un tramo con dos picos compite consigo mismo.
4. **¿Qué gesto de ruptura (Brief §08, regla 05) se reserva para el pico, y se evita en el resto del tramo?**

Esto convierte la "Editorial Rhythm Map" del Brief (§13, tabla de 7 momentos) de un mapa por *artículo* a un mapa por *número completo* — el mismo patrón se aplica una vez a escala de 18-22 piezas y, dentro de cada pieza larga (el ensayo del Acto II), otra vez a escala de scroll.

---

## E. Mecanismo de libertad controlada (gobierno de la desviación)

El Brief dice "no es una cárcel" (prompt punto 5) pero no da un procedimiento. Este es el gate:

Una composición que se desvía de los 7 arquetipos o de la retícula base se aprueba **solo si Design puede responder que sí a las tres preguntas**, por escrito, junto a la pieza:

1. **¿Qué contenido específico exige esta desviación?** (no "se ve mejor así" — una razón editorial concreta)
2. **¿Qué regla no negociable del Brief (§08, las 10 reglas) sigue intacta pese a la desviación?** Al menos una alineación dominante siempre debe sobrevivir (Brief §04, "Regla práctica para Aromia").
3. **¿Esta desviación aparece una sola vez en el número, o se está convirtiendo en un patrón nuevo no documentado?** Si aparece 2+ veces, no es una desviación — es una propuesta de arquetipo nuevo, y pasa a discutirse explícitamente con Brey antes de repetirse una tercera vez.

Toda desviación se registra en una tabla `DESVIACIONES.md` (pieza, pregunta 1-2-3, decisión). Esa tabla es, en sí misma, el primer insumo de la sección O (extracción del sistema).

---

## F. Traducción a digital (Magazine → Aromia web)

El Brief ya resuelve la retícula digital (§09) y da los rangos de contenedor/columnas/gutter — se hereda tal cual. Lo que agrega este plan es el **método de traducción**, spread por spread:

Para cada spread de la revista impresa conceptual, Design completa:

| Campo | Contenido |
|---|---|
| Relación narrativa a preservar | Ej. "titular monumental domina; imagen es evidencia secundaria" |
| Geometría impresa | Ej. "titular 700 unidades ancho + imagen 1/3 inferior" |
| Traducción digital | Ej. "titular fluido con clamp(), imagen se convierte en scroll-reveal tras el primer párrafo, no en posición fija" |
| Qué se pierde intencionalmente | Ej. "el corte físico de página desaparece; se reemplaza por un cambio de fondo o de densidad" |
| Qué se preserva sin negociar | La prioridad de lectura (Brief §17, regla 01) |

**Restricción técnica real de Aromia (no ignorar):** el contenido editorial vive como HTML en `contenido_html` (Postgres, vía Tiptap). Esto significa que las composiciones más expresivas (imagen que invade el texto, título fragmentado, full-bleed) **no pueden depender de posicionamiento absoluto arbitrario dentro del HTML del editor** — Tiptap no soporta ese nivel de control. Design debe diseñar patrones que se puedan lograr con: (a) componentes React reutilizables que envuelven bloques de contenido marcados semánticamente, o (b) un número limitado de "tipos de bloque" que el editor pueda insertar (imagen full-bleed, cita grande, díptico). Esto es una restricción real de la Fase 2, no una limitación estética — señalarla ahora evita rediseñar en Code.

---

## G. Responsive: reinterpretación, no apilado

Se hereda el Brief §17 completo (6 reglas). Se agrega un criterio de aceptación operativo: **cada spread de la arquitectura (sección C) debe pasar por un "mobile rewrite", no un "mobile shrink".** Si al pasar a una columna el spread pierde su pico de tensión (sección D, pregunta 3), no se aprueba — se rediseña desde la intención, no desde el layout desktop.

---

## H. QA / Critique Protocol

Se hereda el checklist del Brief §19 tal cual, con dos capas adicionales específicas de la Reference Issue completa (no de una pieza aislada):

**Capa de número completo** (después de que las 18-22 piezas existan):
- ¿Hay un pico claro en el Acto II, o todo compite por atención?
- ¿Se repite el mismo arquetipo dos veces seguidas en algún punto de la secuencia?
- ¿El cierre (pieza 18) empuja hacia lectura, no hacia conversión?

**Capa de honestidad de contenido:**
- ¿Alguna pieza usa contenido placeholder que no está marcado como tal?
- ¿Alguna fotografía pasa el "criterio de selección" del Brief §11 ("esta imagen existe aquí porque...") o solo llena espacio?

---

## I. Fase 1 → Fase 2: orden de ejecución exacto

1. **Cerrar el inventario de contenido real** (sección B) con Brey. Bloqueante — nada de lo siguiente empieza sin esto.
2. **Fase 1 — Revista pura.** Diseñar las 18-22 piezas como composiciones editoriales (Brief §11: pensar en páginas/spreads, sin autocensura por navegador). Entregable: mockups estáticos (imagen o PDF) de cada pieza, en secuencia.
3. **Auditoría intermedia** con el checklist de la sección H, capa de número completo, antes de tocar código o HTML.
4. **Fase 2 — Traducción digital**, spread por spread, con la tabla de la sección F.
5. **Prototipo navegable** de al menos el Acto II completo (piezas 4-10) — es el tramo de mayor riesgo técnico (Tiptap + composiciones expresivas).
6. **Responsive rewrite** (sección G) del mismo tramo.
7. **Auditoría final completa** (Brief §19 + sección H de este plan).
8. **Extracción del sistema** (sección O) — solo después de que el número esté aprobado.
9. Handoff a Code con los mockups, la tabla `DESVIACIONES.md`, y las decisiones de traducción digital (sección F) — no como "diseño terminado para copiar pixel a pixel", sino como especificación de relaciones, siguiendo el protocolo de actores del proyecto (Design → Code, con paquete de handoff nativo).

---

## J. Deliverables

- `MOCKUPS/` — 18-22 composiciones (Fase 1, revista pura), numeradas según la arquitectura de la sección C.
- `DESVIACIONES.md` — registro de toda desviación aprobada (sección E).
- `TRADUCCION-DIGITAL.md` — tabla de la sección F completada para cada spread.
- `AUDITORIA-REFERENCE-ISSUE-01.md` — resultado del checklist (sección H) con veredicto PASS/REVISAR por pieza.
- Prototipo navegable del Acto II (HTML/React, no imagen estática) — es lo único que realmente valida la restricción de Tiptap (sección F).
- `SISTEMA-EXTRAIDO.md` — resultado de la sección O (solo al final).

---

## K. Definition of Done

La Reference Issue 01 está terminada cuando, y solo cuando:

1. Las 18-22 piezas existen con contenido real o placeholders explícitamente marcados y listados como pendientes.
2. Ninguna pieza usa Lorem Ipsum.
3. La auditoría de la sección H no tiene ningún `REVISAR` sin resolver.
4. El prototipo navegable del Acto II funciona dentro de la restricción real de Tiptap/HTML (sección F) — no es un mockup que asume libertad técnica inexistente.
5. `DESVIACIONES.md` tiene al menos una entrada revisada (si el número no generó ninguna desviación, es señal de que Design jugó demasiado seguro — volver a la sección E).
6. Brey aprueba explícitamente el número como referencia — este plan no define aprobación automática por checklist; el criterio humano final es de Brey.

---

## L. Extracción del sistema (solo después de K)

Siguiendo el prompt punto 15: no se construye un design system antes de tener la Issue aprobada. Cuando lo esté, extraer únicamente:

- Qué relaciones de retícula (del Brief §04) realmente se usaron y cuáles nunca hicieron falta.
- Qué arquetipos de los 7 (§12) se usaron más de una vez con variaciones — esos son candidatos reales a patrón reutilizable.
- Qué desviaciones de `DESVIACIONES.md` aparecieron más de una vez (regla de la sección E, pregunta 3) — esas se convierten en arquetipo nuevo documentado, no en excepción permanente.
- Qué tipos de bloque de contenido (sección F) el editor Tiptap necesita soportar de forma nativa para que Code los construya como componentes reales, no como hacks por artículo.

Este `SISTEMA-EXTRAIDO.md` es el único insumo legítimo para retomar, si algún día se justifica, algo parecido a un design system — y explícitamente no reabre la iniciativa pausada de "The Design Bible", que es de alcance cross-proyecto (Aromia + Nima) y de propósito distinto (ver nota abajo).

---

## Nota de coherencia con el resto del proyecto

Esto es deliberadamente un documento de alcance acotado a Aromia — no reabre "The Design Bible" (iniciativa cross-proyecto, pausada por Brey tras concluir que era teoría antes que evidencia). Es justo el tipo de trabajo que la pausa de esa iniciativa recomendaba: construir sobre un proyecto real primero, extraer después. Este plan es esa construcción.

