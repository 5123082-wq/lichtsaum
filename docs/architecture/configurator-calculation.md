# Configurator Calculation Contract

<!-- AGENT_BRIEF:START -->
## Agent brief
- Owns: размерные ограничения, внутренние компонентные inputs, серверный pricing version и scope отображаемого результата конфигуратора.
- Current: pricing `2026-08-12.v2` применяет server-only надбавку +100%; клиент получает только итоговую цену и расчётные геометрические данные.
- Open: техническая совместимость, поставщик, монтаж/электрика, consumer/PAngV и публичное расширение цены остаются отдельными вопросами.
- Read full when: меняются inputs, формула, версия цены, границы результата или persistence contract.
<!-- AGENT_BRIEF:END -->

Status: `Decision`; full server-authoritative calculation implemented locally under restricted
public claim CLM-029

Last reviewed: 2026-08-12

Publication choices follow [`publication-governance.md`](publication-governance.md). The claim and
legal boundaries below are facts to show the owner; they do not autonomously block publication.

Этот документ — единственный источник истины для размерных ограничений конфигуратора,
компонентных стоимостей и версии предварительного расчёта. Значения подтверждены владельцем
2026-08-06; явный implementation plan от 2026-08-11, обновлённый распоряжением владельца от
2026-08-12, разрешил показывать итоговую коммерческую цену на основе этих значений как
ограниченный `/konfigurator` B2B-netto result. Это не общий клиентский тариф, проверка
совместимости или обязательное предложение.

## Implemented local constraints

| Input | Allowed value | Runtime behavior |
| --- | ---: | --- |
| `Volantbreite` | `>= 1 mm` | Existing horizontal fit validation remains authoritative |
| `Volanthöhe` | `200–300 mm` inclusive | Outside the range: visible error, `aria-invalid`, continuation disabled |
| `Buchstabenhöhe` | `1–180 mm` inclusive | Outside the range: visible error, `aria-invalid`, continuation disabled |

The UI keeps the entered draft value and does not silently clamp or auto-fit it. Homepage teaser
keeps `lichtsaum:mini-configurator:v2`. The full route uses `lichtsaum:configurator:v1`, migrates
only a valid mini v2 configuration and persists only configuration/services for the browser
session. Optional PLZ, contacts and files are not stored.

The 180 mm owner limit is the authoritative LICHTSAUM configurator and FAQ value. Dimensions found
in individual supplier or competitor catalogue examples are market evidence and must not override
this product setting or guide future calculator development as a general cap.

## Internal component cost inputs

All amounts below are net internal manufacturing-cost inputs. They exclude customer margin,
delivery, measurement, design work, removal, installation, electrical field work, special access,
permit/document coordination, warranty reserve and VAT treatment.

| Component | Internal net input |
| --- | ---: |
| Dimmable electrical set: power supply, cable and related electrics | EUR 100 fixed per valance |
| Finished valance | EUR 40 per running metre of full valance width |
| Light panel `600 × 200 mm` | EUR 150 |
| Light panel `1000 × 200 mm` | EUR 200 |
| Light panel `1200 × 200 mm` | EUR 250 |

The EUR 40 running-metre rate applies unchanged across the allowed 200–300 mm valance-height
range.

## Implemented pricing version

- `pricingVersion`: `2026-08-12.v2`;
- server-only commercial coefficient: `100%`;
- all money arithmetic: integer euro cents;
- electrical set: `10_000` cents fixed;
- finished valance: `4` cents per full-width millimetre;
- selected panel cost: internal catalog above;
- displayed result: (electrical set + valance + panels) × 2.

The commercial coefficient is intentionally not part of the client-facing calculation result.
The browser receives the authoritative total and panel allocation, but not the component cost
inputs or the coefficient itself. Future coefficient changes must update `pricingVersion`.

Selected design, delivery, site measurement, old-valance removal, new-valance installation and
electrical connection are recorded for manual review and never change this version's displayed
amount.

## Panel allocation

The required panel length is the measured width of the complete illuminated composition:
inscription, illuminated logo placeholders and the gaps between them. Outer non-illuminated safe
margins are not part of that length.

For a required length `L`, enumerate combinations of 600, 1000 and 1200 mm panels whose combined
length is at least `L`, then select in this order:

1. lowest total panel cost;
2. lowest unused panel length;
3. lowest panel count.

The authoritative internal component subtotal is:

`EUR 100 + (Volantbreite in m × EUR 40) + selected panel cost`

The displayed net price is the internal subtotal after the server-only commercial coefficient:

`internal component subtotal × 2`

Maximum panel count, physical joints and mounting gaps remain `TBD`; v1 therefore does not claim
technical compatibility and routes the result to project review. The solver itself has no arbitrary
panel-count cap and remains valid for the entered positive width. The homepage mini-configurator
still performs no price or panel allocation.

The UI may show total panel counts/allocation but does not expose the purchase cost of individual
components.

## Authoritative font and geometry boundary

The full configurator opens the same local WOFF2 asset selected for the SVG through `fontkit`
2.0.4, applies the configured variable-font weight where available and uses shaped glyph layout,
kerning and visible bounds. The returned width, SVG font size and baseline offset drive both the
preview geometry and required panel length.

Unsupported glyphs, missing/unreadable fonts, non-finite metrics, invalid dimensions and a
composition crossing the existing safe area fail closed: no price and no configurator submit are
available. Client-calculated hidden totals are never accepted.

## Version and persistence boundary

Live calculation is a stateless server request. It does not create a lead, notification or
conversion and the application does not log its body. On explicit shared-form submit the server
validates the raw configuration again, repeats measurement/geometry/pricing and persists only its
own result in the optional versioned `leads.request_context` snapshot.

If the submitted confirmation version differs from `2026-08-12.v2`, the server returns the current
authoritative calculation before any lead insert. The UI replaces the displayed result and requires
an explicit new confirmation.

## Public presentation evidence

Every total on `/konfigurator` is labelled `Vorläufiger Nettopreis` and is adjacent to all three
limitations: `zzgl. gesetzlicher Umsatzsteuer`, selected services are excluded, and the result is
not a `verbindliches Angebot` (обязательное предложение). The page explicitly addresses
`gewerbliche Projekte`.

CLM-029 records approval for this exact surface. A general price, `Ab` claim, B2C presentation,
`Product`/`Offer` Schema, Ads price promise or use on another route has no recorded approval.
Present the PAngV/B2C, compatibility and claim context and use `Спросить у пользователя` for the
concrete production/Ads publication decision.

The attached preliminary calculation uses the shared intake, server-reproduced calculation version
and single Google Ads conversion defined in
[`unified-lead-form-contract.md`](unified-lead-form-contract.md). A calculator result does not
create a lead or conversion before the visitor explicitly submits the shared contact form.
