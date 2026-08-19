# OMNI Foundational Purpose Trial — Recognizable Brand

Date: 2026-08-19
Baseline: technically validated Unknown Problem candidate + shared evidence harness
Production mutation: **forbidden**
Maximum creative iterations: **2**

## Exact operator brief

> Haz que una parte importante de Aromia se sienta inequívocamente Aromia sin rediseñarla arbitrariamente ni recurrir a clichés de lujo.

## Preservation contract

Preserve real data, product identity, routes, SEO, analytics, accessibility, responsive behavior and performance. Avoid generic AI luxury, black-and-gold shortcuts, gratuitous glass/3D/motion, excessive cards and decorative novelty.

---

## OBSERVE

Across the controlled surfaces, Aromia already has recognizable devices: editorial numbering, olfactory categories, large serif statements, restrained utility typography, index-like navigation, and the idea of scent as memory/context rather than merely product inventory.

Club is the weakest high-value expression of that system. Its copy is on-brand, but the visual anatomy is the familiar premium waitlist pattern: statement on the left, three benefits, soft decorative circles, email panel on the right. Remove the word Aromia and little in the composition identifies the product's olfactory worldview.

## MICROFINDINGS

### `club-generic-waitlist-anatomy`

- surface: `club`
- severity: **P1 HIGH VALUE**
- disposition: **FIX_NOW**
- notice: the page is polished but structurally interchangeable with a generic luxury membership waitlist.
- explain: its only large visual motif is an abstract circle; the three concepts that actually define Club—Perfil, Comunidad, Discovery—remain ordinary benefit columns instead of becoming a recognizable Aromia information structure.
- judge: this matters because Club should represent identity and belonging; generic visual language weakens brand recognition precisely where membership is being introduced.
- restraint: do not add black-and-gold drama, glass panels, 3D perfume objects, fake member statistics or decorative motion.

### `quiz-strong-brand-expression`

- surface: `quiz`
- disposition: **PARK**
- decision: preserve its editorial question framing and asymmetry as evidence that Aromia can already feel distinctive without ornamental effects.

## TARGET

**Club Aromia — right-side visual field around the existing waitlist form.**

## ITERATION 1

Hypothesis: replace anonymous decorative circles with a restrained olfactory trace using the three real Club pillars already present on the page.

Implementation used large low-opacity `Perfil / Comunidad / Discovery` labels and 01/02/03 nodes behind the waitlist foreground.

### Technical verification

- shared stacked evidence: **24/24 PASS**;
- no route, overflow, H1, page-error, broken-image or console regression detected;
- form behavior and original copy preserved.

### Perceptual verification

**REJECTED.**

Desktop increased brand signal, but the mobile render violates the hierarchy contract: background words and numeric nodes leak through and around the functional form, producing ghosted text and competing with the real copy. The page is technically valid but perceptually noisier.

Why rejected:

1. the trace occupies the same visual plane as the form instead of a reserved secondary plane;
2. large background typography becomes accidental content on narrow screens;
3. the intervention improves recognizability by sacrificing clarity, which is not an acceptable trade;
4. technical green does not override a perceptual regression.

This failed attempt remains recorded as evidence.

## ITERATION 2 HYPOTHESIS

> Preserve the olfactory trace idea, but physically separate identity from function: reserve a narrow trace rail beside the form on desktop and use a small in-flow index above the form on mobile. No decorative content may sit behind readable form text.

Iteration 2 constraints:

- desktop trace stays outside the form footprint;
- mobile trace participates in normal document flow, not absolute background layering;
- only 01 Perfil / 02 Comunidad / 03 Discovery are used;
- no large ghost typography;
- no new copy or claims;
- form remains the dominant focal object;
- reject if the result becomes dashboard-like or generic premium-card styling.
