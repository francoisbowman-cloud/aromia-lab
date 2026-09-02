# Editorial Home — Soft Image QA Finding

DATE: 2026-09-02
ACTOR: ChatGPT / temporary Code-role takeover
STATUS: RESOLVED_BY_CRISP_FALLBACK
SOURCE_EVIDENCE: Publisher-provided rendered screenshot, desktop

## Finding

The Editorial v1 home rhythm was approved, but its three principal interpretive raster images read as unintentionally soft / globally out of focus at rendered size:

1. `amouage-material-density-interpretive` → `/editorial-v1/amouage-mineral-density-01.jpg`
2. `ambroxan-material-interpretive` → `/editorial-v1/ambroxan-resin-abstract-01.jpg`
3. `ropion-overdose-interpretive` → `/editorial-v1/ropion-bordeaux-texture-01.jpg`

The Publisher screenshot showed softness across image information rather than a controlled shallow-depth-of-field cue.

## Diagnosis

- no CSS blur/filter is applied to the image elements;
- `.ev1-resin:after` contains an atmospheric blur, but it cannot explain global softness across all three unrelated raster sources;
- all three source JPEGs are 1600×900;
- the current desktop slots do not grossly upscale them in CSS pixels;
- `quality:95` removed avoidable Next/Image recompression loss but could not create missing source detail.

The source art is therefore treated as insufficiently resolved for these prominent cover roles.

## Final correction

Branch `fix/editorial-home-crisp-fallback` disables only the three affected interpretive raster slots (`present: false`). `VisualField` therefore renders the existing CSS art already authored for those exact boxes.

This is a deliberate quality fallback, not a redesign:

- same DOM locations and slot geometry;
- same desktop/mobile dimensions;
- same copy, spacing and reading rhythm;
- no sharpening, upscaling or synthetic detail;
- no changes to documentary assets;
- no changes to `El coleccionista` or Asset A v2;
- the old JPEG paths remain registered so a future approved high-resolution replacement can restore `present: true` without architecture changes.

The CSS backgrounds are resolution-independent, so the specific raster-softness defect cannot reproduce while these slots remain disabled. The atmospheric blur on the Amouage hero stays intentionally confined to its overlay and does not blur the underlying CSS composition globally.

## Future replacement rule

A new raster source is optional, not blocking. If/when a replacement is produced, it must follow `docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md` and pass visual quarantine before `present` returns to `true`.

### Locked visual intent

**Amouage material density** — tactile resin/mineral/wood density; broad landscape role; no pseudo-palace luxury.

**Ambroxan material** — irregular translucent/mineral behavior; familiar-but-strange tactility; no whale/ocean cliché or fake chemistry.

**Ropion overdose** — dense saturated floral/material excess with botanical plausibility; no generic romantic rose advertisement.

Any future source must have a clearly resolved focal plane and enough microtexture for the actual rendered slot.

## Gate impact

The home-softness finding is closed by a reversible crisp fallback. It does not reopen `El coleccionista`, whose release remains LIVE and locked.
