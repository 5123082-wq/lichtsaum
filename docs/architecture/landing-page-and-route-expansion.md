# Landing Page and Route Expansion Brief

Status: `Decision`; public references gallery and full configurator implemented locally
Last reviewed: 2026-08-11

> Publication controls in this brief are superseded by
> [`publication-governance.md`](publication-governance.md). Keep the technical and UX contracts;
> use `Спросить у пользователя` for actual publication, indexing, Ads and attachment choices.

Scope: homepage information architecture, navigation, compact/full configurator, application
gallery, modal routing and Search boundaries

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
- Первый этап мини-конфигуратора остаётся на главной: существующий `#kosten` полностью заменён
  блоком `#konfigurator` / `LICHTSAUM STUDIO`; ADR-015 subsequently adds the separate full route.
- Сцена мини-конфигуратора — компактный параметрический SVG в прямой фронтальной проекции: только
  световой волан без верхнего полотна маркизы, фасада и растровой фотографии.
- AI-визуализация, загрузка фотографии клиента и перенос SVG на фотографию отложены за границу
  первого этапа.
- Главная сокращена до Hero → principles → transformation → precision → Eignung → configurator →
  позиция галереи → FAQ → project check → footer.
- `Varianten`, `Ablauf`, `Projektgrenzen`, `Nachweise` и `Alternatives` исключены из render; их
  исходные компоненты пока сохранены.
- Навигация использует `/#wirkung` для `Produkt`, canonical `/konfigurator` для полного инструмента,
  conditional `/referenzen` и `/kontakt`; `Eignung` и `FAQ` остаются в homepage flow, но не в
  global header.
- Global `Konfigurator` navigation now targets the substantive `/konfigurator` route; the homepage
  `#konfigurator` remains the visual teaser and transfers only its non-personal session draft.
- Галерея реализована как data-driven registry со статусом `published`: три реальные объектные
  фотографии и одна постоянно маркированная концепт-визуализация публично одобрены владельцем.
- Публичная галерея использует нейтральное название `Ansichten` и не утверждает, что объекты были
  выполнены LICHTSAUM.

### Implemented locally on 2026-08-11

- `/konfigurator` is a separate server-rendered German route with a three-step calculator, one
  authoritative pricing version and the shared project-inquiry form.
- The route is added to the production-gated sitemap but no deployment, Search Console submission,
  GTM publication or Ads activation is authorized by this implementation.

### TBD

- slugs for any additional future route; `/`, `/konfigurator`, `/referenzen` and `/kontakt` are
  current decisions;
- consumer/B2C VAT presentation and legal release of the net-only calculator beyond the expressly
  commercial-project positioning;
- maximum panel count, physical joints and mounting gaps for technical compatibility approval;
- реальные project/reference assets и право на публичные фактические подписи;
- production release and sitemap activation on the already verified canonical origin.

## Block responsibilities

