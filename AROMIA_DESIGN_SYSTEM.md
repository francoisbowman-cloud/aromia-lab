# AROMIA — Design System Contract

STATUS: CANONICAL
VERSION: 1.0
DATE: 2026-09-02

## 1. Purpose

Aromia must evolve as one publication/product, not as a collection of independently styled pages.

The design system exists to keep editorial freedom without allowing every story, utility or fix to invent a private palette, spacing logic, navigation shell or component language.

Core principle:

> **Composition may vary. Identity does not reset.**

## 1.1 Composition authority

The compact composition and art-direction rules are canonical in:

`AROMIA_VISUAL_DIRECTION_SYSTEM.md`

This document remains the token/component contract; the Visual Direction System governs how those primitives are composed into publication surfaces.

## 2. Architecture

Aromia visual decisions use three layers.

### Layer A — Global semantic tokens

Canonical implementation:

`apps/web/src/app/design-tokens.css`

These tokens represent reusable meanings rather than page-specific values:

- paper/surface;
- ink;
- line;
- chrome/background;
- material palettes;
- texture strengths;
- future spacing/type/motion semantics.

Existing compatibility tokens in `globals.css` remain valid while the migration is incremental.

### Layer B — Shared component/system primitives

Examples:

- typography families configured in `tailwind.config.ts`;
- `NavBar` / shared navigation primitives;
- footer;
- focus treatment;
- buttons;
- editorial link treatment;
- media frames;
- documentary captions;
- search controls;
- repeated story/perfume navigation patterns.

Repeated visible behavior should normally originate here.

### Layer C — Composition

A story or territory may have a unique composition:

- asymmetric grids;
- whitespace rhythm;
- material-study arrangements;
- controlled accumulation;
- full-bleed vs bounded media;
- editorial sequencing.

Composition may use custom geometry when that geometry is meaningful to the story.

It must consume Layers A/B rather than invent a parallel identity.

## 3. Hardcoding rule

Hardcoded values are not absolutely forbidden. They require classification.

### Allowed local values

Local geometry that expresses the composition and is unlikely to become a global semantic decision:

- a deliberately asymmetric grid ratio;
- a story-specific crop position;
- a one-off line angle inside a material study;
- a controlled editorial gap;
- an explicit breakpoint required by the composition.

### Not allowed as casual page-local values

- brand/background/text colors;
- recurring accent colors;
- border colors;
- focus colors;
- repeated shadows;
- recurring radii;
- shared navigation heights;
- repeated typography styles;
- repeated spacing that is clearly part of the system;
- dark-mode equivalents of system colors.

When a value carries meaning across more than one surface, promote it to a token or shared primitive.

## 4. No private palettes

A page must not introduce a private palette simply to solve a local visual problem.

If a new material territory is editorially justified, define semantic material tokens first, then consume them in the composition.

Current example:

`editorial-sharp.css` consumes the resin, mineral and floral material tokens defined in `design-tokens.css`.

The previous version, with page-local hex/RGBA values, is considered superseded architecture.

## 5. Token naming

Use semantic names.

Prefer:

- `--aromia-paper`
- `--aromia-line`
- `--aromia-resin-amber`
- `--aromia-mineral-cut-light`

Avoid:

- `--beige-2`
- `--gray-7`
- `--new-red`
- `--page3-bg`

The token name should explain why the value exists.

## 6. Typography

Canonical families:

- Display/editorial: Newsreader via `--font-display` / `font-display`
- Body/UI: Archivo via `--font-body` / `font-sans`
- Utility/metadata: IBM Plex Sans via `--font-plex` / `font-plex`

Typography hierarchy may vary in scale by composition, but repeated roles should remain recognizable.

Do not let browser-default typography define controls.

## 7. Editorial UI vs editorial composition

Aromia can be visually expressive without turning navigation into a different product on each page.

Global product behaviors should become consistent:

- how users know where they are;
- how they return home;
- how they move between territories;
- how search is reached;
- how mobile navigation works;
- how links and active states behave;
- how a story points to related content.

The content canvas can change dramatically beneath that navigational contract.

## 8. Cards are not the default container

Aromia should continue preferring:

- open editorial layouts;
- rails;
- lists;
- bands;
- full-bleed media;
- typographic fields;
- asymmetric compositions.

Use cards only when the information model genuinely benefits from a contained repeated object.

## 9. Accessibility is a system property

Minimum contracts:

- visible focus;
- 44px coarse-pointer target where applicable;
- readable editorial microcopy floor;
- adequate contrast;
- reduced-motion support;
- semantic heading/link behavior;
- captions/provenance when documentary imagery requires it.

Do not solve accessibility independently on every page.

## 10. Visual asset rule

Generated or documentary visuals follow:

`docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md`

Design tokens do not justify replacing meaningful imagery with generic CSS art.

CSS material fields are acceptable when the visual is intentionally abstract/material and resolution-independent. A CSS field must not masquerade as documentary photography.

## 11. Migration rule

Aromia currently contains legacy hardcoded values across multiple surfaces. This contract does not require a risky one-shot rewrite.

Migration order:

1. all new work uses the contract;
2. touched surfaces migrate while being changed;
3. system-level UX/UI audit identifies repeated legacy values/components;
4. repeated patterns are promoted into tokens/primitives;
5. visual QA confirms that migration did not flatten editorial character.

## 12. Review test

Before approving a frontend change ask:

1. Is this value semantic or merely geometric?
2. If semantic, does a token already exist?
3. If not, should one exist?
4. Am I creating a private palette/component language?
5. Would this page still feel like Aromia if its unique imagery disappeared?
6. Does the composition remain expressive without resetting navigation/UI conventions?

## 13. Current known debt

The repository still contains substantial literal color/spacing values in legacy surfaces including `globals.css`, global navigation/footer, Magazine, Discovery, Academia, Quiz, Club and perfume detail pages.

They are not automatically wrong. They are now explicitly part of the UX/UI audit and incremental design-system migration.

Do not perform mass find/replace purely for token purity. Consolidate repeated semantics with rendered QA.
