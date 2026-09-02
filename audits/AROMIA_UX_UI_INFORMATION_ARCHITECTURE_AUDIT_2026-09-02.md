# Aromia — UX / UI / Information Architecture Audit

STATUS: ACTIVE AUDIT BASELINE
DATE: 2026-09-02
SCOPE: public experience, navigation, content routing, visual continuity, mobile coherence, design-system consistency

## Executive finding

Aromia has a strong editorial home and several useful downstream surfaces, but the public experience currently behaves like **two generations of the product living side by side**:

1. the new editorial publication (`/` and `/historias/*`);
2. the older product architecture (Magazine, Discovery, Academia, Club, search, perfumer profiles and perfume-detail/catalog routes).

The main UX problem is therefore not a missing page. It is **continuity**.

A user can click a coherent link and still feel as though they entered a different website, a different taxonomy or an older version of Aromia.

The main IA principle for the next phase:

> **Every click should preserve orientation, editorial context and a plausible next move.**

## 1. Current public territories

Observed public routes include:

- `/` — editorial cover / home
- `/historias/[slug]` — new canonical editorial stories
- `/magazine` and `/magazine/[slug]` — legacy/dynamic editorial archive
- `/academia` — educational/reference content
- `/descubrir` — discovery map / personalization
- `/quiz` — discovery onboarding
- `/buscar` — cross-search
- `/perfumistas` and `/perfumistas/[slug]` — people/author profiles
- `/catalogo/[slug]` — perfume detail/reference pages
- `/club` — community waitlist / future territory

The public `/catalogo` grid is intentionally retired, but individual `/catalogo/[slug]` routes remain active.

## 2. Critical UX findings

### P0 — Two navigation shells

The new editorial home hides the global header/footer and renders its own navigation shell.

Home navigation:

- Portada
- Magazine
- Saber
- Discovery
- Club
- Search icon

Global navigation on downstream pages:

- Magazine
- Discovery
- Academia
- Club
- Buscar

This creates two problems:

1. nomenclature changes (`Saber` vs `Academia`);
2. the UI/navigation model changes after the first click.

Recommendation:

Create one **Aromia Editorial Shell** with shared navigation semantics and responsive behavior, while allowing the home to have a more cinematic visual treatment.

Do not force every page to share identical layout; share orientation and interaction rules.

### P0 — Editorial home mobile navigation is incomplete

At <=800px, the custom editorial nav hides its internal `<nav>` entirely. The mobile home effectively retains brand + search but loses direct access to Magazine, Saber/Academia, Discovery and Club.

Downstream global pages do have a mobile menu.

This is a direct navigation break and should be corrected early.

### P0 — New stories and Magazine are separate content universes

The new home publishes canonical stories under `/historias/*`.

`/magazine` loads dynamic `Article[]` data and does not inherently include the new `/historias/*` story registry.

Search also searches dynamic Magazine articles, not the hardcoded/static editorial stories.

Result:

A story can be prominent on the home and effectively disappear from the archive/search experience after it leaves the cover.

Recommendation:

Create one canonical **Editorial Story Index** data source that represents all publishable stories regardless of renderer/backend.

The index should drive:

- Home story references;
- Magazine/archive visibility;
- Search visibility;
- sitemap entries;
- related-story modules;
- navigation metadata.

Rendering may remain split (`/historias/*` vs `/magazine/*`) during migration, but discovery must not be split.

### P0 — Perfume detail breadcrumb points to a retired architecture

`/catalogo/[slug]` currently displays:

`Inicio / Catálogo / [Perfume]`

But the public catalog grid has been intentionally retired.

The breadcrumb therefore describes a parent destination that no longer exists as a public browsing territory.

Recommendation:

Reframe perfume detail pages as **reference pages reached from editorial/discovery**, not children of a public store catalog.

Candidate semantic paths:

- `Inicio / Perfumes / [nombre]` only if a future editorial perfume index is created;
- `Discovery / [nombre]` for discovery-origin contexts;
- or a simplified `Aromia / [nombre]` until a durable parent territory exists.

Do not expose `Catálogo` as a dead conceptual parent.

## 3. High-priority IA findings

### P1 — `Perfumistas` is real content but weakly surfaced

Perfumistas appears in the global footer but not in the primary nav and not in the editorial-home nav.

