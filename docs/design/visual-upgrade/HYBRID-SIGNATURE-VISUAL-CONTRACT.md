# Aromia — Hybrid Signature Visual Contract v1

Status: preview-ready implementation contract
Mainline baseline: `main@e3d121d8f483a0f6b5bd783520525d44ce6e688e`
Preview: `web-hybrid-signature-01-production.up.railway.app`

## Thesis
Aromia is one visual system with three synchronized modes: Editorial, Discovery and Commerce. It must never read as a generic luxury ecommerce template.

## Core visual grammar
- Light: luminous ivory, warm paper, champagne/taupe, ink contrast, restrained gold.
- Dark: graphite/brown-black, warm smoke, controlled gold; never plain black as a shortcut.
- Display serif for narrative hierarchy; sans for utility; tracked micro-labels for navigation and editorial metadata.
- Recurrent devices: fine rules, issue numbering, olfactive anchors, material transitions, object-led product photography.
- Sections connect as chapters rather than isolated cards.

## Catalog interaction contract
A filter reached from Home must always have an obvious exit. Family filtering exposes three reset paths:
1. explicit neutral option: `Todas las familias` / no filter;
2. active removable chip with ×;
3. global `Borrar filtros` action.
Deep links from the Home olfactive index remain valid.

## Product truth contract
- Product imagery must represent the real catalog item; no invented bottle or borrowed logo.
- Pending image, price or family data must render as pending rather than fabricated information.
- Verified retailer offers remain the only commerce offers emitted in structured data.

## Surface roles
- Home = desire + curation + discovery.
- Catalog = clarity + comparison without generic marketplace styling.
- Product = conviction; object, anatomy, performance, story, commerce, community.
- Magazine = editorial authority connected to discovery.
- Quiz = olfactive consultation rather than generic form flow.

## Light / Dark
Both themes keep identical information architecture and visual grammar. Light is Atelier Ivorio: natural illumination, warm stone, paper, crystal and air. Dark is Maison Grafito: depth, reflection, warm shadow and controlled highlights.

## Motion
CSS, IntersectionObserver and native pointer motion are preferred. Respect `prefers-reduced-motion`. Motion should reinforce depth or chapter transitions, never decorate without purpose.

## Non-negotiables
- No cold UI gray in Light.
- No full-chapter black blocks as a default Light-mode contrast device.
- No card grid as the universal layout primitive.
- No fake pricing or product metadata.
- No visual change that weakens routing, accessibility, responsive behavior or catalog data integrity.

## Technical gate
The production-code commit rebased over current catalog main passed GitHub Actions API typecheck and Web lint + typecheck + production build, and the isolated Railway service completed successfully. Final approval remains visual QA in the preview; no production merge is implied.
