import Link from "next/link";
import { Metadata } from "next";
import { Mail } from "lucide-react";
import HeroSection from "@/components/custom/HeroSection";
import ContentCard from "@/components/custom/ContentCard";
import { getLatestArticles } from "@/lib/content";
import { getAllTools } from "@/lib/tools";
import { getTaxonomyDisplayLabel } from "@/lib/taxonomy";
import styles from "./HomePage.module.scss";

export const metadata: Metadata = {
  title: "Tech Blog & Dev Tools",
  description:
    "TechHowlerX: A blog and a collection of dev tools. Explore tech and programming articles, plus practical tools to support your development process!",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tech Blog & Dev Tools",
    description:
      "Explore tech and programming articles, plus practical developer tools to support your development process.",
    type: "website",
    url: "/",
  },
};

export default async function IndexPage() {
  const articles = await getLatestArticles(6);
  const tools = getAllTools();

  return (
    <main id="main-content" tabIndex={-1} className={styles.page}>
      <HeroSection />

      <section className={styles.section} aria-labelledby="latest-articles">
        <h2 id="latest-articles" className={styles.sectionHeading}>Latest Articles</h2>
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
                category={getTaxonomyDisplayLabel(article.category)}
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

      <section className={styles.section} aria-labelledby="developer-tools">
        <h2 id="developer-tools" className={styles.sectionHeading}>Developer Tools</h2>
        <div className={styles.toolsGrid}>
          {tools.map((tool) => (
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

      <section className={styles.contact} aria-labelledby="contact">
        <h2 id="contact" className={styles.contactTitle}>You have a suggestion?</h2>
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
            rel="noopener noreferrer"
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
