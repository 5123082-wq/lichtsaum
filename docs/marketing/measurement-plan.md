# Measurement Plan

Status: `Verified`; O10 resources and consent-aware GTM version 2 are published, production
consent/network checks pass and controlled server-confirmed inquiries completed
Last reviewed: 2026-09-25

Publication, GTM activation, advertiser verification and synthetic-QA timing follow
[`../architecture/publication-governance.md`](../architecture/publication-governance.md). The
technical/consent contracts remain binding; open execution choices are `Спросить у пользователя`.

<!-- AGENT_BRIEF:START -->
## Agent brief
- Owns: event semantics, allowlisted fields, consent, single Primary conversion and GTM mapping.
- Current: mini/full inquiry and configurator diagnostics implemented locally on 2026-09-25;
  new GTM tags/custom definitions are instructions only, not published. Historical production
  evidence below refers to the existing destination-scoped generate_lead setup.
- Open: approved release, GTM Preview/Tag Assistant and controlled production verification.
- Read full when: changing events, consent, identity, destinations or account/tag configuration.
<!-- AGENT_BRIEF:END -->

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

Status: `Verified` locally and in production on 2026-08-11

- `src/features/analytics/events.ts` is the single typed and runtime-allowlisted client adapter for
  lead-form events. It copies only event-specific fields into `dataLayer`; arbitrary payload keys
  are discarded.
- The current form queues `generate_lead` only after the normal or recovered server result confirms
  the same accepted `lead_id`. Invalid and failed submissions do not queue it.
- Modal forms now identify their surface as `mini_configurator_inquiry` or
  `full_configurator_inquiry`; the plain homepage keeps `main_inquiry`. All retain the same
  `awning_inquiry` business conversion.
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
  that loader only when `VERCEL_ENV=production`. Both production flags and container ID
  `GTM-TNW2DDMZ` are enabled on Vercel Production.
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
  verification remains an open owner question before campaign activation.
- Published GTM version 2 contains five tags, four custom-event triggers and six data-layer
  variables. GA4 maps only `form_id` and `lead_type`; the direct Ads action maps `lead_id` only as
  Transaction ID. Both Google base tags and Conversion Linker use consent-specific triggers and
  fire at most once per page.
- Chrome Tag Assistant against an isolated local noindex build verified: zero Google tags before
  consent; only `GA4 – Google tag` for Analytics-only; only `Ads – Google tag` and
  `Ads – Conversion Linker` for Marketing-only; one firing of each applicable base tag after Accept
  all; correct Consent Mode v2 updates; `ad_personalization` denied in every state; and GTM removed
  after full revoke. Production Playwright verification found zero Google requests before consent
  and GTM, GA4 and Ads requests after Accept all. Controlled server-confirmed inquiries, including
  a Private Blob attachment, completed after publication. GA4 DebugView, Ads Diagnostics and
  Transaction-ID deduplication remain monitoring evidence rather than launch blockers.
- The standard unconditional GTM/gtag installation snippets were not added to the site; the local
  consent boundary remains the only production loader.

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
| `configurator_start` | Первое изменение настройки за жизнь страницы; restore/render не считаются | `configurator_type` | Funnel | None |
| `configurator_step_view` | Начальный показ и реальные переходы полного конфигуратора | `configurator_type`, `step` | Funnel | None |
| `configurator_result_view` | Готовый server result при входе в шаг 3 | `configurator_type`, `step` | Funnel | None |
| `lead_form_open` | Каждое явное открытие диалога, включая повторное | `form_id`, `form_location` | Funnel | None |
| `lead_form_start` | Первое изменение поля/файла в текущем черновике формы | `form_id`, `form_location` | Funnel | None |
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

Implemented form/configurator enums (CTA/contact rows remain proposed):

