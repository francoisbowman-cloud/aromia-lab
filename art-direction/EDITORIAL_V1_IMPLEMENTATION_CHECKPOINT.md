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
Blocked on approved assets (F1 now resolved).

`PRODUCTION: HOLD` unchanged.

---

## Gate run — 2026-08-31 (Code) — F1/F2 fix + Gate 4 re-run

Brey approved F1 option (a) + noindex. Changes on this branch (no push):

- **`apps/web/src/app/editorial-v1/layout.tsx` (new).** Nested segment layout:
  - `metadata.robots = { index: false, follow: false }` + `alternates.canonical
    = "/"`, mirroring `app/taste/layout.tsx`. Applies to the whole
    `/editorial-v1` subtree (home + `[slug]`).
  - Renders a scoped `<style>` that sets `body > header, body > footer {
    display: none !important }`. It mounts only while an `/editorial-v1` route
    is active and unmounts on navigation away, so no other route loses its
    chrome. Root `app/layout.tsx` is untouched — zero blast radius.
- **`editorial-v1.css`** — removed the empty `.ev1-story.miniral{}` selector.

### Gate 4 re-run — PASS (desktop 1440 + mobile 375)
- Exactly one nav (`.ev1-nav`) and one footer (`.ev1-footer`) per route; global
  `body > header` / `body > footer` computed `display:none`, height 0.
- `<meta name="robots" content="noindex, nofollow">` present on `/editorial-v1`
  and all three `/editorial-v1/[slug]` routes (curl-verified).
- No horizontal overflow at 1440 or 375; no elements wider than viewport.
- `docH` dropped ~560px on the home route (global footer gone); layout otherwise
  unchanged.
- Inverted story `section-2` still `rgb(42,13,22)` ground with cream text;
  episodic palettes per story intact.
- No console errors.

Remaining before production: gate 3 (approved assets), full canonical-draft copy
in `[slug]`, gate 5 (OMNI on rendered evidence). `PRODUCTION: HOLD`.

### Relay left for the next actor
`art-direction/EDITORIAL_V1_RELAY_CODE_TO_CHATGPT.md` — hands the surface to
ChatGPT for art direction of the visual slots (Gate 3). It maps every named
asset slot to its exact code location, restates the no-fabrication constraints,
and lists the Code sequence to run once assets land (wire assets, swap in full
canonical `drafts/` copy, re-run gates 2+4, then Gate 5 OMNI).

---

## Gate run — 2026-08-31 (Code) — canonical copy in + Gate 3 slot plumbing

Reviewed `art-direction/EDITORIAL_V1_GATE3_CHATGPT_DECISIONS.md` (locked at
`d5fdbf3`). Its own status is `GATE_3: WAITING_FOR_REMOTE_BINARIES` — and
confirmed: **no approved asset binary exists anywhere in the repo/branch**
(`public/editorial-v1/` absent; nothing tracked or untracked). So Gate 3 stays
blocked and Gate 5 cannot start. Code did the unblocked half:

### Full canonical copy — DONE
- `apps/web/src/app/editorial-v1/[slug]/page.tsx` rewritten: the condensed
  placeholder copy is replaced with the **verbatim** text of the three
  `drafts/*.md` (fact-checked, `estado: editorial_ready`). Each story now has a
  drop-cap intro, its real subheads with full multi-paragraph prose, the
  "Sí, pero" close, and a subordinate commerce block with the drafts' own
  Amazon affiliate links (`tag=aromialab-20`, `rel="sponsored nofollow"`).
- `generateStaticParams` added → the 3 routes prerender (SSG); unknown slug
  still 404s.
- Markdown emphasis markers from the drafts (`*cœur*`, `*The Gift of Kings*`,
  `*Nota…*`) rendered as plain text, not literal asterisks.

### Gate 3 slot plumbing — DONE (dormant until binaries land)
- New `apps/web/src/app/editorial-v1/editorialV1Visuals.tsx`: a `VisualField`
  component + `EDITORIAL_V1_SLOTS` registry encoding ChatGPT's locked decisions
  (type, alt, caption, provenance line, placeholder label) for the six USE
  slots. Every slot is `present: false` → renders the CSS placeholder box with
  an explicit `role="img"` + descriptive `aria-label`; **no `next/image` is
  emitted**, so a missing file cannot break the build. Wiring an approved asset
  = drop the file under `apps/web/public/editorial-v1/`, set `present: true`
  and `file`.
