# Auditoría de calibración — batch-001 REAL (Fase 3.5)

**Fecha:** 2026-08-07
**Fuente:** `handoff/cowork/phase-3/batch-001.csv` (entregado por Cowork)
**Copia de trabajo:** `catalog/imports/batch-001.csv`
**Pipeline:** Fase 3 Bloques A-D (`scripts/catalog/`), corregido en esta misma sesión tras revisar este batch real — ver sección PIPELINE_BUG / CONTRACT_MISMATCH más abajo.
**Alcance:** solo lectura. No se escribió a Postgres, no se importó nada, no se tocó `main`, no se modificó el archivo original de Cowork.

## Integridad de la ingesta (Paso 1)

| | Origen | Copia |
|---|---|---|
| Path | `handoff/cowork/phase-3/batch-001.csv` | `catalog/imports/batch-001.csv` |
| Tamaño | 23416 bytes | 23416 bytes |
| SHA-256 | `4272f301bda12648e97e40f204c1b66cbcc2cef1e19e35ce8f6debb25fe0f968` | `4272f301bda12648e97e40f204c1b66cbcc2cef1e19e35ce8f6debb25fe0f968` |

Hashes idénticos — copia exacta, sin mutación. CSV parseable, 36 columnas
(35 del schema original + `notes`, agregada por Cowork — no estaba
contemplada, se sumó al schema, ver `CONTRACT_MISMATCH` #8 abajo), 25
filas de datos, sin pérdida de columnas.

---

## INPUT

- **Rows received:** 25
- **Rows parsed:** 25 (CSV bien formado, sin errores de parseo)
- **Rows normalized:** 25

## RESULT

| Estado | Filas |
|---|---|
| NEW | 13 |
| MATCHED / EXISTING (UNCHANGED contra el maestro) | 0 — `catalog/aromia-catalog-master.csv` sigue vacío, nada se aprobó todavía en ninguna fase anterior |
| CONFLICT | 2 |
| REJECTED | 10 |
| REVIEW REQUIRED* | 4 |
| CATALOG READY** | 12 |

\* No es una categoría separada del `diff.mjs` — es un corte transversal:
filas donde, más allá de si son NEW/CONFLICT/REJECTED, hay un motivo de
fondo (documentado por Cowork en `notes` o detectado por el pipeline) que
necesita una decisión humana antes de aprobar. Ver
`catalog/reports/batch-001-real-exceptions.csv`, columna
`requires_human_decision=true`: `eros-parfum`, `terre-d-hermes-parfum`,
`ani-extrait`, `vanilla-28-edp`.

\** NEW menos las que requieren decisión humana: 13 − 1 (`ani-extrait`,
NEW en lo estructural pero con el precio sin resolver) = 12. Las 12:
`chanel-no5-edp`, `tobacco-vanille-edp`, `shalimar-edp`, `paradoxe-edp`,
`212-vip-edp`, `interlude-woman-edp`, `vibrant-leather-edp`,
`gypsy-water-edp`, `percival-edp`, `cedrat-boise-edp`,
`born-in-roma-uomo-edt`, `elysium-pour-homme-parfum-cologne`.

## QUALITY

- **Validation errors (filas):** 10
- **Warnings (filas):** 1 (`elysium-pour-homme-parfum-cologne` — concentración no estándar, no bloqueante)
- **Normalization operations (transformaciones reales, no ruido):** 4 — 2 alias de `price_segment` sin tilde (`economico`→`económico`), 1 alias de concentración (`Extrait de Parfum`→`Extrait`), 1 concentración no estándar conservada tal cual con nota. Ver `catalog/reports/batch-001-real-normalization.csv`.
- **Possible duplicates (dentro del batch):** 0 — Cowork no repitió ningún slug ni combinación marca+nombre+concentración.
- **Slug collisions (contra el maestro o el catálogo actual):** 0
- **Unknown enums:** 1 (`concentration='Parfum Cologne'`, nomenclatura propia de Roja Parfums)
- **Pending fields (celdas con el sentinel literal `pending`):** 273 de 900 (25 filas × 36 columnas) = 30.3%. Concentrado casi entero en `season`/`occasion`/`longevity`/`sillage`/`image_url`/`image_source`/`amazon_url`/`review_status` (pending por diseño, fuera de alcance de esta fase o del researcher) + `family` (6/25) + notas de pirámide (`top/heart/base_notes`, 3-4/25).

---

## CALIBRATION

Conteo por fila (`catalog/reports/batch-001-real-exceptions.csv`, 16 de 25 filas con algún hallazgo):

| Categoría | Conteo (filas) |
|---|---|
| A. DATA_ERROR | 0 |
| B. CONTRACT_MISMATCH | 2 |
| C. NORMALIZATION_GAP | 0 (ver nota) |
| D. IDENTITY_AMBIGUITY | 2 |
| E. SOURCE_CONFLICT | 2 |
| F. EXPECTED_PENDING | 9 |
| G. PIPELINE_BUG | 0 (ver nota) |
| H. CATALOG_BASELINE_ISSUE | 1 |

**Nota — por qué C y G están en 0 en la tabla por-fila:** los 5
PIPELINE_BUG y los 2 NORMALIZATION_GAP que este batch reveló no son
atribuibles a ninguna fila específica — son fallas/huecos del pipeline en
sí (`scripts/catalog/`), que afectaban a las 25 filas por igual y que se
corrigieron **en esta misma sesión**, antes de generar los reportes
finales. Se listan abajo para no esconder que existieron.

### Hallazgos de pipeline corregidos en esta sesión (no están en la tabla por-fila de arriba)

**G. PIPELINE_BUG (5, los 5 corregidos):**
1. `catalog.schema.json` tenía `additionalProperties: false` — bloqueaba
   las 25 filas por la columna `notes` (agregada por Cowork), contradiciendo
   el propio diseño documentado de Bloque A ("columnas inesperadas son
   warning, no error"). Corregido: `additionalProperties: true` + `notes`
   agregada formalmente al schema.
2. `top_notes`/`heart_notes`/`base_notes` estaban en `REQUIRED_FIELDS`
   pero sin `minItems: 1` en el schema — un array vacío pasaba en
   silencio. Corregido.
3. La heurística de capitalización (`titleCaseIfShouting`) recapitalizaba
   el sentinel `pending` a `Pending` en campos como `perfumer`/`country`,
   y rompía el acrónimo real `212 VIP` → `212 Vip`. Corregido: se eliminó
   la rama "todo mayúsculas" (sin evidencia de que sirviera para algo real
   en este batch, y con un caso real donde activamente rompía un dato
   correcto) y se excluyó el sentinel `pending` de la capitalización.
4. `diff.mjs` corría `validate.mjs` sobre el batch **crudo** antes de
   normalizar — un alias de concentración válido (`eau de parfum`) se
   hubiera rechazado por error de validación antes de que
   `normalize.mjs` tuviera oportunidad de resolverlo a `EDP`. Corregido:
   la validación que decide `REJECTED` corre sobre los datos ya
   normalizados.
5. La suite de tests (37 tests de Bloque A-D) tenía una condición de
   carrera real: `node --test` corre archivos de test en paralelo por
   defecto, y varios tests escriben a los mismos `catalog/reports/batch-*`
   reales simultáneamente — producía fallos intermitentes y no
   reproducibles. Corregido: `--test-concurrency=1`. (Un sexto bug del
   mismo origen — el script de limpieza post-test borraba por prefijo
   `startsWith("batch")`, que también matchea `batch-001-*` — se descubrió
   y corrigió DESPUÉS de escribir este resumen por primera vez, que el
   propio bug borró; ver `scripts/catalog/tests/cleanup-artifacts.mjs`.)

**B. CONTRACT_MISMATCH (9 hallazgos — 8 corregidos a nivel schema, 1 abierto):**

Corregidos (afectaban a las 25 filas, no son hallazgos "de una fila"):
1. `gender` — el schema asumía inglés (`male/female/unisex`); el batch
   real entrega español directo (`masculino/femenino/unisex`), igual que
   `genero` de Aromia. Corregido, ya no hace falta traducir.
2. `price_segment` — mismo patrón: asumido inglés, real en español
   (`económico/medio/premium/lujo`). Corregido.
3. `affiliate_status='no-applicable'` (25/25 filas) no estaba en el enum
   asumido. Agregado.
4. `visual_quality='not-audited'` (25/25 filas) no estaba en el enum
   asumido. Agregado.
5. `created_at`/`updated_at` exigían `format: date-time` (ISO completo);
   Cowork entrega fecha simple (`2026-08-07`). Relajado a aceptar ambos.
6. `concentration` era un enum cerrado; Roja Parfums usa `'Parfum
   Cologne'`, nomenclatura propia que no encaja en ningún estándar.
   Dejó de ser un enum cerrado (ahora solo genera un warning si no
   coincide con el set canónico conocido).
7. `image_url` estaba en `REQUIRED_FIELDS`, contradiciendo la regla del
   brief original de Fase 3 ("no generar imágenes en esta fase") — 25/25
   filas del batch real vienen con `image_url: pending` por diseño.
   Quitado de los campos obligatorios.
8. La columna `notes` no estaba prevista — Cowork la usa para
   trazabilidad crítica real (el reemplazo de Kayali, el conflicto de
   precio de Ani, ambigüedades de fecha). Agregada formalmente al schema.

Abierto, sin resolver (deliberadamente — no es un bug, es una decisión de
producto pendiente):
9. `vanilla-28-edp`: `source_url` trae **dos URLs en una sola celda**
   (`https://us.kayali.com/... ; https://www.fragrantica.com/...`),
   separadas por `;`. El schema exige una única URI — la fila queda
   `REJECTED` por esto. No se decidió (ni se implementó) si `source_url`
   debería aceptar una lista como los campos de notas, o si Cowork debería
   quedarse con una sola fuente primaria y mover la segunda a `notes`. Ver
   EXCEPTIONS abajo.

**C. NORMALIZATION_GAP (2, los 2 corregidos):**
1. El sentinel `pending` no estaba reconocido en absoluto — una fila con
   `family: pending` fallaba la validación exactamente igual que si
   estuviera vacía (correcto), pero un campo **opcional** en `pending`
   (ej. `subfamily`) también fallaba por no matchear ningún `enum` ni
   `format` (incorrecto — bloqueaba de más). Se agregó `isPendingSentinel()`
   en `lib.mjs`, aplicado en `parseRawRow` (con la excepción explícita de
   `review_status`, donde `'pending'` es un valor de enum legítimo, no un
   sentinel de dato faltante).
2. Lo mismo en `normalize.mjs` para campos de lista (`season`, etc.): una
   celda `pending` se interpretaba como una lista de un solo ítem
   `["pending"]` en vez de una lista vacía, generando 25 falsas alarmas de
   "valor fuera de `SEASON_ENUM`". Corregido.

---

## EXCEPTIONS REQUIRING HUMAN DECISION

Solo 4 de 25 filas requieren una decisión de Brey/Cowork (no alcanza con
más investigación — hace falta elegir):

### 1. `ani-extrait` (Nishane Ani, Extrait) — conflicto de precio grave

Selfridges reporta $100 USD, Luckyscent reporta $375 USD, ambos para
100ml del mismo producto. Cowork dejó `price_segment` explícitamente
`pending` en vez de elegir arbitrariamente — **confirmado: el pipeline no
lo resolvió automáticamente tampoco.** `price_segment` quedó `null` en el
CSV normalizado, la fila pasa como `NEW` en lo estructural (tiene todos
los campos obligatorios) pero no debería publicarse con un precio
adivinado.

**Decisión pendiente:** verificar precio directo en `nishane.com` antes
de aprobar esta fila para importación real (recomendación textual de
Cowork en `notes`).

### 2. `vanilla-28-edp` (Kayali Vanilla | 28) — reemplazo de producto + URL doble

El perfume originalmente asignado a este slot, **"Kayali Musk Rose 21"**,
no existe en el catálogo real de la marca (verificado por Cowork en
Fragrantica y `us.kayali.com`, sin resultados). Cowork lo reemplazó por
**"Vanilla | 28"**, producto real y verificado de la misma marca/segmento,
documentando el reemplazo íntegro en `notes`. Técnicamente, la fila queda
`REJECTED` por un motivo distinto: `source_url` trae dos URLs en una sola
celda.

**Decisión pendiente:** (a) confirmar que el reemplazo de producto es
aceptable — es una sustitución real de lo encargado originalmente, no una
corrección menor; (b) decidir cómo representar las dos fuentes
(`source_url` como lista vs. quedarse con una primaria).

### 3. `eros-parfum` (Versace Eros, Parfum) — posible variante ya existente

Coincide por marca+nombre con `eros` (EDT), ya publicado en el catálogo
actual. Cowork documentó que son productos distintos (Parfum, 2021 vs. el
EDT de 2012). El pipeline no puede verificar la concentración contra
`PERFUMES_INITIAL_50.csv` de forma confiable (ver limitación conocida en
`scripts/catalog/README.md`) y correctamente lo marca `CONFLICT` en vez
de asumir.

**Decisión pendiente:** confirmar que son productos distintos (Cowork ya
lo documentó; falta la confirmación humana antes de aprobar el import).

### 4. `terre-d-hermes-parfum` (Hermès Terre d'Hermès, Parfum) — mismo patrón que #3

Coincide con `terre-d-hermes-edt` ya publicado. Cowork documentó que son
productos distintos (Parfum 2009 vs. EDT 2006).

**Decisión pendiente:** igual que #3.

### Notas — no requieren decisión, solo quedan documentadas

- `naxos-edp` (rechazada por `family` pendiente, no por esto) tiene además
  un conflicto de fecha sin resolver del todo entre fuentes (2015 vs.
  2017) — Cowork ya priorizó una fuente designada, señalado para
  doble-chequeo futuro, no bloqueante.
- `shalimar-edp` tiene una ambigüedad de fecha (concepto 1925 vs.
  lanzamiento de esta concentración EDP en 1990) — Cowork ya usó el año
  correcto para la concentración específica, solo señalado.
- `interlude-woman-edp` es una confirmación positiva, no un problema: el
  pipeline correctamente NO la marcó como conflicto pese a compartir línea
  con `interlude-man` (ya existente) — los nombres no colisionan, el
  matching se comportó bien.

---

## Archivos generados

- `catalog/reports/batch-001-real-summary.md` — este archivo
- `catalog/reports/batch-001-real-validation.csv` — 25 filas, nivel + issues por fila
- `catalog/reports/batch-001-real-duplicates.csv` — 25 filas, decisión de deduplicación
- `catalog/reports/batch-001-real-exceptions.csv` — 16 filas con hallazgo, categoría A-H, `requires_human_decision`
- `catalog/reports/batch-001-real-normalization.csv` — 4 transformaciones reales aplicadas
- `catalog/staging/batch-001.import-proposal.csv` — 13 filas aprobables (NEW), staging, no importado
- `catalog/rejected/batch-001-rejected.csv` — 10 filas rechazadas, con motivo
- Reportes JSON completos (mismo detalle, formato máquina):
  `batch-001-diff.json`, `batch-001-validation.json` (crudo, informativo),
  `batch-001.normalized-validation.json` (autoritativo),
  `batch-001-normalize-trace.json`, `batch-001.normalized-duplicates.json`

**Import real: NO ejecutado.** `catalog/aromia-catalog-master.csv` sigue
con 0 filas — ninguna aprobación se aplicó, ni siquiera en modo
`--approved` (solo se corrió el pipeline hasta `prepare-import.mjs`, tal
como pide este brief).
