# Piloto de auditoría de imágenes — Fase 2 — Consolidación (Paso 5)

Generado: 2026-08-06T17:06:20.957Z

Este documento consolida, sin alterar ninguno de los resultados originales, tres fuentes: la auditoría vía API de ChatGPT (corrida real 2026-08-05), la capa `operational_review` de reconciliación local, y el resumen real de Cowork. Ninguna llamada nueva a la API fue realizada para generar este documento.

**Confirmaciones (cierre de Fase 2, 2026-08-06):** el único cambio hecho al inventario oficial (`data/image-inventory.csv`) en todo el piloto es la columna `perfume_name` de `sauvage-edp` ("Sauvage EDP" → "Sauvage EDT", por instrucción explícita de Brey) y su `license_status` derivado — nunca aplicado a producción por este script. Ningún `image_url`, `source_url`, slug ni enlace de afiliado fue modificado en ningún perfume. `scripts/images/optimize.mjs` no fue invocado.

## Aventus (`aventus`) — Creed

- **Clasificación visual (ChatGPT):** D (semáforo original rojo, semáforo operativo rojo), confianza 0.98. Recomendación original: "Buscar otra fuente: sustituir por foto auténtica del frasco Aventus con placa metálica.".
- **Resultado Cowork:** license_status=`affiliate-approved`, 1500x1500px, fondo white-studio, calidad visual high.
- **Estado operativo:** deferred_non_blocking
- **Acción propuesta:** conservar_temporalmente
- **Nivel de confianza:** 0.98
- **Condición de aprobación:** Instrucción de cierre de Fase 2 (Brey, 2026-08-06): conservar la imagen y el enlace de Amazon actuales por ahora, sin buscar fuente nueva ni bloquear el avance general. El defecto de fidelidad de marca (etiqueta de papel plana vs. placa metálica grabada real de Creed Aventus) queda documentado como imperfección visual conocida, pendiente para una ronda de pulido visual futura.
- **Motivo resumido:** ChatGPT detectó que la etiqueta no coincide con el diseño real del frasco — un defecto de fidelidad de marca que Cowork no evaluó (su brief cubre licencia/dimensiones/calidad técnica, no fidelidad de diseño). Por instrucción explícita, no se prioriza en este cierre de fase.
- **Conflictos:**
  - Cowork aprobó la imagen (affiliate-approved, criterios de licencia/dimensiones/técnico) pero ChatGPT la clasificó D (criterios de fidelidad de marca y/o reglas no negociables de encuadre de catálogo Aromia) — evaluaron dimensiones distintas del mismo activo, no es un desacuerdo directo pero sí requiere decisión humana sobre cuál criterio prevalece.

## Baccarat Rouge 540 EDP (`baccarat-rouge-540-edp`) — Maison Francis Kurkdjian

- **Clasificación visual (ChatGPT):** A (semáforo original verde, semáforo operativo amarillo), confianza 0.98. Recomendación original: "Usar tal cual".
- **Resultado Cowork:** license_status=`affiliate-approved`, 1200x1500px, fondo white-studio, calidad visual high.
- **Estado operativo:** human_verified_no_issues_remain
- **Acción propuesta:** conservar
- **Nivel de confianza:** 0.98
- **Condición de aprobación:** Ya aprobado — usar tal cual, sin cambios pendientes.
- **Motivo resumido:** Clasificación visual A (alta fidelidad de frasco/tapa/etiqueta). El conflicto de variante EDP/Extrait que ambas auditorías mencionaron de forma independiente queda CERRADO por verificación humana (Brey, 2026-08-06) — ya no es provisional.
- **Conflictos:**
  - Ambigüedad de variante: el texto de la propia respuesta del modelo menciona 'extrait' junto al frasco/caja, mientras el nombre de catálogo declara 'edp'.
  - RESUELTO por verificación humana (Brey, 2026-08-06): la ambigüedad EDP/Extrait detectada por ambas auditorías (ChatGPT vía API y Cowork) no aplica — la variante es correctamente EDP, confirmado.
- **Resolución humana (Baccarat Rouge 540 EDP):**
  - Brey confirmó que Baccarat Rouge 540 EDP es correcta — el conflicto EDP/Extrait queda cerrado.
  - deferred_exception: false
  - blocks_pilot: false
  - La verificación humana resuelve la duda de variante. La clasificación visual A y la recomendación 'usar tal cual' ya no son provisionales — quedan cerradas como conservar.

## Sauvage EDT (`sauvage-edp`) — Dior

