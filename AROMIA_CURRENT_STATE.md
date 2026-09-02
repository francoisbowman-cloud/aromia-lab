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
STATE_VERSION: 22
UPDATED_AT: 2026-09-02
LAST_ACTOR: ChatGPT (Art Director / Visual Asset quarantine; temporary Code-role coordination authorized by Publisher)
LAST_ACTION: received Asset A v2 from a clean visual-only conversation and passed it through post-generation quarantine. The image now meets the domestic-recognition objective: ordinary middle-class built-in shelf/cabinet context, lived-in cloth trace, imperfect bottle overlap/density, plausible light, no UI/mockup contamination, no luxury campaign staging. Prepared a publication JPEG copy outside the repo because the GitHub connector cannot upload local binary files. Also established the mandatory Actor Turn Handoff Protocol for all Aromia actors.
ACTIVE_OBJECTIVE: El coleccionista — ingest approved Asset A v2, reconcile branch with current main, rendered re-QA, authoritative Final OMNI, then PR/publication gate
ACTIVE_BRANCH: feat/el-coleccionista-implementation (pushed to origin; NOT merged)
BASE_MAIN_SHA: efd319a1a176e45c9a8bed68410a1ffe06fad5e7
CURRENT_MAIN_SHA: ea586ba30e22f680756b8764934685c4dc21ce66
BRANCH_STATUS: diverged from current main by the Voice Bible commit; Code must reconcile before final PR
ACTOR_HANDOFF_PROTOCOL: docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md
VISUAL_GENERATION_PROTOCOL: docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md
PROVISIONAL_VISUAL_REVIEW: art-direction/el-coleccionista-final-omni-review.md
EDITORIAL: READY
ART_DIRECTION: READY
VISUAL_COMPOSITION: READY
EARLY_OMNI: PASS
VISUAL_ASSETS: READY_FOR_INGEST — Asset A v2 approved in quarantine; binary still external to repo
IMPLEMENTATION: READY — preserve existing composition/code unless new crop requires a minor adjustment
QA: CHANGES_REQUIRED — rendered re-QA required after Asset A v2 ingestion
FINAL_OMNI: PENDING — must use rendered desktop/mobile evidence
PUBLISH: PENDING
TARGET_DATE: UNSCHEDULED
PRIMARY_STORY: drafts/el-coleccionista.md
FACT_CHECK: research/el-coleccionista-fact-check.md
ART_DIRECTION_HANDOFF: art-direction/el-coleccionista-art-direction-and-composition.md
EARLY_OMNI_REVIEW: art-direction/el-coleccionista-early-omni-review.md
VISUAL_ASSET_HANDOFF: art-direction/el-coleccionista-visual-assets-handoff.md
IMPLEMENTATION_CHECKPOINT: art-direction/el-coleccionista-implementation-checkpoint.md

EXTERNAL_ARTIFACT_STATUS: READY_FOR_INGEST
FILE_NAME: coleccionista-shelf-01-v2.jpg
FORMAT: JPEG, progressive, quality 92, metadata stripped during conversion
DIMENSIONS: 1122x1402
SIZE_BYTES: 260801
SHA256: 05d1e9fdb57e9de3d10bd5ab68d4692541c572ba73f4d58479629115bedc4e3c
SOURCE: clean visual-only ChatGPT generation supplied by Publisher back into operational chat
TARGET_PATH: apps/web/public/editorial-v1/coleccionista-shelf-01.jpg
QUARANTINE_STATE: PASS
NARRATIVE_TEST: PASS — reads as an observed crowded domestic shelf, not a perfume campaign or abstract collection diagram
AUTHENTICITY_NOTES: no readable brands/logos relied upon; domestic interpretation only; not documentary evidence

NEXT_ACTOR: Code
NEXT_ACTION: obtain the approved external JPEG from the Publisher/chat handoff and replace apps/web/public/editorial-v1/coleccionista-shelf-01.jpg on feat/el-coleccionista-implementation; verify SHA256 when practical; reconcile branch with current main so the Voice Bible update is not lost; inspect desktop/mobile crop and adjust object-position only if needed; run tsc/lint/build and real rendered browser QA with screenshots/console evidence; commit + push; update this relay and implementation checkpoint; then hand to OMNI for authoritative Final rendered-experience gate. Preserve prose, section architecture, density states, Le Male typographic lineage, preservation notation, Sí-pero reset and commerce treatment.
BLOCKERS: binary transport only — GitHub connector in ChatGPT cannot upload the local JPEG. No conceptual/editorial blocker. No merge/deploy until rendered QA + authoritative Final OMNI pass and Publisher publication authorization.
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

The existing implementation is not being reopened.

Asset A v2 has passed ChatGPT visual quarantine and replaces the previously rejected flat/diagrammatic opening asset once Code ingests the binary.

Narrative test:

> **“Yo conozco ese estante.”**

Preserve prose, section architecture, density states, Le Male typography, preservation notation, `Sí, pero` reset and commerce treatment.

## Production baseline retained

Editorial v1 public cutover is closed and remains the production baseline:

- PR #120 shipped the photographic Editorial v1 surface.
- PR #121 completed the public-home cutover, merge commit `d7db02cf59861f1acdb55087a5fabfc4e694b3c4`.
- Railway web deployment `fcb010e1-8a00-4c68-82ae-17813a32f94e` reached SUCCESS.
- `/` serves the editorial living cover and released stories live at `/historias/[slug]`.

Existing platform follow-ups remain separate and non-blocking: mobile editorial menu, chrome unification, missing architecture territories and cosmetic asset-directory rename.

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
