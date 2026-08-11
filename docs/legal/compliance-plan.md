# Germany / EU Compliance Plan

Status: `Decision`; local legal pages implemented; on 2026-08-11 the owner accepted the documented
residual risk without an external legal opinion; publication-affecting legal/technical questions
are `Спросить у пользователя`
Last verified against official sources: 2026-08-11

Это инженерный compliance-план, не юридическое заключение.

Юридические требования и риски ниже сохраняются. Они не дают агенту самостоятельного права
запретить или разрешить публикацию: перед соответствующим действием показать вопрос владельцу и
пометить `Спросить у пользователя`; см.
[`../architecture/publication-governance.md`](../architecture/publication-governance.md).

## Working classification

- Germany-facing German-language site.
- The `/konfigurator` preliminary net calculation is explicitly positioned for `gewerbliche
  Projekte` (commercial projects). The wider site/lead flow can still be reached by consumers, so
  B2C classification and consumer-facing price presentation remain a separate release review.
- Lead generation / project compatibility review and later non-binding quote request.
- No online checkout or contract conclusion in v1.
- Personal data: contact/project-review form, server logs and later CRM/email.
- Project-photo/file upload and Resend notification are implemented and live-tested in an enabled
  local environment with Neon metadata, Private Vercel Blob and a 90-day technical retention
  deadline; prepared code makes production attachments independently configurable. Malware
  handling remains an open question; attachment activation is `Спросить у пользователя`.
- Analytics/advertising only through consent-aware implementation.

Any change to booking, payment, binding ordering, newsletter, approved upload design, chat, maps or
video changes the legal/data scope and requires this document to be updated first.

## Compliance matrix

| Area | Requirement / risk | Current status | `Спросить у пользователя` / legal follow-up |
| --- | --- | --- | --- |
| `Impressum` | Provider information must be easily reachable and continuously available | Owner reconfirmed provider name, address, contact and VAT ID on 2026-08-11; non-mandatory boilerplate was removed | W-IdNr. remains unverified and is not published |
| `Datenschutzerklärung` | Describe all actual processing, processors, transfers, retention and rights | Local page describes the confirmed hosting, lead, upload, email and consent-dependent Google flows without public internal markers | Match the final deployment and verify final production network/cookie evidence |
| TDDDG / cookies | Non-essential storage/access generally requires informed consent | Custom consent UI and Basic Consent Mode boundary pass local QA; public Google tags remain off | Activate consent UI and optional tags together; verify final network/cookie evidence |
| GDPR form processing | Purpose, lawful basis, minimization, transparency and security | Implemented locally; required/optional fields, early persistence, abuse check and 90-day retention are disclosed | Verify the production deployment |
| Processor contracts | DPA/Art. 28 assessment for hosting and lead vendors | Resend, Cloudflare and Neon publish applicable DPA/SCC terms; Vercel's published DPA covers Pro/Enterprise while this project is on Hobby | Ask whether to publish/use the current processor setup after presenting the mismatch |
| Advertising claims | No misleading price, origin, guarantee, certification or availability claims | Register created | Ask about any claim without recorded approval/evidence; do not invent facts |
| PAngV / preliminary price | `/konfigurator` shows a server-reproduced net component subtotal with 0% markup for commercial projects; VAT, selected services and binding-offer status are disclosed beside the result | Restricted local implementation under CLM-029 | Before B2C or Ads use, confirm whether a consumer `Gesamtpreis` including VAT and all required price components must replace/supplement the net-only presentation |
| VSBG | Consumer dispute information may apply; employee threshold/participation facts needed | Owner confirmed no more than ten persons on 2025-12-31 and no voluntary, contractual or statutory participation obligation; the optional website statement was removed | Reassess if participation status changes |
| EU ODR | Old OS-platform link is obsolete after platform closure in 2025 | Decision | Do not include |
| BFSG | Applicability depends on consumer e-commerce/service scope and exemptions | Owner confirmed fewer than ten workers and turnover or balance not exceeding EUR 2 million; service microenterprise exemption recorded | Reassess if thresholds or service model change; target WCAG 2.2 AA regardless |
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
- Unresolved legal inputs remain internal questions and are not rendered as visitor-facing legal
  copy. Before a related publication choice, use `Спросить у пользователя`.
