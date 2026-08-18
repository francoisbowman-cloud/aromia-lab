# Binary ingest — Aromia Material Library

The metadata in this directory is canonical in GitHub. Binary assets live at `assets/aromia-materials/files/` once ingested.

## Current collaboration bundle

- Artifact: `AROMIA_MATERIAL_LIBRARY_COLLAB_V1.zip`
- Variant: `web-collaboration-384`
- 28 transparent WebP assets
- ZIP size: `1,140,580` bytes
- Verified ZIP SHA-256: `60db653b0c822ada512dcf31ee78d9eb243cfe070384baa137a7fcc7cc782257`
- Expected destination: `assets/aromia-materials/files/`
- Per-file SHA-256 and byte sizes are authoritative in `manifest.json`.

A local integrity pass verified all 28 files in this bundle against the individual hashes and byte sizes recorded in the manifest: 28 matched, 0 mismatches.

## Ingest procedure

1. Obtain `AROMIA_MATERIAL_LIBRARY_COLLAB_V1.zip` from the approved project handoff/artifact.
2. Verify the ZIP SHA-256 above before extraction.
3. Extract only the `.webp` files into `assets/aromia-materials/files/` without renaming them.
4. Run:

```bash
node scripts/materials/validate-material-library.mjs --require-binaries
```

5. The command must report all 28 binaries verified and zero missing files.
6. Commit the binaries together with any corresponding metadata changes in a dedicated branch and open a PR.

## Replacing one asset

If a collaborator replaces an asset, the old hash must never be silently reused. Recompute SHA-256 and byte size from the final WebP, update `manifest.json`, keep the same stable `id` unless the semantic material itself changes, and run the strict binary gate. Keep the simple CSV index synchronized if identity/category/file/status changes.

## Why binaries are separate from metadata validation

Agents can safely work on categories, policy, provenance rules and backlog without downloading every image. Release/integration work uses `--require-binaries`, which turns missing files or hash mismatches into hard failures.

## Safety

Never ingest a perfume packshot into this directory. This library contains materials/ingredients only. Product identity imagery belongs to the canonical product-image pipeline and has a separate fidelity gate.
