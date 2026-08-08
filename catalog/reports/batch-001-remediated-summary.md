# Resumen de batch — batch-001-remediated

Generado: 2026-08-08T20:20:32.034Z

## Totales

- Total de filas: 25
- Válidas (pasan validate.mjs, con o sin warnings): 25
- Rechazadas: 0
- Nuevas (NEW): 25
- Actualizaciones propuestas (UPDATED): 0
- Sin cambios (UNCHANGED): 0
- Conflictos (requieren revisión humana): 0
- Duplicados exactos dentro del batch: 0
- Conflictos de duplicado dentro del batch (misma brand+name+concentration, datos distintos): 0
- Warnings de validación: 1
- Campos obligatorios incompletos detectados: 0
- Variantes de producto detectadas (misma marca+nombre, distinta concentración — no son conflicto, son productos legítimos): 0
- URLs inválidas detectadas: 0

## Dos dimensiones (F3.6)

`status` (arriba) es un valor derivado por compatibilidad — `catalog_relation` y `quality_status` son las dimensiones reales, independientes entre sí (ver README de scripts/catalog).

- catalog_relation — NEW: 23 | EXISTING: 0 | RELATED_VARIANT: 2 | POSSIBLE_DUPLICATE: 0
- quality_status — CATALOG_READY: 0 | CATALOG_READY_WITH_PENDING: 25 | REVIEW_REQUIRED: 0 | REJECTED: 0

## Automation yield (F3.7B — dos métricas separadas, nunca combinadas)

- **Decision Automation Yield** (filas que NO requieren que un humano decida algo — todo lo que no es REVIEW_REQUIRED): 100.0%
- **Data Completion Yield** (filas CATALOG_READY o CATALOG_READY_WITH_PENDING — salieron listas para stage sin intervención): 100.0%

## Distribuciones

**Por marca**

| Valor | Cantidad |
|---|---|
| Chanel | 1 |
| Tom Ford | 1 |
| Le Labo | 1 |
| Guerlain | 1 |
| Versace | 1 |
| Prada | 1 |
| Giorgio Armani | 1 |
| Xerjoff | 1 |
| Initio Parfums Prives | 1 |
| Carolina Herrera | 1 |
| Montblanc | 1 |
| Jean Paul Gaultier | 1 |
| Dolce & Gabbana | 1 |
| Amouage | 1 |
| Zara | 1 |
| Ariana Grande | 1 |
| Byredo | 1 |
| Parfums de Marly | 1 |
| Nishane | 1 |
| Mancera | 1 |
| Valentino | 1 |
| Hermès | 1 |
| Kayali | 1 |
| Roja Parfums | 1 |
| Maison Margiela | 1 |

**Por concentración**

| Valor | Cantidad |
|---|---|
| EDP | 17 |
| Parfum | 3 |
| EDT | 3 |
| Extrait | 1 |
| Parfum Cologne | 1 |

**Por género**

| Valor | Cantidad |
|---|---|
| masculino | 10 |
| unisex | 8 |
| femenino | 7 |

**Por nivel de confianza (data_confidence)**

| Valor | Cantidad |
|---|---|
| medium | 13 |
| high | 8 |
| low | 4 |

## Revisión por excepciones

Ningún registro requiere revisión humana en este batch.

## Archivos generados

- Propuesta de importación: C:\Users\user\Claude\Projects\aromia-catalog-pipeline\catalog\staging\batch-001-remediated.import-proposal.csv
- Rechazados: (ninguna fila rechazada en este batch)
- Diff completo: catalog/reports/batch-001-remediated-diff.json
- Validación del batch crudo (informativa, antes de normalizar): catalog/reports/batch-001-remediated-validation.json
- Validación autoritativa (post-normalización — decide REJECTED): catalog/reports/batch-001-remediated.normalized-validation.json
- Trace de normalización: catalog/reports/batch-001-remediated-normalize-trace.json
- Duplicados dentro del batch: catalog/reports/batch-001-remediated.normalized-duplicates.json
