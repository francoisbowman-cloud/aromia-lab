# Aromia × OMNI — Nota oficial de integración

**Estado:** propuesta operativa aprobada para continuidad.  
**OMNI fuente de verdad:** `francoisbowman-cloud/image-toolkit` en `main`.  
**Aromia fuente de verdad:** este repositorio en `main`.

## Objetivo

Aromia debe utilizar OMNI como infraestructura compartida de producción visual, auditoría y gobernanza cuando la tarea encaje en sus capacidades, evitando duplicar lógica visual dentro de Aromia.

## Principio de integración

Aromia conserva sus datos, reglas de negocio, catálogo, frontend y dominio. OMNI aporta capacidades reutilizables de procesamiento visual, análisis, planificación, quality gates, trazabilidad y, cuando corresponda, profesionalización web.

Arquitectura objetivo:

`Aromia → OMNI API / capabilities → resultado + evidencia + estado → Aromia`

La integración debe ser incremental y no debe bloquear el roadmap funcional de Aromia.

## Primeros flujos recomendados

### 1. Catalog Image → OMNI → Brand-Compliant Asset

Para imágenes nuevas o existentes del catálogo:

1. Aromia envía la imagen y el contexto del producto a OMNI.
2. OMNI ejecuta Image Refinement de forma conservadora.
3. Genera derivados apropiados para catálogo/PDP cuando corresponda.
4. Mide Visual DNA / características relevantes.
5. Valida el candidato contra las reglas visuales de Aromia.
6. Devuelve resultado, manifiesto y estado `PASS / REVIEW / FAIL`.
7. Aromia publica solo según su propia política y cuando los gates estén satisfechos.

OMNI no debe inventar ni alterar la identidad real del frasco, etiqueta, color, proporciones, materiales o contenido impreso.

### 2. Batch visual del catálogo

Cuando Aromia procese lotes de imágenes, usar el batch engine de OMNI con retry/resume/cancelación en vez de implementar un segundo motor de procesamiento visual dentro de Aromia.

### 3. Auditoría y evolución visual de la web

Para Home, PDP, Magazine, Discovery/Quiz u otras superficies visuales:

`OBSERVE → INTENT → KNOWLEDGE → PLAN → PREVIEW → PROVE`

OMNI puede auditar, definir Visual Intent, consultar Professional Intelligence/OVKB, preparar CompositionChangeSet y generar evidencia visual cuando el runtime lo permita.

No pasar a Apply sin aprobación visual explícita y autorización de escritura.

## Reglas de frontera

- `main` de Aromia sigue siendo la única fuente de verdad de Aromia.
- `main` de OMNI sigue siendo la única fuente de verdad de OMNI.
- Aromia no debe copiar internamente motores de OMNI salvo razón arquitectónica documentada.
- OMNI no decide pricing, SEO, copy, catálogo comercial ni reglas de negocio de Aromia salvo que exista una capacidad explícita futura.
- Un `preview` de OMNI no equivale a aprobación ni publicación.
- Los resultados `REVIEW` o `FAIL` no deben tratarse como activos aprobados.
- Integraciones con APIs externas pagadas deben ser explícitas y presupuestadas; usar capacidades propias/deterministas de OMNI cuando sean suficientes.

## Prioridad de implementación

1. Integración manual por API para imágenes de catálogo.
2. Batch automatizado para nuevos lotes.
3. Trigger/evento al ingresar nuevas imágenes.
4. Integración de auditoría/propuesta visual web.
5. Orquestación más autónoma solo después de validar los flujos anteriores en producción real.

## Instrucción para futuros chats/agentes

Cuando trabajes en Aromia y una tarea implique procesamiento de imágenes, consistencia visual, auditoría de diseño, propuesta visual, quality gates, renders de revisión o una capacidad que OMNI ya provea:

1. inspecciona primero el estado actual de OMNI desde `francoisbowman-cloud/image-toolkit@main`;
2. reutiliza la capacidad de OMNI en lugar de duplicarla en Aromia;
3. conserva las fronteras de aprobación y publicación;
4. documenta cualquier nueva necesidad generalizable como candidata para OMNI, no como parche específico de Aromia.

Esta nota expresa intención de arquitectura. No autoriza por sí sola despliegues, publicación automática ni uso de proveedores externos de pago.
