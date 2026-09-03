# Ticket — Lienzo blanco absoluto y perfumes flotantes (catálogo + PDP)

**Origen:** pedido directo de Brey a Chat, tras auditar el repo real (no la copia
legacy). Reemplaza cualquier intento anterior de la rama `feat/aromia-visual-redesign-2026`
(ChatGPT), **ya eliminada de origin** — no hay nada que mergear ni revertir de ahí,
se parte limpio desde `main`.

**Antes de correr esto:** confirmar con Brey el punto de decisión de la sección 3 —
no es un detalle técnico menor, cambia el pipeline de imágenes del proyecto.

---

## 1. Contexto real (verificado 24/08, no asumido)

- Stack real: Next.js 14 + Tailwind + shadcn/ui en `apps/web`, Express+TS en `apps/api`,
  Postgres+Redis, todo en Railway, desplegando solo desde `main`. El `index.html` de la
  raíz del repo es v1, **legacy**, sin tráfico — no tocar, no confundir.
- El pedido de fondo blanco **no es nuevo**: ya está registrado como decisión de producto
  (ver `ticket-ficha-producto-y-fix-ovl.md`, sección 5, y `ESTADO-aromia.md` decisión #81/#92/#93).
  Este ticket lo completa, no lo inventa.
- Ya existe un sistema de tratamiento de imagen deliberado en
  `apps/web/src/components/perfume/ProductImage.tsx`: modo `card` = caja `bg-white` con
  `overflow-hidden`; modo `editorial`/`hero` = `bg-transparent` + `mix-blend-multiply` +
  máscara CSS radial que difumina el borde de la foto. El comentario del archivo es
  explícito: **nunca extraer/regenerar destructivamente los píxeles del producto.**

## 2. Bug de base a resolver primero (bloqueante, no visual)

Hay **dos tokens `--bg` compitiendo**:

- `apps/web/src/app/globals.css` → `--bg: #fbf8f3` (light) / `#0e0c0a` (dark) — **muerto**,
  sobreescrito por el siguiente import.
- `apps/web/src/app/aromia-redesign.css` → `--bg: #f7f5f0` (light) / `#0e1311` (dark) —
  **el que realmente se aplica**, porque se importa después en `layout.tsx`.

Esto es deuda técnica de sesiones anteriores. Antes de cualquier cambio visual:
eliminar la definición muerta de `globals.css` (o consolidar en un solo archivo de
tokens) para que quien toque esto después no pierda tiempo debuggeando cuál gana.

## 3. Punto de decisión — confirmar con Brey antes de tocar imágenes

El pedido original ("fondo blanco absoluto, perfumes flotando sin bordes") admite dos
caminos, y **no son compatibles entre sí sin conflicto**:

- **Opción A — Extender el enfoque ya existente (bajo riesgo, coherente con lo ya construido):**
  aplicar el mismo tratamiento de máscara radial + `mix-blend-multiply` que hoy solo usa
  `mode="editorial"` también a `mode="card"`, y llevar `--bg` a blanco/negro puro. Mantiene
  la política ya documentada de "nunca extraer destructivamente". Riesgo bajo, cambio acotado.
- **Opción B — Reemplazar por recorte real con canal alfa (Image Toolkit / Omni):**
  usar `remove_background` sobre las fotos de Amazon para lograr transparencia real y
  `filter: drop-shadow()` en vez de máscara. Da un resultado más limpio para frascos con
  formas irregulares, pero **contradice explícitamente** la política ya escrita en el
  código, y expande el trabajo a re-alojar ~38+ imágenes fuera de Amazon (hotlinking).
  Converge con la decisión #93 del `ESTADO` ("generar recortes sin fondo de los 50 perfumes
  vía OMNI"), que sigue "sin fecha" — este ticket sería el disparador para activarla.

**No avanzar a la sección 4 sin que Brey elija A o B.**

## 4. Cambios concretos (una vez resuelta la sección 3)

### 4.1 Tokens (`aromia-redesign.css`, tras limpiar el duplicado de `globals.css`)

```css
:root{
  --bg:#FFFFFF;              /* antes #f7f5f0 */
}
[data-theme="dark"]{
  --bg:#0A0A0A;               /* antes #0e1311 — casi negro, no 100% puro (evita halation en OLED) */
}
```

### 4.2 `ProductImage.tsx` — si se elige Opción A

- Unificar `stageClass`: que `mode="card"` también use `bg-transparent` + la misma
  `editorialMask` que hoy es exclusiva de `surface="editorial"`, en vez de la caja
  `bg-white` + `overflow-hidden` actual.
- Confirmar que `--bg` puro no rompe el contraste de la máscara radial (probar contra
  un frasco claro y uno oscuro del catálogo real, no solo uno).

### 4.3 `PerfumeCard.tsx`

- Quitar `bg-white` hardcodeado tanto del contenedor de imagen como del bloque de texto
  inferior — dejar que hereden `--bg` (que ya será blanco puro), para que no quede un
  segundo blanco "de caja" compitiendo con el blanco de página.
- Evaluar si el hairline `border-t border-[#20231f]/12` entre imagen y texto se mantiene
  (es tipográfico, no una tarjeta) o se retira también — pedir a Brey una preferencia
  explícita con una captura antes/después, no asumir.

### 4.4 Aplicar primero en los "momentos insignia" (orden ya aprobado en `ESTADO-aromia.md`, sección 11)

No expandir a todo el sitio de una sola vez. Orden ya decidido: **Home → Ficha de
producto → Magazine → Discovery/Quiz.** Congelar el resultado en esos 4 antes de propagar.

## 5. QA obligatorio antes de reportar cerrado

- Contraste WCAG AA de `--gold`/`--muted` sobre `#FFFFFF` puro (más exigente que el
  `#f7f5f0` actual) — texto de filtros y etiquetas pequeñas en particular.
- Probar en los 3 tipos de frasco más distintos del catálogo real (vidrio transparente,
  frasco oscuro/opaco, frasco con caja) — no validar con uno solo.
- Verificado en incógnito contra `aromialab.com` real tras el deploy, desktop y mobile
  (regla ya establecida en el ticket de ficha de producto).

## 6. Housekeeping detectado durante la auditoría (no bloqueante, reportar aparte)

- **41 ramas sueltas** además de `main` (ver `git ls-remote --heads`), varias con nombres
  que sugieren experimentos abandonados (`omni/foundational-purpose-*`, múltiples
  `agent/aromia-material-library-collab*`). Viola la regla del manual operativo de no
  mantener ramas permanentes. Requiere que Code audite cuáles tienen trabajo real sin
  mergear antes de borrar en bloque — no borrar a ciegas.
- **Servicios de preview huérfanos en Railway** (`web-aromia-redesign-preview`,
  `web-aromia-redesign-preview-v2`, y posiblemente otros como `web-visual-preview-02`,
  `web-hybrid-signature-01`, `web-mockup-fidelity-final`, `web-taste-preview-01`,
  `web-omni-home-fire-test`, `catalog-expansion-b003-validation`) apuntan a ramas que ya
  no existen o a experimentos cerrados — cuestan recursos sin servir a nada. Code debería
  confirmar cuáles siguen sirviendo un propósito activo y eliminar el resto.
