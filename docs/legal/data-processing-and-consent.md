# Data Processing and Consent

Status: `Proposed`; current prototype flows verified, production vendors and retention are `TBD`  
Last reviewed: 2026-08-04

Этот файл — источник истины для planned/actual data flows. Обновлять до подключения каждого
vendor.

## Data inventory

| Processing | Data | Purpose | Basis/status | Consent category | Processor | Retention |
| --- | --- | --- | --- | --- | --- | --- |
| Server/security logs | IP, time, request metadata | Delivery, abuse/security | TBD assessment | Necessary | Hosting TBD | TBD |
| Direct email/phone contact | Contact data and request content | Respond/pre-contract steps | Art. 6(1)(b) or (f), case-dependent | Not marketing consent | Email/telecom provider TBD | Purpose and statutory duties |
| Prototype form validation | Email; optional phone, message and selected files | Validate format/size rules without accepting a lead | Current local prototype only; final legal assessment before activation | Necessary prototype function | Application runtime only | No persistent storage |
| Mini-configurator session state | Inscription, dimensions, design and color choices | Preserve configuration during the browser session | Browser-local; § 25 TDDDG classification is TBD because the current implementation writes automatically on load | TBD | None; browser `sessionStorage` | Browser session |
| Production lead request | Contact, request details and optional files | Respond/pre-contract steps | Disabled; TBD legal confirmation | Not marketing consent | CRM/store TBD | TBD |
| Lead notification | Lead/contact data | Operational response | Disabled; TBD legal confirmation | Not marketing consent | Email TBD | TBD |
| CMP | Consent choice/version/time | Prove and respect choice | TBD | Necessary | CMP TBD | TBD |
| GA4 | Pseudonymous usage events | Analytics | Consent required in project policy | Analytics | Google | GA setting TBD |
| Google Ads | Conversion/ad signals | Measurement/advertising | Consent required in project policy | Marketing | Google | Account setting TBD |
| Enhanced Conversions | Hashed first-party data | Ads matching/measurement | Disabled; separate review | Marketing/ad user data | Google | TBD |
| Local fonts | Font files | Rendering | No external request | Necessary | Hosting | Cache policy |

The current prototype has no CMP, GA4, Google Ads, GTM, Enhanced Conversions, CRM, chat, AI service
or external-media embed active. Rows describing those systems are planning inventory, not current
processing.

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
- The local prototype may expose optional selection and removable local previews for up to five
  files of at most 15 MB each. On test submission, files are transmitted to the application runtime
  only for validation and are not persisted, accepted as a lead or forwarded to third parties.
  Production file upload is still out of v1 scope; activating it requires content warnings,
  storage/retention/access-control design and malware handling.
- CRM/email failure must not leak technical or personal detail to the visitor.

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
