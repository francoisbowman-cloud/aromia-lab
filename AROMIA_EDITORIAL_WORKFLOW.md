# Aromia — Editorial Workflow

Aromia is evolving from catalog-first commerce into a fragrance magazine. Stories come first; products and affiliate links appear only when editorially justified.

This document is the canonical newsroom workflow for editorial production. It must be read together with `docs/operations/AROMIA_MANUAL_OPERATIVO_CODE_COWORK_CHATGPT.md`. When older wording conflicts with the security boundary defined here, the stricter repository-control rule wins: **Cowork prepares repository-ready work, but Code owns Git/GitHub integration.**

## Editorial agenda and ideation

The human Publisher is a primary source of Aromia topics and may propose a story at any time. Topic discovery is also a shared editorial responsibility rather than a human-only backlog.

**ChatGPT, Claude and Cowork should proactively suggest story ideas** when research, current work, the archive, cultural context or gaps in the editorial calendar reveal something worth pursuing. ChatGPT has a particular responsibility to surface promising editorial territories and visual/story opportunities, while Cowork and Claude should contribute ideas from research, writing and product context.

Suggestions are proposals, not automatic assignments. They should be judged by Aromia's editorial line and should avoid filling the calendar merely for volume or SEO.

## Universal operating command

The canonical instruction for any Aromia actor is:

> **Continúa Aromia desde el repo.**

This is role-aware. It does not authorize every actor to do everything.

Every actor must:

1. inspect the current `francoisbowman-cloud/aromia-lab` state before acting;
2. read the canonical documents relevant to its role;
3. identify work ready for its own domain;
4. advance as much eligible work as is reasonable without asking the human to manually select or shuttle routine handoffs;
5. never silently take over another actor's unresolved responsibility;
6. preserve approved work unless new evidence requires correction;
7. leave explicit state/evidence for the next actor;
8. escalate only for a genuine blocker, material risk, strategic/brand decision or missing prerequisite that cannot be resolved from the available project state.

Role resolution:

- **Cowork:** research, fact-check, write, structure and prepare editorial work to `EDITORIAL: READY` in its staging workspace. It does **not** push or write to the remote repository.
- **Code:** owns Git/GitHub integration of Cowork output, then later owns implementation, rendering, technical correction and publication.
- **ChatGPT:** finds integrated `EDITORIAL: READY` work whose art direction is pending; art-directs it, composes its visual language and creates/directs required assets.
- **OMNI:** enters as early creative critic and later as final rendered-experience gate.

### Code-only publication override

Because Code is the only production actor authorized to take a publication to `LIVE`, there is one operational override:

> **Continúa Aromia desde el repo, sin publicar.**

For Code this means: perform eligible integration/implementation/rendering/correction/verification, but stop before deployment/publication. A piece may reach `PUBLISHABLE`, never `LIVE`.

For Cowork, ChatGPT and OMNI this modifier adds nothing because they never have publication authority.

## Security and repository ownership

The repository boundary is deliberate, not a missing permission to be fixed casually.

Canonical responsibilities:

- `main` remains the unique remote source of truth;
- Code owns Git/GitHub operations, branches, commits, PRs, merges and deployment integration;
- Cowork must not push, merge, publish to `main`, modify Railway or become the owner of a remote working branch;
- ChatGPT may write project documentation or state through an explicitly authorized connector when available, but does not replace Code's responsibility for technical branch/merge/deploy control;
- OMNI does not implement or publish.

A `403` preventing Cowork from pushing is therefore consistent with the intended security model.

## Working model

Aromia works asynchronously. Actors do not need to share a live conversation. The remote repository is the canonical newsroom **after integration**; Cowork's staging workspace is the deliberate exception before integration.

### Cowork staging model

> **Cowork produces repository-ready work, not repository writes.**

Cowork may use a temporary working copy/checkout of the current project in its own workspace in order to understand context and organize changes, provided it first confirms that the checkout derives from the current `main` or records the exact base SHA it used.

Cowork may create a local/staging branch such as:

```text
editorial/ambroxan-y-ropion
```

