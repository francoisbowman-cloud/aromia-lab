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
STATE_VERSION: 4
UPDATED_AT: 2026-08-31
LAST_ACTOR: ChatGPT
LAST_ACTION: committed the 3 locked interpretive Editorial v1 JPGs directly into the active implementation branch and updated the Code relay; no external artifact transport is required
ACTIVE_OBJECTIVE: Editorial v1 implementation
ACTIVE_BRANCH: feat/editorial-v1-implementation
VERIFIED_BRANCH_HEAD: e2842bbd1b85ed5567b81ce3b1d785ed5e6d6054
PRODUCTION: HOLD
NEXT_ACTOR: Code
NEXT_ACTION: verify the 3 committed interpretive JPGs and hashes, set their visual slots present:true, rerun Gate 4 desktop/mobile with real assets, then advance automatically to OMNI Gate 5 if Gate 4 passes
BLOCKERS: none before Code re-Gate 4; Gate 5 still waits for the real-asset Gate 4 result by contract
PRIMARY_HANDOFF: art-direction/EDITORIAL_V1_RELAY_CHATGPT_TO_CODE.md
UPSTREAM_RELAY: art-direction/EDITORIAL_V1_GATE3_CHATGPT_DECISIONS.md
CHECKPOINT: art-direction/EDITORIAL_V1_IMPLEMENTATION_CHECKPOINT.md
```

## Interpretive assets now versioned on the active branch

All three exist under `apps/web/public/editorial-v1/`:

- `ambroxan-resin-abstract-01.jpg` — 1600×900 — SHA-256 `99fe0c401aae30b77110c4848ff90ce199c8b551a84cee0e78e8457b0c17f1a7`
- `ropion-bordeaux-texture-01.jpg` — 1600×900 — SHA-256 `8c49c083c67a31ce878880c50d5d7a223a44cf7dfbf29b2f3e2df33e23ac6a57`
- `amouage-mineral-density-01.jpg` — 1600×900 — SHA-256 `5c12c2d99e8d593d04ea2f6f36aa5a91835c35146d66990a1e567ea3dffb304e`

Binary commit: `5cf1702cb0a2cfc0a3fb27d81d3cea0752f9ba81`.

The temporary chat ZIP is no longer operationally relevant. Code must pull from the repo; the human Publisher does not need to download or forward assets.

These are interpretive assets, not documentary evidence. The earlier meta/status-board generations are discarded and are not Gate evidence.

## Deterministic transition

The next valid transition is:

`Code verifies committed JPGs → present:true → Gate 4 → OMNI Gate 5 → Code fixes if required → production approval`

Code must not ask the human whether to run Gate 5 after a clean Gate 4; the repo already determines that transition.

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
