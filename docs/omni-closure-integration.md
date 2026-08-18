# OMNI Aromia — Closure Integration

This branch is the conflict-safe integration of the current Aromia evolution fronts. It is intentionally based on the visually accepted PR #74 head and then ports the non-visual work from PR #76 plus the governed metadata/tooling from PR #75.

## Source precedence

1. **Visual markup, typography, spacing, interaction targets and line reduction:** PR #74 is authoritative.
2. **Analytics handlers/event taxonomy and perfumer SEO:** PR #76 is authoritative only for behavior/data additions; it must not restore pre-#74 visual classes.
3. **Material-library metadata, policy and validation:** PR #75 is authoritative.
4. **Product data/provenance:** current `main` remains authoritative; this integration does not invent or overwrite catalog facts.

## Resolved overlaps

The following files changed independently in #74 and #76 and were manually reconciled here instead of being merged mechanically:

- `apps/web/src/components/discovery/DiscoveryDashboard.tsx`
- `apps/web/src/components/perfume/HeroHeader.tsx`
- `apps/web/src/components/perfume/SimilarPerfumes.tsx`
- `apps/web/src/components/perfume/SkinEvolution.tsx`

Resolution rule: preserve #74's accepted visual/accessibility state and add only #76's event tracking/behavior. Any future conflict resolution that reintroduces 8–11px utility text, undersized targets, ornamental divider grids, or the old `similar_clicked` event is a regression.

## Material-library binary boundary

Metadata and collaboration tooling are repository-native. The current portable binary artifact is `AROMIA_MATERIAL_LIBRARY_COLLAB_V1.zip`; its verified identity is recorded in `assets/aromia-materials/bundle-integrity.json`. The 28 WebP files have been verified locally against the per-file manifest hashes, but they are not represented as repository-hosted binaries until a connector capable of binary ingest is used. Do not create a paid service merely to bridge this tooling limitation.

## Closure gate

This integration is accepted only when the combined branch passes:

- v2.0 CI
- Aromia Strict Audit
- OMNI Integrated Render Gate
- OMNI Product Image Fidelity
- Material Library CI

No production deployment or merge is implied by PASS.
