# Aromia — Experience & Discovery v1

## Product contract

This release turns existing catalog, PDP, Quiz and Magazine surfaces into a connected discovery system without changing catalog identity, sourcing, scoring ownership or Fase 3 automation.

## Shipped value streams

1. **PDP continuation** — deterministic similarity derived from published family, notes, occasion, season, gender, type, price category and concentration. Six ranked alternatives expose concise reasons and can continue to a PDP or a side-by-side comparison.
2. **Catalog discovery** — search includes perfume, brand, family and notes; filters include family, category, gender, occasion, price and niche/commercial; sorting supports relevance, rating, price and name. Every select has an explicit `—` reset state.
3. **Quiz personalization** — quiz profile remains the stable interpretation layer, but recommendation ranking is recalculated against the currently published catalog instead of fixed aspirational/accessible buckets.
4. **Editorial bridge** — Magazine → PDP uses `content_to_product`; PDP → Magazine uses the existing `perfumes_relacionados` relationship and `product_to_content`.
5. **Global discovery** — `/buscar` searches catalog and Magazine from one entry point without persisting raw terms.
6. **Comparison** — `/comparar?perfumes=slug-a,slug-b` presents published attributes side by side and never invents missing values.
7. **Measurement** — event taxonomy and KPI definitions live in `GROWTH-MEASUREMENT-V1.md`.

## Similarity rules

The engine is deterministic, explainable and source-preserving. Maximum score is 100: family 32, note overlap up to 30, occasion up to 12, season up to 8, gender 5, niche/commercial 5, price category 4, concentration 4. Results with zero evidence are excluded. Ties are resolved alphabetically for stable rendering.

This is a discovery ranking, not a claim of objective olfactory equivalence.

## Privacy contract

Discovery analytics sends slugs, categorical context, positions, scores and result counts. Global/catalog search sends query length rather than the raw user-entered term. Existing email/PII prohibition remains unchanged. GDPR/GA consent remains a separate product/legal decision.

## QA and release gate

A release is acceptable only when:

- discovery and quiz ranking unit tests pass;
- web typecheck/build and repository CI pass;
- Aromia Strict Audit remains green;
- no migration, catalog expansion or Fase 3 files are modified by this feature branch;
- PDP SEO/JSON-LD and affiliate exits remain intact;
- light/dark rendering remains token-compatible;
- `/catalogo`, representative `/catalogo/[slug]`, `/quiz`, `/buscar`, `/comparar`, `/magazine` and a representative article are verified after production deployment.

## Primary success metrics

- Discovery interaction rate.
- Similarity continuation rate.
- Comparison start rate.
- Quiz completion and result-to-PDP progression.
- Magazine → PDP and PDP → Magazine continuation.
- Affiliate progression after a discovery interaction versus sessions without one.

## Explicit non-goals

No new perfume rows, migrations, source evidence, catalog confidence changes, affiliate provider changes, consent framework changes or Fase 3 automation changes are part of Experience & Discovery v1.
