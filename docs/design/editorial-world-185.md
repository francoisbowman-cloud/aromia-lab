# Extensión de la dirección editorial

La dirección aprobada de portada e Historias se extiende a Saber, Discovery, familias, Personas, búsqueda, Club, cuestionario, resultados y aperturas de artículos y perfumes. Se conserva la visión de revista de perfumería: lectura, materias y autores como centro.

## Composición y fidelidad

Referencias visuales locales: `exec-a5695141-e495-4c5f-aff2-78516bc646a6.png` (Saber) y `exec-3c066000-f110-4c4c-87c3-ede3f595026d.png` (Discovery), en `/workspace/generated_images`. Comparadas con capturas reales de navegador.

| Aspecto | Aplicación |
| --- | --- |
| Color | Papel marfil, titulares vino y superficies bosque; variante oscura legible. |
| Tipografía | Newsreader cursiva con escala fluida; texto de orientación sans, medidas de lectura contenidas. |
| Composición | Aperturas asimétricas, galerías de materias y alternancia de densidad; adaptación vertical móvil. |
| Fotografía | Herbario y resina documentales con créditos auténticos; limón reinterpretado con IA y procedencia explícita. |
| Personas | Retratos existentes; monogramas deliberados cuando no hay fotografía verificada. |
| Interacción | Enlaces reconocibles, foco visible, salto al contenido, filtros y búsqueda con estado en URL. |

Desviaciones deliberadas del concepto: se usan ingredientes y catálogo reales, sin copiar frascos o créditos inventados del mockup. Se conserva la historia completa de Saber y no se fabrican retratos. La imagen de limón original sigue disponible; la versión nueva lleva metadatos de procedencia y atribución visible.

## Recorridos

- Búsqueda de perfumes, historias, personas y familias; coincidencias sin acentos, sugerencias, limpieza y consulta en URL.
- Familias canónicas en Discovery, selección recuperable con Atrás y contador anunciado.
- Cuestionario con retroceso y sustitución de respuestas; resultado conectado al mapa local.
- Borrado del mapa con confirmación y opción de conservarlo.
- Club presenta su lista de espera con claridad; no se enviaron suscripciones reales durante QA.
- Artículos conservan contenido y fotografías; apertura sobre papel, texto legible y lector paginado existente.

## Verificación

Lint y comprobación de tipos correctos; 61 pruebas en 17 archivos pasan. Compilación optimizada completa (49 páginas estáticas). Inspección visual de Saber, Discovery, Personas, Club, búsqueda y cuestionario.

Barrido en navegador a 390 y 1440 px, claro y oscuro; comprobaciones adicionales a 320 px. Las primeras rutas de prueba de perfume y artículo tenían slugs incorrectos y fueron excluidas: se verificaron después `/catalogo/aventus`, `/magazine/resena-tobacco-vanille` y `/quiz/resultado/fresco-clasico`, incluyendo sus títulos reales. La revisión detectó contraste insuficiente en el botón de lectura oscuro; se fijó el color del texto sobre el fondo dorado, también en impresión.

Evidencia local en `/workspace/aromia-evidence`: `world-qa.json`, `world-extra-qa.json`, `world-corrected-qa.json`, `world-contrast-final.json`, `world-production-flow.log`, `world-build.log` y capturas `world-opening-*.png`. Los informes anteriores a la corrección conservan sus hallazgos; el informe final verifica la corrección.

La prueba integral sobre Next en modo producción local pasó: entrada desde portada, búsqueda, cuestionario con retroceso, resultado, filtros con Atrás, cancelación y borrado del mapa, salto por teclado y apertura, avance y cierre del lector. La espera inicial de red agotó 30 segundos por imágenes remotas; el recorrido terminó al ampliar el margen de navegación. Esta latencia externa sigue siendo una limitación observable.

Estas comprobaciones no equivalen a investigación con lectores ni a certificación completa de accesibilidad. Las imágenes remotas del catálogo dependen de sus fuentes y muestran una alternativa tipográfica cuando no están disponibles. Trabajo local de borrador, sin despliegue ni publicación.
