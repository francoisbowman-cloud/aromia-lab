# Calibración de completitud de datos — F3.7B

**Fecha:** 2026-08-08
**Alcance:** solo lectura + reglas de pipeline. No se escribió a Postgres, no se importó nada, no se tocó `main`, no se modificaron los raw inputs (`batch-001.csv`, `batch-001-remediation.csv`, `batch-002.csv` siguen exactamente como llegaron).

---

## 1. Clasificación de los 30 REJECTED originales (9 Batch 001 + 21 Batch 002)

| Categoría | Conteo | Definición |
|---|---|---|
| **MODEL_REQUIREMENT_GAP** | **18** | El dato existía y era bueno — el schema exigía una estructura más rígida de la que la fuente ofrecía (`family` individualmente requerido, o pirámide top/middle/base completa exigida cuando la fuente solo publica una lista plana o parcial). |
| **SOURCE_DOES_NOT_PUBLISH** | **10** | Confirmado en la fuente permitida (oficial y/o Fragrantica) que la marca no publica una pirámide con niveles para ese producto — es un hecho de la fuente, no una falla de investigación. |
| **REAL_RESEARCH_GAP** | **2** | El dato probablemente existe pero no fue suficientemente investigado/verificado en la pasada disponible. |

Detalle fila por fila: `catalog/reports/f37b-rejection-classification.csv`.

**Los 18 `MODEL_REQUIREMENT_GAP` se resolvieron automáticamente** al implementar las reglas 2 y 3 del brief (family opcional + estructura de notas PYRAMID/FLAT/PARTIAL/UNKNOWN) — cero acción de Cowork necesaria, cero reenvío.

Los 10 `SOURCE_DOES_NOT_PUBLISH` también dejaron de bloquear (estructura FLAT, ahora válida) — tampoco necesitan reenvío, el dato ya está tan completo como puede estarlo.

De los 2 `REAL_RESEARCH_GAP`:
- **`armani-code-parfum`** (Batch 001) — ya remediado por Cowork en la pasada de F3.7 (family + pirámide completados vía Fragrantica). Resuelto, no requiere nada más.
- **`boss-bottled-edt`** (Batch 002) — ya NO bloquea (estructura FLAT es válida), pero Cowork señaló explícitamente en su propio `notes` que "requiere segunda pasada dedicada" (conflicto entre dos fuentes secundarias sobre la pirámide, no confirmación de no-publicación). Es el único caso genuino que vale la pena reenviar — como mejora opcional, no como bloqueante.

---

## 2. Reglas generales implementadas

### Regla 2 — Estructura de notas (`lib.mjs#classifyNoteStructure`)

```
PYRAMID  — top + middle + base, los 3 con contenido
FLAT     — accords con contenido, ningún nivel de la pirámide
PARTIAL  — 1 o 2 de los 3 niveles
UNKNOWN  — nada de nada (bloquea — único caso que genera error)
```

`top_notes`/`middle_notes`/`base_notes` ya no tienen `minItems: 1`
individual en `catalog.schema.json`. La validación real es compuesta en
`validate.mjs`: error `no_notes_information` solo si `classifyNoteStructure`
devuelve `UNKNOWN`. Nunca se infiere una pirámide a partir de `accords` —
no se inventa top/middle/base que la fuente no publicó.

Regresión (no lógica operacional): `santal-33-edp` y `side-effect-edp` —
ver `tests/f37b-completeness-rules.test.mjs`, corridas contra el
`batch-001.csv` real.

### Regla 3 — `family` opcional (`catalog.schema.json`)

`family` salió del array `required`. Jerarquía de fuente esperada (guía,
no forzada por el schema): 1) sitio oficial de marca, 2) fuente secundaria
especializada de confianza, 3) pending. Si `family` es el único campo
factual pendiente y el resto de campos críticos está sano,
`quality_status` puede ser `CATALOG_READY_WITH_PENDING`. Nunca se inventa.

### Regla 4 — Dos métricas de automatización (`lib.mjs#computeYields`)