- Slot placement (per the relay map + Gate 3 doc):
  - Ámbar: hero `.story-visual` = `ambroxan-material-interpretive`;
    section-2 interruption = `clary-sage-documentary`.
  - Ropion: hero `.story-visual` = `ropion-overdose-interpretive`
    (portrait + historical evidence = SKIP, so no interruption slot).
  - Sultán: hero `.story-visual` = `amouage-material-density-interpretive`;
    section-1 interruption = `frankincense-documentary`;
    section-2 interruption = `oman-place-documentary`.
  - Home `/editorial-v1`: `.ev1-resin` = `amouage-material-density-interpretive`
    (marker kept); the two `.ev1-material` = ambroxan / ropion interpretive.
- CSS: added drop-cap + `.story-intro` + `.story-commerce` styles, paragraph
  spacing for multi-`<p>` sections, `position:relative;overflow:hidden` on the
  image boxes, `.ev1-figcaption`, and a faint hatch on empty documentary slots
  so reserved space reads as intentional.

### Gate 2 + Gate 4 re-run — PASS (desktop 1440 + mobile 375)
- Build / tsc / lint clean; 3 story routes prerender.
- `noindex, nofollow` on all 4 routes; single nav + single footer; global
  chrome still `display:none`.
- No horizontal overflow at 1440 or 375; no elements wider than viewport.
- Para counts match the drafts exactly (Ámbar 5 sections `[2,4,3,3,2]`,
  Ropion 4, Sultán 4); drop cap renders; commerce links carry
  `rel="sponsored nofollow"`.
- Inverted Ropion `section-2`: cream `rgb(244,240,232)` on burgundy
  `rgb(42,13,22)` — legible with full multi-paragraph copy.
- Sultán's two consecutive interruption slots (~2000px apart) do not collide.
- No console errors.

### Still blocking
1. **Gate 3 binaries** — one of:
   - ChatGPT commits the 3 approved interpretive JPGs
     (`ambroxan-resin-abstract-01`, `ropion-bordeaux-texture-01`,
     `amouage-mineral-density-01`) under `apps/web/public/editorial-v1/`; and/or
   - Brey authorises Code to download the 3 approved Wikimedia Commons
     documentary files (Salvia sclarea / Jabal Akhdar / Boswellia sacra) from
     the exact source pages in the Gate 3 doc, preserving CC BY-SA provenance.
2. Then: flip the relevant `EDITORIAL_V1_SLOTS[...]` to `present: true`, run the
   image authenticity/provenance audit, re-run Gate 4, then **Gate 5 OMNI** on
   rendered evidence.

`PRODUCTION: HOLD` unchanged. No merge, no deploy.

---

## Gate run — 2026-08-31 (Code) — documentary assets wired

Brey authorised the download. The three approved Wikimedia Commons documentary
files were fetched from the exact source pages in the Gate 3 doc and committed
under `apps/web/public/editorial-v1/`:

| file | source | author | licence | px |
|---|---|---|---|---|
| `clary-sage-documentary.jpg` | `File:Salvia_sclarea_001.JPG` | Llez | CC BY-SA 3.0 / GFDL | 1309×1746 |
| `oman-place-documentary.jpg` | `File:Landscape_of_Jabal_Akhdar,_Oman.jpg` | Ontheroadom | CC BY-SA 4.0 | 1920×1080 |
| `frankincense-documentary.jpg` | `File:Boswellia_sacra_kz05.jpg` | Krzysztof Ziarnek (Kenraiz) | CC BY-SA 4.0 | 1920×1440 |

- `EDITORIAL_V1_SLOTS` for those three slots → `present: true` (+ `file`,
  `width`/`height`, `caption`, `provenance`). `VisualField` now renders a
  documentary slot as an intrinsic `next/image` with the provenance caption in
  **normal flow below** the image (not the clipped overlay), so the attribution
  is always fully legible. On desktop the documentary figure spans the full
  section width (`grid-column: 1/-1`, `max-height: 72vh`, `object-fit: cover`);
  on mobile it stays edge-to-edge.
