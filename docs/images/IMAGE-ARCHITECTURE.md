# Arquitectura de activos de imagen — Aromia

**Fase:** Fase 1 — Fundación del sistema de imágenes
**Estado:** propuesta de estructura definitiva. **No ejecutada todavía** — esta
fase no migra ni procesa ninguna de las 50 fotos de producto actuales (ver
`docs/images/CURRENT-STATE-AUDIT.md` para el estado real hoy: 100% hotlink
externo para catálogo, 38/50 con mockup OVL local). La migración real es
trabajo de una fase posterior, con aprobación explícita de Brey primero.

---

## 1. Estructura de carpetas propuesta

```
apps/web/public/
└── images/
    └── perfumes/
        └── {slug}/
            ├── catalog/
            │   ├── {slug}--catalog--v01--320x400.webp
            │   ├── {slug}--catalog--v01--640x800.webp
            │   ├── {slug}--catalog--v01--1280x1600.webp
            │   └── {slug}--catalog--v01--640x800.avif   (mismo patrón por tamaño)
            ├── editorial/
            │   └── {slug}--editorial--v01--desktop.webp
            │       {slug}--editorial--v01--mobile.webp
            └── metadata.json
```

Convención de nombre de archivo (sección 11 del manual operativo):
`{slug}--{rol}--v{NN}--{ancho}x{alto}.{formato}`. El sufijo `v01`/`v02`
versiona reprocesamientos sin pisar el archivo anterior hasta confirmar que el
nuevo está aprobado.

Esto **reemplaza** la convención actual de `apps/web/public/ovl/{slug}.jpg`
(flat, un solo tamaño, sin versión) — la migración de los 38 archivos OVL
existentes a esta estructura queda pendiente de una fase posterior, no es
parte de la Fase 1.

## 2. Qué vive en Git

- **Derivados finales, ya aprobados, en uso real en producción** — es decir,
  exactamente los archivos que Next.js sirve hoy (`catalog/*.webp`/`.avif` y
  `editorial/*.webp`), nunca más de los tamaños definidos en la sección 4.
- `metadata.json` por perfume (esquema en
  `docs/images/METADATA-SCHEMA.md` / `scripts/images/metadata.schema.mjs`).
- Los 8 archivos genéricos de `public/editorial/` (portadas de Magazine, no
  por-perfume) se quedan donde están — no son parte de este árbol
  `perfumes/{slug}/`.

## 3. Qué NO debe vivir en Git

- **Originales sin procesar** (la foto tal cual viene de Amazon/Notino/Douglas
  antes de cualquier recorte/optimización, o el archivo fuente que entregue
  Design/ChatGPT antes de exportar). Son pesados, no son lo que se sirve, y
  mezclar originales con derivados en el mismo árbol hace imposible saber cuál
  es cuál sin abrir cada archivo.
- **Cualquier imagen sin `license_status` verificado** (ver
  `data/image-inventory.csv`) — no se promueve a `catalog/`/`editorial/` hasta
  que el campo deje de ser `unknown`.
- **Variantes de descarte** (intentos rechazados en la auditoría ChatGPT,
  clasificación D) — esas quedan en el flujo de trabajo de quien las generó,
  no entran al repo.

Este repo ya paga el costo de no tener esta separación una vez (`git-lfs` no
está configurado, y el repo completo se buildea dentro del Dockerfile de
Railway en cada deploy) — agregar originales pesados infla cada build sin
necesidad.

## 4. Dónde viven originales y derivados, en concreto

- **Originales** — fuera del repo. Mientras no haya un bucket/CDN propio
  configurado (no lo hay hoy — Railway no ofrece object storage, y `OMNI`/
  `image-toolkit` es una herramienta de procesamiento, no de almacenamiento
  persistente), los originales quedan en la carpeta de trabajo local de quien
  procesa (Design, Cowork, o el propio Code) hasta que se decida un storage
  real. `metadata.json` de cada perfume registra `source_url` (de dónde salió
  el original) y `original_hash` — así el original siempre es reproducible o
  trazable aunque no esté versionado.
- **Derivados** — en Git, bajo `apps/web/public/images/perfumes/{slug}/`,
  tal como se sirven. Next.js los empaqueta en el build de `apps/web`
  (Dockerfile ya existente, sin cambios de infraestructura necesarios).
- **Referencias oficiales** (la ficha del retailer usada para verificar
  fidelidad en la auditoría de ChatGPT) — no se descargan ni se versionan,
  se referencian por URL en `metadata.json` (`reference_url`).
- **CDN**: no se introduce uno nuevo en esta fase. Si el peso de imágenes
  servidas por Railway se vuelve un problema real (medible después del
  piloto), evaluar Cloudflare Images o similar como fase futura — no
  asumido ni decidido acá.

## 5. Licencia — cómo se maneja

Cada `metadata.json` registra `license_status` con el mismo vocabulario del
manual operativo (sección 8): `official-brand`, `affiliate-approved`,
`licensed`, `generated`, `unknown`, `replace-required`. Ninguna imagen con
`license_status: unknown` se promueve a `catalog/`/`editorial/` en Git — se
queda en estado de trabajo hasta que Cowork o Brey confirmen la procedencia
(ver `delegations/COWORK-IMAGE-INVENTORY-BRIEF.md`).

## 6. Presupuestos de peso (Paso 8 del manual)

Límites iniciales, documentados, **no aplicados automáticamente todavía** (no
hay script de CI que los haga cumplir en esta fase — el script de validación
de peso, ver `scripts/images/`, reporta violaciones, no bloquea el build):

| Rol | Rango objetivo |
|---|---|
| Tarjeta de catálogo | 25–70 KB |
| Imagen de ficha de producto | 70–180 KB |
| Hero editorial (móvil) | 120–250 KB |
| Hero editorial (desktop) | 180–400 KB |

Una imagen que supera el límite **no se rechaza automáticamente** si hay una
justificación visual documentada en `metadata.json` (`notes`) — por ejemplo,
una escena editorial con detalle fino que se degrada visiblemente al
comprimir más. El script de validación (`scripts/images/validate-weight.mjs`)
reporta el exceso; la decisión de aceptar o reprocesar es humana.

## 7. Migración — fuera de alcance de esta fase

Esta fase **no mueve** los 38 archivos de `public/ovl/` ni cambia ningún
`imagen_url` de producción. `PILOT-PLAN.md` es el primer paso real de
migración, sobre 5 perfumes, y requiere aprobación explícita antes de
ejecutarse.
