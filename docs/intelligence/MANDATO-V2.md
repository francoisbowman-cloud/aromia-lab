# AROMIA — MANDATO MAESTRO DE EVOLUCIÓN AUTÓNOMA
**Versión:** 2.0 — 16 de noviembre de 2026  
**Proyecto:** Aromia  
**Repositorio:** `francoisbowman-cloud/aromia-lab`  
**Responsable de ejecución:** Claude Code / Opus  
**Misión:** Construir la infraestructura autosuficiente de una revista editorial inteligente.

---

## 0. MANDATO FUNDAMENTAL

Actúa simultáneamente como Principal Software Architect, AI Systems Engineer, Editorial Technology Director, Creative Technology Director, Product Engineer, Growth Engineer y Quality Assurance Lead.

Tu misión no consiste únicamente en auditar, documentar o proponer ideas.

**Debes investigar, diseñar, implementar, integrar, probar y perfeccionar progresivamente la infraestructura necesaria para que Aromia funcione como una revista editorial autosuficiente.**

Trabaja directamente en el repositorio, con autonomía técnica y criterio profesional, dentro de los límites de autorización establecidos.

No requieras que el usuario programe, configure manualmente cada componente o coordine múltiples agentes.

No reemplaces la visión editorial por una tienda, un catálogo comercial ni una plataforma genérica de contenidos.

Aromia es una revista cultural de perfumería. Su identidad editorial es su principal activo.

**Principio rector:**

> Aromia debe poder pensar editorialmente, investigar, producir, presentar, distribuir, medir y aprender mediante procesos propios, preservando siempre la calidad, la trazabilidad y la autoridad humana.

---

## 1. AUTORIDADES DOCUMENTALES Y ESTADO REAL

Antes de implementar:

1. Lee `AROMIA_PLAN_MAESTRO.md`, si está disponible.
2. Lee `AROMIA_CURRENT_STATE.md`.
3. Lee `AROMIA_EDITORIAL_WORKFLOW.md`.
4. Lee `AROMIA_VOICE_BIBLE.md`.
5. Lee los documentos vigentes de Art Direction y el protocolo de handoff.
6. Lee `docs/mission-185/ESTADO-ACTUAL.md`.
7. Lee `docs/mission-185/CONTINUATION.md` y `TRACEABILITY.md`.
8. Lee `docs/design/sensory-editorial-185.md` y `docs/design/editorial-world-185.md`.
9. Inspecciona la PR #186, la rama `feat/185-release-foundation`, su CI, los commits posteriores y las decisiones documentadas.

Determina qué está implementado, qué funciona, qué es parcial y qué continúa siendo una propuesta.

El último estado comunicado indica que la PR #186 contiene importantes mejoras visuales, de navegación, CMS y UX, pero que su integración en `main` y despliegue estaban detenidos.

No presupongas que esta situación permanece inalterada. Verifícala.

**No descartes, sobrescribas ni reconstruyas innecesariamente el trabajo existente.**

La evolución debe ser acumulativa.

Si faltan documentos, identifica las fuentes disponibles y registra la ausencia sin inventar su contenido.

---

## 2. ARQUITECTURA OBJETIVO

Construye Aromia como un núcleo modular integrado, no como una colección innecesaria de aplicaciones independientes.

Los dominios principales serán:

- Aromia Intelligence
- Editorial Operations
- Creative & Advertising Studio
- Living Edition
- Discovery & Reader Experience
- Marketing & Distribution
- Revenue & Affiliates
- Analytics & Learning
- Quality, Security & Governance
- OMNI Integration Adapter

Estos módulos deberán compartir contratos claros, identidad editorial, trazabilidad, observabilidad y políticas de seguridad.

Preserva Next.js, API, PostgreSQL, Redis, Railway y los componentes actuales cuando sean apropiados.

No introduzcas microservicios, proveedores, bases de datos o frameworks adicionales sin una necesidad demostrable.

Favorece interfaces estables, módulos sustituibles, operaciones idempotentes y evolución incremental.

---

## 3. AROMIA INTELLIGENCE — NÚCLEO AUTÓNOMO

