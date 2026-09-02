# Editorial Home — Soft Image QA Finding

DATE: 2026-09-02
ACTOR: ChatGPT / visual QA
STATUS: CHANGES_REQUIRED
SOURCE_EVIDENCE: Publisher-provided rendered screenshot, desktop

## Finding

The current Editorial v1 home composition is working rhythmically, but its three principal interpretive images read as unintentionally soft / globally out of focus at rendered size:

1. `amouage-material-density-interpretive` → `/editorial-v1/amouage-mineral-density-01.jpg`
2. `ambroxan-material-interpretive` → `/editorial-v1/ambroxan-resin-abstract-01.jpg`
3. `ropion-overdose-interpretive` → `/editorial-v1/ropion-bordeaux-texture-01.jpg`

The screenshot shows the softness across the image information rather than as a controlled shallow-depth-of-field cue. It is especially noticeable because the adjacent editorial typography is crisp. This should not be treated as an intentional aesthetic without stronger evidence.

## Code inspection

`editorialVisuals.tsx` renders all three as interpretive `next/image` fill assets with `objectFit: cover`; no CSS blur/filter is applied to the image element.

`editorial.css` does contain `filter: blur(18px)` on `.ev1-resin:after`, but that pseudo-element is an atmospheric overlay and cannot explain the global softness visible in all three different source images. Therefore the primary suspect is source-asset sharpness / source-scale suitability rather than a shared CSS blur bug.

Current repo sizes:
- `ambroxan-resin-abstract-01.jpg`: 232,817 B
- `amouage-mineral-density-01.jpg`: 218,006 B
- `ropion-bordeaux-texture-01.jpg`: 166,565 B

Binary dimensions are not exposed by the current GitHub text connector, so Code must inspect intrinsic dimensions locally before replacement.

## Locked correction strategy

Do **not** redesign the home. Preserve the current rhythm, grid, copy, spacing and crop roles.

For each of the three assets:

1. inspect intrinsic pixel dimensions and source at 100%;
2. if the source itself is soft, replace with a sharper high-resolution interpretive source following the existing Gate 3 art direction;
3. if the source is sharp but rendered soft, diagnose Next/Image sizing, browser DPR and crop/upscale behavior before touching the asset;
4. do not use artificial sharpening as the first fix and do not upscale a fundamentally soft image merely to increase pixel dimensions;
5. validate desktop and mobile at rendered size after correction.

### Visual intent that must remain

**Amouage material density** — tactile resin/mineral/wood material density; broad landscape crop; no crown, throne, gold bars, fake calligraphy or pseudo-palace luxury.

**Ambroxan material** — irregular translucent/wet/mineral material behavior; familiar-but-strange tactility; no whale/ocean cliché, fake chemistry or cosmetic-ad polish.

**Ropion overdose** — one dense, saturated floral/material act with real texture and controlled excess; botanical plausibility; no generic romantic rose advertisement.

All replacements must have a clearly resolved plane of focus and enough microtexture to survive the actual rendered slot. Background depth may fall off naturally; the principal material subject may not be globally blurred.

## Generation safety

If replacement generation is required, obey `docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md`. This operational conversation is not a clean generation context. Prepare visual-only capsules and generate in a clean visual context, then quarantine before Code ingestion.

## Gate impact

This is a visual-quality finding on the existing Editorial v1 home, not a rejection of `El coleccionista` Asset A v2.

`El coleccionista` implementation remains intact.

Final publication/OMNI gate should not silently bless the three visibly soft home images. Correct them or explicitly scope the El coleccionista gate away from the home while keeping this finding open as a platform follow-up.
