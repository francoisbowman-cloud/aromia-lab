# AROMIA EDITORIAL v1 — GATE 3 / CHATGPT ART DIRECTION DECISIONS

GATE: 3 — ART DIRECTION / VISUAL ASSETS
BRANCH: `feat/editorial-v1-implementation`
BASE_HEAD_REVIEWED: `c22db411b20eb2ad253b29aa77fd3db6972bca70`
PRODUCTION: HOLD
ACTOR: ChatGPT — Art Director + Visual Composer
STATUS: IN_PROGRESS — decisions locked; binary asset presence/provenance still must be satisfied before PASS

## Discovery correction

This pass was started from the active Code relay on `feat/editorial-v1-implementation`, not from `main` alone. `AROMIA_REPO_DISCOVERY_PROTOCOL.md` has been added to `main` to make active-branch/relay discovery mandatory before any actor concludes there is no eligible work.

## Remote-state finding

At `c22db41`, `public/editorial-v1/` is not present on the remote branch and the named asset `ambroxan-resin-abstract-01.jpg` is not discoverable remotely. Therefore Gate 3 cannot be marked PASS merely from a local report/screenshot saying the files exist.

The visual decisions below are authoritative for Code once the corresponding binaries are present and verified on the branch.

## Batch rule

Three stories must remain related but non-template. Maximum three principal images per story. Generated work is interpretive only. Real people and recognizable perfume bottles require authentic/licensable source material. Documentary assets ship only with source + rights provenance.

---

## 01 — El ámbar que nunca tocó una ballena

### `ambroxan-material-interpretive`
DECISION: USE
TYPE: interpretive
ROLE: opening material study; invisible familiarity made tactile
DESIRED ASSET: `ambroxan-resin-abstract-01.jpg`
CROP / BEHAVIOR:
- desktop: dominant macro in right/lower field, approximately 45–50vw, 16:9 or generous landscape crop;
- story detail: 4:5 crop permitted if the material behavior survives;
- mobile: full-width crop after title, preserve irregular water/material detail;
- no caption claiming this is literal ambroxan crystal.
DO NOT: blue-ocean cue, whale cue, fake chemistry, cosmetic-ad polish.

### `clary-sage-documentary`
DECISION: USE
TYPE: documentary / authentic
ROLE: botanical pivot; the visual proof that the synthesis route comes from plant material rather than the sea
PREFERRED SOURCE: Wikimedia Commons `File:Salvia sclarea 001.JPG`
SOURCE: https://commons.wikimedia.org/wiki/File:Salvia_sclarea_001.JPG
AUTHOR: Llez
RIGHTS: CC BY-SA 3.0 / GFDL as stated on Commons file page; attribution + applicable share-alike terms must be preserved
CROP / BEHAVIOR:
- 4:5 detail or asymmetric 60/40 passage;
- keep identifiable plant structure; do not crop into generic purple flowers;
- visible caption should identify `Salvia sclarea` / clary sage and source.

### `molecule-02-authentic-packshot`
DECISION: OPTIONAL — SKIP FOR GATE 3 unless Code supplies an authentic, rights-clear packshot
REASON: story is complete without it; no generated bottle and no placeholder pretending to be product evidence.

STORY IMAGE COUNT LOCK: 2 principal images unless a verified Molecule 02 packshot is later added as a small late-page evidence object.

---

## 02 — El perfumista que no teme exagerar

### `ropion-overdose-interpretive`
DECISION: USE
TYPE: interpretive
ROLE: signature visual act; controlled excess
DESIRED ASSET: `ropion-bordeaux-texture-01.jpg`
CROP / BEHAVIOR:
- one saturated act only;
- desktop may push beyond its column while preserving one precise empty margin;
- mobile becomes one edge-to-edge dense crop followed by a long clean release;
- rose/patchouli material must remain botanically plausible and should not read as generic romance.
DO NOT: percentages, beakers, literal lab infographic, perfume-ad gloss.

### `ropion-authentic-portrait`
DECISION: OPTIONAL — SKIP
REASON: no authentic/licensable Ropion portrait has been supplied in the remote handoff. The article can establish the person through name, craft chronology and the interpretive overdose act. A fabricated portrait is prohibited.

