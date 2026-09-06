# AROMIA — Visual Direction System

STATUS: CANONICAL
VERSION: 1.0
DATE: 2026-09-06

## Purpose

Aromia must read as a composed perfume publication, not as a sequence of web blocks.

This document is intentionally compact. It does not create a new visual subsystem. It formalizes the few composition rules that every surface must obey on top of `AROMIA_DESIGN_SYSTEM.md`.

Core principle:

> **A page is an editorial composition, not a stack of components.**

---

## 1. The eight rules

### 1. Story ownership

Every image belongs to one story, person, material or learning idea.

Do not place two unrelated images together in a way that makes ownership ambiguous.

### 2. Images are composed, not pasted

A photograph must arrive through a deliberate frame:

- bounded by whitespace, line, caption or asymmetry;
- with a crop chosen for the page;
- with a clear relationship to nearby type.

A raw rectangular image followed by a text rectangle is not the default.

### 3. No decorative overlay by default

Text over photography is prohibited unless all three conditions are true:

1. the image was selected for overlay use;
2. contrast is verified at mobile and desktop sizes;
3. the overlay adds editorial meaning rather than saving space.

Captions, provenance and metadata normally live outside the image.

### 4. Rhythm changes every one or two stories

Do not repeat the same image/text geometry three times in succession.

Allowed composition changes include:

- dominant image + narrow text;
- text-led spread + inset image;
- cinematic horizontal interruption;
- typographic index / no image;
- image pair only when both images belong to the same narrative unit.

Variation is structural, not decorative.

### 5. One dominant idea per viewport

At any typical viewport height, the reader should understand what to look at first.

Competing headlines, equally weighted photographs and simultaneous CTAs are a failure of hierarchy.

### 6. Whitespace is an active element

Empty paper is not unfinished space.

Use it to separate stories, slow the scroll and establish hierarchy. Do not fill a gap merely because it exists.

### 7. Every visible action must go somewhere

A title, label, CTA or apparent control must be one of:

- a real link;
- a functioning control;
- clearly static editorial text.

No faux buttons, dead titles or decorative controls.

### 8. Mobile is recomposed, not merely stacked

Mobile order is explicitly authored.

The default narrative sequence is:

`image → its story → next image → its story`

unless a page-specific reason justifies another order.

---

## 2. Five composition archetypes

These are enough for Aromia. New archetypes require evidence, not novelty.

### A. Cover Spread

Use for Home / issue lead.

- one dominant image;
- one primary headline;
- one short deck;
- one primary action;
- optional issue/index rail;
- image and text remain separate surfaces.

### B. Story Pair

Use for supporting stories.

- image and corresponding copy form a single unit;
- sides may alternate;
- mobile keeps image directly adjacent to its own copy.

### C. Editorial Index

Use for archives, navigation and discovery entry points.

- type-led;
- sparse imagery;
- strong numbering / metadata;
- avoids a uniform card grid.

### D. Knowledge Plate

Use for Saber / educational material.

- semantic HTML/CSS diagrams first;
- photography only where the material itself teaches something;
- labels remain readable text, never baked into a generated image.

### E. Person Profile

Use for Personas.

- portrait or explicit monogram fallback;
- name and biography own the composition;
- work lists remain secondary;
- real portraits require source/provenance.

---

## 3. Image presentation contract

### Documentary image

Use when the image is evidence or real-world context.

Required:

- source/provenance when licensing requires it;
- caption in normal flow;
- no synthetic treatment that makes it look generated;
- crop must not remove the subject that justifies the image.

### Interpretive image

Use when the image expresses an editorial idea.

Required:

- narrative test: what exact idea does this image carry?
- no fake logo, brand or identifiable commercial bottle;
- no generic luxury shorthand;
- no generated typography inside the image.

### Product/reference image

Use only when the object itself is the information.

Required:

- clean product visibility;
- no editorial overlay that obscures product recognition;
- not used as a decorative substitute for story photography.

### Frame behavior

Every major editorial image uses at least one framing device:

- generous paper margin;
- rule line;
- caption strip below;
- asymmetrical inset;
- crop offset;
- paired editorial metadata.

Do not add ornamental frames purely to make the page “fancy.”

---

## 4. Typography hierarchy

Use the existing canonical families only:

- Newsreader — editorial display;
- Archivo — body/UI;
- IBM Plex Sans — metadata/utility.

Aromia needs four repeated roles:

1. **Display** — the primary headline.
2. **Deck** — one thought that opens the reading.
3. **Body** — sustained reading.
4. **Metadata** — territory, index, provenance, controls.

Avoid adding new type styles to solve one page.

---

## 5. Spacing rhythm

Use three editorial spacing bands conceptually:

- **tight** — metadata inside one unit;
- **reading** — headline/deck/body relationships;
- **section** — separation between narrative units.

Exact values may vary by composition, but adjacent sections must not accidentally collapse into one another.

A section break should be visible through at least one of:

- whitespace;
- rule line;
- change of column structure;
- change of media scale.

---

## 6. Home / portada contract

Home is not a chronological feed.

It is the current issue cover and must contain:

1. an editorial masthead / issue context;
2. one dominant lead spread;
3. supporting stories with different scale relationships;
4. a deliberate pause or typographic index;
5. a route into Discovery / Saber / Personas without turning the bottom into a utility dashboard.

Prohibited Home pattern:

`same-size image → same-size text → same-size image → same-size text → repeat`

---

## 7. Link and interaction contract

### Link appearance

If text visually behaves like a link, it must be clickable.

### CTA density

One primary CTA per narrative unit.

Secondary links may exist but must not compete at the same weight.

### Dead-link prevention

The repository must run the internal-link audit in CI.

The audit checks:

- literal internal hrefs against App Router routes;
- `#` placeholders;
- `javascript:` links;
- obviously invalid internal paths.

Dynamic runtime hrefs remain the responsibility of functional tests/browser QA.

---

## 8. QA contract

Every meaningful visual change must be checked at minimum at:

- 390×844 mobile;
- 768×1024 tablet;
- 1280×900 desktop;
- 1440×1000 wide desktop.

Check:

- hierarchy in first viewport;
- image/story ownership;
- text-over-image contrast;
- crop integrity;
- dead-looking controls;
- dead links;
- title wrapping;
- horizontal overflow;
- focus states;
- dark theme where applicable;
- captions/provenance;
- next action at the end of the page.

---

## 9. Surface-specific intent

### Home

Feels like opening the issue.

### Historias / Magazine

Feels like browsing a magazine archive, not a product grid.

### Story

Feels like sustained reading with visual interruptions that belong to the argument.

### Saber

Feels like editorial learning, not a dashboard.

### Personas

Feels human and authored, not database-like.

### Discovery

Feels exploratory and functional, not decorative.

### Club

Feels intentionally incomplete until there is a real product to enter.

### Buscar

Feels like a utility inside the publication, not a separate app.

---

## 10. Change rule

Before adding a new visual primitive, ask:

> Can this be solved with one of the five archetypes above?

If yes, reuse it.

If no, the implementation must explain what editorial problem the new primitive solves.

The goal is not to keep growing a design system.

The goal is to keep Aromia recognizably Aromia while the content changes.
