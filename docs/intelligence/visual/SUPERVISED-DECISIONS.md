# Aromia — Supervised visual decisions (second tranche)

This tranche adds an **append-only decision log** to the existing private visual journal. It records editorial dispositions for an existing observation, **not** an image approval, automatic replacement or publication authorization.

## Opt-in schema and API

- `apps/api/migrations/028_visual_review_decisions.sql` creates `intelligence_visual_review_decisions`, with a foreign key to a previously recorded observation in `intelligence_visual_reviews` (migration 027).
- `apps/api/migrations/down/028_visual_review_decisions.sql` refuses to erase any existing decisions.
- The existing `/api/admin/intelligence` router (already protected by `adminAuth` and `INTELLIGENCE_ENABLED=true`) exposes:
  - `GET /visual-decisions/:observationId`: admin-authenticated, read-only, up to 100 records.
  - `POST /visual-decisions`: must additionally have `VISUAL_REVIEW_JOURNAL_ENABLED=true` and separate `x-editorial-review-token` matching `EDITORIAL_REVIEW_TOKEN`, distinct from `ADMIN_API_TOKEN`.
- A write requires a unique `decisionKey`, existing positive integer `observationId`, and a reason of 10–5000 characters. Allowed dispositions: `changes_requested`, `rejected`, `needs_further_evidence`.
- An `approved` disposition is **not in the type, input validator, or SQL CHECK**. All response objects state `approval:false`, `publication:'blocked'` and `applied:false`.

## Trust and non-actions

The parent visual observation is itself **unverified**. The database does not verify whether the depicted branded perfume, EDT/EDP concentration, catalog identity, source license or crop is correct; it only preserves the human-entered disposition. No endpoint replaces an image, mutates product records, approves rights, or publishes content. No web client write proxy or browser token handling is introduced. Only separately authorized Publisher credentials can append a decision.

Decisions remain immutable; duplicate `decisionKey` is rejected, and decisions for unknown observations fail. The tables are not applied to production; schema 027 must exist in a separately approved environment first. Tests use an isolated localhost `*_test` PostgreSQL schema, verify data durability/rollback protection, and exercise admin vs Publisher tokens.

## Next release gate

To create an actual image *approval* path later, verify reviewer identity/authority, obtain independent asset bytes and license evidence, bind a reviewed dossier to immutable image bytes **and product variant**, implement revocation and audit logs, and require explicit production deployment approval. Until those requirements exist, this flow permits only requesting changes, rejecting or requesting evidence.

Publisher-only YouTube channel selection remains unchanged. No channels were added, and this work does not authorize scraping or ingesting video content.
