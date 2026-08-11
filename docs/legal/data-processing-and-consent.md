# Data Processing and Consent

Status: `Decision`; O8 retention/access, O9 consent policy and O10 measurement model approved;
the owner accepts release risk without an external legal opinion; unresolved technical and
processor facts are `Спросить у пользователя`
Last reviewed: 2026-08-11

This document reports legal/privacy facts and is not an autonomous publication authority. Before a
related public change, show the applicable facts and use `Спросить у пользователя` under
[`../architecture/publication-governance.md`](../architecture/publication-governance.md). Runtime
consent and PII protections still apply where legally required.

Этот файл — источник истины для planned/actual data flows. Обновлять до подключения каждого
vendor.

## Data inventory

| Processing | Data | Purpose | Basis/status | Consent category | Processor | Retention |
| --- | --- | --- | --- | --- | --- | --- |
| Server/security logs | IP, time, request metadata; no form body logged by the application | Delivery, abuse/security | Art. 6(1)(f), legitimate security and delivery interest | Necessary | Vercel Inc.; current Hobby runtime-log access is 1 hour | 1 hour for runtime logs; build/deployment records follow Vercel account retention |
| Direct email/phone contact | Contact data and request content | Respond/pre-contract steps | Art. 6(1)(b) or (f), case-dependent | Not marketing consent | Cloudflare, Inc. Email Routing; Google Ireland Limited Gmail; telecom provider | Owner-managed; delete when no longer required for the request, subject to active matters, legal claims and applicable statutory duties |
| Disabled-environment form validation | Email; optional phone, message and selected files | Validate format/size rules without accepting a lead | Used whenever lead feature flags are off | Necessary prototype function | Application runtime only | No persistent storage |
| Configurator draft and calculation | Inscription, dimensions, design and color choices; no contact, PLZ or files | Preserve the draft for the browser session and reproduce font metrics, geometry and the preliminary price on the application server | `sessionStorage` starts only after interaction; each live calculation is transient, allowlisted, not persisted and not logged by the application | Necessary requested configurator function | Browser and existing Vercel application runtime; no analytics/lead/notification processor | Browser session for the draft; request-lifetime only for server calculation |
| Attached configurator request context | Versioned configuration, requested services, optional five-digit project PLZ and a server-reproduced preliminary calculation; values include the user-entered inscription | Send the visitor's visible project context with an explicitly submitted inquiry | Implemented locally; no lead record, manager/customer notification or conversion occurs before explicit form submit | Necessary inquiry function; no marketing consent | Existing Neon/Resend lead processors only; no analytics destination | Neon copy deleted with the lead under the approved 90-day deadline; operational manager/customer mailbox copies remain under the existing owner-managed purpose/statutory deletion rule |
| Enabled lead request | Contact, request details and optional file metadata | Respond/pre-contract steps | Implemented and live-tested locally; owner accepts proceeding without an external legal opinion, but processor onboarding remains open | Not marketing consent | Neon PostgreSQL (`eu-central-1`), onboarding/DPA review pending | 90 days approved by owner decision O8 |
| Enabled lead files | Up to five JPG/PNG/WebP/PDF files, 15 MB each and 50 MB combined | Object-specific project review | Implemented and live-tested; prepared code has an independent attachment flag; the former mandatory disabled launch baseline is superseded and the concrete value is `Спросить у пользователя` | Necessary form function when enabled | Private Vercel Blob (`fra1`), onboarding/DPA review pending | 90 days approved by owner decision O8 |
| Lead notification and receipt | Internal contact/request notification with signed file links; customer receipt with email address, public request number and, for configurator inquiries, the submitted configuration/services/server-confirmed net summary; customer receipt never includes message text or files | Operational response and confirmation of receipt | Internal notification delivery-tested; customer receipt implemented, production delivery test pending | Not marketing consent | Plus Five Five, Inc. (Resend), sending region `eu-west-1`; Cloudflare, Inc.; Google Ireland Limited | No automated mailbox deletion; owner-managed deletion when the operational purpose ends, subject to active matters, legal claims and applicable statutory duties. Resend processes while the agreement is active and states deletion within 90 days after account termination |
| First-party consent manager | Policy version, decision time, fixed Necessary/External-media states and independent Analytics/Marketing choices; no contact/form data | Remember and respect the browser's choice | Implemented locally; no external opinion on the sufficiency of browser-local evidence will be obtained for v1, by owner risk acceptance | Necessary | None; same-site application and browser | 180 days or until the policy version changes |
| GA4 | Pseudonymous website-usage and funnel events; no form/contact content, filenames or `lead_id` | Usage and funnel analytics | Property/stream, privacy baseline and unpublished consent-aware GTM tag configured; runtime requires explicit Analytics consent; production activation is `Спросить у пользователя` | Analytics | Google only after activation | Two months, verified in GA4 on 2026-08-11 |
| Google Ads | Server-confirmed conversion event with random non-personal `lead_id` used only as Transaction ID | Direct conversion measurement | Account, sole Primary action and unpublished consent-aware GTM tags configured; runtime requires explicit Marketing consent; production activation is `Спросить у пользователя` | Marketing | Google only after activation | Account policy/settings verified on 2026-08-11; advertiser identity verification is `Спросить у пользователя` |
| Enhanced Conversions | Hashed first-party data | Ads matching/measurement | Disabled by O10; not part of v1 | Marketing/ad user data | Google | Not applicable while disabled |
| Local fonts | Font files | Rendering | No external request | Necessary | Hosting | Cache policy |

