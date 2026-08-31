# El Coleccionista — Story-Specific Ledger
### Decisiones que NO deben convertirse en sistema · 2026-08-30

Todo lo listado aquí sirve al argumento de *El Coleccionista*: una colección que no puede terminar.
Si aparece por defecto en otro artículo, es una regresión. `Code`: no extraer al sistema compartido.

---

## S-01 · La curva de densidad
La página se aprieta a medida que el argumento se aprieta: 110px → 56px → 36px → 22px entre filas, en los Actos II y III.

**Local porque:** el ritmo comprimido es la tesis. Un perfil de perfumista o una guía necesitan un ritmo estable; comprimirlos sería ruido.
**Nunca:** un token `density: dense` aplicado globalmente.

## S-02 · Campo serial que se comprime
Cuatro bandas de líneas rayadas con altura y tipografía decrecientes, con los cuatro nombres verificados de Le Male arriba y el resto vacío, saliéndose por la derecha.

**Local porque:** representa un catálogo abierto que sigue creciendo. Es el momento más denso de la pieza y su único gran gesto gráfico.
**Cláusula de honestidad:** las líneas vacías **no son un dato**. El caption debe declararlo. Si esta primitiva se reutiliza sin ese caption, miente.
**Nunca:** un `<SerialField>` genérico en el sistema compartido.

## S-03 · Tríptico de conservación
El mismo objeto repetido tres veces con etiquetas de estado (*en uso* / *segundo frasco sin abrir* / *el que ya no se fabrica así*), con opacidad y borde decrecientes.

**Local porque:** invierte el significado de la repetición dentro de la misma pieza (de multiplicación a conservación). Solo funciona porque el lector acaba de ver el campo serial.
**Restricción factual:** ningún frasco puede presentarse como evidencia de una fórmula, un lote o un año concretos.

## S-04 · La liberación de "Sí, pero"
Sección con `clamp(120px, 26vh, 300px)` de padding arriba y abajo, papel más claro (`#FDFCFA`), carril vacío, cero marginalia, cuerpo subido a 26px, y el título de sección **reducido** a 24–34px en cursiva y color apagado.

**Local porque:** el vacío es el contraargumento. Solo significa algo después de la saturación del Acto II–III.
**Nunca:** una "sección de respiro" reutilizable. Sin acumulación previa es solo una página vacía.
**Detalle a preservar:** el título más pequeño que el cuerpo. Es intencional, no un error de escala.

## S-05 · El indicador de acto de esta historia
`01 Reconocer · 02 Acumular · 03 Conservar · 04 Soltar · 05 Cerrar`

**La primitiva P-08 sí es reutilizable; estos cinco nombres no.** Cada historia nombra sus propios actos. Copiar estos verbos convertiría la primitiva en plantilla.

## S-06 · Marino `#1E3348` como acento episódico
Derivado del azul verificado del packaging de Le Male.

**Local porque:** el color pertenece a esta historia. Cada pieza extrae el suyo de su materia real.
**Nunca:** un token `--aromia-accent`.

## S-07 · Titular partido en dos con la segunda palabra en cursiva
Funciona con este título de dos palabras y esta lectura ("el sustantivo es el sujeto"). No es un lockup de marca. Otro titular necesitará otra ruptura.

## S-08 · El recorte lateral de la apertura
El espécimen de apertura sale por la derecha porque *el estante continúa fuera de la página*. El recorte es un argumento.
**Nunca:** un patrón "imagen que sangra por la derecha" aplicado a aperturas sin ese significado.

## S-09 · Ausencia de imagen en el Acto IV
Deliberada. No es un activo pendiente. Que nadie la "complete" en producción.

---

## Marcas de verificación pendientes antes de publicar

- Año de lanzamiento de Aventus usado en la regleta (`2010`) — confirmar fuente.
- Cifra 30–40% de flankers — confirmar fuente citada en el manuscrito.
- "Casi 4 de cada 10 hogares en EE. UU." — confirmar fuente.
- Cita parafraseada del perfumista de Dsm-Firmenich — confirmar redacción y atribución.
- Los cuatro nombres de la línea Le Male — confirmar que la lista sigue vigente en la fecha de publicación.

Todas visibles en el prototipo activando `showClassification`.

## Activos visuales requeridos

El estado distingue **dos ranuras editoriales pendientes** y **un asset de identidad pendiente**. La firma `A.` no cuenta como ranura visual de la historia: pertenece al sistema estable de firma/identidad. Además hay **dos decisiones explícitas `NOT_REQUIRED`**; no son huecos.

| Ranura | Función editorial | Estado |
|---|---|---|
| Espécimen 01 · apertura | reconocimiento; colección real vivida, alturas mezcladas, huecos sin ordenar | `PENDIENTE` — fotografía documental con licencia |
| Tríptico de conservación (×3) | el mismo objeto en tres estados de conservación | `PENDIENTE` — fotografía documental de una colección real |
| Acto II · flankers | ninguno | `NOT_REQUIRED` — resuelto tipográficamente |
| Acto IV · Sí, pero | ninguno | `NOT_REQUIRED` — la ausencia es el contenido |
| Firma `A.` | micro-firma de cierre | `PENDIENTE` — sustituir el marcador tipográfico por el asset aprobado |