- The three **interpretive** slots (`ambroxan-material-interpretive`,
  `ropion-overdose-interpretive`, `amouage-material-density-interpretive`) stay
  `present: false` — ChatGPT's generated JPGs are not in the repo yet. They keep
  rendering the CSS placeholder with `role="img"` + label.

### Image authenticity / provenance audit — PASS (for the wired assets)
- All three are real photographs of the named subject (identifiable
  `Salvia sclarea`; `Boswellia sacra` resin macro in Dhofar; Jabal Akhdar
  terrain — not a desert-cliché stock shot).
- Each carries a visible caption naming subject + author + Wikimedia Commons +
  licence; `provenance` (source URL + author + licence) is recorded in
  `editorialV1Visuals.tsx`.
- No fabricated portrait, packshot or historical scene introduced.

### Gate 2 + Gate 4 re-run — PASS (desktop 1440 + mobile 375)
- tsc / lint / build clean; 3 story routes prerender.
- Documentary images load through `/_next/image` (verified 200/304); captions
  legible and unclipped at both widths; clip-path removed on present figures.
- `noindex, nofollow` on all 4 routes; single nav + single footer; global
  chrome `display:none`.
- No horizontal overflow at 1440 or 375; no elements wider than viewport.
- Portrait clary-sage clamps to a 1166×648 band on desktop (`object-fit: cover`),
  no runaway height; full-bleed on mobile with caption below.
- Only console 404 is a dev-only HMR `hot-update.json` (not a page error).

### Image-count status vs Gate 3 lock
| story | locked | present now | missing |
|---|---|---|---|
| Ámbar | 2 | 1 (clary-sage) | hero interpretive |
| Ropion | 1 | 0 | hero interpretive |
| Sultán | 3 | 2 (frankincense, oman) | hero interpretive |

### Still blocking
1. **ChatGPT's 3 interpretive JPGs** — `ambroxan-resin-abstract-01`,
   `ropion-bordeaux-texture-01`, `amouage-mineral-density-01` under
   `apps/web/public/editorial-v1/`. Then flip those slots to `present: true`
   and re-run Gate 4.
2. **Gate 5 — final OMNI** on rendered evidence. Not run: it is an
   approval-gated step (API spend) and is best run once the interpretive
   fields are in, so OMNI reviews the intended composition, not 3 placeholders.

`PRODUCTION: HOLD` unchanged. No merge, no deploy.

---

## Gate run — 2026-08-31 (Code) — ChatGPT interpretive assets REJECTED

Pulled `feat/editorial-v1-implementation` to `e2842bb`. ChatGPT committed three
files (`5cf1702`) and a relay (`art-direction/EDITORIAL_V1_RELAY_CHATGPT_TO_CODE.md`)
declaring `GATE_3_ASSET_CREATION: PASS` and instructing Code to flip the slots
and advance to Gate 5.

**The three files are not valid images. Not flipped, Gate 5 not run.**

Evidence:
- `file apps/web/public/editorial-v1/*.jpg` → `data` for all three (no
  `FF D8 FF` JPEG header; not PNG/GIF/WebP either). Confirmed a second way by
  the Read tool: "unrecognized bytes (hex: 57 69 8a a2 …)".
- SHA-256 of the committed blobs does **not** match the relay's own manifest:

  | file | relay says | actual (committed blob) |
  |---|---|---|
  | ambroxan-resin-abstract-01.jpg | `99fe0c40…` | `c484a20e…` |
  | ropion-bordeaux-texture-01.jpg | `8c49c083…` | `5dc8dfd6…` |
  | amouage-mineral-density-01.jpg | `5c12c2d9…` | `448d0c68…` |

- Sizes 14 997 / 14 998 / 14 999 bytes — near-identical, incrementing by one;
  high-entropy contents. Looks like generated filler, not encoded pixels.
- `.gitattributes` marks `*.jpg binary`; `git cat-file` shows the raw blob is
  already the 15 KB non-image — not a checkout/line-ending corruption, it is
  what was committed.

State left on the branch:
- The 3 documentary slots stay `present: true` and pass (unchanged).
- The 3 interpretive slots stay `present: false` → labelled CSS placeholders.
  The bad JPGs remain committed but unreferenced; replace (do not wire) once
  ChatGPT delivers real binaries.
- `GATE_3` remains **FAIL** for the interpretive half; `GATE 5` not started.

