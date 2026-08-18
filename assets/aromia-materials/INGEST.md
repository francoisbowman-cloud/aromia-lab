# Binary ingest — Aromia Material Library

The metadata in this directory is canonical in GitHub. Binary assets live at `assets/aromia-materials/files/` once ingested.

## Current collaboration bundle

- Variant: `web-collaboration-384`
- 28 transparent WebP assets
- Expected bundle SHA-256: `1e6d19770b9a916da4a7323ee1422ff80f4e073ada4bf4a17ed1e41b10df8b57`
- Expected destination: `assets/aromia-materials/files/`

## Ingest procedure

1. Obtain the approved collaboration bundle from the project owner or an approved project artifact.
2. Verify the ZIP SHA-256 before extraction.
3. Extract only the `.webp` files into `assets/aromia-materials/files/` without renaming them.
4. Run:

```bash
node scripts/materials/validate-material-library.mjs --require-binaries
```

5. The command must report all 28 binaries verified and zero missing files.
6. Commit the binaries together with any corresponding CSV/manifest changes in a dedicated branch and open a PR.

## Replacing one asset

If a collaborator replaces an asset, the old hash must never be silently reused. Recompute SHA-256 and byte size from the final WebP, update both `materials.csv` and `manifest.json`, keep the same stable `id` unless the semantic material itself changes, and run the strict binary gate.

## Why binaries are separate from metadata validation

Agents can safely work on categories, policy, provenance rules and backlog without downloading every image. Release/integration work uses `--require-binaries`, which turns missing files or hash mismatches into hard failures.

## Safety

Never ingest a perfume packshot into this directory. This library contains materials/ingredients only. Product identity imagery belongs to the canonical product-image pipeline and has a separate fidelity gate.
