# AROMIA EDITORIAL v1 — IMPLEMENTATION HANDOFF

HANDOFF: READY_FOR_CODE
PRODUCTION: HOLD

## Scope now ready for implementation exploration

Stories:
- `drafts/el-ambar-que-nunca-toco-una-ballena.md`
- `drafts/el-perfumista-que-no-teme-exagerar.md`
- `drafts/el-perfume-que-encargo-un-sultan.md`

Direction:
- `art-direction/editorial-batch-01-atmospheres.md`
- three story composition studies
- `art-direction/editorial-batch-01-early-omni-review.md`

System:
- `art-direction/AROMIA_EDITORIAL_ARCHITECTURE_V1.md`
- `docs/editorial/AROMIA_CONVERSATION_TO_CONTENT.md`
- `editorial/AROMIA_VOICE_LEARNING_LOG.md`

## Code objective

Build an isolated Editorial v1 implementation surface from these documents and the existing Aromia foundation. Do not reinterpret the work as a generic article template.

### Required implementation behavior
- Shared primitives may govern reading width, typography roles, captions, metadata, contextual commerce and accessibility.
- Each story owns its composition recipe and episodic palette.
- Home becomes a living-cover experiment, not a category dashboard.
- Public navigation hypothesis: Historias · Perfumes · Materia · Personas · Saber · Discovery · Buscar.
- `Fuera del radar` is a series marker, not top-level navigation.
- Preserve old production until explicit cutover.

### Asset placeholders
Until final authentic assets are acquired, Code must use explicit semantic placeholders or approved interpretive assets. It must not substitute AI-generated fake bottle/portrait imagery to make a render look complete.

Suggested asset slots:

Ambroxan:
- `ambroxan-material-interpretive`
- `clary-sage-documentary`
- `molecule-02-authentic-packshot`

Ropion:
- `ropion-authentic-portrait` OPTIONAL
- `ropion-overdose-interpretive`
- `ropion-historical-product-evidence` OPTIONAL

Amouage:
- `oman-place-documentary`
- `frankincense-documentary`
- `amouage-material-density-interpretive`
- `amouage-gold-archive-authentic` OPTIONAL
- `amouage-contemporary-packshots-authentic`

### Mobile gate
Each article must be reviewed at phone width as its own composition. Passing desktop does not imply mobile pass.

### Browser gate
Required before any production recommendation:
- visual hierarchy and crop review;
- no layout collisions;
- responsive typography;
- image authenticity/provenance audit;
- reduced-motion behavior if motion is introduced;
- keyboard/focus/accessibility basics;
- SEO metadata and indexation decision;
- contextual commerce clearly subordinate.

## Living-cover hypothesis for first integrated render

Lead: `El perfume que encargó un sultán` — strongest narrative/territory contrast.
Counterpoint 1: `El ámbar que nunca tocó una ballena` — material/light contrast.
Counterpoint 2: `El perfumista que no teme exagerar` — human/craft/color contrast.
Existing `El Coleccionista` may enter as a quieter essay/series counterpoint after fresh visual alignment review.

Do not create three equal cards. Lead must dominate; counterpoints should differ in scale and image behavior.

## Production rule

This handoff authorizes isolated implementation/rendering, not merge to `main` and not Railway deployment.

Production remains blocked until integrated browser evidence supports the explicit declaration:

`AROMIA EDITORIAL v1 — READY FOR PRODUCTION`
