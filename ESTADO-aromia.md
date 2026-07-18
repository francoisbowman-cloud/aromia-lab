# Estado del proyecto: Aromia
Última actualización: 17 de julio de 2026 — por: Chat (mecanismo opusplan + instrucción pulida para Code)
Nivel: **Producto**, dentro del sistema **Atlas Comerce** (ver `ESTADO-atlas-comerce.md`, Project Atlas-Comerce-Lab)

---

## 1. Objetivo del proyecto

Aromia es un sitio de reseñas de perfumes con monetización por afiliados (Amazon, con Notino/Druni/Sephora en evaluación). Corre en dos versiones en paralelo:

- **Aromia 1.0** — sitio estático HTML, rama `main`, **en producción real** (aromialab.com), afiliados activos generando ingresos.
- **Aromia 2.0** — reconstrucción completa en Next.js 14 + Express + Postgres + Redis, rama `feature/2.0`, con staging en Railway. Eventualmente **reemplaza** a 1.0 en el mismo dominio (no coexisten como dos sitios). **Nota 17/07: el staging de Railway está desactualizado respecto al trabajo local — ver sección 6.**

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
- Cowork está **en stand-by**, no reactivado.
- El Magazine público (`/articulos/`) no se construye todavía — requiere parsear los 11 `.md` de `articles/` desde cero, fuera de alcance del batch del 17/07 (ver decisión #33).

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
| 24 | Nueva arquitectura de ramas: se agrega `design/ui-ux` (sale desde `feature/2.0`, no desde `main`). Orden de merge: `design/ui-ux` → `feature/2.0` → `main` | Code |
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
feature/2.0 (monorepo Next.js — Aromia 2.0, rama de trabajo de Code)
  ↑
design/ui-ux (rama de diseño — sale DESDE feature/2.0, no desde main)
```
Orden de merge: `design/ui-ux` → `feature/2.0` → `main`.

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

### Aromia 2.0 (`feature/2.0`)

**⚠️ Todo lo de abajo está hecho y verificado en el worktree local de Code, pero NADA se subió a Railway todavía.** El staging en vivo sigue mostrando el placeholder de Sprint 1.

**Hecho (implementado y verificado en navegador local desde el 16/07):**
1. **Panel de Administración** (`/admin`) — Dashboard con KPIs reales y actividad reciente (el placeholder "Por Cowork" del mockup ya se reemplazó por actores reales: `Brey`/`Sistema`), Catálogo con búsqueda/filtros/paginación + CRUD completo de perfumes (imagen, retailers, reseña sintetizada, SEO), Magazine con editor Tiptap (crear/guardar borrador/publicar). Auth por contraseña compartida.
2. **Página de Producto** (`/perfumes/[slug]`) — "Anatomía de una fragancia" completa: imagen, tabla de ofertas multi-retailer, radar "El retrato olfativo" (Recharts), evolución en piel, reseñas comunitarias.
3. **Auditoría WCAG AA** (decisión #30) — dorado con contraste insuficiente en texto; corregido con `--gold-contrast`. Barrido responsive 1440→320px sin overflow.
4. **Home, listado de perfumes y quiz** (antes placeholders de Sprint 1, nunca cubiertos por ningún mockup de ChatGPT):
   - `/` — hero + destacados reales + banner al quiz.
   - `/perfumes` — listado con tarjetas y filtros (texto, género, familia, precio, nicho/comercial).
   - `/quiz` — las 6 preguntas y 7 perfiles de `COPY/quiz-questions.md` funcionando de verdad, con resultado compartible en `/quiz/resultado/[perfil]` (meta tags OG por perfil).
5. **Bug de datos corregido** (decisión #31): perfumes en borrador ya no se filtran públicamente.

**Mockups del 16/07 — resolución (decisión #35, 17/07):**
3. **Catálogo** (`/catalogo`) — **cerrado.** El `/perfumes` implementado el 17/07 queda como versión final; no se construye el diseño original del mockup (scroll infinito + "Perfume del mes").
4. **Magazine** (`/magazine`) — **siguiente prioridad de construcción.** Portada tipo revista, hojeo interactivo (`react-pageflip`), descarga PDF vía `@media print`. Sin implementar todavía.

**Roadmap futuro — "Visión Panel v2"** (no bloquea nada, sin cambios): Service Accounts múltiples, módulo de Assets, Comparador con motor de reglas propio, multi-retailer automático, CMS modular tipo Notion, modelo de "entidades".

**Schema — actualizado 17/07:**
- ~~5 perfumes con categoría de precio inválida "nicho"~~ — **cerrado el 16/07** (Santal 33, Molecule 01, Kirke, Le Labo Another 13, Nishane Hacivat remapeados a `premium`; ninguno alcanza el piso de `lujo`). Este documento no lo había reflejado — ya consta en `CLAUDE.md`/`CHANGELOG-2.0.md` del repo.
- Redirects v1 → v2 sin confirmar (sin cambios).
- Duplicación de `resena-baccarat-rouge-540` (.html de v1 + .md nuevo) sin resolver (sin cambios).

---

## 7. Contenido y catálogo

- `PERFUMES_INITIAL_50.csv` — fuente real de datos (50 perfumes, notas, familia, precio, género, etc.) — ya sembrados en Postgres local y en el staging de Railway.
- `PROMPTS-CATALOGO-50.md` — 50 prompts de imagen editorial generados desde el CSV, para pegar en ChatGPT Plus uno a la vez (método manual, no automatizado, costo cero hasta ingresos reales)
- Solo Erba Pura tiene imagen ya generada e integrada en 1.0 como prueba piloto
- `link_afiliado` e `imagen_url` siguen siendo **placeholders** en las 50 filas — no son datos de producción todavía.

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
- `CHANGELOG-1.0.md` / `CHANGELOG-2.0.md` — changelogs separados por versión, viven en la raíz del repo; `CHANGELOG-2.0.md` recién actualizado el 17/07 con todo el trabajo de la sección 6.
- Este documento (`ESTADO-aromia.md`) ahora vive en la raíz del repo junto al resto (decisión #34) — antes se manejaba fuera, en Descargas.

---

## 11. Próximo paso

1. **Magazine público (`/articulos/`)** pasa a ser la siguiente pieza a construir (decisión #35) — parsear los 11 `.md` de `articles/`, portada tipo revista, hojeo interactivo, descarga PDF.
2. **Deploy a Railway:** se hace al finalizar el plan completo que Code está armando (decisión #36) — no hay entregas parciales a staging hasta entonces.
3. Dar seguimiento a los pendientes de la sección 13.

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

- ¿Se reactiva Cowork o sigue en stand-by?
- ¿Se suma GA4 además de Cloudflare Analytics?
- Redirects v1→v2 y duplicación de `resena-baccarat-rouge-540` siguen sin resolver (decisiones de contenido/SEO, no técnicas).
- ¿Sigue en pausa el arranque de Sprint 2 de OVL (documentar las 10 Skills) o se retoma?

---

## 14. Conceptos técnicos que Brey está aprendiendo (acumulado)

Ver `CURSO-PERSONAL-BREY.md` para el detalle completo y ordenado por prerrequisitos. Última lección agregada: **Analítica web** (#14). Próximos conceptos candidatos a lección nueva: contraste WCAG y accesibilidad (recién aplicado el 17/07), Service Accounts/API keys múltiples, CSS `@media print`, scroll infinito con Intersection Observer.

---

*Este documento sigue la plantilla del `PROTOCOLO-comunicacion-actores.md`. Referencia al sistema padre (Atlas Comerce) y a la herramienta externa (Image Toolkit) sin duplicar su contenido — ver sección 8.*
