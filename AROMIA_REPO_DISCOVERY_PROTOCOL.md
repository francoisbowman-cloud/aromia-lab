# Aromia — Repo Discovery Protocol

Purpose: prevent any actor from treating `main` as the only place where active Aromia work can exist.

This protocol applies whenever the human says:

> **Continúa Aromia desde el repo.**

## Mandatory discovery order

Before deciding that there is no eligible work, the actor must inspect the repository in this order:

1. **Current `main`** — read the canonical workflow and relevant operating documents.
2. **Active remote branches** — search for recent objective branches, especially `feat/*`, `editorial/*`, `art-direction/*`, `design/*`, `fix/*` and any branch named in current checkpoints/handoffs.
3. **Recent commits** — inspect recent repository commits for relay/checkpoint/handoff messages such as `relay`, `checkpoint`, `handoff`, `ready`, `Gate`, `Code → ChatGPT`, `ChatGPT → Code`, or equivalent actor transitions.
4. **Explicit relay/checkpoint files** — if an active branch contains a newer relay or checkpoint than `main`, that branch is the operational source of truth for that in-flight objective while `main` remains the production/canonical baseline.
5. **Open PRs when relevant** — inspect an open PR if it is the integration surface for the active objective.
6. Only after steps 1–5 may the actor conclude that no work is ready for its role.

## Authority model

`main` remains the canonical production baseline. That does **not** mean all in-flight work must already be present on `main`.

A Code-controlled remote branch may be the authoritative working surface for an objective that is intentionally under `PRODUCTION: HOLD`, awaiting art direction, QA, OMNI, or approval.

Therefore:

- never infer `NO WORK` from `main` alone;
- never overwrite a newer branch relay with an older `main` state;
- compare branch head/checkpoint timestamps or SHAs before acting;
- preserve `PRODUCTION: HOLD`, merge, deploy and publication restrictions stated in the active relay;
- when multiple candidate branches exist, prefer the one with the newest explicit role-directed relay/checkpoint for the actor receiving the command;
- if branch state and a relay disagree, inspect the branch head and use the newest verifiable repository state.

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

`inspect main → see no pending art direction on main → conclude no ChatGPT work`

Correct behavior:

`inspect main → discover active branches → inspect recent relay/checkpoint → resolve newest role-specific working state → continue`

This protocol supplements `AROMIA_EDITORIAL_WORKFLOW.md`. If a future workflow revision incorporates these rules directly, this document may be folded into it rather than duplicated.
