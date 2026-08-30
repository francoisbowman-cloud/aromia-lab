# Aromia — Editorial Workflow

Aromia is evolving from catalog-first commerce into a fragrance magazine. Stories come first; products and affiliate links appear only when editorially justified.

## Working model

Aromia works asynchronously. No actor needs to wait for another actor to finish a batch or remain in the same conversation. The repository is the newsroom and shared source of truth: each actor reads the current state, advances only the work that belongs to its domain, records the new state, and leaves the work ready for the next actor whenever that next actor arrives.

**Claude Cowork = Editor + Editorial Architect**

For each publication Claude should:
- research and fact-check the subject;
- write the article as editorial content, not a product page;
- structure the reading rhythm;
- identify moments where visual expression can materially improve the story;
- identify contextual commercial opportunities without writing to justify them;
- save completed editorial work in the repository and update its status.

Claude may produce one article or a batch of articles independently. It does not need to wait for visual direction or implementation before continuing editorial production.

**ChatGPT = Art Director + Visual Composer**

ChatGPT owns the final art direction of each publication, not only image generation. After reading the complete piece, ChatGPT may define:
- the visual concept;
- episodic page color and material palette;
- typographic hierarchy and scale;
- composition, density, whitespace and rhythm;
- image sequence, placement and treatment;
- quotes, captions, marginalia, dividers and other editorial devices;
- visual treatment of contextual commerce;
- responsive intent for the article;
- required visual assets, including the decision to use no image when stronger.

Claude must leave creative room for ChatGPT rather than prescribing finished image prompts. ChatGPT decides which visual language best serves each moment and may combine, reinterpret, or reject techniques.

Available visual vocabulary includes, but is not limited to:
- Hero Shot
- Conceptual Product Photography
- Advertising Still Life
- Lifestyle Product Photography
- CGI Product Visualization
- Commercial Beauty Photography
- Ingredient-Driven Composition
- editorial photography
- material/macro studies
- abstraction and metaphor
- negative-space compositions
- serial/repetition compositions
- diptychs/triptychs
- collage and typographic compositions
- environmental/scenographic imagery

These are tools, **not a checklist or closed menu**. Do not force a Hero Shot or product image when the story needs something else.

**Code = Web Production + Publisher**

Code owns technical implementation and publication once upstream work is ready. It should:
- read the article and art direction from the repository;
- implement the final web composition without silently inventing a different editorial or artistic direction;
- preserve accessibility, responsive behavior, performance, SEO and authentic product identity;
- implement contextual commercial links and measurement according to Aromia policy;
- render and verify the real page;
- correct implementation defects;
- publish work that has passed the required gates and reached `PUBLISHABLE` or its scheduled publication time;
- update repository state to `LIVE` after confirmed publication.

Normal editorial publication should not require manual approval article by article once the operating model is established. Architecture changes, material brand changes, high-risk technical changes or exceptional editorial cases should still escalate to the human Publisher.

**OMNI = Critic / Gate**

OMNI evaluates whether the combined editorial, visual and implemented solution actually improves the experience. It should reject decoration, unnecessary complexity, AI-slop, weak authenticity, visual work without perceptual/narrative gain, responsive regressions or commercial treatment that overwhelms the story.

OMNI is a QA tool, not another production department and not a reason to create new OMNI modules.

**Human = Publisher / Editor-in-Chief**

The human sets the line, can override the calendar, approves major strategic or brand decisions and remains final authority. Routine coordination between actors should not depend on the human carrying outputs from one system to another.

## Visual opportunity handoff

When Claude finds a moment where visual work could add meaning, mark:

```text
[AROMIA_VISUAL_OPPORTUNITY]
Narrative purpose:
Emotional objective:
Authenticity constraints:
Relationship to surrounding text:
Other hard constraints:
Creative freedom: LOW | MEDIUM | HIGH
```

Do **not** prescribe lens, lighting, exact camera, object positions, effects, complete set design, or a finished generation prompt unless the story genuinely requires a specific constraint.

The question for ChatGPT is:

> What is the strongest visual way to make this moment felt or understood?

ChatGPT may also decide that no image is the stronger solution.

## Repository handoff rule

The repository is the shared handoff surface between Cowork, ChatGPT, Code and OMNI.

The user should not need to copy and paste outputs between systems. An actor entering Aromia later should be able to inspect the repository, determine what is ready for its domain and continue from there.

Keep handoffs explicit and lightweight. Do not create a synchronization service, queue, extra branch topology, database workflow, schema or orchestration layer unless repeated real-world use proves it necessary.

### Minimal publication state

Each publication should expose a small human-readable state block:

```text
EDITORIAL: DRAFT | READY
ART_DIRECTION: PENDING | READY
VISUAL_ASSETS: PENDING | READY | NOT_REQUIRED
IMPLEMENTATION: PENDING | READY
QA: PENDING | PASSED | CHANGES_REQUIRED
PUBLISH: PENDING | PUBLISHABLE | SCHEDULED | LIVE
TARGET_DATE: YYYY-MM-DD | UNSCHEDULED
```

An actor advances only its own domain. Missing upstream work remains pending rather than being silently invented.

This state is intentionally small. It is a coordination convention, not a workflow engine.

## Asynchronous production model

Work may progress in batches of different sizes:

`Cowork writes 10 → ChatGPT art-directs 4 → Code implements 3 → QA passes 2 → Code publishes 2`

Nothing requires the complete batch to finish. Production and publication are separate concerns. Aromia may maintain a substantial inventory of finished work and release it according to the editorial calendar.

## Production loop

For a publication:

`IDEA → RESEARCH → STORY → EDITORIAL READY → ART DIRECTION → ASSETS → WEB COMPOSITION → QA → PUBLISHABLE → SCHEDULE/LIVE`

The loop is asynchronous: the repository, not a live handoff meeting, carries state between stages.

## Contextual commerce principle

Aromia may create desire, curiosity and purchase intent, but commercial pressure must remain subordinate to editorial value.

The preferred journey is:

`INTEREST → KNOWLEDGE → IDENTIFICATION → DESIRE → EXPLORATION → OPTIONAL PURCHASE`

not:

`ARTICLE → BANNER → BUY`

Aromia does not need to repeatedly tell the reader to visit a retailer. A contextual action such as `Ver opciones disponibles`, `Encontrarla` or `Seguir explorando` may lead to an affiliate destination when editorially justified.

Commercial relationships must still be disclosed clearly where required. Subtlety applies to sales pressure, **not** to disclosure.

Never:
- write an article merely to justify an affiliate link;
- alter an editorial conclusion to improve conversion;
- turn every perfume mention into a CTA;
- disguise advertising or an affiliate relationship as independent editorial information.

The reader must be able to enjoy Aromia completely without buying anything.

## Editorial principle

> **Una fragancia, una historia.**

Aromia does not need to show everything that exists. It needs to find what deserves to be told.
