# AROMIA HOME — PRODUCTION ASSET PROMPTS

Status: production brief, pending generation and visual gate
Branch: `feat/aromia-home-visual-polish-01`

These prompts operationalize `HOME-ART-DIRECTION-CONTRACT.md`.
They are not generic fragrance prompts. Preserve the composition rules and safe zones because UI labels and copy are positioned against the final crop.

---

## H01A — Sensory Hero / Atelier Ivorio

### Intent
Daylight luxury. The perfume is understood first as matter, texture and identity — not as a bottle advertisement.

### Master prompt

Luxury editorial fragrance still life for Aromia, high-key daylight interpretation, photographed as a sophisticated sensory magazine spread rather than a conventional product advertisement. Warm pale travertine and limestone environment with generous negative space across the lower-left and lower-center for large editorial typography and calls to action. Macro-real ingredients physically integrated into the scene: luminous fresh bergamot peel with natural oil texture, creamy white orange blossom petals, warm cognac leather with fine tactile grain, and an ambergris accord represented through an elegant mineral / marine-waxy material treatment rather than a literal amber stone. Add restrained clear glass and liquid refraction details that catch soft lateral daylight at approximately 40 degrees. Warm ivory, parchment, honey, cognac and muted gold palette. Natural soft-edged shadows, subtle depth, tactile realism, believable material imperfections, controlled highlights, no clinical white studio look. The bottle, if present at all, must be peripheral and secondary — ingredients and atmosphere are the protagonists. Composition must feel luxurious, quiet, intelligent and editorial, with no text, logos or graphic UI baked into the image. 100mm macro / medium-format editorial photography character, shallow-to-moderate depth of field with the ingredient anchor areas clearly legible, highly realistic surfaces, refined restrained grain.

### Composition constraints
- Bergamot visual anchor: upper-left quadrant.
- Ambergris accord visual anchor: upper-right quadrant.
- Cognac leather visual anchor: lower-left-to-mid-left, but do not invade the primary headline safe zone.
- Orange blossom visual anchor: right/lower-right quadrant.
- Lower 38–42% must remain calm enough for headline + CTA overlay.
- Avoid a dominant centered object.

### Negative prompt / reject conditions
No floating ingredient explosion, no black background, no perfume-on-pedestal setup, no fake smoke, no excessive bokeh, no gold glitter, no luxury hotel cliché, no CGI-perfect marble, no text, no brand logo, no miniature ingredient icons, no amber blob used as shorthand for ambergris, no over-saturated yellow/gold cast.

---

## H01B — Sensory Hero / Maison Grafito

### Intent
The same Aromia identity after dark: tactile, nocturnal, mysterious, but with material detail preserved.

### Master prompt

Luxury editorial fragrance still life for Aromia, nocturnal sensory interpretation on textured graphite stone with subtle controlled wet reflection. Macro-real ingredients physically integrated into the composition: bergamot peel catching a narrow warm highlight, ivory orange blossom with visible petal texture, deep cognac leather remaining brown and tactile rather than becoming black, and an ambergris accord represented through refined mineral / marine-waxy material cues. Grazing directional light from approximately 40–45 degrees, warm amber rim highlights, restrained clear-glass refractions and tiny realistic specular reflections. Preserve deep shadow detail; blacks must contain texture and separation. Large calm negative space across the lower-left and lower-center for editorial typography and calls to action. The scene should feel cinematic, intelligent, sensual and expensive without relying on black-and-gold cliché. Bottle absent or peripheral, never the hero. Editorial medium-format / 100mm macro photography character, controlled depth, sophisticated low-key exposure, subtle filmic grain, no baked-in text or logos.

### Composition constraints
Use the same anchor map and safe zones as H01A so Light/Dark theme switching preserves interaction geometry as much as practical.

### Negative prompt / reject conditions
No crushed blacks, no generic black velvet, no gold glitter, no fake smoke cloud, no bottle centered on a plinth, no nightclub lighting, no excessive reflections, no floating ingredients, no text/logo, no orange monochrome grade.

---

## H02A — Product Reveal / Atelier Ivorio

### Intent
Continuation of H01A: matter has now materialized into an object. The bottle appears as culmination, not catalogue cutout.

### Master prompt

Editorial luxury fragrance scene for Aromia continuing the exact tactile daylight world of the sensory hero: warm travertine, pale limestone, soft lateral natural light, clear glass refractions, bergamot peel, creamy orange blossom, cognac leather and refined mineral/marine ambergris-accord cues. Introduce one elegant unbranded perfume bottle integrated naturally into the set, positioned in the right third of the frame rather than centered, with believable glass thickness, liquid refraction, cap geometry and grounded contact shadow. The bottle should feel discovered within the material world, not placed on a commercial pedestal. Preserve a broad quiet copy-safe zone across the left 40–45% of the frame. Ingredients remain visible enough to create continuity with H01. Refined ivory, parchment, cognac, honey and restrained gold palette, tactile realism, subtle grain, sophisticated magazine photography, no text or logos.

### Reject conditions
No centered bottle, no isolated packshot, no floating bottle, no distorted glass geometry, no generic marble pedestal, no excessive bouquet, no ad-copy space created as a blank white wall, no text/logo.

---

## H02B — Product Reveal / Maison Grafito

### Intent
Nocturnal continuation of H01B with a controlled product arrival.

### Master prompt

Editorial luxury fragrance scene for Aromia continuing the exact nocturnal graphite world of the sensory hero: textured charcoal stone, subtle wet reflection, grazing warm light, restrained amber highlights, ivory floral accents, bergamot, cognac leather and refined mineral/marine ambergris-accord cues. Introduce one elegant unbranded perfume bottle naturally integrated into the right third of the composition. Preserve accurate believable bottle geometry, glass thickness, liquid refraction, cap alignment and grounded reflection. The product appears as the culmination of the ingredients, not as a standalone commercial packshot. Keep the left 40–45% compositionally calm for editorial copy. Deep shadows must retain texture and separation. Cinematic but restrained, tactile editorial photography, subtle grain, no text or logos, no black-and-gold cliché.

### Reject conditions
No crushed black bottle silhouette, no generic spotlight pedestal, no glowing CGI edges, no smoke curtain, no central packshot, no text/logo.

---

## Generation and review protocol

1. Generate H01 Light first.
2. Reject any candidate that fails the copy-safe zone or ingredient-anchor map, even if aesthetically impressive.
3. Use the approved H01 Light composition as reference for H01 Dark so the interaction geometry remains related.
4. Produce H02 only after H01 composition is approved.
5. Validate each master at:
   - desktop landscape;
   - tablet 768×1024 crop;
   - mobile 1080×1440-equivalent crop.
6. UI labels are added in code only. Never bake labels into photography.
7. Final web delivery: WebP, with CSS scene classes retained as fallback/loading state.

## Acceptance question

With all Aromia UI hidden, does the image still feel like it belongs to a recognisable editorial fragrance world rather than a generic luxury campaign?

If not, reject and regenerate.
