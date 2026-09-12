# Brief para Design — 3 frentes de WS-6 desbloqueados por el piloto OMNI

### Preparado por Code · 2026-09-12
### Fuente de verdad: `handoffs/AROMIA_OMNI_PRODUCT_IMAGE_INTEGRATION_2026-09-11.md` (§13.1, §14, §15, §18) · `docs/images/OMNI-PILOT-RESULTADOS-2026-09-12.md` · `ticket-diseno-aromia-punta-a-punta.md` (WS-6)

---

## 0. Antes de empezar

1. **Regla operativa sin excepción:** Design decide y compone (mockups +
   especificación de relaciones + decisiones); Code implementa, versiona y
   despliega. Design no hace `git commit`/`push`. Dejá los entregables listos
   (mockups, specs, decisiones por escrito) y Code los traduce a componentes
   en rama + PR.
2. Leé del repo, no de memoria de sesión: `AROMIA_CURRENT_STATE.md` (relay
   v49, ya refleja este cierre), `docs/images/OMNI-PILOT-RESULTADOS-2026-09-12.md`
   (qué cutout existe de cada perfume y por qué), `apps/web/src/lib/perfumeCutouts.ts`
   (los 7 slugs reales, comentario explica el criterio).
3. **Los 7 assets reales son estos, ni uno más:** `bleu-de-chanel-edp`,
   `chanel-no5-edp`, `santal-33-edp`, `aventus`, `molecule-01`,
   `acqua-di-gio-edt`, `nishane-hacivat` — en
   `apps/web/public/perfumes/cutouts/<slug>.webp`, canal alfa real. Cualquier
   otro perfume del catálogo (118 restantes + `oud-wood` + los 2 casos con
   caja) sigue sin cutout — cae al fallback CSS (Opción A: máscara + `mix-blend`),
   **no lo tratés como si tuviera imagen de producto real.**
4. **QA de light/dark pendiente (handoff §13.1) — hacelo antes de dar por
   bueno cualquier composición.** El gate exige que el mismo asset funcione
   sin corrección CSS específica por tema, sin caja blanca/halo/matte, y con
   vidrio/reflejos intactos en ambos fondos. Esta sesión solo verificó los 7
   assets con una prueba de contraste (fondo magenta, para confirmar canal
   alfa real) y un render local de `nishane-hacivat` — **no** el sweep
   completo claro/oscuro/viewports que pide el handoff. Si al componer ves un
   halo o caja blanca en algún cutout, es un hallazgo real, no una regresión
   tuya: reportalo.

---

## Encargo A — Fragancias: de índice tipográfico a índice editorial de objetos (§15)

| Campo | Valor |
|---|---|
| Hallazgo del handoff | El índice de fragancias es "elegante y limpio" pero es esencialmente texto: marca + nombre + familia. Se siente cerca de una base de datos. |
| Dónde vive hoy | Dos superficies typográficas puras, **sin ninguna imagen**: (1) sección "Fragancias" de `/buscar` — `apps/web/src/components/discovery/DiscoverySearch.tsx` (grid de resultados de perfume); (2) "Fragancias relacionadas" en `/descubrir/familias/[familia]` — `apps/web/src/app/descubrir/familias/[familia]/page.tsx`. |
| Objetivo | Dar señal visual suficiente para anticipar el objeto al entrar a la ficha, sin convertirlo en shop grid. |
| Restricciones duras (handoff) | Conservar protagonismo del nombre y la navegación · miniaturas/hover/reveal/escala solo donde mejoren reconocimiento, no de relleno · **evitar cuadrícula uniforme de producto** · **cero precio, badges o lenguaje de tienda** · mobile necesita su propia reinterpretación, no depender de hover. |
| Alcance real hoy | Solo 7 de 125 perfumes tienen cutout real. La composición tiene que decidir **qué hacer con los otros 118** en la misma grilla — ¿se quedan puramente tipográficos y los 7 con cutout se destacan?, ¿se oculta la imagen hasta que haya más cobertura?, ¿otra idea? Esa decisión es tuya, documentala. |
| Entregable | Mockup(s) + especificación de qué componente cambia y cómo se comporta con cutout vs. sin cutout, en light y dark. |

