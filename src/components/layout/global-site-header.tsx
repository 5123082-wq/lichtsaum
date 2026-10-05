import { SiteHeader } from "@/components/layout/site-header";
import {
  deploymentEnvironment,
  isIndexable
} from "@/config/environment";
import { referenceGallery } from "@/content/references.de";
import { getReferenceGalleryVisibility } from "@/features/references/types";

export function GlobalSiteHeader({ overlayHero = false }: { overlayHero?: boolean }) {
  const referenceVisibility = getReferenceGalleryVisibility(
    referenceGallery,
    deploymentEnvironment,
    isIndexable
  );

  return (
    <SiteHeader
      overlayHero={overlayHero}
      showReferences={referenceVisibility.render}
    />
  );
}
