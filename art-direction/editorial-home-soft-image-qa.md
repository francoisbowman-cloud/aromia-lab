# Editorial Home — Soft Image QA Finding

DATE: 2026-09-02
ACTOR: ChatGPT / temporary Code-role takeover
STATUS: CORRECTION_IN_BRANCH — rendered verification pending
SOURCE_EVIDENCE: Publisher-provided rendered screenshot, desktop

## Finding

The current Editorial v1 home composition is working rhythmically, but its three principal interpretive images read as unintentionally soft / globally out of focus at rendered size:

1. `amouage-material-density-interpretive` → `/editorial-v1/amouage-mineral-density-01.jpg`
2. `ambroxan-material-interpretive` → `/editorial-v1/ambroxan-resin-abstract-01.jpg`
3. `ropion-overdose-interpretive` → `/editorial-v1/ropion-bordeaux-texture-01.jpg`

The screenshot shows the softness across the image information rather than as a controlled shallow-depth-of-field cue. It is especially noticeable because the adjacent editorial typography is crisp. This should not be treated as an intentional aesthetic without stronger evidence.

## Diagnosis

`editorialVisuals.tsx` renders all three as interpretive `next/image` fill assets with `objectFit: cover`; no CSS blur/filter is applied to the image elements.

`editorial.css` does contain `filter: blur(18px)` on `.ev1-resin:after`, but that pseudo-element is an atmospheric overlay and cannot explain the global softness visible in all three different source images.

Intrinsic dimensions were recovered from the JPEG SOF headers through the repository connector:

- `ambroxan-resin-abstract-01.jpg`: **1600×900**, 232,817 B
- `amouage-mineral-density-01.jpg`: **1600×900**, 218,006 B
- `ropion-bordeaux-texture-01.jpg`: **1600×900**, 166,565 B

The current desktop slots do not grossly upscale these images in CSS pixels. The hero can approach the source ceiling on high-DPR displays, but the two counterpoint slots remain below the source dimensions. Therefore **layout-scale alone cannot explain the softness across all three images**.

The remaining likely causes are:

1. the interpretive source images themselves have broad/global softness or insufficient resolved microtexture;
2. Next/Image's default re-encoding quality is compounding the softness, particularly in resin/floral/mineral microtexture;
3. high-DPR delivery may make the hero weakness more visible, but it is not a sufficient explanation for the two lower images.

## Applied correction — delivery quality

Commit `bc3fed3dc825d6571cd501dfd18d8624a6cae798` adds an optional per-slot `quality` field to `VisualSlot` and sets **quality: 95** only for the three affected home interpretive slots.

This is deliberately conservative:

- no layout/grid/rhythm changes;
- no sharpening filter;
- no CSS blur compensation;
- no artificial upscale;
- no change to `El coleccionista` Asset A v2;
- documentary assets remain unchanged.

The purpose is to remove avoidable Next/Image recompression loss before deciding that the source art itself must be replaced.

## Locked correction strategy

Preserve the current home rhythm, grid, copy, spacing and crop roles.

After the quality-95 pass is rendered:

1. inspect desktop and mobile at actual rendered size;
2. if the three images now have an adequately resolved focal plane and microtexture, close this finding;
3. if they still read globally soft, classify the source art as inadequate and replace the three sources rather than adding artificial sharpening;
4. replacement generation must happen from clean visual-only contexts under `docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md`;
5. do not reopen the composition itself.

### Visual intent that must remain if replacement is required

**Amouage material density** — tactile resin/mineral/wood material density; broad landscape crop; no crown, throne, gold bars, fake calligraphy or pseudo-palace luxury.

**Ambroxan material** — irregular translucent/wet/mineral material behavior; familiar-but-strange tactility; no whale/ocean cliché, fake chemistry or cosmetic-ad polish.

**Ropion overdose** — one dense, saturated floral/material act with real texture and controlled excess; botanical plausibility; no generic romantic rose advertisement.

All replacements must have a clearly resolved plane of focus and enough microtexture to survive the actual rendered slot. Background depth may fall off naturally; the principal material subject may not be globally blurred.

## Gate impact

This is a visual-quality finding on the existing Editorial v1 home, not a rejection of `El coleccionista` Asset A v2.

`El coleccionista` implementation remains intact.

Final publication/OMNI remains pending until the quality-95 render is visually checked. If the render remains soft, source replacement becomes the only remaining corrective path.
