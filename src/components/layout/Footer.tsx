import Image from "next/image";
import Link from "next/link";

const companyLinks = [
  {
    label: "Ready Food Company",
    href: "/companies/rfc",
  },
  {
    label: "SmartCycle Technologies",
    href: "/companies/smartcycle",
  },
];

const corporateLinks = [
  { label: "About BCU", href: "/about" },
  { label: "Our Companies", href: "/companies" },
  { label: "Projects", href: "/projects" },
  { label: "Impact", href: "/impact" },
  { label: "Careers", href: "/careers" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-glow" />

      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link href="/" className="footer-logo-link">
              <Image
                src="/brands/bcu-logo.png"
                alt="BCU Group"
                width={96}
                height={96}
                className="footer-logo"
              />
            </Link>

            <p className="footer-brand-title">BCU GROUP</p>

            <p className="footer-description">
              A diversified African corporate group investing in technology,
              food systems, innovation and sustainable community development.
            </p>
          </div>

          <div className="footer-column">
            <h3>Our Companies</h3>

            <div className="footer-links">
              {companyLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
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
              <a href="mailto:info@bcu.co.tz">info@bcu.co.tz</a>
              <span>Dar es Salaam, Tanzania</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {currentYear} Beneficium Communis Universitas Limited. All rights
            reserved.
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