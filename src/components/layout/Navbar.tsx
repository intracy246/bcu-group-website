"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Our Companies", href: "/companies" },
  { label: "Projects", href: "/projects" },
  { label: "Impact", href: "/impact" },
  { label: "News", href: "/news" },
  { label: "Careers", href: "/careers" },
];

export default function Navbar() {
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
            src="/brands/bcu-logo.png"
            alt="Beneficium Communis Universitas"
            width={64}
            height={64}
            priority
            className="brand-logo"
          />

          <div className="brand-copy">
            <span className="brand-name">BCU GROUP</span>
            <span className="brand-description">
              Building communities. Creating opportunity.
            </span>
          </div>
        </Link>

        <nav
          className={`desktop-navigation ${
            menuOpen ? "desktop-navigation--open" : ""
          }`}
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/contact"
            className="nav-contact-button"
            onClick={() => setMenuOpen(false)}
          >
            Contact Us
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