- The calculator is not checkout and does not conclude a contract. Its CTA remains the existing
  non-binding `Projekt prüfen lassen` inquiry; no wording may imply an order, compatibility approval
  or final quotation.

## Verified provider facts

Owner confirmed on 2026-08-04 that LICHTSAUM is a brand/offer of the same responsible provider as
Pixel-Ring and authorized adapting the supplied legal pages:

- `NVKV Werbeagentur Inh. Ivan Novikov`;
- Dannenwalder Weg 110, 13439 Berlin, Deutschland;
- `info@lichtsaum.com` and the two telephone numbers confirmed by the owner;
- VAT ID `DE367887602`;
- no more than ten persons employed on 2025-12-31 and no willingness, contractual obligation or
  statutory obligation to participate in consumer dispute resolution;
- no register entry or separate register information to publish;
- no separately appointed data-protection officer; the responsible company remains the contact;
- NVKV provides and coordinates the result; no regulated professional designation, chamber or
  supervisory authority is claimed for the current offer. Reassess if NVKV itself later undertakes
  regulated installation or electrical work;
- no journalistic-editorial section and therefore no responsible person under § 18 Abs. 2 MStV;
- BFSG service-microenterprise thresholds confirmed by the owner.

Source pages checked on 2026-08-04:

- [Pixel-Ring Impressum](https://www.pixel-ring.com/ru/impressum)
- [Pixel-Ring Datenschutzerklärung](https://www.pixel-ring.com/ru/privacy)

The obsolete EU ODR/OS-platform link present in the source Impressum was deliberately not copied.

## Remaining company and deployment inputs

- The Wirtschafts-Identifikationsnummer is unverified by owner decision and is not published. If a
  W-IdNr. has been assigned, § 5 Abs. 1 Nr. 6 DDG requires reassessment before launch.
- Vercel production hosting: the current Hobby plan is documented as personal/non-commercial and
  Vercel's published processor DPA applies to Pro and Enterprise. Reverified against Vercel's
  official [Hobby plan](https://vercel.com/docs/plans/hobby) and
  [DPA](https://vercel.com/legal/dpa) on 2026-08-11. A commercial public launch on the current plan
  therefore carries an unresolved engineering/legal risk. The owner chose on 2026-08-11 to retain
  Hobby and accepted that risk. Any change of plan/billing or decision to continue publishing on
  this setup is `Спросить у пользователя`. Do not represent it as Vercel DPA coverage or verified
  legal compliance.
- Production domain HTTPS/security verification and malware handling for uploaded files.
- Service/product contract classification and business model.
- Consumer accessibility of `/konfigurator` and the resulting PAngV presentation. Under the current
  official PAngV text, `Gesamtpreis` includes VAT and other price components (§ 2 no. 3), and an
  entrepreneur advertising prices to consumers must state that total (§ 3). The current B2B-netto
  model is therefore a legal/Ads question. Show it and use `Спросить у пользователя` before B2C or
  Ads price publication.

## Official sources

- [§ 5 DDG — provider information](https://www.gesetze-im-internet.de/ddg/__5.html)
- [GDPR / DSGVO](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [§ 25 TDDDG — terminal storage/access](https://www.gesetze-im-internet.de/ttdsg/__25.html)
- [BFSG](https://www.gesetze-im-internet.de/bfsg/)
- [BFSGV](https://www.gesetze-im-internet.de/bfsgv/)
- [§ 36 VSBG](https://www.gesetze-im-internet.de/vsbg/__36.html)
- [UWG](https://www.gesetze-im-internet.de/uwg_2004/)
- [PAngV](https://www.gesetze-im-internet.de/pangv_2022/)
- [§ 2 PAngV — `Gesamtpreis`](https://www.gesetze-im-internet.de/pangv_2022/__2.html)
- [§ 3 PAngV — Pflicht zur Angabe des Gesamtpreises](https://www.gesetze-im-internet.de/pangv_2022/__3.html)
- [EU ODR closure notice](https://consumer-redress.ec.europa.eu/site-relocation_en)

Recheck sources before final legal copy or launch.
