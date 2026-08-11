import { siteConfig } from "@/config/site";

export function buildSiteStructuredData(origin: string) {
  const websiteUrl = new URL("/", origin).toString();
  const organizationId = new URL("/#organization", origin).toString();
  const websiteId = new URL("/#website", origin).toString();
  const { legal } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: legal.providerName,
        alternateName: siteConfig.name,
        url: websiteUrl,
        email: legal.email,
        telephone: legal.phones.map(({ href }) => href.replace(/^tel:/, "")),
        address: {
          "@type": "PostalAddress",
          streetAddress: legal.street,
          postalCode: legal.postalCode,
          addressLocality: legal.city,
          addressCountry: "DE"
        }
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: websiteUrl,
        name: siteConfig.name,
        inLanguage: siteConfig.language,
        publisher: { "@id": organizationId }
      }
    ]
  } as const;
}
