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
STATE_VERSION: 9
UPDATED_AT: 2026-09-01
LAST_ACTOR: ChatGPT
LAST_ACTION: extracted the locked text-free photographic master into 3 individual 1600x900 JPEGs, committed the binaries directly through Git objects at d6dd6a1a902fb9bdb55c29c329b3c2812d0a327e, and verified the canonical paths resolve from the active branch
ACTIVE_OBJECTIVE: Editorial v1 final photographic asset integration and re-gate
ACTIVE_BRANCH: feat/editorial-v1-implementation
FINAL_PHOTO_ASSET_COMMIT: d6dd6a1a902fb9bdb55c29c329b3c2812d0a327e
PRODUCTION: HOLD
NEXT_ACTOR: Code
NEXT_ACTION: pull the active branch; verify all 3 canonical JPEGs (JPEG magic, dimensions 1600x900, integrity); render them in the existing interpretive slots without changing classification/copy; run Gate 4 at desktop 1440 and mobile 375; if Gate 4 passes, automatically submit OMNI Gate 5 because all 3 lead interpretive images materially changed
BLOCKERS: none before Code Gate 4. Do not use the failed temporary GitHub Actions transport attempt as evidence; the binaries were ultimately committed directly through Git blobs/tree/commit.
PRIMARY_HANDOFF: art-direction/EDITORIAL_V1_POST_GATE_VISUAL_POLISH.md
UPSTREAM_RELAY: art-direction/EDITORIAL_V1_RELAY_CHATGPT_TO_CODE.md
CHECKPOINT: art-direction/EDITORIAL_V1_IMPLEMENTATION_CHECKPOINT.md
```

## Final photographic assets now in repo

Canonical paths on `feat/editorial-v1-implementation`:
- `apps/web/public/editorial-v1/ambroxan-resin-abstract-01.jpg`
- `apps/web/public/editorial-v1/ropion-bordeaux-texture-01.jpg`
- `apps/web/public/editorial-v1/amouage-mineral-density-01.jpg`

All three were prepared as individual 16:9 JPEGs at 1600 × 900 from the already-approved, text-free photographic master. No new exploratory generation was performed in this transport phase.

Interpretive classification remains locked:
- Ambroxan: recognizable translucent/resinous material still life; not literal ambroxan evidence.
- Ropion: recognizable burgundy floral matter expressing controlled excess; not fabricated Ropion evidence.
- Amouage: incense/resin/wood/mineral/smoke still life; not branded or historical evidence.

Craft target remains `recognizable material → authored photographic composition → editorial integration → invisible retouching`, with physical micro-detail and controlled imperfection. No abstract texture requiring explanation, no generic AI-luxury gold accent, no technical metadata in reader UI.

## Gate context

Before this final photographic replacement, all five Editorial v1 gates were green. OMNI Gate 5 returned `APPROVED_WITH_NON_BLOCKING_REFINEMENTS`, confidence `0.844`, zero blockers, and Code applied the approved palette/rhythm cleanup at `e7e91e79b33ddae7ccf0aaff6e779b98f9c64286`.

That implementation remains the safety baseline. Replacing the three interpretive images is a material rendered-experience change, so Code must run Gate 4 again and then OMNI Gate 5 again before publication approval.

## Deterministic transition

`Code verifies committed photographic JPGs → Gate 4 1440/375 → OMNI Gate 5 → Code fixes if required → Publisher production approval`

`PRODUCTION: HOLD` remains active. No merge/deploy without explicit Publisher approval after the final photographic pass.

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
