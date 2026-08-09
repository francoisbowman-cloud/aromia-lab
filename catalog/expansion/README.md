# Aromia — Expansion Automation v1

Base contractual: GO-100 (`274311d`). Esta capa expande el catálogo sin escribir en Postgres, sin importar al master y sin mutar Batch 001/002 ni el baseline publicado.

## Pipeline

1. **Gap Analyzer** — mide cobertura real del universo procesado (marcas, gender, family y concentration) y genera `gap-report.json`.
2. **Candidate pool** — pool semilla sobredimensionado (130 identidades) dividido por estratos.
3. **Identity resolver** — normaliza marca, nombre y concentración; compara contra `PERFUMES_INITIAL_50.csv`, Batch 001, Batch 002 y master.
4. **Gap-aware selector** — combina prioridad, relación, disponibilidad de dominio oficial y bonus por marca ausente/subrepresentada; intenta producir 100 identidades únicas.
5. **Source discovery queue** — crea consultas y dominio oficial preferido por candidato; el dominio semilla NO cuenta como provenance verificado.
6. **Structured evidence adapter** — `expansion-enrich.mjs` consume `evidence.csv` y prepara campos estructurados.
7. **Provenance** — ninguna fila puede ser `AUTO_READY` sin al menos un `source_url`.
8. **Normalization / relation** — concentración normalizada; `NEW` / `RELATED_VARIANT` se conserva sin dedup destructiva.
9. **Explainable confidence** — dimensiones separadas: identidad, fuente, notas, metadata y relación; conserva razones y penalizaciones.
10. **Quality gates** — `AUTO_READY`, `REVIEW_REQUIRED`, `BLOCKED`.
11. **Batch Builder** — solo `AUTO_READY` entra a `batch-003-prepared.csv`, con `candidate_id` como ID de trazabilidad de batch (no PK de Postgres) y `status=draft`.
12. **GO/NO-GO** — evalúa 100 filas, >=90% auto-preparation, <=10% Human Review Burden, <=3% blocked, cero dedup destructiva, cero MODEL_REQUIREMENT_GAP y cero escrituras Postgres.

## Estratos de Batch 003

Objetivo de selección v1:

- mainstream: 35
- variant_risk: 25
- niche: 20
- nonstandard_notes: 10
- hard_case: 10

El pool contiene 130 candidatos para absorber duplicados contra el universo ya procesado. Si un estrato no alcanza su cuota, el selector completa con los candidatos elegibles restantes.

## Estados

### AUTO_READY

Solo para una fila enriquecida con provenance, relación no ambigua, metadata crítica (`brand`, `name`, `concentration`, `gender`), notas resueltas y `overall_confidence >= 0.82`.

### REVIEW_REQUIRED

Ambigüedad real: provenance ausente, relación incierta, metadata crítica faltante, notas sin resolver o confianza insuficiente. Esta es la cola destinada a Cowork.

### BLOCKED

Conflicto bloqueante o identidad exacta ya existente durante selección. No equivale a `SOURCE_DOES_NOT_PUBLISH` ni a `MODEL_REQUIREMENT_GAP`.

## Notes status

Expansion v1 introduce una extensión no destructiva del contrato:

- `published` — existe pirámide, estructura parcial o lista plana verificable.
- `source_does_not_publish` — se verificó con provenance que la fuente legítima no publica notas; `NOTE_STRUCTURE=UNKNOWN` no se convierte en un rechazo por esa sola razón.
- `unresolved` — ausencia aún no explicada; sigue siendo `REVIEW_REQUIRED` / error de validación.

`source_does_not_publish` y notas publicadas simultáneamente producen conflicto explícito. No existen excepciones por marca.

## Human Review Burden

`REVIEW_REQUIRED / total procesado`.

Meta operativa v1: **<= 10%**, con dirección a <=5% después de Batch 003.

## Comandos

Desde `scripts/catalog`:

```bash
npm test
npm run expand
npm run enrich
npm run build-batch-003
npm run expansion-gate
```

`npm run expand` genera manifiesto, gap report, exclusiones y cola de descubrimiento en `catalog/expansion/batch-003/`.

`npm run enrich` solo actúa si existe `evidence.csv` y produce `auto-ready.csv`, `review-required.csv`, `blocked.csv` y métricas.

`npm run build-batch-003` solo acepta filas `AUTO_READY`; genera un batch compatible con el contrato de entrada del pipeline, sin importar nada.

`npm run expansion-gate` emite `GO`, `NO_GO` o `NOT_READY` según disponibilidad y métricas de evidencia.

## CI de validación

Mientras GO-100 no está en `main`, PR #18 usa temporalmente `ci/catalog-expansion-v1-gate` como base de validación. Ese branch contiene únicamente el workflow sobre GO-100 para permitir ejecutar la suite sin contaminar `main`. Antes de integración final, el PR vuelve a su base contractual correspondiente.

## Guardrails

- No Postgres.
- No auto-publicación.
- No importación al master.
- No mutación de raw inputs.
- No deduplicación destructiva ante ambigüedad.
- Candidate metadata es semilla, no dato catalogable, hasta ser verificada por evidencia.
- Sitio oficial preferido, pero provenance se registra por URL de evidencia, no por dominio supuesto.
