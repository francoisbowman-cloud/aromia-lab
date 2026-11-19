# Aromia — estado del plan maestro por hito (18 nov 2026)

**Rama:** `claude/aromia-integration` · **PR:** #214 (DRAFT, RELEASE HOLD) · **Progreso oficial: 1/10 certificados.**
Este informe separa lo **hecho y probado en local** de lo que **solo el Publisher puede conceder**. Ningún estado de `projectProgress.ts` cambia por este trabajo: los hitos se certifican por evidencia y autorización, no por esfuerzo.

## Resumen

| # | Hito | Estado oficial | Trabajo seguro hecho en esta pasada | Lo que impide certificar |
|---|---|---|---|---|
| 01 | Base editorial | **verified** | — | — |
| 02 | Intelligence runtime | in_progress | Registro 029, `health`, retención, ensayo local de scheduler/rollback (62 pruebas) | Staging aislado, scheduler y alertas reales, rollback con datos reales, aprobación Publisher |
| 03 | Piloto editorial | blocked | Verificador re-ejecutado: mismos bloqueos | Fact-check, revisión editorial humana y derechos de assets (decisiones humanas) |
| 04 | Integridad visual | in_progress | Sin cambios (requiere frascos reales y derechos) | Auditar frascos/variantes exactos, resolver bergamota con recurso aprobado |
| 05 | Living Edition | planned | Auditoría renderizada sin hallazgos (ver abajo) | Revisión de dirección de arte y piloto acotado con assets aprobados |
| 06 | Creative Studio | planned | Sin trabajo seguro: exige derechos y presupuesto | Piloto con costes/derechos supervisados |
| 07 | Marketing / Revenue | planned | **Corrección real:** enlaces Amazon en artículos ahora `sponsored nofollow` | Verificar en producción, analítica, atribución y campañas |
| 08 | Discovery / PWA | planned | Discovery y familias limpias; **hueco PWA detectado** | Iconos de marca (decisión del Publisher), manifest y política offline |
| 09 | OMNI | blocked | **Adaptador desacoplado** con 6 pruebas contra un doble local | Contrato real de OMNI sin verificar; habilitar solo con aprobación |
| 10 | QA integral / lanzamiento | blocked | — | Depende de todos los anteriores, producción, derechos y aprobación de lanzamiento |

## Hito 07 — corrección de divulgación de afiliados

`publicArticleHtml` (API) sobrescribía `rel` con `noopener noreferrer` en **todos** los enlaces, por lo que un enlace de Amazon dentro de un artículo de la revista nunca llevaba `sponsored`. Ahora los hosts de Amazon (y `amzn.to`, `amzn.eu`, `a.co`) salen con `sponsored nofollow noopener noreferrer` **aunque el editor escriba otro `rel`**; dominios parecidos (`amazon.com.evil.example`, `notamazon.com`) no se marcan. 5/5 en `test:content`. Los enlaces de código de home, ficha e historias ya lo llevaban. No se modificó ningún `href` ni la etiqueta de afiliado. **Efecto en producción: ninguno hasta que el Publisher mergee y despliegue.**

## Hitos 05 y 08 — auditoría renderizada local

> **CORRECCIÓN (misma jornada):** el resultado de abajo («0 hallazgos reales») **no es válido**. Esa corrida no aplicó el tema oscuro (el sitio ignora `prefers-color-scheme`) y la página de «artículo» auditada era la 404 (los artículos dan 500 en la API de producción). La auditoría rehecha, con sus defectos reales y correcciones, está en `docs/intelligence/LIVING-EDITION-QA-2026-11-18.md`. Se conserva el texto original solo como registro.

Chromium (Playwright, fuera del repo) contra `next dev` local con la API pública en solo lectura. 3 viewports (375, 768, 1280) × claro/oscuro. Rutas: `/`, `/magazine`, `/descubrir`, `/buscar`, `/quiz`, `/club`, `/privacidad`, un artículo, una historia, `/catalogo/loewe-001-man-edp`, `/descubrir/familias`, `/perfumistas`.

