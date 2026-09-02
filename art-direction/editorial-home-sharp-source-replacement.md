# Editorial Home — Sharp Source Replacement

DATE: 2026-09-02
ACTOR: ChatGPT (temporary Code/visual-QA takeover)
STATUS: IMPLEMENTED_ON_BRANCH
BRANCH: `fix/editorial-home-sharp-sources`

## Reason

Publisher-provided desktop evidence showed the three existing Editorial v1 interpretive cover images reading globally soft. Source inspection established that the three local JPEGs were 1600x900 and that gross CSS upscale did not explain the softness. Raising Next/Image quality to 95 did not address the underlying risk that the source art itself lacked a resolved focal plane.

The correction therefore replaces the three soft sources rather than sharpening or artificially upscaling them. The existing home rhythm, grid, copy, slot geometry and responsive crop roles remain unchanged.

## Replacement sources

### Amouage material density

- Source: Mohammed Rahimov, **A drop of golden resin on weathered wood**
- Source page: https://unsplash.com/photos/a-drop-of-golden-resin-on-weathered-wood-aAPZ0lazesk
- License: Unsplash License, free use
- Delivery: `images.unsplash.com`, 3000px crop request, q=90
- Editorial purpose: tactile resin + weathered wood with a clearly resolved macro plane; avoids palace/gold-bar/campaign clichés.

### Ambroxan material

- Source: Albert Hyseni, **Close-up of clear crystals growing on metallic rock**
- Source page: https://unsplash.com/photos/close-up-of-clear-crystals-growing-on-metallic-rock-CINUF3Rwoaw
- License: Unsplash License, free use
- Delivery: `images.unsplash.com`, 3000px crop request, q=90
- Editorial purpose: translucent/mineral behavior and microtexture; interpretive only, not a claim that the crystal is ambroxan.

### Ropion overdose

- Source: Pedro Vit, **Macro photography of blooming red rose flower**
- Source page: https://unsplash.com/photos/macro-photography-of-blooming-red-rose-flower-N2PK1ghtlkg
- License: Unsplash License, free use
- Delivery: `images.unsplash.com`, 3000px crop request, q=90
- Editorial purpose: one dense floral act with real petal texture and a resolved focal plane; no generic product-ad staging.

## Implementation

`editorialVisuals.tsx` now treats these three interpretive slots as approved external editorial photography and renders external HTTPS sources with a plain `<img>` element. This intentionally bypasses Next/Image re-encoding for these sources. Local/documentary assets remain on Next/Image.

`editorial.css` adds only `.ev1-interpretive-img` absolute fill + `object-fit: cover`, preserving the exact existing slot/crop behavior.

## QA gates

Before merge:

1. CI: test + lint + typecheck + build must pass.
2. Isolated branch preview must build successfully.
3. Verify `/` and the three external image requests return successfully from the preview/runtime.
4. Preserve `El coleccionista` and all released story routes unchanged.
5. No merge if an external source fails, if crop breaks, or if the home rhythm changes materially.

## Follow-up policy

These external sources are a quality correction, not a new visual system. If Aromia later internalizes them as local licensed binaries, keep the same visual intent and provenance. Do not reintroduce the rejected soft local sources merely to remove an external dependency.