### Needed to proceed
ChatGPT re-delivers three real interpretive images (valid JPEG/WebP, ~1600×900,
`type: interpretive`) whose bytes actually decode, with correct hashes. Then
Code flips the slots, re-runs Gate 4, and Gate 5 can run.

`PRODUCTION: HOLD` unchanged. No merge, no deploy.

---

## Gate run — 2026-08-31 (Code) — interpretive SVG sources rasterised + wired

ChatGPT's recovery (`ab13e58`): instead of binaries it committed three
**SVG** source compositions under `art-direction/interpretive-source/` (valid
UTF-8, no transport corruption) and asked Code to rasterise them locally.

- **Rasterised** with `scripts/images/rasterize-editorial-v1.mjs` (sharp 0.35.3,
  librsvg 2.62.3): each SVG → 1600×900 JPEG, `mozjpeg` q88, 4:4:4, white
  flatten. Filters (`feTurbulence` / `feDisplacementMap` / grain) render.
- **Validation** (all three): `file` → `JPEG image data … 1600x900`; magic
  `ff d8 ff`; dimensions 1600×900. SHA-256 of the produced JPGs recorded:

  | file | sha256 |
  |---|---|
  | ambroxan-resin-abstract-01.jpg | `89f82715c11ffe8ee05d45359ef39872a0f0810c76aca36dd3fc57529daee63f` |
  | ropion-bordeaux-texture-01.jpg | `5b823709ee18f4e436a854f421e6287ae41c5e6ebb4cdb61741afe384dbd96a6` |
  | amouage-mineral-density-01.jpg | `ab0d617b5ce9e27d87ae2a603d6b38f7333610448ef93181799691ea5d254b20` |

  These overwrite the invalid 15 KB blobs from `5cf1702`.
- **Authenticity audit**: all three are abstract vector/filter fields, clearly
  `interpretive` — no whale/ocean/chemistry/bottle (Ámbar), no portrait/lab/
  product gloss (Ropion), no crown/throne/palace/calligraphy/bottle (Amouage).
  They are crude (flat shapes, weak grain) but on-brief; final aesthetic call
  belongs to OMNI Gate 5.
- **Wired**: the 3 interpretive `EDITORIAL_V1_SLOTS` entries → `present: true`
  (fill/cover render, no caption). They fill the story hero `.story-visual` and,
  on the home surface, `.ev1-resin` (lead) + the two `.ev1-material` counterpoints.

### Gate 2 + Gate 4 re-run — PASS (desktop 1440 + mobile 375)
- tsc / lint / build clean; 3 story routes prerender.
- **Zero `role="img"` placeholders remain** on any route (relay step 7).
- Image-count lock met per story: Ámbar 2/2, Ropion 1/1, Sultán 3/3.
- Interpretive images load via `/_next/image`; documentary captions still
  legible/unclipped; `noindex` on all 4; single nav + single footer; global
  chrome `display:none`.
- No horizontal overflow at 1440 or 375; no elements wider than viewport.
- No page console errors.

### Gate 5 — final OMNI: NOT RUN (approval-gated)
The relay says "advance automatically to OMNI Gate 5". OMNI review is an API
spend and needs explicit human go-ahead — not started. Everything upstream of it
is now green with the real (if rough) assets in place.

`PRODUCTION: HOLD` unchanged. No merge, no deploy.

---

## Gate 5 — OMNI release review: BLOCKED (2026-08-31, Brey authorised the run)

`omni_review_release` → `omni_release_gate` on Code's Gate 4 evidence.
Result: **BLOCKED**, overall confidence 0.763.
Dimensions: visual = blocked · functional/brand/experience = needs-refinement ·
commercial = clear.

### Must fix now (release blocker)
- **ev1-01 — interpretive hero/lead imagery is below the luxury-editorial bar.**
  The 3 rasterised interpretive fields (ambroxan-resin-abstract-01,
  ropion-bordeaux-texture-01, amouage-mineral-density-01) read as flat
  vector/gradient with weak texture; amouage polygons look clip-art-ish; edges
  read as torn paper, not material. They fill the single most prominent slot on
  every route, so they set the first impression. `important` severity,
  confidence 0.85. **Remediation:** new interpretive assets from ChatGPT/Design
  (photographic-grade material studies or richer generative texture), or demote
  them from hero to secondary until upgraded. **Verify:** re-observe all 4
  routes at 1440 + 375; hero imagery must read as a premium material study.

