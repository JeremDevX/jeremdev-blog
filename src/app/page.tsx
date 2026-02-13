import Link from "next/link";
import { Metadata } from "next";
import { Mail } from "lucide-react";
import HeroSection from "@/components/custom/HeroSection";
import ContentCard from "@/components/custom/ContentCard";
import { getLatestArticles } from "@/lib/content";
import styles from "./HomePage.module.scss";

const TOOLS = [
  {
    name: "Contrast Checker",
    slug: "/tools/accessibility/contrast-checker",
    description:
      "Check the contrast ratio between two colors and verify WCAG compliance.",
    category: "Accessibility",
  },
  {
    name: "Border Radius Generator",
    slug: "/tools/css/border-radius",
    description:
      "Generate CSS border-radius values with a visual live preview.",
    category: "CSS",
  },
  {
    name: "Box Shadow Generator",
    slug: "/tools/css/box-shadow",
    description:
      "Generate CSS box-shadow values with controls for offset, blur, spread, and color.",
    category: "CSS",
  },
  {
    name: "Slug Generator",
    slug: "/tools/code/slug-generator",
    description: "Generate URL-friendly slugs from any text input.",
    category: "Development",
  },
  {
    name: "Word Counter",
    slug: "/tools/text/word-counter",
    description:
      "Count words and characters with platform-specific length recommendations.",
    category: "Content",
  },
];

export const metadata: Metadata = {
  title: "TechHowlerX - Tech Blog & Dev Tools",
  description:
    "TechHowlerX: A blog and a collection of dev tools. Explore tech and programming articles, plus practical tools to support your development process!",
  keywords: "tech, programming, blog, dev tools, utility tools",
  openGraph: {
    title: "TechHowlerX - Tech Blog & Dev Tools",
    description:
      "Explore tech and programming articles, plus practical developer tools to support your development process.",
    type: "website",
    siteName: "TechHowlerX",
  },
};

export default async function IndexPage() {
  const articles = await getLatestArticles(6);

  return (
    <main className={styles.page}>
      <HeroSection />

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>Latest Articles</h2>
        {articles.length > 0 ? (
          <div className={styles.articlesGrid}>
            {articles.map((article) => (
              <ContentCard
                key={article.slug}
                type="article"
                title={article.title}
                description={article.resume}
                href={`/blog/posts/${article.slug}`}
                date={article.date}
                category={article.category}
                coverImage={article.coverImage}
              />
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>
            No articles yet. Check back soon!
          </p>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>Developer Tools</h2>
        <div className={styles.toolsGrid}>
          {TOOLS.map((tool) => (
            <ContentCard
              key={tool.slug}
              type="tool"
              title={tool.name}
              description={tool.description}
              href={tool.slug}
              category={tool.category}
            />
          ))}
        </div>
      </section>

      <section className={styles.contact}>
        <h2 className={styles.contactTitle}>You have a suggestion?</h2>
        <p>Don&apos;t hesitate to contact me!</p>
        <div className={styles.contactSocials}>
          <Link
            href="mailto:jeremdev.contactpro@gmail.com"
            className={styles.contactIcon}
          >
            <Mail height={25} width={25} />
            <span>Mail</span>
          </Link>
          <Link
            href="https://x.com/JeremDevX"
            className={styles.contactIcon}
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
