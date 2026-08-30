# Aromia — Editorial Workflow

Aromia is evolving from catalog-first commerce into a fragrance magazine. Stories come first; products and affiliate links appear only when editorially justified.

## Editorial agenda and ideation

The human Publisher is a primary source of Aromia topics and may propose a story at any time. Topic discovery is also a shared editorial responsibility rather than a human-only backlog.

**ChatGPT, Claude and Cowork should proactively suggest story ideas** when research, current work, the archive, cultural context or gaps in the editorial calendar reveal something worth pursuing. ChatGPT has a particular responsibility to surface promising editorial territories and visual/story opportunities, while Cowork and Claude should contribute ideas from research, writing and product context.

Suggestions are proposals, not automatic assignments. They should be judged by Aromia's editorial line and should avoid filling the calendar merely for volume or SEO. A strong idea can enter the editorial inventory whether it originated with the Publisher or an actor.

## Universal operating command

The canonical instruction for any Aromia actor is:

> **Continúa Aromia desde el repo.**

This is a role-aware command, not a request for every actor to do everything. When an actor receives it, that actor must:

1. enter `francoisbowman-cloud/aromia-lab` and inspect the current repository state;
2. read the canonical Aromia documents relevant to its role before acting;
3. identify work that is ready for its own domain, using publication state, editorial calendar and repository priority;
4. advance as much eligible work as is reasonable without asking the human to select an article or manually carry a handoff;
5. never silently perform another actor's unresolved responsibility merely because that actor has not arrived yet;
6. preserve previously approved work unless new evidence requires a correction;
7. update the repository state and leave completed work ready for the next actor;
8. stop and escalate only for a real blocker, material risk, strategic/brand decision or missing prerequisite that cannot be resolved from the repository.

The command therefore resolves differently by role:

- **Cowork:** find editorial needs and eligible ideas/articles; research, write and advance them to `EDITORIAL: READY`.
- **ChatGPT:** find `EDITORIAL: READY` work whose art direction is pending; read the complete piece, art-direct it, create/direct required assets and advance its visual states.
- **Code:** find work whose editorial and art prerequisites are ready; implement, render, correct, run the required gates and publish when its state/calendar authorizes publication.
- **OMNI:** participate both as an early creative critic during art direction and as the final rendered-experience gate. It critiques; it does not take over authorship or implementation.

### Code-only publication override

Because **Code is the only production actor authorized to take a publication to `LIVE`**, there is one explicit operational override:

> **Continúa Aromia desde el repo, sin publicar.**

This modifier is intended for **Code**. It means: perform all eligible implementation, rendering, correction and verification work; a piece may reach `PUBLISHABLE`, but Code must not deploy/publish it or change `PUBLISH` to `LIVE`.

For Cowork, ChatGPT and OMNI, `sin publicar` has no additional effect because those actors never have publication authority in the first place.

Absent this override, the normal command allows Code to publish work that has passed all required gates and is authorized by its `PUBLISH` state and editorial schedule. Routine eligible publication does not require article-by-article human confirmation.

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

### Early OMNI creative critique

OMNI does not need to wait for Code or a finished browser render. During Art Direction it may enter as a **critique loop** after a meaningful visual proposition exists: a Canva artboard, composition study, asset direction, or comparable visual specimen.

The early loop is:

`STORY → ART DIRECTION → VISUAL STUDY → OMNI CRITIQUE → REFINE / REJECT → ART DIRECTION READY`

This is distinct from final QA. Its purpose is to raise the creative ceiling before implementation cost hardens weak decisions.

Early OMNI should evaluate, with evidence where possible:
- story-specificity: does the composition belong to this story rather than generic luxury/editorial design?
- professional craft: does it demonstrate expert hierarchy, grid control, typography, cropping, pacing, spacing and image judgment rather than novice/template behavior?
- authored humanity: does it feel intentionally directed without simulated scrapbook imperfection or decorative pseudo-humanity?
- anti-AI character: are there recognizable generation defaults, over-symmetry, generic luxury signals, unnecessary visual effects or implausible imagery?
- narrative gain: does the visual system deepen understanding, tension, atmosphere or pacing?
- restraint: is complexity earned, and is simplicity sophisticated rather than underworked?
- authenticity: are documentary/product identities factual and verifiable?
- Aromia identity: does the proposal strengthen the publication's evolving visual memory without forcing a universal layout?

OMNI may return:

`EARLY_OMNI: PASS | REFINE | REJECT`

`REFINE` must identify concrete weaknesses and desired perceptual/narrative improvement, not prescribe a replacement design. `REJECT` is appropriate when the concept is fundamentally generic, amateur, misleading or visually weak.

**Authorship remains with ChatGPT.** OMNI is the demanding critic in the room, not a co-designer. It should not homogenize experimental work into safe patterns or convert critique into another template.

A proposal should not advance to `ART_DIRECTION: READY` merely because it is clean or technically feasible. It should feel both authored and professionally resolved.

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

**OMNI = Early Creative Critic + Final Gate**

OMNI has two deliberately different interventions:

1. **Early creative critique:** challenges meaningful visual studies before implementation, looking for generic AI aesthetics, novice composition, weak story specificity, authenticity failures and insufficient craft.
2. **Final rendered gate:** evaluates the combined editorial, visual and implemented experience after Code renders it, including responsive behavior, accessibility/performance-related visual consequences, implementation fidelity, commercial pressure and regressions.

OMNI should reject decoration, unnecessary complexity, AI-slop, weak authenticity, visual work without perceptual/narrative gain, responsive regressions or commercial treatment that overwhelms the story.

OMNI is a critic/QA system, not another production department and not a reason to create new OMNI modules.

**Human = Publisher / Editor-in-Chief**

The human sets the line, can propose stories directly, can override the calendar, approves major strategic or brand decisions and remains final authority. Routine coordination between actors should not depend on the human carrying outputs from one system to another.

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
EARLY_OMNI: PENDING | PASS | REFINE | REJECT
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

`Cowork writes 10 → ChatGPT art-directs 4 → early OMNI critiques 4 → ChatGPT resolves 3 → Code implements 3 → final QA passes 2 → Code publishes 2`

Nothing requires the complete batch to finish. Production and publication are separate concerns. Aromia may maintain a substantial inventory of finished work and release it according to the editorial calendar.

## Production loop

For a publication:

`IDEA → RESEARCH → STORY → EDITORIAL READY → ART DIRECTION → VISUAL STUDY → EARLY OMNI → ART DIRECTION READY → ASSETS → WEB COMPOSITION → FINAL QA → PUBLISHABLE → SCHEDULE/LIVE`

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
