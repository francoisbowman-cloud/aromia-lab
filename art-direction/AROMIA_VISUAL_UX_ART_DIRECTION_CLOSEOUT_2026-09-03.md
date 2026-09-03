# Aromia — Art Direction closeout / Visual UX integration

STATUS: ART_DIRECTION_READY
DATE: 2026-09-03
ROLE: ChatGPT / Art Direction
SCOPE: pending visual work after UX audit merges #133 #134 #135 #139 #140
GENERATION_POLICY: NO NEW GENERATION FROM THIS CONVERSATION
NEXT_ACTOR: Code

## 0. Non-negotiable generation disposition

This operational conversation is disqualified from publication-image generation by the canonical two-strike/context-contamination rule in `docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md`.

Therefore:

- do not invoke image generation from this conversation;
- do not ingest any image created here after the context lock;
- do not silently repurpose a rejected result merely because it visually resembles a later need;
- every image integrated below must be either already approved in the repository, licensed documentary material with recorded provenance, or implementation-native HTML/CSS/typography;
- no mockups, moodboards, infographics, UI screenshots or generic perfume still lifes are publication assets.

The generated results seen in the immediately preceding Art Direction turn — ingredient still lifes, perfumer-lab still lifes, floral macro, driftwood/resin tableau, generated olfactory pyramid, generated family chart and botanical moodboard — are all **REJECTED PROCESS WASTE** for this project state. Some are attractive; none passed an approved sequential slot gate. They must not be committed or referenced.

---

# 1. Magazine / Archivo — M3 + M4

## M3 — dominant image for lead story

### Decision

Do not create a new generic Magazine hero.

The archive lead should inherit a visual only when the lead item has a previously approved story visual. The image belongs to the story, not to the archive.

Approved mapping:

| Editorial item | Approved visual slot |
|---|---|
| `el-coleccionista` | `coleccionista-shelf-interpretive` |
| `el-perfume-que-encargo-un-sultan` | `amouage-material-density-interpretive` |
| `el-ambar-que-nunca-toco-una-ballena` | `ambroxan-material-interpretive` |
| `el-perfumista-que-no-teme-exagerar` | `ropion-overdose-interpretive` |

If a future Magazine item becomes the lead and has no reviewed visual source, the lead remains intentionally typographic. Do **not** invent a filler image to satisfy a layout quota.

### Composition intent

Desktop:
- dominant image 55–62% of visual width;
- copy occupies the remaining editorial field;
- image and story must read as one unit;
- allow asymmetry, but never place the next story's image directly against the lead image.

Mobile:
- image → kicker/title/summary/CTA;
- no image→image adjacency between different stories.

## M4 — visual rhythm in the archive

### Decision

Do not add an image to every archive item.

That would turn Historias into a card catalog and create pressure to generate decorative filler.

Use a **sparse visual rhythm**:
- text-first archive rows remain the default;
- introduce a visual interruption only for items with reviewed image provenance;
- target roughly one image-bearing item every 4–6 entries, based on editorial rhythm rather than a fixed modulus;
- image size may vary between portrait, landscape and narrow material crop;
- no shadows, floating cards or ecommerce product-grid language.

### Acceptance test

At any viewport, a reader can answer immediately:
1. which image belongs to which story;
2. where one story ends and the next begins;
3. why the image is present.

---

# 2. Ropion story — S5

Route:
`/historias/el-perfumista-que-no-teme-exagerar`

The hero already uses an approved rose visual. The internal story needs a change of visual grammar, not more of the same hero crop.

## S5-A — after “La técnica tiene nombre: sobredosis”

### Decision

Create a **documentary material diptych** from two independently licensed real photographs:

1. rose;
2. patchouli.

Do not combine them into a generated beauty still life.

The point is the unusually high presence of two materials in the article's Portrait of a Lady passage.

### Source candidates — reviewed for reusable license

**Rose**
- Commons page: https://commons.wikimedia.org/wiki/File:Red_rose_close-up.jpg
- Author: User:Vatadoshu Phyto
- License: CC0 1.0
- Original: 2160 × 1440

**Patchouli**
- Commons page: https://commons.wikimedia.org/wiki/File:Patchouli.jpg
- Author: Joe Laurence / Seychelles News Agency
- License: CC BY 4.0
- Original: 640 × 427

### Composition

- two independent frames separated by Aromia paper, not a merged collage;
- rose frame may be slightly larger;
- patchouli frame should preserve botanical context rather than crop into abstract green;
- captions remain documentary and factual;
- no “rose + patchouli = Portrait of a Lady” claim; these are material references, not formula evidence.

