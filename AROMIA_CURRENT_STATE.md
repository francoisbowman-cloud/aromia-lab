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
STATE_VERSION: 14
UPDATED_AT: 2026-09-01
LAST_ACTOR: Code (correction/production)
LAST_ACTION: implemented the Editorial v1 public cutover on feat/editorial-v1-home-cutover — the approved editorial living cover now serves "/" and the three stories moved to /historias/[slug]; PR #120 had only added the isolated noindex /editorial-v1 surface and left "/" on the pre-editorial AromiaHome2026. Publisher approved push + PR + merge + deploy.
ACTIVE_OBJECTIVE: Editorial v1 public cutover correction — make the approved editorial experience the canonical public Aromia entry at "/"
ACTIVE_BRANCH: feat/editorial-v1-home-cutover
CUTOVER_PR: #121 — OPEN against main (rebased onto efcc6df)
LAST_RELEASE_COMMIT: 87861db8271eb2d77b3dfad8333751a8df201dea
PRODUCTION: LIVE_BUT_INCOMPLETE — "/" still serves the legacy Home until PR #121 deploys
RELEASE_PR: #120 — MERGED
GATE_4: PASS on Editorial v1 implementation — run 33528075236 / job 99923918960
FINAL_PHOTO_GATE_5: PASS on Editorial v1 implementation — run 33529763705 / job 99929653299 — score 0.9661016949 / threshold 0.82 — blockers 0
CANONICAL_RELEASE_GATE: PASS on the release candidate — run 33530273538 / job 99931373862
LOCAL_GATES (cutover): PASS — apps/web: npx tsc --noEmit clean · next lint clean · vitest 31/31 · next build (○ / static, ● /historias/[slug] SSG x3, no /editorial-v1 route)
BROWSER_QA (cutover): PASS — desktop 1440 + mobile 375: "/" renders the living cover with single chrome (global NavBar/Footer hidden via the (editorial) layout), /historias/[slug] x3 render, interpretive + documentary images 200 through /_next/image, /editorial-v1 -> 308 -> /, /editorial-v1/:slug -> 308 -> /historias/:slug, /editorial-v1/*.jpg still 200, /magazine keeps the global chrome
OMNI_GATE_5 (cutover): NOT RERUN — composition/copy/imagery/interpretive-vs-documentary classification byte-identical to the 0.9661 approved release; only route location, canonical nav targets and indexation changed. Optional re-run is the Publisher's call.
NEXT_ACTOR: Code (correction/production)
NEXT_ACTION: land PR #121 — confirm CI green on the branch, merge to main, verify the Railway web production deployment reaches SUCCESS, then verify the public URLs (/, /historias/<3 slugs>, /editorial-v1 + /editorial-v1/<slug> redirects, /magazine, /descubrir, /buscar) on the deployed origin and record the deployment id + commit here.
BLOCKERS: none. Merge + deploy authorized by Publisher on 2026-09-01.
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

`PR #120 released the isolated surface → PR #121 completes the cutover → CI green → merge to main → Railway deploy SUCCESS → verify public URLs on the deployed origin → PRODUCTION: LIVE with "/" = the editorial home`

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