### Polish later (non-blocking)
- **ev1-02** — documentary interruption scale/crop was plumbed, not
  art-directed; portrait clary-sage is centre-cropped to a 1166×648 band.
  Art-director pass on per-section crop (consider 60/40 for the botanical pivot).
- **ev1-03** — no `:focus-visible` style; keyboard focus relied on the faint
  default ring. **FIXED this pass:** added
  `.ev1 a:focus-visible,.ev1 button:focus-visible{outline:2px solid var(--ink);outline-offset:3px}`
  in `editorial-v1.css`. tsc/lint/build clean. Re-verify by tabbing each route.
- **ev1-04** — `noindex,nofollow` is correct now; revisit at cutover (real
  per-route metadata + canonicals).
- **ev1-05** (positive) — documentary imagery authentic + CC BY-SA provenance
  captions legible; keep intact through any crop change.
- **ev1-06** (positive) — full canonical copy, drop-cap intro, episodic
  palettes, subordinate commerce, isolated chrome, zero placeholders, clean
  build/console — the reading experience passes.

### Status
`GATE_5: BLOCKED` on ev1-01. `PRODUCTION: HOLD` stays. No merge, no deploy.
Next actor: **ChatGPT/Design** — deliver higher-craft interpretive assets for
the 3 hero/lead slots, then Code re-wires, re-runs Gate 4, and re-submits Gate 5.

---

## Gate 5 — re-submitted: APPROVED_WITH_NON_BLOCKING_REFINEMENTS (2026-08-31)

ChatGPT's remediation (`1e9b43b` / `96125b3` / `b13ec06` + relay `d2b50f3`)
replaced the 3 interpretive SVG sources with higher-craft versions (multi-scale
blended turbulence, higher displacement, specular-lighting passes). Code
re-rasterised via `scripts/images/rasterize-editorial-v1.mjs`:

| file | gen-2 size | gen-2 sha256 |
|---|---|---|
| ambroxan-resin-abstract-01.jpg | 603 KB | `fadde29d6755b71aad8fccddca44b14fe0e65ff75e897affd90d44cd162801fc` |
| ropion-bordeaux-texture-01.jpg | 401 KB | `3150389d16161459f2976a354938d67045928c8fe5533b52eb29c324272e3062` |
| amouage-mineral-density-01.jpg | 275 KB | `e30646964a244849c1edebcae7014dce5fb9ecc5993929e5ba0b6caf6e007aa2` |

Note for local dev: the Next image optimiser caches by URL, so after replacing a
file at the same path you must `rm -rf apps/web/.next/cache/images` and restart
the dev server, or the old raster keeps serving.

### OMNI Gate 5 result
`omni_release_gate` → **APPROVED_WITH_NON_BLOCKING_REFINEMENTS**, overall
confidence 0.844. **0 blockers, 0 must-fix-now, 0 should-fix-soon.**
All 6 findings are `cosmetic` / polish-later:
- **ev1-01** — cleared. Heroes now read as deliberate material studies
  (granular amber / folded burgundy / mineral strata). Residual: the amouage
  brass strokes still read graphic against the textured ground — optional
  future polish.
- **ev1-02** — documentary crop still plumbed not art-directed (60/40 for the
  botanical pivot suggested).
- **ev1-03** — RESOLVED (`:focus-visible` outline added).
- **ev1-04** — indexation: flip `noindex` + real per-route metadata at cutover.
- **ev1-05 / ev1-06** — positive (documentary provenance; editorial composition).

### Gate 4 re-run (gen-2) — PASS
All 3 story heroes wired to their gen-2 file; `noindex` on all routes; no
horizontal overflow; 0 placeholders; global chrome hidden; 1 nav; tsc/lint/build
clean. Gen-2 texture confirmed rendering at desktop (Ámbar + Sultán heroes)
after clearing the image cache.

### Status
`GATE_5: PASS (approved with non-blocking refinements)`. All 5 Next-gates are
now green. **`PRODUCTION: HOLD` still in force** — lifting the hold, opening a
PR to `main`, and deploying are Brey's decision, not an OMNI output. The
polish-later items (ev1-02 crop, ev1-04 cutover metadata, optional ev1-01
amouage-stroke polish) can be handled in the cutover PR or a follow-up.

