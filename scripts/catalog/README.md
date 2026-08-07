# Scripts del pipeline de catálogo — Aromia (Fase 3)

Paquete propio (`@aromia/catalog-scripts`), separado de `apps/web` y
`apps/api` a propósito — igual que `scripts/images/` (Fase 1), es tooling
de importación de datos, no código de producción. No infla el
`node_modules` que se buildea en los Dockerfile de esas dos apps.

**Ninguno de estos scripts escribe a Postgres.** No hay ningún cliente de
base de datos importado en este paquete — es una garantía estructural, no
solo un `if`. Ver `catalog/schemas/SCHEMA_COMPARISON.md` para el detalle
de qué falta para conectar esto a producción en una fase futura.

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
npm test                                 # 54 tests con node:test, sin dependencias externas
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
  `handoff/cowork/phase-3/batch-001.csv` (hash SHA-256 verificado, ver
  `catalog/reports/batch-001-real-summary.md`). Resultado: 13 NEW, 2
  CONFLICT, 10 REJECTED, 4 excepciones que requieren decisión humana. La
  revisión de este batch encontró y corrigió 5 bugs de pipeline y 8
  incompatibilidades de contrato reales — todo documentado en el summary
  y en `catalog/schemas/SCHEMA_COMPARISON.md`.

## Tests

```bash
npm test
```

54 tests con el test runner nativo de Node (`node:test`), sin Jest ni otras
dependencias de testing. `--test-concurrency=1` es obligatorio (no solo
una opción de estilo) — varios tests escriben a los directorios reales de
`catalog/`, y correrlos en paralelo produce fallos intermitentes no
reproducibles (bug real encontrado y corregido en F3.5).

Cubren: parseo de CSV mal formado, columnas faltantes/inesperadas, cada
regla de `VALIDACIÓN OBLIGATORIA` del brief de Fase 3, normalización
determinista (slugs, alias de concentración/price_segment, heurística de
capitalización), no-fusión de variantes de concentración, las 5
clasificaciones de `diff.mjs` (NEW/UNCHANGED/UPDATED/CONFLICT/REJECTED),
los guards de seguridad de `import.mjs`, el sentinel `pending` de Cowork
(`tests/real-batch-gaps.test.mjs`, agregado tras revisar el batch-001
real) y el propio script de limpieza de artefactos de test
(`tests/cleanup-artifacts.test.mjs`, agregado después de que un bug ahí
borrara los reportes reales de batch-001 en esta misma sesión).

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
  normalizado, con un ajuste para el caso en que `nombre` incluye la
  concentración como texto, ej. "Sauvage EDP") — no es una clave
  garantizada. Puede haber falsos negativos (no detecta una coincidencia
  real) tanto como falsos positivos (bloquea con CONFLICT algo que en
  realidad es distinto) — por diseño, ante la duda el pipeline prefiere
  marcar CONFLICT y pedir revisión humana antes que fusionar mal.
- **`longevity`/`sillage`/`price_segment` usan enums asumidos por Code**
  (no especificados en el brief) — ver
  `catalog/schemas/catalog.schema.json` (`notes.enums_asumidos`) y
  `catalog/schemas/SCHEMA_COMPARISON.md` #E. Revisar contra el batch-001
  real en cuanto Cowork lo entregue.
- **REPORTS_DIR/STAGING_DIR/REJECTED_DIR no son inyectables** — ver nota
  de tests arriba. No es un problema funcional hoy, pero si el pipeline
  crece conviene exponerlos vía opción/env var como se hizo con
  `masterCsvPath`/`currentCsvPath` en `diff.mjs`.
