Source: https://github.com/francoisbowman-cloud/aromia-lab/issues/185
Retrieved: 2026-11-13 via GitHub HTML embedded issue data; GitHub API blocked by current network policy.

# AROMIA — Mandato maestro de finalización autónoma
**Orden del Publisher — 13 noviembre 2026.**
**Modelo elegido:** GPT-6 Astra Pro cuando esté disponible en Codex; en su defecto GPT-6 con el máximo nivel de razonamiento disponible. **Entorno ejecutor:** Codex sobre el checkout completo de `francoisbowman-cloud/aromia-lab`, con entorno local, pruebas en navegador y herramientas conectadas. La selección de modelo no activa por sí sola una ejecución autónoma.

## Resultado exigido
Transformar Aromia en una revista pública extraordinaria, consumible, rigurosa, original, rápida, accesible, estable y lista para compartir con orgullo. No entregar únicamente informes, prototipos, diagnósticos ni backlog. Ejecutar el trabajo de punta a punta en iteraciones, con pruebas y correcciones. El Publisher no debe coordinar tareas, escoger tickets, supervisar PRs rutinarios ni revisar cada paso.

## Reconstrucción integral de contexto, sin omisiones
1. Inspeccionar la versión real de main, ramas, PRs, issues, código, despliegue, historial de commits, contenidos, base de datos, estado de producción y artefactos del proyecto. El archivo `AROMIA_CURRENT_STATE.md` verificado al preparar este mandato estaba en v54 (2026-09-20), con PR #178 todavía descrito como abierto y deuda visual/editorial pendiente; **revalidar todo en vivo antes de actuar**.
2. Leer `AROMIA_CURRENT_STATE.md`, `AROMIA_EDITORIAL_WORKFLOW.md`, `AROMIA_VOICE_BIBLE.md`, `docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md`, los manuales operativos, Foundation, Design Lab, tickets, auditorías, handoffs, decisiones, informes OMNI, documentación de imágenes y todos los materiales pertinentes.
3. Recuperar y comparar todas las instrucciones históricas del Publisher a las que el entorno tenga acceso. Si chats pasados no son accesibles, NO fingir haberlos leído: reconstruir mediante Git y documentos; dejar visible la brecha de evidencia.
4. Crear una **matriz de trazabilidad** de todas las ideas, problemas, decisiones y experimentos: origen y fecha → situación anterior → reevaluación → decisión actual → prueba/implementación o justificación de no implementación. Nadie debe descartar ideas silenciosamente; incluso las desestimadas deben examinarse.

## Visión y estética
Aromia es una **revista editorial de perfumería**, no un e-commerce disfrazado. Historias, ensayos, cultura, materiales, personas/perfumistas, reseñas selectivas, Saber con guías, Discovery, familias y subfamilias olfativas, búsqueda, catálogo contextual y autoría humana. Afiliación discreta, jamás motivo estructural de escritura. Aplicar Voice Bible: observación, curiosidad, contradicción auténtica, investigación honesta, especificidad, legibilidad, voces humanas sin experiencias fabricadas. Diseño de revista con composición, ritmo, blancos, fotografías documentales o visuales originales, tipografía y móvil tan cuidados como escritorio.

**Reconsiderar expresamente lo experimental y lo descartado:** 3D, WebGL, profundidad/perspectiva, paralaje, motion, transiciones, microinteracciones, portadas inmersivas, imagen que invade o dialoga con el título, diseños fuera de la retícula, narrativas visuales, recursos editoriales interactivos. Prototipar y probar cuando aporte valor; conservar solamente cuando mejore de manera demostrable la lectura, la identidad o el descubrimiento. Respetar reducción de movimiento, performance y accesibilidad. No convertir la revista en una demo tecnológica. Documentar por qué una posibilidad se adopta, evoluciona o se rechaza.

## Cobertura sin puntos ciegos
Auditar y resolver de forma integral: portada y jerarquía de primer viewport; Historias y lectura de artículos (imágenes intercaladas, contrastes, composición y móvil); Saber (materiales: bergamota, limón, incienso, salvia sclarea, pachulí; guías integradas); perfumistas y retratos/siluetas; Fragancias y cutouts auténticos con trazabilidad; Discovery, atlas de familias/subfamilias, perfiles y recomendaciones; búsqueda escalable con privacidad; CMS Tiptap/bloques y límites de composición; tipografía, navegación, enlaces, estados vacíos, dark/light, SEO, rendimiento, accesibilidad, seguridad y analítica; infraestructura, tests, despliegue y monitoreo; contenido y pipeline editorial, incluidos los 100 artículos planeados, sin publicar textos sin edición/fact-check; derechos y procedencia de fotografías; QA de dispositivos. Revisar los compromisos anteriores y cualquier otra zona que revelen el código y los documentos. Eliminar residuos y código/decoración sin función real, preservando datos y trabajo valioso.

## Procedimiento autónomo
- Organizar el trabajo en una rama/misiones con commits pequeños y reversibles; usar el stack existente mientras una evaluación técnica no demuestre que conviene cambiarlo.
- Ejecutar investigaciones, diseño, implementación, generación/curaduría de assets, integración, pruebas reales en navegador, crítica independiente de OMNI o equivalente, correcciones y regresiones; repetir el ciclo sin esperar instrucciones rutinarias.
- No exigir decisiones al Publisher que pueda resolver el equipo autónomamente con evidencia. Resolver conflictos priorizando la intención del propietario y la calidad editorial. Consolidar handoffs, no crear burocracia.
- Respetar privacidad, secretos, licencias, backups, contratos y controles de publicación. No realizar compras, borrar datos irreversiblemente ni desplegar cambios riesgosos sin una autorización específicamente válida; preparar release verificable y solicitar solo la aprobación final indispensable.
- No fingir acceso a chats, recursos, herramientas o entornos ausentes. Explicitar bloqueos reales y resolverlos en lo posible.
- Usar verificaciones repetibles: typecheck, lint, tests, builds, pruebas end-to-end, rendimiento real, accesibilidad, QA visual desktop/mobile/light/dark, navegación y fallos, integridad de contenido y regresión editorial.

## Definición de terminado
Producto integrado y comprobable; lectura y descubrimiento excepcionales; todos los recorridos críticos terminados; ausencia de fallos críticos/altos conocidos; trazabilidad completa de decisiones históricas; contenido verificable; assets correctos; pruebas automatizadas y manuales documentadas; release candidate reproducible y plan de reversión; reporte final centrado en lo que funciona y la evidencia, no en promesas. La publicación pública final queda condicionada solamente a los controles necesarios, no a microgestión cotidiana.

**Instrucción inicial al ejecutor:** comienza ahora auditando el repo real y construyendo la matriz de trazabilidad; pasa inmediatamente a implementación por prioridades comprobadas y continúa mientras el entorno lo permita, sin cerrar por haber redactado un plan.