```
DECISION_AUTOMATION_YIELD = (total − REVIEW_REQUIRED) / total
DATA_COMPLETION_YIELD     = (CATALOG_READY + CATALOG_READY_WITH_PENDING) / total
```

Nunca se combinan en un solo número. `REJECTED` cuenta como "no requiere
decisión" (no es ambigüedad) pero nunca cuenta como "completo".

### Regla 5 — `price_status` (`lib.mjs#derivePriceStatus`)

Campo nuevo, opcional, agregado a `catalog.schema.json`
(`verified`/`unverified`/`source_conflict`/`not_applicable`). Derivado
determinísticamente de `price_segment` — `verified` si tiene valor real,
`unverified` si no. **Nunca se infiere leyendo `notes`** (instrucción
explícita del brief) — `source_conflict`/`not_applicable` solo se asignan
si Cowork los entrega explícitos en una columna propia en un batch futuro.

Cambio mínimo compatible: no se tocó Postgres, no se migró nada — es un
campo derivado en el pipeline, calculado en `normalize.mjs` y comparado
de forma consistente en `diff.mjs` (incluyendo filas del maestro
escritas antes de que este campo existiera, para no generar diffs
falsos).

---

## 3. Recálculo — Batch 001, Batch 001 remediation, Batch 002

**Mismos raw inputs, sin modificar.** Solo cambió el pipeline.

| Lote | Filas | CATALOG_READY | CATALOG_READY_WITH_PENDING | REVIEW_REQUIRED | REJECTED | Decision Automation Yield | Data Completion Yield |
|---|---|---|---|---|---|---|---|
| Batch 001 (raw original) | 25 | 0 | 24 | 0 | 1 | **100.0%** | **96.0%** |
| Batch 001 + remediación | 25 | 0 | 25 | 0 | 0 | **100.0%** | **100.0%** |
| Batch 002 | 50 | 0 | 50 | 0 | 0 | **100.0%** | **100.0%** |

Comparación contra el estado post-F3.6 (antes de esta calibración):

| Lote | REJECTED antes | REJECTED ahora |
|---|---|---|
| Batch 001 (raw) | 9 | **1** |
| Batch 001 + remediación | 2 | **0** |
| Batch 002 | 21 | **0** |

La única fila que sigue `REJECTED` en el batch-001 crudo
(`armani-code-parfum`) ya está resuelta en la versión remediada — el
estado final relevante para producción es **0 REJECTED en los 75
registros de ambos lotes**.

`CATALOG_READY` da 0 en los tres lotes porque `season`/`occasion`/
`longevity`/`sillage` siguen 90%+ pending en ambos lotes (enrichment, no
bloqueante) — casi ninguna fila está 100% completa en TODOS los campos
opcionales, aunque sí en todos los críticos. Esto es esperado, no un
problema.

---

## 4. `price_segment` — evidencia acumulada (decisión 8 del F3.7 anterior, resuelta acá)

| Lote | `price_segment` pending |
|---|---|
| Batch 001 | 5/25 (20%) |
| Batch 002 | 29/50 (58%) |

Recurrente y creciente, confirmado con dos lotes — por eso se implementó
`price_status` (regla 5) esta vez, en vez de solo recomendarlo. Con datos
actuales, la distribución de `price_status` derivado es:

| Lote | verified | unverified |
|---|---|---|
| Batch 001 | 20 | 5 |
| Batch 002 | 21 | 29 |

`source_conflict`/`not_applicable`: 0 en ambos lotes (nadie los entregó
explícitos todavía — se derivan solo cuando Cowork los provea en una
columna propia).

---

## 5. Cowork remediation queue

`catalog/reports/cowork-remediation-queue.csv` — **1 fila**, marcada
explícitamente `optional-not-blocking`:

| Batch | Slug | Motivo |
|---|---|---|
| batch-002 | `boss-bottled-edt` | Conflicto entre dos fuentes secundarias sobre la pirámide de notas — Cowork mismo pidió una segunda pasada dedicada. No bloquea (ya es `CATALOG_READY_WITH_PENDING`), es una mejora de confianza de dato, no un requisito. |

