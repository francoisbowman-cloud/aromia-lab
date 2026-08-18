# Guía visual — Aromia

Guía operativa para mantener una experiencia editorial, sensorial y humana a medida que Aromia crece.
No define plantillas rígidas. Define relaciones, límites de calidad y señales que deben repetirse para que las páginas pertenezcan a la misma historia.

> Principio rector: **repetir relaciones, no layouts**.

## 1. Intención de marca

Aromia debe sentirse como una publicación contemporánea sobre perfume que también permite descubrir, comparar y elegir.

La experiencia busca:

- claridad antes que ornamentación;
- carácter editorial sin sacrificar utilidad;
- atmósfera sensorial sin convertir cada pantalla en una escena;
- producto real y verificable como centro de confianza;
- variación expresiva entre capítulos sin perder parentesco visual;
- lenguaje humano, preciso y breve.

Evitar como atajos de “lujo”:

- negro + dorado usado por defecto;
- glassmorphism gratuito;
- 3D o parallax sin función;
- exceso de cards y divisores;
- layouts con apariencia SaaS;
- frases vagas o meta que delaten generación automática;
- fotografía artificialmente perfecta o materiales visualmente imposibles.

## 2. Sistema de color

Los tokens viven en `apps/web/src/app/globals.css` y se exponen a Tailwind.
Usar roles semánticos antes que hex sueltos:

| Token / clase | Rol |
|---|---|
| `bg-paper` | fondo principal |
| `bg-surface` | superficies secundarias |
| `bg-soft` | agrupación suave, skeletons, estados |
| `text-ink` | texto principal |
| `text-muted` | texto secundario |
| `border-line` | borde cuando realmente sea necesario |
| `text-gold-contrast` | acento legible |

El dorado es un acento, no la identidad completa.

## 3. Tipografía y jerarquía

- `font-display`: titulares, nombres de perfume y cifras editoriales.
- `font-sans`: UI, cuerpo y navegación por defecto.
- `font-plex`: datos, labels técnicos o microcopy cuando aporte contraste funcional.

### Regla de escala

Un titular puede ser expresivo, pero nunca debe hacer que el resto parezca una nota al pie.

- cuerpo editorial preferido: `16px` / `1.6–1.75` en desktop y mobile;
- microcopy por debajo de `12px` solo para metadata secundaria, nunca para información necesaria;
- displays de 70px+ se reservan para momentos excepcionales y deben probarse contra el cuerpo real;
- mobile no es una reducción proporcional del desktop: ajustar longitud de línea, densidad y ritmo.

El contraste entre escalas debe crear jerarquía, no una ruptura de legibilidad.

## 4. Copy y voz

Idioma base: **español neutro**.

Usar “sabes”, “buscas”, “vuelve”, “usa”, “necesitas”. Evitar regionalismos no intencionales en interfaces globales.

### Criterio editorial

- una idea por párrafo;
- si una oración comunica lo mismo que tres, usar una oración;
- explicar beneficio o significado antes que describir el propio sistema;
- evitar frases defensivas o meta como “sin feed artificial”, “curado por IA” o equivalentes si el usuario no necesita saberlo;
- evitar solemnidad vacía y abstracciones de lujo genérico;
- preferir verbos concretos y nombres específicos.

## 5. Imagen de producto — regla dura

La identidad visual del perfume no se altera.

1. Botella, tapa, etiqueta, logo, proporciones, líquido y reflejos se preservan.
2. Producto siempre con `object-fit: contain`; nunca `cover`.
3. El escenario de catálogo es **blanco puro** para integrar packshots de retailer sin crear cajas beige alrededor del producto.
4. No remover fondos mediante tolerancias de color que puedan borrar vidrio, líquido, etiquetas claras o reflejos.
5. Si un archivo de producto parece dañado, el sistema debe mostrar la fuente intacta o un placeholder antes que “repararlo” inventando píxeles.
6. Fotografía generada puede complementar un producto, nunca sustituir su packshot canónico cuando la identidad no pueda verificarse.

