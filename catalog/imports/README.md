# catalog/imports/

Acá van los batches crudos que entrega Cowork (`batch-001.csv`, `batch-002.csv`, ...).

**Al momento de este commit (Fase 3, Bloque A-D) todavía no existe ningún
batch real de Cowork.** El piloto de 25 perfumes mencionado en el brief no
fue entregado aún. Para no bloquear el desarrollo ni inventar datos, se usa
`_fixture-pilot.csv` — un lote sintético de 6 filas escrito a mano por Code,
con casos deliberadamente representativos (variantes de concentración,
alias de concentración a normalizar, una fila con error de validación, y un
perfume que ya existe en el catálogo actual de Aromia) para poder correr y
demostrar el pipeline completo end-to-end.

**`_fixture-pilot.csv` no es el batch-001 real y no debe tratarse como
tal.** El prefijo `_` es intencional para que no se confunda por orden
alfabético con `batch-00N.csv` reales. Cuando Cowork entregue el batch-001
real, correr el pipeline completo contra él (Bloque E) y comparar los
resultados contra las asunciones documentadas en
`catalog/schemas/SCHEMA_COMPARISON.md` (sección 4) — no asumir que porque
el fixture pasó, el batch real va a comportarse igual.
