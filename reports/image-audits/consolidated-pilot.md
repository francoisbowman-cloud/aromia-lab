# Piloto de auditoría de imágenes — Fase 2 — Consolidación (Paso 5)

Generado: 2026-08-06T14:14:37.196Z

Este documento consolida, sin alterar ninguno de los resultados originales, tres fuentes: la auditoría vía API de ChatGPT (corrida real 2026-08-05), la capa `operational_review` de reconciliación local, y el resumen real de Cowork. Ninguna llamada nueva a la API fue realizada para generar este documento.

**Confirmaciones:** el inventario oficial (`data/image-inventory.csv`) no fue sobrescrito por este script ni aplicado a producción. `scripts/images/optimize.mjs` no fue invocado. Ningún `image_url` fue modificado.

## Aventus (`aventus`) — Creed

- **Clasificación visual (ChatGPT):** D (semáforo original rojo, semáforo operativo rojo), confianza 0.98. Recomendación original: "Buscar otra fuente: sustituir por foto auténtica del frasco Aventus con placa metálica.".
- **Resultado Cowork:** license_status=`affiliate-approved`, 1500x1500px, fondo white-studio, calidad visual high.
- **Estado operativo:** no_review_required
- **Acción propuesta:** sustituir
- **Nivel de confianza:** 0.98
- **Condición de aprobación:** No aprobar como catalog-primary hasta conseguir una fuente fotográfica con la placa metálica grabada auténtica (la imagen actual muestra una etiqueta de papel plana, no la placa real de Creed Aventus).
- **Motivo resumido:** ChatGPT detectó que la etiqueta no coincide con el diseño real del frasco (placa metálica vs. etiqueta de papel) — un defecto de fidelidad de marca que Cowork no evaluó (su brief cubre licencia/dimensiones/calidad técnica, no fidelidad de diseño frente a la referencia real).
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

## Sauvage EDP (`sauvage-edp`) — Dior

- **Clasificación visual (ChatGPT):** D (semáforo original rojo, semáforo operativo rojo), confianza 1. Recomendación original: "Buscar otra fuente fotográfica de Sauvage EDP (no EDT), con fondo uniforme y sin elementos adicionales.".
- **Resultado Cowork:** license_status=`unknown`, 1000x1000px, fondo white-studio, calidad visual high.
- **Estado operativo:** human_confirmed_wrong_variant_image
- **Acción propuesta:** sustituir
- **Nivel de confianza:** 1
- **Condición de aprobación:** No aprobar como catalog-primary con la fuente actual bajo ninguna circunstancia — es una foto de Sauvage EDT, variante distinta a la del catálogo (Sauvage EDP). Requiere una fuente fotográfica nueva y verificada de Sauvage EDP (caja debe decir 'Eau de Parfum'), sin caja en el encuadre, fondo uniforme, sin recorte agresivo.
- **Motivo resumido:** Brey confirmó (2026-08-06), tras inspección visual directa del archivo, que la imagen es de Sauvage EDT — corrige la resolución del 2026-08-05 que había dado la imagen por correcta. Las tres auditorías (ChatGPT, Cowork, inspección directa) coincidían en la señal de alerta; la duda quedó resuelta a favor de 'la imagen está mal', no de 'el nombre de catálogo está mal'.
- **Conflictos:**
  - Ambigüedad de variante: el texto de la propia respuesta del modelo menciona 'edt, elixir' junto al frasco/caja, mientras el nombre de catálogo declara 'edp'.
  - RESUELTO por verificación humana (Brey, 2026-08-06), CORRIGIENDO una resolución humana previa (2026-08-05) que había cerrado el mismo conflicto en sentido contrario: la imagen es confirmada Sauvage EDT, no EDP. Las tres auditorías (ChatGPT, Cowork, inspección visual directa) tenían razón en marcar la duda.
- **Resolución humana (Sauvage EDP):**
  - Brey confirmó (2026-08-06) que la imagen actual es de Sauvage EDT, no de Sauvage EDP — la imagen está mal, no el nombre de catálogo. Corrige la resolución anterior del 2026-08-05, que daba la imagen por correcta.
  - deferred_exception: false
  - blocks_pilot: false
  - La imagen debe SUSTITUIRSE por una fuente real de Sauvage EDP (no alcanza con recortar la actual — el producto fotografiado es la variante equivocada). Mismo tipo de tratamiento que Aventus: sourcing de fuente nueva, no reprocesamiento de la existente.

## Black Opium EDP (`black-opium-edp`) — Yves Saint Laurent

- **Clasificación visual (ChatGPT):** D (semáforo original rojo, semáforo operativo rojo), confianza 0.97. Recomendación original: "Buscar o producir una imagen donde el frasco esté completo y sin la caja (solo el frasco sobre fondo blanco uniforme), para cumplir el estándar de catálogo Aromia.".
- **Resultado Cowork:** license_status=`affiliate-approved`, 1500x1500px, fondo white-studio, calidad visual high.
- **Estado operativo:** no_review_required
- **Acción propuesta:** sustituir_o_reprocesar
- **Nivel de confianza:** 0.97
- **Condición de aprobación:** Sustituir por, o reprocesar hacia, una fuente donde aparezca solo el frasco completo (sin caja, sin recorte agresivo), sobre fondo uniforme — regla no negociable de catálogo Aromia.
- **Motivo resumido:** El frasco es auténtico y la variante coincide (Cowork confirma 'Eau de Parfum' en la etiqueta), pero la composición viola dos reglas no negociables de catálogo Aromia: la caja aparece en el encuadre y el frasco está parcialmente recortado. Cowork aprobó por no evaluar esas reglas específicas de Aromia.
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
