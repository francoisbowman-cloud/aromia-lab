# Aromia — Visual Asset Handoff — 02A

STATUS: INGESTED_ON_BRANCH / PUBLISHER_APPROVED / BROWSER_QA_PENDING
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

EXTERNAL_ARTIFACT_STATUS: INGESTED_ON_BRANCH
FILE_NAME: 02A-comprar-para-oler-o-comprar-para-tener.jpg
FORMAT: JPEG
DIMENSIONS: 1536 × 1152 px
SIZE: 273581 bytes
SHA256: a07de6e766bb518463d8108e3cd08642fece2902474c666b2716b2d549c2e35d
TARGET_PATH: assets/visual/editorial/sub-batch-01/02A-comprar-para-oler-o-comprar-para-tener.jpg
SOURCE_MODE: generated interpretive
APPROVAL / QUARANTINE_STATE: PUBLISHER_APPROVED / PASS

The Publisher transported the approved image as `1000268553.jpg`. This delivered
representation has the same approved composition but differs from the metadata
recorded for the earlier external copy. The actual delivered bytes above are now
authoritative and were verified before repository ingestion.

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

1. Obtained the Publisher-approved transported binary.
2. Verified SHA256 exactly:
   `a07de6e766bb518463d8108e3cd08642fece2902474c666b2716b2d549c2e35d`.
3. Ingested it at:
   `assets/visual/editorial/sub-batch-01/02A-comprar-para-oler-o-comprar-para-tener.jpg`.
4. Wired it into the real story renderer for `comprar-para-oler-o-comprar-para-tener` following the web implementation contract.
5. Implemented a wide 4:3 opening interruption; mobile preserves the complete 4:3 relationship instead of forcing the portrait crop used by 01A.
6. Static implementation checks verify the source dimensions, alt text, route and responsive CSS contract.
7. Browser QA remains pending because the integrated cloud browser blocked localhost and the local Playwright browser download timed out. Do not mark QA complete until a branch preview or browser-capable actor verifies both viewports.
8. Do **not** generate, implement, or substitute 02B as part of this handoff.

## Publication states

EDITORIAL: READY
ART_DIRECTION: READY
VISUAL_COMPOSITION: READY
EARLY_OMNI: PENDING
VISUAL_ASSETS: 02A PASS / INGESTED_ON_BRANCH
IMPLEMENTATION: 02A COMPLETE_ON_BRANCH
QA: CODE_GATES_PASS / BROWSER_QA_PENDING
FINAL_OMNI: PENDING
PUBLISH: PENDING

LAST_ACTOR: Code / ChatGPT
LAST_ACTION: verified and ingested the Publisher-delivered 02A binary, replaced the provisional opening treatment with the approved photograph, and implemented a dedicated responsive 4:3 composition.
ACTIVE_OBJECTIVE: complete branch-preview browser QA without advancing to 02B.
ACTIVE_BRANCH / BASE_REF: feat/sub-batch-01-02a-integration / main
STATE / GATES: tests, lint, TypeScript, production build and Strict Audit PASS; browser QA PENDING; 02B paused by Publisher.
DELIVERABLES: canonical JPEG + renderer integration + responsive CSS + updated handoff/quarantine/relay.
EVIDENCE: Publisher approval; delivered checksum; 31/31 web tests; lint; TypeScript; 49-page build; Strict Audit 0/0.
TEMPORARY_OR_EXTERNAL_ARTIFACTS: local QA screenshots unavailable because both browser paths were blocked before rendering.
NEXT_ACTOR: Code or OMNI with branch-preview browser access
NEXT_ACTION: render the PR branch at 1440×1000 and 390×844, verify both objects remain visible and distinct, then mark QA complete. Do not merge or deploy without that evidence.
BLOCKERS: browser runtime access only; no implementation or creative blocker.
PUBLICATION_AUTHORITY / RISK NOTES: 02A is approved. Do not reinterpret, regenerate, or replace it without new Publisher direction. Do not generate 02B yet.
