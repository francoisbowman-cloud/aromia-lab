# Piloto de auditoría de imágenes — Fase 2 — Consolidación (Paso 5)

Generado: 2026-08-06T03:55:42.988Z

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
- **Estado operativo:** requires_human_review
- **Acción propuesta:** conservar_provisional
- **Nivel de confianza:** 0.98
- **Condición de aprobación:** Confirmar contra fuente oficial (empaque real / retailer autorizado) si el frasco fotografiado es Eau de Parfum o Extrait de Parfum antes de aprobación final para catálogo — dos auditorías independientes (ChatGPT y Cowork) citan 'Extrait de Parfum' en la caja mostrada, mientras el catálogo declara 'EDP'.
- **Motivo resumido:** Clasificación visual A (alta fidelidad de frasco/tapa/etiqueta), pero se conserva PROVISIONALMENTE — persiste una duda de variante no resuelta (EDP vs. Extrait de Parfum) mencionada de forma independiente por ambas auditorías.
- **Conflictos:**
  - Ambigüedad de variante: el texto de la propia respuesta del modelo menciona 'extrait' junto al frasco/caja, mientras el nombre de catálogo declara 'edp'.

## Sauvage EDP (`sauvage-edp`) — Dior

- **Clasificación visual (ChatGPT):** D (semáforo original rojo, semáforo operativo rojo), confianza 1. Recomendación original: "Buscar otra fuente fotográfica de Sauvage EDP (no EDT), con fondo uniforme y sin elementos adicionales.".
- **Resultado Cowork:** license_status=`unknown`, 1000x1000px, fondo white-studio, calidad visual high.
- **Estado operativo:** human_verified_identity_technical_issues_remain
- **Acción propuesta:** sustituir_o_reprocesar_fuente
- **Nivel de confianza:** 1
- **Condición de aprobación:** Identidad de producto ya confirmada por Brey (no requiere más verificación). Falta: nueva fuente fotográfica o reprocesamiento que muestre solo el frasco (sin caja), fondo uniforme, sin recorte agresivo, antes de aprobar como catalog-primary.
- **Motivo resumido:** Verificación humana (Brey, 2026-08-05) confirma que imagen y enlace corresponden a Sauvage EDP — la duda de variante EDT/EDP detectada por ambas auditorías queda resuelta como excepción no bloqueante. La clasificación D original se mantiene por motivos técnicos ajenos a la variante (caja visible en el encuadre, recorte agresivo, contraste), no por duda de identidad.
- **Conflictos:**
  - Ambigüedad de variante: el texto de la propia respuesta del modelo menciona 'edt, elixir' junto al frasco/caja, mientras el nombre de catálogo declara 'edp'.
  - RESUELTO por verificación humana (Brey, 2026-08-05): la ambigüedad EDT/EDP detectada automáticamente por ambas auditorías (ChatGPT vía API y Cowork) no aplica — el producto es Sauvage EDP, confirmado.
- **Resolución humana (Sauvage EDP):**
  - Brey verificó personalmente que tanto la imagen como el enlace de origen corresponden a Sauvage EDP.
  - deferred_exception: false
  - blocks_pilot: false
  - blocks_final_sauvage_change: false
  - La verificación humana resuelve la duda de IDENTIDAD (¿es Sauvage EDP?). No resuelve por sí sola los motivos TÉCNICOS independientes que ya llevaron a clasificación D (caja visible en el encuadre, recorte agresivo, contraste) — esos siguen vigentes y separados de la duda de variante.

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
