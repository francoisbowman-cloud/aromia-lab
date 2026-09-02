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
STATE_VERSION: 26
UPDATED_AT: 2026-09-02
LAST_ACTOR: ChatGPT (temporary Code-role takeover authorized by Publisher while Code session limit was exhausted)
LAST_ACTION: continued the Editorial v1 home soft-image QA. The three affected interpretive JPEGs are 1600x900 and gross CSS upscale was ruled out. Applied optional per-slot Next/Image quality and set quality:95 only for Ambroxan, Amouage and Ropion. Opened draft PR #123 against main to obtain real CI on the feature head. Created an isolated Railway QA service `web-el-coleccionista-qa`; its first redeploy resolved to a main snapshot despite the service source being configured for the feature branch, so that render is explicitly NOT accepted as feature-branch evidence. This relay commit is also used as a fresh branch event so Railway can attempt an automatic deploy from the configured feature source.
ACTIVE_OBJECTIVE: obtain trustworthy rendered evidence for the quality-95 home pass; if softness remains, replace the three source artworks in clean visual-only generation contexts; then execute authoritative Final OMNI for El coleccionista and close the publication gate
ACTIVE_BRANCH: feat/el-coleccionista-implementation (pushed to origin; NOT merged)
CURRENT_MAIN_SHA: ea586ba30e22f680756b8764934685c4dc21ce66
BRANCH_STATUS: reconciled with current main via merge f33d184; Asset A v2 and home-image QA corrections on top
DRAFT_PR: #123 feat: El coleccionista implementation + visual QA
QA_PREVIEW_SERVICE: Railway web-el-coleccionista-qa (service 6ee9f4cf-ae5a-4376-abca-8414cd3ee79d); accept only a deployment whose metadata/head resolves to feat/el-coleccionista-implementation, never the earlier main snapshot
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

NEXT_ACTOR: ChatGPT temporary Code-role until Code session recovers
NEXT_ACTION: wait for PR #123 CI and Railway branch-event deploy. If Railway produces a feature-branch deployment, expose only that isolated QA service, capture `/` desktop/mobile and judge the same three regions. If the feature preview cannot be trusted, do not use it as evidence. If the images remain globally soft in trustworthy render, replace the specific source(s) rather than sharpening/upscaling. Preserve the current page rhythm and El coleccionista Asset A v2. After visual QA passes, execute authoritative Final OMNI, then mark PR ready/merge only if all gates pass and Publisher has not prohibited release.
BLOCKERS: trustworthy rendered evidence only. No conceptual blocker. Production remains untouched until visual QA + Final OMNI publication gate.
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
