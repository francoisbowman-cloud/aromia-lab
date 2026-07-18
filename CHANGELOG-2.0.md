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

## 2026-07-17 — Code

Todo lo de abajo vive en `feature/v2.0` (worktree local), **sin commitear ni
deployar a Railway todavía** — pendiente de revisión de Brey antes de subir.

### Panel de administración + ficha de producto (implementación completa del mockup "Aromia Admin 2.0" + "Anatomía de una fragancia")
- Nuevo: sistema de diseño reconciliado (dorado `#B68A44`/`#C8A86B` + variante
  `--gold-contrast` para texto/botones, tipografía Georgia/serif + Inter/sans)
  en `apps/web/tailwind.config.ts` y `globals.css`.
- Nuevo: `/perfumes/[slug]` reconstruida con los 6 bloques del mockup
  (encabezado + imagen, tabla de precios multi-retailer, radar olfativo con
  Recharts, evolución en piel, reseñas comunitarias), estados de
  carga/vacío/error, accesible (`aria-live`, foco visible,
  `prefers-reduced-motion`).
- Nuevo: migración `003_create_retailers.sql` (tabla `retailers`,
  uno-a-muchos con `perfumes`, backfill desde las columnas viejas) +
  `longevidad`/`estela`/`proyeccion`/`resena_sintetizada` en `perfumes`.
- Nuevo: auth de `/admin` (cookie HMAC firmada + bearer token
  `ADMIN_API_TOKEN` entre `apps/web` y `apps/api`), contraseña compartida
  simple (sin cuentas de usuario), tal como se decidió con Brey.
- Nuevo: `/admin/catalogo` (tabla con búsqueda/filtros/paginación) y
  `/admin/perfumes/[id]` + `/nuevo` (CRUD completo: tags de notas, subida de
  imagen con `multer`, retailers, reseña sintetizada, SEO). Migración
  `004_add_perfume_estado.sql` (columna `estado`: borrador/publicado).
- Nuevo: `/admin` (Dashboard) con KPIs reales (`COUNT(*)` de perfumes y
  artículos publicados) y feed de actividad real. Migración
  `005_create_activity_log.sql`. **El actor placeholder "Por Cowork" del
  mockup se reemplazó por actores reales** (`Brey` en acciones manuales,
  `Sistema` en automáticas) — ninguna acción real inserta "Cowork".
- Nuevo: `/admin/magazine` — editor de artículos con Tiptap, campos SEO
  plegables, flujo borrador/publicado. Migración `006_create_articles.sql`.
  Verificado de punta a punta en navegador (crear, guardar borrador,
  publicar, confirmar en actividad reciente).
- Corregido (auditoría WCAG AA): el dorado decorativo del mockup
  (`#b68a44`/`#c8a86b`) da ~2.8–3.1:1 de contraste sobre fondos claros —
  insuficiente para texto (mínimo 4.5:1 AA). Se agregó `--gold-contrast`
  (`#866526`, ratio ~5:1) para todo texto/botón dorado, y
  `admin-success-text`/`admin-warning-text` para los badges de estado del
  catálogo admin. `prefers-reduced-motion` ya estaba cubierto globalmente.
  Barrido responsive en 1440/1024/768/640/375/320px sin overflow.

### Sitio público: home, listado de perfumes y quiz (antes placeholders de Sprint 1)
- Corregido (bug real): `GET /api/perfumes` y `GET /api/perfumes/:slug`
  (rutas públicas) solo filtraban por `activo = true`, no por `estado` — un
  perfume en borrador creado desde el admin ya era visible públicamente.
  Ahora ambas rutas exigen `estado = 'publicado'`.
- Nuevo: `NavBar` y `Footer` rediseñados con el sistema de diseño (antes sin
  estilo, del scaffolding de Sprint 1).
- Nuevo: `/perfumes` — listado real con tarjetas (`PerfumeCard`), filtros
  client-side (texto, género, familia olfativa, categoría de precio,
  nicho/comercial) sobre los 50 perfumes, estados de carga/vacío/error.
- Nuevo: `/` (home) — hero editorial, sección "Destacados" con perfumes
  reales de Postgres, banner de acceso al quiz.
- Nuevo: `/quiz` implementado — las 6 preguntas y 7 perfiles de
  `COPY/quiz-questions.md` traducidas a lógica real (`apps/web/src/lib/quizData.ts`),
  flujo interactivo, resultado compartible en `/quiz/resultado/[perfil]` con
  metadata OG (título/descripción por perfil), 404 si el slug no existe.
- Decisión de alcance: **no se tocó el Magazine público (`/articulos/`)** —
  requeriría construir desde cero el parseo de los 11 `.md` de `articles/`;
  fuera de este batch de trabajo a propósito.
- Corregido: el copy del quiz y de la home venía traducido casi textual
  desde `COPY/quiz-questions.md` (voseo argentino: "sos", "elegís",
  "buscás", "vos"). Reescrito en español neutro en las 7 descripciones de
  perfil, las preguntas y la home — pedido explícito de Brey.

### Pendiente / no resuelto en este batch
- El mockup de **Catálogo** enviado a Code el 16/07 (`/catalogo`, scroll
  infinito, tarjeta "Perfume del mes" cada 6 posiciones) **no es lo que se
  construyó** — se implementó un `/perfumes` más simple (filtros, sin
  scroll infinito ni tarjeta editorial insertada). Si Brey quiere el diseño
  original del mockup, es trabajo pendiente aparte.
- El mockup de **Magazine público** (`/magazine`, hub tipo revista, lectura
  con hojeo `react-pageflip`, descarga PDF vía `@media print`) tampoco se
  construyó — sigue pendiente en su totalidad.
- Nada de esto se subió a Railway todavía — vive solo en el worktree local.
