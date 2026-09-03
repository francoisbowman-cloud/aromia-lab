# Editorial draft deployment mirror

Railway builds the web service with `/apps/web` as its build root, so files from the repository-level `/drafts` directory are outside the Docker build context.

The Markdown files in this directory are a deployment mirror for the nine SubBatch 01 routes consumed by `src/app/(editorial)/historias/subBatch01Story.tsx`.

- Canonical editorial source remains `/drafts/<slug>.md`.
- When a mirrored draft changes canonically, update the corresponding file here in the same editorial implementation change.
- Do not add unpublished drafts here unless the route actually consumes them.
- This mirror exists only to make production builds reproducible; it is not a second editorial authority.