That branch is **not a GitHub collaboration branch and not production state**. It is only a staging container inside Cowork's workspace.

Cowork may make local commits if its environment supports them. Their purpose is to group and preserve work, not to publish it remotely.

Cowork must never attempt to make that staging branch authoritative.

### Cowork handoff package

When a Cowork batch is ready, leave enough information for deterministic ingestion:

```text
COWORK_STAGE: READY_FOR_CODE_INGEST
BASE_MAIN_SHA: <sha or clearly recorded main state>
STAGING_BRANCH: <local/staging name if applicable>
EDITORIAL_ITEMS: <list>
EDITORIAL_STATE: READY | DRAFT
SOURCE_NOTES: <paths/files>
VISUAL_OPPORTUNITIES: PRESENT | NONE
KNOWN_ISSUES: <list or NONE>
```

The deliverable may be a workspace branch, commit/bundle, patch, downloadable files or an equivalent staging artifact supported by Cowork. It is not canonical until Code ingests it.

### Code ingestion of Cowork work

Code must:

1. inspect the Cowork handoff and recorded base;
2. compare it with current `main` and resolve staleness before integration;
3. create or use a temporary objective-based Code branch from current `main`;
4. ingest only the intended editorial artifacts and provenance/source material;
5. preserve Cowork authorship/provenance rather than silently rewriting content during transport;
6. place integrated work in the canonical repository locations;
7. validate the publication state and source references;
8. commit/push through normal Code-controlled Git/GitHub procedure;
9. leave the work discoverable to ChatGPT/OMNI/Code through the remote repo;
10. delete temporary branches after integration/discard according to the operating manual.

Routine ingestion should not require the human to download and re-upload every file. If the current product environment cannot transfer Cowork staging automatically, a manual file handoff is an acceptable fallback, not the desired permanent architecture.

## Cowork = Editor + Editorial Architect

Cowork should:

- research and fact-check the subject;
- write the article as editorial content, not a product page;
- structure reading rhythm;
- identify moments where visual expression can materially improve the story;
- identify contextual commercial opportunities without writing to justify them;
- preserve sources/provenance;
- prepare a repository-ready editorial handoff and mark it `READY_FOR_CODE_INGEST` when complete.

Cowork may produce one article or a batch independently and may continue preparing future stories without waiting for visual direction or implementation.

Cowork must **not**:

- push to GitHub;
- publish directly to `main`;
- merge branches;
- modify Railway;
- decide production architecture;
- treat its staging checkout as canonical after `main` changes.

## Claude Design = sparse founding / R&D intervention

Claude Design is **not** part of the routine article loop. It is a high-cost visual R&D instrument used only when durable design learning justifies the intervention.

Use Design for:

- founding/revising Aromia Foundation;
- discovering a genuinely new primitive family;
- resolving a repeated visual limitation normal composition cannot solve;
- a major new publication surface;
- an exceptional experiment whose learning can be extracted into durable web infrastructure.

Do not use Design merely to design another article.

A Design intervention classifies meaningful decisions as:

- `AROMIA_FOUNDATION`
- `REUSABLE_PRIMITIVE`
- `STORY_SPECIFIC`
- `EXPERIMENT`

After accepted Design work, Claude Code systematizes the accepted learning into editable web infrastructure and `/design-lab`; story-specific gestures remain local.

> **Claude Design descubre. Claude Code sistematiza. ChatGPT compone. OMNI cuestiona.**

## ChatGPT = Art Director + Visual Composer

ChatGPT owns the final art direction of each publication, not only image generation. After reading the complete integrated piece, ChatGPT may define:

- visual concept;
- episodic page color/material palette;
- typographic hierarchy and scale;
- composition, density, whitespace and rhythm;
- image sequence, placement and treatment;
- quotes, captions, marginalia, dividers and editorial devices;
- visual treatment of contextual commerce;
- responsive intent;
- required visual assets, including the decision to use no image when stronger.

Cowork/Claude should leave creative room rather than prescribing finished image prompts.

### Visual Composition phase — mandatory when visual work is required

**Art direction is not visual composition, and visual composition is not asset generation.**

