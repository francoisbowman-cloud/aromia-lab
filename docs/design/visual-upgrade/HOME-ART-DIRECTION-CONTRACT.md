# AROMIA HOME — ART DIRECTION CONTRACT

Status: draft for Home Visual Gate
Branch: `feat/aromia-home-visual-polish-01`
Scope: Home only. No Product Page, Magazine hub, Quiz flow, Catalog, PR #10, GDPR/GA or npm audit.

## 1. Objective

The Home must stop reading as a styled interface and start reading as a recognisable editorial world.

Aromia has two emotional states, not two brands:

- **Atelier Ivorio / Light** — daylight luxury, warm paper, limestone, travertine, translucent glass, natural shadow, restrained gold.
- **Maison Grafito / Dark** — nocturnal luxury, charcoal stone, wet reflections, grazing light, deep amber, controlled highlights.

The same composition, typography and interaction language must remain recognisably Aromia in both states.

## 2. Asset hierarchy

### H01 — Sensory Hero

Purpose: first impression, identity, discovery.

Composition:
- macro still-life, no generic bottle-on-pedestal treatment;
- ingredients physically present in the scene;
- generous negative space for headline and CTA;
- four visual anchors mapped to: bergamot, ambergris accord, cognac leather, orange blossom;
- the bottle is **not** the protagonist in H01.

Light direction:
- warm travertine / limestone base;
- soft lateral daylight, 35–50°;
- bergamot peel luminous, orange blossom creamy-white;
- cognac leather warm and tactile, never black;
- ambergris represented through a mineral / marine-waxy accord treatment rather than a decorative amber blob;
- glass/refraction highlights permitted, no clinical white studio look.

Dark direction:
- graphite or near-black stone;
- grazing light, controlled wet reflection;
- amber highlights, deep leather, ivory floral accents;
- blacks must retain texture and detail.

Interactive anchor contract:
- labels are hairline + anchor point + tracked text, never floating glass chips;
- desktop may expose four anchors;
- mobile shows only two unless crop proves all four remain legible;
- anchor coordinates must be calibrated after final crop, not treated as permanent constants.

Safe zones:
- desktop: reserve lower-left / lower-center area for the headline and CTAs;
- mobile portrait crop: reserve lower 42% for copy and top corners for at most two labels;
- no critical ingredient may sit under navigation or the primary CTA.

Recommended masters:
- landscape master: 2400×1600 minimum;
- mobile-safe crop validated at 1080×1440 equivalent;
- no baked-in text or logo.

### H02 — Product Reveal

Purpose: narrative continuation — matter → identity → object.

Composition:
- same visual universe as H01;
- bottle now enters the scene as the culmination, not as a catalogue cutout;
- ingredients remain visible enough to preserve continuity;
- asymmetric composition, bottle placed away from copy-safe area.

Light direction:
- continuation of H01 Light set;
- bottle integrated with travertine, glass, soft shadow and warm reflected light.

Dark direction:
- continuation of H01 Dark set;
- controlled rim light and reflected highlights;
- avoid generic black-background perfume advertising.

### H03 — Magazine Cover Story

Purpose: authority, culture, editorial depth.

Rule:
- prefer the actual article editorial image when it satisfies the visual standard;
- otherwise produce a dedicated cover-story asset tied to the article subject;
- never use a generic fragrance gradient once a real cover asset exists.

Composition:
- image must support the split-spread layout;
- subject biased toward the image half;
- no text baked into image;
- light and dark modes may share the same asset if tonal contrast remains correct.

### H04 — Ecosystem / Quiz atmospheric support

These are **not priority image-generation assets**.

Default:
- use typography, paper/stone surfaces, restrained scene glow and whitespace;
- only introduce photography if it improves hierarchy rather than filling space.

This prevents Home from becoming a sequence of unrelated campaign images.

## 3. Light / Dark ratio

### Light

Target: 70–80% visually luminous surfaces.

Allowed progression:
`Ivorio → paper → warm stone → luminous photography → Ivorio`

Avoid:
`Ivorio → black panel → grey panel → black panel`

No neutral/cold UI grey as a major surface.

### Dark

Graphite remains dominant, but not flat black.
Use material distinction through:
- brown-black;
- warm charcoal;
- translucent amber reflection;
- ivory highlights;
- restrained gold.

## 4. Photographic DNA

Aromia photography should feel:
- tactile;
- editorial;
- sensorial;
- controlled;
- materially believable;
- recognisable without UI chrome.

Avoid:
- generic luxury bottle on pedestal;
- stock-photo ingredient explosions;
- excessive bokeh;
- fake smoke for every scene;
- black-and-gold as a shortcut for luxury;
- over-polished CGI surfaces;
- ingredient miniatures floating as UI badges.

## 5. Motion contract

Motion supports depth; it does not perform for attention.

Current permitted motion:
- subtle hero parallax on fine pointer only;
- one-time scroll reveals;
- small hover scale on editorial imagery;
- hairline / text transitions.

Reduced-motion:
- all content remains visible;
- no required information depends on motion;
- hero parallax disabled.

No Framer Motion until a specific interaction demonstrates clear value beyond CSS / IntersectionObserver.

## 6. Responsive contract

The mobile version is not a collapsed desktop page.

Mobile priorities:
1. headline;
2. one primary CTA + one textual secondary CTA;
3. two sensory labels maximum by default;
4. editorial image crop must preserve intended ingredient anchors;
5. indexes and ecosystem lists remain typographic, not converted into cards.

Tablet (768×1024) must be visually QA'd before Home Visual Gate closes.

## 7. Asset acceptance gate

An asset is approved only if:
- it still reads as Aromia with all UI hidden;
- Light feels deliberately photographed in daylight, not Dark washed out;
- Dark preserves texture instead of crushing blacks;
- copy-safe zones hold at desktop and mobile crops;
- ingredient anchors correspond to visible objects/materials;
- no fabricated product geometry or misleading bottle identity is introduced;
- image can survive responsive crop without losing the story.

## 8. Integration rule

The CSS gradient scenes remain as fallback/loading states.

When assets are approved:
- prefer `next/image` for editorial assets when practical;
- preserve alt/accessibility semantics;
- do not bake typography into the image;
- do not delete fallback classes until real image loading and failure states are verified.

## 9. Home Visual Gate — closure criteria

Home is not CLOSED until all are true:
- Light visual rhythm approved;
- Dark visual rhythm approved;
- H01 real hero approved;
- H02 real Product Reveal approved;
- H03 Magazine treatment approved or intentionally deferred with real article image strategy;
- desktop QA complete;
- mobile QA complete;
- tablet QA complete;
- reduced motion verified;
- build/lint/typecheck verified in an execution-capable environment;
- no regression in Catalog navigation or dynamic Home data.
