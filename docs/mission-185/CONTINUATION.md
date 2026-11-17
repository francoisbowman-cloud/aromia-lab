# Issue185 continuation — 2026-11-13

Actor: Codex / Code. Branch: `feat/185-release-foundation`.
New implementation: `a188f59` (CMS recovery), `32c567c` (mobile navigation),
`ecca610` (reader recovery), `56592a1` (bounded mobile article list),
`0f35851` (missing-content versus unavailable-service distinction).
Draft PR: https://github.com/francoisbowman-cloud/aromia-lab/pull/186
This continues the original mission. It does not reapply the previous environment
configuration or authorize an application publication.

## Completed in this continuation

The published environment restored the existing checkout, installed dependencies
and Docker database data. GitHub API and production GETs now work with TLS.
The first tranche was already pushed, so no previous change was recreated.
PR186 was created as a draft; the initial revision passed web, API, governance
and catalog CI. Check the latest head separately after this continuation is pushed.
No merge, deployment, environment publication or production data mutation occurred.

CMS failures were reproduced before changes: creating a second draft with the
same title returned500; a failed detail request supplied no recovery. The CMS
now supports unique generated slugs for same-title drafts, explicit-slug409,
empty-title400, bounded authenticated requests, recoverable login/list/detail/
save states, and saved-draft confirmation. Failed saves retain the edited content.
Field changes merge into current state so editor callbacks do not replace other
fields with stale values. Selection clears the previous editor while new data
loads. Inputs have associated labels; academia is a valid editable category.
The article list is bounded and scrollable, keeping the mobile editor reachable
without scrolling past the entire archive. Inactive mobile navigation is invisible and its hidden links cannot receive
keyboard focus. The menu advertises its expanded state and controlled region.

Authenticated proxy requests honor explicit API_URL, preserve Headers objects,
fail closed when the token is absent, return502 for unavailable upstream and
preserve meaningful backend status responses. Login malformed JSON returns400;
unconfigured administration returns503. No raw local credentials were committed.

## Validation and evidence

- Full `API_URL=http://localhost:4000 CIRCLE_NODE_TOTAL=3 npm run local:verify`:
  53 web tests, lint, typecheck, API build, link audit, OMNI static audit and
  production build49/49 pass. The static audit is not an independent creative gate.
- Local API contract: generated-title repeated drafts201/201; explicit-slug
  create/conflict201/409; empty title400.
- Chromium/Playwright on the compiled local app: failed login -> usable retry;
  two new drafts; title/author/category/Tiptap content edit; aborted save ->
  retained text -> retry -> saved borrador; reload -> persisted content;
  list failure -> retry -> restored list. No publication button was activated.
- Desktop1280x900 and mobile390x844. No JavaScript page errors or horizontal
  overflow in that flow. Viewport changes must finish before screenshots;
  an initial mobile screenshot captured the sidebar mid-transition and was
  replaced after waiting for its closed position.
- `evidence/cms-qa.json`, CMS screenshots and live HTTP JSON retain bounded
  evidence. Temporary browser scripts/logs live outside the repo in /tmp and
  /workspace/aromia-evidence. They are not the canonical handoff.

## Reader recovery added

Missing SubBatch01 content now uses the authored absence page rather than a
runtime exception. An upstream service failure remains an error/retry path;
it is not silently converted into an absent story. Unexpected render failures use a recovery boundary with
retry and archive navigation. The absence page has an h1 and uses canonical
surface tokens. This improves reader behavior; it does not restore the nine
missing production stories or clear their publication gate.

A local HTTP fixture proxy supplied one404 story and one malformed-source story
to the compiled app. Chromium verified the absence heading, recovery heading,
retry control and archive navigation at390px, without horizontal overflow.
See evidence/recovery-qa.json and recovery-mobile.png. These are deliberate
local faults, not claims about deployed production behavior.

## Revalidated live release blocker