- **Resultado: 0 hallazgos reales** — sin desborde horizontal, sin imágenes sin `alt`, sin saltos de encabezado, 1 `h1` por página, sin enlaces/botones sin nombre, sin campos sin etiqueta, sin fallos de contraste medidos (WCAG 4.5/3), sin errores de consola ni respuestas ≥400, foco de teclado visible en los primeros 20 tab-stops.
- El único tab-stop «sin foco» era `<nextjs-portal>`, el overlay del modo desarrollo de Next (no es de Aromia).
- **Límites honestos:** el contraste sobre fondos con imagen o degradado no se mide (se omite); tipografía Newsreader no se carga en local (juicio tipográfico solo contra producción); no es una auditoría con lector de pantalla ni valida la calidad de diseño.
- **Hueco PWA (hito 08):** solo existe `favicon.ico`; no hay manifest, iconos 192/512, `theme-color` ni service worker. No se inventaron iconos: la identidad de marca es una decisión del Publisher.

## Hito 09 — adaptador OMNI

`apps/api/src/intelligence/omniAdapter.ts`. Contrato versionado `aromia-omni/1` **definido por Aromia**; no demuestra que OMNI lo implemente. **Desactivado por defecto**; en producción exige además `AROMIA_OMNI_PRODUCTION_APPROVED=true`.

- Configuración inválida falla cerrada, sin llamada de red: solo `https` (http solo loopback en tests), sin credenciales ni query en la URL, token ≥16 caracteres.
- Timeouts acotados, máximo 1 reintento con la misma clave de idempotencia (hash del cuerpo), `redirect: 'error'`, tope de tamaño de respuesta y validación estricta (contrato, veredicto `PASS|REVIEW|FAIL`, coste entero ≥0, referencia de evidencia).
- Coste: presupuesto por defecto **0**; se envía `x-aromia-max-cost-micros` y se descarta cualquier respuesta que lo exceda.
- Interruptor de circuito: solo fallos de transporte/5xx lo abren; 4xx y errores de contrato no. Recuperación tras enfriamiento con un intento de prueba.
- Un veredicto es **solo evidencia**: toda respuesta lleva `approval: 'not_granted'` y `publication: 'blocked'`. Los fallos devuelven un resultado tipado, nunca lanzan, nunca son `PASS`, y el texto de error del upstream y el token no aparecen en resultados ni auditoría.
- Trazabilidad: `traceId` por llamada (cabecera `x-aromia-trace-id`) y callback de auditoría sin payload ni token.
- Mutaciones verificadas: seguir redirects o quitar el límite de coste hace fallar los tests.

**Pendiente (no hecho a propósito):** ninguna ruta, CLI ni job usa todavía el adaptador; no se cambió el repositorio de OMNI; no se verificó versión ni disponibilidad de sus herramientas MCP.

## Verificación ejecutada (local, Windows, Node 20.20.2)

- `npm --prefix apps/api run test:intelligence`: **62/62**, 0 omitidos, contra PostgreSQL 16 desechable en `127.0.0.1:55432` (ya detenido).
- `test:content` 5/5; `tsc --noEmit` y build API limpios; `projectProgress.test.ts` 3/3.
- CI de GitHub del HEAD de este bloque: pendiente de leer.

## Lo que necesito del Publisher (sin esto no hay más hitos certificables)

1. **02:** autorizar o descartar un staging aislado; definir scheduler, canal de alertas y cadencia.
2. **03:** revisión humana (hechos, fuentes, derechos de las dos cápsulas) del piloto.
3. **04:** recurso aprobado para la bergamota y criterio para auditar frascos reales.
4. **08:** iconos/identidad para PWA y decisión de política offline.
5. **09:** contrato real de OMNI y si debe activarse el adaptador.
6. **07/10:** merge de #214 a `main` y deploy (la corrección de afiliados no está en producción hasta entonces).
