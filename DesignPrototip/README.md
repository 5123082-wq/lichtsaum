# Design Prototype Intake

Status: `Decision`  
Last reviewed: 2026-07-30

Эта папка хранит утверждаемые визуальные материалы Google Stitch. Единственный источник истины
по реализуемой visual system — [`../DESIGN.md`](../DESIGN.md).

## Directories

| Path | Contents |
| --- | --- |
| `references/` | Screenshots/PDF references used for visual comparison |
| `exports/` | Raw Stitch exports kept for inspection, never imported directly into production |
| `assets/` | Candidate source media with known owner/source/license |

## Intake rules

- Имя файла должно быть понятным и стабильным; не использовать `final-final-2`.
- Для reference фиксировать Stitch project/screen ID and capture date.
- Exported HTML/CSS is evidence of composition only, not an application dependency.
- Asset cannot move to `public/assets/` until source, owner, usage rights and intended role are
  known.
- Do not store secrets, production configuration, customer data or unlicensed scraped media.
- Experimental or throwaway material belongs in ignored `../temp/`.
- When a reference is superseded, mark it in this file or the relevant design decision; do not
  silently leave two “canonical” screens.

## Asset record template

Add a small adjacent Markdown record or extend this table when approved assets arrive:

| File | Source/owner | License/permission | Intended use | Crop/alt notes | Status |
| --- | --- | --- | --- | --- | --- |
| `references/stitch-12ee44ad855e416db92641282c2f7629-2026-07-30.png` | Google Stitch project `13581496807405121738`, screen `12ee44ad855e416db92641282c2f7629` | Design reference only; embedded imagery is not cleared for public reuse | Canonical composition and visual-system comparison | Desktop export, 2560 × 11712 px | `Approved` |
| `exports/stitch-12ee44ad855e416db92641282c2f7629-2026-07-30.html` | Google Stitch export of the same screen | Inspection only; never imported into the application | Structural and token audit | Contains unverified copy/assets and non-production markup | `Approved` |
| `assets/lichtsaum-concept-cafe-dusk-source.png` | Generated for this project with OpenAI image generation | Retained as a historical candidate; not cleared for public reuse | Previous illuminated end-state in the local hero scroll scene | Replaced by the aligned CAD-hybrid pair | `Superseded` |
| `assets/lichtsaum-concept-cafe-day-source.png` | Generated edit of the dusk concept with OpenAI image generation | Retained as a historical candidate; not cleared for public reuse | Previous initial state in the local hero scroll scene | Replaced by the aligned CAD-hybrid pair | `Superseded` |
| `../public/images/lichtsaum-concept-cafe-dusk.webp` | Optimized derivative of the recorded dusk source | Historical local-prototype derivative | Previous illuminated hero overlay | No longer referenced by the application | `Superseded` |
| `../public/images/lichtsaum-concept-cafe-day.webp` | Optimized derivative of the recorded day source | Historical local-prototype derivative | Previous hero base layer | No longer referenced by the application | `Superseded` |
| `assets/lichtsaum-concept-cad-awning-off-source.png` | User-provided ChatGPT Image output supplied for this task | Local prototype use authorised by the owner; production/public rights remain `TBD` | Unilluminated base state in the local hero scroll scene; not a customer project or product proof | 1672 × 941; exact viewpoint shared with the illuminated source | `Candidate` |
| `assets/lichtsaum-concept-cad-awning-on-source.png` | User-provided ChatGPT Image output supplied for this task | Local prototype use authorised by the owner; production/public rights remain `TBD` | Illuminated overlay in the local hero scroll scene; not a customer project or product proof | 1672 × 941; only the `LICHTSAUM` lettering is illuminated | `Candidate` |
| `../public/images/lichtsaum-concept-cad-awning-off.webp` | Optimized derivative of the recorded off source | Local prototype only until owner approves public use | LCP base layer in responsive hero media | 1672 × 941; meaningful alt lives on this base image | `Candidate` |
| `../public/images/lichtsaum-concept-cad-awning-on.webp` | Optimized derivative of the recorded on source | Local prototype only until owner approves public use | Preloaded illuminated overlay for the scroll transition | 1672 × 941; decorative empty alt prevents duplicate announcement | `Candidate` |
| `assets/lichtsaum-concept-engineered-gestaltung-source.png` | Generated for this project with OpenAI image generation from the recorded CAD-hybrid source | Local prototype use authorised by the owner; production/public rights remain `TBD` | Source for the `Gestaltung` view in the local Engineered Precision block | 1586 × 992; neutral composition guides and abstract marks, no customer logo or technical claim | `Candidate` |
| `../public/images/lichtsaum-concept-engineered-gestaltung.webp` | Optimized derivative of the recorded Gestaltung source | Local prototype only until owner approves public use | Interactive `Gestaltung` concept view | 1586 × 992; meaningful German alt identifies a schematic concept | `Candidate` |
| `assets/lichtsaum-concept-engineered-aufmass-source.png` | Generated for this project with OpenAI image generation and corrected to the owner's measurement definition | Historical local-prototype source | Previous source for the `Aufmaß` view | 1586 × 992; replaced by the geometry-first technical illustration | `Superseded` |
| `../public/images/lichtsaum-concept-engineered-aufmass-selected.webp` | Optimized derivative of the previous owner-selected Aufmaß source | Historical local-prototype derivative | Previous interactive `Aufmaß` concept view | 1586 × 992; no longer referenced by the application | `Superseded` |
| `assets/lichtsaum-concept-engineered-aufmass-technical-source.png` | Generated for this project with OpenAI image generation as a geometry-first drawing, then lightly colourized | Historical local-prototype source | Previous source for the `Aufmaß` view | 1586 × 992; front and isometric views; A denotes width and B only the fabric-valance height from profile to lower edge; no C, values or wiring | `Superseded` |
| `../public/images/lichtsaum-concept-engineered-aufmass-technical.webp` | Optimized derivative of the geometry-first Aufmaß source | Historical local-prototype derivative | Previous interactive `Aufmaß` concept view | 1586 × 992; restrained graphite, off-white and orange technical palette | `Superseded` |
| `assets/lichtsaum-concept-engineered-lichtbild-v2-source.png` | Generated for this project with OpenAI image generation from the owner-approved CAD-hybrid reference | Local prototype use authorised by the owner; production/public rights remain `TBD` | Source for the revised `Lichtbild` view | 1586 × 992; slightly more frontal view of the illuminated valance | `Candidate` |
| `../public/images/lichtsaum-concept-engineered-lichtbild-v2.webp` | Optimized derivative of the revised Lichtbild source | Historical local-prototype derivative | Previous interactive `Lichtbild` concept view | 1586 × 992; no longer referenced by the application | `Superseded` |
| `assets/lichtsaum-concept-engineered-gestaltung-v2-source.png` | Generated for this project with OpenAI image generation from the owner-approved CAD-hybrid reference | Local prototype use authorised by the owner; production/public rights remain `TBD` | Source for the revised `Gestaltung` view | 1586 × 992; dotted outline isolates the illuminated lettering from the fabric valance | `Candidate` |
| `../public/images/lichtsaum-concept-engineered-gestaltung-v2.webp` | Optimized derivative of the revised Gestaltung source | Historical local-prototype derivative | Previous interactive `Gestaltung` concept view | 1586 × 992; no longer referenced by the application | `Superseded` |
| `assets/lichtsaum-concept-engineered-aufmass-v2-source.png` | Generated for this project with OpenAI image generation from the owner-approved CAD-hybrid reference | Local prototype use authorised by the owner; production/public rights remain `TBD` | Source for the revised `Aufmaß` view | 1586 × 992; same perspective translated into a technical drawing with valance dimensions | `Candidate` |
| `../public/images/lichtsaum-concept-engineered-aufmass-v2.webp` | Optimized derivative of the revised Aufmaß source | Historical local-prototype derivative | Previous interactive `Aufmaß` concept view | 1586 × 992; no longer referenced by the application | `Superseded` |
| `assets/lichtsaum-engineered-lichtbild-source.webp` | Owner-provided image supplied for this task | Use on the site authorised by the owner | Source for the current `Lichtbild` view | 6966 × 3921; illuminated LICHTSAUM lettering and construction lines | `Approved` |
| `../public/images/lichtsaum-engineered-lichtbild.webp` | Optimized derivative of the owner-provided Lichtbild source | Use on the site authorised by the owner | Current interactive `Lichtbild` view | 1920 × 1081; meaningful German alt describes the visible scene | `Approved` |
| `assets/lichtsaum-engineered-gestaltung-lichtfeld-source.webp` | Owner-provided image supplied for this task | Use on the site authorised by the owner | Source for the current `Gestaltung` view | 6966 × 3921; orange dotted contour identifies the light field | `Approved` |
| `../public/images/lichtsaum-engineered-gestaltung-lichtfeld.webp` | Optimized derivative of the owner-provided Gestaltung source | Use on the site authorised by the owner | Current interactive `Gestaltung` view | 1920 × 1081; meaningful German alt identifies the outlined light field | `Approved` |
| `assets/lichtsaum-engineered-aufmass-volant-source.webp` | Owner-provided image supplied for this task | Use on the site authorised by the owner | Source for the current `Aufmaß` view | 6967 × 3921; orange annotations identify valance length and height | `Approved` |
| `../public/images/lichtsaum-engineered-aufmass-volant.webp` | Optimized derivative of the owner-provided Aufmaß source | Use on the site authorised by the owner | Current interactive `Aufmaß` view | 1920 × 1081; meaningful German alt identifies valance length and height | `Approved` |
| `assets/lichtsaum-concept-cafe-terrace-night-source.png` | User-provided ChatGPT Image output supplied for this task | Local prototype use authorised by the owner; production/public rights remain `TBD` | Night source for the same `Caféterrasse` comparison | 1086 × 1448; paired night view with illuminated lettering | `Candidate` |
| `../public/images/lichtsaum-concept-cafe-terrace-night.webp` | Optimized 4:5 derivative of the recorded night source | Local prototype only until owner approves public use | The only image in the interactive vertical card | 1080 × 1350; monochrome by default, original colour on hover, focus or activation | `Candidate` |
| `assets/lichtsaum-konzept-klassische-restaurantfassade-beleuchtete-markisenvolants-nacht-source.png` | User-provided ChatGPT Image output supplied for this task | Local prototype use authorised by the owner; production/public rights remain `TBD` | Night source for the `Klassisch` card | 1912 × 823; meaningful German alt describes the concept scene and illuminated lettering | `Candidate` |
| `../public/images/lichtsaum-konzept-klassische-restaurantfassade-beleuchtete-markisenvolants-nacht.webp` | Optimized derivative of the recorded `Klassisch` source | Local prototype only until owner approves public use | Interactive panoramic `Klassisch` card | 1912 × 823; monochrome by default, original colour on hover, focus or activation | `Candidate` |

The final art-direction prompts and content boundaries are recorded in
[`assets/lichtsaum-concept-prompts.md`](assets/lichtsaum-concept-prompts.md).

Allowed statuses: `Candidate`, `Approved`, `Rejected`, `Superseded`.
