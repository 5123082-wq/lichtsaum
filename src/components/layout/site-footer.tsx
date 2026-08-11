import Link from "next/link";

import { FooterWordmark } from "@/components/layout/footer-wordmark";
import { consentUiEnabled } from "@/config/environment";
import { ConsentSettingsButton } from "@/features/consent/consent-settings-button";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__wordmark-strip">
        <FooterWordmark />
      </div>

      <div className="container site-footer__content">
        <nav className="site-footer__legal" aria-label="Rechtliche Informationen">
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
          {consentUiEnabled ? <ConsentSettingsButton /> : null}
        </nav>
      </div>
    </footer>
  );
}
