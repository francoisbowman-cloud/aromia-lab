# AROMIA EDITORIAL v1 — RELAY: CODE → CHATGPT (ART DIRECTION)

RELAY_STAGE: READY_FOR_ART_DIRECTION
BRANCH: `feat/editorial-v1-implementation`
BASE_MAIN_SHA: `d6001fb` (branch point) — head at relay time: `6e53d2c`
PRODUCTION: HOLD
PIPELINE: EDITORIAL ✅ · ART_DIRECTION ⬅ you are here · VISUAL_ASSETS ⏳ · IMPLEMENTATION ⏳ · QA ⏳ · PUBLISH ⛔

---

## Where this stands

The isolated Editorial v1 surface is built, rendered and QA'd on the branch
above. It is **not** on `main` and **not** deployed. See
`art-direction/EDITORIAL_V1_IMPLEMENTATION_CHECKPOINT.md` for the full gate log.

Done by Code:
- Gate 1 — build / typecheck / lint: PASS.
- Gate 2 — `/editorial-v1` + 3 `/editorial-v1/[slug]` routes render, desktop 1440
  + mobile 375.
- Gate 4 — browser QA: PASS after fixing
  - F1: surface is now isolated from the global site chrome via
    `app/editorial-v1/layout.tsx` (scoped, no impact on other routes);
  - F2: whole `/editorial-v1` subtree is `noindex, nofollow` while on HOLD.

Blocked:
- **Gate 3 (approved visual slots) — needs you.** Every visual area on the
  surface is currently an explicit semantic placeholder or an abstract CSS
  field. No `<img>` exists yet. Nothing fabricated has been substituted to make
  renders look finished, per the handoff rule.
- Gate 5 (final OMNI) — blocked on Gate 3 + full canonical copy.

---

## ACTION FOR CHATGPT

Art-direct the three stories' visual slots and produce or direct the assets for
them. Source material already in the repo:

- Drafts (source of truth for content): `drafts/el-ambar-que-nunca-toco-una-ballena.md`,
  `drafts/el-perfumista-que-no-teme-exagerar.md`, `drafts/el-perfume-que-encargo-un-sultan.md`
- Composition studies: `art-direction/<slug>-composition-study.md` (per story)
- Atmospheres + early OMNI: `art-direction/editorial-batch-01-atmospheres.md`,
  `art-direction/editorial-batch-01-early-omni-review.md`
- System: `art-direction/AROMIA_EDITORIAL_ARCHITECTURE_V1.md`

### Hard constraints (from the implementation handoff — do not relax)
- No fabricated bottle packshots. No fabricated Dominique Ropion portrait. No
  fabricated historical Sultan / Guy Robert scene.
- Every asset must be labelled **`interpretive`** (abstract material/light field,
  clearly not a document) or **`documentary`/`authentic`** (real, sourced,
  with provenance). A CSS/interpretive field must never be presented as evidence.
- `documentary`/`authentic` assets need a provenance line (source + rights) or
  they do not ship — the slot stays interpretive/placeholder instead.
- Restraint: max 3 principal images per story. No decorative ingredient strips.

### Deliverable back to Code
For each slot below: the asset itself (or an explicit "keep placeholder" /
"OPTIONAL, skipped" decision), its `interpretive` vs `documentary` label, its
provenance line if applicable, and desired crop/behaviour (full-bleed, macro,
≤55vw, etc.). Drop assets under `public/editorial-v1/` and name them by slot id.

---

## Asset slot → code location map

Slot ids come from `AROMIA_EDITORIAL_V1_IMPLEMENTATION_HANDOFF.md`.

### Story: Ámbar / Ambroxan (`kind="ambroxan"`, home tone `mineral`)
| Slot id | Code location | Current placeholder |
|---|---|---|
| `ambroxan-material-interpretive` | home `page.tsx` → `.ev1-story.mineral .ev1-material`; story `[slug]/page.tsx` → `.story-visual` | CSS radial mineral field |
| `clary-sage-documentary` | story `[slug]/page.tsx` → `.story-interruption` (after section index 1) | CSS clip-path sage-green shape |
| `molecule-02-authentic-packshot` OPTIONAL | story `[slug]/page.tsx` → new slot in `section-3` (not yet wired) | none |

### Story: Perfumista / Ropion (`kind="ropion"`, home tone `ropion`)
| Slot id | Code location | Current placeholder |
|---|---|---|
| `ropion-overdose-interpretive` | home `page.tsx` → `.ev1-story.ropion .ev1-material`; story `.story-visual` | CSS burgundy radial field |
| `ropion-authentic-portrait` OPTIONAL | story `.story-hero` (not yet wired) | none |
| `ropion-historical-product-evidence` OPTIONAL | story `.story-interruption` | CSS radial field |

### Story: Sultán / Amouage (`kind="amouage"`, home lead)
| Slot id | Code location | Current placeholder |
|---|---|---|
| `amouage-material-density-interpretive` | home `page.tsx` → `.ev1-resin` (lead); story `.story-visual` | CSS resin gradient + label "RESINA · TERRITORIO · ENCUENTRO" |
| `oman-place-documentary` | story `.story-interruption` | CSS field |
| `frankincense-documentary` | story `section-1` area (not yet wired) | none |
| `amouage-contemporary-packshots-authentic` | story `section-3` (not yet wired) | none |
| `amouage-gold-archive-authentic` OPTIONAL | story `section-4` (not yet wired) | none |

"Not yet wired" = Code adds the slot during integration once the asset + crop
spec exist; no point building empty `<img>` holes before then.

---

## After assets land — Code sequence

1. Add assets under `public/editorial-v1/`, wire each into its slot with
   `next/image`, honouring the interpretive/documentary labelling in `alt` +
   visible caption where the study calls for one.
2. Replace the condensed route copy in `[slug]/page.tsx` with the **full**
   canonical text from `drafts/` (the route currently uses shortened copy only
   to establish composition — see checkpoint "Important implementation note").
   `paginateArticle` / `splitHtmlBlocks` only recognise `p h1-h6 blockquote ul
   ol` today; extend both if the drafts need other blocks.
3. Re-run Gate 2 + Gate 4 at desktop 1440 and mobile 375 (each story reviewed at
   phone width as its own composition).
4. Image authenticity / provenance audit as part of Gate 4.
5. Gate 5 — final OMNI on rendered evidence.
6. Only then does the surface become eligible for the explicit
   `AROMIA EDITORIAL v1 — READY FOR PRODUCTION` declaration. Merge to `main` and
   Railway deploy remain gated on Brey's approval.

KNOWN_ISSUES: NONE beyond the blocked gates above.
