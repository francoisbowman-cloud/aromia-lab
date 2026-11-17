# Aromia Intelligence — estado y handoff

Contrato vigente: [MANDATO-V2.md](MANDATO-V2.md). Responsable: Code/Codex. Rama `feat/intelligence-foundation`, base `1619c776560f5d6f9c5948f8092ff5241540048f`.

Commit funcional: `0896076`. PR borrador: https://github.com/francoisbowman-cloud/aromia-lab/pull/187. Pruebas adicionales de contenido (3) y firma de subida (1) pasan. CI remoto iniciado; no se declara aprobado en este checkpoint.

## Reconciliación

PR186 está MERGED; el estado antiguo que la describe abierta queda superado. CI de la cabecera previa `218094c` pasó; los controles omitidos no equivalen a aprobación. Esta sesión no certifica el despliegue Railway del merge. Se preservan portada, archivo, Saber, Discovery, Personas, Club, lectura y CMS.

Autoridades: CURRENT_STATE, EDITORIAL_WORKFLOW, VOICE_BIBLE v0.3, ART_DIRECTION, protocolo de handoff, checkpoint/continuación/trazabilidad #185 y los dos documentos de diseño sensorial. No se encontró `AROMIA_PLAN_MAESTRO.md`; no se inventó su contenido. La restricción histórica contra crear colas por anticipación queda reemplazada para este alcance por el mandato explícito V2. No se reemplaza la política editorial ni su aprobación humana.

Reutilización: Express + adminAuth + PostgreSQL + compilación TypeScript; Next/CMS/Tiptap/Redis intactos. Sin proveedor, framework o servicio nuevo. Amazon ya tiene resolución/registro de afiliación en el código; su conectividad comercial e ingresos no fueron verificados en este lote.

OMNI: consulta read-only confirmó main `bafa1188eb379459a29b92fd306f2a03e2eafaaa`. Documentos `docs/omni-o01-creative-cycle.md` y `docs/omni-mcp-gateway.md` describen ciclo local, aprobación separada y transporte MCP stdio/Streamable HTTP. No se verificó endpoint remoto, credenciales, handshake ni disponibilidad de herramientas desplegadas. No se implementó un cliente que presuma HTTP/JSON arbitrario ni se tocó OMNI.

## Tablero

| Fase/tarea | Estado real | Evidencia/dependencia | Próximo paso |
|---|---|---|---|
| 0 Reconciliación | DONE para repositorio; producción pendiente | PR186/merge y documentación | Validación de despliegue separada |
| 1 Motor persistente | IMPLEMENTADO/PROBADO LOCAL | store.ts + PostgreSQL real; integración | Revisar CI/PR |
| 1 Políticas y registro | MÍNIMO | Única capacidad prepare_only; sin publicación ni proveedores | Versionar permisos al añadir capacidades |
| 1 Observabilidad | MÍNIMO | Eventos transaccionales, intentos/tiempos/error, consola/API autenticada | Panel web y métricas agregadas pendientes |
| 1 Ejecución operativa | LOCAL | Worker de una ejecución, invocable por scheduler | Configuración y autorización de runtime; no daemon desplegado |
| 2 Piloto | PREPARACIÓN, NO COMPLETO | Expediente real de una pregunta de la Voice Bible | Fuentes externas verificadas, borrador y revisiones |
| 3 Living Edition/OMNI | PENDIENTE | Dirección actual preservada; contrato fuente disponible | Endpoint/credenciales y handshake verificables |
| 4 Marketing/revenue | PENDIENTE | Componentes existentes por verificar | Auditoría de newsletter/analytics/afiliación |
| 5 Audiovisual | PENDIENTE | Ningún video generado | Derechos/proveedor/coste autorizado |
| 6 Discovery/PWA | PENDIENTE | Discovery existente preservado | Medir antes de ampliar |
| 7 Endurecimiento | PARCIAL | Pruebas de políticas/persistencia/acceso | Roles finos, auditoría, carga, recuperación operacional |

## Evidencia y límites

- Build API correcto. Tres pruebas de integración pasan con PostgreSQL16 local: validación de brief; deduplicación concurrente, conflicto de clave, toma exclusiva, reconexión, vencimiento/reasignación de lease, rechazo de trabajador obsoleto, cancelación, agotamiento/reinicio de reintentos, estado awaiting_review; HTTP 401/503/400 y ausencia de endpoint de aprobación.
- Migración idempotente aplicada dos veces en schema temporal; pruebas solo aceptan localhost y base `*_test`; limpian únicamente su schema aleatorio.
- Piloto CLI en tres procesos separados (enqueue/work/dashboard): ID `6f4a9e40-1aed-4e27-8655-fd690649c1d4`, estado awaiting_review, un intento, registrado en BD local. No necesita conservar la sesión de Node para conservar su estado.
- El expediente contiene una pregunta y una cita de la Voice Bible, NO investigación científica ni artículo terminado. Sources.verified=false, article=null, QA factual/editorial pendiente. Nunca genera aprobación humana.
- Coste de proveedor observado: cero llamadas/0 unidades monetarias. Coste de cómputo local no medido. No se configura facturación ni se usan créditos.
- Entrega al menos una vez, tokens de fencing, lease fijo60s, reintento10s×intento. Solo handler local breve/sin efectos externos. Antes de handlers largos o de pago hacen falta heartbeat/cancelación cooperativa, idempotencia externa y reserva presupuestaria.
- No hay model router conectado, investigación web autónoma, memoria de aprendizaje aprobada ni RBAC fino; no se declara autosuficiencia. El panel inicial de consola y API ahora se complementa con `/admin/operaciones`.

## Operación local reproducible

