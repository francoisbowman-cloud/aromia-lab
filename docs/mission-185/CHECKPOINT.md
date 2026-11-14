# Execution checkpoint — Issue 185

Historical first-tranche checkpoint. See [CONTINUATION.md](CONTINUATION.md) for
the latest restored environment, PR186, CMS fixes and production observations.

Date: 2026-11-13. Actor: Codex / Code.
Branch: `feat/185-release-foundation`, base `589eee2`.
Implementation commits: `e70445c`, `ea2f7a3`, `bf38aed`, `0424ccd`,
`fbaa7f9`, `94bc3f1`, `d97faa2`. Documentation commit follows these.

## Verified result

- `API_URL=http://localhost:4001 CIRCLE_NODE_TOTAL=3 npm run local:verify`: PASS,
  including 41 web tests, lint, typecheck, API build, internal-link audit
  (48 links/34 routes), OMNI strict audit (zero failures/warnings) and production
  build (49/49 static-generation targets). This is the repository script,
  not an independent OMNI visual/creative service or a full security audit.
- PostgreSQL16 and Redis7 run in repository Docker Compose. New `local:db`
  creates a separately named development database, seeds once and preserves it
  on repeat. Remote/non-development database targets rejected before connection.
- Compiled-app Chromium/Playwright: seven public routes at 390/1280px in
  light/dark (28 records): 200, meaningful h1, no horizontal overflow or
  JavaScript page errors. See `evidence/route-sweep.json`. This is sampled QA,
  not a manual review of every paragraph, image, interaction or device.
- Search: request failure -> visible retry -> twelve real local results;
  screenshot evidence at desktop/mobile. Unit tests cover real six-second
  timeout classification and obsolete/already-aborted requests.
- Saved-profile hydration: Personas, Discovery, Buscar and magazine article
  checked with browser-local profile present; no hydration errors after fixes.
  Original sweep exposed nested portrait-credit anchors; those were corrected.
- Nine SubBatch01 repository drafts ingested into **local aromia_dev only**;
  nine story pages return200 with titles and no operational preamble/overflow/
  JavaScript page errors. `huele-sintetico` now has ordinary quotation marks.
  Local story fixtures are not a factual/rights review or authorization to publish.
- Preflight: local 50-row fixtures correctly report DEGRADED; a 126-row mock
  reports PASS rather than incorrectly rejecting additive catalog growth.
- Font artifacts are official pinned OFL files, converted losslessly to WOFF2,
  with manifest checksums. Full glyph coverage totals approximately860KiB.
  Final typography taste approval and loading-budget assessment remain open.

## Current instance versus reusable state

`aromia_dev` currently contains 50 perfume fixtures and24 local article fixtures
(15 legacy plus9 SubBatch01); clean bootstrap intentionally creates50/15.
The extra9 were imported by the existing ingest script with explicit local URL.
API4001 reads aromia_dev; API4000 is the earlier onboarding fixture database.
The compiled web on3000 uses server API4001; browser search was built for4000.
Both are local fixtures. Future tasks should restart with one consistent API URL
rather than assume these processes/ports or Docker state survive restoration.

npm dependencies and local env files are ignored. Keep them out of commits.
The environment draft contains tested install/start instructions and new network
requirements, but has not been published by this task. No deployment was made.

## Access gaps and pending work

Git HTTPS read/push works. GitHub REST/GraphQL requests and production-domain
requests return proxy403 under the current enforced network policy. Draft PR
creation was attempted with `gh pr create --draft`, but GraphQL was forbidden;
no PR number exists. The branch is pushed, including this checkpoint after the
final push. A push is not a merge, deployment or proof of production behavior.

Saved required custom domains: api.github.com, aromialab.com, www.aromialab.com,
api-production-fe2f.up.railway.app. Apply/save the environment settings and publish
the **environment configuration** as required by the platform, then recheck
access. This does not authorize publication of Aromia. Google Fonts domains
are no longer required because fonts are local.

NEXT_ACTOR: Code.
NEXT_ACTION: retry GitHub/production access after settings apply, open a draft PR
for this branch against main using the problem/validation above, read the
traceability ledger and continue the remaining live blocker reconciliation,
CMS/accessibility/performance work, content/rights inventory and experimental
visual comparison. `main` has not been changed. No automatic merge authorized
by this checkpoint. Obtain final publication authorization only after the
whole release candidate and required independent gates are concrete.

BLOCKERS: current network policy prevents API/production verification and PR
creation; external chats and independent OMNI are unavailable. These do not
mean all other work is done: the mission ledger explicitly retains unfinished
editorial, visual, rights and broader launch validation work.

PUBLICATION: NOT LIVE; Issue185 is NOT complete. No production writes,
credential changes, purchases, irreversible deletion or deployment performed.
