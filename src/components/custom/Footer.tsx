"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isToolPage = pathname.startsWith("/tools/");
  const isArticlePage = pathname.startsWith("/blog/posts/");
  const shouldHideFooter = isToolPage || isArticlePage;
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer ${shouldHideFooter ? "footer--hidden" : ""}`}>
      <div className="footer__container">
        <div className="footer__brand">
          <Link href="/" className="footer__logo" aria-label="Go to home page">
            <Image
              src="/wolf-only.svg"
              height={52}
              width={52}
              alt="TechHowlerX logo"
            />
            <div className="footer__logo-copy">
              <span className="footer__logo-text">TechHowlerX</span>
              <span className="footer__tagline">Tech Blog & Dev Tools</span>
            </div>
          </Link>
          <p className="footer__description">
            Practical articles, tutorials, and tools to help developers ship
            better every day.
          </p>
        </div>

        <nav className="footer__column" aria-label="Footer navigation">
          <span className="footer__column-title">Explore</span>
          <div className="footer__links">
            <Link href="/" className="footer__link">
              Home
            </Link>
            <Link href="/blog" className="footer__link">
              Blog
            </Link>
            <Link href="/tools" className="footer__link">
              Tools
            </Link>
            <Link href="/about" className="footer__link">
              About
            </Link>
            <Link href="/termsofuse" className="footer__link">
              Terms of Use
            </Link>
          </div>
        </nav>

        <div className="footer__column">
          <span className="footer__column-title">Connect & Support</span>
          <div className="footer__links">
            <Link
              href="https://github.com/JeremDevX"
              className="footer__link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit GitHub profile (opens in new tab)"
            >
              GitHub
            </Link>
            <Link
              href="https://www.linkedin.com/in/jeremie-lavergnat/"
              className="footer__link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit LinkedIn profile (opens in new tab)"
            >
              LinkedIn
            </Link>
            <Link
              href="https://x.com/JeremDevX"
              className="footer__link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit X (Twitter) profile (opens in new tab)"
            >
              X (Twitter)
            </Link>
            <Link
              href="https://www.buymeacoffee.com/jeremdevx"
              className="footer__link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Buy Me a Coffee page (opens in new tab)"
            >
              Buy Me a Coffee
            </Link>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© {currentYear} TechHowlerX</span>
        <span>Content sharing allowed with attribution (CC BY 4.0).</span>
      </div>
    </footer>
  );
}
