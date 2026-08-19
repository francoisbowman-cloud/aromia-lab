# OMNI Foundational Purpose — Consolidated Verdict

Date: 2026-08-19
Production baseline: `78d29e761c66103651cc870411ac21aa5239cf6d`
Candidate branch: `omni/foundational-purpose-consolidated-candidate`
Production mutation: **none**

## Executive state

**INTERNAL CONSOLIDATED VERDICT: BETTER**

**PRODUCTION VERDICT: KEEP DRAFT / DO NOT MERGE YET**

The candidate has passed every currently executable technical and internal perceptual gate. The only remaining campaign-level blocker is the deliberately independent external perceptual review required by the Foundational Purpose contract. No suitable independent visual reviewer is connected in the current environment, so that gate remains `UNVERIFIED` rather than being silently replaced by OMNI judging itself.

---

## What the campaign proved

### 1. Unknown Problem — product-image visibility

Exact operator intent: discover what is wrong without being told where.

OMNI independently found a cross-product perceptual failure: valid product images could be loaded but visually hidden by client loading state. The first remediation was rejected after one real mobile broken-image regression. The second centralized image resolution in the same-origin endpoint and made presentation declarative.

Result:

- loaded-but-invisible product imagery removed across Home, Catalog, Discovery and PDP;
- pre-hydration broken-image race removed;
- real image-source priority preserved;
- terminal absence represented explicitly rather than as broken UI.

Internal technical/perceptual evidence: **strongly positive**.
Independent external perceptual verdict: **UNVERIFIED**.

### 2. Flat Image — Loewe 001 Man Home hero

OMNI selected the Home hero autonomously after controlling for the separate visibility defect.

Diagnosis: beige panel → white image mount → gray source field → bottle created nested planar framing. The first depth treatment added layering but remained too timid and was rejected as `MIXED` despite green workflows.

The second and final allowed iteration:

- preserved the exact source URL and product pixels;
- removed the redundant white wrapper only for explicitly immersive Home hero presentation;
- increased available visual area from 84% to 94% without crop;
- retained Catalog/PDP white-stage controls;
- preserved restrained stage depth and metadata z-order.

Result: **BETTER / ACCEPTED ON ITERATION 2**.

### 3. Emotionless Page — Magazine

OMNI compared primary surfaces and explicitly parked Quiz because it already had strong editorial character. Magazine was selected because its cultural promise—material, memory, desire—was visually embodied by a nearly empty fallback cover.

Intervention used no fabricated photography:

- real article title becomes typographic cover material;
- real category and publication year become edition metadata;
- actionable article card stays foreground;
- audited cover images remain untouched.

Result: **BETTER / ACCEPTED ON ITERATION 1**.

### 4. Highest Impact — catalog missing-image state

OMNI compared candidate opportunities and selected the repeated catalog fallback because it combined reach, repetition and trust impact.

The generic bottle silhouette was removed. A missing verified packshot now becomes an explicit Aromia index card built only from verified perfume metadata, clearly labeled `IMAGE PENDING` / `PRODUCT IMAGE NOT VERIFIED`.

Result: **BETTER / ACCEPTED ON ITERATION 1**.

### 5. Recognizable Brand — Club Aromia

OMNI identified Club as polished but structurally interchangeable with a generic premium waitlist.

Iteration 1 placed a large olfactory trace behind the form. Technical checks passed, but mobile showed ghosted competing text. OMNI rejected the iteration.

Iteration 2 separated identity from function:

- desktop uses a narrow 01/02/03 trace rail outside the form footprint;
- mobile uses a compact in-flow index;
- no ghost typography sits behind readable content;
- existing Perfil / Comunidad / Discovery concepts are reused without new claims.

Result: **BETTER / ACCEPTED ON ITERATION 2**.

Residual mobile concept repetition is **P3 / PARK**; a third creative iteration is both forbidden and unjustified.

---

## Consolidated integration proof

The four accepted product changes were manually assembled on a branch created directly from current `main`, rather than merging experimental branches blindly.

### Required gates

- `v2.0 CI` run #428 — **SUCCESS**
- `Aromia Strict Audit` run #214 — **SUCCESS**
- `OMNI Product Image Fidelity` run #66 — **SUCCESS**
- `OMNI Foundational Consolidated Gate` run #2 — **SUCCESS**

Existing `OMNI Integrated Render Gate` / `Taste Preview Gate` were branch-filtered and skipped; the dedicated consolidated gate was created specifically for this candidate and covers the relevant integrated evidence.

### Consolidated evidence artifact

