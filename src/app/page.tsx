import Image from "next/image";
import Button from "@/components/custom/Button";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechHowlerX - Tech Blog & Dev Tools",
  description:
    "TechHowlerX: A blog and a collection of dev tools. Explore tech and programming articles, plus practical tools to support your development process!",
  keywords: "tech, programming, blog, dev tools, utility tools",
};

export default async function IndexPage() {
  return (
    <main className="index">
      <section className="index__hero">
        <h1 className="index__hero-title">
          TechHowlerX -
          <span className="index__hero-title--split">
            Tech Blog &amp; Dev Tools
          </span>
        </h1>
        <div className="index__hero-banner">
          <div className="index__hero-banner-img-container">
            <Image
              src="/home-hero-image.png"
              fill
              alt=""
              className="index__hero-banner-img"
            />
          </div>
          <div className="index__hero-content-container">
            <div className="index__hero-content">
              <h2 className="index__hero-content-title">
                Weekly Tech and Programming Insights
              </h2>
              <p className="index__hero-content-text">
                Discover fresh content each week, covering topics from software
                and hardware to everything in between.
              </p>
              <div className="index__hero-content-buttons">
                <Button link="/blog" ariaLabel="Explore Blog">
                  Explore blog
                </Button>
              </div>
            </div>
            <div className="index__hero-content">
              <h2 className="index__hero-content-title index__hero-content-title--bottom">
                Free and Interactive Developer Tools
              </h2>
              <p className="index__hero-content-text">
                Explore a range of tools for design & accessibility, CSS
                styling, development utilities, and text content optimization.
              </p>
              <div className="index__hero-content-buttons">
                <Button link="/tools" ariaLabel="Explore tools">
                  Explore tools
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="index__contact">
        <h2 className="index__contact-title">You have a suggestion ?</h2>
        <p>Don&apos;t hesitate to contact me !</p>
        <div className="index__contact-socials">
          <Link
            href="mailto:jeremdev.contactpro@gmail.com"
            className="index__contact-icon"
          >
            <Mail height={25} width={25} />
            <span>Mail</span>
          </Link>
          <Link
            href="https://x.com/JeremDevX"
            className="index__contact-icon"
            target="_blank"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              height={25}
              width={25}
              style={{ fill: "hsl(var(--foreground))" }}
            >
              <title>X</title>
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
            </svg>
            <span>X(twitter)</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
