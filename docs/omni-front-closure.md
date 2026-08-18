# OMNI — Product Front Closure

This document records the non-production closure criteria for the current Aromia evolution program.

## Fronts

1. **Visual coherence / UX** — proven in PR #74 by integrated before/after render evidence at mobile/tablet/desktop plus strict audit, image fidelity and standard CI.
2. **Material library / image vocabulary** — governed in PR #75 through CSV, manifest, schema, aliases, Claude contract, backlog and CI. Binary release remains subject to strict hash verification.
3. **Product-image identity** — catalog renderer preserves white product stage and known identity outliers use verified product sources; Acqua di Giò has a dedicated fidelity workflow.
4. **Discovery / Quiz / cross-navigation** — existing personalization remains local-first; canonical interaction events now cover perfumer, note, olfactory-stage, similar-perfume and quiz-progress journeys.
5. **SEO / authorship** — PDP Product structured data already exists; perfumer pages now add canonical metadata and conservative Person JSON-LD using only existing reviewed profile data.
6. **Analytics / commercial trust** — canonical event taxonomy is documented; commercial actions remain non-blocking and PII-free by contract.

## Release boundary

Closing a front means implementation + automated evidence are ready for review. It does **not** mean production deployment or merge authorization. Production stays untouched until explicit approval.

## Catalog expansion boundary

The planned move toward 500 perfumes begins only after these fronts are reviewed as a coherent baseline. Expansion must preserve provenance, identity matching, duplicate/variant gates and product-image fidelity; volume alone is not a success criterion.
