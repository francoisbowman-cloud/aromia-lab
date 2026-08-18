# Batch 003 runtime verification

After a successful transaction, verify:
- exactly 10 rows have `catalog_source=batch-003`;
- identity fields and concentration are present;
- top/middle/base note arrays are non-empty;
- provenance is present;
- data confidence remains `high`;
- rows are active and published;
- API returns the expanded catalog and each Batch 003 slug resolves;
- web catalog and PDP routes render without page/console errors;
- missing images remain honest empty states rather than substituted product imagery.

If any database invariant fails, use the guarded rollback script. If a web-only presentation issue appears, keep the data and fix presentation unless product identity is compromised.
