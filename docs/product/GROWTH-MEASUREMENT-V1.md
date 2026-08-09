# Aromia — Product Growth Measurement v1

## Scope

This document belongs to the web/product track. Catalog expansion and Fase 3 remain out of scope.

## North-star journey

Aromia is not optimized for raw pageviews. The primary journey is:

`discovery → understanding → product intent → commercial exit / owned audience`

A healthy session should increasingly move through one or more of these stages without making the editorial experience feel like an aggressive store.

## Core events

| Event | Meaning | Primary dimensions |
|---|---|---|
| `page_view` | Route/surface viewed | `page_path`, `page_title` |
| `web_vital` | Real-user performance signal | `metric_name`, `metric_value`, `metric_rating`, `navigation_type` |
| `quiz_started` | User commits to Discovery | `total_questions` |
| `quiz_answered` | Quiz progression | `question_number`, `option` |
| `quiz_completed` | Discovery produces a profile | `perfil`, `total_questions` |
| `editorial_reader_open` | Reader activates immersive article reading | `article_slug`, `category`, `reading_minutes` |
| `editorial_product_click` | Magazine context creates PDP intent | `article_slug`, `perfume_slug`, `position` |
| `affiliate_click` | Product intent becomes retailer exit | `retailer`, `perfume_slug`, `offer_type`, `offer_position`, `offer_count`, optional price/currency |
| `newsletter_signup` | Visitor becomes owned audience | `fuente` |

No email address or other user-entered PII is sent to analytics events.

## KPI model

1. **Discovery start rate** = `quiz_started / quiz page_view`.
2. **Discovery completion rate** = `quiz_completed / quiz_started`.
3. **Editorial engagement rate** = `editorial_reader_open / article page_view`.
4. **Editorial-to-product rate** = `editorial_product_click / article page_view`.
5. **PDP commercial intent rate** = sessions with `affiliate_click / PDP sessions`.
6. **Owned audience conversion** = `newsletter_signup / eligible surface sessions` split by `fuente`.
7. **Product-to-commerce progression** = `affiliate_click / PDP page_view`, segmented by perfume, retailer and offer position.
8. **Experience health** = Core Web Vitals segmented by route/device; performance regressions should be evaluated alongside conversion, not after it.

## Guardrails

- Do not optimize affiliate CTR in isolation; it can rise while editorial trust falls.
- Quiz completion should be read together with result-to-PDP progression.
- Editorial product links must remain contextual to the article's `perfumes_relacionados` data; never inject unrelated commercial inventory.
- Newsletter signup must remain contextual and never block content.
- Web Vitals are telemetry only; measurement must not add blocking scripts to rendering.
- Do not add analytics that sends email, free text, or other PII.
- Any consent/GDPR implementation remains a separate product/legal decision; this measurement layer does not resolve that decision.

## Recommended GA4 views

- Funnel: `/quiz` page view → `quiz_started` → `quiz_completed` → `/quiz/resultado/*` → `/catalogo/*` → `affiliate_click`.
- Funnel: article page view → `editorial_reader_open` → `editorial_product_click` → PDP page view → `affiliate_click`.
- Breakdown: `editorial_product_click` by `article_slug`, `perfume_slug`, and `position`.
- Breakdown: `affiliate_click` by `perfume_slug`, `retailer`, `offer_position`, and `offer_count`.
- Performance: `web_vital` by `metric_name`, `metric_rating`, route and device category.
- Breakdown: `newsletter_signup` by `fuente`.
- Drop-off: `quiz_answered` by `question_number`.

## Release gate

For web/product releases, preserve event names and parameter semantics unless this document is updated in the same PR. Analytics failure must never block navigation, affiliate exit, newsletter submission, quiz completion, article reading, or rendering.
