# Resumen de batch — batch-002

Generado: 2026-08-08T20:20:32.604Z

## Totales

- Total de filas: 50
- Válidas (pasan validate.mjs, con o sin warnings): 50
- Rechazadas: 0
- Nuevas (NEW): 50
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

- catalog_relation — NEW: 49 | EXISTING: 0 | RELATED_VARIANT: 1 | POSSIBLE_DUPLICATE: 0
- quality_status — CATALOG_READY: 0 | CATALOG_READY_WITH_PENDING: 50 | REVIEW_REQUIRED: 0 | REJECTED: 0

## Automation yield (F3.7B — dos métricas separadas, nunca combinadas)

- **Decision Automation Yield** (filas que NO requieren que un humano decida algo — todo lo que no es REVIEW_REQUIRED): 100.0%
- **Data Completion Yield** (filas CATALOG_READY o CATALOG_READY_WITH_PENDING — salieron listas para stage sin intervención): 100.0%

## Distribuciones

**Por marca**

| Valor | Cantidad |
|---|---|
| Diptyque | 3 |
| Issey Miyake | 2 |
| Guerlain | 2 |
| Frederic Malle | 2 |
| Amouage | 2 |
| By Kilian | 2 |
| Chanel | 2 |
| Creed | 2 |
| Loewe | 2 |
| Yves Saint Laurent | 1 |
| Dior | 1 |
| Thierry Mugler | 1 |
| Givenchy | 1 |
| Narciso Rodriguez | 1 |
| Calvin Klein | 1 |
| Burberry | 1 |
| Marc Jacobs | 1 |
| Viktor & Rolf | 1 |
| Paco Rabanne | 1 |
| Azzaro | 1 |
| Hugo Boss | 1 |
| Chloé | 1 |
| Lancôme | 1 |
| Estée Lauder | 1 |
| Serge Lutens | 1 |
| Comme des Garçons | 1 |
| Acqua di Parma | 1 |
| Penhaligon's | 1 |
| Clive Christian | 1 |
| Xerjoff | 1 |
| Juliette Has a Gun | 1 |
| Etat Libre d'Orange | 1 |
| Ormonde Jayne | 1 |
| Zoologist Perfumes | 1 |
| Prada | 1 |
| Salvatore Ferragamo | 1 |
| Mugler | 1 |
| Rabanne | 1 |
| Nasomatto | 1 |
| Bond No. 9 | 1 |

**Por concentración**

| Valor | Cantidad |
|---|---|
| EDP | 29 |
| EDT | 15 |
| Parfum | 2 |
| Extrait | 2 |
| EDC | 1 |
| Pure Perfume 30% | 1 |

**Por género**

| Valor | Cantidad |
|---|---|
| femenino | 20 |
| masculino | 15 |
| unisex | 15 |

**Por nivel de confianza (data_confidence)**

| Valor | Cantidad |
|---|---|
| medium | 31 |
| high | 11 |
| low | 8 |

## Revisión por excepciones

Ningún registro requiere revisión humana en este batch.

## Archivos generados

- Propuesta de importación: C:\Users\user\Claude\Projects\aromia-catalog-pipeline\catalog\staging\batch-002.import-proposal.csv
- Rechazados: (ninguna fila rechazada en este batch)
- Diff completo: catalog/reports/batch-002-diff.json
- Validación del batch crudo (informativa, antes de normalizar): catalog/reports/batch-002-validation.json
- Validación autoritativa (post-normalización — decide REJECTED): catalog/reports/batch-002.normalized-validation.json
- Trace de normalización: catalog/reports/batch-002-normalize-trace.json
- Duplicados dentro del batch: catalog/reports/batch-002.normalized-duplicates.json
