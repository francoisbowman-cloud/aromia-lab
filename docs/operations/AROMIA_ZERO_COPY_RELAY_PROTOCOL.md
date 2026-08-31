# AROMIA — ZERO-COPY ACTOR RELAY PROTOCOL

STATUS: CANONICAL_OPERATIONAL_RULE

## Objective

The Publisher must not act as a clipboard between Aromia actors.

Canonical command for every actor:

> **Continúa Aromia desde el repo.**

Normal completion response:

> **Bloque terminado. Siguiente: <ACTOR>.**

Only genuine human decision blockers use:

> **Bloqueado. Decisión del Publisher requerida.**

## Mandatory relay rule

Before an actor says `Bloque terminado`, it must leave everything the next actor needs in the appropriate project handoff surface. Summaries, SHAs, gate results, asset maps, decisions and next action belong in the repo/staging artifact, not in instructions the Publisher must copy between chats.

For Code-owned Git/GitHub work, the relay is not complete while commits exist only locally. Code must:

1. commit the handoff/state;
2. push it to the named remote working branch;
3. verify the remote branch contains it;
4. preserve `PRODUCTION: HOLD` when active;
5. only then answer `Bloque terminado. Siguiente: <ACTOR>.`

A push to a non-production working branch is normal asynchronous collaboration. It does **not** authorize PR creation, merge to `main`, Railway deployment or publication.

Cowork is the deliberate exception because it cannot own remote GitHub writes. Cowork leaves a deterministic repository-ready staging artifact and names Code as next actor for ingestion.

## Discoverable relay state

The active checkpoint/relay should expose:

```text
CURRENT_THREAD: <objective>
CURRENT_BRANCH: <remote branch or Cowork staging identifier>
CURRENT_STATE: <gate/publication state>
NEXT_ACTOR: CHATGPT | CODE | COWORK | OMNI | PUBLISHER
NEXT_ACTION: <concise action>
PRODUCTION: HOLD | ELIGIBLE | LIVE
```

The newest active checkpoint for the current objective wins over historical branches. Actors should resolve the most advanced active thread automatically and must not ask the Publisher to choose among old branches unless there are genuinely competing current objectives requiring a strategic decision.

## Human interaction target

Normal relay should be exactly:

```text
Actor A: Bloque terminado. Siguiente: ChatGPT.
Publisher → ChatGPT: Continúa Aromia desde el repo.
ChatGPT: [works from repository state]
ChatGPT: Bloque terminado. Siguiente: Code.
Publisher → Code: Continúa Aromia desde el repo.
```

No routine prompt transport.
No manual SHA transport.
No copied technical handoff.
No repeated explanation of prior work.

## Production safety

This protocol changes coordination, not authority.

- `main` remains production truth.
- Code owns technical Git/GitHub integration and deployment.
- Cowork does not push.
- ChatGPT does not take over Code deployment authority.
- OMNI critiques/gates; it does not publish.
- `PRODUCTION: HOLD` can only be lifted through the established publication gates and Publisher authority.

## Required behavior in future sessions

Any Aromia actor reading the repo should treat this file as an explicit instruction to minimize Publisher coordination overhead. If an older document asks the Publisher to manually shuttle routine handoff information, this zero-copy rule governs unless a stricter security rule prevents it.
