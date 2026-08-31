# AROMIA EDITORIAL v1 — RELAY CHATGPT → CODE

RELAY_STAGE: INTERPRETIVE_ASSETS_READY_FOR_INGESTION
BRANCH: `feat/editorial-v1-implementation`
PRODUCTION: HOLD
NEXT_ACTOR: Code

## Deliverables produced

ChatGPT completed the three locked interpretive production assets required by Gate 3. They are individual JPGs, not a mockup/status board.

Target repo path for all three:

`apps/web/public/editorial-v1/`

Files:

1. `ambroxan-resin-abstract-01.jpg`
   - 1600×900
   - SHA-256: `99fe0c401aae30b77110c4848ff90ce199c8b551a84cee0e78e8457b0c17f1a7`
   - TYPE: interpretive
   - ROLE: opening material study for Ambroxan

2. `ropion-bordeaux-texture-01.jpg`
   - 1600×900
   - SHA-256: `8c49c083c67a31ce878880c50d5d7a223a44cf7dfbf29b2f3e2df33e23ac6a57`
   - TYPE: interpretive
   - ROLE: controlled-excess visual act for Ropion

3. `amouage-mineral-density-01.jpg`
   - 1600×900
   - SHA-256: `5c12c2d99e8d593d04ea2f6f36aa5a91835c35146d66990a1e567ea3dffb304e`
   - TYPE: interpretive
   - ROLE: material-density / formula-ambition study for Amouage

## Transfer note

The ChatGPT session produced the binaries as a transferable artifact bundle named:

`aromia-editorial-v1-gate3-interpretive-assets.zip`

This GitHub connector cannot upload binary JPG content directly through the text-file action used for repo state/handoffs. Therefore Code must ingest the three JPGs from the artifact bundle into the exact target path above, preserving filenames byte-for-byte.

Do not substitute or regenerate them unless an implementation QA issue makes that necessary.

## Required Code continuation

1. Place the 3 JPGs under `apps/web/public/editorial-v1/`.
2. Verify SHA-256 hashes against this relay.
3. Flip the corresponding `EDITORIAL_V1_SLOTS[...]` entries to `present: true` and point to the exact filenames.
4. Re-run Gate 4 at desktop 1440 and mobile 375 and verify crops/hierarchy.
5. Run authenticity/provenance audit: these three are interpretive, not documentary evidence.
6. If Gate 4 passes with the real assets, advance to OMNI Gate 5 on rendered evidence.
7. Keep `PRODUCTION: HOLD`; no merge and no deploy.

## Gate status

`GATE_3_ASSET_CREATION: PASS`

`GATE_3_REPO_INGESTION: PENDING_CODE`

The prior accidental status-board/meta generations are explicitly discarded and are not Gate evidence.
