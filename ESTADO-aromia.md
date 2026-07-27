# Estado del proyecto: Aromia
Última actualización: 25 de julio de 2026 — por: Chat (auditoría visual completa del catálogo, cierre del pareo OVL a 38/38, 2 bugs reales de imagen corregidos en producción)
Nivel: **Producto**, dentro del sistema **Atlas Comerce** (ver `ESTADO-atlas-comerce.md`, Project Atlas-Comerce-Lab)

---

## 1. Objetivo del proyecto

Aromia es un sitio de reseñas de perfumes con monetización por afiliados (Amazon, con Notino/Druni/Sephora en evaluación). Corre en dos versiones en paralelo:

- **Aromia 1.0** — sitio estático HTML, rama `main`. **Dejó de ser el sitio en vivo el 19-20/07** (ver decisión #64) — sigue existiendo en GitHub Pages pero `aromialab.com` ya no apunta ahí.
- **Aromia 2.0** — reconstrucción completa en Next.js 14 + Express + Postgres + Redis, rama `feature/v2.0`. **Es el sitio en producción real desde el 19-20/07**: corte de dominio ejecutado, `aromialab.com` y `www.aromialab.com` apuntan a Railway (`web-production-71f88.up.railway.app` detrás del dominio custom), DNS a cargo de Brey en Namecheap, certificados TLS válidos.

---

## 2. Alcance actual (qué SÍ, qué NO)

**Sí:**
- 1.0 debe seguir funcionando y generando ingresos mientras se construye 2.0 — sin downtime significativo.
- 2.0: comparador interactivo, panel de administración, página de producto ("Anatomía de una fragancia"), catálogo con scroll infinito, magazine con hojeo interactivo y descarga PDF, home, listado de perfumes y quiz de matching.
- Analítica web: Cloudflare Web Analytics instalado en 1.0. GA4 en evaluación (pendiente, ver sección 13).
- Image Toolkit (herramienta genérica externa) para procesamiento de fotos/mockups — actualmente usado vía ChatGPT Plus manual, no vía API/n8n, para mantener costo cero.
- Copy en español: **neutro, sin voseo argentino** (ver decisión #32).

**No:**
- Venta directa de perfumes (no carrito, no pagos, no checkout) — Aromia es curación + afiliados.
- Automatización de generación de imágenes (n8n/API) hasta que Aromia genere ingresos reales.
- Cowork activo con tareas puntuales y alcance acotado (decisiones #55, #57-58) — no es coordinación abierta, no tiene push directo al repo.
- Decants (decisión #57): no arranca todavía, bloqueado hasta que Brey apruebe el research (decisión #58).
- El Magazine público (`/articulos/`) ya está construido — lo único fuera de alcance es el hojeo interactivo + descarga PDF del mockup original `/magazine`.

---

## 3. Decisiones tomadas

| # | Decisión | Tomada por |
|---|---|---|
| 1 | Aromia es un producto dentro del sistema Atlas Comerce, no un proyecto aislado | Brey |
| 2-12 | Historial de decisiones de arquitectura y stack de la fase de diseño inicial (rama separada para 2.0, redirects pendientes, stack Next.js 14 + Tailwind + Node/Express + Postgres + Redis, hosting Vercel/Railway) — ver detalle en versión anterior de este documento si hace falta el razonamiento completo | Chat / Cowork |
| 13-14 | Flujo de trabajo en fases (Cowork↔Code) definido y luego ampliado a sistema de Sprint 1 con entregables concretos (CSV de 50 perfumes, artículos, quiz, `CLAUDE.md` técnico) | Cowork |
| 15-16 | Sistema **OVL (Olfactory Visual Language)** definido: motor de dirección creativa que convierte metadata de perfumes en Blueprint → imagen + paquete editorial. Vive dentro de Aromia (no como herramienta genérica), con 5 Skills candidatas a generalizar en el futuro | Brey / Chat |
| 17 | Spike de validación de OVL corrido (12 jul) con Gemini/ImageFX gratuito: pipeline conceptual validado, calidad de pixel por debajo de referencia pero aceptable como piso | Brey / Chat |
| 18 | Criterio confirmado: se pasa a modelo de imagen pago (y cualquier herramienta de pago) **solo cuando Aromia genere ingresos reales** | Brey |
| 19 | Sprint 1 de Cowork cerrado — CSV de 50 perfumes (`PERFUMES_INITIAL_50.csv`) confirmado como entregable real, ya no solo plan | Cowork |
| 20 | Timeline con fechas fijas descartado — se avanza a la siguiente fase/sprint tan pronto termina la actual, sin atarse a calendario | Brey |
| 21 | ChatGPT Plus se usa para diseño UI/UX de 2.0, una sección a la vez, siempre con un párrafo explícito de límite de alcance en el brief ("trabaja únicamente con esto, no propongas cambios de arquitectura") — sin ese párrafo tiende a expandirse (pasó con el Panel Admin) | Brey |
| 22 | ChatGPT solo diseña, nunca decide mecánica interna/arquitectura — eso lo resuelve el equipo (Brey + Code + Claude) | Brey |
| 23 | Regla de revisión: siempre comparar el HTML/código real entregado contra la especificación escrita, porque las capturas que muestra ChatGPT en el chat a veces no coinciden con el archivo final exportado | Brey |
| 24 | Nueva arquitectura de ramas: se agrega `design/ui-ux` (sale desde `feature/v2.0`, no desde `main`). Orden de merge: `design/ui-ux` → `feature/v2.0` → `main` | Code |
| 25 | Cloudflare Web Analytics instalado en Aromia 1.0 (token real entregado a Code) | Brey / Code |
| 26 | Imagen de portada editorial generada con IA para Erba Pura, integrada en "Anatomía de una fragancia" — prueba piloto puntual en un solo producto | Brey |
| 27 | 4 piezas de diseño de 2.0 completadas (mockups + specs, revisadas y aprobadas) y entregadas a Code para implementar: Panel de Administración, Página de Producto, Catálogo, Magazine | Brey (diseño) → Code (implementación) |
| 28 | Roadmap futuro "Visión Panel v2" documentado pero sin bloquear nada: Service Accounts múltiples, módulo de Assets, Comparador con motor de reglas propio, multi-retailer automático, CMS modular, modelo de "entidades" | Brey |
| 29 | Panel de Administración, Página de Producto, Home, listado de perfumes y Quiz de matching implementados y verificados por Code en navegador local (sin deploy a Railway todavía) — ver sección 6 | Code |
| 30 | Auditoría de contraste WCAG AA aplicada al sistema de diseño dorado del mockup (insuficiente para texto, ~2.8–3.1:1): se agregó `--gold-contrast` para texto/botones y `admin-success-text`/`admin-warning-text` para badges de estado | Code |
| 31 | Bug de datos corregido: la API pública de perfumes (`GET /api/perfumes`, `GET /api/perfumes/:slug`) no filtraba por `estado`, exponiendo perfumes en borrador antes de publicarlos | Code |
| 32 | El copy en español de Aromia (chat y sitio) debe ser **neutro, sin voseo argentino** — se detectó voseo colado en el quiz/home por traducir casi textual un documento fuente de Cowork (`COPY/quiz-questions.md`) escrito en voseo; corregido | Brey |
| 33 | El Catálogo (`/catalogo`, scroll infinito + tarjeta "Perfume del mes") y el Magazine público (`/magazine`) del mockup del 16/07 **no se implementaron** en el batch del 17/07 — se construyó un `/perfumes` más simple (filtros, sin scroll infinito ni tarjeta editorial) en su lugar. Pendiente confirmar con Brey si alcanza o se retoma el mockup original | Code |
| 34 | `ESTADO-aromia.md` pasa a vivir en la raíz del repo (antes se manejaba fuera, en Descargas) | Brey |
| 35 | Catálogo: el `/perfumes` simple ya implementado **queda como versión final** — no se retoma el mockup original de `/catalogo` (scroll infinito + tarjeta "Perfume del mes"). Magazine público (`/articulos/`) pasa a ser la **siguiente prioridad** de construcción | Brey |
| 36 | Deploy a Railway del trabajo pendiente (Panel Admin, Página de Producto, Home/listado/Quiz, y ahora Magazine) se hace **al finalizar el plan completo** que Code está armando (ver decisión #29 de la sesión anterior) — no en entregas parciales | Brey |
| 37 | Modo híbrido de modelo para el plan completo que arma Code: se usa el alias nativo de Claude Code **`opusplan`** (`/model opusplan`) — Opus mientras está en modo plan (arquitectura, decisiones difíciles), cambia automáticamente a Sonnet en modo ejecución (código). No requiere cambio manual de modelo en ningún momento | Chat |
| 38 | Magazine público construido reusando la tabla `articles` del admin en vez de parsear los `.md` aparte — no existía ninguna ruta pública para leerla; single source of truth entre admin y sitio público | Code |
| 39 | Plan de convergencia completo ejecutado y **deployado a producción real** (no solo local) — incluyó corregir 3 problemas de infraestructura no documentados hasta el intento de deploy real: target port de Railway pegado en un typo histórico, secrets de admin inexistentes en producción, y migraciones `002`-`007` nunca aplicadas a la Postgres de producción | Code |
| 40 | Deploy a Railway confirmado como automático en cada push a `feature/v2.0` (Railway ya estaba configurado así desde el 15/07) — no hace falta accionarlo a mano, contradice el supuesto de la decisión #36 de que había que esperar al final del plan | Code |
| 41 | Aromia todavía no genera ingresos reales — mientras eso no cambie, cualquier decisión que no implique gasto adicional (ej. GA4, que es gratis) se aprueba sin más análisis de costo/beneficio | Brey |
| 42 | Redirects v1→v2 confirmados y activados: reseñas sin artículo propio van a su comparativa equivalente donde exista (Sauvage/Bleu de Chanel, Black Opium/Good Girl, Aventus), el resto sin comparativa va a la ficha de producto, y los artículos sin ningún destino razonable van al hub `/articulos` en vez de 404 | Brey |
| 43 | `/lab.html` (armador de quiz v1) redirige a `/quiz` — se acepta el reemplazo de UX | Brey |
| 44 | `/club.html` no se recrea todavía — sin redirect por ahora, queda pendiente de diseño futuro | Brey |
| 45 | `/academia.html` no redirige todavía — se prioriza escribir contenido de categoría `academia` antes de activar el redirect (hoy 0 artículos la usan) | Brey |
| 46 | Deep-links `/catalogo.html?p=ID` (perfume por ID numérico de v1) no se preservan — no vale la pena reconstruir el mapeo ID→slug | Brey |
| 47 | `/privacidad` creada en v2 (gap real: v1 la tenía, v2 no tenía ninguna) — adaptación de `privacidad.html` al sistema de diseño nuevo, antes del corte de dominio | Brey |
| 48 | Se usa **Google Analytics 4** en vez de migrar el DNS de `aromialab.com` a Cloudflare para tener Cloudflare Analytics — el dominio hoy usa los nameservers del registrador (Namecheap), no está en Cloudflare como zona. Migrar DNS es un cambio de infraestructura real que afecta todo el sitio v1 en producción; se evalúa junto con el corte de dominio real, no antes | Code (recomendación) / Brey (confirmación) |
| 49 | Corte de dominio real (`aromialab.com` de GitHub Pages/v1 a Railway/v2): se evalúa **después de cerrar el resto de la Pista B**, no ahora | Brey |
| 50 | Proveedor de newsletter: **SendGrid** — integrado vía API REST directa (sin SDK como dependencia nueva), envía email de bienvenida solo en altas nuevas, sin romper el flujo si `SENDGRID_API_KEY` no está seteada | Brey |
| 51 | Scraper de precios: Brey pidió acotar alcance (retailers, frecuencia) — **todavía sin definir**, sigue pendiente | Brey |
| 52 | Cowork se reactiva — coordinación pendiente, no ocurrió todavía en este repo | Brey |
| 53 | GA4 sí, además de Cloudflare Analytics cuando esté disponible | Brey |
| 54 | `/club.html` se recrea ahora — versión simple de v1 (página "Próximamente" + lista de espera), reusando el mecanismo de captura de email ya construido en 2.0. Tarea directa de Code, no de Cowork. **Cerrada 18/07**: `/club` nueva, redirect `/club.html → /club` (308) activo, migración `009` aplicada, suscripción con `fuente='club'` probada de punta a punta en producción y limpiada | Brey → Code |
| 55 | Academia: contenido de `academia.html` (v1) migrado a 4 artículos `.md` nuevos en 2.0, escritos directamente por Code (sin sesión de Cowork disponible en ese momento) a partir del mismo brief que se le habría dado a Cowork — límite de alcance explícito respetado (sin cambios de arquitectura/schema). `tipo: guia_educativa` mapeado a `categoria: "academia"`, que ya existía en el CHECK de `articles` — sin migración necesaria. Commiteado, sembrado en Postgres de producción, redirects `/academia.html` y `/piramide-olfativa-explicada.html` activos y verificados (200 en las 4 rutas nuevas) | Code |
| 56 | Scraper de precios, Fase 2 — scaffold técnico armado y deployado (no-op sin credenciales): integración de feed Awin (CSV), matcher de producto→perfume por marca+similitud de texto, job de sync con upsert seguro (no pisa filas cargadas a mano), ruta admin para trigger manual, cron diario gateado por variables de entorno. Configurado para **Douglas + Primor** vía Awin. Migración `008` (columnas `fuente`/`sincronizado_en` + índice parcial en `retailers`) aplicada a producción. Falta que Brey se dé de alta como afiliado en Awin — Code no puede crear esa cuenta (acción prohibida de autonomía) | Code |
| 57 | Nueva feature (no arrancada todavía): **decants** (muestras/fracciones de perfume). Ubicación: bloque secundario en `/perfumes/[slug]`, debajo de la tabla de precios de retailers — no en nav, no como filtro de catálogo. Piloto en 5-8 perfumes de nicho caros, no los 33. Investigación de casas de decants con afiliados delegada a Cowork. Cuando el research esté aprobado, Code debe confirmar si conviene reusar la tabla `retailers` (migración `003`) con un campo que distinga `frasco_completo` vs `decant`, en vez de crear una tabla nueva — decisión técnica pendiente, no asumida | Brey |
| 58 | Research de decants entregado (vía Chat/Cowork, sesión paralela sin acceso directo al repo): 3 casas evaluadas — **Scent Split**, **Scent Decant**, **Scentbird** — con cobertura del piloto de 8 perfumes y datos de comisión/cookie marcados como verificados o no según la fuente. Sin recomendación forzada, Brey decide. Pendiente puntual antes de dar por buena la cobertura de Scentbird: confirmar si "Delina" y "Delina Exclusif" son el mismo producto en el catálogo de Aromia. Bloqueado por decisión #57 — no se implementa hasta aprobación de Brey | Cowork/Chat (propuesta) |
| 59 | Reconciliación de documentación: durante la sesión del 18/07 circularon varias copias paralelas de `ESTADO-aromia.md` generadas fuera de este repo (por Cowork y por Chat, cada uno sin ver el trabajo del otro ni el de Code), con numeración de decisiones distinta entre sí y desactualizada respecto al repo real. Todas describían Academia/scraper/club.html como "pendiente de subir" cuando ya estaban commiteados y deployados. El plan de "renombrar `index_v2.html` a `index.html`" (decisión relacionada a ratings de Amazon en 1.0) quedó superado: Code detectó que `index.html` no tiene datos embebidos desde el redesign del 13/07 (los datos viven en `catalogo.html`) y aplicó ahí los campos correctos — ver `CHANGELOG-1.0.md`, commit `f7a9db2` en `main`. Es posible que exista un segundo set de artículos de Academia (`ACADEM_1.MD`–`4.MD`) de una sesión de Cowork en paralelo — redundante con lo ya sembrado por Code (decisión #55), sin acción necesaria salvo que Brey quiera comparar calidad de contenido. Este documento (`ESTADO-aromia.md`, en `feature/v2.0`) sigue siendo la copia canónica — decisión #34 | Code |
| 60 | Chat verificó de forma independiente (no tomó la afirmación por cierta) el hallazgo central de la decisión #59: confirmado contra el HTML real de `main` que `catalogo.html` tiene 31 campos `amzRating` y `index.html` tiene 0 — el hallazgo de Code es correcto, no es otra afirmación falsa como las que circularon en las sesiones paralelas ese mismo día | Chat |
| 61 | Conflicto sin resolver, señalado por Code: el scaffold del scraper ya deployado (decisión #56) apunta a **Douglas + Primor** vía Awin, pero la investigación de afiliados más reciente de Cowork (documento entregado a Chat, no visto por Code al construir el scaffold) recomienda **Douglas + Perfumes Club** para la Fase 1 y no menciona Primor en ningún lado. Recomendación de Chat, no decisión: mantener Douglas + Primor tal como ya está construido y deployado, y sumar Perfumes Club como ampliación en vez de descartar trabajo ya hecho — pero es de Brey confirmar, no se asume | Code (hallazgo) / Chat (recomendación, sin confirmar) |
| 62 | Corrección repetida: `feature/2.0` volvió a aparecer en vez de `feature/v2.0` en este documento (ya se había corregido antes, decisión #57 de una sesión anterior) — se perdió porque una sesión de Cowork reconstruyó el documento desde una copia vieja sin la corrección. Vuelto a corregir. Evidencia directa del problema de coordinación resuelto en la decisión #63 | Chat |
| 63 | **Protocolo de coordinación multi-sesión sobre la carpeta local compartida** (`C:\Users\user\Claude\Projects\aromia-lab`), tras confirmarse que Code y Cowork ya trabajan sobre el mismo working tree: (1) Chat **no tiene ni puede tener acceso** a esa carpeta — corre en sandbox aislado, sigue trabajando por lectura pública de GitHub y por archivos subidos al chat; (2) **una sola sesión de Cowork/Code a la vez sobre el repo compartido** — no abrir sesiones paralelas de Cowork que puedan reconciliar el mismo archivo sin verse entre sí (causa raíz del caos del 18/07); (3) **git commit/push queda exclusivo de Code** — Cowork puede leer/escribir archivos en la carpeta, pero no debe commitear ni pushear por su cuenta, para evitar commits divergentes de sesiones que no se vieron entre sí; (4) toda sesión que reporte algo como "pendiente" o "faltante" debe **verificarlo con un comando real contra el repo** (`git status`, `git log`, leer el archivo) antes de reportarlo — no inferir ni asumir, como ya se exigía en el protocolo de investigación de Cowork (documentos `RESEAR_1.MD`/`RECOME_1.MD`) | Brey / Chat |
| 64 | **Corte de dominio real ejecutado** (`aromialab.com`/`www.aromialab.com` de GitHub Pages/v1 a Railway/v2): dominios custom agregados al servicio `web` de Railway, DNS actualizado por Brey en Namecheap, certificados TLS válidos. Ya no queda pendiente la decisión #49 — 2.0 es el sitio en vivo | Brey (DNS) / Code (Railway) |
| 65 | Bug post-corte corregido: `sitemap.xml`/`robots.txt` caían a `http://localhost:3000` porque `NEXT_PUBLIC_SITE_URL` nunca llegaba al build de Railway (variable `NEXT_PUBLIC_` sin build-arg en el Dockerfile, mismo patrón que el bug ya conocido de `NEXT_PUBLIC_API_URL`) | Code |
| 66 | `link_afiliado` completado 50/50 en Postgres de producción y en el CSV (raíz + `apps/api/data/`): 24 perfumes con ASIN real de Amazon (link directo `/dp/{ASIN}`), 26 sin equivalente confirmado en Amazon, con link de búsqueda de fallback (mismo patrón que ya usaba v1) | Code |
| 67 | `imagen_url`: 24/50 con foto real de producto extraída de `m.media-amazon.com` (vía Browser pane — `curl` directo bloqueado por detección de bots de Amazon). Quedan 26/50 sin imagen real por no tener equivalente confirmado en Amazon (mismo set que la decisión #66). Las imágenes de IA de `OVL_Prompt_50` **no se usan** para estas miniaturas de catálogo — son para otro uso (editorial). Fuente para esas 26 sigue sin definir — ver sección 13 | Code |
| 68 | `.gitattributes` agregado en ambas ramas (`main` y `feature/v2.0`) para fijar line endings a LF, evitando diffs espurios entre sesiones en Windows | Code |
| 69 | Fuente de imagen para los 26 perfumes sin foto real de Amazon: **enfoque mixto** — Code intenta Notino/Douglas/FragranceX perfume por perfume (mismos retailers ya investigados para el scraper de precios); los que tampoco aparezcan ahí quedan en placeholder sin insistir más. No se usan las imágenes de `OVL_Prompt_50` (son para otro uso, editorial) | Brey |
| 70 | Ejecutado 21/07: de los 26 pendientes, **14 resueltos** (11 vía Notino, 3 vía Douglas) y **12 siguen en placeholder** (Le Labo x2, Frederic Malle x2, Creed x2, Aesop, Chanel, Dior Maison, Mugler, Ariana Grande, Tom Ford "Fucking Beautiful") — houses de nicho o marcas de lujo restringidas en retailers de descuento, sin ficha en ninguno de los 3 sitios en el primer intento. Aplicado a Postgres de producción (verificado en el dominio real) y a ambas copias del CSV | Code |
| 71 | **No quedan perfumes sin imagen real en el catálogo**: los 12 sin foto de la decisión #70 se eliminaron del catálogo (fila de `perfumes` en Postgres de producción + CSV), no solo se dejaron en placeholder. `retailers` asociados cayeron en cascada (FK `ON DELETE CASCADE`, migración `003`). Catálogo pasa de 50 a **38 perfumes**. Verificado sin referencias rotas (redirects, quiz) antes de borrar | Brey |
| 72 | El mockup original de `/magazine` (hojeo interactivo + descarga PDF), marcado como "no construido — decisión de alcance" en la decisión #33, **se construyó** el 21/07 a partir de mockup + especificación entregados por Brey (`aromia-magazine-mockup.html`, `aromia-magazine-especificacion.md`). Reutiliza la misma tabla `articles` que ya usaba `/articulos` — **`/articulos` no se tocó ni se redirigió**, la especificación no lo pidió; queda una coexistencia sin resolver entre ambas rutas públicas de magazine (ver sección 13) | Brey (spec) / Code (implementación) |
| 73 | **`/magazine` reemplaza a `/articulos`** — cierra la coexistencia de la decisión #72. `/articulos` se da de baja como ruta propia (código eliminado) y pasa a redirect 308 (`/articulos` → `/magazine`, `/articulos/:slug` → `/magazine/:slug`); todos los redirects de v1 que apuntaban a `/articulos/...` se actualizaron a `/magazine/...` directo. `NavBar`/`Footer`/`sitemap.ts` actualizados | Brey |
| 74 | Fix de dato: `link_afiliado` de Le Male apuntaba al ASIN de la flanker "Le Male Aviator", no al clásico — corregido en Postgres de producción y ambas copias del CSV | Chat |
| 75 | Fix de bug real (no cosmético): el banner "atmósfera editorial" de la ficha de producto (`EditorialMood.tsx`) elegía la imagen narrativa OVL por hash del slug, mostrando en producción el mockup de **otro perfume** — reemplazado por mapeo real 1:1 verificado contra los 50 prompts originales. **34/38 perfumes activos** con mockup propio confirmado; los 4 sin match de alta confianza (Molecule 01, Flowerbomb, Terre d'Hermes, Erba Pura) muestran placeholder neutro en vez de un frasco incorrecto — regla explícita del ticket, no hay excepción por perfume | Chat |
| 76 | Autocrop real de miniaturas de producto (`PerfumeCard.tsx`) vía análisis de píxeles en `<canvas>` (bounding box de contenido real + `background-size`/`background-position`), reemplazando `object-contain`/`object-cover` que dejaban márgenes blancos desiguales heredados de cada retailer. Aplica a Home, Catálogo y resultado de Quiz | Chat |
| 77 | Admin puede fijar `imagen_url` pegando una URL externa directa, no solo por upload de archivo — corrige un bug real donde el upload guardaba una ruta relativa (`/uploads/...`) sin prefijo de origen de API, quedando rota en producción | Chat |
| 78 | Abierto, sin decidir: `CommunityReviews.tsx` usa rating + reseña cargados a mano por el admin, no datos reales de reseñas de Amazon como pide el ticket de ficha de producto — señalado a Brey, no resuelto unilateralmente | Chat (hallazgo) |
| 79 | **Auditoría visual completa** de los 38 perfumes activos contra `Aromia_Visual_Identification_Catalog_Detailed.pdf` (36/38 tienen ficha en el PDF): 25/36 ✅, 9/36 ⚠️ (imprecisiones de la ficha de referencia, no bugs), **2/36 ❌ bugs reales**: Le Male (foto y ASIN seguían apuntando al flanker "Aviator" — el fix del 24/07 solo había tocado el CSV, nunca la base de producción) y La Vie Est Belle (foto era del envase de recarga, no del frasco de venta). Ambos corregidos directo en Postgres de producción vía la API admin, verificados contra la página real de Amazon/Notino antes de aplicar | Chat |
| 80 | **Pareo OVL cerrado a 38/38 perfumes activos** — los 4 que quedaban en placeholder neutro (Molecule 01, Terre d'Hermès, Erba Pura, Flowerbomb) se resolvieron por una vía separada de Brey (foto real con fondo removido, compuesta sobre el mismo degradé que los otros 34), verificados contra el producto real e integrados a `apps/web/public/ovl/` | Brey (mockups) / Chat (integración) |
| 81 | Pendiente, sin aplicar todavía: Brey decidió que el fondo de ambientación de los mockups OVL debería pasar de degradé fijo (`--stone`→`--gold-300`) a blanco sólido (tema claro) / negro sólido (tema oscuro) — no se tocó el set actual (38 imágenes), queda como criterio para una futura regeneración si se decide unificar todo el set | Brey |
| 82 | **Grafito e Ivorio (prototipo `Aromia_Layton_variantes_visuales.zip`, ticket "Adaptar variante visual") no son dos propuestas entre las que elegir — son las versiones dark/light del mismo sistema de diseño.** Implementado como toggle de tema real (`ThemeToggle.tsx`, persistido en `localStorage` bajo `aromia_theme`, atributo `data-theme` en `<html>`) sobre la infraestructura de tokens `data-theme`/CSS vars que ya existía en el repo (creada en una sesión previa pero sin componente de toggle). De paso: reglas de imagen (`object-contain` + `aspect-ratio` fijo por rol, nunca recorte de producto), sistema de nav de 3 niveles (CTA primario/secundario ya resueltos con `Button`; nav superior/footer pasan de solo-hover a subrayado animado + `focus-visible`, antes inexistente — bloqueante de accesibilidad de teclado), y tipografía Archivo (reemplaza a Jost) + IBM Plex Sans agregadas. Documentado en `GUIA-VISUAL-aromia.md`, nuevo en la raíz del repo | Brey (ticket) / Chat (implementación) |
| 83 | **Corrección a la decisión #82**: el primer pase solo cubrió el sistema transversal (toggle, tokens de imagen, nav, fuentes) — Brey señaló con captura que el layout real de las pantallas seguía sin adaptarse a la plantilla (Home seguía siendo una sola columna sin imagen, sin las secciones del mockup). Confirmado alcance con Brey: "todo el sitio". Reescrita la **Home** (hero de dos columnas con escena editorial, "Reseñas destacadas" con rating real, chips de familia olfativa que pre-filtran `/catalogo?familia=`, banner de Magazine con el último artículo real, banner de Club) y ajustes de consistencia en **Catálogo** (chips de familia arriba del grid, ya no solo el select) y **Quiz** (opciones en grid de 2 columnas como la plantilla). Ficha de producto, Magazine y Academia revisados: ya usaban el sistema de diseño/tokens correctamente de sesiones previas, sin cambios de layout necesarios más allá de las reglas de imagen ya aplicadas en la decisión #82 | Brey (corrección) / Chat (implementación) |
| 84 | **Fix real (no cosmético) del banner editorial de ficha de producto** (`EditorialMood.tsx`): la regla de imagen de la decisión #82 (nunca recortar, `object-contain` + `aspect-ratio` 16:10) dejaba barras sólidas del color de fondo cuando la imagen OVL no era nativamente 16:10 (ej. Acqua di Gio EDT) — señalado por Brey con captura. Resuelto con el patrón "blurred backdrop" (Spotify/Apple Music): una copia desenfocada y agrandada de la MISMA imagen llena el marco de fondo (`object-cover`, puramente decorativa, sí puede recortarse), la imagen nítida sigue sin tocarse encima. La regla de "nunca recortar el producto" sigue vigente — lo que cambia es qué llena el espacio remanente | Brey (hallazgo) / Chat (fix) |
| 85 | **Importados dos diseños de Claude Design** (proyectos "Adapta página a plantillas" y "Diseño web tienda perfumes", vía `.zip` adjuntos por Brey) para adaptar Magazine y el bloque de rendimiento/pirámide de la ficha de producto: <br>— **Magazine**: dos variantes de portada disponibles (1A "Reseña Destacada", 1B "Manifiesto Editorial") — Brey previsualizó ambas en un artifact comparativo y eligió **1B**. Implementado en `MagazineHub.tsx`/`MagazineCoverStory.tsx`/`MagazineSecondaryStory.tsx`: bloque de marca fijo + foto de portada con tarjeta de reseña superpuesta + lista compacta de "últimas historias", con datos reales de `getArticulos()` (no el copy de muestra del diseño). <br>— **Ficha de producto**: el diseño no tenía una página "Lab" separada — el contenido relevante está en la sección "El Estudio · Lab Aromia" del archivo `Aromia.dc.html`. `OlfactiveRadar.tsx` (gráfico Recharts triangular, sin datos reales para la mayoría del catálogo) reemplazado por `PerformanceBars.tsx` (barras horizontales de Longevidad/Estela/Proyección, mismo patrón visual que "Rendimiento en piel" del diseño). `SkinEvolution.tsx` adaptado al patrón de "Pirámide olfativa" del diseño: bandas clicleables de ancho creciente (salida→corazón→fondo) con descripción + notas reales por nivel, en vez de 3 tarjetas con hover. **No implementado a propósito**: el radar de 6 ejes "carácter del aroma" (Especiado/Amaderado/Cálido/Floral/Cítrico/Dulce) y la barra "Precio-valor" del diseño original usan valores inventados/hardcodeados que no existen como dato real en la base de Aromia — se omitieron en vez de fabricar datos falsos | Brey (diseño) / Chat (implementación, con criterio propio sobre qué datos son reales) |

---

## 4. Roles del equipo

| Rol | Persona | Hace | No hace |
|---|---|---|---|
| Diseño + Producto | Brey | UI/UX, contenido, decisiones de producto, revisa staging | No pushea a GitHub |
| Desarrollo | Code (Melvin) | Implementa, despliega, resuelve Git | No toca `main` directamente |
| Guía técnica | Claude (Chat) | Conceptos, arquitectura, code review, docs | No ejecuta código en el repo |
| Cowork | — | En stand-by, no reactivado | — |

---

## 5. Arquitectura de ramas

```
main (producción viva — Aromia 1.0, NO TOCAR directo)
  ↑
feature/v2.0 (monorepo Next.js — Aromia 2.0, rama de trabajo de Code)
  ↑
design/ui-ux (rama de diseño — sale DESDE feature/v2.0, no desde main)
```
Orden de merge: `design/ui-ux` → `feature/v2.0` → `main`.

GitHub = dónde vive el código (ambas versiones, mismo repo, ramas distintas). Railway = dónde corre 2.0 (staging hoy, producción eventualmente). GitHub Pages solo sirve HTML estático, por eso 1.0 no necesita Railway.

---

## 6. Estado actual por versión

### Aromia 1.0 (`main`)
**Hecho:**
- Cloudflare Web Analytics instalado
- Imagen editorial IA en Erba Pura (prueba piloto)
- `CHANGELOG-1.0.md` con entrada del 15 jul confirmada por Code
- ~~Fix de `object-fit`/`object-position` en tarjetas del catálogo~~ —
  **cerrado, ya estaba resuelto desde el 16/07** (commit `3c5d0e9`,
  `catalogo.html`): no fue un ajuste genérico de `object-position`, sino
  un array `CARD_IMG_FIT_CONTAIN` con los 6 productos puntuales cuya
  composición no toleraba `object-fit: cover` (Baccarat Rouge 540, Black
  Opium, Sauvage, Bleu de Chanel, Miss Dior, Mon Paris) — a esos se les
  aplica `object-fit: contain` en vez de recortar. Este documento lo
  tenía marcado como pendiente por desactualización, no porque faltara
  hacerlo — verificado el 17/07 revisando el código real de `main`.

### Aromia 2.0 (`feature/v2.0`)

**✅ Deployado y verificado en producción real desde el 18/07** —
`web-production-71f88.up.railway.app` / `api-production-fe2f.up.railway.app`,
no solo local. Railway auto-deploya en cada push a `feature/v2.0`
(confirmado — no hace falta accionarlo a mano).

**Hecho (verificado en producción, no solo local):**
1. **Panel de Administración** (`/admin`) — Dashboard con KPIs reales y actividad reciente (el placeholder "Por Cowork" del mockup ya se reemplazó por actores reales: `Brey`/`Sistema`), Catálogo con búsqueda/filtros/paginación + CRUD completo de perfumes (imagen, retailers, reseña sintetizada, SEO), Magazine con editor Tiptap (crear/guardar borrador/publicar). Auth por contraseña compartida — **contraseña de producción regenerada el 18/07, pedila a Code si la necesitás.**
2. **Página de Producto** (`/perfumes/[slug]`) — "Anatomía de una fragancia" completa: imagen, tabla de ofertas multi-retailer, radar "El retrato olfativo" (Recharts), evolución en piel, reseñas comunitarias.
3. **Auditoría WCAG AA** (decisión #30) — dorado con contraste insuficiente en texto; corregido con `--gold-contrast`. Barrido responsive 1440→320px sin overflow.
4. **Home, listado de perfumes y quiz**:
   - `/` — hero + destacados reales + banner al quiz + captura de newsletter.
   - `/perfumes` — listado con tarjetas y filtros (texto, género, familia, precio, nicho/comercial). Decisión #35: **versión final**, no se retoma el mockup `/catalogo` (scroll infinito + "Perfume del mes").
   - `/quiz` — las 6 preguntas y 7 perfiles de `COPY/quiz-questions.md` funcionando de verdad, con resultado compartible en `/quiz/resultado/[perfil]` (meta tags OG por perfil) + captura de newsletter.
5. **Magazine público** (`/magazine`) — reemplaza a `/articulos` (decisión #73, 21/07): sub-nav sticky, portada + secundarios, filtrado por categoría sin recarga, lector con hojeo vía `react-pageflip` y vista de impresión/PDF en `/magazine/[slug]/imprimir`. `/articulos` queda como redirect 308. Reusa la misma tabla `articles`; cualquier artículo publicado desde el admin aparece automáticamente.
6. **Bug de datos corregido** (decisión #31): perfumes en borrador ya no se filtran públicamente.
7. **Scaffold de newsletter**: tabla `subscribers` + captura funcional en home, resultado del quiz y `/club`. Envío real vía SendGrid (decisión #50), falta que Brey pase las credenciales.
8. **SEO técnico**: `sitemap.xml`/`robots.txt` reales, dinámicos.
9. **`/club`** (decisión #54) — página "Próximamente" + lista de espera, redirect `/club.html` activo.
10. **4 artículos de Academia** (decisión #55) — sembrados, redirects `/academia.html` y `/piramide-olfativa-explicada.html` activos.
11. **Scraper de precios, Fase 2** (decisión #56) — scaffold Awin (Douglas + Primor) deployado como no-op, a la espera de que Brey se dé de alta en Awin.
12. **Corte de dominio real** (decisión #64) — `aromialab.com`/`www.aromialab.com` en Railway, DNS de Namecheap actualizado, TLS válido. Fix de `NEXT_PUBLIC_SITE_URL` (decisión #65).
13. **Catálogo de afiliados/imágenes** (decisiones #66-67, #70-71) — el catálogo quedó en **38 perfumes**, todos con foto real de producto (24 de Amazon + 14 de Notino/Douglas). Los 12 restantes sin foto real (houses de nicho o marcas restringidas) se eliminaron del catálogo en vez de quedar en placeholder — decisión de Brey.

**Roadmap futuro — "Visión Panel v2"** (no bloquea nada, sin cambios): Service Accounts múltiples, módulo de Assets, Comparador con motor de reglas propio, multi-retailer automático, CMS modular tipo Notion, modelo de "entidades".

**Infraestructura — hallazgos y fixes del 18/07 (no eran visibles hasta intentar el deploy real):**
- El dominio de Railway del servicio `api` tenía el *target port* pegado en `400` desde el 15/07 (typo histórico, a nivel de networking de Railway, no de variable de entorno) — el admin nunca hubiera funcionado en producción sin este fix. Corregido.
- Los secrets de admin (`ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `ADMIN_API_TOKEN`) no existían en Railway — generados y seteados.
- Las migraciones `002` a `007` nunca se habían aplicado a la Postgres de producción (solo tenía la tabla base de perfumes) — aplicadas, con backup previo.
- Bug de build real (no solo hipotético): Next.js intenta pre-renderizar en build-time las páginas con `revalidate`, lo que rompe el build si la API está caída en ese momento — pasó 3 veces seguidas. Corregido con `dynamic="force-dynamic"`.
- Ninguna ruta de la API capturaba errores — corregido con manejo de errores global.

**Schema — actualizado 18/07:**
- ~~5 perfumes con categoría de precio inválida "nicho"~~ — **cerrado el 16/07** (Santal 33, Molecule 01, Kirke, Le Labo Another 13, Nishane Hacivat remapeados a `premium`; ninguno alcanza el piso de `lujo`).
- Redirects v1 → v2: **borrador técnico listo** en `REDIRECTS_DRAFT_v1_a_v2.md` (raíz del repo) — sin activar, pendiente de que Brey confirme los casos ambiguos (17 de 20 artículos de v1 sin equivalente directo en v2 todavía).
- Duplicación de `resena-baccarat-rouge-540` (.html de v1 + .md nuevo) sin resolver (sin cambios).
- **Nuevo hallazgo (18/07):** v2 no tiene ninguna página `/privacidad` — v1 sí la tiene (`privacidad.html`), posible requisito de Amazon Associates. Señalado en el draft de redirects, sin resolver.

---

## 7. Contenido y catálogo

- `PERFUMES_INITIAL_50.csv` — nombre del archivo sin cambiar por compatibilidad, pero **el catálogo real tiene 38 perfumes**, no 50 (decisión #71: se eliminaron los 12 sin foto real) — sembrados en Postgres de producción.
- `PROMPTS-CATALOGO-50.md` — 50 prompts de imagen editorial generados desde el CSV original, para pegar en ChatGPT Plus uno a la vez (método manual, no automatizado, costo cero hasta ingresos reales) — incluye prompts de los 12 perfumes ya eliminados del catálogo, sin actualizar todavía.
- Solo Erba Pura tiene imagen ya generada e integrada en 1.0 como prueba piloto
- `link_afiliado`: **38/38 completo**, todos con ASIN real de Amazon o de Notino/Douglas — ya no quedan fallbacks de búsqueda sin foto real detrás (decisiones #66, #70-71). ASIN de Le Male corregido el 24/07 (decisión #74, apuntaba a la flanker Aviator).
- `imagen_url`: **38/38 con foto real** (decisión #71) — cero perfumes en placeholder. Wood Sage & Sea Salt corregido el 24/07 (URL de Douglas muerta, reemplazada por foto de Amazon).
- **Mockups narrativos OVL en la ficha de producto**: **38/38 perfumes activos** con mockup propio verificado 1:1 (decisiones #75, #80) — cerrado el 25/07, ya no quedan placeholders.
- **Auditoría visual del catálogo real** (decisión #79): 2 bugs de imagen confirmados y corregidos en producción (Le Male, La Vie Est Belle).

---

## 8. Dependencias externas

| Dependencia | Tipo | Referencia |
|---|---|---|
| Sistema Atlas Comerce | Sistema padre | `ESTADO-atlas-comerce.md` — Project Atlas-Comerce-Lab |
| Image Toolkit | Herramienta genérica | `ESTADO-image-toolkit.md` — Project Image-Toolkit-Lab (uso actual: manual vía ChatGPT, no vía API/n8n) |

---

## 9. OVL — Estudio creativo (sub-sistema, dentro de Aromia)

Ver decisiones #15-18. Spike de validación conceptual ya corrido y aprobado (Gemini/ImageFX gratuito). Sprint 2 (documentar las 10 Skills) desbloqueado pero sin indicios de haber arrancado — confirmar con Brey si sigue en pausa o si se retoma. Subida a modelo de imagen pago: solo cuando Aromia genere ingresos reales (decisión #18). Sin novedades en la sesión del 17/07.

---

## 10. Documentos y artefactos ya creados

- `CURSO-PERSONAL-BREY.md` + skill `curso-tecnico-brey` — curso técnico personal de Brey, actualizable por los 3 actores
- `SPEC-PANEL-ADMIN-2.0.md` — spec base del Panel Admin, incluye brief usado y la sección "Visión Panel v2"
- `PROMPTS-CATALOGO-50.md` — los 50 prompts de imagen
- `CHANGELOG-1.0.md` / `CHANGELOG-2.0.md` — changelogs separados por versión, viven en la raíz del repo; `CHANGELOG-2.0.md` recién actualizado el 18/07 con todo el trabajo de la sección 6, incluido el deploy real.
- `REDIRECTS_DRAFT_v1_a_v2.md` (nuevo, raíz del repo) — borrador técnico del mapeo de URLs v1→v2, sin activar, esperando confirmación de Brey (sección 13).
- Este documento (`ESTADO-aromia.md`) ahora vive en la raíz del repo junto al resto (decisión #34) — antes se manejaba fuera, en Descargas.

---

## 11. Próximo paso

El plan de convergencia (decisiones #35-37) **ya se ejecutó y deployó**, y el
**corte de dominio real ya ocurrió** (decisión #64) — `aromialab.com` es hoy
Aromia 2.0 en producción. Lo que queda:

1. **Brey** — revisar y aprobar (o ajustar) el research de decants (decisión #58); confirmar si "Delina"/"Delina Exclusif" son el mismo producto.
2. **Brey** — darse de alta como afiliado en Awin para activar el scraper de Douglas/Primor (decisión #56); pasar credenciales de SendGrid y GA4.
3. Una vez aprobado el research de decants: **Code** confirma diseño técnico (reusar `retailers` con campo `tipo`, o tabla nueva) antes de implementar (decisión #57).
4. Dar seguimiento a los pendientes de la sección 13.

---

## 12. Captación de clientes / marketing

**Decisión (16 jul, Chat/Brey):** mientras Aromia no genere ingresos reales (criterio decisión #18), la captación se enfoca en canales orgánicos. Publicidad paga queda documentada pero **no se activa todavía**.

**Métodos orgánicos aprobados para implementar:**
1. **SEO** — vía `SEO_STRATEGY.md` (Sprint 1 de Cowork), cada reseña/artículo del magazine es puerta de entrada por búsqueda.
2. **Pinterest/Instagram** — imágenes editoriales generadas con IA (ej. Erba Pura) reutilizadas como pines/posts con link de vuelta al sitio.
3. **Quiz como imán de leads** — captura de email al entregar el resultado del quiz, resultado compartible en redes. **Actualización 17/07: el quiz ya funciona de punta a punta** (antes solo placeholder) — la parte de captura de email y el resultado compartible en redes siguen sin implementarse, solo existe la lógica de matching y la página de resultado con meta tags OG.
4. **Newsletter con valor real** — alertas de bajada de precio (ya en roadmap 2.0) como gancho principal, no solo reseñas.
5. **Comunidades existentes** (Reddit r/fragrance, Discord) — participación genuina, no spam de links.
6. **Micro-influencers de perfumería** — intercambio de link de afiliado por reseña, costo cero/bajo.

**Publicidad paga — pendiente, activar cuando haya ingresos reales:**
- Google Ads (búsqueda, intención de compra directa)
- Meta Ads (Instagram/Facebook, muy visual)
- Pinterest Ads (amplifica el orgánico ya construido)

---

## 13. Pendientes / preguntas abiertas

**Corte de dominio — ya cerrado:**
- ~~Confirmar/ajustar `REDIRECTS_DRAFT_v1_a_v2.md`~~ — **cerrado 18/07** (decisión #42), 24+ redirects activados en `apps/web/next.config.mjs`, incluidos `/academia.html` y `/club.html`.
- ~~Crear `/privacidad` en v2~~ — **cerrado 18/07** (decisión #47).
- ~~Definir timing y ejecutar el cambio de DNS~~ — **cerrado 19-20/07** (decisión #64): `aromialab.com`/`www.aromialab.com` en Railway, TLS válido.

**No bloquean nada, se resuelven a su ritmo:**
- ~~`link_afiliado` real~~ — **cerrado 18/07** (decisión #66): 50/50, 24 con ASIN directo, 26 con fallback de búsqueda.
- **Fuente de imagen para los 26/50 perfumes sin foto real** — **cerrado 21/07** (decisiones #69-71): 14 resueltos vía Notino/Douglas; los 12 restantes (Le Labo, Frederic Malle, Creed, Aesop, Chanel, Dior Maison, Mugler, Ariana Grande, un SKU de Tom Ford) sin ficha en Notino/Douglas/FragranceX se **eliminaron del catálogo** por decisión de Brey, en vez de quedar en placeholder. Catálogo final: 38 perfumes, todos con foto real.
- ~~Elegir proveedor de email~~ — **cerrado 18/07**: SendGrid, integrado y activo detrás de `SENDGRID_API_KEY`/`SENDGRID_FROM_EMAIL` (decisión #50) — falta que Brey genere y pase esas credenciales.
- ~~Alcance del scraper de precios~~ — **scaffold técnico cerrado 18/07** (decisión #56): Douglas + Primor vía Awin, deployado como no-op. Falta que Brey se dé de alta como afiliado en Awin para activarlo. Universo de retailers ampliado investigado (Perfumes Club, FragranceX, FragranceNet) queda como input para una fase posterior, sin decidir todavía.
- ~~¿Se suma GA4?~~ — **cerrado 18/07**: sí, integrado y activo detrás de `NEXT_PUBLIC_GA_ID` (decisión #48/#53) — falta que Brey cree la property de GA4 y pase el Measurement ID.
- Credenciales de Cloudflare (`CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ZONE_ID`): sin sentido pedirlas todavía — `aromialab.com` no está agregado como zona en Cloudflare (usa nameservers del registrador), ver decisión #48.
- **Decants** (decisión #57-58): research entregado (Scent Split, Scent Decant, Scentbird), pendiente de aprobación de Brey antes de que Code diseñe/implemente nada.
- Duplicación de `resena-baccarat-rouge-540` (.html de v1 + .md nuevo) sin resolver.
- ¿Sigue en pausa el arranque de Sprint 2 de OVL (documentar las 10 Skills) o se retoma? — sin pedido explícito de Brey, sigue en stand-by.
- ~~Coexistencia `/articulos` vs `/magazine`~~ — **cerrado 21/07** (decisión #73): `/magazine` reemplaza a `/articulos`, que queda como redirect 308.
- **Ticket ficha de producto (24/07), sección pendiente**: galería de miniaturas adicionales — regla de solo-fondo-blanco en el grid de Catálogo vs. galería más rica (lifestyle, infografías) permitida en la ficha individual del perfume. Sin empezar.
- ~~**Ticket "Adaptar variante visual" (25/07)**: toggle de tema claro/oscuro, reglas de imagen, sistema de nav de 3 niveles, `GUIA-VISUAL-aromia.md`~~ — **cerrado 26/07** (decisión #82). Nota: la tipografía IBM Plex Sans se cargó y quedó disponible (`font-plex`) pero **no se aplicó de forma masiva a párrafos existentes** — el ticket la marcaba como detalle de próxima iteración (sección 6), no bloqueante. Fondo de banner OVL a blanco/negro sólido (decisión #81) sigue sin aplicar, es un cambio de asset, no de código de este ticket.
- **Reseñas de comunidad real** (decisión #78): `CommunityReviews.tsx` usa rating + texto cargados a mano por el admin; el ticket original pide datos reales de Amazon. Necesita que Brey confirme si el enfoque actual alcanza o si hace falta scraping real de reseñas.
- **Desactivar "Imprimir PDF" en Magazine** (ticket 25/07): ocultar el botón/entrada sin borrar la funcionalidad de base. Sin empezar.
- **Fondo de mockups OVL a blanco/negro sólido según tema** (decisión #81): sin aplicar al set actual de 38 imágenes, pendiente de decidir si se resuelve como asset duplicado (light/dark) o vía CSS con fondo transparente.
- Los 9 casos ⚠️ de la auditoría visual (decisión #79) no requieren acción de código — son imprecisiones de la ficha de referencia del PDF (color/metal descrito distinto al real, o foto de caja en vez de frasco), señalados para que el equipo de contenido los revise si quiere corregir la ficha de referencia misma.

---

## 14. Conceptos técnicos que Brey está aprendiendo (acumulado)

Ver `CURSO-PERSONAL-BREY.md` para el detalle completo y ordenado por prerrequisitos. Última lección agregada: **Analítica web** (#14). Próximos conceptos candidatos a lección nueva: contraste WCAG y accesibilidad (recién aplicado el 17/07), Service Accounts/API keys múltiples, CSS `@media print`, scroll infinito con Intersection Observer.

---

*Este documento sigue la plantilla del `PROTOCOLO-comunicacion-actores.md`. Referencia al sistema padre (Atlas Comerce) y a la herramienta externa (Image Toolkit) sin duplicar su contenido — ver sección 8.*
