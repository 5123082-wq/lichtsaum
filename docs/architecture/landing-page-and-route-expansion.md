# Landing Page and Route Expansion Brief

Status: `Decision` with local references-gallery review implemented  
Last reviewed: 2026-08-04  
Scope: homepage information architecture, navigation, compact configurator, application gallery,
modal routing and Search boundaries

## Purpose

Зафиксировать целевое развитие главной страницы, если полный конфигуратор и полная галерея
получат самостоятельные маршруты. Документ описывает:

- роль каждого блока главной;
- короткий маркетинговый сценарий от первого экрана до заявки;
- целевое верхнее меню;
- границу между мини-конфигуратором и полным инструментом;
- границу между карточками на главной, модальным просмотром и страницами изображений;
- SEO-безопасную реализацию модального просмотра;
- условия, при которых новые URL можно индексировать.

Этот brief не заменяет источники обязательных правил:

- визуальная система — [`../../DESIGN.md`](../../DESIGN.md);
- текущая архитектура и утверждённые маршруты —
  [`system-architecture.md`](system-architecture.md);
- crawl, canonical, sitemap и environment policy —
  [`../seo/search-foundation.md`](../seo/search-foundation.md);
- Search intent — [`../seo/search-intent-map.md`](../seo/search-intent-map.md);
- публичные утверждения —
  [`../content/claims-and-evidence-register.md`](../content/claims-and-evidence-register.md).

## Status boundary

### Decision

- Hero и полоса трёх принципов не изменяются в рамках следующей структурной итерации.
- `Eine Fassade. Zwei Ansichten.` остаётся самостоятельным блоком трансформации.
- `Engineered Precision` остаётся визуальным эталоном иерархии и аккуратности.
- Объединённый Eignung-блок `Konstruktion prüfen. Volant erneuern.` сохраняется без возврата
  удалённых CTA и строки входных материалов.
- Главная использует один основной CTA: `Projekt prüfen lassen`.
- Первый этап мини-конфигуратора реализуется только на главной: существующий `#kosten` полностью
  заменяется блоком `#konfigurator` / `LICHTSAUM STUDIO`; отдельный маршрут пока не создаётся.
- Сцена мини-конфигуратора — компактный параметрический SVG в прямой фронтальной проекции: только
  световой волан без верхнего полотна маркизы, фасада и растровой фотографии.
- AI-визуализация, загрузка фотографии клиента и перенос SVG на фотографию отложены за границу
  первого этапа.
- Главная сокращена до Hero → principles → transformation → precision → Eignung → configurator →
  позиция галереи → FAQ → project check → footer.
- `Varianten`, `Ablauf`, `Projektgrenzen`, `Nachweise` и `Alternatives` исключены из render; их
  исходные компоненты пока сохранены.
- Навигация использует четыре абсолютных домашних anchor: `/#produkt`, `/#eignung`,
  `/#konfigurator`, `/#faq`. `Referenzen` добавляется только при публикации галереи.
- Галерея реализована как data-driven scaffold со статусами `awaiting-assets`, `review` и
  `published`. Текущее состояние — local `review` с четырьмя явно маркированными временными
  AI-концептами, одобренными владельцем для визуальной проверки.
- AI-концепты не являются Referenzen и не могут активировать `published`; публичная галерея
  по-прежнему требует четыре фотографии реальных выполненных проектов.

### Proposed / later phase

- Полный конфигуратор получает отдельную страницу.

### TBD

- окончательные production slugs после проверки Search intent;
- формула, цена, VAT treatment и допустимая точность полного калькулятора;
- реальные project/reference assets и право на публичные фактические подписи;
- production domain, canonical origin и sitemap activation.

## Block responsibilities

