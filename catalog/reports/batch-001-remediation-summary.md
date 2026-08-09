# Remediación Batch 001 — resultado (Fase 3.7)

**Fecha:** 2026-08-08
**Fuente:** `handoff/cowork/phase-3/batch-001-remediation.csv` (17 cambios de campo sobre 9 slugs, entregado por Cowork) + `handoff/cowork/phase-3/batch-001-remediation-summary.md` (su propio resumen de investigación)
**Original sin modificar:** `catalog/imports/batch-001.csv` (nunca tocado)
**Artefacto generado:** `catalog/staging/batch-001-remediated.csv` (25 filas: 16 sin cambios + 9 con los parches de remediación aplicados) + `catalog/staging/batch-001-remediated-apply-log.json` (qué se aplicó y qué no, por qué)
**Cómo se aplicó:** `scripts/catalog/apply-remediation.mjs` — reglas generales sobre las columnas estructuradas de `remediation.csv` (`remediation_status`, `field_remediated`, `new_value`), no un mapeo por slug. Los dos únicos valores transcriptos a mano (no parseables de forma determinista desde prosa libre) están documentados en el propio script (`OFFICIAL_PRIORITY_OVERRIDES`, `PARSE_OVERRIDES`), indexados por `id` de la fila de remediación + campo, no por slug.

---

## Métricas obligatorias

| Métrica | Valor |
|---|---|
| Original rejected | 9 |
| Rescued (pasaron a CATALOG_READY o CATALOG_READY_WITH_PENDING) | **7** |
| catalog ready (sin ningún campo pendiente) | 0 |
| catalog ready with pending | 7 |
| review required | 0 |
| still rejected | 2 (`santal-33-edp`, `side-effect-edp`) |

Detalle completo por fila: `catalog/reports/batch-001-remediation-results.csv`.

## Por qué 2 siguen REJECTED (no es una falla de la remediación)

Ambas fueron investigadas en la segunda pasada — **la conclusión de esa
investigación es que la marca genuinamente no publica una pirámide
top/middle/base separada por niveles** (Le Labo para Santal 33, Initio
para Side Effect). Cowork documentó esto explícitamente como
"factual-core-pending (justificado)" / "confirmado que la marca no separa
niveles" — no es una investigación incompleta, es una investigación
concluida con resultado negativo.

`top_notes`/`middle_notes`/`base_notes` siguen siendo `REQUIRED_FIELDS`
con `minItems: 1` en `catalog.schema.json` — el pipeline no tiene forma de
distinguir "no investigado" de "confirmado que no existe" sin un campo
nuevo en el schema (ej. un flag `no_pyramid_confirmed`). No se agregó ese
campo en esta pasada — decisión 2 del brief pide no reinterpretar el
schema salvo necesidad técnica, y dos filas sobre nueve no es evidencia
suficiente para ampliar el modelo. **Recomendación para consideración
futura:** si este patrón se repite con más frecuencia en próximos lotes
(ya apareció además en `boss-bottled-edt` de Batch 002 — ver
`batch-002-real-summary.md`), vale la pena evaluar un campo explícito
para "pirámide no aplicable" en vez de tratarlo igual que "dato faltante
sin investigar".

`side-effect-edp.family` sí se actualizó (`oriental especiado` →
`Ambery, Spicy`, etiqueta oficial más específica) — mejora de calidad de
dato, pero no era el campo que bloqueaba la fila.

## Decisión A aplicada — `the-one-for-men-edt`

Conflicto real entre dolcegabbana.com (oficial: `family = "Aromatic Woody
notes"`, 3 notas sin nivel) y Fragrantica (`family = "Woody Spicy"`,
pirámide completa de 9 notas). Por decisión A del brief: **se aplicó la
fuente oficial** (`family = "Aromatic Woody"`). La versión de Fragrantica
no se descartó — queda documentada en el campo `notes` de la fila
remediada, trazable. **No se escaló a revisión humana** (`quality_status`
= `CATALOG_READY_WITH_PENDING`, no `REVIEW_REQUIRED`) — la fuente oficial
permitió una representación coherente, tal como preveía la decisión A.

## Decisión B aplicada — `naxos-edp`

El sitio oficial de Xerjoff mostró en esta segunda pasada una pirámide
ligeramente distinta a la ya registrada (agrega "incienso de Omán" al
top). Por decisión B: **no se sobrescribió** el dato existente — es una
discrepancia entre fuentes/tiempo, no un error objetivo confirmado. La
fila se desbloqueó igual porque su `REJECTED` original era por `family`
pending (ahora resuelto: `family = "Aromatic, Spicy"`, confirmado en el
sitio oficial), no por la pirámide.

## Campos que quedaron pending con justificación explícita

`subfamily` en `naxos-edp`, `armani-code-parfum`, `explorer-edp` — ningún
campo formal de subfamily existe en las fuentes consultadas (ni oficial
ni Fragrantica lo exponen como campo estructurado separado). Es un campo
opcional — no bloquea, queda como `CATALOG_READY_WITH_PENDING`.

## Automation yield (Batch 001 remediation)

**7 / 9 = 77.8%** de las filas remediadas quedaron sin necesitar ninguna
decisión humana adicional ni más investigación (`CATALOG_READY_WITH_PENDING`,
0 en `REVIEW_REQUIRED`). Definición: filas cuyo `quality_status` final es
`CATALOG_READY` o `CATALOG_READY_WITH_PENDING` — ver metodología completa
en `batch-002-real-summary.md`, sección Automation Yield.

## Tests

`tests/apply-remediation.test.mjs` (4 tests) cubre dos bugs reales
encontrados al construir `batch-001-remediated.csv`: un `remediation_status`
sin clasificar dejaba pasar un placeholder de texto como si fuera un valor
real de campo, y un parser de prosa en español capturaba de más
("Chypre si se separa" en vez de "Chypre"). Incluye una corrida de
regresión contra el `remediation.csv` real completo. No es lógica de
pipeline por slug — `apply-remediation.mjs` es una herramienta de
integración de un entregable puntual, separada de
`validate.mjs`/`normalize.mjs`/`diff.mjs`.
