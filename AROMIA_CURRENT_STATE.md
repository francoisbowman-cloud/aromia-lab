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
STATE_VERSION: 11
UPDATED_AT: 2026-09-01
LAST_ACTOR: ChatGPT
LAST_ACTION: accepted Code's binary-integrity finding, explicitly invalidated d6dd6a1 as a photographic delivery, and corrected the relay so the Publisher is no longer asked to choose an already-resolved A/B branch. The approved photographic direction remains wanted; publication must not cut over on gen-2 merely to bypass the failed transport.
ACTIVE_OBJECTIVE: Editorial v1 — complete the already-approved final photographic upgrade before publication
ACTIVE_BRANCH: feat/editorial-v1-implementation
SAFETY_BASELINE: e7e91e79b33ddae7ccf0aaff6e779b98f9c64286 (gen-2 interpretive rasters; OMNI Gate 5 = 0.844; zero blockers)
REJECTED_ASSET_COMMIT: d6dd6a1a902fb9bdb55c29c329b3c2812d0a327e (INVALID TRANSPORT; never treat as image evidence)
PRODUCTION: HOLD
NEXT_ACTOR: ChatGPT
NEXT_ACTION: establish a demonstrably valid transport/source for the 3 already-approved photographic assets. Acceptance requires real JPEG bytes, FF D8 FF magic, successful decode, exactly 1600x900, and one individual production asset per canonical slot. Do not regenerate/reopen art direction merely because transport failed. Once a valid deterministic source or file handoff exists, set NEXT_ACTOR=Code for integration + Gate 4 1440/375 + automatic OMNI Gate 5.
BLOCKERS: final photographic asset transport only. No publication decision is requested from the Publisher while this bounded implementation task remains unfinished.
PRIMARY_HANDOFF: art-direction/EDITORIAL_V1_IMPLEMENTATION_CHECKPOINT.md
UPSTREAM_RELAY: art-direction/EDITORIAL_V1_RELAY_CHATGPT_TO_CODE.md
CHECKPOINT: art-direction/EDITORIAL_V1_IMPLEMENTATION_CHECKPOINT.md
```

## Current valid safety baseline

The active branch has Code's restored, valid gen-2 JPEGs at the canonical paths:
- `apps/web/public/editorial-v1/ambroxan-resin-abstract-01.jpg`
- `apps/web/public/editorial-v1/ropion-bordeaux-texture-01.jpg`
- `apps/web/public/editorial-v1/amouage-mineral-density-01.jpg`

They remain a rollback/safety baseline only. They are not the intended final photographic upgrade.

## Invalid photographic transport

`d6dd6a1` is explicitly rejected. Its three supposed `.jpg` blobs are not decodable JPEGs and lack the required JPEG magic. Their presence in Git history or successful path resolution is NOT proof of a valid image delivery.

Do not repeat any transport based on raw/base64 text pasted into Git blobs, and do not use expiring signed URLs in CI as the production handoff.

A photographic asset is accepted only after Code can verify locally:

`JPEG magic FF D8 FF → decoder succeeds → dimensions 1600x900 → canonical filename → browser serves image/jpeg`

All five conditions are mandatory before the relay may claim the asset is delivered.

## Locked photographic direction — do not reopen

The creative decision is already made:

`recognizable material → authored photographic composition → editorial integration → invisible retouching`

- **Ambroxan** — translucent/mineral/resin-like recognizable matter on stone/steel/travertine; raking light; real micro-imperfections; interpretive, never literal ambroxan evidence.
- **Ropion** — dark/burgundy rose or compressed floral matter with restrained patchouli/wood/earth cues; controlled excess made physically legible; no fake portrait/history/lab evidence.
- **Amouage** — incense/resins/wood/mineral/ash/organic smoke; dense material still life; no crown, palace, fake calligraphy, bottle or branded fabrication.

No text, labels, logos, borders, triptych/contact-sheet treatment or technical overlays inside the individual production images.

## Gate context

The restored gen-2 baseline is technically safe: all five Editorial v1 gates were green and OMNI Gate 5 returned `APPROVED_WITH_NON_BLOCKING_REFINEMENTS`, confidence `0.844`, zero blockers.

That approval does NOT automatically approve the final photographic replacement. Once the three final photographic assets are validly integrated, Code must run Gate 4 again at desktop 1440 and mobile 375, then automatically submit OMNI Gate 5 because the three lead interpretive images materially changed.

## Deterministic transition

`ChatGPT establishes valid photo transport/source → Code verifies all 5 binary acceptance checks → Code integrates → Gate 4 1440/375 → OMNI Gate 5 → Code fixes if required → Publisher production approval → cutover`

There is no Publisher A/B decision before this sequence completes. `PRODUCTION: HOLD` remains active.

## Anti-stale rule

Before asking the Publisher any question or offering any production choice, every actor MUST:

1. fetch/compare the remote `ACTIVE_BRANCH` against its local HEAD;
2. read the newest `AROMIA_CURRENT_STATE.md` from that remote branch;
3. inspect newer relevant checkpoints/relays;
4. synchronize if local state is behind;
5. suppress any question already resolved by the remote relay or deterministic gate sequence.

A stale local checkout is never a valid basis for a Publisher decision.

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
