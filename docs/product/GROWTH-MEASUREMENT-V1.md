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
| `quiz_started` | User commits to Discovery | `total_questions` |
| `quiz_answered` | Quiz progression | `question_number`, `option` |
| `quiz_completed` | Discovery produces a profile | `perfil`, `total_questions` |
| `affiliate_click` | Product intent becomes retailer exit | `retailer`, `perfume_slug`, `perfume_name`, optional price/currency |
| `newsletter_signup` | Visitor becomes owned audience | `fuente` |

No email address or other user-entered PII is sent to analytics events.

## KPI model

1. **Discovery start rate** = `quiz_started / quiz page_view`.
2. **Discovery completion rate** = `quiz_completed / quiz_started`.
3. **PDP commercial intent rate** = sessions with `affiliate_click / PDP sessions`.
4. **Owned audience conversion** = `newsletter_signup / eligible surface sessions` split by `fuente`.
5. **Editorial-to-product progression** = PDP page views preceded by Magazine/Home/Catalog discovery. This requires GA4 path exploration using `page_view`.
6. **Product-to-commerce progression** = `affiliate_click / PDP page_view`, segmented by perfume and retailer.

## Guardrails

- Do not optimize affiliate CTR in isolation; it can rise while editorial trust falls.
- Quiz completion should be read together with result-to-PDP progression.
- Newsletter signup must remain contextual and never block content.
- Do not add analytics that sends email, free text, or other PII.
- Any consent/GDPR implementation remains a separate product/legal decision; this measurement layer does not resolve that decision.

## Recommended GA4 views

- Funnel: `/quiz` page view → `quiz_started` → `quiz_completed` → `/quiz/resultado/*` → `/catalogo/*` → `affiliate_click`.
- Funnel: `/magazine` or article → `/catalogo/*` → `affiliate_click`.
- Breakdown: `affiliate_click` by `perfume_slug` and `retailer`.
- Breakdown: `newsletter_signup` by `fuente`.
- Drop-off: `quiz_answered` by `question_number`.

## Release gate

For web/product releases, preserve event names and parameter semantics unless this document is updated in the same PR. Analytics failure must never block navigation, checkout/affiliate exit, newsletter submission, or quiz completion.
