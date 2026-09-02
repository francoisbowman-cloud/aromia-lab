# Aromia — Editorial Source Sharpness Fix — 2026-09-02

STATUS: LIVE

## Publisher evidence

After Editorial v1 photography was restored, the Publisher still perceived the active Home/story images as blurred.

## Diagnosis

The web layer was not the root cause. OMNI/Chromium evidence showed Next/Image serving appropriately sized optimized variants, while the three original interpretive hero JPEGs were comparatively small and visibly soft source material. Increasing `quality`, adding CSS sharpening or upscaling could not recreate missing source detail.

Affected active sources before this fix:

- `amouage-mineral-density-01.jpg`
- `ambroxan-resin-abstract-01.jpg`
- `ropion-bordeaux-texture-01.jpg`

The correction therefore follows the existing Aromia rule: **replace a weak source; do not hide photography and do not fake sharpness.**

## Production correction

PR #130 — `Replace soft Editorial v1 hero sources with crisp photography`

Merged commit:

`ac05d897685736a0e6035946b51611b91c70a4a5`

Active hero sources now are:

- Sultan/Home → existing high-resolution `oman-place-documentary.jpg` (Jabal Akhdar, Oman; Ontheroadom, CC BY-SA 4.0)
- Ambroxan → existing high-resolution `clary-sage-documentary.jpg` (Salvia sclarea; Llez, CC BY-SA 3.0 / GFDL)
- Ropion → high-resolution `Blood-red rose up close (Unsplash).jpg` from Wikimedia Commons (Jez Timms, CC0 1.0)

The three earlier soft interpretive files remain in the repository only for traceability and are no longer referenced by the active hero slots.

`apps/web/next.config.mjs` now permits verified image optimization from `upload.wikimedia.org` for the Ropion photograph.

## Verification

PR #130 checks:

- Aromia Strict Audit: SUCCESS
- v2.0 CI: SUCCESS
- tests/lint/typecheck/production build: SUCCESS

Railway production deployment:

`114b2b90-6e8e-4d7c-a4dc-62cd305cd29f` — SUCCESS

Source commit:

`ac05d897685736a0e6035946b51611b91c70a4a5`

Production build compiled successfully and generated 29/29 static pages.

## OMNI follow-up

Focused OMNI Render QA deployment:

`3c184d9c-ffa1-4b6a-acf9-89e3db471c2a`

The new photographic sources load at appropriate responsive resolutions and no browser/runtime error indicates image softness or insufficient source resolution.

OMNI does flag `cropped_subject` on the Oman landscape and red rose because Editorial v1 intentionally uses `object-fit: cover`. This is a crop/composition heuristic, not a blur finding. It must not be “fixed” by switching to `contain` and breaking the approved editorial field without visual evidence that the crop itself is poor.

The documentary Salvia route and El Coleccionista pass the focused technical gate. The Sultan/Home and Ropion surfaces require only crop interpretation; their original source-softness issue is removed from the active publication path.

## Operational rule

Do not reactivate the three soft interpretive rasters. Do not apply artificial sharpening or generative upscaling merely to preserve them. Future visual refinement should start from sharp, rights-cleared source photography and use editorial crop/art direction intentionally.

Cowork's 100-article editorial production is concurrent and was not modified by this visual correction.
