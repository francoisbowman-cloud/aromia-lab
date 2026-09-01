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
STATE_VERSION: 18
UPDATED_AT: 2026-09-01
LAST_ACTOR: Code (implementation)
LAST_ACTION: implemented El coleccionista as a story-specific route under the Editorial v1 Foundation — new static page + CSS at (editorial)/historias/el-coleccionista/, Asset A slot registered present:false, sitemap entry added. Prose ingested verbatim from the draft. Composition follows the locked art direction: asymmetric quiet opening, growing accumulation rail through "El objeto tiene la culpa", Le Male TYPOGRAPHIC lineage (Asset B fallback, verified names only, no bottle imagery/dates/CTA), abrupt whitespace transition, steel-gray preservation register solved with layout only (Asset C not reopened), hard visual reset at "Sí, pero", contextual affiliate footnotes. tsc + next lint + next build all clean; /historias/el-coleccionista prerenders as static. Local desktop+mobile browser QA green (no horizontal overflow, clean heading order, visible focus, aria-hidden decorative devices, rel="sponsored nofollow" on affiliate links). NOT pushed — main is protected and publication is Publisher-gated.
ACTIVE_OBJECTIVE: El coleccionista — implementation (code done; Asset A + Final OMNI pending)
ACTIVE_BRANCH: local feat/el-coleccionista-implementation (committed locally, not pushed)
BASE_MAIN_SHA: efd319a
EARLY_OMNI_COMMIT: 3b7d4775355ef8aee2d50b0afaf7ed2700a878bf
ASSET_HANDOFF_COMMIT: 212c76ab637933897169880c8430250974feb51e
DRAFT_STATE_COMMIT: 1989b61cd081dfe54b400a8bbe1581ad1c7f077a
EDITORIAL: READY
ART_DIRECTION: READY
VISUAL_COMPOSITION: READY
EARLY_OMNI: PASS
VISUAL_ASSETS: TYPOGRAPHIC_LINEAGE_DONE; ASSET_A_PENDING (needs ChatGPT generation); ASSET_C_NOT_REQUIRED
IMPLEMENTATION: READY_PENDING_ASSET_A
QA: LOCAL_PASS — Final OMNI pending
PUBLISH: PENDING — not pushed; no PR; Railway auto-deploys from main on merge, so merge = publication
TARGET_DATE: UNSCHEDULED
PRIMARY_STORY: drafts/el-coleccionista.md
FACT_CHECK: research/el-coleccionista-fact-check.md
ART_DIRECTION_HANDOFF: art-direction/el-coleccionista-art-direction-and-composition.md
EARLY_OMNI_REVIEW: art-direction/el-coleccionista-early-omni-review.md
VISUAL_ASSET_HANDOFF: art-direction/el-coleccionista-visual-assets-handoff.md
IMPLEMENTATION_CHECKPOINT: art-direction/el-coleccionista-implementation-checkpoint.md
NEXT_ACTOR: ChatGPT (Asset A) — then Code (wire + QA) — then OMNI (Final gate)
NEXT_ACTION: ChatGPT creates Asset A (opening domestic collection scene) from the locked spec in art-direction/el-coleccionista-visual-assets-handoff.md §"Asset A" and returns the binary + ingestion note. Code then drops it at apps/web/public/editorial-v1/coleccionista-shelf-01.jpg, flips the slot to present:true in editorialVisuals.tsx, re-runs desktop/mobile QA, and leaves rendered evidence for Final OMNI. Publisher authorization is required before any push/PR/merge/deploy.
BLOCKERS: Asset A cannot be produced by Code — this environment has no image-generation capability (OMNI image tools are refinement/audit of existing images only). Routed to ChatGPT per the manual operativo. Everything else in the implementation is complete.
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
