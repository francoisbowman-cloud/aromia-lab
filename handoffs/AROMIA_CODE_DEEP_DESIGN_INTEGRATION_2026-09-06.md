# AROMIA — Code Deep Design Integration Handoff

DATE: 2026-09-06  
FROM: Publisher / ChatGPT  
TO: Code  
STATUS: READY TO EXECUTE  
BASE_REF: main

## Publisher directive

Run a second, deeper pass over Aromia with the same broad goal as the recently completed visual-direction implementation, but with significantly more rigor and stronger Design integration.

Do not treat the previous implementation, its prompt wording, its five archetypes, or its current CSS/component boundaries as artificial scope limits.

The previous pass is a baseline and evidence source, not a ceiling.

The objective is to make Aromia feel designed as one coherent editorial product across the full public experience.

## Scope authority

Code is authorized to inspect, challenge, refactor and improve any public-facing implementation layer that materially affects:

- hierarchy;
- composition;
- typography;
- spacing;
- image treatment;
- cropping;
- captions;
- transitions;
- responsive behavior;
- section rhythm;
- navigation continuity;
- information architecture;
- Discovery interaction presentation;
- Personas presentation;
- Saber presentation;
- article reading experience;
- related-content continuity;
- shared primitives;
- semantic tokens;
- component boundaries;
- page-specific CSS;
- dead/legacy surface removal;
- design consistency;
- accessibility;
- dark theme;
- visual QA infrastructure.

Code may modify shared components, design tokens, page structure, route presentation, CSS architecture and public UI primitives when the change is justified by rendered evidence.

Code is not required to preserve a weak implementation merely because it was introduced in PR #148.

## Non-negotiable product constraints

These are product truths, not prompt constraints:

1. Aromia is a perfume publication/editorial product, not a catalog storefront.
2. The public /catalogo grid remains retired; /catalogo/[slug] is a reference object.
3. Editorial imagery must have narrative ownership and provenance where required.
4. Rejected/quarantined generated imagery must not be reintroduced.
5. Do not invent real-person portraits.
6. Preserve accessibility, valid links and working routes.
7. Do not casually reopen the locked El Coleccionista release without evidence.
8. Do not overwrite unrelated editorial work or SubBatch pipelines.
9. Respect legal/licensing and publication-authority boundaries.
10. Production changes must pass repository gates and be evidence-backed.

Everything else may be challenged.

## Required Design integration

This pass must not be “Code doing CSS cleanup.”

Treat Design as an active implementation discipline.

For every major public surface, Code should answer:

- What is the primary visual idea?
- What is the first thing the reader sees?
- Where does the eye go next?
- What creates tension or relief?
- What is the visual role of the image?
- Why is the image this size?
- Why is the text this width?
- Where does the page intentionally slow down?
- Where is the next action?
- Does mobile preserve the same editorial meaning, or merely stack desktop?
- Does dark mode preserve hierarchy rather than just invert color?
- Does the page feel like the same publication as the rest of Aromia?

Do not approve a page because it is clean. Approve it because its composition is intentional.

## Full public-surface audit

At minimum inspect and render:

- /
- /magazine
- representative /magazine/[slug]
- representative /historias/[slug]
- all currently custom story templates
- /academia
- /perfumistas
- at least one real-portrait perfumer
- at least one monogram-fallback perfumer
- /descubrir
- /descubrir/familias
- representative /descubrir/familias/[familia]
- representative /catalogo/[slug]
- /buscar
- /club
- /quiz and result state where practical
- global header/footer/mobile navigation

Do not stop at source inspection. Use rendered evidence.

## Required viewport matrix

Minimum:

- 390×844
- 430×932
- 768×1024
- 1024×768
- 1280×900
- 1440×1000
- 1728×1117

Review both light and dark mode where the surface supports dark mode.

Use screenshots or equivalent browser evidence.

## Design-quality gates

A surface fails if any of these are true:

### Hierarchy failure
Two or more elements compete for primary attention without editorial reason.

### Rhythm failure
Three or more consecutive sections repeat the same structural pattern without narrative justification.

### Image failure
An image is present but does not carry a specific editorial role.

### Crop failure
The crop removes the visual evidence or subject that justifies the image.

### Overlay failure
Text over imagery reduces clarity, contrast, provenance visibility or composition quality.

