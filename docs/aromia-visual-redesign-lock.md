# Aromia Visual Redesign — Design Lock

Status: visual direction locked for implementation branch; production untouched.

## Principle

Aromia is an editorial fragrance product, not a generic luxury storefront.

**Perfume + material + light + scene**, with product authenticity as a hard gate.

## Palette

- Paper: `#F7F5F0`
- Mist: `#E6E8E4`
- Sand: `#D9C8B1`
- Graphite: `#20231F`
- Night Green: `#0E1311`
- Dry Leaf: `#5A6B54`
- Clay: `#B35A3C`
- Blue Haze: `#3E5361`
- Petal: `#8A6D76`
- Amber accent: `#C49A54` — never the dominant brand shortcut
- Burgundy depth: `#4A1F24`

Avoid pure black + gold + white as the dominant triad.

## Visual rules

1. Authentic branded perfume bottles are never regenerated or visually falsified by AI.
2. Catalog product images sit directly on the editorial canvas; no default cards, rounded tiles, or boxed product grids.
3. Materials/ingredients appear only when grounded in the actual fragrance or editorial content.
4. Atmosphere may use generated or abstract visual language only when it does not imply false product facts.
5. Hierarchy comes from scale, whitespace, typography, crop and rhythm — not decorative chrome.
6. Magazine is more cinematic than Catalog; PDP is more artifact-like than ecommerce; Discovery behaves like a fragrance atlas rather than a SaaS quiz.
7. Motion is restrained, content-led and reduced-motion safe.

## Surface lock

### Home
Editorial cover composition, strong product artifact, asymmetrical rhythm, real catalog data, no generic luxury hero tropes.

### Catalog
Borderless product field. Slim editorial filters, explicit reset / `Todos` state, varied but disciplined visual rhythm, authentic packshots.

### PDP
Real product as oversized artifact. Product identity, concise factual sensory description, open typography-led “Anatomía” section, understated affiliate availability action.

### Magazine
Independent fragrance publication structure: oversized headline, image-led cover story, asymmetric article index, no blog-card grid.

### Discovery
Open typographic choices and scent-map/index behavior using real Aromia dimensions: family, notes, occasion, season, gender, niche/commercial, price category, concentration. Clear reset path.

## Reality gate

Every implementation slice must answer yes to all four:

- Is the product/data real?
- Is the product image authentic or explicitly marked for replacement?
- Can this exact composition be implemented responsively?
- Does it look recognizably Aromia without relying on black/gold luxury shorthand?

## Implementation gate

Implementation is not complete until desktop and mobile renders are compared against the locked visual direction and no material fidelity, accessibility, overflow, image-authenticity, or responsive issues remain.
