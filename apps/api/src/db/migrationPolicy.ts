// Default-deny policy for the opt-in Intelligence schemas 024–029.
// This module determines selection only and never connects to a database.
const INTELLIGENCE = /^(024|025|026|027|028|029)_.*\.sql$/;
export function selectMigrations(files: readonly string[], flags: {
  intelligenceEnabled?: string;
  productionApproved?: string;
  nodeEnv?: string;
}): {selected:string[]; deferred:string[]} {
  const sorted=[...files].filter(name=>/^\d{3}_[a-z0-9_-]+\.sql$/.test(name)).sort();
  const intelligence=sorted.filter(name=>INTELLIGENCE.test(name));
  const optedIn=flags.intelligenceEnabled==="true";
  if(optedIn && flags.nodeEnv==="production" && flags.productionApproved!=="true") {
    throw new Error("explicit_production_intelligence_migration_approval_required");
  }
  return {
    selected:sorted.filter(name=>!INTELLIGENCE.test(name)||optedIn),
    deferred:optedIn?[]:intelligence,
  };
}
