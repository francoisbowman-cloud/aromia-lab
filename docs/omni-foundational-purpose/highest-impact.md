# OMNI Foundational Purpose Trial — Highest Impact

Date: 2026-08-19
Baseline: technically validated Unknown Problem candidate + shared evidence harness
Production mutation: **forbidden**
Maximum creative iterations: **2**

## Exact operator brief

> Encuentra la oportunidad perceptual de mayor impacto que todavía quede en Aromia y resuélvela. No asumas que está en Home.

## Operator does not specify

- screen, route or flow
- diagnosis
- metric
- Director / skill
- visual style
- implementation

## Preservation contract

Preserve real data, routes, SEO, analytics, accessibility, responsive behavior, performance, product fidelity and product functionality. Do not optimize a proxy metric in place of perceptual impact.

## Acceptance

OMNI must discover scope autonomously, compare candidate opportunities, justify why one outranks the others, write a causal hypothesis before implementation, use at most two iterations, preserve rejected attempts, and prove a materially BETTER outcome. Green CI alone cannot pass the trial.

---

## OBSERVE

The controlled catalog screenshot reveals the largest repeated perceptual defect in the current experience: many valid fragrance cards have either a generic bottle-outline fallback or visually near-empty media fields. The rest of the catalog system—filters, hierarchy, copy, pricing and responsive grid—is coherent. The repetition of weak media therefore dominates the page more than any single isolated layout issue elsewhere.

## CANDIDATE COMPARISON

- Home hero depth — important, but one surface only; covered by the dedicated Flat Image case.
- Magazine cover emotional neutrality — important, but one editorial surface; covered by Emotionless Page.
- Club brand distinctiveness — important, but lower-frequency and currently a preview state.
- Catalog fallback imagery — repeated across the primary commercial/discovery grid and encountered before users can compare many fragrances. **Highest reach × highest repetition × high trust impact.**

## MICROFINDINGS

### `catalog-generic-placeholder-repetition`

- surface: `catalog.product-media`
- severity: **P1 HIGH VALUE**
- disposition: **FIX_NOW**
- notice: missing trustworthy packshots collapse into a generic bottle-outline SVG with little Aromia identity.
- explain: the fallback visually pretends to be product-like while communicating almost no useful distinction. Repeated across the grid, it creates large low-information rectangles that make the catalog feel unfinished even though the product data is real.
- judge: this is the highest-impact perceptual opportunity because the defect repeats across many cards and directly affects trust during comparison.
- restraint: do not invent a bottle, label, cap, package, color or product photograph. Missing imagery must remain explicitly non-photographic and truthful.

## TARGET

**The canonical `/api/catalog-image/[slug]` fallback returned when no trustworthy retrievable product image exists.**

## DIAGNOSE

The current placeholder solves a technical problem—valid image response, no broken glyph—but not the perceptual problem. It uses a generic bottle pictogram, so it neither preserves product identity nor provides an intentional Aromia editorial state.

## CREATIVE / EXPERIENCE HYPOTHESIS

> If a missing product image becomes an explicit editorial index card built only from verified perfume metadata already present in Aromia—name, brand and family—users will read the state as intentional information rather than a broken or fake product image.

This is not a replacement packshot. It is a truthful **catalog placeholder**.

Expected delta:

- perceived completeness: BETTER;
- trust: BETTER because absence is explicit rather than simulated;
- brand distinctiveness: BETTER;
- comparison rhythm: BETTER;
- product fidelity: preserved because no bottle likeness is fabricated;
- API semantics: unchanged (still a valid image resource with `x-aromia-image-origin: placeholder`).

## ITERATION 1 PLAN

Change only `placeholderResponse` in the canonical catalog-image route:

1. accept the real perfume record;
2. safely XML-escape visible metadata;
3. render an editorial field with `AROMIA / IMAGE PENDING`, verified brand/name/family and a restrained index-line motif;
4. remove the fake bottle silhouette;
5. preserve status, caching and provenance headers.

Reject if the placeholder can be mistaken for official packaging, becomes visually louder than real packshots, leaks unsafe markup or makes cards harder to scan.