| Block | Русское описание и концепция | Назначение | Восприятие клиентом |
| --- | --- | --- | --- |
| Header / navigation | Минимальная навигация по продукту и самостоятельным инструментам | Дать быстрый доступ к визуальному результату продукта, конфигуратору, публичной галерее, контакту и заявке | «Я понимаю структуру сайта и главное действие» |
| Hero — `Markise wird Markenlicht.` | Существующая маркиза превращается в носитель светового бренда | За один экран объяснить продукт и результат | «Это визуально сильное обновление существующей маркизы» |
| Three principles | `Bestehendes weiterdenken`, `Markenlicht gestalten`, `Objektbezogen prüfen` | Зафиксировать философию продукта | «Подход разумный, индивидуальный и ответственный» |
| `Eine Fassade. Zwei Ansichten.` | Эмоциональное сравнение восприятия фасада | Объяснить, зачем нужна подсветка, без ROI-обещаний | «Я вижу эффект и смысл продукта» |
| `Engineered Precision` | Световой образ, граница светового поля и Aufmaß (обмер) | Показать инженерный контроль и проектную точность | «Это спроектированное решение, а не декоративный аксессуар» |
| `Konstruktion prüfen. Volant erneuern.` | Проверка конструкции и замена только волана | Снять страх полной замены и честно обозначить compatibility boundary | «Маркизу можно сохранить, если объект подходит» |
| Mini configurator | Интерактивный визуальный выбор оформления | Дать сравнить надпись без logo, с logo слева или с одинаковыми logo по краям | «Я вижу подходящее направление для своего объекта» |
| Mini assessment | Небольшая предварительная классификация без неподтверждённой цены | Показать, достаточно ли данных для первого review | «Я понимаю следующий шаг, но не получаю ложного расчёта» |
| `Ausgewählte Ansichten` | Три реальные объектные фотографии и одна раскрытая концепт-визуализация | Показать световую композицию в разных контекстах без заявления о выполненных проектах LICHTSAUM | «Я вижу возможные направления и контексты применения» |
| `Fragen.` | Короткий FAQ о совместимости, размерах, Stromweg (кабельный/электрический путь), согласованиях и нужных материалах | Закрыть оставшиеся возражения | «Основные риски предусмотрены без необоснованных обещаний» |
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
7. **Как это выглядит в разных контекстах?** — публичная галерея `Ausgewählte Ansichten`.
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
8. `Ausgewählte Ansichten` gallery.
9. `Fragen.`.
10. `Projekt prüfen lassen`.
11. Footer.

## Header and navigation

### Current desktop navigation

Current navigation: `LICHTSAUM · Produkt · Konfigurator · Referenzen · Kontakt ·
[Projekt prüfen lassen]`.

| Label | Target | Decision |
| --- | --- | --- |
| `Produkt` | `/#wirkung` | Owner decision: `Eine Fassade. Zwei Ansichten.` is the menu destination |
| `Konfigurator` | `/konfigurator` | Substantive full tool; homepage `#konfigurator` remains its teaser |
| `Referenzen` | `/referenzen` | Public gallery route in production; preview follows the global noindex policy |
| `Kontakt` | `/kontakt` | Keep as the direct contact-information route |
| `Projekt prüfen lassen` | `/#projekt-pruefen` | Keep as separate primary CTA |

Changes from the current menu:

- remove `Eignung` and `FAQ` from the global header; both sections remain in the homepage flow;
- point `Produkt` to the owner-selected transformation section `#wirkung`;
- keep `Referenzen` as a direct public route with persistent disclosure on concept material;
- add the dedicated `Kontakt` route without turning it into the primary CTA;
- use the direct canonical `/konfigurator` URL in desktop and mobile navigation;
- do not hide `Konfigurator` and `Referenzen` inside a dropdown while the menu remains this small.

### Mobile navigation

The implemented mobile header uses:

- LICHTSAUM brand link;
- menu button;
- accessible menu containing the same four public information links;
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
`Kosten` в пользовательском сценарии. Короткая перестройка главной и отдельный полный маршрут
`/konfigurator` реализованы локально; production release остаётся отдельным gate.

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
- hard local-prototype limits of `200–300 mm` inclusive for `Volanthöhe` and `1–180 mm` inclusive
  for `Buchstabenhöhe`;
- eleven awning colours and eight light colours from the shared option registry, plus one fixed
  `Nacht` preview state without a view selector;
- exact selected-font measurement in the browser, followed by pure millimetre geometry;
- explicit errors when a physical height crosses its configured range or the complete composition
  crosses the horizontal safe area; no hidden clamping or auto-fit;
- short preliminary state `Bereit für die ausführliche Konfiguration` only after valid geometry;
- continuation action `Im Konfigurator weiter`; it persists the transferable state and follows
  a crawlable link to `/konfigurator`;
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
`lichtsaum:mini-configurator:v2`. The payload contains composition mode, text, font id, the three
physical measurements, colour ids and the fixed `night` preview mode. It contains no contact
details, uploaded media, URL parameters or analytics data. `/konfigurator` migrates valid v2 data
into `lichtsaum:configurator:v1`; contacts, PLZ and files are never written to browser storage.

