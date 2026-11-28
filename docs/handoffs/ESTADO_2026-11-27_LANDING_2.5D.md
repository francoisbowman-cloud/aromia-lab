# Aromia — estado al 2026-11-27 (landing 2.5D, ingredientes, capas del hero)

Léelo antes que `RESUMEN_PARA_RETOMAR_2026-11-23.md`, que quedó desfasado (dice que el PR #214 está pendiente). Si algo de aquí contradice lo que devuelve un comando, manda el comando.

## Ya en `main` y en producción (`www.aromialab.com`)
| PR | Qué | Merge |
|---|---|---|
| #214 | Integración: Next 16.4.6 + React 19 + Tiptap 3. Migraciones 024–029 (Intelligence) **no hacen falta**: son opt-in y `INTELLIGENCE_ENABLED` no existe en prod. | `5ba7349` (24/11) |
| #217 | Landing nueva + tratamiento 2.5D (`LandingHero.tsx`, `DepthEffects.tsx`, `depth-25d.css`), nav «AROMIA / LAB», tilt en Magazine/Saber, arreglo de React #418. | `744e845` |
| #218 | Imágenes frescas (Google Flow) para Florales, Amaderadas, Ámbar y Chipre. | `cd06ce0` |
| #219 | Bergamota nueva en `/academia`. | `1598f3b` |

Bergamota fresca (`bergamot-fresh-*.webp`) en hero, tarjeta «Cítricas», Discovery y `/academia`. Todas las imágenes de IA llevan «Imagen generada con IA · AROMIA» y su procedencia en `public/editorial-v1/landing-fresh-ingredients.provenance.json`.

## En curso: capas reales del hero (rama `feat/hero-layers`, NO mergeada)
Objetivo: pasar el parallax del hero de una sola ilustración a **capas reales con transparencia**.

Hecho (cortes ya en `apps/web/public/editorial-v1/hero/`):
- `layer-bottle.webp` (640×1064): frasco ámbar con tapa de travertino, sin marca.
- `layer-stone.webp` (1300×797): bloque de travertino con seda burdeos.
- `layer-blossom.webp` (1000×591): rama de azahar.

Pendiente:
1. **Muro de fondo**: ya generado en Flow (proyecto «nov 27 - 18:07», imagen «Empty chocolate-brown plaster wall…»). Falta descargarlo a 2K y guardarlo como `hero/layer-wall.webp` (~1600 px de ancho, sin transparencia). Si Flow no coopera, se puede usar un degradado CSS marrón con luz diagonal.
2. **Maquetar la escena** en `LandingHero.tsx`/`depth-25d.css`: muro (d≈-8, con máscara de fundido a la izquierda en escritorio) → piedra (d≈16, abajo a la derecha) → frasco (d≈28, apoyado delante de la piedra, con sombra de contacto CSS) → azahar (d≈46, entrando por arriba a la derecha) → medallones con los ingredientes frescos (bergamota, rosa, resina). Sustituye `.d25-plate`/`.d25-sheen`.
3. Actualizar el pie de crédito del hero a «Imágenes generadas con IA · AROMIA» y ampliar el provenance JSON (frasco, piedra, azahar, muro, todos de Flow / Nano Banana 2.1, 27/11).
4. QA con Playwright sin reduced-motion (claro/oscuro, 1440 y 390), luego PR → CI → merge → verificar en vivo.

## Cómo se obtuvieron los recortes (reproducible)
Scripts en `docs/design/tools/`:
- `key-chroma.js <entrada> <salida.webp> <magenta|green> <ancho>`: recorte por croma para imágenes generadas sobre **fondo plano magenta o verde** (el más fiable; conserva pétalos blancos y seda). Umbral del verde ajustado a un fondo (6,157,41); el magenta a (254,72,250).
- `key-saturation.js <entrada> <salida.webp> <ancho> <umbral>`: recorte por saturación para fondos grises neutros (funcionó con el frasco recortando antes alrededor del objeto y umbral 13; ojo: `sharp` devuelve 3 canales al desenfocar una máscara de 1 canal, por eso usa `extractChannel(0)`).
Ambos requieren `npm i sharp` fuera del repo.
`image-toolkit` (OMNI) **no ve el disco local**: sus `remove_background` por ruta fallan.

## Google Flow (cómo se trabajó)
- Proyecto nuevo en la cuenta de Brey, en el navegador integrado; modelo Nano Banana 2.1, 16:9, ×2 por prompt. Descarga a 2K (2752×1536) desde el menú ⋮ → Descargar → 2K; llega a Descargas, a veces como `.tmp` que se renombra a `…_2K.jpg`.
- **Ritmo**: lanzar varios prompts seguidos disparó «Detectamos actividad inusual» (no cobra). No esquivarlo: espaciar y, si reaparece, que Brey reintente a mano. Usar refs (`find` + clic por ref) en vez de coordenadas, porque el layout cambia.
- La salvia fresca (Aromáticas) no se generó por ese bloqueo; la tarjeta usa la lámina botánica de dominio público.
- Prompts base y criterios en `docs/design/LANDING_BRIEFS_FLOW_CHATGPT.md`.

## Pendientes generales
- Salvia fresca para «Aromáticas» (Flow, a mano si hace falta).
- `lemon-zest-editorial-v2.webp` en `/academia` sigue siendo una adaptación «reinterpretada»; revisar si luce vieja como la bergamota.
- Brief de Flow para más familias (descubrir/familias/*) si se amplía la franja.
- Fuera de la landing: figuras dentro de artículos (sin `srcset`), política de procedencia de imágenes, iconos y manifest PWA, Gate 02, piloto editorial 01.
- Archivos temporales de Flow en `C:\Users\user\Downloads` (JPG `…_2K.jpg` y `.tmp`): Brey puede borrarlos; las copias de trabajo ya están procesadas.

## Reglas vigentes
- Sin guardas mecánicas: pedir OK textual para merge, deploy, escritura en producción, gasto y push fuera de rama de trabajo. (Brey pidió el 27/11 «deja todo corriendo en main y desplegar»: autorizó merge+deploy de la landing y de las imágenes; la rama `feat/hero-layers` aún no está lista.)
- `main` = producción (Railway despliega cada push); `main` no tiene protección de rama.
- El panel del navegador integrado tiene reduced-motion activo: los efectos 2.5D se prueban con Playwright (`reducedMotion: "no-preference"`).
- Proyecto Faceless_Studio es independiente de Aromia.
