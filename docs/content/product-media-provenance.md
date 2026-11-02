# Product media provenance

Status: `Verified` source records / `Decision` owner-approved presentation, 2026-11-02.

<!-- AGENT_BRIEF:START -->
## Agent brief
- Owns: provenance of the eight public masters and their responsive product-page derivatives.
- Current: generated imagery illustrates the product; it does not verify construction, supplier stock or completed customer projects.
- Decision: the owner requested original video quality, removal of public AI/concept captions and publication on 2026-11-02. Neutral German alt text remains.
- Current correction: a separate first-frame poster covers normal video loading; the illuminated still remains for reduced motion/failure. The MP4 is unchanged.
- Current published delivery: all four textile/shape images use prebuilt responsive variants; approved masters are unchanged. Combined publication was owner-authorised and verified on 2026-11-02.
- Open: independent documentary verification of underlying media rights and physical-product correspondence.
- Read full when: replacing product media or changing its provenance/evidence status.
<!-- AGENT_BRIEF:END -->

## Released media

All paths below are relative to the repository root. Authoring originals and detailed generation
prompts remain local-only under `DesignPrototip/prototypes/produkt/`; they are not application
dependencies or required files in a fresh release checkout.

| Public file | Source and processing | Evidence boundary |
| --- | --- | --- |
| `public/videos/product/lichtsaum-orbit-v1.mp4` | Gemini Videos result downloaded by the owner on 2026-10-20; input `light-keyframes/01-start-off.png`. Original silent AVFoundation passthrough copy: 1280 × 720, 240 frames, 10 seconds, 6,070,629 bytes, no audio. Restored byte-for-byte on 2026-11-02; no further re-encoding. | Generated perspective/light scene; exact model was not confirmed. |
| `public/images/product/orbit-poster-v1.webp` | Illuminated frame from the same original clip at 9.7 seconds, converted to WebP. | Same generated scene. |
| `public/images/product/orbit-start-v1.webp` | Exact first decoded frame of the same original silent MP4, extracted on 2026-11-02; 1280 × 720, same-size WebP quality 90, 207,716 bytes. | Same generated scene; opening cover only. No MP4 re-encoding. |
| `public/images/product/hem-comparison-v1.webp` | Built-in imagegen, 2026-10-20. Three graphite textile specimens; 1920 × 819 source PNG, WebP quality 88, 163,660 bytes. Local-only prompt record: `hem-comparison-prompt.md`. | Illustrative edge forms; no supplier collection or availability assertion. |
| `public/images/product/markisenstoff-acryl-graphit-melange.webp` | Gemini textile study; owner supplied the 3392 × 1248 JPEG original on 2026-11-01. Same-size WebP quality 90, 720,908 bytes. | WAREMA catalogues informed art direction; the image is not an authentic manufacturer sample or photograph. |
| `public/images/product/markisenstoff-farbfaecher-petrol-terrakotta-oliv.webp` | Same owner-approved series; supplied 3392 × 1248 JPEG original, same-size WebP quality 90, 1,056,522 bytes. | No calibrated colour match, supplier identity, stock or fabric specification is established. |
| `public/images/product/textile-workbench-sand.webp` | Built-in imagegen material study, 2026-10-10; local-only source `assets/textile-workbench-sand.png`, prompt `material-and-light-prompts.md`; WebP derivative for the page. | Generated processing detail; no verified seam/construction specification. |
| `public/images/product/leuchtvolant-detail.webp` | Built-in imagegen close-up from the original product prototype; local-only source `assets/leuchtvolant-detail.png`, prompt `image-prompts.md`; WebP derivative. | Decorative background with empty alt; no measured lighting/product evidence. |

The textile generation record and exact prompts remain local-only in
`warema-informed-studies-2026-11-01/README.md` and `prompt-01.txt` / `prompt-02.txt`.
The recorded Gemini conversation is [the material-study chat](https://gemini.google.com/app/3736533650c116e1).
Publication authority is the owner's explicit instruction; it does not itself establish unknown
third-party rights. The separate reference-gallery disclosure contract is unchanged.

## Responsive derivatives

`Decision` — owner instruction, 2026-11-02: optimize all four textile/shape images and the carousel
for desktop, tablet and phone, retaining the visible fabric detail. The four masters in the table
above remain byte-identical. The video and both hero posters are outside this image change.

`Verified` — [generate-product-images.mjs](../../scripts/generate-product-images.mjs) derives the
files directly from those approved public masters. Run `node scripts/generate-product-images.mjs`
from the repository root after installing the existing dependencies. It uses the Sharp version
already installed with Next.js; generation is separate from the application build.

- [product-images.json](../../src/features/product-prototype/product-images.json) owns the exact
  derivative paths, pixel dimensions and byte counts. All 71 output files have validated dimensions,
  lengths and SHA-256 filename prefixes. Outputs live under `public/images/product/optimized/`.
- Graphite and palette: AVIF quality 75, 4:4:4 chroma, effort 6; WebP quality 85 with smart
  subsampling and effort 6 provides the alternate format. Desktop retains the complete panorama;
  tablet and portrait crops match the existing right-aligned view. Widths include high-density
  desktop and phone options and never enlarge the source pixels.
- Sand and shapes: WebP quality 75, matching the previously published optimizer setting, with
  smart subsampling and effort 6. AVIF at the panorama setting produced larger files for these
  subjects. The three mobile shape derivatives match the previous equal-thirds, centred crop.
- Compression is lossy. Source-detail crops were reviewed at 2×, and all four rendered subjects
  were compared before/after at desktop DPR2 and phone DPR3. Weave, seams and edge shape remain
  legible. Full-resolution approved masters remain available for later authoring.
- Hash-named derivatives receive `public, max-age=31536000, immutable`; their local production-build
  and live production responses were checked. These files bypass runtime re-encoding. The browser
  selects one matching source from server-rendered picture elements, including without JavaScript.

Presentation, carousel behavior and measured transfer savings belong to
[DESIGN.md](../../DESIGN.md#editorial-product-produkt-and-review-route-prototypprodukt).
