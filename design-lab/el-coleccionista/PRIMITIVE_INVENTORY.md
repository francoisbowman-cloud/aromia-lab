# Aromia — Primitive Inventory
### Extraído de `El Coleccionista` · 2026-08-30

Solo primitivas que el prototipo demuestra en uso real. Ninguna especulativa.
Estado por la regla de nueva primitiva: `REUSABLE_PRIMITIVE` (lista para el sistema compartido) o `EXPERIMENT` (aislada hasta tener evidencia en una segunda historia).

---

## P-01 · Editorial Row
**`REUSABLE_PRIMITIVE` — es la primitiva de la que dependen todas las demás.**

- **Propósito:** una única relación espacial que hace reconocible cualquier página de Aromia.
- **Anatomía:** `carril` · `campo de lectura` · `zona marginal`. Las tres ranuras siempre existen; cualquiera puede ir vacía.
- **Variantes:** `quiet` (solo campo) · `annotated` (carril con nota) · `data` (zona marginal con marcas) · `wide` (campo hasta 820px, para tablas y regletas) · `bleed` (el contenido sale por la derecha).
- **Restricciones:** el campo de lectura nunca supera 640px con cuerpo; el carril nunca lleva cuerpo de texto; las notas del carril nunca superan ~200 caracteres.
- **Responsive:** envuelve por `flex-wrap`; sin media queries. Al envolver, carril y zona marginal preceden al campo y actúan como interludios.
- **Debe quedar editable:** ancho del campo, presencia/ausencia de cada ranura, gap vertical entre filas (es la palanca de densidad).

## P-02 · Caption / Credit
**`REUSABLE_PRIMITIVE`**

- **Propósito:** una sola voz de anotación para toda la publicación.
- **Anatomía:** filete superior + Plex 13px + rótulo opcional en mayúsculas.
- **Variantes:** `note` (observación editorial) · `data` (lectura de una cifra) · `spec` (especificación de activo pendiente) · `credit` (autoría/licencia).
- **Restricciones:** máximo 240px de ancho; nunca dentro del campo de lectura; nunca en caja ni con fondo.
- **Responsive:** conserva el filete al pasar a interludio en línea; ancho máximo se relaja a la medida del campo.
- **Editable:** texto, rótulo, variante.

## P-03 · Specimen Slot
**`REUSABLE_PRIMITIVE`**

- **Propósito:** reservar y **especificar** un activo visual todavía inexistente sin fabricarlo ni dejar un hueco.
- **Anatomía:** campo rayado (`repeating-linear-gradient`) + especificación del activo requerido en Plex dentro o debajo.
- **Variantes:** `documental` (borde sólido) · `pendiente` (borde discontinuo, opacidad reducida) · `bleed` (recortado por el borde del contenedor).
- **Restricciones:** la especificación es obligatoria y debe nombrar la función editorial del activo, no su estética. Se sustituye por la imagen real sin cambiar la caja.
- **Responsive:** altura por `clamp`, proporción libre; nunca `object-fit: cover` cuando llegue el activo real de producto.
- **Editable:** altura, proporción, borde, texto de especificación.

## P-04 · Proportion Marks
**`REUSABLE_PRIMITIVE`**

- **Propósito:** hacer legible una proporción real sin numerales decorativos.
- **Anatomía:** N marcas iguales, K entintadas, resto al 13–16% de tinta + lectura en Plex.
- **Variantes:** `10` (una cifra de cada diez) · `100` (porcentaje) · acento episódico para la parte entintada.
- **Restricciones:** **solo con cifra verificable**; la lectura textual es obligatoria (la marca sola no es accesible). Máx. una por fila.
- **Responsive:** `flex-wrap` dentro de 150–240px.
- **Editable:** total, entintadas, color, lectura.

## P-05 · Archive Surface
**`REUSABLE_PRIMITIVE`**

