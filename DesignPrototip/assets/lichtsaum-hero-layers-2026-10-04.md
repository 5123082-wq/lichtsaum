# Homepage hero: one photograph and vector illumination

Status: `Decision / owner-authorised publication 2026-10-05`
Created: 2026-10-04

The owner requested restored image quality and illumination of the existing lettering without
switching the facade photograph. Public/production rights retain the source's `TBD` boundary;
the owner separately authorised deployment on 2026-10-05. This is not installation evidence.

## Sources and derivatives

Updated: 2026-10-05. Owner requested real footer letterforms with wider spacing in the hero.

| Output | Source | Derivation |
| --- | --- | --- |
| [Clean source](lichtsaum-hero-clean-valance-source.png) | Previous `public/images/lichtsaum-hero-facade.webp` | Built-in imagegen edit removing the raster lettering, 1672 × 941 |
| [Current facade](../../public/images/lichtsaum-hero-clean-facade.webp) | Clean source PNG | sharp WebP quality 95, effort 6; 139,450 bytes |
| [Lettering](../../public/images/lichtsaum-hero-lettering.svg) | Existing local Hanken Grotesk Variable font, weight 800 | Font outlines with wider tracking and shared perspective, matching viewBox |

The [source register](../README.md) retains original PNGs and superseded off/on derivatives.
The previous facade and [traced overlay](lichtsaum-hero-lettering-traced-superseded.svg) remain available.

## Vector construction

- Actual Hanken Grotesk 800 outlines from the project's fontsource package, instantiated with
  fontTools and read with fontkit. No runtime font dependency.
- Added tracking is 120/1000 font units (`0.12em`) between letters. Footer typography is unchanged.
- Entire word is projected onto one plane: top-left (459,603), top-right (759,558),
  bottom-right (759,601), bottom-left (459,637) in the 1672 × 941 viewBox. Natural glyph overshoot
  is retained. Curves are sampled at 24 intervals per segment before perspective projection.
- A crisp source graphic forms the light core; the shared [footer light palette](../../DESIGN.md#footer)
  controls core and halo colours. Static Gaussian blur of 10px, 3px and 1px forms the halo only.
- Only overlay opacity changes on scroll. No photograph, embedded raster, script or external
  resource exists inside the SVG. Geometry scales with the background.

`Verified` — desktop browser screenshot reviewed; 30 Chromium/WebKit hero checks passed across
nine viewports, including Retina source delivery and reduced motion. Typecheck, scoped lint and
production build passed. The cleaned raster preserves composition visually; pixel identity with
its source is not claimed.

## Image edit provenance

Mode: built-in imagegen, single-image edit, opaque background. Input: previous facade WebP.
Output copied without cropping to the clean source PNG above, then encoded locally to WebP.
Typography is constructed from font outlines, not generated lettering.

Exact prompt:

> Use case: precise-object-edit. Edit the provided architectural hero image. Remove ONLY the small LICHTSAUM lettering from the dark front vertical valance of the awning (approximately x468–744 y564–640 in the 1672x941 reference). Reconstruct uninterrupted dark charcoal fabric with its existing fine texture and lighting. No lettering, symbols or ghost letters remain. Preserve camera, exact composition, framing, awning dimensions, every straight border and seam, facade, grey lighting, contrast, technical line drawing on right, all other pixels as faithfully as possible. No new text, no new design, no perspective changes, no cropping. Return the same wide aspect ratio, high quality.

## Quality boundary

`Verified` — the original of this exact viewpoint is 1672 × 941. The project also contains a
6966 × 3921 Lichtbild source with a different viewpoint; it is not substituted into this hero.
No additional facade detail is claimed beyond the original source.

`Verified` — a 390px-wide Retina viewport displayed the old photograph about 1080 CSS pixels wide
while loading an 828px derivative. The corrected sizes attribute describes the full cropped
photograph width. The same viewport now receives all 1672 source pixels at quality 90, with
resolution-independent vector lettering. Other images retain the default quality 75.
