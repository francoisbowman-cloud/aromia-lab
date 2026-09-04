# Aromia — Visual Asset Handoff — 02A

STATUS: READY_FOR_INGEST / PUBLISHER_APPROVED
DATE: 2026-09-04
ARTICLE: Comprar para oler o comprar para tener
SLUG: comprar-para-oler-o-comprar-para-tener
OPPORTUNITY: 02A — opening
SOURCE_ART_DIRECTION: art-direction/AROMIA_SUB_BATCH_01_TERRITORIOS_VISUAL_DIRECTION.md
SOURCE_QUARANTINE: art-direction/AROMIA_SUB_BATCH_01_VISUAL_GENERATION_QUARANTINE.md
WEB_IMPLEMENTATION_CONTRACT: art-direction/AROMIA_SUB_BATCH_01_WEB_IMPLEMENTATION_CONTRACT.md

## Approval

The Publisher explicitly approved the generated image as **02A** on 2026-09-04.

QUARANTINE_DECISION: PASS
NARRATIVE_TEST: PASS — One object contains the experience; the other contains ownership.
GENERATION_CONTINUATION: PAUSED BY PUBLISHER — do not generate 02B yet.

## External binary

EXTERNAL_ARTIFACT_STATUS: READY_FOR_INGEST
FILE_NAME: 02A-comprar-para-oler-o-comprar-para-tener.jpg
FORMAT: JPEG
DIMENSIONS: 1448 × 1086 px
SIZE: 475474 bytes
SHA256: 04ed9613baab4f4a4b23c7b5714558dfbacb97635eeb242b3dd17d6f73b5c6a4
TARGET_PATH: assets/visual/editorial/sub-batch-01/02A-comprar-para-oler-o-comprar-para-tener.jpg
SOURCE_MODE: generated interpretive
APPROVAL / QUARANTINE_STATE: PUBLISHER_APPROVED / PASS

The binary still exists outside the repository because the available GitHub connector cannot ingest local binary files. Do not claim it is ingested until Code verifies the exact checksum after adding it to the repository.

## Visual intent

CROP_INTENT: landscape master; keep the used sample vial and the nearly-full generic bottle visually separable on narrow/mobile crops.
ALT_INTENT: A visibly used anonymous perfume sample vial sits closer to the camera beside a nearly full generic fragrance bottle farther back on an ordinary lived-in wooden dresser.
AUTHENTICITY_NOTES:
- ordinary domestic dresser / shelf;
- soft side daylight;
- no luxury retail staging;
- no readable branding or logos;
- sample vial visibly handled and imperfect;
- full-size bottle generic and nearly untouched;
- no moral hierarchy between experience and possession.

## Exact Code ingestion action

1. Obtain the approved external binary named above.
2. Verify SHA256 exactly:
   `04ed9613baab4f4a4b23c7b5714558dfbacb97635eeb242b3dd17d6f73b5c6a4`.
3. Ingest it at:
   `assets/visual/editorial/sub-batch-01/02A-comprar-para-oler-o-comprar-para-tener.jpg`.
4. Wire it into the real story renderer for `comprar-para-oler-o-comprar-para-tener` following the web implementation contract.
5. Render as the wide horizontal opening interruption with unequal object distances.
6. Verify desktop and mobile crops preserve both objects and their relationship.
7. Run browser QA and only then mark the web slot implemented.
8. Do **not** generate, implement, or substitute 02B as part of this handoff.

## Publication states

EDITORIAL: READY
ART_DIRECTION: READY
VISUAL_COMPOSITION: READY
EARLY_OMNI: PENDING
VISUAL_ASSETS: 02A PASS / external binary READY_FOR_INGEST
IMPLEMENTATION: PENDING
QA: PENDING
FINAL_OMNI: PENDING
PUBLISH: PENDING

LAST_ACTOR: ChatGPT / Visual Assets
LAST_ACTION: generated and quarantined 02A; Publisher approved it; prepared deterministic binary handoff.
ACTIVE_OBJECTIVE: ingest and integrate approved 02A into the live article renderer without advancing to 02B.
ACTIVE_BRANCH / BASE_REF: main
STATE / GATES: 02A PASS; 02B paused by Publisher.
DELIVERABLES: this handoff + external approved JPEG.
EVIDENCE: Publisher approval + checksum + canonical art-direction narrative test.
TEMPORARY_OR_EXTERNAL_ARTIFACTS: approved JPEG remains outside repo pending Code ingestion.
NEXT_ACTOR: Code
NEXT_ACTION: ingest checksum-matched 02A, integrate into article, verify responsive crop and browser QA.
BLOCKERS: binary transport only; no creative blocker.
PUBLICATION_AUTHORITY / RISK NOTES: 02A is approved. Do not reinterpret, regenerate, or replace it without new Publisher direction. Do not generate 02B yet.
