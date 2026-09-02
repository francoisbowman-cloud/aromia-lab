# Aromia — Actor Turn Handoff Protocol

STATUS: CANONICAL OPERATING RULE
APPLIES_TO: Cowork, Code, ChatGPT, OMNI, Claude Design, Claude Code and any future Aromia actor
DATE_ADOPTED: 2026-09-02

## Purpose

Aromia is designed to continue asynchronously from the repository. The Publisher must not become the courier of context between actors.

Therefore every actor that performs meaningful work must finish its turn by leaving enough durable repository state for the next actor to continue with only:

> **Continúa Aromia desde el repo.**

The previous chat, terminal session, browser session or model conversation is never the authoritative handoff surface.

## Hard rule

Before ending a meaningful turn, the active actor must:

1. persist the relevant result, decision, checkpoint or handoff in the repository or in the actor's permitted staging surface;
2. update `AROMIA_CURRENT_STATE.md` when the operational state or next actor changes;
3. name the exact next actor and next action;
4. record blockers explicitly, including `NONE` when there are none;
5. record the branch/ref and important commit/checkpoint identifiers when applicable;
6. distinguish durable repository artifacts from temporary chat/session artifacts;
7. never assume the next actor can read the previous conversation.

A turn is not operationally complete until this handoff exists.

## Minimum handoff schema

Use the fields that apply:

```text
LAST_ACTOR:
LAST_ACTION:
ACTIVE_OBJECTIVE:
ACTIVE_BRANCH / BASE_REF:
STATE / GATES:
DELIVERABLES:
EVIDENCE:
TEMPORARY_OR_EXTERNAL_ARTIFACTS:
NEXT_ACTOR:
NEXT_ACTION:
BLOCKERS:
PUBLICATION_AUTHORITY / RISK NOTES:
```

For editorial pieces, preserve the standard publication states:

```text
EDITORIAL:
ART_DIRECTION:
VISUAL_COMPOSITION:
EARLY_OMNI:
VISUAL_ASSETS:
IMPLEMENTATION:
QA:
FINAL_OMNI:
PUBLISH:
TARGET_DATE:
```

## Actor-specific expectations

### Cowork

Cowork cannot write canonical GitHub state directly under the current security model. It must therefore leave a deterministic staging handoff for Code with base SHA, files, provenance, readiness state and known issues. Code owns canonical ingestion.

### Code

Code must commit/push eligible branch work, record implementation/QA evidence, update the relay, and leave the next actor enough information to continue without inspecting Code's terminal history.

If Code stops before push despite a downstream actor needing the branch, the handoff is incomplete unless a genuine blocker prevents push.

### ChatGPT

ChatGPT must persist art direction, composition decisions, asset handoffs, visual reviews and relay changes through the repository connector when available.

If a binary generated in chat cannot be transported through the repository connector, ChatGPT must record:

- file name;
- dimensions/format;
- checksum when practical;
- intended repository path;
- visual/authenticity approval state;
- exact ingestion instructions;
- the fact that the binary still exists only outside the repo.

The Publisher should not need to explain what happened to Code in prose.

### OMNI

OMNI must persist gate result, scope, evidence, required corrections and preserved areas. A gate that lacks the evidence required by the workflow must remain provisional/pending rather than being represented as final.

### Claude Design / exceptional R&D actors

They must classify outputs as Foundation, reusable primitive, story-specific or experiment, and leave a system-extraction handoff for Code. Prototype state must never be mistaken for production state.

## Temporary and binary artifacts

Repository text can describe an external artifact without falsely claiming it is already ingested.

When a required artifact exists outside the repository, record:

```text
EXTERNAL_ARTIFACT_STATUS: READY_FOR_INGEST | PENDING | REJECTED
FILE_NAME:
FORMAT:
DIMENSIONS:
SIZE:
SHA256:
TARGET_PATH:
INGESTION_ACTION:
APPROVAL / QUARANTINE_STATE:
```

The next actor must not treat `READY_FOR_INGEST` as `INGESTED` until the repository contains the actual binary/file and QA has confirmed it.

## Handoff quality test

Before stopping, ask:

> **If the next actor opens only the repository and receives “Continúa Aromia desde el repo”, can it determine what happened, what is authoritative, what remains temporary, and exactly what to do next?**

If the answer is no, the handoff is incomplete.

## Publisher anti-courier rule

Routine production must not require the Publisher to copy summaries from ChatGPT to Code, from Code to OMNI, or from Cowork to ChatGPT.

The Publisher may still transport a binary manually when product/tool limits make that unavoidable, but the repository must already contain the complete semantic handoff so the Publisher is transporting a file, not reconstructing project state.

## Relationship to other protocols

This protocol complements:

- `AROMIA_EDITORIAL_WORKFLOW.md`
- `docs/operations/AROMIA_MANUAL_OPERATIVO_CODE_COWORK_CHATGPT.md`
- `docs/operations/AROMIA_VISUAL_GENERATION_ISOLATION_PROTOCOL.md`

When the current relay points to a more specific handoff/checkpoint, the more specific artifact supplies the detailed task while this protocol governs turn closure.

## Short version

> **Do the work. Persist the truth. Name the next actor. Leave no conversational archaeology for the next shift.**
