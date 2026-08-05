# CLAUDE.md — Aromia

Memoria operativa técnica para trabajar en este repo. Las decisiones de
**producto** (alcance, exclusiones, roadmap) viven en `ESTADO-aromia.md`
(raíz del repo desde el 17/07 — antes se manejaba fuera, en Descargas) — no
se duplican acá.

Antes de cerrar cualquier tarea de diseño/frontend, correr el checklist
de `DESIGN-CHECKLIST.md` (raíz del repo, entregado por Brey el 23/07) —
cobertura completa de pantallas, tokens, shadcn/ui, assets, links de
afiliado y verificación en vivo (Railway + aromialab.com, no solo local).

No se encontró un borrador de `CLAUDE.md` de Cowork en el repo al momento
de este Sprint 1 — este documento se escribió desde cero con lo técnico
real implementado en el scaffolding. Cowork trabajó en paralelo sin acceso
al repo (ver `AROMIA_WORKFLOW_MASTER.md`, sección 3) y entregó su propio
borrador más tarde, en la reconciliación — ver sección "Contenido (Sprint
1 — Cowork)" más abajo, fusionada acá sin pisar lo técnico ya escrito.

## Qué es este repo

**Actualizado 21/07 — este documento describía el scaffolding de Sprint 1
(mediados de julio); el resto del archivo, salvo esta sección y las
marcadas "Actualizado 21/07", puede tener detalles desactualizados sobre
lo que existía en ese momento (número de rutas, si corría `next dev`,
etc.) — para el estado de producto y decisiones, `ESTADO-aromia.md` es
la fuente real y se mantiene al día.**

Dos versiones conviven en ramas distintas:

