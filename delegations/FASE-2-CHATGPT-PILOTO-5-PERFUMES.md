# Paquete para ChatGPT — Auditoría visual, piloto de 5 perfumes (Fase 2)

**Fase:** Fase 2 — Piloto visual de cinco perfumes
**Deriva de:** `delegations/CHATGPT-VISUAL-AUDIT-BRIEF.md` (Fase 1, sección
"Alcance de este brief" ya preveía este piloto como primer uso)
**Rol de ChatGPT:** director de arte / auditor visual — evalúa, no genera ni
modifica nada en esta pasada.
**Entregado por:** Code

---

## Cómo usar este paquete

Cada uno de los 5 bloques de abajo es un mensaje independiente y completo
para enviar a ChatGPT, uno por perfume. Antes de enviar cada uno hay que:

1. Abrir el `source_url` de la imagen de catálogo y descargarla (o capturarla)
   para adjuntarla — ChatGPT necesita **ver** el archivo, no solo el link.
2. Adjuntar también el mockup editorial correspondiente,
   `apps/web/public/ovl/{slug}.jpg` (existe para los 5).
3. Si se encuentra una ficha de producto real del retailer (Amazon) para ese
   perfume, adjuntarla o linkearla como "referencia oficial" — sirve para
   comparar frasco/tapa/etiqueta contra el listado real, no solo contra la
   foto en sí misma.
4. Pegar el bloque de texto tal cual (ya tiene las reglas de Aromia, la
   clasificación A-E, y las 13 evaluaciones obligatorias insertadas).

No enviar los 5 en un solo mensaje — uno por perfume, para que la evaluación
sea específica y no se mezclen frascos.

---

## 1. Aventus (Creed)

- Imagen de catálogo: `https://m.media-amazon.com/images/I/71nY6hb7uuL._SL1500_.jpg`
- Imagen editorial: `apps/web/public/ovl/aventus.jpg`
- Problema conocido: ninguno confirmado en el historial — auditoría en blanco.

```text
Actúa como director de arte y auditor visual de Aromia.

Perfume: Aventus
Marca: Creed
Función de esta imagen: catalog-primary (tarjeta de catálogo + imagen
principal de ficha de producto)
Imagen a evaluar: [adjunta la descargada de la URL de arriba]
Imagen editorial de referencia (mockup OVL actual, no reemplazarla, solo
contexto): [adjunta apps/web/public/ovl/aventus.jpg]
Referencia oficial del producto: [adjuntar/linkear ficha real de Amazon si se
encuentra]

Reglas de imagen de catálogo de Aromia (no negociables):
- frasco completo, sin recortes agresivos
- fondo uniforme
- proporción constante
- iluminación suave
- sombra controlada
- sin ingredientes sueltos en la composición
- sin logos de retailers visibles
- sin decoraciones ajenas al producto

Analiza esta imagen según estos 13 puntos, pronunciándote explícitamente
sobre cada uno (no resumas en una sola frase):
1. Fidelidad del frasco
2. Tapa
3. Etiqueta
4. Logotipo
5. Texto (nombre del producto, legible y correcto)
6. Proporciones
7. Color
8. Recorte
9. Iluminación
10. Fondo
11. Artefactos (compresión, halos, bordes raros)
12. Coherencia con el resto del catálogo de Aromia
13. Apariencia artificial / riesgo de parecer generada por IA

Clasifica:
A — publicable
B — corregible
C — referencia
D — sustituir
E — editorial

No apruebes (A o B) si el frasco, tapa, etiqueta, logotipo, color o
proporciones no coinciden con la referencia real. Ante la duda entre B y D
por un problema de fidelidad (no solo técnico), la clasificación correcta es
D, no B.

Preguntas puntuales para este perfume:
- ¿La foto actual de Amazon es apta tal cual para catálogo, o necesita
  corrección técnica (recorte/fondo/iluminación) antes de publicarse?
- ¿El mockup editorial OVL adjunto es coherente en estilo con lo que
  recomendarías para un hero editorial de este perfume, o señalarías algo a
  cambiar?
```

