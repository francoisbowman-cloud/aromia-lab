# Aromia — Editorial v1 Photo Restore — 2026-09-02

STATUS: LIVE / VERIFIED

## Incident

The Publisher reported that photographs still were not visible on the live site after the UX/UI consolidation.

The cause was not Railway, caching or missing binaries. The three principal interpretive Editorial v1 assets already existed under `apps/web/public/editorial-v1/`, but their slots in `apps/web/src/app/(editorial)/editorialVisuals.tsx` were still configured with `present: false`. `VisualField` therefore rendered the synthetic CSS fallback instead of `next/image` on both the Home cover and the corresponding story heroes.

Affected slots:

- `amouage-material-density-interpretive` → `/editorial-v1/amouage-mineral-density-01.jpg`
- `ambroxan-material-interpretive` → `/editorial-v1/ambroxan-resin-abstract-01.jpg`
- `ropion-overdose-interpretive` → `/editorial-v1/ropion-bordeaux-texture-01.jpg`

## Correction

PR #129 — `Restore Editorial v1 photography to live surfaces`

Merged production commit:

`d05451542575a8fc491a23b1da4f1b9fca140b6e`

Changes:

1. Set the three approved interpretive slots to `present: true`.
2. Added `ev1-photo` to actual interpretive image figures.
3. Kept the CSS material fields only as fallbacks.
4. Suppressed synthetic pseudo-texture overlays whenever `ev1-photo` is present, so real photography is not visually mistaken for a CSS abstract field.
5. Page geometry and the Aromia design system were not changed.

## Verification

GitHub checks on PR head `1bc0052b5d8770a015fdf49afb68c98a5b88d582`:

- v2.0 CI: SUCCESS
- Aromia Strict Audit: SUCCESS

Railway production deployment:

`7efb9168-480b-458a-816f-d3d6dad723b4` — SUCCESS

Runtime:

- private catalog preflight PASS, count 125
- Next.js ready in 478 ms
- production build compiled successfully
- 29/29 static pages generated

OMNI verified Render QA deployment:

`ad1b9bd2-af54-4ea7-9267-6df03db8fac8`

Routes rechecked at mobile 390×844 and desktop 1280×900:

- `/` — PASS
- `/historias/el-perfume-que-encargo-un-sultan` — PASS
- `/historias/el-ambar-que-nunca-toco-una-ballena` — PASS
- `/historias/el-perfumista-que-no-teme-exagerar` — PASS
- `/historias/el-coleccionista` — PASS

Final focused summary:

`PASS 5 / REVIEW 0 / FAIL 0`

Every route produced screenshot evidence. No horizontal overflow, clipped text, console errors or page errors blocked the run.

## Operational rule

Do not set these three interpretive slots back to `present: false` merely to solve an image-quality concern. If a specific source is judged too soft or otherwise inadequate, replace the source asset under the visual-generation isolation protocol while keeping the photographic slot active. A quality problem must not be solved by silently removing photography from the publication.