- **Propósito:** cambiar el registro emocional de un pasaje a documental/conservación mediante superficie, no mediante ornamento.
- **Anatomía:** sección con fondo `#EFEAE0` y filete arriba y abajo; misma retícula, mismos tipos.
- **Restricciones:** **máximo una por artículo.** Si se usa dos veces deja de significar cambio de registro. No se combina con imagen a sangre.
- **Responsive:** sin cambios; el fondo es a ancho completo siempre.
- **Editable:** color de superficie (debe seguir siendo un papel, no un tinte de marca).

## P-06 · Time Ruler
**`REUSABLE_PRIMITIVE`**

- **Propósito:** representar duración cuando solo los extremos son verificables.
- **Anatomía:** filete + N marcas equidistantes + dos etiquetas (inicio / hoy) + nota que declara qué **no** está etiquetado.
- **Restricciones:** las marcas intermedias no se etiquetan si el dato no está verificado. La nota de honestidad es parte de la primitiva, no un añadido.
- **Responsive:** `justify-content: space-between`, se estrecha sin recolocar.
- **Editable:** número de marcas, etiquetas, nota.

## P-07 · Contextual Close
**`REUSABLE_PRIMITIVE`**

- **Propósito:** cerrar comercialmente después del cierre editorial, subordinado y sin romper la lectura.
- **Anatomía:** filete superior + rótulo en el carril (`Para quien quiera seguir oliendo`) + por referencia: nombre (Newsreader) · casa (terciario) · **razón por la que apareció en la historia** (Archivo 15px) · acción de texto · divulgación.
- **Variantes:** 1 a 3 referencias. Cero referencias es una variante válida.
- **Restricciones:** sin cards, sin botones rellenos, sin precios, sin badges, sin imagen de producto. La razón editorial precede siempre a la acción. Nunca antes del final del artículo.
- **Responsive:** columna única; la acción mantiene 44px de área táctil.
- **Editable:** número de referencias, copy de razón y de acción, retailer.

## P-08 · Act Indicator
**`REUSABLE_PRIMITIVE`**

- **Propósito:** orientación narrativa continua; sustituye a la barra de progreso.
- **Anatomía:** una etiqueta Plex en la barra fija, alimentada por `IntersectionObserver` sobre `section[data-act]`.
- **Restricciones:** entre 3 y 6 actos; los nombres son de la historia (`Reconocer`, `Acumular`, `Soltar`), nunca genéricos (`Sección 2`). Sin animación.
- **Responsive:** ancho mínimo reservado para evitar salto de layout.
- **Editable:** nombres de acto (atributo `data-act` en la sección), visibilidad.

## P-09 · Density Curve
**`EXPERIMENT`**

- **Propósito:** que el gap vertical entre filas editoriales sea una variable narrativa y no una constante del sistema.
- **Estado:** funciona aquí porque el argumento es la acumulación. Aún no hay evidencia de que sirva a una historia cuya tensión no sea la densidad.
- **Promoción:** solo si una segunda historia con una tensión distinta la usa con ganancia real.

## P-10 · Compressing Serial Field
**`EXPERIMENT` — con fuerte sospecha de `STORY_SPECIFIC`. Ver el Ledger.**

- **Propósito:** hacer físicamente visible una proliferación abierta.
- **Anatomía:** cuatro bandas en `grid` con columna, alto de fila y tipografía decrecientes; solo la primera banda lleva texto.
- **Estado:** no exportar al sistema compartido en esta iteración.

---

## Primitivas que deliberadamente NO se crearon

- **Card de artículo** — no la exigía la pieza.
- **Pull quote** — el ensayo no tiene una frase que gane siendo extraída; insertar una habría sido relleno.
- **Hero de imagen a sangre** — el recorte lateral hace mejor trabajo.
- **Bloque de "notas olfativas"** — no es un artículo de producto.
- **Acordeón de fuentes / sistema de notas al pie** — el manuscrito no las usa todavía.
- **Tema oscuro de artículo** — no hay evidencia editorial que lo pida aún.
