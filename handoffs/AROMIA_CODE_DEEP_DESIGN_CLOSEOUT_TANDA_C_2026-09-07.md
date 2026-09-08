# AROMIA — Cierre de Code: pase profundo de Diseño, Tanda C

DATE: 2026-09-07
FROM: Code
STATUS: TANDA C — IMPLEMENTADA / VERIFICADA EN LOCAL (build de producción) / PENDIENTE DE PR + APROBACIÓN DE BREY
BASE_REF: `main` @ `c6147bb` (cierre de Tandas A+B, PR #152)
SOURCE_HANDOFF: `handoffs/AROMIA_CODE_DEEP_DESIGN_CLOSEOUT_2026-09-07.md`
AUDIT: `audits/AROMIA_DEEP_DESIGN_INTEGRATION_AUDIT_2026-09-06.md` §6 (Tanda C), §4.7–4.11, §9.1
PR: pendiente de abrir (rama temporal + PR obligatorio; `main` protegida)

---

## 1. Alcance

Tanda C del plan de la auditoría (§6): **composición**. Los seis puntos que el
handoff de origen deja explícitamente en la vía de Code, sin coordinación previa:

| Punto | Auditoría | Superficies |
|---|---|---|
| Jerarquía de primer viewport | §4.7 | `/descubrir/familias`, `/academia`, `/perfumistas` |
| Ritmo hacia arquetipo Editorial Index | §4.8 | `/magazine`, `/perfumistas` |
| Medida de lectura de Home en viewports anchos | §4.9 | Home (lead) |
| Etiqueta vs. enlace | §4.10 | `/academia` (nav de índice) |
| Objetivos táctiles <32 px en móvil | §4.11 | breadcrumbs de `/catalogo/[slug]`, `/descubrir/familias/*` y afines |

**Fuera de esta tanda, por decisión de dirección de arte (§5 del handoff, sin
cambios):**

- **Recomposición del hero de Omán** (§9.1). No tocado. El marco sigue siendo más
  alto que la fuente 1,78; el arreglo es de composición, no de ajuste. Este turno
  le quita ~5–7 % de ancho a esa columna al ensanchar la de copy (ver §2.3): es
  el mínimo necesario para la medida de lectura y no cambia la naturaleza del
  problema, que ya estaba abierto.
- **Migración tipográfica** onto `--type-*` (§3 del handoff / §4.3 de la
  auditoría). No ejecutada. Las superficies que esta tanda toca por jerarquía
  convergen hacia los roles de la escala (índice/ficha ≈ 27 px, sublabel de plate
  ≈ 22 px), pero **no hay reemplazo masivo de tokens** y las ~73 decisiones de
  tamaño del resto del sitio quedan intactas, esperando sign-off de Publisher/Design.

---

## 2. Qué se cambió

Doce archivos. Sin dependencias nuevas. Sin hex crudo nuevo: las dos clases
añadidas usan sólo `var(--ink)`, `var(--aromia-editorial-accent)`,
`var(--gold-2)` y `currentColor` (temas claro/oscuro cubiertos por los tokens).

### 2.1 Etiqueta vs. enlace — `/academia` (§4.10)

`apps/web/src/app/academia/page.tsx` — la nav «Índice de Saber» (Estructura /
Familias / Concentración / Historia) usaba `.nav-link`, cuyo subrayado sólo
aparece al pasar el cursor. En reposo era idéntica a las etiquetas decorativas en
mayúsculas de al lado (`Saber`, `01 / Estructura`, `Aplicación`, `Horas después`).

Nueva clase `.jump-link` en `globals.css` (`@layer components`): subrayado
permanente (`border-bottom: 1px solid currentColor`), color `var(--ink)` en vez
de `--muted`, glifo `→` con `::after`, hover a `var(--aromia-editorial-accent)`,
`min-height: 40px`, focus visible. Verificado en local: `border-bottom 1px solid`
+ color ink en los cuatro enlaces; la etiqueta decorativa `Saber` sigue con
`border-bottom: 0` y color verde de acento. Lo navegable ahora se lee como
navegable en reposo.

### 2.2 Objetivos táctiles — breadcrumbs (§4.11)

Los breadcrumbs son enlaces de texto **en línea**; `min-height` no les crea área
táctil porque una caja `inline` lo ignora — por eso la regla global
`@media (pointer: coarse){ :where(a,button,select){min-height:44px} }` no los
alcanzaba y la auditoría seguía marcándolos (`/descubrir/familias/floral`,
`/catalogo/[slug]`, 2 enlaces <32 px cada una).

Nueva clase `.breadcrumb-link` en `globals.css`: en `(pointer: coarse)` pasa a
`inline-flex; align-items:center; min-height:44px`; en puntero fino no cambia
nada visible. Aplicada a los breadcrumbs de `catalogo/[slug]`,
`descubrir/familias`, `descubrir/familias/[familia]`, `perfumistas/[slug]`,
`quiz`, `quiz/resultado/[perfil]` (mismo patrón `className="transition
hover:text-ink"` en los seis). Verificado en móvil emulado: breadcrumbs a 44 px,
**cero enlaces <32 px** en las dos páginas que la auditoría nombraba.

### 2.3 Medida de lectura de Home (§4.9)

El deck del lead de Home caía a **31 cpl / 22,3 px a 1440** y **35 cpl a 1728**:
la tercera columna del grid `.ev1-cover-lead` (~480 px) menos padding lateral
dejaba ~350 px de texto.

`apps/web/src/app/(editorial)/home-story-rhythm.css`:
- `.ev1-cover-lead` grid `84px / 1.55fr / .85fr` → `84px / 1.5fr / .96fr`
  (la columna de imagen cede ~5–7 %; su recomposición ya estaba abierta, §9.1);
- `.ev1-cover-lead-copy` padding lateral `clamp(28px,4.5vw,72px)` →
  `clamp(24px,2.2vw,40px)`.

`apps/web/src/app/(editorial)/editorial.css`:
- `.ev1-deck` `font-size: clamp(18px,1.55vw,25px)` → `clamp(17px,1.35vw,23px)`,
  `line-height 1.42` → `1.46`. `.ev1-deck` sólo se usa en el lead de Home
  (verificado por grep); el layout `.ev1-lead` antiguo está muerto.

Resultado medido contra el build de producción en local (headless):
**Home @1440: 47 cpl** (era 31), deck 19,4 px, texto 460 px, aspecto de la
columna de imagen 0,97. **Home @1728: 49 cpl** (era 35), deck 23 px, aspecto de
imagen 1,06. Ambos dentro del rango cómodo 45–75. Cero desborde.

### 2.4 Jerarquía de primer viewport + ritmo (§4.7 / §4.8)

Regla 5 del sistema visual: una idea dominante por viewport. El H1 de cada página
debía volver a ganar sin que las filas del índice compitan entre sí.

**`/descubrir/familias`** (`descubrir/familias/page.tsx`): fila `<h2>`
`text-[30px] sm:text-[38px]` → `text-[25px] sm:text-[27px]`; numeral de índice
`text-xs text-muted` → `text-base tabular-nums text-ink/70` (arquetipo C: el
número lleva el peso). Medido @1440: **1 sola cabecera ≥28 px en el primer
viewport** (el H1 de 76 px), era 6. 10 filas a 27 px.

**`/perfumistas`** (`perfumistas/page.tsx`): nombre `<h2>` `text-[32px]` →
`text-[25px] lg:text-[27px]`. Ya tenía numeración `01/02` + `N obras` + era.
Medido @1440: **1 cabecera ≥28 px** (H1 70 px), eran 4; 11 nombres a 27 px.

**`/magazine`** (`components/magazine/EditorialArchive.tsx`, grid `rest`): `<h3>`
`text-[34px] lg:text-[40px]` → `text-[25px] lg:text-[27px]`; se elimina el
`lg:translate-y-8` de `index % 3 === 1` (el escalonado vertical es un tic de
grilla de tarjetas, no numeración — arquetipo C lo prohíbe explícitamente); el
numeral de índice pasa de `text-xs uppercase text-muted` a
`font-display text-lg tabular-nums text-ink`. Medido @1440: 14 filas a 27 px
(eran 40 px), `transform: none` en todas, numeral 18 px Newsreader. El lead
grande de la portada del archivo no se toca: es la única historia dominante.

**`/academia`** (`academia/page.tsx`): la pirámide olfativa metía tres `<h3>`
(`Salida`/`Corazón`/`Fondo`) a `text-[30px]` dentro del primer viewport →
`text-[22px]` (rol de sublabel dentro del Knowledge Plate; el `<h2>` de sección
«La pirámide olfativa.» a 54 px pasa a liderar solo). Medido @1280:
**2 cabeceras ≥28 px en el primer viewport** (H1 86 px + h2 de sección 54 px),
eran 5. Los cuatro `<h2>` de sección de `/academia` (Estructura / Familias /
Concentración / Historia) **no se tocan**: son cabeceras de sección
estructuralmente justificadas de una página de aprendizaje (arquetipo D).

> Nota sobre §4.8 para `/magazine` y `/perfumistas`: esta tanda rompe el ritmo
> uniforme por **escala + numeración + quitar el escalonado**, no por rehacer la
> grilla. Una reestructuración completa a Editorial Index (lista numerada de una
> columna sustituyendo la grilla de 3) sigue siendo una decisión de dirección de
> arte y queda abierta, igual que la migración tipográfica.

---

## 3. Verificación

- **Local, sobre el head con los 12 archivos:** `npm test` (vitest) **31/31
  pass**, `next lint` limpio, `tsc --noEmit` limpio, `next build` completo
  (49/49 páginas estáticas). Equivale a los cuatro pasos del job `web` de
  `.github/workflows/v2-ci.yml`.
- **Render, contra el build de producción servido en local** (`next start`,
  `NEXT_PUBLIC_API_URL` apuntado temporalmente a la API pública de Railway sólo
  para GET; `.env.local` restaurado después): las fuentes reales (Newsreader)
  cargan. Medido con Chromium headless en 390 / 1280 / 1440 / 1728:
  - **Cero desborde horizontal** en Home, `/magazine`, `/perfumistas`,
    `/academia`, `/descubrir/familias`, `/catalogo/[slug]`,
    `/descubrir/familias/floral` en todos los viewports probados.
  - §4.9: Home 47 cpl @1440, 49 cpl @1728.
  - §4.7: 1 cabecera ≥28 px en primer viewport en `/descubrir/familias` y
    `/perfumistas`; 2 en `/academia`.
  - §4.10: `.jump-link` con subrayado permanente + color ink vs. etiqueta
    decorativa sin subrayado + color acento.
  - §4.11: breadcrumbs a 44 px en móvil; 0 enlaces <32 px en las páginas
    señaladas.
  - `/magazine`: `transform: none` en todas las tarjetas del grid `rest`;
    contraste del titular del índice 14,58:1 en claro.
- **Tema oscuro:** las clases nuevas y los cambios de color usan sólo tokens
  semánticos ya validados en producción por Tandas A+B (§4.1 / §9.4). No se
  introduce ningún color que no tenga contrapartida oscura.
- **No verificado en local:** la tipografía Newsreader real en el detalle fino
  de kerning a viewport ancho — la política de la auditoría manda juzgar eso
  contra `aromialab.com`. Se hará en el barrido post-deploy, como en Tandas A+B.

---

## 4. Archivos

```
apps/web/src/app/globals.css                              +  .jump-link, .breadcrumb-link
apps/web/src/app/(editorial)/home-story-rhythm.css        ~  .ev1-cover-lead grid, .ev1-cover-lead-copy padding
apps/web/src/app/(editorial)/editorial.css                ~  .ev1-deck font-size / line-height
apps/web/src/app/academia/page.tsx                        ~  nav índice → .jump-link; pirámide h3 30→22px
apps/web/src/app/descubrir/familias/page.tsx              ~  fila h2 38→27px; numeral de índice con peso; breadcrumb-link
apps/web/src/app/descubrir/familias/[familia]/page.tsx    ~  breadcrumb-link
apps/web/src/app/perfumistas/page.tsx                     ~  nombre h2 32→27px
apps/web/src/app/perfumistas/[slug]/page.tsx              ~  breadcrumb-link
apps/web/src/app/catalogo/[slug]/page.tsx                 ~  breadcrumb-link
apps/web/src/app/quiz/page.tsx                            ~  breadcrumb-link
apps/web/src/app/quiz/resultado/[perfil]/page.tsx         ~  breadcrumb-link
apps/web/src/components/magazine/EditorialArchive.tsx     ~  rest h3 40→27px; sin translate-y; numeral de índice serif
```

Sin artefactos temporales dejados en el repo. Harness de QA reusado desde el
scratchpad de la sesión (playwright-core + chromium ya instalado), como en A+B.

---

## 5. Qué sigue

### Abierto para dirección de arte (NO ejecutar sin sign-off) — sin cambios

- **Recomposición del hero de Omán** (§9.1). Una fuente 1,78 no debe caer en una
  columna ~0,73–1,0. `object-position` no lo arregla. Es composición.
- **Migración tipográfica** onto `--type-*` (§3). ~73 decisiones de tamaño → 4
  roles. Cambia cómo se ve la publicación.

### Bloqueante sin dueño — sin cambios

- **SUBBATCH_01_RUNTIME_P0**: nueve rutas `/historias/*` 500 en producción
  (`subBatch01Story.tsx` lee `drafts/*.md` del disco en runtime). Huérfanas
  (fuera de `sitemap.xml`, sin enlaces entrantes). No bloquea nada de Diseño.
  Necesita dueño del pipeline editorial.

### Pendiente de v45/v46 — sin cambios

- Integrar el asset 02A aprobado por Publisher en el renderer real de «Comprar
  para oler o comprar para tener». **NO** avanzar a 02B.
- Sub-batches 03/04 por ART_DIRECTION.
- Cowork sigue con batch-100 (67 ítems sin escribir).

### Deuda menor detectada en v46, aún abierta

- `PerfumerPortrait` next/image pide la variante `w=3840` en algunos viewports
  (atributo `sizes` sin afinar). No tocado en esta tanda; candidato a un ajuste
  puntual de `sizes` en un turno futuro.

---

## 6. Esquema de handoff

```text
LAST_ACTOR: Code — pase profundo de Diseño, Tanda C
LAST_ACTION: Tanda C (§4.7–4.11) implementada en 12 archivos; verificada en local contra build de producción (test 31/31, lint/tsc/build limpios; render headless 390/1280/1440/1728). Sin PR todavía — pendiente de aprobación textual de Brey para abrir rama temporal + PR.
ACTIVE_BRANCH / BASE_REF: main @ c6147bb (trabajo en árbol, sin commit)
STATE / GATES: local all-green; Home 47/49 cpl (era 31/35); primer viewport 1 cabecera ≥28px en familias y perfumistas, 2 en academia; breadcrumbs 44px en móvil; 0 enlaces <32px en las páginas señaladas; magazine sin escalonado de tarjetas
DELIVERABLES: .jump-link + .breadcrumb-link (globals.css); medida de lectura de Home; jerarquía reducida en familias/perfumistas/magazine/academia; ritmo de magazine hacia índice (numeral con peso, sin translate-y)
EVIDENCE: este handoff §3; medición headless en scratchpad; sin report.json versionado
TEMPORARY_OR_EXTERNAL_ARTIFACTS: harness de QA en scratchpad (playwright-core + chromium reusado), no en el repo
NEXT_ACTOR: Code — abrir PR de Tanda C tras el visto bueno de Brey; después barrido post-deploy contra aromialab.com como en A+B
NEXT_ACTION: con aprobación: rama temporal, PR contra main, esperar CI (web test+lint+typecheck+build, api, code-and-governance), merge squash, verificar deploy de Railway, barrer producción, actualizar el relay a v47
BLOCKERS: ninguno para Tanda C. Omán hero y migración --type-* siguen requiriendo sign-off de Publisher/Design. SUBBATCH_01_RUNTIME_P0 sigue sin dueño.
PUBLICATION_AUTHORITY / RISK NOTES: cambios de tamaño/layout/afordancia de enlace; sin hex crudo nuevo; sólo tokens semánticos ya validados en oscuro. La reestructuración completa de /magazine y /perfumistas a Editorial Index (grilla → lista numerada) queda como decisión de dirección de arte, igual que la migración tipográfica.
```
