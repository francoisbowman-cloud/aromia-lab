# ART DIRECTION — EL COLECCIONISTA

## Publication state

```text
EDITORIAL: READY
ART_DIRECTION: READY
VISUAL_ASSETS: PENDING
IMPLEMENTATION: PENDING
QA: PENDING
PUBLISH: PENDING
TARGET_DATE: UNSCHEDULED
```

**Source manuscript:** `drafts/el-coleccionista.md`  
**Series:** Perfume como puerta  
**Art Direction:** ChatGPT  

## Editorial interpretation

The article is not really about owning many bottles. It is about a collection that cannot reach a stable ending: curiosity creates expansion, scarcity creates preservation, and the physical shelf becomes evidence of both impulses.

The page should therefore behave like a collection.

> **The composition accumulates while the argument accumulates, then abruptly gives the reader space again.**

This is the first specimen of the new Aromia. It should prove that an article does not enter a fixed visual template: the story itself determines density, image, rhythm and silence.

## Visual thesis

### Act I — Recognition

The opening is quiet and domestic, not luxurious. Near-white paper, strong editorial typography, generous negative space. The first visual should feel like discovering somebody's actual perfume shelf or drawer rather than seeing a campaign.

The reader should recognize the behavior before Aromia explains it.

### Act II — Accumulation

As the article moves from collecting versus hoarding into flankers and the industry's continuous multiplication of variants, the page gradually becomes more occupied.

Possible devices:
- small object references entering the margins;
- restrained numbering/counting marks;
- increasingly dense captions or marginal annotations;
- repetition of bottle silhouettes or verified product cutouts where factual identity matters;
- progressively reduced empty space;
- a wider composition around the flanker section.

The change must be gradual enough to be felt rather than announced.

### Act III — Fear of disappearance

The Aventus/reformulation passage changes the emotional register. Accumulation is no longer novelty alone; it becomes preservation.

Reduce the sense of multiplication and introduce archival/time cues instead: date, batch, repetition with slight temporal separation, documentary captioning. Do not invent historical packaging, batches or formula evidence.

### Act IV — “Sí, pero”

Break the accumulation.

The page returns to a large field of near-white space. Remove most marginal devices. Let the prose carry the section. The visual absence is the counterargument: after turning collecting into a system of desire and fear, Aromia admits that sometimes somebody simply liked another perfume.

The ending should feel human rather than conclusive.

## Palette — color found in the story

Do not impose legacy black/gold luxury codes.

Base:
- warm-near-white / paper white;
- ink-black with a slight warm/vegetal character;
- mineral gray for secondary information.

Episode accents may be sampled from authentic objects actually used in the article — for example the blue/navy family of verified Le Male packaging or a restrained green-gray/amber trace from a real collection photograph — but no accent is mandatory before the asset exists.

**Rule:** derive final episodic colors from the selected real/approved visual material. Do not fabricate a palette first and force imagery into it.

## Typography and hierarchy

Use Aromia's existing role logic rather than inventing a new type system:
- `font-display`: title, rare pull quote, major editorial figure;
- `font-sans`: article body/navigation;
- `font-plex`: counting marks, factual labels, metadata, captions where useful.

Opening title should have authority without becoming a generic 100vh luxury headline.

Body measure remains generous and readable. Typography may expand into the page during Act II, but reading continuity wins over spectacle.

## Visual opportunity 01 — lived-in collection

**Decision:** ACCEPT, reinterpret as documentary/editorial opening rather than perfume beauty photography.

Purpose: recognition.

Preferred asset hierarchy:
1. authentic editorial/documentary photograph of a lived-in mixed perfume collection with appropriate rights;
2. a deliberately constructed/generative scene only if it is clearly interpretive and does not falsify identifiable bottles/brands;
3. abstraction/no-image if authenticity cannot be protected.

Do not generate pseudo-real branded bottles. If labels/logos would be visible, they must be authentic and appropriate to use.

Composition should retain imperfection: different heights, non-symmetrical spacing, signs that the shelf exists for use rather than display. Avoid excessive clutter engineered for drama.

## Visual opportunity 02 — flankers multiply

**Decision:** ACCEPT only with verified identities.

This should not be a generated family portrait of imaginary Le Male flankers.

Preferred solution:
- use authentic verified cutouts/product images for the exact variants named or selected after factual verification;
- compose them serially so repetition itself creates the slight dizziness requested by the manuscript;
- no prices, retail badges or conversion CTA inside the composition;
- neutral/documentary captioning can identify release/name where verified.

If sufficient authentic assets are unavailable, replace the literal bottle lineup with an editorial visualization of proliferation rather than inventing product identities.

## Aventus passage

No additional hero image is required by default.

A small authentic product/reference image can appear if it improves orientation, but the stronger device may be typographic/archival: repeated years, batch discourse or a visual timeline only where claims can be sourced. Do not turn the passage into an Aventus advertisement.

## Contextual commerce

The manuscript currently ends with direct retailer links. Preserve the commercial opportunity but change its final web treatment to match `AROMIA_EDITORIAL_COMMERCE.md`.

Recommended closing module after the editorial ending:

**Para quien quiera seguir oliendo**

Two restrained contextual references:
- Le Male — because it is the article's concrete flanker example;
- Aventus — because it is the reformulation/scarcity example.

Each reference should explain *why it appeared in the story* before offering an action such as `Ver opciones disponibles` or `Encontrarla`.

Affiliate disclosure must remain clear. Amazon should not become the visual protagonist.

## Responsive behavior

Mobile is its own composition, not a compressed desktop spread.

- preserve the accumulation concept through sequence rather than side margins that no longer exist;
- marginalia can become inline interludes between paragraphs;
- product repetition can become a controlled horizontal sequence or vertical cadence, but never a carousel solely because mobile space is narrow;
- the “Sí, pero” reset must remain unmistakable through whitespace;
- captions remain readable and connected to their assets.

## Implementation handoff

Code should not implement a universal `ArticleTemplate` from this page.

Build/reuse only the shared editorial infrastructure that is genuinely common (article shell, metadata, captions/credits, related navigation, disclosure/accessibility primitives). The accumulation behavior, density progression and Act IV reset belong specifically to `El Coleccionista`.

Implementation may begin only after the required visual assets are resolved or explicitly marked `NOT_REQUIRED`.

## Acceptance gate

Before moving `ART_DIRECTION` forward in implementation, verify:

1. Does the page physically become denser as the argument accumulates?
2. Does “Sí, pero” visibly release that density?
3. Does the opening feel lived-in rather than styled for a luxury campaign?
4. Are all documentary-looking bottles/products authentic and verifiable?
5. Is any generative imagery interpretive rather than counterfeit documentary evidence?
6. Does commercial treatment arrive after editorial value and remain subordinate?
7. Does mobile preserve the narrative rhythm instead of merely stacking desktop blocks?
8. Would the page still be recognizable as this story if the title were hidden?

If #8 is no, the design is too generic.
