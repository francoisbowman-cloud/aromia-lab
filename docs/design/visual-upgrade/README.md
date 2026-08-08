# Aromia — Visual & Conversion Upgrade

Documentación y prototipos de la fase de rediseño visual iniciada 2026-08-08
(rama `feat/aromia-visual-conversion-upgrade`). No es código de producción —
nada de esta carpeta se importa desde `apps/web` ni `apps/api`.

## Documentos

- [`../../AROMIA-VISUAL-UPGRADE-BASELINE.md`](../../AROMIA-VISUAL-UPGRADE-BASELINE.md)
  — entregable V0: diagnóstico del estado visual real, 3 direcciones de
  Visual DNA propuestas (Atelier Ivorio / Maison Grafito / Doble portada),
  plan de los 4 momentos insignia.

## Prototipos (`prototypes/`)

Cada uno es un HTML autocontenido (CSS + tipografías reales de Aromia
embebidas en base64, sin dependencias externas) — se abre directo en un
navegador, sin build ni servidor. `build.mjs` documenta cómo se generó
`index.html` a partir de sus fuentes y permite regenerarlo tras editarlas.

- **`concepts-direccion-c/`** — exploración inicial: 3 interpretaciones
  divergentes dentro de la Dirección C (Editorial Cinematic / Modern
  Luxury Magazine / Sensory Digital Experience), Home completa por
  concepto, comparables entre sí. **Superseded** por `home-hybrid-01/`
  tras la decisión de fusionar direcciones — se conserva como registro
  del proceso, no como candidato activo.
- **`home-hybrid-01/`** — estado actual: Home consolidada "Cinematic
  Editorial Index", fusión aprobada de los 3 conceptos (hero + Product
  Reveal de Editorial Cinematic/Sensory, Índice Olfativo de Modern
  Luxury Magazine). Incluye sistema Light/Dark completo (Atelier Ivorio /
  Maison Grafito) con toggle Light/Dark + Desktop/Mobile. Es la versión
  vigente en revisión con Brey al momento de este commit.

## Estado

Prototipo de dirección, no implementación. Nada de esto se propaga a
`apps/web` todavía — ver `AROMIA-VISUAL-UPGRADE-BASELINE.md` sección
"Cómo vamos a comparar propuestas antes de desplegar nada" para la
metodología (mockup estático → prototipo de alta fidelidad → aprobación →
implementación real en rutas de producción).
