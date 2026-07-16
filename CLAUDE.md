# CLAUDE.md — Aromia

Memoria operativa técnica para trabajar en este repo. Las decisiones de
**producto** (alcance, exclusiones, roadmap) viven en `ESTADO-aromia.md`
(fuera de este repo) — no se duplican acá.

No se encontró un borrador de `CLAUDE.md` de Cowork en el repo al momento
de este Sprint 1 — este documento se escribió desde cero con lo técnico
real implementado en el scaffolding. Cowork trabajó en paralelo sin acceso
al repo (ver `AROMIA_WORKFLOW_MASTER.md`, sección 3) y entregó su propio
borrador más tarde, en la reconciliación — ver sección "Contenido (Sprint
1 — Cowork)" más abajo, fusionada acá sin pisar lo técnico ya escrito.

## Qué es este repo

Dos versiones conviven en ramas distintas:

- **`main`** — v1, sitio estático (HTML/CSS/JS) hosteado en GitHub Pages,
  monetizado con afiliados de Amazon. **No se toca** durante el desarrollo
  de v2.0 — sigue generando ingresos mientras se migra.
- **`feature/v2.0`** — v2.0 en construcción: comparador de perfumes,
  recomendaciones, scraper de precios, dashboard, newsletter, quiz, API
  pública, alertas de precio. Monorepo Next.js + Express dentro de `apps/`.

## Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS —
  `apps/web`
- **Backend**: Node.js + Express + TypeScript — `apps/api`
- **Base de datos**: PostgreSQL
- **Cache/colas**: Redis (sin uso real todavía, solo conexión verificada
  en `/health`)
- **Hosting objetivo** (no configurado en Sprint 1): Vercel (frontend) +
  Railway/Render (backend)

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

```
/                       # v1 (main) — no tocar desde feature/v2.0
├── apps/
│   ├── web/            # Next.js 14, App Router
│   │   └── src/
│   │       ├── app/            # rutas (page.tsx por carpeta)
│   │       │   ├── page.tsx            # home "/"
│   │       │   ├── perfumes/page.tsx   # listado "/perfumes"
│   │       │   ├── perfumes/[slug]/    # detalle "/perfumes/:slug"
│   │       │   └── quiz/page.tsx       # "/quiz"
│   │       ├── components/     # componentes compartidos (PascalCase)
│   │       └── lib/            # helpers (api.ts, types.ts)
│   └── api/             # Express + TypeScript
│       ├── src/
│       │   ├── index.ts        # entrypoint, monta routers
│       │   ├── db/              # pool de Postgres + script de migración
│       │   ├── redis/           # cliente Redis
│       │   └── routes/          # un archivo por recurso (perfumes.ts)
│       └── migrations/          # SQL plano, numerado (001_, 002_...)
├── schema/
│   └── perfume.schema.json      # contrato de columnas para la tabla
│                                  # perfumes — referencia para Cowork (CSV)
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

> Nota de Sprint 1: el entorno de scaffolding no pudo ejecutar `next
> build`/`next dev` ni Docker directamente (la filesystem del worktree
> usado para este sprint no carga binarios nativos de Node —
> `@next/swc-*` falla con "not a valid Win32 application" pese a ser un
> binario válido). Se verificó la corrección del código con `tsc
> --noEmit` (sin errores en `web` y en `api`) y `eslint` (sin errores) en
> lugar de una build completa. Correr `npm run dev`/`npm run build` en un
> entorno normal debería funcionar sin cambios — si no, revisar primero
> si es un problema de entorno antes de tocar código.

## Variables de entorno

- `apps/web/.env.example` → `NEXT_PUBLIC_API_URL` (default
  `http://localhost:4000`)
- `apps/api/.env.example` → `PORT`, `DATABASE_URL`, `REDIS_URL`,
  `CORS_ORIGIN`

## Base de datos

Tabla `perfumes` (ver `migrations/001_create_perfumes.sql`), con columnas
alineadas 1:1 a `schema/perfume.schema.json`. Cualquier cambio de columnas
se hace primero en el schema JSON (fuente de verdad para Cowork), después
en una migración nueva numerada.

## CI/CD

`.github/workflows/v2-ci.yml` corre en cada push/PR a `feature/v2.0`:
lint + typecheck + build de `apps/web`, lint + typecheck de `apps/api`.
Sin deploy todavía (Vercel/Railway quedan para una fase posterior).

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
- `link_afiliado` e `imagen_url` son **placeholders** (`https://afiliado
  .placeholder/...`, `https://img.placeholder/...`) — no son datos de
  producción todavía.
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

### Artículos — `articles/*.md`

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

De los 50 perfumes del CSV, 15 tienen al menos un artículo propio; los 35
restantes quedan como prioridad de contenido para la siguiente ronda (ver
`SEO_STRATEGY.md`).

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

Define la estructura de URLs propuesta para v2.0:

```
/articulos/[slug]/
/perfumes/[slug]/
/quiz/
/quiz/resultado/[perfil]/
```

**Redirects v1→v2 (decisión #5 de `ESTADO-aromia.md`): sin confirmar.**
Cowork no tuvo acceso a `ESTADO-aromia.md` durante su sprint para
verificar las URLs reales de v1 contra esta estructura propuesta. Sigue
pendiente — es una decisión de contenido/SEO (mapa de URLs viejas →
nuevas), no algo que Code deba completar unilateralmente. Una vez que
haya mapa confirmado, la implementación de los redirects 301 en Next.js
(`next.config.js`) sí es tarea técnica.

### Convenciones de nombres

- Slug de artículo = nombre de archivo sin extensión (ej.
  `resena-santal-33.md` → slug `resena-santal-33`).
- Carpeta `articles/` en minúsculas (ya así en v1) — nunca `/ARTICLES/`
  en mayúsculas (GitHub Pages es case-sensitive).
