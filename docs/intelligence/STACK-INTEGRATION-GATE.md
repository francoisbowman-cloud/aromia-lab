# Aromia — consolidation gate for stacked Intelligence PRs

## Reconciled snapshot (2026-11-17; verify afresh before merging)

The dependency chain was inspected through GitHub PR metadata, rather than reconstructed from old handoff notes:

`main ← #187 ← #188 ← #189 ← #190 ← #191 ← #192 ← #193 ← #194 ← #195 ← #196 ← #197 ← #198 ← #199 ← #200 ← #201 ← #202 ← this QA PR`

At the inspection checkpoint, **#187 through #202 were all OPEN, draft, unmerged, and mergeable=true**. Each targeted the immediate predecessor's head branch (except #187 → main). GitHub's `mergeable=true` only means a merge conflict is not detected **against that current base**; it does **not** attest compatibility after rebasing onto moving main, migrations, runtime availability, security, manual reviews, legal use of assets, or production operation.

## What this tranche actually verifies

`.github/workflows/aromia-integrated-qa.yml` executes in one checked-out **complete stacked HEAD**:

1. API: npm install, TypeScript build, and `test:intelligence` against isolated PostgreSQL 16 test database, including append-only journal/decision migrations, rollback protection and HTTP credential gates.
2. Web: Vitest, Next lint, TypeScript typecheck and optimized Next.js build, including editor dossier, admin proxies, image inspector, product identity fidelity, progress and dry-run proposal.
3. Standalone image provenance and release-boundary tests under `scripts/`. These detect accidental exposure of browser writes, mismatched schema prerequisites, and forbidden software-only approvals.

A green run verifies those **specific automated checks for one commit**. It is not a live browser or staging QA, production database migration, real image identification, proof of license, or visual review sign-off.

## Required before any integration to main

- Recheck base/head SHA and PR status in order. Do not batch merge all 16 blind. The stacked branch may contain source changes made to descendants after parent CI passed; rebase/update branches if their bases move.
- Obtain explicit Publisher authorization for each merge series. This QA PR does not approve merges.
- Run complete cross-stack CI after each base/head update; check **both web and PostgreSQL** gates.
- Execute a browser session in an **authorized isolated environment** at `/admin/progreso`, `/admin/operaciones`, and `/admin/revision-visual`, checking keyboard/screenreader/mobile and disabled-feature errors.
- Prepare an isolated fixture set that contains real local allowed raster assets, one valid source/claim, a mismatched concentration, a rejected image and a later hash change. Check that no 8/8 visual claims bypass the independent product identity gate.
- Verify the staged opt-in migrations 024–028 in order; do not run legacy migrator or apply to production in this tranche. Confirm no actual records are erased by rollback.
- Never expose `EDITORIAL_REVIEW_TOKEN`, `ADMIN_API_TOKEN`, `IMAGE_REVIEW_HMAC_KEY` or production secrets to browser test fixtures.
- Confirm the Publisher explicitly authorizes each source channel; an empty YouTube source registry is correct.
- Catalog packshots remain **unverified** until source, rights, exact brand/name/flanker/concentration, text/logo/geometry/color/dimensions and other unique traits are independently reviewed. A byte match is not identity proof.

## Progress bar

The audited roadmap gate counter remains **1 of 10 verified (10%)**. Code reviews, CI success and open PRs are implementation evidence but do not in themselves close operational roadmap gates. The goal of 50% requires validated completion of four additional entire gates and remains a target, not a value to set manually.
