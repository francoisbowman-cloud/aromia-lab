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
STATE_VERSION: 29
UPDATED_AT: 2026-09-02
LAST_ACTOR: ChatGPT (temporary Code-role takeover authorized by Publisher)
LAST_ACTION: resolved the separate Editorial v1 home soft-image follow-up without reopening El coleccionista. The three affected 1600x900 interpretive raster sources were classified as insufficiently resolved for their prominent cover roles after source-dimension/code diagnosis and the earlier quality:95 delivery experiment. Created branch fix/editorial-home-crisp-fallback and disabled only those three raster slots (present:false), causing VisualField to use the existing resolution-independent CSS artwork already authored for the exact same boxes. Composition, copy, spacing, mobile/desktop geometry, documentary assets and El coleccionista remain untouched. art-direction/editorial-home-soft-image-qa.md now records STATUS: RESOLVED_BY_CRISP_FALLBACK. Future sharper raster replacements are optional and must pass the Visual Generation Isolation Protocol before reactivation.
ACTIVE_OBJECTIVE: integrate the crisp home fallback after CI; then resume normal Aromia editorial production from main
ACTIVE_BRANCH: fix/editorial-home-crisp-fallback
BASE_BRANCH: main
EL_COLECCIONISTA: LIVE — CLOSED — DO NOT REOPEN CASUALLY
FINAL_OMNI: PASS
PUBLISH: LIVE
HOME_VISUAL_QA: RESOLVED_BY_CRISP_FALLBACK
SOFT_IMAGE_QA: art-direction/editorial-home-soft-image-qa.md
HOME_FALLBACK_CODE_COMMIT: 368d3b87a912b14f4a66ada4e95f80fe6fb99210
HOME_FALLBACK_QA_COMMIT: 221abc8ee992e82e2fbb95fe989c99c2ab716d85
AFFECTED_HOME_SLOTS:
- amouage-material-density-interpretive → raster disabled; existing ev1-resin CSS artwork active
- ambroxan-material-interpretive → raster disabled; existing ev1-story.mineral CSS artwork active
- ropion-overdose-interpretive → raster disabled; existing ev1-story.ropion CSS artwork active
RULE: future raster replacements are optional. Do not sharpen/upscale the old JPEGs. Any new original art must be created in a clean visual context, quarantined, and only then set present:true.
NEXT_ACTOR: Code/CI integration, then Cowork / next editorial story
NEXT_ACTION: open PR for fix/editorial-home-crisp-fallback, run required CI/Strict Audit, merge if green, verify production deploy success, then return Aromia to normal editorial-calendar flow. Preserve El coleccionista release lock.
BLOCKERS: none. No image generation is required to close the softness defect.
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

## El coleccionista release lock

`El coleccionista` is LIVE. Final OMNI passed and production deployment succeeded.

Narrative test for Asset A remains:

> **“Yo conozco ese estante.”**

Do not reopen or redesign the story without new evidence or explicit Publisher direction.

## Editorial home softness resolution

The three raster cover artworks reported as unintentionally soft by the Publisher are no longer active. Their existing CSS fallbacks now occupy the same approved slots. This closes the raster-focus defect without altering the page rhythm.

The retired raster files remain in the repository for traceability but must not be re-enabled unless a deliberate review reverses this decision. Future replacement art must follow the visual-isolation protocol.

## Production baseline retained

Editorial v1 remains the production baseline. Existing platform follow-ups remain separate unless a rendered QA finding makes them publication-relevant.

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
