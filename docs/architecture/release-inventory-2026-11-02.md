# Product release inventory — 2026-11-02

Status: `Verified` local inventory / `Decision` owner-authorised combined release.

The owner requested publication of the portrait-video corrections together with the responsive
image/carousel work, and a review of the large unpublished working tree. This snapshot describes
scope before release; deployment results belong to [PROGRESS.md](../../PROGRESS.md).

## Included in the release

- Current product hero: preserved playback position, fixed portrait framing, adaptive final
  inscription centring, neutral site-colour shading and the wider portrait surface.
- Four existing approved textile/shape masters delivered through 71 responsive AVIF/WebP files.
  The manifest, picture component, image-generation script and immutable hash-file caching are included.
- Carousel decode/preload/retry behaviour, current shape rendering, corresponding browser tests
  and the owning design/media documentation.
- The already-created local corrective commit `e83e1f9` plus the reviewed combined release commit.

The original video is unchanged. Existing production environment flags, lead providers, database,
Google tags and Ads settings are outside this release. No new package dependency is required.

## Excluded local work

| Local group | Inventory | Reason |
| --- | --- | --- |
| `DesignPrototip/prototypes/` | 124 files; 121,674,842 bytes; 84,214 text lines | Editable product/services experiments and raw generation/review assets; no runtime dependency of the released page. |
| Two vendored Three.js files inside that directory | 80,305 of those text lines | `three.core.js`: 60,586 lines; `three.module.js`: 19,719. These copies explain the apparent 80k-line backlog. |
| Legacy `src/features/product/` and unused product-prototype studies | 8 files; 2,559 lines | Previous 3D/product implementations have no import path from the current page. |
| Two legacy unit-test files | 2 files | Cover those excluded previous implementations. |
| Package/lock changes adding `three` and `@types/three` | 55 added lines | Only the excluded 3D experiments need these dependencies. |
| Other untracked product public-media candidates | 15 files; 2,454,148 bytes | Unused renderings and a local README; active masters are already tracked. |
| `docs/warema/` | 9 PDF files; 138,521,053 bytes | Local supplier/reference research, unrelated to the application runtime. |
| Promo notes | 1 file | Separate video-authoring track; its export and publication are outside this task. |
| `DesignPrototip/README.md` change | 1 added line | Links to the separate services prototype. |

Files in the excluded groups remain on disk. They were neither deleted nor hidden with new ignore
rules. Unpublished work should be reviewed in its own context before any future inclusion.

## Validation

- All 71 responsive files exactly match manifest dimensions, byte counts and SHA-256 filename prefixes;
  combined disk size: 17,882,644 bytes. These are alternate sizes/formats, not one page-load payload.
- The clean staged export passes full lint, all 226 unit tests, TypeScript and the production
  build. All 72 production-build Chromium/WebKit scenarios pass across the product and media suites.
  Legacy source, prototype vendors and temporary artifacts are excluded from that exact export.
- Current technical contracts and measured image transfer evidence remain in
  [DESIGN.md](../../DESIGN.md) and the [media provenance record](../content/product-media-provenance.md).
