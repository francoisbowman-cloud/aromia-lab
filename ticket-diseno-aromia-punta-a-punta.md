# TICKET MAESTRO — Diseño de Aromia, punta a punta

### Preparado por Code · 2026-09-09
### Para: Claude Design (dirección visual + UX/UI) · con handoff a Code para implementación

---

## 0. Rol, límites y reglas que no se negocian

- **Design decide y compone; Code implementa, versiona y despliega.** Design no
  hace `git commit`/`push` (autoridad exclusiva de Code, por el incidente del
  18/07). Design entrega mockups + especificación de relaciones + decisiones;
  Code las traduce a componentes en rama + PR.
- **Antes de cerrar cualquier tramo:** correr `DESIGN-CHECKLIST.md` (raíz del
  repo) completo — cobertura de pantallas, tokens, shadcn/ui, assets, links de
  afiliado, y verificación **en vivo** (Railway + aromialab.com, no solo local).
- **Fuente de verdad de producto:** `ESTADO-aromia.md`. Fuente de coordinación
  multi-agente: `docs/operations/AROMIA_MANUAL_OPERATIVO_CODE_COWORK_CHATGPT.md`.
  Este ticket **no duplica** esos documentos ni el `PLAN-Aromia-Reference-Issue-01.md`
  — los referencia por nombre y da la secuencia.