Este será el corazón de la evolución.

Implementa progresivamente un sistema capaz de:

- Detectar oportunidades editoriales.
- Investigar temas relevantes con fuentes verificables.
- Proponer historias, ensayos, guías y contenidos culturales.
- Organizar prioridades y calendario.
- Coordinar especialistas editoriales y técnicos.
- Ejecutar trabajos en segundo plano.
- Registrar decisiones y aprender de resultados aprobados.
- Identificar fallos y solicitar o ejecutar correcciones permitidas.
- Medir calidad, costes, tiempos y rendimiento.
- Recuperarse de interrupciones sin perder el estado.

### Componentes esenciales

**Orchestrator:** coordina los flujos y decide qué tarea corresponde a cada capacidad.

**Agent Registry:** define responsabilidades, permisos, herramientas y límites de cada agente.

**Model Router:** selecciona modelos según complejidad, calidad requerida, disponibilidad y coste.

**Persistent Memory:** conserva decisiones editoriales, fuentes, criterios visuales, resultados y preferencias aprobadas.

**Job Engine:** administra trabajos persistentes, colas, reintentos, cancelaciones, prioridades y recuperación de errores.

**Policy Engine:** impone reglas editoriales, financieras, de publicación y seguridad.

**Evaluation Engine:** verifica resultados y permite aprender de decisiones aprobadas.

**Operations Dashboard:** presenta trabajos, costes, bloqueos, aprobaciones, resultados y próximos pasos.

No construyas agentes permanentes que consuman recursos sin necesidad. Utiliza ejecución por eventos, trabajos programados y procesos bajo demanda.

Claude Code es una herramienta de desarrollo; la operación de Aromia no debe depender de mantener abierta una sesión de Claude.

---

## 4. EDITORIAL OPERATIONS

Construye un pipeline editorial real:

**Oportunidad → Investigación → Fuentes → Propuesta → Borrador → Verificación → Edición → Dirección de arte → QA → Aprobación → Publicación → Distribución → Evaluación.**

Cada etapa debe tener:

- Responsable o agente asignado.
- Entradas y salidas estructuradas.
- Evidencias verificables.
- Estado persistente.
- Criterios de aceptación.
- Historial de versiones.
- Posibilidad de revisión y reanudación.

Aplica rigurosamente la Voice Bible y el workflow existentes.

Distingue hechos, interpretaciones, opiniones y material creativo.

No inventes declaraciones, biografías, referencias históricas, propiedades de fragancias ni atribuciones de perfumistas.

Las fuentes deben ser rastreables.

Recupera el backlog editorial histórico de 100 artículos, incluidos los nueve textos de SubBatch 01, sin presumir que estén aprobados ni duplicar contenidos.

La automatización puede preparar publicaciones, pero la publicación pública debe respetar la política de aprobación vigente.

---

## 5. LIVING EDITION — LA REVISTA VIVA

Aromia debe comportarse como una publicación editorial dinámica, no como una página de inicio estática.

Desarrolla un sistema de composición que permita:

- Portadas editoriales con variaciones deliberadas.
- Jerarquías visuales adaptadas a las historias.
- Fotografía integrada con titulares y narrativas.
- Ritmo compositivo entre secciones.
- Ediciones temáticas y archivos históricos.
- Recomendaciones contextuales.
- Módulos especiales para contenidos destacados.
- Experiencias adaptadas a móvil y escritorio.

Preserva la dirección sensorial desarrollada en la misión #185.

No sustituyas su identidad por diseños aleatorios.

Separa contenido, estructura semántica y presentación visual.

Evalúa las limitaciones reales del CMS y renderer antes de modificar Tiptap o el almacenamiento.

Construye primitivas editoriales reutilizables y composiciones excepcionales cuando exista una razón narrativa.

Las variaciones automáticas deben pasar pruebas de contraste, legibilidad, rendimiento, accesibilidad e integridad editorial.

---

## 6. CREATIVE & ADVERTISING STUDIO

Aromia debe disponer de capacidades creativas internas para producir y gestionar:

