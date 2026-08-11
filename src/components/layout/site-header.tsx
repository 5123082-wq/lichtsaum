"use client";

import { List, X } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { siteConfig } from "@/config/site";

type SiteHeaderProps = Readonly<{
  showReferences?: boolean;
}>;

export function SiteHeader({ showReferences = false }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navigation = showReferences
    ? [
        ...siteConfig.navigation.slice(0, 2),
        { href: "/referenzen", label: "Referenzen" },
        ...siteConfig.navigation.slice(2)
      ]
    : siteConfig.navigation;

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isMenuOpen && !dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add("mobile-menu-open");
    } else if (!isMenuOpen && dialog.open) {
      dialog.close();
      document.documentElement.classList.remove("mobile-menu-open");
    }

    return () => {
      document.documentElement.classList.remove("mobile-menu-open");
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const desktopViewport = window.matchMedia("(min-width: 48rem)");
    const closeOnDesktop = () => {
      if (desktopViewport.matches) {
        setIsMenuOpen(false);
      }
    };

    desktopViewport.addEventListener("change", closeOnDesktop);

    return () => {
      desktopViewport.removeEventListener("change", closeOnDesktop);
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleDialogClose = () => {
    setIsMenuOpen(false);
    document.documentElement.classList.remove("mobile-menu-open");
    menuButtonRef.current?.focus();
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand-link" href="/" aria-label="LICHTSAUM Startseite">
          <Image
            alt=""
            aria-hidden="true"
            className="brand-mark"
            height={320}
            src="/brand/lichtsaum-mark.svg"
            width={324}
          />
          <span>LICHTSAUM</span>
        </Link>

        <nav className="site-navigation" aria-label="Hauptnavigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          className="button button--primary site-header__cta"
          href="/#projekt-pruefen"
        >
          Projekt prüfen lassen
        </Link>

        <button
          aria-controls="mobile-main-menu"
          aria-expanded={isMenuOpen}
          aria-label="Menü öffnen"
          className="mobile-menu-trigger"
          onClick={() => setIsMenuOpen(true)}
          ref={menuButtonRef}
          type="button"
        >
          <List aria-hidden="true" size={28} weight="light" />
        </button>
      </div>

      <dialog
        aria-label="Hauptmenü"
        className="mobile-menu"
        id="mobile-main-menu"
        onCancel={closeMenu}
        onClose={handleDialogClose}
        onClick={closeMenu}
        ref={dialogRef}
      >
        <span aria-hidden="true" className="mobile-menu__brand">
          <Image
            alt=""
            className="brand-mark"
            height={320}
            src="/brand/lichtsaum-mark.svg"
            width={324}
          />
          <span>LICHTSAUM</span>
        </span>

        <div
          autoFocus
          className="mobile-menu__panel"
          onClick={(event) => event.stopPropagation()}
          tabIndex={-1}
        >
          <div className="mobile-menu__header">
            <button
              aria-label="Menü schließen"
              className="mobile-menu__close"
              onClick={closeMenu}
              type="button"
            >
              <X aria-hidden="true" size={32} weight="light" />
            </button>
          </div>

          <nav className="mobile-menu__navigation" aria-label="Mobiles Hauptmenü">
            {navigation.map((item, index) => (
              <Link
                aria-label={item.label}
                href={item.href}
                key={item.href}
                onClick={closeMenu}
              >
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            className="mobile-menu__cta"
            href="/#projekt-pruefen"
            onClick={closeMenu}
          >
            Projekt prüfen lassen
          </Link>
        </div>
      </dialog>
    </header>
  );
}
