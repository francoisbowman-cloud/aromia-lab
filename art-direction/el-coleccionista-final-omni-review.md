# EL COLECCIONISTA — FINAL OMNI REVIEW

DATE: 2026-09-01
BRANCH: `feat/el-coleccionista-implementation`
FINAL_OMNI: REFINE
QA: CHANGES_REQUIRED (visual only; technical QA remains green)
PUBLISH: PENDING

## Scope

Final OMNI evaluated the implemented story against:

- `drafts/el-coleccionista.md`
- `art-direction/el-coleccionista-art-direction-and-composition.md`
- `art-direction/el-coleccionista-early-omni-review.md`
- `art-direction/el-coleccionista-visual-assets-handoff.md`
- `art-direction/el-coleccionista-implementation-checkpoint.md`
- the branch implementation in `apps/web/src/app/(editorial)/historias/el-coleccionista/`
- the actual Asset A source image produced by ChatGPT and ingested at `apps/web/public/editorial-v1/coleccionista-shelf-01.jpg`

The browser-pane screenshot capture was unavailable in Code's environment, but Code supplied clean build and JS-measured desktop/mobile evidence. OMNI therefore separates technical implementation judgment from the remaining visual-authorship judgment.

## Result

**REFINE — one material visual issue, no conceptual redesign required.**

The page architecture, responsive rhythm, article fidelity and commercial restraint are strong enough to preserve. The blocker is Asset A itself.

## What passes

### 1. Story-specific composition — PASS

The implementation does not collapse into the generic `hero → text → image → text → cards` pattern. Recognition, distinction, multiplication, scarcity, preservation and release are expressed as different density states. The story-specific static route is justified by the composition rather than used as an excuse to fork the Foundation.

### 2. Accumulation → withdrawal arc — PASS

The increasing rail notation, warmer multiplication field, Le Male typographic lineage, abrupt whitespace transition, steel preservation register and full removal of devices at `Sí, pero` correctly translate the locked narrative arc.

### 3. Le Male treatment — PASS

The typographic lineage is the right choice. It avoids uncertain product-image rights, fabricated bottles and commercial campaign language while still making multiplication visible. No correction requested.

### 4. Preservation/time treatment — PASS

Asset C correctly remained closed. Layout and typography carry the preservation passage without inventing batch evidence or overproducing the page.

### 5. Commercial pressure — PASS

Commerce arrives only after the editorial conclusion, is disclosed, has no product cards or prices, and remains visually subordinate. No correction requested.

### 6. Responsive/technical integrity — PASS ON CODE EVIDENCE

Code reports clean `tsc`, lint and production build, static prerendering, no overflow or console errors, correct image loading, accessible heading order and decorative devices removed from the accessibility tree. Nothing in the inspected TSX/CSS contradicts that evidence.

## Material issue

### Asset A does not meet the locked authored-humanity test — REFINE

The ingested image is technically valid and safe: unbranded, quiet, muted and free of perfume-ad clichés. But perceptually it is a **flat illustrative lineup of generic bottle silhouettes on an abstract beige field**, not an observed domestic shelf/drawer/bathroom ledge.

That distinction matters because Asset A was not specified as generic decoration. Its narrative job is recognition:

> `yo conozco ese estante`

The current image instead reads closer to an abstract editorial diagram of “many perfume bottles”. It lacks the small domestic evidence that makes the opening feel inhabited: shelf material, room edge, imperfect object overlap, plausible daylight, minor ordinary traces, and the visual inconvenience of a collection that has exceeded its intended space.

This weakens two criteria that Early OMNI explicitly put under execution watch:

- **authored humanity** — the image feels composed from symbols rather than observed from life;
- **anti-template / anti-AI character** — the simplified repeated silhouettes risk feeling generically generated and detachable from this exact article.

The problem is not color, crop or file quality. CSS cannot repair it. Replacing the asset is the correct intervention.

## Required correction

Regenerate/replace **Asset A only** while preserving the existing page composition and crop contract.

New Asset A must be:

- photographic or convincingly photographic in visual language, not vector/flat illustration;
- a plausible ordinary domestic shelf, shallow cabinet, drawer edge or bathroom ledge;
- visibly inhabited but not styled: one mundane trace is enough (folded cloth edge, grooming object, key dish, wall corner, cabinet seam);
- approximately 10–18 varied, unbranded fragrance-like bottles, with labels/logos absent or unreadable;
- imperfectly spaced, with at least one partially obscured object and one awkward unusable remaining gap;
- lit by plausible daylight or ordinary room light, not cinematic perfume-ad lighting;
- warm-neutral and compatible with Aromia paper, but materially richer than a flat beige background;
- free of marble, smoke, splashes, gold grading, showroom symmetry, floating products or luxury-dressing-room signals.

Narrative test remains:

> First reaction: `yo conozco ese estante` — not `quiero comprar lo que hay ahí` and not `esto representa una colección`.

Desktop/mobile crop contract remains unchanged unless Code's re-QA proves the new source needs a small `object-position` adjustment.

## Preserve — do not redesign

Do **not** change:

- article prose;
- section order;
- density states;
- Le Male typographic lineage;
- preservation/time notation;
- `Sí, pero` reset;
- affiliate treatment;
- story-specific route architecture.

This is a surgical visual refinement, not a reopening of art direction.

## Handoff

`NEXT_ACTOR: ChatGPT` — replace Asset A from the correction above.

Then:

`ChatGPT Asset A v2 → Code ingest + desktop/mobile re-QA → OMNI final re-check → PUBLISHABLE if clean`

No merge or deploy is authorized by this review.
