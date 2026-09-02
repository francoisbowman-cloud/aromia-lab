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
STATE_VERSION: 32
UPDATED_AT: 2026-09-02
LAST_ACTOR: ChatGPT (temporary Code-role takeover authorized by Publisher)
LAST_ACTION: investigated why the Publisher still perceived the three Editorial v1 home fields as blurred after the earlier raster-disable fix. Verified that main already had the three raster slots set present:false, but the active CSS fallback itself still used soft radial fields and, in the lead resin field, filter: blur(18px). This meant the functional replacement reached main but did not visually solve the reported softness. Added apps/web/src/app/(editorial)/editorial-sharp.css with crisp, resolution-independent material fields for the same three boxes, removed optical blur from the active appearance through overrides, added hard material seams/microcontrast, and imported the override from the editorial layout. Geometry, copy, spacing, responsive rhythm, documentary assets and El coleccionista remain unchanged.
ACTIVE_OBJECTIVE: verify the latest main production deployment for the crisp Editorial v1 material overrides, then resume normal editorial production
ACTIVE_BRANCH: main
VOICE_BIBLE: AROMIA_VOICE_BIBLE.md — v0.3
VOICE_SOURCE_ANALYSIS: research/aromia-voice-chat-analysis-2026-09-02.md
VOICE_EVOLUTION_COMMIT: 7d7095c288e2e88aae516b43b3b3178ec71c7dca
HOME_CRISP_STYLE_COMMIT: 53326209a00852e3a4e372f990b3ed209ebd136b
HOME_CRISP_IMPORT_COMMIT: 4a0ef4ad0ecfef2a0d4d51c54ea3e573c3269961
HOME_CRISP_STYLESHEET: apps/web/src/app/(editorial)/editorial-sharp.css
HOME_CRISP_DEPLOYMENT: Railway web deployment 4b08221a-8390-4044-8f47-4c341d0f7c90 — BUILDING at turn close; build has compiled successfully and static generation completed, final deployment status still requires verification
AFFECTED_HOME_FIELDS:
- lead resin field → active CSS override removes blur and uses hard seams / fine linear texture
- mineral field → active CSS override uses crystalline planes / line microtexture rather than soft radial bloom
- ropion field → active CSS override uses explicit cut-paper/petal geometry / line texture rather than photographic softness
OLD_RASTERS: remain disabled; do not re-enable or sharpen/upscale them
HOME_VISUAL_QA: TECHNICAL_CAUSE_CORRECTED_IN_MAIN — production visual confirmation pending latest Railway deployment success
EL_COLECCIONISTA: LIVE — CLOSED — DO NOT REOPEN CASUALLY
EL_COLECCIONISTA_FINAL_OMNI: PASS
EL_COLECCIONISTA_PUBLISH: LIVE
EDITORIAL_VOICE_RULE: study how the Publisher thinks, not the surface artifacts of voice transcription. Complete the thought when direction is supported; never fabricate the life behind it.
CONTRADICTION_RULE: `sí, pero` is not a branded catchphrase. Vary or remove contradiction mechanisms so the reader feels thought changing direction rather than a repeated editorial device.
ORDINARY_SCENE_RULE: preserve domestic and social specificity. Do not automatically elevate everyday perfume life into luxury advertising language or perfume jargon.
ACTOR_HANDOFF_PROTOCOL: docs/operations/AROMIA_ACTOR_TURN_HANDOFF_PROTOCOL.md
VISUAL_GENERATION_PROTOCOL: docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md
NEXT_ACTOR: Code/ChatGPT verification, then Cowork / next editorial story
NEXT_ACTION: verify Railway deployment 4b08221a-8390-4044-8f47-4c341d0f7c90 reaches SUCCESS and inspect the live home. If the Publisher still perceives softness after this exact commit is live, treat that as new visual evidence and refine the three CSS fields only; do not alter page rhythm. Once verified, continue the editorial calendar using Voice Bible v0.3.
BLOCKERS: no code blocker. Only latest production deployment completion/visual confirmation remains.
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

## Editorial home softness correction

The first softness fix correctly disabled the three weak 1600×900 raster sources, but the Publisher's subsequent live observation revealed that the CSS fallbacks themselves still read as blurred imagery. Investigation confirmed the lead fallback contained `filter: blur(18px)` and the supporting fields relied on broad soft radial gradients.

`apps/web/src/app/(editorial)/editorial-sharp.css` now overrides only those three approved boxes with crisp, resolution-independent material studies. It does not change their dimensions or their place in the editorial composition.

The retired raster files remain traceability artifacts and must not be re-enabled without a new deliberate visual review.

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
