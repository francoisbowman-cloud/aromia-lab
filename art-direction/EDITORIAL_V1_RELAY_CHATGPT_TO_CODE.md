# AROMIA EDITORIAL v1 — RELAY CHATGPT → CODE

RELAY_STAGE: GATE5_EV1_01_REMEDIATION_READY
BRANCH: `feat/editorial-v1-implementation`
PRODUCTION: HOLD
NEXT_ACTOR: Code

## Why this relay exists

Code completed raster materialization, Gate 4 and OMNI Gate 5. OMNI returned `GATE_5: BLOCKED` on `ev1-01`: the first-generation interpretive hero/lead sources read too flat/vector-like and below Aromia's luxury-editorial bar.

ChatGPT has now replaced all three canonical SVG sources with a higher-craft version designed specifically to remediate that blocker. The new sources rely on multi-scale turbulence, layered displacement, specular-lighting passes, grain, restrained material highlights and more natural tonal depth rather than simple flat shapes/gradients.

## Updated authoritative sources

Directory:

`art-direction/interpretive-source/`

1. `ambroxan-resin-abstract-01.svg`
   - 1600×900
   - more translucent/waxy/mineral depth, warm lateral light, wet-film/specular behavior
   - still interpretive; no whale/ocean/fake chemistry/bottle/branding

2. `ropion-bordeaux-texture-01.svg`
   - 1600×900
   - denser organic/folded burgundy pressure with preserved quiet margin and surface-light behavior
   - still interpretive; no portrait/lab infographic/product gloss

3. `amouage-mineral-density-01.svg`
   - 1600×900
   - richer mineral strata, granular surface variation, restrained resin/brass cues, reduced clip-art polygon character
   - still interpretive; no crown/throne/palace/calligraphy/bottle

The previous raster JPGs generated from the earlier source revisions are obsolete for Gate 5 remediation and must be replaced.

## Required Code continuation — deterministic

1. Pull the branch at/after the three source-upgrade commits.
2. Re-run `scripts/images/rasterize-editorial-v1.mjs` against the updated SVG sources.
3. Produce the same exact output filenames under `apps/web/public/editorial-v1/`:
   - `ambroxan-resin-abstract-01.jpg`
   - `ropion-bordeaux-texture-01.jpg`
   - `amouage-mineral-density-01.jpg`
4. Validate JPEG magic, 1600×900 dimensions and record fresh SHA-256 values.
5. Keep the existing interpretive slots `present:true`; they already point to these filenames.
6. Re-run Gate 4 at 1440 and 375 with the newly rasterized assets and verify no crop/hierarchy regression.
7. Re-submit the rendered evidence automatically to OMNI Gate 5.
8. If `ev1-01` clears, continue through the normal Code correction/production-prep path; if it remains blocked, route the specific visual finding back to ChatGPT/Design without asking the human for routine routing.
9. Preserve documentary provenance/captions and the existing `:focus-visible` fix.
10. Keep `PRODUCTION: HOLD`; no merge and no deploy.

## Gate status

`GATE_5_PREVIOUS_RESULT: BLOCKED`

`BLOCKER: ev1-01`

`CHATGPT_REMEDIATION: READY`

`NEXT: CODE_RASTERIZE_RE_GATE_4_RE_GATE_5`