### `ropion-historical-product-evidence`
DECISION: OPTIONAL — SKIP
REASON: no historical packshot is needed to explain the technique; adding one risks turning the article into a product chronology. Typography already carries the works-as-evidence sequence.

STORY IMAGE COUNT LOCK: 1 principal image.

---

## 03 — El perfume que encargó un sultán

### `amouage-material-density-interpretive`
DECISION: USE
TYPE: interpretive
ROLE: material density / formula ambition, not literal representation of ~140 ingredients
DESIRED ASSET: `amouage-mineral-density-01.jpg`
CROP / BEHAVIOR:
- desktop: dense 16:9 or broad landscape crop after the Gold Man ingredient passage;
- detail/mobile: 4:5 crop allowed;
- frankincense/myrrh/cedar/patchouli cues may appear only if materially plausible;
- no crown, throne, gold bars, fake calligraphy, or pseudo-palace styling.

### `oman-place-documentary`
DECISION: USE
TYPE: documentary / authentic
ROLE: establish Oman as a real territory, not generic Gulf-luxury atmosphere
PREFERRED SOURCE: Wikimedia Commons `File:Landscape of Jabal Akhdar, Oman.jpg`
SOURCE: https://commons.wikimedia.org/wiki/File:Landscape_of_Jabal_Akhdar,_Oman.jpg
AUTHOR: Ontheroadom
RIGHTS: CC BY-SA 4.0
CROP / BEHAVIOR:
- desktop: 16:9 threshold/background crop; preserve terrain and vegetation;
- mobile: crop as arrival/territory image after title;
- visible caption: Jabal Akhdar, Oman + source/author/license.
NOTE: this replaces any unverified Unsplash candidate whose exact Oman location/author provenance cannot be confirmed.

### `frankincense-documentary`
DECISION: USE
TYPE: documentary / authentic
ROLE: primary material anchor; preferred over a decorative product image
PREFERRED SOURCE: Wikimedia Commons `File:Boswellia sacra kz05.jpg`
SOURCE: https://commons.wikimedia.org/wiki/File:Boswellia_sacra_kz05.jpg
AUTHOR: Krzysztof Ziarnek, Kenraiz
LOCATION: Wadi Dowkah, Dhofar, Oman
RIGHTS: CC BY-SA 4.0
CROP / BEHAVIOR:
- documentary detail, 4:5 or restrained landscape depending source crop;
- caption must identify `Boswellia sacra`, Wadi Dowkah, Dhofar, Oman;
- do not add mystical smoke treatment that converts documentary evidence into fantasy.
ALTERNATE: `File:Frankincense.JPG` may be used for resin itself; source page states resin from Dhofar, Oman and public-domain licensing.

### `amouage-contemporary-packshots-authentic`
DECISION: SKIP FOR GATE 3
REASON: the three-image maximum is better spent on territory + frankincense + material-density argument. Contemporary products belong late and can remain textual/contextual unless authentic packshots become editorially necessary.

### `amouage-gold-archive-authentic`
DECISION: OPTIONAL — SKIP
REASON: no rights-clear archive image supplied; do not fabricate Gold-era evidence.

STORY IMAGE COUNT LOCK: 3 principal images.

---

## Gate 3 acceptance conditions

Gate 3 becomes PASS only when all of the following are true on the remote branch:

1. the approved interpretive binaries exist under `public/editorial-v1/` and can be reviewed as actual files;
2. documentary files are downloaded from the exact approved source pages (or equivalent stronger sources) and retain provenance/rights in the implementation notes/captions;
3. no optional fake portrait, fake packshot or fake historical image is introduced;
4. Code wires only the approved slots and preserves the crop/behavior rules above;
5. story-level principal-image limits remain: Ambroxan 2 (optionally 3 with authentic Molecule 02), Ropion 1, Amouage 3;
6. mobile behavior follows each composition study rather than mechanically shrinking desktop.

## Handoff to Code

CURRENT RESULT: `GATE_3: WAITING_FOR_REMOTE_BINARIES`

When binaries are present and provenance is satisfied, Code may wire them with `next/image`, insert canonical full drafts, re-run Gate 2 + Gate 4 at 1440/375, perform the image authenticity/provenance audit, then send rendered evidence to final OMNI Gate 5.

Do not merge or deploy. `PRODUCTION: HOLD` remains in force.
