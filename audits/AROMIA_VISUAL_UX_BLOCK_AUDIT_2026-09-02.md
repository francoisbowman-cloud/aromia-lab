# Aromia — Auditoría visual/UX por bloque

STATUS: AUDITORÍA — SIN CAMBIOS DE CÓDIGO
DATE: 2026-09-02
BRANCH: `feat/visual-ux-audit` (desde `main` @ 9cdd59c)
SCOPE: clasificación bloque a bloque de todas las superficies editoriales públicas
BRIEF DE ORIGEN: `AROMIA_IMPLEMENTACION_VISUAL_UX_END_TO_END.md` (entregado por Brey, sin fechar)
GATES: sin push/merge/gasto de API sin aprobación textual de Brey. `main` protegida (PR + CI + OMNI).

---

## 0. Relación con la consolidación del 2026-09-02

El repo ya cerró hoy una consolidación completa de UX/UI/IA (STATE_VERSION 35):

- `audits/AROMIA_UX_UI_INFORMATION_ARCHITECTURE_AUDIT_2026-09-02.md` (auditoría fuente)
- `audits/AROMIA_UX_UI_IMPLEMENTATION_CLOSEOUT_2026-09-02.md` (implementación, mergeada por PR #127)
- `audits/AROMIA_RENDER_QA_CLOSEOUT_2026-09-02.md` (OMNI Render QA: 11 PASS / 0 REVIEW / 0 FAIL)
- Producción: commit `7315d3f2` desplegado en Railway, verificado en navegador real.

Esa consolidación **ya resolvió** buena parte de lo que pide el brief nuevo:
shell/navegación única, nav móvil completa, índice editorial canónico
(`editorialIndex.ts`) que une `/historias/*` + Magazine en archivo y búsqueda,
breadcrumb muerto de "Catálogo" eliminado, Quiz plegado en Discovery, Club
subordinado ("En preparación"), Buscar re-encuadrado, tokens semánticos
(`design-tokens.css`) iniciados.

Esta auditoría **no reabre** eso. Hace la pasada que la anterior no hizo: la
clasificación por bloque (`MANTENER / REFORZAR / RECICLAR / REMOVER`) que el
brief exige explícitamente, y aísla lo que queda genuinamente abierto.

Regla del relay: cualquier hallazgo renderizado es evidencia nueva, no excusa
para reabrir superficies ya cerradas sin evidencia.

---

## 1. Método — las cuatro marcas

| Marca | Significado | Acción |
|---|---|---|
| **MANTENER** | Cumple ≥1 función real (informar / orientar / permitir descubrir / conectar / aportar imagen con valor narrativo). Sin deuda visible. | Nada. |
| **REFORZAR** | Función correcta pero ejecución débil: falta imagen donde el ritmo la pide, jerarquía plana, CTA sin continuación real, texto largo sin apoyo. | Editar in situ. |
| **RECICLAR** | Ocupa espacio pero su función real es estética / redundante / abstracta. Hay una función mejor que podría cumplir. | Rediseñar para que haga algo. |
| **REMOVER** | No informa, no orienta, no permite acción, no conecta; o es código muerto / placeholder inútil / repite otra sección. | Eliminar. |

---

## 2. HOME — `/` (`app/(editorial)/page.tsx` + `editorial.css` + `home-story-rhythm.css`)

Nota de arquitectura: el `NavBar`/`Footer` globales se renderizan desde
`app/layout.tsx`. La home todavía declara su propio `.ev1-nav` y `.ev1-footer`,
que `(editorial)/layout.tsx` oculta con `display:none !important`.

| # | Bloque | Verdicto | Motivo / acción |
|---|---|---|---|
| H1 | `.ev1-nav` bespoke (Portada · Magazine · Saber · Discovery · Club · ⌕) | **REMOVER** | Código muerto: oculto por CSS, duplica el `NavBar` global, y su nomenclatura ("Portada", "Magazine") ya no es la canónica. Borrar el `<header>` del JSX y las reglas `.ev1-nav` de `editorial.css`. |
| H2 | `.ev1-lead` — hero "El perfume que encargó un sultán" + `VisualField` resina (`amouage-material-density-interpretive` → foto real de Omán) | **MANTENER** | Par imagen↔historia correcto, deck real, un solo CTA "Leer historia". Imagen con valor de contexto (paisaje de Omán ↔ historia omaní). |
| H3 | `.ev1-counterpoints` — 2 historias (ámbar / Ropion), cada una `VisualField` + copy | **MANTENER** | Alternancia editorial con propósito; cada imagen resuelve a foto real (salvia, rosa) ligada a su materia. En desktop es `imagen \| texto` por tarjeta sin mezclar historias — cumple la regla desktop del brief. |
| H4 | Fuente de datos `stories` (array local, 2 entradas) | **RECICLAR** | Duplica `EDITORIAL_STORIES` de `editorialIndex.ts` (que tiene 4). La lead "sultán" está hardcodeada aparte y no figura en el array. Riesgo de deriva. Derivar la home del índice canónico. |
| H5 | `.ev1-thinking` — teaser Discovery ("¿Qué te mueve cuando eliges un perfume?") | **REFORZAR** | Función de puente correcta, pero es un bloque 100% texto entre dos bloques con imagen y antes del footer. Falta una pausa visual o un anclaje (nota, materia, mini-mapa). Hoy se siente decorativo-textual. |
| H6 | `.ev1-footer` bespoke (AROMIA / "Una fragancia, una historia" / "Materias e historias, con contexto") | **REMOVER** | Código muerto: oculto por CSS, duplica el `Footer` global. Borrar del JSX + reglas `.ev1-footer`. |
| H7 | Regla móvil imagen/historia (`home-story-rhythm.css`, commits d60173c + 9cdd59c) | **REFORZAR / VERIFICAR** | Ya se corrigió "emparejar cada imagen con su historia" y "secuencia móvil". Falta verificación renderizada en esta pasada: confirmar que en ≤800px el orden es `imagen A → texto A → imagen B → texto B` y nunca `texto A → imagen A → imagen B → texto B`. |

---

## 3. HISTORIAS — plantilla `/historias/[slug]` (`(editorial)/historias/[slug]/page.tsx` + `story.css`)

Cubre 3 historias (ámbar, Ropion, sultán). `el-coleccionista` es una página
propia y **está bloqueada** (relay: "DO NOT REOPEN CASUALLY") → fuera de scope.

| # | Bloque | Verdicto | Motivo / acción |
|---|---|---|---|
| S1 | `.ev1-nav` de la plantilla de historia (Portada · territorio · ⌕) | **REMOVER** | Mismo caso que H1: oculto por el selector `.ev1 > .ev1-nav`, duplica el shell global, nomenclatura vieja. |
| S2 | `.story-hero` — kicker + H1 + deck + `VisualField` hero | **MANTENER** | Estructura editorial correcta. Los 3 heroes resuelven a foto real (salvia / rosa / Omán). |
| S3 | `.story-intro` | **MANTENER** | Entrada breve, cumple. |
| S4 | `.story-section` con `slot` (interrupción visual): ámbar §2, sultán §1 y §2 | **MANTENER** | Imagen insertada donde cambia la idea, con procedencia. Es el patrón que el brief pide. |
| S5 | `.story-section` **sin** `slot`: **Ropion — las 4 secciones sin una sola imagen**; ámbar §1/§3/§4; sultán §3 | **REFORZAR** | La historia de Ropion son ~1.900 palabras de corrido sin ningún apoyo visual. El brief lo prohíbe explícitamente ("evitar tramos demasiado largos sin apoyo visual"). Añadir 1–2 slots donde cambia el ritmo (p. ej. tras "La técnica tiene nombre: sobredosis"). Requiere material — ver §12. |
| S6 | Fondos de sección por CSS (`.ropion .section-2{background:#2a0d16}`, `.ambroxan .section-2{background:#e6e5da}`, gradientes en `.story-visual` de fallback) | **RECICLAR** | Los tintes por sección aportan ritmo, pero los gradientes radiales tipo "campo material" que quedan **detrás** de los slots ya resueltos son placeholders degradados sin función una vez que hay foto real. Limpiar los que ya no se ven; conservar solo el tinte de fondo intencional. |
| S7 | `.story-commerce` — nota + lista de afiliados `rel="sponsored nofollow"` | **MANTENER** | Monetización real, presión comercial cerca de cero hasta el cierre (como pide la línea editorial). |
| S8 | `.story-close` — "Seguir explorando" → **"Volver a la portada →"** | **REFORZAR** | El brief exige "enlace editorial a otra lectura". Hoy te devuelve a `/` (home), no a una historia relacionada. Cambiar por 1–2 enlaces a historias del mismo territorio vía `editorialIndex.ts`. |

---

## 4. MAGAZINE / ARCHIVO — `/magazine` (`magazine/page.tsx` + `components/magazine/EditorialArchive.tsx`)

Rol ya asignado: "Historias / Archivo Aromia" (no una segunda home).

| # | Bloque | Verdicto | Motivo / acción |
|---|---|---|---|
| M1 | Header "Archivo Aromia / Historias" + deck | **MANTENER** | Identidad de página clara, coherente con el rol de archivo. |
| M2 | Barra de filtros sticky (Todas · Historias · Materia · Personas · Reflexión · Guías · Análisis) | **MANTENER** | Permite navegar; `aria-pressed`, scroll horizontal en móvil. Función real. |
| M3 | Historia principal (`lead`) — solo tipografía, **sin imagen** | **REFORZAR** | El brief pide "hero o historia principal con imagen dominante" y "priorizar composiciones editoriales". Hoy el lead es un `<h2>` grande sin imagen. Añadir imagen dominante al lead (del índice / slot de la historia). |
| M4 | Grid `rest` — tarjetas tipográficas con `translate-y` alterno, sin imagen | **REFORZAR** | No es una card genérica con sombra (bien), pero es un grid uniforme sin jerarquía entre piezas y sin ninguna pausa visual. Introducir proporciones variadas y alguna imagen cada N piezas para romper la plantilla. |
| M5 | Estado vacío por territorio ("Todavía no hay historias en este territorio") | **MANTENER** | Honesto y correcto. |

---

## 5. PERSONAS — `/perfumistas` + `/perfumistas/[slug]`

| # | Bloque | Verdicto | Motivo / acción |
|---|---|---|---|
| P1 | Índice: header "Personas / Quién está detrás del olor" + nota de atribución revisada | **MANTENER** | Encuadre correcto y honesto. |
| P2 | Índice: grid de perfiles (nº · era · nombre · firma · "Explorar →"), **sin retrato** | **REFORZAR** | El brief D exige retrato en cada biografía y, si no hay foto real, "fallback editorial digno y claramente diferenciado" — nunca un hueco. Hoy `lib/perfumers.ts` no tiene campo de imagen. Añadir slot de retrato + fallback tipográfico digno (inicial/monograma sobre campo de materia). **Sin generar imágenes** en esta fase. |
| P3 | Detalle: breadcrumb `Personas ／ era` | **MANTENER** | Padre real, coherente. |
| P4 | Detalle: cabecera (H1 nombre + firma en itálica + bio de una línea), **sin retrato** | **REFORZAR** | Mismo caso que P2. Además el brief pide biografía real, "casas relacionadas" y "estilo/firma creativa" como campos propios: hoy solo hay `signature` + `bio` de una frase. Ampliar el modelo de datos (contenido, no código puro). |
| P5 | Detalle: "Historias relacionadas" (solo si `relatedPerfumerSlug`) | **MANTENER** | Conecta persona↔historia vía índice canónico. Solo Ropion la tiene poblada hoy; es correcto no inventar. |
| P6 | Detalle: "Obras en Aromia" — grid `PerfumeCard` | **MANTENER** | Conecta persona↔obra, con recuento y "autoría revisada". |
| P7 | Detalle: `PersonalizedDiscoveryRail` "Después de {nombre}" | **MANTENER** | Continuación hacia Discovery. |
| P8 | Detalle: cierre "Ver Personas / Ir a Historias" | **MANTENER** | Dos salidas plausibles, no obliga a volver a home. |

---

## 6. SABER — `/academia` (`academia/page.tsx`)

Ruta técnica `/academia`, etiqueta pública **Saber**. Reordenada en la
consolidación (Estructura · Familias · Concentración · Historia).

| # | Bloque | Verdicto | Motivo / acción |
|---|---|---|---|
| SB1 | Header "Saber / Entender cambia la manera de oler" + índice ancla | **MANTENER** | Identidad y navegación interna claras. |
| SB2 | `01 / Estructura` — pirámide olfativa (3 tiers, tabla) | **REFORZAR** | Contenido útil pero es una tabla de texto densa. El brief pide "apoyo visual con función didáctica" y "diagramas simples cuando aporten valor". Añadir un diagrama simple de la pirámide (salida/corazón/fondo vs. tiempo). |
| SB3 | `02 / Familias` — grid de 8 familias, solo texto | **REFORZAR** | Sin imagen de materia por familia. El brief pide "imágenes de materias" y "mini composiciones editoriales". Añadir una materia representativa por familia (foto real / documental con procedencia). Conecta además con el rediseño de Discovery (§9). |
| SB4 | `03 / Concentración` — barras `width` fijas (Parfum 100% … Cologne 15%) | **REFORZAR** | Las barras son decorativas: los `width` son valores inventados sin eje ni referencia (`bg-gold-contrast` a `width:"65%"`). O se convierten en un gráfico real (rango de % de concentrado) o se quitan las barras y se deja la tabla. |
| SB5 | `04 / Historia` — 6 hitos en grid | **REFORZAR** | Bien acotado ("seis momentos, no seis mil años"). Falta un apoyo visual mínimo (línea de tiempo, o una imagen documental por hito clave). |
| SB6 | Cierre "Ahora vuelve a las historias…" → Historias / Discovery | **MANTENER** | Devuelve al cuerpo editorial. |

---

## 7. DISCOVERY — `/descubrir` (`descubrir/page.tsx` + `components/discovery/DiscoveryDashboard.tsx`)

**Este es el mayor delta con el brief.** Hoy `/descubrir` es un *dashboard de
mapa personal* (señales guardadas en `localStorage`). El brief E pide algo
distinto y más grande: un explorador editorial `familia → subfamilia → materia →
fragancia → perfumista → historia`, navegable, con vuelta atrás sin perder
contexto. Son dos productos: conviene **conservar el mapa personal y añadir el
explorador**, no reemplazar.

| # | Bloque actual | Verdicto | Motivo / acción |
|---|---|---|---|
| D1 | Header "Tu mapa olfativo" + CTA "¿Empiezas de cero? Haz el Quiz →" | **MANTENER** | Quiz ya integrado como onboarding (consolidación Fase D). |
| D2 | `Atlas olfativo` — "¿Qué quieres sentir?" + botones de familia que filtran un preview de 4 frascos + "Abrir búsqueda →" | **RECICLAR** | Es el germen del Nivel 1 del brief, pero hoy solo cambia 4 miniaturas y te expulsa a `/buscar`. Reciclar como entrada real a las 10 grandes familias del brief, cada una con su Nivel 2 (a qué huele / materias / subfamilias / carácter / contexto / fragancias / personas / historias). |
| D3 | `Tu firma en formación` — familias/notas/personas que regresan (de `localStorage`) | **MANTENER** | Función real (mapa personal), honesto sobre dónde se guarda. |
| D4 | `Rutas posibles` — 6 perfumes rankeados con razones | **MANTENER** | Descubrimiento real basado en señales concretas, con continuación ("Seguir esta pista →"). |
| D5 | Reset "Reiniciar / Ninguno" + nota de privacidad | **MANTENER** | Control del usuario, discreto. |
| D6 | **Nivel 1 — 10 familias** (Cítrica, Floral, Amaderada, Ámbar/Oriental, Chipre, Fougère, Aromática, Gourmand, Acuática, Cuero) | **AUSENTE → CREAR** | Entradas principales editoriales (no cards genéricas). |
| D7 | **Nivel 2 — ficha de familia** (a qué huele en lenguaje humano · materias frecuentes · subfamilias · sensación/carácter · contexto: clima/hora/ocasión/intensidad · fragancias relacionadas reales · personas relacionadas · historias relacionadas) | **AUSENTE → CREAR** | Núcleo del brief E. Todo con enlaces reales dentro de Aromia; sin inventar. |
| D8 | **Nivel 3 — subfamilia** (descripción · materias dominantes · diferencia con la familia · perfumes representativos · contexto · artículos) | **AUSENTE → CREAR** | |
| D9 | UX de red: `familia→subfamilia→materia→fragancia→perfumista→historia` + volver sin perder contexto | **AUSENTE → CREAR** | Debe sentirse como red editorial, no filtro de ecommerce. |

Bloque nombrado por el brief para eliminar/transformar — **"El carácter detrás
de las notas"** — **no vive en Discovery**, vive en la ficha de perfume. Ver §11 (F3).

---

## 8. CLUB — `/club` (`club/page.tsx`)

| # | Bloque | Verdicto | Motivo / acción |
|---|---|---|---|
| C1 | Cabecera "Club · En preparación" + H1 + párrafo de intención | **MANTENER** | Ya subordinado y honesto ("dejar de ser una promesa en la navegación"). |
| C2 | 3 pilares (Perfil / Comunidad / Continuidad) — solo describen funciones futuras | **RECICLAR** | El brief G marca exactamente esto: "módulos que solo describen funciones sin permitir hacer nada". Reducir a una frase, o convertir cada pilar en un enlace a lo que **ya** existe (Perfil→Discovery/mapa, Continuidad→historia guardable). |
| C3 | Aside lista de espera + `NewsletterForm fuente="club"` | **MANTENER** | Única acción real de la página; funciona. |
| C4 | "Mientras tanto, Historias / Abrir Discovery" | **MANTENER** | Devuelve a superficies útiles. |

---

## 9. BUSCAR — `/buscar` (`buscar/page.tsx` + `components/discovery/DiscoverySearch.tsx`)

| # | Bloque | Verdicto | Motivo / acción |
|---|---|---|---|
| B1 | Header "Buscar en Aromia / Encuentra la siguiente pista" | **MANTENER** | Copy ya re-encuadrado (sin "catálogo + Magazine"). |
| B2 | `DiscoverySearch` sobre `perfumes` + `buildEditorialIndex(articles)` | **MANTENER** | Cruza fragancias + archivo editorial unificado (resuelve el fallo previo de historias invisibles tras salir de portada). |
| B3 | Terminología de tipos de contenido (fragancia / historia / persona / materia / nota) | **REFORZAR / VERIFICAR** | El texto promete "materia" y "nota"; confirmar en render que esos tipos existen como resultados y no solo como copy. |

---

## 10. QUIZ — `/quiz` + `/quiz/resultado/[perfil]`

| # | Bloque | Verdicto | Motivo / acción |
|---|---|---|---|
| Q1 | `/quiz` cabecera "Discovery ／ Inicio del mapa" + H1 "¿Qué perfume eres?" + `QuizFlow` | **MANTENER** | Encuadrado como parte de Discovery, no territorio par. |
| Q2 | `/quiz` panel derecho — círculos decorativos `aria-hidden` (borde + blur `bg-gold/10`) | **RECICLAR** | Decoración pura detrás del `QuizFlow`. Si el `QuizFlow` ya llena el panel, quitar; si queda aire, usarlo para una pista visual del progreso. |
| Q3 | `/quiz/resultado` cabecera de perfil + "no es una etiqueta permanente" | **MANTENER** | Devuelve a Discovery, gestiona expectativas (consolidación Fase D). |
| Q4 | `/quiz/resultado` grid `PerfumeCard` "Primeras pistas" | **MANTENER** | Recomendación real con ranking; estado vacío honesto. |
| Q5 | `/quiz/resultado` cierre "El resultado sirve más cuando deja de ser el final" → Discovery | **MANTENER** | Continuación clara. |

---

## 11. FICHA DE PERFUME — `/catalogo/[slug]` (`catalogo/[slug]/page.tsx`)

Rol asignado: objeto de referencia/contexto alcanzado desde editorial/Discovery
(no PDP de tienda). El grid `/catalogo` sigue retirado.

| # | Bloque | Verdicto | Motivo / acción |
|---|---|---|---|
| F1 | Breadcrumb `Aromia ／ Discovery ／ {nombre}` + `HeroHeader` | **MANTENER** | Breadcrumb muerto de "Catálogo" ya eliminado. |
| F2 | `02 / Anatomía` — `SkinEvolution` + `PerformanceBars` | **MANTENER** | Datos verificados, rendimiento separado de la descripción olfativa. Informa. |
| F3 | `03 / Contexto` — **"El carácter detrás de las notas"** / `EditorialMood` ("Campo material", "Materia sin ficción", nombre en tipografía fantasma gigante + lista de notas) | **RECICLAR o REMOVER** | **Bloque nombrado por el brief E para eliminar o transformar.** Es un panel a sangre completa con gradientes blur decorativos cuya función es atmosférica; además **repite las notas** que ya muestra el bloque 02 (`SkinEvolution`). Opción A: removerlo. Opción B: reciclarlo en algo que conecte — familia → ficha de familia en Discovery (§7), materias → Saber, o "historias que mencionan este perfume". |
| F4 | `04 / Compra informada` — `PriceTable` (afiliado Amazon; scraper Awin desactivado, muestra cache) | **MANTENER** | Monetización real; el brief no pide reintroducir precio en vivo. |
| F5 | `05 / Comunidad` — `CommunityReviews` (rating + reseña sintetizada) | **REFORZAR / VERIFICAR** | Confirmar en render que hay datos reales; si casi siempre está vacío, degradar a estado honesto en vez de sección completa. |
| F6 | `SimilarPerfumes` + `RelatedEditorial` | **MANTENER** | Conectan objeto → contexto (el movimiento que pide el brief: de objeto a historia). |
| F7 | Cierre "Esta ficha es una referencia… Volver a Discovery / Seguir leyendo" | **MANTENER** | No se comporta como PDP aislada. |

---

## 12. Sistema de imágenes — transversal

Prioridad del brief: (1) foto real, (2) foto editorial contextual, (3) materia/objeto real,
(4) recurso interpretativo justificado. Prohibido: frascos IA con marcas falsas,
lujo genérico, apariencia de publicidad, placeholders degradados, bloques vacíos
simulando imagen.

| Hallazgo | Verdicto | Nota |
|---|---|---|
| Registro `EDITORIAL_V1_SLOTS` (`editorialVisuals.tsx`) — heroes resuelven a foto real con procedencia (salvia, rosa, Omán, incienso) | **MANTENER** | Modelo correcto: slot con procedencia, `unoptimized` para externas, fallback a caja CSS con `placeholderLabel`. |
| Gradientes radiales `.ev1-resin` / `.ev1-material` / `.story-visual` **detrás** de slots ya resueltos | **RECICLAR** | Son "placeholders degradados". Donde ya hay foto real, sobran; limpiar. Donde son fallback de un slot `present:false`, conservar como caja rotulada, no como falso campo material. |
| Personas: **cero retratos**, sin campo de imagen en `lib/perfumers.ts` | **REFORZAR** | Añadir slot + fallback editorial digno. Generación de retratos = fase aparte con aprobación (foto real preferida; IA solo si Brey lo autoriza). |
| Saber / familias: sin imágenes de materia | **REFORZAR** | Usar documentales con procedencia (mismo patrón que los slots editoriales). |
| Historia de Ropion: 0 imágenes en 4 secciones | **REFORZAR** | Necesita 1–2 materiales con procedencia. |

Ninguna imagen rota detectada por lectura de código; falta confirmación
renderizada (OMNI Render QA del 2026-09-02 no reportó imágenes rotas y verificó
los 3 endpoints lazy de Discovery como alcanzables).

---

## 13. Mobile — transversal

| Hallazgo | Verdicto |
|---|---|
| Nav móvil global completa (`NavBar.tsx` `<details>` con `SITE_NAV` + Buscar, tap ≥44px) | **MANTENER** — resuelto en la consolidación. |
| Orden imagen/historia en home ≤800px (`home-story-rhythm.css`) | **REFORZAR / VERIFICAR** — corregido por commits d60173c + 9cdd59c; falta verificación renderizada en esta pasada. |
| `.ev1-nav nav { display:none }` en ≤800px dentro de `editorial.css` | **REMOVER junto con H1/S1** — es el resto del nav bespoke muerto. |
| `.story-section` a `grid-template-columns:34px 1fr` + interrupción a `width:calc(100% + 40px)` sangrado | **MANTENER** — patrón móvil deliberado y correcto. |
| Títulos display `clamp()` hasta 15vw en home / historia | **VERIFICAR** — confirmar que no comen el primer viewport móvil sin avanzar contenido (criterio del brief). |

---

## 14. Código muerto / repetición (REMOVER)

1. `app/(editorial)/page.tsx` — `<header className="ev1-nav">` y `<footer className="ev1-footer">` (oculto por CSS, duplica shell global).
2. `app/(editorial)/historias/[slug]/page.tsx` — `<header className="ev1-nav">` (íd.).
3. `editorial.css` — reglas `.ev1-nav*` y `.ev1-footer*` una vez borrado el JSX.
4. `(editorial)/layout.tsx` — `RETIRE_DUPLICATE_CHROME` (`display:none` inline) deja de hacer falta si se borra el origen; hoy es un parche sobre código muerto.
5. Home `stories` array vs. `EDITORIAL_STORIES` — consolidar en una sola fuente (`editorialIndex.ts`).

---

## 15. Criterios de aceptación del brief — estado tras esta auditoría

| Criterio del brief | Estado |
|---|---|
| Sin imágenes de historias distintas contiguas de forma confusa | **OK** (home ya emparejada; verificar render móvil) |
| Sin imágenes rotas / casi invisibles | **OK por código + OMNI 09-02**; pendiente confirmación visual de esta pasada |
| Perfumistas con retrato en su biografía | **ABIERTO** — hoy cero retratos (P2/P4) |
| Discovery permite explorar familias y subfamilias | **ABIERTO** — es el mayor delta (D6–D9) |
| "El carácter detrás de las notas" removido o transformado | **ABIERTO** — identificado en ficha F3, sin tocar |
| Sin bloques decorativos sin función | **PARCIAL** — listados: F3, C2, Q2, D2, SB4, gradientes S6/§12 |
| ADN visual compartido Home/Magazine/Historias/Saber/Discovery/Personas/Club | **OK** — shell + tokens de la consolidación 09-02 |
| Mobile verificado por separado | **PARCIAL** — pendiente pasada renderizada |
| Sin cards genéricas por defecto | **OK** — no hay cards con sombra; hay grids planos a reforzar (M4) |
| Sigue sintiéndose Aromia | **OK** |

---

## 16. Fases propuestas (para priorización de Brey — ninguna ejecutada)

| Fase | Contenido | Riesgo | ¿Necesita aprobación extra? |
|---|---|---|---|
| **V1 — Limpieza** | Borrar nav/footer bespoke muertos (§14), consolidar `stories`→índice, quitar gradientes-placeholder detrás de slots resueltos | Bajo — solo resta código | No, más allá del PR |
| **V2 — Refuerzos in situ** | S5/S8 (Ropion sin imágenes, cierre → historia relacionada), M3/M4 (lead + grid de archivo), H5 (teaser Discovery), SB2–SB5 (apoyos didácticos Saber), C2/Q2 (reciclar decoración) | Bajo/medio — edición de layout/CSS, sin material nuevo salvo Saber/Ropion | Material documental nuevo = confirmar procedencia |
| **V3 — Ficha F3** | Remover o reciclar "El carácter detrás de las notas" / `EditorialMood` | Bajo — decisión de producto | Elegir A (remover) vs B (reciclar) |
| **V4 — Personas retratos** | Slot de retrato + fallback digno + ampliar modelo (casas, bio real) | Medio — modelo de datos + contenido | Generación de retratos (foto real vs IA con costo) |
| **V5 — Discovery explorador** | Nivel 1/2/3 familia→subfamilia→materia, red editorial (D6–D9) | Alto — superficie nueva grande | Alcance y datos (qué familias, qué se enlaza) |

Cierre de esta pasada: rama `feat/visual-ux-audit` con este documento, PR
abierto, **sin merge** (gate de aprobación + `main` protegida). No se tocó
código de producto.
