# AROMIA EDITORIAL v1 — RELAY CHATGPT → CODE

RELAY_STAGE: INTERPRETIVE_SOURCES_READY_FOR_MATERIALIZATION
BRANCH: `feat/editorial-v1-implementation`
PRODUCTION: HOLD
NEXT_ACTOR: Code

## Correction of the failed binary handoff

Code correctly rejected the three blobs from commit `5cf1702cb0a2cfc0a3fb27d81d3cea0752f9ba81`: they were not valid JPEG files. That commit is historical failure evidence only. Do **not** wire those bytes and do not use the old hashes.

The failure came from binary transport through the connector, not from the visual direction. To remove the transport dependency entirely, ChatGPT has now committed three deterministic, 1600×900 SVG source compositions directly into the active branch as UTF-8 source assets.

## Canonical interpretive sources now in the repo

Source directory:

`art-direction/interpretive-source/`

Files:

1. `ambroxan-resin-abstract-01.svg`
   - canvas: 1600×900
   - TYPE: interpretive
   - ROLE: opening material study; translucent/waxy/mineral behavior under warm lateral light
   - excludes whale/ocean/fake chemistry/bottle/branding

2. `ropion-bordeaux-texture-01.svg`
   - canvas: 1600×900
   - TYPE: interpretive
   - ROLE: controlled excess; one saturated burgundy material act with preserved negative margin
   - excludes portrait/lab infographic/product gloss

3. `amouage-mineral-density-01.svg`
   - canvas: 1600×900
   - TYPE: interpretive
   - ROLE: material density / formula ambition; mineral strata with restrained resin/metallic cues
   - excludes crown/throne/palace/calligraphy/bottle

These source files are the authoritative ChatGPT visual deliverables for recovery from the failed binary transport.

## Required Code continuation — deterministic, no human routing question

1. Pull the branch at/after the source commits.
2. Ignore/replace the invalid JPG blobs from `5cf1702`.
3. Rasterize each canonical SVG source at **1600×900** to these exact output names under `apps/web/public/editorial-v1/`:
   - `ambroxan-resin-abstract-01.jpg`
   - `ropion-bordeaux-texture-01.jpg`
   - `amouage-mineral-density-01.jpg`
4. Use a deterministic local renderer available to Code (browser/Chromium screenshot, ImageMagick, Sharp, or equivalent). Do not redesign or regenerate the composition.
5. Validate every output before wiring:
   - file decodes as JPEG;
   - JPEG magic begins `FF D8 FF`;
   - dimensions are 1600×900;
   - compute and record the actual SHA-256 produced by the renderer.
6. Only after those checks, set the corresponding `EDITORIAL_V1_SLOTS[...]` entries to `present: true` and point to the exact filenames.
7. Re-run Gate 4 at desktop 1440 and mobile 375; verify crop/hierarchy and that no placeholder remains.
8. If Gate 4 passes, advance automatically to OMNI Gate 5 on rendered evidence.
9. Keep `PRODUCTION: HOLD`; no merge and no deploy.

## Gate status

`GATE_3_VISUAL_DIRECTION: PASS`

`GATE_3_SOURCE_DELIVERY: PASS`

`GATE_3_RASTER_MATERIALIZATION: PENDING_CODE`

`NEXT: CODE_MATERIALIZE_VALIDATE_RE_GATE_4`

The earlier status-board/meta generations remain discarded and are not Gate evidence.
