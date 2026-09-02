# Aromia — UX / UI / Information Architecture Implementation Closeout

STATUS: IMPLEMENTED IN MAIN / PRODUCTION FUNCTIONAL BASELINE
DATE: 2026-09-02
SOURCE AUDIT: `audits/AROMIA_UX_UI_INFORMATION_ARCHITECTURE_AUDIT_2026-09-02.md`
DESIGN SYSTEM: `AROMIA_DESIGN_SYSTEM.md`

## Outcome

The 2026-09-02 UX/UI/IA audit identified that Aromia behaved like two product generations living side by side: the new editorial cover/stories and the older Magazine/Discovery/Academia/Club/catalog-derived surfaces.

The implementation now establishes one public information model and one shared orientation system while preserving editorial composition freedom.

Core product principle:

> **Every click should preserve orientation, editorial context and a plausible next move.**

Design-system principle:

> **Composition may vary. Identity does not reset.**

## Phase A — System foundation

STATUS: IMPLEMENTED

- `AROMIA_DESIGN_SYSTEM.md` is canonical.
- `apps/web/src/app/design-tokens.css` is the canonical semantic visual layer.
- Semantic tokens load after legacy CSS so they remain authoritative.
- Compatibility aliases (`--bg`, `--text`, `--line`, `--surface`, `--soft`, etc.) resolve through the semantic Aromia layer.
- The crisp resin/mineral/floral Editorial v1 fields consume shared semantic tokens rather than page-local palettes.
- `--aromia-editorial-accent` replaces repeated literal green usage on touched surfaces.

## Phase B — Navigation shell

STATUS: IMPLEMENTED

Canonical public navigation model:

`AROMIA | Historias | Saber | Personas | Discovery | Club | Buscar`

Implementation:

- `apps/web/src/lib/siteNavigation.ts`
- `apps/web/src/components/NavBar.tsx`
- `apps/web/src/components/Footer.tsx`
- `apps/web/src/app/(editorial)/layout.tsx`

Resolved findings:

- Home and downstream pages now use the same global navigation semantics.
- Duplicate legacy editorial-home navigation/footer are suppressed rather than maintaining a second information architecture.
- Mobile receives the complete navigation model plus Search.
- Active states treat `/historias/*` as Historias and `/quiz*` as Discovery.
- `Saber` is the public label for the `/academia` compatibility route.
- `Personas` is primary navigation rather than a footer-only perfumer index.

## Phase C — Editorial content index

STATUS: IMPLEMENTED

Canonical story registry:

`apps/web/src/lib/editorialIndex.ts`

Archive:

`apps/web/src/components/magazine/EditorialArchive.tsx`

`/magazine` now acts as **Historias / Archivo Aromia**, not a competing second homepage.

The unified index combines:

- canonical `/historias/*` pieces;
- dynamic Magazine articles that remain in the existing backend.

The index is consumed by:

- archive navigation;
- Search;
- sitemap;
- person/story relationships where known.

This resolves the previous failure mode in which a story could leave the Home cover and effectively disappear from archive/search discovery.

## Phase D — Discovery / perfume-reference flow

STATUS: IMPLEMENTED

Discovery now behaves as one journey:

`Discovery → Quiz when useful → first result → map → perfume/reference → related content`

Changes:

- `/descubrir` explicitly offers Quiz as onboarding rather than a disconnected app.
- Discovery empty states point to Quiz.
- `/quiz` is framed as “Inicio del mapa”.
- `/quiz/resultado/[perfil]` returns into Discovery and explains that the result is a starting direction, not a permanent identity.
- `/catalogo/[slug]` no longer uses the dead conceptual breadcrumb `Inicio / Catálogo / perfume`.
- Perfume pages use `Aromia / Discovery / perfume` and explicitly behave as reference/context pages.
- Perfume pages end with `Volver a Discovery` and `Seguir leyendo` continuation paths.

The public `/catalogo` grid remains intentionally retired; individual perfume routes remain as reference objects.

## Phase E — Territory cleanup

STATUS: IMPLEMENTED

