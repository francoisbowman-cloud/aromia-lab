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
STATE_VERSION: 31
UPDATED_AT: 2026-09-02
LAST_ACTOR: ChatGPT (editorial voice evolution)
LAST_ACTION: dissected the Publisher conversation as a canonical voice-evolution source and promoted the supported findings into AROMIA_VOICE_BIBLE.md v0.3. Added research/aromia-voice-chat-analysis-2026-09-02.md to preserve the reasoning evidence without treating raw voice transcription as finished prose. Voice v0.3 now formalizes: live reasoning over polished template logic; completing supported unfinished thoughts without inventing biography; contradiction as a change of pressure rather than repetitive `sí, pero`; small ordinary incidents as legitimate essay origins; the asymmetry between the wearer's own perception and other people's experience of a fragrance; survival of ordinary social language; domestic realism over automatic luxury framing; and new editorial tests for origin pressure, honest thought completion, contradiction variety, scene survival and perception gaps.
ACTIVE_OBJECTIVE: resume normal Aromia editorial production using Voice Bible v0.3 as the canonical voice contract
ACTIVE_BRANCH: main
VOICE_BIBLE: AROMIA_VOICE_BIBLE.md — v0.3
VOICE_SOURCE_ANALYSIS: research/aromia-voice-chat-analysis-2026-09-02.md
VOICE_EVOLUTION_COMMIT: 7d7095c288e2e88aae516b43b3b3178ec71c7dca
HOME_FIX_PR: #126 — MERGED
HOME_FIX_MERGE: 1b3cad8575e6b7281feef05589352f63c0ddce35
HOME_FIX_DEPLOYMENT: Railway 90ad55bb-4444-41fb-8009-208d43bba0d6 — SUCCESS
HOME_VISUAL_QA: RESOLVED_BY_CRISP_FALLBACK
EL_COLECCIONISTA: LIVE — CLOSED — DO NOT REOPEN CASUALLY
EL_COLECCIONISTA_FINAL_OMNI: PASS
EL_COLECCIONISTA_PUBLISH: LIVE
EDITORIAL_VOICE_RULE: study how the Publisher thinks, not the surface artifacts of voice transcription. Complete the thought when direction is supported; never fabricate the life behind it.
CONTRADICTION_RULE: `sí, pero` is not a branded catchphrase. Vary or remove contradiction mechanisms so the reader feels thought changing direction rather than a repeated editorial device.
PERCEPTION_RULE: when relevant, consider the gap between wearer intention/self-perception and how fragrance is experienced by other people; do not force this into etiquette advice.
ORDINARY_SCENE_RULE: preserve domestic and social specificity. Do not automatically elevate everyday perfume life into luxury advertising language or perfume jargon.
ACTOR_HANDOFF_PROTOCOL: docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md
VISUAL_GENERATION_PROTOCOL: docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md
NEXT_ACTOR: Cowork / next editorial story
NEXT_ACTION: continue the editorial calendar/workflow from main. Cowork must read AROMIA_VOICE_BIBLE.md v0.3 plus the canonical source analysis before drafting the next story. Treat El coleccionista and the home-softness correction as closed baselines unless new evidence or explicit Publisher direction requires reopening them.
BLOCKERS: none.
```

## Mandatory turn-closure rule

All Aromia actors must leave a durable handoff at the end of meaningful work. The canonical protocol is:

`docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md`

Core requirement:

> **Do the work. Persist the truth. Name the next actor. Leave no conversational archaeology for the next shift.**

The Publisher must not routinely carry summaries between actors. If a binary cannot move through available connectors, the Publisher may transport the file, but the repository must already contain the semantic handoff, checksum/path and exact ingestion instructions.

## Voice evolution — canonical source

The Publisher conversation analyzed on 2026-09-02 is now a canonical **method** source for Aromia voice evolution.

Source analysis:

`research/aromia-voice-chat-analysis-2026-09-02.md`

The central distinction is:

> **Preserve live reasoning, not transcription artifacts. Complete the thought. Never invent the life that supposedly produced it.**

Voice-mode restarts, filler, malformed speech and accidental repetition are not style requirements. What matters is the behavior underneath: reformulation, changing angle, ordinary observations opening larger questions, visible self-correction and conclusions that can remain provisional.

The recurring `sí, pero` correction is also canonical: contradiction belongs to Aromia, but no single wording owns that function.

## Visual-generation incident correction — canonical rule

Repeated wrong generations for `El coleccionista` produced dashboards/checkpoints/GitHub-like mockups rather than the requested domestic scene. The root cause is treated as **conversation-context contamination**, not merely prompt wording.

Canonical protocol:

`docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md`

Core rule:

> **Operational context decides what to make. Clean visual context makes the image. Quarantine decides whether the image is allowed back into Aromia.**

Prompt cleaning alone is insufficient when the image generator infers from the full conversation. If the active turn is dominated by repository state, OMNI gates, UI, implementation logs, Code, GitHub, checkpoints or QA, **do not invoke image generation there**.

Two consecutive mockup/UI drifts in the same conversation trigger a hard stop for image generation in that conversation. Further retries require a clean visual context.

Rejected wrong generations are process waste: do not commit, implement, cite as evidence or use to mutate editorial/QA/OMNI state.

## El coleccionista release lock

`El coleccionista` is LIVE. Final OMNI passed and production deployment succeeded.

Narrative test for Asset A remains:

> **“Yo conozco ese estante.”**

Do not reopen or redesign the story without new evidence or explicit Publisher direction.

## Editorial home softness resolution

The three raster cover artworks reported as unintentionally soft by the Publisher are no longer active. Their existing CSS fallbacks now occupy the same approved slots. This closes the raster-focus defect without altering the page rhythm.

The retired raster files remain in the repository for traceability but must not be re-enabled unless a deliberate review reverses this decision. Future replacement art must follow the visual-isolation protocol.

## Production baseline retained

Editorial v1 remains the production baseline. Existing platform follow-ups remain separate unless a rendered QA finding makes them publication-relevant.

## Continuation rules

On **Continúa Aromia desde el repo**:

1. verify remote state;
2. read this relay and referenced handoffs;
3. execute the role-ready work without routine Publisher coordination;
4. preserve approved work unless evidence requires correction;
5. obey `docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md` before ending the turn;
6. update this relay at phase end when operational state/next actor changes;
7. escalate only genuine strategic, legal/rights, credential, irreversible publication or material-spending decisions.

For any original-image generation, also read and obey:

`docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md`

Authority order:

`verifiable remote head + newest checkpoint/handoff → this relay → older handoffs → conversational memory`.
