# Resumen de batch — batch-001

Generado: 2026-08-07T20:12:47.356Z

## Totales

- Total de filas: 25
- Válidas (pasan validate.mjs, con o sin warnings): 15
- Rechazadas: 10
- Nuevas (NEW): 13
- Actualizaciones propuestas (UPDATED): 0
- Sin cambios (UNCHANGED): 0
- Conflictos (requieren revisión humana): 2
- Duplicados exactos dentro del batch: 0
- Conflictos de duplicado dentro del batch (misma brand+name+concentration, datos distintos): 0
- Warnings de validación: 1
- Campos obligatorios incompletos detectados: 6
- Variantes de producto detectadas (misma marca+nombre, distinta concentración — no son conflicto, son productos legítimos): 0
- URLs inválidas detectadas: 1

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

2 registro(s) requieren revisión humana:

- Fila 6 (slug: eros-parfum, id: 5): Posible coincidencia por marca+nombre con 1 perfume(s) ya publicado(s) en Aromia (PERFUMES_INITIAL_50.csv no distingue concentración de forma confiable) — requiere revisión manual antes de importar
- Fila 23 (slug: terre-d-hermes-parfum, id: 22): Posible coincidencia por marca+nombre con 1 perfume(s) ya publicado(s) en Aromia (PERFUMES_INITIAL_50.csv no distingue concentración de forma confiable) — requiere revisión manual antes de importar

## Archivos generados

- Propuesta de importación: C:\Users\user\Claude\Projects\aromia-catalog-pipeline\catalog\staging\batch-001.import-proposal.csv
- Rechazados: C:\Users\user\Claude\Projects\aromia-catalog-pipeline\catalog\rejected\batch-001-rejected.csv
- Diff completo: catalog/reports/batch-001-diff.json
- Validación del batch crudo (informativa, antes de normalizar): catalog/reports/batch-001-validation.json
- Validación autoritativa (post-normalización — decide REJECTED): catalog/reports/batch-001.normalized-validation.json
- Trace de normalización: catalog/reports/batch-001-normalize-trace.json
- Duplicados dentro del batch: catalog/reports/batch-001.normalized-duplicates.json