Yet `Personas` is already an explicit editorial territory on the home, and Ropion is a featured story.

This creates an IA mismatch: Aromia says people matter editorially but hides the people index structurally.

Recommendation:

Treat **Personas** as the public editorial label and let it route to a people/perfumers territory. `Perfumistas` can remain the specific index title inside that territory.

### P1 — `Academia` is a legacy product name relative to the magazine pivot

The home already calls this territory `Saber`, while the global shell calls it `Academia`.

The underlying page contains useful reference content but visually and structurally behaves like a standalone learning microsite.

Recommendation:

Use one user-facing territory label consistently. Current editorial direction favors **Saber** or **Materia / Saber** over institutional `Academia`.

The route may remain `/academia` temporarily for compatibility/SEO while UI labels change.

### P1 — Discovery and Quiz are conceptually one journey but structurally separated

`/descubrir` tells users their map grows from exploration and explicitly mentions completing the Quiz in empty states.

`/quiz` is not in primary navigation and is exposed mainly via footer/indirect prompts.

Recommendation:

Make Quiz an onboarding state **inside the Discovery journey**, not a peer-level content territory.

Possible flow:

`Discovery → Tu mapa está vacío → Empezar con el Quiz → resultado → volver al mapa`

Keep `/quiz` as a route if needed, but users should experience it as part of Discovery.

### P1 — Search terminology still reflects the old catalog + Magazine split

Search copy says it crosses “el catálogo y Magazine”.

That wording reintroduces the old commercial architecture even though the public catalog has been retired as a destination.

Recommendation:

Search should communicate content types, not backend/product history:

- Fragancias
- Historias
- Personas
- Materias / notas (when implemented)

### P1 — `Magazine` itself is underspecified after the pivot

The home already functions like a magazine cover. A separate page titled `Magazine` can feel redundant unless its role is explicit.

Recommendation:

Define `/magazine` as **Archivo / Todas las historias**, not as another homepage.

The user mental model becomes:

- Home = current issue / editorial cover
- Historias = individual pieces
- Archivo = everything published

Route can remain `/magazine`; UI label can evolve to `Archivo` or `Historias` after validation.

## 4. UI continuity findings

### P0 — The home and downstream product use different chrome

The new editorial home has a highly restrained bespoke nav and bespoke footer.

Downstream pages use the older sticky NavBar and global Footer, with different typography, spacing, background treatment and mobile behavior.

Recommendation:

Build a shared shell with variants:

- `cover` — transparent/restrained editorial-home treatment;
- `standard` — sticky reading/navigation treatment;
- `story` — minimal reading mode.

Same information model, different presentation variants.

### P1 — Multiple background systems are hardcoded across pages

Examples observed:

- `#f7f5f0`
- `#fbf8f3`
- `#0e1311`
- `#0f0c09`
- page-specific green accents such as `#5a6b54`

These values appear repeatedly in Magazine, Discovery, Search, Club and people surfaces.

Recommendation:

Promote repeated semantics to global tokens and migrate only as surfaces are touched.

Do not flatten genuinely distinct material/editorial palettes.

### P1 — Typography role is mostly coherent but sizing is locally improvised

The font family roles are strong:

- Newsreader → editorial/display
- Archivo → body/UI
- IBM Plex Sans → metadata/utility

However many pages choose arbitrary local sizes/letter-spacing values.

Recommendation:

Create semantic typography utilities/tokens for recurring roles:

- page title;
- section title;
- story title;
- deck;
- body;
- metadata;
- utility action;
- caption.

Composition-specific headline scale can still override intentionally.

### P1 — Repeated accent color is not a canonical token

The muted green `#5a6b54` appears across Magazine and Discovery as an editorial accent but is not represented as a named shared token.

Recommendation:

If retained after visual review, promote it as a semantic editorial accent instead of repeating literal values.

### P2 — Footer and page language are inconsistent

Global footer contains the Amazon affiliate disclosure in English:

`As an Amazon Associate, we earn from qualifying purchases.`

Most of the public product is Spanish.

Recommendation:

Keep legally required wording where necessary, but pair it with a Spanish contextual disclosure or confirm exact program-language requirements.

### P2 — Voice/register variation leaks into UI copy

Examples include neutral Spanish alongside `Seguí leyendo` in Academia.

Recommendation:

