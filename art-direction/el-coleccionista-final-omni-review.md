# EL COLECCIONISTA — FINAL OMNI REVIEW

DATE: 2026-09-02
BRANCH: `feat/el-coleccionista-implementation`
FINAL_OMNI: PENDING
PROVISIONAL_VISUAL_REVIEW: REFINE
QA: CHANGES_REQUIRED (visual only; technical QA remains green)
PUBLISH: PENDING

## Correction to gate status

A prior pass recorded `FINAL_OMNI: REFINE` before a reliable rendered-browser screenshot was available. That was too strong for the workflow contract.

The critique of Asset A remains valid because the actual ingested source image was inspected and is visibly too flat/diagrammatic for the locked recognition beat. However, **this document is now correctly classified as a provisional visual review, not the authoritative Final OMNI rendered-experience gate**.

Final OMNI remains pending until Code provides real rendered desktop + mobile evidence with the replacement asset in context.

## Scope of the provisional review

The review compared:

- `drafts/el-coleccionista.md`
- `art-direction/el-coleccionista-art-direction-and-composition.md`
- `art-direction/el-coleccionista-early-omni-review.md`
- `art-direction/el-coleccionista-visual-assets-handoff.md`
- `art-direction/el-coleccionista-implementation-checkpoint.md`
- the branch implementation in `apps/web/src/app/(editorial)/historias/el-coleccionista/`
- the actual Asset A source image ingested at `apps/web/public/editorial-v1/coleccionista-shelf-01.jpg`

Code supplied clean build and JS-measured desktop/mobile evidence, but browser screenshot capture was unavailable. Technical judgment and source-asset judgment can therefore be retained; the rendered-experience gate cannot yet be closed.

## What remains valid

### Story-specific composition — technically/factually aligned

The implementation does not collapse into the generic `hero → text → image → text → cards` pattern. Recognition, distinction, multiplication, scarcity, preservation and release are expressed as different density states.

### Accumulation → withdrawal arc — aligned in implementation

The increasing rail notation, warmer multiplication field, Le Male typographic lineage, abrupt whitespace transition, steel preservation register and removal of devices at `Sí, pero` correctly translate the locked narrative arc in code.

### Le Male treatment — aligned

The typographic lineage avoids uncertain product-image rights, fabricated bottles and commercial campaign language while still making multiplication visible.

### Preservation/time treatment — aligned

Asset C correctly remained closed. Layout and typography carry the preservation passage without inventing batch evidence or overproducing the page.

### Commercial pressure — aligned

Commerce arrives after the editorial conclusion, is disclosed, has no product cards or prices, and remains subordinate in the implementation.

### Responsive/technical integrity — PASS ON CODE EVIDENCE

Code reports clean `tsc`, lint and production build, static prerendering, no overflow or console errors, correct image loading, accessible heading order and decorative devices removed from the accessibility tree. Nothing in the inspected TSX/CSS contradicts that evidence.

## Material source-asset issue

### Asset A does not meet the locked authored-humanity test — REFINE

The ingested image is technically safe: unbranded, quiet, muted and free of perfume-ad clichés. But perceptually it is a **flat illustrative lineup of generic bottle silhouettes on an abstract beige field**, not an observed domestic shelf/drawer/bathroom ledge.

Its narrative job is recognition:

> `yo conozco ese estante`

The current image reads closer to an abstract editorial diagram of “many perfume bottles”. It lacks domestic evidence such as shelf material, room edge, imperfect object overlap, plausible daylight, minor ordinary traces and the visual inconvenience of a collection that has exceeded its intended space.

This weakens:

- **authored humanity** — symbols instead of observation;
- **anti-template / anti-AI character** — repeated generic silhouettes detached from this exact story.

CSS cannot repair this; replacement is the correct intervention.

## Required correction

Replace **Asset A only** while preserving the existing page composition and crop contract.

New Asset A must be:

- photographic or convincingly photographic;
- a plausible ordinary domestic shelf, shallow cabinet, drawer edge or bathroom ledge;
- visibly inhabited but not styled;
- approximately 10–18 varied, unbranded fragrance-like bottles, labels/logos absent or unreadable;
- imperfectly spaced, with at least one partially obscured object and one awkward unusable remaining gap;
- lit by plausible daylight or ordinary room light;
- warm-neutral and materially richer than a flat beige background;
- free of marble, smoke, splashes, gold grading, showroom symmetry, floating products or luxury-dressing-room signals.

Narrative test:

> First reaction: `yo conozco ese estante` — not `quiero comprar lo que hay ahí` and not `esto representa una colección`.

Desktop/mobile crop contract remains unchanged unless Code's re-QA proves the new source needs a small `object-position` adjustment.

## Generation safety rule

Asset A v2 must follow:

`docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md`

The wrong dashboard/checkpoint/GitHub-style generations produced during operational turns are rejected process artifacts. They must not be committed, cited as evidence or used to change publication state.

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

## Handoff

`NEXT_ACTOR: ChatGPT` — create Asset A v2 in a clean visual-only context using the isolation protocol.

Then:

`ChatGPT Asset A v2 → Code ingest + rendered desktop/mobile QA → OMNI authoritative Final gate → PUBLISHABLE if clean`

No merge or deploy is authorized by this review.
