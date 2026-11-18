# Aromia — read-only reversible image replacement proposal

## Intent

This block makes the next supervised step tangible without creating an image mutation or a false approval. In the private `/admin/revision-visual` screen, an operator first inspects an existing local file and selects a perfume. The operator may then provide a **second existing local image path** and a reason for the proposed change.

The new `GET /api/admin/intelligence/visual-replacement-plan` is authenticated with the existing signed admin session, requires `VISUAL_EVIDENCE_INSPECTION_ENABLED=true`, and computes current SHA-256 for **both real local image files**, using the previously reviewed confined asset reader. It validates the product slug, distinct image paths, dissimilar image bytes, dimensions and bounded justification.

The output is a deterministic, SHA-bound proposal with:

- exact current image path and digest (compare-and-swap *precondition*)
- candidate path and digest
- a planned inverse change to the original URL and digest
- independent identity/concentration, rights, visual QA and deployment authorization gates
- explicit `applied:false`, `approved:false`, `publication:'blocked'`

This is a **dry run**, not an executable replacement or an existing backup. The rollback record is **only a proposal**: it cannot restore anything unless the original bytes are independently preserved and separately authorized at execution time. Neither the route nor the UI creates, removes, copies, publishes or swaps files. Its API exposes GET only and forbids remote image downloading.

No automatic release, real asset license, product/flanker identity or website deployment is asserted. Before any real replacement, acquire evidence of exact manufacturer variation and legal usage rights, preserve the original asset in an immutable authorized store, enforce fresh SHA preconditions, obtain Publisher approval, validate desktop/mobile render, and create an actual rollback implementation with explicit authorization.

## Related work

- Parent PR #200: private read-only decision timeline.
- Parent PR #199: append-only non-approval editorial dispositions, separate Publisher credential.
- Parent PR #198: editor-provided unsaved provenance dossier.
- Publisher selects YouTube channels; this feature does not enroll sources.

The progress indicator must remain at its last verified milestone count. PR success alone does not mean a roadmap gate is complete.