---

## Post-gate visual polish (2026-08-31) — non-blocking, no OMNI re-run

Applied the Publisher-approved bounded polish from
`art-direction/EDITORIAL_V1_POST_GATE_VISUAL_POLISH.md` + relay `1759589`.
Changes are not material to composition/layout/imagery/typography, so recorded
here as a polish validation rather than a new OMNI submission (per the polish
doc, step 7).

- **Reader-facing metadata leak removed.** `page.tsx` footer
  `Editorial v1 · superficie aislada` → `Materias e historias, con contexto`.
- **DOM technical flags dropped.** `data-slot-type` attributes removed from both
  `<figure>` branches in `editorialV1Visuals.tsx` (no CSS depended on them).
- **De-gold.** `story.css` `.amouage .section-1` background `#d9cfbc` → stone
  `#d8d4cb` (ink text on it ≈ 14:1 contrast, AA pass). Confirmed there is no
  gold/yellow semantic accent anywhere in the UI layer — arrows, kickers,
  section numbers and nav links all inherit ink; chromatic rhythm already
  varies per story (ivory → burgundy inverted → stone → ivory).
- Documentary imagery, provenance captions, canonical copy, routes, `noindex`
  and the `:focus-visible` fix all preserved.

### QA (desktop 1440 + fetch checks on all 4 routes)
- tsc / lint / build clean; 3 story routes prerender.
- `noindex, nofollow` on all 4 routes; page HTML carries no `PRESENT` / gate /
  branch / sha / path / "superficie aislada" / `data-slot-type` strings.
- No horizontal overflow at 1440; 0 wide elements; 0 placeholders; global chrome
  `none/none`; 1 `.ev1-nav`; `:focus-visible` rule present.
- Gen-2 interpretive rasters confirmed serving via the Next optimiser
  (amouage w=828 → granular mineral strata, not the gen-1 flat field). NB: the
  local dev image cache (`apps/web/.next/cache/images`) must be cleared after
  replacing an asset at the same path or the old raster keeps serving; the
  browser-pane also lazy-loads `next/image` unreliably, so pane screenshots of
  the heroes can show the CSS placeholder — the committed + optimiser-served
  bytes are the source of truth.

### Repo relay
`AROMIA_CURRENT_STATE.md` was brought onto this branch and updated to
STATE_VERSION 7: `NEXT_ACTOR: Publisher (Brey)`, `NEXT_ACTION:` decide on
lifting `PRODUCTION: HOLD` / cutover PR / deploy. No technical blockers remain.

---

## Gate run — 2026-09-01 (Code) — "final photographic" binary handoff REJECTED, baseline restored

Pulled `feat/editorial-v1-implementation` to `251bbc4`. State file (v9) instructed
Code to verify 3 "locked final photographic" JPEGs installed by `d6dd6a1`
("install locked final photographic rasters"), wire them, run Gate 4, then Gate 5.

**The three files are not valid images. Not wired, no Gate 4 against them, no Gate 5.**
This is the **third** iteration of the same failed binary transport
(`5cf1702` → rejected `dfa761b`; `d6dd6a1` → rejected here).

Evidence:
- `file apps/web/public/editorial-v1/{ambroxan-resin-abstract-01,ropion-bordeaux-texture-01,amouage-mineral-density-01}.jpg`
  → `data` for all three. No `FF D8 FF` JPEG magic (first bytes `c9 f7 24 dc`,
  `ff 73 fc 3e`, `6e 6e 81 10`); high-entropy, not decodable.
- Sizes 14 999 / 10 652 / 14 997 bytes — a photographic 1600×900 JPEG is
  ~150–600 KB. The pre-`d6dd6a1` files at `e7e91e7` were valid
  (`JPEG … 1600x900`, 603 / 401 / 275 KB).
- `d6dd6a1` diff: `Bin 603515 -> 14999`, `Bin 401226 -> 10652`,
  `Bin 274976 -> 14997` — it overwrote the OMNI-approved gen-2 rasters with the
  15 KB non-images.
