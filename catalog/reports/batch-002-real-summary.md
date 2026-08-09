# Auditoría — Batch 002 REAL, 50 fragancias (Fase 3.7)

**Fecha:** 2026-08-08
**Fuente:** `handoff/cowork/phase-3/batch-002.csv` (entregado por Cowork) — copiado íntegro y verificado por hash SHA-256 a `catalog/imports/batch-002.csv`, sin modificar.
**Alcance:** solo lectura. No se escribió a Postgres, no se importó nada, no se tocó `main`.

---

## INPUT

- **Rows received:** 50
- **Rows parsed:** 50 (CSV bien formado, header de 36 columnas — `middle_notes` ya viene como nombre de contrato vigente, no necesitó el alias legacy)
- **Rows normalized:** 50

## catalog_relation

| Relación | Filas |
|---|---|
| NEW | 49 |
| EXISTING | 0 (`catalog/aromia-catalog-master.csv` sigue vacío) |
| RELATED_VARIANT | 1 (`bleu-de-chanel-parfum` — variante de concentración de `bleu-de-chanel-edp`, ya en el catálogo baseline de 38; regla general de F3.6, misma que resolvió Eros/Terre d'Hermès en Batch 001, sin ninguna excepción nueva) |
| POSSIBLE_DUPLICATE | 0 |

Los dos falsos positivos que Cowork descartó manualmente en su propia
revisión ("Opium" vs. "Black Opium EDP"; Loewe 001 Woman vs. Man como
entidades separadas) **también los descarta correctamente el pipeline**
por regla general — ninguno aparece como `POSSIBLE_DUPLICATE`. Loewe 001
Woman y Man quedan como dos filas `NEW` independientes, sin relación entre
sí (nombres distintos, no colisionan).

## quality_status

| Estado | Filas |
|---|---|
| CATALOG_READY | 0 |
| CATALOG_READY_WITH_PENDING | 29 |
| REVIEW_REQUIRED | 0 |
| REJECTED | 21 |

`status` legacy derivado: NEW=29, REJECTED=21, UNCHANGED=0, UPDATED=0, CONFLICT=0.

## Por qué 21/50 (42%) quedan REJECTED

Ninguna por ambigüedad, enum cerrado, enrichment pending, o múltiples
fuentes — las 4 causas que la calibración de F3.6 eliminó explícitamente
como motivo válido de rechazo. Las 21 son estrictamente `family` pending
(16 issues) y/o pirámide de notas pending (`top_notes`/`middle_notes`/
`base_notes`, 9 issues cada uno) — campos críticos genuinamente no
verificados en la primera pasada de investigación de Cowork. Coincide con
lo que el propio `batch-002-summary.md` de Cowork ya documentó
("factual-core pending: ~109 celdas de 350, concentrado en marcas de
nicho con menos presencia oficial online").

Esto **no es un problema de datos incorrectos ni un bug de pipeline** —
es la consecuencia esperable de que Batch 002 recibió una sola pasada de
investigación (a diferencia de Batch 001, que recibió una segunda pasada
de remediación dirigida). Ver sección "Automation yield" para el efecto
sobre la recomendación del gate.

## QUALITY

- **Validation errors (filas):** 21
- **Warnings (filas):** 1 (`new-york-signature-scent-pure-perfume`, `concentration='Pure Perfume 30%'` — nomenclatura propia de Bond No. 9, no bloqueante, mismo criterio que Roja Parfums en Batch 001)
- **Normalization operations (transformaciones reales):** 3 — 2 alias de concentración (`Extrait de Parfum`→`Extrait`, en `bat-extrait` y `black-afgano-extrait`), 1 concentración no estándar conservada tal cual con nota. Ver `catalog/reports/batch-002-real-normalization.csv`.
- **Possible duplicates (dentro del batch):** 0
- **Slug collisions (contra el maestro o el catálogo actual):** 0
- **Unknown enums:** 1 (`'Pure Perfume 30%'`)
- **Multiple-source rows:** 10 (`poison-edt`, `alien-edp`, `linterdit-edp`, `burberry-her-edp`, `daisy-edt`, `spicebomb-edt`, `chloe-edp`, `beautiful-edp`, `colonia-edc`, `no1-masculine-parfum`) — **exactamente la misma lista que documentó Cowork**, todas procesadas por la regla general de `source_url` como colección (F3.6) sin ninguna excepción de fila.
- **Factual-core pending (family, subfamily, launch_year, perfumer, top/middle/base_notes — 7 campos × 50 filas):** 106/350 celdas (30.3%) — cifra propia, calculada de forma independiente; el `batch-002-summary.md` de Cowork reporta 109/350, diferencia menor (3 celdas) no investigada, no material para ninguna decisión.
- **Enrichment pending (season, occasion, longevity, sillage, price_segment — 5 campos × 50 filas, misma definición que usó Cowork en su propio resumen):** 229/250 celdas (91.6%). Nota: `lib.mjs#ENRICHMENT_FIELDS` (F3.6) no incluye `price_segment` en su definición operativa (solo season/occasion/longevity/sillage) — `price_segment` no bloquea igual, pero se reporta acá junto a los otros 4 para que la cifra sea comparable con la de Cowork.
- **`price_segment` pending específicamente:** 29/50 (58%) — ver sección Source Conflict abajo.

---

## Comparación contra baseline + Batch 001

- **Contra el catálogo baseline (38 perfumes, `PERFUMES_INITIAL_50.csv`):** 1 `RELATED_VARIANT` confirmado (`bleu-de-chanel-parfum`), 0 `POSSIBLE_DUPLICATE`.
- **Contra Batch 001 (25 filas, `catalog/imports/batch-001.csv`):** 0 colisiones de slug, 0 coincidencias de marca+nombre — confirmado por el propio Cowork y validado independientemente por el pipeline (no hay ningún registro de Batch 002 con `catalog_relation` distinto de `NEW`/`RELATED_VARIANT`-contra-baseline que involucre a Batch 001).
- **Contra variantes ya conocidas:** el patrón Eros/Terre d'Hermès (Batch 001) y Bleu de Chanel (Batch 002) confirma que la regla general de `extractConcentrationFromName()` funciona de forma consistente entre lotes de distinto tamaño y contenido, sin ajustes.

---

## Reemplazos de productos inexistentes (Cowork documentó 5 + 1 corrección de concentración)

No se tratan como error — cada uno cumple los 3 criterios del brief F3.7
(producto original no existe, reemplazo documentado, provenance válido,
sin duplicado):

1. Dior "Poison EDP" (no existe esa concentración) → **Poison EDT**.
2. Comme des Garçons "Wonderwood EDT" (no existe) → **Wonderwood EDP**.
3. House of Sillage "Whispers of Wisdom" (no existe en el catálogo real de la marca) → **Xerjoff More Than Words** (marca distinta, mismo slot).
4. Xerjoff "More Than Water" (no existe) → **More Than Words** — notas declaradas "NO VERIFICADO - marca no divulga" en vez de usar listas especulativas de terceros.
5. Bond No. 9 "New York" (no es un producto, es el concepto de marca) → **New York Signature Scent**.
6. Zoologist "Bat EDP" (solicitado) → registrado como **Extrait de Parfum** (concentración real vigente, no la solicitada).

El pipeline no tiene ninguna lógica específica para "detectar reemplazos"
— simplemente valida/clasifica cada fila del CSV entregado como
cualquier otra. Los 6 casos pasan por las reglas generales igual que el
resto: `wonderwood-edp` y `poison-edt`, por ejemplo, aparecen como `NEW`
si tienen sus campos críticos completos, o `REJECTED` si no, sin ninguna
distinción de "es un reemplazo" en el código.

**Loewe 001 Woman / Man:** confirmado como dos filas independientes
(`loewe-001-woman-edp`, `loewe-001-man-edp`), `catalog_relation=NEW` para
ambas, sin relación cruzada entre sí — el pipeline nunca las trató como
la misma entidad ni las fusionó.

---

## Source conflict / price_segment pending (decisión 8 del brief)

**Frecuencia exacta:** 29/50 filas (58%) de Batch 002 tienen
`price_segment` pending — comparado con 5/25 (20%) en Batch 001. **Es
recurrente y la tasa subió, no bajó**, al triplicar el volumen.

El campo `price_segment` pending no distingue estructuralmente entre dos
situaciones muy distintas que hoy Cowork documenta solo en `notes` (texto
libre):

- **`UNVERIFIED`** — no se encontró ninguna fuente de precio confiable (la mayoría de los 29 casos, según el propio `batch-002-summary.md`: "casi siempre por falta de precio de fuente confiable").
- **`SOURCE_CONFLICT`** — sí hay fuentes, pero se contradicen de forma significativa (ej. `boss-bottled-edt`: dos pirámides de notas incompatibles entre fuentes secundarias — no es sobre precio en este caso puntual, pero es el mismo patrón estructural que `ani-extrait` en Batch 001).
- Un tercer caso, **`NOT_APPLICABLE`**, no apareció explícitamente en los datos de estos dos lotes (no hay evidencia de un perfume donde el precio "no aplique" por diseño) — se menciona en la recomendación por completitud, no porque el lote lo haya mostrado.

**Recomendación (no implementada en esta pasada):** con dos lotes
mostrando esta indistinción y una tasa creciente, hay evidencia suficiente
para justificar separar semánticamente estos tres casos en una fase
futura — probablemente como un campo `price_segment_status` (enum:
`unverified` / `source_conflict` / `not_applicable` / `confirmed`)
independiente de `price_segment` en sí. **No se implementó automáticamente**
en esta pasada, siguiendo la instrucción explícita del brief de no ampliar
el modelo por anticipación — queda como recomendación explícita para que
Brey decida antes de Batch 003, con los números reales de dos lotes como
respaldo (no una intuición).

---

## Automation Yield

**Definición usada** (no hay una definición literal en el brief, se elige
la más útil para la pregunta que responde el gate — "¿esta fila salió del
pipeline lista para stage sin que nadie tuviera que intervenir?"):

```
automation_yield = (filas con quality_status CATALOG_READY o CATALOG_READY_WITH_PENDING) / total_filas
```

`REJECTED` y `REVIEW_REQUIRED` cuentan como "requieren intervención humana"
para este cálculo — el primero porque necesita otra pasada de
investigación, el segundo porque necesita una decisión. Se reporta también
por separado la tasa de **decisión humana pura** (`REVIEW_REQUIRED` /
total), que es una medida más estrecha, porque el gate del brief habla de
"decisión humana" específicamente.

| Lote | CATALOG_READY(_WITH_PENDING) | REVIEW_REQUIRED | REJECTED | Automation yield | Tasa de decisión humana pura (REVIEW_REQUIRED/total) |
|---|---|---|---|---|---|
| Batch 001 remediation (9 filas) | 7 | 0 | 2 | **77.8%** | 0% |
| Batch 002 (50 filas) | 29 | 0 | 21 | **58.0%** | 0% |

## Gate (decisión 7 del brief)

Umbral: `<5% revisión humana → escalar`, `5–10% → mantener tamaño`,
`>10% → calibrar`.

Con la tasa de decisión humana pura (`REVIEW_REQUIRED`/total = 0% en
ambos lotes), el umbral literal diría "escalar" — pero esa lectura
ignora que 42% de Batch 002 no llegó a estado publicable en absoluto.
Usando `100% − automation_yield` como la tasa de "necesita intervención"
(42% en Batch 002), el resultado cae claramente en `>10% → calibrar`.

**Se usa la interpretación amplia** para la recomendación del gate — un
lote con 42% de filas incompletas no debería escalar a 100 solo porque
ninguna de esas filas requirió una *decisión* (todas requieren más
*investigación*, que es un costo real distinto pero igual de bloqueante
para producción).

### Requisitos adicionales para GO-100 (decisión 7)

| Requisito | Cumplido |
|---|---|
| 0 pipeline bugs severos | ✅ — 0 bugs nuevos revelados por Batch 002 (las reglas generales de F3.6 lo procesaron sin ajustes) |
| 0 contract mismatches sistemáticos | ✅ — 1 hallazgo menor (concentración no estándar), ya cubierto por la regla abierta de F3.6, no requirió cambio |
| 0 deduplicaciones destructivas | ✅ — 0 duplicados exactos, 0 conflictos de duplicado dentro del batch |

Los tres requisitos técnicos se cumplen — **el pipeline en sí está sano**.
Lo que bloquea GO-100 es el volumen de trabajo de investigación pendiente,
no la infraestructura.

---

## Verificación del master consolidado de Cowork (decisión 5)

`handoff/cowork/phase-3/aromia-catalog-master.csv` — leído directamente
desde `handoff/` para auditoría cruzada, **no copiado a `catalog/`** (es
un artefacto de control de Cowork, no sustituye a `catalog/aromia-catalog-master.csv`,
que sigue siendo el único maestro real del pipeline, vacío hasta que se
apruebe una importación).

| Verificación | Resultado |
|---|---|
| 75 filas | ✅ confirmado (25 + 50) |
| 0 slugs duplicados | ✅ confirmado |
| Consistencia con Batch 001 + Batch 002 | ✅ las 25 + 50 filas de `catalog/imports/batch-001.csv` y `batch-002.csv` están todas presentes en el master por slug, sin faltantes |
| No pérdida de datos por migración `heart_notes`→`middle_notes` | ✅ confirmado — 0 discrepancias entre `middle_notes` de las 25 filas de Batch 001 (leídas vía el alias legacy) y el mismo campo en el master consolidado |

**Nota:** el master de Cowork es un snapshot **anterior** a la
remediación de F3.7 — sus 9 filas correspondientes a Batch 001 siguen con
`family`/notas `pending` (no incorpora `batch-001-remediated.csv`). Esto
es esperado, no un error: Cowork consolidó antes de que la remediación
existiera. El artefacto más actualizado de Batch 001 es
`catalog/staging/batch-001-remediated.csv`, no el master de Cowork.

## Archivos generados

- `catalog/reports/batch-002-real-summary.md` — este archivo
- `catalog/reports/batch-002-real-validation.csv` — 50 filas
- `catalog/reports/batch-002-real-duplicates.csv` — 50 filas
- `catalog/reports/batch-002-real-normalization.csv` — 3 transformaciones
- `catalog/reports/batch-002-real-exceptions.csv` — 45 hallazgos (todos categoría F o B, 0 requieren decisión humana)
- `catalog/staging/batch-002.import-proposal.csv` — 29 filas aprobables
- `catalog/rejected/batch-002-rejected.csv` — 21 filas rechazadas, con motivo
- `catalog/reports/batch-002-diff.json`, `batch-002-validation.json`, `batch-002.normalized-validation.json`, `batch-002-normalize-trace.json`, `batch-002.normalized-duplicates.json`

**Import real: no ejecutado.** `catalog/aromia-catalog-master.csv` sigue
en 0 filas.
