# Product media provenance

Status: `Verified` source records / `Decision` owner-approved presentation, 2026-11-02.

<!-- AGENT_BRIEF:START -->
## Agent brief
- Owns: provenance of the seven media files used by the current editorial product page.
- Current: generated imagery illustrates the product; it does not verify construction, supplier stock or completed customer projects.
- Decision: the owner requested original video quality, removal of public AI/concept captions and publication on 2026-11-02. Neutral German alt text remains.
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
