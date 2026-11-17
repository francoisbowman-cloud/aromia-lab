# Aromia — Private visual review journal (implementation checkpoint)

## Scope
An **append-only, opt-in evidence journal** for visual product-review observations, built on the existing Express/adminAuth/PostgreSQL infrastructure. This is intentionally narrower than a production image-approval service.

- Migration: `apps/api/migrations/027_visual_review_journal.sql`. **Not included in automatic production startup**. Apply only to a separately prepared test/development database after explicit authorization for that environment.
- Empty-only rollback: `apps/api/migrations/down/027_visual_review_journal.sql` rejects deletion when any observations exist.
- Store: `apps/api/src/intelligence/visualReviewJournal.ts`. Validates stable product slug, SHA-256 product fingerprint and claimed image digest, a review ID and notes for identity/rights/visual observations. Serializes evidence with parameterized SQL; conflicting review IDs fail rather than overwrite existing evidence.
- Routes in existing `intelligenceRouter` (already behind `adminAuth` and `INTELLIGENCE_ENABLED=true`):
  - `GET /api/admin/intelligence/visual-reviews?slug=...`: admin-authenticated listing scoped to a validated product slug.
  - `POST /api/admin/intelligence/visual-reviews`: requires adminAuth **and** separate `x-editorial-review-token` matching the existing `EDITORIAL_REVIEW_TOKEN`.
  - Both endpoints additionally require `VISUAL_REVIEW_JOURNAL_ENABLED=true`, otherwise return 503.
- CI: API build and local PostgreSQL integration checks via `npm --prefix apps/api run test:intelligence`. Tests use only a localhost `*_test` database and an isolated temporary schema.

## Trust and permissions
Every recorded row is explicitly `recorded_pending_independent_verification`. Submitted image SHA-256 is supplied by the operator and **not recomputed from bytes in the API**; a valid-looking digest is not proof of image identity, origin, rights or current bytes. No 'approved' status exists in the table. Responses include `publication:'blocked'`, `rightsVerified:false`, `identityVerified:false`. No routes mutate catalog entries, image files, CMS content or releases.

The previous private local operator (`scripts/private-image-review-operator.mjs`) is the independent image-bytes checking prototype; the journal does **not** automatically consume its results or turn signed records into publisher authorization. Use the existing editorial reviewer credential boundary. Never commit `EDITORIAL_REVIEW_TOKEN`, `IMAGE_REVIEW_HMAC_KEY`, actual private reviewer notes or production records.

## Remaining gates
1. Verify CI on the actual commit and inspect PostgreSQL test evidence.
2. Independently validate current asset bytes and reviewer identity/authorization in a future server-side integration before any genuine **approved** state is introduced.
3. Provide a private review UI only after auth, provenance, revocation and content-safety review; do not display untrusted notes as HTML.
4. Preserve user-selected-only YouTube channels: registry remains empty until the Publisher explicitly selects sources.
5. No merge, production migration, publication, deployment, paid media calls or OMNI modification authorized.
