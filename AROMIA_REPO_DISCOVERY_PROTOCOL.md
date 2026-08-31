# Aromia — Repo Discovery Protocol

Purpose: prevent any actor from treating `main` as the only place where active Aromia work can exist, while giving every actor one compact relay to read first.

This protocol applies whenever the human says:

> **Continúa Aromia desde el repo.**

## Mandatory first read

Read `AROMIA_CURRENT_STATE.md` first.

It is the operational index for the latest relay, but it is never trusted blindly. The actor must verify its branch/SHA/checkpoint claims against GitHub before acting.

## Mandatory discovery order

Before deciding that there is no eligible work, the actor must inspect the repository in this order:

1. **`AROMIA_CURRENT_STATE.md`** — resolve current objective, active branch, last actor, next actor, production state and referenced handoffs.
2. **Current `main`** — read the canonical workflow and relevant operating documents.
3. **Active remote branches** — verify the branch named by the state file and search for newer objective branches, especially `feat/*`, `editorial/*`, `art-direction/*`, `design/*`, `fix/*` and any branch named in current checkpoints/handoffs.
4. **Recent commits** — inspect recent repository commits for relay/checkpoint/handoff messages such as `relay`, `checkpoint`, `handoff`, `ready`, `Gate`, actor transitions, or equivalent role-directed work.
5. **Explicit relay/checkpoint files** — if an active branch contains a newer relay or checkpoint than `main` or `AROMIA_CURRENT_STATE.md`, that newer verifiable state wins for the in-flight objective.
6. **Open PRs when relevant** — inspect an open PR if it is the integration surface for the active objective.
7. Only after steps 1–6 may the actor conclude that no work is ready for its role.

## Authority model

`main` remains the canonical production baseline. That does **not** mean all in-flight work must already be present on `main`.

A Code-controlled remote branch may be the authoritative working surface for an objective intentionally under `PRODUCTION: HOLD`, awaiting art direction, QA, OMNI, approval or another actor.

Authority when sources disagree:

`verifiable Git branch/head + newest checkpoint/relay → AROMIA_CURRENT_STATE.md → older handoffs → conversational memory`

Therefore:

- never infer `NO WORK` from `main` alone;
- never trust `AROMIA_CURRENT_STATE.md` without verifying its active branch/SHA;
- never overwrite a newer branch relay with an older `main` state;
- compare branch head/checkpoint timestamps or SHAs before acting;
- preserve `PRODUCTION: HOLD`, merge, deploy and publication restrictions stated in the active relay;
- when multiple candidate branches exist, prefer the one with the newest explicit role-directed relay/checkpoint for the actor receiving the command;
- if branch state and a relay disagree, inspect the branch head and use the newest verifiable repository state.

## Mandatory actor order

Default editorial-production sequence:

`Cowork → Code → ChatGPT → Code → OMNI → Code → Production`

An actor may appear more than once because responsibilities differ by phase. The current relay tells which actor is next; the human should not need to remember or manually transport handoffs.

## Autonomous decision rule — do not end routine phases with questions

The human Publisher is not the router for routine workflow decisions.

If the answer can be derived from the repository, the current gate contract, the active checkpoint, or the role order, the actor must decide and proceed or leave the next actor queued in `AROMIA_CURRENT_STATE.md`. It must **not** end with questions such as:

- “Do I run the next gate now or wait for its declared prerequisites?”
- “Which actor should continue?”
- “Should I use the branch named by the current relay?”
- “Should I preserve `PRODUCTION: HOLD`?”
- “Should I hand this to ChatGPT/Code/OMNI?” when the gate sequence already answers it.

Default gate behavior is deterministic:

- do not run a final rendered-experience gate against known placeholders when the gate is explicitly intended to judge the completed composition;
- wait for declared prerequisites, route the work to the actor who owns those prerequisites, then run the gate automatically when they are satisfied;
- a standard gate already defined by the Aromia workflow is part of the approved workflow and should not require a fresh human routing decision merely because it consumes ordinary project tooling/API usage;
- ask the human only for genuinely strategic, irreversible, legal/rights, credential, publication/production, or materially new/unbounded spending decisions that are not already governed by the repo.

When blocked by another actor, the current actor must record `NEXT_ACTOR`, `NEXT_ACTION` and `BLOCKERS` in the repo and stop cleanly. It must not convert that handoff into a question for the human.

## Mandatory relay update

At the end of any meaningful phase, the finishing actor must update `AROMIA_CURRENT_STATE.md` with at least:

```text
LAST_ACTOR
LAST_ACTION
ACTIVE_OBJECTIVE
ACTIVE_BRANCH
VERIFIED_BRANCH_HEAD
PRODUCTION
NEXT_ACTOR
NEXT_ACTION
BLOCKERS
PRIMARY_HANDOFF
CHECKPOINT
```

The actor must also leave detailed evidence in the appropriate branch handoff/checkpoint when necessary.

The finishing actor must **not** ask the human to copy a technical relay to the next actor. The repo is the handoff surface. A short human-facing summary is sufficient.

## ChatGPT-specific rule

When ChatGPT receives `Continúa Aromia desde el repo`, it must specifically search for:

- `READY_FOR_ART_DIRECTION`;
- `ART_DIRECTION: PENDING`;
- `VISUAL_COMPOSITION: PENDING`;
- `VISUAL_ASSETS: PENDING`;
- `CODE_TO_CHATGPT`, `RELAY_CODE_TO_CHATGPT`, or equivalent handoffs;
- Gate 3 / asset-direction work;
- integrated editorial work on active Code-controlled branches.

ChatGPT must not stop after inspecting `drafts/` or publication state on `main` if a newer active branch contains an explicit relay addressed to ChatGPT.

## Failure mode this prevents

Incorrect behavior:

`inspect main → see no pending work on main → conclude no work`

Also incorrect:

`read current-state file → trust stale SHA without checking branch → act on obsolete relay`

Also incorrect:

`finish phase → identify a deterministic next step → ask the human whether to do that next step`

Correct behavior:

`read current state → verify branch/head → inspect newer relay/checkpoint/commits → resolve role → continue → update current state for next actor`

This protocol supplements `AROMIA_EDITORIAL_WORKFLOW.md` and keeps the human interface deliberately simple.
