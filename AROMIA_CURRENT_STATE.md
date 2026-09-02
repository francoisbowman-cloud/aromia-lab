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
STATE_VERSION: 33
UPDATED_AT: 2026-09-02
LAST_ACTOR: ChatGPT (temporary Code + UX/UI audit role takeover authorized by Publisher)
LAST_ACTION: converted the crisp Editorial v1 material fix from page-local hardcoded palette values to shared semantic Aromia design tokens and established a canonical design-system contract. Added apps/web/src/app/design-tokens.css, loaded it globally from the root layout, migrated editorial-sharp.css to consume resin/mineral/floral semantic tokens, and documented hardcoding policy in AROMIA_DESIGN_SYSTEM.md. Then audited the public UX/UI/information architecture and persisted audits/AROMIA_UX_UI_INFORMATION_ARCHITECTURE_AUDIT_2026-09-02.md. The audit identifies the primary structural problem as two generations of Aromia coexisting: the new editorial cover/stories and the older Magazine/Discovery/Academia/Club/catalog-derived shell. Critical findings include two navigation shells, incomplete editorial-home mobile navigation, /historias stories disappearing from Magazine/search discovery, and perfume-detail breadcrumbs pointing to the retired Catalog architecture.
ACTIVE_OBJECTIVE: implement UX/UI navigation-shell and information-architecture consolidation in prioritized phases without flattening the approved editorial identity
ACTIVE_BRANCH: main
DESIGN_SYSTEM_CONTRACT: AROMIA_DESIGN_SYSTEM.md — v1.0
DESIGN_TOKENS: apps/web/src/app/design-tokens.css
DESIGN_TOKENS_COMMIT: 59db33ad7fd7ee54fd58e8f1782de483d4e8f780
DESIGN_TOKENS_LOAD_COMMIT: 9a3bcd55adf569f3da1e470288a0e7e97506d4a2
EDITORIAL_MATERIAL_TOKEN_MIGRATION: ada28a214695579fcaa4025a01538dc0986bb9cd
DESIGN_SYSTEM_CONTRACT_COMMIT: ad5383373ef7ec82ee5143cee4fa969e64d875c8
UX_UI_IA_AUDIT: audits/AROMIA_UX_UI_INFORMATION_ARCHITECTURE_AUDIT_2026-09-02.md
UX_UI_IA_AUDIT_COMMIT: 839cd6c222082fdb5b4569d8ed35cdd5c92c9139
DESIGN_SYSTEM_RULE: composition may vary; identity does not reset. New/touched UI must consume shared semantic tokens/primitives instead of creating private palettes unless the value is truly composition-local geometry.
UX_UI_CORE_PRINCIPLE: every click should preserve orientation, editorial context and a plausible next move.
P0_FINDINGS:
- home uses a bespoke editorial shell while downstream pages use the older global NavBar/Footer; labels and mobile behavior diverge
- editorial home hides primary navigation on mobile, leaving brand/search but no full menu
- new /historias/* stories are not inherently part of the dynamic /magazine archive or search index and can disappear from discovery after leaving the cover
- /catalogo/[slug] breadcrumb still says Inicio / Catálogo / perfume even though public /catalogo grid was intentionally retired
P1_FINDINGS:
- Personas/Perfumistas is real editorial territory but weakly surfaced
- Saber vs Academia nomenclature is inconsistent
- Quiz is conceptually onboarding for Discovery but structurally isolated
- Search still describes the old catálogo + Magazine split
- /magazine needs a clear archive role relative to the editorial home
- repeated page colors/accents remain hardcoded legacy debt and should migrate incrementally under rendered QA
PROPOSED_PRIMARY_TERRITORIES: Historias | Materia/Saber | Personas | Discovery | Club, with Search as utility
VOICE_BIBLE: AROMIA_VOICE_BIBLE.md — v0.3
EL_COLECCIONISTA: LIVE — CLOSED — DO NOT REOPEN CASUALLY
ACTOR_HANDOFF_PROTOCOL: docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md
VISUAL_GENERATION_PROTOCOL: docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md
NEXT_ACTOR: Code/ChatGPT UX/UI implementation
NEXT_ACTION: execute Phase B from the audit: unify the navigation information model and responsive behavior first. Preserve Home's cinematic composition through shell variants rather than a separate navigation architecture. Then create the canonical editorial-story index so /historias content participates in archive/search/sitemap before refactoring Discovery/perfume-reference flows.
BLOCKERS: none.
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

Canonical global editorial tokens:

`apps/web/src/app/design-tokens.css`

Core rule:

> **Composition may vary. Identity does not reset.**

A story or territory may use unique geometry when it expresses the content, but shared colors, typography roles, focus behavior, navigation semantics, repeated component behavior and recurring surfaces belong to the system.

Do not perform mass token replacement purely for architectural cleanliness. Migrate touched/repeated semantics with rendered QA.

## UX / UI / information architecture audit

Canonical audit:

`audits/AROMIA_UX_UI_INFORMATION_ARCHITECTURE_AUDIT_2026-09-02.md`

The audit treats UX and UI as one product system. The target is not merely correct URLs; it is coherent movement through a publication.

Primary principle:

> **Every click should preserve orientation, editorial context and a plausible next move.**

The proposed product model is a publication with multiple ways into the same knowledge body:

- Historias
- Materia / Saber
- Personas
- Discovery
- Club
- Search as a utility

Home should act as current editorial cover. Magazine should evolve toward archive/all stories rather than competing as a second homepage. Quiz should behave as Discovery onboarding. Perfume detail should behave as a reference/context page rather than a child of a retired storefront catalog.

## Voice evolution — canonical source

The Publisher conversation analyzed on 2026-09-02 is a canonical **method** source for Aromia voice evolution.

Source analysis:

`research/aromia-voice-chat-analysis-2026-09-02.md`

Central distinction:

> **Preserve live reasoning, not transcription artifacts. Complete the thought. Never invent the life that supposedly produced it.**

## Editorial home visual correction

The weak 1600×900 raster sources remain disabled. The active crisp material fields now consume shared Aromia design tokens rather than a private page-local palette.

Do not re-enable or sharpen/upscale the retired rasters.

## Visual-generation incident correction — canonical rule

Canonical protocol:

`docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md`

Core rule:

> **Operational context decides what to make. Clean visual context makes the image. Quarantine decides whether the image is allowed back into Aromia.**

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
