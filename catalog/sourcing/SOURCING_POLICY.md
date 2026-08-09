# Aromia Catalog Sourcing Policy v1

## Goal

Turn Catalog Expansion Engine gaps into reproducible candidate-discovery directives. Sourcing proposes candidates; it never writes production and never bypasses validation, dedupe, provenance or approval gates.

## Source hierarchy

1. **Tier 1 — official product/brand source.** Brand product page, brand catalog, or manufacturer press release. Preferred for identity, concentration, notes and current reference price.
2. **Tier 2 — authorized retailer / reputable specialist source.** Used only to fill fields the official source does not publish. Must remain separately traceable in `source_url`.
3. **Tier 3 — discovery-only source.** Search/index pages may identify a candidate but cannot by themselves make it stage-ready.

A candidate without at least one valid source URL is blocked by the Expansion Engine. No field may be invented to improve a score.

## Price-gap sourcing rule

The current published proxy has zero `económico` coverage. For **candidate discovery only**, an official US retail reference price of **USD 50 or less for a standalone fragrance SKU** qualifies the candidate for the `económico` sourcing target. This is an operational discovery threshold, not a permanent merchandising price rule; downstream review may reclassify the production segment.

Bundle/set prices are excluded from this rule. Temporary sale prices do not qualify when a regular price is available.

## Diversity guardrails

A sourcing batch should not close one gap by creating another concentration of the catalog. The planner therefore prioritizes:

- zero-coverage price segments first;
- underrepresented gender distribution next;
- new or underrepresented brands/families after that;
- provenance strength before recency or popularity.

No brand receives a manual bonus. Variant identity remains `brand + base name + concentration`.

## Confidence

- `high`: Tier 1 source directly supports identity and the fields used for selection.
- `medium`: identity is Tier 1, but one or more noncritical fields rely on Tier 2 or remain pending.
- `low`: discovery-only; should not enter an automated selection queue.

## Current directive

As of 2026-08-09, the first sourcing objective is to create verified `económico` candidates because Batch 002 contained none. Initial official-source seeds are stored in `catalog/sourcing/pool-economico-001.csv`.
