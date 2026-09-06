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
STATE_VERSION: 44
UPDATED_AT: 2026-09-06
LAST_ACTOR: ChatGPT — Art Direction / Code / QA / Production
LAST_ACTION: completed the full visual-direction pass requested by the Publisher. Formalized the compact canonical composition contract in `AROMIA_VISUAL_DIRECTION_SYSTEM.md`, recorded the full audit in `audits/AROMIA_VISUAL_DIRECTION_FULL_AUDIT_2026-09-06.md`, recomposed Home from repetitive image/text bands into an editorial cover with masthead, dominant lead spread, asymmetric supporting stories, typographic index and direct Discovery family routes; moved real perfumer portrait credits out of photography into normal document flow; improved Discovery family signals to prefer canonical family pages; added a deterministic internal-link audit to Strict Audit CI. The new link gate immediately found and forced removal of a real retired `/catalogo` route in legacy TasteLanding. PR #148 merged to main as `de3ed9db40ca964f2a0814c92fd12985b9cab957`. GitHub v2.0 CI run 34043989452 and Aromia Strict Audit run 34043989456 both completed SUCCESS. Railway production deployment f9bb4d4d-5c23-46f6-aeaa-9fda8ef110bd completed SUCCESS on the same commit. No generated/quarantined publication image was ingested and PR #145 / SubBatch 01 asset 02A was not modified.
ACTIVE_OBJECTIVE: preserve the production baseline; integrate Publisher-approved SubBatch 01 asset 02A into the real article renderer for “Comprar para oler o comprar para tener” (do not advance visual generation to 02B yet); separately, advance sub-batches 03/04 through ART_DIRECTION once merged, and let Cowork continue with the next sub-batch (batch-100 has 67 items left unwritten).
ACTIVE_BRANCH: main
FUNCTIONAL_BASELINE_SHA: de3ed9db40ca964f2a0814c92fd12985b9cab957
LATEST_VISUAL_ASSET_INGEST_SHA: 1a3de3c9db311ea441555bf7df2ff00f92a397f0
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
P0_STATUS: RESOLVED
P1_STATUS: RESOLVED FOR CURRENT BASELINE
V2_CI: run 34043989452 — SUCCESS on visual-direction head 474b76e57827a849fe415979651e3d14cc2fa41a
STRICT_AUDIT: run 34043989456 — SUCCESS; OMNI governance PASS + INTERNAL LINK INTEGRITY PASS + API/web builds PASS
RAILWAY_WEB_DEPLOYMENT: f9bb4d4d-5c23-46f6-aeaa-9fda8ef110bd — SUCCESS — production commit de3ed9db40ca964f2a0814c92fd12985b9cab957
RAILWAY_RUNTIME: production build succeeded after draft-context fix; all nine SubBatch 01 routes prerendered successfully
BUILD_EVIDENCE: v2.0 CI PASS; Strict Audit PASS; internal literal-link audit PASS; API build PASS; web tests/lint/TypeScript/production build PASS; Railway generated 49/49 static pages
PRODUCTION_ROUTE_CHECKS: production deployment SUCCESS with Home, Magazine, Saber, Personas, Discovery/family routes and all current story routes included in the generated route manifest
PERSONAS_RIGHTS_READY: Alberto Morillas + Christine Nagel use real reusable portraits with visible attribution
PERSONAS_RIGHTS_BLOCKED: Francis Kurkdjian, Jacques Polge, Olivier Polge, Dominique Ropion, Anne Flipo, Quentin Bisch, Olivier Cresp, Nathalie Lorson, Frank Voelkl and Alessandro Gualtieri remain on deliberate monogram fallback until a reusable source is verified
GENERATED_IMAGE_QUARANTINE: ENFORCED — no rejected still life, laboratory scene, moodboard, infographic or synthetic portrait from the disqualified operational context was ingested
BROWSER_QA_BOUNDARY: production HTTP/runtime and build evidence are verified for this closeout; do not equate route reachability with a new exhaustive manual aesthetic review of every viewport screenshot
KNOWN_NONBLOCKING_TECH_DEBT: non-fatal Newsreader font-override warning and existing dependency audit vulnerabilities remain; neither was introduced by the visual-direction pass
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
EDITORIAL_SUBBATCHES_INGESTED: 01 (9, PR #136 merged), 03 (10), 04 (11) — 03/04 ingested to drafts/ pending merge, EDITORIAL: READY / ART_DIRECTION: PENDING, not yet art-directed. Batch-100 items covered so far: 1, 3, 6, 8, 11, 13, 15, 19, 21, 24, 30, 33, 39, 41, 42, 45, 51, 54, 56, 61, 67, 74, 76, 78, 81, 89, 91, 93, 97, 98, 99 (33/100). Cowork's own instruction on each bundle: do not re-propose these items.
NEXT_ACTOR: Code for the 02A visual-asset ingest (primary, see below). In parallel, non-blocking: Art Direction for sub-batches 03/04 once merged; Cowork may continue with the next sub-batch (67 items of batch-100 remain unwritten).
NEXT_ACTION: read handoffs/AROMIA_VISUAL_ASSET_02A_HANDOFF_2026-09-04.md; obtain the approved JPEG, verify the recorded SHA256, ingest it at the canonical asset path, integrate it into the article “Comprar para oler o comprar para tener”, preserve the intended landscape/mobile crop relationship, and run browser QA. Do not generate or implement 02B yet.
BLOCKERS: 02A binary transport only — the approved JPEG is external to the repository and must be transported to Code, then checksum-verified. No creative blocker. 02B remains intentionally paused. Separate rights blockers for uncleared perfumer portraits remain unchanged.
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
