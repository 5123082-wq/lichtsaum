# Claims and Evidence Register

<!-- AGENT_BRIEF:START -->
## Agent brief
- Owns: допустимые публичные формулировки и evidence/status для цен, scope и иных claims.
- Current: CLM-029 ограничивает `/konfigurator` предварительной B2B-netto ценой с видимыми оговорками; внутренние inputs и commercial coefficient не являются customer-facing claims.
- Open: B2C/PAngV, Ads, Schema и общие price-range claims требуют отдельного решения и evidence.
- Read full when: меняется публичная формулировка, статус claim, scope разрешённых поверхностей или доказательная база.
<!-- AGENT_BRIEF:END -->

Status: `Decision / evidence register`; unresolved claims are `Спросить у пользователя`
Last reviewed: 2026-08-11

Это единственный источник истины для объективных публичных утверждений. Copy, Google Ads,
structured data и sales assets используют зафиксированные evidence/status. Для claim без статуса
`Approved` агент показывает владельцу отсутствие подтверждения и использует
`Спросить у пользователя`; нельзя выдавать неизвестный или ложный факт за подтверждённый. Общая
publication policy: [`../architecture/publication-governance.md`](../architecture/publication-governance.md).

## Status

- `TBD` — идея/placeholder; перед публичным использованием `Спросить у пользователя` и не
  представлять неподтверждённое как проверенный факт.
- `Evidence received` — source evidence получено/зафиксировано, но claim ещё не получил owner,
  contract и/или legal approval.
- `Approved` — подтверждено владельцем и, где нужно, legal review.
- `Restricted` — разрешено только с указанным ограничением.
- `Rejected` — прежнее отрицательное решение; новое публичное использование только после прямого
  решения пользователя и обновления evidence/status.

## Register

| ID | Proposed German claim | Russian meaning | Type | Status | Evidence/owner | Allowed surfaces | Last verified |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CLM-001 | `Beleuchtete Markisen nach Maß` | Маркизы с освещением по размеру | Product | Rejected | Too broad: implies a complete awning and B2C/ambient category outside the proposed scope | None | 2026-07-30 |
| CLM-002 | `Kostenlose Beratung` | Бесплатная консультация | Price/service | TBD | Commercial owner | None | — |
| CLM-003 | `Deutschlandweit` | По всей Германии | Geography | TBD | Service operations | None | — |
| CLM-004 | `Made in Germany` | Сделано в Германии | Origin | TBD | Supply-chain evidence | None | — |
| CLM-005 | `Meisterbetrieb` | Предприятие со статусом Meisterbetrieb | Qualification | TBD | Chamber/company proof | None | — |
| CLM-006 | `[X] Jahre Garantie` | Гарантия X лет | Warranty | TBD | Written warranty terms | None | — |
| CLM-007 | `Montage in [Zeitraum]` | Монтаж за указанный срок | Availability | TBD | Operations SLA | None | — |
| CLM-008 | `Windklasse [X]` | Ветровой класс X | Technical | TBD | Model test/certificate | None | — |
| CLM-009 | `Energieeffiziente LED-Beleuchtung` | Энергоэффективная LED-подсветка | Environmental/technical | TBD | Product data and basis | None | — |
| CLM-010 | Customer rating/review | Отзыв или рейтинг клиента | Testimonial | TBD | Source + publication right | None | — |
| CLM-011 | Certification/award | Сертификат или награда | Trust | TBD | Issuer documentation | None | — |
| CLM-012 | Public object gallery | Публичная галерея объектов | Visual evidence | Restricted | Owner approved the four current images for publication on 2026-08-10 | `/` and `/referenzen`; factual visible descriptions only; do not claim a completed LICHTSAUM project relationship; concept visual requires persistent disclosure | 2026-08-10 |
| CLM-013 | `Beleuchteter Markisen-Volant für bestehende Gewerbemarkisen` | Светящийся волан для существующих коммерческих маркиз | Product/category | Approved | Final owner decision on 2026-08-10; O2 closed | Homepage metadata and Ads; may support accurate Schema where the selected type and visible content match; do not add as new visible hero copy | 2026-08-10 |
| CLM-014 | `Der textile Volant wird durch einen individuell gestalteten Leuchtvolant ersetzt.` | Текстильный волан заменяется индивидуально оформленным светящимся воланом | Product/process | Approved | Final owner decision on 2026-08-10; retain current live wording; O2 closed | Landing `Eignung` / `Was sich ändert`; no adjacent qualifier required | 2026-08-10 |
| CLM-015 | `Mit individuellem Logo oder Schriftzug` | С индивидуальным логотипом или надписью | Product | Evidence received | Supplier catalogue supports artwork formats; owner/supplier contract and design limits still required | None | 2026-07-30 |
| CLM-016 | `2400 × 200 mm Leuchtfeld; 300 mm Volanthöhe; max. 180 mm Buchstabenhöhe` | Флагманские размерные ограничения | Technical | Approved | Owner confirmed 180 mm as the authoritative LICHTSAUM configurator and FAQ limit on 2026-08-10; supplier catalogue examples remain market evidence, not the LICHTSAUM product cap | Configurator and FAQ | 2026-08-10 |
| CLM-017 | `Aufmaß, Montage und Elektroanschluss aus einer Hand` | Замер, монтаж и электрика из одних рук | Service | TBD | Named contractors, territory, responsibility and warranty | None | — |
| CLM-018 | `Montage in Berlin und Brandenburg` | Монтаж в Берлине и Бранденбурге | Geography/service | TBD | Owner operations and economic travel radius | None | — |
| CLM-019 | `Markise wird Markenlicht.` | Маркиза становится светом бренда / превращается в фирменный свет | Positioning | Approved | Explicit owner approval on 2026-08-10; the exact current H1 and hero composition remain owner-locked | Landing and Ads; no adjacent qualifier required; do not add category copy, supporting copy or disclaimers to the hero | 2026-08-10 |
| CLM-020 | `Passt an jede Markise` / `passt an fast alle Markisen` | Подходит к любой/почти любой маркизе | Compatibility | Rejected | No universal compatibility evidence; object-specific check is mandatory | None | 2026-07-30 |
| CLM-021 | `Genehmigungsfrei` / `garantiert genehmigungsfähig` | Не требует разрешения / гарантированно разрешимо | Legal/permit | Rejected | Local building, advertising, heritage and property rules are object-specific | None | 2026-07-30 |
| CLM-022 | `Wasserdicht` / complete-system IP class | Водонепроницаемо / IP всего изделия | Technical/safety | TBD | Complete assembly test/declaration required; current supplier catalogue says its standard driver is not waterproof | None | — |
| CLM-023 | `Mehr Sichtbarkeit`, `mehr Gäste`, `mehr Umsatz` | Больше видимости, гостей или выручки | Performance | Rejected | No independent measured causal evidence | None | 2026-07-30 |
| CLM-024 | `Ab EUR [X]` or public project-price range | Цена от / публичный диапазон | Price | TBD | Actual German cost sheet, included scope, net/gross/VAT and owner margin approval | None | — |
| CLM-025 | `Deutschlandweiter Full Service` | Полный сервис по Германии | Geography/service | Rejected | Current installation/electrical network not verified; reconsider only for a materially different operating model | None | 2026-07-30 |
| CLM-026 | `Für den Außeneinsatz geeignet` | Подходит для наружной эксплуатации | Technical/safety | TBD | Complete-system declarations, enclosure, installation method and operating limits | None | — |
| CLM-027 | `Größe und Anzahl der Lichtfelder beeinflussen die Projektkosten.` | Размер и количество световых элементов влияют на стоимость проекта | Price driver | Approved | Owner confirmation for the local prototype; no public price or price range implied | Landing: Engineered Precision | 2026-07-31 |
| CLM-028 | `Volanthöhe 200–300 mm; Buchstabenhöhe max. 180 mm` | Рабочие ограничения текущего конфигуратора | Technical | Approved | Final owner confirmation on 2026-08-10; O5 closed | Configurator and FAQ | 2026-08-10 |
| CLM-029 | `Vorläufiger Nettopreis; zzgl. gesetzlicher Umsatzsteuer; gewählte Leistungen nicht enthalten; kein verbindliches Angebot.` | Предварительная B2B-netto сумма; НДС и выбранные услуги не включены; не обязательное предложение | Price/calculation | Restricted | Owner-approved server-side commercial calculation version; the server must reproduce the current pricing version from validated inputs. Internal component inputs and coefficient are not customer-facing claims. | Only `/konfigurator`, visibly limited to `gewerbliche Projekte`; no Ads price claim, `Product`/`Offer` Schema, B2C presentation or other surface until separate legal/release approval | 2026-08-12 |

