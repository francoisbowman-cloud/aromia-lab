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
STATE_VERSION: 38
UPDATED_AT: 2026-09-03
LAST_ACTOR: Code
LAST_ACTION: additive relay edit only. Prior turn (ChatGPT / Art Direction, STATE_VERSION 37): completed art direction and visual composition for all 18 [AROMIA_VISUAL_OPPORTUNITY] entry points across the 9 integrated sub-batch-01-territorios drafts. Canonical direction is persisted at art-direction/AROMIA_SUB_BATCH_01_TERRITORIOS_VISUAL_DIRECTION.md. The batch deliberately avoids a repeated perfume-hero template: 18 opportunities resolve into a mix of observed human photography, domestic/object studies, environmental/history imagery, material studies, documentary/typographic moments and one abstract material field. Several opportunities are intentionally implementation-native rather than generated photographs. Clean visual-only generation capsules are included for every original-image task. No publication imagery was generated in that operational repo/QA turn because docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md explicitly forbids generation from contaminated operational context. AUTHOR_INPUT_OPPORTUNITY blocks remain nonblocking. This turn (Code): the relay already told Cowork to continue with the next sub-batch — added the COWORK_NEXT_SUBBATCH self-contained pickup brief below so Cowork can start from the repo alone. No other relay field changed; ChatGPT Visual Assets remains the NEXT_ACTOR for the sub-batch-01 downstream track. Cumulative batch-100 editorial progress remains 12 / 100.
ACTIVE_OBJECTIVE: advance the 9 sub-batch-01-territorios pieces from completed art direction through isolated visual-asset generation/quarantine, Code implementation, rendered QA and manual publication while preserving the unified Aromia baseline
ACTIVE_BRANCH: main
FUNCTIONAL_BASELINE_SHA: 7315d3f2fd94b037c73dd047cd8f5e13fbcb0409
UX_UI_CLOSEOUT: audits/AROMIA_UX_UI_IMPLEMENTATION_CLOSEOUT_2026-09-02.md
UX_UI_SOURCE_AUDIT: audits/AROMIA_UX_UI_INFORMATION_ARCHITECTURE_AUDIT_2026-09-02.md
RENDER_QA_CLOSEOUT: audits/AROMIA_RENDER_QA_CLOSEOUT_2026-09-02.md
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
P0_STATUS: RESOLVED — shared shell, complete mobile nav, canonical story discovery, dead Catalog breadcrumb removed
P1_STATUS: RESOLVED FOR CURRENT BASELINE — Personas surfaced, Saber naming standardized, Quiz integrated into Discovery, Search reframed, Magazine assigned archive role, repeated touched accent/surface semantics migrated to tokens
AROMIA_QA_FIX_PR: #127 — MERGED — production commit 7315d3f2fd94b037c73dd047cd8f5e13fbcb0409
V2_CI: run 33660677100 — SUCCESS on corrective head 83f9bfb710ec723b24041e41799b657586213f45
STRICT_AUDIT: run 33660677741 — SUCCESS on corrective head 83f9bfb710ec723b24041e41799b657586213f45
RAILWAY_WEB_DEPLOYMENT: d33eaf73-2805-49cd-a1c9-3e495ef43bb5 — SUCCESS — production commit 7315d3f2fd94b037c73dd047cd8f5e13fbcb0409
RAILWAY_RUNTIME: private catalog preflight PASS count=125; Next.js ready in 524ms
BUILD_EVIDENCE: compiled successfully; static generation 29/29; relevant public routes present
OMNI_RENDER_QA: VERIFIED_BROWSER_PASS — Railway deployment 509bee11-a90a-4f5b-8efc-ae37953a7b6b — 11 PASS / 0 REVIEW / 0 FAIL over 22 viewport observations; every route produced screenshot evidence; no horizontal overflow, clipped text, console errors or page errors gated the final run
OMNI_RENDER_QA_TOOLING: image-toolkit PR #75 merged eac35cb82d74bbf543dd87a0846236417ad1c362; PR #76 merged d73f7133eb9593ef22305db2cdf8ee007817507e; PR #77 merged 2f709e88b47613ed6cdbd2459c88c1aaaffb5069
DISCOVERY_MEDIA_VERIFICATION: PASS — /api/catalog-image/loewe-001-woman-edp, /api/catalog-image/1-million and /api/catalog-image/212-vip-edp independently returned reachable image responses; mobile DOM non-load state was not a broken origin asset
BROWSER_QA_BOUNDARY: real Chromium/Playwright rendered QA IS CLAIMED for technical browser evidence. Generated PNGs were not manually inspected one-by-one for aesthetic excellence in this session; screenshot existence is evidence, not a substitute for Taste/human art-direction review.
KNOWN_NONBLOCKING_TECH_DEBT: Next.js build reports non-fatal Newsreader font-override warning; dependency installs report existing audit vulnerabilities. Neither blocked build/deploy/browser QA and neither was introduced by this correction set.
VOICE_BIBLE: AROMIA_VOICE_BIBLE.md — v0.3
EL_COLECCIONISTA: LIVE — CLOSED — browser technical gate PASS after local contrast correction — DO NOT REOPEN CASUALLY
EDITORIAL_CALENDAR_CONCURRENT_WORK: preserve commit e4a81fad5bd948a39a22ccdfe1e8125c8140f492 (100-story exploration batch) and any later calendar work; it was not reverted by this QA cycle
ACTOR_HANDOFF_PROTOCOL: docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md
VISUAL_GENERATION_PROTOCOL: docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md
SUB_BATCH_01_ART_DIRECTION: art-direction/AROMIA_SUB_BATCH_01_TERRITORIOS_VISUAL_DIRECTION.md — ART_DIRECTION READY / VISUAL_COMPOSITION READY / 18 of 18 opportunities resolved
COWORK_NEXT_SUBBATCH: GO — Cowork starts the next editorial sub-batch of AROMIA_EDITORIAL_BATCH_100.md now; independent of and non-blocked by the sub-batch-01 visual track. Read AROMIA_EDITORIAL_BATCH_100.md, AROMIA_VOICE_BIBLE.md (v0.3) and AROMIA_EDITORIAL_WORKFLOW.md first. Written and ingested so far (12 / 100): items 1, 15, 39, 42, 51, 61, 76, 89, 97 (sub-batch 01) + ambroxán 11, Ropion, Amouage (prior batch, in drafts/). Pick ~8–10 more seeds — Cowork's editorial discretion on which and how many, spread across territories, seeds are prompts not obligatory titles. Take each to EDITORIAL: READY with its own fact-check + sources + "No verificado y dejado fuera a propósito" section + [AROMIA_VISUAL_OPPORTUNITY] blocks (open entry points, not closed prompts) + optional non-mandatory [AUTHOR_INPUT_OPPORTUNITY]. Same anti-intercambiabilidad QA: opening variety, no "Sí, pero" repetition, no automatic tics, no interchangeable phrasing across pieces. Close with a READY_FOR_CODE_INGEST handoff per AROMIA_EDITORIAL_WORKFLOW.md "Cowork handoff package": record BASE_MAIN_SHA and, while the session push block persists, a portable bundle (tar.gz) with a MANIFEST.json carrying a SHA-256 per file. Do NOT push/merge — Code owns Git integration and will ingest via PR.
NEXT_ACTOR: ChatGPT Visual Assets in a clean visual-only generation context for the photographic/material tasks defined in the sub-batch art-direction file; passed outputs return through quarantine before Code ingest. Cowork continues independently with the next editorial sub-batch.
NEXT_ACTION: generate only the original-image tasks whose capsules are defined in art-direction/AROMIA_SUB_BATCH_01_TERRITORIOS_VISUAL_DIRECTION.md from a clean visual context, quarantine/reject failures, then hand passed assets plus implementation-native visual directions to Code. Code implements the 9 pieces, runs browser QA and advances them toward manual publication via /admin/magazine per decision #103. Do not reopen the closed baseline without new rendered evidence.
BLOCKERS: NONE. Visual generation is intentionally separated by protocol, not blocked.
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

> **Operational context decides what to make. Clean visual context makes the image. Quarantine decides whether the image is allowed back into Aromia.**

Do not generate publication imagery from an operationally contaminated repo/QA conversation.

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

For original-image generation, also read and obey the visual-generation isolation protocol.

Authority order:

`verifiable remote head + newest checkpoint/handoff → this relay → older handoffs → conversational memory`.
