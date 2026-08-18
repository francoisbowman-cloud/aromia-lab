import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

async function text(path) { return readFile(join(root, path), "utf8"); }
async function requireText(path, patterns) {
  let source;
  try { source = await text(path); } catch { failures.push(`missing_required_file ${path}`); return; }
  for (const [label, pattern] of patterns) if (!pattern.test(source)) failures.push(`${label} ${path}`);
}

await requireText("docs/design/visual-upgrade/HYBRID-SIGNATURE-VISUAL-CONTRACT.md", [
  ["hybrid_contract_missing_catalog_rule", /premium discovery surface/i],
  ["hybrid_contract_missing_pdp_sequence", /Identity.*Object.*Sensory anatomy.*Performance.*Story.*Commerce.*Community/is],
]);

await requireText("apps/web/src/components/home/TasteLanding.tsx", [
  ["home_hero_missing_real_catalog_product", /<ProductImage\s+slug=\{hero\.slug\}\s+imageUrl=\{hero\.imagen_url\}/],
  ["home_hero_missing_catalog_identity", /Objeto del catálogo/],
]);
const home = await text("apps/web/src/components/home/TasteLanding.tsx");
if (/editorial\/cinematic-warm\.png/i.test(home)) failures.push("home_hero_anonymous_background_regression");

await requireText("apps/web/src/app/catalogo/[slug]/page.tsx", [
  ["pdp_missing_not_found", /notFound\(\)/], ["pdp_missing_canonical", /canonical:\s*`\/catalogo\/\$\{perfume\.slug\}`/], ["pdp_missing_product_jsonld", /application\/ld\+json/], ["pdp_missing_hero", /<HeroHeader/], ["pdp_missing_sensory_anatomy", /<SkinEvolution/], ["pdp_missing_performance", /<PerformanceBars/], ["pdp_missing_story", /<EditorialMood/], ["pdp_missing_commerce", /<PriceTable/], ["pdp_missing_community", /<CommunityReviews/],
]);

await requireText("apps/web/src/components/perfume/PerfumesCatalog.tsx", [
  ["mobile_filters_must_be_collapsible", /<details[^>]+group/], ["mobile_filters_must_cap_height", /max-h-\[56vh\]/], ["desktop_filters_must_not_render_mobile", /hidden grid-cols[^\n]+lg:grid/],
]);
await requireText("apps/web/src/components/perfume/PerfumeCard.tsx", [["catalog_card_image_must_route_to_pdp", /href=\{`\/catalogo\/\$\{perfume\.slug\}`\}/]]);
const card = await text("apps/web/src/components/perfume/PerfumeCard.tsx");
if (/api\/catalog-buy/.test(card)) failures.push("catalog_card_direct_commerce_regression");

await requireText("apps/web/src/app/perfumistas/page.tsx", [["perfumer_index_missing", /Autores del aroma/]]);
await requireText("apps/web/src/app/perfumistas/[slug]/page.tsx", [
  ["perfumer_detail_missing_works", /Obras en Aromia/],
  ["perfumer_discovery_signal_missing", /DiscoverySignal/],
  ["perfumer_personalized_continuation_missing", /PersonalizedDiscoveryRail/],
]);
await requireText("apps/web/src/lib/perfumers.ts", [
  ["perfumer_attribution_guard_missing", /incomplete, reviewed index/i], ["black_afgano_perfumer_missing", /black-afgano/], ["chance_perfumer_missing", /chance-eau-tendre/],
]);