| Block | Русское описание и концепция | Назначение | Восприятие клиентом |
| --- | --- | --- | --- |
| Header / navigation | Минимальная навигация по продукту и самостоятельным инструментам | Дать быстрый доступ к визуальному результату продукта, конфигуратору, Referenzen, контакту и заявке; review-галерея доступна только в local/protected preview, а production Referenzen — только после публикации | «Я понимаю структуру сайта и главное действие» |
| Hero — `Markise wird Markenlicht.` | Существующая маркиза превращается в носитель светового бренда | За один экран объяснить продукт и результат | «Это визуально сильное обновление существующей маркизы» |
| Three principles | `Bestehendes weiterdenken`, `Markenlicht gestalten`, `Objektbezogen prüfen` | Зафиксировать философию продукта | «Подход разумный, индивидуальный и ответственный» |
| `Eine Fassade. Zwei Ansichten.` | Эмоциональное сравнение восприятия фасада | Объяснить, зачем нужна подсветка, без ROI-обещаний | «Я вижу эффект и смысл продукта» |
| `Engineered Precision` | Световой образ, граница светового поля и Aufmaß (обмер) | Показать инженерный контроль и проектную точность | «Это спроектированное решение, а не декоративный аксессуар» |
| `Konstruktion prüfen. Volant erneuern.` | Проверка конструкции и замена только волана | Снять страх полной замены и честно обозначить compatibility boundary | «Маркизу можно сохранить, если объект подходит» |
| Mini configurator | Интерактивный визуальный выбор оформления | Дать сравнить надпись без logo, с logo слева или с одинаковыми logo по краям | «Я вижу подходящее направление для своего объекта» |
| Mini assessment | Небольшая предварительная классификация без неподтверждённой цены | Показать, достаточно ли данных для первого review | «Я понимаю следующий шаг, но не получаю ложного расчёта» |
| `Ausgewählte Referenzen` | Небольшой набор подтверждённых реализованных проектов | Показать сопоставимые реальные объекты, их размещение и согласованный scope | «Я вижу, что решение уже реализовано в похожем контексте» |
| `Fragen.` | Короткий FAQ о совместимости, Stromweg (кабельный/электрический путь), согласованиях и нужных материалах | Закрыть оставшиеся возражения | «Основные риски предусмотрены без необоснованных обещаний» |
| `Projekt prüfen lassen` | Предельно короткий первый контакт без анкеты | Дать начать диалог, не превращая интерес в технический бриф | «Оставить заявку легко; детали можно уточнить позже» |
| Footer | Двухчастное завершение: световая бренд-полоса и служебная строка | Завершить страницу, закрепить образ бренда и дать обязательные ссылки | «Сайт завершённый, продуманный и ответственный» |

## Target homepage structure

Главная отвечает на новый вопрос в каждом следующем блоке:

1. **Что это?** — Hero.
2. **Каков основной подход?** — полоса трёх принципов.
3. **Почему это визуально интересно?** — `Eine Fassade. Zwei Ansichten.`.
4. **Как это проектируется?** — `Engineered Precision`.
5. **Подойдёт ли существующая маркиза?** — объединённый Eignung.
6. **Как это может выглядеть?** — мини-конфигуратор.
7. **Где это уже реализовано?** — карточки `Ausgewählte Referenzen`, только когда доступны четыре
   подтверждённых проекта.
8. **Какие остаются вопросы?** — `Fragen.`.
9. **Что сделать сейчас?** — `Projekt prüfen lassen`.

Целевой порядок production landing:

1. Header.
2. Hero.
3. Three-principle strip.
4. `Eine Fassade. Zwei Ansichten.`.
5. `Engineered Precision`.
6. `Konstruktion prüfen. Volant erneuern.`.
7. Visual mini-configurator with preliminary assessment.
8. `Ausgewählte Referenzen` preview.
9. `Fragen.`.
10. `Projekt prüfen lassen`.
11. Footer.

## Header and navigation

### Current desktop navigation

Local/protected review: `LICHTSAUM · Produkt · Konfigurator · Referenzen · Kontakt ·
[Projekt prüfen lassen]`.

Production до валидного `published`: `LICHTSAUM · Produkt · Konfigurator · Kontakt ·
[Projekt prüfen lassen]`.

После валидного `published`: `LICHTSAUM · Produkt · Konfigurator · Referenzen · Kontakt ·
[Projekt prüfen lassen]`.

| Label | Target | Decision |
| --- | --- | --- |
| `Produkt` | `/#wirkung` | Owner decision: `Eine Fassade. Zwei Ansichten.` is the menu destination |
| `Konfigurator` | `/#konfigurator` | Replace `Varianten` and `Kosten` |
| `Referenzen` | `/referenzen` | Show in local/protected review; show in production only for a valid `published` registry |
| `Kontakt` | `/kontakt` | Keep as the direct contact-information route |
| `Projekt prüfen lassen` | `/#projekt-pruefen` | Keep as separate primary CTA |

