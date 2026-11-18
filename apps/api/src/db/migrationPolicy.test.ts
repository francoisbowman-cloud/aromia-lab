import test from 'node:test';
import assert from 'node:assert/strict';
import { selectMigrations } from './migrationPolicy';
const migrations=[
  '001_initial.sql','023_catalog.sql','024_intelligence_jobs.sql',
  '025_intelligence_artifacts.sql','026_editorial_review.sql',
  '027_visual_review_journal.sql','028_visual_review_decisions.sql',
];
test('legacy migration defaults to ignoring all five Intelligence schemas',()=>{
  const result=selectMigrations(migrations,{});
  assert.deepEqual(result.selected,['001_initial.sql','023_catalog.sql']);
  assert.deepEqual(result.deferred,migrations.slice(2));
});
test('development operator opt-in selects optional schemas in dependency order',()=>{
  const result=selectMigrations(migrations.slice().reverse(),{
    intelligenceEnabled:'true',nodeEnv:'development'
  });
  assert.deepEqual(result.selected,migrations);
  assert.deepEqual(result.deferred,[]);
});
test('production requires two independent explicit operator confirmations',()=>{
  assert.throws(()=>selectMigrations(migrations,{
    intelligenceEnabled:'true',nodeEnv:'production'
  }),/explicit_production_intelligence_migration_approval_required/);
  assert.deepEqual(selectMigrations(migrations,{
    intelligenceEnabled:'true',productionApproved:'true',nodeEnv:'production'
  }).selected,migrations);
});
test('similar but wrong env values never unlock opt-in schemas',()=>{
  assert.deepEqual(selectMigrations(migrations,{
    intelligenceEnabled:'1',productionApproved:'true',nodeEnv:'production'
  }).selected,migrations.slice(0,2));
});
