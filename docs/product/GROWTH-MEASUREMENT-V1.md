# Aromia — Product Growth Measurement v1

## Scope

This document belongs to the web/product track. Catalog expansion and Fase 3 remain out of scope.

## North-star journey

Aromia is not optimized for raw pageviews. The primary journey is:

`discovery → understanding → comparison → product intent → commercial exit / owned audience`

A healthy session should increasingly move through one or more of these stages without making the editorial experience feel like an aggressive store.

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
| `quiz_result_product_clicked` | Personalized result creates PDP intent | `perfume_slug`, `position` |
| `editorial_reader_open` | Reader activates immersive article reading | `article_slug`, `category`, `reading_minutes` |
| `content_to_product` | Magazine context creates PDP intent | `article_slug`, `perfume_slug`, `position` |
| `product_to_content` | PDP creates an editorial continuation | `perfume_slug`, `article_slug`, `position` |
| `search_content_clicked` | Global search creates editorial intent | `article_slug`, `position` |
| `affiliate_click` | Product intent becomes retailer exit | `retailer`, `perfume_slug`, `offer_type`, `offer_position`, `offer_count`, optional price/currency |
| `newsletter_signup` | Visitor becomes owned audience | `fuente` |

No email address, raw search query or other user-entered PII is sent to analytics events.

## KPI model

1. **Discovery interaction rate** = sessions with `internal_search`, `similar_clicked`, `compare_started` or `quiz_started` / eligible sessions.
2. **Similarity continuation rate** = `similar_clicked / PDP page_view`.
3. **Comparison start rate** = `compare_started / PDP page_view`.
4. **Discovery completion rate** = `quiz_completed / quiz_started`.
5. **Quiz recommendation progression** = `quiz_result_product_clicked / quiz_completed`.
6. **Editorial-to-product rate** = `content_to_product / article page_view`.
7. **Product-to-editorial rate** = `product_to_content / PDP page_view`.
8. **PDP commercial intent rate** = sessions with `affiliate_click / PDP sessions`.
9. **Owned audience conversion** = `newsletter_signup / eligible surface sessions` split by `fuente`.
10. **Experience health** = Core Web Vitals segmented by route/device; performance regressions should be evaluated alongside conversion.

## Guardrails

- Do not optimize affiliate CTR in isolation; it can rise while editorial trust falls.
- Quiz completion should be read together with result-to-PDP progression.
- Product/content relationships remain grounded in `perfumes_relacionados`; never inject unrelated inventory into Magazine.
- Similarity is deterministic and derived only from published catalog attributes. It does not change catalog ownership or source data.
- Search analytics records query length and result counts, not the user's raw query.
- Newsletter signup must remain contextual and never block content.
- Web Vitals are telemetry only; measurement must not add blocking scripts to rendering.
- Do not add analytics that sends email, free text, or other PII.
- Any consent/GDPR implementation remains a separate product/legal decision; this measurement layer does not resolve that decision.

## Recommended GA4 views

- Discovery funnel: `internal_search` / `quiz_started` → PDP → `similar_clicked` / `compare_started` → `affiliate_click`.
- Quiz funnel: `/quiz` → `quiz_started` → `quiz_completed` → `quiz_result_product_clicked` → PDP → `affiliate_click`.
- Editorial loop: article → `content_to_product` → PDP → `product_to_content`.
- Breakdown: `similar_clicked` by `source_slug`, `target_slug`, `position`, and score band.
- Breakdown: search result CTR by `context` and result-count band; do not collect raw terms.
- Performance: `web_vital` by `metric_name`, `metric_rating`, route and device category.

## Release gate

For web/product releases, preserve event names and parameter semantics unless this document is updated in the same PR. Analytics failure must never block navigation, affiliate exit, newsletter submission, quiz completion, article reading, search, comparison or rendering.
