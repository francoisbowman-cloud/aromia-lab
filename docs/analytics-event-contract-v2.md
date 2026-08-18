# Aromia Product Analytics Contract v2

Purpose: measure discovery and commercial journeys without collecting personal data or turning the interface into a tracking surface.

## Principles

- No email, free-text answer, name, IP address or other direct PII in custom event payloads.
- Prefer stable slugs, positions, stage names, counts and source surfaces.
- Events describe a user action, not an inferred identity.
- Analytics must never block navigation, rendering or purchase actions.
- Event names are stable API; rename only through an explicit migration.

## Canonical events

| Event | Trigger | Safe payload examples |
|---|---|---|
| `affiliate_click` | outbound retailer action | `perfume_slug`, `retailer`, `surface` |
| `newsletter_signup` | confirmed successful subscription | `fuente` only; never email |
| `quiz_started` | first answer | `total_questions` |
| `quiz_answered` | answer selection | `question_number`, `option` |
| `quiz_progress_reveal` | next question becomes available | counts only |
| `quiz_completed` | result computed | result profile slug + count |
| `perfumer_open` | author profile route/open | perfumer slug, optional source perfume/surface |
| `olfactory_note_open` | note route/search opened | normalized note label + stage/source |
| `olfactory_connection_click` | olfactory stage/relationship explored | stage/relationship only |
| `similar_perfume_click` | explainable similarity route selected | source/target slugs, position, score/reason count |
| `pdp_gallery_interaction` | PDP product media action | perfume slug + action |
| `intention_discovery` | user follows a discovery signal | signal type/value + position |
| `compare_started` | comparison initiated | source/target slugs |
| `discovery_profile_reset` | local discovery map cleared | no payload required |

## Governance

Any new event that includes free-form content or a user identifier is REVIEW/FAIL until privacy impact is proven. GA availability is progressive enhancement: `trackEvent` remains a no-op in SSR, local development without GA, or before gtag has loaded.
