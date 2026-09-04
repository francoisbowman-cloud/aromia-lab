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
STATE_VERSION: 41
UPDATED_AT: 2026-09-04
LAST_ACTOR: ChatGPT — Art Direction / Code / QA / Integration / Production
LAST_ACTION: completed the visual-UX implementation end-to-end. PR #142 merged the Magazine M3/M4 hierarchy, Ropion S5 documentary interruptions + omission pause, Saber SB2/SB3/SB5 semantic diagrams/material strip/timeline, and rights-cleared Personas portraits for Alberto Morillas + Christine Nagel without ingesting quarantined generated imagery. PR #143 then closed a pre-existing Railway build-context blocker by mirroring the nine consumed SubBatch 01 Markdown sources into apps/web/drafts while keeping repository-level drafts canonical. GitHub CI and Strict Audit passed and Railway production deployment 550b7cee-9cf8-466a-b3e2-40ef5ee393f2 succeeded on commit e408cf20396fc5ca37d882bc41eca99358027f16.
ACTIVE_OBJECTIVE: visual-UX closeout is COMPLETE and production-verified. Preserve this baseline. The only separate unfinished visual stream is SubBatch 01 original-image generation, still gated at slot 02A and permitted only from a genuinely clean visual-only context under the visual-generation isolation protocol.
ACTIVE_BRANCH: main
FUNCTIONAL_BASELINE_SHA: e408cf20396fc5ca37d882bc41eca99358027f16
LATEST_VISUAL_ASSET_INGEST_SHA: 1a3de3c9db311ea441555bf7df2ff00f92a397f0
UX_UI_CLOSEOUT: audits/AROMIA_UX_UI_IMPLEMENTATION_CLOSEOUT_2026-09-02.md
UX_UI_SOURCE_AUDIT: audits/AROMIA_UX_UI_INFORMATION_ARCHITECTURE_AUDIT_2026-09-02.md
RENDER_QA_CLOSEOUT: audits/AROMIA_RENDER_QA_CLOSEOUT_2026-09-02.md
VISUAL_UX_FINAL_CLOSEOUT: audits/AROMIA_VISUAL_UX_FINAL_IMPLEMENTATION_CLOSEOUT_2026-09-03.md — CLOSED / IMPLEMENTED / MERGED / DEPLOYED / PRODUCTION-VERIFIED
VISUAL_UX_IMPLEMENTATION_PR: #142 — MERGED — squash b7ea63366858fa93b8555793495afffb58d99189
RAILWAY_BUILD_CONTEXT_FIX_PR: #143 — MERGED — squash e408cf20396fc5ca37d882bc41eca99358027f16
DESIGN_SYSTEM_CONTRACT: AROMIA_DESIGN_SYSTEM.md — v1.0
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
V2_CI: run 33818390798 — SUCCESS on PR #143 head 4f14b0cbc4ea224cb3def0fa30d49c7b97318413
STRICT_AUDIT: run 33818390703 — SUCCESS on PR #143 head 4f14b0cbc4ea224cb3def0fa30d49c7b97318413
RAILWAY_WEB_DEPLOYMENT: 550b7cee-9cf8-466a-b3e2-40ef5ee393f2 — SUCCESS — production commit e408cf20396fc5ca37d882bc41eca99358027f16
RAILWAY_RUNTIME: production build succeeded after draft-context fix; all nine SubBatch 01 routes prerendered successfully
BUILD_EVIDENCE: web tests, lint, TypeScript and production build PASS; API build PASS; OMNI strict governance PASS
PRODUCTION_ROUTE_CHECKS: PASS — HTTP 200 verified after deploy for /perfumistas/alberto-morillas, /perfumistas/christine-nagel and /descubrir; production build includes /magazine, /academia, Ropion story, Personas and Discovery family routes
PERSONAS_RIGHTS_READY: Alberto Morillas + Christine Nagel use real reusable portraits with visible attribution
PERSONAS_RIGHTS_BLOCKED: Francis Kurkdjian, Jacques Polge, Olivier Polge, Dominique Ropion, Anne Flipo, Quentin Bisch, Olivier Cresp, Nathalie Lorson, Frank Voelkl and Alessandro Gualtieri remain on deliberate monogram fallback until a reusable source is verified
GENERATED_IMAGE_QUARANTINE: ENFORCED — no rejected still life, laboratory scene, moodboard, infographic or synthetic portrait from the disqualified operational context was ingested
BROWSER_QA_BOUNDARY: production HTTP/runtime and build evidence are verified for this closeout; do not equate route reachability with a new exhaustive manual aesthetic review of every viewport screenshot
KNOWN_NONBLOCKING_TECH_DEBT: non-fatal Newsreader font-override warning and existing dependency audit vulnerabilities remain; neither was introduced by this visual-UX closeout
VOICE_BIBLE: AROMIA_VOICE_BIBLE.md — v0.3
EL_COLECCIONISTA: LIVE — CLOSED — DO NOT REOPEN CASUALLY
EDITORIAL_CALENDAR_CONCURRENT_WORK: preserve commit e4a81fad5bd948a39a22ccdfe1e8125c8140f492 and any later calendar work
ACTOR_HANDOFF_PROTOCOL: docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md
VISUAL_GENERATION_PROTOCOL: docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md — HARDENED 2026-09-03
SUB_BATCH_01_ART_DIRECTION: art-direction/AROMIA_SUB_BATCH_01_TERRITORIOS_VISUAL_DIRECTION.md — 18 of 18 opportunities resolved
SUB_BATCH_01_QUARANTINE: art-direction/AROMIA_SUB_BATCH_01_VISUAL_GENERATION_QUARANTINE.md — ACTIVE / 01A PASS / current slot 02A
VISUAL_ASSET_01A_STATUS: READY — assets/visual/editorial/sub-batch-01/01A-antes-del-perfume-ya-oliamos.jpg — narrative test PASS
CURRENT_GENERATION_CONTEXT: DISQUALIFIED — DO NOT CALL IMAGE GENERATION FROM THIS OPERATIONAL CONVERSATION
NEXT_ACTOR: ChatGPT / Visual Assets in a NEW clean visual-only context when the SubBatch 01 stream is resumed; otherwise no actor is required for the completed visual-UX closeout
NEXT_ACTION: preserve the production baseline. When intentionally resuming SubBatch 01, start only at 02A in a new clean visual-only context, pass the asset through quarantine before continuing sequentially, and hand only passed binaries plus implementation-native directions back to Code/QA
BLOCKERS: NO BLOCKER for the completed visual-UX release. Separate rights blockers remain for uncleared perfumer portraits. SubBatch 01 generation is context-blocked only in this conversation and remains gated at 02A.
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
