# Piloto de auditoría de imágenes — Fase 2 — Plan de tratamiento visual

Generado: 2026-08-06T13:53:10.881Z

Este plan especifica QUÉ necesita cada imagen para pasar a `affiliate-approved` / catalog-primary aprobado. No incluye archivos binarios de reemplazo — sourcing de fuente nueva y/o reprocesamiento (crop) requieren inspección visual directa del archivo o navegación de sitios externos, no ejecutadas en este paso. Ningún `image_url` fue modificado, ninguna imagen fue descargada, `scripts/images/optimize.mjs` no fue invocado.

## Aventus (`aventus`) — Creed

- **Acción propuesta:** sustituir
- **Defecto:** La etiqueta del frasco fotografiado es de papel plano; el frasco real de Creed Aventus lleva una placa metálica grabada con el caballero. Es un defecto de fidelidad de marca, no técnico.
- **Estrategia:** sourcing_new_photo
- **Requisitos:**
  - Frasco con placa metálica grabada visible (no etiqueta de papel)
  - Fondo blanco uniforme, sin logos de retailer
  - Botella completa, sin recortes agresivos
  - Proporción y color consistentes con la referencia real de Creed
- **Estado:** blocked_pending_source
- **Bloqueo:** No hay una URL de fuente candidata verificada todavía. Requiere localizar en un retailer autorizado (o banco de assets con licencia) una foto donde la placa metálica sea visible, y confirmar visualmente contra la referencia real antes de proponerla — no se hizo en este paso por ser una decisión de fidelidad de marca de alto riesgo si se elige mal.

## Sauvage EDP (`sauvage-edp`) — Dior

- **Acción propuesta:** sustituir_o_reprocesar_fuente
- **Defecto:** La caja del perfume aparece en el encuadre y el recorte no aísla el frasco — viola las reglas no negociables de catálogo Aromia (solo frasco, fondo uniforme, sin recorte agresivo). La identidad del producto (Sauvage EDP) ya está confirmada por verificación humana; el problema es puramente técnico de encuadre.
- **Estrategia:** reprocess_or_source_new_photo
- **Requisitos:**
  - Solo el frasco, sin la caja en el encuadre
  - Fondo blanco uniforme
  - Frasco completo, sin recorte agresivo
  - Mantener identidad confirmada: Sauvage EDP (Dior) — no cambiar variante
- **Estado:** blocked_pending_source_or_crop_confirmation
- **Bloqueo:** Si el frasco es aislable de la caja recortando la imagen actual, este caso podría resolverse con un reprocesamiento simple (crop) en vez de una fuente nueva — pero eso requiere inspeccionar visualmente el archivo real (no solo la descripción textual del modelo) para confirmar que el frasco completo queda dentro del área recortable. No se descargó la imagen para esa inspección en este paso.

## Black Opium EDP (`black-opium-edp`) — Yves Saint Laurent

- **Acción propuesta:** sustituir_o_reprocesar
- **Defecto:** La caja aparece en el encuadre y el frasco está parcialmente fuera de cuadro (recorte agresivo por debajo). La variante (EDP) está confirmada correcta por Cowork.
- **Estrategia:** reprocess_or_source_new_photo
- **Requisitos:**
  - Solo el frasco, sin la caja en el encuadre
  - Frasco completo (no cortado por debajo)
  - Fondo blanco uniforme
  - Mantener identidad confirmada: Black Opium EDP (YSL) — no cambiar variante
- **Estado:** blocked_pending_source_or_crop_confirmation
- **Bloqueo:** Mismo caso que Sauvage EDP: podría resolverse con reprocesamiento (crop) si el frasco completo está contenido en la imagen fuente, pero eso requiere inspección visual directa del archivo, no hecha en este paso.
