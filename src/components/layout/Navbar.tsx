"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { PublicSiteSettings } from "@/lib/site-settings";

const navigation = [
  { label: "Home", href: "/", visible: true },
  { label: "About", href: "/about", visible: true },
  { label: "Our Companies", href: "/companies", visible: true },
  { label: "Projects", href: "/projects", visible: true },
  { label: "Impact", href: "/impact", visible: true },
  { label: "News", href: "/news", visible: true },
  { label: "Careers", href: "/careers", visible: true },
];

export default function Navbar({ settings }: { settings: PublicSiteSettings }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="nav-container">
        <Link
          href="/"
          className="brand-link"
          aria-label="BCU Group homepage"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src={settings.header.logo}
            alt="Beneficium Communis Universitas"
            width={64}
            height={64}
            priority
            className="brand-logo"
          />

          <div className="brand-copy">
            <span className="brand-name">{settings.header.siteLabel}</span>
            <span className="brand-description">
              {settings.siteDescription}
            </span>
          </div>
        </Link>

        <nav
          className={`desktop-navigation ${
            menuOpen ? "desktop-navigation--open" : ""
          }`}
          aria-label="Primary navigation"
        >
          {(settings.header.navigation.length ? settings.header.navigation : navigation).filter((item) => item.visible !== false && item.href !== "/team").map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <Link href="/team" className="nav-link" onClick={() => setMenuOpen(false)}>Our Team</Link>
          <Link
            href={settings.header.contactUrl}
            className="nav-contact-button"
            onClick={() => setMenuOpen(false)}
          >
            {settings.header.contactLabel}
          </Link>
        </nav>

        <button
          type="button"
          className={`mobile-menu-button ${
            menuOpen ? "mobile-menu-button--open" : ""
          }`}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
