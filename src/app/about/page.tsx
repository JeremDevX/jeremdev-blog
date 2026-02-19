import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About TechHowlerX",
  description:
    "Meet Jerem, learn the mission behind TechHowlerX, and discover the human voice and wolf-brand story that shapes this platform.",
};

export default function About() {
  return (
    <main id="main-content" tabIndex={-1} className="about">
      <header className="about__hero">
        <p className="about__eyebrow">About</p>
        <h1 className="about__main-title">About TechHowlerX</h1>
        <p className="about__lead">
          TechHowlerX is my practical corner of the web: a place where I share
          useful tutorials, honest lessons, and small developer tools that help
          you move faster.
        </p>
      </header>

      <section className="about__section">
        <h2 className="about__secondary-title">Who I am</h2>
        <p className="about__paragraph">
          I am Jerem (Jérémie L.), a front-end developer based in Switzerland. I
          built this platform to document my learning path, share what works in
          real projects, and make technical topics easier to approach.
        </p>
      </section>

      <div className="about__grid">
        <section className="about__card">
          <h2 className="about__secondary-title">Mission and vision</h2>
          <p className="about__paragraph">
            The mission is simple: publish practical, reusable content you can
            apply quickly. The long-term vision is to grow TechHowlerX into a
            trusted resource where developers come to learn, test ideas, and
            leave with something useful.
          </p>
        </section>

        <section className="about__card">
          <h2 className="about__secondary-title">Why a human voice matters</h2>
          <p className="about__paragraph">
            I keep the tone warm and direct on purpose. Tech can feel dense and
            distant, so I prefer clear explanations, practical examples, and
            transparent trade-offs over jargon-heavy writing.
          </p>
        </section>
      </div>

      <section className="about__section">
        <h2 className="about__secondary-title">The wolf behind the brand</h2>
        <p className="about__paragraph">
          The wolf symbolizes focus, curiosity, and consistency. It reflects how
          I approach development: observe carefully, iterate patiently, and keep
          shipping meaningful improvements.
        </p>
      </section>
    </main>
  );
}
