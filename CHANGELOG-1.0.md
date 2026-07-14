# Changelog — Aromia 1.0

Registro corto de cada entrega al repo. Una entrada por deploy: fecha + qué se subió + quién.

## 2026-07-13 — Code
- Nuevo: `lab.html` (armador de fragancia interactivo, quiz de 4 pasos, resultados con link a Catálogo y a Amazon).
- Reemplazo: `index.html` (landing minimalista), `catalogo.html` (+ soporte deep-link `?p=ID`), `magazine.html`, `academia.html`, `club.html` (nav con Catálogo + Lab agregado).
- Fix: deep-link `?p=ID` de `catalogo.html` corría antes de que se asignaran las variables de las que depende `openProduct()`, tiraba un error sin capturar y cortaba el resto del script de esa carga de página — encontrado probando en vivo el flujo Lab → "Ver ficha →", corregido moviendo el chequeo al final del script.
- Rediseño de hero en `index.html`: fondo full-bleed con las plantillas Light/Dark (imágenes convertidas a WebP, `assets/hero-light.webp` y `hero-dark.webp`), glow dorado, partículas CSS animadas, paleta `--gold` actualizada (`#B68A44` / `#C8A86B`). Se descartó explícitamente la versión Three.js/WebGL de las specs originales (partículas 3D, vidrio con material físico, mármol por shader, post-procesado) por ser sobre-ingeniería para un sitio sin build step. Alcance: solo `index.html` — el resto de páginas queda pendiente si se confirma el resultado.
- Pendiente próxima entrega: aplicar el mismo rediseño de hero a `catalogo.html`/`magazine.html`/`academia.html`/`club.html`/`lab.html` si se aprueba; sub-nav sticky y rediseño editorial de tarjetas en Magazine; completar rating real de Amazon en 31/33 perfumes de `catalogo.html`.
