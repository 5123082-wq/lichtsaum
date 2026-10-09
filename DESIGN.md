# DESIGN.md — CHISEL Architectural

Status: `Decision` with `TBD` brand/content inputs  
Last reviewed: 2026-08-11

Visual/accessibility/performance requirements remain design evidence and implementation contracts;
they do not decide publication. Concrete public actions follow
[`docs/architecture/publication-governance.md`](docs/architecture/publication-governance.md).

Этот файл — единственный источник истины по визуальной системе. Production UI может отклоняться
от Stitch только ради responsive behavior, accessibility, performance, content truth или
конверсии; отклонение должно быть осознанным.

<!-- AGENT_BRIEF:START -->
## Agent brief

- Owns: visual system, responsive behavior, accessibility, motion and performance evidence.
- Current: production UI follows the approved dark architectural direction. The mobile menu uses
  a Safari-safe right-anchored two-way 260ms drawer transition, a separately fading backdrop and
  one unchanged header wordmark; global input-modality handling prevents pointer-close focus
  styling while keyboard focus remains visible, and reduced motion removes lateral travel. Real
  Safari verification is open.
  The full configurator
  opens with a fixed technical concept background that fades into the left background while intro
  content and the calculator scroll upward. Inside the calculator, one full-width preview precedes
  three sequential sheets: an expanded panel and narrow labelled edges on desktop, stacked
  full-width panels on mobile. Large step introductions and the separate progress strip are removed;
  steps 01–02 navigate through sheet headers only and share a stable desktop height with aligned
  service/PLZ rows; forward navigation always opens the adjacent step.
  Step 01 repeats the homepage
  mini-configurator's three-group layout, step 02 keeps all service choices visible, and price plus
  specification appear only after both steps. Internal legal review markers are not part of the
  visual system.
- Current inquiry flow: mini and full configurators use a shared native dialog (desktop max 48rem,
  below 64rem full screen while editing, compact and centered after acceptance); submission feedback becomes visible and receives focus after pending
  settles, including retries. The homepage plain inquiry stays independent. The mini footer
  prioritizes price continuation with a two-button desktop row and price-first mobile stack,
  without routine captions below the buttons.
- Current Wirkung: three rich concept scenes now open a native image viewer;
  the original `Eine Fassade. Zwei Ansichten.` heading is retained; the revised images were published on 2026-10-05.
- Current hero: the homepage header overlays the raised image and gains its surface on
  scroll; the headline scrolls upward naturally, stays fully visible through 100px and fades by
  320px as the next block enters, earlier on phones. The image slowly drifts downward until the following sections
  fully cover its sticky stage, without a visible upward reversal, while the
  softly lit lettering becomes bright. Native CSS scroll timelines own motion in supported browsers;
  the fallback never compensates headline position. One cleaned derivative of the original PNG stays constant;
  a transparent SVG uses Hanken Grotesk 800 outlines with 0.12em tracking and one perspective
  transform. A crisp warm-white core and gradual halo use the footer light palette. Crop-aware image sizes and quality 90
  preserve the available source detail on Retina phones. Reduced motion keeps a static illuminated scene.
  Published on 2026-10-05; Chromium/WebKit production screenshots were reviewed.
  Release evidence and remaining real-device/field checks belong to `PROGRESS.md`.
- Open: working brand and remaining content inputs stay `TBD` where not owner-confirmed.
- Current palette: both configurators use ten fabric-inspired colours from one registry, with
  generic German names and no supplier identity. Legacy white drafts migrate to Naturweiß.
  Supplier independence and no copied fabric photos/striped designs are owner decisions (2026-10-04).
- Read full when: changing the visual system, major page composition or cross-route UI contracts.
<!-- AGENT_BRIEF:END -->

## Stitch provenance

- Project: `Premium Awning Website Prototype`
- Project ID: `13581496807405121738`
- Canonical screen: `12ee44ad855e416db92641282c2f7629`
- Comparison screen: `2f0e6006de024711837d861d19fc8e9f`
- Working title in screen: `Chisel Architectural - Премиальные Маркизы`
- Design system: `Architectural Solstice`

Берём из Stitch композицию, visual language и токены. Не берём сгенерированный HTML как
production foundation, абсолютные desktop-размеры, черновой текст и assets без проверки прав.

## Creative direction

Ключевые качества:

- architectural precision;
- premium restraint;
- high contrast;
- engineered rather than decorative;
- large-scale typography;
- photography as primary visual evidence;
- sharp, structural geometry.

Интерфейс должен ощущаться дорогим, точным и спокойным. Оранжевый используется как сигнал
действия, а не как декоративная заливка больших площадей.

## Tokens

### Color

| Token | Value | Role |
| --- | --- | --- |
| `background` | `#131313` | Основной canvas |
| `charcoal-deep` | `#0F0F0F` | Самый глубокий слой |
| `surface-low` | `#1C1B1B` | Вторичный фон |
| `surface` | `#201F1F` | Контейнер |
| `slate-gray` | `#2A2A2A` | Повышенный tonal layer |
| `surface-highest` | `#353534` | Активный/верхний слой |
| `text-primary` | `#E5E2E1` | Основной текст |
| `text-muted` | `#C7C6C5` | Вторичный текст |
| `architectural-orange` | `#FF5C00` | Primary CTA и focus |
| `marker-loop` | `#A33A31` | Рукописная обводка для редких редакционных акцентов |
| `error` | `#FFB4AB` | Ошибка |

Не использовать абсолютный чёрный/белый без необходимости. Проверять итоговый contrast по
фактическим парам цветов.

### Typography

- Display/headline/body: Hanken Grotesk, self-hosted WOFF2 после проверки лицензии.
- Technical labels/specifications: JetBrains Mono, self-hosted WOFF2.
- Fallback: system sans / system mono.

