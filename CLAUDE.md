# CLAUDE.md — Aromia

Memoria operativa técnica para trabajar en este repo. Las decisiones de
**producto** (alcance, exclusiones, roadmap) viven en `ESTADO-aromia.md`
(fuera de este repo) — no se duplican acá.

No se encontró un borrador de `CLAUDE.md` de Cowork en el repo al momento
de este Sprint 1 — este documento se escribió desde cero con lo técnico
real implementado en el scaffolding. Si Cowork entrega su borrador de
producto/contenido más tarde, se integra sin pisar lo de acá.

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
