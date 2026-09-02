# Aromia — Current Operational State

This file is the compact relay for the command:

> **Continúa Aromia desde el repo.**

It indexes the latest verified operational state. Git history, checkpoints and canonical workflow documents remain authoritative evidence.

## Mandatory actor order

Default production order:

`Cowork → Code → ChatGPT → Code → OMNI → Code → Production`

Routine editorial loop is governed by `AROMIA_EDITORIAL_WORKFLOW.md`. `main` is the canonical remote source of truth.

## Current relay

```text
STATE_VERSION: 21
UPDATED_AT: 2026-09-02
LAST_ACTOR: Code (Publisher-authorized temporary role substitution by ChatGPT)
LAST_ACTION: diagnosed repeated wrong image generations as conversation-context contamination, added a canonical Visual Generation Isolation Protocol, and corrected the premature Final OMNI state. The previous Asset A source critique remains valid, but FINAL_OMNI is restored to PENDING because authoritative rendered desktop/mobile screenshot evidence was not available. Dashboard/checkpoint/GitHub-style generations are explicitly rejected process artifacts and cannot affect publication state.
ACTIVE_OBJECTIVE: El coleccionista — create Asset A v2 in clean visual-only context, then ingest/render/re-QA and run authoritative Final OMNI
ACTIVE_BRANCH: feat/el-coleccionista-implementation (pushed to origin; NOT merged)
BASE_MAIN_SHA: efd319a1a176e45c9a8bed68410a1ffe06fad5e7
CURRENT_MAIN_SHA: ea586ba30e22f680756b8764934685c4dc21ce66 (main advanced by one Voice Bible commit; feature branch currently diverged)
VISUAL_GENERATION_PROTOCOL: docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md
PROVISIONAL_VISUAL_REVIEW: art-direction/el-coleccionista-final-omni-review.md
EDITORIAL: READY
ART_DIRECTION: READY
VISUAL_COMPOSITION: READY
EARLY_OMNI: PASS
VISUAL_ASSETS: CHANGES_REQUIRED — Asset A v2 only
IMPLEMENTATION: READY — preserve existing composition/code unless new crop requires a minor adjustment
QA: CHANGES_REQUIRED — visual asset issue only; prior technical QA remains green, rendered re-QA required after replacement
FINAL_OMNI: PENDING
PUBLISH: PENDING
TARGET_DATE: UNSCHEDULED
PRIMARY_STORY: drafts/el-coleccionista.md
FACT_CHECK: research/el-coleccionista-fact-check.md
ART_DIRECTION_HANDOFF: art-direction/el-coleccionista-art-direction-and-composition.md
EARLY_OMNI_REVIEW: art-direction/el-coleccionista-early-omni-review.md
VISUAL_ASSET_HANDOFF: art-direction/el-coleccionista-visual-assets-handoff.md
IMPLEMENTATION_CHECKPOINT: art-direction/el-coleccionista-implementation-checkpoint.md
NEXT_ACTOR: ChatGPT (Asset A v2, CLEAN VISUAL CONTEXT REQUIRED)
NEXT_ACTION: generate Asset A v2 only from the physical-scene capsule in a clean visual-only context. Do not invoke image generation from an operational GitHub/OMNI/Code/checkpoint turn. After quarantine PASS, hand binary to Code; Code ingests, reconciles feature branch with current main, runs rendered desktop/mobile QA, then OMNI runs the authoritative Final rendered-experience gate.
BLOCKERS: Asset A v2 only. No merge/deploy until rendered QA + authoritative Final OMNI pass and Publisher publication authorization.
```

## Visual-generation incident correction — canonical rule

Repeated wrong generations for `El coleccionista` produced dashboards/checkpoints/GitHub-like mockups rather than the requested domestic scene. The root cause is now treated as **conversation-context contamination**, not merely prompt wording.

Canonical protocol:

`docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md`

Core rule:

> **Operational context decides what to make. Clean visual context makes the image. Quarantine decides whether the image is allowed back into Aromia.**

Prompt cleaning alone is insufficient when the image generator infers from the full conversation. If the active turn is dominated by repository state, OMNI gates, UI, implementation logs, Code, GitHub, checkpoints or QA, **do not invoke image generation there**.

Two consecutive mockup/UI drifts in the same conversation trigger a hard stop for image generation in that conversation. Further retries require a clean visual context.

Rejected wrong generations are process waste: do not commit, implement, cite as evidence or use to mutate editorial/QA/OMNI state.

## El coleccionista correction lock

The existing implementation is not being reopened.

The actual ingested Asset A source remains too flat/diagrammatic for the opening recognition beat. This is a valid source-asset critique, but the previous document is now explicitly a **provisional visual review**, not a completed Final OMNI gate.

Asset A v2 must feel like an observed ordinary domestic shelf/drawer/ledge, not an abstract representation of perfume collecting. Keep it unbranded, imperfect, plausible and quiet. One mundane domestic trace is enough. Avoid luxury styling, perfume-ad lighting, marble, smoke, splashes, gold grading, showroom symmetry and recognizable branded bottle geometry.

Narrative test:

> **“Yo conozco ese estante.”**

Not:

> “Esto representa una colección.”

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
5. update the relay at phase end;
6. escalate only genuine strategic, legal/rights, credential, irreversible publication or material-spending decisions.

For any original-image generation, also read and obey:

`docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md`

Authority order:

`verifiable remote head + newest checkpoint/handoff → this relay → older handoffs → conversational memory`.