| Role | Desktop | Mobile | Weight | Line height |
| --- | --- | --- | --- | --- |
| Display XL | clamp до 120px | от 48–56px | 800 | плотный |
| Headline L | clamp до 64px | 32–40px | 700 | 1.1–1.2 |
| Headline M | 32px | 28px | 600 | 1.25 |
| Body L | 20px | 18px | 400 | 1.55–1.6 |
| Body M | 16px | 16px | 400 | 1.5 |
| Mono label | 12px | 12px | 500 | 16px |

Реализация использует fluid `clamp()`, а не фиксированное копирование размеров Stitch.
Длинные немецкие слова должны переноситься без разрушения layout.

### Brand mark

Status: `Decision` — canonical identity selected by the owner on 2026-08-10; trademark availability
remains a separate unresolved check.

- `public/brand/lichtsaum-mark.svg` is the only vector master and source of truth for the brand
  mark. `src/app/icon.svg` is the Safari-optimized browser derivative: it preserves the exact orange
  geometry but omits the near-black background so Safari can render it without an added light tile.
- The owner-approved solid orange architectural mark selected on 2026-08-10 is the sole approved
  LICHTSAUM identity. Its three orange fields form a rising diagonal light seam and right-hand
  vertical support on a near-black square. The master uses `#FF5C00` on `#11100F`; glow, gradients
  and raster softness are presentation effects and are not part of the canonical geometry.
- `lichtsaum-favicon-16.png` and `lichtsaum-favicon-32.png` use the same transparent browser
  treatment. `lichtsaum-mark-512.png`, `lichtsaum-instagram-1080.png` and
  `src/app/apple-icon.png` retain the canonical near-black background. These are format/context
  derivatives, not separate identities.
- Alternative logo candidates must not be stored in the production public tree. A future identity
  change requires a new explicit owner decision and coordinated replacement of every derivative.

### Spacing and grid

- Base unit: 8px.
- Container max: 1440px.
- Desktop outer margin: 64px.
- Tablet outer margin: 40px.
- Mobile outer margin: 24px; при 320px допускается 16px.
- Desktop grid: 12 columns, 32px gutter.
- Tablet: fluid 8 columns, 24px gutter.
- Mobile: 4 columns, 16px gutter.
- Major section rhythm: до 160px desktop; fluid reduction на tablet/mobile.

Контент не должен становиться тесным ради буквального совпадения со screenshot.

### Shape and depth

- Default radius: 0.
- Depth: tonal layering и тонкие low-opacity borders.
- Traditional drop shadows не использовать.
- Интерактивное состояние не должно зависеть только от цвета.

## Responsive rules

Разрабатывать mobile-first и проверять минимум:

- 320px;
- 390px;
- 768px;
- 1024px;
- 1280px;
- 1440px;
- 1920px.

Один и тот же semantic content должен быть доступен Google и пользователю на mobile и desktop.
Не удалять важный текст из mobile-версии. Горизонтальная прокрутка недопустима.

## Page composition

Текущий утверждённый порядок landing page:

1. Minimal navigation.
2. Hero `#produkt`.
3. Полоса трёх принципов.
4. `Eine Fassade. Zwei Ansichten.` (`#wirkung`).
5. `Engineered Precision` (`#praezision`).
6. Объединённый Eignung (`#eignung`).
7. Homepage mini-configurator (`#konfigurator`).
8. Публичная галерея между конфигуратором и FAQ показывает три реальные объектные фотографии и
   одну явно маркированную концепт-визуализацию.
9. FAQ (`#faq`).
10. `Projekt prüfen lassen` (`#projekt-pruefen`).
11. Footer with an illuminated wordmark strip, navigation, legal links, contact path and the
    current consent/data-flow status.

`Varianten`, `Ablauf`, `Projektgrenzen`, `Nachweise` и `Alternatives` не входят в текущий render.
Их исходные компоненты сохраняются до отдельного решения о перераспределении или удалении.

Дизайн не должен имитировать наличие контента, которого ещё нет. Empty proof blocks остаются
`TBD`, а не заполняются фиктивными логотипами, отзывами или цифрами.

## Components

### Footer

- Footer opens with one restrained horizontal `LICHTSAUM` wordmark strip. Its display size is about
  one third of the earlier oversized concept, so it reads as a quiet closing signature rather than
  another hero.
- The wordmark is dim on approach and gently increases in luminosity as a whole when at least one
  quarter enters the viewport. The opacity transition starts after a `1000ms` pause and runs over
  `1600ms`; there is no directional wipe, bright lamp-like flash, background light pool, loop or
  flicker.
- Under `prefers-reduced-motion` the wordmark is shown immediately in its illuminated end state.
- The illuminated end state uses a controlled neutral-warm light, visually approximating `4000 K`.
  It is brighter than the dim base wordmark but remains soft enough not to become a second CTA.
- The hero lettering uses this same light palette (owner decision, 2026-10-05): core `#FFF7EB`,
  close halo `#FFFAF2` at 60%, middle halo `#FFE0BA` at 43%, outer halo `#FFBE82` at 26%.
  The photo and its overlay still influence perceived brightness; this is a shared screen palette,
  not a measured product colour temperature. The hero SVG derives these colours from this rule.
- Only `Impressum` and `Datenschutz` remain below the wordmark as one quiet unboxed legal row.
  Product, studio, contact and prototype-status copy are not repeated in the footer.
- The local prototype shows that no optional analysis or marketing tags are active. A consent
  settings control appears only when a real optional data flow and CMP exist; no inactive control
  is simulated.

### Buttons

- Primary: orange background, dark text, mono label.
- Secondary: transparent, 1px light border.
- Minimum target: 44×44 CSS px.
- Состояния: default, hover, focus-visible, active, disabled, pending.
- Focus-visible должен быть заметнее hover.

