# Sprint 1 — Checklist de cierre (Cowork)

Generado: 12 de julio de 2026

## 1. `PERFUMES_INITIAL_50.csv`

- [x] 50 perfumes documentados
- [ ] Columnas alineadas al `schema/perfume.schema.json` de Code — **no
  disponible en este sprint** (no se encontró el archivo ni acceso al repo
  desde esta sesión de Cowork). Se usó la estructura razonable sugerida en
  `SPRINT1_COWORK.md`: `id, nombre, marca, genero, familia_olfativa,
  notas_salida, notas_corazon, notas_fondo, precio_referencia_usd,
  categoria_precio, link_afiliado, imagen_url, nicho_o_comercial,
  descripcion_corta`. Queda documentado en `CLAUDE.md` para que Code lo
  reconcilie contra su schema real.
- [x] Mezcla de nichos y comerciales — 26 perfumes marcados `comercial`, 24
  `nicho` (verificado programáticamente, columna `nicho_o_comercial`)

**Nota técnica:** las notas olfativas usan `;` como separador interno (no
coma) y la columna `descripcion_corta` usa comillas RFC 4180 donde el texto
contiene comas — validado con un parser de CSV real, sin filas rotas.

## 2. `articles/` — 10 artículos/reseñas

- [x] Archivos markdown, uno por artículo — **se generaron 11, uno más de
  los 10 pedidos** (quedó una reseña adicional de Delina al querer asegurar
  cobertura de perfiles). No se considera un problema, pero se señala porque
  el checklist original pedía exactamente 10.
- [x] Mezcla de formatos: 4 reseñas individuales, 3 comparativas, 4 guías
  (2 de temporada, 2 de ocasión)
- [x] Metadata mínima al inicio (front-matter YAML: título, perfumes
  cubiertos, keyword objetivo)
- [x] Tono de curaduría experta, no publicitario — se evitó lenguaje de venta
  directa y se incluyó nota de disclaimer de afiliados en cada pieza

**Cobertura de perfumes:** de los 50 perfumes del CSV, 15 distintos aparecen
mencionados en al menos un artículo. Los 35 restantes no tienen contenido
propio todavía — señalado como prioridad #1 en `SEO_STRATEGY.md` para la
siguiente ronda.

## 3. `COPY/quiz-questions.md`

- [x] Preguntas del quiz "qué perfume eres" — 6 preguntas, 3-4 opciones cada
  una
- [x] Lógica de matching hacia perfumes del CSV — sistema de reglas simples
  por tags (7 tags), con tabla de mapeo a `familia_olfativa` +
  `nicho_o_comercial`
- [x] Copy para resultado compartible — 7 perfiles con título corto (OG
  title) y descripción (OG description)

## 4. `SEO_STRATEGY.md`

- [x] Keywords objetivo iniciales — una por artículo + secundarias
- [x] Estructura de URLs propuesta para v2.0
- [ ] Verificación de redirects contra URLs de v1 — **no se pudo confirmar**,
  no hubo acceso a `ESTADO-aromia.md` (decisión #5) desde esta sesión. Queda
  como acción pendiente explícita en la sección 2 de `SEO_STRATEGY.md`.
- [x] Prioridades de contenido para la siguiente ronda

## 5. `CLAUDE.md` (borrador, raíz del repo)

- [x] Spec técnica desde perspectiva de contenido — estructura del CSV, de
  los artículos, del quiz y de la estrategia SEO, explicada para que Code
  pueda construir el frontend sin adivinar formatos
- [x] Marcado explícitamente como borrador para que Code lo complete con
  stack, comandos y convenciones reales

## 6. Ambigüedades y bloqueos señalados (no bloquean el sprint)

1. **Sin acceso al repo real** (`francoisbowman-cloud/aromia-lab`) ni a
   `ESTADO-aromia.md` desde esta sesión de Cowork. Todo el trabajo se generó
   en el working folder local y necesita copiarse/commitearse al repo por
   fuera de esta sesión.
2. **`schema/perfume.schema.json` no encontrado** — se avanzó con estructura
   propia razonable, documentada y lista para reconciliar (ver punto 1 del
   checklist arriba y sección 1.1 de `CLAUDE.md`).
3. **11 artículos en vez de 10** — exceso menor, no bloqueante, señalado por
   transparencia.
4. **Redirects de URL v1→v2 sin confirmar** — depende de información que vive
   en `ESTADO-aromia.md`, no disponible en esta sesión.
5. **Links de afiliado e imágenes son placeholders** — ningún perfume tiene
   todavía link de afiliado real ni imagen real; es contenido de estructura,
   no de producción.

## Resumen para pegar en `ESTADO-aromia.md` (10-15 líneas)

Sprint 1 / pista Cowork cerrada (contenido). Se generaron los 4 entregables
principales: `PERFUMES_INITIAL_50.csv` (50 perfumes, mezcla nicho/comercial),
`articles/` (11 piezas: reseñas, comparativas y guías, tono de curaduría sin
venta directa), `COPY/quiz-questions.md` (quiz de 6 preguntas con matching por
reglas simples a 7 perfiles olfativos, con copy compartible para OG tags) y
`SEO_STRATEGY.md` (keywords por artículo, estructura de URLs propuesta,
prioridades de contenido futuro). Se dejó un borrador de `CLAUDE.md` en la
raíz con la spec de contenido para que Code lo complete con lo técnico.
Ambigüedad principal: no hubo acceso al repo real ni a
`schema/perfume.schema.json` durante el sprint, así que el CSV usa una
estructura propia razonable que Code debe reconciliar contra su schema antes
de importar. Tampoco se pudo confirmar el mapeo de redirects v1→v2 (decisión
#5) por falta de acceso a este mismo documento. Cobertura de contenido:
15 de 50 perfumes tienen artículo propio — resto queda como prioridad de
Sprint 2. Todos los archivos están en el working folder de Cowork, pendientes
de commitear al repo.
