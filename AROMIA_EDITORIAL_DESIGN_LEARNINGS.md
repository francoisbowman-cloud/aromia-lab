# Aromia — Editorial Design Learnings

## Purpose

This document exists to prevent the new Aromia from looking machine-generated, template-generated or like a generic AI interpretation of “luxury editorial”. It is a shared reference for Claude, Cowork, ChatGPT, Code and any editorial-design skill used on the project.

It complements `AROMIA_ART_DIRECTION.md` and `GUIA-VISUAL-aromia.md`; it does not replace them.

## Reference study — Canva editorial material

A Canva exploration on 2026-08-30 surfaced useful references including:

- `Nordic Minimalist Article Layout Magazine Cover` (`DAHPX-f8uXo`)
- `White Modern Interior Design Magazine Article A4 Document` (`DAHPX0Om5lk`)
- Aromia's earlier `Magazine Editorial Layout: Bleu de Chanel Focus` (`DAHTN7VLu14`)
- previous Aromia editorial/ecommerce experiments, used primarily as contrast rather than as templates to reproduce.

The useful lesson is not to copy any Canva layout. It is that credible editorial design is built from **specific decisions, constraints and hierarchy**, while AI-looking design tends to average many fashionable signals into every screen.

## What makes editorial work feel authored

### 1. A page needs a dominant idea

Do not give equal visual importance to headline, image, quote, metadata, product, CTA and decorative object. Decide what the reader should notice first, second and third.

A human-directed spread often feels surprisingly simple because one relationship dominates.

### 2. Asymmetry needs intention

Avoid both mechanical symmetry and random “creative” misalignment. An image may break a column because it advances the story; a title may sit low because the empty field above creates tension. Every broken alignment needs a reason.

### 3. Use a real grid, then violate it selectively

Editorial freedom works because an underlying structure exists. Establish columns, text measure, baseline rhythm and margins. Break them at moments of narrative importance, not on every section.

### 4. Whitespace is content

Do not automatically fill empty regions with gradients, floating ingredients, decorative lines, tiny labels or AI-generated atmosphere. Empty space can signal pause, importance, discomfort, luxury, transition or closure.

### 5. Typography is not a bag of effects

Use scale, weight, width, leading, measure and placement before reaching for outline text, gradients, extreme tracking, glow, masks or animated type. A publication should have typographic discipline across pages while allowing article-specific composition.

### 6. Images have editorial jobs

Before adding an image, name its job:

- evidence/documentation;
- orientation;
- atmosphere;
- metaphor;
- object study;
- sequence/comparison;
- interruption;
- transition.

If the job cannot be named, the image is probably decoration.

### 7. Cropping is authorship

Do not default every image to a centered 16:9 or full-bleed hero. Cropping determines what the reader sees and what remains outside the frame. Use portrait, narrow, panoramic, partial-object, edge-entry and inset compositions when the story supports them.

### 8. Repetition should create meaning

Repeated objects, numbers, captions or structures can express taxonomy, accumulation, obsession, time or comparison. Repetition without narrative purpose becomes a component library demo.

### 9. Imperfection can carry credibility

Real editorial photography and composition can contain awkwardness, grain, partial obstruction, uneven collections, unexpected negative space and ordinary environments. Do not “beautify” every subject into a campaign.

### 10. Every article needs its own visual behavior

Aromia shares typography, navigation, accessibility primitives and brand intelligence. It does **not** share one compulsory hero, one quote block, one image rhythm or one ending layout.

> Repeat relationships, not layouts.

## AI-look warning signs

Treat the following as review flags, especially when several appear together:

- giant centered serif headline + tiny uppercase eyebrow + cinematic full-bleed image on every article;
- black/cream/gold applied regardless of subject;
- excessive perfect symmetry;
- every section being a self-contained card;
- repeated rounded rectangles and pill labels;
- arbitrary gradients, glows, glass panels or blurred orbs;
- decorative botanical/ingredient objects floating around bottles without physical logic;
- perfectly staged luxury still lifes for subjects that should feel documentary;
- invented bottles, labels, packaging or materials presented as real;
- identical image aspect ratios throughout a long article;
- three-column feature grids used as a default explanatory device;
- oversized numerals that do not carry data or narrative meaning;
- pull quotes inserted merely to break text;
- generic “premium” microcopy;
- overuse of smooth scroll/parallax/reveal motion;
- every empty area being filled;
- visual novelty changing at every viewport with no editorial reason;
- layouts that could belong to fashion, watches, architecture or skincare after replacing only the nouns.

The last test is especially important: if the page is “luxury” before it is “this particular fragrance story”, it is too generic.

## Human-editorial review questions

Before approving a direction, ask:

1. What is the single dominant editorial idea?
2. Why is the first image this image, at this size, in this position?
3. Where does the reader pause?
4. Where does the page intentionally become dense or sparse?
5. What would be lost if the decorative elements disappeared?
6. Does the crop reveal an editorial judgment?
7. Are any visual facts being fabricated?
8. Does the design use the actual subject's material/color/history rather than a generic Aromia palette?
9. Does mobile preserve the idea or merely stack the desktop?
10. Could this exact composition plausibly be reused for the next five articles? If yes, it is probably too templated.
11. If the Aromia logo and article title were removed, could someone infer something about the story from the composition alone?
12. Does any element exist mainly because “editorial websites usually have one”? Remove or challenge it.

## Implications for Claude

Claude should use this document when designing page structure, reviewing implementation or maintaining an editorial-design skill.

Claude should **not** respond by creating a large new skill ecosystem. First inspect the existing skill/instructions actually available in its environment. Improve an existing editorial-layout/design skill if it already covers the domain and these principles materially strengthen it. Create a new skill only if there is a demonstrated capability gap that cannot be expressed cleanly in the current skill.

Any skill improvement should teach judgment, not prescribe a fixed Aromia template.

Useful capability areas for an editorial-design skill are:

- narrative-to-layout translation;
- grid and controlled grid-breaking;
- typographic hierarchy and reading measure;
- image role and cropping decisions;
- pacing/density/whitespace;
- multi-viewport editorial composition;
- documentary versus interpretive image truth;
- anti-template / anti-AI-look review;
- commerce integration without visual takeover.

Avoid encoding article-specific devices such as `El Coleccionista`'s accumulation behavior as global rules.

## Implications for ChatGPT

ChatGPT should actively resist its own common generation defaults. Art direction begins by reading the story, not by choosing a hero treatment.

For each publication, identify:

`STORY TENSION → VISUAL BEHAVIOR → PAGE RHYTHM → ASSET ROLES → RESPONSIVE TRANSLATION`

Only then decide what imagery to create or source.

## Implications for Code

Implementation fidelity is not achieved by turning every art-direction decision into a reusable card component. Reuse infrastructure and primitives; preserve article-specific composition where it carries meaning.

Code should flag rather than normalize away deliberate asymmetry, unusual whitespace, editorial crops or density changes.

## Aromia design maxim

> **Que se sienta dirigido, no generado.**

The goal is not to hide the use of AI. The goal is to ensure that human editorial judgment, factual integrity and story-specific decisions remain visible in the finished publication.