**No se envían** los 18 `MODEL_REQUIREMENT_GAP` ni los 10
`SOURCE_DOES_NOT_PUBLISH` — cumplen exactamente el objetivo de la
decisión 7 ("reducir investigación redundante"): son casos donde no hay
nada más que Cowork pueda investigar (el schema estaba mal calibrado, o
la fuente ya confirmó que no existe el dato).

---

## 6. Bugs reales encontrados en esta pasada

1. `diff.mjs#loadMasterIndex` comparaba `price_status` (derivado) de una
   fila del batch contra una fila del maestro que no lo tenía —
   generaba un `UPDATED` falso en cada fila. Corregido: se deriva el
   mismo campo también al cargar el maestro, antes de comparar.
2. `derivePriceStatus` recibía el string literal `'pending'` (no
   convertido a `null` todavía en ese punto del pipeline) y lo trataba
   como un valor real (`'verified'`) por ser un string no-vacío.
   Corregido en `normalize.mjs` y `diff.mjs`: se normaliza el sentinel
   `pending` a `null` antes de derivar.

Ambos cubiertos con tests de regresión en
`tests/f37b-completeness-rules.test.mjs`.

---

## 7. Gate — requisitos para GO-100

| Requisito | Resultado |
|---|---|
| 0 bugs severos | ✅ — los 2 bugs de esta sesión están corregidos y cubiertos con tests |
| 0 contract mismatch sistemático | ✅ — el único sistemático (rigidez de `family`/pirámide) se resolvió con las reglas 2+3 |
| 0 deduplicación destructiva | ✅ — 0 en los tres lotes, confirmado en F3.5/F3.6/F3.7 |
| Decision Automation Yield ≥ 95% | ✅ — 100.0% en Batch 002 |
| Human Review ≤ 5% | ✅ — 0% en Batch 002 (0 `REVIEW_REQUIRED`) |
| REJECTED restantes explicables por datos realmente insuficientes | ✅ — 0 `REJECTED` en Batch 002; el único de Batch 001 (`armani-code-parfum`) ya está remediado |

**Los 6 requisitos se cumplen.**

---

## Archivos generados/actualizados

- `catalog/reports/f37b-completeness-calibration-summary.md` — este archivo
- `catalog/reports/f37b-rejection-classification.csv` — 30 filas clasificadas
- `catalog/reports/cowork-remediation-queue.csv` — 1 fila, opcional
- `catalog/reports/batch-001-diff.json`, `batch-001-summary.md` — recalculados
- `catalog/reports/batch-001-remediated-diff.json`, `batch-001-remediated-summary.md` — recalculados
- `catalog/reports/batch-002-diff.json`, `batch-002-summary.md` — recalculados
- `catalog/reports/batch-002-real-{validation,duplicates,normalization,exceptions}.csv` — regenerados (exceptions bajó de 45 a 1 hallazgo)
- `catalog/staging/*.import-proposal.csv`, `catalog/rejected/*-rejected.csv` — regenerados con los nuevos conteos

**Import real: no ejecutado.** `catalog/aromia-catalog-master.csv` sigue en 0 filas.

---

## Recomendación final: **GO-100**

El pipeline pasa los 6 requisitos del gate con margen (100% vs. el
mínimo de 95%, 0% vs. el máximo de 5%). La causa raíz del `CALIBRATE`
anterior no era investigación insuficiente de Cowork ni un problema de
datos — era un schema más rígido de lo que la realidad de la industria
permite (no todas las marcas publican una pirámide de notas por niveles,
y `family` no debería ser un bloqueante duro). Corregido eso, **97%
(29/30) de los rechazos originales se resuelven solos**, sin que Cowork
tenga que volver a investigar nada.

Cowork puede iniciar el siguiente lote (100 fragancias) con el pipeline
actual. La única pieza opcional pendiente (`boss-bottled-edt`) no
bloquea nada y puede resolverse en paralelo, sin prioridad.
