# Aromia — Hybrid Signature Visual Contract v1

Status: implementation contract
Branch baseline: `feat/aromia-hybrid-signature-01`

## Thesis
Aromia is one visual system with three synchronized modes: Editorial, Discovery and Commerce. It must never read as a generic luxury ecommerce template.

## Core visual grammar
- Light: luminous ivory, warm paper, champagne/taupe, ink contrast, restrained gold.
- Dark: graphite/brown-black, warm smoke, controlled gold, specular depth — never flat black UI.
- Typography: display serif for emotion and hierarchy; sans for readable interface; tracked micro-labels for editorial metadata.
- Rules: thin hairlines, large whitespace, no pill-heavy UI, minimal radius, deliberate object framing.
- Motion: 200–500ms, subtle elevation/parallax only where it adds depth; reduced-motion always respected.

## Page roles
### Home — Experience / Desire
Ingredient-led hero, real catalog object, olfactive anchors, editorial chapters. Product appears as an object of desire, not a packshot tile.

### Catalog — Discovery / Clarity
Sticky filter rail, explicit neutral state, removable active filters, editorial product grid.

Filter reset contract:
1. Every select MUST have a neutral first option (`Todas...` / `Sin filtro`).
2. Every applied high-value filter MUST surface as a removable chip.
3. Global `Borrar filtros` MUST remain visible when filters exist.
4. Empty result state MUST offer `Ver colección completa`.

### Product — Conviction
Large object-led spread followed by Commerce → Performance/Skin → Editorial Context → Community. Product image remains truthful to source photography.

### Magazine — Authority
Cover-story rhythm and magazine composition, then related stories. Editorial authority must visually belong to the same Aromia system as commerce.

## Component rules
- Buttons: primary gold/ink, secondary hairline, tertiary text-link.
- Product cards: 4:5 image field, restrained border, editorial family label, clean price/action footer.
- Dropdowns: explicit reset state; no dead-end preselected option.
- Chips: removable filters only; do not use chips as decoration.
- Focus: visible gold/ink focus treatment.
- Light/Dark: one hierarchy, two art directions; never duplicate page structure.

## Acceptance gate
A screen passes only if:
1. It is recognizable as Aromia without relying on the logo.
2. It preserves truthful catalog/product data.
3. It does not look like a generic component library.
4. Navigation and filter reset are obvious.
5. Light and Dark retain equivalent hierarchy and conversion clarity.
6. Mobile keeps the editorial intent rather than collapsing into anonymous stacked cards.
