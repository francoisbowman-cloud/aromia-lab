# Ticket — Ficha de producto enriquecida + fix de imágenes narrativas

**Encolar después del cierre y reporte de la sesión de estabilización en curso — no correr en paralelo sobre el mismo repo.**

---

## 1. Contexto

La ficha de producto ya tiene un spec aprobado ("Anatomía de una fragancia"): oferta/precio (Amazon), retrato olfativo (radar de 3 ejes: longevidad, proyección, estela), pirámide de notas (salida/corazón/fondo), y bloque de reseñas de comunidad con datos reales de Amazon. Verificar primero si esto ya está implementado en producción tal cual el spec, o si falta terminar de conectarlo — auditar contra el sitio real, no de memoria.

## 2. Bug a corregir: pareo de imágenes narrativas (OVL)

**Problema:** en el banner inferior de la ficha de producto, la imagen mockup (set OVL_Prompt_50 o el set sin fondo de Image Toolkit) no corresponde al perfume que se está mostrando — aparece el frasco de otro producto.

**Causa probable:** las imágenes narrativas se están asignando de forma genérica/por índice, no 1:1 contra el perfume real.

**Fix pedido:**
- Auditar el pareo perfume ↔ imagen narrativa en los 38 productos activos
- Cada perfume debe usar únicamente su propio mockup (mismo frasco, misma forma de tapa) — nunca el de otro producto
- Si a un perfume le falta su mockup específico, dejar el espacio vacío o un placeholder neutro — nunca mostrar el frasco incorrecto de otro producto
- Recordatorio de uso ya definido: estas imágenes son solo para narrativa (ficha de producto, Magazine, Academia), **nunca** para la tarjeta de producto del Catálogo

## 3. Consideraciones de implementación

- Todo componente nuevo (radar chart, pirámide, bloque de reseñas) se construye sobre shadcn/ui + los tokens ya definidos (`--gold-500`, `--warm-white`, etc.) — cero valores hardcodeados nuevos
- Aplica el checklist de coherencia de diseño de Aromia como paso de cierre antes de reportar terminado

## 4. Miniaturas adicionales de Amazon

Cada listado de Amazon trae varias miniaturas además de la foto principal del frasco (infografía de notas/ingredientes, foto de estilo de vida, cuadro comparativo, etc. — ver ejemplo de referencia adjunto por Brey).

**Regla de uso:**
- **Catálogo (grid):** usar exclusivamente la miniatura de fondo blanco — nunca una infografía ni una foto de estilo de vida
- **Página del perfume:** ahí sí se pueden mostrar las demás miniaturas (infografía, estilo de vida) como galería adicional, ya que agregan valor narrativo en ese contexto
- Aplica a los 38 productos activos; si un producto no tiene miniatura de fondo blanco disponible, se mantiene el criterio ya definido (Notino/Douglas → placeholder, sin inventar)

## 5. Fix: fondo de la tarjeta en la página del perfume

En la ficha de producto individual (ej. `/catalogo/versace-pour-homme`), la tarjeta que contiene la imagen del producto todavía no tiene fondo blanco — se ve un beige/crema en vez del blanco ya decidido para todo el sitio (mimetismo con el fondo real de las fotos de Amazon). Ajustar el color de fondo de ese contenedor a `--warm-white` o blanco puro, según el token que corresponda, para que sea consistente con el resto del sitio.

## 6. Reporte esperado al cierre

Qué se corrigió (pareo de imágenes narrativas, miniaturas adicionales por producto, fondo blanco de la ficha), qué perfumes tenían el pareo de imagen incorrecto, archivos modificados, cómo se verificó (publicado + revisado en incógnito en aromialab.com, desktop y mobile).
