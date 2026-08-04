import { SiteHeader } from "@/components/layout/site-header";
import {
  appEnvironment,
  isIndexable
} from "@/config/environment";
import { referenceGallery } from "@/content/references.de";
import { getReferenceGalleryVisibility } from "@/features/references/types";

export function GlobalSiteHeader() {
  const referenceVisibility = getReferenceGalleryVisibility(
    referenceGallery,
    appEnvironment,
    isIndexable,
    process.env.NODE_ENV === "production"
  );

  return <SiteHeader showReferences={referenceVisibility.render} />;
}
