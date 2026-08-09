# Candidate Discovery / Sourcing Engine — Económico 001

Generated 2026-08-09 from the current published 50-product proxy and the official-source seed pool in `catalog/sourcing/pool-economico-001.csv`.

## Targets

| Priority | Dimension | Target | Candidates in pool | Satisfied |
|---:|---|---|---:|---|
| 100 | price_segment | económico | 6 | yes |
| 64 | gender | unisex | 3 | yes |
| 55 | gender | femenino | 2 | yes |

The primary structural gap identified by Expansion Engine v0.2.0 (`económico = 0`) now has a source-backed candidate pool instead of remaining an abstract sourcing directive.

## Selected queue

| Rank | Candidate | Gender | Score | Source quality |
|---:|---|---|---:|---|
| 1 | Jovan — I Want You to Want Me EDP | unisex | 75 | official Coty / high |
| 2 | Zara — Golden Decade EDP | femenino | 69 | official Zara / high |
| 3 | Zara — Red Zara Temptation EDP | femenino | 59 | official Zara / high |
| 4 | Jovan — Make Them Talk EDP | unisex | 55 | official Coty / high |
| 5 | Jovan — Skin I'm In EDP | unisex | 43 | official Coty / high |
| 6 | Zara — Vibrant Leather EDP | masculino | 43 | official Zara / high |

All 6 candidates passed identity, dedupe and provenance gates in the CI smoke. No candidate is published by this step.

## Source observations

- Zara official US pages show the selected standalone fragrances at regular reference prices between USD 39.90 and below; gender placement is supported by Zara's men's/women's fragrance indexes.
- Coty's official JOVAN launch release identifies the three selected scents as a unisex musk Eau de Parfum collection and documents 100 ml reference prices from USD 24.99 to 29.99.
- The `económico` classification here follows `catalog/sourcing/SOURCING_POLICY.md`: official standalone US reference price <= USD 50 is a discovery targeting rule, not a permanent production merchandising rule.

## Next directive

Expand the candidate pool beyond two brands while maintaining Tier 1 provenance. The next sourcing pass should aim for at least 15 economical candidates across 5+ brands, with emphasis on unisex and underrepresented olfactive families. Only after that broader pool is scored should a batch be promoted into the normal validate → normalize → dedupe → diff → prepare workflow.
