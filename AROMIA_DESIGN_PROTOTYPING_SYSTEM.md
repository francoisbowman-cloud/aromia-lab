# Aromia — Design Prototyping System

## Purpose

Aromia uses **Claude Design sparingly** and **Claude Code continuously**.

Claude Design is a high-cost creative instrument. It is not part of the routine article-production loop and should not be invoked for every publication. Its purpose is to make occasional high-leverage interventions that discover or substantially extend Aromia's visual language.

Claude Code turns those discoveries into durable, editable, reusable web infrastructure.

Canva is not a required art-direction surface. It may be used occasionally when a specific story benefits from collage, print-like composition, social graphics or another fixed-format treatment, but it must not constrain the web identity.

The goal is a **recognizable but non-repetitive editorial identity**: Aromia should retain brand memory across every page while allowing each story to develop its own visual behavior.

## Identity principle

Aromia must be recognizable without becoming formulaic.

> **Repeat identity. Vary composition.**

Or, operationally:

> **Repeat relationships, not finished layouts.**

Recognition should come primarily from stable relationships — typography, grid logic, editorial spacing, image behavior, navigation, captions, material sensibility, motion restraint and voice — rather than repeating the same hero, section order, card system or visual trick.

A reader should be able to feel that two radically different stories belong to Aromia even when their compositions are not alike.

## Three-layer architecture

### 1. Aromia Foundation — stable

Changes slowly and provides brand memory:
- typography roles and scale logic;
- base neutral/color behavior;
- grid, gutters and reading measures;
- spacing rhythm;
- navigation and article-shell behavior;
- image/caption/credit treatment;
- links, contextual commerce and disclosure;
- motion principles;
- accessibility and responsive rules.

### 2. Editorial Primitives — reusable and editable

These are compositional building blocks, not cards or complete templates. Examples may include:
- editorial opening;
- narrow/extended reading field;
- full-bleed image;
- lateral image/text relationship;
- caption/credit system;
- pull quote;
- marginal note;
- image sequence;
- archival/document treatment;
- serial/repetition field;
- verified object/product reference;
- whitespace pause/reset;
- density transition;
- contextual reference/commerce close.

Primitives must support variants and responsive behavior. They should be composable without forcing every article into the same visual sequence.

### 3. Story Composition — variable

Each publication selects, combines, modifies or occasionally extends the primitives according to its narrative:
- density and whitespace;
- sequence;
- image scale/crop;
- episodic color;
- typographic emphasis;
- marginalia;
- repetition;
- archive/time behavior;
- section transitions;
- story-specific motion.

A story may also introduce a new primitive when the existing vocabulary cannot express a legitimate editorial need.

## Claude Design — sparse founding intervention

Claude Design acts as a **visual R&D / founding design studio**, not the routine article designer.

Use it when the expected design learning is durable enough to justify its token cost, such as:
- establishing or substantially revising the Aromia visual foundation;
- inventing a new editorial primitive family;
- solving a repeated visual limitation across several stories;
- creating a major new publication surface;
- exceptional art-direction experiments where ordinary composition is insufficient.

Do not invoke Claude Design merely because a new article exists.

### Founding specimen

`El Coleccionista` is the first high-leverage Design intervention.

Claude Design should create one exceptional web-native prototype while simultaneously identifying what can become durable design capital.

Every meaningful design decision should be classified as:

- `AROMIA_FOUNDATION` — stable identity relationship likely to survive across the publication;
- `REUSABLE_PRIMITIVE` — editable building block with legitimate future uses;
- `STORY_SPECIFIC` — belongs to this story and must not become a default;
- `EXPERIMENT` — promising but unproven; keep isolated until evidence supports promotion.

The purpose is not to turn `El Coleccionista` into the universal Aromia template.

## Required Design deliverables

A high-cost Claude Design intervention should leave durable artifacts in the repository, not only a screenshot.

For the founding intervention, produce:

1. **Full web-native prototype** of `El Coleccionista`, including desktop and meaningful mobile behavior.
2. **Visual Grammar Sheet** documenting the identity relationships discovered: grid, typography, spacing, image logic, pacing, captions, material/color behavior and motion principles.
3. **Primitive Inventory** describing reusable components/relationships, their variants, constraints and responsive intent.
4. **Story-Specific Ledger** identifying decisions that must remain local to `El Coleccionista`.
5. **Implementation Handoff** sufficient for Claude Code to construct the shared system without guessing.

Prefer repository-native, inspectable artifacts: HTML/CSS, React/Next prototype routes, structured markdown specs, component studies and screenshots/renders where useful.

Prototype files are not automatically production code.

## `/design-lab` — permanent editable design surface

Claude Code should convert accepted Design discoveries into a repository-native **design lab**.

The design lab is the inexpensive long-term visual workspace after Claude Design leaves the routine loop. It should expose, in real browser conditions:
- foundation tokens and typography;
- grid/reading measures;
- editorial primitives;
- primitive variants;
- responsive behavior;
- image/caption treatments;
- density/whitespace examples;
- motion examples where relevant;
- composition experiments that have not yet been promoted.