### Historias

Home = current editorial cover.

`/magazine` = archive/all stories.

Legacy `/magazine/[slug]` articles now say `Volver a Historias` and end with continuation into Historias/Discovery.

### Saber

`/academia` remains the technical route for compatibility, but the public territory is **Saber**.

The surface was reorganized around:

- Estructura
- Familias
- Concentración
- Historia

It now uses the shared editorial system and ends by returning to Historias or Discovery.

### Personas

`/perfumistas` and `/perfumistas/[slug]` are presented publicly as **Personas**.

Verified attribution rules remain intact.

Dominique Ropion's profile is connected to the canonical story `El perfumista que no teme exagerar` through the editorial index.

### Club

Club is deliberately subordinate and explicitly “En preparación”.

The page no longer implies that a full community product already exists. It keeps the waitlist while pointing users back to currently useful Historias and Discovery surfaces.

### Search

Search no longer describes Aromia as “catálogo + Magazine”.

It searches:

- fragancias;
- the unified story archive.

The user-facing search language now reflects the magazine model: perfume, historia, persona, familia, nota.

## Phase F — Verification

STATUS: FUNCTIONAL / GOVERNANCE PASS; RENDERED BROWSER SCREENSHOT PASS NOT AVAILABLE IN THIS SESSION

Verified exact functional head:

`92e8bda8ccdb38e3a263823773bcf825edd0b273`

### GitHub CI

`v2.0 CI` run `33645935860`: **SUCCESS**

Evidence includes:

- web tests PASS;
- web lint PASS;
- TypeScript `--noEmit` PASS;
- production Next.js build PASS;
- API typecheck PASS.

`Aromia Strict Audit` run `33645935867`: **SUCCESS**

Evidence includes:

- catalog regression suite PASS;
- OMNI strict governance audit `failures=0 warnings=0`;
- API build PASS;
- web lint/typecheck/build PASS;
- static generation 29/29 PASS.

The strict audit was updated only where the product taxonomy intentionally evolved: the old exact `Autores del aroma` perfumer-index string gate now recognizes the canonical `Personas` territory while preserving the reviewed-attribution requirement.

### Railway production

Production web deployment:

`a7f30f84-eb46-4f2b-83b6-3214d72ac768`

Head:

`92e8bda8ccdb38e3a263823773bcf825edd0b273`

Status: **SUCCESS**

Runtime evidence:

- private catalog preflight PASS, count 125;
- Next.js application started;
- ready in 306ms.

Build evidence:

- compiled successfully;
- static pages generated 29/29;
- relevant routes present in production build.

### Evidence limitation

The Browser plugin is not available in this session and there is no attached Playwright/browser runtime surface. Therefore this closeout does **not** claim screenshot-based desktop/mobile visual QA, DOM navigation interaction proof or browser-console proof.

This is an evidence limitation, not a build/deploy blocker. The implementation is production-functional and governance-green. The next visual/browser audit should use the Browser plugin when available and should treat any visible mismatch as new evidence rather than infer one now.

## Maintenance observations outside this UX/UI scope

Build tooling reports pre-existing dependency audit warnings, including high-severity package findings in installed dependency trees. No dependency upgrade was introduced as part of this UX/UI migration. Track dependency remediation separately so a forced package update does not become an unreviewed design/product change.

Next.js also reports a non-fatal Newsreader font-override warning during build. The build completes successfully. Treat this as separate technical maintenance unless rendered evidence shows a typography regression.

## Final state

The primary P0/P1 information-architecture findings from the source audit have been implemented in `main`.

Aromia now has one conceptual story:

- the Home is the current cover;
- Historias is the archive and reading territory;
- Saber supplies context;
- Personas connects authorship to work and stories;
- Discovery supplies exploratory/personal routes;
- perfume pages are reference objects inside that journey;
- Club remains a future continuation rather than pretending to be complete;
- Search crosses the same knowledge body.

The intended experience is no longer “an editorial homepage attached to an older perfume app.”

It is **one publication with several coherent ways into the same body of knowledge**.
