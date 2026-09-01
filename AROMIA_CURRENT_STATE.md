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
STATE_VERSION: 17
UPDATED_AT: 2026-09-01
LAST_ACTOR: ChatGPT executing Publisher-authorized Early OMNI + post-gate asset specification
LAST_ACTION: Early OMNI passed El coleccionista; the gate deliberately reduced the asset package. ChatGPT then finalized a production asset specification and rejected an accidental generated review-sheet image as non-story/non-repo material.
ACTIVE_OBJECTIVE: El coleccionista — implementation
ACTIVE_BRANCH: main
EARLY_OMNI_COMMIT: 3b7d4775355ef8aee2d50b0afaf7ed2700a878bf
ASSET_HANDOFF_COMMIT: 212c76ab637933897169880c8430250974feb51e
DRAFT_STATE_COMMIT: 1989b61cd081dfe54b400a8bbe1581ad1c7f077a
EDITORIAL: READY
ART_DIRECTION: READY
VISUAL_COMPOSITION: READY
EARLY_OMNI: PASS
VISUAL_ASSETS: READY_AS_SPEC
IMPLEMENTATION: PENDING
QA: PENDING
PUBLISH: PENDING
TARGET_DATE: UNSCHEDULED
PRIMARY_STORY: drafts/el-coleccionista.md
FACT_CHECK: research/el-coleccionista-fact-check.md
ART_DIRECTION_HANDOFF: art-direction/el-coleccionista-art-direction-and-composition.md
EARLY_OMNI_REVIEW: art-direction/el-coleccionista-early-omni-review.md
VISUAL_ASSET_HANDOFF: art-direction/el-coleccionista-visual-assets-handoff.md
NEXT_ACTOR: Code (implementation)
NEXT_ACTION: implement El coleccionista against Editorial v1 Foundation; produce/select the single required opening domestic collection image from the locked spec; use typographic Le Male lineage unless publication-safe authentic product imagery is available; attempt preservation/time with layout before adding another image; render desktop/mobile and leave browser evidence for Final OMNI. Do not silently change article thesis/art direction.
BLOCKERS: none for implementation. Product-image rights/provenance are not a blocker because a truthful typographic fallback is already approved.
```

## Creative lock — El coleccionista

Governing thesis:

> **Una colección no se ve grande. Se siente como algo que ya dejó de tener un final claro.**

Early OMNI result: **PASS**.

The gate challenged story-specificity, anti-template behavior, authored humanity, narrative gain, restraint, authenticity, commercial pressure, Aromia identity and responsive integrity. The proposition passed without requiring conceptual redesign.

Post-gate reduction:

- Asset A / domestic opening: required for implementation study.
- Asset B / Le Male family: conditional documentary evidence only; typographic lineage is the approved default fallback when rights/provenance are unresolved.
- Asset C / preservation-time still life: not required by default; first solve with layout/typography.
- `Sí, pero`: hard visual reset; no image, inventory ticks or ornamental residue.

An image accidentally generated while recording the Early OMNI turn was a review-sheet graphic, not an Aromia publication asset. It is rejected and is not part of the repository or implementation handoff.

## Production baseline retained

Editorial v1 public cutover is closed and remains the production baseline:

- PR #120 shipped the photographic Editorial v1 surface.
- PR #121 completed the public-home cutover, merge commit `d7db02cf59861f1acdb55087a5fabfc4e694b3c4`.
- Railway web deployment `fcb010e1-8a00-4c68-82ae-17813a32f94e` reached SUCCESS.
- `/` serves the editorial living cover and released stories live at `/historias/[slug]`.

Existing platform follow-ups remain separate and non-blocking: mobile editorial menu, chrome unification, missing architecture territories and cosmetic asset-directory rename.

## Actor-substitution record

The Publisher explicitly authorized ChatGPT to execute Early OMNI through ChatGPT/OMNI. This was a bounded substitution for the early creative gate only. It does not redefine workflow ownership. Code remains responsible for implementation/rendering and later production actions; Final OMNI must evaluate the rendered browser result.

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