- artifact: `omni-foundational-consolidated-evidence`
- artifact ID: `9374700569`
- digest: `sha256:d85ba1076a58d657422cc7ffbc9d83a37076bc595ad50de34ee47905af273379`
- coverage: Home, Catalog, Quiz, Discovery, Academia, Club, Magazine and real Loewe PDP
- viewports: 390 / 768 / 1440
- comparisons: **24/24 PASS**
- failures: **0**

### Notable integrated deltas

Desktop Home:

- loaded product images: `5 -> 5`
- loaded-but-invisible: `2 -> 0`
- broken images: `0 -> 0`
- real image responses: `5 -> 5`
- overflow / page errors / console errors: `0`

Desktop Catalog:

- broken images: `1 -> 0`
- loaded product images: `23 -> 24`
- loaded-but-invisible: `6 -> 0`
- real image responses: `23 -> 23`
- placeholder responses: `0 -> 1`
- failed image responses: `1 -> 0`
- console errors: `1 -> 0`

Mobile Catalog:

- loaded-but-invisible: `1 -> 0`
- real image responses: `22 -> 23`
- placeholder responses: `0 -> 1`
- failed image responses: `1 -> 0`
- console errors: `2 -> 0`

Loewe PDP control:

- desktop loaded-but-invisible: `1 -> 0`
- mobile loaded-but-invisible: `1 -> 0`
- real image response preserved: `1 -> 1`
- layout dimensions and product identity remain stable.

Magazine and Club preserve HTTP 200, one H1, zero overflow, zero page errors and zero console errors across tested viewports.

---

## Consolidated perceptual review

Manual inspection of the integrated BEFORE/AFTER evidence shows no cross-case regression among the accepted changes.

### Home / Loewe

**BETTER.** The baseline hero frequently reads as an empty image mount and, when visible, as nested rectangular framing. The candidate reliably exposes the real bottle and reduces the redundant frame. Loewe becomes the first visual anchor rather than an image embedded inside a card.

### Catalog

**BETTER.** Real packshots remain visually dominant. The one unresolved-image example becomes a restrained, truthful editorial state rather than a fake bottle silhouette or broken resource. The grid reads as more complete without pretending that missing photography exists.

### Magazine

**BETTER.** The edition cover becomes an authored publication object using the article itself as visual material. The change adds editorial tension without fabricated imagery.

### Club

**BETTER.** Desktop gains a recognizable Aromia index/trace device. Mobile keeps that signal in normal flow with no overlap or ghosted content; the waitlist remains the functional focal point.

### PDP control

**PRESERVED / BETTER RELIABILITY.** Product presentation remains canonical; Loewe source identity is unchanged and is now reliably visible.

---

## Perceptual maturity evidence

The campaign produced direct behavioral evidence for the five maturity abilities now formalized in OMNI:

- **NOTICE** — discovered invisible-valid product imagery, nested Loewe framing, Magazine emotional void, generic catalog fallback and Club interchangeability from ambiguous briefs.
- **EXPLAIN** — produced causal hypotheses before implementation rather than styling rationales after the fact.
- **JUDGE** — compared surfaces and explicitly parked strong/irrelevant areas such as Quiz.
- **IMPROVE** — delivered internally positive AFTER states across four independent perceptual constructs.
- **RESTRAIN** — rejected Flat Image iteration 1 as too timid, rejected Club iteration 1 as perceptually worse despite green CI, preserved product pixels, refused fabricated imagery and refused unnecessary third iterations.

This is materially stronger evidence of the founding design-OS behavior than architectural readiness alone.

---

## NOW / NEXT / PARK

### NOW

- preserve PR #103 as the single consolidated candidate and source of truth for the campaign;
- preserve all evidence artifacts/digests and rejected attempts;
- obtain a genuinely independent blinded perceptual review before production merge.

### NEXT

- run the same benchmark family on a second product/project to test generalization rather than Aromia-specific memorization;
- evaluate whether subtle P2/P3 microfindings are consistently noticed even when OMNI correctly chooses not to modify them;
- add a durable external-review hook when an independent perceptual evaluator becomes available.

### PARK

- new Perception Director;
- Meta Director;
- additional visual architecture;
- automatic production merge based only on internal OMNI evidence;
- compulsive polish of low-severity findings.

No repeated evidence currently justifies those architecture additions.

---

## Final release decision

**Candidate quality: INTERNALLY BETTER.**

**Technical integration: PASS.**

**Product fidelity: PASS.**

**Independent external perceptual review: UNVERIFIED.**

**Production merge: BLOCKED BY CONTRACT.**

Do not weaken that final gate merely because the current candidate looks strong. The campaign was designed specifically to prevent OMNI from self-certifying its own perceptual success.
