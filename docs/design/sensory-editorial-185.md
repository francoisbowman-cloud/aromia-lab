# Dirección editorial: de estructura a atmósfera

## Diagnóstico y aplicación

El análisis visual de la portada publicada y del borrador mostró que aumentar titulares y añadir franjas vino/verde no solucionaba la composición rígida. El mockup seleccionado por el usuario cambia la relación entre imagen y texto: la fotografía tiene una función sensorial, el titular participa en ella y las secciones alternan escala, textura y densidad.

Aplicado a portada y archivo de Historias. La apertura tiene una creación visual original (no un producto real), identificada como IA. La bergamota existente se reutiliza con atribución; rosa, herbario y Omán conservan su procedencia. El reportaje de Omán se mantiene con fotografía documental y relación de aspecto panorámica. No se cambia el contenido de los reportajes ni se publica contenido nuevo.

## Sistema

Marfil #f7f3eb, vino #641e2f, bosque #263e33. Newsreader normal/italic para titulares y enlaces editoriales; Archivo para orientación y texto de apoyo. Escalas fluidas combinan rem y vw. La portada usa composición 35/65; el archivo 35/65 para apertura documental y 55/45 para destacados. En móvil el titular vuelve al papel, sin superposición. Texto e interacciones son HTML; las imágenes no contienen interfaz.

## Investigación utilizada

- [web.dev: tipografía](https://github.com/GoogleChrome/web.dev/blob/main/src/site/content/en/learn/design/typography/index.md): legibilidad, longitudes de línea y escalas adaptables. Aplicado a titulares fluidos y textos cortos con medida limitada.
- [web.dev: macro layout](https://github.com/GoogleChrome/web.dev/blob/main/src/site/content/en/learn/design/macro-layouts/index.md): composición guiada por contenido. Aplicado a ritmos distintos y reordenación móvil.
- [WCAG: reflow](https://github.com/w3c/wcag/blob/main/understanding/21/reflow.html): comprobación a 320px, incluido el contorno real del texto del logotipo, no únicamente scrollWidth.
- [WCAG: contraste](https://github.com/w3c/wcag/blob/main/understanding/20/contrast-minimum.html): contraste y foco, más inspección manual del titular sobre fotografía, que el análisis automático no puede certificar.
- [GOV.UK: tabs](https://github.com/alphagov/govuk-design-system/blob/main/src/components/tabs/index.md): distinguir selección de contenido y navegación. Los territorios son botones con aria-pressed, región de resultados, contador anunciado y estado recuperable mediante URL/Back. No se presentan como pestañas ARIA incompletas.

Fuentes consultadas a través de sus repositorios oficiales. Los intentos directos de Vogue y NNGroup fueron bloqueados por la red; no se afirma haber auditado esos sitios. No hay ensayo con lectores ni métricas de conversión.

## Comparación y desviaciones deliberadas

Referencia: `/workspace/generated_images/exec-48e4ae25-6b5f-4da2-97ce-493b7b73706d.png` (921×1708). Archivo: `exec-1f315580-8ffa-4c65-a7da-5675f5686761.png`.

| Punto | Implementación y comprobación |
| --- | --- |
| Apertura | Frasco ámbar, travertino, seda vino y luz lateral; nuevo asset independiente del mockup, WebP de 195318 bytes. |
| Composición | Titular en cursiva cruza papel/foto en escritorio; en móvil se recompone para lectura y contraste. |
| Color | Marfil/vino/bosque trasladados a superficies y fotografía, con variante oscura. |
| Tipografía | Cursiva editorial, contraste de escalas y sans para orientación; logotipo corregido a 320px. |
| Ritmo | Apertura, atlas, persona, materia, reportaje, índice y exploración con proporciones distintas. |
| Iconos | Flechas nuevas en SVG lucide; se corrigieron glifos ausentes vistos en la primera captura. |
| Texto | Se conservan nombres de navegación existentes y títulos reales. “Explorar las historias” dirige al archivo; no se inventa un artículo para el titular conceptual. Sin número de edición ficticio. |
| Imágenes | Bergamota y rosa propias existentes en lugar de copiar las fotografías generadas dentro del mockup. Omán conserva su fotografía real, no las montañas inventadas del estudio de archivo. |
| UX | Filtros comparten URL, sobreviven a recarga y Back; portada→archivo→lectura y bergamota→familia cítrica comprobados en navegador. |

Capturas actuales y logs en `/workspace/aromia-evidence/sublime-*` y `archive-final-*`. Se utilizó Playwright Chromium porque no hay Browser/IAB disponible. Comparación con `view_image` del concepto y de los renders completos. La fidelidad se evalúa respecto a estas adaptaciones funcionales explícitas, no como igualdad de píxeles ni aprobación externa de una agencia.

Validación: lint, TypeScript y 61 tests aprobados; portada 320/390/768/1440 en claro/oscuro sin overflow, imágenes rotas, errores JS o infracciones axe detectadas; archivo 390/1440 en ambos temas. Esto no constituye certificación integral de accesibilidad ni validación de despliegue. Trabajo en borrador local, sin publicación.