The current code includes a custom first-party consent manager and a dormant fail-closed GTM loader.
GTM, GA4 and direct Google Ads resources now exist in an unpublished workspace, but their production
environment flags remain disabled. No Enhanced Conversions, CRM, chat, AI service or external-media
embed exists. Neon, Private Vercel Blob and Resend are active only in explicitly enabled
environments; production contact intake defaults fail-closed through
`LEAD_INTAKE_ENABLED=false`, and file intake has the additional dependent
`LEAD_ATTACHMENTS_ENABLED` control, also false when absent. These are code defaults, not publication
decisions; values and unresolved factual/security questions are `Спросить у пользователя`.

## Resolved release facts

- The confirmed provider designation is centralized in `siteConfig` and shown in the Impressum.
- The public privacy page now describes the confirmed Basic Consent Mode, the 180-day consent
  cookie, standard GA4 cookies with a maximum two-year lifetime, two-month GA4 user/event
  retention and Conversion Linker cookies with a maximum 90-day lifetime. These disclosures do not
  activate the dormant tags; final production network/cookie capture remains required.
- The current product site contains no journalistic-editorial section. Reassess before adding a
  blog, news or comparable editorial publication.
- No analytics, advertising or external-media vendor technology is active in the current runtime.
  The local first-party manager stores a choice and the dormant loader can load a container only if
  both are explicitly enabled with a real optional technology. Adding a vendor reopens the
  data-flow and disclosure review.
- The mini-configurator starts browser-local session storage only after user interaction.
- The full configurator stores only its design draft in `sessionStorage`. Optional PLZ, contact data
  and selected files remain outside browser storage. Raw design values are transiently sent to the
  application server only to reproduce the requested live calculation; this does not create a lead,
  notification or conversion. PLZ/contact/files are transmitted only by explicit shared-form
  submit.
- The application performs no solely automated decision-making or profiling under Art. 22 DSGVO.
- The public privacy page contains a separate Art. 21 DSGVO objection notice and contact route.
- The owner confirmed there is no separately appointed data-protection officer; the responsible
  company is the privacy contact shown on the page.
- File selection includes a concise instruction to upload only project-related files the sender is
  permitted to provide. This does not replace access control, security or deletion duties after
  receipt.