Production API currently returns125 perfumes and15 legacy articles. All nine
SubBatch01 `/api/articulos/<slug>` endpoints return404. The public huele-sintetico
route returns a streaming HTTP200 shell without an article heading, ending in
Next error digests. A response code alone is NOT a successful story render.
The earlier main-branch ingestion implementation therefore does not prove that
its data was installed in production. Keep SUBBATCH_01_RUNTIME_P0 OPEN.

The nine fixtures are present in the local aromia_dev database and were tested
in the initial tranche. Restoring production requires determining actual schema/
deployment state, factual and rights review/publication state, and an explicitly
authorized ingest. Do not make public content writes just because this script
exists. No production secrets were requested or printed in this continuation.

## Browser trust limitation

The browser's production navigation returns ERR_CERT_AUTHORITY_INVALID while
curl succeeds with normal TLS validation. Auto-review initially rejected a CA
trust-store change without explicit consent. The Publisher then explicitly
chose to authorize the environment proxy CA in Chromium. NSS import was performed
into the user's legacy and newer store locations; the new store lists the CA.
Chromium still rejects the production certificate. No TLS verification was
disabled. Browser production QA remains blocked by this client trust problem;
HTTP evidence must not be presented as a visual or browser result.

## Next executable work

1. Verify latest PR186 CI after the new head is pushed; keep the PR draft and
   main unchanged until final release controls authorize otherwise.
2. Prepare the missing production-story recovery through factual/rights and
   deployment/schema checks. Production write credentials belong in secure
   settings only if an authorized operation requires them, never chat.
3. Extend CMS QA to detail-request failure/switch races, upload and session
   expiry; complete content/rights inventory, accessibility and performance
   work from TRACEABILITY.md. The mission is not limited to this CMS tranche.
4. Investigate Chromium trust through supported platform configuration. The
   necessary user authorization was already supplied; do not ask for it again.
5. Continue historical visual-experiment comparison and independent creative
   review before preparing the final publication decision.

STATE: IN PROGRESS. No launch-ready or LIVE claim.

## Active continuation — persistent media and container candidate

The Chromium trust blocker above is resolved: running Chromium with its normal
NSS store outside the filesystem sandbox works with the explicitly authorized
public environment CA. TLS checks remain enabled. Live read-only browser checks
reproduced Personas hydration errors and the missing SubBatch01 reader failures.

Implemented PostgreSQL-backed uploads (migration023), same-origin public media
transport, bounded admin upload handling, cover/social image editing and
non-root multi-stage Docker images. Local browser upload, invalid-type retention,
fresh-process persistence and actual Node20 container upload passed. A dedicated
loopback aromia_release_dev snapshot imports125 public perfumes/15 public articles
and passes the original migration assertions without bypasses. No production
content writes occurred. Full local:verify passed: link/governance audits, API
build and upload test,60 web tests, lint, typecheck and production web build.

Candidate accessibility sweep covered52 states and exposed contrast/progress
semantics defects; targeted fixes are implemented and await the rebuilt candidate
sweep. Initial Docker images passed startup/health with UID1000. Media durability
across a container restart, final image rebuild and rollback documentation remain.
Evidence is under /workspace/aromia-evidence (outside the checkout).

Editorial readiness now maps43 of100 agenda topics to existing drafts;57 have no
mapped draft. This is coverage, not approval or a publication quota. Source-host
network configuration was saved as a draft; source verification depends on that
configuration being applied. No magazine deployment is authorized.

The Publisher has now explicitly requested creative freedom, colorimetry and
editorial composition. The active next pass develops a warmer, more expressive
cover with coordinated desktop/mobile and downstream section references before
implementation. Existing UI studies are not publication photographic assets.
STATE remains IN PROGRESS; PR186 remains draft and main unchanged.

## Active visual continuation — glamour, composition and framework support

