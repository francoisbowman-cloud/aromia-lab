# Aromia — Current Operational State

This file is the compact relay for the command:

> **Continúa Aromia desde el repo.**

It indexes the latest verified operational state. Git history, checkpoints and canonical workflow documents remain authoritative evidence.

## Mandatory actor order

Default production order:

`Cowork → Code → ChatGPT → Code → OMNI → Code → Production`

Routine editorial loop is governed by `AROMIA_EDITORIAL_WORKFLOW.md`. `main` is the canonical remote source of truth.

Every actor must also obey:

`docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md`

A meaningful turn is not operationally complete until the next actor can continue from the repository without needing the previous chat.

## Current relay

```text
STATE_VERSION: 27
UPDATED_AT: 2026-09-02
LAST_ACTOR: ChatGPT (temporary Code + OMNI role takeover authorized by Publisher while Code session limit was exhausted)
LAST_ACTION: completed the release gate for El coleccionista. GitHub v2.0 CI and Aromia Strict Audit are green on the feature head. Railway isolated QA service `web-el-coleccionista-qa` successfully built commit 0155b611 from branch feat/el-coleccionista-implementation after adding preview-only NEXT_PUBLIC_API_URL / NEXT_PUBLIC_SITE_URL references; production web/API/database were not changed. Authoritative Final OMNI was then closed PASS using the locked art direction, Asset A v2 direct inspection, Code desktop/mobile browser measurements, responsive/crop evidence, clean local production QA, CI, Strict Audit and successful feature-branch Railway build. The three pre-existing soft cover images remain a separately tracked non-blocking Editorial v1 home follow-up.
ACTIVE_OBJECTIVE: release El coleccionista to production, verify canonical route and close relay as LIVE; retain home softness finding as follow-up
ACTIVE_BRANCH: feat/el-coleccionista-implementation
CURRENT_MAIN_SHA: ea586ba30e22f680756b8764934685c4dc21ce66
DRAFT_PR: #123 feat: El coleccionista implementation + visual QA
FINAL_OMNI_REVIEW: art-direction/el-coleccionista-final-omni-review.md
FINAL_OMNI_COMMIT: e93f65765a89d17ac9b3715fd614edbdb4834658
QA_PREVIEW_SERVICE: Railway web-el-coleccionista-qa (feature branch only; isolated QA surface)
ACTOR_HANDOFF_PROTOCOL: docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md
VISUAL_GENERATION_PROTOCOL: docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md
SOFT_IMAGE_QA: art-direction/editorial-home-soft-image-qa.md
EDITORIAL: READY
ART_DIRECTION: READY
VISUAL_COMPOSITION: READY
EARLY_OMNI: PASS
EL_COLECCIONISTA_VISUAL_ASSETS: INGESTED — Asset A v2
EL_COLECCIONISTA_IMPLEMENTATION: DONE
EL_COLECCIONISTA_QA: PASSED
FINAL_OMNI: PASS
PUBLISH: PUBLISHABLE
TARGET_DATE: 2026-09-02
PRIMARY_STORY: drafts/el-coleccionista.md
IMPLEMENTATION_CHECKPOINT: art-direction/el-coleccionista-implementation-checkpoint.md

HOME_VISUAL_QA: NONBLOCKING_FOLLOWUP
AFFECTED_HOME_SLOTS:
- amouage-material-density-interpretive → /editorial-v1/amouage-mineral-density-01.jpg → 1600x900 → quality:95 experiment
- ambroxan-material-interpretive → /editorial-v1/ambroxan-resin-abstract-01.jpg → 1600x900 → quality:95 experiment
- ropion-overdose-interpretive → /editorial-v1/ropion-bordeaux-texture-01.jpg → 1600x900 → quality:95 experiment
RULE: if those sources remain visibly soft in a trustworthy later render, replace the source art under the Visual Generation Isolation Protocol; do not sharpen/upscale artificially and do not redesign the approved home rhythm.

NEXT_ACTOR: Code / Production (ChatGPT may continue temporary takeover in this turn)
NEXT_ACTION: wait for CI on the current final-gate head; mark PR #123 ready; merge to main when required checks are green; verify Railway production deployment success and canonical /historias/el-coleccionista availability; then update this relay on main to LIVE. Do not delete the home softness follow-up.
BLOCKERS: none for El coleccionista release. Remote standalone screenshot capture is unavailable in current tools, but this limitation is documented in Final OMNI and is not treated as hidden evidence.
```

## Mandatory turn-closure rule

All Aromia actors must leave a durable handoff at the end of meaningful work. The canonical protocol is:

`docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md`

Core requirement:

> **Do the work. Persist the truth. Name the next actor. Leave no conversational archaeology for the next shift.**

The Publisher must not routinely carry summaries between actors. If a binary cannot move through available connectors, the Publisher may transport the file, but the repository must already contain the semantic handoff, checksum/path and exact ingestion instructions.

## Visual-generation incident correction — canonical rule

Repeated wrong generations for `El coleccionista` produced dashboards/checkpoints/GitHub-like mockups rather than the requested domestic scene. The root cause is treated as **conversation-context contamination**, not merely prompt wording.

Canonical protocol:

`docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md`

Core rule:

> **Operational context decides what to make. Clean visual context makes the image. Quarantine decides whether the image is allowed back into Aromia.**

Prompt cleaning alone is insufficient when the image generator infers from the full conversation. If the active turn is dominated by repository state, OMNI gates, UI, implementation logs, Code, GitHub, checkpoints or QA, **do not invoke image generation there**.

Two consecutive mockup/UI drifts in the same conversation trigger a hard stop for image generation in that conversation. Further retries require a clean visual context.

Rejected wrong generations are process waste: do not commit, implement, cite as evidence or use to mutate editorial/QA/OMNI state.

## El coleccionista correction lock

Asset A v2 passed ChatGPT visual quarantine and is ingested in the repo. The home-image softness finding does not reopen or invalidate it.

Narrative test remains:

> **“Yo conozco ese estante.”**

Preserve prose, section architecture, density states, Le Male typography, preservation notation, `Sí, pero` reset and commerce treatment.

## Production baseline retained

Editorial v1 public cutover remains the production baseline. Existing platform follow-ups remain separate unless a rendered QA finding makes them publication-relevant.

## Continuation rules

On **Continúa Aromia desde el repo**:

1. verify remote state;
2. read this relay and referenced handoffs;
3. execute the role-ready work without routine Publisher coordination;
4. preserve approved work unless evidence requires correction;
5. obey `docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md` before ending the turn;
6. update this relay at phase end when operational state/next actor changes;
7. escalate only genuine strategic, legal/rights, credential, irreversible publication or material-spending decisions.

For any original-image generation, also read and obey:

`docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md`

Authority order:

`verifiable remote head + newest checkpoint/handoff → this relay → older handoffs → conversational memory`.
