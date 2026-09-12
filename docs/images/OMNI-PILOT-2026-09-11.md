# Piloto OMNI de imágenes de producto — hallazgos y preparación (2026-09-11)

**Contexto:** handoff `handoffs/AROMIA_OMNI_PRODUCT_IMAGE_INTEGRATION_2026-09-11.md`
(PR #167, mergeado), absorbido en `ticket-diseno-aromia-punta-a-punta.md` como
WS-6. Este documento registra lo que Code pudo verificar/preparar sin poder
todavía correr el pipeline real, para que quien tenga el MCP `image-toolkit`
conectado (OMNI) pueda ejecutar el piloto sin repetir la investigación.

## 1. Bloqueo verificado — el MCP `image-toolkit` (OMNI) no está conectado en esta sesión

`docs/images/CUTOUT-PILOT-PLAN.md` documenta `remove_background` /
`autotrim_image` / `resize_image` / `convert_image` como herramientas del MCP
`image-toolkit` (infra propia en Railway), usadas "a mano" en una sesión
anterior para validar `bleu-de-chanel-edp` y `1-million` (sin que esos
resultados se hayan guardado como archivos — no existe
`apps/web/public/perfumes/cutouts/` en el repo, y `PERFUME_CUTOUTS` sigue
vacío).

En esta sesión de Code, ese MCP **no aparece entre los servidores conectados**
(confirmado por `ToolSearch` contra la lista completa de herramientas
disponibles). Sin él, Code no puede ejecutar `remove_background` real —y no
debe simularlo con recorte manual/heurístico (contornos, GrabCut, etc.): el
handoff exige que un recorte se apruebe por su fidelidad real (vidrio, líquido,
reflejos, grabados intactos), y una heurística sin ML de segmentación
probablemente fallaría ese estándar y violaría "no aceptar un recorte
simplemente porque el fondo desapareció".

**Para desbloquear:** conectar el MCP `image-toolkit` en una sesión de Code (vía
`claude mcp add`, interactivo — no se puede hacer desde esta sesión
no-interactiva), o correr el pipeline desde el actor/sesión que ya lo tiene
conectado (Cowork, o la sesión de Code que hizo las pruebas de PR #117) y
entregarle a Code los WebP resultantes para integrar (registro +
`public/perfumes/cutouts/` + QA + PR).

## 2. Hallazgo colateral — 4 perfumes ya marcados `omni-product-approved` en Postgres

La columna `visual_quality` de `perfumes` tiene el valor `omni-product-approved`
en 4 filas (`luna-rossa-edt`, `new-york-signature-scent-pure-perfume`,
`chanel-no5-edp`, `straight-to-heaven-white-cristal-edp`), contra
`amazon-runtime-resolved` en las otras 121. **No hay archivos de recorte
correspondientes en el repo** — es sólo un flag de base de datos, de origen no
documentado en este chat, sin ningún WebP real detrás. Vale la pena que quien
retome el piloto confirme con Brey/Cowork si ese flag viene de un trabajo
previo (¿aprobado y perdido? ¿un campo de otro propósito?) antes de asumir que
esos 4 ya están resueltos.

## 3. Selección del piloto — 10 perfumes, cubriendo los 10 tipos difíciles del handoff

Elegidos del catálogo real (125 perfumes, verificado vía API de producción),
sin duplicar `CUTOUT-PILOT-PLAN.md` pero alineados a su misma lista de casos:

| # | Tipo difícil (handoff §4) | Slug | Por qué |
|---|---|---|---|
| 1 | Frasco opaco/mate | `oud-wood` | Tom Ford, negro sólido |
| 2 | Vidrio transparente | `molecule-01` | Escentric Molecules, cilindro claro — también geometría no rectangular |
| 3 | Vidrio translúcido de color | `acqua-di-gio-edt` | vidrio azulado |
| 4 | Líquido de color intenso | `baccarat-rouge-540-edp` | MFK, líquido ámbar/rojo |
| 5 | Tapa cromada/reflectante + fuente con caja | `1-million` | Paco Rabanne, ya documentado en `CUTOUT-PILOT-PLAN.md` como caso con caja |
| 6 | Geometría irregular | `nishane-hacivat` | Nishane, vidrio facetado |
| 7 | Etiqueta de papel | `santal-33-edp` | Le Labo, etiqueta de farmacia envuelta |
| 8 | Packshot limpio de marca | `chanel-no5-edp` | fuente `fimgs.net`, ya con flag `omni-product-approved` (ver §2) |
| 9 | Fuente Amazon difícil | `aventus` | Creed, `m.media-amazon.com`, gráfica compleja de etiqueta |
| 10 | Control de regresión | `bleu-de-chanel-edp` | ya validado `AUTO_CLEAN` a mano en PR #117 — debe seguir dando el mismo resultado |

No cubre "foto sobre fondo no-blanco (lifestyle)" del `CUTOUT-PILOT-PLAN.md`
original — no se encontró un caso claro en el catálogo actual sin poder
inspeccionar las imágenes; quien corra el piloto puede sumarlo si aparece uno
al revisar los `imagen_url` reales.

## 4. Verificado ya conforme — sin cambio necesario

- **§16 "Dónde encontrarlo"** (`PriceTable.tsx`): no muestra precio estático de
  Amazon. El módulo principal dice "Consulta el producto, precio y stock
  actuales" con CTA "Ver en Amazon →"; los precios de `retailers` (scraper Awin,
  desactivado) sólo aparecen en un `<details>` colapsado, rotulado
  "Referencias históricas de precio" — no se presenta como precio vigente.
- **§17 Portada** (parte "no debe cambiar aleatoriamente en cada refresh"): no
  hay `Math.random()` ni lógica de rotación client-side en `app/page.tsx` ni en
  sus componentes — la portada ya es determinística/SSR. La parte de "lógica
  editorial de rotación por edición" (lead/supporting stories, promoción de
  territorios) sigue sin implementar — es contenido nuevo, no un fix.

