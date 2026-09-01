# AROMIA EDITORIAL v1 — POST-GATE VISUAL POLISH

STATUS: APPROVED_ART_DIRECTION
PRODUCTION: HOLD
OWNER: ChatGPT / Art Direction
NEXT_ACTOR: Code

## Context

Editorial v1 reached OMNI Gate 5 `APPROVED_WITH_NON_BLOCKING_REFINEMENTS` at branch commit `0ed820041301efd8c1713d75b3f7ccefaf6a600b` with confidence `0.844` and zero blockers. This document records the Publisher-approved visual refinement direction discovered after that gate. It is a polish pass, not a reopening of the editorial architecture.

## Locked visual principle

Aromia should read as a fragrance magazine with authored art direction, not as an AI-generated luxury template.

Preferred chain:

`recognizable material → authored photographic composition → editorial integration → invisible retouching`

Avoid:

`abstract texture → explanatory caption → generic luxury styling`

Interpretive imagery must communicate before its caption. Documentary imagery remains authentic/verifiable and must not be replaced by generated evidence.

## Image craft standard

Generated interpretive photography should sit between sterile synthetic perfection and raw amateur capture.

Require:
- plausible optical behavior, depth of field and light direction;
- high physical micro-detail: resin fractures, wood fibre/grain, petal variation, mineral irregularity, dust/residue only where plausible;
- controlled imperfections and asymmetry;
- coherent contact shadows/reflections;
- restrained grading and sharpening;
- believable smoke/steam behavior;
- no repeated textures, fused objects, impossible petals, ornamental AI smoke, plastic surfaces, excessive HDR or uniform hyper-sharpness.

The target is `material reality + photographic authorship`, not photorealism as spectacle.

## Editorial imagery direction

### Ambroxan / material
Use a recognizable translucent/resinous still-life object as an interpretive proxy, photographed with grazing light on stone/metal/mineral support. Do not imply that the depicted object is literal ambroxan. Avoid ocean/whale/fake chemistry imagery.

### Ropion / controlled excess
Use recognizable dark floral/material matter — rose, petals, patchouli-adjacent texture — under pressure/density. The visual should express controlled excess without becoming a perfume advertisement or fabricated Ropion evidence.

### Amouage / material density
Use incense/resin/wood/mineral/smoke as an authored still life. Dense but plausible. No crown, throne, pseudo-palace, fake calligraphy or fabricated branded evidence.

## Palette correction — approved

Do not use yellow/gold as Aromia's automatic accent. Repeated gold microcopy, arrows and labels reads as generic AI-luxury styling.

Aromia's stable chromatic anchors are:
- warm ivory / paper-like neutrals;
- graphite / ink / near-black;
- restrained warm and material-derived neutrals.

Accent color should vary with editorial rhythm and story material rather than being globally stamped across every section. Allowed families include muted bone, tobacco, burgundy/wine, resin/amber-brown, stone, sage, smoke, earth and ink-derived tones.

Gold may appear when compositionally justified, but is no longer the default semantic accent.

## Rhythm rule

Identity should come primarily from typography, proportion, spacing, image craft, editorial hierarchy and sequencing — not one repeated accent color.

A page may move, for example, from ivory/ink opening → near-monochrome documentary passage → material-derived accent → graphite closing band. Adjacent stories do not need identical chromatic treatment.

Do not turn this into random theming: variation must remain within Aromia's material/editorial world.

## Public-facing cleanliness

No technical metadata may leak into reader-facing UI: no hashes, branch names, gate labels, PRESENT flags, file paths, implementation notes or production status. Such data belongs only to repo evidence/checkpoints.

## Code continuation

Treat the existing Gate-5-approved implementation as the safety baseline. Apply this as a bounded visual polish pass:

1. preserve article copy, routes, documentary provenance, noindex state and all five green gates;
2. remove/reduce generic gold/yellow UI accents and derive restrained accents from the approved material palette;
3. introduce chromatic rhythm without breaking Aromia identity or accessibility contrast;
4. keep public UI free of technical metadata;
5. preserve the existing approved interpretive assets unless higher-craft replacement rasters are actually available in-repo; do not substitute fake documentary imagery;
6. run desktop/mobile visual QA after palette/rhythm changes;
7. submit the rendered polish to OMNI only if the implementation materially changes the rendered experience;
8. keep `PRODUCTION: HOLD`; no merge/deploy without explicit Publisher approval.

## Reusable learning

These principles are candidates for a later cross-project Visual Craft Playbook, but extracting that playbook is explicitly non-blocking and must not delay Editorial v1.
