# Aromia — Current Operational State

This file is the compact relay for the command:

> **Continúa Aromia desde el repo.**

It indexes the latest verified operational state. Git history, checkpoints and canonical workflow documents remain authoritative evidence.

## Mandatory actor order

Default production order:

`Cowork → Code → ChatGPT → Code → OMNI → Code → Production`

Routine editorial loop is governed by `AROMIA_EDITORIAL_WORKFLOW.md`. `main` is the canonical remote source of truth.

Every actor must also obey:

`docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md`

A meaningful turn is not operationally complete until the next actor can continue from the repository without needing the previous chat.

## Current relay

```text
STATE_VERSION: 49
UPDATED_AT: 2026-09-12
LAST_ACTOR: Code — closed the OMNI product-cutout pilot (WS-6, D-11), merged and deployed
LAST_ACTION: `image-toolkit` (OMNI) connected in this Code session — the D-11 blocker from v48/decision #109 is gone. Ran the full pipeline (`remove_background` → `autotrim_image` → `resize_image` → `convert_image`) for the 10 slugs of `docs/images/OMNI-PILOT-2026-09-11.md`, classified A/B/C/D per the handoff (§5). Result, with Brey's explicit sign-off: **7 slugs A** (`bleu-de-chanel-edp`, `chanel-no5-edp`, `santal-33-edp`, `aventus`, `molecule-01`, `acqua-di-gio-edt`, `nishane-hacivat`) now have real `.webp` cutouts in `apps/web/public/perfumes/cutouts/` and are registered in `PERFUME_CUTOUTS` (`apps/web/src/lib/perfumeCutouts.ts`) — `ProductImage.tsx` serves them cutout-first, verified live. **1 slug B** (`oud-wood`) has a correct alpha-channel cutout but a thin edge artifact at the cap/neck join — file kept in the repo, deliberately NOT registered, needs edge cleanup before it can join the approved set. **2 slugs C** (`baccarat-rouge-540-edp`, `1-million`) are box-in-photo composition problems — **Brey explicitly decided to leave them with their box for now**, no re-sourcing, no AI generation; this is a taken decision, not an open blocker. Collateral fix: `nishane-hacivat`'s source (`cdn0.woolworths.media`) was returning HTTP 403 — re-sourced via Amazon (`m.media-amazon.com/images/I/41bBN+h5-DL._SL1500_.jpg`, product `B07TTCL5HY`, Brey confirmed it's the same product by pasting the real Amazon listing URL), and its `imagen_url` was updated in the production Postgres via `PATCH /api/admin/perfumes/44` (same admin mechanism as decision #106). Full per-slug detail, including a reusable note on a `get_result_base64` silent-truncation issue (mitigated by lowering pipeline output size, root cause not found), in `docs/images/OMNI-PILOT-RESULTADOS-2026-09-12.md`. Merged as [PR #170](https://github.com/francoisbowman-cloud/aromia-lab/pull/170) — CI green (web test+lint+typecheck+build, api, code-and-governance all PASS), squash-merged to `main`, Railway auto-deployed both services, verified live against `aromialab.com` (200 OK on the new cutout assets, `imagen_url` confirmed updated via the public API). `ticket-diseno-aromia-punta-a-punta.md` D-11 marked resolved; `ESTADO-aromia.md` decision #110.
ACTIVE_OBJECTIVE: With real cutouts now available for 7 perfumes, Fragancias direction (handoff §15) can start using them — that was explicitly blocked on this pilot. Visual QA of the 7 live cutouts (light/dark, desktop/tablet/mobile per handoff §6) has NOT been done yet — verified only via direct HTTP/API checks and one local dev render, not a full cross-viewport sweep. Asset traceability (SHA-256 + provenance ledger, handoff §8) was not built for this pilot — needed before any scale-up past these 7. Unrelated/unchanged from v48: route the merged editorial batches through ART_DIRECTION (sub-batches 03/04/05, ChatGPT/Art Direction), Cowork continues batch-100 (55 items left unwritten), SUBBATCH_01_RUNTIME_P0, MAGAZINE_ARTICLE_HERO_CONTRAST_P1, Omán hero recomposition §9.1 (already merged, PR #165 — see decision #108) and the --type-* typographic migration (still awaiting sign-off), SubBatch 01 asset 02A real-renderer integration (do NOT advance to 02B).
ACTIVE_BRANCH: main
OMNI_PRODUCT_CUTOUT_PILOT_PR: #170 — MERGED — squash into main, deployed and verified live (2026-09-12)
OMNI_PRODUCT_CUTOUT_PILOT_STATUS: WS-6 / D-11 CLOSED. 7 A (registered + live), 1 B (`oud-wood`, kept but unregistered pending edge fix), 2 C (`baccarat-rouge-540-edp`, `1-million`, deliberately left boxed by Brey), 0 blocked. Detail: `docs/images/OMNI-PILOT-RESULTADOS-2026-09-12.md`.
FUNCTIONAL_BASELINE_SHA: b15e0466214b302a433e7fa07d1f640f48f1c328
LATEST_VISUAL_ASSET_INGEST_SHA: 1a3de3c9db311ea441555bf7df2ff00f92a397f0
DEEP_DESIGN_AUDIT: audits/AROMIA_DEEP_DESIGN_INTEGRATION_AUDIT_2026-09-06.md — §6 plan by tandas; §9 corrections found while implementing
DEEP_DESIGN_CLOSEOUT_HANDOFF: handoffs/AROMIA_CODE_DEEP_DESIGN_CLOSEOUT_2026-09-07.md
DEEP_DESIGN_PR: #151 — MERGED — squash 4f80be01b02362d8ec1995c2cbd6aa7618dd42f6 (Tandas A + B)
DEEP_DESIGN_TANDA_C_PR: #154 — MERGED — squash b15e0466214b302a433e7fa07d1f640f48f1c328 (§4.7–4.11: Home reading measure, first-viewport hierarchy on familias/perfumistas/academia, /magazine index rhythm, .jump-link + .breadcrumb-link). Closeout handoffs/AROMIA_CODE_DEEP_DESIGN_CLOSEOUT_TANDA_C_2026-09-07.md. Post-deploy sweep audits/AROMIA_TANDA_C_POST_DEPLOY_SWEEP_2026-09-08.md — regression-clean.
EDITORIAL_SUBBATCH_05_PR: #153 — MERGED — squash 93937772a162d68040847f8d70cbe80baca66ce2
MAGAZINE_ARTICLE_HERO_CONTRAST_P1: /magazine/[slug] article-hero `h1` renders as a very pale cream serif on the cream paper in LIGHT mode — measured contrast ≈1.09:1 at 44–80px, effectively invisible (probe verified against a plain background, not a probe blind spot); `RESEÑA` eyebrow ≈1.53:1. DARK mode is fine (white h1 on near-black; only a small "Iniciar lectura" CTA at ≈2.3:1 @13px). NOT introduced by PR #154 — no file in b15e046 touches article-page title color (confirmed by diff; global CSS changes are `.ev1-deck` size only, `.ev1-cover-lead*` which is Home only, and purely-additive `.jump-link`/`.breadcrumb-link`). Same failure family as the `.ev1` light-on-light bug Tandas A+B fixed for cover/story headers, but on the `/magazine/[slug]` article hero — a surface those tandas did not contrast-sweep. Fix is Design-layer (bridge the hero text color to the semantic layer, as design-tokens.css does). Needs an owner. Screenshots in scratchpad out-tandac/{light,dark}-1280/magazine-articulo.png.
TYPOGRAPHIC_SCALE_TOKENS: apps/web/src/app/design-tokens.css — --type-display-1..4 / --type-deck / --type-body / --type-metadata defined, NOT yet consumed; migration needs art-direction sign-off (measured debt: 36 distinct clamp() formulas in CSS + 37 distinct text-[Npx] >=28px in TSX)
SUBBATCH_01_RUNTIME_P0: /historias/{antes-del-perfume-ya-oliamos, comprar-para-oler-o-comprar-para-tener, cuando-ya-no-hueles-tu-perfume, fougere-no-significa-viejo, huele-sintetico-que-estamos-diciendo, lavanda-limpia-medicinal-barata-elegante, nos-perfumamos-para-nosotros-o-para-los-demas, podemos-describir-un-olor-sin-compararlo, por-que-una-lista-de-notas-no-te-dice-como-huele} return HTTP 500 in production. Cause: apps/web/src/app/(editorial)/historias/subBatch01Story.tsx reads drafts/*.md from disk at render time; drafts/ is in the build context (commit e408cf2) but NOT in the runtime image. Build prerenders them (local returns 200); runtime render throws. Routes are ORPHANED — absent from sitemap.xml, unlinked from Home and /magazine — so no reader lands on a 500 and no SEO damage, but all nine SubBatch 01 stories are unreachable. Not fixed here: the handoff forbids touching SubBatch pipelines and the fix (stop reading disk at runtime — bundle the drafts, or move to the articles table) is editorial-pipeline work, not Design-layer. Needs an owner.
UX_UI_CLOSEOUT: audits/AROMIA_UX_UI_IMPLEMENTATION_CLOSEOUT_2026-09-02.md
UX_UI_SOURCE_AUDIT: audits/AROMIA_UX_UI_INFORMATION_ARCHITECTURE_AUDIT_2026-09-02.md
RENDER_QA_CLOSEOUT: audits/AROMIA_RENDER_QA_CLOSEOUT_2026-09-02.md
VISUAL_UX_FINAL_CLOSEOUT: audits/AROMIA_VISUAL_UX_FINAL_IMPLEMENTATION_CLOSEOUT_2026-09-03.md — CLOSED / IMPLEMENTED / MERGED / DEPLOYED / PRODUCTION-VERIFIED
VISUAL_UX_IMPLEMENTATION_PR: #142 — MERGED — squash b7ea63366858fa93b8555793495afffb58d99189
RAILWAY_BUILD_CONTEXT_FIX_PR: #143 — MERGED — squash e408cf20396fc5ca37d882bc41eca99358027f16
DESIGN_SYSTEM_CONTRACT: AROMIA_DESIGN_SYSTEM.md — v1.0
VISUAL_DIRECTION_SYSTEM: AROMIA_VISUAL_DIRECTION_SYSTEM.md — v1.0 — CANONICAL / compact composition authority
VISUAL_DIRECTION_FULL_AUDIT: audits/AROMIA_VISUAL_DIRECTION_FULL_AUDIT_2026-09-06.md — IMPLEMENTED
VISUAL_DIRECTION_PR: #148 — MERGED — squash de3ed9db40ca964f2a0814c92fd12985b9cab957
DESIGN_TOKENS: apps/web/src/app/design-tokens.css
NAVIGATION_MODEL: apps/web/src/lib/siteNavigation.ts
EDITORIAL_INDEX: apps/web/src/lib/editorialIndex.ts
PRIMARY_NAVIGATION: Historias | Saber | Personas | Discovery | Club; Buscar is utility
HOME_ROLE: current editorial cover
MAGAZINE_ROUTE_ROLE: /magazine = Historias / Archivo Aromia
SABER_ROUTE: /academia retained for compatibility, public label Saber
PERSONAS_ROUTE: /perfumistas retained technically, public label Personas
DISCOVERY_JOURNEY: Discovery → optional Quiz onboarding → result → map → perfume/reference → related content
PERFUME_ROUTE_ROLE: /catalogo/[slug] = reference/context object; public /catalogo grid remains retired
CLUB_ROLE: future continuation / waitlist, explicitly in preparation
SEARCH_ROLE: cross-search of fragancias + unified editorial archive
P0_STATUS: RESOLVED for the visual-direction baseline. NEW P0 surfaced by the deep-design audit: SUBBATCH_01_RUNTIME_P0 (see above) — nine orphaned story routes 500 in production; needs an owner, not a Design-layer fix.
P1_STATUS: Tandas A + B closed 26 MB third-party hotlinking, dark-theme metadata at 1.08:1, /magazine mobile overflow, two CC BY-SA images with no visible attribution. Tanda C (#154) closed the composition P2/P3 set (§4.7–4.11), regression-clean in production. ONE OPEN P1: MAGAZINE_ARTICLE_HERO_CONTRAST_P1 (light-mode /magazine/[slug] hero h1 ≈1.09:1) — pre-existing, surfaced by the Tanda C post-deploy sweep, not caused by #154. Needs a Design-layer owner.
V2_CI: PR #151 checks — api (lint+typecheck) PASS, code-and-governance PASS, web (test+lint+typecheck+build) PASS on head 523048a
STRICT_AUDIT: run 34043989456 — SUCCESS (visual-direction baseline); PR #151's code-and-governance check PASS covers strict audit + internal link integrity for this merge
RAILWAY_WEB_DEPLOYMENT: 3d9914b1-cf6d-4f2a-b7ee-b24fe69ea7ce — SUCCESS — production commit b15e0466214b302a433e7fa07d1f640f48f1c328 (api deploy 0bdacc5f also SUCCESS). Prior baseline deploy was c5b359f9 for 4f80be0.
RAILWAY_RUNTIME: production build + deploy SUCCESS for b15e046. Post-deploy Tanda C sweep: 96/100 Tanda-C-surface records HTTP 200 direct; the 4 misses were Home @1440/@1728 `networkidle` timeouts on the cold image optimizer, re-probed 200 with domcontentloaded+retry. SubBatch 01 runtime P0 unchanged (nine orphaned /historias/* still 500 at runtime).
BUILD_EVIDENCE: PR #154 CI all-green (web + api + code-and-governance PASS); PR #153 CI all-green. Production swept with headless chromium-1228 (harness in scratchpad, out-tandac/rows.json). Sweep note audits/AROMIA_TANDA_C_POST_DEPLOY_SWEEP_2026-09-08.md.
PRODUCTION_ROUTE_CHECKS: Tanda C post-deploy sweep (b15e046) — Home, /descubrir/familias, /descubrir/familias/[familia], /perfumistas, /perfumistas/[slug], /academia, /magazine, /magazine/[slug], /catalogo/[slug], /quiz all 200 across 390/768/1280/1440/1728 in light+dark (Home @1440/1728 needed a retry past a cold-optimizer timeout). Zero horizontal overflow, zero external images, zero failed images, zero broken internal pages over 100 records + 70 unique internal hrefs. `/api/catalog-buy/aventus` returns 405 to HEAD/GET by design (not a dead link). Nine SubBatch 01 /historias/* routes still 500 (SUBBATCH_01_RUNTIME_P0). Contrast: only finding is MAGAZINE_ARTICLE_HERO_CONTRAST_P1 on /magazine/[slug] light mode (pre-existing).
PERSONAS_RIGHTS_READY: Alberto Morillas + Christine Nagel use real reusable portraits with visible attribution (PerfumerPortrait.tsx renders portraitCredit as figcaption; confirmed correct in the deep-design audit §9.2). Both portraits now served locally from public/perfumistas/ through the optimizer, not hotlinked from Wikimedia.
PERSONAS_RIGHTS_BLOCKED: Francis Kurkdjian, Jacques Polge, Olivier Polge, Dominique Ropion, Anne Flipo, Quentin Bisch, Olivier Cresp, Nathalie Lorson, Frank Voelkl and Alessandro Gualtieri remain on deliberate monogram fallback until a reusable source is verified
GENERATED_IMAGE_QUARANTINE: ENFORCED — no rejected still life, laboratory scene, moodboard, infographic or synthetic portrait from the disqualified operational context was ingested
BROWSER_QA_BOUNDARY: production HTTP/runtime and build evidence are verified for this closeout; do not equate route reachability with a new exhaustive manual aesthetic review of every viewport screenshot
KNOWN_NONBLOCKING_TECH_DEBT: non-fatal Newsreader font-override warning and existing dependency audit vulnerabilities remain. Tailwind config/content globs were being resolved against process CWD — invisible in production (Railway builds with root apps/web) but `next dev apps/web` from the monorepo root emitted ZERO utilities, so every Tailwind-based component rendered unstyled in local QA. Fixed in PR #151 (postcss + tailwind.config both anchored to apps/web; output now byte-identical from either CWD). Local dev also cannot fetch Newsreader from next/font (falls back to sans), so typographic judgement must be made against production, not local. Perfumer-portrait next/image requests fetch the w=3840 variant on some viewports (sizes attr not tuned) — cold-optimizer first hit can time out a headless `networkidle` sweep (re-seen in the Tanda C sweep on Home @1440/1728); warm cache serves 200 at 25–82 KB. Tanda C did NOT tune the `sizes` attr — still open.
VOICE_BIBLE: AROMIA_VOICE_BIBLE.md — v0.3
EL_COLECCIONISTA: LIVE — CLOSED — DO NOT REOPEN CASUALLY
EDITORIAL_CALENDAR_CONCURRENT_WORK: preserve commit e4a81fad5bd948a39a22ccdfe1e8125c8140f492 and any later calendar work
ACTOR_HANDOFF_PROTOCOL: docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md
VISUAL_GENERATION_PROTOCOL: docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md — HARDENED 2026-09-03
SUB_BATCH_01_ART_DIRECTION: art-direction/AROMIA_SUB_BATCH_01_TERRITORIOS_VISUAL_DIRECTION.md — 18 of 18 opportunities resolved
SUB_BATCH_01_QUARANTINE: art-direction/AROMIA_SUB_BATCH_01_VISUAL_GENERATION_QUARANTINE.md — ACTIVE / 01A PASS / 02A PASS / 02B paused by Publisher
VISUAL_ASSET_01A_STATUS: READY — assets/visual/editorial/sub-batch-01/01A-antes-del-perfume-ya-oliamos.jpg — narrative test PASS
VISUAL_ASSET_02A_STATUS: PUBLISHER_APPROVED / PASS / READY_FOR_INGEST — external JPEG 1448×1086 — SHA256 04ed9613baab4f4a4b23c7b5714558dfbacb97635eeb242b3dd17d6f73b5c6a4 — target assets/visual/editorial/sub-batch-01/02A-comprar-para-oler-o-comprar-para-tener.jpg
VISUAL_ASSET_02A_HANDOFF: handoffs/AROMIA_VISUAL_ASSET_02A_HANDOFF_2026-09-04.md
CURRENT_GENERATION_CONTEXT: 02A generation completed and approved; no further generation authorized in this turn. 02B is explicitly paused.
EDITORIAL_SUBBATCHES_INGESTED: 01 (9, PR #136 merged), 03 (10) + 04 (11) (PR #146 merged), 05 (12, PR #153 merged squash 9393777) — all in drafts/ on main; all EDITORIAL: READY / ART_DIRECTION: PENDING, none art-directed yet. Batch-100 items covered so far: 1, 3, 5, 6, 8, 11, 13, 15, 17, 19, 21, 22, 24, 29, 30, 33, 38, 39, 41, 42, 45, 50, 51, 54, 56, 57, 61, 67, 71, 74, 76, 78, 81, 82, 87, 89, 90, 91, 93, 96, 97, 98, 99 (43 distinct items; Cowork's sub-batch-05 README tallies 42/100 — the ~1-item drift is upstream of this ingest, not introduced here). Cowork's own instruction on each bundle: do not re-propose these items.
NEXT_ACTOR: ChatGPT/Art Direction (Design) — three independent threads ready in parallel: (1) take sub-batches 03/04/05 through ART_DIRECTION (sub-batch 01 is the pattern: art-direction/AROMIA_SUB_BATCH_01_TERRITORIOS_VISUAL_DIRECTION.md); (2) `brief-design-ws6-cutouts-2026-09-12.md` — three concrete Design encargos now unblocked by the closed OMNI pilot: Fragancias index (§15, 7 real cutouts to compose with), Historias editorial rhythm (§14, never blocked), Saber materials direction (§18, 5 flagged materials). Cowork continues batch-100 (55 items left) in parallel. Code is idle on the Design pass until Publisher/Design sign off on the --type-* migration or the Omán hero, delivers a mockup/spec for one of the brief-design-ws6 encargos, or an owner is assigned to MAGAZINE_ARTICLE_HERO_CONTRAST_P1 / SUBBATCH_01_RUNTIME_P0 / the `oud-wood` edge-artifact cleanup / the 2 boxed-photo C cases.
NEXT_ACTION: ART_DIRECTION for the merged drafts, and/or produce mockups+spec for one of the 3 `brief-design-ws6-cutouts-2026-09-12.md` encargos (Design decides and composes; Code implements once a deliverable lands). Nothing else is queued for Code without a sign-off, a Design deliverable, or an owner assignment. If MAGAZINE_ARTICLE_HERO_CONTRAST_P1 is assigned to Code, the fix is small and Design-layer (bridge the /magazine/[slug] hero text color to the semantic token layer, mirroring the `.ev1` fix from Tanda A) — light mode only, dark is already correct. Full light/dark cross-viewport QA of the 7 live cutouts (handoff §13.1/§6) is still open and unassigned — flagged in the brief as something Design should watch for while composing, and a good standalone Code task once someone asks for it.
BLOCKERS: SUBBATCH_01_RUNTIME_P0 — nine orphaned /historias/* still 500 in production; editorial-pipeline, not Design; no owner. MAGAZINE_ARTICLE_HERO_CONTRAST_P1 — light-mode /magazine/[slug] hero h1 ≈1.09:1; Design-layer; no owner. Rights blockers for uncleared perfumer portraits unchanged. 02A ingest into the real renderer still pending (do NOT advance to 02B). --type-* migration and Omán hero recomposition blocked on art-direction sign-off (by design, not by defect). D-11 / OMNI product-cutout pilot is NO LONGER a blocker (closed 2026-09-12, PR #170) — remaining pilot loose ends (oud-wood edge artifact, the 2 boxed C cases, SHA-256 traceability) are documented as open but non-blocking in `docs/images/OMNI-PILOT-RESULTADOS-2026-09-12.md`.
```

