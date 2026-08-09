# Aromia — Mockup Fidelity Final

Status: implementation candidate for final Home approval.

## Target
Translate the approved luminous luxury mockup into real production code with high visual fidelity while preserving real Aromia data, routes and behavior.

## Implemented
- Header/navigation simplified and aligned to the mockup language.
- Home Hero stripped of floating note labels and anonymous AI-scene treatment.
- Real catalog product image is the primary hero object when available.
- Featured editorial fragrance uses a three-column composition: editorial copy / real object / olfactive + commercial detail.
- Discovery row reduced to five premium olfactive families.
- Home catalog preview uses real product imagery and explicit neutral filter state (`Todas las familias`).
- Journal strip uses real article data and cover art when available.
- Benefit strip uses Aromia-accurate promises only; no invented checkout, shipping or payment capabilities.
- Light/Dark remain one design system.

## Guardrails
- No floating hero notes.
- No anonymous AI perfume bottle backgrounds.
- No fake product brands or prices.
- No new dependency.
- No catalog-pipeline, GDPR/GA or npm-audit changes mixed into this pass.

## Gate
Merge only after GitHub CI and Railway preview are green.