- **El proyecto pivoteó a revista editorial (decisión #103).** El catálogo
  navegable ya no existe; la ficha `/catalogo/[slug]` sobrevive solo como
  destino del Quiz y contenido long-tail. Todo trabajo de Diseño respeta ese
  encuadre: editorial primero, comercio embebido en el contenido.
- **Aprobación por tramos (gate de Brey).** Ningún workstream arranca la fase
  siguiente sin "sí" textual de Brey. Ver `feedback_approval_gates`.

---

## 1. Mapa de la superficie pública (rutas reales, `apps/web/src/app`)

| Grupo | Rutas | Estado de Diseño |
|---|---|---|
| Home | `/` | Pase profundo Tandas A+B+C aplicado; deuda tipográfica pendiente |
| Magazine | `/magazine`, `/magazine/[slug]`, `/magazine/[slug]/imprimir` | **P1 contraste héroe modo claro sin dueño** (WS-1) |
| Editorial (nuevo) | `/(editorial)`, `/(editorial)/historias/[slug]` | **P0: 9 historias de SubBatch 01 devuelven 500** (WS-1) |
| Discovery | `/descubrir`, `/descubrir/familias`, `/descubrir/familias/[familia]` | Quiz sin relevancia visual (WS-1); "Rendimiento en piel" vacío (WS-1) |
| Ficha de perfume | `/catalogo/[slug]` | Wordmark fantasma **corregido** (PR #157); rediseño tráfico frío pendiente (bloque 1.4); dark mode de `ProductImage` pendiente de QA |
| Personas | `/perfumistas`, `/perfumistas/[slug]` | Slugs **corregidos** (PR #158); faltan fotos + gate de ≥5 obras (WS-1) |
| Quiz | `/quiz`, `/quiz/resultado/[perfil]` | Sin pase de diseño dedicado |
| Búsqueda / Academia / Club / Privacidad / Taste | `/buscar`, `/academia`, `/club`, `/privacidad`, `/taste` | Tanda C tocó jerarquía de `/academia`; resto sin pase |
| Admin | `/admin/**` | Fuera de alcance de este ticket (no es superficie pública) |

---

## 2. Los cinco workstreams

### WS-1 · Deuda visual en producción (remediación — primero, es chico)

Corrige lo que ya está desplegado y roto o incompleto. No inventa dirección nueva.

| # | Ítem | Origen | Naturaleza |
|---|---|---|---|
| 1.1 | `h1` del héroe de `/magazine/[slug]` en **modo claro** rinde crema sobre crema (~1,09:1). Puentear el color a la capa semántica. | Barrido Tanda C (`project_deep_design_pass`) | Fix chico de token, Code |
| 1.2 | 9 historias `/(editorial)/historias/*` (SubBatch 01) devuelven **500** en prod — `subBatch01Story.tsx` lee `drafts/*.md` en render y `drafts/` no está en la imagen de runtime. Huérfanas (sin sitemap ni links). | `project_deep_design_pass` P0 | Pipeline editorial — decisión de arquitectura, **no Code reactivo** |
| 1.3 | Ficha `/catalogo/[slug]` en **modo oscuro**: `ProductImage` con `mix-blend-normal` deja la foto de fondo blanco de Amazon como parche luminoso sobre `#0A0A0A`. | ESTADO §11 bloque 1.3 | Necesita captura real + decisión de Brey (ticket 1.3 §4.2/4.3) |
| 1.4 | "Rendimiento en piel" (Discovery / ficha) muestra "Aún sin datos" en **todo** el catálogo — `longevidad`/`estela`/`proyeccion` NULL. | Brey, 2026-09-09 | Necesita **fuente de datos** (decisión de Brey), no diseño |
| 1.5 | Personas: solo **2 de 13** perfumistas con `portrait`; ninguno llega a 5 obras. | Brey, 2026-09-09 | Fotos = contenido/licencia; gate ≥5 = expansión de atribuciones. **Decisión de Brey** |
| 1.6 | Reseñas vacías en la ficha: **ya resuelto** (PR #157) — la sección no se monta si no hay `rating_promedio`. | Brey, 2026-09-09 | ✅ Cerrado |
| 1.7 | Breadcrumb "Inicio ／ Catálogo ／ …" de la ficha apunta a un destino que ya no existe. | ESTADO §11 bloque 1.4 | Entra con el rediseño de ficha 1.4 |
| 1.8 | ~14 sitios con `bg-soft/30`, `bg-gold/15`, `text-muted/40`… que **no compilan** (opacidad sobre tokens `var()` sin slot `<alpha-value>`). Fondos que deberían ser translúcidos salen sólidos/transparentes. | Code, 2026-09-08 (`reference_tailwind_opacity_token_defect`) | Ver WS-4 |

**Salida de WS-1:** cada ítem cae en uno de tres cubos — (a) fix chico de Code
en rama+PR (1.1), (b) decisión de Brey antes de tocar nada (1.2, 1.3, 1.4, 1.5),
(c) se absorbe en otro workstream (1.7→1.4, 1.8→WS-4). Design revisa (a) visualmente
y prioriza (b) con Brey.

---

### WS-2 · Reference Issue 01 — Fase 1 (revista pura)

**El proyecto de Diseño principal.** Documento rector: `PLAN-Aromia-Reference-Issue-01.md`.
Contenido: **desbloqueado** — ver `INVENTARIO-CONTENIDO-RI01.md` §6 (encargos
A/B/C/D cerrados; ~12-13 de 16 piezas con contenido real hoy).

- **Nombre del número:** "Aromia · Número 01".
- **Alcance:** 16 piezas en 3 actos (PLAN §C), diseñadas como composiciones
  editoriales estáticas (mockups imagen/PDF), en secuencia. Sin autocensura por
  navegador todavía (eso es Fase 2).
- **Metodología:** diseñar **secuencias, no páginas** (PLAN §D); gobernar la
  libertad creativa con el gate de 3 preguntas (PLAN §E) y registrar toda
  desviación en `DESVIACIONES.md`.
- **Piezas aún dependientes de contenido:** 4-5-6 (ensayo del Acto II —
  `drafts/br540-hype-vs-merito.md` listo), 9 y 13 (matriz —
  `drafts/matriz-olfativa-numero-01.md` lista), 11-12 (perfil Ellena —
  `drafts/jean-claude-ellena-la-sustraccion.md` listo). **Todo el contenido ya
  está en el repo**; Design puede arrancar las 16.
- **Piezas menores que se escriben al final:** carta editorial (pieza 3), cierre
  (pieza 16).
- **Insumos visuales disponibles:** 8 escenas `/editorial/*.png`, 38 OVL
  `/ovl/*.jpg` pareadas 1:1, 125 packshots de catálogo. Filtro "función
  editorial vs. relleno" = criterio de Design (PLAN §11).

**Auditoría intermedia (PLAN §H, capa de número completo)** antes de pasar a
Fase 2.

**Entregable:** `MOCKUPS/` (16 composiciones numeradas), `DESVIACIONES.md`,
`AUDITORIA-REFERENCE-ISSUE-01.md`.

---

### WS-3 · Reference Issue 01 — Fase 2 (traducción digital) — GATEADO

Documento rector: `ticket-arquitectura-editorial-tiptap.md` (arquitectura ya
decidida por Chat, auditada por Code: modelo híbrido `contenido_html` +
`contenido_json` JSONB, 5 primitives Level B, sanitización, test suite de 10
casos).

- **No arranca hasta:** (a) WS-2 aprobado por Brey, (b) auditoría intermedia
  PASS, (c) gate explícito de Brey para la migración técnica.
- **Trabajo de Design en esta fase:** por cada spread, completar la tabla de
  traducción (PLAN §F) — relación narrativa a preservar / geometría impresa /
  traducción digital / qué se pierde a propósito / qué se preserva sin negociar.
- **Restricción técnica real:** las composiciones expresivas no pueden depender
  de posicionamiento absoluto arbitrario dentro del HTML de Tiptap — se logran
  con componentes React que envuelven bloques marcados semánticamente, o con los
  5 primitives. Design diseña **dentro** de ese vocabulario cerrado
  (`treatment: "monumental" | "overlap" | …`), nunca escribiendo CSS.
- **Prototipo navegable obligatorio del Acto II** (piezas 4-10) — es lo único
  que valida la restricción de Tiptap.
- **Responsive:** reinterpretación, no apilado (PLAN §G) — "mobile rewrite", no
  "mobile shrink".

**Entregable:** `TRADUCCION-DIGITAL.md`, prototipo navegable del Acto II
(HTML/React), auditoría final (`DESIGN-CHECKLIST.md` + PLAN §H).

---

### WS-4 · Escala tipográfica + tokens de opacidad

Deuda técnica de sistema, medida, sin dirección nueva. Requiere sign-off de
dirección de arte para la parte tipográfica.

- **Hecho (2026-09-11, D-7 parte 1):** recomposición del hero de Omán —
  PR #165, mergeado. `VisualField` ganó un prop `fit` opcional; sólo la
  historia del sultán usa `heroFit:"contain"` (los otros dos heroes de
  historia encajan bien con el `cover` de siempre). Detalle en
  `project_deep_design_pass` (memoria de Code) y ESTADO decisión #108.
- **Tipografía:** `design-tokens.css` ya define tokens `--type-*` que **nadie
  consume**. Deuda medida: 36 `clamp()` distintos en CSS + 37 `text-[Npx]` ≥28px
  en TSX. Migrar la escala a los tokens. Sign-off de dirección de arte sobre la
  escala final antes de tocar.
- **Tokens de opacidad (`reference_tailwind_opacity_token_defect`):** los colores
  en `tailwind.config.ts` son `var(--x)` pelado; Tailwind v3.4 no genera los
  modificadores de opacidad → ~14 sitios rotos (WS-1 ítem 1.8). **Fix de fondo:**
  migrar los tokens a formato de canales (`--text: 32 35 31` + `rgb(var(--text) /
  <alpha-value>)`). Toca los 4 CSS (`globals`, `aromia-redesign`, `design-tokens`)
  y todo consumidor directo de `var(--text)` en CSS crudo. **Requiere QA en claro
  y oscuro** en toda la superficie (harness de `reference_aromia_qa_harness`).
- **Migración tipográfica de párrafos:** IBM Plex Sans (`font-plex`) cargada pero
  no aplicada masivamente a párrafos (ESTADO). Decidir con dirección de arte si
  entra en esta migración.

**Entregable:** PR de Code con el diff de tokens + evidencia renderizada (7
viewports × claro/oscuro) de regresión-limpia.

---

### WS-5 · Extracción del sistema — solo después de RI01 aprobada

PLAN §L. No se construye un design system antes de tener la Issue aprobada por
Brey. Cuando lo esté, extraer únicamente lo que RI01 realmente usó:

- Qué relaciones de retícula se usaron y cuáles nunca hicieron falta.
- Qué arquetipos (PLAN §12) se usaron más de una vez con variación → candidatos
  a patrón reutilizable.
- Qué desviaciones de `DESVIACIONES.md` aparecieron 2+ veces → arquetipo nuevo
  documentado.
- Qué tipos de bloque necesita soportar Tiptap de forma nativa.

**Entregable:** `SISTEMA-EXTRAIDO.md`. **No reabre** "The Design Bible"
(iniciativa cross-proyecto pausada por Brey).

---

## 3. Decisiones abiertas de Brey (bloquean tramos concretos)

| # | Decisión | Bloquea |
|---|---|---|
| D-1 | Nombre real del número → **resuelto**: "Aromia · Número 01" | — |
| D-2 | Fuente de datos de `longevidad`/`estela`/`proyeccion` (¿carga manual? ¿scraping? ¿se retira la sección?) | WS-1 1.4 |
| D-3 | Personas sin foto: ¿conseguir ~11 retratos con licencia (Wikimedia CC como los 2 actuales) o gatear a "solo con foto" (deja la página en 2)? | WS-1 1.5 |
| D-4 | Personas gate de ≥5 obras: ¿sumar atribuciones verificadas, esperar expansión de catálogo, o bajar el mínimo? | WS-1 1.5 |
| D-5 | Modo oscuro de `ProductImage` en la ficha (tratamiento del fondo blanco de Amazon sobre `#0A0A0A`) | WS-1 1.3 |
| D-6 | Historias SubBatch 01 (500 en prod): ¿ingestar los `.md` a la fuente real y publicarlas, o retirarlas? | WS-1 1.2 |
| D-7 | Sign-off de dirección de arte: escala tipográfica `--type-*` (recomposición del hero de Omán ya hecha, PR #165) | WS-4 |
| D-8 | Gate para arrancar WS-2 (Fase 1 de RI01) ahora, en paralelo a WS-1 | WS-2 |
| D-9 | Gate para la migración técnica de WS-3 (después de la auditoría de WS-2) | WS-3 |
| D-10 | Relevancia visual del Quiz en Discovery — dirección que quiere Brey | pieza de WS-1 / entra en un mini-brief propio |

---

## 4. Secuencia y dependencias

```
WS-1 (deuda en prod)  ──┬─ 1.1 fix chico ─────────────► Code PR (ya)
                        ├─ 1.2/1.3/1.4/1.5 ──► esperan D-2..D-6
                        └─ 1.8 ──► se hace dentro de WS-4

WS-2 (RI01 Fase 1)  ──► arranca con D-8 (puede ir YA, en paralelo a WS-1)
        │
        ▼  auditoría intermedia PASS  +  D-9
WS-3 (RI01 Fase 2 / Tiptap)  ──► prototipo Acto II ──► responsive rewrite ──► auditoría final
        │
        ▼  Brey aprueba el número
WS-5 (extracción del sistema)

WS-4 (tipografía + tokens)  ──► independiente; tipografía espera D-7; tokens de opacidad puede ir cuando haya banda de QA
```

**Orden recomendado de arranque:** D-8 (arrancar WS-2 ya) + los fixes chicos de
WS-1 en paralelo. WS-4 cuando haya banda de QA. WS-3 y WS-5 en su gate.

---

## 5. Definition of Done global

Aromia "tiene su diseño cerrado punta a punta" cuando:

1. **WS-1:** cero P0/P1 de contraste o runtime en la superficie pública;
   `DESIGN-CHECKLIST.md` corre limpio contra aromialab.com en vivo.
2. **WS-2:** las 16 piezas de RI01 existen con contenido real (cero Lorem);
   `DESVIACIONES.md` con ≥1 entrada revisada; auditoría PLAN §H sin `REVISAR`
   abierto; Brey aprueba el número como referencia.
3. **WS-3:** `EditorialOpening` + `FullBleedImage` funcionan de punta a punta
   (admin→JSON→Postgres→React→CSS) con datos reales; los 10 casos de la test
   suite editorial pasan revisión visual; `PageFlipReader`/`PrintableArticle`
   siguen funcionando para artículos legacy; sanitización server-side activa.
4. **WS-4:** escala tipográfica consumiendo `--type-*`; modificadores de opacidad
   funcionan sobre todos los tokens; evidencia de regresión-limpia en 7
   viewports × claro/oscuro.
5. **WS-5:** `SISTEMA-EXTRAIDO.md` entregado, con solo lo que RI01 probó en uso
   real.

Cada workstream cierra con handoff nativo a Code (mockups + especificación de
relaciones + `DESVIACIONES.md` + decisiones de traducción), no "diseño terminado
para copiar pixel a pixel".
