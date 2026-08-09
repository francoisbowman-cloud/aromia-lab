# Resumen de batch — _fixture-pilot

Generado: 2026-08-07T17:25:56.606Z

## Totales

- Total de filas: 6
- Válidas (pasan validate.mjs, con o sin warnings): 5
- Rechazadas: 1
- Nuevas (NEW): 3
- Actualizaciones propuestas (UPDATED): 0
- Sin cambios (UNCHANGED): 0
- Conflictos (requieren revisión humana): 2
- Duplicados exactos dentro del batch: 0
- Conflictos de duplicado dentro del batch (misma brand+name+concentration, datos distintos): 0
- Warnings de validación: 0
- Campos obligatorios incompletos detectados: 1
- Variantes de producto detectadas (misma marca+nombre, distinta concentración — no son conflicto, son productos legítimos): 1
- URLs inválidas detectadas: 1

## Distribuciones

**Por marca**

| Valor | Cantidad |
|---|---|
| Nishane | 2 |
| Dior | 1 |
| Yves Saint Laurent | 1 |
| Xerjoff | 1 |
| Marca Sin Datos | 1 |

**Por concentración**

| Valor | Cantidad |
|---|---|
| EDP | 3 |
| EDT | 2 |
| Extrait | 1 |

**Por género**

| Valor | Cantidad |
|---|---|
| male | 3 |
| unisex | 2 |
| female | 1 |

**Por nivel de confianza (data_confidence)**

| Valor | Cantidad |
|---|---|
| medium | 3 |
| high | 2 |
| (vacío) | 1 |

## Revisión por excepciones

2 registro(s) requieren revisión humana:

- Fila 2 (slug: dior-sauvage-edt, id: fx-001): Posible coincidencia por marca+nombre con 1 perfume(s) ya publicado(s) en Aromia (PERFUMES_INITIAL_50.csv no distingue concentración de forma confiable) — requiere revisión manual antes de importar
- Fila 3 (slug: yves-saint-laurent-black-opium-edp, id: fx-002): Posible coincidencia por marca+nombre con 1 perfume(s) ya publicado(s) en Aromia (PERFUMES_INITIAL_50.csv no distingue concentración de forma confiable) — requiere revisión manual antes de importar

## Archivos generados

- Propuesta de importación: C:\Users\user\Claude\Projects\aromia-catalog-pipeline\catalog\staging\_fixture-pilot.import-proposal.csv
- Rechazados: C:\Users\user\Claude\Projects\aromia-catalog-pipeline\catalog\rejected\_fixture-pilot-rejected.csv
- Diff completo: catalog/reports/_fixture-pilot-diff.json
- Validación del batch crudo (informativa, antes de normalizar): catalog/reports/_fixture-pilot-validation.json
- Validación autoritativa (post-normalización — decide REJECTED): catalog/reports/_fixture-pilot.normalized-validation.json
- Trace de normalización: catalog/reports/_fixture-pilot-normalize-trace.json
- Duplicados dentro del batch: catalog/reports/_fixture-pilot.normalized-duplicates.json
