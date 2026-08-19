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
- severity: **P4 / control**
- disposition: **PARK**
- decision: keep product presentation unchanged there so identity remains a stable comparison point.

## TARGET

**Home hero — Loewe 001 Man product stage.**

## DIAGNOSE

The defect is compositional depth, not image quality. The source image can remain untouched while the web layout changes the relationship between the image plane, its surrounding field and the metadata block.

## CREATIVE HYPOTHESIS

> If the verified Loewe image plane is allowed to break the right-column grid slightly, receives one restrained cast plane behind it, and its metadata overlaps that stage with clearer z-order, the hero can gain presence without altering a single product pixel.

Expected delta:

- product presence: BETTER;
- figure/ground depth: BETTER;
- first-viewport memorability: BETTER;
- product fidelity: unchanged;
- catalog/PDP controls: unchanged;
- mobile safety: unchanged or better.

## ITERATION 1 PLAN

Change only the Home hero stage in `TasteLanding`:

1. introduce one offset editorial plane behind the image field;
2. let the image stage break leftward slightly on large screens;
3. add a restrained cast shadow to the image plane, not to the bottle pixels;
4. increase metadata overlap/z-order so text and product occupy distinct layers;
5. leave mobile composition conservative.

Reject if the result looks like a floating card, creates ornamental luxury effects, compromises readability, or makes the source image less faithful.