- Fotografía editorial.
- Ilustraciones y composiciones.
- Recursos de materiales e ingredientes.
- Campañas gráficas.
- Reels y videos cortos.
- Microdocumentales.
- Anuncios audiovisuales.
- Adaptaciones por plataforma.
- Material promocional de artículos y ediciones.

Diseña un flujo:

**Brief → Concepto → Guion → Storyboard → Recursos → Producción → Montaje → QA → Aprobación → Distribución.**

Cada recurso debe registrar procedencia, licencia, coste, versión y contexto de utilización.

Prioriza material documental auténtico cuando la pieza lo requiera.

No presentes imágenes sintéticas como fotografías documentales.

Evalúa proveedores audiovisuales según calidad, disponibilidad, costes, derechos, coherencia y facilidad de integración.

No dupliques el Motion Engine de OMNI dentro de Aromia.

Si el motor audiovisual externo todavía no está disponible, implementa contratos y un flujo alternativo verificable con capacidades existentes.

No declares generados videos que solo existan como guiones, simulaciones o mocks.

---

## 7. MARKETING & DISTRIBUTION ENGINE

El marketing debe formar parte de la operación central de Aromia.

Implementa progresivamente:

- SEO técnico y editorial.
- Calendario de distribución.
- Newsletter.
- Preparación de campañas sociales.
- Adaptación de contenidos por canal.
- UTMs y atribución.
- Experimentos A/B.
- Análisis de adquisición y retención.
- Gestión de campañas y presupuestos.
- Registro de hipótesis y aprendizajes.

### Intent-to-Editorial Engine

Desarrolla la capacidad de identificar preguntas y necesidades reales relacionadas con perfumes y olfacción.

Ejemplos:

- Qué perfume elegir para una primera cita.
- Cómo escoger una fragancia discreta para una entrevista.
- Cómo encontrar un perfume apropiado para regalar.
- Cómo mejorar la duración de una fragancia.
- Cómo descubrir preferencias olfativas personales.

El recorrido debe conectar:

**Necesidad → Anuncio o contenido → Guía útil → Discovery → Lecturas relacionadas → Acción voluntaria.**

Las campañas deben ser creativas y persuasivas, pero nunca prometer que un perfume garantiza éxito romántico, profesional o social.

No actives anuncios pagados sin autorización y presupuesto aprobado.

---

## 8. REVENUE & AMAZON AFFILIATES

Amazon Afiliados fue reportado como conectado a Aromia.

Primero verifica la integración real. No la reconstruyas innecesariamente.

Implementa o mejora:

- Enlaces de afiliación contextuales.
- Transparencia de relaciones comerciales.
- Registro de clics salientes.
- Atribución cuando los datos disponibles lo permitan.
- Validación de enlaces.
- Informes de ingresos y costes.
- Ubicaciones publicitarias editoriales discretas.
- Preparación de acuerdos comerciales futuros.

Respeta las condiciones aplicables de Amazon Associates, especialmente las reglas sobre precios, imágenes, divulgaciones y uso de enlaces.

La afiliación no debe determinar qué historias merecen publicarse.

**La independencia editorial tiene prioridad sobre la monetización.**

Mide rentabilidad real, no únicamente clics o impresiones.

---

## 9. DISCOVERY, LECTORES Y PWA

Consolida Discovery como un sistema de conocimiento y exploración olfativa.

Relaciona:

- Familias y subfamilias.
- Notas y materiales.
- Perfumistas.
- Fragancias.
- Historias.
- Guías.
- Preferencias y resultados del cuestionario.

Desarrolla búsqueda y filtrado eficientes, preferentemente server-side cuando corresponda.

Evalúa una PWA con lectura instalable, guardados, biblioteca personal y lectura sin conexión.

No implementes funciones de personalización invasivas ni recopiles datos innecesarios.

El objetivo es enriquecer la experiencia de lectura y aumentar el retorno voluntario del público.

---

## 10. OMNI — INTEGRACIÓN EXTERNA

OMNI es un proyecto independiente.

Su repositorio de referencia es:

`francoisbowman-cloud/image-toolkit`