await requireText("apps/web/src/lib/discoveryProfile.ts", [
  ["discovery_profile_storage_key_missing", /aromia\.discovery\.profile\.v2/],
  ["discovery_profile_must_be_local_only", /localStorage/],
  ["discovery_profile_reset_missing", /clearDiscoveryProfile/],
]);
await requireText("apps/web/src/lib/personalization.ts", [
  ["personalized_family_signal_missing", /familyWeight/],
  ["personalized_note_signal_missing", /noteWeights/],
  ["personalized_perfumer_signal_missing", /perfumerWeights/],
  ["personalized_seen_penalty_missing", /seenWeight/],
]);
await requireText("apps/web/src/app/descubrir/page.tsx", [["discovery_map_route_missing", /DiscoveryDashboard/]]);
await requireText("apps/web/src/components/discovery/DiscoveryDashboard.tsx", [
  ["discovery_map_families_missing", /Familias/], ["discovery_map_notes_missing", /Notas/], ["discovery_map_perfumers_missing", /Perfumistas/], ["discovery_map_recommendations_missing", /Recomendaciones vivas/],
]);
await requireText("apps/web/src/components/quiz/QuizFlow.tsx", [["quiz_must_feed_discovery_profile", /recordQuizProfile/]]);
await requireText("apps/web/src/components/perfume/HeroHeader.tsx", [["pdp_must_feed_discovery_profile", /recordPerfumeInterest/]]);
await requireText("apps/web/src/components/perfume/SimilarPerfumes.tsx", [["similarity_must_include_personalization", /personalizedPerfumeScore/]]);
await requireText("apps/web/src/components/perfume/SkinEvolution.tsx", [["notes_must_be_traversable", /\/buscar\?q=/]]);
await requireText("apps/web/src/components/discovery/DiscoverySearch.tsx", [["search_must_accept_deep_link", /initialQuery/], ["search_must_use_profile_as_reranker", /personalizedPerfumeScore/]]);
await requireText("apps/web/src/app/magazine/[slug]/page.tsx", [["magazine_personalized_continuation_missing", /PersonalizedDiscoveryRail/]]);
await requireText("apps/web/src/components/magazine/RelatedPerfumes.tsx", [["editorial_relationship_signal_missing", /recordPerfumeInterest/]]);

await requireText("apps/web/src/app/api/catalog-image/[slug]/route.ts", [
  ["ccl_policy_header_missing", /x-aromia-image-policy[^\n]+omni-ccl-product-only/i], ["social_card_normalization_missing", /perfume-social-cards/], ["catalog_image_ssrf_guard_missing", /192\\\.168|169\\\.254|private172/], ["official_media_black_afgano_missing", /nasomatto\.com\/es\/products\/black-afgano/], ["official_media_chance_missing", /chanel\.com\/us\/fragrance\/p\/1263(?:20|60)/], ["official_media_origin_header_missing", /official-brand/],
]);

await requireText("apps/api/src/db/applyCatalogCompleteness.ts", [["amazon_enrichment_should_be_degraded_not_fatal", /AMAZON_CATALOG_COMPLETION_DEGRADED/]]);
await requireText("apps/web/preflight-catalog.mjs", [["web_preflight_must_not_kill_availability", /startup will continue/], ["web_preflight_must_exit_zero", /process\.exit\(0\)/]]);
await requireText("apps/web/src/lib/analytics.ts", [["analytics_must_be_guarded", /typeof window|window\./]]);

const imageRoute = await text("apps/web/src/app/api/catalog-image/[slug]/route.ts");
if (/social-cards[^\n]+return/i.test(imageRoute) && !/375x500/.test(imageRoute)) failures.push("social_card_can_escape_ccl_normalization");

async function walk(dir) {
  const entries = await readdir(join(root, dir), { withFileTypes: true }); const files = [];
  for (const entry of entries) { const rel = join(dir, entry.name); if (entry.isDirectory()) files.push(...await walk(rel)); else if (/\.(tsx?|mjs|js)$/.test(entry.name)) files.push(rel); }
  return files;
}

for (const file of await walk("apps/web/src")) {
  const source = await text(file);
  if (/fimgs\.net\/mdimg\/perfume-social-cards/i.test(source) && !file.includes("catalog-image")) failures.push(`forbidden_social_card_reference ${file}`);
  for (const call of source.match(/trackEvent\([\s\S]*?\);/g) || []) if (/\b(?:email|correo|message|mensaje|query)\s*:/i.test(call)) failures.push(`analytics_possible_pii_or_raw_query ${file}`);
}

const contract = await text("docs/OMNI-INTEGRATION.md");
if (!/OBSERVE → INTENT → KNOWLEDGE → PLAN → PREVIEW → PROVE/.test(contract)) warnings.push("omni_observe_intent_sequence_not_observed");
if (!/OMNI no debe inventar ni alterar la identidad real del frasco/i.test(contract)) failures.push("omni_product_identity_guardrail_missing");

console.log(`[omni] strict audit failures=${failures.length} warnings=${warnings.length}`);
for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const failure of failures) console.error(`FAIL ${failure}`);
if (failures.length) process.exit(1);
