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
STATE_VERSION: 47
UPDATED_AT: 2026-09-08
LAST_ACTOR: Code — editorial sub-batch 05 ingest (+ Tanda C implemented, parked on a branch)
LAST_ACTION: Ingested Cowork editorial sub-batch 05 (territorios) into `drafts/` — 12 pieces, from the portable bundle `aromia-sub-batch-05-territorios.tar.gz` (same session git-proxy 403 push block as every prior sub-batch; bundle BASE_MAIN_SHA 4f80be0, current baseline is c6147bb which is docs-only ahead of it, so no content drift). All 12 `.md` copied byte-identical, verified against the bundle's SHA256SUMS.txt via `sha256sum -c` (12/12 OK). No editorial content, COWORK_STAGE footer or [AROMIA_VISUAL_OPPORTUNITY] marks modified. Anti-intercambiabilidad QA already run by Cowork per the bundle README (12/12 distinct opening paragraphs; banned-word grep; two tic-word hits fixed pre-commit). Sub-batch 05 covers AROMIA_EDITORIAL_BATCH_100.md items 5, 17, 22, 29, 38, 50, 57, 71, 82, 87, 90, 96. On branch editorial/sub-batch-05-territorios, not yet pushed/PR'd (awaiting Brey's go). SEPARATELY: the deep-Design Tanda C (§4.7–4.11) is fully implemented and locally verified (vitest 31/31, lint/tsc/build clean, headless render 390/1280/1440/1728 no overflow) and is committed on branch feat/deep-design-tanda-c (commit 1cd8ba4), also awaiting Brey's go for its own PR. Closeout at handoffs/AROMIA_CODE_DEEP_DESIGN_CLOSEOUT_TANDA_C_2026-09-07.md.
ACTIVE_OBJECTIVE: Get Brey's go to open two independent PRs against main — (a) editorial/sub-batch-05-territorios (drafts ingest, EDITORIAL: READY / ART_DIRECTION: PENDING), (b) feat/deep-design-tanda-c (composition fixes §4.7–4.11). Still open and unchanged: Omán hero recomposition (§9.1) and the deliberate --type-* typographic migration (§3) both need Publisher/Design sign-off; the SubBatch 01 runtime P0 needs an owner; integrate Publisher-approved SubBatch 01 asset 02A into the real renderer for "Comprar para oler o comprar para tener" (do NOT advance visual generation to 02B); advance sub-batches 03/04/05 through ART_DIRECTION once merged; let Cowork continue batch-100 (55 items left unwritten).
ACTIVE_BRANCH: main
FUNCTIONAL_BASELINE_SHA: 4f80be01b02362d8ec1995c2cbd6aa7618dd42f6
LATEST_VISUAL_ASSET_INGEST_SHA: 1a3de3c9db311ea441555bf7df2ff00f92a397f0
DEEP_DESIGN_AUDIT: audits/AROMIA_DEEP_DESIGN_INTEGRATION_AUDIT_2026-09-06.md — §6 plan by tandas; §9 corrections found while implementing
DEEP_DESIGN_CLOSEOUT_HANDOFF: handoffs/AROMIA_CODE_DEEP_DESIGN_CLOSEOUT_2026-09-07.md
DEEP_DESIGN_PR: #151 — MERGED — squash 4f80be01b02362d8ec1995c2cbd6aa7618dd42f6
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
P1_STATUS: RESOLVED FOR CURRENT BASELINE. Tandas A + B closed additional P1s: 26 MB third-party hotlinking, dark-theme metadata at 1.08:1, /magazine mobile overflow, two CC BY-SA images with no visible attribution.
V2_CI: PR #151 checks — api (lint+typecheck) PASS, code-and-governance PASS, web (test+lint+typecheck+build) PASS on head 523048a
STRICT_AUDIT: run 34043989456 — SUCCESS (visual-direction baseline); PR #151's code-and-governance check PASS covers strict audit + internal link integrity for this merge
RAILWAY_WEB_DEPLOYMENT: c5b359f9-cbd4-442e-8607-438371378acd — SUCCESS — production commit 4f80be01b02362d8ec1995c2cbd6aa7618dd42f6 (api deploy 816d41db also SUCCESS)
RAILWAY_RUNTIME: production build + deploy SUCCESS for 4f80be0. Post-deploy production sweep: 118/119 route records HTTP 200 across 7 viewports; the 119th is the SubBatch 01 runtime P0. WARNING: v45 claimed "all nine SubBatch 01 routes prerendered successfully" — they prerender at build but 500 at runtime.
BUILD_EVIDENCE: PR #151 CI all-green; local tsc/next lint/next build clean on the merged head; production re-swept with headless Chromium (audit harness in scratchpad, out-prod-final/report.json)
PRODUCTION_ROUTE_CHECKS: post-merge sweep — Home, /magazine, /magazine/[slug], /academia, /perfumistas, /perfumistas/[slug] (real portrait + monogram), /descubrir, /descubrir/familias, /descubrir/familias/[familia], /catalogo/[slug], /buscar, /club, /quiz all 200 in every viewport; four SubBatch 01 stories (el-coleccionista, el-perfume-que-encargo-un-sultan, el-ambar-que-nunca-toco-una-ballena, el-perfumista-que-no-teme-exagerar) 200; the other nine SubBatch 01 story routes 500 (SUBBATCH_01_RUNTIME_P0)
PERSONAS_RIGHTS_READY: Alberto Morillas + Christine Nagel use real reusable portraits with visible attribution (PerfumerPortrait.tsx renders portraitCredit as figcaption; confirmed correct in the deep-design audit §9.2). Both portraits now served locally from public/perfumistas/ through the optimizer, not hotlinked from Wikimedia.
PERSONAS_RIGHTS_BLOCKED: Francis Kurkdjian, Jacques Polge, Olivier Polge, Dominique Ropion, Anne Flipo, Quentin Bisch, Olivier Cresp, Nathalie Lorson, Frank Voelkl and Alessandro Gualtieri remain on deliberate monogram fallback until a reusable source is verified
GENERATED_IMAGE_QUARANTINE: ENFORCED — no rejected still life, laboratory scene, moodboard, infographic or synthetic portrait from the disqualified operational context was ingested
BROWSER_QA_BOUNDARY: production HTTP/runtime and build evidence are verified for this closeout; do not equate route reachability with a new exhaustive manual aesthetic review of every viewport screenshot
KNOWN_NONBLOCKING_TECH_DEBT: non-fatal Newsreader font-override warning and existing dependency audit vulnerabilities remain. Tailwind config/content globs were being resolved against process CWD — invisible in production (Railway builds with root apps/web) but `next dev apps/web` from the monorepo root emitted ZERO utilities, so every Tailwind-based component rendered unstyled in local QA. Fixed in PR #151 (postcss + tailwind.config both anchored to apps/web; output now byte-identical from either CWD). Local dev also cannot fetch Newsreader from next/font (falls back to sans), so typographic judgement must be made against production, not local. Perfumer-portrait next/image requests fetch the w=3840 variant on some viewports (sizes attr not tuned) — cold-optimizer first hit can time out a headless sweep; warm cache serves 200 at 25–82 KB. Candidate for Tanda C.
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
EDITORIAL_SUBBATCHES_INGESTED: 01 (9, PR #136 merged), 03 (10) + 04 (11) (PR #146 merged), 05 (12) — 05 ingested to drafts/ on branch editorial/sub-batch-05-territorios, pending PR/merge; all EDITORIAL: READY / ART_DIRECTION: PENDING, not yet art-directed. Batch-100 items covered so far: 1, 3, 5, 6, 8, 11, 13, 15, 17, 19, 21, 22, 24, 29, 30, 33, 38, 39, 41, 42, 45, 50, 51, 54, 56, 57, 61, 67, 71, 74, 76, 78, 81, 82, 87, 89, 90, 91, 93, 96, 97, 98, 99 (43 distinct items; Cowork's sub-batch-05 README tallies 42/100 — the ~1-item drift is upstream of this ingest, not introduced here). Cowork's own instruction on each bundle: do not re-propose these items.
NEXT_ACTOR: Code — on Brey's go, open the two pending PRs (editorial/sub-batch-05-territorios; feat/deep-design-tanda-c). Then ChatGPT/Art Direction for sub-batches 03/04/05; ChatGPT/Publisher for the --type-* migration and the Omán hero if they choose to authorize either.
NEXT_ACTION: with Brey's go — push editorial/sub-batch-05-territorios and open a PR against main (drafts ingest + this relay update; mirrors PR #146). Separately push feat/deep-design-tanda-c and open its PR (read handoffs/AROMIA_CODE_DEEP_DESIGN_CLOSEOUT_TANDA_C_2026-09-07.md). Both wait on CI (web test+lint+typecheck+build, api, code-and-governance) and a squash merge; after each merge verify the Railway deploy and, for Tanda C, sweep production against aromialab.com as in Tandas A+B, then bump this relay. The SubBatch 01 runtime P0 still needs an explicit owner — editorial-pipeline, not Design.
BLOCKERS: SUBBATCH_01_RUNTIME_P0 blocks the nine orphaned SubBatch 01 stories from being reachable; it blocks neither the sub-batch-05 ingest nor Tanda C. Rights blockers for uncleared perfumer portraits unchanged. 02A ingest into the real renderer still pending. --type-* migration and Omán hero recomposition blocked on art-direction sign-off (by design, not by defect).
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