---

## Encargo B — Historias: convertir el archivo en superficie editorial con ritmo (§14)

| Campo | Valor |
|---|---|
| Hallazgo del handoff | El archivo de Historias es limpio pero plano: título + título + título, sin jerarquía real aunque la tipografía sea correcta. |
| Dónde vive hoy | `apps/web/src/components/magazine/EditorialArchive.tsx` (listado de `/magazine`). |
| Objetivo | Introducir jerarquía real: variar escala, densidad, aire y presencia visual entre piezas — algunas con imagen, otras tipográficas, otras como pausa. Sin volver esto una cuadrícula de cards uniformes. |
| Restricción dura | Solo usar visuales con **relación editorial real** con la historia — no imagen decorativa genérica. |
| Nota | Este frente **no depende de los cutouts de producto** ni del piloto OMNI — es composición pura sobre contenido editorial ya existente. Podés arrancarlo en paralelo al A y al C. |
| Entregable | Mockup(s) del archivo con al menos 2-3 niveles de jerarquía visual + criterio escrito de qué historia entra en cada nivel. |

---

## Encargo C — Saber: dirección visual de materiales con estándar editorial alto (§18)

| Campo | Valor |
|---|---|
| Hallazgo del handoff | 5 materiales señalados por Publisher como por debajo del nivel de publicación: **bergamota, limón/cítricos, incienso, salvia sclarea, pachulí**. |
| Dónde vive hoy | `apps/web/src/app/academia/page.tsx`, constante `materialStrip` — ya son fotos documentales locales con licencia CC (no hotlinked), pero la calidad/composición no alcanza el estándar que pide Publisher. |
| Criterio de selección (orden de prioridad) | 1) fotografía documental/botánica real de calidad editorial con licencia válida; 2) fuente institucional/archivo fiable; 3) generación asistida por IA **solo si no hay fuente adecuada o la pieza necesita interpretación controlada**. |
| Si se usa IA | Debe generarla **ChatGPT** (no Code, no Design) — regla dura del manual operativo. Reglas de fidelidad: conservar morfología real del material, no inventar flores/hojas/resinas/frutos, evitar "AI look" (brillo artificial, simetría excesiva, perfección plástica), debe ser reconocible sin depender del rótulo. Caso especial incienso: dejar claro si se muestra resina, materia prima, humo/ritual o árbol — no una imagen ambigua solo por ser atmosférica. |
| Entregable | Por cada uno de los 5 materiales: fuente propuesta (documental real o brief de generación para ChatGPT) + composición dentro de `materialStrip`. |

---

## Qué NO es parte de este brief (decidido o pausado, no lo reabras sin pedirlo)

- **`oud-wood`** tiene cutout real pero con un artefacto de borde (hueco
  magenta en la unión tapa/cuello) — archivo guardado en el repo, **no
  registrado** en `PERFUME_CUTOUTS`. Si Design quiere sumarlo al lote
  aprobado, es una limpieza de imagen (OMNI/Code), no un tema de composición.
- **`baccarat-rouge-540-edp`** y **`1-million`** — Brey decidió explícitamente
  dejarlos con su foto de caja de retail por ahora. No re-sourcing, no imagen
  IA, sin fecha. No los trates como pendientes de este brief.
- **D-5** (ticket maestro, abierto): tratamiento en modo oscuro del fallback
  Opción A para los perfumes **sin** cutout — ya resuelto de hecho para los 7
  con cutout real (el alfa flota igual en ambos temas), pero sigue abierto
  para el resto del catálogo. Es una decisión aparte, no de este brief, pero
  si Design la resuelve de paso al trabajar el Encargo A, documentala.

---

## Cómo entregar

Dejá mockups + especificación en el repo (imágenes/Figma-export donde
corresponda, decisiones en Markdown) y avisale a Brey. Code no arranca
implementación de ninguno de los 3 encargos sin el entregable de Design —
"Design decide y compone" sigue aplicando acá igual que en el resto del
ticket maestro.
