# Measurement Plan

Status: `Decision`; O10 resources and the consent-aware GTM workspace are configured and the base
Tag Assistant matrix passes, while the container remains unpublished/disconnected and synthetic
server-confirmed conversion QA is still open
Last reviewed: 2026-08-11

Publication, GTM activation, advertiser verification and synthetic-QA timing follow
[`../architecture/publication-governance.md`](../architecture/publication-governance.md). The
technical/consent contracts remain binding; open execution choices are `Спросить у пользователя`.

## Measurement objective

Измерять путь к реальной заявке и качество рекламного трафика без превращения каждого клика в
«конверсию» и без передачи PII в Google Analytics/Tag Manager.

## Source of truth

После scaffold типы событий живут в `src/features/analytics/events.ts`. Этот документ владеет
семантикой событий. GTM/GA4/Ads конфигурация реализует её, но не вводит собственные имена или
условия.

The shared form variants, optional configurator/calculator request context and manager-notification
contract are owned by
[`../architecture/unified-lead-form-contract.md`](../architecture/unified-lead-form-contract.md).
Adding a form surface does not by itself create another Primary conversion action.

## Current implementation boundary

Status: `Verified` locally on 2026-08-11

- `src/features/analytics/events.ts` is the single typed and runtime-allowlisted client adapter for
  lead-form events. It copies only event-specific fields into `dataLayer`; arbitrary payload keys
  are discarded.
- The current form queues `generate_lead` only after the normal or recovered server result confirms
  the same accepted `lead_id`. Invalid and failed submissions do not queue it.
- The `/konfigurator` form remains the same `main_inquiry` / `awning_inquiry` business conversion.
  Its inscription, dimensions, colours, PLZ, services, panel allocation, filenames and net result
  are request context only and never become analytics or Ads parameters.
- The adapter uses destination-scoped `generate_lead` records. The Analytics record contains only
  `form_id` and `lead_type`; the Ads record additionally contains the random server-created
  `lead_id`. Each destination is queued only with its matching current consent. Events denied at
  the time they occur are not held for later replay after a visitor changes consent.
- Duplicate emission for the same `lead_id` is suppressed for the current page lifetime by memory
  and the already queued `dataLayer` entry. No cookie, `localStorage` or `sessionStorage` is used.
- The custom first-party consent manager stores one versioned 180-day choice cookie when enabled.
  A local fail-closed Consent Mode v2/GTM loader now exists behind both
  `NEXT_PUBLIC_GOOGLE_TAGS_ENABLED` and `NEXT_PUBLIC_GTM_CONTAINER_ID`, and application code permits
  that loader only when `VERCEL_ENV=production`. Both production flags remain absent/disabled, so
  no GTM container, GA4 destination or Google Ads destination is currently loaded and the current
  public behavior creates no Google network request.
- O10 selects a direct Google Ads tag as the only Primary conversion source. The server-created
  `lead_id` is used only as the Ads Transaction ID. GA4 receives a separate sanitized
  `generate_lead` without `lead_id`, and that GA4 event must not be imported into Google Ads.
- The owner-authorized Google session now contains GTM account `LICHTSAUM`, web container
  `www.lichtsaum.com` (`GTM-TNW2DDMZ`), GA4 account `LICHTSAUM`, property `LICHTSAUM Website` and
  web stream `Lichtsaum` for `https://www.lichtsaum.com` (`G-DHZHKSXMVT`, stream ID
  `15416188839`). The four optional GA account data-sharing choices are off, Enhanced Measurement
  retains only page views, retention is two months, Google Signals/user-provided data and detailed
  location/device collection are off, advertising personalization is denied in all regions, and
  the active `Developer Traffic` filter excludes debug events.
- Google Ads account `LICHTSAUM` (`363-818-4039`) now exists with Germany, Europe/Berlin and EUR.
  It contains exactly one enabled Primary website action, `Projektanfrage – serverbestätigt`
  (conversion ID `18383141630`, label `oUIGCLrozN8cEP714b1E`), category Submit lead form,
  Count = One and value 0 EUR. GA4 import and Enhanced Conversions are off. Advertiser identity
  verification remains an open owner question before Ads publication.
- The unpublished GTM workspace contains five tags, four custom-event triggers and six data-layer
  variables. GA4 maps only `form_id` and `lead_type`; the direct Ads action maps `lead_id` only as
  Transaction ID. Both Google base tags and Conversion Linker use consent-specific triggers and
  fire at most once per page.
- Chrome Tag Assistant against an isolated local noindex build verified: zero Google tags before
  consent; only `GA4 – Google tag` for Analytics-only; only `Ads – Google tag` and
  `Ads – Conversion Linker` for Marketing-only; one firing of each applicable base tag after Accept
  all; correct Consent Mode v2 updates; `ad_personalization` denied in every state; and GTM removed
  after full revoke. No real or synthetic lead was submitted, so end-to-end GA4/Ads
  `generate_lead`, Transaction-ID deduplication, DebugView and Ads Diagnostics remain release QA.
- The standard GTM/gtag installation snippets were not added to the site. Production flags remain
  disabled and the GTM container remains unpublished.

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
| `generate_lead` | Только подтверждённый server success | Analytics: `form_id`, `lead_type`; Ads: `form_id`, `lead_type`, `lead_id` | Key event; never imported to Ads | Direct tag; the only Primary conversion source |
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

