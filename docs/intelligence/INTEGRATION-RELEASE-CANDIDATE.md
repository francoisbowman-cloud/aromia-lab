# AROMIA — Integration release candidate (NO deployment authorization)

## Baseline and code coverage

This candidate is based on **the exact full stacked head of draft PR #204** and targets `main` for an aggregated review. It includes all inherited changes from draft PRs #187–#204, which are intentionally not merged. Against inspected main at commit `1619c776560f5d6f9c5948f8092ff5241540048f`, GitHub comparison found 126 ahead, 0 behind, 112 changed files **before** new candidate-only QA changes. These figures must be refreshed before any future review or merge.

The goal of this review surface is to prevent treating 18 individually green stacked PRs as one automatically production-safe release. It is **not** merge authorization, a deployment schedule, a request to publish visual assets, or permission to mutate production data.

## Automated acceptance

- Integrated suite: TypeScript build + local PostgreSQL 16 integration for Intelligence, decisions, metadata and migrations; Next.js tests, lint, typecheck and build; image monitor and product fidelity guards.
- A separate isolated **real Chromium** smoke uses a temporary image fixture and stub API only (no production access), signed admin login, visual-review history and rejection, an exact-product mismatch hard block, image inspection and dry-run-only replacement. It tests mobile and desktop layouts.
- Original product identity criterion: labels, texts, logos, geometry, colors, dimensions and distinguishable features must match the real product. A spectacular image that is physically wrong is rejected.
- The progress percentage remains **1/10 verified gates**. PR checks are not production/editorial verification.

## Opt-in migrations: fail-safe legacy migrator

`apps/api/src/db/migrate.ts` historically ran **all** SQL files under the migration directory. Therefore the prior wording that schemas 024–028 were opt-in was unsafe when invoking the legacy migrator. This candidate introduces explicit selection:

- Default: skip `024_intelligence_jobs.sql` through `028_visual_review_decisions.sql` when running the legacy migrator.
- Authorized isolated development: `AROMIA_INTELLIGENCE_MIGRATIONS_ENABLED=true`.
- Production: **also** require `AROMIA_INTELLIGENCE_PRODUCTION_MIGRATIONS_APPROVED=true`, and obtain separate Publisher permission **before configuring or running either flag**.
- These env flags do not run migrations automatically; the operator must explicitly invoke the migration command. Existing base migrations remain subject to the legacy migrator behavior and deserve independent audit.
- Individual 027/028 rollback scripts reject deleting any stored review evidence or decisions.

## Security and release blockers

- A prior CI install printed **59 npm advisories (33 moderate / 25 high / 1 critical)** for `apps/web`. This is a preliminary install audit, **not a verified exploit or a remediated security report**. Investigate direct/runtime reachability and patched versions before deployment; never run mass `npm audit fix --force` on the release candidate.
- The password-only legacy admin session and existing authorization must undergo security review and browser QA against a real isolated environment before production use. Fake backend tests are not live deployment evidence.
- No persistent reviewer identity certification, actual image licenses, immutable real rollback object store or genuinely approved product packshots exist in this tranche. Therefore catalog replacement and publication remain blocked.
- Real browser smoke is CI-only. Verify staging UI manually with keyboard, screen reader and mobile devices before promoting.
- Confirm branch protection and check outcomes on the **aggregated PR**, not only individual stacked PRs.

## Decision required to ship later

1. Independent security review + dependencies triage.
2. Complete isolated browser and API/PostgreSQL integration checks.
3. Human review of package migrations and production environment.
4. Editorial product identity, rights, variant and photograph approval.
5. Explicit Publisher authorization for merging, enabling migrations, deploying and publishing **separately**.

No newly selected YouTube source was introduced. The channel registry remains Publisher-curated only.

## Confirmed runtime security findings — audit of merged candidate

The dedicated runtime-only audit in [GitHub Actions run 44228654600](https://github.com/francoisbowman-cloud/aromia-lab/actions/runs/44228654600) found:
- **Web:** 1 critical, 5 high, 26 moderate affected packages. Direct critical `next` (currently declared 14.2.35), high `sharp` and transitive `@tiptap/core`, `postcss`, `prosemirror-view`, `source-map-js`. npm recommends major `next@16.4.6` for its advisory, which **cannot** be treated as a compatibility-safe patch.
- **API:** 1 critical, 3 high, 4 moderate; critical `proxy-addr`; high `body-parser`, `js-yaml`, `multer`. Reported packages and fixability may change when the registry updates.
- Both security jobs fail intentionally. This is a **release hold**, not a failed application test. The advisories do not establish that a specific exploit is reachable but cannot be silently dismissed.

Tracking issue: [#207 — Security release block](https://github.com/francoisbowman-cloud/aromia-lab/issues/207). Keep API/Web package-lock changes in narrow reviewed remediation PRs and repeat browser, PG and identity checks after any changes. Do not auto-upgrade Next across major versions or run `npm audit fix --force` without a migration plan.