### Links

- Crawlable navigation использовать как настоящие `<a href>`.
- Не заменять ссылки JavaScript-only click handlers.
- Подчёркивание/индикатор должен быть различим без одного только цвета.

### Inputs

- Visible label всегда присутствует.
- Placeholder не заменяет label.
- Required/optional обозначение понятно на немецком.
- Состояния: default, hover, focus, populated, error, disabled, pending, success.
- Ошибка связана с полем и доступна screen reader.

### Cards and technical lists

- Cards определяются grid, border и spacing, не тенями.
- Technical values используют mono только там, где это повышает смысл.
- Характеристики выводятся из подтверждённого data source.

### Navigation

- Desktop navigation минимальна.
- `Decision / local` — на главной меню располагается поверх hero без отдельной чёрной полосы.
  За первые `160px` прокрутки плавно появляется тёмная подложка с нижней границей
  и blur; возврат к началу снова раскрывает изображение. На остальных маршрутах подложка
  видна сразу. Верхний градиент hero сохраняет читаемость навигации над изображением.
- Approved information links are `Produkt` → `/#wirkung`, `Konfigurator` → `/konfigurator`,
  conditional `Referenzen` → `/referenzen` and `Kontakt` → `/kontakt`; `Projekt prüfen lassen`
  remains the separate primary CTA. `Eignung` and `FAQ` stay in the homepage flow but are not
  global-header items.
- `Referenzen` ведёт на публичный маршрут `/referenzen`; preview остаётся `noindex` по общей
  environment policy.
- Mobile header — одна строка высотой `72px`: логотип слева и кнопка меню справа; CTA и ссылки
  отсутствуют в закрытом состоянии.
- Открытое mobile menu использует нативный modal dialog и правую панель шириной `77vw`:
  нумерованные ссылки собраны в верхней части, а `Projekt prüfen lassen` закреплён оранжевой
  полосой снизу. Фон страницы остаётся видимым только в узкой затемнённой полосе слева.
- Mobile menu полностью keyboard-operable, удерживает/возвращает focus и закрывается Escape.
- Primary CTA остаётся заметным внутри открытого меню, но не занимает место в закрытом header.

### Contact scene

- `/kontakt` — самостоятельная иммерсивная сцена, а не продолжение шаблона юридических страниц.
  Полноэкранная карта Западной и Центральной Европы служит задним слоем страницы; государственные
  границы остаются тонкими, а Германия выделяется одним равномерным серым цветом без внутренних
  административных линий. Композиция не создаёт горизонтальную прокрутку на mobile или desktop.
- Берлин — единственный оранжевый географический фокус. Он обозначается простой выступающей
  прямоугольной плашкой и тонкой линией с точкой, без прицела, кольца или иных тревожных символов.
  Другие города и предполагаемые зоны обслуживания на карту не наносятся.
- Карта использует локальный статический SVG-asset без стороннего embed, cookies, network runtime
  или client JavaScript. Геометрия стран адаптирована из public-domain Natural Earth 1:10m;
  источник записан в `THIRD_PARTY_NOTICES.md`.
- Страница показывает только подтверждённые телефон и e-mail, Берлин как исходную точку и ссылку
  на проект-check. Точный адрес остаётся в `Impressum`; карта не рисует Liefergebiet
  (зону поставки), Montagegebiet (зону монтажа) или границы Brandenburg до подтверждения владельца.
- Motion ограничен однократным появлением карты; при `prefers-reduced-motion` она сразу показана
  в конечном статичном состоянии.

### Homepage mini-configurator

- `LICHTSAUM STUDIO` сохраняет структуру Stitch: широкий visual field сверху, затем три
  функциональные control-группы и строка состояния/действий.
- Visual field не использует фотографию фасада. Это компактный адаптивный параметрический SVG
  строго спереди: только фронтальный волан, световая надпись и размерные линии, без верхнего
  наклонного полотна маркизы.
- Внешний SVG сохраняет композицию сцены, внутренний physical SVG использует реальные ширину и
  высоту волана в миллиметрах. Пропорции не подменяются декоративной растяжкой.
- `Volanthöhe` принимает `200–300 mm` включительно, `Buchstabenhöhe` — `1–180 mm` включительно.
  Введённое невалидное значение остаётся видимым: интерфейс показывает короткую ошибку,
  `aria-invalid` и блокирует continuation CTA без автоматического исправления.
- На desktop controls образуют три равноправные колонки; на mobile они переходят в одну колонку
  без горизонтальной прокрутки. Минимальная ширина проверки — 320px. Порядок и смысл колонок:
  `01 Gestaltung` содержит сначала текст, затем выбор шрифта и внизу композицию/логотипы; `02 Maße` — только физические
  размеры и ошибки вместимости; `03 Farbe & Licht` — цвет волана и световой эффект.
- `Decision / local` — нижний action-блок содержит две кнопки: контурную `Entwurf anfragen`
  (запрос по эскизу) слева и оранжевую `Preis berechnen` (рассчитать цену) справа. От `48rem`
  они стоят в одном ряду одинаковой высоты `44px` с промежутком `12px`; правый край расчёта
  совпадает с правым краем CTA в шапке. Ниже `48rem` кнопки занимают всю ширину, расчёт идёт
  первым. По решению владельца от 2026-10-04 обе постоянные поясняющие строки под кнопками
  удалены. Схематический характер превью обозначен во вступлении к секции; индивидуальная
  проверка размеров и технического исполнения объясняется в диалоге заявки. Расчёт ведёт на
  существующий `/konfigurator` с переносом эскиза.
- На desktop все три колонки используют один control-grid rhythm: подпись, ячейка высотой `54px`
  и интервал `0.8rem` до следующего ряда. Это выравнивает реальные control-ячейки по горизонтали;
  пустой третий ряд в `Farbe & Licht` остаётся намеренным, пока для него нет подтверждённого
  параметра.
