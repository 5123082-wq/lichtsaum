# Configurator Calculation Contract

Status: `Decision` for local constraints and internal cost inputs; public pricing `TBD`

Last reviewed: 2026-08-06

Этот документ — единственный источник истины для размерных ограничений конфигуратора и
внутренних компонентных стоимостей будущего расчёта. Значения подтверждены владельцем
2026-08-06 для локального noindex-прототипа. Они не являются клиентским тарифом или предложением.

## Implemented local constraints

| Input | Allowed value | Runtime behavior |
| --- | ---: | --- |
| `Volantbreite` | `>= 1 mm` | Existing horizontal fit validation remains authoritative |
| `Volanthöhe` | `200–300 mm` inclusive | Outside the range: visible error, `aria-invalid`, continuation disabled |
| `Buchstabenhöhe` | `1–180 mm` inclusive | Outside the range: visible error, `aria-invalid`, continuation disabled |

The UI keeps the entered draft value and does not silently clamp or auto-fit it. The current
`sessionStorage` v2 payload and key do not change; a stored configuration outside these bounds is
rejected on restore.

The 180 mm owner limit is not a replacement for the separate supplier-catalogue fact recorded in
`CLM-016` (150 mm for its specified flagship format). The two sources must be reconciled against
the actually contracted product and technical file before any production or public use.

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

## Future panel allocation

The required panel length is the measured width of the complete illuminated composition:
inscription, illuminated logo placeholders and the gaps between them. Outer non-illuminated safe
margins are not part of that length.

For a required length `L`, enumerate combinations of 600, 1000 and 1200 mm panels whose combined
length is at least `L`, then select in this order:

1. lowest total panel cost;
2. lowest unused panel length;
3. lowest panel count.

The future internal component subtotal is:

`EUR 100 + (Volantbreite in m × EUR 40) + selected panel cost`

Maximum panel count, physical joints and mounting gaps remain `TBD`. No calculation result may be
added to the public UI until those technical inputs, complete customer scope, margin and VAT
presentation are approved. The current mini-configurator deliberately implements no price or panel
allocation logic.