| Parameter | Values |
| --- | --- |
| `cta_id` | `hero_request`, `nav_request`, `final_request`, `project_contact` |
| `cta_location` / `location` | `header`, `hero`, `benefits`, `references`, `final`, `footer` |
| `destination_type` | `form_anchor`, `contact_page`, `phone`, `email` |
| `form_id` | `main_inquiry`, `contact_inquiry`, `mini_configurator_inquiry`, `full_configurator_inquiry` |
| `form_location` | `landing`, `contact`, `mini_configurator`, `full_configurator` |
| `configurator_type` | `mini`, `full`; step/result events only `full` |
| `step` | Integers 1, 2, 3; result event only 3 |
| `lead_type` | `awning_inquiry` initially; expand only with real routing |
| `error_group` | `validation`, `rate_limited`, `integration`, `network`, `unknown` |

Different form IDs identify entry surfaces only; they never create a second Primary conversion.
`contact_inquiry` remains reserved; the contact page currently links to the homepage form.
Diagnostics require current Analytics consent and are never replayed after late consent. The
once-only markers advance even when an event is dropped. A new explicit modal opening is a new
action; React rerenders are not. Form start resets only on explicit new inquiry after success.

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
  | { name: "configurator_start"; configurator_type: "mini" | "full" }
  | { name: "configurator_step_view"; configurator_type: "full"; step: 1 | 2 | 3 }
  | { name: "configurator_result_view"; configurator_type: "full"; step: 3 }
  | { name: "lead_form_open"; form_id: FormId; form_location: FormLocation }
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
| Analytics accepted | Works | Allowlisted diagnostic/funnel events and sanitized `generate_lead` enter the published GA4 tag boundary | None unless Marketing is separately accepted |
| Marketing accepted | Works | None unless Analytics is separately accepted | Server-confirmed Ads `generate_lead` with Transaction ID enters the published direct Ads tag boundary |
| Revoked | Works | Future Analytics events stop immediately; known Analytics cookies are removed | Future conversion events stop immediately; known Marketing cookies are removed |

O9 selects Basic Consent Mode, the custom first-party manager and GA4 in v1. Necessary, Analytics
and Marketing are exposed with independent choices; External media remains inactive/hidden. The
form never depends on consent. Production enables the manager and published tags; deployments with
`NEXT_PUBLIC_CONSENT_UI_ENABLED=false` keep the boundary dormant.

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

## GTM implementation recipe — next approved release

Status: `Proposed` account configuration; code implemented locally. Do not publish as part of the
2026-09-25 implementation. Existing container/stream IDs are recorded above; use the same Google
tag and GA4 stream, never create another measurement path.

1. In GTM Variables, reuse/create Data Layer Variables (version 2, no default values):
   `DLV - form_id` → `form_id`; `DLV - form_location` → `form_location`;
   `DLV - configurator_type` → `configurator_type`; `DLV - step` → `step`;
   `DLV - error_group` → `error_group`; `DLV - error_count` → `error_count`.
   Reuse existing destination, lead_type and lead_id variables only in their existing lead tags.
2. For each row below create one Custom Event trigger named `CE - <event>`: Event name exactly
   the first column, **Use regex matching off**, All Custom Events. Create one GA4 Event tag named
   `GA4 - <event>`, event name exactly that column, existing Google tag/measurement ID. Attach only
   its matching trigger. Map only listed parameters (parameter name → same-name DLV). Do not use
   a shared all-fields parameter object: GTM data-layer values can persist from earlier events.
3. All eight diagnostic tags: Additional Consent Checks → Require additional consent →
   `analytics_storage`. Keep the existing consent-aware loader and Google tag; no All Pages
   diagnostic triggers, form-submit triggers, Custom HTML or direct gtag calls.

| Exact event / trigger suffix | GA4 parameters (same-name DLV) |
| --- | --- |
| `configurator_start` | `configurator_type` |
| `configurator_step_view` | `configurator_type`, `step` |
| `configurator_result_view` | `configurator_type`, `step` |
| `lead_form_open` | `form_id`, `form_location` |
| `lead_form_start` | `form_id`, `form_location` |
| `lead_submit_attempt` | `form_id` |
| `lead_form_validation_error` | `form_id`, `error_group`, `error_count` |
| `lead_submit_error` | `form_id`, `error_group` |

