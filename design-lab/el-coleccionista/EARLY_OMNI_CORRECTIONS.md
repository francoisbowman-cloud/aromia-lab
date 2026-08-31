# El Coleccionista — Early OMNI Corrections

## Source validation

The two user-provided ZIP archives were compared byte-for-byte for the six core Design deliverables. The six core files are identical in both archives. The second archive only adds `.thumbnail` and `github.md`; it does not contain a newer revision of the six deliverables.

The contrast correction described by Claude Design is already present in both copies: `--muted` / tertiary uses `#6B6155`, the striped-specimen caption uses `#4E463A`, and the handoff includes §2.1b prohibiting reintroduction of a third light gray. The historical mention of `#9A9083` in §2.1b is retained only as evidence of the rejected value.

## Corrections required before Early OMNI PASS

### C-01 — Verification overlay must expose all five unresolved facts

The Ledger defines five publication facts requiring verification:

1. Aventus launch year (`2010`).
2. 30–40% flanker share.
3. Nearly 4 in 10 U.S. households collecting something.
4. Dsm-Firmenich perfumer paraphrase/attribution.
5. Current Le Male line names cited in the prototype.

The supplied prototype exposes only the Aventus item as a literal `VERIFICAR` overlay under `showClassification`.

**Required correction:** add an inspection-only `VERIFICAR antes de publicar` marker adjacent to each of the other four claims, using the same visual treatment and the existing `tags`/classification toggle. These markers must not resolve or rewrite the facts; they only make unresolved editorial risk visible.

Acceptance: activating `showClassification` exposes exactly five unresolved verification markers corresponding to the Ledger.

### C-02 — Asset-state count must distinguish story slots from identity asset

The supplied handoff states:

`VISUAL_ASSETS: PENDING (2 ranuras · 3 NOT_REQUIRED)`

but the Ledger actually contains:
- 2 editorial visual slots `PENDIENTE`: opening documentary image + conservation triptych;
- 1 identity asset `PENDIENTE`: approved `A.` signature;
- 2 explicit `NOT_REQUIRED` decisions: flanker field + Act IV image absence.

**Canonical interpretation:** the signature is not a story visual slot. It is a stable identity asset tracked separately.

Canonical state:

`VISUAL_ASSETS: PENDING (2 ranuras editoriales + 1 asset de identidad · 2 NOT_REQUIRED)`

Do not invent a third `NOT_REQUIRED` slot merely to preserve the earlier count.

## Status after documentation correction

`DESIGN_PROTOTYPE: READY_FOR_EARLY_OMNI`

`EARLY_OMNI: REFINE` until C-01 is applied to the actual prototype and the corrected asset accounting remains consistent across prototype, Ledger and handoff.

No production implementation or publication is authorized by this correction note.
