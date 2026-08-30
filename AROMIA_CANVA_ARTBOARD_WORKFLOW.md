# Aromia — Canva Artboard Workflow

## Decision

Canva is approved as the **visual artboard for editorial art direction** in Aromia when it helps the work feel composed by hand rather than generated as a generic web concept.

GitHub remains the source of truth for text, state, art-direction decisions and implementation handoff. Canva is the visual working surface where composition is explored, compared and refined before Code translates it into responsive web behavior.

## Why Canva

A broad review of Canva's current editorial and magazine template library shows a useful range of professional editorial behaviors: multi-page fashion magazines, minimalist interview/article layouts, travel magazines, art/culture magazine covers, lookbooks, editor-note pages, article pages and photo-led compositions.

The value is not a particular template. The value is exposure to editorial conventions that are harder to fake convincingly from a generic AI website prompt:

- spreads built around a specific crop rather than a centered hero;
- irregular image-to-text ratios;
- small captions and folio-like metadata;
- page-to-page rhythm rather than one reusable component repeated vertically;
- controlled asymmetry;
- narrow columns beside large photographic fields;
- abrupt transitions between dense and sparse pages;
- editorial notes, contents pages and article openers with different hierarchies;
- typography that changes role by page instead of merely scaling one system;
- visual pacing that feels printed even when translated to digital.

## Reference territories studied

The reference pool includes current Canva families such as:

- fashion magazine systems with 8–21+ page sequences;
- minimalist article/interview magazine layouts;
- black-and-white editorial magazines;
- Nordic/travel magazine systems;
- art and culture magazine covers;
- editor-note/article pages;
- lookbook and photography-led magazine systems;
- A4 editorial documents with restrained grids.

These references are for **judgment**, not direct copying.

## Anti-template rule

Do not choose one Canva template and make every Aromia article conform to it.

Instead:

1. inspect several relevant editorial compositions;
2. identify the relationship that is useful for the story;
3. rebuild or adapt that relationship inside an Aromia artboard;
4. remove template-specific decoration that has no narrative purpose;
5. test whether the result still reads as Aromia and as the specific story.

> **Use Canva to think like an editor, not to borrow someone else's magazine.**

## Canva's role in the actor workflow

### ChatGPT — Art Director

ChatGPT may use Canva to:
- compose article openers;
- build page/spread sequences;
- test image scale, crop and placement;
- test density and whitespace;
- place the approved handwritten signature or marginalia selectively;
- compare alternate directions before implementation;
- create a visual handoff for Code.

### Claude / Cowork

Claude and Cowork should read the Canva-derived art direction but should not redesign pages independently unless asked. Their role remains editorial structure, research and writing.

### Code

Code treats Canva as a **visual specification**, not as pixel-perfect HTML instructions.

Code should translate:
- hierarchy;
- rhythm;
- crop intent;
- relative scale;
- whitespace;
- sequencing;
- image/text relationship;
- article-specific visual behavior.

Responsive behavior must be designed for the browser rather than inferred mechanically from a fixed Canva canvas.

### OMNI

OMNI compares the implemented browser result against the visual intent represented by the Canva artboard and the canonical Aromia documents.

## Canvas choice

For article art direction, use a **multi-page 16:9 editorial board or presentation** when the goal is to communicate desktop composition and sequence to Code. Treat each page as a major viewport/state/spread rather than a literal printed page.

Use A4/portrait studies selectively when studying typographic measure, cover behavior or print-derived composition.

## El Coleccionista — first Canva specimen

`El Coleccionista` becomes the first article to test this method.

Recommended board sequence:

1. **Opening / recognition** — quiet lived-in collection, title and restrained context.
2. **Reading field** — generous text measure and silence.
3. **Accumulation begins** — marginal objects/notes/counting enter gradually.
4. **Flanker proliferation** — authentic repeated product identities; widest/most dense composition.
5. **Fear of disappearance** — archive/time behavior; more documentary and restrained.
6. **Sí, pero** — dramatic return to white space and minimal visual interference.
7. **Closing / contextual commerce** — restrained references and optional handwritten Aromia sign-off.

The board must not become a dashboard, brand guideline sheet or presentation full of explanatory cards. It should look like the article itself.

## Acceptance criteria

A Canva artboard passes when:

- it looks like a magazine composition before it looks like a presentation;
- there is no dashboard/card-grid language;
- each spread has one dominant relationship;
- image crops feel chosen rather than auto-fit;
- typography and whitespace create pacing;
- the article-specific visual behavior is obvious without explanatory labels;
- handwritten/human traces remain scarce and meaningful;
- the system does not rely on black/cream/gold luxury clichés;
- the composition cannot be reused unchanged for five unrelated Aromia stories;
- Code can infer hierarchy and responsive intent from the artboard without inventing the core direction.

## Operational rule

For major editorial pieces, the preferred path is now:

`STORY READY → ART DIRECTION → CANVA ARTBOARD → ASSET RESOLUTION → CODE IMPLEMENTATION → OMNI BROWSER QA`

Canva is therefore **the visual canvas**, while GitHub remains **the editorial and operational source of truth**.