Changes from the current menu:

- remove `Eignung` and `FAQ` from the global header; both sections remain in the homepage flow;
- point `Produkt` to the owner-selected transformation section `#wirkung`;
- keep `Referenzen` as a direct route without exposing review concepts in production;
- add the dedicated `Kontakt` route without turning it into the primary CTA;
- do not hide `Konfigurator` and `Referenzen` inside a dropdown while the menu remains this small.

### Mobile navigation

The implemented mobile header uses:

- LICHTSAUM brand link;
- menu button;
- accessible menu containing the same three production links before publication or four links
  after Referenzen publication; local/protected review also shows all four links;
- primary CTA inside the open drawer;
- Escape close, focus containment while open and focus return to the trigger.

### Contact route composition

`/kontakt` is a dedicated direct-contact route with one architectural map scene rather than a
duplicate legal-page layout. It contains:

- one local static SVG map of Western and Central Europe derived from Natural Earth 1:10m;
- one uniform Germany fill without internal administrative boundaries and a simple Berlin label;
- the verified e-mail and telephone numbers from central site configuration;
- the existing `Projekt prüfen lassen` CTA and a quiet link to provider details in `/impressum`.

The contact route deliberately omits the street address, because the exact legal address remains
available in `Impressum`. It also omits service, delivery, measurement, installation and electrical
regions. The Berlin marker indicates the verified starting point only. No fill, point or line may
be presented as a service boundary until the owner confirms the actual geography and the claims
register is updated. The SVG is local and static: no map vendor, tracking request, consent category
or new client boundary is introduced.

## Mini-configurator on the homepage

### Status

Phase 1: `Decision / implemented in the local prototype`. Этот этап заменяет прежние варианты и
`Kosten` в пользовательском сценарии. Короткая перестройка главной также реализована; отдельный
маршрут полного конфигуратора остаётся последующим этапом.

### Job

Answer one question: `Wie könnte es an meiner Fassade aussehen?` — «Как это может выглядеть на
моём фасаде?»

### Implemented phase-1 contract

- one large visual scene;
- one `Komposition` popup with `Nur Schrift`, `Logo links` and `Logo beidseitig`;
- one geometrically centred inscription in every mode; logo choices do not shift its centre;
- one left or two symmetric placeholder geometric marks in their own edge safe zones; their
  physical height equals the entered letter height until real logo handling is designed;
- no `Segmentiert` mode until a verified construction model and separate per-segment text inputs
  are designed for the full configurator;
- eight locally hosted OFL typefaces, including narrow, serif, humanist and conceptual directions;
- real `Volantbreite`, `Volanthöhe` and `Buchstabenhöhe` values in millimetres;
- six awning colours, two light colours and one fixed `Nacht` preview state without a view selector;
- exact selected-font measurement in the browser, followed by pure millimetre geometry;
- explicit errors when the letter height exceeds the valance height or the complete composition
  crosses the horizontal safe area; no hidden auto-fit;
- short preliminary state `Bereit für die ausführliche Konfiguration` only after valid geometry;
- continuation action `Ausführlich konfigurieren`; in phase 1 it persists the transferable state
  and honestly reports that the full route follows after module approval;
- primary page CTA remains `Projekt prüfen lassen`.

The scene keeps a stable responsive outer SVG for the page composition and a nested SVG whose
`viewBox` equals the physical valance width and height. This preserves the real proportion while
the visible scene adapts from 320 to 1920 CSS px.

### Remove until justified

- `Kostenrahmen` language;
- an empty result dash;
- `Ohne Berechnung`;
- a price or formula not supported by real estimates;
- controls that do not change preview, classification or next action;
- decorative segment division without independent, technically justified segment inputs;
- contact gating used only to reveal a preliminary number.

### Allowed preliminary states

- `Bereit für die ausführliche Konfiguration`;
- `Weitere Angaben erforderlich`;
- `Eingaben korrigieren`.

These states are workflow classifications, not compatibility, price, timing or production
commitments.

### Asset boundary

