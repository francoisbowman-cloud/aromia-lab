# Aromia — Hybrid Signature Visual Contract v1

Hybrid Signature is the production visual contract for Aromia across Home, Catalog, Product Detail and Magazine.

## Baseline

- Current source baseline: `main@e3d121d8f483a0f6b5bd783520525d44ce6e688e`
- Catalog/data contracts from main remain source of truth.
- Hybrid Signature changes presentation and interaction without weakening nullable/pending catalog safeguards.

## Core visual language

- One system across editorial, discovery and commerce.
- Light mode: luminous ivory, parchment, warm stone, champagne and restrained gold.
- Dark mode: graphite, warm black, reflected amber and controlled gold.
- Typography: display serif for desire/authority, sans for readable product information, Plex micro-labels for editorial metadata.
- Surfaces should feel like spreads, objects and chapters rather than generic UI cards.
- Dividers, numbering, micro-labels and whitespace establish rhythm.
- Motion remains subtle, native and reduced-motion aware.

## Home

- Hero is object-led and clean: no floating olfactive labels over headline/content.
- Anonymous AI-style editorial backgrounds are not used as the hero protagonist.
- The hero uses the real catalog product image when available, composed over controlled material/light fields.
- Featured selection, ecosystem, olfactive index, reveal, Magazine, Quiz and Club share one visual cadence.
- Abrupt section breaks are avoided; Light stays predominantly luminous.

## Catalog

- Catalog is a premium discovery surface, not a utility grid.
- Product imagery uses real catalog assets and preserves visible product identity when available.
- Family filter always has a clear exit path:
  - neutral `Todas las familias` option;
  - removable active filter chip (`×`);
  - global `Borrar filtros` action;
  - empty-state reset.
- Deep links from Home remain supported.

## Product Detail

- Sequence: Identity → Object → Sensory anatomy → Performance → Story → Commerce → Community.
- Product is treated as an editorial object, not a commodity tile.
- Commercial information remains legible and truthful; pending price/image fields render safely.

## Magazine

- Magazine is part of the same Aromia system, not a visually separate microsite.
- Cover-story hierarchy, editorial spread structure and category navigation reinforce authority.

## Final gate

- Hero overlap issue resolved by removing floating notes.
- Generic anonymous hero backgrounds removed.
- Real catalog product image is the visual object when available.
- GitHub Actions final branch gate: API typecheck PASS; web npm ci/lint/typecheck/production build PASS.
- Isolated Railway preview previously validated SUCCESS.
- Final merge to production requires explicit authorization.
