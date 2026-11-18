# Aromia — One reviewable integration candidate, without production changes

## Purpose

This branch consolidates **the full stacked work from #187 through #204** onto a single candidate HEAD. The first reviewable target is **main**, via one **draft** integration PR. Nothing is merged or deployed by creating that PR.

Validated automated quality in preceding source branch #204:

- API TypeScript + isolated PostgreSQL 16 migrations/integration tests;
- browser-facing Next.js handler session/proxy fixtures;
- web Vitest, lint, TypeScript and optimized build;
- image and publication guard contracts.

## Additional runtime proof

Run `node scripts/qa/admin-runtime-smoke.mjs` **only after `npm ci` + `npm run build` in `apps/web`**.

This starts a genuine **Next production server** on localhost with a fully isolated fake backend, ephemeral ports and synthetic signed admin-cookie credentials. It asserts:

- unauthenticated and tampered session rejected;
- unauthorized admin pages redirected;
- authorized /admin/revision-visual, /admin/progreso and /admin/operaciones return HTTP 200;
- real signed-session admin proxy reads unverified visual observations and rejection decisions using exactly the fake backend;
- no Publisher credentials sent to the backend or browser;
- read-only endpoints refuse POST;
- malicious slug/observation ID rejected;
- local image inspector and replacement remain disabled without opt-in.

No real database, reviewer, user, photo, secret, remote source or production deployment is used. **This is HTTP functionality, not pixel-level browser QA.** It does not prove UI interactions or accessiblity.

## New security release gate

The candidate's CI also captures **production-only** `npm audit --json --omit=dev` and categorizes direct/transitive high or critical advisory paths. If any exist, the explicit security gate **fails** even if web/API tests pass. The CI log provides a bounded advisory inventory for follow-up. Do not run `npm audit fix --force` and do not declare release/security ready from generic build success.

A security advisory is not automatically exploitable. Fixes require tracing relevant runtime paths, evaluating supported patched versions and a documented update/test plan.

## Manual release checklist — not automatically satisfied

- [ ] Resolve high/critical reachable production advisories or document a reviewed, time-limited security disposition.
- [ ] Inspect cumulative diff and split risky pieces if necessary.
- [ ] Confirm all functionality and database migrations 024–028 in a disposable staging environment.
- [ ] Real browser check (mobile/desktop, keyboard/focus, disabled-features/visual inspector, loading/error).
- [ ] Independent licensed source and exact product-identity verification (labels/texts/logos/geometry/colors/dimensions/flankers/concentration).
- [ ] Explicit approved storage/backups and reversible swaps before any real media replacement.
- [ ] Explicit Publisher authorization to merge an integration candidate.
- [ ] Separate deploy/production migration approval after production rollback strategy is verified.

No PRs are auto-merged. Publishing stays blocked. YouTube channel registry remains empty until the Publisher selects sources.

**Progress semantics:** keep verified roadmap 1/10 (10%) until whole milestone acceptance; integration candidate alone cannot elevate the percentage.
