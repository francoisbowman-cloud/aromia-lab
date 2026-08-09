# Auditoría de calibración — batch-001 REAL (Fase 3.6, post-calibración)

**Fecha:** 2026-08-07
**Fuente:** `handoff/cowork/phase-3/batch-001.csv` (entregado por Cowork) — **sin modificar**, mismo archivo, mismo hash que en F3.5.
**Copia de trabajo:** `catalog/imports/batch-001.csv` (sin tocar)
**Qué cambió:** no las 25 filas — el pipeline. F3.6 aplicó las decisiones de dirección de Brey sobre los hallazgos de F3.5: reglas generales en vez de excepciones por slug, dos dimensiones de clasificación separadas (`catalog_relation` / `quality_status`), `source_url` como colección estructurada, y una regla general de variante-vs-duplicado por concentración.
**Alcance:** solo lectura. No se escribió a Postgres, no se importó nada, no se tocó `main`.

---

## BEFORE (F3.5) vs AFTER (F3.6) — mismas 25 filas, pipeline recalibrado

| Métrica | BEFORE (F3.5) | AFTER (F3.6) |
|---|---|---|
| catalog ready (sin ningún campo pendiente) | — *(dimensión no existía)* | 0 |
| catalog ready with pending | — | 16 |
| review required | — | 0 |
| rejected | 10 | 9 |
| new (relación) | — | 23 |
| existing (relación) | — | 0 |
| related variant | — | 2 (`eros-parfum`, `terre-d-hermes-parfum`) |
| possible duplicate | — | 0 |
| **legacy `status`: NEW** | 13 | 16 |
| **legacy `status`: CONFLICT** | 2 | 0 |
| **legacy `status`: REJECTED** | 10 | 9 |
| Excepciones que requieren decisión humana | 4 | **0** |
| Filas con `price_segment` pending (proxy de posible conflicto de fuente sin resolver) | 5 | 5 *(sin cambio — el precio de Ani sigue sin resolverse, por decisión explícita)* |
| Contract mismatches abiertos (sin corregir) | 1 (`source_url` de una sola URL) | 0 |
| Pipeline bugs abiertos (sin corregir) | 0 | 0 |

