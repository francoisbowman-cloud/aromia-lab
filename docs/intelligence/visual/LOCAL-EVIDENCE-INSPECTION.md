# Aromia — Local visual evidence inspection (next tranche)

## Implemented

The private **Revisión visual** screen now has a separate operator-entered image path field. This is a real inspection of the **current bytes** of an existing raster file under `apps/web/public`. It does not look for images by product name, download a remote packshot, make visual judgments or write approvals.

- `apps/web/src/lib/visualEvidence.ts`: strict local-public path validation; canonical realpath confinement to defeat traversal and symlinks; 25 MiB file cap; accepted raster formats PNG, JPEG, WEBP, AVIF and GIF; Sharp metadata validation and SHA-256 of the read image bytes.
- `GET /api/admin/intelligence/visual-evidence?asset=%2Feditorial-v1%2Fexample.webp`: signed admin session + server-held admin token via `adminAuthorizationError`; separate opt-in flag `VISUAL_EVIDENCE_INSPECTION_ENABLED=true`. Returns bytes digest, dimensions, size and format with `Cache-Control: private, no-store`. No POST/PUT/DELETE and no remote URL support.
- `/admin/revision-visual`: operator can specify an **exact site-local path**, view the image and digest, and compare that digest against the recorded journal claims for the currently searched perfume. Matching a digest means the file bytes match a *claimed* digest, **not** that the fragrance or rights were genuinely approved.
- Unit tests cover valid image inspection, changed contents, malicious paths, symlink breakout, bad file content, disabled feature, unauthorized sessions and absence of mutation handlers.

## Environment and authorization

Run the Next.js server with its normal code/public directory available, and set `VISUAL_EVIDENCE_INSPECTION_ENABLED=true` only in an approved development environment. When running from `apps/web`, the route resolves the repository root from the working directory; when running from the repository root, the same path is used. A standalone production image may not include public assets in the same location: **verify file presence in the actual deployed layout before enabling**.

This tool intentionally shows existing public images via the same-origin public URL; it does not protect the underlying public image from access by site visitors. The metadata endpoint itself remains behind authenticated admin session and no-store. No newly uploaded sensitive/private images should be placed in the public folder.

## Review and publication gates

The older visual journal remains an append-only store of **unverified** observations. Its backend POST still needs the separate `EDITORIAL_REVIEW_TOKEN`; no shortcut to writing from the browser was introduced. The inspector does not persist an immutable copy of the inspected bytes, monitor remote URL changes, verify manufacturer/flanker/concentration, prove rights, or authenticate the human author of a note. All returned `publication` fields are `blocked`.

Bergamot replacement stays rejected/pending; no new source channel is enrolled. The Publisher alone selects YouTube channels before any future ingestion.

## Follow-on work

A later approved tranche may add a private immutable captured-media object store and structured reviewer role identity with audit log, revocation and version-locked approvals. That must respect image licensing, media delivery rules, platform terms and cost gates before handling commercial packshots.