- Current processors and routing providers are identified by legal entity: Vercel Inc., Neon, LLC,
  Plus Five Five, Inc. (Resend), Cloudflare, Inc. and Google Ireland Limited. Resend and Cloudflare
  incorporate DPAs and EU SCC mechanisms into their service terms; Neon publishes a DPA and
  subprocessor register. Vercel's published DPA currently states that processor coverage applies to
  Pro and Enterprise, not the project's current Hobby plan. On 2026-08-11 the owner chose to retain
  Hobby and accepted this known risk; it must remain labelled `Owner-accepted risk`, not verified
  processor coverage or independent legal approval.
- Current Vercel Hobby runtime logs are retained for one hour. The application does not log request
  bodies, contact fields, tokens or uploaded content.
- Owner decision O8 is closed: lead records and private files have a 90-day automated retention
  deadline, and signed file links expire after seven days. The operational mailbox has no automatic
  deletion rule; the owner controls access and deletes messages when their purpose ends, subject to
  active matters, legal claims and applicable statutory duties. The owner is accountable for
  deletion. On 2026-08-11 the owner explicitly chose to proceed without an external legal opinion
  and accepted the documented residual legal risk. This is an internal owner decision, not proof
  of compliance and not a waiver of unresolved processor, malware or security facts. No CRM exists
  in the current flow.
- Owner decision O9 is closed: v1 uses the repository's custom first-party manager, Basic Consent
  Mode and consent-dependent GA4. Necessary, Analytics and Marketing are exposed with independent
  optional choices; External media remains inactive. No external CMP processor or CMP budget is
  required for v1.
- Owner decision O10 is recorded: the existing owner-controlled Google account owns the future
  GTM, GA4 and Google Ads resources. Direct Google Ads is the only Primary lead conversion; GA4
  receives a separate sanitized `generate_lead` without `lead_id` and is not imported to Ads. GA4
  retention is two months. Enhanced Conversions, offline uploads, Customer Match, remarketing,
  Google Signals, user-provided data and advertising personalization remain disabled. GTM and GA4
  resources were created on 2026-08-11, with all optional GA account data sharing off, only page
  views retained in Enhanced Measurement and the remaining approved GA privacy baseline verified.
  Google Ads account `LICHTSAUM` and its sole direct Primary action `Projektanfrage –
  serverbestätigt` were configured with Count = One, value 0 EUR, no GA4 import and Enhanced
  Conversions off. The unpublished GTM workspace implements independent Analytics/Marketing
  triggers and destination-scoped lead tags. Chrome Tag Assistant verified the real base-tag
  consent matrix and full revoke on an isolated local noindex build without submitting a lead.
  Advertiser identity verification remains with the owner. Standard installation snippets were not
  added and production flags/container publication remain disabled, so no Google vendor request is
  active on the public site.
- The former O7 mandatory `LEAD_ATTACHMENTS_ENABLED=false` publication baseline is superseded.
  Vercel Hobby and malware/processor risks remain documented; ask the user for concrete intake and
  attachment values.
- The previous Search Console/DNS, advertiser-verification and controlled-alias QA deferrals are
  cancelled. Each concrete action is `Спросить у пользователя`.

Do not mark a `TBD` lawful basis as final legal advice.

## Consent model

V1 categories:

- Necessary — requested site/form/security functionality.
- Analytics — future GA4 usage and funnel measurement; optional and off until explicit consent.
- Marketing — the future direct Google Ads conversion; optional and off until explicit consent.

Inactive future categories:

- External media — hidden until a map/video/review embed actually requires it.

Required Consent Mode v2 signals:

| Signal | Meaning | Default before choice |
| --- | --- | --- |
| `analytics_storage` | Analytics storage | `denied` |
| `ad_storage` | Advertising storage | `denied` |
| `ad_user_data` | Sending user data for advertising | `denied` |
| `ad_personalization` | Personalized advertising | `denied` |

