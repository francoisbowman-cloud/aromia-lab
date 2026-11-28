# Aromia — estado al 2026-11-27 (landing 2.5D, ingredientes, capas del hero)

Léelo antes que `RESUMEN_PARA_RETOMAR_2026-11-23.md`, que quedó desfasado (dice que el PR #214 está pendiente). Si algo de aquí contradice lo que devuelve un comando, manda el comando.

## Ya en `main` y en producción (`www.aromialab.com`)
| PR | Qué | Merge |
|---|---|---|
| #214 | Integración: Next 16.4.6 + React 19 + Tiptap 3. Migraciones 024–029 (Intelligence) **no hacen falta**: son opt-in y `INTELLIGENCE_ENABLED` no existe en prod. | `5ba7349` (24/11) |
| #217 | Landing nueva + tratamiento 2.5D (`LandingHero.tsx`, `DepthEffects.tsx`, `depth-25d.css`), nav «AROMIA / LAB», tilt en Magazine/Saber, arreglo de React #418. | `744e845` |
| #218 | Imágenes frescas (Google Flow) para Florales, Amaderadas, Ámbar y Chipre. | `cd06ce0` |
| #219 | Bergamota nueva en `/academia`. | `1598f3b` |
| #220 | Hero con capas reales (muro, piedra y seda, frasco, azahar). | `91cea79` |

Bergamota fresca (`bergamot-fresh-*.webp`) en hero, tarjeta «Cítricas», Discovery y `/academia`. Todas las imágenes de IA llevan «Imagen generada con IA · AROMIA» y su procedencia en `public/editorial-v1/landing-fresh-ingredients.provenance.json`.

## Cerrado: capas reales del hero (PR #220, merge `91cea79`, en producción)
El hero ya se compone de capas con transparencia (muro, travertino con seda, frasco ámbar sin etiqueta, azahar) más los medallones de ingredientes frescos, con parallax por puntero y scroll. Capas en `public/editorial-v1/hero/`; procedencia en `landing-fresh-ingredients.provenance.json`. Verificado en vivo: rutas 200, capas servidas, 0 errores de consola.

Detalle menor abierto: el recorte del frasco deja una pequeña franja clara de sombra a la derecha de la base.

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
- Franja clara de sombra a la derecha de la base del frasco en el hero (recorte).
- `lemon-zest-editorial-v2.webp` en `/academia` sigue siendo una adaptación «reinterpretada»; revisar si luce vieja como la bergamota.
- Brief de Flow para más familias (descubrir/familias/*) si se amplía la franja.
- Fuera de la landing: figuras dentro de artículos (sin `srcset`), política de procedencia de imágenes, iconos y manifest PWA, Gate 02, piloto editorial 01.
- Archivos temporales de Flow en `C:\Users\user\Downloads` (JPG `…_2K.jpg` y `.tmp`): Brey puede borrarlos; las copias de trabajo ya están procesadas.

## Reglas vigentes
- Sin guardas mecánicas: pedir OK textual para merge, deploy, escritura en producción, gasto y push fuera de rama de trabajo. (Brey pidió el 27/11 «deja todo corriendo en main y desplegar» y «cierra ese ciclo»: autorizó merge+deploy de la landing, las imágenes y el hero.)
- `main` = producción (Railway despliega cada push); `main` no tiene protección de rama.
- El panel del navegador integrado tiene reduced-motion activo: los efectos 2.5D se prueban con Playwright (`reducedMotion: "no-preference"`).
- Proyecto Faceless_Studio es independiente de Aromia.
