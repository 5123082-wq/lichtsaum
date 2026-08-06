import { describe, expect, it } from "vitest";

import {
  getReferenceGalleryVisibility,
  orderReferenceProjects,
  type FourReferenceProjects,
  type ReferenceGalleryRegistry,
  type ReferenceLayoutSlot,
  type ReferenceProject,
  validateReferenceGalleryRegistry
} from "@/features/references/types";

const slots = [
  "left-tall",
  "center-top",
  "center-bottom",
  "right-tall"
] as const satisfies readonly ReferenceLayoutSlot[];

function makeProject(
  slot: ReferenceLayoutSlot,
  index: number,
  permission: ReferenceProject["permission"] = "public-approved",
  assetKind: ReferenceProject["assetKind"] = "real-project"
): ReferenceProject {
  return {
    id: `projekt-${index}`,
    slot,
    context: `Kontext ${index}`,
    title: `Projekt ${index}`,
    caption: `Bestätigter Projektumfang ${index}.`,
    image: {
      src: `/images/referenzen/projekt-${index}.webp`,
      width: 1600,
      height: 1200,
      alt: `Reales Projektfoto ${index}.`,
      focalPoint: { x: 50, y: 50 }
    },
    assetKind,
    permission
  };
}

const approvedProjects = slots.map((slot, index) =>
  makeProject(slot, index + 1)
) as unknown as FourReferenceProjects<
  ReferenceProject & Readonly<{ permission: "public-approved" }>
>;

const reviewRegistry = {
  status: "review",
  items: slots.map((slot, index) =>
    makeProject(slot, index + 1, "review-only")
  )
} as unknown as ReferenceGalleryRegistry;

const conceptReviewRegistry = {
  status: "review",
  items: slots.map((slot, index) =>
    makeProject(slot, index + 1, "review-only", "concept-visual")
  )
} as unknown as ReferenceGalleryRegistry;

const publishedRegistry = {
  status: "published",
  items: approvedProjects
} as unknown as ReferenceGalleryRegistry;

describe("reference gallery registry", () => {
  it("keeps the current awaiting-assets state hidden and non-indexable", () => {
    const registry: ReferenceGalleryRegistry = {
      status: "awaiting-assets",
      items: []
    };

    expect(validateReferenceGalleryRegistry(registry)).toEqual({
      valid: true,
      issues: []
    });
    expect(
      getReferenceGalleryVisibility(registry, "development", false)
    ).toEqual({ render: false, indexable: false });
  });

  it("shows review data only in development or preview environments", () => {
    expect(
      getReferenceGalleryVisibility(reviewRegistry, "development", false)
    ).toEqual({ render: true, indexable: false });
    expect(
      getReferenceGalleryVisibility(reviewRegistry, "preview", false)
    ).toEqual({ render: true, indexable: false });
    expect(
      getReferenceGalleryVisibility(reviewRegistry, "production", true)
    ).toEqual({ render: false, indexable: false });
    expect(validateReferenceGalleryRegistry(conceptReviewRegistry).valid).toBe(
      true
    );
    expect(
      getReferenceGalleryVisibility(
        conceptReviewRegistry,
        "development",
        false
      )
    ).toEqual({ render: true, indexable: false });
  });

  it("publishes only a valid, fully approved four-slot registry", () => {
    expect(validateReferenceGalleryRegistry(publishedRegistry).valid).toBe(true);
    expect(
      getReferenceGalleryVisibility(publishedRegistry, "production", true)
    ).toEqual({ render: true, indexable: true });

    const unapproved = {
      status: "published",
      items: slots.map((slot, index) =>
        makeProject(
          slot,
          index + 1,
          index === 0 ? "review-only" : "public-approved"
        )
      )
    } as unknown as ReferenceGalleryRegistry;

    expect(validateReferenceGalleryRegistry(unapproved)).toMatchObject({
      valid: false
    });
    expect(
      getReferenceGalleryVisibility(unapproved, "production", true)
    ).toEqual({ render: false, indexable: false });

    const publishedConcepts = {
      status: "published",
      items: slots.map((slot, index) =>
        makeProject(slot, index + 1, "public-approved", "concept-visual")
      )
    } as unknown as ReferenceGalleryRegistry;

    expect(validateReferenceGalleryRegistry(publishedConcepts).valid).toBe(true);
    expect(
      getReferenceGalleryVisibility(
        publishedConcepts,
        "production",
        true
      )
    ).toEqual({ render: true, indexable: true });
  });

  it("rejects incomplete or duplicated layouts and orders valid items by slot", () => {
    const incomplete = {
      status: "review",
      items: [
        makeProject("right-tall", 4),
        makeProject("center-top", 2),
        makeProject("center-bottom", 3)
      ]
    } as unknown as ReferenceGalleryRegistry;
    const duplicated = {
      status: "review",
      items: [
        makeProject("left-tall", 1),
        makeProject("center-top", 2),
        makeProject("center-top", 3),
        makeProject("right-tall", 4)
      ]
    } as unknown as ReferenceGalleryRegistry;

    expect(validateReferenceGalleryRegistry(incomplete).valid).toBe(false);
    expect(validateReferenceGalleryRegistry(duplicated).valid).toBe(false);

    const shuffled = [
      makeProject("right-tall", 4),
      makeProject("center-bottom", 3),
      makeProject("left-tall", 1),
      makeProject("center-top", 2)
    ];

    expect(orderReferenceProjects(shuffled).map((item) => item.slot)).toEqual(
      slots
    );
  });

  it("fails closed for malformed runtime status and image data", () => {
    const unknownStatus = {
      status: "ready",
      items: approvedProjects
    } as unknown as ReferenceGalleryRegistry;
    const unsafeImage = {
      status: "review",
      items: slots.map((slot, index) => {
        const project = makeProject(slot, index + 1, "review-only");

        return index === 0
          ? {
              ...project,
              image: {
                ...project.image,
                src: "/images/referenzen/../projekt-1.webp",
                focalPoint: { x: Number.NaN, y: 50 }
              }
            }
          : project;
      })
    } as unknown as ReferenceGalleryRegistry;

    expect(validateReferenceGalleryRegistry(unknownStatus).valid).toBe(false);
    expect(
      getReferenceGalleryVisibility(unknownStatus, "production", true)
    ).toEqual({ render: false, indexable: false });
    expect(validateReferenceGalleryRegistry(unsafeImage).valid).toBe(false);
    expect(
      getReferenceGalleryVisibility(unsafeImage, "preview", false)
    ).toEqual({ render: false, indexable: false });
  });
});