**Lectura:** las mismas 25 filas de Cowork no cambiaron en absoluto. Lo que
cambió es que el pipeline dejó de tratar como "excepción que necesita tu
decisión" cosas que en realidad eran reglas mal calibradas — no una fila
puntual arreglada, sino una regla corregida que resuelve la clase entera
de problema. Las 4 decisiones que SÍ eran genuinamente tuyas (Ani, Vanilla,
Eros, Terre d'Hermès) ya las tomaste — el pipeline las aplica ahora sin
volver a preguntar.

Los 9 `REJECTED` restantes NO son ambigüedad ni decisión pendiente — son
15 celdas con datos genuinamente incompletos en campos críticos (6× `family`
pending, 9× notas de pirámide olfativa pending, repartidas en 9 filas) que
Cowork dejó a propósito sin inventar. Eso necesita una segunda pasada de
investigación, no una decisión de Brey — ver `catalog/reports/batch-001-real-exceptions.csv`
(todas con `requires_human_decision=false`).

---

## Qué reglas generales reemplazaron qué decisiones puntuales

| Decisión de Brey (caso concreto) | Regla general implementada |
|---|---|
| Ani: precio pending no bloquea | `price_segment` es opcional; cualquier campo no-crítico pending → `CATALOG_READY_WITH_PENDING`, nunca `REJECTED` ni excepción forzada por sí solo. Aplica a los 33 campos opcionales del schema, no solo a `price_segment`. |
| Vanilla: dos URLs no es error | `source_url` es una colección (`LIST_FIELDS`), igual que `top_notes`/`season` — separada por `;`, cada URL se valida individualmente. Aplica a cualquier fila con N fuentes, no solo a `vanilla-28-edp`. |
| Eros / Terre d'Hermès: variante aprobada | `extractConcentrationFromName()` (lib.mjs) + regla en `diff.mjs`: mismo brand + mismo nombre-base + concentración distinta o no verificable en el catálogo actual → `RELATED_VARIANT` (aprobado). Mismo brand+nombre+concentración SÍ confirmada → `POSSIBLE_DUPLICATE` (revisión). Aplica a cualquier marca/producto, tolera que el catálogo legacy tenga o no la concentración embebida en `nombre`. |
| Enrichment fields no bloquean | `ENRICHMENT_FIELDS = [season, occasion, longevity, sillage]` (lib.mjs) — explícitamente excluidos de forzar `REVIEW_REQUIRED`/`REJECTED`. Se mantienen en el schema. |
| REJECTED solo por campos genuinamente críticos | `quality_status=REJECTED` deriva únicamente de errores de validación en campos `REQUIRED_FIELDS` no resueltos por alias/sentinel — nunca por enum abierto, enrichment pending, o múltiples fuentes. |
| Sin `KNOWN_FINDINGS` manual | `calibrate.mjs` reescrito: la categoría A-H de cada hallazgo se deriva de `quality_status`/`catalog_relation`/código de issue de validación — cero lookups por slug. Los casos de Ani/Vanilla/Eros/Terre d'Hermès quedan como tests de regresión (`tests/f36-calibration-rules.test.mjs`), no como lógica operacional. |

Ver `catalog/schemas/SCHEMA_COMPARISON.md` (secciones nuevas #K, #L) para el
detalle técnico de cada regla.

---

## CALIBRATION (F3.6, categorías A-H recalculadas con las reglas nuevas)

| Categoría | Conteo (hallazgos, no filas — una fila con 3 campos pending genera 3 hallazgos) |
|---|---|
| A. DATA_ERROR | 0 |
| B. CONTRACT_MISMATCH | 1 (`elysium-pour-homme-parfum-cologne`, concentración no estándar — informativo, no bloqueante) |
| C. NORMALIZATION_GAP | 0 |
| D. IDENTITY_AMBIGUITY | 0 *(antes: 2 — Eros y Terre d'Hermès ya no son ambigüedad, son `RELATED_VARIANT` confirmado por regla)* |
| E. SOURCE_CONFLICT | 0 en la tabla estructural *(el conflicto de precio de Ani sigue existiendo — ver nota)* |
| F. EXPECTED_PENDING | 16 (9 filas, 16 campos críticos individuales pending) |
| G. PIPELINE_BUG | 0 |
| H. CATALOG_BASELINE_ISSUE | 0 |

**Nota sobre E (SOURCE_CONFLICT):** por decisión explícita de Brey, no se
construyó un detector automático de "conflicto de precio" a partir de texto
libre en `notes` (sería frágil y específico, lo opuesto a "rules > per-row
exceptions"). El proxy estructural disponible es "filas con `price_segment`
pending" (5 de 25) — no distingue entre "hay conflicto real entre fuentes"
y "no se encontró ninguna fuente confiable". Es una limitación conocida y
aceptada, no un bug.

---

## Archivos generados/actualizados en esta pasada

- `catalog/reports/batch-001-real-summary.md` — este archivo (reemplaza la versión F3.5)
- `catalog/reports/batch-001-real-validation.csv`, `-duplicates.csv`, `-normalization.csv`, `-exceptions.csv` — regenerados con las reglas nuevas
- `catalog/staging/batch-001.import-proposal.csv` — 16 filas aprobables (antes 13), incluye `catalog_relation`/`quality_status` como columnas nuevas
- `catalog/rejected/batch-001-rejected.csv` — 9 filas (antes 10), mismas columnas nuevas
- `catalog/reports/batch-001-diff.json` — incluye `catalogRelationCounts`/`qualityStatusCounts` además de `counts` (legacy)

**Import real: sigue sin ejecutarse.** `catalog/aromia-catalog-master.csv`
continúa con 0 filas — F3.6 tampoco corrió `import.mjs --approved`.

---

## Historial — hallazgos originales de F3.5 (antes de esta calibración)

*(Sección conservada para trazabilidad — describe el estado ANTES de que
Brey tomara las 6 decisiones de dirección de F3.6. Los bugs de pipeline y
contract mismatches acá listados ya están corregidos; se mantienen como
registro de qué se encontró y por qué.)*

### G. PIPELINE_BUG (5, los 5 corregidos en F3.5)
1. `additionalProperties: false` bloqueaba la columna `notes` real.
2. `top_notes`/`heart_notes`/`base_notes` sin `minItems: 1` dejaban pasar arrays vacíos.
3. La heurística de capitalización recapitalizaba `pending` → `Pending` y rompía `212 VIP` → `212 Vip`.
4. `diff.mjs` validaba el batch crudo antes de normalizar, rechazando alias válidos.
5. Race condition en la suite de tests (paralelismo escribiendo a los mismos archivos reales) + bug del propio script de limpieza (`startsWith("batch")` borraba `batch-001-*`).

### B. CONTRACT_MISMATCH (9 hallazgos — 8 corregidos en F3.5, 1 corregido en F3.6)
1-8. `gender`/`price_segment` en español no inglés, `affiliate_status='no-applicable'`, `visual_quality='not-audited'`, formato de fecha simple, `concentration` como enum cerrado, `image_url` mal marcado requerido, columna `notes` no prevista — todos corregidos en F3.5.
9. `source_url` con dos URLs en una celda (`vanilla-28-edp`) — quedó **abierto** al cierre de F3.5, **corregido en F3.6** de forma general (`source_url` ahora es una colección, no una excepción de una fila).

### Casos documentados por Cowork, ahora resueltos por regla general (antes: 4 excepciones humanas)
- **`ani-extrait`** (conflicto de precio Nishane, $100 vs $375) — Brey confirmó: no bloquea, no se resuelve automáticamente. `price_segment` sigue `null`.
- **`vanilla-28-edp`** (reemplazo de Kayali Musk Rose 21 → Vanilla|28) — Brey aprobó el reemplazo; el bloqueo técnico (URL doble) se resolvió con la regla general de `source_url`.
- **`eros-parfum`** / **`terre-d-hermes-parfum`** — Brey confirmó: variantes de concentración distinta se aprueban como entidades independientes; la regla general de `extractConcentrationFromName()` ahora lo resuelve sin listar marcas.
