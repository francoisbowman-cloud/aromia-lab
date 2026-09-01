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
STATE_VERSION: 8
UPDATED_AT: 2026-09-01
LAST_ACTOR: ChatGPT
LAST_ACTION: corrected the premature publication relay and locked the already-approved final photographic replacement direction for the 3 interpretive lead images; exploratory generation is closed and the existing gen-2 rasters remain only as a technical safety baseline
ACTIVE_OBJECTIVE: Editorial v1 final photographic asset replacement
ACTIVE_BRANCH: feat/editorial-v1-implementation
VERIFIED_BRANCH_HEAD_BEFORE_CHATGPT_LOCK: e7e91e79b33ddae7ccf0aaff6e779b98f9c64286
CHATGPT_DIRECTION_LOCK_COMMIT: 4fd3c6323958c00d8ac5a745903dd8d8979e8d31
PRODUCTION: HOLD
NEXT_ACTOR: Code after final photographic JPGs are present in-repo; until then ChatGPT owns asset completion, not further art-direction exploration
NEXT_ACTION: preserve the green implementation as baseline; ingest/verify the 3 final photographic JPGs at their canonical filenames when available, then Gate 4 at 1440/375 and automatically OMNI Gate 5 because imagery replacement is material
BLOCKERS: final higher-craft photographic JPG binaries are not yet verified in-repo; current gen-2 rasters are approved baseline but are not the final desired visual assets
PRIMARY_HANDOFF: art-direction/EDITORIAL_V1_POST_GATE_VISUAL_POLISH.md
UPSTREAM_RELAY: art-direction/EDITORIAL_V1_RELAY_CHATGPT_TO_CODE.md
CHECKPOINT: art-direction/EDITORIAL_V1_IMPLEMENTATION_CHECKPOINT.md
```

## Locked final imagery direction

Art direction is closed. Do not generate or request further exploratory mockups, triptychs, comparison boards or alternate directions.

Final interpretive slots remain:
- `ambroxan-resin-abstract-01.jpg` — recognizable translucent/resinous material still life; tactile, optically plausible, explicitly interpretive rather than literal ambroxan evidence.
- `ropion-bordeaux-texture-01.jpg` — recognizable burgundy floral matter expressing controlled excess; organic petal variation, no fabricated Ropion evidence.
- `amouage-mineral-density-01.jpg` — incense/resin/wood/mineral/smoke still life; dense but materially legible, no fabricated branded/historical evidence.

Craft target: `recognizable material → authored photographic composition → editorial integration → invisible retouching`, with physical micro-detail and controlled imperfection. No abstract texture requiring explanation, no generic AI-luxury gold accent, no technical metadata in reader UI.

## Gate context

Before this final photographic replacement request, all five Editorial v1 gates were green. OMNI Gate 5 returned `APPROVED_WITH_NON_BLOCKING_REFINEMENTS`, confidence `0.844`, zero blockers, and Code applied the approved palette/rhythm cleanup at `e7e91e79b33ddae7ccf0aaff6e779b98f9c64286`.

That green implementation is the safety baseline. It is not authorization to publish while the Publisher-approved final photographic replacement pass remains incomplete.

## Deterministic transition

The next valid transition is:

`ChatGPT final photographic JPGs in repo → Code validates/integrates → Gate 4 → OMNI Gate 5 → Code fixes if required → Publisher production approval`

Replacing all three interpretive lead images is a material rendered-experience change, so OMNI Gate 5 must run again after Code's Gate 4 pass.

## Rules for every actor

When receiving **Continúa Aromia desde el repo**:

1. Read this file first.
2. Verify `ACTIVE_BRANCH` and current branch head against GitHub before trusting the relay.
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
