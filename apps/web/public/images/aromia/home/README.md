# Aromia Home — production visual assets

This directory is reserved for approved Home assets from the Visual & Conversion Upgrade.

Source of truth for art direction:
`docs/design/visual-upgrade/HOME-ART-DIRECTION-CONTRACT.md`

Do not place exploratory generations here. Only assets that passed the Home asset acceptance gate belong in this directory.

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

Until these files exist and pass visual QA, the CSS classes in `apps/web/src/app/globals.css` remain the production-safe fallback:

- `.aromia-scene-macro` → H01
- `.aromia-scene-reveal` → H02
- `.aromia-scene-editorial` → H03 fallback

Do not reference missing files from CSS. Add the real asset only after the corresponding file is committed so a branch never ships deliberate 404 image requests.

## Responsive anchor QA

After H01 is committed, recalibrate the anchor coordinates in:
`apps/web/src/components/home/HomeHero.tsx`

Default policy:
- desktop: up to 4 labels;
- mobile: 2 labels unless the approved crop safely supports more;
- anchors must point to visible ingredient/material features, never approximate empty space.
