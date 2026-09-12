# HANDOFF — Code, sesión 2026-09-08/10 → siguiente chat

`main` @ `4b5783c` · todo lo de esta sesión está mergeado, desplegado y verificado en producción.

---

## 0. Antes de nada

Leé del repo (no de memoria): `ESTADO-aromia.md` (decisión #106 recién agregada),
`CLAUDE.md`, `ticket-diseno-aromia-punta-a-punta.md` (raíz — el mapa completo de
lo que sigue).

Memorias relevantes (ya en el store, se cargan solas): `project_reference_issue_01`,
`reference_tailwind_opacity_token_defect`, `project_deep_design_pass`,
`feedback_approval_gates`, `user_brey_profile`, `reference_aromia_qa_harness`.

Gates de Brey (duros): **nunca `git push`/merge/gasto de API sin "sí" textual
explícito de Brey.** Cada merge de esta sesión tuvo su "mergea #N".

---

## 1. Qué hizo esta sesión (7 PR, todos en `main` + producción)

| PR | Qué |
|---|---|
| #156 | Docs de Reference Issue 01 (PLAN de Chat, ticket Tiptap, INVENTARIO, brief Cowork) + `ticket-diseno-aromia-punta-a-punta.md` (ticket maestro de Diseño) + 3 borradores de Cowork en `drafts/`. Encargo C: `autor="Redacción Aromia"` en los 15 artículos publicados vía `PATCH /api/admin/articles/:id` (verificado 15/15). |
| #157 | Defecto de opacidad sobre tokens `var()` de Tailwind — 5 sitios + ocultar la casilla de reseñas vacía en la ficha. |
| #158 | `perfumeSlugs` desactualizados en `apps/web/src/lib/perfumers.ts` — 4 remapeos + 13 slugs muertos borrados. Efecto: fichas de BR540/Black Afgano/Portrait of a Lady/Light Blue ahora muestran perfumista. |
| #159 | Héroe de artículo blanco/blanco (`ArticleHero`, fondo a la `<section>`) + lector page-flip que no encajaba (`PageFlipReader`, contenedor alto-driven). Verificado en vivo. |
| #160 | Resto del defecto de opacidad (~13 sitios) — `soft`/`surface` → token entero; `gold`/`destructive` → `bg-[color:color-mix(in_srgb,var(--gold)_15%,transparent)]`. |
| #161 | `ESTADO-aromia.md` — decisión #106. |
| (higiene) | `A.txt` (token que Brey dejó en la raíz) borrado + `.gitignore`. |

El `grep` de opacidad-sobre-token queda en **cero** en `apps/web/src`.

---

## 2. Reference Issue 01 — estado

**Revista "Aromia · Número 01".** Documento rector: `PLAN-Aromia-Reference-Issue-01.md`
(dirección de Diseño, 16 piezas / 3 actos). Es el proyecto de Diseño principal.

- **Contenido: desbloqueado.** `INVENTARIO-CONTENIDO-RI01.md` §6 tiene el review
  de Code. Los 4 encargos (A/B/C/D) están hechos:
  - **C** — `autor` poblado, verificado.
  - **A** — `drafts/br540-hype-vs-merito.md` (ensayo del Acto II).
  - **B** — `drafts/jean-claude-ellena-la-sustraccion.md` (perfil serie "Personas" + pull-quote).
  - **D** — `drafts/matriz-olfativa-numero-01.md` (matriz, 15 perfumes, validada vs. Postgres).
  - `drafts/` además tiene ~46 piezas `editorial_ready` previas de Cowork.
- **Los 3 borradores A/B/D NO están publicados en el Magazine** — publicación
  manual de Brey vía `/admin/magazine`, o un script de importación a evaluar.
- **Fase 2 (`ticket-arquitectura-editorial-tiptap.md`) — GATEADA.** Modelo híbrido
  `contenido_html` + `contenido_json` JSONB, 5 primitives Tiptap Level B,
  sanitización server-side (hoy inexistente), test suite de 10 casos. NO arranca
  hasta: auditoría intermedia de Design (WS-2) + OK de Brey. La arquitectura ya
  está decidida y auditada; falta implementarla en rama.

---

## 3. Lo que sigue — todo depende de una decisión de Brey

De `ticket-diseno-aromia-punta-a-punta.md` §3 (D-1…D-10):

| D | Decisión pendiente | Desbloquea |
|---|---|---|
| D-2 | Fuente de datos de `longevidad`/`estela`/`proyeccion` (NULL en todo el catálogo → "Rendimiento en piel" vacío en Discovery/ficha) | WS-1 |
| D-3 | Fotos de los ~11 perfumistas sin `portrait` (solo 2/13 la tienen) — conseguir con licencia CC vs. gatear a "solo con foto" | WS-1 |
| D-4 | Gate de ≥5 obras por perfumista (hoy cuentan 1-4) — sumar atribuciones vs. bajar el mínimo | WS-1 |
| D-5 | Tratamiento dark de `ProductImage` en la ficha (foto de fondo blanco de Amazon sobre `#0A0A0A`) | WS-1 |
| D-6 | Historias SubBatch 01 (`/(editorial)/historias/*`) devuelven **500 en prod** — `subBatch01Story.tsx` lee `drafts/*.md` en render y `drafts/` no está en la imagen de runtime. Huérfanas (sin sitemap ni links). Pipeline editorial, **no Code reactivo**: ingestar a la fuente real y publicar, o retirar | WS-1 |
| D-7 | Sign-off de dirección de arte: escala tipográfica `--type-*` (definida, sin consumir; 36 `clamp()` + 37 `text-[Npx]≥28`) + recomposición del hero de Omán | WS-4 |
| D-8 | **OK para que Design arranque WS-2 (RI01 Fase 1)** — puede ir ya, en paralelo | WS-2 |
| D-9 | OK para la migración técnica de WS-3 (después de la auditoría de WS-2) | WS-3 |
| D-10 | Dirección visual del Quiz en Discovery | mini-brief propio |

**WS-4 — fix de fondo de tokens de opacidad** (no reactivo, necesita QA
claro+oscuro): migrar los colores de `tailwind.config.ts` a formato de canales
(`--text: 32 35 31` + `rgb(var(--text) / <alpha-value>)`). Toca los 4 CSS de
tokens (`globals`, `aromia-redesign`, `design-tokens`) y todo consumidor directo
de `var(--text)` en CSS crudo. Los ~18 sitios rotos ya están parchados; esto es
la corrección estructural. Ver `reference_tailwind_opacity_token_defect`.

**Otros pendientes independientes** (ESTADO §13): `npm audit` (7 high web / 3 api,
preexistente); dato de catálogo de `baccarat-rouge-540-edp` (`notas_fondo`
cedro/abeto ausentes de la ficha oficial MFK, precio 325 vs 360, `anio`/`perfumista`
NULL — revisión de datos aparte, no se toca desde el flujo editorial); citas de
*The Diary of a Nose* en el perfil de Ellena son de 2ª mano; dedup de
`resena-baccarat-rouge-540` (.html v1 + .md); `/taste` + componentes muertos
(`EcosystemGesture`, `OlfactiveIndex`, `EditorialSelection`) para una limpieza aparte.

---

## 4. Gotchas del entorno

- **`gh pr merge` falla con `fatal: 'main' is already used by worktree`** — es
  solo el paso de checkout local post-merge; **el merge en GitHub sí ocurre**
  (verificá con `gh pr view N --json state,mergedAt`). Después: `git fetch origin
  --prune` y branchea de `origin/main` (no se puede `git checkout main` desde este
  worktree).
- **`next build` local no valida** — sin red a Google Fonts (`Newsreader`,
  `ENOTFOUND`). `tsc --noEmit` + `next lint` sí corren. El build real lo valida
  el CI. Para el patrón `color-mix` de #160 se verificó con `npx tailwindcss`
  standalone contra un HTML de prueba.
- **QA visual: contra producción** (`aromialab.com`), no local — local no trae
  Newsreader. Ver `reference_aromia_qa_harness`.
- **Escrituras masivas a producción** (ej. `PATCH` en lote): el clasificador de
  seguridad las bloquea aunque Brey las haya autorizado. Se le pasa el script y
  lo corre él (pasó con el `--apply` del encargo C).
- **CI de un PR** = 3 checks obligatorios (`web (test + lint + typecheck + build)`,
  `api (lint + typecheck)`, `code-and-governance`); el resto (`audit-white-backgrounds`,
  `visual-gate`, etc.) salen `SKIPPED` en PRs que no tocan catálogo/imágenes.
- **`main` protegida**: PR obligatorio, `enforce_admins`, borrado automático de
  la rama al mergear. Brey mergea.

---

## 5. Arranque sugerido del próximo chat

1. Confirmar con Brey cuál(es) de D-2…D-10 quiere resolver.
2. Si **D-8** → Design (otro actor/sesión) arranca WS-2; Code queda a la espera
   del handoff de mockups.
3. Si **WS-4** → Code puede arrancar la migración de tokens en rama, con QA
   renderizada en 7 viewports × claro/oscuro contra producción antes del PR.
4. Si nada de eso → Code no tiene trabajo que no dependa de una decisión; no
   inventar scope.
