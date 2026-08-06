import { SiteHeader } from "@/components/layout/site-header";
import {
  deploymentEnvironment,
  isIndexable
} from "@/config/environment";
import { referenceGallery } from "@/content/references.de";
import { getReferenceGalleryVisibility } from "@/features/references/types";

export function GlobalSiteHeader() {
  const referenceVisibility = getReferenceGalleryVisibility(
    referenceGallery,
    deploymentEnvironment,
    isIndexable
  );

  return <SiteHeader showReferences={referenceVisibility.render} />;
}
