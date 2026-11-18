# Aromia Intelligence — Private visual review UI, first tranche

This tranche adds the route `/admin/revision-visual` to the existing authenticated admin navigation, with a **read-only** history lookup by perfume slug. The API proxy uses the existing signed admin session and server-held `ADMIN_API_TOKEN`. The frontend never receives that credential.

- GET-only Next.js proxy: `/api/admin/intelligence/visual-reviews?slug=...`, with a strict product-slug allowlist.
- Existing backend: `GET /api/admin/intelligence/visual-reviews` from opt-in PR #192. It requires `INTELLIGENCE_ENABLED=true` and `VISUAL_REVIEW_JOURNAL_ENABLED=true`, plus the normal server-held admin credential.
- Displays recent observations, identity/rights/visual claims, fingerprints, and the permanent warning that these are **pending independent verification**.
- Empty search results do not imply approval. Errors and feature-disabled state remain visible. Mobile layout uses stacked search, cards and breakable hashes.
- No POST/PUT/DELETE route, no editor credential from JavaScript, no image uploads or substitutions, no publication, and no false approval badge. Reviewing images visually is not implemented by this screen. The existing independent `EDITORIAL_REVIEW_TOKEN` requirement for writing journal records is preserved, rather than silently bypassed through the admin proxy.

Verification requires web unit tests, typecheck, lint, optimized build, and browser QA once runnable. Do **not** call this a production-approved review panel until deployment, credentials, migrations and real image verification are separately authorized and checked. CI success applies only to automated checks actually executed.

Publisher-only YouTube source curation stays unchanged: the system must not auto-enroll any channels.