Publisher explicitly rejected a newspaper-like result and requested a more
expressive magazine, creative ingredient reuse and framework/tool assistance.
Implemented a cover with an oversized burgundy masthead, forest panoramic lead,
authentic Salvia sclarea paper inset, burgundy rose spread and sparse index.
Motion14.14.0 supplies only a bounded interpretive image drift; source photography
on the cover remains uncropped and static. Details, accepted visual studies,
provenance and fidelity adaptations: docs/design/cover-glamour-185.md.

Twelve width/theme states passed loading/overflow/page-error/axe checks. Motion
normal/reduced/no-JS behavior and keyboard/menu/theme flows passed. Lint and
TypeScript pass. Full production/container rebuild is the next required check.
The28-ingredient ZIP remains unavailable; no missing binary was faked. New
bergamot interpretation is explicitly labeled and licensed,38,236 bytes.

Added commons.wikimedia.org, upload.wikimedia.org and creativecommons.org to the
existing source-host network draft, preserving prior custom hosts and package
presets. Save confirmed, requires_publish:true. Runtime source connections still
return CONNECT403. User was informed that environment review/save/publish applies
this configuration; magazine production remains unchanged.

## Reader/editor integrity continuation

Three legacy story openings now continue the cover's art direction: forest for
Omán, burgundy for Ropion, authentic botanical plate for Ambroxan. Hero image
ratios and credits are explicit and visible. Intro/section accents follow the
same palette; full authored body text is retained. Sixty route/width/theme states
passed axe/error/overflow checks in the local browser. Desktop/mobile reader
concepts and actual captures were inspected directly.

CMS now edits source Markdown rather than showing a blank HTML editor for those
stories. Title saves synchronize the actual source heading. Public article
responses select explicit fields and strip editorial preparation from Markdown,
retaining visual insertion markers. Public HTML preserves captioned images while
removing executable markup. JSON-LD serialization escapes HTML script boundaries.
Three API content tests include the49-file source corpus; web tests now61 pass.

Tiptap captioned images support upload, alt text and source caption, insertion at
the selected text position and metadata editing. Inline uploads do not replace
the cover. Real browser QA passed insert/save/reload/publish-to-local-reader,
caption roundtrip, retained cover, mobile fit and Markdown editor/private-source
separation. Evidence: /workspace/aromia-evidence/inline-qa.json. No production
content writes occurred. A task-created orphan development API was unresponsive
at100%CPU; replaced only that process with the compiled API using existing local
keys and a durable log. Runtime health and editor workflow then passed.

The ingest script now creates drafts and preserves existing published content.
Only --publish-local-fixtures on loopback *_dev outside production permits local
published fixtures. Tested fresh9 drafts, preserved published body, local fixture
publication, idempotent rerun and three unsafe-target refusals. Complete public
snapshot now fetches each article body (the listing alone is metadata). New
aromia_release_full_dev has125 public perfumes/15 full public articles, plus9
explicitly published LOCAL fixtures for reader/container QA. Original receipt
counts are not a claim that fixtures are live or fact-approved.

Publisher has asked for web research, strict UI/UX critique, editorial web-app
principles and selective AI retouch. Read actual public sources from official
GitHub repositories: Google web.dev typography/layout, IBM Design Language
photography/editorial rhythm/type, W3C contrast/reflow, GOV.UK navigation/tabs.
Source text/blob receipts are /workspace/aromia-evidence/research. Direct Vogue
and NNGroup requests are blocked by current network policy, and were not claimed
reviewed. Codex Security tools/reference preflight are unavailable; no formal
Codex Security scan completion is claimed.

Next: fix the newly observed320px masthead glyph clipping (overflow alone missed
it), strengthen the archive composition and deep-link filter UX, integrate the
new lemon reference edit and the actually delivered approved02A source. Source
handoff from PR145 explicitly supersedes the older02A metadata: delivered JPEG
is1536×1152,273581bytes,SHAa07de6e766bb518463d8108e3cd08642fece2902474c666b2716b2d549c2e35d.
Actual file recovered and visually inspected; narrative objects are intact.
Final host/container builds, durability/recovery and performance checks remain.