## 2. Baccarat Rouge 540 EDP (Maison Francis Kurkdjian)

- Imagen de catálogo: `https://m.media-amazon.com/images/I/71xVLhLWrvL._SL1500_.jpg`
- Imagen editorial: `apps/web/public/ovl/baccarat-rouge-540-edp.jpg`
- Problema conocido: ninguno confirmado en el historial.

```text
Actúa como director de arte y auditor visual de Aromia.

Perfume: Baccarat Rouge 540 EDP
Marca: Maison Francis Kurkdjian
Función de esta imagen: catalog-primary (tarjeta de catálogo + imagen
principal de ficha de producto)
Imagen a evaluar: [adjunta la descargada de la URL de arriba]
Imagen editorial de referencia (mockup OVL actual, no reemplazarla, solo
contexto): [adjunta apps/web/public/ovl/baccarat-rouge-540-edp.jpg]
Referencia oficial del producto: [adjuntar/linkear ficha real de Amazon si se
encuentra]

Reglas de imagen de catálogo de Aromia (no negociables):
- frasco completo, sin recortes agresivos
- fondo uniforme
- proporción constante
- iluminación suave
- sombra controlada
- sin ingredientes sueltos en la composición
- sin logos de retailers visibles
- sin decoraciones ajenas al producto

Analiza esta imagen según estos 13 puntos, pronunciándote explícitamente
sobre cada uno (no resumas en una sola frase):
1. Fidelidad del frasco
2. Tapa
3. Etiqueta
4. Logotipo
5. Texto (nombre del producto, legible y correcto)
6. Proporciones
7. Color
8. Recorte
9. Iluminación
10. Fondo
11. Artefactos (compresión, halos, bordes raros)
12. Coherencia con el resto del catálogo de Aromia
13. Apariencia artificial / riesgo de parecer generada por IA

Clasifica:
A — publicable
B — corregible
C — referencia
D — sustituir
E — editorial

No apruebes (A o B) si el frasco, tapa, etiqueta, logotipo, color o
proporciones no coinciden con la referencia real. Ante la duda entre B y D
por un problema de fidelidad (no solo técnico), la clasificación correcta es
D, no B.

Preguntas puntuales para este perfume:
- El frasco de Baccarat Rouge 540 tiene un color ámbar/rojizo distintivo y
  una tapa dorada facetada muy específica de la marca — ¿la foto reproduce
  ese color con fidelidad o hay desviación de tono (por ejemplo por
  compresión o balance de blancos del retailer)?
- ¿El mockup editorial OVL adjunto es coherente en estilo con lo que
  recomendarías para un hero editorial de este perfume?
```

## 3. Sauvage EDP (Dior)

- Imagen de catálogo: `https://m.media-amazon.com/images/I/51F8MEfiKgL._SL1000_.jpg`
- Imagen editorial: `apps/web/public/ovl/sauvage-edp.jpg`
- Problema conocido: ninguno confirmado. **Nota:** existe otro perfume en el
  catálogo, `sauvage-elixir` — no es este, no confundir.

