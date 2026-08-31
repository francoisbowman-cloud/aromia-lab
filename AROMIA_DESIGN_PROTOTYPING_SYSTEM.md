# Aromia — Design Prototyping System

## Purpose

Aromia will use **Claude Design + Claude Code** as the primary visual prototyping and implementation path.

Canva is no longer a required art-direction surface. It may still be used occasionally when a specific story benefits from collage, print-like composition, social graphics or another fixed-format visual treatment, but it must not constrain the web identity.

The goal is to build a **solid, evolvable editorial design system**: stable enough to create a recognizable Aromia, flexible enough for each story to have its own visual behavior.

## Core model

The design system has two layers:

### 1. Stable Aromia foundation

This layer changes slowly and provides brand memory across the site:
- typography roles and scale logic;
- base colors and neutral surfaces;
- spacing rhythm and grid principles;
- navigation and article shell behavior;
- image/caption/credit treatment;
- links, contextual commerce and disclosure primitives;
- shared motion principles;
- accessibility and responsive rules;
- reusable editorial primitives.

### 2. Story-specific composition

This layer may change significantly from article to article:
- density and whitespace;
- visual sequence;
- image scale and cropping;
- episodic color;
- typographic emphasis;
- marginalia or annotation behavior;
- serial/repetition structures;
- archive/timeline treatments;
- section transitions;
- article-specific motion.

**Rule:** repeat relationships, not finished layouts.

Aromia should feel like one publication with many directed stories, not a set of unrelated microsites and not a single article template repeated forever.

## Role of Claude Design

Claude Design acts as the **visual prototyping studio**.

When an article, section or system surface needs visual work, Design should read the current repository state and create a concrete prototype that can be reviewed and iterated before production implementation.

A prototype should be sufficiently detailed to expose real design judgment:
- full composition, not only a hero;
- typography hierarchy;
- grid and alignment system;
- exact density and whitespace intent;
- real image roles and crop logic;
- responsive intent;
- section transitions;
- meaningful states or interactions when relevant;
- enough visual detail for Code to implement without guessing.

Design may prototype in code, static HTML/CSS, a dedicated prototype route, or another repository-native format that can be rendered and reviewed. Prefer formats that preserve inspectable structure and can evolve gradually.

## Repository-native prototype rule

Whenever practical, prototypes should live in the repository so they can become durable shared references rather than disposable screenshots.

Recommended structure:

```text
prototypes/
  editorial-system/
  el-coleccionista/
  home/
  discovery/
```

A prototype may contain:
- an isolated route or page;
- HTML/CSS/JS study;
- React/Next components used only for prototype review;
- screenshots/reference renders;
- a short design rationale;
- design tokens or component experiments when they are genuinely reusable.

Prototype files are **not automatically production code**. Code decides what should be promoted into shared production infrastructure after the design is accepted.

## Progressive refinement

Aromia does not need to solve its entire identity in one redesign.

The preferred method is:

`FOUNDATION → PROTOTYPE → REVIEW → REFINE → ACCEPT → IMPLEMENT → OBSERVE → EVOLVE`

A strong accepted prototype becomes evidence for the growing design system. Repeated successful decisions may later become shared primitives. A one-off story behavior should remain local.

This permits gradual modification without losing structural coherence.

## Prototype acceptance gate

A Design prototype is not accepted merely because it is polished.

It must demonstrate:
- senior-level editorial/web design craft;
- a clear point of view;
- strong typography and hierarchy;
- intentional grid behavior;
- deliberate image scale and cropping;
- professional spacing and rhythm;
- visual specificity to Aromia and/or the story;
- responsive feasibility;
- no novice/template feel;
- no generic AI luxury language;
- no unnecessary cards, pills, gradients, glassmorphism or decorative effects;
- practical implementation without flattening the idea.

Ask:

> Would a strong independent magazine or high-level digital design studio consider this resolved enough to present as authored work?

If not, refine or reject it.

## Early OMNI

OMNI enters after a meaningful Design prototype exists and before production implementation.

`ART DIRECTION → DESIGN PROTOTYPE → EARLY OMNI → REFINE / REJECT / PASS`

OMNI critiques professional craft, story specificity, authorship, authenticity, narrative gain, responsive viability and anti-AI/anti-template character.

OMNI does not redesign the prototype. Design/Art Direction remains responsible for the creative solution.

## Role of Claude Code

Claude Code owns faithful production translation after a prototype is accepted.

Code should:
- read the accepted prototype and art direction;
- identify stable primitives versus one-off composition;
- promote only genuinely reusable decisions into the shared design system;
- implement the real responsive page;
- preserve content semantics, accessibility, performance and SEO;
- render the implementation and compare it to the accepted prototype;
- correct visible drift before final QA.

Code must not simplify a sophisticated prototype into generic components merely because they are easier to reuse.

## Building the Aromia design system from evidence

Do not invent a large design system upfront.

The system should grow from successful prototypes.

When the same relationship proves useful repeatedly, it may become canonical, for example:
- article reading measure;
- metadata treatment;
- image credits;
- caption anatomy;
- editorial navigation;
- quote behavior;
- spacing intervals;
- responsive typography logic;
- commerce disclosure treatment.

Before promoting a pattern, verify that it has appeared successfully in more than one context or is clearly foundational.

## First proving ground

`El Coleccionista` is the first prototype under this model.

The objective is not to rescue the previous Canva study. Claude Design should reinterpret the article from the repository and produce a fresh, high-level web-native visual prototype.

The prototype should prove the article's core behavior:
- quiet recognition at the beginning;
- progressive visual accumulation;
- a shift toward archival/scarcity tension;
- a strong whitespace reset at `Sí, pero`;
- restrained contextual commerce after the editorial ending.

It should also begin revealing which decisions deserve to become part of Aromia's stable visual foundation.

## Guiding principle

> **Prototype freely. Standardize carefully. Implement faithfully.**
