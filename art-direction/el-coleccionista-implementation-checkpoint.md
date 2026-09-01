# EL COLECCIONISTA — IMPLEMENTATION CHECKPOINT (Code)

IMPLEMENTATION: READY — Asset A ingested and wired
QA: LOCAL_PASS — desktop + mobile verified; Final OMNI pending
PUBLISH: PENDING — pushed to the feature branch only; `main` is protected, merge = deploy, Publisher-gated
DATE: 2026-09-01 (Asset A wired in a later pass, same day)

Sources honoured:
- `drafts/el-coleccionista.md` (prose ingested verbatim; only straight→curly quote normalisation)
- `art-direction/el-coleccionista-art-direction-and-composition.md` (locked)
- `art-direction/el-coleccionista-early-omni-review.md` (EARLY_OMNI: PASS)
- `art-direction/el-coleccionista-visual-assets-handoff.md` (asset package)
- `research/el-coleccionista-fact-check.md`, `research/el-coleccionista-visual-source-check.md`

## What was built

New **story-specific route** under the Editorial v1 Foundation — not a new template:

- `apps/web/src/app/(editorial)/historias/el-coleccionista/page.tsx`
- `apps/web/src/app/(editorial)/historias/el-coleccionista/coleccionista.css`
- `apps/web/src/app/(editorial)/editorialVisuals.tsx` — slot `coleccionista-shelf-interpretive` registered, `present: false`
- `apps/web/src/app/sitemap.ts` — `/historias/el-coleccionista` added

The three existing stories keep sharing `historias/[slug]`. This story gets its own
static segment because its composition (controlled accumulation → withdrawal) does not
fit the shared `data`-driven renderer, and the workflow's rule is *repeat identity, vary
composition*. Foundation shell (`.ev1`, nav, typography, paper, `VisualField`, chrome
hiding via the `(editorial)` layout) is reused unchanged.

Build: `/historias/el-coleccionista` prerenders as ○ Static, alongside ● `/historias/[slug]`
(x3). No route collision. `tsc --noEmit` clean, `next lint` clean, `next build` clean.

## Composition — the four density states (art direction §"Composition principle")

1. **Recognition** — asymmetric opening: copy ~52% of the field, Asset A slot offset into
   the rest. Quiet, not a glamour hero. First silence: `Eso ya dice algo.` lands alone,
   then one near-invisible inventory tick.
2. **Distinction** (`01`) — primarily typographic; a restrained marginal reference cue for
   Michelyn Camen, no portrait, no collector-vs-hoarder diagram.
3. **Multiplication** (`02`, `.multiplying`) — density enters: warm `#efeee7` field, rail
   in oxidised tobacco `#6b5138`, rail ticks grow `·` → `· · ·`. Closes on the **Le Male
   typographic lineage** (Asset B fallback, approved as the stronger truthful solution):
   verified current names only, `1995` on the original, no flanker dates, no bottle
   imagery, no price, no CTA, provenance caption to jeanpaulgaultier.com (2026).
4. **Scarcity transition** — abrupt whitespace band (`.coll-gap`, ~40vh) + a thin rule
   before the register changes.
5. **Preservation** (`03`, `.preserving`) — cool steel wash `#eceef1`, rail in steel
   `#6f767c`; the time/reserve idea is done **with layout + typography only**
   (`lo que uso / lo que guardo / lo que recuerdo`, labelled *Notación interpretativa*).
   Asset C was **not** reopened — the passage is not perceptually flat after the
   accumulation section.
6. **Release** (`Sí, pero`, `.coll-reset`) — hard reset: no section number, no rail, no
   ticks, no image; plain paper; the `h2` is deliberately smaller than the body; the line
   `A veces uno solo quiere otro perfume.` gets its own breathing room.
7. **Commerce close** — contextual footnotes after the editorial end. Two affiliate links
   (`rel="sponsored nofollow"`, `tag=aromialab-20`), affiliation disclosed, quieter than
   the captions, no product card row.