```text
Actúa como director de arte y auditor visual de Aromia.

Perfume: Sauvage EDP
Marca: Dior
Función de esta imagen: catalog-primary (tarjeta de catálogo + imagen
principal de ficha de producto)
Imagen a evaluar: [adjunta la descargada de la URL de arriba]
Imagen editorial de referencia (mockup OVL actual, no reemplazarla, solo
contexto): [adjunta apps/web/public/ovl/sauvage-edp.jpg]
Referencia oficial del producto: [adjuntar/linkear ficha real de Amazon si se
encuentra]

Reglas de imagen de catálogo de Aromia (no negociables):
- frasco completo, sin recortes agresivos
- fondo uniforme
- proporción constante
- iluminación suave
- sombra controlada
- sin ingredientes sueltos en la composición
- sin logos de retailers visibles
- sin decoraciones ajenas al producto

Analiza esta imagen según estos 13 puntos, pronunciándote explícitamente
sobre cada uno (no resumas en una sola frase):
1. Fidelidad del frasco
2. Tapa
3. Etiqueta
4. Logotipo
5. Texto (nombre del producto, legible y correcto)
6. Proporciones
7. Color
8. Recorte
9. Iluminación
10. Fondo
11. Artefactos (compresión, halos, bordes raros)
12. Coherencia con el resto del catálogo de Aromia
13. Apariencia artificial / riesgo de parecer generada por IA

Clasifica:
A — publicable
B — corregible
C — referencia
D — sustituir
E — editorial

No apruebes (A o B) si el frasco, tapa, etiqueta, logotipo, color o
proporciones no coinciden con la referencia real. Ante la duda entre B y D
por un problema de fidelidad (no solo técnico), la clasificación correcta es
D, no B.

Preguntas puntuales para este perfume:
- Confirmá explícitamente que la imagen corresponde a "Sauvage EDP" (frasco
  azul con tapa plateada facetada) y no a otra variante de la línea Sauvage
  (Elixir, Parfum, EDT) — es un error de confusión de variante conocido en
  este tipo de catálogos.
- ¿El mockup editorial OVL adjunto es coherente en estilo con lo que
  recomendarías para un hero editorial de este perfume?
```

## 4. Black Opium EDP (Yves Saint Laurent)

- Imagen de catálogo: `https://m.media-amazon.com/images/I/71w9icubQlL._SL1500_.jpg`
- Imagen editorial: `apps/web/public/ovl/black-opium-edp.jpg`
- Problema conocido: ninguno confirmado en el historial.

```text
Actúa como director de arte y auditor visual de Aromia.

Perfume: Black Opium EDP
Marca: Yves Saint Laurent
Función de esta imagen: catalog-primary (tarjeta de catálogo + imagen
principal de ficha de producto)
Imagen a evaluar: [adjunta la descargada de la URL de arriba]
Imagen editorial de referencia (mockup OVL actual, no reemplazarla, solo
contexto): [adjunta apps/web/public/ovl/black-opium-edp.jpg]
Referencia oficial del producto: [adjuntar/linkear ficha real de Amazon si se
encuentra]

Reglas de imagen de catálogo de Aromia (no negociables):
- frasco completo, sin recortes agresivos
- fondo uniforme
- proporción constante
- iluminación suave
- sombra controlada
- sin ingredientes sueltos en la composición
- sin logos de retailers visibles
- sin decoraciones ajenas al producto

Analiza esta imagen según estos 13 puntos, pronunciándote explícitamente
sobre cada uno (no resumas en una sola frase):
1. Fidelidad del frasco
2. Tapa
3. Etiqueta
4. Logotipo
5. Texto (nombre del producto, legible y correcto)
6. Proporciones
7. Color
8. Recorte
9. Iluminación
10. Fondo
11. Artefactos (compresión, halos, bordes raros)
12. Coherencia con el resto del catálogo de Aromia
13. Apariencia artificial / riesgo de parecer generada por IA

Clasifica:
A — publicable
B — corregible
C — referencia
D — sustituir
E — editorial

No apruebes (A o B) si el frasco, tapa, etiqueta, logotipo, color o
proporciones no coinciden con la referencia real. Ante la duda entre B y D
por un problema de fidelidad (no solo técnico), la clasificación correcta es
D, no B.

Preguntas puntuales para este perfume:
- El frasco de Black Opium es negro con detalles dorados y una silueta muy
  reconocible — ¿el fondo/iluminación de la foto generan suficiente contraste
  para que el frasco se distinga bien en una tarjeta de catálogo, o se "come"
  el contorno contra el fondo?
- ¿El mockup editorial OVL adjunto es coherente en estilo con lo que
  recomendarías para un hero editorial de este perfume?
```