La revisión reciente identificó en `main` el commit `bafa1188`, que documenta un ciclo creativo autónomo con observación visual, diagnóstico, cambios aislados, pruebas de preservación, aprobación y rollback.

También se documentaron herramientas MCP como:

- `omni_creative_cycle`
- `omni_record_creative_verdict`
- `omni_apply_creative_candidate`

**No presupongas que estas interfaces están desplegadas ni disponibles en producción. Verifica la versión y el contrato actuales.**

Implementa exclusivamente dentro de Aromia un adaptador para consumir servicios de OMNI.

El adaptador debe contemplar autenticación, permisos, contratos versionados, timeouts, colas, trazabilidad, costes, fallbacks y degradación elegante.

OMNI podrá evaluar y dirigir composiciones visuales de Aromia, pero no será responsable de su CMS, estrategia editorial, marketing, afiliación ni datos de lectores.

No modifiques el repositorio de OMNI como parte de este mandato.

No conviertas OMNI en una dependencia obligatoria para que Aromia pueda funcionar.

---

## 11. ANALYTICS & CONTINUOUS LEARNING

Construye un sistema de medición útil para decisiones reales.

Métricas prioritarias:

- Lectores nuevos y recurrentes.
- Tiempo de lectura e interacción.
- Rendimiento de artículos.
- Tráfico orgánico.
- Rendimiento de Discovery.
- Clics de afiliación.
- Ingresos atribuibles disponibles.
- Coste por artículo y creativo.
- Coste operativo de IA.
- Tasa de tareas autónomas completadas.
- Fallos, reintentos y correcciones.
- Calidad editorial y visual.
- Rendimiento técnico y accesibilidad.

Los agentes podrán proponer mejoras basadas en datos, pero no convertir correlaciones en conclusiones causales sin evidencia.

Distingue claramente métricas observadas, estimaciones e hipótesis.

---

## 12. QUALITY, SECURITY & GOVERNANCE

Implementa controles transversales:

- Validación factual y editorial.
- Derechos y procedencia de recursos.
- Control de acceso por rol.
- Protección de secretos y datos.
- Seguridad de integraciones externas.
- CI y pruebas automatizadas.
- QA visual y responsive.
- Accesibilidad.
- Rendimiento.
- Logs y trazabilidad.
- Límites financieros.
- Rollback.
- Recuperación ante fallos.
- Revisión humana en operaciones sensibles.

No permitas que agentes ejecuten libremente cambios irreversibles.

Separa claramente las capacidades de proponer, preparar, aprobar y ejecutar.

---

## 13. ESTRATEGIA DE IMPLEMENTACIÓN

No intentes construir todo simultáneamente.

Organiza la ejecución en fases con entregables funcionales.

### Fase 0 — Reconciliación y baseline

Verifica el estado de la PR #186 y del repositorio. Recupera decisiones, identifica componentes reutilizables y establece una línea base técnica.

**Gate:** estado real demostrado, sin pérdida de trabajo.

### Fase 1 — Fundación operativa

Implementa el núcleo mínimo de Aromia Intelligence: trabajos persistentes, orquestación, políticas, estados, observabilidad y panel operativo.

**Gate:** trabajos que sobreviven a reinicios, se pueden reintentar y dejan evidencias.

### Fase 2 — Primer ciclo editorial autónomo

Implementa un recorrido completo desde una oportunidad editorial hasta un artículo preparado para aprobación, con investigación, verificación, edición, arte y QA.

**Gate:** un piloto real completado sin coordinación manual de cada etapa.

### Fase 3 — Living Edition y dirección visual

Conecta el pipeline editorial con el sistema de composición existente y, cuando sea viable, con el adaptador externo de OMNI.

**Gate:** una pieza editorial completa, visualmente revisada y reproducible.

### Fase 4 — Marketing y Revenue

Integra preparación de campañas, distribución, newsletter, analítica y afiliación contextual.

**Gate:** recorrido medible desde contenido hasta interacción comercial voluntaria, sin compras de anuncios no autorizadas.

### Fase 5 — Creative Studio audiovisual

Integra la producción de recursos y videos mediante capacidades propias o proveedores externos.

**Gate:** una pieza audiovisual real, revisada, reproducible y con costes registrados.

