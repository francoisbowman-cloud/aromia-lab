# Aromia Home — production visual assets

This directory is reserved for approved Home assets from the Visual & Conversion Upgrade.

Source of truth for art direction:
`docs/design/visual-upgrade/HOME-ART-DIRECTION-CONTRACT.md`

Do not place exploratory generations here. Only assets that passed the Home asset acceptance gate belong in this directory.

## Current provisional photographic layer

To avoid blocking implementation while H01/H02 bespoke photography is still pending, Home currently reuses editorial masters that already belong to the Aromia repository:

- H01 Light provisional: `/editorial/bright-soft-focus.png`
- H01 Dark provisional: `/editorial/moody-closeup.png`
- H02 Light provisional: `/editorial/sunlit-warm.png`
- H02 Dark provisional: `/editorial/cinematic-warm.png`

These are **not automatically approved as final H01/H02 masters**. They provide real photographic texture for preview and responsive QA while the procedural CSS scene remains underneath as fallback.

Important: H01 final approval still requires visible ingredient/material anchors that genuinely correspond to the UI labels. If the provisional photography does not satisfy the bergamot / ambergris-accord / cognac-leather / orange-blossom map, keep it only as a preview master and replace it with a bespoke H01 asset before declaring the photographic gate final.

## Approved slot names

### H01 — Sensory Hero

- `h01-sensory-hero-light.webp`
- `h01-sensory-hero-dark.webp`

Role: first impression / sensory discovery.

Requirements:
- ingredients physically present: bergamot, ambergris accord treatment, cognac leather, orange blossom;
- bottle must not be the protagonist;
- lower-left / lower-center copy-safe zone;
- desktop master must survive a mobile portrait crop;
- no baked-in text or Aromia logo.

### H02 — Product Reveal

- `h02-product-reveal-light.webp`
- `h02-product-reveal-dark.webp`

Role: matter → identity → object.

Requirements:
- same visual universe as H01;
- bottle enters as culmination and sits away from the left copy-safe zone;
- ingredients remain visible enough to preserve continuity;
- no generic pedestal-ad composition.

### H03 — Magazine fallback only

- `h03-magazine-fallback.webp`

Home should prefer the actual article `imagen_portada_url` when it meets the visual standard. This local file is only a curated fallback, not a replacement for article-specific editorial imagery.

## Delivery format

Preferred production format: WebP.

Recommended source master:
- landscape: minimum 2400×1600;
- validate mobile crop at 1080×1440 equivalent;
- retain a high-quality archival master outside the web runtime if available.

Do not optimize so aggressively that glass edges, ingredient texture, grain or shadow gradients band visibly.

## Integration rule

The CSS classes in `apps/web/src/app/globals.css` remain production-safe fallback/loading layers even while provisional or final photography is present:

- `.aromia-scene-macro` → H01
- `.aromia-scene-reveal` → H02
- `.aromia-scene-editorial` → H03 fallback

Final bespoke assets should replace only the image layer, not remove the fallback until loading/error behavior is visually verified.

## Responsive anchor QA

After H01 final is committed, recalibrate the anchor coordinates in:
`apps/web/src/components/home/HomeHero.tsx`

Default policy:
- desktop (`lg` and above): up to 4 labels;
- tablet and mobile: 2 labels by default to protect hierarchy and crop safety;
- anchors must point to visible ingredient/material features, never approximate empty space.
