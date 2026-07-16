# Changelog — Aromia 2.0

Registro corto de cada entrega al repo en `feature/v2.0` y ramas derivadas. Una entrada por deploy: fecha + qué se subió + quién. Ver `CHANGELOG-1.0.md` (en `main`) para el registro del sitio estático v1.

## 2026-07-15/16 — Code
- Nuevo: staging de Aromia 2.0 en Railway, en vivo — proyecto `aromia-lab-v2`:
  - `api` (Express + TS) → https://api-production-fe2f.up.railway.app
  - `web` (Next.js 14) → https://web-production-71f88.up.railway.app
  - Servicios administrados: Postgres (`Postgres-TdTp`) y Redis.
- Nuevo: `apps/api/Dockerfile`, `apps/web/Dockerfile`, `railway.json`, `docker-compose.yml` extendido con servicios `api`/`web` — usados tanto para build local como para Railway.
- Nuevo: `apps/api/src/db/seed.ts` (`npm run seed`) — carga `PERFUMES_INITIAL_50.csv` a Postgres con `csv-parse` (RFC 4180 real, no split manual, por las comas entrecomilladas en `descripcion_corta`). El CSV se duplicó a `apps/api/data/` porque el build de Railway solo ve el contenido de `apps/api` (root directory del servicio); la raíz del repo sigue siendo la fuente canónica del CSV.
- Corregido: las 5 filas con `categoria_precio = nicho` (Santal 33, Molecule 01, Kirke, Le Labo Another 13, Nishane Hacivat) se remapean a `premium` al sembrar — `nicho` no es un valor válido para esa columna (choca con el `CHECK` de la migración; confunde categoría de precio con tipo de mercado). Decisión tomada con Brey, no inventada.
- Estado de datos: **50/50 perfumes cargados** en el Postgres de Railway. Confirmado navegando `/perfumes` y `/perfumes/santal-33` en el staging — ambas rutas muestran datos reales.
- Corregido (bugs de deploy, no de código de features): root directory de `api`/`web` mal configurado en Railway (servía el HTML estático de `main` en vez de buildear las apps); `web` apuntaba a la rama `main` en vez de `feature/v2.0`; `NEXT_PUBLIC_API_URL` sin build-arg en el Dockerfile (Docker cacheaba `npm run build` completo entre deploys, ignorando cambios de variable); typo de paréntesis de más en el valor de esa variable en Railway. Todo corregido y verificado.
- `/quiz` sigue como placeholder de Sprint 1 — **corrección:** `COPY/quiz-questions.md` ya está en el repo desde Sprint 1, el placeholder es porque la lógica todavía no se implementó, no porque falte el insumo (gracias a Cowork por la corrección, ver `CLAUDE.md`).

### Pendiente para Cowork
- ~~`nicho_o_comercial` sin estar en el schema ni en Postgres~~ — **cerrado 2026-07-16:** Brey confirmó que se va a usar para filtros en el frontend. Sumado a `schema/perfume.schema.json`, migración `apps/api/migrations/002_add_nicho_o_comercial.sql`, `seed.ts` actualizado, tipo `Perfume` del frontend actualizado. Reseeded local y Railway con las 50 filas (24 `nicho`, 26 `comercial`).
- ~~Los 5 perfumes de nicho quedaron con `categoria_precio = premium`~~ — **cerrado 2026-07-16:** comparado contra los precios reales del catálogo (`lujo` arranca en $275, `premium` llegaba hasta $240), los 5 van de $145 a $255 — ninguno alcanza el piso de `lujo`. `premium` es correcto, sin migración pendiente.
- `COPY/quiz-questions.md` ya está disponible; ahora que `nicho_o_comercial` está en Postgres, el mapeo de matching del quiz puede leer directo de la base, sin depender del CSV.

## 2026-07-16 — Cowork
- Reconciliado: `CLAUDE.md` — confirmó que las 5 filas de `categoria_precio = nicho` fueron un error propio al cargar el CSV original (no ambigüedad de Code), y marcó revisar si alguna de esas 5 amerita `lujo` en vez de `premium` por precio real. Corrigió la nota de este changelog sobre `COPY/quiz-questions.md` (el archivo ya existía, no era un insumo faltante).

## 2026-07-16 — Code
- Nuevo: `apps/api/migrations/002_add_nicho_o_comercial.sql` — agrega la columna `nicho_o_comercial` (`nicho` | `comercial`, con `CHECK`) a la tabla `perfumes`, tras confirmación de Brey de que se va a usar para filtros. `schema/perfume.schema.json` y `apps/web/src/lib/types.ts` actualizados en consecuencia.
- Corregido: `apps/api/src/db/migrate.ts` ahora aplica **todos** los archivos de `migrations/` en orden (antes tenía `001` hardcodeado — con la migración 002 nueva, hacía falta generalizarlo).
- `apps/api/src/db/seed.ts` actualizado para sembrar también `nicho_o_comercial`. Verificado local (24 `nicho`, 26 `comercial` sobre 50 filas) antes de aplicar a Railway.
