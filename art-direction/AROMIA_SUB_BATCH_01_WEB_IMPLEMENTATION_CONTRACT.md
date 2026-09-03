# AROMIA — Sub-batch 01 Web Implementation Contract

STATUS: ACTIVE / REQUIRED FOR CLOSEOUT
DATE: 2026-09-03
SOURCE_ART_DIRECTION: `art-direction/AROMIA_SUB_BATCH_01_TERRITORIOS_VISUAL_DIRECTION.md`
SOURCE_QUARANTINE: `art-direction/AROMIA_SUB_BATCH_01_VISUAL_GENERATION_QUARANTINE.md`
CANONICAL_RENDERER: `apps/web/src/app/(editorial)/historias/[slug]/page.tsx`
CANONICAL_VISUAL_REGISTRY: `apps/web/src/app/(editorial)/editorialVisuals.tsx`

## Why this contract exists

A visual asset is not a finished Aromia deliverable merely because it was generated or accepted in quarantine. The publication target is the rendered website.

For this sub-batch, the completion chain is mandatory:

`ART_DIRECTION → VISUAL_ASSET PASS → REPO INGEST → RENDERER INTEGRATION → RESPONSIVE COMPOSITION → BROWSER QA → PUBLISH-READY`

No actor may report a story as visually complete while its approved asset exists only in chat, an external design surface, a handoff file, or an asset folder without being rendered in the real article.

## Web completion rule

Each of the 9 stories is complete only when:

1. the draft has been promoted into the web editorial data/source used by `/historias/[slug]`;
2. every visual opportunity resolved as photography has a quarantined PASS source;
3. every non-photographic opportunity is implemented natively in the article using canonical tokens/components;
4. the intended placement, scale, negative space and rhythm are visible in the real page;
5. mobile and desktop crops preserve the narrative test;
6. there are no visual placeholders, mock review cards, generation labels, workflow language or debug artifacts visible to readers;
7. browser/render QA passes before publication.

## Story-by-story implementation matrix

### 01 — `antes-del-perfume-ya-oliamos`

- Opening: original observational photo.
  - Approved source: `assets/visual/editorial/sub-batch-01/01A-antes-del-perfume-ya-oliamos.jpg`
  - Web treatment: tall in-reading-field figure, generous paper, slightly off-center; never full-bleed.
  - Mobile: preserve shoulder / neck / damp hairline and one bathroom seam.
- Pre-final reflection: native material field, not another literal body photograph.
  - Web treatment: translucent moisture/mineral texture + thin veil entering from one edge using canonical surface/accent semantics.
  - No private palette, no infographic labels.

### 02 — `comprar-para-oler-o-comprar-para-tener`

- Opening: lived-in object photo; current quarantine slot 02A.
  - Web treatment: wide horizontal interruption with unequal object distances; sample must remain visually distinct from full bottle on mobile.
- Collection section: diptych of two documentary shelves.
  - Equal-width frames separated by page/paper space, never comparison-card UI.
  - No good/bad labels.

### 03 — `cuando-ya-no-hueles-tu-perfume`

- Opening: candid wrist-smelling scene.
  - Medium image with room context and non-glamour crop.
- Asymmetry section: social scene where a second person registers scent while wearer remains unaware.
  - Use a different composition from the opening; avoid repeated portrait-card rhythm.

### 04 — `fougere-no-significa-viejo`

- Opening: authentic retro barbershop environmental detail.
  - Landscape editorial interruption, no sepia treatment.
- Reconstruction section: material table study of lavender / oakmoss / modern substitute.
  - Native caption/provenance may sit in normal editorial flow; do not render molecular-diagram UI.

### 05 — `huele-sintetico-que-estamos-diciendo`

- Opening: macro material study of two visually indistinguishable blotters.
  - Near-symmetry broken by small imperfections.
- Second beat: native typographic/material pause only.
  - Wide paper field + article pull quote + restrained material shift using canonical tokens.
  - No second generated image.

### 06 — `lavanda-limpia-medicinal-barata-elegante`

- Opening: lavender material still life with four contextual traces.
  - Square/4:5 flexible figure, not spa flat-lay.
- Second beat: four small marginal editorial markers/captions.
  - `limpia / farmacia / barbería / prestigio`
  - Treat as reading rhythm, not illustrated quadrants/cards.

### 07 — `nos-perfumamos-para-nosotros-o-para-los-demas`

- Opening: private ritual photo from behind/side.
  - Vertical/tall figure, partial mirror reflection allowed; no centered glamour pose.
- Social consequence: separate environmental photograph after the private ritual.
  - Must read as a before/after relation without campaign-style seduction cues.

### 08 — `podemos-describir-un-olor-sin-compararlo-con-otra-cosa`

- Opening: object/material composition with citrus peel, damp wood and clean paper/fabric entering from edges.
  - Large negative field; no catalog grid.
- Language beat: native editorial language interruption based on the canonical art-direction decision.
  - Use typography and spacing as sensory insufficiency, not infographic treatment.

### 09 — `por-que-una-lista-de-notas-no-te-dice-como-huele-un-perfume`

- Opening: authored unbranded note-sheet document study + blotter.
  - It should feel like a plausible working artifact, not a polished pyramid infographic.
- Accord section: physical/material composition showing the logic of relationship rather than a second note list.
  - Avoid brand-style top/heart/base pyramid conventions.

## Renderer requirements

The existing editorial renderer already supports visual slots through `VisualField`. Sub-batch integration should extend this concept without turning the article into a generic card system.

Required capabilities for this batch:

- portrait, landscape, square and documentary intrinsic figures;
- story-specific slot classes for width/alignment rather than one repeated geometry;
- paired/diptych figures with paper separation;
- native non-image visual pauses;
- optional documentary caption/provenance in normal flow;
- responsive focal/crop control where generated photography requires it;
- no placeholder visible in a publish-ready story.

Do not solve the batch by forcing all opportunities into `VisualField` if a native CSS/material composition better matches the decision. `VisualField` is a registry/renderer utility, not the art direction itself.

## Asset handling

Only assets marked `PASS` in the active quarantine may be referenced by the web.

Generated/chat output does not count as an asset until the real binary is ingested under:

`assets/visual/editorial/sub-batch-01/`

Web-facing copies or imports must preserve traceability to that canonical source.

Rejected outputs, UI drift, GitHub mockups, workflow boards, generic perfume ingredient shorthand and any image failing its narrative test must never be wired into the article even temporarily.

## Responsive art-direction gate

Desktop and mobile are both authored states.

For every photographic slot Code must verify:

- subject remains legible after crop;
- narrative relationship survives narrow width;
- no face/body/object is accidentally clipped into a different meaning;
- image does not become an unintentional full-screen hero;
- captions/provenance stay attached to documentary material;
- surrounding body text retains deliberate breathing room.

## Publish gate

The 9-piece sub-batch may move from visual implementation to publication only when all required original-image slots have passed quarantine and every story has been reviewed in the real browser at desktop and mobile sizes.

The final evidence is the rendered page, not the generation output.

## Operational shorthand

> **Do not deliver images to Aromia. Deliver authored pages that happen to use images.**
