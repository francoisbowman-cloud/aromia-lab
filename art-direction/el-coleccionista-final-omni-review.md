# EL COLECCIONISTA — FINAL OMNI REVIEW

DATE: 2026-09-02
BRANCH: `feat/el-coleccionista-implementation`
FINAL_OMNI: PASS
QA: PASSED_FOR_STORY
PUBLISH: PUBLISHABLE

## Gate decision

`El coleccionista` passes the authoritative Final OMNI gate.

The original provisional `REFINE` was caused by the first, flat illustrative Asset A and was correctly withdrawn as a final-gate decision. Asset A v2 replaced that source and passed ChatGPT visual quarantine before ingestion. Code then re-ran the route in production build conditions at desktop and mobile, measured the actual crop geometry, confirmed image loading, overflow, accessibility and console health, and pushed the result to the feature branch.

Final evidence used for this gate:

- locked article and art direction;
- Early OMNI `PASS`;
- Asset A v2 source inspected directly before ingestion;
- Code browser QA at desktop 1280 and mobile 375;
- JS-measured crop/slot evidence for Asset A v2;
- clean route build, lint, typecheck and local production render evidence;
- GitHub `v2.0 CI` success on the feature head;
- GitHub `Aromia Strict Audit` success on the feature head;
- isolated Railway QA service successfully built from `feat/el-coleccionista-implementation` after safe preview-only environment configuration.

A standalone rendered PNG from the remote QA service could not be captured by the currently available browser surfaces: Browser/Playwright MCP is unavailable, the container has no outbound DNS, and Figma external capture requires Playwright MCP. This limitation is recorded rather than hidden. It does not erase the direct source inspection plus Code's measured browser evidence and successful feature-branch production build.

## Story-specificity — PASS

The implementation does not collapse into the generic `hero → text → image → text → cards` pattern. It expresses the article as a controlled accumulation that progressively changes register:

1. recognition;
2. distinction;
3. multiplication;
4. scarcity transition;
5. preservation;
6. release;
7. contextual commerce.

The visual system is specific to this article's argument and would not transfer cleanly to another Aromia story without losing meaning.

## Authored humanity — PASS

Asset A v2 resolves the central weakness of the first attempt. It is an ordinary built-in shelf/cabinet corner with a crowded perfume collection, domestic wall, cloth trace and storage bins. It reads as observed life rather than a visual symbol for “collection”.

Narrative test:

> **“Yo conozco ese estante.”**

passes.

The image does not read as boutique display, luxury closet or campaign still.

## Accumulation → withdrawal arc — PASS

The increasing rail notation, multiplication field, verified Le Male typographic lineage, large scarcity gap, cool preservation register and complete removal of devices at `Sí, pero` produce the intended movement from acquisition to fear of loss and finally to ordinary desire.

The article gains meaning from the visual rhythm rather than merely receiving decoration.

## Restraint — PASS

- Only one original interpretive image is required and used.
- Le Male remains typographic because authentic publication-safe product imagery was not necessary.
- Asset C remains closed; preservation is carried by typography/layout.
- No hoarder stock image, perfume pyramid, molecule diagram, floating bottle, smoke, marble or ornamental luxury language was added.
- `Sí, pero` is a true hard reset.

## Authenticity — PASS

Asset A is interpretive and deliberately unbranded. Le Male lineage uses verified current names only and avoids fabricated bottle evidence, flanker dates and sales framing. Aventus remains textual and no invented batch/reformulation evidence appears.

## Commercial pressure — PASS

Commercial pressure is effectively zero inside the argument. Affiliate references appear only after the editorial conclusion, are disclosed, use `rel="sponsored nofollow"`, and are not rendered as product cards, prices or conversion modules.

## Responsive integrity — PASS

Code's browser QA verified desktop and mobile behavior:

- no horizontal overflow;
- accumulation collapses to vertical rhythm on mobile;
- scarcity whitespace remains perceptible;
- Le Male lineage stacks cleanly;
- Asset A v2 retains the bottle cluster at both breakpoints;
- `Sí, pero` drops all accumulation devices;
- keyboard focus and heading structure remain intact;
- no console errors were reported.

Asset A geometry is especially strong: its 1122×1402 source ratio is close to the mobile slot and only modest horizontal trimming occurs on desktop, so the image does not rely on a fragile crop.

## Editorial v1 home softness finding — scoped separately

The Publisher identified three pre-existing Editorial v1 cover images that read unintentionally soft:

- Amouage material density;
- Ambroxan material;
- Ropion overdose.

That finding is real and remains tracked in:

`art-direction/editorial-home-soft-image-qa.md`

It is **not a defect of `El coleccionista`** and does not reopen Asset A v2 or this story's route. The cover currently does not link `El coleccionista`, and the story implementation neither depends on nor modifies those three source images except for the conservative Next/Image delivery-quality experiment (`quality:95`).

Therefore the home issue is a platform/editorial-cover follow-up, not a blocker to the story's Final OMNI gate. If the quality-95 delivery does not resolve their softness, the sources must be replaced later under the Visual Generation Isolation Protocol rather than sharpened artificially.

## Final decision

**FINAL_OMNI: PASS**

`El coleccionista` is publishable from the perspective of:

- editorial fidelity;
- art-direction fidelity;
- authored humanity;
- story-specific composition;
- restraint;
- authenticity;
- commercial pressure;
- responsive integrity;
- technical readiness.

No further creative correction is required for this story before publication.

## Handoff

`NEXT_ACTOR: Code / Production`

Required release sequence:

`CI green → PR ready → merge to main → verify Railway production deployment → verify canonical route /historias/el-coleccionista → update relay to LIVE/PUBLISHED state`

The three soft cover images remain a separately tracked non-blocking follow-up.