### Fase 6 — Discovery, PWA y optimización

Consolida experiencia de lectura, búsqueda, relaciones de conocimiento, retorno de lectores y aprendizaje operativo.

**Gate:** experiencia estable y mejoras respaldadas por evidencia.

### Fase 7 — Endurecimiento y expansión

Audita seguridad, accesibilidad, rendimiento, costes, resiliencia y capacidad de crecimiento.

**Gate:** operación repetible, observable, segura y preparada para escalar.

---

## 14. AUTONOMÍA DE EJECUCIÓN

No te limites a entregar informes.

Después de establecer el baseline, implementa el siguiente lote seguro y verificable.

Puedes:

- Crear módulos y pruebas.
- Corregir defectos.
- Refactorizar componentes acotados cuando sea necesario.
- Preparar migraciones reversibles.
- Crear documentación técnica.
- Ejecutar pruebas locales.
- Preparar integraciones.
- Crear commits y ramas de trabajo conforme al flujo vigente.

No puedes, sin autorización expresa:

- Hacer merge a `main`.
- Desplegar en producción.
- Publicar artículos o campañas públicamente.
- Activar anuncios pagados.
- Contratar servicios o consumir créditos de pago no autorizados.
- Ejecutar migraciones destructivas.
- Alterar datos de producción.
- Modificar OMNI.
- Realizar operaciones irreversibles.

Ante una operación que requiera autorización, prepara todo lo posible y detente únicamente en esa compuerta.

No conviertas cada decisión técnica rutinaria en una pregunta al usuario.

---

## 15. CONTROL DE AVANCE

Mantén un tablero persistente dentro del repositorio con:

- Fase y tarea.
- Estado real.
- Responsable.
- Dependencias.
- Evidencia.
- Commit o PR.
- Pruebas.
- Riesgos.
- Costes.
- Bloqueos.
- Próximo paso.

Actualiza el handoff después de cada lote significativo.

No declares terminada una funcionalidad por existir documentación o mocks.

No generes informes extensos como sustituto de trabajo funcional.

Prefiere entregables pequeños, comprobables y acumulativos.

---

## 16. PRIMERA EJECUCIÓN

Comienza ahora con:

1. Recuperar el estado real de Aromia después del encargo de CI de la PR #186.
2. Leer y reconciliar las autoridades documentales.
3. Inspeccionar la arquitectura y reutilizar lo existente.
4. Verificar qué contratos de OMNI están realmente disponibles.
5. Identificar el mínimo núcleo de Aromia Intelligence que puede construirse sin comprometer la revista.
6. Implementar ese primer lote en una rama apropiada, sin afectar la rama de publicación pendiente.
7. Ejecutar pruebas y documentar evidencias.
8. Continuar con el siguiente lote seguro cuando las pruebas y las políticas lo permitan.

El primer resultado significativo debe ser **un núcleo operativo funcional**, no únicamente una propuesta arquitectónica.

El siguiente resultado debe ser **un piloto editorial autónomo verificable**, con trazabilidad, costes, QA y aprobación humana.

No declares que Aromia es autosuficiente hasta demostrar que sus procesos pueden ejecutarse, recuperarse y medirse sin una sesión de desarrollo permanente.

---

## 17. DEFINICIÓN FINAL DE ÉXITO

Consideraremos alcanzado el siguiente gran hito cuando Aromia pueda:

1. Detectar o recibir una oportunidad editorial.
2. Investigarla con fuentes.
3. Producir y revisar un artículo.
4. Preparar su dirección visual.
5. Someterlo a controles de calidad.
6. Solicitar aprobación.
7. Preparar su publicación y distribución.
8. Registrar métricas y costes.
9. Conservar decisiones y aprendizajes.
10. Reanudar el flujo después de fallos o reinicios.

Todo mediante infraestructura propia y procesos persistentes, sin necesidad de que el usuario coordine manualmente cada agente.

**Aromia no debe limitarse a parecer una revista extraordinaria. Debe disponer de la infraestructura necesaria para convertirse en una organización editorial digital extraordinaria.**

Comienza la ejecución.