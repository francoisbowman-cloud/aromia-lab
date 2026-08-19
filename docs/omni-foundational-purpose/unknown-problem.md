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

Current `ProductImage` couples visual visibility to React state:

- the `<img>` remains `opacity-0` until `status === "ready"`;
- a mount/source `useEffect` resets status to `loading`;
- if a source has already loaded or the event ordering races with that reset, valid pixels can remain hidden behind the skeleton;
- the direct-fallback path can load successfully, set `ready`, and then cause the component to render the original proxy source again because source choice is derived from `status` rather than persistent source selection.

This explains why historical technical gates could report `brokenImages: 0` while a human still saw visually empty product stages.

## DIAGNOSE

**Primary problem:** Aromia's most important visual object — the perfume bottle — is not reliably visible even when the image data has loaded successfully.

This is a transversal perceptual failure because it affects the Home hero, catalog browsing, Discovery recommendations and PDP product identity. It directly weakens trust, desirability, editorial rhythm and product recognition.

The issue is higher impact than another stylistic redesign because correcting it restores existing authored visual intent across several surfaces without changing Aromia's identity.

## CREATIVE / EXPERIENCE HYPOTHESIS

> If `ProductImage` stops treating React loading state as the authority for whether valid product pixels may be visible, and instead persists the active image source through a one-way proxy → direct fallback → placeholder sequence, Aromia will recover product salience across core surfaces without any arbitrary redesign.

Expected perceptual delta:

- focal hierarchy: BETTER — product objects become real focal anchors;
- image/product salience: BETTER — bottles replace pale skeleton fields;
- atmosphere/emotion: BETTER — existing editorial layouts regain contrast between product and space;
- narrative rhythm: BETTER — image/text alternation becomes intentional rather than interrupted by empty media stages;
- brand distinctiveness: BETTER or neutral — Aromia's existing art direction is restored, not replaced;
- preservation/identity: BETTER — actual product identity becomes visible while geometry/content/layout stay intact.

## CAPABILITY SELECTION

OMNI selects:

- **Render / evidence** to prove the symptom and re-render AFTER;
- **Visual Director / Taste** for perceptual salience and non-decorative intervention judgment;
- **UI implementation** for the bounded `ProductImage` state fix;
- **Product Image Fidelity / Strict Audit / v2 CI** as preservation gates.

No new section, visual style, effect, dependency or invented content is justified.

## ITERATION 1 PLAN

Change only the shared `ProductImage` source-state behavior:

1. persist the selected source independently of loaded/ready state;
2. do not hide a valid `<img>` behind JS-controlled opacity while waiting for state synchronization;
3. on proxy error, move once to a valid direct image URL when available;
4. if direct fallback also fails, move once to the existing accessible placeholder;
5. preserve loading mode, sizing, hover behavior, alt text, fidelity and same-origin proxy preference;
6. rerun the exact BEFORE/AFTER evidence workflow and all applicable CI gates.