Mobile: accumulation becomes vertical rhythm — the rail collapses to a thin bordered band
between sections; lineage stacks; the scarcity gap keeps a large vertical break; `Sí, pero`
drops every device.

## QA evidence (local, prod build on :3100)

- Desktop 1280 + mobile 375: opening, intro/rail, Le Male lineage, scarcity gap, `Sí, pero`
  reset all render per art direction.
- No horizontal overflow (`scrollWidth == clientWidth`), no overflowing elements.
- Heading order H1→H2→H2→H3→H2→H2 (the H3 is the subordinate lineage block).
- Visible keyboard focus on links (inherited `.ev1 a:focus-visible`).
- All accumulation devices (`.coll-rail`, `.coll-tick`, `.coll-converge`, `.coll-gap`) are
  `aria-hidden="true"` — decorative, out of reading order.
- Affiliate links carry `rel="sponsored nofollow"` and the disclosure line.
- No console errors.
- Asset A pass (later, same day): image loads on desktop + mobile, correct Next-optimized
  src, `object-fit:cover` + `object-position:50% 64%`, subject not clipped, marker span
  gone, no horizontal overflow, no console errors — all JS-measured. Browser-pane
  **screenshot capture was failing session-wide** (also on `/magazine`), an environment
  fault unrelated to the page; the rendered PNG capture is left to OMNI Render at the
  Final gate, whose job that is.

## Asset A (opening domestic collection scene) — RESOLVED

ChatGPT produced Asset A; the Publisher placed the binary in the repo (the connector could
not transport a chat-pasted image, so Code could not ingest it directly — a transport
limitation, not a generation one).

- `apps/web/public/editorial-v1/coleccionista-shelf-01.jpg` — baseline JPEG, 1400×1800,
  ~90 KB. Interpretive flat illustration: a tight row of ~17 unbranded fragrance-like
  bottles of varied silhouette/height, one low tray/dish at left, uneven spacing, muted
  sage/taupe/gray on warm paper, no gold, no smoke/marble/reflections, no readable marks.
  Matches the locked Asset A spec; reads as recognition, not desire.
- `editorialVisuals.tsx`: slot `coleccionista-shelf-interpretive` → `present: true`,
  `file: "/editorial-v1/coleccionista-shelf-01.jpg"`, alt updated to describe the crowded
  unbranded shelf (no mood/luxury adjectives). Rendered interpretive (`fill` + `cover`).
- `coleccionista.css`: `figure.coll-shelf{margin:0}` (kill the default `<figure>` margin
  inside the grid) and `.coll-shelf img{object-position:center 64%}` — the source subject
  sits in a wide band in the vertical middle, so the crop is biased down to drop empty
  upper paper rather than clip bottle tops or the shelf line.

Crop check (JS-measured): the container ratio (~0.80 desktop, ~0.80 mobile) is within
~0.02 of the asset ratio (0.778), so `cover` clips only ~10–25 px total on either axis —
the bottle band and shelf are fully visible at both breakpoints.

## Non-blocking follow-ups

- The editorial cover (`/`) does not yet link this story. Cover composition is
  art-directed (ChatGPT) — adding a fourth story to the lead/counterpoint grid is out of
  scope for this implementation relay. The story is reachable directly and via
  `sitemap.xml`.
- Mobile editorial nav still hides its links with no menu (pre-existing site-wide
  KNOWN_FOLLOWUP, not introduced here).

## Handoff

`NEXT_ACTOR: OMNI` — Final rendered-experience gate on `/historias/el-coleccionista`
(desktop + mobile): implementation fidelity to the locked art direction, the accumulation
→ withdrawal arc, the Asset A crop/tone in context, commercial pressure (should be ~zero
until the close), and responsive integrity. Branch `feat/el-coleccionista-implementation`
is pushed (`origin`); `main` is untouched. No merge/deploy — publication stays
Publisher-gated. If OMNI returns corrections, Code applies them on the same branch.
