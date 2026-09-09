# Brief para Cowork — Encargos de contenido de Reference Issue 01

### Preparado por Code · 2026-09-08
### Fuente de verdad del alcance: `INVENTARIO-CONTENIDO-RI01.md` (raíz del repo)

---

## 0. Antes de escribir una línea

1. Leé del repo, no de memoria de sesión: `ESTADO-aromia.md`, `CLAUDE.md`,
   `PLAN-Aromia-Reference-Issue-01.md`, `INVENTARIO-CONTENIDO-RI01.md`,
   `decision-aromia-revista-sin-catalogo.md`.
2. **No hagas `git commit` ni `git push`** — aunque tengas permiso técnico.
   Dejá los `.md` listos en el working tree y avisale a Brey para que Code los suba.
3. Cualquier cosa que reportes como "pendiente" o "faltante": verificala con un
   comando real (`ls drafts/`, `git status`, leer el archivo). No la infieras.
4. **No inventes datos de perfumería** (notas, año, perfumista, casa, concentración,
   precio). Verificá contra fuente primaria y dejá el `**Fact-check:**` con los
   links, igual que en los borradores que ya escribiste.

## 1. Qué es Reference Issue 01

Es la **revista de referencia** de Aromia — "Aromia · Número 01" como nombre
público. No es un número más: es la pieza con la que Design calibra el sistema
editorial (arquitectura de 16 piezas en 3 actos, ver `PLAN` §C) y con la que
después Code decide qué primitives de Tiptap construir (Fase 2, todavía sin
arrancar).

**Tesis (PLAN §A), repetila en cada pieza:** *"Un editor que sabe mucho de
perfumes, escribiendo para alguien a quien le importa, no vendiéndole a alguien
a quien hay que convencer."* Si la pieza se puede imaginar con un botón "Comprar
ahora" superpuesto sin que se vea raro, falló.

## 2. Estado del contenido (para que no dupliques)

`drafts/` ya tiene **46 piezas `editorial_ready`** tuyas (~1.050–1.400 palabras,
14 series). Cubren ~12–13 de las 16 piezas de RI01. **Faltan tres cosas**, y son
estos tres encargos. No escribas nada más para RI01 sin pedírselo a Brey — el
riesgo ahora es sobreproducir, no faltar contenido.

---

## Encargo A — Ensayo largo del Acto II (adaptación, no de cero)

| Campo | Valor |
|---|---|
| Piezas del PLAN | 4, 5, 6 (apertura del ensayo + aterrizaje + imagen ancla) |
| Tema | **Baccarat Rouge 540: hype vs. mérito real.** Por qué el nicho más viral de la década sigue (o no) mereciendo la pena. Ángulo **observacional**, no reseña de compra. |
| Extensión | **~2.000 palabras** (las piezas de `drafts/` son de ~1.200 — esta necesita más aire para que Design pruebe apertura monumental + full-bleed + pausa + cambio de tempo). |
| Base | **Extendé y reenfocá `drafts/puede-un-perfume-oler-barato-aunque-cueste-300.md`** (~1.205 w, serie "Cómo se construye una impresión", ya menciona BR540). No empieces en blanco. Si al reenfocarlo el eje BR540 no entra natural, proponé a Brey otro de la serie "Coleccionar, comprar y desear" como base. |
| Estructura sugerida | Apertura que planta la pregunta (no la respuesta) → qué es BR540 y por qué explotó → la experiencia real de olerlo vs. la expectativa → el argumento del "huele a caro / huele a genérico" → **una pausa** (un párrafo corto, mucho aire, sin dato) → qué queda cuando se apaga el ruido → `## Sí, pero` (contrapunto escéptico, convención de la casa) → cierre que no resuelve del todo. |
| Datos a verificar | Composición y año de BR540 contra la **ficha oficial de Maison Francis Kurkdjian** (no foros, no Fragrantica). Perfumista: **Francis Kurkdjian** (verificalo, no lo des por sentado). Precio de referencia: contra la ficha del catálogo (`baccarat-rouge-540-edp`) o retail oficial. |
| Perfume en catálogo | `baccarat-rouge-540-edp` — tiene imagen OVL y `perfume_relacionado`. Link de afiliado obligatorio. |
| Byline | "Redacción Aromia". |
| Salida | `drafts/br540-hype-vs-merito.md` (o el slug que prefieras, avisá cuál). |

---

## Encargo B — Perfil de perfumista: Jean-Claude Ellena

