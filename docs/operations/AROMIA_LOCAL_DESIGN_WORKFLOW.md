# Aromia — Local Design & Code Workflow

STATUS: CANONICAL DEVELOPMENT WORKFLOW
DATE: 2026-09-12
PURPOSE: accelerate visual/design iteration without bypassing GitHub, CI, OMNI or Railway.

## Principle

Local is the workshop.
GitHub is the source of truth.
Railway is production.

Aromia may be developed locally for hours or days on a temporary branch before push. The goal is to compress the visual iteration loop from:

`edit → push → CI → deploy → inspect`

to:

`edit → refresh → inspect → refine`

without weakening the release process.

## Relationship to the active Design task

This workflow does NOT replace or pause the current Design work.

Primary active Design work remains:
- Fragancias / cutouts composition
- Historias / EditorialArchive rhythm
- Saber / material direction

The local workflow is enabling infrastructure for those same tasks and future Code implementation.

## Recommended local architecture

Run infrastructure in Docker:
- PostgreSQL
- Redis

Run application processes on the host:
- API with hot reload
- Web with Next dev hot reload

This gives the fastest design loop while keeping local dependencies close to production.

## One-time setup

From the repository root:

```bash
npm install
npm --prefix apps/api install
npm --prefix apps/web install
```

Create local env files:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Defaults already target:
- web: http://localhost:3000
- api: http://localhost:4000
- postgres: localhost:5432
- redis: localhost:6379

Do not commit real secrets.

## Start infrastructure

```bash
npm run local:infra
```

For a reproducible development dataset, use a dedicated loopback database:

```bash
npm run local:db
```

This creates `aromia_dev` (50 repository perfume fixtures, 15 legacy articles), applies
schema migrations with checksums and seeds only once. It never resets a database.
It rejects remote hosts, names not ending in `_dev`, production mode and existing
perfume datasets without its local history table. Override the target only with
`LOCAL_DATABASE_URL` (keep credentials in local settings, never commits).

Start the API against that same database; with the example-only local credentials:

```bash
DATABASE_URL=postgresql://aromia:aromia@localhost:5432/aromia_dev npm run local:api
```

The historical `migrate` command remains for the production migration chain.
Migrations 012–020 repair/assert the real production catalog (at least 125 rows);
they are deliberately outside the local fixture bootstrap. Local fixture success
is not production catalog parity. No existing production assertion is disabled.
The fixtures are development data, not newly reviewed/published editorial content.

## Start Aromia

Use two terminals.

Terminal 1:

```bash
npm run local:api
```

Terminal 2:

```bash
npm run local:web
```

Open:

`http://localhost:3000`

## Design workflow

For visual work:

1. create a temporary branch from current `main`;
2. start local infra + API + web;
3. work in browser at real target widths;
4. keep DevTools responsive mode open;
5. inspect both light and dark where relevant;
6. compare before/after screenshots locally;
7. iterate until the design decision is stable;
8. only then commit/push the coherent unit;
9. run the local verification gate;
10. open PR;
11. let CI / OMNI / Railway validate the release candidate.

## Required Design viewports

Minimum:
- 390×844
- 430×932
- 768×1024
- 1024×768
- 1280×900
- 1440×1000
- 1728×1117

For each changed surface review:
- hierarchy
- crop
- image/story ownership
- typography
- line wrapping
- whitespace
- CTA placement
- focus/hover
- dark mode
- horizontal overflow

## Local verification before push

Run:

```bash
npm run local:verify
```

This executes the repository-level gates appropriate before a PR:
- internal link audit
- OMNI strict audit
- API build
- Web tests
- Web lint
- Web TypeScript check
- Web production build

Local success does not replace GitHub CI.

## Stop infrastructure

```bash
npm run local:infra:down
```

Database volume is preserved.

To destroy local PostgreSQL data intentionally:

```bash
docker compose down -v
```

Only do this when a fresh database is actually desired.

## Production data rule

Do not point local development at the production database by default.

Local visual work should use:
1. local seeded data;
2. a sanitized snapshot when one is deliberately prepared;
3. public API reads when sufficient.

Production-write credentials do not belong in the normal local Design workflow.

## Image workflow

For cutouts and editorial assets:
- serve final candidate files from local `public/` paths whenever possible;
- do not evaluate composition against a temporary external hotlink if the production implementation will use a local asset;
- preserve exact aspect ratio and transparency behavior expected in production.

## Fonts

Newsreader (upright and italic), Archivo and IBM Plex Sans are now served locally
from `apps/web/src/app/fonts/editorial/`. The official pinned sources, checksums
and OFL licenses accompany the assets. Builds require no Google Fonts request.
See that directory's README for provenance and the full-glyph payload tradeoff.

## Branch discipline

Local work does not change source-of-truth rules.

Always:
- branch from current `main`;
- keep branches temporary;
- commit coherent changes;
- push before handoff;
- merge through PR;
- let Railway deploy from `main`.

Do not accumulate a permanent “local design branch.”

## Completion rule

A local Design/Code cycle is complete when:
- the change has been visually reviewed locally;
- `npm run local:verify` passes;
- the branch is pushed;
- the PR is green;
- the merge is in `main`;
- Railway succeeds;
- production behavior is verified;
- the relay is updated.

Local is for speed, not for bypassing release discipline.

## Isolated production-mode checks

`API_URL=http://localhost:4000` explicitly selects the local server for both server
rendering and the startup preflight, including in production mode. Without
`API_URL`, production retains the private/public Railway fallback. Set
`NEXT_PUBLIC_API_URL` separately for browser search at build time. Stop Next dev
before running `npm --prefix apps/web run build`; both use `.next`.

`npm --prefix apps/web run typecheck` runs TypeScript in the correct app directory
and is now used by `local:verify`. Editorial fonts are local; do not use mock fonts for release typography evidence.
