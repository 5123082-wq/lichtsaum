import Link from "next/link";

import { FooterWordmark } from "@/components/layout/footer-wordmark";

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
        </nav>
      </div>
    </footer>
  );
}