### Narrative test

`The reader can see the two materials being discussed without being shown a fake formula or a fake product campaign.`

## S5-B — after “Lo que decidió no usar”

### Decision

**No photograph.**

Use an implementation-native typographic/material pause:
- two restrained terms: `Hedione` and `Iso E Super`;
- one short line from the existing article explaining that the decision was omission, not a judgement that the materials were bad;
- no molecule diagrams;
- no beakers;
- no generated laboratory image.

### Narrative test

`Absence becomes visible without pretending chemistry can be illustrated by decorative science imagery.`

---

# 3. Saber — SB2 / SB3 / SB5

Route:
`/academia`

## SB2 — olfactory pyramid

### Decision

Build the pyramid as **semantic HTML + CSS**, not an image and not a generated infographic.

The previously generated “Aromia olfactory pyramid” image from this conversation is rejected and must not be used.

### Visual structure

- three stacked horizontal bands rather than a decorative triangle if that improves responsive legibility;
- Salida / Corazón / Fondo;
- each band contains time range, short role and 1–2 representative note types already supported by page copy;
- a light time axis runs alongside or beneath;
- all information remains real text in the DOM;
- no botanical drawings required;
- mobile collapses into three vertical steps.

### Accessibility

- diagram content must remain understandable with CSS disabled;
- no essential meaning conveyed only by color;
- decorative rules are `aria-hidden`.

### Narrative test

`The reader understands change over time faster than from the current text table, without mistaking the diagram for a universal formula.`

## SB3 — families

### Decision

Do **not** create eight or ten decorative family cards with generated images.

Saber is an educational overview; Discovery is the deeper family explorer.

Use a **documentary materia strip** before/inside the family section, with 4–6 real materials that demonstrate how different families can begin from physical references.

Preferred reusable sources:

1. Bergamot
   - https://commons.wikimedia.org/wiki/File:Bergamotfruit.jpg
   - CC BY-SA 2.0
2. Rose
   - https://commons.wikimedia.org/wiki/File:Pretty_Pink_Rose_Closeup.jpg
   - CC0 1.0
3. Sandalwood
   - https://commons.wikimedia.org/wiki/File:Santalum_album.jpg
   - CC BY-SA (verify exact version on ingestion)
4. Frankincense
   - already ingested: `/editorial-v1/frankincense-documentary.jpg`
   - provenance already recorded in `editorialVisuals.tsx`
5. Clary sage
   - already ingested: `/editorial-v1/clary-sage-documentary.jpg`
   - provenance already recorded in `editorialVisuals.tsx`
6. Patchouli
   - https://commons.wikimedia.org/wiki/File:Patchouli.jpg
   - CC BY 4.0

### Composition

- one continuous editorial band, not six independent cards;
- each material image gets a tiny factual caption;
- below the band, the family text grid remains;
- family names link to the corresponding Discovery family route where available;
- do not imply one material defines an entire family.

### Why this deviates from “one image per family”

One image per family would repeat the same visual grammar 8–10 times and push Saber toward a catalog. A selective materia band teaches the concept while Discovery carries the full taxonomy.

### Narrative test

`The reader sees that families are abstractions built from recurring material relationships, not eight boxes with mascots.`

## SB5 — history

### Decision

Use an **implementation-native timeline**, not generated historical imagery.

- one horizontal rule / vertical mobile rail;
- six real dates already present in the copy;
- each milestone has year, title and 1–2 sentence description;
- hierarchy comes from spacing/typography, not pictograms;
- no faux archival paper, sepia effects or invented historical photos.

Optional documentary imagery may be added later only when a specific historical source and rights case justify it. It is not required to close SB5.

### Narrative test

`The reader can understand six moments as a progression without being asked to believe a fabricated visual history.`

---

# 4. Personas — real portrait policy

The current monogram fallback introduced by PR #139 is acceptable only as a **temporary rights-safe fallback**.

The desired final state remains:
> every perfumer biography should show a real photograph when a reusable, reviewed source is available.

## Portrait sources ready for ingestion now

### Alberto Morillas

- Commons: https://commons.wikimedia.org/wiki/File:Alberto_Morillas.jpg
- Author: Mizensir
- License: CC BY-SA 4.0
- Original: 3941 × 5746
- Intended crop: portrait 4:5, preserve face/shoulders, neutral editorial crop
- Alt intent: `Retrato fotográfico de Alberto Morillas.`
- Attribution must be retained in provenance metadata / caption system.

### Christine Nagel