O9 selects Basic Consent Mode. Before explicit Analytics or Marketing consent, the corresponding
Google tag or request may not load; no cookieless analytics or advertising ping is sent. Consent
Mode v2 commands are added only together with the future authorized Google tag configuration, with
all four signals denied before that configuration can run.

After a choice, Analytics may grant only `analytics_storage`. Marketing may grant `ad_storage` and
`ad_user_data`. These purposes remain independent, and `ad_personalization` stays `denied` in every
state, including Accept all.

## Consent lifecycle

1. Keep the manager dormant while no optional technology exists. `Implemented`.
2. Display accessible German consent UI when optional Analytics or Marketing technology is
   configured.
   `Implemented behind an explicit environment flag`.
3. Store choice, decision time and consent-policy version in one first-party cookie for 180 days.
   `Implemented`.
4. Offer a persistent settings/revocation control and remove the corresponding known Analytics or
   Marketing cookies on category rejection/revocation. `Implemented`.
5. Re-prompt after a policy-version change. `Implemented`.
6. Keep application analytics/conversion events out of `dataLayer` unless the matching active
   category is allowed. `Implemented`.
7. Set denied defaults before authorized tags and apply same-page updates. `Verified with the real
   unpublished container in Chrome Tag Assistant`.
8. Verify real Google tag behavior with Reject/default, partial choices, Accept and revoke.
   `Verified locally with Chrome Tag Assistant; production diagnostics and synthetic lead payload
   QA remain open evidence to show the user`.

The v1 record is browser-local and is not linked to a person or copied to a server ledger. This
avoids a new data flow. The owner accepts the residual risk of using this evidence model without an
external legal opinion; the repository must not describe that decision as independent legal
confirmation.

## Lead-form privacy rules

The authoritative unified-form and attached-context behavior is
[`../architecture/unified-lead-form-contract.md`](../architecture/unified-lead-form-contract.md).

- Only genuinely required fields are required.
- Privacy notice is visible near submit.
- Marketing/newsletter opt-in is separate, optional and unchecked.
- No contact data in URL or thank-you route.
- No form values in `dataLayer`, GA4 parameters, page titles or server logs.
- The client-calculated amount is never trusted. The server allowlists the raw configurator inputs,
  reproduces font metrics/geometry/price and stores only that authoritative versioned snapshot on
  the accepted lead. A pricing-version mismatch returns an updated result before persistence and
  requires a new visitor confirmation.
- The form accepts optional selection and removable local previews for up to five JPG, PNG, WebP
  or PDF files of at most 15 MB each and 50 MB combined. The implemented production path reserves
  exact random file records in Neon and uploads content directly to Private Vercel Blob; no public
  Blob URL is exposed. Upload authorization expires after 30 minutes and the approved technical
  retention deadline is 90 days. Notification links are HMAC-signed, contain no contact data and
  expire after seven days. Delivery through Resend and an email-based three-attempts-per-15-minute
  application limit were live-tested locally. `LEAD_INTAKE_ENABLED` now independently defaults all
  production contact persistence and notification off; when explicitly enabled,
  `LEAD_ATTACHMENTS_ENABLED` separately controls file intake and defaults false. The picker is
  absent and the server rejects a forged non-empty manifest while enabled contact-only leads remain
  accepted. Before file activation, show the malware/processor facts and use
  `Спросить у пользователя`.
- CRM/email failure must not leak technical or personal detail to the visitor.
- Resend sends with a per-lead idempotency key so a retry within the provider window does not create
  a duplicate operational notification.

## Analytics PII boundary

Never send to GA4/GTM generic analytics:

- name;
- email;
- phone;
- postal or exact address;
- free-form message;
- uploaded filenames/content;
- identifiers derived from contact data;
- PII in UTM or URL parameters.

GA4 data redaction is a fallback, not permission to emit unsafe data.

