# Plan de piloto — 5 perfumes

**Fase:** Fase 1 — Fundación del sistema de imágenes
**Estado:** preparado, **sin ejecutar**. Requiere aprobación explícita de
Brey antes de procesar una sola imagen (sección 16 del manual operativo:
"Solo después del piloto se congela el estándar").
**Fecha de preparación:** 2026-08-05
**Fuente de datos:** `GET /api/perfumes` en producción real (Railway), no el
CSV desactualizado — ver `docs/images/CURRENT-STATE-AUDIT.md` sección 3.

---

## Los 5 perfumes (orden fijado por el manual, sección 16)

| # | Perfume | Marca | Slug | Categoría |
|---|---|---|---|---|
| 1 | Aventus | Creed | `aventus` | lujo |
| 2 | Baccarat Rouge 540 EDP | Maison Francis Kurkdjian | `baccarat-rouge-540-edp` | lujo |
| 3 | Sauvage EDP | Dior | `sauvage-edp` | premium |
| 4 | Black Opium EDP | Yves Saint Laurent | `black-opium-edp` | premium |
| 5 | Erba Pura | Xerjoff | `erba-pura` | lujo |

Los 5 están confirmados presentes en el catálogo real de producción
(verificado en vivo el 2026-08-05), y los 5 tienen mockup editorial OVL ya
existente en `apps/web/public/ovl/{slug}.jpg` — son, junto con el resto de
los 38 originales, el subconjunto del catálogo con más cobertura visual hoy.

---

## Por perfume

### 1. Aventus (Creed)

- **Estado actual**: imagen de catálogo hotlinked desde
  `m.media-amazon.com` (`.../I/71nY6hb7uuL._SL1500_.jpg`). Mockup editorial:
  `apps/web/public/ovl/aventus.jpg` (existe).
- **Fuente disponible**: la misma URL de Amazon ya en uso — no hay otra
  fuente confirmada todavía. Sección 13 de `ESTADO-aromia.md` no reporta
  ningún problema conocido de fidelidad para este perfume.
- **Problemas**: ninguno confirmado — pendiente de la auditoría visual real
  (Paso 4, brief de ChatGPT) antes de asumir que la foto actual es
  publicable tal cual.
- **Imagen de catálogo requerida**: derivado 4:5, `aventus--catalog--v01--*`
  en los 5 tamaños de `docs/images/IMAGE-ARCHITECTURE.md` sección 6,
  formatos WebP + AVIF.
- **Hero editorial requerido**: derivado `aventus--editorial--v01--*`
  (móvil + desktop), a partir del mockup OVL existente o de una pieza nueva
  si Brey/ChatGPT deciden reemplazarlo.
- **Tamaños**: ver tabla de la sección 6 de `IMAGE-ARCHITECTURE.md`.
- **Responsables**: Cowork (confirmar procedencia/licencia de la foto de
  Amazon vía `delegations/COWORK-IMAGE-INVENTORY-BRIEF.md`), ChatGPT
  (auditoría visual vía `delegations/CHATGPT-VISUAL-AUDIT-BRIEF.md`), Code
  (generar derivados con `scripts/images/optimize.mjs`, integrar).
- **Delegaciones**: las dos de arriba, en ese orden — no tiene sentido
  procesar antes de saber si la fuente es apta.
- **Criterios de aprobación**: clasificación A o B en la auditoría de
  ChatGPT (sección 13 del manual, umbral ≥80/100 o corrección menor);
  aprobación final de Brey (checklist sección 20).
- **Pruebas**: `scripts/images/report.mjs` en verde sobre los derivados
  generados; verificación visual en `/perfumes/aventus` local antes de
  cualquier despliegue.
- **Rollback**: no reemplazar `imagen_url` en Postgres hasta tener el
  derivado aprobado y probado — mientras tanto, el hotlink actual sigue
  sirviendo sin interrupción. Si algo falla post-integración, revertir el
  commit del PR de esa fase (no de esta, la Fase 1 no toca producción).

### 2. Baccarat Rouge 540 EDP (Maison Francis Kurkdjian)

- **Estado actual**: hotlinked desde `m.media-amazon.com`
  (`.../I/71xVLhLWrvL._SL1500_.jpg`). Mockup OVL: `ovl/baccarat-rouge-540-edp.jpg`.
