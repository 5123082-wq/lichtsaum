import type { DeploymentEnvironment } from "@/config/environment";

export const REFERENCE_LAYOUT_SLOTS = [
  "left-tall",
  "center-top",
  "center-bottom",
  "right-tall"
] as const;

export type ReferenceLayoutSlot =
  (typeof REFERENCE_LAYOUT_SLOTS)[number];

export type ReferenceGalleryStatus =
  | "awaiting-assets"
  | "review"
  | "published";

export type ReferencePermission = "review-only" | "public-approved";
export type ReferenceAssetKind = "concept-visual" | "real-project";

export type FourReferenceProjects<T> = readonly [T, T, T, T];

export type ReferenceProject = Readonly<{
  id: string;
  slot: ReferenceLayoutSlot;
  context: string;
  title: string;
  caption: string;
  image: Readonly<{
    src: `/images/referenzen/${string}`;
    width: number;
    height: number;
    alt: string;
    focalPoint: Readonly<{
      x: number;
      y: number;
    }>;
  }>;
  assetKind: ReferenceAssetKind;
  permission: ReferencePermission;
}>;

export type PublishedReferenceProject = ReferenceProject &
  Readonly<{
    permission: "public-approved";
  }>;

export type ReferenceGalleryRegistry = Readonly<{
  status: "awaiting-assets";
  items: readonly [];
}> |
  Readonly<{
    status: "review";
    items: FourReferenceProjects<ReferenceProject>;
  }> |
  Readonly<{
    status: "published";
    items: FourReferenceProjects<PublishedReferenceProject>;
  }>;

export type ReferenceGalleryVisibility = Readonly<{
  render: boolean;
  indexable: boolean;
}>;

export type ReferenceRegistryValidation = Readonly<{
  valid: boolean;
  issues: readonly string[];
}>;

const referenceIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const referenceImagePathPattern =
  /^\/images\/referenzen\/[a-z0-9][a-z0-9/_-]*\.(?:avif|jpe?g|png|webp)$/i;

function hasText(value: string) {
  return value.trim().length > 0;
}

export function validateReferenceGalleryRegistry(
  registry: ReferenceGalleryRegistry
): ReferenceRegistryValidation {
  const issues: string[] = [];

  if (
    registry.status !== "awaiting-assets" &&
    registry.status !== "review" &&
    registry.status !== "published"
  ) {
    issues.push("The reference gallery status is invalid.");
  }

  if (registry.status === "awaiting-assets" && registry.items.length !== 0) {
    issues.push("An awaiting reference gallery must not contain assets.");
  }

  if (registry.status !== "awaiting-assets" && registry.items.length !== 4) {
    issues.push("A visible reference gallery requires exactly four projects.");
  }

  const ids = new Set<string>();
  const slots = new Set<ReferenceLayoutSlot>();

  for (const item of registry.items) {
    if (!referenceIdPattern.test(item.id)) {
      issues.push(`Reference id \"${item.id}\" is not a stable slug.`);
    }

    if (ids.has(item.id)) {
      issues.push(`Reference id \"${item.id}\" is duplicated.`);
    }
    ids.add(item.id);

    if (slots.has(item.slot)) {
      issues.push(`Reference slot \"${item.slot}\" is duplicated.`);
    }
    slots.add(item.slot);

    if (!REFERENCE_LAYOUT_SLOTS.includes(item.slot)) {
      issues.push(`Reference slot \"${item.slot}\" is invalid.`);
    }

    if (
      !hasText(item.context) ||
      !hasText(item.title) ||
      !hasText(item.caption) ||
      !hasText(item.image.alt)
    ) {
      issues.push(`Reference \"${item.id}\" has incomplete public copy.`);
    }

    if (!referenceImagePathPattern.test(item.image.src)) {
      issues.push(
        `Reference \"${item.id}\" must use the local references image path.`
      );
    }

    if (
      item.assetKind !== "concept-visual" &&
      item.assetKind !== "real-project"
    ) {
      issues.push(`Reference \"${item.id}\" has an invalid asset kind.`);
    }

    if (
      item.permission !== "review-only" &&
      item.permission !== "public-approved"
    ) {
      issues.push(`Reference \"${item.id}\" has an invalid permission status.`);
    }

    if (
      !Number.isInteger(item.image.width) ||
      item.image.width <= 0 ||
      !Number.isInteger(item.image.height) ||
      item.image.height <= 0
    ) {
      issues.push(`Reference \"${item.id}\" has invalid image dimensions.`);
    }

    if (
      !Number.isFinite(item.image.focalPoint.x) ||
      !Number.isFinite(item.image.focalPoint.y) ||
      item.image.focalPoint.x < 0 ||
      item.image.focalPoint.x > 100 ||
      item.image.focalPoint.y < 0 ||
      item.image.focalPoint.y > 100
    ) {
      issues.push(`Reference \"${item.id}\" has an invalid focal point.`);
    }
  }

  if (registry.status !== "awaiting-assets") {
    for (const slot of REFERENCE_LAYOUT_SLOTS) {
      if (!slots.has(slot)) {
        issues.push(`Reference slot \"${slot}\" is missing.`);
      }
    }
  }

  if (
    registry.status === "published" &&
    registry.items.some((item) => item.permission !== "public-approved")
  ) {
    issues.push(
      "Published references require public approval for every image."
    );
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

export function getReferenceGalleryVisibility(
  registry: ReferenceGalleryRegistry,
  environment: DeploymentEnvironment,
  siteIsIndexable = false
): ReferenceGalleryVisibility {
  const validation = validateReferenceGalleryRegistry(registry);

  if (!validation.valid || registry.status === "awaiting-assets") {
    return { render: false, indexable: false };
  }

  if (registry.status === "review") {
    return {
      render: environment !== "production",
      indexable: false
    };
  }

  return {
    render: true,
    indexable: siteIsIndexable
  };
}

export function orderReferenceProjects(
  items: readonly ReferenceProject[]
): readonly ReferenceProject[] {
  return REFERENCE_LAYOUT_SLOTS.map((slot) =>
    items.find((item) => item.slot === slot)
  ).filter((item): item is ReferenceProject => item !== undefined);
}

export function isReferenceGalleryPublished(
  registry: ReferenceGalleryRegistry
) {
  return (
    registry.status === "published" &&
    validateReferenceGalleryRegistry(registry).valid
  );
}
