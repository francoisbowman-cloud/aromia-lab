# Aromia — Production Dependency Risk, Integration Candidate #205

## Exact CI evidence (2026-11-17, GitHub Actions UTC Nov 18)

A read-only audit against the pinned **apps/web** dependency lockfile reported:

- Overall install (development + production): **59** advisories: 1 critical, 25 high, 33 moderate.
- `npm audit --json --omit=dev`: **1 critical, 5 high, 26 moderate** in **production dependencies**.
- Critical: direct `next` (currently `14.2.35`).
- High: direct `sharp` (currently `0.35.3`); indirect `@tiptap/core`, `postcss`, `prosemirror-view`, `source-map-js`.

This is **an advisory inventory, not proof of exploitation**. However, because critical/high advisories remain, the integration candidate explicitly **fails its production security gate**. A green build or passing unit tests cannot override the risk gate.

### Priority 0 — Next.js platform migration

Current `next@14.2.35` needs a **supported, security-patched major-line migration**, not a minimal semver tweak. Vercel's May 2026 advisory states Next 13/14 all versions require migration to `15.5.18+` or `16.2.6+` for that advisory; check the current *highest patched stable version* before upgrading. Reference: https://vercel.com/changelog/next-js-may-2026-security-release

Evaluate `next@15` (lower migration risk) vs supported `next@16` with an isolated PR. Review:
- React and React-DOM compatibility;
- cookies/session middleware and Next API route-handler params;
- server/client component boundaries;
- next/image, Sharp, Webpack/Turbopack, middleware auth and env;
- CMS rendering, editorial homepage, catalogue, SEO and routing;
- all 3 admin screens and runtime signed-cookie smoke.

Do not change production runtime until isolated staged full-suite checks and visual QA pass.

### Priority 1 — Image processor

Current `sharp@0.35.3` was implicated in the high-risk production audit. Test a supported patch line such as `0.35.5` in isolation, with **real raster and image-security tests**, including malformed file, symlink/traversal, large-image rejection and byte hashing. Do not assume the audit is cleared until rerun. References:
https://security.snyk.io/package/npm/sharp
https://github.com/lovell/sharp/security/advisories/GHSA-rgj7-g3m4-5g8c

### Priority 1 — Tiptap / ProseMirror

Current editor packages are pinned to `3.28.0`. Review a matched, newer stable release across `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit` and extension-image; upstream changed `prosemirror-view` to `^1.42.3` to fix an XSS issue involving crafted pasted HTML. Reference: https://github.com/ueberdosis/tiptap/releases

Mandatory tests: paste/render trusted and untrusted rich text, persisted `contenido_html`, sanitizer boundary, editor image extension and original editorial content; no raw untrusted HTML injection or lost composition.

### Priority 1/2 — Transitive dependencies

Investigate `postcss` and `source-map-js` using `npm explain`/`npm ls`, identify patched versions available within declared ranges, and update the lockfile in a **separate reviewed branch**, never a blind `npm audit fix --force`.

### Release sequence

1. Capture exact current advisory identifiers, fixable targets and dependency paths with the versioned `scripts/qa/summarize-dependency-audit.mjs` (production-only, no dev-noise).
2. Isolate dependency changes from the full integration candidate. Update package and lockfile **together** with clean npm install.
3. Run `npm ci`, web tests, lint, TS, optimized build and **actual Next HTTP signed-session smoke** plus API/PostgreSQL and image contracts.
4. Rerun `npm audit --omit=dev`. Verify critical/high = 0 or obtain a signed, time-limited, evidence-backed exception after analysing reachable exposure; CI currently blocks regardless.
5. Obtain manual mobile/desktop staging QA and explicit Publisher authorization before any production change.

No package upgrades have been performed by this document. Do not confuse this audit with a completed security remediation. Project completion remains 1/10 gates until acceptance.

## Automated disposable compatibility rehearsal

`.github/workflows/aromia-security-rehearsal.yml` tests an **ephemeral**, explicitly pinned candidate graph on a GitHub runner: Next 15.5.28 / React 19.2.3 / Sharp 0.35.5 / Tiptap 3.32.1. It recomputes the package-lock only in the runner, then runs web tests, lint, TS, Next build, real HTTP smoke and a fresh production-dependency audit. An artifact contains the disposable package manifests for seven days.

A rehearsal **does not change the repository, merge anything, or approve production**. CI can reveal unsupported peer versions, missing packages, application incompatibilities or remaining advisories. Never copy a generated lockfile into the integration candidate unless the full combined check and human diff/rights review validate it.
