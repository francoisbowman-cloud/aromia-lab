# Aromia — Current Operational State

This file is the single compact relay for the command:

> **Continúa Aromia desde el repo.**

It is an index of the latest verified operational state, not a substitute for Git history, branch checkpoints, handoffs, QA evidence or canonical workflow documents.

## Mandatory actor order

Default production order:

`Cowork → Code → ChatGPT → Code → OMNI → Code → Production`

Meaning:

- **Cowork** — research, fact-check, write and prepare editorial staging.
- **Code (integration)** — ingest staging into the remote repo and establish the implementation surface.
- **ChatGPT** — art direction, visual composition and visual asset decisions/creation.
- **Code (implementation)** — wire assets and canonical copy, render and run technical/browser QA.
- **OMNI** — final rendered-experience gate.
- **Code (correction/production)** — correct failures, reach publishable state, and merge/deploy when publication is authorized.

The human Publisher does not carry routine handoffs between actors. The repo carries them.

## Current relay

```text
STATE_VERSION: 15
UPDATED_AT: 2026-09-01
LAST_ACTOR: Code (correction/production)
LAST_ACTION: landed the Editorial v1 public cutover — PR #121 merged to main as d7db02c, Railway web production deploy fcb010e1 reached SUCCESS, and the deployed origin was verified: "/" now serves the editorial living cover, the three stories live at /historias/[slug], /editorial-v1[/*] 301-redirect into the new paths.
ACTIVE_OBJECTIVE: Editorial v1 public cutover correction — DONE. "/" is the editorial experience.
ACTIVE_BRANCH: main
CUTOVER_PR: #121 — MERGED as d7db02cf59861f1acdb55087a5fabfc4e694b3c4
LAST_RELEASE_COMMIT: d7db02cf59861f1acdb55087a5fabfc4e694b3c4
PRODUCTION: LIVE — "/" = editorial living cover; verified on https://www.aromialab.com
RELEASE_PR: #120 — MERGED (shipped only the isolated /editorial-v1 surface; #121 completed the cutover)
CI (PR #121): PASS — web (test+lint+typecheck+build), api (lint+typecheck), code-and-governance
RAILWAY_DEPLOYMENT: fcb010e1-8a00-4c68-82ae-17813a32f94e — SUCCESS — service web — commit d7db02c
PROD_URL_VERIFICATION (2026-09-01, www.aromialab.com):
  - / → 200, <title> "Aromia — Una fragancia, una historia", robots index,follow, .ev1-nav present, no AromiaHome
  - /editorial-v1 → 308 → /
  - /editorial-v1/el-ambar-que-nunca-toco-una-ballena → 308 → /historias/el-ambar-que-nunca-toco-una-ballena
  - /historias/{el-perfume-que-encargo-un-sultan,el-ambar-que-nunca-toco-una-ballena,el-perfumista-que-no-teme-exagerar} → 200; per-story <title>; robots index,follow; canonical https://aromialab.com/historias/<slug>
  - /editorial-v1/amouage-mineral-density-01.jpg → 200 (asset, not redirected)
  - /magazine, /descubrir, /buscar → 200 (legacy global chrome intact)
  - sitemap.xml lists the 3 /historias/<slug> URLs; robots.txt allows all
GATE_4 / FINAL_PHOTO_GATE_5 / CANONICAL_RELEASE_GATE: PASS on the Editorial v1 implementation (unchanged from the #120 release evidence)
OMNI_GATE_5 (cutover): NOT RERUN — composition/copy/imagery/interpretive-vs-documentary classification byte-identical to the 0.9661 approved release; only route location, canonical nav targets and indexation changed.
NEXT_ACTOR: Maintenance / next editorial objective
NEXT_ACTION: routine monitoring; pick the next editorial batch from drafts/ + AROMIA_EDITORIAL_CALENDAR.md. The KNOWN_FOLLOWUPS below are non-blocking cleanup, not a reopening of Editorial v1 art direction.
BLOCKERS: none.
KNOWN_FOLLOWUPS:
  - public/editorial-v1/ could not be renamed to public/historias/ this session (OS file lock); asset URLs stay /editorial-v1/*.jpg and the /editorial-v1/:slug redirect is scoped to dot-free slugs ([^.]+) to protect them. Cosmetic rename is a later chore.
  - Mobile editorial nav (.ev1-nav) hides its links with no menu; on mobile "/" the header exposes only AROMIA + search. Recommend a mobile menu (ChatGPT/Design).
  - Site is intentionally bimodal under this "home swap only" scope: "/" + /historias/* use editorial chrome; /magazine, /club, /academia, /descubrir keep the legacy global NavBar/Footer. Full nav unification is a separate objective.
  - Architecture-doc territories Perfumes / Materia / Personas are not built; editorial nav currently exposes Portada · Magazine · Saber · Discovery · Club.
PRIMARY_HANDOFF: art-direction/EDITORIAL_V1_IMPLEMENTATION_CHECKPOINT.md (see the 2026-09-01 cutover entry)
UPSTREAM_RELAY: art-direction/EDITORIAL_V1_GATE3_CHATGPT_DECISIONS.md
CHECKPOINT: art-direction/EDITORIAL_V1_IMPLEMENTATION_CHECKPOINT.md
```

