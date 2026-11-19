# Aromia · medición de ciclos de desarrollo

Objetivo: comparar el método anterior (`legacy`) y el desarrollo previo en contenedor (`container`) sin confundir menos commits con menor tiempo ni tests aislados con certificación.

Registrar **tres ciclos consecutivos** del nuevo método y, cuando existan registros comparables, ciclos del método anterior. Por ciclo registrar: `id`, `method`, `minutes` (tiempo real transcurrido), `featuresCompleted` (funcionalidades aceptadas, no archivos), `testsPassed`, `testsRun` y `postUploadFixes` (correcciones requeridas después de subir). Si un valor no fue observado, **no inventarlo** ni registrarlo como cero.

La función `compare` devuelve `speedup: null` si falta evidencia de ambos métodos. No infiere velocidad por número de commits. Los resultados de tests deben acompañarse de alcance y entorno por separado; no sustituyen gates ni aprobación del Publisher.

Validar sin instalar dependencias: `node --test tools/cycle-metrics/metrics.test.mjs`.

Este módulo no lee secretos, no despliega, no crea infraestructura ni altera el estado de publicación. No se incluye un conjunto de mediciones históricas fabricadas.
