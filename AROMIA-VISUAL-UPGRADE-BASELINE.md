# Aromia Visual & Conversion Upgrade — Baseline & Creative Plan

**Fecha:** 2026-08-08
**Autor:** Code (Claude Code)
**Rama:** `feat/aromia-visual-conversion-upgrade` (no se tocó `main`)
**Fase:** V0 (baseline) + arranque de V1 (dirección) — primer entregable pedido por Brey antes de prototipar nada

**Alcance de este documento:** diagnóstico + dirección propuesta. No incluye una sola línea de UI de producción todavía — es exactamente lo que pidió el brief ("no empieces haciendo una remodelación completa a ciegas").

**Estado verificado antes de escribir esto:** `main` al día con origin, sin PRs propios pendientes (el único PR abierto es [#10](https://github.com/francoisbowman-cloud/aromia-lab/pull/10) "Fase 3 — pipeline de catálogo", **no tocado, no inspeccionado más allá de su título/rama** por instrucción explícita). Producción real revisada en `aromialab.com` (Home) contra el código real de `apps/web/src/app/page.tsx` y sus componentes. `ESTADO-aromia.md` y `CHANGELOG-2.0.md` leídos hasta la entrada de cierre del RC (2026-08-08, decisión #102) — el ciclo de auditoría anterior está cerrado, esta fase arranca sobre una base estable.

---

## 1. Estado visual real actual

Aromia 2.0 ya tiene un sistema de diseño real, no un sitio sin estilo — esto importa porque cambia el punto de partida: no estamos yendo de "cero" a "premium", estamos yendo de "correcto y consistente" a "evidente en segundos".

**Lo que existe hoy (verificado en código + producción):**

- **Sistema de tokens real** (`tailwind.config.ts` + `globals.css`): dos temas (Ivorio claro / Grafito oscuro) vía `data-theme`, con paleta cálida marfil/oro/tinta, persistida en `localStorage`, sin flash de tema al cargar. Documentado en `GUIA-VISUAL-aromia.md`.
- **3 familias tipográficas con roles definidos**: Cormorant Garamond (display/headings), Archivo (UI/body), IBM Plex Sans (editorial largo) — cargadas vía `next/font/google`, no CDN.
- **Regla de imagen ya establecida**: `object-contain` siempre para producto, nunca `cover`; ratios fijos por rol (catálogo 1:1, ficha 4:5, banners 16:10); recorte de fondo blanco vía análisis de canvas (`useProductImageCrop`), no un simple `object-fit`.
- **shadcn/ui** como capa de componentes base, código propio en `src/components/ui/`.
- **Home**: hero de dos columnas (copy + `HeroEditorPick` rotando 5 perfumes), contador de stats (50 fragancias / 8 familias / 6 filtros), carrusel de reseñas destacadas, grid "Ecosistema" (5 accesos), grid "Explora por notas" (tiles con foto real + gradiente de marca), CTA de Magazine, CTA de Quiz, CTA de Club, formulario de newsletter.
- **Ficha de producto**: `HeroHeader` → `PriceTable` (con disclosure de afiliado) → `PerformanceBars` (barras animadas longevidad/estela/proyección) → `SkinEvolution` (pirámide olfativa interactiva de 3 etapas clickeables) → `EditorialMood` → `CommunityReviews`.
- **Magazine**: hub con nav de categorías + grid editorial asimétrico (`.75fr/1fr/.55fr`) + cover story full-bleed + lector con `react-pageflip` (page-flip real) + vista de impresión propia con reglas `@media print` dedicadas.
- **Quiz**: stepper de 6 preguntas, opciones en grid 2 columnas, barra de progreso segmentada, resultado por perfil con matching por tags.
- **Motion**: 100% CSS (Tailwind transitions, un keyframe de fade, `requestAnimationFrame` manual en las barras). **Cero librería de animación instalada** — no hay `framer-motion`, GSAP ni `react-spring` en `package.json`.
- **Accesibilidad y SEO**: foco visible consistente (`focus-visible:ring-2`), `prefers-reduced-motion` respetado globalmente, JSON-LD por producto, metadata única por perfume — trabajo real del ciclo de auditoría recién cerrado (decisión #102).

**Diagnóstico honesto:** el sistema es **coherente, prolijo y correcto** — pero cada pieza fue construida como respuesta a un ticket puntual (accesibilidad, SEO, un componente a la vez), no desde una dirección de arte unificada pensada de punta a punta. El resultado se lee como "una tienda de perfumes bien hecha con secciones editoriales", no como "una revista de lujo que también vende". Es la diferencia entre un sitio *correcto* y un sitio que genera deseo al entrar.

## 2. Principales debilidades perceptuales

Esto no es una auditoría técnica (ya se hizo, está cerrada) — es específicamente lo que un visitante *siente* al entrar, comparado con el estándar de publishing editorial de lujo que pide el brief:

1. **Sin foto hero propia.** El hero de Home no tiene una imagen editorial protagonista — es texto + un carrusel rotando fotos de producto ya usadas en el catálogo. Una revista de lujo abre con una escena, no con un widget.
2. **Motion inexistente como lenguaje.** Todo lo que se mueve hoy es utilitario (hover lift, fade de rotación, barra de progreso) — no hay *reveals*, scroll storytelling, ni transición entre estados que comunique "premium". El brief pide explícitamente esto como pieza central.
3. **Ritmo plano.** Las secciones de Home tienen casi el mismo peso visual y el mismo patrón (eyebrow + título + CTA en tarjeta con `shadow-lux`) repetido 4-5 veces seguidas — sin una jerarquía clara de "esto es lo más importante, esto es secundario".
4. **La ficha de producto se siente a datos, no a objeto de deseo.** `HeroHeader` es imagen + lista de definiciones. Falta composición: la imagen del perfume no tiene escena, sombra dramática ni contexto — es el mismo recorte de catálogo, más grande.
5. **El Magazine tiene la pieza técnica más fuerte (page-flip real) pero el hub que lleva ahí es genérico** — grid de cards, no siente a portada de revista.
6. **Quiz funciona pero no vende la fantasía de "descubrí tu identidad olfativa"** — es un formulario con estética de tarjeta, no una experiencia.
7. **Whitespace y escala tipográfica conservadores.** `h1` de Home tope en 56px desktop — bajo para un "salto perceptual evidente en segundos". La escala tipográfica no tiene una nota realmente grande (editorial hero type) en ningún punto del sitio.
8. **Sin narrativa sensorial.** El brief pide "storytelling sensorial" — hoy no hay ningún tratamiento que comunique olfato/textura/atmósfera (no hace falta anteproyecto de nuevas fotos aún, pero sí composición: overlays, tipografía de acento, curaduría de negativo space).

## 3. Qué conservaría (no se toca sin razón)

- **El sistema de tokens de color (Ivorio/Grafito)** — ya resuelve contraste WCAG en ambos temas con `gold-contrast` fijo. Evolucionar la paleta, no reemplazarla desde cero.
- **La regla de imagen `object-contain` + recorte de canvas** — es una decisión de producto ya validada (fidelidad de producto, no inventar), no negociable dentro de esta fase.
- **Las 3 familias tipográficas y sus roles** — Cormorant/Archivo/Plex ya dan una identidad reconocible; el problema es la escala y el uso, no la elección.
- **`react-pageflip` en Magazine** — es la pieza más distintiva que ya existe, se mantiene, incluso podría destacarse más.
- **Accesibilidad, `prefers-reduced-motion`, SEO/JSON-LD, disclosure de afiliado** — todo esto es trabajo reciente y correcto; cualquier rediseño visual tiene que preservarlo explícitamente (es un criterio de aceptación del brief).
- **shadcn/ui como capa base** — se extiende con variantes nuevas, no se reemplaza por otra librería de componentes.

## 4. Visual DNA propuesto

Antes de proponer una sola dirección, esto es exactamente el tipo de decisión que el brief pide frenar y llevar a Brey: **hay más de un camino razonable y son visualmente muy distintos.** Propongo 3 direcciones, todas construidas sobre los tokens/tipografía que ya existen (evolución, no reemplazo de infraestructura), para elegir antes de prototipar en alta fidelidad.

### Dirección A — "Atelier Ivorio" (evolución cálida, bajo riesgo)
Profundiza el tema claro actual: tipografía display mucho más grande y protagonista, fotografía de producto con sombra dramática y fondo texturizado sutil (no blanco plano), mucho más whitespace, motion de *reveal* suave en scroll. Es "lo que Aromia ya es, pero con la valentía que hoy le falta". Riesgo más bajo de que se sienta "otro sitio" — riesgo de que el salto perceptual sea menos evidente si no se ejecuta con disciplina tipográfica fuerte.

### Dirección B — "Maison Grafito" (editorial oscuro, alto impacto)
El tema oscuro (Grafito) pasa a ser el default de la experiencia pública, no una opción secundaria de toggle — fondo casi negro, oro como acento de alto contraste, fotografía de producto con iluminación dramática tipo *product hero* de fragancia de lujo, tipografía display muy grande sobre fondo oscuro. Es el territorio visual más cercano a "beauty/fashion editorial premium" (Byredo, Le Labo, revistas de fragancia). Mayor impacto perceptual inmediato — mayor riesgo de legibilidad/contraste si no se ejecuta con cuidado, y cambia la primera impresión de "cálido" a "sobrio/exclusivo" (cambio de personalidad de marca, no solo de piel).

### Dirección C — "Doble portada" (híbrido por momento, más ambicioso técnicamente)
Home y Magazine usan una composición más oscura/editorial (como B) para la fantasía y el storytelling; Catálogo y Ficha de producto se quedan en un tratamiento más claro/neutro (evolución de A) porque ahí el objetivo es claridad de decisión de compra, no atmósfera. Es la dirección con más potencial de "revista + tienda a la vez" bien diferenciado por función — pero exige mantener ambos lenguajes coherentes entre sí (mismo tipo, mismo motion, misma mano) y es más trabajo de sistema (dos superficies de tokens en vez de una).

**Punto de decisión — necesito que Brey elija entre A, B o C (o pida variantes) antes de que se construyan prototipos de alta fidelidad.** No es un detalle de implementación: cambia la personalidad de marca percibida, no solo el CSS.

## 5. Design System que evolucionaría

Independientemente de qué dirección se elija, esto se construye para las 3:

- **Escala tipográfica nueva**: agregar un salto "hero editorial" (ej. 72-96px desktop) que hoy no existe en ningún lado del sitio — reservado para momentos insignia, no para todo título.
- **Sistema de motion como tokens**, no CSS suelto: duraciones/easings nombrados (`--motion-reveal`, `--motion-hover`, `--motion-page`), reveals de scroll reutilizables, transición de imagen consistente. Se define una sola vez, se aplica en los 4 momentos.
- **Tratamiento de imagen "hero"** nuevo, distinto del tratamiento "catálogo" ya validado — mismo `object-contain`, pero con capa de composición (sombra, fondo, overlay) para escenas, no solo recortes de producto.
- **Sistema de cards evolucionado**: hoy casi todas las cards comparten el mismo patrón (`border + shadow-lux + rounded-card`); se necesita variación de peso visual (card "insignia" vs card "utilitaria") para dar jerarquía real.
- **Grid/ritmo vertical**: definir un ritmo de espaciado entre secciones que no sea uniforme (hoy todo respira igual) — más aire alrededor de los momentos que deben destacar, menos alrededor de los utilitarios.

## 6. Estrategia de imágenes

Alineado con el brief: **no se regeneran cientos de imágenes en esta fase.** Concretamente:

- Reutilizar los assets reales ya existentes (fotos de producto reales, 38 perfumes con foto real desde el 21/07) para toda la ficha/catálogo — la fidelidad de producto no se toca.
- Para el **hero de Home** y **cover de Magazine**, evaluar 2-4 composiciones editoriales nuevas (fondo, atmósfera, iluminación) usando los assets de `public/ovl/` ya existentes como punto de partida, más — si la dirección elegida lo requiere — 1-2 hero assets nuevos generados puntualmente vía Omni/Image Toolkit **como piloto acotado**, no como producción masiva. Esto es justo el tipo de decisión que puede necesitar aprobación de gasto de API si se generan imágenes nuevas — se marca explícitamente antes de ejecutar, no se asume.
- El **"NEW PERFUME VISUAL CONTRACT"** que pide el brief (qué asset/formato/ratio necesita cada perfume nuevo) se redacta recién cuando Home + Product + Magazine + Quiz ya tengan su lenguaje aprobado — es una salida de esta fase, no un insumo.

## 7. Estrategia de motion

- Base: **CSS/Tailwind + Web Animations API nativa** donde alcance (reveals simples, hover, transiciones de imagen) — se mantiene la filosofía actual de "sin dependencia pesada".
- Evaluar **Framer Motion solo si** el scroll storytelling / composiciones sticky de la Dirección B o C lo requieren de forma que CSS puro no resuelva limpio (orquestación de secuencias, `AnimatePresence` para el lector de Magazine, gestos). Es la única dependencia grande candidata de esta fase — **se pide aprobación antes de instalarla**, no se asume.
- No tocar `react-pageflip` — ya cumple su función, se integra con el motion nuevo alrededor, no se reemplaza.
- `prefers-reduced-motion` y performance (Core Web Vitals) son criterios de aceptación explícitos del brief — cualquier motion nuevo se prueba en ambos modos antes de aprobarse, mobile primero.

## 8. Estrategia de conversión

Recorridos a rediseñar con más intención (todos ya existen técnicamente, hoy compiten por atención en vez de guiar):

- **Home → Discovery/Quiz**: hoy es una card genérica a mitad de página. Con mejor jerarquía puede convertirse en la segunda invitación más fuerte de Home, no una sección más.
- **Home → Ficha**: el hero rotativo + carrusel ya cumplen esto — el trabajo es de composición/impacto, no de arquitectura nueva.
- **Magazine → Ficha**: los artículos ya referencian perfumes por nombre (`perfumes: [...]` en el front-matter / cruzable por nombre) — verificar que el cruce a "perfumes mencionados en este artículo" con link directo esté bien resuelto visualmente, es una conversión de alto valor (lector interesado → producto) hoy poco explotada.
- **Ficha → afiliado**: `PriceTable` ya trackea `affiliate_click` (GA4, cerrado 2026-08-07) — el rediseño debe mantener o mejorar la prominencia del CTA sin sacrificar el disclosure de afiliado (obligación legal ya resuelta, no se toca).
- **Contenido → newsletter/Club**: ya existen como secciones de Home; se evalúa si deben vivir también en el cierre del Magazine (patrón común en publishing: CTA de suscripción al final del artículo, hoy no existe ahí).

No se convierte a Aromia en e-commerce genérico en ningún punto de este plan — cada recorrido de conversión se apoya en contenido editorial, no en mecánicas de tienda (banners de descuento, urgencia artificial, etc.).

## 9. Plan de los 4 momentos insignia

Orden de trabajo dentro de V2 (prototipos) y V4 (implementación), ambos en ese orden — Home primero porque define el lenguaje que todo lo demás hereda:

1. **Home** — define Visual DNA aplicado: hero, jerarquía, motion base, primer ritmo vertical real.
2. **Ficha de producto** — el momento de mayor intención de compra; hereda el lenguaje de Home pero resuelve claridad de decisión, no solo atmósfera.
3. **Magazine** — hub + lectura; aprovecha `react-pageflip` ya existente, sube el hub al nivel del lector.
4. **Discovery/Quiz** — convierte el formulario en experiencia; el que más se beneficia de motion narrativo (revelar el perfil como un "resultado" con peso, no un state change plano).

Después, propagación (fuera de esta fase, según el brief): Catálogo → Academia → Club.

## 10. Orden de implementación sugerido (dentro de cada momento)

Por momento insignia: **concepto → aprobación de Brey → construcción real → responsive → accesibilidad → performance → QA visual → before/after → merge**. No se salta la aprobación entre concepto y construcción real — es exactamente el gate que pide el brief antes de "reescribir producción a ciegas".

## 11. Riesgos

- **Deriva de alcance**: "experiencia a otro nivel" es subjetivo por diseño — sin los 4 momentos aprobados uno por uno, el riesgo es iterar indefinidamente sin cerrar nada. Mitigación: gate de aprobación explícito por momento (sección 10).
- **Performance**: motion + imágenes hero más pesadas pueden degradar Core Web Vitals si no se miden. Mitigación: medir antes/después de cada momento, no al final de toda la fase.
- **Conflicto de superficie con PR #10**: si la dirección elegida toca `catalogo/[slug]/page.tsx` o componentes de perfume de forma profunda, hay solapamiento potencial de archivos con el trabajo de expansión de catálogo en curso (aunque #10 es de datos/pipeline, no de UI — riesgo bajo pero se documenta si aparece).
- **Cambio de personalidad de marca** (Dirección B/C): pasar a un tema oscuro por default es una decisión de identidad, no solo visual — si se elige sin convicción plena, genera retrabajo caro más adelante.
- **Gasto de API para imágenes nuevas**: cualquier generación real vía Omni/GPT Image tiene costo — no se ejecuta sin aprobación puntual, como ya es la norma del proyecto.

## 12. Dependencias

- Aprobación de Brey sobre la Dirección A/B/C (sección 4) — bloquea el inicio de V2 (prototipos de alta fidelidad).
- Decisión sobre si se instala Framer Motion (sección 7) — bloquea cualquier motion que exceda CSS simple.
- Ninguna dependencia de PR #10, Postgres, Railway ni credenciales para V0-V2 (todo el trabajo de esta fase hasta prototipos es frontend/estático, sin tocar datos reales).

## 13. Qué puede ejecutarse autónomamente

Sin necesitar aprobación puntual (según el brief, "mínima microgestión"):

- Construir prototipos de alta fidelidad de la dirección elegida (una vez elegida).
- Todo el detalle de implementación: spacing, breakpoints, refactors chicos, estructura de componentes.
- Reutilización de assets reales existentes.
- Motion basado en CSS/Web Animations dentro de lo ya evaluado en sección 7.
- QA de accesibilidad/performance/responsive de cada momento antes de pedir aprobación de merge.

## 14. Qué decisiones necesitan aprobación de Brey

- **Elegir entre Dirección A / B / C (o una variante)** — sección 4, bloqueante para arrancar V2.
- Instalar Framer Motion u otra dependencia de motion nueva (sección 7).
- Generar imágenes nuevas vía Omni/GPT Image API (cualquier gasto real) (sección 6).
- Cambiar el tema por default del sitio público si se elige Dirección B (identidad de marca, no solo UI).
- Cualquier merge a `main` — se sigue la protección de rama existente (PR obligatorio, sin push directo).
- Cualquier decisión que el manual operativo o `ESTADO-aromia.md` ya marca como gate de Brey (datos reales, Postgres, Railway/secrets — ninguna aplica todavía en esta fase).

## 15. Definición objetiva de "Aromia a otro nivel"

Se considera lograda cuando, para cada uno de los 4 momentos insignia:

1. Un before/after side-by-side hace evidente el salto en menos de 3 segundos de mirar la imagen, sin necesitar explicación.
2. La jerarquía tipográfica tiene al menos un momento "grande" real (no solo variaciones de 24px→32px) por página.
3. Existe al menos un tratamiento de motion que no sea hover/fade utilitario (reveal, transición de imagen, secuencia).
4. Lighthouse (performance + accesibilidad) no baja respecto al baseline actual en producción.
5. El recorrido de conversión relevante a ese momento (sección 8) es igual o más claro que hoy, no solo más bonito.
6. Un usuario que conocía el sitio anterior lo reconoce como Aromia (misma paleta base, misma tipografía, mismo carácter editorial-comercial) — evolución, no rebrand.

---

## Cómo vamos a comparar propuestas antes de desplegar nada

Dos etapas, de menor a mayor fidelidad — nada de esto toca `main` ni producción real:

1. **Comparación de concepto (V1→V2 temprano):** mockups estáticos HTML/CSS de alta fidelidad (Artifacts), uno por dirección (A/B/C), usando datos reales del catálogo (nombres, precios, fotos reales vía URL pública) pero sin ser código de producción — esto permite ver y comparar las 3 direcciones lado a lado en minutos, sin tocar el repo. Es el paso inmediato después de que Brey elija entre A/B/C, para afinar antes de programar nada real.
2. **Prototipo de alta fidelidad (V2 real):** una vez elegida la dirección, se construye como rutas internas dentro de esta misma rama (`feat/aromia-visual-conversion-upgrade`), con prefijo `/preview/*` — `noindex`, sin link desde la nav pública — usando los componentes/datos reales del sitio. Se revisa corriendo `npm run dev` local (o el dev server vía el Browser pane) contra la API real de producción (solo lecturas GET, mismo patrón ya usado en el proyecto) para ver la experiencia con datos reales sin riesgo de escritura. Cuando el prototipo se aprueba, se reemplaza la ruta real y se abre PR normal — no se despliega nada experimental a `aromialab.com` en ningún punto intermedio.

---

## Próximo paso

Este documento es el entregable de V0 + arranque de V1. **Punto de decisión que detiene el avance**: elegir entre Dirección A ("Atelier Ivorio"), B ("Maison Grafito") o C ("Doble portada") — sección 4. Con esa elección, el siguiente paso es construir los mockups comparables de la dirección elegida (o, si Brey quiere verlas primero en paralelo, las 3 en baja fidelidad) antes de tocar componentes reales del sitio.