- **`main`** — v1, sitio estático (HTML/CSS/JS), antes en GitHub Pages.
  **Dejó de ser el sitio en vivo el 19-20/07** (corte de dominio real,
  ver `ESTADO-aromia.md` decisión #64) — sigue existiendo en el repo pero
  `aromialab.com` ya no apunta ahí. Sigue sin tocarse desde `feature/v2.0`.
- **`feature/v2.0`** — v2.0, **es el sitio en producción real** desde el
  19-20/07 en `aromialab.com` (Railway, auto-deploy en cada push a esta
  rama). Monorepo Next.js 14 + Express dentro de `apps/`.

## Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS —
  `apps/web`. Capa de componentes base: **shadcn/ui** (adoptado 21-22/07
  durante la auditoría QA, ver `CHANGELOG-2.0.md`) — componentes se
  generan con su CLI y quedan como código propio en
  `apps/web/src/components/ui/`, no como dependencia de node_modules.
- **Backend**: Node.js + Express + TypeScript — `apps/api`
- **Base de datos**: PostgreSQL
- **Cache/colas**: Redis (sin uso real todavía, solo conexión verificada
  en `/health`)
- **Hosting**: Railway (`web` + `api`, ambos con Dockerfile propio),
  **en producción real** desde el 19-20/07 — ver "CI/CD y deploy" abajo.
  (Sprint 1 había dejado esto como "objetivo, sin configurar"; ya no.)

### Ajuste de Sprint 1 sobre el stack propuesto por Cowork

`ESTADO-aromia.md` (decisión #9) dejaba abierto Express vs. FastAPI. Se
eligió **Express + TypeScript** por practicidad: mismo lenguaje que el
frontend (Next.js/TS), sin cambiar de ecosistema de tooling para un
scaffolding inicial simple (un router de perfumes, sin lógica pesada
todavía). Si más adelante el scraper de precios o las recomendaciones vía
Claude API se benefician de librerías específicas de Python, se puede
reevaluar — no es una decisión cerrada de forma permanente.

Chart.js/Recharts, Strapi, Bull/node-cron y SendGrid/Mailgun (decisión #9
y #10 del `ESTADO`) **no se instalaron en Sprint 1** — no había features
que los necesitaran todavía. Se agregan cuando el sprint que los use
arranque, para no cargar dependencias sin uso.

## Estructura de carpetas

**Actualizado 21/07** — refleja las rutas reales, no solo las de Sprint 1:

```
/                       # v1 (main) — ya no es el sitio en vivo, no tocar
├── apps/
│   ├── web/            # Next.js 14, App Router
│   │   └── src/
│   │       ├── app/
│   │       │   ├── page.tsx                 # home "/"
│   │       │   ├── perfumes/[slug]/         # catálogo + ficha de producto
│   │       │   ├── magazine/[slug]/imprimir/ # hub + lectura + vista PDF
│   │       │   ├── quiz/resultado/[perfil]/
│   │       │   ├── club/, privacidad/
│   │       │   ├── admin/(protected)/       # panel admin, auth por cookie
│   │       │   ├── admin/login/
│   │       │   └── api/admin/, api/auth/    # route handlers del admin
│   │       ├── components/
│   │       │   ├── admin/, magazine/, perfume/, quiz/
│   │       │   └── NavBar.tsx, Footer.tsx, GoogleAnalytics.tsx
│   │       └── lib/            # api.ts, types.ts, magazineCategories.ts,
│   │                            # readingTime.ts, paginateArticle.ts, etc.
│   └── api/             # Express + TypeScript
│       ├── src/
│       │   ├── index.ts        # entrypoint, monta routers
│       │   ├── db/              # pool de Postgres, migrate.ts, seed.ts
│       │   ├── scraper/         # scaffold Awin (Douglas/Primor), no-op sin credenciales
│       │   └── routes/
│       │       ├── perfumes.ts, articles.ts, subscribers.ts  # públicos
│       │       └── admin/       # perfumes.ts, articles.ts, dashboard.ts, scraper.ts
│       └── migrations/          # SQL plano, numerado 001..010
├── schema/
│   └── perfume.schema.json      # contrato de columnas para la tabla
│                                  # perfumes — referencia histórica del CSV
├── docker-compose.yml    # Postgres + Redis local (dev)
└── .github/workflows/v2-ci.yml  # lint + typecheck + build en cada push
```

### Convención de páginas/componentes (Next.js App Router)

- Una carpeta por ruta bajo `src/app/`, con `page.tsx` adentro.
- Rutas dinámicas con `[param]` (ej. `perfumes/[slug]`).
- Componentes reutilizables en `src/components/`, un archivo por
  componente, nombre en PascalCase igual al export.
- Data fetching de servidor (server components) llamando a los helpers de
  `src/lib/api.ts` — no `fetch` suelto dentro de los componentes.
- Sin estado global todavía (no hace falta con lo construido en Sprint 1).

## Comandos

### Frontend (`apps/web`)

```
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

### Backend (`apps/api`)

```
npm install
cp .env.example .env
npm run migrate  # aplica migrations/001_create_perfumes.sql
npm run dev       # http://localhost:4000
npm run build
```

### Infra local

```
docker compose up -d   # Postgres (5432) + Redis (6379)
```

> Nota de Sprint 1 (superada, dejada por historial): el worktree usado en
> ese sprint no podía correr `next build`/`next dev` ni Docker (binario
> nativo `@next/swc-*` fallaba). **Ya no aplica** — confirmado 21/07 en
> `C:\Users\user\Claude\Projects\aromia-lab` (la carpeta real de trabajo,
> no un worktree separado): `npm install` + `npm run dev` corren sin
> problemas en `apps/web`, `npx tsc --noEmit` y `npx next lint` limpios.
> `apps/api` no tiene `node_modules` instalado localmente por defecto —
> correr `npm install` ahí antes de `npm run dev`/`migrate`. Para probar
> el frontend contra datos reales sin levantar Postgres local, se puede
> apuntar `NEXT_PUBLIC_API_URL` en `apps/web/.env.local` (gitignored) a
> `https://api-production-fe2f.up.railway.app` — funciona porque son
> lecturas GET contra la API pública real.

## Variables de entorno

**Actualizado 21/07:**

- `apps/web/.env.example` → `NEXT_PUBLIC_API_URL` (default
  `http://localhost:4000`), `NEXT_PUBLIC_SITE_URL` (usado por
  `sitemap.ts`/`robots.txt` — **debe pasarse como build-arg del
  Dockerfile en Railway**, no solo como env var de runtime, porque
  `NEXT_PUBLIC_*` se inlinea en build-time; ver bug corregido el 19-20/07
  en `CHANGELOG-2.0.md`), `NEXT_PUBLIC_GA_ID`, `ADMIN_PASSWORD`,
  `ADMIN_SESSION_SECRET`, `ADMIN_API_TOKEN` (mismo token que
  `apps/api`, usado por el frontend para llamar rutas admin de la API).
- `apps/api/.env.example` → `PORT`, `DATABASE_URL`, `REDIS_URL`,
  `CORS_ORIGIN`, `ADMIN_API_TOKEN`, `SENDGRID_API_KEY` +
  `SENDGRID_FROM_EMAIL` (newsletter — no-op sin setear),
  `AWIN_API_TOKEN` + `AWIN_MERCHANT_ID_DOUGLAS` + `AWIN_MERCHANT_ID_PRIMOR`
  (scraper de precios — no-op sin setear, ver sección Scraper abajo).
- Credenciales de producción (Railway): pedirlas a Code, no están en el
  repo. Para acceso directo a la Postgres de producción desde una
  terminal local: `railway link -p aromia-lab-v2` (elige servicio
  `Postgres-TdTp`), después `railway variables --service Postgres-TdTp
  --kv` para ver `DATABASE_PUBLIC_URL` (conexión externa, la interna
  `DATABASE_URL` solo resuelve dentro de la red de Railway).

## Base de datos

**Actualizado 21/07** — 10 migraciones aplicadas a producción, tablas
reales:

- `perfumes` (`001`, + `002` agrega `nicho_o_comercial`, `004` agrega
  `estado`) — columnas alineadas 1:1 a `schema/perfume.schema.json`.
  Cualquier cambio de columnas se hace primero en el schema JSON, después
  en una migración nueva numerada. **Catálogo real: 38 filas**, no 50 —
  los 12 perfumes sin foto real de producto (no Amazon, Notino ni
  Douglas) se eliminaron del catálogo el 21/07, no quedaron en
  placeholder (ver `ESTADO-aromia.md` decisión #71).
- `retailers` (`003`) — uno-a-muchos con `perfumes`, `ON DELETE CASCADE`.
  `008` agrega `fuente`/`sincronizado_en` para que el scraper (ver abajo)
  distinga sus propias filas de las cargadas a mano y nunca las pise.
- `activity_log` (`005`) — feed de actividad del dashboard admin.
- `articles` (`006`, + `010` agrega `autor`, nullable) — **fuente real
  del contenido del magazine**, no los `.md` de `articles/` (ver
  corrección en la sección "Artículos" más abajo). Editada desde
  `/admin/magazine` (Tiptap → HTML plano en `contenido_html`, sin
  marcadores de página).
- `subscribers` (`007`) — newsletter, `fuente` en (`home`, `quiz`,
  `club`). `009` agrega `club` al CHECK de `fuente`.

Migrar: `cd apps/api && npm run migrate` (aplica todas las de
`migrations/` en orden, no solo la primera — `migrate.ts` generaliza esto
desde la migración `002`).

## CI/CD y deploy

`.github/workflows/v2-ci.yml` corre en cada push/PR a `feature/v2.0`:
lint + typecheck + build de `apps/web`, lint + typecheck de `apps/api`.

**Deploy real (actualizado 21/07):** Railway (proyecto `aromia-lab-v2`)
auto-deploya en cada push a `feature/v2.0` — no hace falta accionarlo a
mano, y no está condicionado a que el CI de GitHub pase (son pipelines
independientes). Dos servicios (`web`, `api`) + `Postgres-TdTp` + Redis.
Dominio real (`aromialab.com`/`www.aromialab.com`) apunta a `web` desde
el corte de dominio del 19-20/07. Cada app tiene su propio `Dockerfile`;
variables `NEXT_PUBLIC_*` de `apps/web` deben pasarse como build-arg del
Dockerfile además de env var de Railway, porque Next.js las inlinea en
build-time, no en runtime (bug real que costó dos rondas de deploy, ver
`CHANGELOG-2.0.md` 18/07 y 19-20/07 — mismo patrón se repite si se
agrega una `NEXT_PUBLIC_*` nueva sin tocar el Dockerfile).

## Convenciones de código

- TypeScript estricto (`strict: true`) en ambas apps.
- Nombres de campos de dominio (perfumes, notas, etc.) en español, para
  consistencia con el contenido del sitio — el código de infraestructura
  (nombres de funciones, variables técnicas) en inglés.
- Sin comentarios explicativos de "qué hace" el código — solo cuando haya
  una razón no obvia.

## Contenido (Sprint 1 — Cowork)

Fusionado desde el borrador de `CLAUDE.md` que entregó Cowork en la
reconciliación de Sprint 1 (ver `SPRINT1_COMPLETE_CODE.md` para el detalle
completo de la reconciliación). Describe cómo está estructurado el
contenido generado por Cowork y cómo el frontend debe consumirlo — no
duplica decisiones de producto, esas viven en `ESTADO-aromia.md`.

### Catálogo de perfumes — `PERFUMES_INITIAL_50.csv` (raíz del repo)

CSV con 50 filas ya reconciliadas contra `schema/perfume.schema.json`.
Columnas (en este orden):

```
slug, nombre, marca, genero, familia_olfativa, notas_salida,
notas_corazon, notas_fondo, precio_referencia, moneda, categoria_precio,
imagen_url, link_afiliado, descripcion_corta, nicho_o_comercial
```

Notas para el parser:

- `notas_salida`, `notas_corazon`, `notas_fondo` son listas internas
  separadas por `;` (no coma), tal como especifica
  `schema/perfume.schema.json`.
- `descripcion_corta` puede contener comas dentro de texto entrecomillado
  (CSV estándar RFC 4180) — usar un parser de CSV real, no split manual
  por coma.
- `genero`: `masculino` | `femenino` | `unisex` (coincide con el enum del
  schema).
- `categoria_precio`: debería ser `económico` | `medio` | `premium` |
  `lujo` (enum del schema). **5 filas todavía tienen el valor `nicho`**,
  que no es una categoría de precio válida — quedó así a propósito, sin
  reasignar, porque no es una decisión técnica (ver
  `SPRINT1_COMPLETE_CODE.md` para el detalle y la lista de perfumes
  afectados).
- `nicho_o_comercial` (`nicho` | `comercial`): **sumado al schema y a
  Postgres el 2026-07-16** (`schema/perfume.schema.json`,
  `apps/api/migrations/002_add_nicho_o_comercial.sql`) — Brey confirmó que
  se va a usar para filtros en el frontend. `apps/api/src/db/seed.ts` ya
  lo carga; la API lo expone (usa `SELECT *`); el tipo `Perfume` de
  `apps/web/src/lib/types.ts` lo incluye. Las 50 filas del CSV tienen
  valor (24 `nicho`, 26 `comercial`), columna `NOT NULL`-safe pero se
  dejó nullable en la migración por consistencia con el resto de columnas
  opcionales de la tabla.
- `link_afiliado` e `imagen_url`: **ya no son placeholders** (actualizado
  21/07) — `link_afiliado` 38/38 con URL de afiliado real de Amazon,
  `imagen_url` 38/38 con foto real de producto (Amazon, Notino o
  Douglas, extraída vía Browser pane porque `curl` directo está
  bloqueado por detección de bots en esos sitios). Este CSV en la raíz y
  su copia en `apps/api/data/` deben mantenerse idénticos — `seed.ts` lee
  la copia de `apps/api/data/` porque el build de Railway solo ve el
  contenido de `apps/api` (root directory del servicio).
- `slug` fue generado por Code a partir de `nombre` (y `marca` como
  desempate si hay colisión) — no venía en el CSV original de Cowork, que
  traía un `id` numérico secuencial en su lugar. Ese `id` no se conservó:
  Postgres genera su propia PK (`SERIAL`) en la migración.

#### Estado real en staging (actualizado 2026-07-16, Code)

Los 50 perfumes ya están sembrados en el Postgres del staging de Railway
(proyecto `aromia-lab-v2`, rama `feature/v2.0` — ver `CHANGELOG-2.0.md`),
vía `apps/api/src/db/seed.ts` (usa `csv-parse`, RFC 4180 real). Verificado
navegando `/perfumes` y `/perfumes/santal-33` con datos reales.

Confirmado: `link_afiliado` e `imagen_url` se sembraron **tal cual venían
del CSV** (placeholders) — `seed.ts` no tiene ninguna lógica especial para
esas columnas. Van a quedar con URLs falsas en staging hasta que se
reemplacen por datos reales antes de producción.

Las 5 filas con `categoria_precio = nicho` se remapearon a `premium` al
sembrar (no se dejaron sin reasignar como decía la nota original de
arriba — esa decisión ya se tomó con Brey). **Revisado y cerrado
(2026-07-16):** comparando contra los precios reales del resto del
catálogo, `lujo` arranca en $275 y `premium` llegaba hasta $240. Los 5
perfumes de nicho van de $145 a $255 (Molecule 01 $145, Kirke $195,
Nishane Hacivat $250, Le Labo Another 13 $250, Santal 33 $255) —
ninguno alcanza el piso de `lujo`. `premium` es correcto para los 5, no
hace falta migración.

### Artículos — corrección importante (actualizado 21/07)

Los `articles/*.md` descritos abajo fueron el **insumo inicial de
contenido de Sprint 1**, pero **ya no son la fuente real**. Desde que se
construyó el admin (`/admin/magazine`), la fuente de verdad es la tabla
`articles` de Postgres — sembrada una vez desde estos `.md` vía
`apps/api/src/db/seedArticles.ts`, pero editada y publicada desde ahí en
adelante vía el editor Tiptap del admin (`contenido_html`, HTML plano,
sin marcadores de página). No hay sincronización entre el `.md` y la
fila de Postgres después de la siembra inicial — si alguien edita el
`.md`, eso **no** se refleja en el sitio; hay que editarlo desde
`/admin/magazine`.

11 archivos markdown (10 pedidos + 1 de más, señalado por Cowork como
exceso menor — se dejó, no se borró contenido válido). Conviven con los
18 artículos `.html` de v1 en la misma carpeta `articles/` — no hay
colisión de nombre de archivo (extensiones distintas), salvo
`resena-baccarat-rouge-540`, que ahora existe como `.html` (v1) y `.md`
(v2.0) — mismo perfume, dos piezas de contenido distintas conviviendo;
no se resolvió esa duplicación de contenido acá, es una decisión de
contenido/SEO, no técnica.

Cada archivo tiene front-matter YAML:

```yaml
---
titulo: "..."
tipo: resena_individual | comparativa | guia_temporada | guia_ocasion
perfumes: ["Nombre exacto del perfume", "..."]
keyword_objetivo: "..."
---
```

`perfumes` contiene el `nombre` exacto tal como aparece en
`PERFUMES_INITIAL_50.csv`, para cruzar el artículo con su ficha de
perfume en el frontend (ej. "perfumes mencionados en este artículo" con
link a `/perfumes/[slug]/`). El cuerpo es markdown estándar después del
front-matter.

De los 50 perfumes del CSV original, 15 tienen al menos un artículo
propio; el resto queda como prioridad de contenido para la siguiente
ronda (ver `SEO_STRATEGY.md`).

### `/magazine` — hub + lectura + impresión/PDF (nuevo 21/07)

Reemplaza a `/articulos` (que ahora es redirect 308, código eliminado).
Implementado a partir de mockup + especificación entregados por Brey —
detalle completo en `CHANGELOG-2.0.md`, entradas del 21/07. Puntos
técnicos que no son obvios leyendo el código:

- **Paginado del lector**: el contenido de `contenido_html` (Tiptap, sin
  marcadores de página) se divide en páginas por un presupuesto de
  caracteres (`apps/web/src/lib/paginateArticle.ts`, cliente-only,
  `DOMParser`) y una versión regex server-safe para la vista de
  impresión (`apps/web/src/lib/splitHtmlBlocks.ts`, sin `DOMParser`
  porque `PrintableArticle` es Server Component). Si se cambia el
  toolbar de `RichTextEditor.tsx` para permitir más tipos de bloque
  (tablas, imágenes inline), ambos helpers necesitan actualizarse — hoy
  solo reconocen `p`, `h1-h6`, `blockquote`, `ul`, `ol`.
- **`react-pageflip`** (`apps/web/node_modules`, sin `@types` propio en
  `package.json` pero con `.d.ts` en `build/` — TypeScript los resuelve
  igual): se carga con `dynamic(..., { ssr: false })` en
  `ArticleReadingView.tsx`, no dentro de `PageFlipReader.tsx` — el
  dynamic import tiene que vivir en el Client Component que lo usa, no
  en el componente mismo.
- **Vista de impresión** es una ruta propia (`/magazine/[slug]/imprimir`),
  no un toggle de pantalla dentro de la misma página — más simple de
  razonar con Server Components, y el usuario la ve como una "página"
  real (bookmarkeable, compartible). `PrintableArticle.tsx` es HTML
  semántico server-rendered; las reglas exactas de impresión (`@page`,
  pt, `orphans`/`widows`, `break-*`) viven en `globals.css` dentro de
  `@media print`, no como estilos inline — necesario porque `@page` no
  es expresable como prop de React.
- `NavBar`/`Footer` llevan `print:hidden` (Tailwind) para no imprimirse
  en ninguna página, no solo en el magazine.

### Quiz — `COPY/quiz-questions.md`

Documento de especificación de producto, no JSON — hay que traducirlo a
la estructura de datos que use el frontend (array de preguntas en
TypeScript, o tabla en la base). Contiene 6 preguntas (3-4 opciones cada
una), un sistema de puntaje por tags (7 tags posibles), una tabla de
mapeo de tag dominante → `familia_olfativa` + `nicho_o_comercial` del CSV
(para filtrar recomendaciones), y copy de resultado por perfil (título +
descripción) pensado para `og:title` / `og:description` en la página de
resultado compartible. La lógica de matching es de reglas simples (suma
de puntos, sin ML) — implementable como función pura, sin modelo ni
servicio externo.

**Corrección (2026-07-16, Code):** el archivo **ya está en el repo**
desde Sprint 1 — el placeholder de `/quiz` en staging que dice "esperando
este archivo" no es por falta de insumo, es que todavía no se
implementó la lógica. Nota de `nicho_o_comercial`: el mapeo de matching
de este documento usa esa columna, que aún no está en Postgres (ver
sección de catálogo arriba) — si se implementa el quiz antes de esa
migración, ese filtro específico va a necesitar leerse del CSV en vez
de la base, o esperar a que se persista la columna.

### Estrategia SEO — `SEO_STRATEGY.md` (raíz del repo)

Estructura de URLs propuesta originalmente en Sprint 1 (con `/articulos/`
en vez de `/magazine/` — superado, ver abajo):

```
/perfumes/[slug]/
/quiz/
/quiz/resultado/[perfil]/
```

**Redirects v1→v2: cerrados (actualizado 21/07).** Están activos en
`apps/web/next.config.mjs` — mapa completo v1(`.html`)→v2, más
`/articulos` → `/magazine` (308, la ruta vieja del propio v2.0 tras el
reemplazo del 21/07). Cualquier URL nueva de contenido que se agregue
debe usar `/magazine/[slug]`, no `/articulos/[slug]` — esa ruta ya no
existe como página propia, solo como redirect.

### Convenciones de nombres

- Slug de artículo = nombre de archivo sin extensión (ej.
  `resena-santal-33.md` → slug `resena-santal-33`).
- Carpeta `articles/` en minúsculas (ya así en v1) — nunca `/ARTICLES/`
  en mayúsculas (GitHub Pages es case-sensitive).