4. Keep both existing `generate_lead` tags separate: Analytics trigger requires
   `event = generate_lead` AND `destination = analytics`, maps only form_id/lead_type;
   direct Ads requires `event = generate_lead` AND `destination = ads`, maps lead_id only as
   **Transaction ID**. Neither should filter out the new form IDs. Preserve all existing consent
   requirements and the one Primary action. No diagnostic tag sends lead_id, price, value or currency.
5. GA4 Admin → Data display → Custom definitions: use existing predefined dimensions where
   available; reuse/create the missing **event-scoped dimensions** for
   `form_id`, `form_location`, `configurator_type`, `step`, `error_group`, `lead_type`; use these
   exact Event parameter names. If numeric error totals are needed, create event-scoped custom
   metric `error_count`, unit Standard. Never register lead_id/user input. No diagnostic event is
   a key event, no new Ads import. Keep generate_lead as the existing GA4 key event without Ads import.
6. Inspect Enhanced measurement → Form interactions. If enabled, disable that automatic form
   measurement in the approved release: use the typed lead_* events, avoiding duplicate automatic
   form_start/form_submit and ephemeral DOM form IDs in reports. Other enhanced measurement settings
   are outside this change.

### Tag Assistant acceptance scenarios

Use a controlled preview with delivery mocked or an explicitly approved synthetic production lead.
The local prototype validation path deliberately cannot generate a saved-lead conversion.

| Scenario | Expected events/tags |
| --- | --- |
| Reject all, then change mini/open/type/submit | Form works; no diagnostic or conversion records/tags |
| Marketing only | Diagnostics absent; accepted lead has Ads generate_lead only, correct Transaction ID |
| Analytics only | Diagnostic GA4 tags fire once per action; accepted lead has sanitized GA4 generate_lead only |
| Both categories | Same diagnostics; one event per lead per destination; lead_id absent from every GA4 request |
| Full load → edits → 2 → 3 | step_view 1, one start, step_view 2, step_view 3, result_view 3; renders add nothing |
| Mini edit → modal → fields → close → reopen | one start; open, form_start, open; contact/file draft preserved |
| Late consent after initial edit | No replay of start/initial step; only future explicit actions are measured |
| Empty submit | attempt + validation_error; zero generate_lead |
| Price changed | attempt; zero lead until new price explicitly confirmed and submission accepted |
| Upload/network failure | attempt + submit_error if unrecovered; no lead conversion for unaccepted request |
| Double click / accepted response lost / reopen success | One accepted lead, at most one generate_lead per destination |

In Tag Assistant inspect consent state, each event's Variables and Tags fired/not fired. In GA4
DebugView verify controlled form IDs/type/steps; inspect network payloads for absence of inscription,
dimensions, colours, price, email, phone, message, filenames and lead_id. The operational request
payload legitimately contains the user-submitted context; it must not be copied to the data layer.
Publication and an external end-to-end synthetic submission require a separate approved release.

Implementation references checked 2026-09-25:
[Custom Event trigger](https://support.google.com/tagmanager/answer/7679219?hl=en),
[GA4 Event tags](https://support.google.com/tagmanager/answer/13034206?hl=en),
[event-scoped custom dimensions](https://support.google.com/analytics/answer/14239696?hl=en),
[data layer](https://developers.google.com/tag-platform/tag-manager/datalayer).

## Official references

- [GA4 recommended event: generate_lead](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [Google Ads transaction ID deduplication](https://support.google.com/google-ads/answer/6386790?hl=en)
- [Google Analytics PII policy](https://support.google.com/analytics/answer/6366371?hl=en)
- [Consent Mode for websites and apps](https://support.google.com/google-ads/answer/13695607?hl=en)
- [Google Tag Manager consent support](https://support.google.com/tagmanager/answer/10718549?hl=en)
- [Google Ads enhanced conversions](https://support.google.com/google-ads/answer/15712870?hl=en-0)
