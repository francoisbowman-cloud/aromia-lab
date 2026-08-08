# Scripts del pipeline de catálogo — Aromia (Fase 3)

Paquete propio (`@aromia/catalog-scripts`), separado de `apps/web` y
`apps/api` a propósito — igual que `scripts/images/` (Fase 1), es tooling
de importación de datos, no código de producción. No infla el
`node_modules` que se buildea en los Dockerfile de esas dos apps.

**Ninguno de estos scripts escribe a Postgres.** No hay ningún cliente de
base de datos importado en este paquete — es una garantía estructural, no
solo un `if`. Ver `catalog/schemas/SCHEMA_COMPARISON.md` para el detalle
de qué falta para conectar esto a producción en una fase futura.

**Nombre de campo (F3.7):** el campo canónico es `middle_notes` (nombre
de contrato vigente). `heart_notes` (nombre de `batch-001.csv` y del
schema original) se acepta como alias legacy de INGESTA — cualquier CSV
que traiga esa columna se renombra automáticamente al leerlo
(`lib.mjs#applyLegacyColumnAliases`, aplicado dentro de `readCsv`), sin
tocar el archivo original.

`apply-remediation.mjs` (F3.7) integra un CSV de remediación de campos
(entregado por Cowork tras un batch con filas `REJECTED`) contra el
batch original, produciendo un CSV derivado con los parches aplicados.
Es una herramienta de integración de un entregable puntual — no participa
de `validate`/`normalize`/`diff`.

## Instalación

```bash
cd scripts/catalog
npm install
```

## Flujo completo

```
batch crudo (catalog/imports/batch-XXX.csv)
  → validate.mjs      (validación informativa sobre el crudo)
  → normalize.mjs      (trim, capitalización heurística, alias de concentración, slug, etc.)
  → validate.mjs        (validación autoritativa sobre lo YA normalizado — esta decide REJECTED)
  → deduplicate.mjs      (duplicados exactos, conflictos de duplicado dentro del batch)
  → diff.mjs               (compara contra catalog/aromia-catalog-master.csv y el catálogo actual de Aromia)
  → prepare-import.mjs      (propuesta de importación + reportes de revisión por excepciones)
  → import.mjs                (bloqueado por defecto — fusiona al master LOCAL solo con --approved)
```

`diff.mjs` y `prepare-import.mjs` orquestan internamente todos los pasos
anteriores — alcanza con darles el batch crudo.

## Dos dimensiones de clasificación (F3.6)

Cada fila del diff se clasifica en **dos ejes independientes**, no uno solo:

- **`catalog_relation`** — identidad: `NEW` (no existe en ningún lado) |
  `EXISTING` (ya está en `catalog/aromia-catalog-master.csv`) |
  `RELATED_VARIANT` (misma marca + mismo nombre base, concentración
  distinta o no verificable — ej. Sauvage EDT vs. EDP) |
  `POSSIBLE_DUPLICATE` (misma marca+nombre+concentración confirmada, o
  colisión de slug — necesita revisión humana).
- **`quality_status`** — ¿está lista para publicarse? `CATALOG_READY` (sin
  ningún campo pendiente) | `CATALOG_READY_WITH_PENDING` (aprobable, pero
  con algún campo opcional/enrichment sin completar) | `REVIEW_REQUIRED`
  (necesita una decisión humana — `POSSIBLE_DUPLICATE`, o el batch intenta
  pisar un `image_url` ya presente en el maestro) | `REJECTED` (campos
  críticos genuinamente inválidos o faltantes — nunca por un enum abierto,
  un campo enrichment pending, o tener más de una fuente).

`status` (`NEW`/`UNCHANGED`/`UPDATED`/`CONFLICT`/`REJECTED`) se conserva
como valor **derivado** de ambas dimensiones — es lo que siguen leyendo
`prepare-import.mjs`/`import.mjs` para decidir aprobación, no hizo falta
reescribirlos. Ver `diff.mjs#deriveLegacyStatus`.

`lib.mjs#ENRICHMENT_FIELDS` (`season`/`occasion`/`longevity`/`sillage`)
nunca bajan de `CATALOG_READY_WITH_PENDING` ni fuerzan revisión por sí
solos — se mantienen en el schema, no se eliminan, pero no bloquean.

## Comandos

