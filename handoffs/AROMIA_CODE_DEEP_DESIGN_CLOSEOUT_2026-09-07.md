# AROMIA — Cierre de Code: pase profundo de Diseño, Tandas A + B

DATE: 2026-09-07
FROM: Code
STATUS: TANDAS A + B — IMPLEMENTADAS / MERGEADAS / DESPLEGADAS / VERIFICADAS EN PRODUCCIÓN
BASE_REF: `main` @ `4f80be01b02362d8ec1995c2cbd6aa7618dd42f6`
SOURCE_HANDOFF: `handoffs/AROMIA_CODE_DEEP_DESIGN_INTEGRATION_2026-09-06.md`
AUDIT: `audits/AROMIA_DEEP_DESIGN_INTEGRATION_AUDIT_2026-09-06.md`
PR: [#151](https://github.com/francoisbowman-cloud/aromia-lab/pull/151) — MERGED (squash `4f80be0`)

---

## 1. Qué se hizo en este turno

### Auditoría (persistida, no vuelve a correrse)

`audits/AROMIA_DEEP_DESIGN_INTEGRATION_AUDIT_2026-09-06.md`. 17 superficies × 7
viewports (390, 430, 768, 1024, 1280, 1440, 1728) × claro/oscuro, medida contra
**producción** con Chromium headless vía `playwright-core`. El harness se instaló
**fuera del repo** (scratchpad de la sesión, reusando binarios de Playwright ya
presentes en la máquina): **no se agregó ninguna dependencia**. 167 registros de
medición, 99 screenshots.

Por qué producción y no local: en local `next/font` no descarga Newsreader y cae
a un sans, así que un screenshot local no representa la tipografía real. Esto es
permanente — cualquier juicio tipográfico se hace contra `aromialab.com`.

### Tanda A — daño real (commits en PR #151)

1. **Fotografía de terceros localizada.** Desde `1e190cf` toda imagen externa
   pasaba `unoptimized` a `next/image` y esquivaba el optimizador entero (sin
   resize, sin WebP, sin srcset). El bypass evitaba 429 de Wikimedia pero
   mandaba los originales completos: ~26 MB. Se bajaron los 8 archivos a
   `apps/web/public/` (`editorial-v1/` y `perfumistas/`), conservando autoría y
   licencia que ya estaban modeladas, y se retiró `unoptimized` de los 6 puntos.
   Medido, variante que recibe un móvil: `christine-nagel` 7.954 KB → 24 KB;
   `santalum album` 7.650 → 15 KB; `blood-red rose` 4.598 → 20 KB. El retrato de
   Christine Nagel **no llegaba a cargar** en móvil; ahora carga.
2. **Tema oscuro.** `.ev1` (portada) fijaba `--paper`/`--ink`/`--line` en
   hexadecimales de modo claro sin contrapartida → metadata a 1,08:1. Puenteado a
   la capa semántica. Los bloques de color de las historias fijaban fondo sin
   fijar texto → 1,03:1 en un titular de 44 px; se les dio contrapartida oscura.
   De 22 usos de `text-[#5a6b54]`, solo 8 tenían variante `dark:`; los 14
   restantes pasaron al token `--aromia-editorial-accent`.
3. **Desborde de `/magazine`.** La figura destacada combinaba `aspect-[4/3]` con
   `min-h-[360px]` → ancho intrínseco de 480 px del que un ítem de grid no baja.
   Desbordaba +110 px a 390 y +70 px a 430. Añadido `w-full`.

### Tanda B — coherencia (commits en PR #151)

4. **Atribución CC BY-SA visible** (hallazgo nuevo, no estaba en la auditoría
   original — §9.3). Home mostraba dos fotos CC BY-SA sin crédito a la vista
   (Jabal Akhdar / Ontheroadom / CC BY-SA 4.0; Salvia sclarea / Llez / CC BY-SA
   3.0). El dato estaba en un campo `provenance` que **nunca se renderiza**.
   Añadido campo `credit` al slot, helper `visualCredit()` y una línea bajo cada
   imagen de portada. Verificado en producción: los tres créditos se renderizan.
5. **Enlazado del objeto historia.** Los tres titulares de Home no eran enlaces;
   en `/magazine` los mismos titulares sí lo eran. Ahora enlazan en ambas
   superficies (`.ev1-story-link`), y los tres «Leer historia» idénticos llevan
   `aria-label` con el título.
6. **Contraste** (§9.4). Tres piezas de metadata simulaban gris con `opacity:.6`
   sobre `--ink` → 4,13:1 a 10 px. Pasan a `var(--muted)`. Las reglas de .66–.70
   se midieron, pasan, y se dejaron. La sonda de contraste original no las
   detectaba porque no consideraba opacidad acumulada; se corrigió.
7. **Recorte de `/academia`.** Marco `4/5` vertical para fuentes mayormente
   apaisadas → descartaba hasta 47 % del ancho. Cambiado a `aspect-square`.
   `/academia` sale entera de la lista de recortes severos.
8. **Escala tipográfica — definida, NO migrada.** `--type-display-1..4`,
   `--type-deck`, `--type-body`, `--type-metadata` en `design-tokens.css`, y
   registrada en `AROMIA_VISUAL_DIRECTION_SYSTEM.md`. **No se tocó un solo call
   site.** Ver §3.

### Corrección de infraestructura (Tanda A, primer commit)

Tailwind resolvía config y globs de `content` contra el CWD. Railway construye
con root `apps/web` y nunca lo notó, pero `next dev apps/web` desde la raíz del
monorepo (lo que hace `.claude/launch.json`) emitía **cero utilidades**: todo
componente Tailwind renderizaba sin estilos, en silencio. `postcss.config.mjs` y
`tailwind.config.ts` ahora anclan las rutas a `apps/web`. Salida byte a byte
idéntica desde cualquier CWD (1 byte → 92.449).

---

## 2. Verificación

- **CI de PR #151:** api (lint+typecheck) PASS, code-and-governance PASS,
  web (test+lint+typecheck+build) PASS.
- **Local:** `tsc --noEmit`, `next lint`, `next build` limpios en el head mergeado.
- **Railway:** ambos servicios auto-desplegaron `4f80be0` — web
  `c5b359f9` SUCCESS, api `816d41db` SUCCESS.
- **Barrido de producción post-merge** (`out-prod-final/report.json` en scratchpad):
  118/119 registros de ruta HTTP 200 en los 7 viewports. Cero desborde
  horizontal, cero hrefs muertos, cero imágenes externas, cero texto bajo 4,5:1
  en ambos temas. El registro 119 es el P0 de SubBatch 01 (§4).

---

## 3. Escala tipográfica — estado y qué falta

Los tokens **existen** pero **no se consumen**. La deuda real, medida sobre el
código:

- **36 fórmulas `clamp()` de `font-size` distintas** en CSS;
- **37 valores `text-[Npx]` distintos ≥ 28 px** en TSX;
- fórmulas duplicadas que solo difieren en un espacio.

Unas 73 decisiones independientes de tamaño donde el contrato pide cuatro roles.

**Por qué no se migró:** colapsar 73 tamaños a una escala de cuatro roles
**cambia cómo se ve la publicación**. Eso es una decisión de dirección de arte,
no un refactor, y `AROMIA_DESIGN_SYSTEM.md` prohíbe explícitamente el reemplazo
masivo de tokens por pureza. La migración necesita que Publisher/Design aprueben
el resultado visual.

Los pasos definidos salen de los valores dominantes de cada rol en el sitio
actual, no de una escala inventada:

```
--type-display-1   clamp(54px, 6.8vw, 112px)
--type-display-2   clamp(42px, 5vw, 76px)
--type-display-3   clamp(30px, 4vw, 58px)
--type-display-4   clamp(24px, 2.2vw, 34px)
--type-deck        clamp(19px, 1.6vw, 27px)
--type-body        clamp(16px, 1.1vw, 18px)
--type-metadata    11px
```

---

## 4. BLOQUEANTE sin dueño — P0 de runtime de SubBatch 01

**Las nueve historias de SubBatch 01 devuelven HTTP 500 en producción:**

```
/historias/antes-del-perfume-ya-oliamos
/historias/comprar-para-oler-o-comprar-para-tener
/historias/cuando-ya-no-hueles-tu-perfume
/historias/fougere-no-significa-viejo
/historias/huele-sintetico-que-estamos-diciendo
/historias/lavanda-limpia-medicinal-barata-elegante
/historias/nos-perfumamos-para-nosotros-o-para-los-demas
/historias/podemos-describir-un-olor-sin-compararlo
/historias/por-que-una-lista-de-notas-no-te-dice-como-huele
```

**Causa:** `apps/web/src/app/(editorial)/historias/subBatch01Story.tsx` lee
`drafts/*.md` del sistema de archivos **en tiempo de render**. `drafts/` está en
el contexto de build (commit `e408cf2`) pero **no en la imagen de runtime**, que
solo lleva la salida de `apps/web`. El build las prerenderiza (local devuelve
200); cuando el render ocurre en runtime, `draftDirectory()` devuelve `undefined`
y se lanza.

**Atenuante:** las nueve rutas están **huérfanas** — no están en `sitemap.xml` ni
enlazadas desde Home ni `/magazine`. Ningún lector cae en un 500, no hay daño de
SEO. Pero toda la producción editorial de SubBatch 01 es inaccesible.

**Contradice `AROMIA_CURRENT_STATE.md` v45**, que declaraba «all nine SubBatch 01
routes prerendered successfully». Prerenderizan en build; mueren en runtime.
Corregido en el relay v46.

**Por qué Code no lo tocó:** el handoff de origen prohíbe expresamente pisar los
pipelines de SubBatch (`Do not overwrite unrelated editorial work or SubBatch
pipelines`), y el arreglo correcto —dejar de leer del disco en runtime: empaquetar
los `.md` como import, o moverlos a la tabla `articles`— es trabajo del pipeline
editorial, no de la capa de Diseño.

**Necesita un dueño explícito.** No bloquea la Tanda C.

---

## 5. Qué sigue — Tanda C (Code puede ejecutarla sin coordinación)

De `audits/AROMIA_DEEP_DESIGN_INTEGRATION_AUDIT_2026-09-06.md` §6:

- **Jerarquía de primer viewport**: `/descubrir/familias` (6 titulares ≥28 px
  compitiendo a 1440), `/academia` (5), `/perfumistas` (4).
- **Ritmo**: `/magazine` (14× el mismo tamaño de titular) y `/perfumistas` (11×)
  hacia el arquetipo Editorial Index — numeración y metadata en vez de grilla
  uniforme.
- **Medida de lectura de Home** en viewports anchos: 31 cpl a 1440, 35 a 1728
  (columna ~350–440 px con cuerpo de 22–25 px).
- **Etiqueta vs. enlace** (§4.10): en `/academia` los enlaces de capítulo usan
  idéntico tratamiento que las etiquetas no-navegables.
- **Objetivos táctiles** (§4.11): 1–2 enlaces <32 px de alto por página en móvil.

### Requieren decisión de dirección de arte (NO ejecutar sin sign-off)

- **Recomposición del hero de Omán** (§9.1). El diagnóstico original era erróneo:
  el marco es más **alto** que la fuente, así que recorta en **horizontal** — la
  sierra sí se ve, se pierde la amplitud panorámica. `object-position` no lo
  arregla (se probó, era no-op, se revirtió). El arreglo es de composición: que
  una fuente 1,78 no caiga en una columna 0,73.
- **Migración tipográfica** onto `--type-*` (§3).

### Pendiente de v45, sin cambios

- Integrar el asset 02A aprobado por Publisher en el renderer real de «Comprar
  para oler o comprar para tener». **NO** avanzar generación visual a 02B.
- Avanzar sub-batches 03/04 por ART_DIRECTION.
- Cowork sigue con batch-100 (67 ítems sin escribir).

---

## 6. Artefactos

**Durables en el repo:**
- `audits/AROMIA_DEEP_DESIGN_INTEGRATION_AUDIT_2026-09-06.md` (§1–8 auditoría, §9 correcciones)
- `apps/web/public/editorial-v1/{red-rose-interpretive,rose-documentary,patchouli-documentary,bergamot-documentary,pink-rose-documentary,sandalwood-documentary}.jpg`
- `apps/web/public/perfumistas/{alberto-morillas,christine-nagel}.jpg`
- `apps/web/src/app/design-tokens.css` — tokens `--type-*`
- `AROMIA_VISUAL_DIRECTION_SYSTEM.md` — sección «The scale exists as tokens»
- este handoff + relay v46

**Temporales (scratchpad de la sesión, NO en el repo):** `audit.mjs`,
`verify.mjs`, `dark.mjs`, `overflow.mjs`, `localize.mjs`, `dims.mjs`,
`out*/report.json`, screenshots. Reproducibles; el harness se reinstala con
`npm i playwright-core sharp` apuntando a `chromium-1228` de la máquina.

---

## 7. Esquema de handoff

```text
LAST_ACTOR: Code — pase profundo de Diseño, Tandas A + B
LAST_ACTION: auditoría persistida; Tandas A + B implementadas, PR #151 mergeado (squash 4f80be0), Railway desplegado, producción verificada
ACTIVE_BRANCH / BASE_REF: main @ 4f80be0
STATE / GATES: CI de #151 all-green; producción 118/119 rutas 200; el 119 es el P0 de runtime de SubBatch 01
DELIVERABLES: auditoría + §9 correcciones; 8 assets localizados; fix de tema oscuro; fix de desborde; atribución CC BY-SA visible; titulares enlazables; tokens --type-* (definidos, sin consumir); fix de resolución de Tailwind
EVIDENCE: audits/AROMIA_DEEP_DESIGN_INTEGRATION_AUDIT_2026-09-06.md; out-prod-final/report.json (scratchpad); Railway web deploy c5b359f9 SUCCESS
TEMPORARY_OR_EXTERNAL_ARTIFACTS: harness de QA en scratchpad (playwright-core + sharp), no en el repo
NEXT_ACTOR: Code — Tanda C (o Publisher/Design primero si se autoriza la migración tipográfica)
NEXT_ACTION: ejecutar Tanda C desde §6 de la auditoría; marcar hero de Omán y migración --type-* para sign-off; conseguir dueño para el P0 de SubBatch 01
BLOCKERS: SUBBATCH_01_RUNTIME_P0 (nueve rutas huérfanas 500, sin dueño) — no bloquea Tanda C
PUBLICATION_AUTHORITY / RISK NOTES: la atribución CC BY-SA ahora cumple; la migración tipográfica es decisión de dirección de arte, no de Code
```
