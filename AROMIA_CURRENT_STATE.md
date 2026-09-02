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
STATE_VERSION: 20
UPDATED_AT: 2026-09-01
LAST_ACTOR: OMNI (Final gate, executed by ChatGPT with Publisher-authorized OMNI usage)
LAST_ACTION: Final OMNI reviewed El coleccionista against the locked art direction, implementation checkpoint, TSX/CSS and the actual ingested Asset A. Technical implementation, accumulation→withdrawal arc, Le Male typographic lineage, preservation treatment, commerce restraint and responsive evidence pass. Asset A fails the authored-humanity / recognition test: it is a flat illustrative lineup on an abstract beige field rather than a convincingly observed domestic shelf. FINAL_OMNI: REFINE. Review recorded at art-direction/el-coleccionista-final-omni-review.md. No conceptual redesign requested.
ACTIVE_OBJECTIVE: El coleccionista — replace Asset A only, then re-QA and Final OMNI re-check
ACTIVE_BRANCH: feat/el-coleccionista-implementation (pushed to origin; NOT merged)
BASE_MAIN_SHA: efd319a
FINAL_OMNI_REVIEW_COMMIT: e28d13dbc05af266dabc7a1f677bab5169f3770c
EDITORIAL: READY
ART_DIRECTION: READY
VISUAL_COMPOSITION: READY
EARLY_OMNI: PASS
VISUAL_ASSETS: CHANGES_REQUIRED — Asset A v2 only
IMPLEMENTATION: READY — preserve existing composition/code unless new crop requires a minor adjustment
QA: CHANGES_REQUIRED — visual asset issue only; technical QA remains green
PUBLISH: PENDING
TARGET_DATE: UNSCHEDULED
PRIMARY_STORY: drafts/el-coleccionista.md
FACT_CHECK: research/el-coleccionista-fact-check.md
ART_DIRECTION_HANDOFF: art-direction/el-coleccionista-art-direction-and-composition.md
EARLY_OMNI_REVIEW: art-direction/el-coleccionista-early-omni-review.md
VISUAL_ASSET_HANDOFF: art-direction/el-coleccionista-visual-assets-handoff.md
IMPLEMENTATION_CHECKPOINT: art-direction/el-coleccionista-implementation-checkpoint.md
FINAL_OMNI_REVIEW: art-direction/el-coleccionista-final-omni-review.md
NEXT_ACTOR: ChatGPT (Asset A v2)
NEXT_ACTION: regenerate/replace only apps/web/public/editorial-v1/coleccionista-shelf-01.jpg with a photographic or convincingly photographic ordinary domestic collection scene that passes the narrative test “yo conozco ese estante”; then Code ingests/re-QAs desktop+mobile and OMNI performs the final re-check. Preserve prose, section architecture, density states, Le Male typography, preservation notation, Sí-pero reset and commerce treatment.
BLOCKERS: none except completion/transport of Asset A v2. No merge/deploy until Final OMNI passes and Publisher authorizes publication.
```

## Final OMNI correction lock — El coleccionista

The existing implementation is not being reopened. Final OMNI returned **REFINE** for one material reason only: Asset A is visually too diagrammatic and generic for the story's opening recognition beat.

Asset A v2 must feel like an observed ordinary domestic shelf/drawer/ledge, not an abstract representation of perfume collecting. Keep it unbranded, imperfect, plausible and quiet. One mundane domestic trace is enough. Avoid luxury styling, perfume-ad lighting, marble, smoke, splashes, gold grading, showroom symmetry and recognizable branded bottle geometry.

Narrative test:

> **“Yo conozco ese estante.”**

Not:

> “Esto representa una colección.”

Preserve everything else unless re-QA finds a genuine implementation defect.

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

Authority order:

`verifiable remote head + newest checkpoint/handoff → this relay → older handoffs → conversational memory`.
