# Sprint 1 — Cierre Code
Generado: 12 de julio de 2026

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
9. No hubo ambigüedades de **producto** que señalar en este sprint —
   todo lo pedido en `SPRINT1_CODE.md` era scaffolding técnico dentro
   de decisiones ya tomadas en `ESTADO-aromia.md`.
