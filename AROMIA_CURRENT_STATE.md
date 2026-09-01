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
- **Code (correction/production)** — correct failures, reach publishable state, and merge/deploy when publication is authorized.

The human Publisher does not carry routine handoffs between actors. The repo carries them.

## Current relay

```text
STATE_VERSION: 13
UPDATED_AT: 2026-09-01
LAST_ACTOR: ChatGPT
LAST_ACTION: audited the production result after Publisher reported that Aromia still looked old; confirmed the Editorial v1 implementation was deployed but the public root `/` still serves the legacy Home, so the prior release closure was incomplete
ACTIVE_OBJECTIVE: Editorial v1 public cutover correction — make the approved editorial experience the real public Aromia entry point
ACTIVE_BRANCH: main
LAST_RELEASE_COMMIT: 87861db8271eb2d77b3dfad8333751a8df201dea
STATE_REPAIR_COMMIT: pending current commit
PRODUCTION: LIVE_BUT_INCOMPLETE
RELEASE_PR: #120 — MERGED
GATE_4: PASS on Editorial v1 implementation — run 33528075236 / job 99923918960
FINAL_PHOTO_GATE_5: PASS on Editorial v1 implementation — run 33529763705 / job 99929653299 — score 0.9661016949 / threshold 0.82 — blockers 0
CANONICAL_RELEASE_GATE: PASS on the release candidate — run 33530273538 / job 99931373862
PUBLIC_CUTOVER_DEFECT: `/` still renders the legacy Home; Editorial v1 currently lives under `/editorial-v1` and is not yet the canonical public entry experience
NEXT_ACTOR: Code
NEXT_ACTION: read the current repo and fix the public cutover without reopening approved art direction. Make the approved Editorial v1 experience the canonical public Aromia entry at `/`, then audit and correct primary navigation and public-route behavior so users are no longer routed through the legacy catalog-first architecture as the default experience. Validate the real production-facing routes, including `/`, `/magazine`, `/descubrir`, `/buscar`, and the three Editorial v1 story routes at desktop and mobile. Run the relevant technical/browser regression checks and OMNI rendered gate against the actual public URLs/route behavior. If blockers are found, fix them automatically within Code/ChatGPT/OMNI role boundaries and rerun. Update this relay with exact branch/SHA/gate evidence. Do not ask the Publisher to carry context or choose routine next steps.
BLOCKERS: public-home cutover only; approved Editorial v1 art direction and final photographic assets are not reopened
PRIMARY_HANDOFF: art-direction/EDITORIAL_V1_IMPLEMENTATION_CHECKPOINT.md
UPSTREAM_RELAY: art-direction/EDITORIAL_V1_GATE3_CHATGPT_DECISIONS.md
CHECKPOINT: art-direction/EDITORIAL_V1_IMPLEMENTATION_CHECKPOINT.md
```

## Explicit defect diagnosis

The previous release was technically deployed, but it did not complete the intended product cutover. The new editorial implementation exists and its dedicated routes render, while the canonical public root `/` still serves the legacy Aromia Home. Therefore `PRODUCTION: LIVE` does not mean the editorial transformation is complete.

This is a release-correction task, not a new creative-direction phase.

Code must treat the following as the deterministic correction sequence:

`read repo state → inspect current public root/navigation architecture → make Editorial v1 the canonical `/` experience → remove/redirect legacy catalog-first entry behavior where appropriate → validate public navigation/routes → desktop/mobile browser QA → OMNI rendered gate on public experience → fix blockers automatically → update relay → production verification`

The approved visual direction, article copy, photographic assets, documentary provenance, and Gate 3 decisions remain locked unless a concrete regression proves that a bounded correction is required.

## Actor-substitution rule

The normal actor responsibilities remain unchanged. An actor may exceptionally execute a bounded task normally owned by the next actor only when all of the following are true:

1. the necessary connected tools and permissions are available;
2. the human has already authorized the operation or the repo workflow deterministically authorizes it;
3. the action does not bypass a required strategic, legal, rights, credential, or publication decision;
4. the substitution is explicitly recorded in the relay;
5. the actor does not permanently redefine the workflow roles.

This rule exists to preserve autonomy without blurring ownership. It does not create a new actor such as `Maintenance`.

## Rules for every actor

When receiving **Continúa Aromia desde el repo**:

1. Read this file first.
2. Verify `ACTIVE_BRANCH` and the latest relevant remote head against GitHub before trusting the relay.
3. Inspect the referenced handoff/checkpoint and any newer relevant commits.
4. If the state is stale, repair this file from the newest verifiable repository evidence before continuing.
5. Execute only the work belonging to your role, except for a bounded substitution allowed by the actor-substitution rule above.
6. At the end of your phase, update this file so `LAST_ACTOR`, `LAST_ACTION`, `NEXT_ACTOR`, `NEXT_ACTION`, branch/SHA, blockers and handoff paths describe the new reality.
7. Do not ask the human to copy a relay message to the next actor. Put the relay here and in the appropriate detailed handoff/checkpoint.
8. Do not ask the human to choose between routine next steps when the gate sequence, checkpoint, role order or repo state already determines the answer.
9. Ask the human only for genuinely strategic, irreversible, legal/rights, credential, production/publication, or materially new/unbounded spending decisions not already governed by the repo.
10. A short human-facing completion summary is enough; the repo carries operational detail.

## Authority hierarchy

If sources disagree, resolve in this order:

`verifiable Git branch/head + newest checkpoint/relay → this file → older handoffs → conversational memory`

`main` is the production baseline unless a newer active working branch is explicitly recorded here.

## Human interface

The normal instruction remains exactly:

> **Continúa Aromia desde el repo.**

No article selection, branch name, actor-specific prompt, gate-routing choice or hand-carried handoff should be required for routine continuation.
