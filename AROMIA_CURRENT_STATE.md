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
STATE_VERSION: 6
UPDATED_AT: 2026-08-31
LAST_ACTOR: ChatGPT
LAST_ACTION: responded to OMNI Gate 5 blocker ev1-01 by replacing all three interpretive SVG sources with higher-craft material studies and leaving a deterministic re-raster/re-gate relay
ACTIVE_OBJECTIVE: Editorial v1 implementation
ACTIVE_BRANCH: feat/editorial-v1-implementation
VERIFIED_BRANCH_HEAD: d2b50f31a9bb2b2aad3d0fbc45cef4e69d326d18
PRODUCTION: HOLD
NEXT_ACTOR: Code
NEXT_ACTION: rasterize the upgraded interpretive sources to the same 3 JPG names, validate fresh JPEGs/hashes, rerun Gate 4 at 1440/375, then resubmit automatically to OMNI Gate 5
BLOCKERS: Gate 5 remains blocked only until Code renders and OMNI evaluates the upgraded sources; previous raster JPGs from the earlier flat sources are obsolete
PRIMARY_HANDOFF: art-direction/EDITORIAL_V1_RELAY_CHATGPT_TO_CODE.md
UPSTREAM_RELAY: art-direction/EDITORIAL_V1_GATE3_CHATGPT_DECISIONS.md
CHECKPOINT: art-direction/EDITORIAL_V1_IMPLEMENTATION_CHECKPOINT.md
```

## Latest verified Gate 5 context

The active branch advanced beyond the previous state file. Code successfully rasterized the first SVG source set, wired all slots, passed Gate 4 and ran OMNI Gate 5. OMNI returned `BLOCKED` on `ev1-01` because the three interpretive hero/lead images read too flat/vector-like for Aromia's luxury-editorial bar.

ChatGPT has now remediated that exact blocker by upgrading the three canonical sources under `art-direction/interpretive-source/`:

- `ambroxan-resin-abstract-01.svg`
- `ropion-bordeaux-texture-01.svg`
- `amouage-mineral-density-01.svg`

The updated compositions use multi-scale turbulence, displacement, specular-lighting, grain and more natural tonal depth. They preserve all existing no-fabrication constraints.

## Deterministic transition

The next valid transition is:

`Code rasterizes upgraded sources → validates JPGs → Gate 4 → OMNI Gate 5 → Code fixes if required → production approval`

Code must not ask the human whether to perform these routine steps. If Gate 5 remains blocked, the specific visual finding routes back to ChatGPT/Design automatically. If it clears, Code continues production preparation while preserving `PRODUCTION: HOLD` until explicit publication approval.

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
