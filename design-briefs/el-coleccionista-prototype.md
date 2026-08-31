# Claude Design Brief — El Coleccionista

## Status

```text
EDITORIAL: READY
ART_DIRECTION: READY
DESIGN_PROTOTYPE: PENDING
EARLY_OMNI: PENDING
VISUAL_ASSETS: PENDING
IMPLEMENTATION: PENDING
QA: PENDING
PUBLISH: PENDING
TARGET_DATE: UNSCHEDULED
```

## Mission

Create the first **web-native visual prototype** for the new Aromia editorial system.

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

Prototype the **complete article experience**, not only a hero.

Include at minimum:
- first viewport;
- article reading field;
- accumulation transition;
- densest narrative moment;
- archival/scarcity moment;
- `Sí, pero` reset;
- closing/contextual commerce treatment;
- mobile intent for the most important states.

Use a repository-native format that can be rendered and reviewed. Prefer an isolated prototype route or structured HTML/CSS/React study over a flat image when possible.

Do not modify production behavior while prototyping.

## Foundation vs episode

While designing, explicitly distinguish:

**Potential stable Aromia foundation**
- typography relationships;
- reading measure;
- metadata/caption language;
- base grid;
- navigation behavior;
- responsive type logic;
- shared editorial primitives.

**El Coleccionista-specific behavior**
- accumulation system;
- serial density;
- article-specific archival behavior;
- `Sí, pero` release;
- any unique motion or annotation.

Do not convert article-specific behavior into a universal template.

## Acceptance

Before marking `DESIGN_PROTOTYPE: READY`, ask:

1. Does this look authored rather than generated?
2. Does it visibly demonstrate expert design craft?
3. Would it survive comparison with a high-level independent magazine or digital design studio?
4. Does the composition tell the story even with the title hidden?
5. Is the system coherent enough to refine gradually rather than redesign from zero each time?
6. Does mobile preserve the narrative idea rather than merely stacking desktop blocks?
7. Is every visual flourish doing narrative or perceptual work?

If any core answer is no, continue iterating.

When the prototype is materially resolved, leave it in the repo and mark it ready for Early OMNI review. Do not publish.
