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

Then, if database initialization is required:

```bash
npm --prefix apps/api run migrate
```

Seed only when the task explicitly requires a local dataset:

```bash
npm --prefix apps/api run seed
```

Do not reseed casually if the developer is using a curated local database for visual QA.

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

## Font caveat

The repository has previously observed that local `next/font` may fail to fetch Newsreader in some environments.

If this happens:
- do not redesign typography around the fallback font;
- use local work for composition/spacing/function;
- perform final typographic judgment against a production-like build or verified remote render.

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
