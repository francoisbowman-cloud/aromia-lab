# Piloto OMNI de imágenes de producto — resultados (2026-09-12)

**Actualizado 2026-09-12 (continuación same-day):** se resolvieron los 3
pendientes que eran técnicamente resolubles sin intervención de
Brey/ChatGPT — ver "Actualización" al final de cada fila afectada y la
sección de cierre. Quedan sólo los 2 casos C (decisión de re-sourcing vs.
imagen IA) como bloqueo real de producto, no técnico.

**Contexto:** continuación de `docs/images/OMNI-PILOT-2026-09-11.md` (selección de
los 10 slugs) y `ticket-diseno-aromia-punta-a-punta.md` (D-11, WS-6). El MCP
`image-toolkit` (OMNI) quedó conectado en esta sesión de Code y se corrió el
pipeline completo (`remove_background` → `autotrim_image` → `resize_image` →
`convert_image`) para los 10 perfumes del piloto, clasificando cada caso según
el estándar A/B/C/D del handoff
(`handoffs/AROMIA_OMNI_PRODUCT_IMAGE_INTEGRATION_2026-09-11.md` §5).

**Nada de esto está integrado todavía** — no se tocó `PERFUME_CUTOUTS`, no hay
deploy a preview, no hay aprobación de Brey. Este documento es el insumo para
esa decisión, según el gate de aprobación por tramos.

## Resultados por slug

