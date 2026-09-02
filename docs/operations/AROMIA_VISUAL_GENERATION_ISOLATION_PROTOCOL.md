# Aromia — Visual Generation Isolation Protocol

STATUS: CANONICAL OPERATING SAFETY RULE
APPLIES_TO: ChatGPT original-image generation for Aromia
DATE_ADOPTED: 2026-09-02

## Why this protocol exists

Aromia had repeated generation failures in which a request for an editorial image produced a workflow/dashboard/mockup instead. The failure was not primarily an art-direction problem. It was **context contamination**: the image generator inferred from an operationally dense conversation containing terms such as GitHub, Code, OMNI, checkpoint, implementation, relay, branch and QA, and visualized the workflow rather than the intended photographic scene.

The important technical lesson is:

> **Prompt cleaning alone is not a reliable fix when the image generator infers from the surrounding conversation. Isolation must happen at the conversation/task context level.**

## Hard rule

**Do not call image generation for a publication asset from a turn whose active context is dominated by repository operations, UI screenshots, checkpoints, implementation logs, OMNI gates, branch state or developer tooling.**

If the current turn is operationally contaminated, ChatGPT must first create a **visual-only generation capsule** and move generation to a clean visual context/turn before invoking image generation.

The operational conversation may prepare the capsule, but it must not be the generation context.

## Visual-only generation capsule

Before generation, reduce the approved art direction to only these fields:

```text
SUBJECT / SCENE:
ENVIRONMENT:
COMPOSITION:
CAMERA / POINT OF VIEW:
LIGHT:
MATERIAL / TEXTURE:
HUMAN IMPERFECTIONS / LIVED-IN DETAILS:
PALETTE:
AUTHENTICITY CONSTRAINTS:
MUST NOT APPEAR:
CROP / RESPONSIVE INTENT:
NARRATIVE TEST:
```

The capsule must describe only what can exist **inside the image**.

## Forbidden operational vocabulary in the generation context

Unless the image itself genuinely depicts software or a document, do not include or foreground words/concepts such as:

- Aromia
- OMNI
- Code / Claude Code
- GitHub
- repo / repository
- branch / commit / PR / merge
- checkpoint / relay / state / gate
- implementation / QA / deploy / Railway
- asset ID / slot ID
- dashboard / UI / interface / screen
- workflow / system / pipeline
- mockup / review sheet / infographic

These terms may remain in the project handoff **outside** the clean generation context.

## Mandatory negative lock for photographic/editorial assets

For any requested photographic or editorial scene, the visual capsule must explicitly reject:

- text overlays;
- typography as a compositional subject;
- dashboards;
- software interfaces;
- browser windows;
- documents or report pages;
- diagrams;
- infographics;
- moodboards;
- workflow visualizations;
- status cards;
- mockups of the article or website;
- invented brand marks unless specifically required and authentic.

## Pre-generation contamination test

Before invoking image generation, ChatGPT asks internally:

> **If a visual model read only the immediately active context, could it reasonably think I am asking it to visualize the project/workflow instead of the physical scene?**

If YES or MAYBE: **do not generate in that context.** Isolate first.

## Post-generation quarantine gate

A generated result is not automatically an Aromia asset.

Before handoff to Code, ChatGPT must inspect the result and reject it if any of the following is true:

1. It depicts UI, GitHub, dashboards, reports, workflow stages, article mockups or design boards when those were not the requested subject.
2. It contains meaningful text or typography not required by the scene.
3. It looks like a presentation of the idea instead of the idea made physical/photographic.
4. It violates authenticity constraints (recognizable invented bottles, fake logos, fabricated documentary evidence).
5. It fails the story-specific narrative test recorded in the art direction.

Rejected generations are **process waste**:
- do not commit them;
- do not reference them as evidence;
- do not let them change editorial/OMNI state;
- do not ask Code to ingest them.

## Two-strike rule

If two consecutive generations in the same conversation drift into mockups/UI/workflow imagery:

> **STOP generating in that conversation.**

Do not keep retrying with slightly different wording. The conversation is considered contaminated for image generation. Create a clean visual context from the capsule before any further generation attempt.

This rule exists because repeated retries can reinforce the wrong semantic attractor.

## Gate separation

OMNI and generation must remain separate responsibilities:

- Early/Final OMNI outputs **textual evaluation and correction criteria**.
- Image generation outputs **publication imagery only**.
- Never ask image generation to visualize a gate, checkpoint, QA report, relay or implementation status.
- A generated review sheet is never OMNI evidence.

## Handoff back to Code

Only after the post-generation quarantine gate passes does the asset return to the operational workflow with:

```text
VISUAL_ASSET: READY
SOURCE_MODE: generated interpretive | licensed documentary | authentic product identity
FILE_NAME:
TARGET_PATH:
CROP_INTENT:
ALT_INTENT:
AUTHENTICITY_NOTES:
NARRATIVE_TEST: PASS
```

Code then ingests, renders and performs browser QA.

## El coleccionista incident record

The repeated wrong generations for `El coleccionista` are the canonical example of why this protocol exists. Dashboard/checkpoint/GitHub-style generations from those turns are rejected process artifacts and must never enter the publication.

The correct Asset A task is a physical domestic scene. Its generation context must contain only the physical scene specification and its photographic constraints.

## Short version

> **Operational context decides what to make. Clean visual context makes the image. Quarantine decides whether the image is allowed back into Aromia.**
