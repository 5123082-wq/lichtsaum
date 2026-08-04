# LICHTSAUM concept-image prompt set

Status: `Candidate`  
Created: 2026-07-30  
Tool: OpenAI image generation

These prompts document the final art direction used for the local prototype. The resulting images
are concept visualisations, not photographs of a LICHTSAUM installation, customer project or
validated product.

## Dusk hero

Create a photorealistic editorial architectural concept visualisation of an independent German
restaurant or café facade at dusk. Show an existing dark retractable commercial awning, viewed
obliquely from street level, with the replaceable front textile valance as the only illuminated
feature. Use a restrained abstract rhythm of short vertical light marks rather than readable text,
a logo or a real brand. Preserve dark masonry, quiet warm interior light, realistic materials and
an understated premium mood. Compose a wide landscape frame with useful darker negative space on
the left for large landing-page typography. Palette: charcoal, off-white and a restrained warm
orange signal. No people, vehicles, prices, technical labels, claims, case-study identifiers or
recognisable trademarks.

## Day-state edit

Edit the dusk concept into an overcast daylight view while preserving the same camera position,
facade, existing awning, valance geometry and abstract visual rhythm. The valance light is off; it
reads as a designed textile front edge rather than a luminous case study. Keep materials and
shadows realistic, retain space for editorial typography and add no readable text, logo, people,
location cues, performance claims or technical specifications.

## Required presentation boundary

- Visible label: `Konzeptvisualisierung · kein Kundenprojekt` or an equivalent explicit note.
- Alt text describes the depicted concept and never implies a completed installation.
- Do not use these images as evidence for performance, compatibility, geography, delivery,
  warranty, price or realised results.

## CAD-hybrid hero replacement

Status: `Candidate`  
Created: 2026-07-31  
Source: owner-supplied ChatGPT Image outputs

The replacement hero pair shows a close, dark commercial awning on a restrained modern industrial
facade. The right side of the facade and awning dissolves progressively into precise monochrome
technical linework while the left side remains quiet enough for the interface headline.

The two 1672 × 941 sources preserve the same viewpoint and geometry:

- `lichtsaum-concept-cad-awning-off-source.png` is the unilluminated base state;
- `lichtsaum-concept-cad-awning-on-source.png` is the scroll-revealed state;
- only the exact `LICHTSAUM` lettering on the textile valance changes to a restrained warm glow;
- there are no illuminated strips, edges, arms, facade elements or background panels.

These remain concept visualisations, not evidence of a completed LICHTSAUM installation or verified
product configuration. Production/public usage rights remain `TBD`.

## Temporary references-gallery set

Status: `Review-only / owner-authorised`  
Created: 2026-08-04  
Tool: four independent OpenAI built-in image-generation calls

The owner requested four temporary images to finish and evaluate the gallery composition before
real project photographs are available. All four share this prompt boundary:

- photorealistic premium German architectural photography at blue hour or evening;
- an existing graphite or dark-blue facade awning with a restrained, technically plausible
  warm-white illuminated front edge;
- realistic stone, glass, metal, fabric and ordinary urban imperfections;
- no readable brands, logos, signage, licence plates, watermarks or unsupported project facts;
- no implication that the scene documents a completed LICHTSAUM project.

The four final prompt variants were:

1. **Restaurant facade / tall.** Street-level vertical `4:5` view of a restrained German urban
   restaurant facade, deep graphite awning, warm illuminated front edge, natural blue-hour exposure
   and crop-safe architectural context.
2. **Entrance detail / wide.** Horizontal `16:10` close three-quarter view of the awning corner,
   front rail, mounting hardware, woven fabric and a precise linear light above a modern café
   entrance.
3. **Terrace / wide.** Horizontal `16:10` establishing view of an independent café terrace with
   several dark awnings and one coherent warm light rhythm against cool evening ambient light.
4. **Urban corner / tall.** Vertical `4:5` three-quarter view of a black-graphite awning above an
   entrance after rain, with restrained reflections on wet stone and no close-up people.

| Slot | Source PNG | Optimised website asset | Dimensions |
| --- | --- | --- | --- |
| `left-tall` | `lichtsaum-reference-concept-restaurantfassade-tall-source.png` | `/images/referenzen/concept-restaurantfassade-tall.webp` | 1122 × 1402 |
| `center-top` | `lichtsaum-reference-concept-eingang-detail-wide-source.png` | `/images/referenzen/concept-eingang-detail-wide.webp` | 1586 × 992 |
| `center-bottom` | `lichtsaum-reference-concept-terrasse-wide-source.png` | `/images/referenzen/concept-terrasse-wide.webp` | 1586 × 992 |
| `right-tall` | `lichtsaum-reference-concept-ecklage-tall-source.png` | `/images/referenzen/concept-ecklage-tall.webp` | 1122 × 1402 |

Required presentation boundary: every card carries a persistent `Konzeptvisualisierung` badge;
the section and `/referenzen` explicitly state that the images are AI-generated, do not show
completed LICHTSAUM projects and will be replaced by approved originals. They may enter only the
local/protected `review` state and can never satisfy the `published` registry contract.
