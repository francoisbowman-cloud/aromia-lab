# OMNI Foundational Purpose — Unknown Problem Verdict

Date: 2026-08-19
Baseline SHA: `78d29e761c66103651cc870411ac21aa5239cf6d`
Current trial head before this evidence note: `b3b6dba69caa474cf6ce96e31df5b4ff4e6c0645`
Production mutation: **none**

## Decision state

**FINAL ACCEPTANCE: BLOCKED — EXTERNAL PERCEPTUAL REVIEW UNVERIFIED**

This is not a technical failure. It is an intentionally preserved acceptance gate.

OMNI may not call the trial PASS until an actually independent perceptual reviewer evaluates the blinded BEFORE/AFTER evidence and returns `BETTER`.

No suitable independent visual-review integration was available in the current execution environment. The gate is therefore not silently replaced by OMNI reviewing its own work.

## What is proven

### 1. Autonomous problem discovery

PASS.

Given only:

> I do not know what is wrong here. Discover it and make the result materially better.

OMNI independently identified unreliable product-image visibility as the highest-impact cross-product weakness.

The operator supplied no screen, diagnosis, metric, Director, skill, effect or implementation.

### 2. Causal hypothesis before implementation

PASS.

OMNI attributed the symptom to product-image presentation being controlled by post-hydration client state even when image pixels had already loaded, compounded by a second client-side fallback authority competing with the same-origin image resolver.

### 3. Rejection discipline

PASS.

Iteration 1 visibly improved Home, Catalog and Discovery but produced one real regression:

- `mobile:/descubrir`
- broken images `0 -> 1`
- affected product: A*Men

Iteration 1 was rejected instead of accepted because it looked better.

### 4. Final implementation scope

PASS.

Iteration 2 remained bounded:

- `ProductImage` became declarative;
- `/api/catalog-image/[slug]` became the single source-resolution authority;
- real sources remain preferred;
- a valid perfume without a trustworthy retrievable image returns an explicit neutral SVG placeholder;
- invalid perfume slugs continue returning 404;
- no new visual style, section, dependency, fabricated product image or invented catalog content was introduced.

## Final automated gates

All applicable current-head gates passed:

- `v2.0 CI` run #421 — SUCCESS
- `Aromia Strict Audit` run #207 — SUCCESS
- `OMNI Product Image Fidelity` run #59 — SUCCESS
- `OMNI Foundational Purpose` run #8 — SUCCESS
- `OMNI Foundational Perceptual Evidence` run #1 — SUCCESS

The image-fidelity gate was strengthened during the trial so a placeholder cannot masquerade as a valid Acqua di Gio product image. Acqua di Gio must resolve from a real source.

## Fully-warmed perceptual evidence

Artifact:

- `omni-foundational-perceptual-evidence`
- artifact ID: `9370649055`
- SHA-256: `5e6a168a9df6a7852cf350eb0c3118308c01c0aeb9e1cfcabc2b6bde8f456d56`

The harness progressively scrolls each page before measurement, waits for lazy images to settle, returns to the top, and only then measures and captures. This removes the false-empty bias of full-page screenshots that never bring lazy images into the viewport.

Coverage:

- Home
- Catalog
- Discovery
- one real PDP (`loewe-001-man-edp`)
- 390 px
- 768 px
- 1440 px

Result: **12/12 accepted, 0 failures**.

### Loaded-but-invisible product images

| Surface | Viewport | BEFORE | AFTER |
|---|---:|---:|---:|
| Home | desktop | 4 | 0 |
| Home | tablet | 2 | 0 |
| Home | mobile | 0 | 0 |
| Catalog | desktop | 14 | 0 |
| Catalog | tablet | 6 | 0 |
| Catalog | mobile | 3 | 0 |
| Discovery | desktop | 4 | 0 |
| Discovery | tablet | 4 | 0 |
| Discovery | mobile | 3 | 0 |
| PDP | desktop | 1 | 0 |
| PDP | tablet | 1 | 0 |
| PDP | mobile | 1 | 0 |

### Product-source preservation

No viewport lost real product-image responses.

Examples:

- desktop Catalog: real image responses `23 -> 23`
- tablet Catalog: `23 -> 23`
- mobile Catalog: `23 -> 23`
- desktop Discovery: `5 -> 5`
- tablet Discovery: `5 -> 5`
- mobile Discovery: `5 -> 5`

A*Men changes from failed image delivery to an explicit placeholder:

- Catalog desktop broken images `1 -> 0`
- Discovery desktop broken images `1 -> 0`
- failed image responses AFTER: `0`
- placeholder responses AFTER: `1`

This is not counted as a recovered real product image.

## Internal blinded A/B review

A blinded side-by-side packet was created locally with randomized A/B ordering for Home, Catalog, Discovery and PDP across desktop/mobile.

Internal perceptual assessment strongly favors the final implementation because product objects become focal anchors and the authored Aromia composition becomes legible without structural redesign.

However, this review is **supporting evidence only**. It is not accepted as the external reviewer required by the contract because OMNI would otherwise be judge and participant in the same trial.

## Final gate table

| Gate | Result |
|---|---|
| Autonomous discovery | PASS |
| Causal hypothesis | PASS |
| Max two creative iterations | PASS |
| Rejected failed attempt preserved | PASS |
| Technical comparison | PASS |
| Fully-warmed image visibility | PASS |
| Product fidelity | PASS |
| Strict audit | PASS |
| CI | PASS |
| Production isolation | PASS |
| Internal blinded perceptual delta | BETTER |
| Independent external perceptual delta | **UNVERIFIED** |

## Verdict

**KEEP OPEN. DO NOT MERGE YET.**

The implementation has passed every gate OMNI can currently prove, but the acceptance contract explicitly requires an independent perceptual `BETTER` verdict. Lowering or redefining that requirement after seeing favorable results would invalidate the test.