- **Clasificación visual (ChatGPT):** D (semáforo original rojo, semáforo operativo rojo), confianza 1. Recomendación original: "Buscar otra fuente fotográfica de Sauvage EDP (no EDT), con fondo uniforme y sin elementos adicionales.".
- **Resultado Cowork:** license_status=`affiliate-approved`, 1000x1000px, fondo white-studio, calidad visual high.
- **Estado operativo:** human_resolved_catalog_name_corrected
- **Acción propuesta:** conservar
- **Nivel de confianza:** 1
- **Condición de aprobación:** Ya aprobado con el nombre corregido — usar tal cual (imagen, enlace y slug sin cambios). Pendiente no bloqueante: la caja aparece en el encuadre (mismo tipo de imperfección visual que Black Opium) — queda para una ronda de pulido visual futura, no bloquea el catálogo.
- **Motivo resumido:** El nombre de catálogo 'Sauvage EDP' era incorrecto — se corrigió a 'Sauvage EDT' (Brey, 2026-08-06). La clasificación D original de ChatGPT se originó en parte en esa expectativa de variante equivocada; con el nombre corregido, identidad e imagen coinciden. Imagen, enlace de Amazon, slug e image_url se conservan sin cambios.
- **Conflictos:**
  - Cowork aprobó la imagen (affiliate-approved, criterios de licencia/dimensiones/técnico) pero ChatGPT la clasificó D (criterios de fidelidad de marca y/o reglas no negociables de encuadre de catálogo Aromia) — evaluaron dimensiones distintas del mismo activo, no es un desacuerdo directo pero sí requiere decisión humana sobre cuál criterio prevalece.
  - Ambigüedad de variante: el texto de la propia respuesta del modelo menciona 'edt, elixir' junto al frasco/caja, mientras el nombre de catálogo declara 'edp'.
  - RESUELTO (Brey, 2026-08-06): la ambigüedad EDT/EDP detectada por las tres lecturas (ChatGPT, Cowork, inspección visual directa) se cierra corrigiendo el nombre de catálogo a 'Sauvage EDT', no sustituyendo la imagen. Historial completo de las 3 versiones de esta resolución en human_resolution.resolution_history.
- **Resolución humana (Sauvage EDT):**
  - Brey resolvió (2026-08-06) renombrar el producto de catálogo de 'Sauvage EDP' a 'Sauvage EDT' — la imagen, el enlace de Amazon, el slug ('sauvage-edp', sin cambios por rutas/SEO) y el image_url se conservan intactos. La clasificación D original de ChatGPT se originó en una expectativa de variante incorrecta (se esperaba EDP); con el nombre corregido, identidad e imagen coinciden.
  - deferred_exception: false
  - blocks_pilot: false
  - La clasificación D original de ChatGPT (caja visible, recorte, Y duda de variante) se originó parcialmente en una expectativa de variante incorrecta. Los motivos técnicos independientes (caja en el encuadre) siguen siendo una imperfección visual conocida, pero por instrucción explícita no bloquean el avance general — Sauvage EDT queda 'conservar' con esa mejora pendiente para una ronda de pulido visual futura, no crítica.

## Black Opium EDP (`black-opium-edp`) — Yves Saint Laurent

- **Clasificación visual (ChatGPT):** D (semáforo original rojo, semáforo operativo rojo), confianza 0.97. Recomendación original: "Buscar o producir una imagen donde el frasco esté completo y sin la caja (solo el frasco sobre fondo blanco uniforme), para cumplir el estándar de catálogo Aromia.".
- **Resultado Cowork:** license_status=`affiliate-approved`, 1500x1500px, fondo white-studio, calidad visual high.
- **Estado operativo:** deferred_non_blocking
- **Acción propuesta:** conservar_temporalmente
- **Nivel de confianza:** 0.97
- **Condición de aprobación:** Instrucción de cierre de Fase 2 (Brey, 2026-08-06): conservar la imagen y el enlace de Amazon actuales por ahora, sin buscar fuente nueva ni bloquear el avance general. La composición (caja visible en el encuadre) sigue violando una regla no negociable de catálogo Aromia, pero queda documentada como imperfección visual conocida, pendiente para una ronda de pulido futura.
- **Motivo resumido:** El frasco es auténtico y la variante coincide (Cowork confirma 'Eau de Parfum' en la etiqueta). La composición viola una regla no negociable de catálogo (caja visible), pero por instrucción explícita no se prioriza en este cierre de fase.
- **Conflictos:**
  - Cowork aprobó la imagen (affiliate-approved, criterios de licencia/dimensiones/técnico) pero ChatGPT la clasificó D (criterios de fidelidad de marca y/o reglas no negociables de encuadre de catálogo Aromia) — evaluaron dimensiones distintas del mismo activo, no es un desacuerdo directo pero sí requiere decisión humana sobre cuál criterio prevalece.

## Erba Pura (`erba-pura`) — Xerjoff

- **Clasificación visual (ChatGPT):** A (semáforo original verde, semáforo operativo verde), confianza 0.98. Recomendación original: "Usar tal cual.".
- **Resultado Cowork:** license_status=`affiliate-approved`, 1500x1500px, fondo white-studio, calidad visual high.
- **Estado operativo:** no_review_required
- **Acción propuesta:** conservar
- **Nivel de confianza:** 0.98
- **Condición de aprobación:** Ya aprobado — usar tal cual, sin cambios pendientes.
- **Motivo resumido:** Ambas auditorías (ChatGPT y Cowork) coinciden en alta fidelidad y calidad técnica, sin hallazgos de identidad, variante ni composición.
- **Conflictos:** ninguno.
