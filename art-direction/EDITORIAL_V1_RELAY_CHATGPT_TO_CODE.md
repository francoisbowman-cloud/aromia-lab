# AROMIA EDITORIAL v1 — RELAY CHATGPT → CODE

RELAY_STAGE: POST_GATE_VISUAL_POLISH_READY
BRANCH: `feat/editorial-v1-implementation`
PRODUCTION: HOLD
NEXT_ACTOR: Code

## Verified upstream state

Code advanced the branch to `0ed820041301efd8c1713d75b3f7ccefaf6a600b` and completed the gen-2 interpretive raster pass. Gate 4 passed and OMNI Gate 5 returned `APPROVED_WITH_NON_BLOCKING_REFINEMENTS` with confidence `0.844` and zero blockers. All five gates are green. No merge/deploy occurred.

## Publisher-approved post-gate refinement

After reviewing the rendered visual direction, the Publisher approved a bounded polish direction:

- recognizable material photography is preferred over unexplained abstraction;
- generated interpretive imagery must have believable micro-detail, optics, lighting, shadows and controlled imperfection so it does not read as AI-generated or amateur/raw;
- yellow/gold must not function as Aromia's automatic accent because repeated gold microcopy/arrows/labels reads as generic AI-luxury styling;
- Aromia should anchor in warm ivory/paper neutrals + graphite/ink, with restrained story-derived accents such as bone, tobacco, burgundy, resin-brown, stone, sage, smoke and earth;
- chromatic variation should follow editorial rhythm rather than a single repeated accent;
- public UI must never expose hashes, branch/gate labels, PRESENT flags, paths or production metadata.

Canonical art-direction document:

`art-direction/EDITORIAL_V1_POST_GATE_VISUAL_POLISH.md`

## Required Code continuation — deterministic

1. Pull the current active branch and read `EDITORIAL_V1_POST_GATE_VISUAL_POLISH.md`.
2. Preserve the Gate-5-approved implementation as the safety baseline.
3. Apply a bounded palette/rhythm polish: reduce/remove generic yellow/gold semantic accents; use Aromia's ivory/graphite anchors plus restrained material-derived accents where editorially justified.
4. Do not rewrite canonical article copy or disturb documentary provenance.
5. Do not replace documentary imagery with generated imagery.
6. Do not invent new interpretive raster assets merely to satisfy the polish; preserve current approved assets unless a real replacement asset exists in repo.
7. Verify contrast, hierarchy, desktop 1440 and mobile 375, no overflow and no technical metadata leakage.
8. If rendered changes are material, re-run the relevant visual/OMNI gate; otherwise record evidence as a non-blocking polish validation.
9. Keep `PRODUCTION: HOLD`; no merge and no deploy.
10. Update `AROMIA_CURRENT_STATE.md` so the repo, not the human, carries the next relay.

## Status

`GATE_5_BASELINE: APPROVED_WITH_NON_BLOCKING_REFINEMENTS`

`POST_GATE_ART_DIRECTION: APPROVED`

`NEXT: CODE_PALETTE_RHYTHM_POLISH_QA`
