import { Mail } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Link as LucideLink, Linkedin } from "lucide-react";

export const metadata: Metadata = {
  title: "TechHowlerX - About",
  description:
    "Discover the purpose of this website and learn more about the creator behind TechHowlerX.",
};

export default function About() {
  return (
    <main id="main-content" tabIndex={-1} className="about">
      <header className="about__hero">
        <p className="about__eyebrow">About TechHowlerX</p>
        <h1 className="about__main-title">
          A practical space for developers and curious tech learners
        </h1>
        <p className="about__lead">
          This project is built to share useful resources, tutorials, and tools
          in a way that stays clear, actionable, and easy to use.
        </p>
      </header>

      <section className="about__section">
        <h2 className="about__secondary-title">Why this website exists</h2>
        <p className="about__paragraph">
          I created this website to share my passion for technology and
          programming. As a developer, I strongly believe in knowledge sharing.
          This platform is designed to offer valuable resources, tutorials,
          insights, and tools that can benefit fellow developers as well as
          anyone interested in technology.
        </p>
      </section>

      <div className="about__grid">
        <section className="about__card">
          <h2 className="about__secondary-title">Who I am</h2>
          <p className="about__paragraph">
            I am Jérémie L. (also known as JeremDevX), a passionate junior
            front-end developer based in Switzerland. I built this website not
            only to help other developers, but also to improve my own skills
            along the way.
          </p>
        </section>

        <section className="about__card">
          <h2 className="about__secondary-title">What you can expect</h2>
          <ul className="about__list">
            <li>Practical content focused on development and technology.</li>
            <li>Clear tutorials and insights with real-world usefulness.</li>
            <li>Small dev tools designed to save time in daily workflows.</li>
          </ul>
        </section>
      </div>

      <section className="about__section">
        <h2 className="about__secondary-title">Encountered an issue?</h2>
        <p className="about__paragraph">
          If you notice a bug, outdated information, or even a typo, I would
          love to hear from you. Feedback helps me improve the quality of the
          content and tools for everyone.
        </p>
      </section>

      <section className="about__section">
        <h2 className="about__secondary-title">Get in touch</h2>
        <p className="about__paragraph about__paragraph--compact">
          You can reach me through your preferred channel below.
        </p>
        <div className="about__socials">
          <Link
            href="https://jeremdevx.com"
            className="about__socials-icon"
            rel="noopener noreferrer"
            target="_blank"
          >
            <LucideLink height={25} width={25} />
            <span>Portfolio</span>
          </Link>
          <Link
            href="https://github.com/JeremDevX"
            className="about__socials-icon"
            rel="noopener noreferrer"
            target="_blank"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              height={25}
              width={25}
              className="about__social-svg"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </Link>
          <Link
            href="mailto:jeremdev.contactpro@gmail.com"
            className="about__socials-icon"
          >
            <Mail height={25} width={25} />
            <span>Email</span>
          </Link>
          <Link
            href="https://x.com/JeremDevX"
            className="about__socials-icon"
            rel="noopener noreferrer"
            target="_blank"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              height={25}
              width={25}
              className="about__social-svg"
            >
              <title>X</title>
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
            </svg>
            <span>X (Twitter)</span>
          </Link>
          <Link
            href="https://www.linkedin.com/in/jeremie-lavergnat/"
            className="about__socials-icon"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Linkedin height={25} width={25} />
            <span>LinkedIn</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