## Approval record template

```text
Claim ID:
Final DE wording:
RU explanation:
Evidence:
Evidence owner:
Material limitations, if needed:
Allowed pages:
Allowed Ads:
Allowed Schema:
Approved by:
Legal review required/completed:
Verification date:
Expiry/recheck date:
```

## Rules

- Do not attach routine disclaimers to approved category, positioning or product-process copy.
- Add a visible qualifier only when omitting it would make the specific claim materially false or
  misleading. Operational checks belong in the relevant process, FAQ or technical section and do
  not need to be repeated beside every product statement.
- Price claims must clarify VAT, included scope and material conditions where applicable.
- CLM-029 does not approve a general customer tariff or `Ab` price. It is limited to the exact
  server-reproduced configurator result and its adjacent scope/VAT/non-binding wording; CLM-024
  remains `TBD` for every other public price or project-price range.
- Reviews require authenticity and publication rights.
- Schema cannot contain claims absent from visible content.
- `AggregateRating`, fake stars and self-serving business review markup are prohibited.
- Images can themselves make a claim; before/after and project photos require the same review.
- If evidence expires or the service changes, downgrade the status immediately.
- Supplier catalogue facts do not automatically become LICHTSAUM claims; the contracted product,
  complete assembly and public wording must still be approved.
- CLM-019 is an owner-locked literal. Before expanding it to
  `Aus Ihrer bestehenden Markise wird Markenlicht.`, replace it with an exact-category H1 or alter
  its punctuation, use `Спросить у пользователя`. The current hero composition is also
  owner-locked: ask the user before adding an eyebrow, category line, supporting copy or disclaimer.
  Category clarity belongs in metadata and later visible page content.
- `Genehmigungsfrei` (освобождено от конкретной процедуры) не означает, что объект автоматически
  допустим по строительному, рекламному, памятникоохранному или договорному праву.
