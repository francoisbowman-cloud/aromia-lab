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
STATE_VERSION: 10
UPDATED_AT: 2026-09-01
LAST_ACTOR: Code
LAST_ACTION: rejected the "final photographic" binary handoff — commit d6dd6a1 overwrote the 3 OMNI-approved gen-2 interpretive rasters with 10-15 KB non-image "data" blobs (no FF D8 FF magic, not decodable); third failure of this same transport (prior: 5cf1702 rejected at dfa761b). Restored the 3 valid gen-2 rasters from e7e91e7 (the named safety baseline), removed the failed external-URL CI transport workflow, and re-verified the branch (tsc/lint clean, 4 routes 200, optimiser serves all 3 JPEGs as image/jpeg, noindex intact, no metadata leak)
ACTIVE_OBJECTIVE: Editorial v1 — publication decision on the approved baseline; optional final photographic asset upgrade
ACTIVE_BRANCH: feat/editorial-v1-implementation
LAST_GOOD_ASSET_COMMIT: e7e91e79b33ddae7ccf0aaff6e779b98f9c64286 (gen-2 interpretive rasters, OMNI Gate 5 = 0.844)
REJECTED_ASSET_COMMIT: d6dd6a1a902fb9bdb55c29c329b3c2812d0a327e
PRODUCTION: HOLD
NEXT_ACTOR: Publisher (Brey), then ChatGPT if the photographic upgrade is still wanted
NEXT_ACTION: Publisher decides — (A) lift PRODUCTION: HOLD and cut over to main on the OMNI-approved gen-2 baseline now, treating the photographic upgrade as an optional follow-up; or (B) hold for ChatGPT to re-deliver the 3 final photographic 1600x900 JPEGs through a transport that lands valid decodable binaries (commit the real encoded files after verifying FF D8 FF + 1600x900 locally, or hand Code a deterministic source to rasterise/fetch — NOT raw paste, NOT an expiring signed URL in CI), after which Code re-wires, runs Gate 4, and re-submits OMNI Gate 5
BLOCKERS: none technical — the branch is at the OMNI-approved rendered state. The photographic upgrade is blocked on a working asset transport. Publication is Publisher-gated.
PRIMARY_HANDOFF: art-direction/EDITORIAL_V1_IMPLEMENTATION_CHECKPOINT.md (2026-09-01 entry)
UPSTREAM_RELAY: art-direction/EDITORIAL_V1_RELAY_CHATGPT_TO_CODE.md
CHECKPOINT: art-direction/EDITORIAL_V1_IMPLEMENTATION_CHECKPOINT.md
```

## Interpretive assets currently in repo (restored)

Canonical paths on `feat/editorial-v1-implementation`, restored byte-identical to
`e7e91e7`:
- `apps/web/public/editorial-v1/ambroxan-resin-abstract-01.jpg` — valid JPEG, progressive, 1600×900, 603 KB
- `apps/web/public/editorial-v1/ropion-bordeaux-texture-01.jpg` — valid JPEG, progressive, 1600×900, 401 KB
- `apps/web/public/editorial-v1/amouage-mineral-density-01.jpg` — valid JPEG, progressive, 1600×900, 275 KB

These are the gen-2 rasters (from ChatGPT's upgraded SVG sources, rasterised
locally by Code) that OMNI Gate 5 approved at confidence `0.844`, zero blockers.
The 3 documentary slots (clary-sage / oman-place / frankincense, CC BY-SA) are
untouched and still pass.

### Failed "final photographic" transport — do not retry as-is

`d6dd6a1` ("install locked final photographic rasters") committed 10 652 /
14 997 / 14 999-byte blobs with no image magic — the same failure mode as the
rejected `5cf1702`. `ba931219` added
`.github/workflows/editorial-v1-final-photo-assets.yml`, which fetched from a
signed Canva URL (`exp=1788254593`) with `contents: write`; it produced nothing
usable. Code removed that workflow. A photographic upgrade needs a transport that
demonstrably lands decodable bytes.

## Gate context

All five Editorial v1 gates are green on the restored baseline. OMNI Gate 5
returned `APPROVED_WITH_NON_BLOCKING_REFINEMENTS`, confidence `0.844`, zero
blockers, at `e7e91e7`. The branch is currently at exactly that rendered
experience — no composition, copy or classification change since.

Polish-later (non-blocking), for the cutover PR or a follow-up:
- documentary interruption crop/scale art direction (`ev1-02`);
- flip `noindex` + real per-route metadata/canonicals at cutover (`ev1-04`);
- optional: integrate the Amouage resin strokes into the textured ground;
- optional: the final photographic interpretive upgrade (needs a working transport).

## Deterministic transition

`Publisher decides (A cut over now / B hold for photographic upgrade)`
· if B: `ChatGPT re-delivers valid photographic binaries → Code Gate 4 1440/375 → OMNI Gate 5 → Code fixes if required → Publisher production approval`
· if A: `Code opens cutover PR to main (noindex flip + per-route metadata) → deploy on Publisher approval`

`PRODUCTION: HOLD` remains active. No merge/deploy without explicit Publisher approval.

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