- Поле `Text auf dem Volant` — самостоятельная прямоугольная ячейка: оно заполняет ширину первой
  колонки, совпадает по высоте с числовыми полями и использует более светлую `surface`-подложку,
  чтобы отличаться от измерений.
- `Komposition` использует один компактный popup с вариантами `Nur Schrift`, `Logo links` и
  `Logo beidseitig`. Надпись сохраняет геометрический центр волана во всех вариантах; один или два
  одинаковых условных геометрических знака занимают отдельные безопасные зоны по краям. Высота
  условного знака равна введённой высоте букв до проектирования реальной обработки logo-файла.
  В закрытом состоянии trigger равен по высоте числовым полям и показывает только схему и название;
  пояснения к вариантам видны внутри открытого списка.
- `Markisenfarbe` использует такой же компактный listbox: закрытый trigger показывает выбранный
  swatch и название, а открытый список выводит десять цветовых вариантов в две колонки
  из общей тканевой палитры ниже. `Lichtwirkung`
  использует такой же компактный listbox: тёплый/нейтральный белый и RGB-палитру из красного,
  зелёного, синего, жёлтого, cyan и фиолетового. Закрытый trigger всегда показывает выбранный
  цвет и название; выбор меняет цвет световой надписи в preview.
- `Segmentiert` удалён из mini-configurator: без подтверждённой конструктивной модели и отдельных
  полей текста по сегментам он создаёт ложную функцию. Возможное возвращение относится к полному
  конфигуратору и требует отдельного технического решения.
- Восемь шрифтов загружаются локально в WOFF2 только по мере выбора. Основное SVG-превью обязано
  использовать тот же реально измеренный шрифт, который выбран в selector; отдельный образец под
  полем выбора не показывается.
- Выбор композиции и шрифта использует собственные тёмные listbox-popup в визуальной системе
  сайта, а не системный popup нативного `select`. Выбранный пункт получает цветовой и графический
  индикатор; меню поддерживают Escape, Home/End, Arrow Up/Down, закрытие при уходе focus, видимый
  focus и пункты высотой не менее `44px`.
- Невалидная физическая композиция получает текстовую ошибку, `aria-invalid`, error border и
  недоступный continuation CTA; интерфейс не уменьшает буквы и не ограничивает введённое значение
  молча.
- Preview всегда показывает ночную сцену со световым краем и glow-эффектом; пользователь не
  выбирает дневной/ночной режим. Glow не заменяет читаемый контур.
- Preview не использует отдельную фотографию, иллюстрацию, сплошную подложку или замкнутую рамку.
  Его область отделяет от секции только одна тонкая горизонтальная линия сверху; нижней и боковых
  границ нет. Высота scene viewport равна `357` при ширине `1600`, то есть на 15% компактнее
  прежнего формата `1600 × 420`. За параметрическим воланом находится нейтральный серый
  полупрозрачный слой с мягким blur и симметричным растворением в основной фон сайта по левому и
  правому краю; слой не должен восприниматься как самостоятельная карточка или прямоугольная панель.
- Волан остаётся плоским цветовым полем в точном прямоугольном физическом контуре. Не добавлять
  имитацию ткани, складки, швы, линии натяжения и иной декоративный рельеф.
- Световая композиция состоит из читаемого ядра, узкого glow и слабого отражения на ткани.
  Изменение физических размеров и света получает короткую `transform`/opacity-анимацию около
  `220–240ms`; при `prefers-reduced-motion` она отключается. Постоянное мерцание запрещено.
- Блок не показывает цену, совместимость, сроки или готовый проект. Его нижняя часть содержит
  две кнопки и только необходимые сообщения об ошибках.

### Fabric-inspired configurator palette

- `Decision` — owner instruction, 2026-10-04: existing plain fabric colours may inform the
  background palette. Use our generic German colour names, without copying collection names or
  presenting a colour as a particular supplier's fabric. Research references do not select a
  supplier, confirm availability or establish an exact material match.
- `Decision` — do not copy third-party fabric photographs or striped designs into the product.
  Any later striped option needs an independently drawn schematic with its own stripe spacing
  and proportions, plus confirmation against the actual supplier's available fabric.
- `Verified` — mini and full configurators share the colour registry in
  `src/features/mini-configurator/options.ts`. Its ten colours are defined only there; the
  schematic preview applies an 8% black overlay and a separate light spill. Perceived colour
  therefore differs from the picker swatch, even before screen and ambient-light differences.
- `Decision / Verified` — owner approved implementation on 2026-10-04. The eight base colours
  and both extensions (Schwarz and Terrakotta) are available in the shared picker. These remain
  schematic colour directions, not a confirmed fabric assortment. Existing persisted IDs are
  retained; the retired `white` ID maps to `cream-white` (Naturweiß) in both storage parsers
  and both server submission boundaries, preserving drafts and older open clients.

| Role | Generic German label | Meaning | Approximate screen colour |
| --- | --- | --- | --- |
| Base | Naturweiß | Тёплый естественный белый | `#E8DED3` |
| Base | Sandbeige | Светлый песочно-бежевый | `#D6C6B9` |
| Base | Taupe | Тёплый серо-коричневый | `#7B7168` |
| Base | Hellgrau | Светлый серый с тёплым подтоном | `#A29A97` |
| Base | Graphit | Средне-тёмный графитовый | `#5F5F61` |
| Base | Nachtblau | Глубокий тёмно-синий | `#27283C` |
| Base | Waldgrün | Глубокий лесной зелёный | `#153F3A` |
| Base | Bordeaux | Глубокий бордовый | `#580C11` |
| Extension | Schwarz | Чёрный | `#0E0E0E` |
| Extension | Terrakotta | Кирпично-красный | `#8D352C` |

