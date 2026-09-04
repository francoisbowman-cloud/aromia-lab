# Aromia — Visual UX Final Implementation Closeout — 2026-09-03

## Status

**CLOSED — IMPLEMENTED, MERGED, DEPLOYED AND PRODUCTION-VERIFIED**

This closeout records the end-to-end implementation of the visual/UX direction defined in:

- `audits/AROMIA_VISUAL_UX_BLOCK_AUDIT_2026-09-02.md`
- `art-direction/AROMIA_VISUAL_UX_ART_DIRECTION_CLOSEOUT_2026-09-03.md`

The work was executed across Art Direction, Code, QA, merge and production deployment.

## Implementation merge

PR **#142** — `Visual UX final: archive hierarchy, Ropion materials, Saber diagrams, Personas portraits`

Squash merge:

`b7ea63366858fa93b8555793495afffb58d99189`

Implemented:

### Magazine / Archivo — M3 / M4

- Lead story can own a dominant reviewed visual.
- Secondary visual rhythm is deliberately sparse; the archive is not converted into an image-card grid.
- Existing approved story visuals are reused by story ownership.
- Mobile preserves visual → corresponding story ownership.
- No generic luxury or perfume filler imagery was introduced.

### Ropion story — S5-A / S5-B

- Added a documentary rose + patchouli diptych after the overdose discussion.
- Added visible source/provenance captions.
- Added an implementation-native omission pause for `Hedione` and `Iso E Super`.
- No fabricated formula, laboratory scene or generated portrait was used.

Documentary sources:

- Red rose — Vatadoshu Phyto, Wikimedia Commons, CC0 1.0.
- Patchouli — Joe Laurence / Seychelles News Agency, Wikimedia Commons, CC BY 4.0.

### Saber — SB2 / SB3 / SB5

- Rebuilt the olfactory pyramid as semantic HTML/CSS organized by evaporation time, not as a generated infographic.
- Added a documentary material strip with source attribution.
- Connected family names to Discovery where a canonical family route exists.
- Rebuilt the history sequence as an implementation-native timeline.
- No fake archival imagery or baked-text infographic was ingested.

Material sources include:

- Bergamot — Xenocryst / Antares Scorpii, CC BY-SA 2.0.
- Pink rose — Jon Sullivan, CC0 1.0.
- Santalum album — Shyamal, CC BY-SA 4.0.
- Frankincense — existing reviewed Aromia documentary source.
- Clary sage — existing reviewed Aromia documentary source.
- Patchouli — Joe Laurence / Seychelles News Agency, CC BY 4.0.

### Personas — real portrait policy implemented

`PerfumerPortrait` now supports reviewed real portraits with visible attribution while retaining the deliberate monogram fallback when rights are not cleared.

Rights-cleared portraits integrated:

- Alberto Morillas — Mizensir, Wikimedia Commons, CC BY-SA 4.0.
- Christine Nagel — Comparfums1, Wikimedia Commons, CC BY-SA 4.0.

The remaining perfumers keep the monogram fallback by policy. Their absence of a real portrait is a rights/provenance constraint, not a broken-image state. No synthetic face was generated.

### Governance alignment

The OMNI strict audit had a stale requirement for the decorative `EditorialMood` block removed by PR #135. The audit now checks the functional `RelatedEditorial` story context instead, preserving the intent of the governance gate without resurrecting the removed nonfunctional surface.

## CI / governance evidence

PR #142 corrective head:

`d04e72096a0b09f4ff04627ae75392276df3b077`

- GitHub v2.0 CI run **33817551175** — **SUCCESS**
- Web test / lint / TypeScript / production build — **SUCCESS**
- OMNI strict governance step — **SUCCESS**

## Production deploy blocker discovered and closed

The first Railway deployment of the visual UX merge failed for a pre-existing build-context issue unrelated to the visual changes:

> `Aromia drafts directory was not found during build.`

Railway builds the web service with `/apps/web` as its root. The nine SubBatch 01 routes consumed Markdown from repository-level `/drafts`, which is outside that Docker build context.

PR **#143** fixed the deployment contract by mirroring exactly the nine currently consumed Markdown drafts to `apps/web/drafts/` while keeping repository-level `/drafts` canonical.

PR #143 squash merge:

`e408cf20396fc5ca37d882bc41eca99358027f16`

Verification:

- GitHub v2.0 CI run **33818390798** — **SUCCESS**
- GitHub Aromia Strict Audit run **33818390703** — **SUCCESS**
- Railway web deployment **550b7cee-9cf8-466a-b3e2-40ef5ee393f2** — **SUCCESS**
- Railway production commit: `e408cf20396fc5ca37d882bc41eca99358027f16`
- Production build successfully prerendered all nine SubBatch 01 story routes.

## Production QA

Production requests after the successful deploy returned HTTP **200** for reviewed routes, including:

- `/perfumistas/alberto-morillas`
- `/perfumistas/christine-nagel`
- `/descubrir`

Live page inspection confirms:

- Alberto Morillas renders a real photographic portrait and visible CC BY-SA attribution.
- Christine Nagel renders a real photographic portrait and visible CC BY-SA attribution.
- Personas retains works, related houses and continuation routes.
- The visual UX deploy is serving from the production custom domain.

The production build contains the updated:

- `/magazine`
- `/academia`
- `/historias/el-perfumista-que-no-teme-exagerar`
- `/perfumistas/*`
- `/descubrir/familias/*`

## Generated-image quarantine

No image generated from the disqualified operational conversation was ingested.

Explicitly rejected / quarantined categories remain rejected:

- decorative perfume still lifes
- generated laboratory scenes
- generated material moodboards
- generated olfactory-pyramid infographics
- generated family infographics
- synthetic perfumer portraits

The final implementation uses reviewed existing assets, reusable documentary sources and semantic implementation-native graphics.

## Remaining nonblocking constraints

1. Real portraits remain rights-blocked for:
   Francis Kurkdjian, Jacques Polge, Olivier Polge, Dominique Ropion, Anne Flipo, Quentin Bisch, Olivier Cresp, Nathalie Lorson, Frank Voelkl and Alessandro Gualtieri.
   Keep the current monogram fallback until a reusable source is verified.

2. The separate SubBatch 01 original-image generation stream remains governed by:
   `docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md`
   and its active quarantine ledger. It is not reopened by this closeout.

3. Existing nonblocking dependency audit warnings and the Newsreader font-override warning are not visual-UX release blockers and were not introduced by this work.

## Final decision

The visual-UX implementation objective that followed PRs #133/#134/#135/#139/#140 is **closed**.

No additional filler generation is required. Future visual enrichment must follow the same rule:

> **story ownership first, provenance second, image only when it earns its space.**
