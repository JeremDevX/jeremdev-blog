import { Metadata } from "next";
import ContentCard from "@/components/custom/ContentCard";
import { getAllArticles, getLatestArticles } from "@/lib/content";
import { getTaxonomyDisplayLabel } from "@/lib/taxonomy";
import styles from "./BlogPage.module.scss";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Discover the latest articles and technical deep dives from TechHowlerX.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog",
    description:
      "Discover the latest articles and technical deep dives from TechHowlerX.",
    type: "website",
    url: "/blog",
  },
  keywords: "tech, programming, blog",
};

export default async function BlogPage() {
  const [latestArticles, allArticles] = await Promise.all([
    getLatestArticles(3),
    getAllArticles(),
  ]);
  const latestSlugs = new Set(latestArticles.map((article) => article.slug));
  const remainingArticles = allArticles.filter(
    (article) => !latestSlugs.has(article.slug),
  );

  return (
    <main id="main-content" tabIndex={-1} className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>
          Latest posts and technical deep dives from TechHowlerX.
        </p>
      </header>

      {allArticles.length === 0 ? (
        <p className={styles.emptyState}>
          No published articles yet. New content is coming soon.
        </p>
      ) : (
        <>
          <section className={styles.section} aria-labelledby="latest-posts">
            <h2 id="latest-posts" className={styles.sectionTitle}>
              Latest Posts
            </h2>
            <div className={styles.latestGrid}>
              {latestArticles.map((article) => (
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
          </section>

          {remainingArticles.length > 0 && (
            <section className={styles.section} aria-labelledby="all-posts">
              <h2 id="all-posts" className={styles.sectionTitle}>
                All Articles
              </h2>
              <div className={styles.grid}>
                {remainingArticles.map((article) => (
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
            </section>
          )}
        </>
      )}
    </main>
  );
}
