# AROMIA EDITORIAL v1 — IMPLEMENTATION CHECKPOINT

IMPLEMENTATION: IN_PROGRESS
SURFACE: `/editorial-v1`
PRODUCTION: HOLD

## Implemented in isolated branch

- Living-cover route with Amouage lead and asymmetric Ambroxan/Ropion counterpoints.
- Editorial navigation hypothesis.
- Discovery interruption.
- Three article routes under `/editorial-v1/[slug]`.
- Story-specific composition behavior rather than a single visual template.
- Desktop/mobile CSS compositions.
- `prefers-reduced-motion` baseline inherited on the Editorial v1 surface.
- Semantic visual placeholders/abstract CSS fields instead of fabricated product or documentary assets.

## Deliberately not done

- No `main` merge.
- No production deploy.
- No fake bottle packshots.
- No fabricated Dominique Ropion portrait.
- No fabricated historical Sultan/Guy Robert scene.
- No claim that CSS interpretive material fields are documentary images.

## Important implementation note

The current article route uses condensed implementation copy to establish composition. Canonical editorial drafts remain the source of truth and must be integrated in full by Code before publication. Do not treat the condensed route copy as a replacement draft.

## Next gates

1. Code checkout/build/typecheck/lint on `feat/editorial-v1-implementation`.
2. Render `/editorial-v1` plus all three article routes at desktop and mobile.
3. Replace only approved visual slots with authentic/documentary or explicitly interpretive assets.
4. Browser QA and crop/hierarchy review.
5. Final OMNI only after rendered evidence.

Until those gates pass, status remains `PRODUCTION: HOLD`.

---

## Gate run — 2026-08-31 (Code)

Executed on `feat/editorial-v1-implementation` at `4b57612`. Dev server on an
isolated port; desktop emulated at 1440×900, mobile at 375×812.

### 1. Build / typecheck / lint — PASS
- `next build` (apps/web) completes; `/editorial-v1` and `/editorial-v1/[slug]`
  both appear in the route manifest.
- `tsc --noEmit` clean after clearing a stale `.next/types` tree left by an
  earlier branch (design-lab / magazine/el-coleccionista).
- `next lint` clean.

### 2. Render `/editorial-v1` + 3 article routes, desktop + mobile — DONE
- Living cover renders: Sultán lead + two asymmetric counterpoints with distinct
  episodic palettes (Ámbar = mineral grey; Perfumista = Ropion burgundy) +
  Discovery interruption.
- All three `/editorial-v1/[slug]` routes render: hero + four numbered sections
  with story-specific palettes (section 2 inverts to dark ground), interpretive
  CSS visual areas, no fabricated packshots/portraits/historical scenes.
- Unknown slug → site 404 (`notFound()` works).
- No horizontal overflow at 1440 or 375; no elements wider than viewport.
- Text contrast OK (ink on paper; cream on burgundy in inverted sections).
- `prefers-reduced-motion` guard present; no motion actually introduced (no-op).
- Links are real anchors; browser-default focus rings (no custom focus styles).

### 3. Replace approved visual slots — BLOCKED
No approved authentic/interpretive assets delivered yet (ChatGPT art-direction
for the handoff asset-slot list still pending). Surface keeps explicit semantic
placeholders / abstract CSS fields, as intended.

### 4. Browser QA / crop / hierarchy — PARTIAL. Findings:
- **F1 — Double chrome (blocker for the "isolated surface" intent).** The route
  is wrapped by the global root layout, so the site `NavBar` (sticky, z-50:
  Magazine · Discovery · Academia · Club · theme toggle) and the full site
  `Footer` render around the editorial surface — stacked above `.ev1-nav` and
  below `.ev1-footer` at every breakpoint, and the sticky global header floats
  over the full-bleed editorial hero on scroll. Needs a decision:
  (a) route-group layout that drops root chrome for `/editorial-v1` (zero blast
  radius); (b) conditional hide in the root layout via `usePathname`
  (touches every page); (c) scoped CSS hide (hacky, reversible).
- **F2 — SEO / indexation not set.** No per-route `metadata`, no `robots`
  noindex, no canonical; pages inherit the default site `<title>`/description.
  Recommend `noindex` on the whole `/editorial-v1` subtree while
  `PRODUCTION: HOLD`; final indexation decision at cutover.
- Minor — condensed placeholder copy still in the `[slug]` route (already noted
  above; canonical drafts to be integrated in full before publication).
- Minor — empty `.ev1-story.miniral{}` selector typo in `editorial-v1.css`
  (harmless; the live rule uses `.mineral`).

### 5. Final OMNI — NOT STARTED
Blocked on F1 + approved assets.

`PRODUCTION: HOLD` unchanged.