When the visitor explicitly submits a project inquiry, this visible snapshot may be attached to
the shared lead only under
[`unified-lead-form-contract.md`](unified-lead-form-contract.md). Configurator interaction alone
does not transmit the snapshot, notify a manager or create a conversion.

The implemented constraints and owner-supplied internal component-cost inputs are defined only in
[`configurator-calculation.md`](configurator-calculation.md). The current mini-configurator does not
execute or display that future cost model.

## Full configurator route

Status: `Implemented locally` on 2026-08-11.

The full configurator is not only a client-side widget. Its indexable route provides:

- unique German title, description, canonical and H1;
- server-rendered explanation of what the tool does;
- the confirmed input/output and geometry boundaries from
  [`configurator-calculation.md`](configurator-calculation.md);
- a server-reproduced `Vorläufiger Nettopreis` for commercial projects with adjacent VAT,
  services-excluded and non-binding wording under restricted claim CLM-029;
- incompatibility and manual-review paths;
- accessible interaction and validation;
- CTA to the same project-review journey and unified lead system defined in
  [`unified-lead-form-contract.md`](unified-lead-form-contract.md);
- useful content distinct from the homepage.

Non-personal preview selections are transferred through versioned session storage. Configuration
is never serialized into the URL. Tracking parameters preserve function and canonicalize to the
clean route; parameter variants do not belong in the sitemap.

The implementation does not certify technical compatibility or authorize consumer price
  advertising. Those remain validation/legal/Ads questions to show the user under
[`../strategy/go-to-market-and-landing-brief.md`](../strategy/go-to-market-and-landing-brief.md).

## References gallery

### Implemented registry contract

`src/content/references.de.ts` is the only activation point. Its discriminated registry has three
states:

| Status | Items | Homepage / route / navigation | Index policy |
| --- | --- | --- | --- |
| `awaiting-assets` | exactly an empty array | Section returns `null`; `/referenzen` returns `404`; no menu item | Not indexable |
| `review` | exactly four complete real projects or labelled concept visuals | Visible only in local development or preview; route exists there; no public menu item | Strict `noindex`; preview must remain access-controlled |
| `published` | exactly four complete, publicly approved images; concepts require disclosure | Section, `/referenzen` and menu item are enabled | Indexable only when the central production indexing gate also passes |

Every item requires a stable slug `id`, one unique Stitch layout slot, context, title, accurate
caption, local `src`, intrinsic width and height, contextual German `alt`, focal point, asset kind
and permission status. `review` uses `review-only`; `published` requires `public-approved` for all
four items and may include a disclosed `concept-visual`. Runtime validation fails closed for
missing or duplicate slots, invalid copy/media data and any unapproved publication.

`noindex` is not access control. The current generated concepts contain no private customer data and
are owner-authorised for this local review, but any preview deployment must still follow the
repository environment policy and remain protected.

### Homepage preview

- current public state: three real object photographs and one persistent
  `Konzeptvisualisierung` card;
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

### Publication evidence boundary

- The owner approved the current four images for public use on 2026-08-10. Public copy remains
  limited to what is visibly present and does not claim a LICHTSAUM project relationship.
- Reference assets are photographs of real objects. Colour grading, monochrome treatment, crop and
  graphic overlay may support the editorial system, but may not change the factual meaning of the
  object, simulate an unobserved installation or imply an unverified result.
