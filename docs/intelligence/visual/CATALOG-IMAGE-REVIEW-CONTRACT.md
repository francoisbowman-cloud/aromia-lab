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

## Next evidence gate

For each item, an independent reviewer must inspect actual rendered images and confirm exact perfume **brand, name, concentration, flanker and packaging**, plus source rights, editorial quality and responsive rendering. A later audited review/approval contract must bind that verdict to product identity, resource digest and reviewer authority; do not infer approval from a filename, slug, URL, or a different image. The bergamot art-direction capsule requires a separately approved candidate.
