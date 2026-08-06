# Claims and Evidence Register

Status: `TBD` — product, technical and owner approvals required  
Last reviewed: 2026-08-06

Это единственный источник истины для объективных публичных утверждений. Copy, Google Ads,
structured data и sales assets могут использовать claim только со статусом `Approved`.

## Status

- `TBD` — идея/placeholder, использовать публично нельзя.
- `Evidence received` — source evidence получено/зафиксировано, но claim ещё не получил owner,
  contract и/или legal approval.
- `Approved` — подтверждено владельцем и, где нужно, legal review.
- `Restricted` — разрешено только с указанным ограничением.
- `Rejected` — не использовать.

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
| CLM-012 | Project/reference | Реализованный проект | Case study | TBD | Photos + client permission | None | — |
| CLM-013 | `Beleuchteter Markisen-Volant für bestehende Gewerbemarkisen` | Светящийся волан для существующих коммерческих маркиз | Product/category | TBD | Owner product acceptance + supplier/operating scope; see `../strategy/product-market-decision.md` | None | — |
| CLM-014 | `Wir ersetzen nur den Volant – die bestehende Markise bleibt erhalten.` | Меняется только волан, существующая маркиза остаётся | Compatibility | TBD | Must say `bei technischer Eignung`; approved-system/measurement protocol required | None | — |
| CLM-015 | `Mit individuellem Logo oder Schriftzug` | С индивидуальным логотипом или надписью | Product | Evidence received | Supplier catalogue supports artwork formats; owner/supplier contract and design limits still required | None | 2026-07-30 |
| CLM-016 | `2400 × 200 mm Leuchtfeld; 300 mm Volanthöhe; max. 150 mm Buchstabenhöhe` | Флагманские размерные ограничения | Technical | Evidence received | [Matussière catalogue 2026](https://www.matussiere-toiles.com/images/upload/pdf/cataloguemt2026confection_69eb3deb82843.pdf); verify actual supplied version | None | 2026-07-30 |
| CLM-017 | `Aufmaß, Montage und Elektroanschluss aus einer Hand` | Замер, монтаж и электрика из одних рук | Service | TBD | Named contractors, territory, responsibility and warranty | None | — |
| CLM-018 | `Montage in Berlin und Brandenburg` | Монтаж в Берлине и Бранденбурге | Geography/service | TBD | Owner operations and economic travel radius | None | — |
| CLM-019 | `Aus Ihrer bestehenden Markise wird Markenlicht.` | Из существующей маркизы получается брендовый свет | Positioning | TBD | Owner copy approval; must be immediately followed by exact product explanation | None | — |
| CLM-020 | `Passt an jede Markise` / `passt an fast alle Markisen` | Подходит к любой/почти любой маркизе | Compatibility | Rejected | No universal compatibility evidence; object-specific check is mandatory | None | 2026-07-30 |
| CLM-021 | `Genehmigungsfrei` / `garantiert genehmigungsfähig` | Не требует разрешения / гарантированно разрешимо | Legal/permit | Rejected | Local building, advertising, heritage and property rules are object-specific | None | 2026-07-30 |
| CLM-022 | `Wasserdicht` / complete-system IP class | Водонепроницаемо / IP всего изделия | Technical/safety | TBD | Complete assembly test/declaration required; current supplier catalogue says its standard driver is not waterproof | None | — |
| CLM-023 | `Mehr Sichtbarkeit`, `mehr Gäste`, `mehr Umsatz` | Больше видимости, гостей или выручки | Performance | Rejected | No independent measured causal evidence | None | 2026-07-30 |
| CLM-024 | `Ab EUR [X]` or public project-price range | Цена от / публичный диапазон | Price | TBD | Actual German cost sheet, included scope, net/gross/VAT and owner margin approval | None | — |
| CLM-025 | `Deutschlandweiter Full Service` | Полный сервис по Германии | Geography/service | Rejected | Current installation/electrical network not verified; reconsider only for a materially different operating model | None | 2026-07-30 |
| CLM-026 | `Für den Außeneinsatz geeignet` | Подходит для наружной эксплуатации | Technical/safety | TBD | Complete-system declarations, enclosure, installation method and operating limits | None | — |
| CLM-027 | `Größe und Anzahl der Lichtfelder beeinflussen die Projektkosten.` | Размер и количество световых элементов влияют на стоимость проекта | Price driver | Approved | Owner confirmation for the local prototype; no public price or price range implied | Landing: Engineered Precision | 2026-07-31 |
| CLM-028 | `Volanthöhe 200–300 mm; Buchstabenhöhe max. 180 mm` | Рабочие ограничения текущего конфигуратора | Technical | Restricted | Owner confirmation 2026-08-06; must be reconciled with the supplier-specific 150 mm fact in CLM-016 and the contracted technical file | Local noindex configurator and FAQ only | 2026-08-06 |

## Approval record template

```text
Claim ID:
Final DE wording:
RU explanation:
Evidence:
Evidence owner:
Limitations/qualifiers:
Allowed pages:
Allowed Ads:
Allowed Schema:
Approved by:
Legal review required/completed:
Verification date:
Expiry/recheck date:
```

## Rules

- A claim may be accurate but still require a visible qualifier.
- Price claims must clarify VAT, included scope and material conditions where applicable.
- Reviews require authenticity and publication rights.
- Schema cannot contain claims absent from visible content.
- `AggregateRating`, fake stars and self-serving business review markup are prohibited.
- Images can themselves make a claim; before/after and project photos require the same review.
- If evidence expires or the service changes, downgrade the status immediately.
- Supplier catalogue facts do not automatically become LICHTSAUM claims; the contracted product,
  complete assembly and public wording must still be approved.
- `Genehmigungsfrei` (освобождено от конкретной процедуры) не означает, что объект автоматически
  допустим по строительному, рекламному, памятникоохранному или договорному праву.