La fidelidad del objeto tiene prioridad sobre la limpieza estética.

## 6. Materiales e ingredientes

Aromia mantiene una biblioteca reutilizable de ingredientes y materias primas: cítricos, flores, maderas, raíces, resinas, especias, frutas y elementos botánicos.

Uso correcto:

- transparente cuando sea viable; blanco limpio como alternativa;
- textura natural, pequeñas imperfecciones y color creíble;
- escala y luz compatibles con la composición que los recibe;
- utilizar ingredientes para explicar una nota, familia, materia o atmósfera concreta;
- una composición puede mezclar activos, pero debe mantener una lógica de luz, profundidad y escala.

No usar ingredientes como confeti decorativo. Si no ayudan a entender o sentir la fragancia, no se añaden.

### Gate “NO IA”

Rechazar un activo si presenta alguno de estos síntomas:

- geometría botánica imposible;
- simetría o perfección plástica excesiva;
- texturas repetidas;
- gotas, brillo o translucencia físicamente incoherentes;
- bordes derretidos o piezas fusionadas;
- escala ambigua;
- dramatización cinematográfica que contradice un simple asset de materia prima.

## 7. Composición y Narrative Harmony

La coherencia se construye con **anclas** y **variación**.

Anclas posibles:

- voz tipográfica;
- relación entre papel / tinta / acento;
- ritmo de espaciado;
- tratamiento de producto;
- lógica de luz y materiales;
- gramática de interacción y motion.

Expresiones que pueden variar:

- composición;
- escala;
- densidad;
- crop editorial;
- asimetría;
- modo claro/oscuro;
- superposición;
- intensidad del motion.

Una ruptura del patrón es válida cuando aumenta jerarquía, emoción o comprensión. La monotonía también es un defecto.

## 8. Divisores y bordes

Una línea debe tener trabajo que hacer.

Usarla para:

- separar dos controles que podrían confundirse;
- marcar una frontera funcional importante;
- sostener una tabla o dato que necesite lectura tabular.

No usarla para separar automáticamente cada título, bloque, card, sección o columna.

Orden de preferencia para crear separación:

1. espacio;
2. agrupación y alineación;
3. cambio sutil de superficie;
4. escala o ritmo;
5. línea, solo si lo anterior no basta.

## 9. Academia y contenido editorial

El orden responde al interés del lector, no a una cronología académica automática.

En Academia, la secuencia recomendada es:

1. estructura / pirámide;
2. familias olfativas;
3. concentraciones;
4. materias primas cuando los activos sean fiables;
5. **Origen / historia como capítulo final**.

El contenido histórico cierra y profundiza; no bloquea la entrada a conceptos más inmediatamente útiles.

## 10. Catálogo

El catálogo es archivo y descubrimiento, no panel administrativo.

- filtros visibles pero silenciosos;
- búsqueda prioritaria;
- categorías olfativas como índice, no como segunda barra de navegación pesada;
- cards separadas principalmente por espacio;
- escenario de producto blanco;
- metadata legible sin competir con nombre y marca;
- estados vacíos con salida clara;
- interacción táctil y teclado equivalentes.

## 11. Motion

Movimiento solo para:

- mostrar continuidad;
- revelar jerarquía;
- confirmar estado;
- orientar entre superficies.

Respetar `prefers-reduced-motion`. Evitar animaciones simultáneas y parallax costoso por defecto.

## 12. Gates antes de aceptar una intervención

Toda modificación visual relevante debe responder:

- **BEFORE:** ¿qué problema observable existía?
- **AFTER:** ¿qué cambió exactamente?
- **DELTA:** ¿qué mejoró para una persona real?
- **WHY ACCEPTED:** ¿qué evidencia justifica conservarlo?

Además:

- mobile y tablet revisados;
- teclado y focus visibles;
- contraste suficiente;
- reduced-motion preservado;
- imágenes sin deformación o pérdida de identidad;
- performance sin regresión importante;
- SEO/rutas/datos preservados.

Una versión nueva no se acepta solo por ser nueva.