| # | Slug | Clasificación | Asset guardado | Notas |
|---|---|---|---|---|
| 1 | `oud-wood` | **B** — AUTO_NEEDS_REMEDIATION | ✅ `apps/web/public/perfumes/cutouts/oud-wood.webp` (450×849) | Frasco negro opaco sobre fondo negro/casi-negro (el caso de riesgo exacto que señala el handoff §13.1). El recorte automático es correcto (verificado con prueba de contraste sobre fondo magenta — no es fondo sin remover, es el canal alfa real), pero queda un artefacto delgado (hueco magenta) en la unión tapa/cuello que debería ser opaco. Necesita limpieza de borde antes de aprobar. |
| 2 | `molecule-01` | **A** — AUTO_CLEAN | ✅ `apps/web/public/perfumes/cutouts/molecule-01.webp` (300×494) | Vidrio transparente, etiqueta blanca real (confirmada con prueba de contraste verde — no se confunde con el fondo). Contorno limpio incluyendo geometría no rectangular del cuello/tapa metálica. **Actualización:** reprocesado con el mismo pipeline a un tamaño más chico (width=300, quality=70); el base64 llegó completo esta vez y decodificó byte-exacto (15906 bytes) contra el `size_bytes` reportado. |
| 3 | `acqua-di-gio-edt` | **A** — AUTO_CLEAN | ✅ `apps/web/public/perfumes/cutouts/acqua-di-gio-edt.webp` (300×534) | Vidrio translúcido, reflejo bajo el frasco preservado como parte de la composición original. Confirmado limpio con prueba de contraste. **Actualización:** mismo reprocesamiento a tamaño reducido; base64 completo, decodificado byte-exacto (11764 bytes). |
| 4 | `baccarat-rouge-540-edp` | **C** — SOURCE_PROBLEM | — | La foto trae frasco + caja (composición retail), exactamente el patrón que `CUTOUT-PILOT-PLAN.md` ya había señalado como "bucket difícil". No se procesó el pipeline completo — necesita fuente solo-frasco o imagen IA de ChatGPT. **Sigue bloqueado** — es decisión de producto (re-sourcing vs. generativo), no técnica; no se intentó resolver unilateralmente. |
| 5 | `1-million` | **C** — SOURCE_PROBLEM | — | Mismo caso que `CUTOUT-PILOT-PLAN.md` ya documentaba: frasco + caja. Confirmado, sin cambios respecto al hallazgo anterior. **Sigue bloqueado**, mismo motivo que #4. |
| 6 | `nishane-hacivat` | **A** — AUTO_CLEAN | ✅ `apps/web/public/perfumes/cutouts/nishane-hacivat.webp` (300×464) | **Resuelto.** La fuente original (`cdn0.woolworths.media`) seguía devolviendo 403. Se re-sourceó vía Amazon (`m.media-amazon.com/images/I/41bBN+h5-DL._SL1500_.jpg`, encontrada navegando el listing real de "Nishane Hacivat Extrait De Parfum" — no un placeholder ni otro perfume). Frasco cúbico opaco color hueso con tapa dorada facetada; contorno limpio confirmado con prueba de contraste magenta, sin bleed de fondo. Pendiente: decidir si esta URL de Amazon reemplaza el `imagen_url` actual del catálogo (roto) — no se tocó la base de datos en esta sesión, sólo el asset de cutout. |
| 7 | `santal-33-edp` | **A** — AUTO_CLEAN | ✅ `apps/web/public/perfumes/cutouts/santal-33-edp.webp` (150×295) | Etiqueta de papel con texto real intacto, contorno limpio. Fuente ya era pequeña (~53 KB), lo que ayudó a una transferencia sin corrupción. |
| 8 | `chanel-no5-edp` | **A** — AUTO_CLEAN | ✅ `apps/web/public/perfumes/cutouts/chanel-no5-edp.webp` (301×523) | Packshot de marca ya de calidad editorial (fuente `fimgs.net`). Etiqueta blanca real confirmada con prueba de contraste; tapa de cristal con reflejos intactos. Coincide con el flag `omni-product-approved` que ya tenía en Postgres (ver hallazgo colateral de la sesión anterior). |
| 9 | `aventus` | **A** — AUTO_CLEAN | ✅ `apps/web/public/perfumes/cutouts/aventus.webp` (450×783) | Fuente Amazon con etiqueta gráfica compleja (jinete + tipografía) — resultó limpia. Textura de cuero de la banda negra y grabados metálicos del logo intactos. |
| 10 | `bleu-de-chanel-edp` | **A** — AUTO_CLEAN (control de regresión) | ✅ `apps/web/public/perfumes/cutouts/bleu-de-chanel-edp.webp` (570×776) | Confirma que el pipeline sigue dando el mismo resultado que la validación manual previa (PR #117). |

**Resumen actualizado:** 7 en A (auto_clean, todos con asset guardado), 1 en B
(auto_needs_remediation, asset guardado, pendiente de limpieza de borde), 2 en
C (source_problem, caja — sin procesar, bloqueo de producto no técnico), 0
bloqueados por fuente inaccesible, 0 en D.

## Nota técnica — fiabilidad de la transferencia de archivos

El MCP `image-toolkit` corre en un servidor remoto (Railway) y no tiene acceso
directo al filesystem de esta sesión. La única vía para traer un asset al
repo es `get_result_base64` (devuelve el archivo codificado en base64 dentro
de la respuesta del tool), que esta sesión debe reproducir íntegro en un
`Write` para poder decodificarlo con `base64 -d`.

Para archivos pequeños (~5-30 KB) esto funcionó de forma confiable, verificando
siempre el tamaño decodificado contra el `size_bytes` reportado por la tool
antes de dar el asset por bueno. Para dos casos puntuales (`molecule-01`,
`acqua-di-gio-edt`) la reproducción del base64 se truncó de forma consistente
en el mismo punto en reintentos sucesivos, sin que la respuesta del tool
mostrara ningún aviso de truncamiento — es decir, el problema está en el canal
de esta sesión hacia el archivo local, no en el MCP. No se encontró una causa
determinística (no es un límite de tamaño: casos más grandes sí se
transfirieron bien).

**Resuelto en esta misma sesión (continuación same-day):** reprocesando
`molecule-01` y `acqua-di-gio-edt` a un tamaño de salida más chico
(width=300 en vez de 620, quality=70 en vez de 82) el base64 llegó completo
en ambos casos y decodificó byte-exacto contra `size_bytes`. No se identificó
la causa raíz de por qué esos dos truncaban a un tamaño mayor mientras
archivos más grandes de otros slugs sí pasaban — quedó mitigado, no
explicado. Para quien encuentre el mismo síntoma en una escalada futura:
probar primero a bajar el tamaño de salida antes de asumir que el asset es
irrecuperable.

## Cierre del piloto (2026-09-12, decisión de Brey)

- **Los 2 casos C se quedan con su caja.** Brey confirmó explícitamente
  dejar `baccarat-rouge-540-edp` y `1-million` tal cual (foto de retail con
  packaging) — no se re-sourcea ni se genera imagen IA por ahora. Quedan
  fuera de `PERFUME_CUTOUTS`, usando el fallback Opción A de siempre.
- **`nishane-hacivat` confirmado.** Brey verificó que la URL de Amazon
  encontrada (`m.media-amazon.com/images/I/41bBN+h5-DL._SL1500_.jpg`,
  producto `B07TTCL5HY`) es el mismo perfume — pegó el link del listing de
  Amazon como confirmación. Se actualizó `imagen_url` en la Postgres de
  producción vía `PATCH /api/admin/perfumes/44` (mecanismo administrativo
  existente, mismo patrón que la decisión #106), verificado en la respuesta
  de la API.
- **Sign-off dado.** Brey dio luz verde para QA + commit/PR de los 7 assets
  A. `oud-wood` (B) queda fuera del lote aprobado por el artefacto de borde
  sin resolver — no se registra en `PERFUME_CUTOUTS`.
- **`PERFUME_CUTOUTS` registrado** con los 7 slugs A: `bleu-de-chanel-edp`,
  `chanel-no5-edp`, `santal-33-edp`, `aventus`, `molecule-01`,
  `acqua-di-gio-edt`, `nishane-hacivat`.

## Qué queda pendiente (fuera del alcance de este cierre)

- Resolver el artefacto de borde de `oud-wood` en una sesión futura si se
  quiere sumarlo al lote aprobado.
- Trazabilidad mínima por asset (handoff §8: hash SHA-256, procedencia) —
  no se generó en esta sesión; necesaria antes de escalar a los 125.
- Decidir en algún momento si los 2 casos C se resuelven con re-sourcing o
  imagen IA — quedó explícitamente pausado, no descartado.

## Qué NO se tocó

- Los 2 casos C (`baccarat-rouge-540-edp`, `1-million`) — sin cutout, sin
  cambio de `imagen_url`, a pedido explícito de Brey.
- `/api/catalog-image` y el fallback CSS (Opción A) siguen intactos para
  todo slug fuera de `PERFUME_CUTOUTS`.
- No se tocó ninguna otra columna de `perfumes` fuera de `imagen_url` de
  `nishane-hacivat`.
