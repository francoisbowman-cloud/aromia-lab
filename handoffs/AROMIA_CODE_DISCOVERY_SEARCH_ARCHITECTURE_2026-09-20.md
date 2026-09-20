# Aromia — Code Handoff — Discovery + Search Architecture

STATUS: READY_FOR_CODE
DATE: 2026-09-20
SOURCE: Publisher-requested follow-up to the Sites evaluation
PRIORITY: PUBLISHER-DESIGNATED PRODUCT FOCUS
OWNER: Code
BASE_REF: `main` at `6f2981c`

## Decision

Aromia remains on its current canonical stack and delivery path:

`GitHub + Next.js + Express API + Postgres/Redis + Railway + OMNI`

Do **not** migrate or duplicate Aromia in Sites. Sites may be used later for an
isolated prototype or microsite, but it must not become a second source of truth
for the magazine, catalog, Discovery, search, CMS or production deployment.

The Publisher explicitly asked that the team focus especially on **point 3 of
the evaluation: Discovery and search architecture**.

## Why this is now the focus

Current code sends the complete `Perfume[]` collection into client components:

- `apps/web/src/app/buscar/page.tsx` calls `getPerfumes()` and passes the full
  result to `DiscoverySearch`.
- `DiscoverySearch` filters, scores, sorts and slices that complete collection
  in the browser on every query/profile change.
- `apps/web/src/app/descubrir/page.tsx` also calls `getPerfumes()` and passes the
  full result to `DiscoveryDashboard`.
- `DiscoveryDashboard` derives facets, atlas previews and personalized routes
  from that complete browser-side collection.
- `getPerfumes()` uses `cache: "no-store"`.

Production sampling from the evaluation environment on 2026-09-20 returned
HTTP 200 for all inspected public routes, but showed approximately 3.96–4.22 s
TTFB in that environment. The downloaded HTML was approximately 253 KB for
`/buscar` and 266 KB for `/descubrir`, versus approximately 43 KB for
`/magazine`. These numbers are diagnostic evidence, not a universal RUM claim;
Code must establish reproducible before/after measurements from the same
environment.

The immediate architectural problem is not merely visual. Every growth step in
the catalog increases page payload, hydration work and browser-side search
cost. Aromia should not require transporting the entire catalog merely to show
an empty search screen or a small Discovery preview.

## Primary objective — point 3

Move Discovery and search to a **bounded, server-backed query model** while
preserving Aromia's existing editorial experience and privacy model.

Required outcome:

1. `/buscar` must not hydrate the full perfume catalog on initial load.
2. A search request must query the server/API with a bounded result count and
   pagination or cursor metadata.
3. `/descubrir` must receive only the compact facets, preview records and/or
   bounded candidate set needed for the current view.
4. Changing an atlas family must fetch or reveal a bounded result set; it must
   not depend on a complete browser-resident catalog.
5. Personalized ordering may continue in the browser only over a bounded
   candidate set returned by the server. Do not send identity or persist raw
   profile data server-side merely to optimize ranking.
6. Preserve the current privacy contract: the olfactory profile remains in
   `localStorage`; analytics must not send raw search text.
7. Preserve editorial and product relationships, existing URLs, SEO metadata,
   empty/loading/error states, keyboard behavior, responsive presentation and
   analytics semantics.

Code may choose the exact endpoint shape after inspecting the current API, but
the contract should support, at minimum, a query/family filter, a bounded
`limit`, pagination/cursor information and a compact response DTO. Avoid
returning fields that the result view does not render.

## Implementation sequence

### Phase A — measure and define the contract

- Capture a reproducible baseline for `/buscar` and `/descubrir`: response
  size, server response time, serialized data size and client hydration/input
  responsiveness.
- Record the fields actually consumed by search cards, Discovery atlas previews
  and personalized routes.
- Define compact DTOs and the server/API query contract.
- Determine whether editorial search should share the endpoint or remain a
  separate bounded source. Do not force unrelated content into one data model.

### Phase B — Search first

- Stop passing the complete `Perfume[]` into `DiscoverySearch`.
- Keep the initial empty-search view lightweight.
- Query only after a meaningful input, with debounce/cancellation and explicit
  loading, no-results and recoverable-error states.
- Return no more than the UI can display per page and support continuation.
- Preserve personalized tie-breaking only across the bounded relevant perfume
  candidates.

