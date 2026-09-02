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
STATE_VERSION: 23
UPDATED_AT: 2026-09-02
LAST_ACTOR: Code
LAST_ACTION: ingested approved Asset A v2. Copied the external JPEG into apps/web/public/editorial-v1/coleccionista-shelf-01.jpg on feat/el-coleccionista-implementation and verified SHA256 05d1e9fd… against this relay (byte-identical, 260801 B, 1122x1402). Updated the visual slot alt to a photographic description (no longer "ilustración") and biased the opening crop from `center 64%` to `center 52%` — the v2 source ratio (0.800) now matches the slot, so `cover` trims only a few px and the old downward bias would have pulled in the storage bins. Branch was already reconciled with current main by merge f33d184 (Voice Bible only, no conflicts). tsc --noEmit, next lint and next build all clean. Rendered QA on :3100 at desktop 1280 and mobile 375.
ACTIVE_OBJECTIVE: El coleccionista — authoritative Final OMNI on the rendered experience, then PR/publication gate
ACTIVE_BRANCH: feat/el-coleccionista-implementation (pushed to origin; NOT merged)
BASE_MAIN_SHA: efd319a1a176e45c9a8bed68410a1ffe06fad5e7
CURRENT_MAIN_SHA: ea586ba30e22f680756b8764934685c4dc21ce66
BRANCH_STATUS: reconciled with current main via merge f33d184; Code's ingest commit sits on top
ACTOR_HANDOFF_PROTOCOL: docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md
VISUAL_GENERATION_PROTOCOL: docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md
PROVISIONAL_VISUAL_REVIEW: art-direction/el-coleccionista-final-omni-review.md
EDITORIAL: READY
ART_DIRECTION: READY
VISUAL_COMPOSITION: READY
EARLY_OMNI: PASS
VISUAL_ASSETS: INGESTED — Asset A v2 in repo, SHA256 verified, rendered at both breakpoints
IMPLEMENTATION: DONE — opening asset wired; prose, section architecture, density states, Le Male lineage, preservation notation, Sí-pero reset and commerce treatment all untouched
QA: LOCAL_PASS — desktop 1280 + mobile 375: correct v2 image served (probe 1122x1402), no horizontal overflow, crop keeps the full bottle cluster, no console errors, heading order H1→H2→H2→H3→H2→H2. Browser-pane PNG capture is still intermittently blank beyond the fold (session-wide environment fault, same as the prior Code pass) — full rendered PNG evidence is OMNI Render's job at the Final gate.
FINAL_OMNI: PENDING — must use rendered desktop/mobile evidence
PUBLISH: PENDING
TARGET_DATE: UNSCHEDULED
PRIMARY_STORY: drafts/el-coleccionista.md
FACT_CHECK: research/el-coleccionista-fact-check.md
ART_DIRECTION_HANDOFF: art-direction/el-coleccionista-art-direction-and-composition.md
EARLY_OMNI_REVIEW: art-direction/el-coleccionista-early-omni-review.md
VISUAL_ASSET_HANDOFF: art-direction/el-coleccionista-visual-assets-handoff.md
IMPLEMENTATION_CHECKPOINT: art-direction/el-coleccionista-implementation-checkpoint.md

EXTERNAL_ARTIFACT_STATUS: INGESTED (2026-09-02, Code)
FILE_NAME: coleccionista-shelf-01-v2.jpg (external) → apps/web/public/editorial-v1/coleccionista-shelf-01.jpg (in repo)
FORMAT: JPEG, progressive, quality 92, metadata stripped during conversion
DIMENSIONS: 1122x1402
SIZE_BYTES: 260801
SHA256: 05d1e9fdb57e9de3d10bd5ab68d4692541c572ba73f4d58479629115bedc4e3c (verified in repo)
SOURCE: clean visual-only ChatGPT generation supplied by Publisher back into operational chat
TARGET_PATH: apps/web/public/editorial-v1/coleccionista-shelf-01.jpg
QUARANTINE_STATE: PASS
NARRATIVE_TEST: PASS — reads as an observed crowded domestic shelf, not a perfume campaign or abstract collection diagram
AUTHENTICITY_NOTES: no readable brands/logos relied upon; domestic interpretation only; not documentary evidence

NEXT_ACTOR: OMNI
NEXT_ACTION: authoritative Final rendered-experience gate on /historias/el-coleccionista (desktop + mobile) against the locked art direction: the accumulation → withdrawal arc, the Asset A v2 crop and tone in context (recognition, not desire), commercial pressure at ~zero until the close, responsive integrity, and rendered PNG evidence (which this environment could not capture beyond the fold). If corrections return, Code applies them on the same branch. No merge/deploy — publication stays Publisher-gated.
BLOCKERS: NONE. Binary transported and verified; branch reconciled and pushed. No merge/deploy until Final OMNI passes and the Publisher authorizes publication.
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

Asset A v2 passed ChatGPT visual quarantine and, since 2026-09-02, is ingested in the repo — it replaces the previously rejected flat/diagrammatic opening asset.

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
