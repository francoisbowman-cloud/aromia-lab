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
STATE_VERSION: 34
UPDATED_AT: 2026-09-02
LAST_ACTOR: ChatGPT acting as Cowork + Code + ChatGPT + OMNI + Production under explicit Publisher authorization for this UX/UI consolidation
LAST_ACTION: completed the 2026-09-02 Aromia UX/UI/information-architecture consolidation directly in main. Established one navigation model; moved Home and /historias routes onto the shared global shell; restored complete mobile navigation; made /magazine the unified Historias archive; introduced a canonical editorial story index consumed by archive/search/sitemap; reframed Search around fragancias + historias rather than catálogo + Magazine; evolved /academia into the public Saber territory; promoted /perfumistas to Personas and connected Dominique Ropion to the canonical related story; integrated Quiz as Discovery onboarding and returned quiz results into the Discovery map; reframed /catalogo/[slug] as an Aromia/Discovery reference page instead of a child of the retired public Catalog; made Club explicitly subordinate/in preparation; migrated touched UI to canonical semantic design tokens; updated the strict governance audit to recognize the intentional Personas taxonomy evolution; aligned legacy /magazine/[slug] reading routes with the Historias mental model. Functional head 92e8bda8ccdb38e3a263823773bcf825edd0b273 passed v2.0 CI and Aromia Strict Audit and was deployed successfully to Railway production.
ACTIVE_OBJECTIVE: resume editorial production from the unified Aromia product baseline; perform screenshot-based visual/browser regression QA when a Browser-capable surface is available, treating any finding as new evidence rather than reopening the architecture speculatively
ACTIVE_BRANCH: main
FUNCTIONAL_BASELINE_SHA: 92e8bda8ccdb38e3a263823773bcf825edd0b273
UX_UI_CLOSEOUT: audits/AROMIA_UX_UI_IMPLEMENTATION_CLOSEOUT_2026-09-02.md
UX_UI_SOURCE_AUDIT: audits/AROMIA_UX_UI_INFORMATION_ARCHITECTURE_AUDIT_2026-09-02.md
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
V2_CI: run 33645935860 — SUCCESS on functional head 92e8bda8ccdb38e3a263823773bcf825edd0b273
STRICT_AUDIT: run 33645935867 — SUCCESS on functional head 92e8bda8ccdb38e3a263823773bcf825edd0b273; OMNI strict audit failures=0 warnings=0
RAILWAY_WEB_DEPLOYMENT: a7f30f84-eb46-4f2b-83b6-3214d72ac768 — SUCCESS — functional head 92e8bda8ccdb38e3a263823773bcf825edd0b273
RAILWAY_RUNTIME: private catalog preflight PASS count=125; Next.js ready in 306ms
BUILD_EVIDENCE: compiled successfully; static generation 29/29; relevant public routes present
BROWSER_QA: NOT CLAIMED — Browser plugin/attached Playwright runtime unavailable in this session; no screenshot, DOM-interaction, or browser-console evidence was fabricated
KNOWN_NONBLOCKING_TECH_DEBT: Next.js build reports non-fatal Newsreader font-override warning; dependency installs report existing audit vulnerabilities. Neither blocked build/deploy and neither was introduced as part of the UX/UI IA change set.
VOICE_BIBLE: AROMIA_VOICE_BIBLE.md — v0.3
EL_COLECCIONISTA: LIVE — CLOSED — DO NOT REOPEN CASUALLY
EDITORIAL_CALENDAR_CONCURRENT_WORK: preserve commit e4a81fad5bd948a39a22ccdfe1e8125c8140f492 (100-story exploration batch) and any later calendar work; it was not reverted by this consolidation
ACTOR_HANDOFF_PROTOCOL: docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md
VISUAL_GENERATION_PROTOCOL: docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md
NEXT_ACTOR: Cowork / next editorial story; Publisher or a Browser-capable Code session may run rendered UX/UI regression inspection at any time without needing to reconstruct this chat
NEXT_ACTION: continue the editorial calendar from main using Voice Bible v0.3 and the unified navigation/content model. When Browser tooling is available, smoke-test Home → Historias/Saber/Personas/Discovery/Club/Search, mobile menu, archive → story, Search → story/perfume, Discovery → Quiz → result → map, perfume → Discovery/Historias, Personas → story/perfume, and footer paths. Only change the baseline if rendered evidence reveals a concrete regression.
BLOCKERS: none for code, governance, build or deployment. Screenshot-based rendered QA remains an evidence limitation of this session, not a production blocker.
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

Functional head:

`92e8bda8ccdb38e3a263823773bcf825edd0b273`

GitHub v2.0 CI run `33645935860`: **SUCCESS**.

GitHub Aromia Strict Audit run `33645935867`: **SUCCESS**. Strict governance output: `failures=0 warnings=0`.

Railway production deployment `a7f30f84-eb46-4f2b-83b6-3214d72ac768`: **SUCCESS**.

Railway runtime preflight reported private catalog count 125 and Next.js ready in 306ms. Production build compiled and generated 29/29 static pages.

### Rendered evidence boundary

The Browser plugin and an attached Playwright/browser runtime were unavailable in this session. Therefore no actor may reinterpret this handoff as screenshot-based visual QA. Desktop/mobile screenshots, DOM interaction evidence and browser-console inspection remain a future regression-inspection step when a capable surface is available.

A passing build does not prove visual fidelity. Conversely, the absence of browser screenshots here does not invalidate the verified code/governance/deployment baseline. New visual changes require concrete rendered evidence.

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

`El coleccionista` is LIVE. Final OMNI passed and production deployment succeeded.

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
