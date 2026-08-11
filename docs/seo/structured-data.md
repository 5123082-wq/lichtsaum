# Structured Data Plan

Status: minimal graph `Implemented` locally; production publication is `Спросить у пользователя`
Last reviewed: 2026-08-10

Publication authority: [`../architecture/publication-governance.md`](../architecture/publication-governance.md).
Validation findings are evidence for the owner, not autonomous release blockers.

## Objective

Добавлять JSON-LD, который точно описывает видимый контент и реальный бизнес. Schema помогает
поисковой системе понять страницу, но не гарантирует rich result.

## Implementation rules

- JSON-LD is rendered in initial/server HTML.
- Builders live in `src/lib/structured-data/`.
- Verified business/display facts currently come from `src/config/site.ts`; the canonical origin
  comes from the server-only `SITE_URL` environment value.
- Copy, metadata and Schema consume the same approved facts.
- Absolute IDs/URLs use the production canonical origin.
- Optional fields are omitted when unknown; no placeholders or guessed values.
- User-controlled text is never interpolated into raw script markup.
- JSON serialization must safely escape `<` and other script-breaking content.
- Markup is tested against rendered output, not only TypeScript objects.

## Initial graph

| Page | Candidate type | Release condition |
| --- | --- | --- |
| All public pages | `WebSite` | Implemented locally from the canonical origin and visible brand |
| Site identity | `Organization` | Implemented locally from verified provider/contact facts; unapproved logo/social fields omitted |
| Home/service page | `Service` | Service description and provider match visible content |
| Physical local provider | Most specific valid `LocalBusiness` subtype | Real public location/contact/hours and local customer-facing operation verified |
| Inner routes | `BreadcrumbList` | Visible/crawlable hierarchy exists |
| References | No special rating schema by default | Project content is real and permission/rights confirmed |

Stable `@id` nodes use the configured canonical domain, for example
`https://www.lichtsaum.com/#organization`.

## Current implementation boundary

Status: `Verified` locally on 2026-08-10; not deployed by this audit

- `src/lib/structured-data/site-graph.ts` builds one `Organization` and one `WebSite` node with
  stable IDs under the configured canonical origin.
- `src/lib/structured-data/json-ld.ts` escapes `<`, U+2028 and U+2029 before insertion into the
  server-rendered script.
- The graph is emitted only when the central production indexing gate passes.
- `Service`, `Product`, `Offer`, `LocalBusiness`, `ImageObject`, ratings, prices, service area,
  opening hours, social profiles and logo are deliberately absent.
- Unit tests assert both the exact graph boundary and script-safe serialization.

Production validation in Schema.org Validator and rendered Search Console inspection remains a
release task after claims and legal approval.

## Organization vs LocalBusiness

Default to `Organization` until physical/local-business facts are proven.

Use `LocalBusiness` only when the entity actually operates as a local customer-facing business and
the published address, phone, opening hours and service reality are verified. Do not invent a
storefront, coordinates, service area or hours to qualify for a feature.

## Service representation

The home page may describe the illuminated-awning offering with `Service` when:

- product terminology is approved;
- provider identity is verified;
- `areaServed` reflects actual service geography;
- description matches visible German copy;
- any offer/price/warranty fields are supported by approved evidence.

Do not use `Product`, `Offer`, `AggregateOffer` or price fields merely because they appear more
commercial. Add them only when the page represents a concrete offering and all required visible
facts are accurate.

## Reviews, ratings and claims

- Never create ratings from internal estimates, placeholders or selected testimonials.
- Review content must be genuine, attributable, permission-cleared and visible to the visitor.
- Do not assume self-serving `Organization`/`LocalBusiness` stars are eligible for Google review
  features.
- Awards, certifications, founding date, warranty, manufacturer and origin require an `Approved`
  record in `../content/claims-and-evidence-register.md`.
- Schema may not make a stronger claim than the page.

## FAQ and other optional types

`FAQPage` is not a v1 release requirement. Google currently limits FAQ rich-result visibility to
specific authoritative government and health sites, so FAQ markup must not be sold as an SEO
shortcut. If added for semantic reuse, all questions/answers must be visible and non-promotional.

Do not add:

- `SearchAction` without real site search;
- `VideoObject` without a real public video and metadata;
- `HowTo` for a sales description that is not an actual visible procedure;
- `ImageObject` with unlicensed/placeholder media;
- `sameAs` links that are unverified or not controlled by the business.

## Validation gates

For each release:

1. inspect JSON-LD in rendered production-like HTML;
2. validate syntax and graph references;
3. run Google Rich Results Test for supported features;
4. run Schema.org validator for broader vocabulary;
5. compare every field with visible page content and central config;
6. verify canonical absolute URLs and image accessibility;
7. check Search Console enhancement reports after launch;
8. treat warnings by relevance—never invent data just to silence them.

## Required business inputs

- final public brand-to-legal-entity relationship and trademark clearance;
- canonical domain;
- verified logo/image rights and production URLs;
- approval to reuse the verified provider phone/email/address in structured data;
- actual service area;
- opening/contact hours, if published;
- concrete product/service terminology;
- approved social/business profile URLs;
- approved claims, reviews, prices and warranty details.

Until these exist, code may contain typed optional fields or fixtures restricted to tests, but
production JSON-LD must omit them.

## Official references

- [Google structured data introduction](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Google structured data general guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Schema.org](https://schema.org/)