After the visual thesis exists, ChatGPT translates it into story-specific composition before Code implements the page.

It may determine:

- whether a passage receives one image, a sequence, typography only, archive material, object study, collage, material study or deliberate emptiness;
- image scale, crop, position and relationship to text;
- occupation of rail / reading field / marginal field when supported by Foundation;
- density and whitespace transitions;
- episodic color behavior;
- repetition, seriality, marginalia and documentary treatments;
- which visual opportunities should be rejected because adding an image would weaken the story;
- desktop and mobile intent as related but non-identical experiences.

Visual Composition must never degrade into filling image slots.

When original imagery is required, ChatGPT then creates or directs the **Visual Assets**. Generative imagery is interpretive; documentary/product identity must remain authentic and verifiable.

Available vocabulary includes, but is not limited to: Hero Shot, Conceptual Product Photography, Advertising Still Life, Lifestyle Product Photography, CGI Product Visualization, Commercial Beauty Photography, Ingredient-Driven Composition, editorial photography, material/macro studies, abstraction/metaphor, negative space, serial/repetition, diptych/triptych, collage/typographic composition and environmental/scenographic imagery.

These are tools, not a checklist.

> **Foundation gives identity. Primitives give vocabulary. Composition gives originality. Visual assets give matter. Code turns all of it into experience.**

## Early OMNI creative critique

OMNI may enter before Code after a meaningful visual proposition exists.

Routine loop:

`STORY → ART DIRECTION → VISUAL COMPOSITION → VISUAL STUDY → EARLY OMNI → REFINE / REJECT → ART DIRECTION + COMPOSITION READY`

Exceptional founding loop:

`STORY → ART DIRECTION → DESIGN INTERVENTION → EARLY OMNI → SYSTEM EXTRACTION → ROUTINE COMPOSITION`

Canva is not required or preferred.

Early OMNI evaluates:

- story-specificity;
- professional editorial craft;
- authored humanity;
- anti-AI character;
- narrative gain;
- restraint;
- authenticity;
- Aromia identity;
- anti-template behavior.

Result:

`EARLY_OMNI: PASS | REFINE | REJECT`

`REFINE` identifies concrete weaknesses and the desired perceptual/narrative improvement. `REJECT` is appropriate when the concept is fundamentally generic, amateur, misleading or visually weak.

**Authorship remains with ChatGPT.** OMNI is critic, not co-designer.

## Code = Editorial Integrator + Web Production + Publisher

Code has two distinct responsibilities.

### A. Editorial integration

Code imports repository-ready Cowork staging into the canonical remote repo and validates freshness/provenance/state. This is a transport/integration responsibility; it should not silently redesign or rewrite the article merely because Code is performing the ingest.

### B. Web production and publication

Once upstream work is ready, Code:

- reads the article, art direction, visual composition and asset instructions;
- implements the final web composition without silently inventing a different editorial/artistic direction;
- preserves accessibility, responsive behavior, performance, SEO and authentic product identity;
- implements contextual commerce/measurement according to Aromia policy;
- renders and verifies the real page;
- corrects implementation defects;
- publishes only when gates and publication state authorize it;
- updates repository state to `LIVE` only after confirmed publication.

After an accepted founding Design intervention, Code also owns **system extraction** into maintainable editable code and the permanent internal `/design-lab`.

## OMNI = Early Creative Critic + Final Gate

OMNI has two interventions:

1. **Early creative critique:** challenges meaningful visual studies before implementation.
2. **Final rendered gate:** evaluates the combined editorial, visual and implemented browser experience, including responsive behavior, implementation fidelity, commercial pressure and regressions.

OMNI is a critic/QA system, not another production department.

## Human = Publisher / Editor-in-Chief

The human sets the line, can propose stories, can override the calendar, approves major strategic/brand decisions and remains final authority. Routine coordination should not require the human to carry every artifact from one system to another.

## Visual opportunity handoff

When Cowork/Claude finds a moment where visual work could add meaning, mark:

```text
[AROMIA_VISUAL_OPPORTUNITY]
Narrative purpose:
Emotional objective:
Authenticity constraints:
Relationship to surrounding text:
Other hard constraints:
Creative freedom: LOW | MEDIUM | HIGH
```

