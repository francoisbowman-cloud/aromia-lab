# Estado y continuidad — Aromia

Resumen preparado el 16 de noviembre de 2026 (America/Santo_Domingo).

## Estado actual

- Rama: `feat/185-release-foundation`.
- PR: https://github.com/francoisbowman-cloud/aromia-lab/pull/186 — abierta, fuera de borrador.
- Último commit funcional al preparar este documento: `e246b51`.
- Los cambios están guardados y subidos a GitHub. No se ha integrado esta rama en `main` ni se ha desplegado esta versión en producción.
- La publicación del **entorno de trabajo** no equivale a publicar Aromia en producción.
- Instrucción vigente del usuario: guardar con commit/push y documentar; esperar próximos cambios, sin publicación. La autorización anterior de despliegue quedó detenida por esa instrucción posterior.

## Trabajo realizado

### Dirección visual y experiencia

- Portada y archivo de Historias con composición sensorial: marfil, vino y bosque; tipografía editorial cursiva; mayor protagonismo de fotografía y variación de escala.
- Extensión a Saber, Discovery, familias, Personas, búsqueda, Club, cuestionario, resultados y aperturas de artículos y perfumes.
- Reutilización de imágenes documentales y de ingredientes con créditos. Imágenes reinterpretadas con IA identificadas y con procedencia; sin inventar retratos de perfumistas.
- Búsqueda de personas y familias sin depender de acentos, sugerencias y estado en URL.
- Filtros de familias con navegación Atrás, cuestionario con retroceso y sustitución de respuestas, borrado confirmable del mapa local.
- Mejoras de foco, salto al contenido, adaptación móvil y contraste en modo oscuro.

### Lectura y CMS

- Recuperación ante contenido ausente, errores de servicio y fallos de guardado; conservación de ediciones de borradores.
- Contenido editable y saneado, correcciones de navegación móvil e hidratación.
- Almacenamiento de imágenes del CMS en PostgreSQL en lugar del disco efímero.
- Migración `023_create_media_uploads.sql` incluida en el arranque de la API; aún no aplicada por este trabajo a producción.

### Bloqueo de catálogo y corrección pendiente de CI

El intento de preparar la publicación encontró un fallo en `Apply historical Batch 003 reviewed evidence`. La descarga de logs y artefactos estaba bloqueada por la red del entorno. Se añadieron anotaciones de CI para exponer el error sin desactivar controles.

Error observado: `reviewed_evidence_gender_conflict:c036:unisex->masculino`, correspondiente a Givenchy Gentleman Réserve Privée.

Se identificó un defecto en el extractor: buscaba género en toda la página, incluyendo navegación y recomendaciones, e interpretaba referencias masculinas y femeninas simultáneas como unisex. `e246b51` limita esa inferencia a metadatos del producto, conserva audiencias explícitas y deja vacíos los casos ambiguos. El rechazo de contradicciones de la evidencia revisada se mantiene.

Esta corrección tiene pruebas de regresión, pero **todavía no se ha confirmado que resuelva el recorrido completo del catálogo en GitHub**. No afirmar que el bloqueo de publicación está cerrado hasta verificar CI sobre el commit actual.

## Validaciones disponibles

- Versión visual: 61 pruebas web, lint, tipos y compilación optimizada con 49 páginas estáticas correctos.
- Revisión de navegador en escritorio/móvil y claro/oscuro, comprobaciones adicionales a 320 px; corrección del contraste del botón de lectura.
- Recorridos sobre compilación de producción local: búsqueda, cuestionario, resultado, filtros/Atrás, cancelación y borrado del mapa, teclado y apertura/avance/cierre del lector.
- API compilada tras incluir la migración de medios.
- Corrección del extractor: 175 pruebas de catálogo pasaron antes del cambio de entorno. Tras recuperar exactamente la corrección en el nuevo entorno, sus 2 pruebas específicas volvieron a pasar.
- CI previo: web, API, código e importación pasaron; la comprobación histórica del catálogo falló. Los resultados anteriores no certifican automáticamente el último commit.

## Pendientes

1. Verificar CI del commit `e246b51` o posterior, especialmente el recorrido histórico Batch 003 y cualquier contradicción adicional.
2. Cuando el usuario vuelva a autorizar publicación: comprobar estado remoto/PR, integrar mediante el flujo de revisión y verificar despliegues de web y API en Railway desde `main`.
3. Tras desplegar: verificar migración de medios, persistencia de subidas, salud de servicios y recorridos reales en producción. Las pruebas locales no sustituyen estas comprobaciones.
4. Resolver o acotar la lentitud de imágenes externas del catálogo.
5. Mantener pendientes la revisión factual/de derechos y recuperación de las nueve historias SubBatch 01: los fixtures locales no son contenido aprobado ni publicado. No dar por cerrada toda la misión #185.
6. Completar las revisiones amplias todavía abiertas de seguridad, accesibilidad y rendimiento; no presentar la comprobación automatizada parcial como certificación integral.

## Referencias

- `docs/design/sensory-editorial-185.md`: portada, archivo, investigación y adaptación del mockup.
- `docs/design/editorial-world-185.md`: extensión visual, UX y pruebas.
- `docs/mission-185/CONTINUATION.md` y `TRACEABILITY.md`: antecedentes y alcance amplio; algunas restricciones de esos documentos corresponden a momentos anteriores.
- Evidencia de sesiones anteriores: `/workspace/aromia-evidence`; su disponibilidad puede variar al restaurar entornos.

El entorno nuevo se restauró desde `f22a7f5`. Se conservaron copias de los dos archivos locales de diseño en `/tmp/aromia-snapshot-backup`, se sincronizó por fast-forward con GitHub y se recuperó la corrección no comprometida del extractor a partir del trabajo de esta conversación. No se sustituyó el diseño remoto por archivos antiguos ni se incluyeron informes temporales de pruebas en el commit.
