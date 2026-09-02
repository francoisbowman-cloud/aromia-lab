# Aromia — OMNI Render QA Closeout — 2026-09-02

Status: **CLOSED — technical rendered/browser gate PASS**

This closeout records the first real-browser regression pass performed after the 2026-09-02 UX/UI/information-architecture consolidation. It replaces the previous repository limitation that browser/screenshot evidence was unavailable.

## Scope

Target: `https://www.aromialab.com`

OMNI used its Playwright-backed actual-product observer through the reusable Render QA operator. The final verified run observed the following 11 public surfaces at two viewports each:

- mobile: 390 × 844
- desktop: 1280 × 900

Routes:

1. `/`
2. `/magazine`
3. `/historias/el-coleccionista`
4. `/academia`
5. `/perfumistas`
6. `/perfumistas/dominique-ropion`
7. `/descubrir`
8. `/quiz`
9. `/buscar`
10. `/club`
11. `/catalogo/black-afgano`

The renderer captured screenshots and measured browser/runtime evidence including horizontal overflow, clipped text, console errors, page errors, near-field defects and measured hierarchy/interaction signals.

## Product corrections made from rendered evidence

Aromia corrective PR: `#127` — **Close OMNI Render QA findings**

Merged production commit:

`7315d3f2fd94b037c73dd047cd8f5e13fbcb0409`

Changes were deliberately narrow and evidence-driven:

- Home: removed the decorative `RESINA · TERRITORIO · ENCUENTRO` marker after Chromium showed it as both clipped and effectively illegible. The editorial composition remained unchanged.
- `El coleccionista`: raised the story-local steel annotation color from `#6f767c` to `#62696f`, clearing the 4.5:1 text-contrast threshold without changing the composition, typography hierarchy or approved Asset A.
- Club: preserved the accessible newsletter label but moved it off-screen without the intentional 1 px clipping used by `sr-only`, eliminating a false clipped-visible-text signal while retaining the accessible name.

GitHub evidence for the corrective head:

- v2.0 CI run `33660677100`: **SUCCESS**
- Aromia Strict Audit run `33660677741`: **SUCCESS**

Railway production deployment:

- deployment `d33eaf73-2805-49cd-a1c9-3e495ef43bb5`: **SUCCESS**
- private catalog preflight: `PASS source=private count=125`
- production build: compiled successfully; 29/29 static pages generated
- Next.js runtime ready in 524 ms

## OMNI capability corrections made during the audit

The audit also revealed places where the auditor itself needed to become more trustworthy rather than forcing Aromia to conform to weak heuristics.

### Render QA operator

`image-toolkit` PR `#75`, merged as:

`eac35cb82d74bbf543dd87a0846236417ad1c362`

This established a reusable, product-neutral multi-route operator over the existing Playwright actual-product observer. It persists screenshots/reports and exposes actionable browser evidence. It does not contain Aromia-specific rules.

### Strict technical gate vs contextual visual evidence

`image-toolkit` PR `#76`, merged as:

`d73f7133eb9593ef22305db2cdf8ee007817507e`

Context-sensitive signals such as edge collision, unequal child heights and frame-in-frame remain visible evidence, but no longer change the strict technical gate by themselves. They require Taste/human interpretation. Stable defects such as clipping, overflow, runtime errors, contrast failures and genuine broken media remain gating.

This distinction prevented deliberate editorial asymmetry in `El coleccionista`, Personas, Quiz and Club from being “fixed” merely to satisfy a generic layout heuristic.

### Independent verification of browser-unloaded media

`image-toolkit` PR `#77`, merged as:

`2f709e88b47613ed6cdbd2459c88c1aaaffb5069`

A mobile Discovery pass reported three lazy images as unloaded in the DOM while desktop loaded the same surface. OMNI now independently verifies a broken-media-only same-origin `src` before blocking. A reachable 2xx image response resolves the browser loading-state ambiguity; a missing/non-image endpoint remains a failure.

In the final run, all three Discovery image endpoints were independently verified as real reachable images:

- `/api/catalog-image/loewe-001-woman-edp` — reachable image: true
- `/api/catalog-image/1-million` — reachable image: true
- `/api/catalog-image/212-vip-edp` — reachable image: true

No catalog UI or image-loading behavior was weakened to make the audit pass.

## Final rendered/browser gate

OMNI verified Render QA Railway deployment:

`509bee11-a90a-4f5b-8efc-ae37953a7b6b`

OMNI source commit:

`2f709e88b47613ed6cdbd2459c88c1aaaffb5069`

Final summary:

```text
PASS: 11
REVIEW: 0
FAIL: 0
```

Across the 22 viewport observations used by the final gate:

- horizontal overflow: none reported
- clipped text: none reported
- console errors: none reported
- page errors: none reported
- every route produced screenshot evidence

`El coleccionista` now passes the technical rendered gate. Its remaining edge/unequal-height evidence is contextual editorial-composition evidence only and does not justify reopening the approved article.

Discovery passes after the three mobile lazy-image sources were independently verified as reachable image responses.

Club passes after removal of the intentional clipped-label implementation.

## Evidence boundary

This closeout **does claim real rendered/browser QA** because Chromium/Playwright actually observed production at mobile and desktop sizes and generated screenshots plus DOM/runtime measurements.

It does **not** claim that a human or Taste actor manually inspected every generated PNG for aesthetic excellence in this session. Screenshot existence is evidence, not aesthetic approval. Existing visual direction remains authoritative unless later visual inspection exposes a concrete regression.

No publication image was generated or modified during this QA cycle.

## Non-blocking technical debt

The production build still reports the pre-existing non-fatal Next.js warning about missing Newsreader font-override values and dependency audit vulnerabilities. Neither was introduced by this QA correction set and neither blocked build, deployment or browser execution.

## Release conclusion

The 2026-09-02 unified Aromia baseline is technically clean under the verified OMNI browser gate and is live in production.

No further UX/UI correction is required from this audit. Resume the editorial calendar from `main`; treat any future browser or visual finding as new evidence rather than reopening this closeout speculatively.
