# Measurement Plan

Status: `Decision` for the event contract; IDs, vendors and targets are `TBD`  
Last reviewed: 2026-07-30

## Measurement objective

Измерять путь к реальной заявке и качество рекламного трафика без превращения каждого клика в
«конверсию» и без передачи PII в Google Analytics/Tag Manager.

## Source of truth

После scaffold типы событий живут в `src/features/analytics/events.ts`. Этот документ владеет
семантикой событий. GTM/GA4/Ads конфигурация реализует её, но не вводит собственные имена или
условия.

## Primary business conversion

`generate_lead` означает:

1. сервер получил запрос;
2. данные прошли server-side validation и abuse checks;
3. CRM/persistence надёжно приняла запись;
4. сервер вернул случайный неперсональный `lead_id`;
5. клиент отправил событие не более одного раза для этого принятого результата.

Не являются `generate_lead`: button click, valid-looking client form, request start, thank-you page
view, email/phone click или неуспешная запись в CRM.

## Event contract

| Event | Trigger | Allowed parameters | GA4 role | Ads role |
| --- | --- | --- | --- | --- |
| `cta_click` | Пользователь активировал CTA | `cta_id`, `cta_location`, `destination_type` | Diagnostic | None |
| `lead_form_start` | Первое осмысленное взаимодействие с формой | `form_id`, `form_location` | Funnel | None |
| `lead_form_validation_error` | Submit отклонён валидацией | `form_id`, `error_group`, `error_count` | UX diagnostic | None |
| `lead_submit_attempt` | Серверный submit начат | `form_id` | Funnel | None |
| `generate_lead` | Только подтверждённый server success | `form_id`, `lead_id`, `lead_type` | Key event | One primary conversion source |
| `lead_submit_error` | Технический отказ после submit | `form_id`, `error_group` | Reliability | None |
| `contact_link_click` | Click-to-call или mail link | `contact_type`, `location` | Secondary | Secondary only if deliberately configured |
| `consent_update` | Пользователь изменил категории | category booleans, `policy_version` | CMP/debug only | Never a conversion |

`page_view`, session and traffic-source behavior должны использовать стандартные Google
механизмы, а не дублирующие custom events.

## Parameter rules

Allowed values are short controlled enums, not visible copy or arbitrary DOM text.

Proposed enums:

| Parameter | Values |
| --- | --- |
| `cta_id` | `hero_request`, `nav_request`, `final_request`, `project_contact` |
| `cta_location` / `location` | `header`, `hero`, `benefits`, `references`, `final`, `footer` |
| `destination_type` | `form_anchor`, `contact_page`, `phone`, `email` |
| `form_id` | `main_inquiry`, `contact_inquiry` |
| `form_location` | `landing`, `contact` |
| `lead_type` | `awning_inquiry` initially; expand only with real routing |
| `error_group` | `validation`, `rate_limited`, `integration`, `network`, `unknown` |

Never send:

- name, email, phone, postal/exact address;
- free-form request/message;
- uploaded file name/content;
- consent proof identifiers tied to a person;
- raw CRM/customer IDs;
- DOM text that may contain user input;
- full URL/query string if it can contain PII.

## Typed client boundary

Application code emits events through one adapter. Components may not call `gtag` or
`dataLayer.push` directly.

Conceptual contract:

```ts
type AnalyticsEvent =
  | { name: "cta_click"; cta_id: CtaId; cta_location: Location; destination_type: Destination }
  | { name: "lead_form_start"; form_id: FormId; form_location: FormLocation }
  | { name: "lead_form_validation_error"; form_id: FormId; error_group: "validation"; error_count: number }
  | { name: "lead_submit_attempt"; form_id: FormId }
  | { name: "generate_lead"; form_id: FormId; lead_id: string; lead_type: LeadType }
  | { name: "lead_submit_error"; form_id: FormId; error_group: ErrorGroup };
```

Actual code must add runtime allowlisting and must not accept an open
`Record<string, unknown>` escape hatch.

## Deduplication and identity

- Server creates `lead_id`; client never derives it from email/phone.
- The persistence layer enforces idempotency for the accepted request where feasible.
- The success response and event reuse the same `lead_id`.
- Browser session storage may suppress an accidental repeat emission, but server/application
  idempotency remains authoritative.
- If both browser and future offline conversions are enabled, the conversion owner documents
  which identifier and time window deduplicate them.

## Consent behavior

| State | Functional form | Analytics events | Ads conversion |
| --- | --- | --- | --- |
| No choice/default | Works | According to approved Basic/Advanced implementation | According to approved implementation |
| Necessary only / reject | Works | No analytics storage; behavior matches selected mode | No disallowed advertising processing |
| Analytics accepted | Works | GA4 events allowed | No marketing signals unless separately accepted |
| Marketing accepted | Works | According to chosen categories | Allowed according to configured signals |
| Revoked | Works | Future behavior updated immediately | Future behavior updated immediately |

The exact Basic/Advanced implementation remains `TBD` and must match legal documentation.

## Attribution readiness

Allowed campaign attribution is stored only after purpose, consent and retention are approved.
Architecture should tolerate:

- UTM campaign fields;
- `gclid`, `gbraid`, `wbraid`;
- landing path;
- consent snapshot/version;
- non-personal `lead_id`;
- later lead-quality stages.

Do not expose identifiers in confirmation URLs. Offline conversion upload is out of v1 until
ownership, retention, data mapping and Google configuration are approved.

## Reporting model

Initial funnel:

1. eligible landing sessions;
2. primary CTA engagement;
3. form starts;
4. validation outcomes;
5. server-confirmed leads;
6. later qualified/sales stages when CRM ownership exists.

Rates, targets, attribution model and lead-quality definition are `TBD`; do not invent benchmark
numbers.

## QA matrix

Test at minimum:

- accepted lead → one `generate_lead`;
- invalid form → validation event, zero lead conversions;
- CRM/persistence failure → error event, zero lead conversions;
- double click/retry/refresh → one accepted lead conversion;
- reject all → form works and consent behavior is respected;
- partial analytics-only consent;
- partial marketing-only consent if CMP permits it;
- accept all;
- revoke after acceptance;
- UTM/GCLID URL → no PII, canonical unaffected, form works;
- direct/organic session → same functional outcome;
- debug/test traffic excluded from production reporting where configured.

Validate with browser network inspection, GTM Preview/Tag Assistant, GA4 DebugView, Ads conversion
diagnostics and persistence evidence. Never paste real lead data into screenshots or tickets.

## Ownership still required

- Analytics/Ads account owner.
- GTM container and environment strategy.
- CMP and Basic/Advanced Consent Mode decision.
- Primary Ads conversion source.
- Internal/test traffic policy.
- Retention and CRM lifecycle.
- Business definition of qualified lead.

## Official references

- [GA4 recommended event: generate_lead](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [Google Analytics PII policy](https://support.google.com/analytics/answer/6366371?hl=en)
- [Consent Mode for websites and apps](https://support.google.com/google-ads/answer/13695607?hl=en)
- [Google Tag Manager consent support](https://support.google.com/tagmanager/answer/10718549?hl=en)
- [Google Ads enhanced conversions](https://support.google.com/google-ads/answer/15712870?hl=en-0)

