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
STATE_VERSION: 24
UPDATED_AT: 2026-09-02
LAST_ACTOR: ChatGPT (visual QA)
LAST_ACTION: reviewed Publisher desktop screenshot after Code completed Asset A v2 ingestion. Confirmed a separate visual-quality issue on the Editorial v1 home: the three interpretive home images (Amouage material density, Ambroxan material, Ropion overdose) read globally soft/unintentionally out of focus at rendered size. Inspected implementation: all three are next/image fill + objectFit cover; there is no shared CSS filter on the image elements. The .ev1-resin:after blur is only an atmospheric pseudo-element and cannot explain softness across all three sources. Persisted the finding and correction strategy in art-direction/editorial-home-soft-image-qa.md. El coleccionista Asset A v2 is not implicated and remains approved/ingested.
ACTIVE_OBJECTIVE: correct the three soft Editorial v1 home interpretive images without changing the approved page rhythm; then resume authoritative Final OMNI for El coleccionista and publication gate
ACTIVE_BRANCH: feat/el-coleccionista-implementation (pushed to origin; NOT merged)
CURRENT_MAIN_SHA: ea586ba30e22f680756b8764934685c4dc21ce66
BRANCH_STATUS: reconciled with current main via merge f33d184; Asset A v2 ingest and QA handoffs on top
ACTOR_HANDOFF_PROTOCOL: docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md
VISUAL_GENERATION_PROTOCOL: docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md
SOFT_IMAGE_QA: art-direction/editorial-home-soft-image-qa.md
PROVISIONAL_VISUAL_REVIEW: art-direction/el-coleccionista-final-omni-review.md
EDITORIAL: READY
ART_DIRECTION: READY
VISUAL_COMPOSITION: READY
EARLY_OMNI: PASS
EL_COLECCIONISTA_VISUAL_ASSETS: INGESTED — Asset A v2 SHA256 verified and rendered
EL_COLECCIONISTA_IMPLEMENTATION: DONE
HOME_VISUAL_QA: CHANGES_REQUIRED — three existing interpretive sources visibly soft in Publisher screenshot
QA: CHANGES_REQUIRED — home visual-quality finding must be diagnosed/corrected or explicitly scoped as separate platform follow-up before publication decision
FINAL_OMNI: PENDING
PUBLISH: PENDING
TARGET_DATE: UNSCHEDULED
PRIMARY_STORY: drafts/el-coleccionista.md
IMPLEMENTATION_CHECKPOINT: art-direction/el-coleccionista-implementation-checkpoint.md

AFFECTED_HOME_SLOTS:
- amouage-material-density-interpretive → /editorial-v1/amouage-mineral-density-01.jpg
- ambroxan-material-interpretive → /editorial-v1/ambroxan-resin-abstract-01.jpg
- ropion-overdose-interpretive → /editorial-v1/ropion-bordeaux-texture-01.jpg

NEXT_ACTOR: Code
NEXT_ACTION: inspect intrinsic dimensions and the three source binaries locally at 100%; determine whether softness is intrinsic source quality or rendered scaling/DPR behavior. Preserve the current home composition/rhythm. If sources are intrinsically soft, do not artificially sharpen/upscale as the primary fix: hand back to ChatGPT with three clean visual-only replacement capsules under the Visual Generation Isolation Protocol. If sources are sharp, fix sizing/render behavior, run desktop/mobile rendered QA, push, update relay, then return to Final OMNI. Do not touch El coleccionista Asset A v2 unless evidence shows a separate defect.
BLOCKERS: none for diagnosis. Replacement generation, if required, must occur in a clean visual context per protocol. No merge/deploy until visual QA + Final OMNI publication gate.
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

Asset A v2 passed ChatGPT visual quarantine and is ingested in the repo. The new home-image softness finding does not reopen or invalidate it.

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
