# Brief para ChatGPT — Auditoría visual de imágenes de producto

**Fase:** Fase 1 — Fundación del sistema de imágenes de Aromia
**Origen:** `docs/operations/AROMIA_MANUAL_OPERATIVO_CODE_COWORK_CHATGPT.md`,
secciones 3.3 y 10
**Rol de ChatGPT en esta tarea:** director de arte / auditor visual —
evalúa, no genera ni modifica nada en esta pasada.

---

## Qué enviarle a ChatGPT, por cada imagen a auditar

Para cada fila de `data/image-inventory.csv` con `image_role = catalog-primary`
que se quiera auditar, armar un mensaje con:

1. **La imagen** — descargada de `source_url` y adjuntada directamente (no
   pegar solo el link; ChatGPT debe poder verla).
2. **La referencia oficial** — un link o captura de la ficha real del
   producto en el sitio del retailer (`source_url` suele ser la imagen
   embebida; la referencia es la página de producto completa, para comparar
   frasco/tapa/etiqueta contra el listado real, no solo contra sí misma).
3. **El perfume** — `perfume_name` + `brand` de la fila correspondiente.
4. **Su función** — `image_role` (para esta tanda, siempre
   `catalog-primary`: se usa en tarjetas de Home/Catálogo y como imagen
   principal de la ficha de producto — ver
   `docs/images/CURRENT-STATE-AUDIT.md` sección 2).
5. **Las reglas de Aromia** — pegar textual la sección 7.2 ("Imagen de
   catálogo") de `docs/operations/AROMIA_MANUAL_OPERATIVO_CODE_COWORK_CHATGPT.md`:
   frasco completo, fondo uniforme, proporción constante, iluminación suave,
   sombra controlada, sin ingredientes, sin logos de retailers, sin
   decoraciones, sin recortes agresivos.
6. **El resultado esperado** — la clasificación A-E de abajo, más las 13
   evaluaciones puntuales de la sección siguiente, en texto estructurado (no
   solo una letra suelta).

### Prompt base a usar (adaptar `{perfume}`, `{marca}`, `{imagen}`, `{referencia}`)

```text
Actúa como director de arte y auditor visual de Aromia.

Perfume: {perfume}
Marca: {marca}
Función de esta imagen: catalog-primary (tarjeta de catálogo + imagen
principal de ficha de producto)
Imagen a evaluar: {imagen adjunta}
Referencia oficial del producto: {referencia}

Reglas de imagen de catálogo de Aromia (no negociables):
- frasco completo, sin recortes agresivos
- fondo uniforme
- proporción constante
- iluminación suave
- sombra controlada
- sin ingredientes sueltos en la composición
- sin logos de retailers visibles
- sin decoraciones ajenas al producto

Analiza esta imagen según:
- fidelidad del frasco;
- recorte;
- fondo;
- iluminación;
- coherencia con Aromia;
- artefactos;
- texto alterado;
- utilidad para catálogo o editorial;
- riesgo de parecer generada por IA.

Clasifica:
A — publicable
B — corregible
C — referencia
D — sustituir
E — editorial

No apruebes una imagen si el frasco, tapa, etiqueta, logotipo, color o
proporciones no coinciden con la referencia real.
```

## Clasificación esperada

- **A — publicable**: cumple todas las reglas, se usa tal cual.
- **B — corregible**: el producto es fiel, pero necesita ajuste técnico
  (recorte, fondo, iluminación) antes de publicarse — no falla por fidelidad.
- **C — referencia**: sirve como referencia visual del producto real, pero no
  es apta para publicar directamente (ej. resolución insuficiente, watermark).
- **D — sustituir**: la imagen no sirve — hay que reemplazarla por otra
  fuente (retailer distinto, u otra foto del mismo retailer).
- **E — editorial**: no aplica a esta tanda de `catalog-primary` (es para
  imágenes de uso hero/Magazine); si ChatGPT la sugiere para alguna, señalarlo
  como hallazgo aparte, no como veredicto de catálogo.

## Evaluaciones obligatorias por imagen

ChatGPT debe pronunciarse explícitamente sobre cada uno de estos 13 puntos
(sección 10 del manual), no resumir en una sola frase:

1. Fidelidad del frasco
2. Tapa
3. Etiqueta
4. Logotipo
5. Texto (nombre del producto, si es legible y correcto)
6. Proporciones
7. Color
8. Recorte
9. Iluminación
10. Fondo
11. Artefactos (compresión, halos, bordes raros)
12. Coherencia con el resto del catálogo de Aromia
13. Apariencia artificial / riesgo de parecer generada por IA

## Regla no negociable

**ChatGPT no puede aprobar (clasificación A o B) una imagen si el frasco, la
tapa, la etiqueta, el logotipo, el color o las proporciones no coinciden con
la referencia real del producto.** Ante la duda entre B y D por un problema de
fidelidad (no solo técnico), la clasificación correcta es D, no B.

## Qué hacer con el resultado

ChatGPT entrega la clasificación + las 13 evaluaciones en texto. Code integra
ese resultado en las columnas `visual_quality` (deriva de la clasificación:
A/B → `high`/`medium` según corrija poco o mucho; D → `low`) y `notes` de
`data/image-inventory.csv`, citando la fuente ("Auditoría ChatGPT,
{fecha}"). **ChatGPT no publica ni modifica el repositorio directamente** —
su salida es un insumo que Code valida e integra, igual que con Cowork.

## Alcance de este brief

Pensado para correrse sobre el piloto de 5 perfumes primero (ver
`docs/images/PILOT-PLAN.md`) antes de aplicarlo a las 50 filas del catálogo
completo — así se valida el formato de brief y el criterio de clasificación
con un lote chico antes de escalarlo.
