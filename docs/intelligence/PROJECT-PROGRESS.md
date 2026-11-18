# Aromia — Project progress and verified gates

The private admin now includes `/admin/progreso` (full milestone checklist) and an abbreviated progress bar on `/admin/operaciones`. The progress model is versioned in `apps/web/src/lib/projectProgress.ts`, with tests ensuring that only **verified** gates contribute to the numerator.

## Measurement policy
- At snapshot **2026-11-17**, 1 of 10 defined milestone gates has closed with explicit repository evidence: #186 was merged to main. The 10% display is **verified gate closure**, not a forecast of effort remaining, completeness of the website or confidence of production launch.
- In-progress branches, passing component CI, incomplete visual rights evidence, runtime pilots and editorial backlogs do **not** increment the numerator.
- Blocked/planned statuses remain visible with actionable next checks. Stage metadata is a manually reconciled, source-controlled snapshot. It is **not** real-time GitHub, production or Railway telemetry.
- Evidence links point to the relevant PR; GitHub CI job results must still be checked per commit. PR #187 onward remains unmerged unless later independently confirmed.
- To advance a gate, inspect the source, validate completion criteria, record a durable result, and update this file and `projectProgress.ts` in a reviewed commit. Never change the percentage just to show momentum.

## Safety
The progress view is private to the existing admin layout, consumes no paid external services, stores no secrets and does not grant publishing or merging authority. It does not alter the source-only YouTube channel policy: **only the Publisher selects channels; no registry is auto-populated**.

## Existing visual-review feature
PR #194 inspector web CI initially found two test/typing issues; they were corrected without weakening lint, with commit `9cdfcec` for Sharp typing and `6282de9` for the reserved variable. Latest full web CI must still be checked before calling this chain green. Deployment and full browser QA remain separate.

## GitHub activity feed (incremental tranche)

The private `/admin/progreso` page also has a **live read-only PR status panel** through `GET /api/admin/progress-status`. Only the fixed list of Aromia PRs #186–#195 is requested from GitHub REST. The feed provides PR number, draft/open/closed/merged state, head SHA and source URL; it always states `ciVerifiedByThisFeed:false`. A PR merge, PR status or new commit **never** changes the numerator of verified milestones.

The server endpoint requires an existing signed admin session and server-side `ADMIN_API_TOKEN`. If the repository is private or anonymous API access is limited, configure the **server-only** `GITHUB_PROGRESS_TOKEN` with minimum read-only repository permission; never expose it to client JS or an artifact. Do not grant write or merge privileges to this token. If GitHub is inaccessible or responds unexpectedly, the page reports that the feed is unavailable and **does not** manufacture success or change the local snapshot.

The feed is not an Actions CI verifier and does not query deployments, Railway, product photos, image licensing or publishing rights. The source-controlled milestone snapshot remains the authority for declared *closed gates* until evidence is reviewed and updated. No automation may promote gate status solely because a PR has merged.

## Continuidad de bloques largos — 18 de noviembre de 2026

**Estado oficial sin cambios:** **1/10 hitos certificados (10%)**. Esta barra mide exclusivamente gates formalmente cerrados, no esfuerzo, commits o CI. `█░░░░░░░░░` **1/10**.

**Hito 02 / Intelligence:** la rama integrada #214 superó PostgreSQL aislado, fencing de workers, reintentos, agotamiento de intentos y QA en Chromium en SHA `2ca9c85`; **runtime de producción y orquestación autónoma aún no certificados**. No elevarlo a VERIFIED.

**Hito 03 / piloto editorial:** un único artículo histórico (ítem 61) tiene ahora verificador read-only, pruebas, dos cápsulas de Art Direction, matriz de ocho afirmaciones con fuentes y propuesta de edición. El preflight encontró cinco URL, tres capturas, una coincidencia de extracto y dos fallos de recuperación; no son aprobaciones factuales. La implementación del verificador y sus tests fueron validados en workflow de integración run `44341165119` sobre SHA `a996cf7`. Las revisiones humana, factual, de fuentes, derechos, assets y QA final siguen bloqueadas. **No cerrar gate 03.**

**Hito 04 / fidelidad visual:** las cápsulas del piloto evitan frascos comerciales; no se generaron imágenes ni se declaró que estuvieran licenciadas. La política de fidelidad por producto/variante no cambia. **No cerrar gate 04.**

**Control transversal:** #214 sigue DRAFT / RELEASE HOLD; merge a `main`, deploy, publicación, migraciones reales, gastos y aprobación de assets requieren consentimiento nuevo del Publisher. Para continuidad revisar `docs/handoffs/AROMIA_LATEST.md` y CI del HEAD.

---