Do not prescribe a complete set design or finished generation prompt unless the story genuinely requires a hard constraint.

The question for ChatGPT is:

> What is the strongest visual way to make this moment felt or understood?

ChatGPT may decide that no image is stronger.

## Repository handoff rule

There are two surfaces with different authority:

1. **Cowork staging workspace:** temporary, non-canonical preparation surface.
2. **GitHub `main` + Code-controlled temporary branches:** canonical integration/production surface.

Once Code integrates a Cowork batch, all downstream actors should ignore older staging copies and read the remote repo.

Do not create a queue, database workflow, synchronization service or permanent tool-specific branch topology unless repeated real use proves it necessary.

### Minimal publication state

```text
EDITORIAL: DRAFT | READY
ART_DIRECTION: PENDING | READY
VISUAL_COMPOSITION: PENDING | READY | NOT_REQUIRED
EARLY_OMNI: PENDING | PASS | REFINE | REJECT
VISUAL_ASSETS: PENDING | READY | NOT_REQUIRED
IMPLEMENTATION: PENDING | READY
QA: PENDING | PASSED | CHANGES_REQUIRED
PUBLISH: PENDING | PUBLISHABLE | SCHEDULED | LIVE
TARGET_DATE: YYYY-MM-DD | UNSCHEDULED
```

`DESIGN_PROTOTYPE` and `DESIGN_SYSTEM_EXTRACTION` are exceptional states used only for sparse Claude Design interventions.

Cowork's pre-integration staging may additionally use:

```text
COWORK_STAGE: DRAFT | READY_FOR_CODE_INGEST | INGESTED
BASE_MAIN_SHA: <sha>
```

`COWORK_STAGE` is not a publication state and disappears from operational importance once Code has ingested the work.

## Asynchronous production model

Example:

`Cowork prepares 10 → Code ingests 10 → ChatGPT art-directs/composes 4 → Early OMNI critiques 4 → ChatGPT resolves/assets 3 → Code implements 3 → Final OMNI passes 2 → Code publishes 2`

Nothing requires a full batch to finish before later eligible work advances.

## Production loops

### Routine publication

`IDEA → RESEARCH → COWORK STAGING → CODE INGEST → EDITORIAL READY IN REPO → ART DIRECTION → VISUAL COMPOSITION → VISUAL STUDY → EARLY OMNI → ART DIRECTION + COMPOSITION READY → VISUAL ASSETS → WEB IMPLEMENTATION → BROWSER QA → FINAL OMNI → PUBLISHABLE → SCHEDULE/LIVE`

If the story originates directly inside the canonical repo and requires no Cowork staging, the `COWORK STAGING → CODE INGEST` segment is simply skipped.

### Exceptional system-founding intervention

`REAL EDITORIAL NEED → CLAUDE DESIGN INTERVENTION → VISUAL GRAMMAR / PRIMITIVES / LEDGER → EARLY OMNI → CODE SYSTEM EXTRACTION → /design-lab → MULTIPLE REAL ARTICLES → OBSERVE LIMITS → OPTIONAL FUTURE DESIGN INTERVENTION`

## Contextual commerce principle

Aromia may create desire, curiosity and purchase intent, but commercial pressure remains subordinate to editorial value.

Preferred journey:

`INTEREST → KNOWLEDGE → IDENTIFICATION → DESIRE → EXPLORATION → OPTIONAL PURCHASE`

not:

`ARTICLE → BANNER → BUY`

Contextual actions such as `Ver opciones disponibles`, `Encontrarla` or `Seguir explorando` may lead to an affiliate destination when editorially justified. Commercial relationships must still be disclosed clearly.

Never:

- write an article merely to justify an affiliate link;
- alter an editorial conclusion to improve conversion;
- turn every perfume mention into a CTA;
- disguise advertising or affiliate relationships as independent editorial information.

The reader must be able to enjoy Aromia completely without buying anything.

## Editorial principle

> **Una fragancia, una historia.**

Aromia does not need to show everything that exists. It needs to find what deserves to be told.