The design lab is not a public style-guide page unless explicitly decided later. It is a working surface for ChatGPT, Claude Code, OMNI and the Publisher.

Changes should remain editable in code and inspectable in the browser.

## Composition recipes — grammar, not templates

Aromia may maintain lightweight composition recipes that describe narrative relationships without dictating a finished layout.

Examples:

`QUIET → IMAGE → LONG READ → PAUSE → CLOSE`

`RECOGNITION → ACCUMULATION → SATURATION → ARCHIVE → RESET → CLOSE`

A recipe may suggest pacing, density and primitive families, but must never prescribe identical coordinates, section counts or styling across unrelated stories.

Recipes are starting grammars. Art Direction may rearrange, omit, combine or extend them.

## Routine article workflow

After the founding system exists, normal articles should not require Claude Design.

`EDITORIAL READY → CHATGPT ART DIRECTION → COMPOSE FROM FOUNDATION + PRIMITIVES → EARLY OMNI → CLAUDE CODE IMPLEMENT/REFINE → BROWSER QA → FINAL OMNI → PUBLISHABLE`

ChatGPT owns story-level visual composition and decides:
- which primitives are appropriate;
- their order and variants;
- where the composition should break the normal rhythm;
- whether a new primitive is genuinely required;
- asset direction and visual pacing.

Claude Code owns implementation and can create controlled variants from the existing system. It must not flatten different stories into the same page merely to maximize component reuse.

## New primitive rule

Do not build a large speculative component library.

A new primitive enters the shared system only when:
1. a real editorial need cannot be expressed well with the existing vocabulary;
2. the proposed primitive has a clear narrative/perceptual role;
3. it does not merely duplicate an existing primitive with cosmetic differences;
4. it is implemented with variants/responsive behavior appropriate to future reuse;
5. after use, its status is reviewed as `LOCAL`, `EXPERIMENTAL` or `CANONICAL`.

A primitive may remain local forever. Reuse is not a virtue when it erases editorial specificity.

## Promotion rule

Promote a relationship into the stable system only when it is clearly foundational or has proved useful in more than one meaningful context.

Evidence may promote:

`STORY_SPECIFIC → EXPERIMENT → REUSABLE_PRIMITIVE → FOUNDATION`

Promotion is not automatic. OMNI and Art Direction should ask whether standardization improves brand memory without creating visible repetition.

## Anti-repetition gate

Before accepting an article composition, ask:

1. Is it unmistakably compatible with Aromia's visual identity?
2. Does it have at least one story-specific compositional behavior?
3. Could the exact same arrangement be reused unchanged for the next five articles?
4. Are primitives serving narrative purpose rather than appearing because they exist?
5. Is the system creating coherence without creating predictability?

If #3 is yes, the composition is too templated.

## Prototype acceptance gate

A Design prototype is not accepted merely because it is polished.

It must demonstrate:
- senior-level editorial/web design craft;
- clear point of view;
- strong typography and hierarchy;
- intentional grid behavior;
- deliberate image scale and cropping;
- professional spacing and rhythm;
- visual specificity to Aromia and the story;
- responsive feasibility;
- no novice/template feel;
- no generic AI luxury language;
- practical implementation without flattening the idea;
- enough reusable learning to justify Claude Design's cost.

Ask:

> Would a strong independent magazine or high-level digital design studio consider this authored work — and does it teach us something durable about Aromia?

If not, refine or reject it.

## Early OMNI

For major Design interventions:

`ART DIRECTION → DESIGN PROTOTYPE → EARLY OMNI → REFINE / REJECT / PASS`

For routine articles, Early OMNI can critique a browser-native composition assembled from the existing system without requiring Claude Design.

OMNI critiques professional craft, story specificity, authorship, authenticity, narrative gain, responsive viability and anti-AI/anti-template character. OMNI does not redesign.

## Claude Code — system builder + production

Claude Code has two responsibilities.

### After a Claude Design intervention

- inspect the accepted prototype and all classification ledgers;
- construct/update `/design-lab`;
- extract only approved foundation relationships and reusable primitives;
- preserve story-specific behavior locally;
- create editable variants rather than hard-coded copies;
- document the resulting system sufficiently for later actors.

### During routine production

- implement ChatGPT's composition using the existing system;
- create local composition code when a story legitimately differs;
- add a new primitive only under the New Primitive Rule;
- render desktop/mobile;
- compare against art direction;
- correct visible drift;
- run technical/final gates.

## Evolution cadence

Do not call Claude Design on a fixed schedule.

Re-enter Design only when accumulated evidence reveals a material design problem or major opportunity.

A useful cycle is:

`DESIGN INTERVENTION → SYSTEM EXTRACTION → MULTIPLE REAL ARTICLES → OBSERVE LIMITS → OPTIONAL DESIGN INTERVENTION`

This converts expensive Design sessions into durable capital rather than recurring production cost.

## Guiding principles

> **Prototype freely. Standardize carefully. Implement faithfully.**

> **Aromia keeps its identity through relationships, and its originality through composition.**
