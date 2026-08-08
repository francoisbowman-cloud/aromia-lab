# Piloto de auditoría de imágenes — Fase 2 — Cierre

Generado: 2026-08-06T17:06:21.523Z

Estado final de los 3 perfumes con imperfecciones visuales detectadas. Sauvage EDP quedó resuelto renombrando el producto (no la imagen). Aventus y Black Opium quedan diferidos, sin bloquear el avance general, por instrucción explícita. Ningún `image_url` fue modificado en esta corrida; el único cambio al inventario oficial es el renombre de Sauvage. `scripts/images/optimize.mjs` no fue invocado.

## Aventus (`aventus`) — Creed

- **Estado:** deferred_non_blocking
- **Acción propuesta:** conservar_temporalmente
- **Defecto:** Confirmado por inspección visual directa del archivo (2026-08-06): la etiqueta del frasco fotografiado es un rectángulo blanco plano impreso, no la placa metálica grabada con el jinete que lleva el frasco real de Creed Aventus. Es un defecto de fidelidad de marca, no técnico.
- **Evidencia:** reports/image-audits/treatment-evidence/aventus-current-flat-label-confirmed.jpg
- **Nota de cierre:** Por instrucción de Brey (cierre de Fase 2, 2026-08-06): se conserva la imagen y el enlace de Amazon actuales. No se busca fuente nueva ni se descargan más candidatos. No bloquea el avance del roadmap general — queda para una ronda de pulido visual futura.
- **Si se revisita en el futuro, requisitos:**
  - Frasco con placa metálica grabada visible (no etiqueta de papel plana)
  - Fondo blanco uniforme, sin logos de retailer
  - Botella completa, sin recortes agresivos

## Black Opium EDP (`black-opium-edp`) — Yves Saint Laurent

- **Estado:** deferred_non_blocking
- **Acción propuesta:** conservar_temporalmente
- **Defecto:** La variante (EDP) está confirmada correcta — la caja dice 'Eau de Parfum', coincide con el catálogo. Un recorte de prueba (sharp, franja derecha completa del archivo 1500x1500) mostró que la base del frasco queda fuera del encuadre fuente — no es solo la caja tapando, y no es recuperable recortando.
- **Evidencia:** reports/image-audits/treatment-evidence/black-opium-edp-crop-attempt-base-cutoff.jpg
- **Nota de cierre:** Por instrucción de Brey (cierre de Fase 2, 2026-08-06): se conserva la imagen y el enlace de Amazon actuales. No se busca fuente nueva ni se descargan más candidatos. No bloquea el avance del roadmap general — queda para una ronda de pulido visual futura.
- **Si se revisita en el futuro, requisitos:**
  - Frasco completo, incluida la base, dentro del encuadre original
  - Sin caja en el encuadre
  - Fondo blanco uniforme

## Sauvage EDT (`sauvage-edp`) — Dior

- **Estado:** resolved_catalog_name_corrected
- **Acción propuesta:** conservar
- **Defecto:** RESUELTO (ya no es un defecto de imagen). La imagen siempre fue Sauvage EDT — el nombre de catálogo 'Sauvage EDP' era el que estaba mal.
- **Evidencia:** reports/image-audits/treatment-evidence/sauvage-edp-contradiction-eau-de-toilette.jpg (imagen original, ahora consistente con el nombre corregido)
- **Nota de cierre:** Nombre de catálogo corregido a 'Sauvage EDT' (Brey, 2026-08-06) en PERFUMES_INITIAL_50.csv (raíz + apps/api/data/), data/image-inventory.csv y config/image-audit-pilot.json. Imagen, enlace de Amazon, slug (sauvage-edp) e image_url sin cambios. Intento de sourcing de una fuente EDP real (2 búsquedas en Amazon, 1 candidato rechazado por ser 'Parfum' y no 'Eau de Parfum' — reports/image-audits/treatment-evidence/sauvage-edp-candidate1-REJECTED-is-parfum-not-edp.jpg) queda sin efecto: ya no hace falta reemplazar la imagen.
