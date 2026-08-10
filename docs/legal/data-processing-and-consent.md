# Data Processing and Consent

Status: `Proposed`; local lead/email flow verified, production legal approval remains `TBD`
Last reviewed: 2026-08-06

Этот файл — источник истины для planned/actual data flows. Обновлять до подключения каждого
vendor.

## Data inventory

| Processing | Data | Purpose | Basis/status | Consent category | Processor | Retention |
| --- | --- | --- | --- | --- | --- | --- |
| Server/security logs | IP, time, request metadata; no form body logged by the application | Delivery, abuse/security | Art. 6(1)(f), legitimate security and delivery interest | Necessary | Vercel Inc.; current Hobby runtime-log access is 1 hour | 1 hour for runtime logs; build/deployment records follow Vercel account retention |
| Direct email/phone contact | Contact data and request content | Respond/pre-contract steps | Art. 6(1)(b) or (f), case-dependent | Not marketing consent | Cloudflare, Inc. Email Routing; Google Ireland Limited Gmail; telecom provider | Normally 90 days after the request; longer only for active handling, legal claims or statutory duties |
| Disabled-environment form validation | Email; optional phone, message and selected files | Validate format/size rules without accepting a lead | Used whenever lead feature flags are off | Necessary prototype function | Application runtime only | No persistent storage |
| Mini-configurator session state | Inscription, dimensions, design and color choices | Preserve configuration during the browser session | Browser-local; writing starts only after the visitor operates the requested configurator function | Necessary | None; browser `sessionStorage` | Browser session |
| Enabled lead request | Contact, request details and optional file metadata | Respond/pre-contract steps | Implemented and live-tested locally; production legal confirmation TBD | Not marketing consent | Neon PostgreSQL (`eu-central-1`), onboarding/DPA review pending | 90 days approved as technical default; statutory exceptions TBD |
| Enabled lead files | Up to five JPG/PNG/WebP/PDF files, 15 MB each and 50 MB combined | Object-specific project review | Implemented and live-tested locally; production malware/legal gates remain | Necessary form function; final assessment pending | Private Vercel Blob (`fra1`), onboarding/DPA review pending | 90 days |
| Lead notification and receipt | Internal contact/request notification with signed file links; customer receipt with email address and public request number only | Operational response and confirmation of receipt | Internal notification delivery-tested; customer receipt implemented, production delivery test pending | Not marketing consent | Plus Five Five, Inc. (Resend), sending region `eu-west-1`; Cloudflare, Inc.; Google Ireland Limited | Operational mailbox policy: 90 days; Resend processes while the agreement is active and states deletion within 90 days after account termination |
| CMP | Consent choice/version/time | Prove and respect choice | TBD | Necessary | CMP TBD | TBD |
| GA4 | Pseudonymous usage events | Analytics | Consent required in project policy | Analytics | Google | GA setting TBD |
| Google Ads | Conversion/ad signals | Measurement/advertising | Consent required in project policy | Marketing | Google | Account setting TBD |
| Enhanced Conversions | Hashed first-party data | Ads matching/measurement | Disabled; separate review | Marketing/ad user data | Google | TBD |
| Local fonts | Font files | Rendering | No external request | Necessary | Hosting | Cache policy |

The current project has no CMP, GA4, Google Ads, GTM, Enhanced Conversions, CRM, chat, AI service
or external-media embed active. Neon, Private Vercel Blob and Resend are active only in explicitly
enabled environments; production release remains fail-closed through environment flags and legal
review markers.

## Resolved release facts

- The confirmed provider designation is centralized in `siteConfig` and shown in the Impressum.
- The current product site contains no journalistic-editorial section. Reassess before adding a
  blog, news or comparable editorial publication.
- No analytics, advertising, CMP or external-media technology is active in the current codebase.
  Adding one reopens the consent and disclosure review.
- The mini-configurator starts browser-local session storage only after user interaction.
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
  Pro and Enterprise, not the project's current Hobby plan; this remains a production blocker.
- Current Vercel Hobby runtime logs are retained for one hour. The application does not log request
  bodies, contact fields, tokens or uploaded content.
- Operational lead, file and mailbox retention is 90 days, with seven-day signed file links and
  narrowly stated legal/active-case exceptions. No CRM or consent records exist in the current flow.

Do not mark a `TBD` lawful basis as final legal advice.

## Consent model

Categories:

- Necessary — requested site/form/security functionality.
- Analytics — GA4 usage measurement.
- Marketing — Google Ads, remarketing and advertising data.
- External media — maps/video/review widgets if later introduced.

Required Consent Mode v2 signals:

| Signal | Meaning | Default before choice |
| --- | --- | --- |
| `analytics_storage` | Analytics storage | `denied` |
| `ad_storage` | Advertising storage | `denied` |
| `ad_user_data` | Sending user data for advertising | `denied` |
| `ad_personalization` | Personalized advertising | `denied` |

Basic vs Advanced Consent Mode is not yet selected. Advanced mode may send cookieless pings while
storage is denied; choose only after German legal/privacy review and accurate disclosure.

## Consent lifecycle

1. Set defaults before measurement tags.
2. Display accessible German consent UI.
3. Store the visitor choice and consent-policy version.
4. Update signals on the same page.
5. Apply the choice to Google and non-Google tags.
6. Offer a persistent settings/revocation control.
7. Re-prompt only when policy/vendors/purposes materially change.
8. Verify Reject all, partial consent, Accept all and revoke.

## Lead-form privacy rules

- Only genuinely required fields are required.
- Privacy notice is visible near submit.
- Marketing/newsletter opt-in is separate, optional and unchecked.
- No contact data in URL or thank-you route.
- No form values in `dataLayer`, GA4 parameters, page titles or server logs.
- The form accepts optional selection and removable local previews for up to five JPG, PNG, WebP
  or PDF files of at most 15 MB each and 50 MB combined. The implemented production path reserves
  exact random file records in Neon and uploads content directly to Private Vercel Blob; no public
  Blob URL is exposed. Upload authorization expires after 30 minutes and the approved technical
  retention deadline is 90 days. Notification links are HMAC-signed, contain no contact data and
  expire after seven days. Delivery through Resend and an email-based three-attempts-per-15-minute
  application limit were live-tested locally. Production activation remains blocked on malware
  handling, processor onboarding and final privacy review.
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

Enhanced Conversions, if later approved, uses a separate Google-supported controlled channel and
does not relax the GA4 boundary.

## Attribution and CRM readiness

If legally/technically approved, the system of record should be capable of keeping:

- non-personal `lead_id`;
- timestamp/timezone;
- landing path and allowed campaign attribution;
- GCLID/GBRAID/WBRAID where available and permitted;
- consent snapshot/version;
- lead-quality stages.

This prepares future offline-quality optimization without enabling it prematurely.

## Vendor onboarding gate

Before adding a processor:

- purpose and data categories documented;
- hosting/transfer location checked;
- DPA/subprocessors reviewed;
- retention and deletion path defined;
- consent category and privacy copy updated;
- security and incident contact known;
- production owner approved.

## Official references

- [GDPR / DSGVO](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [§ 25 TDDDG](https://www.gesetze-im-internet.de/ttdsg/__25.html)
- [Google Consent Mode for EEA](https://support.google.com/google-ads/answer/13695607?hl=en)
- [Google Tag Manager consent support](https://support.google.com/tagmanager/answer/10718549?hl=en)
- [Google Analytics PII policy](https://support.google.com/analytics/answer/6366371?hl=en)
