# DESIGN.md — CHISEL Architectural

Status: `Decision` with `TBD` brand/content inputs  
Last reviewed: 2026-08-04

Этот файл — единственный источник истины по визуальной системе. Production UI может отклоняться
от Stitch только ради responsive behavior, accessibility, performance, content truth или
конверсии; отклонение должно быть осознанным.

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
8. Позиция галереи между конфигуратором и FAQ. В local `review` она показывает четыре явно
   маркированные временные концепт-визуализации; production остаётся скрыт до реальных Referenzen.
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
  quarter enters the viewport. Only opacity transitions over `1600ms`; there is no directional wipe,
  bright lamp-like flash, background light pool, loop or flicker.
- Under `prefers-reduced-motion` the wordmark is shown immediately in its illuminated end state.
- The illuminated end state uses a controlled cold white-blue light. It is brighter than the dim
  base wordmark but remains soft enough not to become a second CTA.
- Only `Impressum` and `Datenschutz` remain below the wordmark as one quiet unboxed legal row.
  Product, studio, contact and prototype-status copy are not repeated in the footer.
- The local prototype shows that no optional analysis or marketing tags are active. A consent
  settings control appears only when a real optional data flow and CMP exist; no inactive control
  is simulated.

### Internal legal review markers

- Unresolved Impressum/Datenschutz inputs are shown only in the non-indexable local/preview state
  as sharp yellow `Intern / vor Livegang` notes with a `2px` border and Russian owner-facing copy.
- These are operational annotations, not public legal design and not part of the production visual
  system. They remain next to the affected paragraph instead of forming one detached checklist.
- Each annotation carries `data-legal-review="required"`; production indexing fails closed until
  the complete set is resolved and the annotations are removed.
- Yellow is reserved for this internal review state. It does not replace architectural orange for
  CTA/focus and must retain sufficient contrast at 320–1920px and 200% zoom.

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
- Approved information links are `Produkt` → `/#wirkung`, `Konfigurator` → `/#konfigurator`,
  conditional `Referenzen` → `/referenzen` and `Kontakt` → `/kontakt`; `Projekt prüfen lassen`
  remains the separate primary CTA. `Eignung` and `FAQ` stay in the homepage flow but are not
  global-header items.
- `Referenzen` may appear for local/protected review while the route is visibly disclosed and
  `noindex`; production shows it only for a valid `published` registry.
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
- На desktop controls образуют три равноправные колонки; на mobile они переходят в одну колонку
  без горизонтальной прокрутки. Минимальная ширина проверки — 320px. Порядок и смысл колонок:
  `01 Gestaltung` содержит композицию, текст и выбор шрифта; `02 Maße` — только физические
  размеры и ошибки вместимости; `03 Farbe & Licht` — цвет волана и световой эффект.
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
  swatch и название, а открытый список выводит одиннадцать цветовых вариантов в две колонки,
  включая белый, кремово-белый, светло-серый, ночной синий и терракотовый. `Lichtwirkung`
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
  недоступный continuation CTA; интерфейс не уменьшает буквы молча.
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
- Блок не показывает цену, совместимость, сроки или готовый проект и заканчивается object-specific
  disclaimer.

### References gallery scaffold

- Галерея реализована как data-driven scaffold. По решению владельца от 2026-08-04 текущий статус
  `review` использует четыре временные KI-generierte Konzeptvisualisierungen (ИИ-концепт-
  визуализации), чтобы закончить и оценить композицию до получения реальных фотографий.
- Review-вариант виден только локально или в защищённом preview, имеет `noindex`, нейтральный
  заголовок `So wirkt die Galerie.` и постоянную маркировку `Konzeptvisualisierung` на каждой
  карточке. Он не называется реализованными проектами или публичными Referenzen.
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
- `review` допускает `assetKind: concept-visual` только с `permission: review-only`. Статус
  `published` по-прежнему требует ровно четыре `assetKind: real-project`, фактические немецкие
  подписи и публичные разрешения; runtime validation не позволяет опубликовать концепты.
- Desktop/mobile композиция и текущие focal points проверены на временных изображениях. После
  получения четырёх оригиналов визуальное сравнение со Stitch и crop-review повторяются; текущие
  концепты не являются доказательством выполненных работ.

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
  `PRODUKT` перед `Eine Fassade. Zwei Ansichten.`, к `VISUELLER MINI-KONFIGURATOR` и к первой
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
- Hero — управляемая прокруткой responsive-сцена: дневной кадр плавно переходит в вечерний с
  зажиганием светового волана, media смещается внутри sticky-stage, а следующий непрозрачный
  блок полностью перекрывает сцену. Desktop использует около `150vh` активной прокрутки; mobile —
  уменьшенный до `64svh` кадр с центром световой надписи около средней горизонтали viewport и
  укороченную сцену около `80vh`. Только
  `prefers-reduced-motion` получает статичный дневной кадр
  без увеличенной scroll-distance.
- Не вводить motion library без доказанной необходимости.
- `prefers-reduced-motion` отключает необязательное движение.
- Motion не должен задерживать content visibility или CTA.

## Accessibility gates

- Цель: WCAG 2.2 AA.
- Один логичный H1, последовательная heading hierarchy.
- Semantic landmarks и skip link.
- Полная keyboard navigation.
- Visible focus.
- Контраст, 200% zoom и text reflow.
- Touch targets минимум 44×44px.
- Ошибки формы не зависят от цвета.
- Consent banner доступен с клавиатуры и screen reader.

## Performance gates

- LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 на 75-м процентиле.
- Минимальный client JavaScript.
- Hero media, fonts и third-party tags входят в performance budget.
- Никаких autoplay background video в первой версии.
- Third-party embeds не входят в initial critical path.

## Conversion hierarchy

- Один primary CTA: необязательный запрос предложения.
- Secondary CTA: проекты/детали продукта.
- Primary CTA wording остаётся одинаковым по странице.
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
