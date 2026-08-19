# OMNI Foundational Purpose Trial — Highest Impact

Date: 2026-08-19
Baseline: technically validated Unknown Problem candidate + shared evidence harness
Production mutation: **forbidden**
Maximum creative iterations: **2**

## Exact operator brief

> Encuentra la oportunidad perceptual de mayor impacto que todavía quede en Aromia y resuélvela. No asumas que está en Home.

## Preservation contract

Preserve real data, routes, SEO, analytics, accessibility, responsive behavior, performance, product fidelity and product functionality. Do not optimize a proxy metric in place of perceptual impact.

---

## OBSERVE

The controlled catalog screenshot reveals the largest repeated perceptual defect in the current experience: valid fragrances without a trustworthy retrievable image collapse into a generic bottle-outline fallback. The rest of the catalog system—filters, hierarchy, copy, pricing and responsive grid—is coherent, so repeated weak media dominates perceived completeness and trust.

## CANDIDATE COMPARISON

- Home hero depth — important but one surface; dedicated Flat Image case.
- Magazine cover emotional neutrality — important but one editorial surface; dedicated Emotionless Page case.
- Club distinctiveness — important but lower-frequency preview state.
- Catalog fallback imagery — repeated across the primary discovery/comparison grid. **Highest reach × repetition × trust impact.**

## MICROFINDINGS

### `catalog-generic-placeholder-repetition`

- surface: `catalog.product-media`
- severity: **P1 HIGH VALUE**
- disposition: **FIX_NOW**
- notice: missing trustworthy packshots become a generic bottle-outline SVG with little Aromia identity.
- explain: the fallback looks product-like while communicating no verified product distinction. Repeated across the grid, it reads as unfinished inventory.
- judge: highest impact because it repeats across many comparison cards.
- restraint: do not invent bottle geometry, label, package, color or photograph.

## TARGET

**Canonical `/api/catalog-image/[slug]` fallback when no trustworthy retrievable image exists.**

## DIAGNOSE

The existing fallback solves a technical problem but not a perceptual one. A generic bottle pictogram implies a product representation without actually preserving product identity.

## CREATIVE HYPOTHESIS

> If a missing image becomes an explicit editorial index card built only from verified perfume metadata already present in Aromia—name, brand and family—users will read the state as intentional information rather than broken or fake imagery.

## ITERATION 1

Implementation:

- fallback accepts the real perfume record;
- visible metadata is XML-escaped and length-bounded;
- generic bottle silhouette is removed;
- placeholder becomes a restrained Aromia index card using verified name, brand and family;
- state explicitly says `IMAGE PENDING` / `PRODUCT IMAGE NOT VERIFIED`;
- status, cache and `x-aromia-image-origin: placeholder` semantics are preserved;
- real official/catalog/Amazon images remain preferred and unchanged.

### Technical result

`OMNI Foundational Stacked Evidence` run #13: **SUCCESS**.

Evidence artifact:

- ID `9373661427`
- digest `sha256:b037ff9d4ae43d76eda9b2aeab9ce1d08aafa978f201db32fdd867ba257311f9`
- 24 route/viewpoint comparisons accepted.

### Perceptual result

**BETTER — INTERNALLY ACCEPTED.**

The catalog BEFORE shows A*Men as a generic outlined bottle that can be mistaken for a weak or unfinished product rendering. AFTER clearly presents the missing-image state as editorial metadata: the perfume remains identifiable through real catalog information while the absence of verified photography is explicit.

The new state is quieter than real packshots and does not compete with them. It also avoids the more serious failure mode of fabricating a bottle likeness.

Criterion verdicts:

- trust / truthfulness: **BETTER**;
- perceived completeness: **BETTER**;
- product fidelity: **BETTER** because no invented likeness is implied;
- comparison rhythm: **BETTER**;
- brand distinctiveness: **BETTER**;
- technical behavior: **PASS**.

No second creative iteration is justified.

## VERDICT

**INTERNAL FOUNDATIONAL VERDICT: BETTER / ACCEPTED.**

Campaign-wide independent perceptual review is still required before production consolidation. This candidate is not automatically merge-ready solely because internal evidence is positive.
