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
STATE_VERSION: 12
UPDATED_AT: 2026-09-01
LAST_ACTOR: Production
LAST_ACTION: released Editorial v1 with the approved photographic lead assets through PR #120, canonical release gating, merge to main, and successful Railway production deployment
ACTIVE_OBJECTIVE: Editorial v1 photographic release — CLOSED
ACTIVE_BRANCH: main
VERIFIED_RELEASE_COMMIT: 87861db8271eb2d77b3dfad8333751a8df201dea
RELEASE_PR: #120 — MERGED
PRODUCTION: LIVE
GATE_4: PASS — run 33528075236 / job 99923918960
FINAL_PHOTO_GATE_5: PASS — run 33529763705 / job 99929653299 — score 0.9661016949 / threshold 0.82 — blockers 0 — evidence artifact 9809294886
CANONICAL_RELEASE_GATE: PASS — run 33530273538 / job 99931373862
RAILWAY_DEPLOYMENT: 0b588bc5-a29f-4572-9bc5-96ae9fad846e — SUCCESS — web production — commit 87861db8271eb2d77b3dfad8333751a8df201dea
NEXT_ACTOR: Maintenance
NEXT_ACTION: routine monitoring and future editorial batches; do not reopen Editorial v1 art direction unless a new product/editorial objective explicitly requires it
BLOCKERS: none
PRIMARY_HANDOFF: art-direction/EDITORIAL_V1_IMPLEMENTATION_CHECKPOINT.md
UPSTREAM_RELAY: art-direction/EDITORIAL_V1_GATE3_CHATGPT_DECISIONS.md
CHECKPOINT: art-direction/EDITORIAL_V1_IMPLEMENTATION_CHECKPOINT.md
```

## Editorial v1 release closure

The final photographic direction is implemented and published. The three canonical interpretive assets are real JPEG binaries at exactly `1600×900`, were decoded and hash-validated in Gate 4, rendered in the final browser gate, and remain explicitly classified as interpretive rather than documentary evidence:

- `apps/web/public/editorial-v1/ambroxan-resin-abstract-01.jpg`
- `apps/web/public/editorial-v1/ropion-bordeaux-texture-01.jpg`
- `apps/web/public/editorial-v1/amouage-mineral-density-01.jpg`

Documentary imagery keeps its separate provenance treatment. No generated interpretive image should be relabeled as documentary evidence.

## Release evidence

- Final photo asset integration commit before release: `f9026587c25e0408941eb1b1aa88c4005223b63e`.
- Gate 4: `PASS`, workflow run `33528075236`, job `99923918960`.
- Final-photo OMNI Gate 5: `PASS`, workflow run `33529763705`, job `99929653299`, score `0.9661016949152542` against `0.82`, zero blockers. The two reported `PRESENT` metadata findings were non-blocking substring false positives in reader copy, not implementation metadata.
- Canonical OMNI Final Aromia Release Gate: `PASS`, workflow run `33530273538`, job `99931373862`.
- Release PR `#120` merged to `main` as `87861db8271eb2d77b3dfad8333751a8df201dea`.
- Railway production web deployment `0b588bc5-a29f-4572-9bc5-96ae9fad846e` reached `SUCCESS`; startup preflight reported catalog source `private`, count `125`, and Next.js reached `Ready`.

## Deterministic transition

Editorial v1 is no longer an in-flight release. Routine continuation now begins from `main` and should discover the next editorial objective from the repo rather than reopening this completed gate sequence.

`Production LIVE → Maintenance / next editorial batch`

## Rules for every actor

When receiving **Continúa Aromia desde el repo**:

1. Read this file first.
2. Verify `ACTIVE_BRANCH` and the latest relevant `main` head against GitHub before trusting the relay.
3. Inspect the referenced handoff/checkpoint and any newer relevant commits.
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

`main` is the production baseline.

## Human interface

The normal instruction remains exactly:

> **Continúa Aromia desde el repo.**

No article selection, branch name, actor-specific prompt, gate-routing choice or hand-carried handoff should be required for routine continuation.
