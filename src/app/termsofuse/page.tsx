import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TechHowlerX - Terms of Use",
  description: "Terms of use of TechHowlerX's website.",
};

export default function TermsOfUse() {
  return (
    <main className="tou">
      <header className="tou__hero">
        <h1 className="tou__main-title">Terms of Use</h1>
        <p className="tou__intro">
          Please read these terms before using the website and its content.
        </p>
      </header>

      <ol className="tou__sections">
        <li className="tou__section">
          <h2 className="tou__secondary-title">1. Introduction</h2>
          <p className="tou__text">
            Welcome to TechHowlerX. By accessing or using this website, you
            agree to comply with and be bound by the following terms and
            conditions. If you do not agree with these terms, please do not use
            the website.
          </p>
        </li>

        <li className="tou__section">
          <h2 className="tou__secondary-title">
            2. Intellectual Property and License
          </h2>
          <p className="tou__text">
            All content available on this website, including text, images,
            tutorials, code, and other resources, is owned by{" "}
            <span className="highlight">TechHowlerX</span> unless otherwise
            stated.
          </p>
          <p className="tou__label">You are free to:</p>
          <ul className="tou__list">
            <li>
              <span className="semi-bold">Share:</span> copy and redistribute
              the content in any medium or format.
            </li>
            <li>
              <span className="semi-bold">Adapt:</span> remix, transform, and
              build upon the content for any purpose, including commercial use.
            </li>
          </ul>
          <p className="tou__label">Under the following condition:</p>
          <ul className="tou__list">
            <li>
              <span className="semi-bold">Attribution:</span> you must give
              appropriate credit, provide a link to the original content on this
              website, and indicate whether changes were made.
            </li>
          </ul>
          <p className="tou__text">
            License details are available on{" "}
            <Link
              href="https://creativecommons.org/licenses/by/4.0/"
              className="tou__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Creative Commons Attribution 4.0 International (CC BY 4.0)
            </Link>
            .
          </p>
        </li>

        <li className="tou__section">
          <h2 className="tou__secondary-title">3. Restrictions</h2>
          <p className="tou__text">You are not allowed to:</p>
          <ul className="tou__list">
            <li>Use the content in any unlawful or harmful way.</li>
            <li>
              Misrepresent the original creator or claim the content as your own
              without proper attribution.
            </li>
            <li>
              Use the content to promote illegal activities or spread false
              information.
            </li>
          </ul>
        </li>

        <li className="tou__section">
          <h2 className="tou__secondary-title">4. Limitation of Liability</h2>
          <p className="tou__text">
            <span className="highlight">TechHowlerX</span> will not be held
            liable for any damages arising from the use or misuse of content
            provided on this website. All content is provided &quot;as
            is&quot;, without guarantees or warranties.
          </p>
        </li>

        <li className="tou__section">
          <h2 className="tou__secondary-title">5. External Links</h2>
          <p className="tou__text">
            This website may contain links to third-party sites. These external
            sites are not under our control, and we are not responsible for
            their content or privacy practices.
          </p>
        </li>

        <li className="tou__section">
          <h2 className="tou__secondary-title">6. Modifications to the Terms</h2>
          <p className="tou__text">
            These terms may be updated at any time. Changes are effective
            immediately after publication on this page. Continued use of the
            website after updates means that you accept the revised terms.
          </p>
        </li>

        <li className="tou__section">
          <h2 className="tou__secondary-title">7. Contact</h2>
          <p className="tou__text">
            If you have questions about these terms or wish to report an issue,
            contact me at{" "}
            <Link
              href="mailto:jeremdev.contactpro@gmail.com"
              className="tou__link"
            >
              jeremdev.contactpro@gmail.com
            </Link>{" "}
            or via{" "}
            <Link
              href="https://x.com/JeremDevX"
              className="tou__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              X (Twitter)
            </Link>
            .
          </p>
        </li>
      </ol>
    </main>
  );
}