## Explicit defect diagnosis

The previous release was technically deployed, but it did not complete the intended product cutover. The new editorial implementation exists and its dedicated routes render, while the canonical public root `/` still serves the legacy Aromia Home. Therefore `PRODUCTION: LIVE` does not mean the editorial transformation is complete.

This is a release-correction task, not a new creative-direction phase.

Code must treat the following as the deterministic correction sequence:

`read repo state → inspect current public root/navigation architecture → make Editorial v1 the canonical "/" experience → remove/redirect legacy catalog-first entry behavior where appropriate → validate public navigation/routes → desktop/mobile browser QA → OMNI rendered gate on public experience → fix blockers automatically → update relay → production verification`

The approved visual direction, article copy, photographic assets, documentary provenance, and Gate 3 decisions remain locked unless a concrete regression proves that a bounded correction is required.

## Cutover implementation status (2026-09-01, Code)

Done on `feat/editorial-v1-home-cutover` (PR #121), scope **home swap only** per the Publisher:

- `(editorial)` route group → living cover at `/`, stories at `/historias/[slug]` (SSG x3).
- `noindex` lifted; per-route `metadata` (title / description / canonical, OG).
- `next.config.mjs` 301s: `/editorial-v1 → /`, `/editorial-v1/:slug([^.]+) → /historias/:slug`.
- Global `NavBar`/`Footer` hidden only on the editorial routes; legacy chrome intact on `/magazine`, `/club`, `/academia`, `/descubrir`.
- `src/app/page.tsx` deleted (`AromiaHome2026` kept in `src/components/home/`); `sitemap.ts` gains the 3 story URLs.

Local gates + desktop/mobile browser QA green. Publisher approved merge + Railway deploy on 2026-09-01. Full detail in the checkpoint's 2026-09-01 cutover entry.

## Deterministic transition

`PR #120 released the isolated surface → PR #121 completed the cutover → CI green → merged to main (d7db02c) → Railway web deploy fcb010e1 SUCCESS → public URLs verified on www.aromialab.com → PRODUCTION: LIVE with "/" = the editorial home.`

Routine continuation now begins from `main` and discovers the next editorial objective from the repo. Do not reopen Editorial v1 art direction unless a new objective requires it.

## Actor-substitution rule

The normal actor responsibilities remain unchanged. An actor may exceptionally execute a bounded task normally owned by the next actor only when all of the following are true:

1. the necessary connected tools and permissions are available;
2. the human has already authorized the operation or the repo workflow deterministically authorizes it;
3. the action does not bypass a required strategic, legal, rights, credential, or publication decision;
4. the substitution is explicitly recorded in the relay;
5. the actor does not permanently redefine the workflow roles.

This rule exists to preserve autonomy without blurring ownership. It does not create a new actor such as `Maintenance`.

## Rules for every actor

When receiving **Continúa Aromia desde el repo**:

1. Read this file first.
2. Verify `ACTIVE_BRANCH` and the latest relevant remote head against GitHub before trusting the relay.
3. Inspect the referenced handoff/checkpoint and any newer relevant commits.
4. If the state is stale, repair this file from the newest verifiable repository evidence before continuing.
5. Execute only the work belonging to your role, except for a bounded substitution allowed by the actor-substitution rule above.
6. At the end of your phase, update this file so `LAST_ACTOR`, `LAST_ACTION`, `NEXT_ACTOR`, `NEXT_ACTION`, branch/SHA, blockers and handoff paths describe the new reality.
7. Do not ask the human to copy a relay message to the next actor. Put the relay here and in the appropriate detailed handoff/checkpoint.
8. Do not ask the human to choose between routine next steps when the gate sequence, checkpoint, role order or repo state already determines the answer.
9. Ask the human only for genuinely strategic, irreversible, legal/rights, credential, production/publication, or materially new/unbounded spending decisions not already governed by the repo.
10. A short human-facing completion summary is enough; the repo carries operational detail.

## Authority hierarchy

If sources disagree, resolve in this order:

`verifiable Git branch/head + newest checkpoint/relay → this file → older handoffs → conversational memory`

`main` is the production baseline unless a newer active working branch is explicitly recorded here.

## Human interface

The normal instruction remains exactly:

> **Continúa Aromia desde el repo.**

No article selection, branch name, actor-specific prompt, gate-routing choice or hand-carried handoff should be required for routine continuation.
