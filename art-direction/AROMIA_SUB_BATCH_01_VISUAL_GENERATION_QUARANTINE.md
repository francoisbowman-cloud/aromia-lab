# Aromia — Sub-batch 01 Visual Generation Quarantine

STATUS: ACTIVE
DATE: 2026-09-03
SOURCE_ART_DIRECTION: `art-direction/AROMIA_SUB_BATCH_01_TERRITORIOS_VISUAL_DIRECTION.md`
CANONICAL_PROTOCOL: `docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md`

## Purpose

This ledger records generation failures that must not be treated as Aromia publication assets or handed to Code, and the sequential pass state for accepted assets.

## Accepted outputs

### 01A — Antes del perfume ya olíamos / opening

`QUARANTINE_DECISION: PASS`

Repo asset:
`assets/visual/editorial/sub-batch-01/01A-antes-del-perfume-ya-oliamos.jpg`

Ingest commit:
`1a3de3c9db311ea441555bf7df2ff00f92a397f0`

Narrative test:
`A body exists here before perfume enters the story.`

Why it passes:
- ordinary adult immediately after shower;
- close observational crop of shoulder, upper back, neck and damp hairline;
- modest domestic bathroom context;
- visible natural skin and moisture texture;
- no perfume, brand, cosmetics display, spa staging, text, UI, diagrams or mockups;
- feels observed rather than beauty-advertising directed.

CROP_INTENT: portrait master; preserve neck/shoulder/hairline and bathroom seam on mobile.
ALT_INTENT: close observational view of a damp shoulder, upper back and neck immediately after a shower in an ordinary bathroom.

## Current batch gate

CURRENT_SLOT: `02 — Comprar para oler o comprar para tener / Opportunity A`
EXPECTED_MODE: original lived-in object photography
EXPECTED_NARRATIVE_TEST: `One object contains the experience; the other contains ownership.`
BATCH_CONTINUATION: BLOCKED UNTIL 02A PASSES

## Rejected outputs

All visual outputs generated in failed attempts remain rejected process waste.

### Reject group A — botanical perfume shorthand

Observed drift:
- bergamot/citrus still life;
- isolated citrus blossom;
- ingredient-grid style botanical composition;
- beige studio product/ingredient aesthetic.

Reason for rejection:
- wrong subject;
- wrong visual grammar;
- generic perfume-signaling imagery replaced the requested human scene;
- fails the story narrative test;
- would reintroduce generic AI-perfumery visual language explicitly prohibited by Art Direction.

### Reject group B — woods / resins / aromatherapy shorthand

Observed drift:
- woods, amber/resin and flowers staged as a refined still life;
- material/ingredient assemblages with spa/aromatherapy mood;
- studio-lit beige product-composition language.

Reason for rejection:
- unrelated to the active slot;
- premature movement into other perfume materials without passing the active slot;
- fails the sequential one-asset-at-a-time gate;
- cannot be silently repurposed for another story.

### Reject group C — repository / interface visualization

Observed drift after 01A passed:
- fabricated GitHub repository browser showing an invented asset grid;
- fabricated GitHub file listing claiming generated assets existed.

Reason for rejection:
- direct context-contamination failure;
- depicts repository/UI instead of the physical 02A scene;
- fabricates asset state and filenames;
- explicitly forbidden by the isolation protocol.

`TWO_STRIKE_CONTEXT_LOCK: ACTIVE`

Two consecutive generation attempts in this operational conversation produced repository/UI imagery. Therefore this conversation is permanently disqualified from further publication-image generation. Do not retry image generation here.

## Hard disposition

All rejected outputs:
- must not be committed as image binaries;
- must not be referenced from article content;
- must not be ingested by Code;
- must not be used as OMNI or QA evidence;
- must not be silently reassigned to another article;
- must not advance the visual-assets phase.

## Next clean generation contract — 02A

A genuinely clean visual-only context must contain only this physical-scene capsule:

```text
SUBJECT / SCENE: used anonymous perfume sample vial beside nearly-full generic perfume bottle
ENVIRONMENT: ordinary bedroom dresser or domestic shelf
COMPOSITION: sample closer to camera, larger bottle farther back; asymmetric spacing
CAMERA / POINT OF VIEW: shelf-height, slightly oblique
LIGHT: soft side daylight, no glossy advertising setup
MATERIAL / TEXTURE: glass, paper label, worn wood/laminate, subtle dust
HUMAN IMPERFECTIONS / LIVED-IN DETAILS: scuffed vial, slightly crooked label, everyday surface
PALETTE: quiet domestic neutrals
AUTHENTICITY CONSTRAINTS: generic unbranded objects; believable scale
MUST NOT APPEAR: luxury retail staging, recognizable perfume geometry, logos, readable label text, text overlays, botanical ingredient still lifes, flowers/resins tableau, UI, GitHub, browser windows, documents, diagrams, mockups
CROP / RESPONSIVE INTENT: landscape master; objects remain separable on mobile crop
NARRATIVE TEST: experience and possession are different desires
```

## Pass rule

02A may be marked `PASS` only if the image visibly expresses the physical difference between a handled small sample and a nearly untouched full-size generic bottle in an ordinary domestic setting, without advertising or repository/UI shorthand.

Only after 02A passes may generation continue to the next original-image task in the canonical art-direction file.
