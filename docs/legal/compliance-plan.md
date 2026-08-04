# Germany / EU Compliance Plan

Status: `Proposed`; local legal pages implemented, business-specific legal review required  
Last verified against official sources: 2026-08-04

Это инженерный compliance-план, не юридическое заключение.

## Working classification

- Germany-facing German-language site.
- Proposed product scope is B2B-only; final legal classification and public wording require owner
  confirmation.
- Lead generation / project compatibility review and later non-binding quote request.
- No online checkout or contract conclusion in v1.
- Personal data: contact/project-review form, server logs and later CRM/email.
- Project-photo/file upload is proposed but not approved; storage, metadata, access, retention and
  processor scope must be documented before implementation.
- Analytics/advertising only through consent-aware implementation.

Any change to booking, payment, binding ordering, newsletter, approved upload design, chat, maps or
video changes the legal/data scope and requires this document to be updated first.

## Compliance matrix

| Area | Requirement / risk | Current status | Release gate |
| --- | --- | --- | --- |
| `Impressum` | Provider information must be easily reachable and continuously available | Local page implemented; five unresolved checks are marked contextually | Resolve every internal marker and complete legal review |
| `Datenschutzerklärung` | Describe all actual processing, processors, transfers, retention and rights | Local page matches the current prototype; eleven production inputs are marked contextually | Update against final deployment, remove markers and obtain legal review |
| TDDDG / cookies | Non-essential storage/access generally requires informed consent | Architecture decided | Consent QA passes |
| GDPR form processing | Purpose, lawful basis, minimization, transparency and security | Planned | Form/data inventory reviewed |
| Processor contracts | DPA/Art. 28 assessment for hosting, CRM, email, CMP and vendors | TBD | Vendor register complete |
| Advertising claims | No misleading price, origin, guarantee, certification or availability claims | Register created | Only Approved claims |
| VSBG | Consumer dispute information may apply; employee threshold/participation facts needed | TBD | Legal/company input |
| EU ODR | Old OS-platform link is obsolete after platform closure in 2025 | Decision | Do not include |
| BFSG | Applicability depends on consumer e-commerce/service scope and exemptions | Needs legal review | WCAG 2.2 AA regardless |
| Consumer contract law | Additional BGB/EGBGB/withdrawal duties if flow becomes binding | Out of v1 scope | Reclassify before adding |

## Mandatory implementation rules

- Legal links available from every page.
- Consent choice is granular; Reject is as accessible as Accept.
- No preselected optional consent.
- Persistent way to change/revoke consent.
- Lead form works without marketing consent.
- Do not require a consent checkbox merely to answer a user-requested quote when another lawful
  basis is appropriate; show concise privacy information and link instead.
- Separate unchecked opt-in for unrelated marketing/newsletter.
- Required fields limited to what is genuinely necessary.
- No external media, maps, review widgets, reCAPTCHA or chat before data-flow/consent review.
- Self-host fonts by default.
- No personal/contact data in analytics.
- Every unresolved legal input remains a visible non-indexable `data-legal-review="required"`
  marker. Production indexing must fail closed while any marker exists.

## Verified provider facts

Owner confirmed on 2026-08-04 that LICHTSAUM is a brand/offer of the same responsible provider as
Pixel-Ring and authorized adapting the supplied legal pages:

- `NVKV Werbeagentur Inh. Ivan Novikov`;
- Dannenwalder Weg 110, 13439 Berlin, Deutschland;
- `info@nvkv.de` and the two telephone numbers published in the source Impressum;
- VAT ID `DE367887602`;
- no willingness or obligation to participate in consumer dispute resolution.

Source pages checked on 2026-08-04:

- [Pixel-Ring Impressum](https://www.pixel-ring.com/ru/impressum)
- [Pixel-Ring Datenschutzerklärung](https://www.pixel-ring.com/ru/privacy)

The obsolete EU ODR/OS-platform link present in the source Impressum was deliberately not copied.

## Remaining company and deployment inputs

- Chamber, professional title/rules and supervisory authority, if applicable.
- Employee count relevant to VSBG.
- Register and Wirtschafts-ID details, if applicable.
- Data-protection-officer contact, if one is required.
- Production hosting, email/CRM provider, recipients and exact retention periods.
- Service/product contract classification and business model.

## Official sources

- [§ 5 DDG — provider information](https://www.gesetze-im-internet.de/ddg/__5.html)
- [GDPR / DSGVO](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [§ 25 TDDDG — terminal storage/access](https://www.gesetze-im-internet.de/ttdsg/__25.html)
- [BFSG](https://www.gesetze-im-internet.de/bfsg/)
- [BFSGV](https://www.gesetze-im-internet.de/bfsgv/)
- [§ 36 VSBG](https://www.gesetze-im-internet.de/vsbg/__36.html)
- [UWG](https://www.gesetze-im-internet.de/uwg_2004/)
- [PAngV](https://www.gesetze-im-internet.de/pangv_2022/)
- [EU ODR closure notice](https://consumer-redress.ec.europa.eu/site-relocation_en)

Recheck sources before final legal copy or launch.
