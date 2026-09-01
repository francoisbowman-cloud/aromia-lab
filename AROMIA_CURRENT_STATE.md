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
STATE_VERSION: 5
UPDATED_AT: 2026-08-31
LAST_ACTOR: ChatGPT
LAST_ACTION: repaired the failed binary handoff by committing three deterministic 1600x900 SVG interpretive source compositions and a Code materialization relay
ACTIVE_OBJECTIVE: Editorial v1 implementation
ACTIVE_BRANCH: feat/editorial-v1-implementation
VERIFIED_BRANCH_HEAD: ab13e5834b6bef9dac78bb8d55a528ee1c31f8c9
PRODUCTION: HOLD
NEXT_ACTOR: Code
NEXT_ACTION: rasterize the three canonical SVG sources to the exact JPG filenames at 1600x900, validate JPEG magic/dimensions/hashes, replace the invalid prior blobs, set interpretive slots present:true, rerun Gate 4, then advance automatically to OMNI Gate 5 if Gate 4 passes
BLOCKERS: none before Code materialization; the prior 5cf1702 JPG blobs are invalid and must not be wired
PRIMARY_HANDOFF: art-direction/EDITORIAL_V1_RELAY_CHATGPT_TO_CODE.md
UPSTREAM_RELAY: art-direction/EDITORIAL_V1_GATE3_CHATGPT_DECISIONS.md
CHECKPOINT: art-direction/EDITORIAL_V1_IMPLEMENTATION_CHECKPOINT.md
```

## Important correction

Code correctly rejected commit `5cf1702cb0a2cfc0a3fb27d81d3cea0752f9ba81`: its three `.jpg` blobs did not decode as images and did not match the declared hashes. That failure is preserved as evidence and must not be treated as Gate 3 completion.

The current authoritative interpretive sources are now versioned as text-safe SVGs under:

`art-direction/interpretive-source/`

- `ambroxan-resin-abstract-01.svg` — 1600×900 source
- `ropion-bordeaux-texture-01.svg` — 1600×900 source
- `amouage-mineral-density-01.svg` — 1600×900 source

Code owns deterministic raster materialization to the exact required JPG names. This avoids external ZIP transport and avoids another fragile binary connector handoff.

## Deterministic transition

The next valid transition is:

`Code rasterizes SVG sources → validates real JPGs → present:true → Gate 4 → OMNI Gate 5 → Code fixes if required → production approval`

Code must not ask the human whether to perform these routine steps; the repo already determines the transition.

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
