# OMNI Foundational Purpose Trial — Emotionless Page

Date: 2026-08-19
Baseline: technically validated Unknown Problem candidate + shared evidence harness
Production mutation: **forbidden**
Maximum creative iterations: **2**

## Exact operator brief

> Esta página funciona, pero no me hace sentir nada. Encuentra cuál de las superficies principales de Aromia tiene ese problema con mayor claridad y arréglala sin convertirla en un rediseño arbitrario.

## Operator does not specify

- route or section
- emotion to manufacture
- aesthetic direction
- layout pattern
- animation/effect
- Director / skill
- implementation

## Preservation contract

Preserve real data, routes, SEO, analytics, accessibility, responsive behavior, performance, product identity and Aromia's existing design language.

## Acceptance

OMNI must independently choose the surface, distinguish emotional flatness from technical defects, write a causal hypothesis before editing, make at most two bounded iterations, preserve rejected attempts, and prove a materially BETTER perceptual result. Technical PASS alone is insufficient.

---

## OBSERVE

The technically validated Case 1 evidence packet provides a clean baseline across Home, Catalog, Quiz, Discovery, Academia, Club, Magazine and a real PDP. The current stacked evidence run is retained as a fresh confirmation, but target selection does not depend on speculative implementation.

### Candidate comparison

- **Quiz** — strong editorial asymmetry, clear question hierarchy and distinctive first-person framing. Intervention would risk damaging a surface that already has character. **PARK / restraint.**
- **Home** — strong contrast between product, olfactive index, dark editorial selection and atmospheric photography. It contains local issues but is not the clearest example of emotional emptiness. **MONITOR.**
- **Discovery** — strong narrative language and route metaphor; product visibility was the dominant prior defect rather than lack of emotional framing. **MONITOR.**
- **Academia** — highly informative but intentionally didactic. Its utility density is a separate design question, not the clearest emotional failure. **NEXT.**
- **Club** — intentionally restrained because the product is not open yet; sparse visual treatment supports a preview/waitlist state even if it can later become more distinctive. **NEXT.**
- **Magazine** — strongest mismatch between promise and visual delivery. It calls itself a journal about material, memory and desire, but the edition cover is primarily an abstract pale field plus a surface card. The typography is good; the emotional anchor is weak. **NOW.**

## MICROFINDINGS

### `magazine-cover-sensory-void`

- surface: `magazine.cover`
- severity: **P1 HIGH VALUE**
- disposition: **FIX_NOW**
- notice: the cover stage reads like a placeholder rather than the visual center of a perfume journal.
- explain: the page's strongest emotional promise is delegated to a low-information gradient field; the cover article title appears only inside a conventional card near the bottom, so the page never builds editorial tension between idea, material and story.
- judge: this matters because Magazine is explicitly the brand's cultural/editorial surface; emotional neutrality here weakens the exact role of the page.
- restraint: do **not** introduce an unaudited/generated perfume photograph simply to manufacture atmosphere.

### `quiz-editorial-character`

- surface: `quiz`
- severity: **P4 COSMETIC NOISE / no actionable defect**
- disposition: **PARK**
- decision: preserve the asymmetric editorial composition; do not redesign a strong surface merely because the benchmark demands a change somewhere.

### `academia-utility-density`

- surface: `academia`
- severity: **P2 NOTICEABLE**
- disposition: **MONITOR**
- decision: useful candidate for a separate hierarchy/rhythm study, but lower fit for the present emotional-flatness construct.

## TARGET

**Magazine cover / current edition hero.**

## DIAGNOSE

The problem is not insufficient decoration. It is a mismatch between **editorial promise** and **editorial embodiment**.

The current cover has strong surrounding typography, but the visual object that should behave like a magazine cover is nearly contentless. Because the fallback scene contains no audited image, the implementation presents a neutral atmospheric gradient. That is safe, but perceptually it behaves like an empty-state background rather than a designed publication cover.

## CREATIVE / EXPERIENCE HYPOTHESIS

> If the cover fallback is transformed from a generic atmospheric field into a typographic publication object built only from the real article's existing title/category/date, Magazine can gain tension, materiality and memorability without inventing imagery or changing the information architecture.

The intervention will use the **article itself as the visual material**:

- oversized cropped title as background typography;
- real category and publication date as edition metadata;
- current article card remains the accessible actionable foreground;
- no fabricated product photograph;
- no new marketing copy;
- no new section;
- no navigation or content changes.

Expected delta:

- atmosphere/emotion: BETTER;
- narrative rhythm: BETTER;
- brand distinctiveness: BETTER;
- focal hierarchy: BETTER;
- accessibility/content truth: preserved;
- architecture/SEO/data: unchanged.

## ITERATION 1 PLAN

Modify only the fallback state of `MagazineCoverStory` when no audited cover image is available. Existing audited cover images remain untouched. Render mobile/tablet/desktop and reject if the typographic field becomes noisy, competes with the actionable title, reduces readability or looks like generic fashion-magazine decoration.
