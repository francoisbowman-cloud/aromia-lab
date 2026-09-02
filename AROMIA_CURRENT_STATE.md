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
STATE_VERSION: 28
UPDATED_AT: 2026-09-02
LAST_ACTOR: ChatGPT (temporary Code + OMNI + Production takeover authorized by Publisher while Code session limit was exhausted)
LAST_ACTION: closed El coleccionista end-to-end. Final OMNI PASS was persisted. The original draft PR #123 was closed only because the connector's Mark Ready mutation was broken; replacement non-draft PR #124 carried the exact same head and was merged successfully. main merge commit e292548000a150c7194b48e579b652abffbe8bd1 triggered Railway production deployment 4cf92514-b0b2-44a9-8065-a29add0a7f2b on the canonical web service, which reached SUCCESS. Production build manifest includes the static route /historias/el-coleccionista. The three pre-existing soft Editorial v1 cover images remain a separately tracked non-blocking follow-up.
ACTIVE_OBJECTIVE: resume normal Aromia editorial production from a clean post-release baseline; separately resolve the three soft Editorial v1 cover sources when a trustworthy visual-QA pass is available
ACTIVE_BRANCH: main
CURRENT_MAIN_SHA: e292548000a150c7194b48e579b652abffbe8bd1 (story release merge; this relay update is a later docs-only main commit)
RELEASE_PR: #124 feat: publish El coleccionista — MERGED
SUPERSEDED_DRAFT_PR: #123 — CLOSED, not merged; replaced only due connector Mark Ready bug
PRODUCTION_DEPLOYMENT: Railway 4cf92514-b0b2-44a9-8065-a29add0a7f2b — SUCCESS — main@e292548000a150c7194b48e579b652abffbe8bd1
CANONICAL_ROUTE: /historias/el-coleccionista
FINAL_OMNI_REVIEW: art-direction/el-coleccionista-final-omni-review.md
FINAL_OMNI: PASS
EL_COLECCIONISTA_VISUAL_ASSETS: INGESTED — Asset A v2
EL_COLECCIONISTA_IMPLEMENTATION: DONE
EL_COLECCIONISTA_QA: PASSED
PUBLISH: LIVE
PUBLISHED_AT: 2026-09-02
PRIMARY_STORY: drafts/el-coleccionista.md
IMPLEMENTATION_CHECKPOINT: art-direction/el-coleccionista-implementation-checkpoint.md
ACTOR_HANDOFF_PROTOCOL: docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md
VISUAL_GENERATION_PROTOCOL: docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md

HOME_VISUAL_QA: NONBLOCKING_FOLLOWUP
SOFT_IMAGE_QA: art-direction/editorial-home-soft-image-qa.md
AFFECTED_HOME_SLOTS:
- amouage-material-density-interpretive → /editorial-v1/amouage-mineral-density-01.jpg → 1600x900 → quality:95 experiment
- ambroxan-material-interpretive → /editorial-v1/ambroxan-resin-abstract-01.jpg → 1600x900 → quality:95 experiment
- ropion-overdose-interpretive → /editorial-v1/ropion-bordeaux-texture-01.jpg → 1600x900 → quality:95 experiment
RULE: if those sources remain visibly soft in a trustworthy later render, replace the source art under the Visual Generation Isolation Protocol; do not sharpen/upscale artificially and do not redesign the approved home rhythm.

NEXT_ACTOR: Cowork / next editorial story, unless Publisher explicitly chooses the home-softness follow-up first
NEXT_ACTION: continue the editorial calendar/workflow from main. El coleccionista is closed and must not be reopened casually. Preserve its prose, composition, Asset A v2, Le Male typographic lineage, preservation notation, Sí, pero reset and contextual commerce. Keep the home-softness finding open as a separate platform/editorial-cover task.
BLOCKERS: none for El coleccionista. Remote standalone screenshot capture remains unavailable in the current toolset and is documented; it did not block release because source inspection, Code browser measurements, CI, Strict Audit, isolated branch build and production deployment all passed.
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
