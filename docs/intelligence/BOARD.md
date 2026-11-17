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


## Captura de fuentes y revisión vinculada a versiones — lote 17-11-2026

CI previo `1a2413f`: persistencia, web, API, código e importador SUCCESS (workflow persistencia44112339108). Controles omitidos siguen sin equivaler a aprobación.

Implementado:
- Migración opt-in026: capturas inmutables por URL/hash y decisiones editoriales anexadas. Aplicar después de024/025; rollback inverso solo si no hay datos. No forma parte del arranque de producción.
- Recuperación HTTPS con allowlist cerrada (en.wikipedia.org, pmc.ncbi.nlm.nih.gov y raw.githubusercontent.com limitado al repositorio Aromia y SHA40), sin credenciales, puertos alternativos, fragmentos ni redirecciones; timeout15s, texto y máximo1MiB. No ejecuta HTML/instrucciones de fuentes. Recuperación no es verificación de hechos/licencias. Coincidencia del extracto es literal y conservadora; HTML puede producir falsos negativos que quedan pendientes.
- CLI `capture-source UUID URL`, `research UUID` (recorre fuentes suministradas, conserva éxitos, registra fallos y reutiliza capturas al reanudar), `review-package UUID`. No es descubrimiento de nuevas fuentes ni generación de texto.
- Paquete identifica versiones últimas de seis materiales, fuentes capturadas y hash del conjunto. Una nueva versión/captura invalida la correspondencia de la revisión anterior. Presencia de materiales no implica calidad.
- Endpoint POST /api/admin/intelligence/:id/review requiere adminAuth y una credencial editorial separada EDITORIAL_REVIEW_TOKEN, distinta de ADMIN_API_TOKEN, además de hash/decisión/nota/confirmación. No hay proxy web ni capacidad del worker que emita aprobaciones. Actor registrado: publisher_credential (credencial compartida, no identidad personal inventada). Sin token configurado devuelve403.
- El panel muestra paquete, carencias, huellas y vigencia de revisión. Ninguna decisión cambia artículos ni estado público; publication sigue blocked. Aprobación editorial y autorización de despliegue son operaciones distintas.

Evidencia:
- Cinco pruebas API con PostgreSQL: recuperaciones y límites, auth, concurrencia, versiones, bloqueo de revisión incompleta, conflicto de hash, invalidación tras edición; cambios de publicación ausentes. Las aprobaciones de prueba se crean solo en schema aleatorio de *_test y se eliminan al terminar.
- Build API, lint/tipos web y build optimizado web final correctos. Navegador local volvió a pasar el recorrido con paquete, versiones, cancelación, recarga, fallo503 conservando campos y ausencia de IA visible en portada/Saber.
- Captura REAL sin modelo/pago: Voice Bible fijada a1619c77, SHA256 f5c20725080b97d1e407ff308c59a4b070c2127c0f4050256bb31b7a140f00d2, extracto “Nunca inventes experiencias personales” localizado. Job local6c1ef028-5095-48d7-a57f-7064bb061e3f; factualApproval=false. Se conserva el expediente al ejecutar en otro proceso; research reutiliza captura. No se afirma un artículo ni investigación científica terminados.
- Entorno local Node24 necesitó NODE_USE_ENV_PROXY=1 para la recuperación real a través del proxy configurado; el runtime del proyecto en Node20 debe verificarse en su propia red. No se desactivó TLS ni se añadieron credenciales a las URLs.

Bloqueo real para redacción autónoma: no se identificó proveedor de texto operativo ni presupuesto autorizado. La única variable de entorno coincidente era OPENAI_CLUSTER, que no acredita una API de generación utilizable ni autorización de gasto. Se solicitó proveedor/presupuesto sin pedir claves por chat. No se han consumido créditos ni creado una falsa ejecución autónoma con contenido manual.

NEXT_ACTOR: Code. Con respuesta de proveedor/presupuesto y secretos por canal seguro, implementar router/contador de costes y piloto editorial real hasta aprobación humana; entretanto revisar CI de este lote. Fases audiovisuales y publicación mantienen sus compuertas. No declarar autosuficiencia ni cierre del Master Plan.


## Recuperación trazable del backlog — 17-11-2026

- CI de `16162f0d168e5517a89842ff39e494010789843c`: cinco controles ejecutados SUCCESS (persistencia, web, API, código e importador). Persistencia: https://github.com/francoisbowman-cloud/aromia-lab/actions/runs/44114447353. Siete controles SKIPPED no acreditan producción ni QA visual. PR187 abierta en borrador.
- Script `scripts/intelligence-import-draft.mjs`: recupera un manuscrito de un SHA40 de Git, conserva bytes, autoría y metadatos, añade versión1 y registra procedencia fijada. Solo admite BD localhost *_dev o *_test. Repetir no duplica; contenido diferente exige revisión deliberada. No hereda aprobaciones históricas, no publica. Worker dirigido al expediente evita consumir otros trabajos.
- Piloto: `drafts/cuando-ya-no-hueles-tu-perfume.md` desde main1619c77, expediente local `11a5aa59-c29f-4587-abb2-157668596f4b`. Dos importaciones conservan identidad, versión1 y SHA256. Evidencia durable: [recibo del piloto](evidence/backlog-pilot.json). El contenido capturado y la BD local son temporales; el manuscrito original sigue versionado en Git.
- Recuperadas tres fuentes: original fijado, Wikipedia y PMC. Solo el título del original coincide literalmente. Los rótulos de enlaces se importan como extractos candidatos, NO como citas verificadas. Wikipedia/PMC permanecen `source_excerpt_unmatched`. Perfumer & Flavorist y OUP permanecen sin captura por `source_not_allowed`; no se afirma que los servidores estén caídos ni se amplía la allowlist para pasar controles.
- CLI ahora expone causas sanitizadas de recuperación. Paquete distingue ausencia de captura de extracto no coincidente; ambos bloquean aprobación. Faltan notas de investigación, fact checking, edición, dirección artística, QA y revisión humana. Este piloto recupera trabajo existente; no demuestra generación autónoma.
- Inventario ejecutado: 100 entradas de agenda, 49 archivos de borrador, 43 entradas cubiertas y57 pendientes. Archivos y cobertura no son métricas equivalentes.

