# Sprint 1 — Cierre Code
Generado: 12 de julio de 2026
Actualizado: 12 de julio de 2026 — reconciliación con entregables de Cowork

## Punto de contacto con Cowork

- [x] `schema/perfume.schema.json` commiteado (primer commit del sprint,
      antes del resto del scaffolding, para no bloquear a Cowork).

## Checklist

### 1. Repo y estructura
- [x] Rama `feature/v2.0` (creada desde `main`, que queda intacta — el
      worktree de esta sesión estaba en un punto idéntico a `main`, así
      que se renombró en vez de crear una rama nueva sobre un punto
      distinto; el resultado es el mismo: `feature/v2.0` parte de `main`)
- [x] Estructura de carpetas Next.js 14 (App Router) + convención de
      componentes/páginas definida (ver `CLAUDE.md`, sección "Estructura
      de carpetas")
- [x] Tailwind configurado (incluido por `create-next-app`)

### 2. Backend
- [x] Express levantado — código completo en `apps/api`, tipa limpio
      (`tsc --noEmit` sin errores). Nota de entorno: no se pudo ejecutar
      `npm run dev` en esta sesión (ver sección "Nota de entorno" abajo)
- [x] Conexión a PostgreSQL configurada (`apps/api/src/db/pool.ts`,
      via `DATABASE_URL`) — local/Docker, sin Railway todavía
- [x] Tabla de perfumes creada según `perfume.schema.json`
      (`apps/api/migrations/001_create_perfumes.sql` +
      `npm run migrate`)
- [x] Redis configurado — cliente en `apps/api/src/redis/client.ts`,
      verificado en `GET /health` (sin uso funcional real todavía, como
      pedía el checklist)

### 3. Frontend base
- [x] Páginas placeholder: home (`/`), listado (`/perfumes`), detalle
      (`/perfumes/[slug]`), quiz (`/quiz`) — navegables vía `NavBar`,
      sin diseño final
- [x] Conexión frontend↔backend: `/perfumes` y `/perfumes/[slug]`
      llaman a `GET /api/perfumes` y `GET /api/perfumes/:slug` vía
      `src/lib/api.ts`; si la API no responde, la página muestra un
      aviso en vez de romper (no hay datos reales cargados todavía
      porque el CSV de Cowork aún no existe)

### 4. CI/CD mínimo
- [x] `.github/workflows/v2-ci.yml`: lint + `tsc --noEmit` + build en
      `apps/web`, lint + `tsc --noEmit` en `apps/api`, en cada push/PR
      a `feature/v2.0`

### 5. `CLAUDE.md`
- [x] Escrito en la raíz del repo. No había borrador de Cowork
      disponible en el repo al momento del sprint — se armó desde cero
      con el stack real implementado, comandos, estructura y
      convenciones. Si Cowork entrega su borrador de
      producto/contenido después, se integra sin pisar lo técnico.

### 6. Cierre
- [x] Este documento.

## Reconciliación con entregables de Cowork

Cowork completó su parte de Sprint 1 sin acceso al repo ni a
`schema/perfume.schema.json` (como estaba previsto en
`AROMIA_WORKFLOW_MASTER.md`, sección 3 — no bloqueante). Brey copió el
working folder de Cowork a `_cowork-handoff/` en la raíz de este mismo
worktree; esta sección documenta cómo se integró.

### 1. CSV mapeado contra el schema
- [x] Comparado `_cowork-handoff/PERFUMES_INITIAL_50.csv` (14 columnas,
      formato propio de Cowork, documentado en su propio `CLAUDE.md`)
      contra `schema/perfume.schema.json`
- [x] Transformado a `PERFUMES_INITIAL_50.csv` (raíz del repo), 50 filas:
      - Se generó `slug` (no existía; el CSV de Cowork traía un `id`
        numérico secuencial en su lugar, que no se conservó — Postgres
        genera su propia PK).
      - `precio_referencia_usd` → `precio_referencia` + columna nueva
        `moneda` = `USD`.
      - `categoria_precio`: el valor `entrada` se mapeó a `económico`
        (mismo concepto, el schema usa otro nombre). **5 filas quedaron
        con el valor `nicho`, que no es una categoría de precio válida
        del schema** — no se reasignó por cuenta propia, ver "Pendiente
        de contenido" abajo.
      - `nicho_o_comercial` (nicho vs. comercial): campo legítimo que el
        schema no contempla. Se dejó como columna extra al final del CSV
        en vez de agregarla al schema sin autorización — ver "Pendiente
        de contenido".
- [x] No se cambió `schema/perfume.schema.json` para acomodar el CSV —
      se transformó el CSV para calzar con el schema, tal como pedía el
      checklist de reconciliación.

### 2. Artículos
- [x] Movidos los 11 artículos de `_cowork-handoff/articles/` a
      `articles/` (la carpeta real de v1, en minúsculas — no se creó
      `/ARTICLES/`). Sin colisión de nombre de archivo con los 18 `.html`
      de v1 (extensión distinta), salvo que `resena-baccarat-rouge-540`
      ahora existe como `.html` (v1) y `.md` (v2.0) — dos piezas de
      contenido del mismo perfume conviviendo. No se resolvió esa
      duplicación acá, es una decisión de contenido/SEO.
- [x] El artículo 11 (excede el objetivo de 10) se dejó tal cual, sin
      borrar contenido válido — señalado, no corregido.

### 3. Quiz y SEO
- [x] `quiz-questions.md` → `COPY/quiz-questions.md`
- [x] `SEO_STRATEGY.md` → raíz del repo
- [x] Revisado: `SEO_STRATEGY.md` **no cubre el mapeo de redirects
      v1→v2** (decisión #5 de `ESTADO-aromia.md`). Cowork lo señala
      explícitamente en su propio documento como pendiente por falta de
      acceso al `ESTADO`. No se completó acá — es una decisión de
      contenido/SEO (qué URLs viejas mapean a cuáles nuevas), no técnica.
      Sigue pendiente.

### 4. `CLAUDE.md` fusionado
- [x] Se agregó una sección nueva, "Contenido (Sprint 1 — Cowork)", al
      `CLAUDE.md` real del repo, con la documentación de estructura de
      CSV/artículos/quiz/SEO que trajo Cowork — sin reemplazar ni pisar
      las secciones técnicas ya escritas.
- [x] Borrado el `CLAUDE.md` duplicado de `_cowork-handoff/` (junto con
      el resto de la carpeta temporal, ver punto 5).

### 5. Limpieza
- [x] `_cowork-handoff/` borrada por completo una vez movido todo a su
      ubicación definitiva.

## Pendiente de contenido (no resuelto en esta reconciliación, a propósito)

Estas son decisiones de **producto/contenido**, no técnicas — se dejan
señaladas para Brey/Cowork, no decididas unilateralmente por Code:

1. **5 perfumes con `categoria_precio` inválida** (valor `nicho` en vez
   de un tier de precio real): Santal 33, Molecule 01, Kirke, Le Labo
   Another 13, Nishane Hacivat. Todos son perfumes de nicho de precio
   alto — probablemente debería ser `premium` o `lujo`, pero no se
   asignó un valor a ciegas.
2. **¿Sumar `nicho_o_comercial` al schema oficial?** Es información útil
   para filtros (26 comercial / 24 nicho) que Cowork agregó por cuenta
   propia. Si se usa en el frontend, hace falta una decisión explícita
   para sumarla a `schema/perfume.schema.json` y a la migración.
3. **Redirects v1→v2 sin confirmar** (ver punto 3 arriba) — falta el
   mapa de URLs viejas → nuevas contra `ESTADO-aromia.md`.
4. **Duplicación de contenido** en `resena-baccarat-rouge-540` (`.html`
   de v1 + `.md` nuevo) — decidir si se fusionan, se reemplaza uno, o
   conviven a propósito.

## Nota de entorno (no bloqueante, pero relevante)

El sandbox de esta sesión no pudo ejecutar binarios nativos de Node
(`@next/swc-win32-x64-msvc`) — el archivo `.node` es un PE válido (header
`MZ` correcto, tamaño esperado) pero Windows lo rechaza con "not a valid
Win32 application" al cargarlo, algo típico de sistemas de archivos
virtuales/de red usados por entornos de desarrollo en contenedores o
sandboxes. Por eso no se pudo correr `next dev` / `next build` ni
`docker compose up` para probar Postgres/Redis en vivo dentro de esta
sesión.

Como mitigación, se verificó la corrección del código con `tsc --noEmit`
(sin errores en `apps/web` y `apps/api`) y `eslint` (sin errores) en vez
de builds completas. El código no tiene razón para fallar en un entorno
normal (Windows nativo, Mac, Linux, o CI) — si al correrlo aparece un
error real, no asumir que es este mismo problema de entorno sin
descartarlo primero.

## Resumen de decisiones técnicas (para pegar en `ESTADO-aromia.md`)

1. Backend en **Express + TypeScript** (no FastAPI): mismo lenguaje que
   el frontend, sin sumar un segundo ecosistema de tooling para un
   scaffolding de Sprint 1 sin lógica pesada aún. Reevaluable si el
   scraper de precios o las recomendaciones vía Claude API se
   benefician más de Python.
2. Monorepo simple con `apps/web` y `apps/api` en el mismo repo que v1
   (sin tocar los archivos de `main`) — evita gestionar dos repos
   separados en esta etapa.
3. `schema/perfume.schema.json` es la fuente de verdad de columnas;
   la migración SQL de Postgres se deriva 1:1 de ese schema.
4. Chart.js/Recharts, Strapi (CMS de reseñas), Bull/node-cron y
   SendGrid/Mailgun (parte del stack propuesto en `ESTADO-aromia.md`
   decisión #9-#10) **no se instalaron todavía** — ninguna feature del
   Sprint 1 los necesita; se agregan cuando el sprint que los use
   arranque, para no cargar dependencias sin uso real.
5. Redis se dejó conectado pero sin usar (cache/colas) — cumple el
   pedido explícito del checklist de Sprint 1 de "que la conexión
   funcione", nada más.
6. Postgres/Redis para desarrollo local vía `docker-compose.yml`, sin
   Railway/Render todavía — coincide con el alcance del sprint.
7. CI mínimo (`v2-ci.yml`) corre lint + typecheck + build en `web` y
   lint + typecheck en `api`, apuntado solo a `feature/v2.0` — no toca
   el flujo de GitHub Pages de `main`.
8. No se encontró un borrador de `CLAUDE.md` de Cowork en el repo — se
   escribió desde cero. Si aparece más tarde, integrar sin duplicar
   contenido de producto (eso vive en `ESTADO-aromia.md`).
9. No hubo ambigüedades de **producto** que señalar en el scaffolding
   inicial — todo lo pedido en `SPRINT1_CODE.md` era técnico dentro de
   decisiones ya tomadas en `ESTADO-aromia.md`. La reconciliación
   posterior con Cowork sí dejó pendientes de contenido, ver sección
   correspondiente arriba.

## Resumen de la reconciliación (5-10 líneas, para pegar en `ESTADO-aromia.md`)

Se integraron los entregables de Cowork (`_cowork-handoff/`) al repo real
en `feature/v2.0`: `PERFUMES_INITIAL_50.csv` (50 filas, transformado para
calzar con `schema/perfume.schema.json` — se generaron slugs, se separó
precio/moneda, se mapeó `entrada`→`económico`), 11 artículos movidos a
`articles/`, `quiz-questions.md` a `COPY/`, y `SEO_STRATEGY.md` a la raíz.
El `CLAUDE.md` de Cowork se fusionó como sección nueva dentro del
`CLAUDE.md` real (no se reemplazó nada técnico) y se borró el duplicado
junto con toda la carpeta temporal. Quedan 4 pendientes de contenido sin
resolver a propósito (no son decisiones técnicas): 5 perfumes con
categoría de precio inválida (`nicho` en vez de un tier real), si sumar
`nicho_o_comercial` al schema oficial, el mapeo de redirects v1→v2
todavía sin confirmar, y una duplicación de contenido en
`resena-baccarat-rouge-540` (`.html` de v1 + `.md` nuevo). El pendiente
técnico de la sesión anterior (build/dev sin verificar por la limitación
de binarios nativos del sandbox) sigue sin resolverse — no se pudo
verificar en esta sesión tampoco, se mantiene explícito en el checklist.