### Density failure
Too many borders, labels, metadata lines, cards or CTAs compete in the same viewport.

### Empty failure
Whitespace exists only because the layout is unfinished rather than intentionally composed.

### Mobile failure
Desktop is merely stacked, producing broken ownership, image-image collisions, weak hierarchy or excessively long unbroken text runs.

### System failure
Repeated visible behavior is implemented independently across pages without a justified reason.

### Legacy failure
A retired ecommerce/catalog pattern remains visible or reachable without a current editorial role.

## Code architecture expectations

Code should prefer:

- semantic design tokens;
- reusable editorial primitives where repetition is real;
- page-specific composition when the narrative needs it;
- fewer, stronger primitives;
- deleting obsolete CSS/components rather than layering overrides indefinitely;
- explicit responsive composition;
- meaningful component names;
- documented exceptions.

Avoid:

- utility-class sprawl that hides design intent;
- accumulating one-off CSS patches;
- creating a huge generic component library;
- forcing every page into one template;
- preserving legacy components solely because they already exist.

## Required cross-check against current Design contracts

Read and use, but do not blindly obey if implementation evidence shows a problem:

- AROMIA_DESIGN_SYSTEM.md
- AROMIA_VISUAL_DIRECTION_SYSTEM.md
- audits/AROMIA_VISUAL_DIRECTION_FULL_AUDIT_2026-09-06.md
- apps/web/src/app/design-tokens.css
- apps/web/src/lib/siteNavigation.ts
- relevant art-direction and visual-generation protocols
- current production screenshots/evidence if available

If a design contract needs correction, update the contract as part of the same pass.

## Interaction and link rigor

Run the current internal-link gate and extend it if necessary.

Inspect:

- apparent buttons that are static;
- linked headlines;
- linked images;
- hover/focus states;
- keyboard navigation;
- active navigation;
- mobile menu;
- cross-surface continuity;
- broken or retired routes;
- misleading CTA language;
- inaccessible hit areas.

The rule is not merely “no dead links.”
The rule is:

> Every apparent action must behave exactly as its presentation suggests.

## Typography rigor

Review:

- display line breaks;
- widows/orphans where visually damaging;
- measure;
- line height;
- metadata scale;
- heading spacing;
- contrast;
- hierarchy across breakpoints;
- editorial italics;
- overuse of uppercase utility type;
- typography consistency between legacy and newer surfaces.

If necessary, adjust typography tokens or shared classes.

## Image rigor

For each visible image, classify it:

- documentary;
- interpretive;
- product/reference;
- portrait;
- decorative.

Decorative imagery should be rare.

If an image cannot be classified with a clear role, either:
- give it one;
- replace it with an approved asset;
- or remove it.

Do not generate new images merely to fill space.

## Acceptance standard

The target is not “looks better than before.”

The target is:

> A reader can move through Home, Historias, Saber, Personas, Discovery, reference objects and Club without feeling that they entered separately designed products.

And simultaneously:

> Each territory retains its own editorial character rather than collapsing into a universal template.

## Execution model

Code should:

1. audit;
2. render;
3. identify highest-leverage structural problems;
4. implement directly;
5. render again;
6. compare before/after;
7. iterate until major composition issues are resolved;
8. run technical gates;
9. open PR;
10. merge only when gates are green and no material visual regressions remain;
11. verify Railway production;
12. persist the final relay.

Do not stop after producing an audit document if fixes are implementable.

Do not ask the Publisher to choose between small implementation details that Design/Code can resolve from evidence.

Escalate only genuine strategic, legal/licensing, publication-authority, credential or irreversible-content decisions.

## Required deliverables

At minimum:

- a durable full-pass audit;
- implemented code changes;
- before/after visual evidence or screenshot ledger;
- updated design contract if new reusable truths were discovered;
- QA evidence for the viewport matrix;
- link/accessibility evidence;
- CI/build evidence;
- production deployment evidence;
- updated AROMIA_CURRENT_STATE.md;
- exact next actor/action.

## Relationship to the previous pass

PR #148 established a useful baseline.

Code should preserve what survives stronger scrutiny and replace what does not.

Do not optimize for consistency with the previous prompt.
Optimize for the strongest coherent version of Aromia that the current product, content and assets support.
