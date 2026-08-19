# OMNI Foundational Purpose Trial — Unknown Problem

Date: 2026-08-19
Baseline SHA: `78d29e761c66103651cc870411ac21aa5239cf6d`
Production mutation: **forbidden**
Maximum creative implementation iterations: **2**

## Exact operator brief

> I do not know what is wrong here. Discover it and make the result materially better.

## Forbidden operator hints

The operator does not identify:

- diagnosis
- metric
- screen or route
- scope
- capability / Director / skill
- visual style or effect
- implementation
- solution

## Preservation contract

OMNI must preserve unless the evidence itself proves a change is necessary:

- real product/catalog data
- product identity and imagery fidelity
- routes
- SEO
- analytics
- accessibility
- responsive behavior
- performance
- functional behavior
- existing Aromia identity

## Acceptance contract

A technically green result is insufficient.

The trial may be accepted only when:

1. OMNI independently identifies the problem and scope;
2. it records a causal creative/experience hypothesis before implementation;
3. it selects its own capabilities;
4. BEFORE and AFTER are rendered at 390, 768 and 1440 px;
5. technical gates do not regress;
6. an external perceptual review returns `BETTER`, not `MIXED`, `WORSE` or `UNVERIFIED`;
7. preservation evidence is explicit;
8. rejected attempts remain in the evidence packet rather than being rewritten away.

If the second creative implementation iteration still does not produce `BETTER`, the trial is recorded as FAIL. No third implementation is allowed merely to win by brute force.

---

## OBSERVE — official BEFORE

Workflow: `OMNI Foundational Purpose` run #1
Artifact: `omni-foundational-purpose-evidence`
Artifact SHA-256: `d2468d69b9d9735a9ea8d7050861057d5821237dc94c4490a2e02ff91ecba7ef`
Evidence: 24 BEFORE screenshots + 24 control AFTER screenshots + `report.json` across Home, Catalog, Quiz, Discovery, Academia, Club, Magazine and one real PDP at 390 / 768 / 1440 px.

The branch had no UI change at this stage, so BEFORE and control AFTER are intentionally the same product state.

### Perceptual observation

The strongest cross-product weakness is product-image presentation, not Home composition, typography, navigation or catalog depth.

- Home hero shows a large loading/skeleton stage instead of the perfume object.
- Home editorial product and multiple selection cards show the same visually empty loading stage.
- Catalog renders many large pale stages; only a minority of first-view products are visibly present in the screenshot.
- Discovery has the same pattern across recommendation cards.
- The real PDP hero for `loewe-001-man-edp` displays a loading stage instead of the bottle.
- Editorial/lifestyle imagery elsewhere on Home renders correctly, so the problem is concentrated in product imagery rather than global image delivery.

### Technical observation that explains the perceptual symptom

`report.json` shows many product `<img>` elements with valid `naturalWidth` / `naturalHeight` even when their screenshots remain visually covered by the loading stage. For example, the desktop catalog contains valid natural dimensions for Loewe 001 Man, 001 Woman, 1 Million, 212 VIP, Acqua di Gio, Dior Addict and many others while the screenshot still presents many of those card stages as empty.

The baseline `ProductImage` coupled visual visibility to React state:

- the `<img>` remained `opacity-0` until `status === "ready"`;
- a mount/source `useEffect` reset status to `loading`;
- if an image loaded before hydration or event ordering raced with that reset, valid pixels could remain hidden behind the skeleton;
- the direct-fallback path could also return to the failed proxy because source choice was derived from load status.

This explains why historical technical gates could report `brokenImages: 0` while a human still saw visually empty product stages.

## DIAGNOSE

**Primary problem:** Aromia's most important visual object — the perfume bottle — is not reliably visible even when the image data has loaded successfully.

This is a transversal perceptual failure because it affects the Home hero, catalog browsing, Discovery recommendations and PDP product identity. It directly weakens trust, desirability, editorial rhythm and product recognition.

