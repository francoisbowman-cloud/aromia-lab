# OMNI Foundational Purpose Trial — Flat Image (stacked baseline)

Date: 2026-08-19
Baseline: technically validated Unknown Problem candidate (`de1652ef5f39b09147271b96a780a53e5f468cb6`)
Production mutation: **forbidden**
Maximum creative implementation iterations: **2**

## Exact operator brief

> Una imagen importante de Aromia se siente plana. Encuentra cuál y hazla ganar profundidad y presencia sin alterar la identidad de lo que muestra ni convertirla en una composición falsa.

## Why this stacked baseline exists

The first Flat Image attempt against `main` was closed unmerged because Loewe 001 Man was still affected by the independent product-image visibility defect. A depth/presence test is invalid if the target object is not reliably visible.

This stacked trial starts from the Case 1 candidate where product visibility, source fidelity, Strict Audit, v2 CI and warmed perceptual evidence are already technically green. Case 1 itself remains unmerged because its independent external perceptual verdict is still UNVERIFIED.

## Preservation contract

- preserve real product identity and verified source pixels;
- no generated look-alike bottle;
- no altered label/logo/cap/liquid/packaging/color;
- no gratuitous 3D, glass, blur, glow or parallax;
- preserve routes, SEO, analytics, accessibility, responsive behavior and performance;
- keep Catalog and PDP as identity controls.

---

## OBSERVE

The controlled baseline shows Loewe 001 Man correctly visible in the Home hero. Catalog and PDP provide identity controls: the bottle itself is not the problem.

The Home composition places the product image inside a beige panel, then a large white image field, then the gray field already present in the source. Those nested planar boundaries all sit parallel to the viewport. The bottle is legible, but the visual hierarchy treats the whole product field like an inserted card instead of an object with presence.

## MICROFINDINGS

### `home-hero-nested-planes`

- surface: `home.hero.product-stage`
- severity: **P1 HIGH VALUE**
- disposition: **FIX_NOW**
- notice: three aligned rectangular planes flatten the product stage.
- explain: repeated parallel boundaries create a figure-inside-frame-inside-frame reading; the eye perceives the image surface before the product.
- judge: this matters because the opening proposition is “Se reconoce”; the first product should feel encountered, not merely catalogued.
- restraint: preserve the verified source image. Do not manufacture depth by changing bottle pixels, adding 3D, glow, fake reflection or generated scenery.

### `catalog-control`

- surface: `catalog / PDP`
- disposition: **PARK**
- decision: keep product presentation unchanged there so identity remains a stable comparison point.

## TARGET

**Home hero — Loewe 001 Man product stage.**

## ITERATION 1 — REJECTED

Intervention:

- one offset editorial plane behind the image field;
- slight desktop grid break;
- restrained cast shadow on the web image plane;
- metadata overlap/z-order strengthened;
- product source pixels untouched.

Technical workflows were green, but the perceptual result was **MIXED**. Desktop gained layering while the white wrapper still dominated; mobile delta was too small. The iteration was rejected rather than upgraded because it was merely newer.

## ITERATION 2 — FINAL ALLOWED ITERATION

Revised hypothesis:

> If the Home-only immersive hero stops imposing a white wrapper, matches its surrounding stage to the verified source's neutral field, and lets the unchanged source occupy more of the available area, the bottle will gain presence because one redundant visual plane disappears rather than because more decoration is added.

Implementation:

- only `mode="hero"` presentations explicitly requesting `bg-transparent` receive the immersive treatment;
- canonical card/PDP/catalog white stages remain unchanged;
- hero image visual area increases from 84% to 94% without cropping;
- redundant white wrapper becomes a neutral field close to the source packshot background;
- Iteration 1's restrained stage depth/metadata z-order remains;
- source URL and source pixels remain unchanged.

### Technical result

`OMNI Flat Image Stacked` run #6: **SUCCESS**.

Evidence artifact:

- ID `9374227514`
- digest `sha256:37d3d23f8631b1f565e6475f7b95623681592fcb275710d448d59679ba8e4c88`
- 12 focused Home/Catalog/Discovery/PDP × mobile/tablet/desktop comparisons passed.

### Perceptual result

**BETTER — INTERNALLY ACCEPTED.**

Desktop BEFORE reads as beige panel → white picture mount → gray source rectangle → bottle. AFTER suppresses the redundant white mount and lets the bottle/source plane occupy materially more of the hero field. The eye lands on Loewe before reading the picture frame.

Mobile now also shows a material delta: the bottle becomes larger and the stage reads as one quieter field rather than a small image inset inside a card. No crop, label loss, geometry drift or product-color manipulation is introduced.

Criterion verdicts:

- product presence: **BETTER**;
- figure/ground depth: **BETTER**;
- focal hierarchy: **BETTER**;
- mobile composition: **BETTER**;
- product identity/fidelity: **UNCHANGED / PASS**;
- Catalog/PDP control presentation: **UNCHANGED**;
- technical behavior: **PASS**.

No third iteration is permitted or justified.

## VERDICT

**INTERNAL FOUNDATIONAL VERDICT: BETTER / ACCEPTED ON ITERATION 2.**

Campaign-wide independent external perceptual review remains required before production consolidation.
