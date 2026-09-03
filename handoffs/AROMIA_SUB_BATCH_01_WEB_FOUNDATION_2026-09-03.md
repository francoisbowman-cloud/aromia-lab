# Aromia — Sub-batch 01 Web Foundation Handoff

DATE: 2026-09-03
ACTOR: ChatGPT / Code-capable Art Direction implementation
STATUS: IMPLEMENTATION FOUNDATION COMPLETE; VISUAL ASSET QUARANTINE CONTINUES

## What changed

The sub-batch is no longer treated as a collection of image-generation tasks. The web is now the delivery target.

Implemented on `main`:

- canonical asset delivery endpoint: `apps/web/src/app/api/editorial-asset/[filename]/route.ts`;
- shared sub-batch story renderer: `apps/web/src/app/(editorial)/historias/subBatch01Story.tsx`;
- authored responsive composition styles: `apps/web/src/app/(editorial)/historias/subBatch01Story.module.css`;
- explicit routes for all nine sub-batch-01 stories;
- draft-to-page parser that reads canonical `drafts/*.md`, removes operational metadata/fences, preserves article structure and converts `[AROMIA_VISUAL_OPPORTUNITY]` positions into web visual beats;
- 01A is wired to its canonical quarantined binary through `/api/editorial-asset/01A-antes-del-perfume-ya-oliamos.jpg`;
- 01A uses the quarantine-approved accessibility intent rather than a generic image alt;
- photographic opportunities without a PASS asset render nothing rather than showing fake placeholders or workflow UI;
- native non-photographic decisions are already implemented for 01B, 05B, 06B and 08B;
- all nine sub-batch routes emit `robots: noindex, nofollow` while visual implementation and rendered QA are incomplete. This protection must be removed story-by-story only at publication readiness.

## Nine routed stories

1. `/historias/antes-del-perfume-ya-oliamos`
2. `/historias/comprar-para-oler-o-comprar-para-tener`
3. `/historias/cuando-ya-no-hueles-tu-perfume`
4. `/historias/fougere-no-significa-viejo`
5. `/historias/huele-sintetico-que-estamos-diciendo`
6. `/historias/lavanda-limpia-medicinal-barata-elegante`
7. `/historias/nos-perfumamos-para-nosotros-o-para-los-demas`
8. `/historias/podemos-describir-un-olor-sin-compararlo`
9. `/historias/por-que-una-lista-de-notas-no-te-dice-como-huele`

## Asset integration contract

Approved photography must be ingested under:

`assets/visual/editorial/sub-batch-01/`

Then add the filename to `visualAssets` in `subBatch01Story.tsx` for the exact story + visual index, and add its approved alt intent to `visualAlts`.

Do not introduce a visible placeholder while waiting. The page remains editorially readable and the missing photographic beat stays absent until quarantine PASS.

## Current visual truth

- 01A: PASS, wired into real web page.
- 01B: native material field implemented.
- 02A: RESOLVED as a web-native editorial composition (sample/experience vs bottle/possession); no generated photography required.
- 05B: native typographic/material pause implemented.
- 06B: native marginal markers implemented.
- 08B: native language interruption implemented.
- 02B: RESOLVED as a web-native dual-shelf composition (used-down levels vs nearly-full collection), preserving a neutral non-judgmental read.
- remaining photographic/material-study slots: implementation-ready but deliberately absent until their source passes quarantine.

## Verification evidence

First full implementation head `7dc805a26df0db3cd18078e1f8cfe0394ddc4623`:

- v2.0 CI run `33804632426`: API SUCCESS; web tests 31/31 SUCCESS; lint SUCCESS; TypeScript SUCCESS; Next production build SUCCESS.
- Aromia Strict Audit run `33804632376`: code-and-governance job SUCCESS, including root tooling, Fase 3 verification, OMNI strict governance, API build and web lint/typecheck/production build. Its separate production-catalog observation continued independently.

Final publication-protection commit:

`c4ab6828dfdcdd6528aaa7b77c06dffe44147260`

This adds `noindex, nofollow` and the specific approved 01A alt intent. CI and Strict Audit were automatically re-triggered for this final head. Railway production automatically began building the web deployment `c9589c41-96de-45d4-ac03-26c24bff4270` for the same push cycle; verify SUCCESS before claiming the routes are production-ready.

## Non-negotiable rule

> An image is not the deliverable. A rendered, authored Aromia page is the deliverable.

Generation remains isolated from repo/QA conversations. This implementation does not authorize generating 02A from an operational context.

## Next actor

`ChatGPT Visual Assets` in a genuinely clean visual-only context for 02A, followed immediately by Code integration through the already-established web path.

After each PASS asset, update `visualAssets` + `visualAlts`, verify the exact page at mobile + desktop, and only then advance its web state. Do not remove `noindex` until the story itself is fully art-directed and passes rendered QA.
