# Claude Design Brief — El Coleccionista · Founding Intervention

## Status

```text
EDITORIAL: READY
ART_DIRECTION: READY
DESIGN_PROTOTYPE: PENDING
DESIGN_SYSTEM_EXTRACTION: PENDING
EARLY_OMNI: PENDING
VISUAL_ASSETS: PENDING
IMPLEMENTATION: PENDING
QA: PENDING
PUBLISH: PENDING
TARGET_DATE: UNSCHEDULED
```

## Mission

This is a **high-leverage, intentionally sparse Claude Design intervention**.

Do not treat Claude Design as the routine designer of Aromia articles. Use this session to create one exceptional web-native prototype for `El Coleccionista` **and to discover durable visual infrastructure that will reduce or eliminate the need for Design on normal future articles**.

The required outcome is therefore both:

1. a resolved `El Coleccionista` experience;
2. reusable design capital for Aromia.

Do not adapt the rejected Canva studies. Read the article, canonical art direction and design documents in the repository and begin again from the story.

Primary source files:
- `drafts/el-coleccionista.md`
- `art-direction/el-coleccionista.md`
- `AROMIA_ART_DIRECTION.md`
- `GUIA-VISUAL-aromia.md`
- `AROMIA_VOICE_BIBLE.md`
- `AROMIA_DESIGN_PROTOTYPING_SYSTEM.md`
- `AROMIA_EDITORIAL_DESIGN_LEARNINGS.md`
- `AROMIA_HUMANITY_SIGNATURE_SYSTEM.md`

## Non-negotiable identity objective

Aromia must maintain identity while remaining original and non-repetitive.

> **Repeat identity. Vary composition.**

Recognition should emerge from stable relationships, not repeated finished layouts.

The prototype should help determine which relationships make Aromia recognizable across different stories while preserving enough compositional freedom that future articles do not become template variants.

## Decision classification

For every meaningful visual/system decision, classify it in the repo as one of:

- `AROMIA_FOUNDATION`
- `REUSABLE_PRIMITIVE`
- `STORY_SPECIFIC`
- `EXPERIMENT`

Do not promote a decision merely because it appears in this prototype.

## Required deliverables

Before declaring this Design intervention complete, leave all of the following in the repository:

### A. Full web-native prototype

Prototype the complete article experience, including meaningful desktop and mobile behavior. Prefer an isolated repository-native route or structured HTML/CSS/React study that can be rendered and inspected.

### B. Visual Grammar Sheet

Document the strongest identity relationships discovered, including where relevant:
- grid/gutters/reading measures;
- typography relationships and responsive behavior;
- spacing rhythm;
- image scale/crop/placement logic;
- captions/credits/metadata;
- color/material behavior;
- motion/restraint;
- navigation/continuity principles.

Do not turn this into a generic brand-guideline exercise. Record only evidence produced by the prototype.

### C. Primitive Inventory

Identify the reusable editorial building blocks demonstrated by the prototype. For each useful primitive describe:
- narrative/perceptual purpose;
- variants;
- content constraints;
- responsive behavior;
- what must remain editable;
- whether it is `REUSABLE_PRIMITIVE` or still `EXPERIMENT`.

Do not create speculative components that the prototype does not justify.

### D. Story-Specific Ledger

Explicitly record the decisions that belong only to `El Coleccionista`, especially accumulation, serial density, archival/scarcity behavior and the `Sí, pero` release.

These must not silently become defaults.

### E. Claude Code handoff

Leave enough structured information for Claude Code to construct/update the permanent `/design-lab` and shared primitives without having to reverse-engineer the prototype.

## Creative requirement

The result must feel like work from a senior editorial/digital design practice.

Avoid:
- beginner editorial minimalism;
- generic magazine templates;
- ChatGPT/AI visual defaults;
- black/cream/gold luxury shorthand;
- centered hero formula;
- card walls;
- decorative pills/badges;
- gratuitous oversized numerals;
- fake handwritten humanity;
- generic perfume still lifes;
- pseudo-authentic branded bottles.

## Narrative behavior

The prototype must make the argument physically visible.

### 1 — Recognition
Quiet, lived-in, observational. The reader recognizes the collector before being told what a collector is.

### 2 — Accumulation
Density grows gradually. Repetition, objects, annotation, cropping, scale or typographic structure may begin occupying more of the page. Do not announce the mechanism; let the reader feel it.

### 3 — Proliferation / scarcity
The flanker and reformulation passages should not collapse into product advertising. Use authentic product identity only when verified. Explore documentary, serial, archival or typographic approaches.

### 4 — Sí, pero
Break the system. Large release of visual density. The page should suddenly breathe again.

### 5 — Closing
Editorial conclusion first. Contextual commerce later and visibly subordinate.

## Prototype scope

Include at minimum:
- first viewport;
- article reading field;
- accumulation transition;
- densest narrative moment;
- archival/scarcity moment;
- `Sí, pero` reset;
- closing/contextual commerce treatment;
- mobile intent for the most important states.

Do not modify production behavior while prototyping.

## Foundation vs episode

Potential stable relationships may include typography, reading measure, metadata/caption language, grid, navigation, responsive type logic and genuine editorial primitives.

`El Coleccionista`-specific behavior includes accumulation, serial density, article-specific archival behavior, the `Sí, pero` release and any unique motion/annotation that serves this argument.

Do not convert article-specific behavior into a universal template.

## Token/cost discipline

Claude Design is expensive relative to routine production. Optimize this intervention for **durable learning per token**, not breadth for its own sake.

- Do not generate many superficial alternatives.
- Explore deeply enough to resolve the strongest direction.
- Do not spend tokens designing speculative future articles.
- Do not create a huge component library.
- Prefer one strong prototype plus clear system extraction.
- Leave future routine composition to ChatGPT + Claude Code + the extracted system.

## Acceptance

Before marking `DESIGN_PROTOTYPE: READY`, ask:

1. Does this look authored rather than generated?
2. Does it visibly demonstrate expert design craft?
3. Would it survive comparison with a high-level independent magazine or digital design studio?
4. Does the composition tell the story even with the title hidden?
5. Is the system coherent enough to refine gradually rather than redesign from zero each time?
6. Does mobile preserve the narrative idea rather than merely stacking desktop blocks?
7. Is every visual flourish doing narrative or perceptual work?
8. Does the prototype reveal durable Aromia relationships without becoming a universal template?
9. Is the reusable learning substantial enough to justify this Claude Design intervention?

If any core answer is no, continue iterating.

When materially resolved, leave the prototype and extraction artifacts in the repo and mark them ready for Early OMNI. **Do not implement production and do not publish.**