Desde apps/api, usar una BD local aislada y aplicar únicamente `migrations/024_intelligence_jobs.sql`. No ejecutar el migrador histórico completo contra producción. La migración nueva NO está añadida al arranque automático. Su rollback preparado en `migrations/down/024_intelligence_jobs.sql` rechaza cualquier tabla con trabajos/eventos.

```
npm run build
# DATABASE_URL apunta a la BD local preparada
npm run intelligence -- enqueue pilot-v1 ../../docs/intelligence/pilot-brief.json
npm run intelligence -- work
npm run intelligence -- dashboard
npm run intelligence -- detail UUID
npm run intelligence -- cancel UUID
npm run intelligence -- retry UUID
```

`work` procesa como máximo un trabajo y termina. Puede ser invocado por scheduler/cron bajo demanda; NO se instaló uno. CLI requiere acceso directo a BD y es herramienta de operador, no interfaz pública. API `/api/admin/intelligence` reutiliza bearer admin; desactivada salvo `INTELLIGENCE_ENABLED=true`. GET lista100/detalle; POST crea; POST /UUID/cancel y /UUID/retry. Sin approve, publish ni acceso a artículos. No enviar secretos ni datos personales en briefs.

Pruebas: `INTELLIGENCE_TEST_DATABASE_URL=.../aromia_intelligence_test npm run test:intelligence`. Workflow aislado `Intelligence persistence` añadido, sin modificar workflows OMNI.

## Siguiente actor y compuerta

NEXT_ACTOR: Code. NEXT_ACTION: revisar CI del nuevo lote; ampliar panel operativo y persistencia de etapas/artefactos para un piloto editorial, sin declarar completo el expediente actual. Para investigación/generación real: seleccionar y validar un proveedor disponible con presupuesto autorizado o un runner local; preservar fuentes y revisiones de Voice Bible. Revisar derechos y backlog43/100 y nueve SubBatch sin duplicarlos. No fabricar artículo/fuentes para llenar el gate.

BLOCKERS: endpoint/credenciales OMNI no verificados; runtime/modelo de producción no configurado; autorización de coste y publicación ausente. Son bloqueos de esas integraciones, no del motor local probado. Sin merge, despliegue, publicación, cambios de datos de producción ni cambios de OMNI autorizados por este lote.


## Lote siguiente — panel privado, versiones y lenguaje público (17-11-2026)

- CI remoto de `8ffd664`: SUCCESS en persistencia, web, API, código e importador. Referencia: https://github.com/francoisbowman-cloud/aromia-lab/actions/runs/44009255470. Esta evidencia corresponde al lote anterior, no al nuevo commit.
- `/admin/operaciones`: lista/detalle, creación de expediente, conservación de campos tras error, cancelación confirmable y reintento de fallidos; usa sesión y proxy administrativo existentes. Token del API nunca llega al cliente. No ejecuta publicación ni inicia proveedores.
- Migración opt-in025: versiones anexadas de notas de investigación, borradores, revisión factual, edición, brief visual e informeQA. Cada registro guarda fuentes y actor administrativo (sin identidad individual inventada). Lock por expediente y versión esperada evitan sobrescritura concurrente. Solo admite trabajos awaiting_review y fuentes ya aportadas. Guardar fact_check o qa_report NO aprueba su contenido.
- Panel permite escribir/leer versiones; CLI `append-artifact UUID FILE` y `artifacts UUID`. API GET/POST `/api/admin/intelligence/:id/artifacts`. JSON de entrada: kind, content, sourceUrls, expectedVersion. Listado limitado a100 versiones recientes; las anteriores siguen enBD. La migración025 se aplica después de024; rollback en orden inverso y solo con tablas vacías. No se añade ninguna al arranque de producción.
- Portada/Saber: sustituida la reiteración de IA por Ilustración digital/Adaptación digital; retirado el sello “sin reconstrucción IA”. Autores, enlaces de licencia y archivos de procedencia permanecen. No se presentan las ilustraciones como fotografías documentales. Sin regeneración de imágenes ni rediseño.
- Verificación local: 61 pruebas web del lote del panel, lint/tipos, build API y pruebas PostgreSQL extendidas correctos. Build optimizado web final también completado correctamente en copia aislada. Concurrencia de versiones: una escritura gana y la otra recibe conflicto; v1 se conserva tras v2; fuentes desconocidas y tipos publish se rechazan; trabajo cancelado no admite versiones.
- Navegador real conAPI/BD local: autorización, creación, worker, lectura, dos versiones, consulta de v1, cancelación/conservar, recarga y error503 inyectado con campos preservados. 390px sin desbordamiento. Inspección de capturas de móvil y escritorio. Portada y Saber sin palabra IA visible. La prueba inicial del selector role=alert chocó con el anunciador de Next; se corrigió el selector de la prueba y el recorrido final pasó.
- Evidencia local temporal: `/tmp/aromia-versions-qa-final.log`, `/workspace/aromia-evidence/operations-{desktop,mobile}.png`. No son certificación de producción ni garantía de que estos archivos sobrevivan a otra restauración.
- Aplicación local de024/025 exclusivamente a aromia_dev y esquemas temporales de pruebas. Ninguna escritura en producción. Datos QA locales identificados por título QA operaciones.

NEXT_ACTOR: Code. NEXT_ACTION: revisar CI del lote actual y conectar captura/verificación de fuentes y ejecución de etapas mediante capacidades disponibles, antes de presentar un piloto completo. Siguen pendientes investigador/model router, approvals humanos vinculados a versión, presupuestos y scheduler autorizado. No sustituirlos por una plantilla que finja investigar. El trabajador solo prepara el expediente suministrado; las versiones de esta prueba fueron textos QA aportados, no un artículo autónomo real.
