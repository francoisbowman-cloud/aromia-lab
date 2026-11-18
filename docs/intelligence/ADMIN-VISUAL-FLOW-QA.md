# Aromia — isolated admin visual-review smoke, second consolidation block

These checks exercise real Next.js route handler code, the genuine signed admin-session verifier and the existing `proxyToAdminApi`. The upstream API responses are **isolated fixtures** injected into a mocked fetch; no network service, production database or publisher secret is contacted.

## Exercised flow

- Missing and forged signed-session cookies result in HTTP 401 and no backend calls.
- A correctly signed admin cookie with a missing server API token fails closed (503).
- A signed session retrieves a per-perfume visual observation and the rejection history for that observation, using the **actual read-only** Next API routes.
- Proxy requests carry only the server admin bearer token, not the separate `EDITORIAL_REVIEW_TOKEN`; returned identity/rights/approval statuses remain explicitly unverified/blocked.
- A traversal slug or invalid observation ID is rejected before the fake backend is called.
- API failure is reported as a recoverable 502 without turning into an approval.
- Server-side component render smoke checks that the eight-point real-product fidelity checklist, decision timeline and replacement simulation render their non-authorizing labels.

## Reproducible verification

Within `apps/web`:

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
```

The stacked integrated workflow `.github/workflows/aromia-integrated-qa.yml` also runs API/PostgreSQL and standalone image contracts on the **same checkout**.

## Explicitly not covered

- A real browser clickthrough, screenreader or mobile QA; a human tester must still inspect the UI in authorized local/staging environment.
- A deployed session/cookie, actual Railway or hosted Next runtime, secret configuration and production migrations.
- A real catalogue item, source authenticity, product variant, visual rights, publisher identity, real media replacement or rollback.

All of those remain separate release blockers. No changes are approved for production by these tests. The project progress bar stays at 1/10 verified gates until independent phase acceptance.
