import type { Metadata } from "next";

import { GlobalSiteHeader } from "@/components/layout/global-site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ConfiguratorIntroScene } from "@/components/sections/configurator-intro-scene";
import {
  displaysLeadAttachmentPicker,
  isIndexable,
  isPreviewDeployment,
  siteUrl
} from "@/config/environment";
import { siteConfig } from "@/config/site";
import {
  configuratorPageContent,
  hasTechnicalSectionContent
} from "@/content/configurator.de";
import { ConfiguratorWizard } from "@/features/configurator/configurator-wizard";
import { DEFAULT_CONFIGURATOR_CONFIGURATION } from "@/features/configurator/options";
import { calculateConfiguratorAuthoritatively } from "@/features/configurator/server-calculation";

const technicalSections = configuratorPageContent.technicalSections.filter(
  hasTechnicalSectionContent
);
const socialPreviewImage = {
  url: "/brand/lichtsaum-og-1200x630.png",
  width: 1200,
  height: 630,
  alt: "LICHTSAUM — Markise wird Markenlicht."
} as const;

export function generateMetadata(): Metadata {
  const title = `${configuratorPageContent.metadataTitle} | ${siteConfig.name}`;
  const description = configuratorPageContent.description;

  return {
    title,
    description,
    ...(isIndexable && siteUrl
      ? {
          alternates: { canonical: "/konfigurator" },
          openGraph: {
            type: "website" as const,
            locale: siteConfig.locale,
            siteName: siteConfig.name,
            title,
            description,
            url: "/konfigurator",
            images: [socialPreviewImage]
          },
          twitter: {
            card: "summary_large_image" as const,
            title,
            description,
            images: [
              {
                url: socialPreviewImage.url,
                alt: socialPreviewImage.alt
              }
            ]
          }
        }
      : isPreviewDeployment
        ? { robots: { index: false, follow: false, nocache: true } }
        : {})
  };
}

export default async function ConfiguratorPage() {
  const initialResult = await calculateConfiguratorAuthoritatively(
    DEFAULT_CONFIGURATOR_CONFIGURATION
  );

  return (
    <>
      <a className="skip-link" href="#main-content">
        Zum Inhalt springen
      </a>
      <GlobalSiteHeader />
      <main className="configurator-page" id="main-content">
        <ConfiguratorIntroScene
          eyebrow={configuratorPageContent.eyebrow}
          title={configuratorPageContent.title}
        />

        <ConfiguratorWizard
          attachmentsEnabled={displaysLeadAttachmentPicker}
          initialConfiguration={DEFAULT_CONFIGURATOR_CONFIGURATION}
          initialResult={initialResult}
        />

        {technicalSections.length > 0 ? (
          <div className="configurator-page__technical container">
            {technicalSections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                <div className="configurator-page__technical-body">
                  {section.intro ? <p>{section.intro}</p> : null}
                  {section.specRows?.length ? (
                    <dl>
                      {section.specRows.map((row) => (
                        <div key={`${row.label}-${row.value}`}>
                          <dt>{row.label}</dt>
                          <dd>{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  {section.notes?.length ? (
                    <ul>
                      {section.notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  ) : null}
                  {section.links?.length ? (
                    <div className="configurator-page__technical-links">
                      {section.links.map((link) => (
                        <a href={link.href} key={link.href}>
                          {link.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </section>
            ))}
          </div>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