Normalize product UI language separately from author voice. Aromia editorial prose can have personality; navigation and system copy should be stable and broadly neutral unless a deliberate regional voice is chosen.

## 5. Content-flow model proposed

### Primary territories

**Historias**
- current editorial cover
- archive
- individual stories
- reviews/essays/guides/culture when they are genuinely stories

**Materia**
- ingredients/materials
- families
- olfactory structure
- educational/reference content currently inside Academia

**Personas**
- perfumers
- houses/creative figures when editorially relevant

**Discovery**
- exploration by family/note/sensation
- quiz onboarding
- personal map
- perfume reference pages reached through discovery

**Club**
- future community/profile features
- should remain visually subordinate until functionality exists

### Utilities

- Search
- Privacy
- Theme preference

Utilities should not compete with editorial territories in information hierarchy.

## 6. Proposed primary navigation

Desktop conceptual model:

`AROMIA | Historias | Materia | Personas | Discovery | Club | Buscar`

Alternative if `Materia` is not ready to launch as a standalone territory:

`AROMIA | Historias | Saber | Personas | Discovery | Club | Buscar`

Do not expose both `Magazine` and `Historias` as peer labels unless they have clearly different jobs.

## 7. Click coherence rules

Every navigational click should answer three questions:

1. **Where did I arrive?**
   - clear page identity and active navigation state.
2. **Why am I here?**
   - destination continues the semantic promise of the clicked label.
3. **What can I do next?**
   - nearby continuation that does not force the user back to Home.

Examples:

### Story → perfume

A perfume mentioned inside an article may open its reference page.

That page should provide a path back to editorial context and related stories, not behave like an isolated store PDP.

### Perfumer story → person profile

A story about Dominique Ropion should naturally expose the person profile and related authored perfumes.

### Material story → material/reference territory

Ambroxan story should eventually connect to material/reference content rather than only search/product objects.

### Discovery → perfume → story

A discovered perfume should expose relevant editorial coverage when available, allowing the user to move from object to context.

## 8. Mobile UX rules

- one consistent menu model across Home and downstream surfaces;
- search reachable without losing primary navigation;
- current territory visible;
- no navigation items disappearing solely because a bespoke desktop shell collapses;
- story reading remains distraction-light;
- tap targets >=44px where appropriate;
- avoid duplicating large page-title chrome that consumes the first mobile viewport without advancing content.

## 9. Implementation phases

### Phase A — System foundation

- establish `AROMIA_DESIGN_SYSTEM.md`;
- establish shared design tokens;
- migrate the crisp editorial material fields to tokens;
- prohibit casual private palettes in new work.

STATUS: STARTED / foundation committed.

### Phase B — Navigation shell

- unify home/global navigation information model;
- add functional mobile navigation to editorial home;
- normalize `Saber`/`Academia` naming;
- surface Personas/Perfumistas coherently;
- establish shell variants rather than separate shells.

### Phase C — Editorial content index

- create canonical story registry/index;
- include `/historias/*` in archive/search;
- preserve dynamic Magazine content during migration;
- eliminate content that becomes invisible after leaving the home cover.

### Phase D — Discovery / perfume-reference flow

- fold Quiz into Discovery journey;
- remove dead Catalog breadcrumb semantics;
- reframe perfume pages as reference/context pages;
- verify every perfume card/link has a sensible return/continuation path.

### Phase E — Territory cleanup

- convert Academia into the chosen `Saber`/`Materia` territory;
- define Personas territory;
- keep Club subordinate until real functionality exists;
- normalize footer/system copy.

### Phase F — Rendered UX/UI QA

Test at minimum:

- Home → every primary nav item;
- Home mobile menu;
- Home story → story → related destination;
- Archive → story;
- Search → perfume/story/person;
- Discovery empty → Quiz → result → map;
- Discovery → perfume → related editorial;
- Person → perfume/story;
- footer paths;
- back/forward behavior;
- desktop + mobile visual continuity;
- keyboard/focus behavior;
- no dead conceptual parents.

## 10. Success definition

Aromia should no longer feel like an editorial homepage attached to an older perfume web app.

It should feel like **one publication with multiple ways of moving through the same body of knowledge**.

A reader can enter through a story, a perfume, a material, a person, a search or Discovery and still understand where they are — and where the next meaningful click leads.