`Verified` — visual research on 2026-10-04 used
[Rollo Rieper's fabric page](https://www.rollorieper.de/markise/markisentuch.html) to identify
real fabric collections, then the manufacturer’s
[plain-fabric gallery](https://www.dickson-constant.com/de/orchestra-grege-6020.html) and
[fabric simulator](https://www.dicksondesigner.com/de/design-studio) to check colour families.
Approximate HEX values were obtained from the per-channel median of the central 50% of eleven
manufacturer web photographs: ten small swatches (83 × 59 px) and one large photograph
(680 × 480 px). Eight form the base palette and two the extension; the remaining
orange sand reference was excluded from the neutral group. No photographs were added to the
repository or product. These are uncalibrated screen approximations, not physical colour
measurements, RAL matches or guarantees of the delivered fabric's appearance.

Both configurators use one palette, preserve compatible saved colour IDs and retain the
existing flat schematic geometry. Graphit remains the default through the `anthracite` ID.
Do not attach manufacturer names, article numbers, certifications or availability claims to
customer selections. Final material and colour need confirmation using the actual supplier's
physical sample; colour of the awning frame and colour of the fabric are separate concepts.

### Full configurator `/konfigurator`

- The full tool is a separate, indexable, German page. Its server-rendered introduction and H1
  remain useful before client hydration; the interactive calculator progressively enhances that
  content.
- The introduction is a scroll scene: a large technical concept visual is anchored on the right,
  fades into the left background and remains fixed as the upper-block background while the H1 and
  short explanation move upward naturally; the calculator surface covers it from below and the
  visual is hidden after the intro leaves the viewport. The asset is labelled
  `Konzeptvisualisierung / Aufmaß` and is not presented as a completed project.
- The flow has three numbered steps: `Grundkonfiguration`, `Weitere Optionen` and
  `Preis & Projektanfrage`. The schematic preview spans the calculator width above the controls;
  three sequential sheets follow below it. From 64rem, the active sheet expands and the other
  sheets remain visible as edges with a number, vertical label and directional arrow. The next
  sheet is 61.6px wide (+10%); the distant/previous companion is 50.4px (−10%). On step 03 both
  previous edges are 56px. Completed
  sheets sit on the left; upcoming sheets sit on the right. Below 64rem the same sheets stack as
  full-width rows, preserving input width and DOM order. A compact heading inside each sheet
  replaces the large step introduction and separate progress strip. The active header says `01 / 03`
  (or the current step); buttons expose current/expanded state and cannot bypass validation or skip
  the next step, including after revisiting earlier steps. Only active fields mount; configuration, services and postal code persist in
  wizard state. Desktop preview height and spacing let the default first step fit with its preview
  at 1440×900; mobile, zoom and longer/error states retain natural page scrolling.
- Sheet changes transfer focus to the active H2 without moving an already visible heading out of
  view; if the visitor has already focused a new field, delayed focus transfer does not interrupt input. An offscreen heading scrolls below the site header. Pointer changes use a 240ms directional
  transform/opacity entrance; keyboard and reduced-motion changes have no sheet movement. The
  preview remains outside the sheets and open pickers remain unclipped. Steps 01–02 navigate through
  sheet edges/headers, with no duplicate bottom forward/back buttons. The next available sheet gets an
  orange border, label and filled arrow, plus a hover tint on pointer devices; invalid inputs remove
  this accent and disable progression. The same cue appears on the horizontal mobile row. Previous
  sheet headers remain available for return; the final shared form keeps its submit action at the trailing edge.
- Step 01 is the homepage mini-configurator extended into the price flow, not a second layout
  system. It uses the same three functional groups and responsive order: `Gestaltung` contains
  inscription first, font second and composition/logo mode last (also the DOM/keyboard order);
  `Maße` contains the three physical dimensions;
  `Farbe & Licht` contains awning colour and light effect. Desktop shows three equal columns;
  mobile stacks the same groups without reordering them.
- Step 02 contains only manually calculated services and the optional object postal code. All six
  service choices are immediately visible without disclosure/burger interaction; desktop uses two
  columns and mobile one column. From 64rem, the postal-code field sits beside the service grid.
  The desktop layout uses three equal columns with matching gutters (services span two columns).
  Both groups use matching fieldset legends and spacing; the postal input aligns with the top row
  of service cells, and both use a 4.5rem minimum control height. Steps 01–02 share a minimum body
  height (24rem on narrower desktops, 22rem from 75rem). Their actual expanded body height is
  carried between steps so logo notes also retain the lower edge; viewport resizing or entering
  step 03 clears that measurement. These are minimum heights with natural growth, not clipping;
  mobile panels keep content-driven height. Both default sheets fit with the preview at 1440×900.
  An invalid postal code blocks the price step but never prevents returning to options to correct it.
- The preview remains a schematic front-view SVG. Uploaded logos, object photos and PDFs are
  attachments for manual review and never become simulated geometry in v1; logo modes keep the
  approved geometric placeholder.
- Controls keep visible labels, 44 px targets, visible focus and inline errors connected to their
  fields.
- The result uses the label `Vorläufiger Nettopreis` and always keeps the three limitations beside
  it: `zzgl. gesetzlicher Umsatzsteuer`, selected services are not included, and the result is not
  a `verbindliches Angebot` (обязательное предложение). The page visibly limits this presentation
  to `gewerbliche Projekte`. Neither the price nor the non-editable specification is rendered in
  steps 01–02; both first appear together in step 03 after the visitor completes the sequence.
- Before the shared contact fields, the visitor sees a non-editable summary of dimensions,
  inscription, font, composition, colours, requested services, panel allocation and the current
  server-confirmed net total. Configuration is changed in the earlier steps, not through hidden
  contact-form fields.
- Loading, font-measurement, invalid-geometry, calculation and stale-pricing states fail closed:
  price and submit remain unavailable until a current server result is explicitly confirmed.
- The contact block is an instance of the existing unified lead form, not a separate form system.
  It lives in the shared inquiry dialog. The existing submission overlay, error/focus behavior,
  optional attachments and success state remain consistent with the homepage form.

### Shared inquiry dialog

- Mini footer composition follows the homepage mini-configurator section above. Incomplete input
  blocks only price continuation and explains what to complete; it does not block the inquiry.
  Missing dimensions are omitted from
  the attached sketch and dimension lines are hidden in its schematic modal preview.
- Full step 03 retains specification, price and edit controls. Its orange `Konfiguration anfragen`
  beside the price opens the shared dialog; the inline contact form is removed.
- Native `<dialog>` uses the existing surfaces, border, typography and orange submit. At 64rem and
  above it is centered, at most 48rem wide and viewport minus 4rem high; below it fills 100dvh,
  including safe-area padding and internal scrolling for a shortened keyboard viewport.
- Order: focusable title → compact schematic preview/summary → `Details anzeigen` (показать детали)
  → email/optional phone/message → optional files → privacy → submit. Full price retains VAT/scope
  disclaimers. Mini copy promises neither compatibility nor a price.
- Opening focuses the heading, never an input. Native focus containment, visible focus and Escape
  work; close/back return to the trigger. `Ändern` closes and focuses the configuration controls.
  Backdrop clicks do not dismiss. Closing restores page scrolling; drafts remain in memory.
- Pending disables close/edit and shows the existing brand spinner within the dialog layer.
  Reduced motion keeps the static mark.
- Owner decision, 2026-10-05: accepted success becomes a centered, content-height dialog, at most
  36rem wide with 1rem minimum viewport margins. The hidden form no longer contributes height.
  A small check, compact confirmation, supporting copy, receipt number and `Schließen` (закрыть)
  fit without scrolling at standard desktop/mobile viewports. Short or zoomed viewports retain
  internal overflow access. Close button, cross and Escape return focus to the configuration;
  no repeat-inquiry button or bottom return link is shown. Reopening retains the receipt.
- When pending ends, validation errors, unavailable/test results, updated-price confirmation and
  accepted success receive focus and are scrolled into view immediately. An unchanged retry does
  this again; feedback cannot receive focus while its form entry is inert. Uploading alone does
  not focus an empty result. This behavior also applies to the independent homepage form.
- Homepage final form keeps its existing two-column desktop composition and independent draft.

### References gallery

- По решению владельца от 2026-08-10 галерея публична и использует три реальные объектные
  фотографии и одну концепт-визуализацию. Она не утверждает, что показанные объекты являются
  выполненными проектами LICHTSAUM.
- Концепт-визуализация всегда имеет видимую маркировку `Konzeptvisualisierung` на карточке,
  странице и в modal.
- Публичная композиция повторяет Stitch: две высокие крайние карточки и две карточки одна над
  другой в центральной колонке. Mobile использует одну колонку, tablet — две, desktop — сетку
  `3 × 2`.
- На touch подпись и затемнение видны постоянно. На устройствах с точным указателем hover и
  `focus-visible` дают мягкий zoom изображения, затемнение и появление подписи снизу.
  `prefers-reduced-motion` отключает zoom и перемещение текста.
- Каждая карточка остаётся настоящей ссылкой `/referenzen#project-id`. Обычный click может открыть
  нативный modal dialog без изменения URL главной; modified click, новая вкладка, отсутствие
  JavaScript или недоступный dialog API ведут на серверную страницу.
- Modal имеет видимые Close и Previous/Next, поддерживает Escape и стрелки клавиатуры, удерживает
  focus нативной modal-семантикой и возвращает его на исходную карточку. При увеличении текста и
  низком viewport содержимое прокручивается внутри поверхности, а не обрезается.
- `published` требует `permission: public-approved` для каждого изображения, но допускает
  `concept-visual` при постоянном disclosure. Концепт не является доказательством выполненных работ.
- Desktop/mobile композиция и текущие focal points проверяются на фактически опубликованных
  изображениях.

### Marker loop

- Стандартная форма — три неравномерных овальных прохода с видимым пересечением и свободным
  хвостом. Она должна восприниматься как быстрый жест маркером, а не как аккуратная UI-рамка.
- Базовый цвет — `marker-loop` (`#A33A31`). `architectural-orange` остаётся цветом действий и
  focus, поэтому не используется для стандартной обводки.
- Основное применение на landing — большой signature loop вокруг слогана из двух строк:
  `Tagsüber Marke.` в `warm-white` и `Nachts Markenlicht.` в `architectural-orange`. Слоган
  остаётся доступным HTML-текстом, использует self-hosted `Caveat Variable`, weight 400, и не
  заменяется SVG или растровым изображением. На desktop текстовый блок центрируется относительно
  фотографии `01` и по вертикали в неизменном промежутке между фотографиями `01` и `03`;
  фотографическая сетка при этом не перестраивается. Большая обводка остаётся тонкой и компактной,
  не пересекает соседние фотографии и может свободным краем выходить влево за контентную границу.
  В утверждённом desktop-варианте Caveat-текст увеличен на 20%, а обводка растянута только по
  высоте до свободного охвата обеих строк при неизменной ширине; mobile сохраняет более компактный
  исходный масштаб.
- После объединения прежних блоков Retrofit и Eignung компактный loop перенесён на короткий
  mono eyebrow `EIGNUNG`. По отдельным решениям владельца такой же акцент применён к eyebrow
  `PRODUKT` перед заголовком `#wirkung`, к `VISUELLER MINI-KONFIGURATOR` и к первой
  малой строке фотогалереи (`TEMPORÄRE VORSCHAU` в local review, `REALISIERTE PROJEKTE` после
  публикации), к короткому eyebrow `FAQ` перед заголовком `Fragen.`, а также к финальному
  `PROJEKT-CHECK`: все подписи остаются HTML-текстом JetBrains Mono в `architectural-orange`, а
  жест — только декоративным фоном. Наряду с большим signature loop это единственные
  согласованные marker-акценты на landing.
- Другие eyebrow, подписи, CTA и соседние блоки не получают loop автоматически. Повторное
  применение требует отдельного визуального решения, а не включения глобального декора.
- Не обводить CTA, поля формы, длинные наборные заголовки и несколько соседних блоков.
- Обводка декоративна и не несёт смысловой нагрузки: доступный текст остаётся обычным HTML,
  изображение выводится через CSS mask/pseudo-element и не попадает в accessibility tree.
- Production asset: базовая `/images/lichtsaum-marker-loop-mask.png` используется для большого
  слогана и всех согласованных компактных marker-eyebrows; desktop увеличивает только габарит
  контейнера слогана, сохраняя тот же жест.
  Это самостоятельная концепт-графика; предоставленный stock JPG с неизвестной лицензией
  используется только как визуальный референс и не публикуется.
- На mobile свободные края линии должны оставаться видимыми; обрезка рамкой или viewport
  недопустима. Применение не должно создавать горизонтальную прокрутку.
- На desktop после согласованного увеличения loop свободный край может выходить за контентную
  колонку и слегка заходить на фотографии; `.transformation__slogan` не обрезает декоративный
  pseudo-element.

## Image direction

- `Decision` — `#wirkung` сохраняет существующую сетку из трёх цветных сцен: `Klassisch`,
  `Modern`, `High-Tech`. После обратной связи владельца от 2026-10-04 изображения должны
  сохранять насыщенность старых кадров: детали архитектуры, людей, отражения и глубину улицы.
  Пустая упрощённая серия отклонена. Локальная новая серия переработана из старых кадров:
  исторический ресторан, современная каменно-деревянная фасада и городской стеклянно-металлический
  контекст. Надпись на волане усилена; в Modern приглушён декоративный свет.
- `Decision` — исходный заголовок `Eine Fassade. Zwei Ansichten.` сохранён по указанию владельца;
  задача просмотра и обновления изображений не включает изменение этого текста.
  Файлы, происхождение и точные prompts новой серии находятся в
  [`DesignPrototip/assets/lichtsaum-wirkung-series-2026-10-04.md`](DesignPrototip/assets/lichtsaum-wirkung-series-2026-10-04.md).
  Старые assets сохранены; визуальное одобрение новой серии и production release остаются открыты.
- `Verified locally` — карточка имеет постоянные disclosure `Konzeptvisualisierung` и значок
  увеличения. Обычный click открывает нативный modal с целым изображением (`object-fit: contain`),
  подписью и счётчиком. Previous/Next и клавиши Left/Right циклически переключают три сцены;
  Close, Escape и click по фону закрывают просмотр. Focus начинается на Close, Tab/Shift+Tab
  циклически обходят controls, закрытие возвращает focus на исходную карточку без скачка scroll.
  Modified click, отсутствие JavaScript или dialog API открывают реальный файл через `<a href>`.
  При 200% текста и коротком viewport поверхность прокручивается, Close остаётся сверху.
- `Verified locally` — 24 проверки Chromium/WebKit покрывают 320–1920 px, клавиатуру,
  fallback, reduced motion и axe с 200% текста. Real-device Safari остаётся непроверенным.
- Изображения, предоставленные владельцем проекта или прямо одобренные им для сайта, считаются
  разрешёнными к использованию в проекте. Исключение: AI-концепты внутри proof/reference-
  композиции всегда явно маркируются `Konzeptvisualisierung`, чтобы не имитировать выполненный
  проект.
- Для сторонних assets фиксировать owner/source/license, когда эти сведения доступны.
- Hero требует отдельного mobile crop.
- Использовать responsive AVIF/WebP с известными размерами.
- Не lazy-load LCP image; остальные изображения lazy-load.
- Meaningful images получают точный alt; декоративные — пустой alt.
- Не создавать вводящие в заблуждение before/after, reviews или installations.

## Motion

- Движение быстрое, точное и редкое.
- Default transition: около 200ms ease-out.
- Анимировать преимущественно opacity и transform.
- `Decision / local` — Hero показывает читаемый LICHTSAUM на воланте уже при входе: тёплый
  отдельный SVG-слой букв раскрыт на `35%` и плавно достигает полной яркости при прокрутке. Затемнение
  не гасит буквенную композицию; desktop-кадр поднят, а размер H1 учитывает высоту viewport.
  H1 находится в отдельном от media слое, естественно поднимается вместе со страницей и
  полностью виден до `100px`, затем плавно исчезает до `320px`. Его положение не компенсируется
  JavaScript-трансформацией. Media медленно смещается вниз внутри sticky-stage: до `192px`
  на desktop и `104px` на mobile. Движение растянуто до полного перекрытия следующими
  непрозрачными блоками — около `120svh` прокрутки на desktop и `110svh` на mobile;
  фон не разворачивается вверх, пока виден.
  Sticky-stage имеет нижний запас `40svh` на desktop и `60svh` на mobile, который не увеличивает
  высоту страницы. Hero имеет высоту `180svh` (desktop, минимум `72rem`) и `150svh` (mobile);
  mobile-кадр занимает `72svh` от верхней границы. Следующий блок начинает входить после около
  `20svh` прокрутки на desktop и `10svh` на mobile,
  до полного исчезновения H1, без длинной пустой паузы. В поддерживающих браузерах CSS root scroll
  timeline управляет transform только media и opacity текста, света и подложки меню. Подложка
  раскрывается за `160px`, свет — за `26svh`; повторно запускаемой CSS transition поверх них нет.
  В остальных браузерах используется requestAnimationFrame-fallback; CSS и JavaScript не управляют
  одной анимацией одновременно. Ни один режим не меняет позицию заголовка при прокрутке.
  `prefers-reduced-motion` получает статичный полностью светящийся кадр с видимым H1,
  без увеличенной scroll-distance. Один растровый фон подготовлен из исходного PNG `1672 × 941`
  с удалённой старой надписью и не меняется при усилении света. SVG содержит контуры Hanken
  Grotesk 800, межбуквенный интервал `0.12em` и единую перспективу плоскости маркизы.
  Чёткое световое ядро и плавно затухающий ореол используют палитру подвала, без фотографии,
  embedded raster и зависимости от шрифта. База preloaded с quality `90`;
  `sizes` учитывает полную ширину кадра (`128svh` на mobile, `max(263svh, 100vw)` на desktop),
  а не ширину видимой области. SVG загружается сразу. Происхождение и ограничения исходника —
  [`DesignPrototip/assets/lichtsaum-hero-layers-2026-10-04.md`](DesignPrototip/assets/lichtsaum-hero-layers-2026-10-04.md).
- Не вводить motion library без доказанной необходимости.
- `prefers-reduced-motion` отключает необязательное движение.
- Motion не должен задерживать content visibility или CTA.

## Accessibility evidence

- Цель: WCAG 2.2 AA.
- Один логичный H1, последовательная heading hierarchy.
- Semantic landmarks и skip link.
- Полная keyboard navigation.
- Visible focus.
- Контраст, 200% zoom и text reflow.
- Touch targets минимум 44×44px.
- Ошибки формы не зависят от цвета.
- Consent banner доступен с клавиатуры и screen reader.

## Performance evidence

- LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 на 75-м процентиле.
- Минимальный client JavaScript.
- Hero media, fonts и third-party tags входят в performance budget.
- Никаких autoplay background video в первой версии.
- Third-party embeds не входят в initial critical path.

## Conversion hierarchy

- Основная бизнес-конверсия: необязательный запрос предложения. В mini-configurator локальный
  визуальный приоритет получает переход к расчёту; он не создаёт заявку или новую конверсию.
- Secondary CTA: проекты/детали продукта.
- Contextual inquiry wording: mini `Entwurf anfragen` (запрос по эскизу), full
  `Konfiguration anfragen` (запрос по конфигурации), plain `Projekt prüfen lassen`.
- Успех формы подтверждается сервером.
- Dark patterns, искусственная срочность и неподтверждённые scarcity claims запрещены.

### Final project-check composition

- Финальный `Projekt prüfen lassen` — короткий контакт, а не техническая анкета. Обязательна
  только `E-Mail-Adresse`; `Telefonnummer`, короткая заметка и Dateien (файлы) визуально
  доступны, но явно optional.
- Desktop использует открытый контейнер с верхней/нижней линией и две равные смысловые колонки:
  `01 / Kontakt` и `02 / Dateien`. Обе колонки используют одинаковый заголовочный ритм; короткий
  H3 `Dateien anhängen.` визуально выравнивает selector с первым полем контакта. Отдельный
  поясняющий абзац не дублирует содержимое selector. Внутренняя тяжёлая card-рамка,
  sticky-sidebar, перечень
  будущих вопросов и сетка технических полей не используются.
- Верх секции использует marker-eyebrow `PROJEKT-CHECK`, короткий uppercase H2
  `Ihr Projekt.` и единственную строку справа: `E-Mail genügt. Dateien optional.`.
  Технические слова `Prototyp` и dev-status не выводятся в маркетинговом UI.
  На mobile всё переходит в один поток: intro → Kontakt → Datei → privacy/CTA.
- File selector — единая dashed-поверхность с Phosphor `Paperclip`, форматами и лимитом. Empty
  state имеет компактную высоту; после выбора он заменяется внутренней responsive-сеткой до пяти
  квадратных tiles и плиткой `Weitere Dateien`. Изображения получают thumbnail, PDF —
  отдельную `FilePdf`-плашку, каждый item показывает имя/размер и имеет доступную кнопку удаления.
  Разрешены JPG, PNG, WebP и PDF до 15 MB каждый; фактический production data flow описывается в
  `docs/legal/data-processing-and-consent.md` и не маскируется маркетинговым текстом.
- Submit и одна короткая нейтральная ссылка на `Datenschutzerklärung` завершают нижнюю полосу.
  CTA остаётся оранжевым, без marker-loop;
  ошибки имеют summary, inline text, `aria-invalid` и focus transfer.
- Pending-состояние после submit использует owner-approved полноэкранный overlay:
  страница затемняется и размывается, а в центре без видимого текста работает точный
  трёхчастный SVG-знак LICHTSAUM. За цикл `2.8s` он вращается, разбирается и собирается без
  overlap/overshoot; при `prefers-reduced-motion` знак остаётся собранным.
- Overlay немедленно блокирует повторное взаимодействие и scroll, а для screen reader сообщает
  обработку заявки без добавления видимой copy.

## TBD before final design

- Окончательное имя и логотип.
- Реальные product categories.
- География.
- Verified claims, specifications и proof.
- Номер телефона и контактный канал.
- CMP visual treatment.

## Design QA

- [ ] Сравнение с canonical Stitch screen.
- [ ] Mobile не является уменьшенной desktop-версией.
- [ ] Все состояния компонентов реализованы.
- [ ] Проверены contrast, keyboard, zoom и reduced motion.
- [ ] Hero/LCP media оптимизирован.
- [ ] Нет неподтверждённых visual claims.
- [ ] CTA и form flow работают без marketing consent.