| Campo | Valor |
|---|---|
| Piezas del PLAN | 11 (retrato + bio) y 12 (cita destacada) |
| Serie | **"Personas"** — sería la segunda entrada. Usá `drafts/el-perfumista-que-no-teme-exagerar.md` (Dominique Ropion) como referencia de registro y estructura. |
| Sujeto | **Jean-Claude Ellena.** Elegido porque **escribió libros** — citarlo es citar texto publicado, cero riesgo de fabricación. |
| Extensión | ~700–1.000 palabras. |
| Fuentes permitidas | **Solo:** *Journal d'un parfumeur* / *The Diary of a Nose* (y *Le parfum* si lo necesitás), más entrevistas **on-record** con medio identificable (NYT, The Guardian, Nez, etc.). Cada frase atribuida a Ellena va como **cita textual entre comillas + fuente**. Nada de paráfrasis presentada como cita. Nada de foros. |
| Entregable extra | **Una cita destacada real** (para la pieza 12, `pullQuote`) — textual, potente, con fuente. No la inventes ni la "mejores". |
| Perfume ancla | **Terre d'Hermès** — su obra, está en catálogo (`terre-d-hermes-parfum` / `terre-d-hermes-edt`) y tiene imagen OVL. Link de afiliado obligatorio. Podés mencionar también otras de sus composiciones si están en catálogo. |
| Ángulo | Su idea de la perfumería como **sustracción** (quitar hasta lo esencial), en contraste directo con la pieza de Ropion (la sobredosis). Las dos entradas de "Personas" deberían leerse como dos filosofías opuestas. |
| Byline | "Redacción Aromia" (o firma de editor si Brey define una — por ahora Redacción). |
| Salida | `drafts/jean-claude-ellena-la-sustraccion.md` (o el slug que prefieras). |

---

## Encargo D — Pieza de datos: matriz olfativa

| Campo | Valor |
|---|---|
| Piezas del PLAN | 9 (matriz sensorial) y apoyo a 13 (discovery / familia olfativa) |
| Qué es | Una **tabla/matriz** — es **dato, no imagen** (PLAN §C pieza 9: "forzarlo a un primitive visual violaría el criterio"). Cruza **familia olfativa × género × notas dominantes** para un subconjunto curado de perfumes de la Issue. |
| Subconjunto | Curá **12–18 perfumes** que aparezcan (o puedan aparecer) en RI01 — no los 125. Priorizá los que ya tienen artículo o mención en `drafts/` y los que tienen OVL. Proponé la lista; Code puede exportarte los valores exactos (`familia_olfativa`, `genero`, `notas_salida/corazon/fondo`) de la DB para esas filas si los necesitás fiables. |
| Texto | ~300–500 palabras de encuadre: qué mirar en la matriz, qué patrón revela (ej. "los amaderados dominan el unisex", "los gourmand se concentran en femenino"). No es una lista de notas — es una lectura de la lista. |
| Restricción | Los valores de familia/notas salen de la DB o de ficha oficial, no de tu criterio. Si un valor de la DB te parece mal, marcalo, no lo corrijas por tu cuenta. |
| Salida | `drafts/matriz-olfativa-numero-01.md` |

---

## 3. Formato de entrega (igual que tus borradores actuales)

Cada `.md` en `drafts/` con, en este orden:

1. **Frontmatter YAML:** `titulo`, `tipo`, `serie`, `perfumes_mencionados`
   (nombres exactos como en el catálogo), `keyword_objetivo`, `estado: editorial_ready`.
2. **Bloque de estado** ```text EDITORIAL: READY / ART_DIRECTION: PENDING / … / TARGET_DATE: UNSCHEDULED ```
3. `**Territorio del calendario:**` (día / serie).
4. `**Fact-check:**` — cada dato no obvio con su fuente como link markdown.
   Si descartaste un gancho por un dato, dejalo dicho (como hiciste con Ropion/BR540).
5. Cuerpo con secciones `## `, incluyendo una `## Sí, pero` (contrapunto escéptico).
6. Cierre: `---`, después `*Nota: … Los enlaces de compra dirigen a retailers autorizados.*`,
   después los links de afiliado en formato
   `[Nombre de Marca](https://www.amazon.com/s?k=…&tag=aromialab-20) — comentario corto.`
7. Última línea: ```text COWORK_STAGE: READY_FOR_CODE_INGEST ```

**Tag de afiliado:** `aromialab-20`. Siempre. Un link por perfume puntual mencionado.

## 4. Qué NO hacer

- No escribir más piezas para RI01 fuera de estos tres encargos.
- No commitear ni pushear.
- No tocar `apps/api/data/articles/` (carpeta congelada).
- No inventar citas, notas, años ni perfumistas. Ante la duda, marcá `[VERIFICAR]`
  y avisá a Brey — nunca rellenar con algo que "suene bien".
- No proponer números de decisión para el `ESTADO` — describí en prosa, Code numera.

## 5. Checklist de "listo" por pieza

- [ ] Frontmatter + bloque de estado + `COWORK_STAGE: READY_FOR_CODE_INGEST`.
- [ ] `**Fact-check:**` con todas las fuentes como links, y datos de perfumería
      verificados contra fuente primaria.
- [ ] Extensión dentro del rango del encargo.
- [ ] Sección `## Sí, pero` presente.
- [ ] Links de afiliado con `tag=aromialab-20`, uno por perfume mencionado.
- [ ] Pasa la "prueba del vendedor" (PLAN §A).
- [ ] Avisado a Brey que está en el working tree para que Code lo suba.
