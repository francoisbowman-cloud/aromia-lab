# Aromia — Current Operational State

This file is the single compact relay for the command:

> **Continúa Aromia desde el repo.**

It is an index of the latest verified operational state, not a substitute for Git history, branch checkpoints, handoffs, QA evidence or canonical workflow documents.

## Mandatory actor order

Default production order:

`Cowork → Code → ChatGPT → Code → OMNI → Code → Production`

Meaning:

- **Cowork** — research, fact-check, write and prepare editorial staging.
- **Code (integration)** — ingest staging into the remote repo and establish the implementation surface.
- **ChatGPT** — art direction, visual composition and visual asset decisions/creation.
- **Code (implementation)** — wire assets and canonical copy, render and run technical/browser QA.
- **OMNI** — final rendered-experience gate.
- **Code (correction/production)** — correct failures, reach publishable state, and only merge/deploy when authorized.

The human Publisher does not carry routine handoffs between actors. The repo carries them.

## Current relay

```text
STATE_VERSION: 7
UPDATED_AT: 2026-08-31
LAST_ACTOR: Code
LAST_ACTION: rasterized ChatGPT's gen-2 interpretive sources, passed Gate 4, ran OMNI Gate 5 = APPROVED_WITH_NON_BLOCKING_REFINEMENTS (0.844, zero blockers), then applied the Publisher-approved post-gate palette/rhythm polish (removed reader-facing implementation metadata, dropped non-visible slot-type DOM flags, nudged the Amouage bone section toward stone)
ACTIVE_OBJECTIVE: Editorial v1 implementation
ACTIVE_BRANCH: feat/editorial-v1-implementation
VERIFIED_BRANCH_HEAD: 1759589 (ChatGPT post-gate polish relay); Code's polish commit follows on the same branch
PRODUCTION: HOLD
NEXT_ACTOR: Publisher (Brey)
NEXT_ACTION: decide whether to lift PRODUCTION: HOLD and open the cutover PR to main + deploy. All five Editorial v1 gates are green; only Publisher-gated publication remains. Polish-later items (documentary crop art direction, cutover metadata/robots flip, optional Amouage stroke integration) can ride the cutover PR or a follow-up.
BLOCKERS: none technical. Publication is gated on explicit Publisher approval only.
PRIMARY_HANDOFF: art-direction/EDITORIAL_V1_POST_GATE_VISUAL_POLISH.md
UPSTREAM_RELAY: art-direction/EDITORIAL_V1_RELAY_CHATGPT_TO_CODE.md
CHECKPOINT: art-direction/EDITORIAL_V1_IMPLEMENTATION_CHECKPOINT.md
```

## Latest verified Gate 5 context

Gen-2 interpretive rasters (from ChatGPT's upgraded SVG sources) are wired.
OMNI Gate 5 was re-submitted and returned
`APPROVED_WITH_NON_BLOCKING_REFINEMENTS`, confidence `0.844`, **zero blockers**.
The prior `ev1-01` blocker is cleared. All five Editorial v1 gates are green.

Code then applied the Publisher-approved bounded polish from
`art-direction/EDITORIAL_V1_POST_GATE_VISUAL_POLISH.md`:

- reader-facing implementation metadata removed (footer `Editorial v1 ·
  superficie aislada` → an editorial line);
- non-visible `data-slot-type` DOM flags dropped from the figure markup;
- the Amouage bone section background nudged from `#d9cfbc` toward a neutral
  stone `#d8d4cb` to avoid a generic gold-sand read;
- confirmed there is no gold/yellow semantic accent in the UI layer (arrows,
  kickers, section numbers, nav links all inherit ink); chromatic rhythm
  already varies per story (ivory → burgundy inverted → stone → ivory).

These changes are not material to composition/layout/imagery/typography, so per
the polish doc they are recorded as a non-blocking polish validation rather than
a new OMNI submission.

## Deterministic transition

All routine actor work is complete. The only remaining step is
Publisher-gated: lift `PRODUCTION: HOLD`, open the cutover PR to `main`, deploy.
Code must not perform merge/deploy without explicit Publisher approval.

Polish-later (non-blocking), for the cutover PR or a follow-up:
- documentary interruption crop/scale art direction (`ev1-02`);
- flip `noindex` + real per-route metadata/canonicals at cutover (`ev1-04`);
- optional: integrate the Amouage resin strokes into the textured ground.

## Rules for every actor

When receiving **Continúa Aromia desde el repo**:

1. Read this file first.
2. Verify `ACTIVE_BRANCH` and `VERIFIED_BRANCH_HEAD` against GitHub before trusting the relay.
3. Inspect the referenced handoff/checkpoint and any newer relevant branch commits.
4. If the state is stale, repair this file from the newest verifiable repository evidence before continuing.
5. Execute only the work belonging to your role.
6. At the end of your phase, update this file so `LAST_ACTOR`, `LAST_ACTION`, `NEXT_ACTOR`, `NEXT_ACTION`, branch/SHA, blockers and handoff paths describe the new reality.
7. Do not ask the human to copy a relay message to the next actor. Put the relay here and in the appropriate detailed handoff/checkpoint.
8. Do not ask the human to choose between routine next steps when the gate sequence, checkpoint, role order or repo state already determines the answer.
9. Ask the human only for genuinely strategic, irreversible, legal/rights, credential, production/publication, or materially new/unbounded spending decisions not already governed by the repo.
10. A short human-facing completion summary is enough; the repo carries operational detail.

## Authority hierarchy

If sources disagree, resolve in this order:

`verifiable Git branch/head + newest checkpoint/relay → this file → older handoffs → conversational memory`

`main` remains the production baseline, but an active Code-controlled remote branch under `PRODUCTION: HOLD` may be the authoritative working surface for an in-flight objective.

## Human interface

The normal instruction remains exactly:

> **Continúa Aromia desde el repo.**

No article selection, branch name, actor-specific prompt, gate-routing choice or hand-carried handoff should be required for routine continuation.