The implemented `/konfigurator` surface deliberately reuses `main_inquiry`; a different
`calculator_inquiry` enum is not introduced merely because the visible form has more context. A new
form enum still requires a separately justified diagnostic/operational need and never creates a
second Primary conversion by itself.

Never send:

- name, email, phone, postal/exact address;
- free-form request/message;
- uploaded file name/content;
- consent proof identifiers tied to a person;
- raw CRM/customer IDs;
- DOM text that may contain user input;
- full URL/query string if it can contain PII.

`lead_id` is an application/Ads deduplication field, not a person identifier or GA4 `user_id`.
The approved direct-Ads design maps it only to the Google Ads Transaction ID field. Do not register
it as a GA4 custom dimension or forward it to a GA4 event tag by accident; any different account
mapping requires an explicit measurement/privacy decision.

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
- The client keeps a high-entropy idempotency key/upload token pair in memory for one canonical
  same-page submission payload. The persistence layer's unique idempotency key recovers the same
  upload plan or accepted `lead_id`; changed payload cannot reuse it.
- The success response and event reuse the same `lead_id`.
- The current client suppresses accidental repeat emission in memory and against the queued
  `dataLayer` event. It does not persist contact-derived fingerprints or retry credentials in a
  cookie, `localStorage` or `sessionStorage`; same-page application idempotency and Ads Transaction
  ID deduplication remain authoritative for this flow.
- If both browser and future offline conversions are enabled, the conversion owner documents
  which identifier and time window deduplicate them.

## Consent behavior

| State | Functional form | Analytics events | Ads conversion |
| --- | --- | --- | --- |
| No choice/default | Works | None; Basic mode blocks tag/event | None; Basic mode blocks tag/event |
| Necessary only / reject | Works | None; known Analytics cookies removed where accessible | None; known Marketing cookies removed where accessible |
| Analytics accepted | Works | Allowlisted diagnostic/funnel events and sanitized `generate_lead` may enter `dataLayer`; GA4 still requires external resource setup | None unless Marketing is separately accepted |
| Marketing accepted | Works | None unless Analytics is separately accepted | Server-confirmed Ads `generate_lead` with Transaction ID may enter `dataLayer`; Ads still requires external resource setup |
| Revoked | Works | Future Analytics events stop immediately; known Analytics cookies are removed | Future conversion events stop immediately; known Marketing cookies are removed |

O9 selects Basic Consent Mode, the custom first-party manager and GA4 in v1. Necessary, Analytics
and Marketing are exposed with independent choices; External media remains inactive/hidden. The
form never depends on consent. The manager stays dormant through
`NEXT_PUBLIC_CONSENT_UI_ENABLED=false` until a real optional Analytics or Marketing tag is
configured and legally cleared.

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
- stale/invalid configurator calculation → zero lead conversions and no persisted lead until the
  visitor confirms the server-updated pricing version;
- double click/same-page retry/recovered success → one accepted lead conversion;
- reject all → form works and consent behavior is respected;
- Analytics-only consent;
- Marketing-only consent;
- accept all;
- revoke after acceptance;
- UTM/GCLID URL → no PII, canonical unaffected, form works;
- direct/organic session → same functional outcome;
- configurator success payload → only allowlisted `form_id`, `lead_type` and destination-specific
  random `lead_id`; zero configuration, PLZ, service, filename or price values;
- debug/test traffic excluded from production reporting where configured.

Validate with browser network inspection, GTM Preview/Tag Assistant, GA4 DebugView, Ads conversion
diagnostics and persistence evidence. Never paste real lead data into screenshots or tickets.

## Approved settings and remaining inputs

- Existing owner-controlled Google account: approved owner for GTM, GA4 and Google Ads; its email
  and credentials are not stored in the repository.
- Google Ads: Germany, EUR and Europe/Berlin; direct website conversion is the only Primary action,
  Count = One and no invented monetary value.
- GA4: Europe/Berlin, EUR, two-month retention, Google Signals/user-provided data/advertising
  personalization disabled and only page views retained from Enhanced Measurement.
- `ad_personalization` always remains `denied`. Enhanced Conversions, offline uploads, Customer
  Match and remarketing remain disabled.
- Verified on 2026-08-11: the approved GA4 privacy baseline and two-month retention; the Ads account
  and its single direct Primary action; no GA4 import; Enhanced Conversions off.
- Open evidence/questions: advertiser identity verification, an owner-controlled test email alias,
  the business definition of a qualified lead, and the synthetic accepted/recovered/failure matrix
  with DebugView/Ads Diagnostics. The owner accepted the documented residual legal risk without an
  external legal opinion on 2026-08-11. The previous deferral is cancelled; use
  `Спросить у пользователя` before performing verification, using an alias, publishing tags or
  activating Ads.

## Official references

- [GA4 recommended event: generate_lead](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [Google Ads transaction ID deduplication](https://support.google.com/google-ads/answer/6386790?hl=en)
- [Google Analytics PII policy](https://support.google.com/analytics/answer/6366371?hl=en)
- [Consent Mode for websites and apps](https://support.google.com/google-ads/answer/13695607?hl=en)
- [Google Tag Manager consent support](https://support.google.com/tagmanager/answer/10718549?hl=en)
- [Google Ads enhanced conversions](https://support.google.com/google-ads/answer/15712870?hl=en-0)