## Mandatory turn-closure rule

All Aromia actors must leave a durable handoff at the end of meaningful work. The canonical protocol is:

`docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md`

Core requirement:

> **Do the work. Persist the truth. Name the next actor. Leave no conversational archaeology for the next shift.**

The Publisher must not routinely carry summaries between actors. If a binary cannot move through available connectors, the Publisher may transport the file, but the repository must already contain the semantic handoff, checksum/path and exact ingestion instructions.

## Design system — canonical rule

Canonical contract:

`AROMIA_DESIGN_SYSTEM.md`

Canonical semantic visual layer:

`apps/web/src/app/design-tokens.css`

Core rule:

> **Composition may vary. Identity does not reset.**

The semantic layer loads after legacy global styles and bridges compatibility aliases such as `--bg`, `--text`, `--line`, `--surface` and `--soft`, allowing existing Tailwind/global consumers to inherit the canonical system while migration remains incremental.

Do not perform mass token replacement merely for purity. New work and touched repeated semantics should consume tokens/primitives; composition-specific geometry may remain local when justified.

## UX / UI / information architecture — implemented baseline

Source audit:

`audits/AROMIA_UX_UI_INFORMATION_ARCHITECTURE_AUDIT_2026-09-02.md`

Implementation closeout:

`audits/AROMIA_UX_UI_IMPLEMENTATION_CLOSEOUT_2026-09-02.md`

