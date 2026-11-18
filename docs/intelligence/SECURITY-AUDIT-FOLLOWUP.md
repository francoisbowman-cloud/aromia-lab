# Aromia — dependency security audit finding (non-remediated)

During the integrated web CI for draft PR #204, `npm ci` in `apps/web` reported:

- 59 advisories: 33 moderate, 25 high and 1 critical.

**This is npm's dependency audit output, not proof of an exploitable production vulnerability**. Severity, reachable code paths, direct versus transitive packages and patch availability are not yet assessed. The existing `npm test` / `lint` / `typecheck` / `build` jobs do **not** satisfy a vulnerability clearance gate.

Next authorized QA tranche:

1. Run `npm audit --json` from `apps/web` in an isolated environment using the committed lockfile.
2. Identify affected direct/transitive packages and distinguish runtime reachability from developer tooling; determine available nonbreaking patched versions.
3. Prioritize the critical/high items based on evidence of exposure, inspect lockfile diffs, then patch on a separate reviewed branch with full regression tests.
4. Avoid `npm audit fix --force` or mass upgrades on the chained branch without a compatibility plan.
5. Do not declare the project security-audited or release-ready until that assessment is documented.

This note does not introduce dependencies, apply upgrades, merge branches, deploy, or authorize release. The certified project progress bar remains unchanged.