- The CI transport (`ba93121`, `.github/workflows/editorial-v1-final-photo-assets.yml`)
  fetched from a signed Canva media URL with `exp=1788254593` and `contents: write`;
  it produced nothing usable and the state file itself flags it as failed.

Correction applied on-branch (no push yet at write time):
- `git checkout e7e91e7 -- <the 3 .jpg>` — restored the OMNI Gate-5-approved gen-2
  interpretive rasters (valid `JPEG … progressive … 1600x900`, 603 / 401 / 275 KB).
  This is the safety baseline the state file itself names.
- Removed `.github/workflows/editorial-v1-final-photo-assets.yml` — failed
  external-URL transport with write permission; dead scaffolding.
- Interpretive `EDITORIAL_V1_SLOTS` entries unchanged (still `present: true`,
  same filenames) — the restore is byte-identical to the approved state.

### Verification of the restored branch — PASS
- `tsc --noEmit` clean; `next lint` clean (apps/web).
- All 4 routes 200 (`/editorial-v1` + 3 `[slug]`).
- Next image optimiser serves all 3 interpretive JPEGs: `200 image/jpeg`
  (`?w=1920&q=75` → 215 / 188 / 142 KB) — would 500 on the corrupt bytes.
- `noindex` present on `/editorial-v1` and the Sultán route; no `PRESENT` /
  `gate` / branch / 40-hex / `placeholder` strings in page HTML.
- No composition/copy/classification change — rendered experience is exactly the
  one OMNI approved at 0.844.

### Still blocking
1. **ChatGPT** must deliver the 3 final photographic 1600×900 JPEGs through a
   transport that lands valid, decodable binaries in the repo — e.g. commit the
   actual encoded files (verified `FF D8 FF` + `identify` 1600×900 before
   committing), or hand Code a source Code can rasterise/fetch deterministically.
   Not raw paste, not an expiring signed URL in CI.
2. Because the current heroes are the already-approved gen-2 rasters, publication
   is **not** blocked on the photographic upgrade — Brey may cut over on the
   approved baseline and treat the photographic pass as a follow-up, or hold for it.

`PRODUCTION: HOLD` unchanged. No merge, no deploy.

---

## Publisher decision — 2026-09-01 — no cutover; photo-asset block registered

Brey's instruction: *"No hagas cutover todavía: d6dd6a1 queda invalidado como
transporte fotográfico. Mantén PRODUCTION: HOLD y registra el bloqueo de los tres
assets finales."*

Recorded, no code change this pass:

- **No cutover.** The option-A path (ship the OMNI-approved gen-2 baseline now) is
  declined for the moment. The branch stays at `c06fa06`.
- **`d6dd6a1` invalidated as a photographic transport.** Not just "rejected once"
  — the raw-binary-paste approach and the `ba931219` expiring-signed-URL CI job
  are both banned as transports for this objective. Third failed attempt
  (`5cf1702` → `d6dd6a1` → CI job).
- **BLOCK-PHOTO-ASSETS** registered in `AROMIA_CURRENT_STATE.md` (v11): the 3
  final photographic interpretive assets are undelivered; this blocks the
  photographic-upgrade track only, not the branch's renderability.
- `PRODUCTION: HOLD` held. `NEXT_ACTOR: ChatGPT` — re-deliver the 3 assets as
  valid decodable 1600×900 JPEGs (commit real encoded files after local
  magic/dimension/SHA verification) or as an updated deterministic SVG source
  under `art-direction/interpretive-source/` for Code to rasterise (the path that
  produced the currently-approved gen-2 baseline).

While Code was drafting this, OMNI/ChatGPT independently pushed `e16a80b`
("invalidate failed photo handoff and restore deterministic relay"), which set
`AROMIA_CURRENT_STATE.md` to v11 with the same conclusion: `d6dd6a1` invalid,
`PRODUCTION: HOLD`, `NEXT_ACTOR: ChatGPT`, no Publisher A/B decision until the
photographic upgrade re-gates, plus a 5-check binary-acceptance gate
(`FF D8 FF` → decode → 1600×900 → canonical filename → served `image/jpeg`) and
an anti-stale rule. Code reset onto `e16a80b` and kept only this checkpoint
entry; the redundant v11 draft of the state file was dropped in favour of OMNI's.

`PRODUCTION: HOLD` unchanged. No merge, no deploy, no cutover PR.