Reproducir después de aplicar024/025/026 a una BD local aislada y compilar API:

```sh
# Configurar DATABASE_URL de la BD local mediante el entorno.
node scripts/intelligence-import-draft.mjs drafts/cuando-ya-no-hueles-tu-perfume.md 1619c776560f5d6f9c5948f8092ff5241540048f
node apps/api/dist/intelligence/cli.js research UUID_DEVUELTO
node apps/api/dist/intelligence/cli.js review-package UUID_DEVUELTO
```

Validación local de este lote: build API y seis pruebas de persistencia/fuentes/revisión; reimportación real idempotente; reanudación reutiliza las tres capturas. Sin cambios visuales en este lote. El workflow incluye el importador en sus rutas y valida sintaxis; la prueba de importación real fue local, no se presenta como prueba automatizada de CI.

NEXT_ACTOR: Code. NEXT_ACTION: comprobar CI de este lote y continuar revisión factual del piloto con fuentes permitidas; para generación autónoma implementar proveedor y presupuesto solo al disponer de autorización y secretos seguros. BLOCKERS: proveedor/gasto no resueltos, dos dominios no permitidos, extractos y revisión editorial pendientes, derechos/arte/QA pendientes; OMNI remoto sin validar. No merge, despliegue, publicación ni cambios de OMNI. El Master Plan continúa abierto.


## Conversación visual incorporada y fidelidad comercial — 17-11-2026

La dirección del mockup y las reservas sobre productos reales quedan incorporadas a [visión y lista de pendientes](VISION-Y-PENDIENTES.md), con fases0–7, criterios de cierre y límites. No se sustituye el Master Plan por un rediseño. El concepto del chat no está ingestado como activo ni publicado.

CI0888145 confirmado: cinco SUCCESS y siete SKIPPED; PR187 sigue abierta en borrador. Hallazgo real en resolver Amazon: una búsqueda podía seleccionar un producto distinto y un ASIN cambiaba de marketplace. Corrección acotada: búsquedas no producen packshots inferidos; destinos explícitos preservan marketplace y parámetros. Pruebas de regresión para búsqueda, variante y fallo de recuperación. No certifica derechos de imágenes ni correspondencia de todos los registros históricos.

NEXT_ACTOR: Code. NEXT_ACTION: verificar CI del lote y seguir el orden de tareas de VISION-Y-PENDIENTES.md. BLOCKERS: se mantienen los de proveedor/presupuesto, fuentes, derechos y revisión editorial. Sin nuevas generaciones de imágenes, gasto de proveedores, merge, publicación, despliegue ni cambios OMNI.

Validación local de este lote:64 pruebas web (18 archivos), typecheck y lint correctos; diff sin errores de whitespace. El build y CI remoto se verifican por SHA después del push.

## Calidad de imagen y ciclo de mejora — 17-11-2026

Feedback del Publisher persistido con SHA del recurso de bergamota y estado replacement_requested; dirección de sustitución en visual/BERGAMOTA-CAPSULA.md. No se sustituye silenciosamente la evidencia anterior ni se interpreta una generación como aprobación. El protocolo de aislamiento visual requiere contexto limpio; este lote prepara la cápsula sin generar.

Monitor determinista sin coste de proveedor añadido: imágenes ausentes/compartidas, concentración ambigua, activo ausente/cambiado desde el feedback. Tres pruebas del monitor pasan. Baseline50 y API local50 arrojan concentración no verificada de Chance Eau Tendre; no demuestran ausencia de errores visuales ni describen producción. La auditoría histórica de Sauvage fue reconciliada: el nombre se corrigió a EDT manteniendo slug legado, por eso no se vuelve a marcar como error por sufijo.

Corrección concreta del resolver oficial: concentración desconocida no selecciona EDP. Pruebas unitarias y ruta de imagen verifican fallback neutro cuando no hay fuentes. Nueva CI Image quality signals genera informe de señales; SUCCESS no significa identidad/derechos aprobados. Producción/automejora integral pendientes.

NEXT_ACTOR: Code. NEXT_ACTION: verificar CI, revisar correspondencia producto por producto sobre catálogo actual autorizado y completar la sustitución de bergamota desde la cápsula visual aislada; continuar piloto editorial según VISION-Y-PENDIENTES.md. BLOCKERS: identidad/derechos de imágenes sin revisión completa, nueva bergamota pendiente, proveedor/presupuesto del piloto sin resolver. Sin merge, publicación, despliegue o cambios de OMNI.

Validación del lote:75 pruebas web, tres del monitor, tipos y lint correctos. Playwright (Browser plugin no disponible) sobre localhost:3000/catalogo/chance-eau-tendre a1440 y390px: título/H1 correctos, contenido presente, sin errores de página ni desbordamiento; menú abre/cierra. Capturas inspeccionadas en /tmp/aromia-product-quality-{1440,390}.png, temporales. Se observó marcador “Imagen no disponible”: no se certifica la recuperación remota ni la identidad de una imagen ausente. No hay cambio de composición ni reemplazo de la bergamota en este lote.
