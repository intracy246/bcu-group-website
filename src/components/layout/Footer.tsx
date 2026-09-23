import Image from "next/image";
import Link from "next/link";
import type { PublicSiteSettings } from "@/lib/site-settings";

const companyLinks = [
  {
    label: "Ready Food Company",
    href: "/companies/rfc",
  },
  {
    label: "SmartCycle Technologies",
    href: "https://smartcycle360.com",
  },
];

const corporateLinks = [
  { label: "About BCU", href: "/about" },
  { label: "Our Companies", href: "/companies" },
  { label: "Projects", href: "/projects" },
  { label: "Impact", href: "/impact" },
  { label: "Careers", href: "/careers" },
];

export default function Footer({ settings }: { settings: PublicSiteSettings }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-glow" />

      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link href="/" className="footer-logo-link">
              <Image
                src={settings.organisationLogo}
                alt="BCU Group"
                width={96}
                height={96}
                className="footer-logo"
              />
            </Link>

            <p className="footer-brand-title">{settings.siteName.toUpperCase()}</p>

            <p className="footer-description">
              {settings.footer.description}
            </p>
          </div>

          <div className="footer-column">
            <h3>Our Companies</h3>

            <div className="footer-links">
              {companyLinks.map((link) =>
                link.href.startsWith("http") ? (
                  <a key={link.href} href={link.href}>
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>

          <div className="footer-column">
            <h3>Corporate</h3>

            <div className="footer-links">
              {corporateLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-column">
            <h3>Connect</h3>

            <div className="footer-links">
              <Link href="/contact">Contact Us</Link>
              {settings.mainEmail ? <a href={`mailto:${settings.mainEmail}`}>{settings.mainEmail}</a> : null}
              <span>{settings.officeAddress}</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {currentYear} {settings.footer.copyright}
          </p>

          <div className="footer-legal-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