The phase-1 base scene is the dedicated parametric front-view SVG. It is deliberately not a
customer facade, completed-project image or production drawing. A customer upload, photograph
render, AI transfer or real logo asset requires a separate technical, privacy, rights and product
decision; the homepage mini-configurator must not imply that a preview has been approved for
production.

### State transfer boundary

The homepage writes only a versioned non-personal configuration object to `sessionStorage` under
`lichtsaum:mini-configurator:v2`. The payload contains composition mode, text, font id, the three physical
measurements, colour ids and the fixed `night` preview mode. It contains no contact details, uploaded media, URL
parameters or analytics data. A future full configurator may read and migrate this contract, but
phase 1 does not create the route or claim that a calculation has occurred.

## Full configurator route

The full configurator should not be only a client-side widget. An indexable version requires:

- unique German title, description, canonical and H1;
- server-rendered explanation of what the tool does;
- confirmed input and output boundaries;
- clear price/VAT/exclusion treatment when prices become approved;
- incompatibility and manual-review paths;
- accessible interaction and validation;
- CTA to the same project-review journey;
- useful content distinct from the homepage.

Non-personal preview selections may be transferred to the full tool. If URL parameters are used,
they must not contain PII, must not create indexable duplicates and must canonicalize to the clean
route. Parameter variants do not belong in the sitemap.

The later public price estimator remains gated by the validation criteria in
[`../strategy/go-to-market-and-landing-brief.md`](../strategy/go-to-market-and-landing-brief.md).

## References gallery

### Implemented registry contract

`src/content/references.de.ts` is the only activation point. Its discriminated registry has three
states:

| Status | Items | Homepage / route / navigation | Index policy |
| --- | --- | --- | --- |
| `awaiting-assets` | exactly an empty array | Section returns `null`; `/referenzen` returns `404`; no menu item | Not indexable |
| `review` | exactly four complete real projects or labelled concept visuals | Visible only in local development or preview; route exists there; no public menu item | Strict `noindex`; preview must remain access-controlled |
| `published` | exactly four complete, publicly approved projects | Section, `/referenzen` and menu item are enabled | Indexable only when the central production indexing gate also passes |

Every item requires a stable slug `id`, one unique Stitch layout slot, context, title, accurate
caption, local `src`, intrinsic width and height, contextual German `alt`, focal point, asset kind
and permission status. `review` may use `concept-visual` only with `review-only`; `published`
requires `real-project` and `public-approved` for all four items. Runtime validation fails closed
for missing or duplicate slots, invalid copy/media data and any concept/unapproved publication.

`noindex` is not access control. The current generated concepts contain no private customer data and
are owner-authorised for this local review, but any preview deployment must still follow the
repository environment policy and remain protected.

### Homepage preview

- current local review: exactly four persistent `Konzeptvisualisierung` cards with explicit copy
  that they are AI-generated and not completed LICHTSAUM projects;
- public state: exactly four cards only after real cases and publishing rights exist;
- different placement contexts rather than another day/night comparison;
- no reuse of the `Klassisch / Modern / High-Tech` categorisation as a second variants system;
- photographs of real objects, with an editorial visual treatment consistent with the brand;
- concise factual captions about project scope and placement;
- two tall outer cards and two stacked centre cards on desktop; one column on mobile and two on
  tablet;
- a crawlable `Alle Referenzen ansehen` link;
- each card is a real link to the matching anchored section of `/referenzen`, even when
  JavaScript enhances it into a modal.

### Route model

The gallery has one potentially indexable URL:

```text
/referenzen
```

The cards on the homepage may use anchors such as
`/referenzen#restaurantfassade`. These anchors identify a section on the same gallery page and do
not create separate index targets. Each corresponding section is present in the server-rendered
HTML of `/referenzen`.

### Page composition

`/referenzen` is one scrollable gallery page, not a paginated sequence of project URLs. The
implemented route renders one anchored section per validated registry item. Each section
contains:

- an `id` used by a homepage anchor;
- a meaningful H2 in German;
- an accurate context label in German;
- its standard HTML image with responsive sizes;
- a concise accurate caption and contextual German alt text;
- an explicit `Konzeptvisualisierung` disclosure whenever the item is not a real project.

The page ends with the existing project-check journey and footer. Additional grouping or category
routes are not introduced before the real material proves a useful editorial structure.

### Publication boundary

