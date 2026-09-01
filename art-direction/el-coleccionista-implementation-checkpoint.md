# EL COLECCIONISTA — IMPLEMENTATION CHECKPOINT (Code)

IMPLEMENTATION: READY (pending Asset A)
QA: LOCAL_PASS — desktop + mobile browser QA green; Final OMNI pending
PUBLISH: PENDING — not pushed; `main` is protected, entry is via PR + Publisher authorization
DATE: 2026-09-01

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

## BLOCKER — Asset A (opening domestic collection scene)

Code has **no image-generation capability** in this environment. OMNI's image tools are
refinement/composition/audit of *existing* images only (`get_omni_status`,
`get_image_refinement_capabilities` confirm; generative ops are blocked by design). Per the
manual operativo, generated imagery is a ChatGPT responsibility; Code integrates.

State: slot `coleccionista-shelf-interpretive` is wired with `present: false`, so the page
renders its honest placeholder box (`role="img"` + descriptive label) — the same
first-ship pattern Editorial v1 used before its assets landed. Full locked spec is already
in `art-direction/el-coleccionista-visual-assets-handoff.md` §"Asset A".

INGESTION when the asset exists: drop the file at
`apps/web/public/editorial-v1/coleccionista-shelf-01.jpg` (or `.webp`), then in
`editorialVisuals.tsx` set the slot `present: true` and `file` to that path. Interpretive
(fill) rendering; no width/height needed. Alt text is already written in the slot.

## Non-blocking follow-ups

- The editorial cover (`/`) does not yet link this story. Cover composition is
  art-directed (ChatGPT) — adding a fourth story to the lead/counterpoint grid is out of
  scope for this implementation relay. The story is reachable directly and via
  `sitemap.xml`.
- Mobile editorial nav still hides its links with no menu (pre-existing site-wide
  KNOWN_FOLLOWUP, not introduced here).

## Handoff

`NEXT_ACTOR: ChatGPT` — create Asset A from the locked spec and hand the binary + ingestion
note back to Code. Code then wires the slot, re-runs desktop/mobile QA, and leaves the
result for Final OMNI. No push/merge/deploy has occurred; publication remains Publisher-gated.