- **Fuente disponible**: misma URL de Amazon en uso.
- **Problemas**: ninguno confirmado en el historial de decisiones — no
  aparece entre los bugs de imagen ya corregidos (Le Male, La Vie Est Belle,
  decisión #79 de `ESTADO-aromia.md`).
- **Imagen de catálogo / hero / tamaños**: mismo patrón que Aventus.
- **Responsables / Delegaciones / Criterios / Pruebas / Rollback**: idéntico
  al ítem 1, aplicado a este slug.

### 3. Sauvage EDP (Dior)

- **Estado actual**: hotlinked desde `m.media-amazon.com`
  (`.../I/51F8MEfiKgL._SL1000_.jpg`). Mockup OVL: `ovl/sauvage-edp.jpg`.
- **Fuente disponible**: misma URL de Amazon en uso.
- **Problemas**: ninguno confirmado. **Nota de contexto**: existe un Sauvage
  distinto en el catálogo, `sauvage-elixir` (uno de los 12 Dior sin mockup
  OVL, decisión #89) — no confundir slugs al procesar, son productos
  distintos.
- **Imagen de catálogo / hero / tamaños / responsables / etc.**: mismo
  patrón que los ítems anteriores.

### 4. Black Opium EDP (Yves Saint Laurent)

- **Estado actual**: hotlinked desde `m.media-amazon.com`
  (`.../I/71w9icubQlL._SL1500_.jpg`). Mockup OVL: `ovl/black-opium-edp.jpg`.
- **Fuente disponible**: misma URL de Amazon en uso.
- **Problemas**: ninguno confirmado.
- **Resto**: mismo patrón que los ítems anteriores.

### 5. Erba Pura (Xerjoff)

- **Estado actual**: hotlinked desde `m.media-amazon.com`
  (`.../I/51h-KPGkCWL._SL1500_.jpg`). Mockup OVL: `ovl/erba-pura.jpg`.
- **Caso especial**: según `ESTADO-aromia.md` (decisión #26, histórica, de
  cuando `main` todavía era el sitio v1 estático), Erba Pura tuvo en algún
  momento una imagen editorial generada con IA integrada como prueba piloto
  puntual. Esa pieza vivía en el v1 estático (hoy preservado en el tag
  `legacy-static-v1-final`, no en `main`) — **no verificado en esta
  auditoría** si es el mismo archivo que el mockup OVL actual en
  `ovl/erba-pura.jpg` (que corresponde al set 1:1 de las decisiones #75/#80,
  de una sesión posterior). Antes de tratar el mockup actual como definitivo,
  vale la pena que Brey confirme si esa pieza vieja de IA sigue siendo
  relevante o si se descarta sin más.
- **Resto**: mismo patrón que los ítems anteriores.

---

## Qué NO hace este plan todavía

- No descarga ni procesa ninguna de las 5 imágenes.
- No llama a ChatGPT ni a Cowork — los briefs están listos
  (`delegations/`), pero no se dispararon.
- No corre `scripts/images/optimize.mjs` sin `--dry-run` sobre estos 5.
- No toca `imagen_url` de ningún perfume en Postgres.

## Secuencia propuesta para cuando se apruebe ejecutar

1. Code corre `delegations/COWORK-IMAGE-INVENTORY-BRIEF.md` sobre estos 5
   (subconjunto del inventario completo) para confirmar `license_status`.
2. Code arma los 5 mensajes de `delegations/CHATGPT-VISUAL-AUDIT-BRIEF.md`
   y los envía.
3. Con clasificación A/B confirmada, Code corre `optimize.mjs --dry-run`
   por perfume, revisa la salida.
4. Sin `--dry-run`, genera los derivados reales en una carpeta de trabajo
   (no directo en `apps/web/public/` todavía).
5. `scripts/images/report.mjs` sobre esa carpeta — debe pasar en verde.
6. Brey revisa visualmente los 5 resultados.
7. Solo con la aprobación de Brey: mover los derivados a
   `apps/web/public/images/perfumes/{slug}/`, actualizar `metadata.json`,
   PR aparte (no en la Fase 1), congelar el estándar (Paso 11 del manual).
