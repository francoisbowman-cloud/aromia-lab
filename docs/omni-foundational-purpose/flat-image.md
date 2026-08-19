# OMNI Foundational Purpose Trial — Flat Image

Date: 2026-08-19
Baseline SHA: `78d29e761c66103651cc870411ac21aa5239cf6d`
Production mutation: **forbidden**
Maximum creative implementation iterations: **2**

## Exact operator brief

> Una imagen importante de Aromia se siente plana. Encuentra cuál y hazla ganar profundidad y presencia sin alterar la identidad de lo que muestra ni convertirla en una composición falsa.

## What the operator does NOT specify

The operator does not identify:

- route or screen
- image file or product
- cause of flatness
- crop
- lighting treatment
- depth technique
- CSS versus image editing
- Director / skill
- implementation
- target aesthetic

OMNI must choose the target and intervention from evidence.

## Preservation contract

Mandatory:

- preserve real product identity;
- do not hallucinate bottle geometry, label, logo, cap, liquid, packaging or color;
- do not replace a real product with a generated look-alike;
- do not introduce fake product claims or fake contextual data;
- preserve routes, SEO, analytics, accessibility, responsive behavior and performance;
- keep Aromia recognizably Aromia;
- no gratuitous 3D, glass, blur, glow, parallax or luxury effects merely to create apparent depth.

## Acceptance contract

A technically valid treatment is insufficient.

The trial is eligible for acceptance only if:

1. OMNI independently identifies the highest-value flat-image target;
2. BEFORE evidence is recorded before implementation;
3. a causal perceptual hypothesis is written before implementation;
4. the intervention is bounded to the image/presentation problem actually diagnosed;
5. product identity/fidelity remains intact;
6. BEFORE/AFTER evidence covers mobile, tablet and desktop where the target appears;
7. technical gates do not regress;
8. the perceptual delta is materially positive in depth/presence/focal hierarchy, not merely different;
9. rejected attempts remain recorded;
10. maximum two creative implementation iterations.

## Failure conditions

Immediate rejection if any of the following occurs:

- generated or edited product no longer matches the verified product;
- fake bottle reflections/highlights obscure label or geometry;
- depth comes mainly from decorative effects unrelated to the product;
- mobile crop loses critical product identity;
- technical PASS but perceptual result is MIXED/WORSE;
- OMNI chooses a target simply because it is easiest to modify rather than highest-value.

---

## OBSERVE — official BEFORE

Workflow: `OMNI Flat Image Observe` run #1
Artifact: `omni-flat-image-observation`
Artifact ID: `9371053230`
Artifact SHA-256: `70fe5fa7745037bcac330a1dda42bf4365ee2917ae36d71b81d1f45ab7d97a68`

Coverage:

- Home
- Catalog
- Discovery
- Magazine
- Academia
- one real PDP (`loewe-001-man-edp`)
- 390 / 768 / 1440 px

Capture integrity: **18/18 PASS**.

The observation harness warm-scrolls every page so only successfully rendered images are considered for this construct. Missing/loading/broken states are excluded from target selection.

## TARGET SELECTION

**Selected target: Home hero product image — Loewe 001 Man.**

### Why this target wins on impact

1. It is the highest visual hierarchy image on Aromia's primary entry surface.
2. It appears before any editorial or discovery content and therefore establishes the product/brand relationship immediately.
3. It is successfully rendered in all three viewports, so this case is genuinely about perceptual flatness rather than reliability.
4. The same product appears in Catalog and PDP, allowing identity preservation to be cross-checked against unchanged reference presentations.
5. Other large editorial images on Home already contain atmospheric foreground/background depth; Catalog images are intentionally neutral comparison packshots and should not be globally dramatized merely to win this test.

## DIAGNOSE

The Home hero does not fail because the bottle lacks visual quality. It fails because the presentation creates **nested planar framing**:

- beige hero field;
- a large white inner stage;
- the source packshot's pale gray rectangle;
- the bottle centered inside all three.

This produces a “picture inside a card inside a panel” effect. On mobile the repeated concentric framing also reduces the bottle's apparent scale relative to the available hero area.

The problem is therefore not missing lighting, lack of 3D, or insufficient special effects. It is **weak figure–ground continuity and excessive framing distance** around the subject.

## CREATIVE / EXPERIENCE HYPOTHESIS

> If the Home hero reduces the extra white-card framing, lets the source packshot occupy more of the available product field, and creates depth through spatial continuity and scale rather than fabricated reflections or generated pixels, the bottle will read more like the hero object and less like a thumbnail mounted inside a card.

Expected delta:

- product presence: BETTER;
- focal hierarchy: BETTER;
- perceived depth: BETTER through figure/ground continuity;
- product identity: unchanged;
- label/geometry/color: unchanged;
- editorial authenticity: preserved;
- Catalog/PDP comparison behavior: unchanged.

## CAPABILITY SELECTION

OMNI selects:

- **Visual Director / Taste** for hierarchy and depth judgment;
- **UI implementation** for Home-only stage composition;
- **Render evidence** for mobile/tablet/desktop comparison;
- **Product fidelity and Strict Audit** for preservation.

Image generation/editing is explicitly **not selected** because the evidence does not justify altering the verified product pixels.

## ITERATION 1 PLAN

Bounded Home-only intervention:

1. remove the strongest extra white-card effect around the hero packshot;
2. increase the image's occupied visual area without cropping the bottle;
3. preserve source URL, alt text, link, product data, label, geometry and color;
4. leave Catalog and PDP product presentation unchanged as identity references;
5. preserve the existing hero copy and CTA hierarchy;
6. render BEFORE/AFTER at 390 / 768 / 1440;
7. reject the iteration if mobile identity, readability, accessibility, performance or technical gates regress.
