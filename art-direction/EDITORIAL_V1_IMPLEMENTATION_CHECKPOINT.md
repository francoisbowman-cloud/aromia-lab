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