Desde `scripts/catalog/`:

```bash
npm run validate       -- <csv>          # validate.mjs
npm run normalize      -- <csv>          # normalize.mjs
npm run dedupe         -- <csv-normalizado>
npm run diff           -- <csv-crudo>    # corre validate+normalize+dedupe+diff
npm run prepare-import -- <csv-crudo>    # corre todo + escribe la propuesta y el resumen
npm run import         -- --approved [--dry-run] [proposal.csv]
npm run calibrate      -- <csv-crudo>    # auditoría de calibración (CSVs de revisión humana), ver abajo
npm test                                 # 77 tests con node:test, sin dependencias externas
```

O desde la raíz del repo (mismo comportamiento, paths relativos a la raíz):

```bash
npm run catalog:validate -- catalog/imports/batch-001.csv
npm run catalog:diff -- catalog/imports/batch-001.csv
npm run catalog:prepare -- catalog/imports/batch-001.csv
npm run catalog:import -- --dry-run
npm run catalog:test
```

## Qué genera cada paso

| Script | Salida |
|---|---|
| `validate.mjs` | `catalog/reports/{batch}-validation.json` |
| `normalize.mjs` | `catalog/staging/{batch}.normalized.csv` + `catalog/reports/{batch}-normalize-trace.json` |
| `deduplicate.mjs` | `catalog/reports/{batch}-duplicates.json` |
| `diff.mjs` | `catalog/reports/{batch}-diff.json` (+ re-genera los tres anteriores sobre `{batch}.normalized`) |
| `prepare-import.mjs` | `catalog/staging/{batch}.import-proposal.csv`, `catalog/rejected/{batch}-rejected.csv`, `catalog/reports/{batch}-summary.md` |
| `import.mjs --approved` (sin `--dry-run`) | Fusiona la propuesta dentro de `catalog/aromia-catalog-master.csv` (upsert por `brand+name+concentration`). Nunca toca Postgres. |
| `calibrate.mjs` | `catalog/reports/{batch}-real-{validation,duplicates,normalization,exceptions}.csv` — capa de reporte adicional para revisión humana en CSV, pensada para el primer piloto real de cada volumen (ver más abajo). No reemplaza a `prepare-import.mjs`, se corre además. |

## Ejemplo de salida real

- `catalog/imports/_fixture-pilot.csv` — lote **sintético** de 6 filas
  escrito por Code (no es un batch de Cowork), usado para demostrar el
  pipeline end-to-end antes de tener datos reales. Reportes en
  `catalog/reports/_fixture-pilot-*`.
- `catalog/imports/batch-001.csv` — el piloto **real** de 25 fragancias
  entregado por Cowork (F3.5, 2026-08-07), copiado íntegro desde
  `handoff/cowork/phase-3/batch-001.csv` (hash SHA-256 verificado, sin
  modificar en ningún momento — ver `catalog/reports/batch-001-real-summary.md`).
  Corrido dos veces contra las mismas 25 filas: F3.5 encontró y corrigió 5
  bugs de pipeline y 8 incompatibilidades de contrato, dejando 4
  excepciones que necesitaban una decisión de Brey (conflicto de precio,
  reemplazo de producto, dos posibles variantes). F3.6 aplicó esas
  decisiones como reglas generales (no como excepciones de fila) —
  resultado final: 16 `NEW`-equivalente aprobables, 9 `REJECTED`
  (genuinamente incompletos en campos críticos), **0** excepciones que
  requieran una decisión humana. Comparación BEFORE/AFTER completa en el
  summary.
- **F3.7** — Cowork entregó una remediación dirigida sobre las 9 filas
  `REJECTED` de Batch 001 (`apply-remediation.mjs` la integra, ver
  `catalog/reports/batch-001-remediation-summary.md`): 7/9 rescatadas.
  También llegó Batch 002 real (50 filas, `catalog/imports/batch-002.csv`,
  ya con `middle_notes` como nombre de columna) — procesado con el mismo
  pipeline sin ningún ajuste nuevo: 29 aprobables, 21 `REJECTED` (mismo
  patrón de campos críticos pending, sin datos objetivamente incorrectos).
  Ver `catalog/reports/batch-002-real-summary.md`.

## Tests

```bash
npm test
```

