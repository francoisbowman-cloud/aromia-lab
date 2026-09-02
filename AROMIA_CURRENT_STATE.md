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
STATE_VERSION: 30
UPDATED_AT: 2026-09-02
LAST_ACTOR: ChatGPT (temporary Code + Production-role takeover authorized by Publisher)
LAST_ACTION: closed the Editorial v1 home softness follow-up end-to-end. PR #126 (`fix: replace soft Editorial v1 cover art with crisp fallbacks`) passed v2.0 CI and Aromia Strict Audit, then merged to main as 1b3cad8575e6b7281feef05589352f63c0ddce35. The canonical Railway web deployment 90ad55bb-4444-41fb-8009-208d43bba0d6 reached SUCCESS. The three previously soft 1600x900 interpretive raster cover slots are now disabled and their existing resolution-independent CSS artwork renders in the same approved geometry. No page rhythm, copy, spacing, responsive structure, documentary asset, or El coleccionista release content was changed.
ACTIVE_OBJECTIVE: resume normal Aromia editorial production from a clean post-release/post-QA baseline
ACTIVE_BRANCH: main
CURRENT_MAIN_SHA: 1b3cad8575e6b7281feef05589352f63c0ddce35 (functional home fix merge; this relay is a later docs-only main commit)
HOME_FIX_PR: #126 — MERGED
HOME_FIX_MERGE: 1b3cad8575e6b7281feef05589352f63c0ddce35
HOME_FIX_DEPLOYMENT: Railway 90ad55bb-4444-41fb-8009-208d43bba0d6 — SUCCESS
HOME_VISUAL_QA: RESOLVED_BY_CRISP_FALLBACK
SOFT_IMAGE_QA: art-direction/editorial-home-soft-image-qa.md
EL_COLECCIONISTA: LIVE — CLOSED — DO NOT REOPEN CASUALLY
EL_COLECCIONISTA_FINAL_OMNI: PASS
EL_COLECCIONISTA_PUBLISH: LIVE
AFFECTED_HOME_SLOTS:
- amouage-material-density-interpretive → old raster disabled; existing ev1-resin CSS artwork active
- ambroxan-material-interpretive → old raster disabled; existing ev1-story.mineral CSS artwork active
- ropion-overdose-interpretive → old raster disabled; existing ev1-story.ropion CSS artwork active
RULE: future sharper raster replacements are optional. Do not sharpen/upscale the retired JPEGs. Any new original art must be created in a clean visual context, quarantined, and only then set present:true.
ACTOR_HANDOFF_PROTOCOL: docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md
VISUAL_GENERATION_PROTOCOL: docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md
NEXT_ACTOR: Cowork / next editorial story
NEXT_ACTION: continue the editorial calendar/workflow from main. Treat El coleccionista and the home-softness correction as closed baselines unless new evidence or explicit Publisher direction requires reopening them.
BLOCKERS: none.
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