The issue is higher impact than another stylistic redesign because correcting it restores existing authored visual intent across several surfaces without changing Aromia's identity.

## CREATIVE / EXPERIENCE HYPOTHESIS

> If product-image rendering stops depending on post-hydration client load events, while source resolution and fail-safe fallback are centralized in the same-origin image endpoint, Aromia will recover product salience across core surfaces without arbitrary redesign.

Expected perceptual delta:

- focal hierarchy: BETTER — product objects become real focal anchors;
- image/product salience: BETTER — bottles replace pale skeleton fields;
- atmosphere/emotion: BETTER — existing editorial layouts regain contrast between product and space;
- narrative rhythm: BETTER — image/text alternation becomes intentional rather than interrupted by empty media stages;
- brand distinctiveness: BETTER or neutral — Aromia's existing art direction is restored, not replaced;
- preservation/identity: BETTER — verified product identity becomes visible while geometry/content/layout stay intact.

## CAPABILITY SELECTION

OMNI selects:

- **Render / evidence** to prove the symptom and re-render AFTER;
- **Visual Director / Taste** for perceptual salience and non-decorative intervention judgment;
- **UI implementation** for bounded product-image presentation logic;
- **Product Image Fidelity / Strict Audit / v2 CI** as preservation gates.

No new section, visual style, effect, dependency or invented content is justified.

## ITERATION 1 — REJECTED

### Intervention

`ProductImage` stopped hiding valid images behind JS-controlled opacity and introduced persistent proxy → direct fallback state.

### Positive perceptual evidence

Iteration 1 immediately restored important product objects:

- Home hero: Loewe 001 Man became visible.
- Catalog first row: Loewe 001 Man, Loewe 001 Woman, 1 Million and 212 VIP became visible together instead of mostly skeletons.
- Discovery gained visible product imagery that was previously hidden.

### Why rejected

Foundational Purpose run #3 produced **23/24 technical PASS and 1 technical FAIL**.

Failure:

`mobile:/descubrir` — `broken images 0 -> 1`

The failed product was A*Men. Its same-origin proxy returns 404 when no trustworthy image can be resolved. The browser can emit that error before React hydration attaches `onError`, leaving the broken-image glyph/alt text visible. This is a real pre-hydration failure, not a flaky metric.

Therefore Iteration 1 is **REJECTED** despite its strong visual improvement.

Evidence artifact: `omni-foundational-purpose-evidence`, artifact ID `9369518584`, SHA-256 `e0f483fc23c560d303b37e160b152781c6b463c77bacbf60fe43e0b0fe8e11da`.

## ITERATION 2 — FINAL ALLOWED ITERATION

### Revised root cause

The system had two competing source/fallback authorities:

1. `/api/catalog-image/[slug]` already resolves official, catalog and governed Amazon sources;
2. `ProductImage` attempted its own post-hydration source/fallback state machine.

That duplication created both the hidden-valid-image race and the broken-image pre-hydration race.

### Intervention

- `ProductImage` becomes declarative: it renders only the same-origin catalog-image endpoint and no longer owns source/fallback state.
- The image endpoint remains the sole resolver for official/catalog/Amazon product sources.
- If a valid perfume has no trustworthy retrievable packshot, the endpoint returns a neutral bottle placeholder as a valid SVG image resource with `x-aromia-image-origin: placeholder` rather than an HTTP 404.
- Invalid perfume slugs still return 404.
- Real/verified imagery remains preferred; placeholder is only the terminal fail-safe.

### Acceptance requirements

Iteration 2 must now prove all of the following:

- 24/24 technical comparisons PASS;
- no broken-image regression;
- real product images visible on Home/Catalog/Discovery/PDP where resolvable;
- unavailable A*Men renders a deliberate neutral placeholder rather than broken UI;
- v2 CI PASS;
- Strict Audit PASS;
- external perceptual verdict = BETTER;
- no production deployment during the trial.
