# Google Search Foundation

Status: `Decision`; canonical origin and homepage intent owner are owner-approved
Last reviewed: 2026-08-12

> Search flags and checklists describe technical behavior and evidence. Current indexing and Search
> Console actions follow
> [`../architecture/publication-governance.md`](../architecture/publication-governance.md) and are
> `Спросить у пользователя`.

<!-- AGENT_BRIEF:START -->
## Agent brief

- Owns: canonical, metadata, robots, sitemap and indexability contracts.
- Current: one central environment gate plus exact canonical-origin validation controls production
  indexing; the apex host redirect is source-controlled in `vercel.json`.
- Open: the concrete production indexing and Search Console actions remain owner decisions.
- Read full when: changing URLs, canonical behavior, robots, sitemap or indexing controls.
<!-- AGENT_BRIEF:END -->

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

The verified production origin is `https://www.lichtsaum.com`. Runtime canonical generation uses
the server-only `SITE_URL` environment value, and production indexing fails closed unless it is
exactly this HTTPS origin. The source-controlled Vercel redirect maps the apex host to the
preferred `www` host. By owner decision on 2026-08-10, `/` owns the exact
product intent in v1 and is the Google Ads landing URL. Do not create the previously proposed
`/beleuchteter-markisen-volant` route unless a later owner decision gives the homepage a genuinely
different purpose and authorizes a substantive separate product page.

`/konfigurator` is the clean canonical URL for the implemented full tool. Configuration, PLZ,
contacts and files are never placed in its query string. Harmless tracking parameters canonicalize
to `/konfigurator`; no parameter/state variant is an index target or sitemap entry.

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

Implemented framework-owned outputs:

- route metadata / metadata helpers;
- `robots.ts`;
- `sitemap.ts`;
- generated Open Graph image or approved static asset;
- structured-data builders described in `structured-data.md`;
- truthful `not-found` handling.

The owner-approved static social preview is
`public/brand/lichtsaum-og-1200x630.png`. The root metadata publishes it as a 1200 × 630 Open Graph
image and Twitter large-image card only when the production Search/indexing gate is open. It does
not change the visible homepage or hero composition.

Checks must inspect rendered production HTML and HTTP headers, not only source code.

### Current technical boundary

Status: `Verified` locally on 2026-08-12; not deployed by this audit

- Production indexing requires all three conditions: production environment, the exact canonical
  `SITE_URL=https://www.lichtsaum.com` and the explicit `SEARCH_INDEXING_ENABLED=true` flag.
- With the flag absent or false, production emits `noindex` and an empty sitemap while preserving
  the functional site and lead flow.
- Legal and publication risks are shown to the owner before a concrete release; they do not create
  a second automatic indexing blocker outside the central environment gate.
- The owner-approved `published` reference gallery follows the central indexing gate and may enter
  the sitemap; superseded review assets stay outside the public tree.
- The substantive `/konfigurator` route follows the same central indexing gate and is included as
  one clean canonical sitemap URL. Its H1, explanation and calculation limitations are
  server-rendered; `Product` and `Offer` structured data remain absent.
- The minimal site graph is limited to verified `Organization` and `WebSite` facts and is emitted
  only through the same indexing gate.
- Indexable inner routes publish route-specific Open Graph and Twitter metadata; previews and
  non-indexable environments do not publish deployment metadata.
- Current Search state and open external actions are recorded only in `../../PROGRESS.md` and the
  current implementation roadmap.

## Search Console and launch

After the real domain is verified:

1. create the correct Domain property;
2. submit the production sitemap;
3. inspect the home page and core routes;
4. show the release-check evidence and ask the user whether to request indexing;
5. monitor Page indexing, crawl issues, Core Web Vitals, manual actions and search performance;
6. annotate major route/canonical/content releases in `PROGRESS.md` or the release record.

Search Console access and property ownership are `TBD`; the Domain property input should be
`lichtsaum.com`, verified through DNS.

## Publication evidence checklist

Unchecked items are reported to the user; the checklist does not decide publication by itself.

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