77 tests con el test runner nativo de Node (`node:test`), sin Jest ni otras
dependencias de testing. `--test-concurrency=1` es obligatorio (no solo
una opción de estilo) — varios tests escriben a los directorios reales de
`catalog/`, y correrlos en paralelo produce fallos intermitentes no
reproducibles (bug real encontrado y corregido en F3.5).

Cubren: parseo de CSV mal formado, columnas faltantes/inesperadas, cada
regla de `VALIDACIÓN OBLIGATORIA` del brief de Fase 3, normalización
determinista (slugs, alias de concentración/price_segment, heurística de
capitalización), no-fusión de variantes de concentración, las
clasificaciones de `diff.mjs` (legacy `status` + `catalog_relation` +
`quality_status`), los guards de seguridad de `import.mjs`, el sentinel
`pending` de Cowork (`tests/real-batch-gaps.test.mjs`), el propio script
de limpieza de artefactos de test (`tests/cleanup-artifacts.test.mjs`,
agregado después de que un bug ahí borrara los reportes reales de
batch-001 en la sesión de F3.5) y las reglas generales de calibración de
F3.6 — `source_url` como colección, `ENRICHMENT_FIELDS` no bloqueantes,
`RELATED_VARIANT` vs. `POSSIBLE_DUPLICATE` por concentración
(`tests/f36-calibration-rules.test.mjs`, incluye regresión contra el
batch-001 real para los casos de Ani/Vanilla/Eros/Terre d'Hermès **sin**
que la implementación dependa de esos slugs).

`npm test` corre un `posttest` (`tests/cleanup-artifacts.mjs`) que borra
los artefactos que los tests generan en los directorios reales de
`catalog/` (los tests no pueden usar directorios temporales para su
salida porque `REPORTS_DIR`/`STAGING_DIR`/`REJECTED_DIR` son constantes
fijas, no inyectables) — nunca toca archivos de un batch real ni del
fixture piloto, solo los que sus propios fixtures inline generan (siempre
con nombre `batch*`).

## Limitaciones conocidas (a resolver en un bloque futuro, no en Fase 3 Bloque A-D)

- **No hay conexión a Postgres.** `diff.mjs` compara contra
  `PERFUMES_INITIAL_50.csv` como proxy local del catálogo ya publicado —
  no contra la base real de producción. Si el catálogo real diverge de
  ese CSV (por ediciones hechas directo en `/admin`), el diff no lo va a
  ver. Ver `lib.mjs#CURRENT_AROMIA_CSV`.
- **El matching contra el catálogo actual es heurístico** (marca+nombre
  base, con extracción de concentración embebida en `nombre` cuando existe
  — ver `lib.mjs#extractConcentrationFromName` y SCHEMA_COMPARISON.md #M)
  — no es una clave garantizada. Cuando el catálogo actual no menciona la
  concentración en absoluto (ej. "Eros" sin sufijo), el pipeline no puede
  confirmar si es la misma variante — por diseño, ante esa duda específica
  prefiere `RELATED_VARIANT` (aprobar) antes que bloquear de más; solo
  bloquea (`POSSIBLE_DUPLICATE`) cuando hay evidencia positiva de que la
  concentración coincide.
- **`longevity`/`sillage` siguen usando enums asumidos por Code**, sin
  confirmar contra un valor real (25/25 filas del batch-001 llegaron
  `pending` en ambos) — ver `catalog/schemas/catalog.schema.json`
  (`notes.enums_asumidos_confirmados_2026-08-07`). `price_segment` y
  `gender` sí quedaron confirmados y corregidos (español, no inglés).
- **El proxy de "conflicto de fuente sin resolver" (`price_segment`
  pending) no distingue "hay conflicto real entre fuentes" de "no se
  encontró ninguna fuente confiable"** — decisión deliberada de no
  construir un detector basado en texto libre de `notes` (frágil,
  contradice "rules > per-row exceptions"). Ver SCHEMA_COMPARISON.md,
  nota sobre categoría E en `calibrate.mjs`.
- **REPORTS_DIR/STAGING_DIR/REJECTED_DIR no son inyectables** — ver nota
  de tests arriba. No es un problema funcional hoy, pero si el pipeline
  crece conviene exponerlos vía opción/env var como se hizo con
  `masterCsvPath`/`currentCsvPath` en `diff.mjs`.
