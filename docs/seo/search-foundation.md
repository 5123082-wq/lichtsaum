# Google Search Foundation

Status: `Decision` with domain and final route inputs `TBD`  
Last reviewed: 2026-07-30

## Objective

Сделать полезный немецкий сайт технически доступным Google с первого production-релиза. Эта
основа создаёт условия для crawling/indexing, но не гарантирует индексацию или позиции.

## Search invariants

- Googlebot не заблокирован и получает финальный контент с HTTP `200`.
- Значимые заголовки, текст, ссылки, metadata и JSON-LD присутствуют в initial/server HTML.
- На один документ приходится один предпочтительный HTTPS URL.
- Mobile и desktop используют тот же URL и эквивалентное основное содержание.
- Production — единственная индексируемая среда.
- Search intent, visible copy, Ads promise и structured data не противоречат друг другу.
- Metadata keywords не используются: они не являются сигналом Google Search.

## URL and information architecture

Initial routes are defined in `../architecture/system-architecture.md`.

Rules:

- lower-case, readable, stable German slugs;
- trailing-slash policy is uniform and enforced with one redirect at most;
- internal links point directly to canonical URLs;
- tracking/filter parameters do not create indexable duplicates;
- changed permanent paths receive explicit `301`/`308` mapping;
- removed content returns a truthful `404`/`410`, not a soft-404 landing;
- no mass city/category URLs until each page has real service relevance and unique value.

The production origin and preferred host (`www` or apex) are `TBD` and must live in
`src/config/site.ts`.

## Metadata contract

Every indexable route has:

- concise unique German `<title>`;
- unique useful meta description;
- absolute self-referencing canonical;
- crawl/index directive appropriate to the environment;
- Open Graph basics using the same verified title/description;
- one semantic page `<h1>` aligned with visible intent;
- meaningful document language (`lang="de"`; locale decision recorded centrally).

Brand naming comes from central config so the working title can be replaced safely.

If the first release is German-only, hreflang is not required. Add it only when equivalent
localized pages and reciprocal mappings actually exist; never point hreflang at placeholder
translations.

## Canonical policy

- Canonical is absolute, HTTPS and uses the production preferred host.
- The canonical URL returns `200`, is indexable and appears in the sitemap.
- UTM, `gclid`, `gbraid`, `wbraid` and harmless presentation parameters canonicalize to the clean
  route.
- Preview hosts never canonicalize ambiguously into production while exposing draft content; they
  remain access-controlled and `noindex`.
- Do not use canonical as a substitute for redirects when only one URL should exist.
- Do not canonicalize genuinely different content to the home page.

## Robots and environment policy

### Production

- `robots.txt` allows Googlebot and AdsBot-Google to fetch pages and render-critical assets.
- Only intentional private/utility paths are disallowed.
- Sitemap location is declared.
- Indexable pages do not emit `noindex`.

### Preview/staging

- access control is primary;
- `X-Robots-Tag: noindex, nofollow` is defense in depth;
- no public sitemap submission;
- no production Ads final URL or production tracking IDs.

`robots.txt Disallow` alone is not a de-indexing method because the crawler may be unable to read
the `noindex` instruction.

## Sitemap policy

Use the framework sitemap convention and include only:

- absolute canonical URLs;
- routes returning `200`;
- indexable, substantive pages;
- actual `lastModified` values when content changed.

Exclude redirects, confirmation states, parameter variants, preview URLs, errors and thin
placeholders. Do not set every `lastModified` to build time.

## Content and HTML requirements

- Semantic landmarks: header, navigation, main, sections and footer.
- Logical heading hierarchy; headings describe content rather than visual size.
- Product/service information is text, not embedded only in an image or animation.
- Internal anchor text communicates destination.
- Links are crawlable native anchors with real `href`.
- Important content is not hidden until consent, hover, canvas rendering or client-only fetch.
- German copy is written for people; no keyword stuffing, hidden text or doorway variants.
- Every public claim is approved in `../content/claims-and-evidence-register.md`.

## Media and performance

- Use responsive dimensions/formats and explicit width/height or stable aspect ratio.
- LCP media is discoverable in server HTML, appropriately prioritized and not lazy-loaded.
- Decorative images have empty alt; informative images have concise German alt.
- Fonts are self-hosted/subsetted and do not create avoidable layout shift.
- Third-party scripts are delayed/gated and justified.
- Production target at the 75th percentile:
  - LCP ≤ 2.5 s;
  - INP ≤ 200 ms;
  - CLS ≤ 0.1.

Targets are release budgets, not claims about current performance.

## Search files and status behavior

Planned framework-owned outputs:

- route metadata / metadata helpers;
- `robots.ts`;
- `sitemap.ts`;
- generated Open Graph image or approved static asset;
- structured-data builders described in `structured-data.md`;
- truthful `not-found` handling.

Checks must inspect rendered production HTML and HTTP headers, not only source code.

## Search Console and launch

After the real domain is verified:

1. create the correct Domain property;
2. submit the production sitemap;
3. inspect the home page and core routes;
4. request indexing only after release checks pass;
5. monitor Page indexing, crawl issues, Core Web Vitals, manual actions and search performance;
6. annotate major route/canonical/content releases in `PROGRESS.md` or the release record.

Search Console access, property ownership and domain are `TBD`.

## Release checklist

- [ ] Preferred host redirects once to canonical HTTPS.
- [ ] Core URLs return `200`; missing URLs return truthful status.
- [ ] Server HTML contains title, description, canonical, H1 and core copy.
- [ ] Production robots/sitemap contain only intended URLs.
- [ ] Preview is inaccessible to indexing.
- [ ] Googlebot smartphone rendering sees content and assets.
- [ ] Parameter URLs preserve function and canonicalize correctly.
- [ ] Structured data passes the applicable tests and matches visible facts.
- [ ] No unapproved claims or duplicate/thin pages.
- [ ] Mobile CWV and accessibility checks meet release budget.
- [ ] Search Console property and sitemap are verified after domain approval.

## Official references

- [Google Search technical requirements](https://developers.google.com/search/docs/essentials/technical)
- [Google crawling and indexing guide](https://developers.google.com/search/docs/crawling-indexing)
- [Canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google Search structured data introduction](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Core Web Vitals](https://web.dev/articles/vitals)

