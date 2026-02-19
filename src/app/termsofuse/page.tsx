import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TechHowlerX Terms of Use",
  description:
    "Read the plain-language terms for TechHowlerX, including CC BY 4.0 licensing, affiliate disclosure, privacy scope, and GDPR context.",
};

export default function TermsOfUse() {
  return (
    <main id="main-content" tabIndex={-1} className="tou">
      <header className="tou__hero">
        <h1 className="tou__main-title">Terms of Use</h1>
        <p className="tou__intro">
          These terms explain, in plain language, how content on TechHowlerX
          can be used and what privacy posture applies to this MVP.
        </p>
      </header>

      <ol className="tou__sections">
        <li className="tou__section">
          <h2 className="tou__secondary-title">1. Ownership and license</h2>
          <p className="tou__text">
            Unless stated otherwise, the content on TechHowlerX is created by
            Jérémie L. and shared under{" "}
            <Link
              href="https://creativecommons.org/licenses/by/4.0/"
              className="tou__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Creative Commons Attribution 4.0 (CC BY 4.0)
            </Link>
            . You can reuse and adapt content, including commercially, as long
            as you give clear attribution and reference the original source.
          </p>
        </li>

        <li className="tou__section">
          <h2 className="tou__secondary-title">2. Affiliate disclosure</h2>
          <p className="tou__text">
            Some links may be affiliate links in the future. If that happens,
            it means TechHowlerX may receive a small commission at no extra cost
            to you. Recommendations are still selected for practical relevance,
            not for volume of commission.
          </p>
        </li>

        <li className="tou__section">
          <h2 className="tou__secondary-title">3. Privacy and analytics</h2>
          <p className="tou__text">
            This MVP uses Vercel Analytics only for aggregate traffic insights.
            The intended setup is privacy-first: no cookies and no personal data
            collection through site analytics.
          </p>
        </li>

        <li className="tou__section">
          <h2 className="tou__secondary-title">4. GDPR and jurisdiction</h2>
          <p className="tou__text">
            TechHowlerX is operated from Europe and follows GDPR principles. For
            legal interpretation or disputes, the applicable framework is France
            and the European Union.
          </p>
        </li>

        <li className="tou__section">
          <h2 className="tou__secondary-title">5. Acceptable use</h2>
          <p className="tou__text">
            Please do not use this website or its content for unlawful,
            misleading, or harmful activities. Do not remove attribution when
            reusing licensed content.
          </p>
        </li>

        <li className="tou__section">
          <h2 className="tou__secondary-title">6. Updates</h2>
          <p className="tou__text">
            These terms can evolve as the project grows. Updates become active
            when published on this page.
          </p>
        </li>
      </ol>
    </main>
  );
}
