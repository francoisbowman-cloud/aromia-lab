# Issue 185 — execution ledger

Publisher mandate: [source snapshot](MANDATE.md). Started 2026-11-13.
Base: `589eee2f0c70cf4a3cfcf589553ee9f6fcc91555`, verified against remote main.
Branch: `feat/185-release-foundation`. Status: IN PROGRESS, NOT A RELEASE CANDIDATE.

This is the first reviewed tranche, not a claim that every historic instruction
has been reconciled. External conversations are unavailable. GitHub issue HTML
and Git reads work; API/GraphQL and production requests currently return proxy 403. Google Fonts
was also blocked; that dependency has now been replaced by official local font assets. No production database credentials were requested or used.
OMNI service is unavailable; the repository's static strict audit is available.

| Origin / date | Previous state | Reassessment / current decision | Implementation / evidence / remaining gate |
| --- | --- | --- | --- |
| Issue 185, 2026-11-13 | Broad launch mandate | Retain editorial magazine and current stack; start with verifiable runtime failures | Mandate preserved; no claim of final completion |
| Current state v54, 2026-09-20 / PR178 | Search architecture described as OPEN | Git main includes `1efcf56`; implementation is merged | Production/browser regression still requires new evidence |
| PR182 / SubBatch01 P0 | Relay says nine stories fail 500 | Main contains `a2fe986` ingestion fix; do not rewrite it from stale relay | Production deployment unverified; inspect local story fixtures next |
| PR183 / cutout dark patch | Old image blockers | Main includes `589eee2`; preserve approved assets and rights | New image QA still pending |
| Local workflow, 2026-09-12 | Full migration fails on a new database | Production data gates must remain strict; local fixtures need a distinct entry point | `npm run local:db`: loopback-only *_dev DB, explicit schema list, checksum history, one-time seed; 50 perfumes/15 articles, repeat verified |
| `local:verify`, PR173 | tsc runs from monorepo root | Required quality gate must execute in app directory | Added web typecheck script and corrected root gate; passes |
| Search client, PR178 | Timeout treated like cancelled obsolete query | Timeout must expose recovery; preserve cancellation/debounce/local privacy | Fixed timeout classification, already-aborted signal, stale state guard, same-query retry; unit and real-browser recovery pass |
| `api.ts` production routing | Explicit API_URL ignored in production mode | Isolated candidate builds must not read production inadvertently | Explicit override honored; defaults preserved; three regression tests pass |
| Catalog preflight vs migration016 | Fixed 125 count despite additive expansion | A floor must accept 126+; a 50-row fixture remains degraded | Preflight fixture: 126 PASS; local 50 DEGRADED; no production assertions changed |
| Self-hosted fonts, 2026-11-13 | Google Fonts 403 prevented release builds | Keep existing families using pinned official WOFF2 files, full glyph coverage and OFL notices | Production build passes 49 routes; source checksums recorded; approximately 860 KiB total font assets, loading-budget review pending |
| SubBatch01 parser / PR182 | Escaped YAML title failed exact heading lookup, exposing editorial preamble | Read actual story heading and isolate body; parse ingest YAML with existing gray-matter | Two regression tests; nine local story routes checked after rebuild, no publishing authorization inferred |
| Persons/profile hydration | Nested attribution anchors and saved browser profile differed from SSR | Separate navigation/credit anchors; defer browser signals until mount, tolerate blocked storage | Four-route saved-profile browser run has zero hydration errors; source credits remain visible |
| Magazine title contrast P1 / v54 | White title reported on cream | Current ArticleHero owns its background; local fixture screenshot shows white on brown | Desktop/mobile light/dark sweep; actual production images/contrast remain unverified |
| Saber WS6 / PR179 | Three material photos pending | Main includes `34666d4`; do not regenerate or replace without inspection | Verify all five materials, provenance and responsive crops next |
| GUIA-VISUAL / DSI / ART_DIRECTION | Avoid purposeless 3D/parallax | Reopen as editorial tools, not default decoration; no measured story-specific benefit established yet | Keep out of first reliability tranche; comparative prototype with reduced motion and performance evidence pending |
| Tiptap architecture ticket §6.3 | Level C Canvas/WebGL extensibility, no current case | Retain extension point; no new rendering engine without a story | Prototype/evaluation pending; not silently discarded |
| El coleccionista composition / motion | No generic parallax, publication locked | Preserve approved story; investigate accumulation reveal only if new evidence justifies reopening | No changes made; keep locked |
| Editorial design learnings / visual system | White space, title/image dialogue, asymmetry, depth | Reevaluate immersion through reading quality, not effects inventory | Desktop/mobile concept comparison and independent critique pending |
| Voice Bible v0.3 / editorial batch100 | Forty-three items documented, review/AD incomplete | No automatic publishing, invented first-person memories or fabricated factual review | Draft/source/state reconciliation and fact/right checks pending |
| Personas rights ledger | Ten portraits uncleared | Preserve monograms until reusable identity-accurate sources verified | Rights review pending, no synthetic documentary portraits |
| Discovery privacy contract | Profile stays localStorage only | Preserve local ranking; no profile transmission added | Search retry sends only existing query params; atlas/subfamilies QA pending |
| CMS, SEO, accessibility, analytics, infrastructure | Broad mandate | Do not label these finished from a unit test or static audit | Full critical-flow/security/performance review and failure-state evidence still pending |

## Next executable sequence

1. Apply network draft domains, retry production GETs and GitHub API; create the draft PR for the pushed branch. Fonts no longer need network access.
2. The full local:verify now passes (41 web tests, API build, audits, typecheck, lint and production build 49/49). Preserve this baseline; rerun affected checks after new changes.
3. SubBatch01 ingestion and all nine story routes are now locally checked. Validate admin/CMS and blocked-storage flows further; keep production content/rights gates separate.
4. Reconcile release blockers against live production and current PR/issue state, then implement remaining critical failures.
5. Evaluate responsive visual propositions and historical experiments, full content/rights inventory, accessibility and performance; do not equate this tranche to launch completion.
6. Obtain independent final rendered critique and deployment/rollback evidence before requesting final publication authorization.
