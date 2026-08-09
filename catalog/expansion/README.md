# Aromia — Expansion Automation v1

Base contractual: GO-100 (`274311d`). Esta capa expande el catálogo sin escribir en Postgres, sin importar al master y sin mutar Batch 001/002 ni el baseline publicado.

## Pipeline

1. **Gap / candidate pool** — pool semilla sobredimensionado (130 identidades) dividido por estratos.
2. **Identity resolver** — normaliza marca, nombre y concentración; compara contra `PERFUMES_INITIAL_50.csv`, Batch 001, Batch 002 y master.
3. **Candidate selector** — intenta producir hasta 100 identidades únicas para Batch 003.
4. **Source discovery queue** — crea consultas y dominio oficial preferido por candidato; no confunde el dominio semilla con provenance verificado.
5. **Structured evidence adapter** — `expansion-enrich.mjs` consume `evidence.csv` y prepara campos estructurados.
6. **Provenance** — ninguna fila puede ser `AUTO_READY` sin al menos un `source_url`.
7. **Normalization / relation** — concentración normalizada, `NEW` / `RELATED_VARIANT` conservado sin dedup destructiva.
8. **Confidence scoring** — dimensiones separadas: identidad, fuente, notas, metadata y relación; conserva razones y penalizaciones.
9. **Quality gates** — `AUTO_READY`, `REVIEW_REQUIRED`, `BLOCKED`.
10. **Batch preparation** — genera `auto-ready.csv`, `review-required.csv`, `blocked.csv` y métricas cuando existe evidencia.

## Estratos de Batch 003

Objetivo de selección v1:

- mainstream: 35
- variant_risk: 25
- niche: 20
- nonstandard_notes: 10
- hard_case: 10

El pool contiene más de 100 candidatos para absorber duplicados contra el universo ya procesado. El selector completa huecos con los candidatos elegibles restantes si un estrato no alcanza su cuota.

## Estados

### AUTO_READY

Solo para una fila enriquecida que tenga provenance, relación no ambigua y `overall_confidence >= 0.82`. La ausencia legítima de pirámide no bloquea si se confirmó que la fuente no publica notas.

### REVIEW_REQUIRED

Ambigüedad real: provenance ausente, relación incierta o confianza insuficiente. Esta es la cola destinada a Cowork.

### BLOCKED

Conflicto bloqueante o identidad exacta ya existente durante selección. No equivale a `SOURCE_DOES_NOT_PUBLISH` ni a `MODEL_REQUIREMENT_GAP`.

## Human Review Burden

`REVIEW_REQUIRED / total procesado`.

Meta operativa de Expansion Automation v1: **<= 10%**, con dirección a <= 5% después de Batch 003.

## Comandos

Desde `scripts/catalog`:

```bash
npm test
npm run expand
npm run enrich
```

`npm run expand` genera el manifiesto y la cola de descubrimiento en `catalog/expansion/batch-003/`. `npm run enrich` solo actúa si existe `evidence.csv`.

## Guardrails

- No Postgres.
- No auto-publicación.
- No importación al master.
- No mutación de raw inputs.
- No deduplicación destructiva ante ambigüedad.
- Candidate metadata es semilla, no dato catalogable, hasta ser verificada por evidencia.
