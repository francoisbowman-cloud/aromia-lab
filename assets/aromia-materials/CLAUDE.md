# Claude / Agent Instructions — Aromia Material Library

This directory is a governed reusable visual-material dataset. Treat it as data infrastructure, not a loose image folder.

## Canonical files

- `materials.csv` — human/agent-operable index and primary editing surface.
- `manifest.json` — machine-readable manifest and global policy.
- `schema.json` — row/record contract.
- `priority-backlog.json` — production priorities derived from Aromia catalog evidence.
- `files/` — approved web-ready binary assets.

## Required behavior

Before changing anything, read `README.md`, `materials.csv`, `schema.json`, and `priority-backlog.json`.

When adding or replacing a material:
1. Use a stable kebab-case `id`.
2. Add/replace `files/<id>.webp`.
3. Calculate the actual SHA-256 of the final binary.
4. Update `materials.csv` and `manifest.json` in the same PR.
5. Keep `canonical_product_identity=false` and `approved_for_product_identity=false` for ingredient/material assets.
6. Do not claim a perfume contains a material unless the perfume catalog provenance independently confirms that note.
7. Run the material-library validation workflow/tests.
8. Include visual evidence in the PR and state whether the asset is new, replacement, rejected, or deprecated.

## Authenticity gate

Reject assets with impossible anatomy, duplicated structures, malformed petals/seeds, plastic-looking texture, obvious cutout halos, physically implausible lighting, repeated generative patterns, or other artifacts that reduce trust.

Do not repair a fake/unbranded perfume bottle by inventing a logo. Product identity must come from canonical/verified product imagery. Materials in this library are atmospheric/editorial only.

For musk and other abstract, synthetic, or historically animal-associated notes, avoid misleading literal animal-origin imagery. Prefer an explicitly editorial abstraction or educational representation.

## Creative freedom

The library is vocabulary, not a template. Do not force materials into every composition. Use one or two meaningful assets when they improve narrative, materiality, or olfactory comprehension. Preserve Aromia's principle: repeat relationships, not layouts.