- Concept material may be published only with persistent disclosure and is never project evidence.

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
| `/` | Index | Concrete indexing state is `Спросить у пользователя`; report content/canonical/QA evidence |
| `/kontakt` | Index after the central production gate passes | Verified contact data, truthful geography, unique metadata, self-canonical and sitemap inclusion |
| `/konfigurator` | Index after the central production gate passes | Useful server HTML, working authoritative calculation, CLM-029 scope wording and shared form |
| `/referenzen` | Public `200`; index after the central production gate passes | Four publicly approved images, factual copy, persistent concept disclosure and accessible images |
| Fragment, filter and modal-only states | No separate index targets | Clean canonical; exclude from sitemap |
| Preview/staging | Noindex and access-controlled | Never exposed as production canonical |

## Internal linking

- Header uses the absolute home anchor for `Produkt`, canonical `/konfigurator` for the full tool,
  `/kontakt`, and the clean gallery URL only after valid publication.
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
- state the local 200–300 mm valance-height and 180 mm maximum letter-height limits, including
  that fit uses the measured length of the selected typeface and inscription;
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

If a visitor has already used the mini-configurator, the form may add a visible removable summary
of that existing context without asking for the same values again. It remains the same lead form,
server intake and Google Ads business conversion; the binding rules live in
[`unified-lead-form-contract.md`](unified-lead-form-contract.md).

Do not require dimensions, object type, a file, a multi-step wizard or marketing consent to send
the first request. The form validates up to five optional JPG, PNG, WebP or PDF files, each up to
15 MB and 50 MB combined. Image attachments receive local
thumbnails; PDFs receive a labelled file tile; every selected item can be removed before submit.
The selected items remain inside the same bordered selector surface, which replaces its empty state
with a compact responsive tile grid and one `Weitere Dateien` tile. The implemented but disabled
production path uses server-authorized direct uploads to Private Vercel Blob and stores metadata in
Neon; malware, abuse, processor, email and privacy findings must be shown to the user before asking
which activation state to publish.
Further materials may also
be requested after contact. The final production validation, anti-spam controls and privacy
wording remain subject to the form/compliance evidence and the user's publication decision.

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
4. **Implemented by owner decision 2026-08-10:** publish the three supplied real object photographs
   and one disclosed concept visual; activate the section, route and menu item together.
5. Repeat desktop/mobile crop and focal-point review for any future replacement image.
7. Validate SSR HTML, native links, metadata/canonical, sitemap inclusion, image discovery,
   keyboard flow, responsive behavior and Core Web Vitals.
8. Present indexing evidence and ask the user whether to activate production indexing.
9. **Implemented locally:** add `/konfigurator`, migrate the mini draft, reproduce calculation and
   font metrics server-side, attach the visible snapshot to the shared form and keep every
   production/Search/Ads activation as an explicit user decision with the known evidence attached.

## Acceptance criteria

- The homepage remains understandable without opening a modal or running the configurator.
- Every important destination is reachable through a native crawlable link.
- In `awaiting-assets`, the homepage has no reference heading/space/link and `/referenzen` returns
  HTTP `404`.
- In `review`, the complete route is local/preview-only and strictly `noindex`.
- In valid `published`, including disclosed concept items, direct `/referenzen` returns `200`, and every anchored gallery link reaches
  its server-rendered project section without JavaScript.
- Modal viewing, refresh and open-in-new-tab do not gate access to gallery content.
- Indexable routes have unique metadata, H1, absolute self-canonical and useful server HTML.
- Thin UI/filter/modal states are excluded from sitemap and indexing targets.
- Images are discoverable, contextual and do not rely on CSS backgrounds.
- No PII enters URLs, analytics parameters or generic logs.
- The only displayed calculation claim is restricted CLM-029 on `/konfigurator`; no compatibility,
  installation, timing, warranty or project claim is inferred from it.
- Mobile navigation is fully visible and keyboard-operable without horizontal clipping.

## Official references

Last checked: 2026-08-02.

- [Google: Make links crawlable](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Google: JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google: URL structure best practices](https://developers.google.com/search/docs/crawling-indexing/url-structure)
- [Google: Image SEO best practices](https://developers.google.com/search/docs/appearance/google-images)