- `Referenzen` means real completed projects and requires confirmed project facts, client/privacy
  review and publication rights.
- Reference assets are photographs of real objects. Colour grading, monochrome treatment, crop and
  graphic overlay may support the editorial system, but may not change the factual meaning of the
  object, simulate an unobserved installation or imply an unverified result.
- Concept material may enter only the non-public review scaffold, with persistent disclosure. It is
  never a Reference, evidence item or valid input for `published`.
- Until all four required real projects, facts and permissions are complete, do not expose a public
  `Referenzen` page, header link, homepage heading or empty gallery space.

## SEO-safe modal model

### Principle

Google indexes URLs and content reachable through crawlable links. It should not be required to
click a button or reproduce a modal state to discover the gallery.

Each homepage card remains a native link to the one gallery page and its matching section:

```html
<a href="/referenzen#restaurantfassade">…</a>
```

The interaction is progressive enhancement:

1. The homepage server HTML contains the card, image and real `href`.
2. When JavaScript is available, the click may open the matching image inside a modal over the
   homepage.
3. Without JavaScript, in a new tab or on direct navigation, the visitor reaches the matching
   anchored section of `/referenzen`.
4. After publication, Googlebot receives the complete server-rendered `/referenzen` page and all
   its gallery media; the current `awaiting-assets` state returns `404`.
5. The modal does not require its own URL, canonical or sitemap entry.

### Modal accessibility

- visible close control;
- Escape close;
- focus moves into the dialog and returns to the triggering card;
- focus cannot move behind an open modal;
- previous/next controls have accessible names;
- closing the dialog does not alter the destination URL of the fallback link;
- reduced-motion behavior does not delay content access.

### Avoid

- `div` or `button` as the only way to reach the gallery;
- fragments that load unique gallery content only through JavaScript;
- modal-only content with no full-page equivalent;
- client-only image fetch as the sole discovery path;
- adding thin parameter/filter/modal states to the sitemap.

## Image Search requirements

For `/referenzen`:

- use standard HTML image output with a discoverable `src`;
- do not rely on CSS background images for meaningful media;
- keep meaningful images in server-rendered HTML;
- provide concise German alt text based on visible content;
- place images near relevant headings and captions;
- use stable, short and descriptive filenames;
- provide responsive sizes and intrinsic dimensions/aspect ratios;
- expose only rights-cleared or owner-approved assets;
- allow Googlebot to fetch production pages and image resources;
- include only substantive canonical pages in the sitemap;
- consider image sitemap entries when the collection is large or discovery needs support.

No implementation can guarantee indexing in Google Search or Google Images.

## Index policy

| URL type | Index policy | Conditions |
| --- | --- | --- |
| `/` | Index | Production `GO`, useful final content, canonical and release gates pass |
| `/kontakt` | Index after the central production gate passes | Verified contact data, truthful geography, unique metadata, self-canonical and sitemap inclusion |
| Full configurator | Index only when substantive | Useful server HTML, validated intent and stable functional value |
| `/referenzen` | Local review `200/noindex`; production `404`; index only after valid publication | Exactly four real projects, public permissions, factual copy, accessible images and central production indexing gate |
| Fragment, filter and modal-only states | No separate index targets | Clean canonical; exclude from sitemap |
| Preview/staging | Noindex and access-controlled | Never exposed as production canonical |

## Internal linking

- Header uses absolute home anchors for `Produkt` and the homepage configurator, adds `/kontakt`,
  and adds the clean gallery URL only after valid publication.
- The contact route links directly to the homepage project-check and to provider details in
  `/impressum`.
- The homepage references preview includes a descriptive text link to its full page when active.
- Homepage reference cards link to anchored sections of `/referenzen`.
- The gallery page links to the relevant project-check entry.
- Footer may repeat published destinations, but does not replace header or contextual links.
- All internal links point directly to canonical URLs and use meaningful anchor text.

## Questions and minimal project contact

To preserve a short marketing flow:

- move construction details already covered by Eignung out of a separate `Projektgrenzen` block;
- use the short visible heading `Fragen.` rather than `Häufige Fragen vor der Projektprüfung.`;
- move Strom, permission and responsibility objections into `Fragen.` and concise form guidance;
- remove the public empty `Nachweise` placeholder until real evidence exists;
- fold the decision value of `Alternatives` into one FAQ such as
  `Wann ist ein Leuchtvolant nicht die passende Lösung?`;