Enhanced Conversions is disabled for v1. Any later proposal requires a new owner/legal decision,
uses a separate Google-supported controlled channel and does not relax the GA4 boundary.

## Attribution and CRM readiness

If legally/technically approved, the system of record should be capable of keeping:

- non-personal `lead_id`;
- timestamp/timezone;
- landing path and allowed campaign attribution;
- GCLID/GBRAID/WBRAID where available and permitted;
- consent snapshot/version;
- lead-quality stages.

This prepares future offline-quality optimization without enabling it prematurely.

## Vendor onboarding evidence

Before adding a processor, collect this evidence and use `Спросить у пользователя`:

- purpose and data categories documented;
- hosting/transfer location checked;
- DPA/subprocessors reviewed;
- retention and deletion path defined;
- consent category and privacy copy updated;
- security and incident contact known;
- production owner approved.

## O10 owner-risk record and optional professional-review packet

Status: `Decision`; on 2026-08-11 the owner declined an external legal review for v1 and explicitly
accepted the documented residual risk

If an external reviewer is engaged later, provide these repository sources rather than screenshots
containing visitor or lead data:

- this data-flow/consent inventory and the O8/O9/O10 decisions above;
- `docs/marketing/measurement-plan.md` for the event allowlist, destination split and remaining QA;
- `src/features/consent/consent-manager.tsx` and `consent-storage.ts` for the independent choices,
  180-day first-party record, settings/revocation route and known optional-cookie removal;
- `src/features/analytics/google-tag-boundary.tsx` and `events.ts` for Basic Consent Mode,
  conditional GTM loading, permanently denied `ad_personalization` and the PII allowlist;
- `src/app/datenschutz/page.tsx` for the visitor-facing German disclosure;
- the recorded GA4 baseline, Ads Primary-action settings and unpublished GTM workspace described
  in the measurement plan.

Technical evidence recorded on 2026-08-11:

- automated tests, typecheck, lint and a production-like noindex build pass;
- Chrome Tag Assistant shows zero Google tags before optional consent;
- Analytics-only activates GA4 while Ads tags remain inactive;
- Marketing-only activates the Ads Google tag and Conversion Linker while GA4 remains inactive;
- Accept all activates each applicable base tag once and leaves `ad_personalization` denied;
- full revoke reloads the page without the GTM boundary;
- no real lead/contact/file data was used in this QA.

Known legal questions accepted by the owner without external written confirmation:

- whether the browser-local consent record is sufficient evidence for the intended risk profile;
- whether the banner and Datenschutzerklärung accurately cover Google Ireland, international
  transfers, consent withdrawal, cookie/storage duration and the selected Basic Consent Mode;
- whether granting `ad_user_data` only with Marketing consent is appropriate for the direct Ads
  conversion while Enhanced Conversions, remarketing and personalization remain disabled;
- whether the processor/DPA/subprocessor information and lawful-basis wording are complete for the
  actual hosting and Google account configuration;
- whether any additional production cookie/storage disclosure is required after the final
  release-candidate capture.

The risk acceptance closes the requirement to name a reviewer, but it does not convert any `TBD`
fact into a verified fact. Technical, processor/DPA, malware, advertiser-identity and production-QA
questions must be shown to the user. A final production cookie/network capture, synthetic
server-confirmed lead evidence and Google DebugView/Ads Diagnostics are `Спросить у пользователя`;
when performed, they must use controlled synthetic data and contain no real customer data.

## Official references

- [GDPR / DSGVO](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [§ 25 TDDDG](https://www.gesetze-im-internet.de/ttdsg/__25.html)
- [Google Consent Mode for EEA](https://support.google.com/google-ads/answer/13695607?hl=en)
- [Google Tag Manager consent support](https://support.google.com/tagmanager/answer/10718549?hl=en)
- [Google Analytics PII policy](https://support.google.com/analytics/answer/6366371?hl=en)
