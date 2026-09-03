# Aromia — Sub-batch 01 Visual Generation Quarantine

STATUS: ACTIVE
DATE: 2026-09-03
SOURCE_ART_DIRECTION: `art-direction/AROMIA_SUB_BATCH_01_TERRITORIOS_VISUAL_DIRECTION.md`
CANONICAL_PROTOCOL: `docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md`

## Purpose

This ledger records generation failures that must not be treated as Aromia publication assets or handed to Code.

## Current batch gate

CURRENT_SLOT: `01 — Antes del perfume ya olíamos / Opportunity A`
EXPECTED_MODE: original observational editorial photography
EXPECTED_NARRATIVE_TEST: `A body exists here before perfume enters the story.`
BATCH_CONTINUATION: BLOCKED UNTIL 01A PASSES

## Rejected outputs

All visual outputs generated in the failed start of this batch are rejected process waste.

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
- would reintroduce the generic AI-perfumery visual language explicitly prohibited by the Art Direction.

### Reject group B — woods / resins / aromatherapy shorthand

Observed drift:
- woods, amber/resin and flowers staged as a refined still life;
- material/ingredient assemblages with spa/aromatherapy mood;
- studio-lit beige product-composition language.

Reason for rejection:
- unrelated to the active slot;
- premature movement into other perfume materials without passing 01A;
- fails the sequential one-asset-at-a-time gate;
- cannot be repurposed for another story because provenance begins as a failed generation for this slot.

## Hard disposition

`QUARANTINE_DECISION: REJECT`

These outputs:
- must not be committed as image binaries;
- must not be referenced from article content;
- must not be ingested by Code;
- must not be used as OMNI or QA evidence;
- must not be silently reassigned to another article;
- must not advance the visual-assets phase.

## Restart contract

The next generation attempt must contain only the physical scene capsule for 01A:

```text
SUBJECT / SCENE: ordinary adult just after shower; shoulder, upper back, neck, damp hairline
ENVIRONMENT: modest real bathroom, neutral domestic finishes
COMPOSITION: close crop, slightly lateral, imperfect framing
CAMERA / POINT OF VIEW: eye-level close observational photograph
LIGHT: soft natural bathroom/window light, no glamour rim light
MATERIAL / TEXTURE: real skin, damp hair, towel cotton, faint condensation
HUMAN IMPERFECTIONS / LIVED-IN DETAILS: natural skin texture, towel edge, wall seam
PALETTE: warm-neutral skin against mineral/quiet bathroom surfaces
AUTHENTICITY CONSTRAINTS: ordinary human body; no aspirational beauty retouching
MUST NOT APPEAR: perfume, cosmetics display, spa props, logos, text, UI, diagrams, mockups, botanical ingredient still lifes, citrus/flower arrangements, woods/resins tableaux, product photography
CROP / RESPONSIVE INTENT: portrait master with safe center-left crop for mobile
NARRATIVE TEST: a body already exists before perfume
```

## Pass rule

01A may be marked `PASS` only if the generated image visibly satisfies the human domestic scene above and the narrative test without relying on perfume shorthand.

Only after 01A passes may generation continue to the next original-image task in the canonical art-direction file.
