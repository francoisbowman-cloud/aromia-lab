# AROMIA — Full Visual Direction & Composition Audit

DATE: 2026-09-06  
STATUS: IMPLEMENTATION PASS IN PROGRESS  
SCOPE: public shell, Home, Historias/Archive, Story, Saber, Personas, Discovery, Club, Buscar, shared visual/link primitives

## Executive diagnosis

Aromia already had a strong editorial identity at the token and typography level, but composition quality was uneven.

The main weakness was not the images themselves. It was presentation consistency:

- Home repeated similar image/text blocks too predictably;
- some photography still carried text or attribution directly on top of the image;
- some legacy links still pointed at the retired public catalog grid;
- composition rules existed across handoffs but were not yet formalized as one compact, canonical art-direction contract;
- the system could therefore continue accumulating page-specific fixes.

The corrective strategy is deliberately small:

1. keep the existing design system;
2. add one compact visual-direction contract;
3. implement the contract on the highest-impact surface first: Home;
4. eliminate known overlay collisions;
5. introduce deterministic internal-link QA;
6. stop adding new visual primitives unless one of five existing archetypes cannot solve the editorial problem.

---

## Surface audit

### 1. Global shell

**Status: KEEP**

Strengths:
- shared navigation is already centralized;
- active route semantics are clear;
- mobile menu is complete;
- Buscar remains utility rather than primary editorial territory;
- semantic tokens are already canonical.

Action:
- no redesign.
- preserve shell consistency while allowing composition below it to vary.

### 2. Home / portada

**Status before pass: RECOMPOSE**

Problem:
- strong images and typography were still read as a repeated web pattern;
- the page opened directly into a story block rather than feeling like the current issue of a magazine;
- image presentation lacked enough editorial framing;
- supporting stories used similar scale relationships.

Implemented:
- editorial masthead / issue context;
- one dominant Cover Spread;
- visible folio/index rail;
- framed media with captions outside photography;
- supporting stories with deliberately different geometry;
- typographic index as a pause between stories and Discovery;
- direct routes to Historias, Saber, Personas and Discovery;
- family entry points now route to canonical family pages.

Expected result:
- first viewport reads as an authored cover, not a feed;
- the scroll changes pace across sections;
- image/story ownership stays explicit.

### 3. Historias / Magazine archive

**Status: KEEP WITH EXISTING CLOSEOUT**

Already resolved:
- archive hierarchy is type-led rather than card-led;
- lead story can own a reviewed dominant visual;
- secondary imagery remains sparse.

No new visual system required.

### 4. Story pages

**Status: KEEP / APPLY CONTRACT TO FUTURE STORIES**

Existing strengths:
- documentary images render with provenance in normal flow;
- Ropion story has documentary material interruptions;
- story continuation links preserve editorial orientation.

Rule going forward:
- every new story must use the Story Pair / documentary interruption logic before inventing another article layout.

### 5. Saber

**Status: KEEP**

Already aligned:
- diagrams are semantic HTML/CSS;
- materials are documentary where appropriate;
- educational labels are real text, not baked into imagery.

No new infographic system required.

### 6. Personas

**Status before pass: FIX OVERLAY**

Problem:
- real portrait credit text was positioned on top of the photograph;
- this is precisely the class of text-over-image collision the new visual contract prohibits by default.

Implemented:
- image now occupies its own visual field;
- license/provenance caption moves into normal document flow below the portrait;
- fallback monogram remains deliberately typographic and is not pretending to be photography.

### 7. Discovery

**Status: FUNCTIONALLY STRONG / ROUTING REFINEMENT**

Strengths:
- real family exploration exists;
- subfamilies, materials, contexts, related perfumes, people and stories are available;
- Atlas and personal signals are real interactions.

Implemented:
- family signals now prefer canonical family pages when a mapping exists instead of defaulting to generic search.

Rule:
- Discovery can be visually expressive, but every visual element must advance exploration.

### 8. Club

**Status: KEEP**

Club is intentionally incomplete and says so.
The waitlist has a real function.
The three “Mientras tanto” routes are real continuations.

No decorative feature expansion recommended until Club has a real product state.

### 9. Buscar

**Status: KEEP**

Search is already framed as a publication utility.
No separate visual identity is needed.

### 10. Legacy / non-primary surfaces

**Status: AUDIT FOUND A DEAD ROUTE**

The new deterministic link audit found a real legacy problem:

- `apps/web/src/components/home/TasteLanding.tsx` linked to retired `/catalogo`.

Corrected:
- direct “Explorar catálogo” route changed to Discovery;
- family-driven catalog-grid links changed to valid Buscar routes.

This is evidence that a permanent link gate is necessary even when the component is not part of the current public Home.

---

## System decision

Aromia now has only five approved composition archetypes:

1. Cover Spread
2. Story Pair
3. Editorial Index
4. Knowledge Plate
5. Person Profile

No sixth archetype should be added merely because a page feels visually repetitive.

First ask whether scale, whitespace, crop or ordering can create the needed variation inside one of the five.

---

## Image rule

A visual is acceptable only if it passes both questions:

1. **Why this image?**
2. **Why this presentation?**

An image can be technically 3D and still be editorially flat.

A photograph can be simple and still be editorially deep if the crop, framing, neighboring typography and narrative timing give it a clear role.

---

## Text-over-image rule

Default: **NO**.

Allowed only when:
- the image was selected for overlay;
- contrast is verified on mobile and desktop;
- the overlay carries editorial meaning.

Attribution, provenance and explanatory captions belong outside photography.

---

## Link integrity rule

A visible action must resolve to:
- a real route;
- a real external destination;
- or a functioning control.

Implemented repository gate:
- `scripts/audit-internal-links.mjs`
- `npm run audit:links`
- wired into `Aromia Strict Audit`

The first run immediately found a retired `/catalogo` route, which was corrected.

---

## Responsive acceptance

The visual contract requires review at:

- 390×844
- 768×1024
- 1280×900
- 1440×1000

Primary checks:
- first-viewport hierarchy;
- crop integrity;
- image/story ownership;
- no overlay collisions;
- no horizontal overflow;
- headline wrapping;
- visible focus;
- coherent dark theme;
- working links.

Code/CI can prove route/build integrity.
Rendered aesthetic judgment still requires a browser screenshot pass whenever a suitable browser runner is available.

---

## What this pass intentionally did not do

- no new color palette;
- no new font family;
- no new generic component library;
- no wholesale token migration;
- no generated filler imagery;
- no redesign of already-closed El Coleccionista;
- no modification of SubBatch 01 asset 02A / PR #145;
- no attempt to make Club look complete before it is functionally complete.

---

## Final art-direction rule

> **Composition may vary. Identity does not reset. Every image must earn both its subject and its placement.**

This audit is complete at the code/system level once PR CI is green, merged and production deployment is verified.