## 5. Erba Pura (Xerjoff)

- Imagen de catálogo: `https://m.media-amazon.com/images/I/51h-KPGkCWL._SL1500_.jpg`
- Imagen editorial: `apps/web/public/ovl/erba-pura.jpg`
- Caso especial: hubo, en algún momento del sitio v1 (hoy solo en el tag
  `legacy-static-v1-final`, no en `main`), una imagen editorial de Erba Pura
  generada con IA como prueba piloto puntual — no verificado todavía si es el
  mismo archivo que el mockup OVL actual. **No se está reintroduciendo esa
  pieza en este piloto**; se menciona solo para que ChatGPT tenga contexto si
  detecta algo raro en el mockup adjunto.

```text
Actúa como director de arte y auditor visual de Aromia.

Perfume: Erba Pura
Marca: Xerjoff
Función de esta imagen: catalog-primary (tarjeta de catálogo + imagen
principal de ficha de producto)
Imagen a evaluar: [adjunta la descargada de la URL de arriba]
Imagen editorial de referencia (mockup OVL actual, no reemplazarla, solo
contexto): [adjunta apps/web/public/ovl/erba-pura.jpg]
Referencia oficial del producto: [adjuntar/linkear ficha real de Amazon si se
encuentra]

Reglas de imagen de catálogo de Aromia (no negociables):
- frasco completo, sin recortes agresivos
- fondo uniforme
- proporción constante
- iluminación suave
- sombra controlada
- sin ingredientes sueltos en la composición
- sin logos de retailers visibles
- sin decoraciones ajenas al producto

Analiza esta imagen según estos 13 puntos, pronunciándote explícitamente
sobre cada uno (no resumas en una sola frase):
1. Fidelidad del frasco
2. Tapa
3. Etiqueta
4. Logotipo
5. Texto (nombre del producto, legible y correcto)
6. Proporciones
7. Color
8. Recorte
9. Iluminación
10. Fondo
11. Artefactos (compresión, halos, bordes raros)
12. Coherencia con el resto del catálogo de Aromia
13. Apariencia artificial / riesgo de parecer generada por IA

Clasifica:
A — publicable
B — corregible
C — referencia
D — sustituir
E — editorial

No apruebes (A o B) si el frasco, tapa, etiqueta, logotipo, color o
proporciones no coinciden con la referencia real. Ante la duda entre B y D
por un problema de fidelidad (no solo técnico), la clasificación correcta es
D, no B.

Preguntas puntuales para este perfume:
- Evaluá especialmente el punto 13 (apariencia artificial) en el mockup
  editorial adjunto — hay antecedente de una pieza de este perfume generada
  con IA en una versión anterior del sitio, y hace falta confirmar si el
  mockup actual muestra algún indicio de ese origen o es fotografía/render
  legítimo del producto real.
- ¿La foto de catálogo de Amazon es apta tal cual, o necesita corrección
  técnica antes de publicarse?
```

---

## Qué hacer con el resultado

ChatGPT entrega, para cada uno de los 5 perfumes, la clasificación A-E + las
13 evaluaciones + las respuestas a las preguntas puntuales, en texto. Code
integra ese resultado en `data/image-inventory.csv` (columnas
`visual_quality` y `notes`, citando "Auditoría ChatGPT, piloto Fase 2,
{fecha}") y en la sección correspondiente de `docs/images/PILOT-PLAN.md`.
**ChatGPT no publica ni modifica el repositorio directamente.**

No se avanza a `optimize.mjs` ni a ningún procesamiento hasta tener: (a) los
resultados de Cowork, (b) esta auditoría de ChatGPT, y (c) aprobación
explícita de Brey — ver Paso 4/5/6 de la misión de Fase 2.
