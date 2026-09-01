# Aromia — Current Operational State

This file is the compact relay for the command:

> **Continúa Aromia desde el repo.**

It indexes the latest verified operational state. Git history, checkpoints and canonical workflow documents remain authoritative evidence.

## Mandatory actor order

Default production order:

`Cowork → Code → ChatGPT → Code → OMNI → Code → Production`

Routine editorial loop is governed by `AROMIA_EDITORIAL_WORKFLOW.md`. `main` is the canonical remote source of truth.

## Current relay

```text
STATE_VERSION: 16
UPDATED_AT: 2026-09-01
LAST_ACTOR: ChatGPT (Art Director + Visual Composer)
LAST_ACTION: selected the next eligible editorial-ready story, "El coleccionista", and completed its story-specific art direction + visual composition. The draft frontmatter now records ART_DIRECTION/COMPOSITION ready and points to the canonical handoff.
ACTIVE_OBJECTIVE: El coleccionista — routine editorial publication pipeline
ACTIVE_BRANCH: main
MAIN_HEAD_AFTER_CHATGPT_DOC_WRITES: 3863189383293bb6b598e721c3b6e347dea1a48e
EDITORIAL: READY
ART_DIRECTION: READY
VISUAL_COMPOSITION: READY
EARLY_OMNI: PENDING
VISUAL_ASSETS: PENDING
IMPLEMENTATION: PENDING
QA: PENDING
PUBLISH: PENDING
TARGET_DATE: UNSCHEDULED
PRIMARY_STORY: drafts/el-coleccionista.md
FACT_CHECK: research/el-coleccionista-fact-check.md
PRIMARY_HANDOFF: art-direction/el-coleccionista-art-direction-and-composition.md
NEXT_ACTOR: OMNI (early creative critique)
NEXT_ACTION: critique the El coleccionista proposition for story-specificity, authored humanity, narrative gain, restraint, authenticity, anti-template behavior and commercial pressure; return PASS | REFINE | REJECT. If REFINE, ChatGPT corrects only the concrete perceptual/narrative defects. If PASS, ChatGPT finalizes required asset decisions and Code implements.
BLOCKERS: none.
```

## Current creative lock — El coleccionista

Governing visual thesis:

> **Una colección no se ve grande. Se siente como algo que ya dejó de tener un final claro.**

The page uses controlled accumulation as narrative structure: domestic recognition → multiplication → preservation/time → visual release. The implementation must not collapse into `hero → text → image → text → product cards`.

Hard constraints:

- opening collection scene must feel lived-in, not luxury retail or influencer display;
- recognizable branded bottles are documentary/product identity and must not be generated approximations;
- the Le Male family visual is conditional on authentic current packshots / verifiable lineup; typography is preferred over fabricated evidence;
- Aventus must not be visualized with invented batch codes, vintage claims or unsupported reformulation evidence;
- `Sí, pero` deliberately removes accumulation devices and returns to plain reading space;
- contextual affiliate actions remain after the editorial conclusion and visually subordinate.

Full desktop/mobile composition, image jobs, anti-AI test, accessibility intent and Early OMNI brief are locked in `art-direction/el-coleccionista-art-direction-and-composition.md`.

## Production baseline retained

Editorial v1 public cutover is already closed and must not be reopened casually:

- PR #120 shipped the photographic Editorial v1 surface.
- PR #121 completed the public-home cutover and merged as `d7db02cf59861f1acdb55087a5fabfc4e694b3c4`.
- Railway web deployment `fcb010e1-8a00-4c68-82ae-17813a32f94e` reached `SUCCESS`.
- `/` serves the editorial living cover.
- the three released stories live at `/historias/[slug]`.
- legacy `/editorial-v1[/*]` story routes redirect into the canonical public paths while `public/editorial-v1/*.jpg` asset URLs remain protected by the dot-free redirect guard.

Existing non-blocking platform follow-ups remain separate from El coleccionista:

- mobile editorial navigation currently exposes AROMIA + search but no menu;
- the site remains intentionally bimodal: editorial chrome on `/` + `/historias/*`, legacy global chrome on `/magazine`, `/club`, `/academia`, `/descubrir`;
- architecture territories Perfumes / Materia / Personas are not yet built;
- cosmetic rename of `public/editorial-v1/` assets remains deferred.

## Actor-substitution rule

An actor may exceptionally execute a bounded task normally owned by the next actor only when all of the following are true:

1. required connected tools and permissions are available;
2. the operation is already authorized or deterministically governed by the repo;
3. no strategic, legal, rights, credential or publication decision is bypassed;
4. the substitution is recorded in this relay;
5. workflow ownership is not permanently redefined.

This does not authorize ChatGPT to take over Code's technical branch/merge/deploy responsibility or OMNI's independent gate judgment.

## Rules for every actor

When receiving **Continúa Aromia desde el repo**:

1. Read this file first.
2. Verify current remote head/branch before trusting the relay.
3. Inspect the referenced story, handoff/checkpoint and newer relevant commits.
4. Repair stale state from verifiable repo evidence before continuing.
5. Execute the work belonging to your role, except for a bounded substitution allowed above.
6. Update this file at the end of the phase.
7. Put routine handoffs in the repository; do not make the Publisher shuttle them manually.
8. Do not ask the Publisher to choose routine next steps already determined by workflow/gates.
9. Escalate only genuinely strategic, irreversible, legal/rights, credential, publication or materially new spending decisions.
10. Preserve approved work unless concrete evidence requires correction.

## Authority hierarchy

If sources disagree:

`verifiable Git remote head + newest checkpoint/handoff → this file → older handoffs → conversational memory`

## Human interface

The canonical continuation instruction remains:

> **Continúa Aromia desde el repo.**

No article selection, branch name, actor-specific prompt or hand-carried relay should be required for routine continuation.