Rendered/browser QA closeout:

`audits/AROMIA_RENDER_QA_CLOSEOUT_2026-09-02.md`

Primary principle:

> **Every click should preserve orientation, editorial context and a plausible next move.**

The current mental model is:

- Home = current editorial cover
- Historias = archive + reading territory
- Saber = reference/context territory
- Personas = people/authorship territory
- Discovery = exploratory/personal journey, including Quiz onboarding and perfume reference objects
- Club = future/community continuation, explicitly not yet a complete product
- Buscar = utility across fragancias and the editorial archive

The technical routes `/magazine`, `/academia`, `/perfumistas`, `/quiz` and `/catalogo/[slug]` may retain historical names for compatibility, but their user-facing semantic roles are defined above.

## Verification evidence

Production baseline:

`7315d3f2fd94b037c73dd047cd8f5e13fbcb0409`

GitHub v2.0 CI run `33660677100`: **SUCCESS**.

GitHub Aromia Strict Audit run `33660677741`: **SUCCESS**.

Railway production deployment `d33eaf73-2805-49cd-a1c9-3e495ef43bb5`: **SUCCESS**.

Railway runtime preflight reported private catalog count 125 and Next.js ready in 524ms. Production build compiled and generated 29/29 static pages.

### Rendered/browser evidence

