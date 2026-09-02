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
STATE_VERSION: 25
UPDATED_AT: 2026-09-02
LAST_ACTOR: ChatGPT (temporary Code-role takeover authorized by Publisher while Code session limit was exhausted)
LAST_ACTION: continued the Editorial v1 home soft-image QA. Recovered intrinsic JPEG dimensions from the three affected repository binaries: Ambroxan 1600x900, Amouage 1600x900, Ropion 1600x900. Compared those dimensions with the existing home slot geometry and confirmed that gross CSS upscale cannot explain softness across all three images. Applied a conservative rendering correction in editorialVisuals.tsx: added optional per-slot Next/Image quality and set quality:95 only for the three affected texture-critical interpretive slots. No sharpening filters, artificial upscale, layout/grid/rhythm changes, or source replacements were made. Updated art-direction/editorial-home-soft-image-qa.md with the diagnosis and staged decision rule. Browser-capable rendered verification is still required before closing the finding.
ACTIVE_OBJECTIVE: verify the quality-95 home render; if softness remains, replace the three source artworks in clean visual-only generation contexts; then resume authoritative Final OMNI for El coleccionista and publication gate
ACTIVE_BRANCH: feat/el-coleccionista-implementation (pushed to origin; NOT merged)
CURRENT_MAIN_SHA: ea586ba30e22f680756b8764934685c4dc21ce66
BRANCH_STATUS: reconciled with current main via merge f33d184; Asset A v2 and home-image QA corrections on top
ACTOR_HANDOFF_PROTOCOL: docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md
VISUAL_GENERATION_PROTOCOL: docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md
SOFT_IMAGE_QA: art-direction/editorial-home-soft-image-qa.md
QUALITY_PASS_COMMIT: bc3fed3dc825d6571cd501dfd18d8624a6cae798
SOFT_IMAGE_QA_UPDATE_COMMIT: 4f65788d5c940611c98eddcbcccb9a82e9ddd74a
PROVISIONAL_VISUAL_REVIEW: art-direction/el-coleccionista-final-omni-review.md
EDITORIAL: READY
ART_DIRECTION: READY
VISUAL_COMPOSITION: READY
EARLY_OMNI: PASS
EL_COLECCIONISTA_VISUAL_ASSETS: INGESTED — Asset A v2 SHA256 verified and rendered
EL_COLECCIONISTA_IMPLEMENTATION: DONE
HOME_VISUAL_QA: VERIFY_RENDER — quality-95 delivery pass committed for three affected interpretive sources
QA: CHANGES_REQUIRED — rendered desktop/mobile verification required; if the three sources remain soft, replacement is required
FINAL_OMNI: PENDING
PUBLISH: PENDING
TARGET_DATE: UNSCHEDULED
PRIMARY_STORY: drafts/el-coleccionista.md
IMPLEMENTATION_CHECKPOINT: art-direction/el-coleccionista-implementation-checkpoint.md

AFFECTED_HOME_SLOTS:
- amouage-material-density-interpretive → /editorial-v1/amouage-mineral-density-01.jpg → 1600x900 → quality:95
- ambroxan-material-interpretive → /editorial-v1/ambroxan-resin-abstract-01.jpg → 1600x900 → quality:95
- ropion-overdose-interpretive → /editorial-v1/ropion-bordeaux-texture-01.jpg → 1600x900 → quality:95

DIAGNOSIS:
- no CSS blur/filter on the image elements;
- .ev1-resin:after blur is only an atmospheric overlay and cannot explain all three;
- source dimensions are sufficient for CSS-size rendering and do not indicate gross upscale;
- hero can approach source ceiling on high-DPR displays, but lower counterpoints do not;
- likely remaining causes are intrinsically soft source art plus Next/Image re-encoding loss;
- quality:95 removes avoidable recompression loss without faking detail.

NEXT_ACTOR: Code when its session is available again, or another browser-capable production actor
NEXT_ACTION: pull feat/el-coleccionista-implementation and render `/` at desktop and mobile after commit bc3fed3d. Compare the same three image regions against the Publisher screenshot. If the images now show a resolved focal plane and adequate microtexture, mark HOME_VISUAL_QA: PASSED and continue to authoritative Final OMNI. If any remains globally soft, do not add sharpening/upscale; hand that specific source back to ChatGPT with a clean visual-only replacement capsule under the Visual Generation Isolation Protocol. Preserve the current page rhythm and El coleccionista Asset A v2.
BLOCKERS: browser-capable rendered verification only. No conceptual blocker. No merge/deploy until visual QA + Final OMNI publication gate.
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