- Commons: https://commons.wikimedia.org/wiki/File:Christine_Nagel.jpg
- Author: Comparfums1
- License: CC BY-SA 4.0
- Original: 3773 × 5669
- Intended crop: portrait 4:5, preserve face/shoulders
- Alt intent: `Retrato fotográfico de Christine Nagel.`
- Attribution must be retained in provenance metadata / caption system.

## Portraits not yet rights-cleared

- Francis Kurkdjian
- Jacques Polge
- Olivier Polge
- Dominique Ropion
- Anne Flipo
- Quentin Bisch
- Olivier Cresp
- Nathalie Lorson
- Frank Voelkl
- Alessandro Gualtieri

Search results that merely mention a perfumer, show a product, or appear on an official/press page without explicit reusable terms are **not enough**.

Do not:
- scrape Google Images;
- hotlink arbitrary editorial photographs;
- generate synthetic portraits;
- use a photo of a different person with the same surname/name;
- infer that “press photo” means unrestricted commercial use.

Until a reusable source is reviewed, the monogram remains.

## Portrait visual treatment

All real portraits:
- 4:5 editorial crop;
- natural color or source-authentic monochrome; no homogenizing AI grade;
- no face retouching;
- no beauty smoothing;
- no fake studio relighting;
- source/copyright metadata retained outside the visible hero if necessary;
- card and detail use the same master, with different crops only when safe.

---

# 5. Existing approved visual reuse map

The following repo assets/slots are already trusted and may be reused in new layouts when they still belong to the same story/context:

- `ambroxan-material-interpretive`
- `clary-sage-documentary`
- `ropion-overdose-interpretive`
- `amouage-material-density-interpretive`
- `oman-place-documentary`
- `coleccionista-shelf-interpretive`
- `frankincense-documentary`
- `assets/visual/editorial/sub-batch-01/01A-antes-del-perfume-ya-oliamos.jpg` — only for its own approved story/opportunity

Reuse does not authorize reassignment. A story-specific asset must not become generic perfume filler elsewhere.

---

# 6. Intent audit — what must NOT be integrated

Reject / do not commit:

- generated driftwood + amber/resin still life;
- generated tuberose/beaker/perfume-lab still life;
- generated ivory flower macro with blotters;
- generated dark laboratory notebook still life;
- generated “Aromia olfactory pyramid” infographic;
- generated “familias olfativas” infographic;
- generated botanical moodboard with labels;
- any mockup, interface, GitHub/repo image or workflow visualization;
- any future generated image from this operational conversation.

Reason:
- not produced from an approved sequential capsule in a clean context;
- some are explicit forbidden infographic/moodboard outputs;
- others repeat the generic perfume-semantic fallback the isolation protocol exists to prevent.

---

# 7. Code implementation handoff

Code may now implement this Art Direction without inventing new visual decisions.

Priority:

1. Magazine M3 — add story-owned lead visual mapping.
2. Magazine M4 — sparse image-bearing rhythm using only reviewed visual mappings.
3. Ropion S5-A — ingest licensed rose + patchouli documentary sources and add diptych after the overdose section.
4. Ropion S5-B — add typographic omission pause after “Lo que decidió no usar”.
5. Saber SB2 — semantic HTML/CSS pyramid/time diagram.
6. Saber SB3 — documentary materia strip + links to Discovery families.
7. Saber SB5 — implementation-native timeline.
8. Personas — ingest Alberto Morillas + Christine Nagel portraits now; keep monogram for all uncleared profiles.
9. Run responsive browser QA on 390×844 and 1280×900 at minimum.
10. Verify no image→image adjacency across unrelated stories, no broken external media, correct license/provenance and no accidental filler assets.

## Required Code guardrail

If a layout appears to “need another image” but no reviewed source exists:

> leave intentional paper/typography rather than generate or invent an image.

---

# 8. Acceptance gate

Art-direction implementation passes only if:

- every inserted image has a named narrative function;
- every external documentary source has provenance and a reusable license;
- no rejected generated artifact enters the repo;
- no AI-generated portrait is used for a real perfumer;
- Magazine gains hierarchy without becoming a card grid;
- Ropion receives internal visual rhythm without fake formula/science imagery;
- Saber becomes more legible through real semantic diagrams/material references;
- Personas prefers real portraits but fails safely to monogram when rights are unclear;
- mobile order preserves image↔content ownership.

ART_DIRECTION: READY
VISUAL_ASSETS: PARTIAL_READY — existing approved assets + licensed documentary sources above
IMAGE_GENERATION: NOT_AUTHORIZED_IN_CURRENT_CONTEXT
NEXT_ACTOR: Code
