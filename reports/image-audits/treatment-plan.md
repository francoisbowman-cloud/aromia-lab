# Piloto de auditoría de imágenes — Fase 2 — Plan de tratamiento visual

Generado: 2026-08-06T14:36:49.453Z

Este plan especifica QUÉ necesita cada imagen para pasar a `affiliate-approved` / catalog-primary aprobado. No incluye archivos binarios de reemplazo — sourcing de fuente nueva y/o reprocesamiento (crop) requieren inspección visual directa del archivo o navegación de sitios externos, no ejecutadas en este paso. Ningún `image_url` fue modificado, ninguna imagen fue descargada, `scripts/images/optimize.mjs` no fue invocado.

## Aventus (`aventus`) — Creed

- **Acción propuesta:** sustituir
- **Defecto:** Confirmado por inspección visual directa del archivo (2026-08-06): la etiqueta del frasco fotografiado es un rectángulo blanco plano impreso, no la placa metálica grabada con el jinete que lleva el frasco real de Creed Aventus. Es un defecto de fidelidad de marca, no técnico.
- **Estrategia:** sourcing_new_photo
- **Requisitos:**
  - Frasco con placa metálica grabada visible (no etiqueta de papel plana)
  - Fondo blanco uniforme, sin logos de retailer
  - Botella completa, sin recortes agresivos
  - Proporción y color consistentes con la referencia real de Creed
- **Estado:** blocked_pending_source
- **Bloqueo:** No hay una URL de fuente candidata verificada todavía (evidencia del defecto actual: reports/image-audits/treatment-evidence/aventus-current-flat-label-confirmed.jpg). Requiere localizar en un retailer autorizado (o banco de assets con licencia) una foto donde la placa metálica sea visible, y confirmar visualmente contra la referencia real antes de proponerla — no se hizo en este paso por ser una decisión de fidelidad de marca de alto riesgo si se elige mal (mismo tipo de error ya detectado en Sauvage EDP).

## Sauvage EDP (`sauvage-edp`) — Dior

- **Acción propuesta:** sustituir
- **Defecto:** La imagen actual es de Sauvage EAU DE TOILETTE (confirmado por inspección visual directa del archivo el 2026-08-06 — la caja dice textualmente 'EAU DE TOILETTE — Vaporisateur Spray', no 'Eau de Parfum'), pero el catálogo declara el producto como Sauvage EDP. No es un problema de encuadre: es la variante equivocada. Confirmado por Brey el 2026-08-06, corrigiendo una resolución humana previa del 2026-08-05 que había dado la imagen por correcta.
- **Estrategia:** sourcing_new_photo
- **Requisitos:**
  - Caja/etiqueta debe decir explícitamente 'Eau de Parfum', no 'Eau de Toilette'
  - Solo el frasco, sin la caja en el encuadre
  - Fondo blanco uniforme
  - Frasco completo, sin recorte agresivo
- **Estado:** blocked_pending_source
- **Bloqueo:** Requiere localizar en un retailer autorizado una foto de Sauvage EDP (no EDT) y confirmar visualmente el texto 'Eau de Parfum' en la caja/etiqueta antes de proponerla — no se hizo en este paso, dado el error ya cometido una vez con esta misma variante (evidencia de la imagen actual, EDT: reports/image-audits/treatment-evidence/sauvage-edp-contradiction-eau-de-toilette.jpg).

## Black Opium EDP (`black-opium-edp`) — Yves Saint Laurent

- **Acción propuesta:** sustituir_o_reprocesar
- **Defecto:** La variante (EDP) está confirmada correcta — la caja dice 'Eau de Parfum', coincide con el catálogo. PERO se intentó un recorte de prueba (sharp, extrayendo toda la franja derecha del archivo 1500x1500 sin límite de altura) y la base del frasco sigue sin verse completa: la imagen fuente tiene la botella cortada por abajo en el original, no es solo un problema de encuadre/selección — no hay pixeles de la base para recuperar recortando.
- **Estrategia:** sourcing_new_photo
- **Requisitos:**
  - Frasco completo, incluida la base, dentro del encuadre original (no recuperable por recorte de la fuente actual)
  - Sin caja en el encuadre
  - Fondo blanco uniforme
  - Mantener identidad confirmada: Black Opium EDP (YSL) — no cambiar variante
- **Estado:** blocked_pending_source
- **Bloqueo:** Se descartó la hipótesis de recorte tras probarla directamente (evidencia: reports/image-audits/treatment-evidence/black-opium-edp-crop-attempt-base-cutoff.jpg): la base del frasco está fuera del encuadre en el archivo fuente, no solo detrás de la caja. Requiere una fuente fotográfica nueva con el frasco completo.
