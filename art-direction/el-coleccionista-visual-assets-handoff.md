# EL COLECCIONISTA — VISUAL ASSET PACKAGE / HANDOFF TO CODE

VISUAL_ASSETS: READY_AS_SPEC
EARLY_OMNI: PASS
IMPLEMENTATION: PENDING
DATE: 2026-09-01

Sources:
- `drafts/el-coleccionista.md`
- `art-direction/el-coleccionista-art-direction-and-composition.md`
- `art-direction/el-coleccionista-early-omni-review.md`
- `research/el-coleccionista-visual-source-check.md`

## Correction note

A generated image produced during the Early OMNI turn was an **accidental review-sheet visualization**, not an Aromia story asset. It is explicitly rejected and must not be committed, referenced, implemented or treated as evidence. Early OMNI remains a textual gate recorded in the repository.

## Asset decision after Early OMNI

The gate reduced the visual package rather than expanding it.

### Asset A — opening domestic collection scene

STATUS: REQUIRED_FOR_IMPLEMENTATION_STUDY
SOURCE MODE: interpretive editorial photography, generated or properly licensed documentary image.

This is the only original image that the story clearly needs.

Creative specification:
- horizontal-to-portrait-flexible domestic shelf / drawer / bathroom ledge with a fragrance collection that has quietly exceeded its intended space;
- ordinary middle-class domestic context rather than luxury dressing room;
- approximately 10–18 fragrance-like objects with genuinely varied silhouettes and heights;
- labels, logos and trademark-specific bottle geometry absent or unreadable;
- imperfect spacing; one partially obscured object; one small remaining gap that is inconveniently placed; subtle everyday trace such as folded cloth, key dish, grooming object or wall edge, but no lifestyle prop styling;
- daylight that is plausible rather than cinematic; moderate depth, observational camera height;
- warm-neutral paper-compatible tonality, muted glass gray/green/brown, no gold-led grading;
- no smoke, splashes, floating objects, marble, dramatic reflections, showroom symmetry or luxury campaign lighting.

Narrative test: the first reaction should be `yo conozco ese estante`, not `quiero comprar lo que hay en ese estante`.

Implementation crop:
- desktop: tall/asymmetric field adjacent to title/dek, never full-screen advertising hero;
- mobile: full reading width with visible paper margin; crop preserves crowding and the awkward residual gap.

Alt intent: describe a crowded domestic shelf of varied, unbranded fragrance bottles with little usable room remaining. Do not describe mood or luxury.

### Asset B — Le Male lineage

STATUS: CONDITIONAL_DOCUMENTARY; TYPOGRAPHIC_FALLBACK APPROVED AND PREFERRED UNTIL RIGHTS ARE CLEAR.

Do not generate this asset.

If Code has publication-safe authentic product imagery with documented provenance, it may construct a restrained documentary family sequence after verifying the lineup at implementation time.

If not, implement a typographic lineage using verified product names. This is not a compromise: Early OMNI explicitly accepts typography as the stronger truthful solution over uncertain imagery.

No prices, retailer UI, purchase CTA, carousel sales affordance or campaign composition.

### Asset C — preservation/time still life

STATUS: NOT_REQUIRED_BY_DEFAULT.

Do not generate pre-implementation. Code should first attempt the passage using whitespace, typographic notation and layout. Only reopen this asset if browser composition proves the preservation section perceptually flat after the accumulation passage.

## Story-specific layout devices — not image assets

Code may implement:
- sparse inventory ticks/count marks that increase gradually through `El objeto tiene la culpa`;
- an abrupt whitespace transition before scarcity;
- factual typographic lineage for Le Male when documentary imagery is unavailable;
- subtle time/reserve notation in the preservation section without fabricated batch data;
- a complete removal of ticks, visual residue and product imagery at `Sí, pero`.

These devices must be HTML/CSS/editorial composition, not raster graphics.

## Anti-overproduction lock

Do not create additional generated visuals merely because an article appears to have empty space. Empty space is part of this story's argument.

Maximum visual package before browser QA:
1. one interpretive opening image;
2. optional authentic documentary Le Male sequence;
3. zero other raster assets unless implementation evidence justifies reopening Asset C.

## Handoff

`NEXT_ACTOR: Code (implementation)`

Code should implement the story against Editorial v1 Foundation, create/select Asset A using the specification above in the production-capable environment, use the truthful Asset B fallback unless rights are resolved, render desktop/mobile, and leave browser evidence for Final OMNI.

ChatGPT does not authorize merge/deploy/publication from this handoff.
