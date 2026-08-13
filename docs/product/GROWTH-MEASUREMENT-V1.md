# Aromia — Product Growth Measurement v2

## Scope

This document belongs to the web/product track. Catalog expansion and Fase 3 remain out of scope.

## North-star journey

Aromia is not optimized for raw pageviews. The primary journey is:

`discovery → understanding → comparison → product intent → commercial exit / owned audience`

Discovery v2 adds a local learning loop:

`explicit/observed interest → local olfactory map → explainable reranking → new discovery route → stronger or broader signal`

The learning loop is a browser-side product feature, not an analytics profile.

## Core events

| Event | Meaning | Primary dimensions |
|---|---|---|
| `page_view` | Route/surface viewed | `page_path`, `page_title` |
| `web_vital` | Real-user performance signal | `metric_name`, `metric_value`, `metric_rating`, `navigation_type` |
| `internal_search` | Visitor expresses a discovery intent | `context`, `query_length`, result counts; never raw query text |
| `discovery_product_clicked` | Catalog/search creates PDP intent | `context`, `perfume_slug`, `position` |
| `similar_clicked` | PDP similarity rail continues exploration | `source_slug`, `target_slug`, `position`, `score` |
| `compare_started` | Visitor opens a two-product comparison | `source_slug`, `target_slug` |
| `quiz_started` | User commits to Discovery | `total_questions` |
| `quiz_answered` | Quiz progression | `question_number`, `option` |
| `quiz_completed` | Discovery produces a profile | `perfil`, `total_questions` |
| `quiz_result_product_clicked` | Quiz result creates PDP intent | `perfume_slug`, `position` |
| `editorial_reader_open` | Reader activates immersive article reading | `article_slug`, `category`, `reading_minutes` |
| `content_to_product` | Magazine context creates PDP intent | `article_slug`, `perfume_slug`, `position` |
| `product_to_content` | PDP creates an editorial continuation | `perfume_slug`, `article_slug`, `position` |
| `search_content_clicked` | Global search creates editorial intent | `article_slug`, `position` |
| `affiliate_click` | Product intent becomes retailer exit | `retailer`, `perfume_slug`, offer metadata |
| `newsletter_signup` | Visitor becomes owned audience | `fuente` |

The local Discovery v2 profile is deliberately **not** copied to GA. Families, notes, perfumer weights, viewed-product history and quiz-weight history remain in browser storage. Analytics observes navigation outcomes, not the full preference map.

## KPI model

1. **Discovery interaction rate** = sessions with search/similarity/comparison/quiz activity / eligible sessions.
2. **Similarity continuation rate** = `similar_clicked / PDP page_view`.
3. **Comparison start rate** = `compare_started / PDP page_view`.
4. **Quiz completion rate** = `quiz_completed / quiz_started`.
5. **Quiz recommendation progression** = `quiz_result_product_clicked / quiz_completed`.
6. **Editorial-to-product rate** = `content_to_product / article page_view`.
7. **Product-to-editorial rate** = `product_to_content / PDP page_view`.
8. **Olfactory-map adoption proxy** = page views of `/descubrir` among returning discovery sessions. Do not transmit the map itself merely to measure adoption.
9. **Discovery depth** = number of distinct Discovery surfaces reached in a session: Search, PDP, Perfumistas, Magazine, Quiz, Compare, `/descubrir`.
10. **PDP commercial intent rate** = sessions with `affiliate_click / PDP sessions`.
11. **Owned audience conversion** = `newsletter_signup / eligible surface sessions` split by `fuente`.
12. **Experience health** = Core Web Vitals segmented by route/device.

## Discovery v2 interpretation

- Search remains text-first. The local profile may re-rank only among textually relevant results.
- Similarity remains evidence-first. Personalization can change ordering but does not rewrite the deterministic similarity evidence.
- Article relationships remain grounded in `perfumes_relacionados`; local personalization is presented as a separate continuation surface.
- Perfumer relationships are taken only from the reviewed attribution index.
- Weak article/PDP observations are bounded; Quiz completion is a stronger explicit signal.
- Already-viewed products receive a bounded ranking penalty so Discovery does not collapse into repetition.

## Privacy guardrails

- Never send email, account identity, free text, raw search terms or the serialized local discovery profile to analytics.
- `internal_search` records query length and result counts, not the query itself.
- Local preference storage must remain optional, resettable and non-blocking.
- Do not fingerprint or synchronize the olfactory map across devices without a separate explicit product/privacy decision.
- Do not use analytics failure or localStorage failure to block navigation, commerce, reading, Quiz or rendering.
- GDPR/GA consent remains a separate product/legal decision.

## Recommended GA4 views

- Discovery funnel: Search/Quiz → PDP → Similar/Compare → affiliate exit.
- Quiz funnel: `/quiz` → completion → result PDP → continuation.
- Editorial loop: article → related product → PDP → editorial continuation.
- Authorship loop: `/perfumistas` → perfumer detail → work PDP.
- Map adoption: `/descubrir` page views and subsequent surface transitions, without preference payloads.
- Search: result CTR by result-count band; never raw search terms.
- Performance: Web Vitals by route and device category, including `/descubrir` and `/perfumistas`.

## Release gate

For web/product releases, preserve event names and parameter semantics unless this document is updated in the same PR. OMNI must reject analytics calls that contain obvious email/message fields or a raw `query` parameter. Discovery profile state must remain browser-local and resettable. Fase 3 remains isolated.
