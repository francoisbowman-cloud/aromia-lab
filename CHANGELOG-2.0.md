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

## 2026-07-18 — Code

Plan de convergencia completo (decisión de Brey en `ESTADO-aromia.md`,
decisiones #35-37): cierra los pendientes de arriba, endurece para
producción, **y lo deploya** — ya no vive solo en el worktree local.

### Magazine público (`/articulos`) — resuelve el pendiente del 16/07
- Decisión técnica: en vez de parsear los `.md` directo en Next.js, se
  reutiliza la tabla `articles` ya construida para `/admin/magazine` —
  no existía **ninguna** ruta pública para leerla, solo la protegida de
  admin. Nueva `GET /api/articulos` (pública, solo `estado='publicado'`).
- `apps/api/src/db/seedArticles.ts`: siembra los 11 `.md` de `articles/`
  (copiados a `apps/api/data/`, misma restricción de build de Railway
  que el CSV) a esa tabla — gray-matter + marked, cruza `perfumes` del
  frontmatter contra la tabla `perfumes` real.
- `/articulos` y `/articulos/[slug]` con el sistema de diseño existente,
  `@tailwindcss/typography` para el HTML, metadata OG por artículo.
- Decisión de alcance (Brey, #35): el mockup `/catalogo` (scroll
  infinito + "Perfume del mes") **no se retoma** — `/perfumes` queda
  como versión final.

### SEO técnico
- `sitemap.ts`/`robots.ts` nativos de Next 14, incluyen perfumes y
  artículos dinámicamente.
- `REDIRECTS_DRAFT_v1_a_v2.md`: borrador de mapeo de las 20 URLs de
  artículos + 8 páginas raíz de v1 — solo 2 coinciden de slug exacto,
  17 sin equivalente en v2 todavía. Sin activar, pendiente de Brey.

### Endurecimiento para producción
- **Bug de build encontrado en el primer intento de deploy real:**
  Next.js pre-renderiza en build-time cualquier página con
  `revalidate` (ISR) — si la API está caída durante el build, el build
  entero falla. Pasó de verdad (3 deploys fallidos seguidos). Se
  reemplaza `revalidate=60` por `dynamic="force-dynamic"` en `/`,
  `/perfumes`, `/articulos` y `sitemap.ts` — el contenido cambia todo
  el tiempo vía admin de cualquier forma, no había beneficio real en
  generación estática acá.
- Ninguna ruta de `apps/api` capturaba errores (Express 4 no propaga
  rechazos de promesas). Nuevo `asyncHandler` aplicado a las 15 rutas +
  middleware de error global + `process.on('uncaughtException'/
  'unhandledRejection')`.
- Secrets de producción generados y seteados en Railway
  (`ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `ADMIN_API_TOKEN` —
  no existían, el admin no iba a funcionar en producción tal cual).
- **Bug de infraestructura encontrado y corregido:** el dominio de
  Railway del servicio `api` tenía el *target port* pegado en `400`
  (typo histórico de la variable `PORT`, a nivel de networking de
  Railway, separado de la variable de entorno — cambiar la variable no
  alcanzaba). Corregido con `railway domain update --port 4000`.
  Healthcheck de producción (`/health`) verificado en 200 tras el fix.
- Migraciones `002` a `007` aplicadas a la Postgres de producción (solo
  tenía `001`) — con backup (`pg_dump`) previo guardado en
  `.scratch/backups/` antes de correrlas.

### Scaffold de newsletter
- Tabla `subscribers` + `POST /api/subscribers` + formulario simple en
  home y resultado del quiz. Sin proveedor de email integrado a
  propósito — pendiente de que Brey elija SendGrid vs Mailgun.

### Deploy real y verificación
- `web` y `api` deployados a Railway (auto-deploy en cada push a
  `feature/v2.0`, confirmado — no hace falta accionarlo a mano).
  Smoke test completo contra las URLs reales de producción: home,
  `/perfumes` con filtros, ficha de producto, quiz de punta a punta
  hasta el resultado, `/articulos` + artículo individual, login de
  admin + dashboard + catálogo + magazine (11 artículos, 50 perfumes,
  datos reales), captura de newsletter. Sin errores 4xx/5xx en los
  logs de Railway durante la verificación (salvo un 401 esperado de un
  intento de login de prueba).
- `object-fit`/`object-position` en `main` (Aromia 1.0): investigado,
  **ya estaba resuelto** desde el 16/07 (commit `3c5d0e9`) con una
  solución más precisa de lo que `ESTADO-aromia.md` describía — no
  hacía falta código nuevo, solo se corrigió el documento.

## 2026-07-18 (2) — Code

Ronda de Pista B resuelta con Brey por preguntas de selección múltiple
(sin ambigüedad de mi parte, todo confirmado explícitamente antes de
tocar código).

### Redirects v1 → v2 activados
- `apps/web/next.config.mjs`: 24 redirects 301 activados en base a
  `REDIRECTS_DRAFT_v1_a_v2.md` con las decisiones de Brey — slugs
  idénticos directos, reseñas sin artículo propio a su comparativa
  equivalente donde exista, fallback a ficha de producto (`/perfumes/[slug]`)
  para las que no tienen comparativa, y los artículos sin ningún
  destino razonable al hub `/articulos` en vez de 404.
- Sin redirect todavía, a propósito: `/academia.html` (Brey eligió
  escribir contenido de esa categoría antes de redirigir — 0 artículos
  la usan hoy), `/club.html` (se recrea más adelante, sin equivalente
  en v2), deep-links `/catalogo.html?p=ID` (Brey confirmó que no
  importa preservarlos, sin mapeo ID→slug disponible).

### `/privacidad` (gap cerrado)
- Nuevo: `apps/web/src/app/privacidad/page.tsx` — adaptación de
  `privacidad.html` (v1) al sistema de diseño de v2, mismas 7
  secciones (afiliados de Amazon, cookies, derechos, etc.) más una
  sección de analítica agregada por la integración de GA4. Linkeada
  desde el `Footer`.

### Google Analytics 4
- Nuevo: `apps/web/src/components/GoogleAnalytics.tsx`, montado en
  `layout.tsx` detrás de `NEXT_PUBLIC_GA_ID` — si la variable no está
  seteada, no renderiza nada (no rompe build ni local). Corre además
  de Cloudflare Analytics (que sigue sin activar, ver nota abajo).
- Brey eligió GA4 en vez de migrar el DNS del dominio a Cloudflare para
  tener Cloudflare Analytics — **hallazgo de esta ronda:**
  `aromialab.com` no está agregado como zona en la cuenta de
  Cloudflare de Brey (usa los nameservers del registrador,
  `registrar-servers.com`, típico de Namecheap). Verificado con
  `nslookup -type=NS`. Cloudflare Analytics sigue sin activar — solo
  se puede si en algún momento se decide migrar el DNS del dominio,
  que es un cambio de infraestructura real (afecta todo el sitio v1 en
  producción), no algo a resolver de paso por una métrica del admin.

### SendGrid (envío real de newsletter)
- Nuevo: `apps/api/src/lib/email.ts` — envía un email de bienvenida vía
  la API REST de SendGrid (`fetch` directo, sin SDK nueva como
  dependencia) cuando `SENDGRID_API_KEY` y `SENDGRID_FROM_EMAIL` están
  seteadas; si no, no hace nada (no rompe el flujo de suscripción).
  `apps/api/src/routes/subscribers.ts` ahora dispara el email solo en
  altas nuevas (`RETURNING id` para detectar inserts reales vs.
  `ON CONFLICT DO NOTHING`), y el error de envío se loguea sin romper
  la respuesta 201 al usuario.

### Pendiente, explícitamente no resuelto en esta ronda
- Cowork: Brey confirmó reactivarlo — no se coordinó todavía en este
  repo, es una acción pendiente de la próxima sesión.
- OVL Sprint 2: sigue en stand-by, sin pedido explícito de retomarlo.
- Credenciales de Cloudflare: no se generó token (no hay zona que
  proteger todavía, ver nota de GA4 arriba).

## 2026-07-18 (3) — Code

Cowork entregó dos artefactos (contenido de Academia + investigación de
scraper de precios), Brey los aprobó, Code los subió y los construyó.

### Academia — 4 artículos nuevos
- Nuevo: `articles/academia-historia-de-la-perfumeria.md`,
  `academia-piramide-olfativa.md`, `academia-familias-olfativas.md`,
  `academia-concentraciones-perfume.md` — contenido migrado de
  `academia.html` (v1), con los datos y cifras del original preservados
  tal cual y el desarrollo expandido para SEO. El componente de
  "ingredientes interactivos" de v1 quedó fuera a propósito (es JS, no
  contenido). Copiados también a `apps/api/data/articles/` (mismo patrón
  que el resto del catálogo, por el root directory acotado del build de
  Railway) y sembrados en la Postgres de producción — verificados en
  `/articulos/academia-*` con 200 en las 4 rutas.
- Nuevo: mapeo `guia_educativa → academia` en `seedArticles.ts` — la
  categoría `academia` ya existía en el `CHECK` de la tabla `articles`
  desde `006_create_articles.sql`, sin usar hasta ahora. No hizo falta
  migración de esquema, solo el mapeo.
- Redirects activados: `/academia.html` → `/articulos` (hub, la página
  original cubría las 4 secciones a la vez) y
  `/piramide-olfativa-explicada.html` → `/articulos/academia-piramide-olfativa`
  (mejorado de un redirect genérico al hub a uno directo, ahora que existe
  contenido real equivalente).

### Scraper de precios — scaffold técnico de la Fase 2 (Douglas, Primor)
- Investigación previa (research, sin código) de todo el universo de
  programas de afiliados de perfumería más allá de los 4 ya identificados
  — Perfume's Club (Tradedoubler), Douglas (Awin), Primor (Awin), Ulta,
  FragranceX, FragranceNet, Perfumania, Scentbird, Twisted Lily,
  Luckyscent — con fases de rollout y frecuencia de sync recomendada
  (diaria, vía product feed de cada red en vez de scraping HTML directo;
  Amazon aparte por el rate limit de su PA-API). Aprobado por Brey.
- Nuevo: `apps/api/src/scraper/` — `types.ts`, `feeds/awin.ts` (parser
  CSV del datafeed estándar de Awin, formato documentado públicamente),
  `feeds/tradedoubler.ts` (stub explícito, sin activar — el formato del
  feed de Perfume's Club no está confirmado sin credenciales reales de
  afiliado), `matcher.ts` (matching de producto de feed → perfume del
  catálogo por marca exacta + solapamiento de tokens del nombre, vía
  `\p{Diacritic}` para normalizar acentos), `sync.ts` (upsert en
  `retailers`, log en `activity_log`), `runner.ts` (orquesta las
  configs activas y registra el cron).
- Nuevo: `apps/api/migrations/008_add_retailer_sync_columns.sql` —
  agrega `fuente` (default `'manual'`) y `sincronizado_en` a `retailers`,
  con un índice único parcial que excluye `fuente='manual'`. El scraper
  solo hace upsert sobre sus propias filas (`fuente='awin_douglas'`,
  etc.) — nunca toca ni borra lo que un admin cargó a mano. Aplicada a
  producción.
- Nuevo: `POST /api/admin/scraper/run` — disparo manual del sync para
  probar sin esperar al cron. Cron diario a las 06:00 vía `node-cron`,
  registrado solo si `AWIN_API_TOKEN` + `AWIN_MERCHANT_ID_DOUGLAS`/
  `AWIN_MERCHANT_ID_PRIMOR` están seteados — mismo patrón no-op que
  SendGrid/GA4, sin credenciales no rompe nada. Verificado en producción:
  el endpoint responde 200 con `results: []` sin credenciales
  configuradas.
- **Pendiente, no delegable a Code:** Brey tiene que registrarse como
  afiliado en Awin para Douglas y Primor (y en Tradedoubler para
  Perfume's Club, cuando se active esa fase) — Code no puede crear esas
  cuentas. Una vez con las credenciales, hay que validar la URL exacta
  del datafeed de Awin y el formato real del feed de Tradedoubler contra
  cuentas reales antes de dejar correr el cron en serio.

## 2026-07-18 (3) — Code
- `link_afiliado`: completados los 50/50 perfumes en Postgres de
  producción y en `PERFUMES_INITIAL_50.csv` (raíz + `apps/api/data/`,
  se mantienen idénticos). Auditoría contra `catalogo.html` de v1
  (rama `main`) identificó 24 perfumes con ASIN real (link directo
  `amazon.com/dp/{ASIN}?tag=aromialab-20`) y 26 sin equivalente en v1
  o sin ASIN identificado (Santal 33 incluido), a los que se les generó
  un link de búsqueda `amazon.com/s?k={nombre}+{marca}&tag=aromialab-20`
  — mismo patrón de fallback que ya usaba v1. Verificado con query
  directa: 0 filas en placeholder, 24 con `/dp/`, 26 con `/s?k=`.
- Con esto, `link_afiliado` deja de depender de que Brey busque nada
  a mano — era uno de los bloqueantes documentados para el corte de
  dominio (decisión #49 de `ESTADO-aromia.md`), que sigue sin
  ejecutarse hasta confirmación explícita de Brey en el chat.

## 2026-07-19/20 — Code
- **Corte de dominio ejecutado**: `aromialab.com` y `www.aromialab.com`
  apuntan a Railway/2.0 (dominios custom agregados al servicio `web`,
  DNS actualizado por Brey en Namecheap, certificados TLS válidos).
  GitHub Pages/v1 queda fuera de la ruta de ese dominio. Verificado:
  rutas principales en 200, redirects v1→v2 funcionando en el dominio
  real (`/catalogo.html` → 308 → `/perfumes`).
- Bug encontrado post-corte y corregido: `sitemap.xml`/`robots.txt`
  caían a `http://localhost:3000` porque `NEXT_PUBLIC_SITE_URL` nunca
  llegaba al build de Railway (var `NEXT_PUBLIC_` sin build-arg en el
  Dockerfile — mismo patrón que el bug ya conocido de
  `NEXT_PUBLIC_API_URL`). Corregido: build-arg agregado, variable
  seteada en Railway, redeploy verificado.
- `imagen_url`: completadas 24/50 con foto real de producto extraída
  de `m.media-amazon.com` (misma convención de v1, documentada en
  `docs/CURSO-PERSONAL-BREY.md` y en la herramienta manual
  `admin/imagenes.html`) para los perfumes con ASIN confirmado.
  Scraping directo con `curl` está bloqueado por la detección de bots
  de Amazon (no se intentó sortear); se usó el Browser pane (sesión de
  navegador real) para extraer `hiRes` del bloque de imágenes de cada
  página de producto, igual que haría un humano copiando la URL a
  mano. Aplicado a Postgres de producción y a ambas copias del CSV.
  Quedan 26/50 sin imagen real — no tienen equivalente de producto en
  Amazon (mismo set que ya usa fallback de búsqueda en
  `link_afiliado`); las imágenes generadas por IA en
  `OVL_Prompt_50` no se usan para estas miniaturas por decisión de
  producto (esas son para otro uso, ver `ESTADO-aromia.md`) — fuente
  para esas 26 sigue sin definir, pendiente de Brey.