The browser evidence gap is closed for this baseline.

OMNI verified Render QA deployment `509bee11-a90a-4f5b-8efc-ae37953a7b6b` observed production with Chromium/Playwright at 390×844 and 1280×900 across 11 public routes. Final summary: **11 PASS, 0 REVIEW, 0 FAIL**.

The final technical gate reported no blocking horizontal overflow, clipped text, console errors or page errors. Every route produced screenshot evidence. Context-sensitive composition heuristics remain in the evidence ledger but do not change a strict technical release state without Taste/human interpretation.

Discovery's three mobile lazy-image DOM findings were independently checked against their same-origin endpoints and all three returned reachable image responses. They therefore did not represent missing origin assets.

This is real browser/runtime QA, but it is not a claim that every generated screenshot received a manual aesthetic critique in this session. Future art-direction review should use the screenshots as visual evidence where relevant.

## Voice evolution — canonical source

The Publisher conversation analyzed on 2026-09-02 is a canonical **method** source for Aromia voice evolution.

Source analysis:

`research/aromia-voice-chat-analysis-2026-09-02.md`

Central distinction:

> **Preserve live reasoning, not transcription artifacts. Complete the thought. Never invent the life that supposedly produced it.**

## Visual-generation isolation — canonical rule

Canonical protocol:

`docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md`

Core rule:

> **Operational context decides what to make. Clean visual context makes the image. Quarantine decides whether the image is allowed back into Aromia. Narrative fidelity decides whether generation may continue.**

Do not generate publication imagery from an operationally contaminated repo/QA conversation. Do not treat generic perfume shorthand as a valid substitute for a story-specific scene. Batch generation advances only after the current asset passes its exact narrative test. Two consecutive UI/workflow drifts permanently disqualify that conversation from further generation.

## El coleccionista release lock

`El coleccionista` is LIVE. Its corrected local annotation contrast passes the verified technical OMNI browser gate in both tested viewports.

Narrative test for Asset A remains:

> **“Yo conozco ese estante.”**

Do not reopen or redesign the story without new evidence or explicit Publisher direction.

## Continuation rules

On **Continúa Aromia desde el repo**:

1. verify remote state;
2. read this relay and referenced handoffs;
3. execute the role-ready work without routine Publisher coordination;
4. preserve approved work unless evidence requires correction;
5. obey `docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md` before ending the turn;
6. update this relay at phase end when operational state/next actor changes;
7. escalate only genuine strategic, legal/rights, credential, irreversible publication or material-spending decisions.

For original-image generation, also read and obey the visual-generation isolation protocol and the active batch quarantine ledger.

Authority order:

`verifiable remote head + newest checkpoint/handoff → this relay → older handoffs → conversational memory`.