## 5. Hecho en esta sesión — Guías dentro de Saber (§19 del handoff)

Ver PR correspondiente. Resumen: `/academia` (Saber) gana una sección "05 /
Guías" que lista los artículos `categoria = 'guia'` (4 hoy) enlazando a sus
`/magazine/[slug]` existentes — cero URLs movidas, cero redirects necesarios.
El archivo de Historias (`/magazine`, `EditorialArchive.tsx`) deja de listar
esos artículos y pierde el filtro "Guías" (extiende el mismo patrón que ya
excluía `categoria = 'academia'` de ese archivo). `/buscar` seguía usando
`buildEditorialIndex` sin tocar — los artículos de guía **siguen siendo
buscables** ahí, verificado.

**Hallazgo colateral, no tocado:** los 4 artículos `categoria = 'academia'`
(`academia-piramide-olfativa`, `academia-historia-de-la-perfumeria`,
`academia-familias-olfativas`, `academia-concentraciones-perfume`) están
huérfanos — excluidos de `buildEditorialIndex` (y por tanto de `/magazine` y
`/buscar`) desde antes de esta sesión, y no enlazados desde ningún lado del
sitio, incluyendo `/academia` mismo (que cubre los mismos temas como secciones
estáticas hardcodeadas, no como estos artículos). Podrían ser contenido
superseded, o piezas pensadas como "leer más" desde cada sección estática de
Saber y nunca conectadas. Es una decisión de contenido/Publisher, no técnica —
señalado, no resuelto acá.

## 6. Qué sigue

1. Conectar el MCP `image-toolkit` en una sesión de Code, o correr el pipeline
   en la sesión/actor que ya lo tiene y entregar los 10 WebP de §3.
2. Clasificar cada uno A/B/C/D (handoff §5), registrar sólo los aprobados en
   `PERFUME_CUTOUTS`, subir a preview de Railway y correr el QA de claro/oscuro
   + responsive del handoff §6 antes de escalar.
3. Con el piloto aprobado, recién ahí Fragancias (§15 del handoff) puede
   apoyarse en cutouts reales — hoy no hay ninguno.
4. Historias (ritmo editorial, §14) y Saber (imágenes de materiales, §18) son
   trabajo de composición/curación de Design + ChatGPT, no bloqueado por el
   pipeline pero tampoco ejecutado en esta sesión — vuelven a quedar como
   frente abierto de Design.
