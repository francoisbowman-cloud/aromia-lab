# Aromia — dirección visual y pendientes del Master Plan

Fecha: 17-11-2026. Complementa MANDATO-V2.md; no sustituye su orden de fases ni sus autorizaciones.

## Decisiones de la conversación

El Publisher expresó entusiasmo por el mockup y preocupación por la diferencia entre frascos imaginarios y productos reales de Amazon. Se adopta como referencia conceptual: composición editorial, protagonismo de imágenes, marfil/ámbar/borgoña, tipografía expresiva, ingredientes y lectura inmersiva en escritorio y móvil. No es un diseño implementado ni aprobación de un producto, licencia o despliegue.

La imagen generada permanece en el chat: EXTERNAL_ARTIFACT_STATUS: PENDING. No hay archivo, checksum ni activo ingestado en Git. No inventar su ruta ni afirmar que sus frascos representan perfumes comerciales. No regenerarla de forma rutinaria: reutilizar recursos existentes y limitar consumo.

- Escenas editoriales: libertad con ingredientes, texturas y luz; procedencia y naturaleza de ilustración conservadas sin sellos IA repetitivos en la lectura pública.
- Productos identificables: **criterio innegociable del Publisher — producto e identidad**. Etiquetas, textos, logotipos, geometría, color, dimensiones y elementos distintivos deben corresponder al producto real. Ningún resultado visual espectacular compensa una representación incorrecta. Conservar frasco, concentración, tamaño, flanker y packaging exactos; acreditar procedencia y permiso de imagen. Contrato operativo: [PRODUCT-IDENTITY-FIDELITY.md](visual/PRODUCT-IDENTITY-FIDELITY.md). Un recurso encontrado en Amazon no acredita derechos de reutilización.
- Glamour mediante composición y tratamiento del entorno; no redibujar una marca o un producto real para hacerlo encajar.
- CTA comercial debe corresponder al destino presentado. Un enlace de búsqueda no acredita un ASIN, su variante ni la imagen del primer resultado.
- Sin precio, disponibilidad o ingresos inventados. Mantener divulgación de afiliación y separación de decisiones editoriales/comerciales.
- Antes de extender la referencia: una pieza con recursos reales autorizados, revisada en escritorio/móvil, legibilidad, teclado, imágenes ausentes, movimiento reducido y rendimiento. Este paso sigue pendiente; no iniciar un rediseño global por haber generado un concepto.

## Lista de trabajo reconciliada

| Fase V2 | Estado demostrado | Siguiente entrega y criterio de cierre |
| --- | --- | --- |
| 0. Baseline | PR186 fusionada; PR187 borrador, CI de0888145: cinco SUCCESS, siete SKIPPED | Conservar evidencia por SHA; los controles omitidos no autorizan lanzamiento |
| 1. Fundación | Jobs persistentes, versiones, panel, captura acotada y revisión ligada a hash probados localmente | Configurar y verificar runtime autorizado; scheduler, costes y observabilidad operacional pendientes |
| 2. Piloto editorial | Un borrador histórico recuperado sin duplicación; tres fuentes capturadas | Completar investigación y revisión factual, edición, arte, derechos, QA y revisión humana; proveedor/presupuesto pendientes para generación autónoma |
| 3. Living Edition | Composición existente preservada; nueva referencia conceptual registrada | Seleccionar pieza y activos reales, documentar fidelidad/derechos, implementar composición acotada y verificar visualmente; OMNI remoto pendiente |
| 4. Marketing/Revenue | Integración Amazon existente; defecto de selección automática detectado y corregido en este lote | Verificar producto/variante por registro, términos de uso de imágenes, divulgación, clics, atribución e ingresos; campañas/newsletter no declaradas completas |
| 5. Audiovisual | Concepto estático generado en chat | Pieza audiovisual reproducible, derechos y costes registrados; no consumir proveedores sin autorización |
| 6. Discovery/PWA | Hay experiencia web previa, sin cierre de esta fase | Auditar recorridos lectura/búsqueda/notas/biblioteca, estados vacíos, retorno y PWA; medir antes/después |
| 7. Endurecimiento | CI técnico y pruebas locales por lote | QA visual real, accesibilidad, seguridad, rendimiento, resiliencia, presupuesto y gates de producción |

Backlog editorial de la última ejecución:100 entradas de agenda,49 archivos de borrador,43 entradas cubiertas,57 pendientes. No equivale a43 artículos listos para publicar. Detalles y bloqueos de fuentes en `evidence/backlog-pilot.json`.

## Hallazgo y corrección comercial acotada

`apps/web/src/lib/amazonCatalog.server.ts` promovía el primer resultado no patrocinado de una búsqueda a producto/packshot y convertía ASINs al marketplace amazon.com. El resolver ahora conserva búsquedas como enlaces sin recuperar ni elegir resultados; los productos explícitos conservan marketplace, ASIN y parámetros de variante. Las imágenes existentes del catálogo siguen sujetas a revisión: este cambio no certifica identidad ni licencia de todos los datos previos. La extracción de imágenes desde HTML también requiere revisión de condiciones aplicables antes de producción.

NEXT_ACTOR: Code. NEXT_ACTION: verificar CI del lote; continuar revisión factual del piloto y seleccionar activos existentes para una prueba visual fiel, sin ampliar allowlists ni fabricar aprobaciones. BLOCKERS: proveedor/presupuesto sin resolver; verificación de fuentes, variantes y derechos pendiente; integración OMNI remota y gates de publicación no confirmados. AUTHORITY: sin merge, despliegue, publicación ni cambios OMNI. No se declara terminado el Master Plan.

## Observaciones del Publisher — calidad visual y automejora

La bergamota actual queda con sustitución solicitada, no aprobada estéticamente por su naturalidad. Registro ligado a SHA en `visual/feedback.json`; cápsula en `visual/BERGAMOTA-CAPSULA.md`. El Publisher reporta varias imágenes de perfumes incorrectas: esto exige revisión por producto/variante, no se considera solucionado con un cambio de resolver.

Incremento funcional del ciclo de mejora: `scripts/image-quality-monitor.mjs` produce señales deterministas de imágenes ausentes/compartidas, concentración ambigua y cambios del activo observado. Acepta un JSON de catálogo exportado; por defecto usa50 registros históricos, claramente etiquetados. Workflow `Image quality signals` lo ejecuta en PR relevante o manualmente y conserva informe como artefacto. No usa modelos ni modifica datos/publicación. Una ejecución verde valida el detector, no declara buenas las imágenes.

Pendiente para automejora completa: conectar catálogo real autorizado, revisión visual por identidad y derechos, propuestas de sustitución, comparación antes/después, aprobación ligada al hash, aplicación reversible, observación de resultados y rollback. No hay todavía un agente en producción que haga todo esto. Los hallazgos deben persistir hasta evidencia de resolución, sin inventar aprobaciones ni reemplazar automáticamente un frasco.

Corrección aplicada: Chance Eau Tendre sin concentración ya no implica EDP; las concentraciones EDT/EDP deben ser explícitas para elegir la página oficial. Las fuentes alternativas existentes no quedan certificadas por esta corrección.
