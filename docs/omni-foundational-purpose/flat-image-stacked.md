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

## ITERATION 1

Intervention:

- one offset editorial plane behind the image field;
- slight desktop grid break;
- restrained cast shadow on the web image plane;
- metadata overlap/z-order strengthened;
- product source pixels untouched.

### Technical result

Both benchmark workflows finished **SUCCESS**.

### Perceptual result

**MIXED — REJECTED.**

Desktop gains some layering, but the white image field remains visually dominant and the bottle still reads as content inside a frame. Mobile changes are too small to qualify as a material improvement. The intervention is technically sound and directionally correct, but it does not satisfy the founding brief strongly enough.

This attempt remains recorded rather than being upgraded to PASS because it is merely newer.

## ITERATION 2 — FINAL ALLOWED ITERATION

Revised diagnosis:

The first attempt added z-depth without sufficiently removing the original planar framing. The main cause therefore remains: a white product wrapper surrounding a gray source field keeps the viewer aware of two image planes before reading the bottle.

### Revised hypothesis

> If the Home-only immersive hero stops imposing a white wrapper, matches its surrounding stage to the verified source's neutral field, and lets the unchanged source occupy more of the available area, the bottle will gain presence because one redundant visual plane disappears rather than because more decoration is added.

Iteration 2 constraints:

1. only hero presentations explicitly requesting `bg-transparent` may receive this immersive treatment;
2. Catalog and PDP remain canonical white-stage controls;
3. source image URL and source pixels remain unchanged;
4. hero image maximum visual area may increase from 84% to 94%, without cropping;
5. wrapper field changes to a neutral gray close to the packshot background, reducing the nested-frame effect;
6. no new blur, glow, 3D, reflection or generated image;
7. reject if product identity, contrast, mobile composition or technical gates regress.
