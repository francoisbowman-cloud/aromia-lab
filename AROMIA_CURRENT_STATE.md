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
STATE_VERSION: 2
UPDATED_AT: 2026-08-31
LAST_ACTOR: Code
LAST_ACTION: wired the 3 approved documentary assets, reran Gate 2 + Gate 4 PASS, and left the 3 interpretive visual slots pending
ACTIVE_OBJECTIVE: Editorial v1 implementation
ACTIVE_BRANCH: feat/editorial-v1-implementation
VERIFIED_BRANCH_HEAD: d9427ef128cd174d593fd81199e151650be4176a
PRODUCTION: HOLD
NEXT_ACTOR: ChatGPT
NEXT_ACTION: create/deliver the 3 locked interpretive assets for ambroxan, Ropion and Amouage according to art-direction/EDITORIAL_V1_GATE3_CHATGPT_DECISIONS.md; do not run Gate 5 against placeholders
BLOCKERS: Gate 3 remains partial until the 3 interpretive JPGs are physically available to Code; Gate 5 waits for those assets because it is the final rendered-composition gate
PRIMARY_HANDOFF: art-direction/EDITORIAL_V1_GATE3_CHATGPT_DECISIONS.md
UPSTREAM_RELAY: art-direction/EDITORIAL_V1_RELAY_CODE_TO_CHATGPT.md
CHECKPOINT: art-direction/EDITORIAL_V1_IMPLEMENTATION_CHECKPOINT.md
```

## Deterministic decision already resolved

**Do not run Gate 5 OMNI on the partial placeholder state.**

The next valid transition is:

`ChatGPT supplies 3 interpretive assets → Code sets present:true + reruns Gate 4 → OMNI Gate 5 → Code fixes if required → production approval`

This is not a question for the human Publisher. It follows directly from the gate contract: Gate 5 judges the rendered composition, so known placeholder fields are a declared unmet prerequisite.

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
