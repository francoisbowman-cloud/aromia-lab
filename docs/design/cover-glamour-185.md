# Aromia — expressive magazine cover

Publisher direction: creative freedom, colorimetry, editorial composition,
quiet reuse of ingredients, improved photographic appeal, and a magazine with
more glamour. The later newspaper/Vogue comparison supersedes the first ruled,
monochrome opening studies. This is a candidate on PR186, not a live deployment.

## Active visual specification

- [Desktop study](../mission-185/evidence/design/cover-desktop-concept.webp)
- [Mobile study](../mission-185/evidence/design/cover-mobile-concept.webp)
- Warm paper #f7f5f0; forest #263e33; burgundy #641e2f; cream on colored fields.
  Dark paper uses #efc4cc for the paper-surface accent; colored fields keep their
  explicitly paired cream text in either theme.
- Newsreader display and italic reading links; Archivo interface/body; existing
  IBM Plex metadata. Large masthead is confined to the cover and scrolls away.
- Cover spread → botanical paper inset → burgundy photographic spread → open
  typographic index → quiet ingredient references in Discovery. No card grid.
- All essential text and controls are HTML. No image is a screenshot of the UI.

## Fidelity and deliberate adaptations

| Reference relationship | Implementation / review |
| --- | --- |
| Oversized burgundy masthead and small navigation below | Same hierarchy, actual Newsreader. Initial glyph clipping was corrected before the final sweep. |
| Forest opening; cream serif title beside the photograph | Same surface relationship and asymmetric grid. Native uncropped16:9 source retains sky and land. |
| Real photograph without overlay, tint or synthetic glint | Old resin pseudo-element is disabled on the cover. Credit is visible in normal flow. |
| Intimate deck and italic reading action | Existing first sentence retained; full story copy is unchanged. Desktop action precedes the deck visually; mobile follows the photograph and deck. |
| Botanical interruption on warm paper | Uses the existing authentic Salvia sclarea plate by Jacob Sturm,1796, instead of the invented plant in the desktop UI study. The pictured species is part of the story's argument. |
| Rose spread on burgundy | Existing credited floral image, not a portrait. A single Motion component drifts within a bounded interpretive crop. |
| Sparse index | Four real routes; numbered news rails and repeated horizontal rules removed. Descriptive navigation context remains screen-reader accessible. |
| Authored mobile composition | Lead title → panorama → deck/action. Botanical inset sits alongside a readable summary; rose opens its own band. The two-column miniature text in the study was recomposed for320px legibility. |
| Ingredient marginalia | Two small owned references, each linked to the relevant family, with visible source/license information. No unsupported perfume-note relationship is introduced. |

The accepted studies and browser captures were inspected with view_image.
Browser plugin tools are unavailable in this environment; Playwright Chromium
is the tested fallback. Review evidence lives in /workspace/aromia-evidence:
glamour-qa.json/png, motion-qa.json. Twelve width/theme states (320,390,768,1024,
1440,1920) passed overflow, image loading, page-error and axe WCAG A/AA checks.
Automated checks complement visual review; they are not proof of all accessibility.

## Framework and motion choice

Existing Next.js14/React18, Tailwind and Lucide remain the composition stack.
Publisher subsequently requested framework/tool support; Motion14.14.0 is pinned
for the bounded image effect with lazy DOM features. It never gates content
visibility. Normal scroll, reduced-motion, JavaScript-disabled rendering, menu
keyboard enter/escape/focus return, close-on-navigation and saved theme passed.
No scroll hijacking, automatic carousel or entry animation hides reading content.
Production bundle size and container regression are checked before final release.

The rose is interpretive and can support a small crop; the documentary Omán
panorama does not move or crop to achieve this effect. Botanical paper rotation
is a static3-degree compositional cue. No false spatial model is implied.

## Ingredient recovery and new interpretation

The governed28-item library is metadata-only in this checkout. PR75/78 explicitly
recorded its portable ZIP as not ingested; GitHub releases/artifacts do not expose
that bundle. It has not been silently regenerated or marked integrated. Existing
repo ingredients supply the current design.

Publisher explicitly authorized reimagining weak images. The new bergamot is a
single reference edit, submitted as a bounded visual-only scene task, using only
the source fruit photograph. The result passed inspection for a single coherent
fruit, natural rind, soft light, no operational/UI contamination, no text, no
invented location and no product identity. It is identified as an AI
reinterpretation, with source credit and share-alike license. The documentary
original remains in Saber. No generated UI-study plant is used as publication art.
See public/editorial-v1/bergamot-editorial-v2.provenance.json for binary identity.

Still open across the larger mission: factual/rights verification of unpublished
stories, wider reader/CMS/security and production-container checks. Source-domain
access is saved in an environment draft and is not applied merely by saving it.