### Phase C — Discovery

- Replace the complete-catalog prop on `DiscoveryDashboard` with compact,
  purpose-specific data.
- Load atlas previews by family on demand or from a deliberately bounded
  server-rendered seed.
- Obtain a bounded recommendation candidate set and rank it against the local
  profile without uploading the profile as identity-bearing data.
- Keep the current family, note and perfumer signals intact.

### Phase D — caching and resilience

- Replace blanket `no-store` behavior where catalog freshness does not require
  it with an explicit cache/revalidation policy.
- Add bounded request timeouts/cancellation to the API path so retries cannot
  create an unbounded wait.
- Avoid caching personalized local state as shared server output.

## Acceptance criteria

- Initial `/buscar` output contains no serialized full-catalog collection.
- `/descubrir` contains only a bounded set of perfume records required for the
  first view; full catalog growth does not grow initial payload linearly.
- Search results are server-backed, bounded and continuable.
- Search does not execute a new request for every keystroke without debounce or
  cancellation.
- Existing privacy guarantees remain true and are covered by tests.
- Existing search and Discovery analytics remain free of raw search terms.
- Existing public URLs and the current visual direction remain unchanged.
- Tests cover endpoint validation, pagination/bounds, empty/error behavior and
  client integration.
- Code records same-environment before/after performance evidence.
- OMNI performs desktop/mobile regression QA before merge.
- Work lands through a PR; no direct production mutation.

## Non-goals for this implementation

- Do not migrate Aromia to Sites or another hosting platform.
- Do not redesign Search or Discovery while changing their data flow.
- Do not combine this work with the Tiptap/block-editor redesign.
- Do not replace the local olfactory-profile privacy model.
- Do not reopen approved art direction, product cutouts or editorial assets.
- Do not treat lower payload alone as success if the search journey becomes
  slower, less useful or inaccessible.

## Remaining evaluation notes — roadmap, not the active batch

1. **Performance and caching:** reduce avoidable dynamic rendering, API waits
   and oversized initial responses. This overlaps directly with the active
   Discovery/Search work and should be measured here.
2. **Structured editorial content:** evolve flat Tiptap HTML toward durable
   editorial blocks such as text, media, credit, quote, aside, comparison,
   gallery and linked perfume/person/material. Handle in a separate design/data
   contract after this batch.
3. **Discovery and search:** **ACTIVE FOCUS — this handoff.**
4. **Image governance:** consolidate source, license, author, alt text, master,
   derivatives and responsive crops in a durable asset ledger. Do not mix that
   migration into this PR.
5. **Operational simplification:** reduce duplicated handoffs and preview
   friction inside the existing pipeline; do not add Sites as a parallel
   production path.

## Existing priorities and risk boundary

This Publisher-designated focus does not erase known production issues already
recorded in `AROMIA_CURRENT_STATE.md`, especially
`SUBBATCH_01_RUNTIME_P0` and `MAGAZINE_ARTICLE_HERO_CONTRAST_P1`. Code must
preserve them in the relay and escalate if they conflict with the safe delivery
of this batch. Do not silently reclassify them as resolved.

## Turn handoff

LAST_ACTOR: ChatGPT / Sites evaluation
LAST_ACTION: evaluated Sites against the real Aromia architecture, recommended
keeping the canonical stack, and converted the Publisher's emphasis on point 3
into this implementation-ready Code handoff.
ACTIVE_OBJECTIVE: replace full-catalog browser hydration in Search and
Discovery with bounded server-backed queries and compact purpose-specific data.
ACTIVE_BRANCH / BASE_REF: new work should branch from current `main`.
STATE / GATES: scope ready; implementation not started; no production change.
DELIVERABLES: this handoff plus the updated canonical relay.
EVIDENCE: current source paths and 2026-09-20 production sampling recorded
above.
TEMPORARY_OR_EXTERNAL_ARTIFACTS: none.
NEXT_ACTOR: Code
NEXT_ACTION: execute Phase A, propose the compact query contract, then continue
through implementation, tests, before/after evidence, OMNI QA and PR without
requiring routine Publisher coordination.
BLOCKERS: none for Phase A. Existing unrelated P0/P1 items remain open in the
canonical relay.
PUBLICATION_AUTHORITY / RISK NOTES: no direct production mutation; merge and
deployment remain governed by the existing GitHub/CI/Railway workflow.
