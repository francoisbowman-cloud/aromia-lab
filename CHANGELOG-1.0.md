# Changelog — Aromia 1.0

Registro corto de cada entrega al repo. Una entrada por deploy: fecha + qué se subió + quién.

## 2026-07-13 — Code
- Nuevo: `lab.html` (armador de fragancia interactivo, quiz de 4 pasos, resultados con link a Catálogo y a Amazon).
- Reemplazo: `index.html` (landing minimalista), `catalogo.html` (+ soporte deep-link `?p=ID`), `magazine.html`, `academia.html`, `club.html` (nav con Catálogo + Lab agregado).
- Fix: deep-link `?p=ID` de `catalogo.html` corría antes de que se asignaran las variables de las que depende `openProduct()`, tiraba un error sin capturar y cortaba el resto del script de esa carga de página — encontrado probando en vivo el flujo Lab → "Ver ficha →", corregido moviendo el chequeo al final del script.
- Pendiente próxima entrega: sub-nav sticky y rediseño editorial de tarjetas en Magazine; completar rating real de Amazon en 31/33 perfumes de `catalogo.html`.