- do not reintroduce CTA or input rows removed from Eignung.

`Projekt prüfen lassen` is a low-friction contact block, not a questionnaire. Its initial state
contains only:

- required `E-Mail-Adresse`;
- optional `Telefonnummer`;
- optional short free-text field for context;
- one explicitly optional file selector for up to five existing photos, sketches, logos or PDFs;
- submit button and the required concise privacy notice/link.

Do not require dimensions, object type, a file, a multi-step wizard or marketing consent to send
the first request. The local prototype may validate up to five optional JPG, PNG, WebP or PDF files,
each up to 15 MB. On test submit they may reach the application runtime only for validation but
must not be persisted, accepted as a lead or forwarded to third parties. Image attachments receive local
thumbnails; PDFs receive a labelled file tile; every selected item can be removed before submit.
The selected items remain inside the same bordered selector surface, which replaces its empty state
with a compact responsive tile grid and one `Weitere Dateien` tile. Activating a production
upload remains blocked on the storage, retention, access-control, malware-handling and privacy
gates. Further materials may also
be requested after contact. The final production validation, anti-spam controls and privacy
wording remain subject to the existing form and compliance gates.

## Footer

The footer is intentionally two-part and uses the working spelling `LICHTSAUM` consistently.

1. **Upper brand strip.** A narrow horizontal band with no literal awning illustration. The
   centred `LICHTSAUM` wordmark illuminates when the visitor scrolls it into view. The effect is a
   restrained brand cue, not a second hero: once illuminated, it remains stable, respects
   `prefers-reduced-motion` and does not delay page content.
2. **Lower service strip.** A second, slimmer line holds only the crawlable `Impressum` and
   `Datenschutz` links. Both destinations are implemented with the owner-confirmed provider facts;
   contact details remain inside the legal pages rather than turning the footer into a utility box.

## Implementation sequence

1. **Implemented:** shorten the homepage, navigation and mobile menu; retain excluded source
   components without rendering them.
2. **Implemented:** add the typed registry, homepage position, server route, modal and fail-closed
   status gates.
3. **Implemented for visual review:** generate four independent concept images, label them on every
   card and route, activate local `review`, and verify desktop/mobile crop and interaction.
4. Obtain four original photographs, confirm their relation to four completed real projects,
   collect client/owner publication permission and verify the factual German copy.
5. Replace every concept in `review`, then repeat the Stitch comparison plus desktop/mobile crop
   and focal-point review on the originals.
6. Change to `published` only after runtime validation and the owner evidence review pass; this
   activates the homepage section, route and menu item together.
7. Validate SSR HTML, native links, metadata/canonical, sitemap inclusion, image discovery,
   keyboard flow, responsive behavior and Core Web Vitals.
8. Activate production indexing only after the existing release gates pass.
9. Treat the later full configurator route as a separate phase without price claims.

## Acceptance criteria

- The homepage remains understandable without opening a modal or running the configurator.
- Every important destination is reachable through a native crawlable link.
- In `awaiting-assets`, the homepage has no reference heading/space/link and `/referenzen` returns
  HTTP `404`.
- In `review`, the complete route is local/preview-only and strictly `noindex`; concept items are
  persistently disclosed and cannot validate as published references.
- In valid `published`, direct `/referenzen` returns `200`, and every anchored gallery link reaches
  its server-rendered project section without JavaScript.
- Modal viewing, refresh and open-in-new-tab do not gate access to gallery content.
- Indexable routes have unique metadata, H1, absolute self-canonical and useful server HTML.
- Thin UI/filter/modal states are excluded from sitemap and indexing targets.
- Images are discoverable, contextual and do not rely on CSS backgrounds.
- No PII enters URLs, analytics parameters or generic logs.
- No unapproved price, compatibility, installation, timing, warranty or project claim appears.
- Mobile navigation is fully visible and keyboard-operable without horizontal clipping.

## Official references

Last checked: 2026-08-02.

- [Google: Make links crawlable](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Google: JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google: URL structure best practices](https://developers.google.com/search/docs/crawling-indexing/url-structure)
- [Google: Image SEO best practices](https://developers.google.com/search/docs/appearance/google-images)
