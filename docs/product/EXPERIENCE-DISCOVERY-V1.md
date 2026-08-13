# Aromia — Experience & Discovery v2

## Product contract

Discovery v2 turns Aromia into a learning, explainable exploration system while preserving catalog identity, sourcing and Fase 3 boundaries. Personalization changes ordering and continuation paths only; it never mutates product facts.

## Shipped value streams

1. **PDP continuation** — deterministic similarity is re-ranked by the local olfactory map while preserving original similarity evidence.
2. **Catalog discovery** — search covers perfume, brand, family and notes; filters and mobile collapse behavior remain intact.
3. **Quiz → profile** — Quiz completion writes strong family/profile signals into the local discovery map.
4. **PDP → profile** — viewing a PDP adds bounded perfume, family and verified-note signals.
5. **Perfumers as graph nodes** — reviewed attribution only; PDP links to perfumers, perfumer pages expose works and personalized continuation.
6. **Notes as graph nodes** — verified notes link into `/buscar?q=...`.
7. **Editorial bridge** — Magazine relationships remain grounded in `perfumes_relacionados`; related perfumes contribute only weak signals.
8. **Personal olfactory map** — `/descubrir` summarizes top families, notes and perfumers and shows live recommendations.
9. **Global discovery** — `/buscar` supports deep-linked terms and uses the profile only as a re-ranker after text relevance.
10. **Comparison** — remains descriptive and source-preserving.

## Discovery graph

`Home / Quiz / Search → Family or Note → Perfume → PDP → Perfumista → Other Works → Magazine → Related Perfumes → Personalized Continuation`

The graph uses only published perfume attributes, reviewed perfumer attribution and `perfumes_relacionados`. No inferred authorship or invented content relationship is allowed.

## Personalization model

The local profile stores bounded numeric weights for families, notes, reviewed perfumers, viewed perfume slugs and completed quiz profile slugs. Ranking is deterministic: family affinity, note overlap and perfumer affinity add score; previously viewed products receive a bounded penalty; PDP context retains its deterministic similarity score. Reasons remain visible.

## Privacy contract

The olfactory map is stored under `aromia.discovery.profile.v2` in browser `localStorage`. It contains categorical/slugs and numeric weights only. It does not store email, account identity, raw search strings or free text. Search analytics continue to send query length and result counts instead of the raw term.

## QA and release gate

A release is acceptable only when:

- discovery profile and personalized ranking tests pass;
- web lint, typecheck and production build pass;
- Aromia Strict Audit verifies persistence, reset, Quiz learning, PDP learning, traversable notes, perfumer learning, editorial signals and personalized continuation;
- no migration, catalog expansion or Fase 3 files are modified;
- PDP SEO/JSON-LD and affiliate exits remain intact;
- mobile filters remain collapsible;
- `/catalogo`, representative PDP, `/quiz`, `/buscar?q=vetiver`, `/descubrir`, `/perfumistas`, representative perfumer, `/comparar`, `/magazine` and a representative article are verified after deployment.

## Explicit non-goals

Discovery v2 does not create perfume rows, migrations, source evidence, inferred perfumer credits, server-side user profiles, account requirements or Fase 3 automation changes.
