# Catalog image review manifest — evidence contract

This module extends `scripts/image-quality-monitor.mjs`. It emits a stable, **read-only** review queue that a human or future authorized visual reviewer can use. It does not inspect pixels, scrape Amazon, query an image model, acquire rights, approve a packshot, replace an asset, or modify the catalog.

## Running

```sh
node --test scripts/image-quality-monitor.test.mjs scripts/catalog-image-review.test.mjs
node scripts/image-quality-monitor.mjs > image-quality-signals.json
# Optional: JSON array exported from an approved catalog snapshot, with provenance recorded externally
node scripts/image-quality-monitor.mjs path/to/catalog-snapshot.json > review-output.json
```

The default data source is `PERFUMES_INITIAL_50.csv`, an **historical fixture**, not evidence of the live production catalog. An explicitly supplied JSON array is also accepted; the CLI does not fetch production data. GitHub Actions uploads its output as `image-quality-signals`.

## Fields and interpretation

- `findings` are deterministic **signals**: missing image URL; exact shared URL; explicitly incompatible EDT / EDP product-name and metadata; and the known ambiguous Chance Eau Tendre special case.
- `reviewQueue` includes *every* input product, not only those with signals. Catalog name, brand and concentration are **unverified declarations**. A URL identifies the current claimed resource, **not** its actual depicted bottle or its license.
- `priority`: `high` for missing images or concentration ambiguity/conflict, `medium` for other detected signals such as shared URLs, `standard` for items with no technical alerts.
- `identity`, `imageRights`, `visualQuality`: always `unverified`. No consumer may interpret an empty signals list as visual/rights approval.
- `reviewSummary` counts queue priority and keeps certified identity/rights/visual counts at **zero**. This schema does not import prior approvals.
- `feedback` keeps the Publisher's rejected bergamot asset pinned to its hash. A modified file remains pending manual review; it does not resolve the rejection.
- `publication: blocked` is an explicit gate. This output is not authority to publish, replace images, or run paid services.

## Norma vinculante de fidelidad al producto

El Publisher exige que **etiquetas, textos, logotipos, geometría, color, dimensiones y elementos distintivos correspondan al producto comercial real**. Una imagen extraordinaria estéticamente sigue siendo inaceptable si representa un producto incorrecto. No intercambiar concentraciones, flankers, capacidades o ediciones. El gate operativo, matriz de ocho campos y política de evidencia están en [PRODUCT-IDENTITY-FIDELITY.md](PRODUCT-IDENTITY-FIDELITY.md). La ausencia de diferencias detectadas automáticamente nunca certifica la identidad.

## Next evidence gate

For each item, an independent reviewer must inspect actual rendered images and confirm exact perfume **brand, name, concentration, flanker and packaging**, plus source rights, editorial quality and responsive rendering. A later audited review/approval contract must bind that verdict to product identity, resource digest and reviewer authority; do not infer approval from a filename, slug, URL, or a different image. The bergamot art-direction capsule requires a separately approved candidate.

## Signed review evidence (next tranche)

The optional `scripts/catalog-image-review-evidence.mjs` adds an **isolated, testable review-record contract**, without exposing an endpoint or writing to any product. A reviewer must provide a SHA-256 digest of the actual image **bytes** (a URL hash is not sufficient). The `imageReviewFingerprint(item, imageSha256)` binds this to the exact slug, brand, product name, declared concentration and image URL. Changing any field, including the remote image bytes behind an unchanged URL, invalidates the prior review.

A receipt includes `reviewId`, `fingerprint`, `reviewer`, `decision` (approved/rejected), `identityEvidence`, `rightsEvidence`, `visualEvidence`, and `reviewedAt`. A separate, protected review credential signs these fields with HMAC-SHA256. A missing/altered signature or mismatched fingerprint is rejected. **Do not commit the secret or store receipts in public CI artifacts.** Signature verification proves credential possession and record integrity, not that the evidence statements are true or that the named reviewer is a verified person.

`assessImageReview` reports `authenticated_review_recorded` or `authenticated_rejection_recorded` as evidence states. It **always returns `publishAllowed: false`**, including for authenticated approvals. This is intentionally *not* a publishing authorization or a production-ready reviewer workflow. A future authenticated server-side process must validate human identity and roles, evidence sources, revocation, immutable storage, content rights, and exact bytes before accepting approval; until then no data or assets change in Aromia.

This module is imported by its regression tests only: the read-only queue and historical fixture remain unchanged, and no mock review has been installed as a real approval.

## Private local reviewer — operator tranche

Run `node scripts/private-image-review-operator.mjs image-quality-signals.json /private/location/review-receipts.json` in an authorized local operator environment. The second input must be a JSON object containing `{"reviews":[{"slug":"...","receipt":{...}}]}`. Set `IMAGE_REVIEW_HMAC_KEY` through the local environment or secret manager **only**, never in a repository, CLI argument, artifact or browser. The review credential is distinct from the editorial publishing credential. This utility only **verifies** externally prepared receipts; it never self-issues/signs an approval, impersonates a human or changes the catalogue.

For now, this operator can verify image bytes only for canonical images already staged under `apps/web/public` with image URLs like `/assets/bottle.webp`. URLs on Amazon or other external hosts are **explicitly deferred** as `remote_or_unsupported_image_requires_capture`. The operator does not scrape, download, infer product identity, or accept an arbitrary local file mapped to an external URL. Exact image bytes, identity, provenance and permissions still require separate factual/human evaluation. Its JSON output contains only status, digest-bound fingerprint and counts; `publication` and every `publishAllowed` remain blocked.

This is a private **local inspection step**, not a public or admin API, stored review decision, server authentication workflow, or editorial authorization. Existing `intelligenceRouter` and `EDITORIAL_REVIEW_TOKEN` remain unchanged; do not conflate visual HMAC receipt integrity with the publisher's editorial review or release approval.

### Curated external inputs

Any future YouTube/channel source registry must begin empty. **The Publisher selects every channel**. Do not auto-enroll recommendations, channels returned by search, subscriptions, adjacent videos or suggested creators. YouTube-source retrieval, when implemented, needs a separate access/rights and factual-verification policy and must not affect image approvals.
